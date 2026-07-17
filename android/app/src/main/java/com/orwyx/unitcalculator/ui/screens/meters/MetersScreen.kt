package com.orwyx.unitcalculator.ui.screens.meters

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.BatteryChargingFull
import androidx.compose.material.icons.rounded.Bolt
import androidx.compose.material.icons.rounded.ElectricMeter
import androidx.compose.material.icons.rounded.Insights
import androidx.compose.material.icons.rounded.Savings
import androidx.compose.material.icons.rounded.TrendingUp
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.orwyx.unitcalculator.core.util.Formatters
import com.orwyx.unitcalculator.ui.components.CountChip
import com.orwyx.unitcalculator.ui.components.EmptyState
import com.orwyx.unitcalculator.ui.components.MeterCard
import com.orwyx.unitcalculator.ui.components.SearchSortBar
import com.orwyx.unitcalculator.ui.components.SectionHeader
import com.orwyx.unitcalculator.ui.components.SummaryCard
import com.orwyx.unitcalculator.ui.theme.StatusDeepGreen
import com.orwyx.unitcalculator.ui.theme.StatusOrange
import com.orwyx.unitcalculator.ui.theme.StatusRed

@Composable
fun MetersScreen(
    onOpenMeter: (Long) -> Unit,
    contentPadding: PaddingValues,
    viewModel: MetersViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    LazyColumn(
        modifier = Modifier.fillMaxSize().imePadding(),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = contentPadding.calculateTopPadding() + 8.dp, bottom = contentPadding.calculateBottomPadding() + 120.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        if (state.isEmpty) {
            item { EmptyState(icon = Icons.Rounded.ElectricMeter, title = "No meters yet", message = "Tap the + button to add your first electricity meter.") }
            return@LazyColumn
        }
        item { SectionHeader("Overview") }
        item { DashboardRow(state) }
        item { SearchSortBar(query = state.query, onQueryChange = viewModel::onQueryChange, sort = state.sort, onSortChange = viewModel::onSortChange) }
        item { SectionHeader("Meters") }
        items(state.meters, key = { it.id }) { meter ->
            MeterCard(
                meter = meter, remainingDays = state.remainingDays,
                allowDecimals = state.settings.allowDecimals,
                isActive = state.settings.activeMeterId == meter.id,
                isClosed = meter.closedDate != null,
                modifier = Modifier.animateItem(),
                onClick = { onOpenMeter(meter.id) },
                onCurrentReadingSubmit = { m, raw -> viewModel.updateCurrentReading(m, raw, state.settings.allowDecimals) },
                onToggleActive = { viewModel.toggleActiveMeter(meter) },
                onSetClosedDate = { date -> viewModel.setMeterClosedDate(meter, date) },
            )
        }
    }
}

@Composable
private fun DashboardRow(state: MetersUiState) {
    val s = state.summary
    Column {
        val cards = listOf(
            Triple(Icons.Rounded.ElectricMeter, s.totalMeters.toString(), "Total meters" to StatusDeepGreen),
            Triple(Icons.Rounded.Bolt, Formatters.units(s.totalConsumed), "Units consumed" to StatusOrange),
            Triple(Icons.Rounded.Savings, Formatters.units(s.totalRemaining), "Units remaining" to StatusDeepGreen),
            Triple(Icons.Rounded.BatteryChargingFull, Formatters.units(s.avgDailyUsage), "Avg / day" to StatusOrange),
            Triple(Icons.Rounded.TrendingUp, Formatters.units(s.projectedMonthEnd), "Projected end" to StatusRed),
            Triple(Icons.Rounded.Insights, Formatters.percent(s.overallFraction), "Overall used" to StatusRed),
        )
        cards.chunked(3).forEach { rowCards ->
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                rowCards.forEach { (icon, value, captionAndColor) ->
                    val (caption, accent) = captionAndColor
                    SummaryCard(icon = icon, value = value, caption = caption, accent = accent, modifier = Modifier.weight(1f))
                }
                repeat(3 - rowCards.size) { Spacer(Modifier.weight(1f)) }
            }
            Spacer(Modifier.height(10.dp))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            CountChip("Safe", s.safeCount, StatusDeepGreen)
            CountChip("Warning", s.warningCount, StatusOrange)
            CountChip("Critical", s.criticalCount, StatusRed)
        }
    }
}
