package app.vessel.data.repo

import app.vessel.data.remote.ResolveResponseDto
import app.vessel.data.remote.ResolvedFormatDto
import app.vessel.data.remote.SiphonApi
import app.vessel.ondevice.YoutubeOnDeviceResolver
import app.vessel.util.Platform
import app.vessel.util.UrlDetector
import okhttp3.OkHttpClient

/** Domain model of one downloadable rendition. */
data class MediaFormat(
    val id: String,
    val kind: String, // video | audio
    val container: String, // mp4 | mp3 | m4a
    val qualityLabel: String,
    val sizeBytes: Long?,
    val sizeIsEstimate: Boolean,
    val directUrl: String?,
    val downloadUrl: String, // absolute
    val requiresProcessing: Boolean,
)

data class ResolvedMedia(
    val platform: String,
    val kind: String,
    val sourceUrl: String,
    val title: String,
    val uploader: String?,
    val durationSeconds: Long?,
    val thumbnailUrl: String?,
    val video: List<MediaFormat>,
    val audio: List<MediaFormat>,
    val image: List<MediaFormat>,
)

data class PlaylistEntry(
    val title: String,
    val url: String,
    val durationSeconds: Long?,
    val thumbnailUrl: String?,
)

data class ResolvedPlaylist(
    val platform: String,
    val sourceUrl: String,
    val title: String,
    val entries: List<PlaylistEntry>,
)

sealed interface ResolveOutcome {
    data class Media(val media: ResolvedMedia) : ResolveOutcome
    data class Playlist(val playlist: ResolvedPlaylist) : ResolveOutcome
}

class MediaRepository(private val api: SiphonApi, private val okHttpClient: OkHttpClient) {

    suspend fun resolve(url: String): ResolveOutcome {
        if (UrlDetector.detect(url) == Platform.YOUTUBE) {
            // On-device first: no shared server IP for YouTube's bot-detection
            // to flag, and no network hop to our own backend either. Falls
            // back to the server path for anything NewPipeExtractor can't
            // handle itself (playlists, edge cases, occasional YouTube-side
            // changes it hasn't caught up with yet) rather than failing hard.
            // (Not runCatching — that would also swallow a real
            // CancellationException from the caller navigating away.)
            try {
                return ResolveOutcome.Media(YoutubeOnDeviceResolver.resolve(url, okHttpClient))
            } catch (e: kotlinx.coroutines.CancellationException) {
                throw e
            } catch (e: Exception) {
                // Fall through to the server-based path below.
            }
        }
        val dto = api.resolve(url)
        return if (dto.type == "playlist") {
            ResolveOutcome.Playlist(
                ResolvedPlaylist(
                    platform = dto.platform,
                    sourceUrl = dto.sourceUrl,
                    title = dto.title,
                    entries = dto.entries.map {
                        PlaylistEntry(it.title, it.url, it.durationSeconds?.toLong(), it.thumbnailUrl)
                    },
                ),
            )
        } else {
            ResolveOutcome.Media(dto.toMedia(api.baseUrl()))
        }
    }

    private fun ResolveResponseDto.toMedia(base: String): ResolvedMedia = ResolvedMedia(
        platform = platform,
        kind = kind ?: "video",
        sourceUrl = sourceUrl,
        title = title,
        uploader = uploader,
        durationSeconds = durationSeconds?.toLong(),
        thumbnailUrl = thumbnailUrl,
        video = video.map { it.toFormat(base) },
        audio = audio.map { it.toFormat(base) },
        image = image.map { it.toFormat(base) },
    )

    private fun ResolvedFormatDto.toFormat(base: String): MediaFormat = MediaFormat(
        id = id,
        kind = kind,
        container = container,
        qualityLabel = qualityLabel,
        sizeBytes = sizeBytes,
        sizeIsEstimate = sizeIsEstimate,
        directUrl = directUrl,
        downloadUrl = SiphonApi.absoluteUrl(downloadUrl, base),
        requiresProcessing = requiresProcessing,
    )
}
