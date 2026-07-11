package com.orwyx.player.core.util

/** Container/codec knowledge shared by the scanner and the UI. */
object MediaFormats {

    /** Containers the library scanner indexes (Media3 decodes all of these). */
    val VIDEO_EXTENSIONS = setOf(
        "mp4", "mkv", "avi", "mov", "wmv", "flv", "webm",
        "mpeg", "mpg", "m4v", "3gp", "3g2", "ts", "m2ts", "mts", "vob", "ogv",
    )

    /** Subtitle files the sidecar loader picks up next to a video. */
    val SUBTITLE_EXTENSIONS = setOf("srt", "ass", "ssa", "sub", "vtt")

    fun isVideoFile(name: String): Boolean =
        name.substringAfterLast('.', "").lowercase() in VIDEO_EXTENSIONS

    fun isSubtitleFile(name: String): Boolean =
        name.substringAfterLast('.', "").lowercase() in SUBTITLE_EXTENSIONS

    /** Friendly codec labels for badges; falls back to the raw MIME subtype. */
    fun codecLabel(mime: String?): String? {
        if (mime == null) return null
        return when {
            mime.endsWith("avc") || mime.endsWith("h264") -> "H.264"
            mime.endsWith("hevc") || mime.endsWith("h265") -> "HEVC"
            mime.endsWith("av01") -> "AV1"
            mime.endsWith("vp9") || mime.endsWith("x-vnd.on2.vp9") -> "VP9"
            mime.endsWith("vp8") || mime.endsWith("x-vnd.on2.vp8") -> "VP8"
            mime.endsWith("dolby-vision") -> "Dolby Vision"
            mime.endsWith("mp4v-es") -> "MPEG-4"
            mime.endsWith("mpeg2") -> "MPEG-2"
            mime.endsWith("wmv") -> "WMV"
            mime.endsWith("mp4a-latm") -> "AAC"
            mime.endsWith("mpeg") -> "MP3"
            mime.endsWith("ac3") -> "AC3"
            mime.endsWith("eac3") -> "E-AC3"
            mime.endsWith("dts") -> "DTS"
            mime.endsWith("flac") -> "FLAC"
            mime.endsWith("raw") -> "PCM"
            mime.endsWith("vorbis") -> "Vorbis"
            mime.endsWith("opus") -> "Opus"
            else -> mime.substringAfterLast('/').uppercase()
        }
    }
}
