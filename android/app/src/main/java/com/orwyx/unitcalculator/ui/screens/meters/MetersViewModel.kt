package com.orwyx.unitcalculator.ui.screens.meters

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.orwyx.unitcalculator.core.util.BillingCycle
import com.orwyx.unitcalculator.domain.engine.CalculationEngine
import com.orwyx.unitcalculator.domain.model.DashboardSummary
import com.orwyx.unitcalculator.domain.model.Meter
import com.orwyx.unitcalculator.domain.repository.MeterRepository
import com.orwyx.unitcalculator.domain.repository.SettingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

data class MetersUiState(
    val meters: List<Meter> = emptyList(),
    val summary: DashboardSummary = DashboardSummary(),
    val settings: com.orwyx.unitcalculator.domain.model.AppSettings = com.orwyx.unitcalculator.domain.model.AppSettings(),
    val query: String = "",
    val sort: MeterSort = MeterSort.NAME,
    val remainingDays: Int = 0,
    val isLoading: Boolean = true,
) {
    val isEmpty: Boolean get() = !isLoading && meters.isEmpty()
}

@HiltViewModel
class MetersViewModel @Inject constructor(
    private val meterRepository: MeterRepository,
    private val settingsRepository: SettingsRepository,
    private val calculationEngine: CalculationEngine,
) : ViewModel() {

    private val query = MutableStateFlow("")
    private val sort = MutableStateFlow(MeterSort.NAME)

    val uiState: StateFlow<MetersUiState> = combine(
        meterRepository.observeMeters(), settingsRepository.observeSettings(), query, sort,
    ) { meters, settings, q, s ->
        val cycle = BillingCycle.of(settings.readingDate)
        val visible = s.sort(meters.filterByQuery(q))
        MetersUiState(meters = visible, summary = calculationEngine.summarize(meters, cycle),
            settings = settings, query = q, sort = s, remainingDays = cycle.remainingDays, isLoading = false)
    }.stateIn(scope = viewModelScope, started = SharingStarted.WhileSubscribed(5_000), initialValue = MetersUiState())

    fun onQueryChange(value: String) { query.value = value }
    fun onSortChange(value: MeterSort) { sort.value = value }

    fun updateCurrentReading(meter: Meter, rawReading: String, allowDecimals: Boolean) {
        val parsed = rawReading.toDoubleOrNull() ?: return
        if (parsed < 0.0) return
        if (!allowDecimals && rawReading.contains('.')) return
        if (parsed < meter.previousReading) return
        viewModelScope.launch { meterRepository.upsert(meter.copy(currentReading = parsed)) }
    }

    fun toggleActiveMeter(meter: Meter) {
        viewModelScope.launch {
            val current = settingsRepository.observeSettings().first().activeMeterId
            val newId = if (current == meter.id) null else meter.id
            settingsRepository.setActiveMeterId(newId)
        }
    }

    fun setMeterClosedDate(meter: Meter, date: LocalDate?) {
        viewModelScope.launch { meterRepository.setClosedDate(meter.id, date) }
    }
}
