package com.orwyx.player.domain.model

/**
 * Immutable UI/domain representation of a video in the library.
 * Mapped from [com.orwyx.player.data.db.VideoEntity]; never exposes Room details to the UI.
 */
data class Video(
    val id: Long,
    val uri: String,
    val path: String,
    val title: String,
    val folderPath: String,
    val folderName: String,
    val sizeBytes: Long,
    val durationMs: Long,
    val width: Int,
    val height: Int,
    val frameRate: Float,
    val bitrate: Long,
    val videoCodec: String?,
    val audioCodec: String?,
    val hdrType: HdrType,
    val dateAddedMs: Long,
    val dateModifiedMs: Long,
    val lastPlayedAtMs: Long,
    val positionMs: Long,
    val isFavorite: Boolean,
    val isPrivate: Boolean,
) {
    val resolutionClass: ResolutionClass get() = ResolutionClass.of(width, height)
    val isHdr: Boolean get() = hdrType != HdrType.NONE

    /** Fraction watched, for progress bars on cards. */
    val watchedFraction: Float
        get() = if (durationMs <= 0) 0f else (positionMs.toFloat() / durationMs).coerceIn(0f, 1f)

    /** A video is "in progress" when meaningfully started but not effectively finished. */
    val isInProgress: Boolean
        get() = positionMs > MIN_RESUME_MS && watchedFraction < FINISHED_FRACTION

    companion object {
        const val MIN_RESUME_MS = 5_000L
        const val FINISHED_FRACTION = 0.98f
    }
}

/** HDR transfer classification detected during metadata extraction. */
enum class HdrType(val badge: String?) {
    NONE(null),
    HLG("HLG"),
    HDR10("HDR10"),
    HDR10_PLUS("HDR10+"),
    DOLBY_VISION("Dolby Vision"),
}

/** Coarse resolution buckets used for badges and filtering. */
enum class ResolutionClass(val badge: String?, val minLines: Int) {
    SD(null, 0),
    HD("720p", 720),
    FHD("1080p", 1080),
    QHD("1440p", 1440),
    UHD_4K("4K", 2160),
    UHD_8K("8K", 4320),
    ;

    companion object {
        fun of(width: Int, height: Int): ResolutionClass {
            // Use the smaller dimension so portrait recordings classify correctly.
            val lines = minOf(width, height)
            return entries.last { lines >= it.minLines || it == SD }
        }
    }
}
