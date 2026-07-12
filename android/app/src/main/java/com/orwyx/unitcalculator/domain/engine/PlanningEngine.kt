package com.orwyx.unitcalculator.domain.engine

import com.orwyx.unitcalculator.core.util.BillingCycle
import com.orwyx.unitcalculator.domain.model.DayPlan

/**
 * Builds the day-by-day plan for a billing cycle. Uses a proportional strategy: the expected
 * cumulative usage rises in a straight line from 0 to the total target across the cycle. The
 * strategy is isolated behind [PlanningStrategy] so alternatives (weighted, sequential per-meter)
 * can be added later without touching callers. Pure & testable.
 */
class PlanningEngine(
    private val strategy: PlanningStrategy = ProportionalStrategy,
) {

    /**
     * @param totalTarget combined target across all meters
     * @param totalConsumed combined consumed-so-far across all meters (as of today)
     */
    fun buildCalendar(
        totalTarget: Double,
        totalConsumed: Double,
        cycle: BillingCycle,
    ): List<DayPlan> {
        val totalDays = cycle.totalDays
        // Running average pace from real data; used to estimate past and project future days.
        val avgDaily = if (cycle.elapsedDays > 0) totalConsumed / cycle.elapsedDays else 0.0

        return (1..totalDays).map { dayIndex ->
            val date = cycle.start.plusDays((dayIndex - 1).toLong())
            val expected = strategy.expectedCumulative(dayIndex, totalDays, totalTarget)
            val elapsedToday = cycle.elapsedDays
            val actual = when {
                dayIndex < elapsedToday -> avgDaily * dayIndex          // estimated past
                dayIndex == elapsedToday -> totalConsumed               // real, today
                else -> avgDaily * dayIndex                             // projected future
            }
            DayPlan(
                date = date,
                dayIndex = dayIndex,
                expectedCumulative = expected,
                actualCumulative = actual,
                target = totalTarget,
                isPast = dayIndex < elapsedToday,
                isToday = dayIndex == elapsedToday,
            )
        }
    }
}

/** Strategy for how the planned (expected) cumulative usage is distributed across the cycle. */
fun interface PlanningStrategy {
    fun expectedCumulative(dayIndex: Int, totalDays: Int, totalTarget: Double): Double
}

/** Even, straight-line pace to the target — the sensible default for a monthly unit budget. */
val ProportionalStrategy = PlanningStrategy { dayIndex, totalDays, totalTarget ->
    if (totalDays <= 0) 0.0 else totalTarget * (dayIndex.toDouble() / totalDays.toDouble())
}
