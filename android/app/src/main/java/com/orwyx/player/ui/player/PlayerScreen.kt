package com.orwyx.player.ui.player

import android.content.Context
import android.media.AudioManager
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.VolumeUp
import androidx.compose.material.icons.filled.AspectRatio
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Bedtime
import androidx.compose.material.icons.filled.BrightnessMedium
import androidx.compose.material.icons.filled.FastForward
import androidx.compose.material.icons.filled.FastRewind
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PictureInPictureAlt
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material.icons.filled.RepeatOne
import androidx.compose.material.icons.filled.Shuffle
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Subtitles
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.util.UnstableApi
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView
import com.orwyx.player.core.util.Formatters
import com.orwyx.player.data.settings.ZoomMode
import kotlinx.coroutines.delay

/** Which bottom sheet is open. */
enum class PlayerSheet { NONE, SPEED, AUDIO, SUBTITLES, SLEEP, ENHANCE }

/** Transient gesture feedback HUD. */
private sealed interface Hud {
    data class Brightness(val fraction: Float) : Hud
    data class Volume(val fraction: Float) : Hud
    data class Seek(val targetMs: Long, val deltaMs: Long) : Hud
    data object HoldSpeed : Hud
}

@UnstableApi
@Composable
fun PlayerScreen(
    viewModel: PlayerViewModel,
    onSetBrightness: (Float) -> Unit,
    onEnterPip: () -> Unit,
    onExit: () -> Unit,
) {
    val state by viewModel.state.collectAsState()
    val settings by viewModel.settings.collectAsState()
    val sleepState by viewModel.sleepTimerState.collectAsState()
    val context = LocalContext.current
    val audioManager = remember { context.getSystemService(Context.AUDIO_SERVICE) as AudioManager }

    var sheet by remember { mutableStateOf(PlayerSheet.NONE) }
    var hud by remember { mutableStateOf<Hud?>(null) }
    var zoomScale by remember { mutableFloatStateOf(1f) }
    var zoomOffset by remember { mutableStateOf(Offset.Zero) }

    // Gesture working values.
    var brightness by remember { mutableFloatStateOf(0.5f) }
    var volumeFraction by remember {
        val max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC).toFloat()
        mutableFloatStateOf(audioManager.getStreamVolume(AudioManager.STREAM_MUSIC) / max)
    }
    var seekTargetMs by remember { mutableFloatStateOf(0f) }

    // Auto-hide controls and HUD.
    LaunchedEffect(state.controlsVisible, state.isPlaying) {
        if (state.controlsVisible && state.isPlaying) {
            delay(3_500)
            viewModel.setControlsVisible(false)
        }
    }
    LaunchedEffect(hud) {
        if (hud != null && hud !is Hud.Seek && hud !is Hud.HoldSpeed) {
            delay(900)
            hud = null
        }
    }

    val gestureListener = remember(settings) {
        object : PlayerGestureListener {
            override fun onTap() {
                val current = viewModel.state.value
                if (!current.locked) {
                    viewModel.setControlsVisible(!current.controlsVisible)
                }
            }

            override fun onDoubleTap(zone: Int) {
                val step = (settings?.seekStepSeconds ?: 10) * 1000L
                when (zone) {
                    -1 -> viewModel.seekBy(-step)
                    1 -> viewModel.seekBy(step)
                    else -> viewModel.togglePlayPause()
                }
            }

            override fun onLongPressStart() {
                viewModel.setHoldSpeed(true)
                hud = Hud.HoldSpeed
            }

            override fun onLongPressEnd() {
                if (viewModel.state.value.holdSpeedActive) {
                    viewModel.setHoldSpeed(false)
                    hud = null
                }
            }

            override fun onDragStart(mode: DragMode) {
                if (mode == DragMode.SEEK) seekTargetMs = viewModel.state.value.positionMs.toFloat()
            }

            override fun onDragDelta(mode: DragMode, normalizedDelta: Float) {
                when (mode) {
                    DragMode.BRIGHTNESS -> {
                        brightness = (brightness + normalizedDelta).coerceIn(0.01f, 1f)
                        onSetBrightness(brightness)
                        hud = Hud.Brightness(brightness)
                    }
                    DragMode.VOLUME -> {
                        volumeFraction = (volumeFraction + normalizedDelta).coerceIn(0f, 1f)
                        val max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
                        audioManager.setStreamVolume(
                            AudioManager.STREAM_MUSIC,
                            (volumeFraction * max).toInt(),
                            0,
                        )
                        hud = Hud.Volume(volumeFraction)
                    }
                    DragMode.SEEK -> {
                        // Full screen width sweeps two minutes; sensitivity scales this.
                        seekTargetMs = (seekTargetMs + normalizedDelta * 120_000f)
                            .coerceIn(0f, viewModel.state.value.durationMs.toFloat())
                        hud = Hud.Seek(
                            targetMs = seekTargetMs.toLong(),
                            deltaMs = seekTargetMs.toLong() - viewModel.state.value.positionMs,
                        )
                    }
                    DragMode.NONE -> Unit
                }
            }

            override fun onDragEnd(mode: DragMode) {
                if (mode == DragMode.SEEK) viewModel.seekTo(seekTargetMs.toLong())
                hud = null
            }

            override fun onPinch(zoomFactor: Float, pan: Offset) {
                zoomScale = (zoomScale * zoomFactor).coerceIn(0.5f, 4f)
                zoomOffset += pan
            }

            override fun onTwoFingerTap() {
                viewModel.setLocked(!viewModel.state.value.locked)
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
            .playerGestures(
                listener = gestureListener,
                sensitivity = settings?.gestureSensitivity ?: 1f,
                locked = state.locked,
            ),
    ) {
        // Video surface. PlayerView handles the surface lifecycle + resize modes;
        // pinch zoom/pan are applied as a GPU layer transform on top.
        AndroidView(
            factory = { ctx ->
                PlayerView(ctx).apply {
                    useController = false
                    subtitleView?.visibility = android.view.View.GONE
                    setShutterBackgroundColor(android.graphics.Color.BLACK)
                }
            },
            update = { view ->
                view.player = viewModel.enginePlayer()
                view.resizeMode = when (state.zoomMode) {
                    ZoomMode.FIT -> AspectRatioFrameLayout.RESIZE_MODE_FIT
                    ZoomMode.FILL -> AspectRatioFrameLayout.RESIZE_MODE_ZOOM
                    ZoomMode.STRETCH -> AspectRatioFrameLayout.RESIZE_MODE_FILL
                    ZoomMode.ORIGINAL -> AspectRatioFrameLayout.RESIZE_MODE_FIXED_WIDTH
                }
            },
            modifier = Modifier
                .fillMaxSize()
                .graphicsLayer {
                    scaleX = zoomScale
                    scaleY = zoomScale
                    translationX = zoomOffset.x
                    translationY = zoomOffset.y
                },
        )

        if (state.isBuffering) {
            CircularProgressIndicator(Modifier.align(Alignment.Center), color = Color.White)
        }

        // Owned subtitle rendering (external + embedded share this overlay).
        settings?.let { s ->
            SubtitleOverlay(
                text = state.subtitleText,
                settings = s,
                modifier = Modifier.align(Alignment.BottomCenter),
            )
        }

        GestureHud(hud, Modifier.align(Alignment.Center))

        if (state.locked) {
            IconButton(
                onClick = { viewModel.setLocked(false) },
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(24.dp),
            ) {
                Icon(Icons.Filled.Lock, contentDescription = "Unlock", tint = Color.White)
            }
        } else {
            PlayerControls(
                state = state,
                sleepActive = sleepState !is com.orwyx.player.player.SleepTimerState.Off,
                onExit = onExit,
                onOpenSheet = { sheet = it },
                onEnterPip = onEnterPip,
                viewModel = viewModel,
                onResetZoom = { zoomScale = 1f; zoomOffset = Offset.Zero },
            )
        }

        state.error?.let { error ->
            Text(
                text = "Playback error: $error",
                color = Color.White,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 120.dp)
                    .background(Color(0xAA000000), RoundedCornerShape(8.dp))
                    .padding(12.dp),
            )
        }
    }

    PlayerSheets(
        sheet = sheet,
        onDismiss = { sheet = PlayerSheet.NONE },
        viewModel = viewModel,
    )
}

