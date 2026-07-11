package com.orwyx.player.core.util

import java.util.Locale
import kotlin.math.roundToInt

/** Small, allocation-light formatting helpers shared across the UI. */
object Formatters {

    /** 65 -> "01:05", 3665000ms -> "1:01:05". */
    fun duration(ms: Long): String {
        val totalSeconds = (ms / 1000).coerceAtLeast(0)
        val h = totalSeconds / 3600
        val m = (totalSeconds % 3600) / 60
        val s = totalSeconds % 60
        return if (h > 0) {
            String.format(Locale.US, "%d:%02d:%02d", h, m, s)
        } else {
            String.format(Locale.US, "%02d:%02d", m, s)
        }
    }

    /** Binary-ish human file size matching what file managers show. */
    fun fileSize(bytes: Long): String {
        if (bytes < 1024) return "$bytes B"
        val units = arrayOf("KB", "MB", "GB", "TB")
        var value = bytes.toDouble()
        var unit = -1
        while (value >= 1024 && unit < units.lastIndex) {
            value /= 1024
            unit++
        }
        return if (value >= 100) {
            String.format(Locale.US, "%.0f %s", value, units[unit])
        } else {
            String.format(Locale.US, "%.1f %s", value, units[unit])
        }
    }

    /** "1920×1080" style label. */
    fun resolution(width: Int, height: Int): String = "${width}×${height}"

    /** 29.97 -> "30 fps", 23.976 -> "24 fps"; hides unknown rates. */
    fun frameRate(fps: Float): String? =
        if (fps <= 0f) null else "${fps.roundToInt()} fps"

    /** Strips the extension for cleaner titles: "clip.final.mkv" -> "clip.final". */
    fun titleFromFileName(fileName: String): String {
        val dot = fileName.lastIndexOf('.')
        return if (dot > 0) fileName.substring(0, dot) else fileName
    }
}
