package com.orwyx.unitcalculator.ui.screens.meters

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.orwyx.unitcalculator.core.util.Formatters
import com.orwyx.unitcalculator.domain.model.Meter
import com.orwyx.unitcalculator.ui.components.ConfirmDialog
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
    onEditMeter: (Long) -> Unit,
    contentPadding: PaddingValues,
    viewModel: MetersViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    var meterToDelete by remember { mutableStateOf<Meter?>(null) }
    var meterToReset by remember { mutableStateOf<Meter?>(null) }

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
        if (state.isEmpty) {
            item {
                EmptyState(
                    icon = Icons.Rounded.ElectricMeter,
                    title = "No meters yet",
                    message = "Tap the + button to add your first electricity meter.",
                )
            }
            return@LazyColumn
        }

        item { SectionHeader("Overview") }
        item { DashboardRow(state) }
        item {
            SearchSortBar(
                query = state.query,
                onQueryChange = viewModel::onQueryChange,
                sort = state.sort,
                onSortChange = viewModel::onSortChange,
            )
        }
        item { SectionHeader("Meters") }

        items(state.meters, key = { it.id }) { meter ->
            MeterCard(
                meter = meter,
                onClick = { onOpenMeter(meter.id) },
                onEdit = { onEditMeter(meter.id) },
                onReset = { meterToReset = meter },
                onDelete = { meterToDelete = meter },
            )
        }
    }

    meterToReset?.let { meter ->
        ConfirmDialog(
            title = "Reset ${meter.name}?",
            message = "This closes the current month and saves it to history. The current reading " +
                "becomes the new previous reading.",
            confirmLabel = "Reset",
            onConfirm = {
                viewModel.resetMeter(meter, state.settings)
                meterToReset = null
            },
            onDismiss = { meterToReset = null },
        )
    }

    meterToDelete?.let { meter ->
        ConfirmDialog(
            title = "Delete ${meter.name}?",
            message = "This permanently removes the meter and its history.",
            confirmLabel = "Delete",
            onConfirm = {
                viewModel.deleteMeter(meter.id)
                meterToDelete = null
            },
            onDismiss = { meterToDelete = null },
        )
    }
}

@Composable
private fun DashboardRow(state: MetersUiState) {
    val s = state.summary
    androidx.compose.foundation.layout.Column {
    LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            SummaryCard(
                icon = Icons.Rounded.ElectricMeter,
                value = s.totalMeters.toString(),
                caption = "Total meters",
                accent = StatusDeepGreen,
            )
        }
        item {
            SummaryCard(
                icon = Icons.Rounded.Bolt,
                value = Formatters.units(s.totalConsumed),
                caption = "Units consumed",
                accent = StatusOrange,
            )
        }
        item {
            SummaryCard(
                icon = Icons.Rounded.Savings,
                value = Formatters.units(s.totalRemaining),
                caption = "Units remaining",
                accent = StatusDeepGreen,
            )
        }
        item {
            SummaryCard(
                icon = Icons.Rounded.BatteryChargingFull,
                value = Formatters.units(s.avgDailyUsage),
                caption = "Avg / day",
                accent = StatusOrange,
            )
        }
        item {
            SummaryCard(
                icon = Icons.Rounded.TrendingUp,
                value = Formatters.units(s.projectedMonthEnd),
                caption = "Projected end",
                accent = StatusRed,
            )
        }
        item {
            SummaryCard(
                icon = Icons.Rounded.Insights,
                value = Formatters.percent(s.overallFraction),
                caption = "Overall used",
                accent = StatusRed,
            )
        }
    }
    Spacer(Modifier.height(12.dp))
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        CountChip("Safe", s.safeCount, StatusDeepGreen)
        CountChip("Warning", s.warningCount, StatusOrange)
        CountChip("Critical", s.criticalCount, StatusRed)
    }
    }
}
