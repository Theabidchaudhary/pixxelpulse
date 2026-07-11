package com.orwyx.player.ui.settings

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.orwyx.player.data.repository.VideoRepository
import com.orwyx.player.data.settings.AppSettings
import com.orwyx.player.data.settings.BatteryMode
import com.orwyx.player.data.settings.DecoderMode
import com.orwyx.player.data.settings.ResumeMode
import com.orwyx.player.data.settings.SettingsRepository
import com.orwyx.player.data.settings.ThemeMode
import com.orwyx.player.domain.model.VideoFolder
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    val repo: SettingsRepository,
    videoRepository: VideoRepository,
) : ViewModel() {
    val settings: StateFlow<AppSettings> = repo.settings
        .stateIn(viewModelScope, SharingStarted.Eagerly, AppSettings())

    val hiddenFolders: StateFlow<List<VideoFolder>> = videoRepository.hiddenFolders
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun set(block: suspend SettingsRepository.() -> Unit) {
        viewModelScope.launch { repo.block() }
    }
}

/** All app settings, grouped: theme, playback, library, subtitles, battery. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onBack: () -> Unit,
    viewModel: SettingsViewModel = hiltViewModel(),
) {
    val s by viewModel.settings.collectAsState()
    val hiddenFolders by viewModel.hiddenFolders.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")
                    }
                },
            )
        },
    ) { padding ->
        LazyColumn(Modifier.padding(padding)) {
            item { Section("Theme") }
            item {
                ChipRow(
                    options = ThemeMode.entries.map { it.name.lowercase().replaceFirstChar(Char::uppercase) },
                    selectedIndex = s.themeMode.ordinal,
                    onSelect = { viewModel.set { setThemeMode(ThemeMode.entries[it]) } },
                )
            }
            item { HorizontalDivider(Modifier.padding(vertical = 8.dp)) }

            item { Section("Playback") }
            item {
                LabeledSlider(
                    label = "Default speed: ${"%.2f".format(s.defaultSpeed)}×",
                    value = s.defaultSpeed,
                    range = 0.25f..3f,
                    steps = 10,
                    onChange = { viewModel.set { setDefaultSpeed(it) } },
                )
            }
            item {
                Section("Resume playback", small = true)
                ChipRow(
                    options = listOf("Always", "Ask", "Never"),
                    selectedIndex = s.resumeMode.ordinal,
                    onSelect = { viewModel.set { setResumeMode(ResumeMode.entries[it]) } },
                )
            }
            item {
                ToggleRow(
                    "Auto rotate",
                    "Orientation always matches the video; this allows flipping upside down via the sensor",
                    s.autoRotate,
                ) {
                    viewModel.set { setAutoRotate(it) }
                }
            }
            item {
                ToggleRow(
                    "Background playback",
                    "Keep audio playing when you leave the player",
                    s.backgroundPlayback,
                ) { viewModel.set { setBackgroundPlayback(it) } }
            }
            item {
                LabeledSlider(
                    label = "Gesture sensitivity: ${"%.1f".format(s.gestureSensitivity)}",
                    value = s.gestureSensitivity,
                    range = 0.5f..2f,
                    onChange = { viewModel.set { setGestureSensitivity(it) } },
                )
            }
            item {
                LabeledSlider(
                    label = "Double-tap skip: ${s.seekStepSeconds}s",
                    value = s.seekStepSeconds.toFloat(),
                    range = 5f..60f,
                    steps = 10,
                    onChange = { viewModel.set { setSeekStepSeconds(it.toInt()) } },
                )
            }
            item {
                Section("Decoder", small = true)
                ChipRow(
                    options = listOf("Auto", "Hardware", "Software"),
                    selectedIndex = s.decoderMode.ordinal,
                    onSelect = { viewModel.set { setDecoderMode(DecoderMode.entries[it]) } },
                )
            }
            item {
                ToggleRow("Remember zoom", "Reopen videos with the last zoom mode", s.rememberZoom) {
                    viewModel.set { setRememberZoom(it) }
                }
            }
            item { HorizontalDivider(Modifier.padding(vertical = 8.dp)) }

            item { Section("Library") }
            item {
                ToggleRow("Auto scan", "Rescan the library when the app opens", s.autoScan) {
                    viewModel.set { setAutoScan(it) }
                }
            }
            if (hiddenFolders.isNotEmpty()) {
                item { Section("Hidden folders", small = true) }
                items(hiddenFolders, key = { it.path }) { folder ->
                    ListItem(
                        headlineContent = { Text(folder.name) },
                        supportingContent = { Text(folder.path, maxLines = 1) },
                        trailingContent = {
                            IconButton(onClick = { viewModel.set { toggleHiddenFolder(folder.path) } }) {
                                Icon(Icons.Filled.Visibility, "Unhide")
                            }
                        },
                    )
                }
            }
            item { HorizontalDivider(Modifier.padding(vertical = 8.dp)) }

            item { Section("Subtitles") }
            item {
                ToggleRow("Auto load", "Load matching subtitles from the video's folder", s.subtitleAutoLoad) {
                    viewModel.set { setSubtitleAutoLoad(it) }
                }
            }
            item {
                LabeledSlider(
                    label = "Text size: ${(s.subtitleTextScale * 100).toInt()}%",
                    value = s.subtitleTextScale,
                    range = 0.6f..2f,
                    onChange = { viewModel.set { setSubtitleTextScale(it) } },
                )
            }
            item {
                ToggleRow("Outline", null, s.subtitleOutline) { viewModel.set { setSubtitleOutline(it) } }
            }
            item {
                ToggleRow("Shadow", null, s.subtitleShadow) { viewModel.set { setSubtitleShadow(it) } }
            }
            item {
                ToggleRow("Background", null, s.subtitleBackground) {
                    viewModel.set { setSubtitleBackground(it) }
                }
            }
            item {
                LabeledSlider(
                    label = "Vertical position",
                    value = s.subtitleBottomOffsetFraction,
                    range = 0.02f..0.4f,
                    onChange = { viewModel.set { setSubtitleBottomOffset(it) } },
                )
            }
            item {
                LabeledSlider(
                    label = "Opacity: ${(s.subtitleOpacity * 100).toInt()}%",
                    value = s.subtitleOpacity,
                    range = 0.3f..1f,
                    onChange = { viewModel.set { setSubtitleOpacity(it) } },
                )
            }
            item { HorizontalDivider(Modifier.padding(vertical = 8.dp)) }

            item { Section("Battery") }
            item {
                ChipRow(
                    options = listOf("Battery saver", "Balanced", "High performance"),
                    selectedIndex = s.batteryMode.ordinal,
                    onSelect = { viewModel.set { setBatteryMode(BatteryMode.entries[it]) } },
                )
            }
            item {
                Text(
                    "Battery saver trims buffering and prefers hardware decoding. " +
                        "High performance buffers further ahead for heavy files.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                )
            }
        }
    }
}

@Composable
private fun Section(title: String, small: Boolean = false) {
    Text(
        title,
        style = if (small) MaterialTheme.typography.titleSmall else MaterialTheme.typography.titleMedium,
        color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
    )
}

@Composable
private fun ToggleRow(title: String, subtitle: String?, checked: Boolean, onChange: (Boolean) -> Unit) {
    ListItem(
        headlineContent = { Text(title) },
        supportingContent = subtitle?.let { { Text(it) } },
        trailingContent = { Switch(checked = checked, onCheckedChange = onChange) },
    )
}

@Composable
private fun LabeledSlider(
    label: String,
    value: Float,
    range: ClosedFloatingPointRange<Float>,
    onChange: (Float) -> Unit,
    steps: Int = 0,
) {
    Column(Modifier.padding(horizontal = 16.dp)) {
        Text(label, style = MaterialTheme.typography.bodyMedium)
        Slider(value = value, onValueChange = onChange, valueRange = range, steps = steps)
    }
}

@Composable
private fun ChipRow(options: List<String>, selectedIndex: Int, onSelect: (Int) -> Unit) {
    Row(Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp)) {
        options.forEachIndexed { index, label ->
            FilterChip(
                selected = index == selectedIndex,
                onClick = { onSelect(index) },
                label = { Text(label) },
                modifier = Modifier.padding(end = 8.dp),
            )
        }
    }
}