@UnstableApi
@Composable
private fun PlayerControls(
    state: PlayerUiState,
    sleepActive: Boolean,
    onExit: () -> Unit,
    onOpenSheet: (PlayerSheet) -> Unit,
    onEnterPip: () -> Unit,
    onResetZoom: () -> Unit,
    viewModel: PlayerViewModel,
) {
    val white = Color.White

    AnimatedVisibility(
        visible = state.controlsVisible,
        enter = fadeIn() + slideInVertically { -it / 3 },
        exit = fadeOut() + slideOutVertically { -it / 3 },
    ) {
        // Top bar: back, title, subtitle/audio/enhance/sleep shortcuts.
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(listOf(Color(0xB3000000), Color.Transparent)),
                )
                .statusBarsPadding()
                .padding(horizontal = 4.dp),
        ) {
            IconButton(onClick = onExit) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back", tint = white)
            }
            Text(
                text = state.video?.title ?: "",
                style = MaterialTheme.typography.titleMedium,
                color = white,
                maxLines = 1,
                modifier = Modifier.weight(1f),
            )
            IconButton(onClick = { onOpenSheet(PlayerSheet.SUBTITLES) }) {
                Icon(Icons.Filled.Subtitles, "Subtitles", tint = white)
            }
            IconButton(onClick = { onOpenSheet(PlayerSheet.AUDIO) }) {
                Icon(Icons.AutoMirrored.Filled.VolumeUp, "Audio", tint = white)
            }
            IconButton(onClick = { onOpenSheet(PlayerSheet.ENHANCE) }) {
                Icon(
                    Icons.Filled.AutoAwesome,
                    "Enhance",
                    tint = if (state.enhance.enabled) MaterialTheme.colorScheme.primary else white,
                )
            }
            IconButton(onClick = { onOpenSheet(PlayerSheet.SLEEP) }) {
                Icon(
                    Icons.Filled.Bedtime,
                    "Sleep timer",
                    tint = if (sleepActive) MaterialTheme.colorScheme.primary else white,
                )
            }
        }
    }

    Box(Modifier.fillMaxSize()) {
        // Center transport cluster.
        AnimatedVisibility(
            visible = state.controlsVisible,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.align(Alignment.Center),
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(24.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = viewModel::previous) {
                    Icon(Icons.Filled.SkipPrevious, "Previous", tint = white, modifier = Modifier.size(36.dp))
                }
                IconButton(onClick = { viewModel.stepFrame(false) }) {
                    Icon(Icons.Filled.FastRewind, "Frame back", tint = white)
                }
                IconButton(onClick = viewModel::togglePlayPause, modifier = Modifier.size(72.dp)) {
                    Icon(
                        if (state.isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                        "Play/Pause",
                        tint = white,
                        modifier = Modifier.size(56.dp),
                    )
                }
                IconButton(onClick = { viewModel.stepFrame(true) }) {
                    Icon(Icons.Filled.FastForward, "Frame forward", tint = white)
                }
                IconButton(onClick = viewModel::next) {
                    Icon(Icons.Filled.SkipNext, "Next", tint = white, modifier = Modifier.size(36.dp))
                }
            }
        }

        // Bottom bar: timeline + secondary actions.
        AnimatedVisibility(
            visible = state.controlsVisible,
            enter = fadeIn() + slideInVertically { it / 3 },
            exit = fadeOut() + slideOutVertically { it / 3 },
            modifier = Modifier.align(Alignment.BottomCenter),
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(listOf(Color.Transparent, Color(0xCC000000))),
                    )
                    .navigationBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        Formatters.duration(state.positionMs),
                        style = MaterialTheme.typography.labelMedium,
                        color = white,
                    )
                    Slider(
                        value = state.positionMs.toFloat()
                            .coerceIn(0f, state.durationMs.toFloat().coerceAtLeast(1f)),
                        onValueChange = { viewModel.seekTo(it.toLong()) },
                        valueRange = 0f..state.durationMs.toFloat().coerceAtLeast(1f),
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 8.dp),
                    )
                    Text(
                        Formatters.duration(state.durationMs),
                        style = MaterialTheme.typography.labelMedium,
                        color = white,
                    )
                }
                Row(
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    IconButton(onClick = { onOpenSheet(PlayerSheet.SPEED) }) {
                        Icon(Icons.Filled.Speed, "Speed", tint = if (state.speed != 1f) MaterialTheme.colorScheme.primary else white)
                    }
                    IconButton(onClick = {
                        val next = ZoomMode.entries[(state.zoomMode.ordinal + 1) % ZoomMode.entries.size]
                        viewModel.setZoomMode(next)
                        onResetZoom()
                    }) {
                        Icon(Icons.Filled.AspectRatio, "Zoom mode", tint = white)
                    }
                    IconButton(onClick = viewModel::cycleRepeat) {
                        Icon(
                            if (state.repeatState == RepeatState.ONE) Icons.Filled.RepeatOne else Icons.Filled.Repeat,
                            "Repeat",
                            tint = if (state.repeatState != RepeatState.OFF) MaterialTheme.colorScheme.primary else white,
                        )
                    }
                    IconButton(onClick = viewModel::toggleShuffle) {
                        Icon(
                            Icons.Filled.Shuffle,
                            "Shuffle",
                            tint = if (state.shuffle) MaterialTheme.colorScheme.primary else white,
                        )
                    }
                    IconButton(onClick = { viewModel.setLocked(true) }) {
                        Icon(Icons.Filled.LockOpen, "Lock", tint = white)
                    }
                    IconButton(onClick = onEnterPip) {
                        Icon(Icons.Filled.PictureInPictureAlt, "Picture in picture", tint = white)
                    }
                }
            }
        }
    }
}

