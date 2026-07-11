package com.orwyx.player.data.scanner

import android.content.Context
import android.media.MediaExtractor
import android.media.MediaFormat
import android.net.Uri
import com.orwyx.player.core.util.MediaFormats
import com.orwyx.player.domain.model.HdrType
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

/** Deep track info resolved lazily after the fast MediaStore scan. */
data class TrackMetadata(
    val width: Int,
    val height: Int,
    val frameRate: Float,
    val bitrate: Long,
    val durationMs: Long,
    val videoCodec: String?,
    val audioCodec: String?,
    val hdrType: HdrType,
)

/**
 * Extracts codec, frame-rate, and HDR information with [MediaExtractor].
 *
 * MediaStore is fast but shallow; this pass fills in what card badges and the
 * HDR pipeline need. It runs in small background batches so scanning stays cheap.
 */
@Singleton
class MetadataExtractor @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    suspend fun extract(uri: Uri): TrackMetadata? = withContext(Dispatchers.IO) {
        val extractor = MediaExtractor()
        try {
            extractor.setDataSource(context, uri, null)
            var video: MediaFormat? = null
            var audio: MediaFormat? = null
            for (i in 0 until extractor.trackCount) {
                val format = extractor.getTrackFormat(i)
                val mime = format.getString(MediaFormat.KEY_MIME) ?: continue
                when {
                    video == null && mime.startsWith("video/") -> video = format
                    audio == null && mime.startsWith("audio/") -> audio = format
                }
            }
            val v = video ?: return@withContext null
            TrackMetadata(
                width = v.int(MediaFormat.KEY_WIDTH),
                height = v.int(MediaFormat.KEY_HEIGHT),
                frameRate = v.float(MediaFormat.KEY_FRAME_RATE),
                bitrate = v.int(MediaFormat.KEY_BIT_RATE).toLong(),
                durationMs = (v.long(MediaFormat.KEY_DURATION) / 1000),
                videoCodec = MediaFormats.codecLabel(v.getString(MediaFormat.KEY_MIME)),
                audioCodec = MediaFormats.codecLabel(audio?.getString(MediaFormat.KEY_MIME)),
                hdrType = detectHdr(v),
            )
        } catch (_: Exception) {
            null // Corrupt/unreadable file: leave the shallow MediaStore values in place.
        } finally {
            extractor.release()
        }
    }

    /**
     * HDR classification:
     *  - Dolby Vision has its own MIME type.
     *  - PQ (ST 2084) transfer means HDR10; HDR10+ additionally carries dynamic
     *    metadata (signalled via profile on modern devices, static-info heuristics otherwise).
     *  - HLG transfer means HLG.
     */
    private fun detectHdr(format: MediaFormat): HdrType {
        val mime = format.getString(MediaFormat.KEY_MIME).orEmpty()
        if (mime.endsWith("dolby-vision")) return HdrType.DOLBY_VISION

        val transfer = if (format.containsKey(MediaFormat.KEY_COLOR_TRANSFER)) {
            format.getInteger(MediaFormat.KEY_COLOR_TRANSFER)
        } else {
            MediaFormat.COLOR_TRANSFER_SDR_VIDEO
        }
        return when (transfer) {
            MediaFormat.COLOR_TRANSFER_ST2084 ->
                if (format.containsKey("hdr10-plus-info")) HdrType.HDR10_PLUS else HdrType.HDR10
            MediaFormat.COLOR_TRANSFER_HLG -> HdrType.HLG
            else -> HdrType.NONE
        }
    }

    private fun MediaFormat.int(key: String): Int =
        if (containsKey(key)) runCatching { getInteger(key) }.getOrDefault(0) else 0

    private fun MediaFormat.long(key: String): Long =
        if (containsKey(key)) runCatching { getLong(key) }.getOrDefault(0L) else 0L

    private fun MediaFormat.float(key: String): Float = when {
        !containsKey(key) -> 0f
        else -> runCatching { getInteger(key).toFloat() }
            .recoverCatching { getFloat(key) }
            .getOrDefault(0f)
    }
}
