package com.orwyx.unitcalculator

import com.orwyx.unitcalculator.core.util.BillingCycle
import com.orwyx.unitcalculator.domain.engine.ForecastEngine
import com.orwyx.unitcalculator.domain.engine.PlanningEngine
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate

class PlanningForecastTest {

    private val forecastEngine = ForecastEngine()
    private val planningEngine = PlanningEngine()

    // Cycle: 1st to 31st July (30 days), today the 11th -> 10 elapsed days.
    private val cycle = BillingCycle(
        start = LocalDate.of(2026, 7, 1),
        end = LocalDate.of(2026, 7, 31),
        today = LocalDate.of(2026, 7, 11),
    )

    @Test
    fun `forecast projects and flags overage`() {
        val f = forecastEngine.forecast(totalConsumed = 120.0, totalTarget = 200.0, cycle = cycle)
        assertEquals(12.0, f.avgDailyUsage, 0.001)  // 120 / 10
        assertEquals(360.0, f.projectedMonthEnd, 0.001) // 12 * 30
        assertEquals(160.0, f.expectedOverage, 0.001)
        assertTrue(f.willExceed)
    }

    @Test
    fun `forecast under target does not flag`() {
        val f = forecastEngine.forecast(totalConsumed = 40.0, totalTarget = 200.0, cycle = cycle)
        assertFalse(f.willExceed)
        assertTrue(f.expectedOverage < 0)
    }

    @Test
    fun `calendar spans the full cycle`() {
        val days = planningEngine.buildCalendar(300.0, 60.0, cycle)
        assertEquals(30, days.size)
        assertEquals(1, days.first().dayIndex)
        assertEquals(30, days.last().dayIndex)
    }

    @Test
    fun `expected cumulative follows proportional pace`() {
        val days = planningEngine.buildCalendar(300.0, 60.0, cycle)
        // Day 15 of 30 -> half the target.
        assertEquals(150.0, days[14].expectedCumulative, 0.001)
        // Final day reaches target.
        assertEquals(300.0, days.last().expectedCumulative, 0.001)
    }

    @Test
    fun `today uses real consumed and is flagged`() {
        val days = planningEngine.buildCalendar(300.0, 60.0, cycle)
        val today = days.first { it.isToday }
        assertEquals(10, today.dayIndex) // 10 elapsed days
        assertEquals(60.0, today.actualCumulative, 0.001)
    }

    @Test
    fun `future days are projected at running pace`() {
        val days = planningEngine.buildCalendar(300.0, 60.0, cycle)
        // avgDaily = 60/10 = 6; day 20 projected = 120.
        val future = days.first { it.dayIndex == 20 }
        assertTrue(future.isFuture)
        assertEquals(120.0, future.actualCumulative, 0.001)
    }
}
