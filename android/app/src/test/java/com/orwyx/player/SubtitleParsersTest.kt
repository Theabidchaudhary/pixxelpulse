package com.orwyx.player

import com.google.common.truth.Truth.assertThat
import com.orwyx.player.player.subtitle.SubtitleParsers
import com.orwyx.player.player.subtitle.SubtitleTrack
import org.junit.Test

class SubtitleParsersTest {

    @Test
    fun `parses srt blocks with markup stripped`() {
        val srt = """
            1
            00:00:01,000 --> 00:00:03,500
            <i>Hello</i> world

            2
            00:01:00,250 --> 00:01:02,000
            Second line
            continues here
        """.trimIndent()

        val cues = SubtitleParsers.parse("test.srt", srt.byteInputStream(), Charsets.UTF_8).cues

        assertThat(cues).hasSize(2)
        assertThat(cues[0].startMs).isEqualTo(1_000)
        assertThat(cues[0].endMs).isEqualTo(3_500)
        assertThat(cues[0].text).isEqualTo("Hello world")
        assertThat(cues[1].startMs).isEqualTo(60_250)
        assertThat(cues[1].text).isEqualTo("Second line\ncontinues here")
    }

    @Test
    fun `parses vtt with header and optional hours`() {
        val vtt = """
            WEBVTT

            00:05.000 --> 00:07.000
            First

            01:00:01.000 --> 01:00:02.000 align:middle
            Second
        """.trimIndent()

        val cues = SubtitleParsers.parse("test.vtt", vtt.byteInputStream(), Charsets.UTF_8).cues

        assertThat(cues).hasSize(2)
        assertThat(cues[0].startMs).isEqualTo(5_000)
        assertThat(cues[1].startMs).isEqualTo(3_601_000)
    }

    @Test
    fun `parses ass dialogue and strips override tags`() {
        val ass = """
            [Events]
            Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
            Dialogue: 0,0:00:01.00,0:00:02.50,Default,,0,0,0,,{\i1}Styled{\i0} text\Nnew line
        """.trimIndent()

        val cues = SubtitleParsers.parse("test.ass", ass.byteInputStream(), Charsets.UTF_8).cues

        assertThat(cues).hasSize(1)
        assertThat(cues[0].startMs).isEqualTo(1_000)
        assertThat(cues[0].endMs).isEqualTo(2_500)
        assertThat(cues[0].text).isEqualTo("Styled text\nnew line")
    }

    @Test
    fun `parses microdvd using frame rate`() {
        val sub = "{24}{72}Hello|there"

        val cues = SubtitleParsers
            .parse("test.sub", sub.byteInputStream(), Charsets.UTF_8, frameRate = 24f)
            .cues

        assertThat(cues).hasSize(1)
        assertThat(cues[0].startMs).isEqualTo(1_000)
        assertThat(cues[0].endMs).isEqualTo(3_000)
        assertThat(cues[0].text).isEqualTo("Hello\nthere")
    }

    @Test
    fun `binary search finds active cue and gaps`() {
        val track = SubtitleTrack(
            "t",
            listOf(
                cue(1_000, 2_000, "a"),
                cue(3_000, 4_000, "b"),
                cue(10_000, 12_000, "c"),
            ),
        )

        assertThat(track.cueAt(1_500)?.text).isEqualTo("a")
        assertThat(track.cueAt(2_500)).isNull()
        assertThat(track.cueAt(3_000)?.text).isEqualTo("b")
        assertThat(track.cueAt(11_999)?.text).isEqualTo("c")
        assertThat(track.cueAt(12_000)).isNull()
    }

    @Test
    fun `honors utf-8 bom over configured charset`() {
        val bom = byteArrayOf(0xEF.toByte(), 0xBB.toByte(), 0xBF.toByte())
        val body = "1\n00:00:01,000 --> 00:00:02,000\nCafé".toByteArray(Charsets.UTF_8)

        val cues = SubtitleParsers
            .parse("bom.srt", (bom + body).inputStream(), Charsets.ISO_8859_1)
            .cues

        assertThat(cues.single().text).isEqualTo("Café")
    }

    private fun cue(start: Long, end: Long, text: String) =
        com.orwyx.player.player.subtitle.SubtitleCue(start, end, text)
}
