package com.orwyx.player.player.subtitle

import java.io.InputStream
import java.nio.charset.Charset

/** One rendered caption: [startMs, endMs) with pre-cleaned display text. */
data class SubtitleCue(val startMs: Long, val endMs: Long, val text: String)

/** A parsed subtitle track, cues sorted by start time. */
data class SubtitleTrack(val name: String, val cues: List<SubtitleCue>) {
    /**
     * Binary search for the cue active at [positionMs]. O(log n) so the overlay
     * can poll at high frequency with zero allocation pressure.
     */
    fun cueAt(positionMs: Long): SubtitleCue? {
        var low = 0
        var high = cues.lastIndex
        while (low <= high) {
            val mid = (low + high) ushr 1
            val cue = cues[mid]
            when {
                positionMs < cue.startMs -> high = mid - 1
                positionMs >= cue.endMs -> low = mid + 1
                else -> return cue
            }
        }
        return null
    }
}

/**
 * Owned subtitle parsing for external files (SRT, WebVTT, ASS/SSA, MicroDVD SUB).
 *
 * Parsing externally (instead of handing files to ExoPlayer) is what enables
 * live delay adjustment, full styling control, and unified rendering in Compose.
 * Embedded tracks still render through ExoPlayer and share the same overlay.
 */
object SubtitleParsers {

    fun parse(name: String, stream: InputStream, charset: Charset, frameRate: Float = 24f): SubtitleTrack {
        val content = decode(stream.readBytes(), charset)
        val cues = when (name.substringAfterLast('.', "").lowercase()) {
            "srt" -> parseSrt(content)
            "vtt" -> parseVtt(content)
            "ass", "ssa" -> parseAss(content)
            "sub" -> parseMicroDvd(content, frameRate)
            else -> parseSrt(content) // Most unlabeled subtitle text is SRT-shaped.
        }
        return SubtitleTrack(name, cues.sortedBy { it.startMs })
    }

    /** Honors a BOM when present, otherwise uses the caller's configured encoding. */
    private fun decode(bytes: ByteArray, fallback: Charset): String = when {
        bytes.size >= 3 && bytes[0] == 0xEF.toByte() && bytes[1] == 0xBB.toByte() && bytes[2] == 0xBF.toByte() ->
            String(bytes, 3, bytes.size - 3, Charsets.UTF_8)
        bytes.size >= 2 && bytes[0] == 0xFF.toByte() && bytes[1] == 0xFE.toByte() ->
            String(bytes, 2, bytes.size - 2, Charsets.UTF_16LE)
        bytes.size >= 2 && bytes[0] == 0xFE.toByte() && bytes[1] == 0xFF.toByte() ->
            String(bytes, 2, bytes.size - 2, Charsets.UTF_16BE)
        else -> String(bytes, fallback)
    }

    // --- SRT ---------------------------------------------------------------
    // 00:01:02,500 --> 00:01:05,000

    private val SRT_TIME = Regex(
        """(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})""",
    )

    internal fun parseSrt(content: String): List<SubtitleCue> {
        val cues = mutableListOf<SubtitleCue>()
        val blocks = content.replace("\r\n", "\n").split(Regex("\n{2,}"))
        for (block in blocks) {
            val lines = block.trim().lines()
            val timeLineIndex = lines.indexOfFirst { SRT_TIME.containsMatchIn(it) }
            if (timeLineIndex == -1) continue
            val m = SRT_TIME.find(lines[timeLineIndex]) ?: continue
            val text = lines.drop(timeLineIndex + 1).joinToString("\n").let(::cleanMarkup)
            if (text.isBlank()) continue
            cues += SubtitleCue(srtMs(m, 0), srtMs(m, 4), text)
        }
        return cues
    }

    private fun srtMs(m: MatchResult, offset: Int): Long {
        val (h, min, s, ms) = (1..4).map { m.groupValues[it + offset] }
        return h.toLong() * 3_600_000 + min.toLong() * 60_000 + s.toLong() * 1_000 +
            ms.padEnd(3, '0').toLong()
    }

    // --- WebVTT ------------------------------------------------------------
    // 01:02.500 --> 01:05.000 (hours optional, cue settings after timestamp)

    private val VTT_TIME = Regex(
        """(?:(\d{1,2}):)?(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(?:(\d{1,2}):)?(\d{2}):(\d{2})\.(\d{3})""",
    )

