package com.orwyx.player.player.subtitle

import android.content.Context
import android.net.Uri
import com.orwyx.player.core.util.MediaFormats
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.withContext
import java.io.File
import java.nio.charset.Charset
import javax.inject.Inject
import javax.inject.Singleton

/** External subtitle state for the current playback session. */
data class SubtitleSession(
    val track: SubtitleTrack? = null,
    val availableSidecars: List<String> = emptyList(),
    val delayMs: Long = 0,
    val recent: List<String> = emptyList(),
)

/**
 * Loads and serves external subtitles.
 *
 * Discovery order:
 *  1. Sidecar files in the video's folder that share its base name ("movie.srt"
 *     next to "movie.mkv"), or failing that any subtitle file in the folder.
 *  2. Manual picks through the system file picker.
 *
 * Delay is applied at lookup time — [cueFor] shifts the probe position — so it
 * is instant in both directions with no re-parsing.
 */
@Singleton
class SubtitleManager @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val _session = MutableStateFlow(SubtitleSession())
    val session: StateFlow<SubtitleSession> = _session

    /** Scans the video's folder for sidecar subtitle files and auto-loads the best match. */
    suspend fun prepareFor(videoPath: String, autoLoad: Boolean, encoding: String, frameRate: Float) =
        withContext(Dispatchers.IO) {
            val folder = File(videoPath).parentFile
            val baseName = File(videoPath).nameWithoutExtension.lowercase()
            val sidecars = folder?.listFiles { f -> f.isFile && MediaFormats.isSubtitleFile(f.name) }
                ?.sortedByDescending { it.nameWithoutExtension.lowercase().startsWith(baseName) }
                ?.map { it.absolutePath }
                .orEmpty()

            _session.value = SubtitleSession(availableSidecars = sidecars, recent = _session.value.recent)

            val best = sidecars.firstOrNull {
                File(it).nameWithoutExtension.lowercase().startsWith(baseName)
            }
            if (autoLoad && best != null) loadFromPath(best, encoding, frameRate)
        }

    suspend fun loadFromPath(path: String, encoding: String, frameRate: Float) =
        withContext(Dispatchers.IO) {
            runCatching {
                File(path).inputStream().use { stream ->
                    SubtitleParsers.parse(File(path).name, stream, charsetOf(encoding), frameRate)
                }
            }.onSuccess { setTrack(it, path) }
        }

    /** Manual pick via the Storage Access Framework. */
    suspend fun loadFromUri(uri: Uri, displayName: String, encoding: String, frameRate: Float) =
        withContext(Dispatchers.IO) {
            runCatching {
                context.contentResolver.openInputStream(uri)?.use { stream ->
                    SubtitleParsers.parse(displayName, stream, charsetOf(encoding), frameRate)
                } ?: error("Cannot open $uri")
            }.onSuccess { setTrack(it, uri.toString()) }
        }

    fun setDelay(delayMs: Long) {
        _session.value = _session.value.copy(delayMs = delayMs.coerceIn(-30_000, 30_000))
    }

    fun clearTrack() {
        _session.value = _session.value.copy(track = null, delayMs = 0)
    }

    /** Active cue for the playback position, delay applied. */
    fun cueFor(positionMs: Long): SubtitleCue? {
        val s = _session.value
        return s.track?.cueAt(positionMs - s.delayMs)
    }

    /** Full-text dialogue search across the loaded track (find a line, jump to it). */
    fun searchDialogue(query: String): List<SubtitleCue> {
        val track = _session.value.track ?: return emptyList()
        if (query.isBlank()) return emptyList()
        return track.cues.filter { it.text.contains(query, ignoreCase = true) }.take(50)
    }

    private fun setTrack(track: SubtitleTrack, source: String) {
        val recent = (listOf(source) + _session.value.recent).distinct().take(10)
        _session.value = _session.value.copy(track = track, recent = recent, delayMs = 0)
    }

    private fun charsetOf(name: String): Charset =
        runCatching { Charset.forName(name) }.getOrDefault(Charsets.UTF_8)
}
