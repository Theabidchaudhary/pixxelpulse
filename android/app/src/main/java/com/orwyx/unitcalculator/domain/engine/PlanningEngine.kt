package com.orwyx.unitcalculator.domain.engine

import com.orwyx.unitcalculator.core.util.BillingCycle
import com.orwyx.unitcalculator.domain.model.DayPlan
import com.orwyx.unitcalculator.domain.model.Meter
import com.orwyx.unitcalculator.domain.model.MeterWindow
import java.time.temporal.ChronoUnit

class PlanningEngine(
    private val strategy: PlanningStrategy = ProportionalStrategy,
) {
    fun buildCalendar(
        totalTarget: Double,
        totalConsumed: Double,
        cycle: BillingCycle,
        meters: List<Meter> = emptyList(),
    ): List<DayPlan> {
        val totalDays = cycle.totalDays
        val avgDaily = if (cycle.elapsedDays > 0) totalConsumed / cycle.elapsedDays else 0.0
        val windows = computeMeterWindows(meters, cycle)

        return (1..totalDays).map { dayIndex ->
            val date = cycle.start.plusDays((dayIndex - 1).toLong())
            val expected = strategy.expectedCumulative(dayIndex, totalDays, totalTarget)
            val elapsedToday = cycle.elapsedDays
            val actual = when {
                dayIndex < elapsedToday -> avgDaily * dayIndex
                dayIndex == elapsedToday -> totalConsumed
                else -> avgDaily * dayIndex
            }
            val window = windows.firstOrNull { it.containsDay(dayIndex) }
            val expectedMeterReading = if (window != null && window.dayCount > 0) {
                val dayInWindow = dayIndex - window.startDay + 1
                val perDay = window.meter.targetLimit / window.dayCount
                window.meter.previousReading + dayInWindow * perDay
            } else 0.0
            DayPlan(
                date = date, dayIndex = dayIndex,
                expectedCumulative = expected, actualCumulative = actual,
                target = totalTarget, isPast = dayIndex < elapsedToday,
                isToday = dayIndex == elapsedToday,
                meterId = window?.meter?.id,
                meterRefLast4 = window?.meter?.referenceLastFour,
                expectedMeterReading = expectedMeterReading,
            )
        }
    }

    fun computeMeterWindows(meters: List<Meter>, cycle: BillingCycle): List<MeterWindow> {
        if (meters.isEmpty()) return emptyList()
        val totalDays = cycle.totalDays
        val windows = mutableListOf<MeterWindow>()
        var currentStart = 1
        for ((index, meter) in meters.withIndex()) {
            if (currentStart > totalDays) break
            val remainingMeters = meters.size - index
            val remainingDays = totalDays - currentStart + 1
            val plannedDays = remainingDays / remainingMeters
            val plannedEnd = currentStart + plannedDays - 1
            val actualEnd = meter.closedDate?.let { closed ->
                val closedDay = (ChronoUnit.DAYS.between(cycle.start, closed).toInt() + 1).coerceIn(1, totalDays)
                if (closedDay >= currentStart) closedDay else plannedEnd
            } ?: plannedEnd
            windows.add(MeterWindow(meter = meter, startDay = currentStart, endDay = actualEnd))
            currentStart = actualEnd + 1
        }
        return windows
    }
}

fun interface PlanningStrategy {
    fun expectedCumulative(dayIndex: Int, totalDays: Int, totalTarget: Double): Double
}

val ProportionalStrategy = PlanningStrategy { dayIndex, totalDays, totalTarget ->
    if (totalDays <= 0) 0.0 else totalTarget * (dayIndex.toDouble() / totalDays.toDouble())
}
