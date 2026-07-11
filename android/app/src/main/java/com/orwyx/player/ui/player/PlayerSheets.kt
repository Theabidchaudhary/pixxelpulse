package com.orwyx.player.ui.player

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.foundation.rememberScrollState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.media3.common.util.UnstableApi
import com.orwyx.player.core.util.Formatters
import com.orwyx.player.player.SleepTimerState
import com.orwyx.player.player.audio.AudioFxController
import com.orwyx.player.player.enhance.EnhanceSettings

/** All playback speeds offered, matching the spec. */
private val SPEEDS = listOf(0.25f, 0.5f, 0.75f, 1f, 1.25f, 1.5f, 1.75f, 2f, 2.5f, 3f)

private val SLEEP_PRESETS_MIN = listOf(5, 10, 15, 30, 45, 60)

/** Hosts whichever modal sheet is currently open. */
@OptIn(ExperimentalMaterial3Api::class)
@UnstableApi
@Composable
fun PlayerSheets(
    sheet: PlayerSheet,
    onDismiss: () -> Unit,
    viewModel: PlayerViewModel,
) {
    if (sheet == PlayerSheet.NONE) return
    ModalBottomSheet(onDismissRequest = onDismiss) {
        when (sheet) {
            PlayerSheet.SPEED -> SpeedSheet(viewModel)
            PlayerSheet.AUDIO -> AudioSheet(viewModel)
            PlayerSheet.SUBTITLES -> SubtitleSheet(viewModel)
            PlayerSheet.SLEEP -> SleepSheet(viewModel, onDismiss)
            PlayerSheet.ENHANCE -> EnhanceSheet(viewModel)
            PlayerSheet.NONE -> Unit
        }
    }
}

@UnstableApi
@Composable
private fun SpeedSheet(viewModel: PlayerViewModel) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    SheetTitle("Playback speed")
    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier
            .padding(horizontal = 16.dp)
            .fillMaxWidth()
            .horizontalScrollable(),
    ) {
        SPEEDS.forEach { speed ->
            FilterChip(
                selected = state.speed == speed,
                onClick = { viewModel.setSpeed(speed) },
                label = { Text(if (speed == speed.toInt().toFloat()) "${speed.toInt()}×" else "$speed×") },
            )
        }
    }
    Text(
        "Pitch stays corrected at every speed.",
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.padding(16.dp),
    )
}

@UnstableApi
@Composable
private fun AudioSheet(viewModel: PlayerViewModel) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val fx by viewModel.audioFx.state.collectAsState()

    LazyColumn(modifier = Modifier.padding(bottom = 24.dp)) {
        item { SheetTitle("Audio") }

        if (state.audioTracks.size > 1) {
            item { SheetSection("Audio track") }
            items(state.audioTracks) { track ->
                ListItem(
                    headlineContent = { Text(track.label) },
                    leadingContent = {
                        RadioButton(selected = track.selected, onClick = { viewModel.selectTrack(track) })
                    },
                )
            }
            item { HorizontalDivider() }
        }

        item {
            SheetSection("Audio delay: ${state.audioDelayMs} ms")
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.padding(horizontal = 16.dp),
            ) {
                OutlinedButton(onClick = { viewModel.setAudioDelay(-50) }) { Text("−50 ms") }
                OutlinedButton(onClick = { viewModel.setAudioDelay(50) }) { Text("+50 ms") }
                TextButton(onClick = { viewModel.setAudioDelay(-state.audioDelayMs) }) { Text("Reset") }
            }
        }

        item {
            SheetSection("Volume boost")
            Slider(
                value = fx.volumeBoostMb.toFloat(),
                onValueChange = { viewModel.audioFx.setVolumeBoost(it.toInt()) },
                valueRange = 0f..AudioFxController.MAX_BOOST_MB.toFloat(),
                modifier = Modifier.padding(horizontal = 16.dp),
            )
        }

        item {
            var mono by remember { mutableStateOf(false) }
            ListItem(
                headlineContent = { Text("Mono audio") },
                supportingContent = { Text("Downmix stereo to a single channel") },
                trailingContent = {
                    Switch(
                        checked = mono,
                        onCheckedChange = { mono = it; viewModel.setMonoAudio(it) },
                    )
                },
            )
        }

        if (fx.available && fx.bands.isNotEmpty()) {
            item {
                ListItem(
                    headlineContent = { Text("Equalizer") },
                    trailingContent = {
                        Switch(
                            checked = fx.equalizerEnabled,
                            onCheckedChange = { viewModel.audioFx.setEqualizerEnabled(it) },
                        )
                    },
                )
            }
            items(fx.bands) { band ->
                Column(Modifier.padding(horizontal = 16.dp)) {
                    Text(
                        "${band.centerFrequencyHz} Hz",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Slider(
                        value = band.levelMb.toFloat(),
                        onValueChange = { viewModel.audioFx.setBandLevel(band.index, it.toInt()) },
                        valueRange = band.rangeMb.first.toFloat()..band.rangeMb.last.toFloat(),
                        enabled = fx.equalizerEnabled,
                    )
                }
            }
        }
    }
}

