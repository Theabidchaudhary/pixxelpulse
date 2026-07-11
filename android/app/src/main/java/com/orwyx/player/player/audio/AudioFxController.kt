package com.orwyx.player.player.audio

import android.media.audiofx.Equalizer
import android.media.audiofx.LoudnessEnhancer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject
import javax.inject.Singleton

data class EqualizerBand(val index: Int, val centerFrequencyHz: Int, val levelMb: Int, val rangeMb: IntRange)

data class AudioFxState(
    val equalizerEnabled: Boolean = false,
    val bands: List<EqualizerBand> = emptyList(),
    val presets: List<String> = emptyList(),
    val volumeBoostMb: Int = 0, // 0..MAX_BOOST_MB via LoudnessEnhancer
    val available: Boolean = false,
)

/**
 * System audio effects bound to the player's audio session:
 * a graphic [Equalizer] and a [LoudnessEnhancer] used both for volume boost
 * (gestures past 100%) and loudness normalization.
 *
 * Fails soft: some devices reject effect creation — the UI simply hides the controls.
 */
@Singleton
class AudioFxController @Inject constructor() {

    private var equalizer: Equalizer? = null
    private var loudness: LoudnessEnhancer? = null

    private val _state = MutableStateFlow(AudioFxState())
    val state: StateFlow<AudioFxState> = _state

    fun attach(audioSessionId: Int) {
        release()
        if (audioSessionId == 0) return
        runCatching {
            equalizer = Equalizer(0, audioSessionId)
            loudness = LoudnessEnhancer(audioSessionId)
            publish()
        }.onFailure { release() }
    }

    fun setEqualizerEnabled(enabled: Boolean) {
        runCatching { equalizer?.enabled = enabled }
        publish()
    }

    fun setBandLevel(band: Int, levelMb: Int) {
        runCatching { equalizer?.setBandLevel(band.toShort(), levelMb.toShort()) }
        publish()
    }

    fun applyPreset(index: Int) {
        runCatching { equalizer?.usePreset(index.toShort()) }
        publish()
    }

    /** Volume boost in millibels above unity; also used for "normalize loudness". */
    fun setVolumeBoost(mb: Int) {
        val clamped = mb.coerceIn(0, MAX_BOOST_MB)
        runCatching {
            loudness?.setTargetGain(clamped)
            loudness?.enabled = clamped > 0
        }
        _state.value = _state.value.copy(volumeBoostMb = clamped)
    }

    fun release() {
        runCatching { equalizer?.release() }
        runCatching { loudness?.release() }
        equalizer = null
        loudness = null
        _state.value = AudioFxState()
    }

    private fun publish() {
        val eq = equalizer ?: return
        runCatching {
            val range = eq.bandLevelRange
            val bands = (0 until eq.numberOfBands).map { i ->
                EqualizerBand(
                    index = i,
                    centerFrequencyHz = eq.getCenterFreq(i.toShort()) / 1000,
                    levelMb = eq.getBandLevel(i.toShort()).toInt(),
                    rangeMb = range[0].toInt()..range[1].toInt(),
                )
            }
            val presets = (0 until eq.numberOfPresets).map { eq.getPresetName(it.toShort()) }
            _state.value = _state.value.copy(
                equalizerEnabled = eq.enabled,
                bands = bands,
                presets = presets,
                available = true,
            )
        }
    }

    companion object {
        /** LoudnessEnhancer accepts up to ~2000mB comfortably on most devices. */
        const val MAX_BOOST_MB = 2000
    }
}
