package com.orwyx.unitcalculator.core.util

import java.time.LocalDate
import java.time.temporal.ChronoUnit

/**
 * The current billing cycle window derived from a monthly [readingDate].
 * A cycle runs from the most recent reading date up to the next reading date.
 */
data class BillingCycle(
    val start: LocalDate,
    val end: LocalDate,
    val today: LocalDate,
) {
    /** Total days in the cycle (inclusive of start, exclusive of end). Always >= 1. */
    val totalDays: Int get() = ChronoUnit.DAYS.between(start, end).toInt().coerceAtLeast(1)

    /** Days elapsed since the cycle started, clamped to at least 1 to avoid divide-by-zero. */
    val elapsedDays: Int
        get() = ChronoUnit.DAYS.between(start, today).toInt().coerceIn(1, totalDays)

    val remainingDays: Int get() = (totalDays - elapsedDays).coerceAtLeast(0)

    val progressFraction: Float get() = elapsedDays.toFloat() / totalDays.toFloat()

    companion object {
        /**
         * Builds the cycle containing [today] for a given [readingDate] (1..28, clamped).
         * Uses day 28 as the safe maximum so every month has the reading day.
         */
        fun of(readingDate: Int, today: LocalDate = LocalDate.now()): BillingCycle {
            val day = readingDate.coerceIn(1, 28)
            val startThisMonth = today.withDayOfMonth(day)
            val start = if (today.dayOfMonth >= day) startThisMonth else startThisMonth.minusMonths(1)
            val end = start.plusMonths(1)
            return BillingCycle(start = start, end = end, today = today)
        }
    }
}