@Composable
private fun GestureHud(hud: Hud?, modifier: Modifier = Modifier) {
    AnimatedVisibility(visible = hud != null, enter = fadeIn(), exit = fadeOut(), modifier = modifier) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .background(Color(0xCC15171B), RoundedCornerShape(16.dp))
                .padding(horizontal = 24.dp, vertical = 16.dp),
        ) {
            when (hud) {
                is Hud.Brightness -> {
                    Icon(Icons.Filled.BrightnessMedium, null, tint = Color.White)
                    HudBar(hud.fraction)
                }
                is Hud.Volume -> {
                    Icon(Icons.AutoMirrored.Filled.VolumeUp, null, tint = Color.White)
                    HudBar(hud.fraction)
                }
                is Hud.Seek -> {
                    val sign = if (hud.deltaMs >= 0) "+" else "−"
                    Text(
                        Formatters.duration(hud.targetMs),
                        style = MaterialTheme.typography.headlineSmall,
                        color = Color.White,
                    )
                    Text(
                        "$sign${Formatters.duration(kotlin.math.abs(hud.deltaMs))}",
                        style = MaterialTheme.typography.labelMedium,
                        color = Color(0xFFB9BEC7),
                    )
                }
                is Hud.HoldSpeed -> Text(
                    "2× speed",
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White,
                )
                null -> Unit
            }
        }
    }
}

@Composable
private fun HudBar(fraction: Float) {
    LinearProgressIndicator(
        progress = { fraction },
        modifier = Modifier
            .padding(top = 10.dp)
            .fillMaxWidth(0.35f),
    )
}
