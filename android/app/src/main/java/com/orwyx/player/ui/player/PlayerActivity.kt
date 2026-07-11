package com.orwyx.player.ui.player

import android.app.PictureInPictureParams
import android.content.Context
import android.content.Intent
import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.os.Build
import android.os.Bundle
import android.util.Rational
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.lifecycleScope
import androidx.media3.common.util.UnstableApi
import com.orwyx.player.player.PlaybackService
import com.orwyx.player.ui.theme.OrwyxTheme
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

/**
 * Fullscreen playback container.
 *
 * Handles what must live at the Activity level: immersive mode, screen-on,
 * window brightness (gesture), Picture-in-Picture, orientation policy, and
 * starting [PlaybackService] so the media notification / background audio work.
 * All playback logic lives in [PlayerViewModel].
 */
@UnstableApi
@AndroidEntryPoint
class PlayerActivity : ComponentActivity() {

    private val viewModel: PlayerViewModel by viewModels()
    private var inPip = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        val videoId = intent.getLongExtra(EXTRA_VIDEO_ID, -1L).takeIf { it > 0 }
        val externalUri = if (videoId == null) intent.data else null
        viewModel.initialize(videoId, externalUri)

        startService(Intent(this, PlaybackService::class.java))

        lifecycleScope.launch {
            val settings = viewModel.settings.value ?: return@launch
            requestedOrientation = if (settings.autoRotate) {
                ActivityInfo.SCREEN_ORIENTATION_SENSOR
            } else {
                ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
            }
        }

        setContent {
            OrwyxTheme {
                val state by viewModel.state.collectAsState()
                HideSystemBars(hidden = !state.controlsVisible)
                PlayerScreen(
                    viewModel = viewModel,
                    onSetBrightness = ::setWindowBrightness,
                    onEnterPip = ::enterPip,
                    onExit = { finish() },
                )
            }
        }
    }

    /** Gesture brightness: window-level so it never touches system settings. */
    private fun setWindowBrightness(value: Float) {
        window.attributes = window.attributes.apply {
            screenBrightness = value.coerceIn(0.01f, 1f)
        }
    }

    private fun enterPip() {
        val video = viewModel.state.value.video
        val ratio = if (video != null && video.width > 0 && video.height > 0) {
            Rational(video.width.coerceIn(1, 10_000), video.height.coerceIn(1, 10_000))
        } else {
            Rational(16, 9)
        }
        // PiP aspect ratios must stay within the platform's allowed 0.42–2.39 range.
        val clamped = when {
            ratio.toFloat() > 2.35f -> Rational(235, 100)
            ratio.toFloat() < 0.45f -> Rational(45, 100)
            else -> ratio
        }
        runCatching {
            enterPictureInPictureMode(
                PictureInPictureParams.Builder().setAspectRatio(clamped).build(),
            )
        }
    }

    @Deprecated("Platform callback; PiP-on-home remains intent-driven")
    override fun onUserLeaveHint() {
        super.onUserLeaveHint()
        if (viewModel.state.value.isPlaying) enterPip()
    }

    override fun onPictureInPictureModeChanged(
        isInPictureInPictureMode: Boolean,
        newConfig: Configuration,
    ) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
        inPip = isInPictureInPictureMode
        viewModel.setControlsVisible(!isInPictureInPictureMode)
    }

    override fun onStop() {
        super.onStop()
        viewModel.onUiStopped(inPictureInPicture = inPip)
    }

    companion object {
        private const val EXTRA_VIDEO_ID = "video_id"

        fun intent(context: Context, videoId: Long): Intent =
            Intent(context, PlayerActivity::class.java).putExtra(EXTRA_VIDEO_ID, videoId)
    }
}

@androidx.compose.runtime.Composable
private fun HideSystemBars(hidden: Boolean) {
    val view = androidx.compose.ui.platform.LocalView.current
    androidx.compose.runtime.LaunchedEffect(hidden) {
        val window = (view.context as ComponentActivity).window
        val controller = WindowCompat.getInsetsController(window, view)
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        if (hidden) {
            controller.hide(WindowInsetsCompat.Type.systemBars())
        } else {
            controller.show(WindowInsetsCompat.Type.systemBars())
        }
    }
}
