package com.orwyx.unitcalculator.ui.screens.planning

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.orwyx.unitcalculator.core.util.BillingCycle
import com.orwyx.unitcalculator.domain.engine.CalculationEngine
import com.orwyx.unitcalculator.domain.model.DashboardSummary
import com.orwyx.unitcalculator.domain.repository.MeterRepository
import com.orwyx.unitcalculator.domain.repository.SettingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import java.time.LocalDate
import javax.inject.Inject

data class PlanningUiState(
    val summary: DashboardSummary = DashboardSummary(),
    val cycleStart: LocalDate = LocalDate.now(),
    val cycleEnd: LocalDate = LocalDate.now(),
    val elapsedDays: Int = 0,
    val totalDays: Int = 30,
    val remainingDays: Int = 30,
    val expectedCumulative: Double = 0.0,
    val actualCumulative: Double = 0.0,
    val hasMeters: Boolean = false,
) {
    /** Positive means consuming faster than planned; negative means comfortably under. */
    val difference: Double get() = actualCumulative - expectedCumulative
    val onTrack: Boolean get() = difference <= 0
}

@HiltViewModel
class PlanningViewModel @Inject constructor(
    meterRepository: MeterRepository,
    settingsRepository: SettingsRepository,
    private val calculationEngine: CalculationEngine,
) : ViewModel() {

    val uiState: StateFlow<PlanningUiState> = combine(
        meterRepository.observeMeters(),
        settingsRepository.observeSettings(),
    ) { meters, settings ->
        val cycle = BillingCycle.of(settings.readingDate)
        val summary = calculationEngine.summarize(meters, cycle)
        val expected = summary.totalTarget * cycle.progressFraction
        PlanningUiState(
            summary = summary,
            cycleStart = cycle.start,
            cycleEnd = cycle.end,
            elapsedDays = cycle.elapsedDays,
            totalDays = cycle.totalDays,
            remainingDays = cycle.remainingDays,
            expectedCumulative = expected,
            actualCumulative = summary.totalConsumed,
            hasMeters = meters.isNotEmpty(),
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), PlanningUiState())
}
