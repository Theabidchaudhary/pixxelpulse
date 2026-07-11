package com.orwyx.player.player.audio

import androidx.media3.common.C
import androidx.media3.common.audio.AudioProcessor
import androidx.media3.common.audio.BaseAudioProcessor
import androidx.media3.common.util.UnstableApi
import java.nio.ByteBuffer
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.abs

/**
 * Applies a user-set audio/video sync offset by inserting or dropping PCM at the
 * head of the stream after each flush (i.e. after seek or delay change).
 *
 *  - Positive delay: audio plays later — silence is injected first.
 *  - Negative delay: audio plays earlier — the first `|delay|` ms are dropped.
 */
@UnstableApi
@Singleton
class AudioDelayProcessor @Inject constructor() : BaseAudioProcessor() {

    @Volatile
    private var delayMs: Long = 0

    /** Remaining bytes of silence to inject (positive) or input to drop (negative). */
    private var pendingBytes: Long = 0

    fun setDelayMs(value: Long) {
        delayMs = value.coerceIn(-MAX_DELAY_MS, MAX_DELAY_MS)
    }

    fun delayMs(): Long = delayMs

    override fun onConfigure(inputAudioFormat: AudioProcessor.AudioFormat): AudioProcessor.AudioFormat {
        if (inputAudioFormat.encoding != C.ENCODING_PCM_16BIT) {
            throw AudioProcessor.UnhandledAudioFormatException(inputAudioFormat)
        }
        // Stay active even at zero delay: reconfiguration only happens on format
        // change, but the user can dial in a delay at any time (a seek re-flushes us).
        return inputAudioFormat
    }

    override fun onFlush() {
        pendingBytes = bytesForMs(delayMs)
    }

    override fun queueInput(inputBuffer: ByteBuffer) {
        when {
            pendingBytes > 0 -> { // Inject silence, then pass input through untouched.
                val silence = pendingBytes.coerceAtMost(MAX_CHUNK_BYTES).toInt()
                val output = replaceOutputBuffer(silence + inputBuffer.remaining())
                repeat(silence) { output.put(0) }
                pendingBytes -= silence
                output.put(inputBuffer)
                output.flip()
            }
            pendingBytes < 0 -> { // Drop input until the negative offset is consumed.
                val drop = (-pendingBytes).coerceAtMost(inputBuffer.remaining().toLong()).toInt()
                inputBuffer.position(inputBuffer.position() + drop)
                pendingBytes += drop
                passThrough(inputBuffer)
            }
            else -> passThrough(inputBuffer)
        }
    }

    private fun passThrough(inputBuffer: ByteBuffer) {
        if (!inputBuffer.hasRemaining()) return
        val output = replaceOutputBuffer(inputBuffer.remaining())
        output.put(inputBuffer)
        output.flip()
    }

    private fun bytesForMs(ms: Long): Long {
        val format = inputAudioFormat
        val bytesPerFrame = format.channelCount * 2L
        val frames = format.sampleRate * abs(ms) / 1000
        val bytes = frames * bytesPerFrame
        return if (ms >= 0) bytes else -bytes
    }

    private companion object {
        const val MAX_DELAY_MS = 5_000L
        const val MAX_CHUNK_BYTES = 1L shl 20
    }
}
