package app.vessel.ondevice

import app.vessel.data.repo.MediaFormat
import app.vessel.data.repo.ResolvedMedia
import java.util.concurrent.atomic.AtomicBoolean
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import org.schabi.newpipe.extractor.NewPipe
import org.schabi.newpipe.extractor.ServiceList
import org.schabi.newpipe.extractor.stream.StreamInfo

/**
 * Resolves YouTube links entirely on-device via NewPipeExtractor — no call
 * to the Vessel backend at all. Requests go out from the phone's own
 * network, the same way the official YouTube app's traffic looks, which is
 * why this sidesteps the "Sign in to confirm you're not a bot" wall that
 * hits server-side extraction running from a shared cloud IP.
 *
 * Tradeoff: only progressive (single-file, video+audio already combined)
 * streams are offered here. Muxing separate video-only + audio-only DASH
 * streams needs ffmpeg, which isn't bundled on-device, so the very highest
 * resolutions YouTube only exposes as split streams aren't available through
 * this path. Callers should fall back to the server-based resolver (which
 * still does 1080p+ muxing) if that matters more than speed/reliability for
 * a given link.
 */
object YoutubeOnDeviceResolver {

    private val initialized = AtomicBoolean(false)

    private fun ensureInitialized(client: OkHttpClient) {
        if (initialized.compareAndSet(false, true)) {
            NewPipe.init(NewPipeHttpDownloader(client))
        }
    }

    suspend fun resolve(url: String, client: OkHttpClient): ResolvedMedia = withContext(Dispatchers.IO) {
        ensureInitialized(client)
        val info = StreamInfo.getInfo(ServiceList.YouTube, url)

        val video = info.videoStreams
            .filter { !it.url.isNullOrEmpty() }
            .distinctBy { it.resolution }
            .sortedByDescending { resolutionHeight(it.resolution) }
            .map { stream ->
                MediaFormat(
                    id = "v-${stream.resolution}",
                    kind = "video",
                    container = "mp4",
                    qualityLabel = stream.resolution ?: "Video",
                    sizeBytes = null,
                    sizeIsEstimate = true,
                    directUrl = stream.url,
                    downloadUrl = stream.url!!,
                    requiresProcessing = false,
                )
            }

        val bestAudio = info.audioStreams
            .filter { !it.url.isNullOrEmpty() }
            .maxByOrNull { it.averageBitrate }

        val audio = listOfNotNull(
            bestAudio?.let { stream ->
                MediaFormat(
                    id = "a-${stream.averageBitrate}",
                    kind = "audio",
                    container = "m4a",
                    qualityLabel = if (stream.averageBitrate > 0) "${stream.averageBitrate} kbps" else "Audio",
                    sizeBytes = null,
                    sizeIsEstimate = true,
                    directUrl = stream.url,
                    downloadUrl = stream.url!!,
                    requiresProcessing = false,
                )
            },
        )

        ResolvedMedia(
            platform = "youtube",
            kind = "video",
            sourceUrl = info.url ?: url,
            title = info.name ?: "Untitled",
            uploader = info.uploaderName,
            durationSeconds = info.duration.takeIf { it > 0 },
            thumbnailUrl = info.thumbnails.maxByOrNull { it.width }?.url,
            video = video,
            audio = audio,
            image = emptyList(),
        )
    }

    private fun resolutionHeight(resolution: String?): Int =
        resolution?.let { Regex("""(\d+)p""").find(it)?.groupValues?.get(1)?.toIntOrNull() } ?: 0
}
