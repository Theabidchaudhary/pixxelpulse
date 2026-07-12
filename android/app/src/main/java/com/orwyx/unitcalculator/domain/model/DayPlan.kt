package com.orwyx.unitcalculator.domain.model

import java.time.LocalDate

/**
 * One day in the billing cycle for the planning calendar.
 *
 * Because the app doesn't require daily meter logging, [actualCumulative] is an estimate derived
 * from the running average pace (real consumed ÷ elapsed days). Days after today are projections.
 */
data class DayPlan(
    val date: LocalDate,
    val dayIndex: Int,              // 1-based position within the cycle
    val expectedCumulative: Double, // planned pace (straight line to target)
    val actualCumulative: Double,   // estimated/actual (past) or projected (future)
    val target: Double,
    val isPast: Boolean,
    val isToday: Boolean,
) {
    val isFuture: Boolean get() = !isPast && !isToday

    /** Difference vs plan on this day. Positive = ahead of (faster than) plan. */
    val difference: Double get() = actualCumulative - expectedCumulative

    /** Fraction of the total target consumed by this day — drives the cell colour. */
    val usedFraction: Float
        get() = if (target <= 0.0) 0f else (actualCumulative / target).toFloat()

    val status: MeterStatus get() = MeterStatus.fromPercent(usedFraction)
}
