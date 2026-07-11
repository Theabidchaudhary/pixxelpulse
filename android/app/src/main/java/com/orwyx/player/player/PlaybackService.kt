package com.orwyx.player.player

import android.content.Intent
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

/**
 * Media3 session service.
 *
 * Wraps the shared [PlayerEngine] player in a [MediaSession], which provides:
 *  - the playback notification (play/pause/next/previous),
 *  - lockscreen and Bluetooth/headset button handling,
 *  - background (audio-only) playback when the user enables it — the video
 *    surface detaches with the UI while audio continues here.
 */
@UnstableApi
@AndroidEntryPoint
class PlaybackService : MediaSessionService() {

    @Inject
    lateinit var engine: PlayerEngine

    private var mediaSession: MediaSession? = null

    override fun onCreate() {
        super.onCreate()
        engine.player?.let { player ->
            mediaSession = MediaSession.Builder(this, player).build()
        }
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? =
        mediaSession

    /** Swiping the app away stops playback: no zombie background audio. */
    override fun onTaskRemoved(rootIntent: Intent?) {
        val player = mediaSession?.player
        if (player == null || !player.playWhenReady) {
            stopSelf()
        }
    }

    override fun onDestroy() {
        mediaSession?.release()
        mediaSession = null
        super.onDestroy()
    }
}
