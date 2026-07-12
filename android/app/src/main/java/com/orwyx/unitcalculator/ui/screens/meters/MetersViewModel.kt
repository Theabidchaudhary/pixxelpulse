package com.orwyx.unitcalculator.ui.screens.meters

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.orwyx.unitcalculator.core.util.BillingCycle
import com.orwyx.unitcalculator.domain.engine.CalculationEngine
import com.orwyx.unitcalculator.domain.model.AppSettings
import com.orwyx.unitcalculator.domain.model.DashboardSummary
import com.orwyx.unitcalculator.domain.model.Meter
import com.orwyx.unitcalculator.domain.repository.MeterRepository
import com.orwyx.unitcalculator.domain.repository.SettingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.TextStyle
import java.util.Locale
import javax.inject.Inject

data class MetersUiState(
    val meters: List<Meter> = emptyList(),
    val summary: DashboardSummary = DashboardSummary(),
    val settings: AppSettings = AppSettings(),
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
    settingsRepository: SettingsRepository,
    private val calculationEngine: CalculationEngine,
) : ViewModel() {

    private val query = MutableStateFlow("")
    private val sort = MutableStateFlow(MeterSort.NAME)

    val uiState: StateFlow<MetersUiState> = combine(
        meterRepository.observeMeters(),
        settingsRepository.observeSettings(),
        query,
        sort,
    ) { meters, settings, q, s ->
        val cycle = BillingCycle.of(settings.readingDate)
        val visible = s.sort(meters.filterByQuery(q))
        MetersUiState(
            meters = visible,
            summary = calculationEngine.summarize(meters, cycle),
            settings = settings,
            query = q,
            sort = s,
            remainingDays = cycle.remainingDays,
            isLoading = false,
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = MetersUiState(),
    )

    fun onQueryChange(value: String) { query.value = value }
    fun onSortChange(value: MeterSort) { sort.value = value }

    fun deleteMeter(id: Long) = viewModelScope.launch { meterRepository.delete(id) }

    /** Resets a meter's month, snapshotting the current cycle into history. */
    fun resetMeter(meter: Meter, settings: AppSettings) = viewModelScope.launch {
        val cycle = BillingCycle.of(settings.readingDate)
        val avgDaily = calculationEngine.averageDailyUsage(meter, cycle)
        meterRepository.resetMonth(
            id = meter.id,
            monthLabel = currentMonthLabel(cycle.start),
            avgDailyUsage = avgDaily,
            closedAt = System.currentTimeMillis(),
        )
    }

    private fun currentMonthLabel(start: LocalDate): String {
        val ym = YearMonth.from(start)
        val month = ym.month.getDisplayName(TextStyle.FULL, Locale.getDefault())
        return "$month ${ym.year}"
    }
}