@UnstableApi
@Composable
private fun SubtitleSheet(viewModel: PlayerViewModel) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val session by viewModel.subtitleManager.session.collectAsState()
    val settings by viewModel.settings.collectAsStateWithLifecycle()

    val picker = rememberLauncherForActivityResult(
        ActivityResultContracts.OpenDocument(),
    ) { uri: Uri? ->
        uri ?: return@rememberLauncherForActivityResult
        val prefs = settings ?: return@rememberLauncherForActivityResult
        viewModel.loadSubtitleFromUri(uri, prefs.subtitleEncoding)
    }

    LazyColumn(modifier = Modifier.padding(bottom = 24.dp)) {
        item { SheetTitle("Subtitles") }

        if (state.textTracks.isNotEmpty()) {
            item { SheetSection("Embedded tracks") }
            items(state.textTracks) { track ->
                ListItem(
                    headlineContent = { Text(track.label) },
                    leadingContent = {
                        RadioButton(selected = track.selected, onClick = { viewModel.selectTrack(track) })
                    },
                )
            }
        }

        if (session.availableSidecars.isNotEmpty()) {
            item { SheetSection("In this folder") }
            items(session.availableSidecars) { path ->
                ListItem(
                    headlineContent = { Text(path.substringAfterLast('/')) },
                    modifier = Modifier.clickableSubtitle {
                        settings?.let { viewModel.loadSubtitleFromPath(path, it.subtitleEncoding) }
                    },
                )
            }
        }

        if (session.recent.isNotEmpty()) {
            item { SheetSection("Recent") }
            items(session.recent) { source ->
                ListItem(
                    headlineContent = { Text(source.substringAfterLast('/')) },
                    modifier = Modifier.clickableSubtitle {
                        settings?.let { viewModel.loadSubtitleFromPath(source, it.subtitleEncoding) }
                    },
                )
            }
        }

        item {
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.padding(16.dp),
            ) {
                OutlinedButton(onClick = {
                    picker.launch(arrayOf("*/*"))
                }) { Text("Open file…") }
                if (session.track != null || state.textTracks.any { it.selected }) {
                    TextButton(onClick = viewModel::disableTextTracks) { Text("Turn off") }
                }
            }
        }

        item { HorizontalDivider() }
        item {
            SheetSection("Delay: ${session.delayMs} ms")
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(horizontal = 16.dp),
            ) {
                OutlinedButton(onClick = { viewModel.setSubtitleDelay(-100) }) { Text("−100 ms") }
                OutlinedButton(onClick = { viewModel.setSubtitleDelay(100) }) { Text("+100 ms") }
                TextButton(onClick = { viewModel.setSubtitleDelay(-session.delayMs) }) { Text("Reset") }
            }
        }
    }
}

@UnstableApi
@Composable
private fun SleepSheet(viewModel: PlayerViewModel, onDismiss: () -> Unit) {
    val timerState by viewModel.sleepTimerState.collectAsStateWithLifecycle()

    SheetTitle("Sleep timer")
    (timerState as? SleepTimerState.Running)?.let {
        Text(
            "Pausing in ${Formatters.duration(it.remainingMs)}",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(horizontal = 16.dp),
        )
    }
    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.horizontalScrollable()) {
            SLEEP_PRESETS_MIN.forEach { minutes ->
                FilterChip(
                    selected = false,
                    onClick = {
                        viewModel.sleepTimer.start(minutes * 60_000L)
                        onDismiss()
                    },
                    label = { Text("$minutes min") },
                )
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedButton(onClick = { viewModel.sleepTimer.startEndOfVideo(); onDismiss() }) {
                Text("End of video")
            }
            if (timerState !is SleepTimerState.Off) {
                TextButton(onClick = { viewModel.sleepTimer.cancel(); onDismiss() }) { Text("Cancel timer") }
            }
        }
    }
}

@UnstableApi
@Composable
private fun EnhanceSheet(viewModel: PlayerViewModel) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val enhance = state.enhance

    SheetTitle("Enhancement")
    if (!state.enhanceSupported) {
        Text(
            "This device's GPU pipeline doesn't support live enhancement.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(16.dp),
        )
        return
    }
    ListItem(
        headlineContent = { Text("Enhance video") },
        supportingContent = { Text("GPU contrast, color, and clarity — toggles live during playback") },
        trailingContent = {
            Switch(
                checked = enhance.enabled,
                onCheckedChange = { viewModel.setEnhance(enhance.copy(enabled = it)) },
            )
        },
    )
    Column(Modifier.padding(horizontal = 16.dp, vertical = 4.dp)) {
        Text("Contrast", style = MaterialTheme.typography.labelSmall)
        Slider(
            value = enhance.contrastBoost,
            onValueChange = { viewModel.setEnhance(enhance.copy(contrastBoost = it)) },
            valueRange = 0f..0.5f,
            enabled = enhance.enabled,
        )
        Text("Color", style = MaterialTheme.typography.labelSmall)
        Slider(
            value = enhance.colorBoost,
            onValueChange = { viewModel.setEnhance(enhance.copy(colorBoost = it)) },
            valueRange = 0f..40f,
            enabled = enhance.enabled,
        )
        Text("Brightness", style = MaterialTheme.typography.labelSmall)
        Slider(
            value = enhance.brightnessLift,
            onValueChange = { viewModel.setEnhance(enhance.copy(brightnessLift = it)) },
            valueRange = 0f..0.2f,
            enabled = enhance.enabled,
        )
    }
}

// --- Small shared pieces -----------------------------------------------------

@Composable
private fun SheetTitle(text: String) {
    Text(
        text,
        style = MaterialTheme.typography.titleLarge,
        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
    )
}

@Composable
private fun SheetSection(text: String) {
    Text(
        text,
        style = MaterialTheme.typography.titleSmall,
        color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
    )
}

@Composable
private fun Modifier.horizontalScrollable(): Modifier =
    horizontalScroll(rememberScrollState())

private fun Modifier.clickableSubtitle(onClick: () -> Unit): Modifier =
    clickable(onClick = onClick)
