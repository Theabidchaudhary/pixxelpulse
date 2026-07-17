package com.orwyx.unitcalculator.ui.screens.planning

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.background
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.CalendarMonth
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.orwyx.unitcalculator.core.util.Formatters
import com.orwyx.unitcalculator.domain.model.DayPlan
import com.orwyx.unitcalculator.domain.model.MeterWindow
import com.orwyx.unitcalculator.ui.components.AnimatedProgressBar
import com.orwyx.unitcalculator.ui.components.CalendarLegend
import com.orwyx.unitcalculator.ui.components.EmptyState
import com.orwyx.unitcalculator.ui.components.LineChart
import com.orwyx.unitcalculator.ui.components.LineSeries
import com.orwyx.unitcalculator.ui.components.NeumorphicCard
import com.orwyx.unitcalculator.ui.components.PlanningCalendar
import com.orwyx.unitcalculator.ui.components.SectionHeader
import com.orwyx.unitcalculator.ui.theme.ConsumptionColors
import com.orwyx.unitcalculator.ui.theme.MeterPalette
import com.orwyx.unitcalculator.ui.theme.StatusDeepGreen
import com.orwyx.unitcalculator.ui.theme.StatusRed
import java.time.format.DateTimeFormatter
import kotlin.math.abs
import kotlin.math.max

