package com.orwyx.unitcalculator.ui.screens.planning

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.CalendarMonth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.orwyx.unitcalculator.core.util.Formatters
import com.orwyx.unitcalculator.ui.components.AnimatedProgressBar
import com.orwyx.unitcalculator.ui.components.EmptyState
import com.orwyx.unitcalculator.ui.components.NeumorphicCard
import com.orwyx.unitcalculator.ui.components.SectionHeader
import com.orwyx.unitcalculator.ui.theme.ConsumptionColors
import com.orwyx.unitcalculator.ui.theme.StatusDeepGreen
import com.orwyx.unitcalculator.ui.theme.StatusRed
import java.time.format.DateTimeFormatter

@Composable
fun PlanningScreen(
    contentPadding: PaddingValues,
    viewModel: PlanningViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val fmt = DateTimeFormatter.ofPattern("d MMM")

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(
            start = 20.dp,
            end = 20.dp,
            top = contentPadding.calculateTopPadding() + 8.dp,
            bottom = contentPadding.calculateBottomPadding() + 120.dp,
        ),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        if (!state.hasMeters) {
            item {
                EmptyState(
                    icon = Icons.Rounded.CalendarMonth,
                    title = "Nothing to plan yet",
                    message = "Add a meter to see your consumption plan for this billing cycle.",
                )
            }
            return@LazyColumn
        }

        item {
            SectionHeader("This cycle")
        }
        item {
            NeumorphicCard(modifier = Modifier.fillMaxWidth()) {
                Column {
                    Text(
                        "${state.cycleStart.format(fmt)}  →  ${state.cycleEnd.format(fmt)}",
                        style = MaterialThemeTitle(),
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        "Day ${state.elapsedDays} of ${state.totalDays} · ${state.remainingDays} days left",
                        style = androidx.compose.material3.MaterialTheme.typography.bodyMedium,
                        color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(Modifier.height(14.dp))
                    AnimatedProgressBar(
                        fraction = if (state.summary.totalTarget > 0)
                            (state.actualCumulative / state.summary.totalTarget).toFloat() else 0f,
                    )
                }
            }
        }

        item { SectionHeader("Expected vs actual") }
        item {
            NeumorphicCard(modifier = Modifier.fillMaxWidth()) {
                Column {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        PlanStat("Expected", Formatters.units(state.expectedCumulative))
                        PlanStat("Actual", Formatters.units(state.actualCumulative))
                        PlanStat(
                            if (state.onTrack) "Under by" else "Over by",
                            Formatters.units(kotlin.math.abs(state.difference)),
                            color = if (state.onTrack) StatusDeepGreen else StatusRed,
                        )
                    }
                    Spacer(Modifier.height(12.dp))
                    Text(
                        if (state.onTrack)
                            "You're consuming slower than planned — on track to stay within your limits."
                        else
                            "You're ahead of your planned pace. Ease usage to avoid exceeding your limits.",
                        style = androidx.compose.material3.MaterialTheme.typography.bodyMedium,
                        color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }

        item { SectionHeader("Forecast") }
        item {
            NeumorphicCard(modifier = Modifier.fillMaxWidth()) {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    PlanStat("Avg / day", Formatters.units(state.summary.avgDailyUsage))
                    PlanStat(
                        "Projected end",
                        Formatters.units(state.summary.projectedMonthEnd),
                        color = ConsumptionColors.colorFor(
                            if (state.summary.totalTarget > 0)
                                (state.summary.projectedMonthEnd / state.summary.totalTarget).toFloat() else 0f,
                        ),
                    )
                    PlanStat("Total target", Formatters.units(state.summary.totalTarget))
                }
            }
        }
    }
}

@Composable
private fun MaterialThemeTitle() = androidx.compose.material3.MaterialTheme.typography.titleLarge

@Composable
private fun PlanStat(
    label: String,
    value: String,
    color: androidx.compose.ui.graphics.Color = androidx.compose.material3.MaterialTheme.colorScheme.onSurface,
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, style = androidx.compose.material3.MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = color)
        Text(
            label,
            style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
            color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