    internal fun parseVtt(content: String): List<SubtitleCue> {
        val cues = mutableListOf<SubtitleCue>()
        val body = content.replace("\r\n", "\n").substringAfter("WEBVTT", content)
        for (block in body.split(Regex("\n{2,}"))) {
            val lines = block.trim().lines()
            val timeLineIndex = lines.indexOfFirst { VTT_TIME.containsMatchIn(it) }
            if (timeLineIndex == -1) continue
            val m = VTT_TIME.find(lines[timeLineIndex]) ?: continue
            val text = lines.drop(timeLineIndex + 1).joinToString("\n").let(::cleanMarkup)
            if (text.isBlank()) continue
            cues += SubtitleCue(vttMs(m, 0), vttMs(m, 4), text)
        }
        return cues
    }

    private fun vttMs(m: MatchResult, offset: Int): Long {
        val h = m.groupValues[1 + offset].ifEmpty { "0" }.toLong()
        val min = m.groupValues[2 + offset].toLong()
        val s = m.groupValues[3 + offset].toLong()
        val ms = m.groupValues[4 + offset].toLong()
        return h * 3_600_000 + min * 60_000 + s * 1_000 + ms
    }

    // --- ASS / SSA ----------------------------------------------------------
    // Dialogue: 0,0:01:02.50,0:01:05.00,Default,,0,0,0,,Text with {\i1}tags{\i0}

    private val ASS_TIME = Regex("""(\d+):(\d{2}):(\d{2})\.(\d{2})""")

    internal fun parseAss(content: String): List<SubtitleCue> {
        val cues = mutableListOf<SubtitleCue>()
        var textFieldIndex = 9 // per spec; recomputed from the Format: line when present
        for (rawLine in content.lineSequence()) {
            val line = rawLine.trim()
            if (line.startsWith("Format:", ignoreCase = true) && line.contains("Start")) {
                val fields = line.removePrefix("Format:").split(',').map { it.trim() }
                textFieldIndex = fields.indexOfFirst { it.equals("Text", true) }
                    .takeIf { it >= 0 } ?: 9
            }
            if (!line.startsWith("Dialogue:", ignoreCase = true)) continue
            val fields = line.removePrefix("Dialogue:").split(',', limit = textFieldIndex + 1)
            if (fields.size <= textFieldIndex) continue
            val start = assMs(fields[1].trim()) ?: continue
            val end = assMs(fields[2].trim()) ?: continue
            val text = fields[textFieldIndex]
                .replace(Regex("""\{[^}]*}"""), "") // strip override tags
                .replace("\\N", "\n")
                .replace("\\n", "\n")
                .replace("\\h", " ")
                .trim()
            if (text.isBlank()) continue
            cues += SubtitleCue(start, end, text)
        }
        return cues
    }

    private fun assMs(value: String): Long? {
        val m = ASS_TIME.matchEntire(value) ?: return null
        val (h, min, s, cs) = m.destructured
        return h.toLong() * 3_600_000 + min.toLong() * 60_000 + s.toLong() * 1_000 + cs.toLong() * 10
    }

    // --- MicroDVD SUB --------------------------------------------------------
    // {startFrame}{endFrame}Line one|Line two

    private val MICRODVD = Regex("""\{(\d+)}\{(\d+)}(.*)""")

    internal fun parseMicroDvd(content: String, frameRate: Float): List<SubtitleCue> {
        val fps = if (frameRate > 1f) frameRate else 24f
        val cues = mutableListOf<SubtitleCue>()
        for (line in content.lineSequence()) {
            val m = MICRODVD.matchEntire(line.trim()) ?: continue
            val (start, end, text) = m.destructured
            val cleaned = text
                .replace(Regex("""\{[^}]*}"""), "")
                .replace('|', '\n')
                .trim()
            if (cleaned.isBlank()) continue
            cues += SubtitleCue(
                (start.toLong() * 1000 / fps).toLong(),
                (end.toLong() * 1000 / fps).toLong(),
                cleaned,
            )
        }
        return cues
    }

    /** Strips HTML-ish markup SRT/VTT allow; keeps plain text and line breaks. */
    private fun cleanMarkup(text: String): String =
        text.replace(Regex("""<[^>]*>"""), "")
            .replace("&nbsp;", " ")
            .replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .trim()
}
