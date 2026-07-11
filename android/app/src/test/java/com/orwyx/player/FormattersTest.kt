package com.orwyx.player

import com.google.common.truth.Truth.assertThat
import com.orwyx.player.core.util.Formatters
import com.orwyx.player.domain.model.ResolutionClass
import org.junit.Test

class FormattersTest {

    @Test
    fun `formats durations with and without hours`() {
        assertThat(Formatters.duration(0)).isEqualTo("00:00")
        assertThat(Formatters.duration(65_000)).isEqualTo("01:05")
        assertThat(Formatters.duration(3_665_000)).isEqualTo("1:01:05")
        assertThat(Formatters.duration(-5)).isEqualTo("00:00")
    }

    @Test
    fun `formats file sizes`() {
        assertThat(Formatters.fileSize(512)).isEqualTo("512 B")
        assertThat(Formatters.fileSize(2_048)).isEqualTo("2.0 KB")
        assertThat(Formatters.fileSize(1_572_864)).isEqualTo("1.5 MB")
        assertThat(Formatters.fileSize(5L * 1024 * 1024 * 1024)).isEqualTo("5.0 GB")
    }

    @Test
    fun `strips extension for titles`() {
        assertThat(Formatters.titleFromFileName("clip.final.mkv")).isEqualTo("clip.final")
        assertThat(Formatters.titleFromFileName("noext")).isEqualTo("noext")
        assertThat(Formatters.titleFromFileName(".hidden")).isEqualTo(".hidden")
    }

    @Test
    fun `classifies resolutions using the smaller dimension`() {
        assertThat(ResolutionClass.of(1920, 1080)).isEqualTo(ResolutionClass.FHD)
        assertThat(ResolutionClass.of(1080, 1920)).isEqualTo(ResolutionClass.FHD) // portrait
        assertThat(ResolutionClass.of(3840, 2160)).isEqualTo(ResolutionClass.UHD_4K)
        assertThat(ResolutionClass.of(1280, 720)).isEqualTo(ResolutionClass.HD)
        assertThat(ResolutionClass.of(640, 480)).isEqualTo(ResolutionClass.SD)
        assertThat(ResolutionClass.of(0, 0)).isEqualTo(ResolutionClass.SD)
    }
}