@Composable
fun PlanningScreen(contentPadding: PaddingValues, viewModel: PlanningViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val fmt = DateTimeFormatter.ofPattern("d MMM")
    var selectedDay by remember { mutableStateOf<DayPlan?>(null) }
    val meterColorMap = remember(state.meterWindows) {
        state.meterWindows.mapIndexed { index, window -> window.meter.id to MeterPalette.colorFor(index) }.toMap()
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize().imePadding(),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = contentPadding.calculateTopPadding() + 8.dp, bottom = contentPadding.calculateBottomPadding() + 120.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        if (!state.hasMeters) {
            item { EmptyState(icon = Icons.Rounded.CalendarMonth, title = "Nothing to plan yet", message = "Add a meter to see your consumption plan for this billing cycle.") }
            return@LazyColumn
        }

        item { SectionHeader("This cycle") }
        item {
            NeumorphicCard(modifier = Modifier.fillMaxWidth()) {
                Column {
                    Text("${state.cycleStart.format(fmt)}  →  ${state.cycleEnd.format(fmt)}", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Text("Day ${state.elapsedDays} of ${state.totalDays} · ${state.remainingDays} days left · excludes closed meters", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(Modifier.height(14.dp))
                    AnimatedProgressBar(fraction = if (state.summaryTarget > 0) (state.summaryConsumed / state.summaryTarget).toFloat() else 0f)
                    Spacer(Modifier.height(14.dp))
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        PlanStat("Expected", Formatters.units(state.summaryExpectedToday))
                        PlanStat("Actual", Formatters.units(state.summaryConsumed))
                        PlanStat(if (state.summaryOnTrack) "Under by" else "Over by", Formatters.units(abs(state.summaryDifference)), color = if (state.summaryOnTrack) StatusDeepGreen else StatusRed)
                    }
                }
            }
        }

        item { SectionHeader("Calendar") }
        item {
            NeumorphicCard(modifier = Modifier.fillMaxWidth()) {
                Column {
                    PlanningCalendar(days = state.days, onDaySelected = { selectedDay = it }, meterColorMap = meterColorMap, selectedDay = selectedDay)
                    Spacer(Modifier.height(12.dp))
                    CalendarLegend()
                    selectedDay?.let { day ->
                        Spacer(Modifier.height(12.dp))
                        DayDetail(day = day, fmt = fmt, meterColorMap = meterColorMap, windows = state.meterWindows)
                    }
                }
            }
        }

        if (state.meterWindows.isNotEmpty()) {
            item { SectionHeader("Meter rotation") }
            item {
                NeumorphicCard(modifier = Modifier.fillMaxWidth()) {
                    Column {
                        Text("Each meter's day window. Close a meter earlier or later from the Meters tab to adjust the split.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Spacer(Modifier.height(12.dp))
                        state.meterWindows.forEachIndexed { index, window ->
                            val color = MeterPalette.colorFor(index)
                            MeterRotationRow(name = window.meter.name, refLast4 = window.meter.referenceLastFour, startDay = window.startDay, endDay = window.endDay, cycleStart = state.cycleStart, closedDate = window.meter.closedDate, color = color, fmt = fmt)
                            Spacer(Modifier.height(8.dp))
                        }
                    }
                }
            }
        }

        item { SectionHeader("Target vs actual") }
        item {
            NeumorphicCard(modifier = Modifier.fillMaxWidth()) {
                Column {
                    val expected = state.days.map { it.expectedCumulative.toFloat() }
                    val actual = state.days.map { it.actualCumulative.toFloat() }
                    val maxV = max(state.totalTarget.toFloat(), (actual.maxOrNull() ?: 0f))
                    LineChart(series = listOf(LineSeries(expected, MaterialTheme.colorScheme.primary, dashed = true), LineSeries(actual, ConsumptionColors.colorFor(state.forecast.projectedFraction), filled = true)), maxValue = maxV)
                    Spacer(Modifier.height(10.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        LegendDot("Target pace", MaterialTheme.colorScheme.primary)
                        LegendDot("Projected actual", ConsumptionColors.colorFor(state.forecast.projectedFraction))
                    }
                }
            }
        }

        item { SectionHeader("Forecast") }
        item {
            NeumorphicCard(modifier = Modifier.fillMaxWidth()) {
                Column {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        PlanStat("Avg / day", Formatters.units(state.forecast.avgDailyUsage))
                        PlanStat("Projected end", Formatters.units(state.forecast.projectedMonthEnd), color = ConsumptionColors.colorFor(state.forecast.projectedFraction))
                        PlanStat("Total target", Formatters.units(state.forecast.target))
                    }
                    Spacer(Modifier.height(12.dp))
                    Text(if (state.forecast.willExceed) "At this pace you'll exceed your total limit by about ${Formatters.units(state.forecast.expectedOverage)} units. Ease usage to stay safe." else "You're projected to finish about ${Formatters.units(abs(state.forecast.expectedOverage))} units under your limit.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
    }
}

@Composable
private fun DayDetail(day: DayPlan, fmt: DateTimeFormatter, meterColorMap: Map<Long, Color>, windows: List<MeterWindow>) {
    val meterColor = day.meterId?.let { meterColorMap[it] } ?: MaterialTheme.colorScheme.surfaceVariant
    val window = windows.firstOrNull { it.containsDay(day.dayIndex) }
    val actualReading = window?.meter?.currentReading ?: 0.0

    Column(Modifier.fillMaxWidth().clip(MaterialTheme.shapes.medium).background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)).padding(14.dp)) {
        Text(day.date.format(fmt) + if (day.isToday) " · Today" else "", fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(8.dp))

        if (day.meterRefLast4 != null && window != null) {
            Row(Modifier.fillMaxWidth().clip(MaterialTheme.shapes.small).background(meterColor.copy(alpha = 0.12f)).padding(horizontal = 12.dp, vertical = 8.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Spacer(Modifier.size(10.dp).clip(CircleShape).background(meterColor))
                        Spacer(Modifier.width(6.dp))
                        Text("Meter ·•••${day.meterRefLast4}", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.SemiBold, color = meterColor)
                    }
                    Text(window.meter.name, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text("Expected: ${Formatters.units(day.expectedMeterReading)}", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Medium)
                    Text("Actual: ${Formatters.units(actualReading)}", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            Spacer(Modifier.height(10.dp))
        }

        if (window != null) {
            val diff = actualReading - day.expectedMeterReading
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                PlanStat("Expected reading", Formatters.units(day.expectedMeterReading))
                PlanStat("Current reading", Formatters.units(actualReading))
                PlanStat(if (diff <= 0) "Under by" else "Over by", Formatters.units(abs(diff)), color = if (diff <= 0) StatusDeepGreen else StatusRed)
            }
        }
    }
}

@Composable
private fun MeterRotationRow(name: String, refLast4: String, startDay: Int, endDay: Int, cycleStart: java.time.LocalDate, closedDate: java.time.LocalDate?, color: Color, fmt: DateTimeFormatter) {
    Row(Modifier.fillMaxWidth().clip(MaterialTheme.shapes.small).background(color.copy(alpha = 0.10f)).padding(horizontal = 12.dp, vertical = 10.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
            Spacer(Modifier.size(12.dp).clip(CircleShape).background(color))
            Spacer(Modifier.width(8.dp))
            Column {
                Text(name, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                Text("Ref ·•••$refLast4", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        Column(horizontalAlignment = Alignment.End) {
            val start = cycleStart.plusDays((startDay - 1).toLong())
            val end = cycleStart.plusDays((endDay - 1).toLong())
            Text("${start.format(fmt)} → ${end.format(fmt)}", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Medium)
            Text(if (closedDate != null) "Closed ${closedDate.format(fmt)}" else "Days $startDay–$endDay", style = MaterialTheme.typography.labelSmall, color = if (closedDate != null) StatusRed else MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun LegendDot(label: String, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Spacer(Modifier.size(10.dp).clip(CircleShape).background(color))
        Spacer(Modifier.width(6.dp))
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun PlanStat(label: String, value: String, color: Color = MaterialTheme.colorScheme.onSurface) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = color)
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}
