package com.orwyx.player.ai

import android.net.Uri
import com.orwyx.player.player.subtitle.SubtitleCue
import com.orwyx.player.player.subtitle.SubtitleTrack
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.flowOf
import javax.inject.Inject
import javax.inject.Singleton

/**
 * === AI subtitle subsystem ===
 *
 * Everything here runs fully on-device once a model is downloaded; the app makes
 * no network calls except the user-initiated model download itself. The
 * contracts are final; engines plug in behind them:
 *
 *  - [SubtitleGenerator]: speech-to-text with timestamps. The intended
 *    production engine is whisper.cpp compiled for Android (arm64 NEON /
 *    Vulkan), fed 16kHz mono PCM decoded via MediaCodec. Word timestamps give
 *    automatic timing; Whisper provides punctuation and 90+ languages natively.
 *  - [SubtitleTranslator]: offline NMT (e.g. ML Kit Translate or a bundled
 *    Marian/NLLB model) applied cue-by-cue, preserving timing.
 *  - [DialogueSearch] is already live today via
 *    [com.orwyx.player.player.subtitle.SubtitleManager.searchDialogue].
 *
 * Until an engine is installed every call reports [AiAvailability.ModelRequired],
 * and the UI renders a download-model state instead of failing.
 */
sealed interface AiAvailability {
    data object Ready : AiAvailability
    data class ModelRequired(val modelId: String, val approxSizeMb: Int) : AiAvailability
    data class Unsupported(val reason: String) : AiAvailability
}

sealed interface GenerationProgress {
    data class Transcribing(val fraction: Float) : GenerationProgress
    data class Done(val track: SubtitleTrack) : GenerationProgress
    data class Failed(val message: String) : GenerationProgress
}

interface SubtitleGenerator {
    fun availability(): AiAvailability

    /** Transcribes the video's primary audio track into a timed subtitle track. */
    fun generate(videoUri: Uri, languageHint: String?): Flow<GenerationProgress>
}

interface SubtitleTranslator {
    fun availability(targetLanguage: String): AiAvailability

    /** Translates cue text in place; timing is untouched. */
    suspend fun translate(track: SubtitleTrack, targetLanguage: String): SubtitleTrack
}

interface SubtitleSummarizer {
    fun availability(): AiAvailability

    /** Short synopsis of the dialogue, for the video properties sheet. */
    suspend fun summarize(cues: List<SubtitleCue>): String
}

/**
 * Tracks which on-device models are installed. Downloads are user-initiated,
 * resumable, and stored in app-private storage; deleting the app removes them.
 */
@Singleton
class AiModelManager @Inject constructor() {

    data class ModelInfo(val id: String, val label: String, val approxSizeMb: Int, val installed: Boolean)

    private val _models = MutableStateFlow(
        listOf(
            ModelInfo("whisper-small-int8", "Speech-to-text (multilingual)", 190, installed = false),
            ModelInfo("nmt-base", "Subtitle translation", 85, installed = false),
        ),
    )
    val models: StateFlow<List<ModelInfo>> = _models

    fun isInstalled(modelId: String): Boolean =
        _models.value.any { it.id == modelId && it.installed }
}

/** Default no-model implementation; swapped for the whisper.cpp engine when installed. */
@Singleton
class StubSubtitleGenerator @Inject constructor(
    private val modelManager: AiModelManager,
) : SubtitleGenerator {

    override fun availability(): AiAvailability =
        if (modelManager.isInstalled("whisper-small-int8")) {
            AiAvailability.Ready
        } else {
            AiAvailability.ModelRequired("whisper-small-int8", approxSizeMb = 190)
        }

    override fun generate(videoUri: Uri, languageHint: String?): Flow<GenerationProgress> =
        flowOf(GenerationProgress.Failed("Speech-to-text model is not installed"))
}
