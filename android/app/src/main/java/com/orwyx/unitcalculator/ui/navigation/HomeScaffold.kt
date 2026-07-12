package com.orwyx.unitcalculator.ui.navigation

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.orwyx.unitcalculator.ui.components.AddMeterFab
import com.orwyx.unitcalculator.ui.screens.meters.MetersScreen
import com.orwyx.unitcalculator.ui.screens.planning.PlanningScreen

/**
 * Hosts the two bottom-nav tabs (Meters, Planning) under a shared top bar, floating glass nav
 * bar and add-meter FAB. Tab switching is local state with a fade transition; deeper screens
 * (detail, edit, settings) are separate nav destinations.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScaffold(
    onOpenMeter: (Long) -> Unit,
    onAddMeter: () -> Unit,
    onEditMeter: (Long) -> Unit,
    onOpenSettings: () -> Unit,
) {
    var selectedTab by rememberSaveable { mutableStateOf(BottomTab.METERS) }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            AppTopBar(
                title = if (selectedTab == BottomTab.METERS) "Unit Calculator" else "Planning",
                onSearch = { selectedTab = BottomTab.METERS },
                onSettings = onOpenSettings,
            )
        },
        floatingActionButton = {
            if (selectedTab == BottomTab.METERS) AddMeterFab(onClick = onAddMeter)
        },
    ) { padding ->
        Box(Modifier.fillMaxSize()) {
            AnimatedContent(
                targetState = selectedTab,
                transitionSpec = { fadeIn() togetherWith fadeOut() },
                label = "tabContent",
            ) { tab ->
                when (tab) {
                    BottomTab.METERS -> MetersScreen(
                        onOpenMeter = onOpenMeter,
                        onEditMeter = onEditMeter,
                        contentPadding = padding,
                    )
                    BottomTab.PLANNING -> PlanningScreen(contentPadding = padding)
                }
            }

            GlassBottomNav(
                currentRoute = selectedTab.route,
                onTabSelected = { selectedTab = it },
                modifier = Modifier.align(Alignment.BottomCenter),
            )
        }
    }
}
