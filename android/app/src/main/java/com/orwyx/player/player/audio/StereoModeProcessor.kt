package com.orwyx.player.player.audio

import androidx.media3.common.C
import androidx.media3.common.audio.AudioProcessor
import androidx.media3.common.audio.BaseAudioProcessor
import androidx.media3.common.util.UnstableApi
import java.nio.ByteBuffer

/**
 * Downmixes stereo 16-bit PCM to dual-mono when mono mode is enabled.
 * Inactive (zero-cost passthrough) in stereo mode or for non-stereo content.
 */
@UnstableApi
class StereoModeProcessor : BaseAudioProcessor() {

    @Volatile
    var monoEnabled: Boolean = false

    override fun onConfigure(inputAudioFormat: AudioProcessor.AudioFormat): AudioProcessor.AudioFormat {
        if (inputAudioFormat.encoding != C.ENCODING_PCM_16BIT) {
            throw AudioProcessor.UnhandledAudioFormatException(inputAudioFormat)
        }
        // Stay active for stereo content regardless of the current toggle, so the
        // user can flip mono mode mid-playback (only a flush is needed, not a
        // format change). Non-stereo content passes through untouched upstream.
        return if (inputAudioFormat.channelCount == 2) {
            inputAudioFormat
        } else {
            AudioProcessor.AudioFormat.NOT_SET
        }
    }

    override fun queueInput(inputBuffer: ByteBuffer) {
        if (!monoEnabled) {
            if (!inputBuffer.hasRemaining()) return
            val output = replaceOutputBuffer(inputBuffer.remaining())
            output.put(inputBuffer)
            output.flip()
            return
        }
        val frames = inputBuffer.remaining() / 4 // 2 channels * 2 bytes
        val output = replaceOutputBuffer(frames * 4)
        repeat(frames) {
            val left = inputBuffer.short.toInt()
            val right = inputBuffer.short.toInt()
            val mixed = ((left + right) / 2).toShort()
            output.putShort(mixed)
            output.putShort(mixed)
        }
        output.flip()
    }
}
