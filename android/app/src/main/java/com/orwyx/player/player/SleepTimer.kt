package com.orwyx.player.player

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

sealed interface SleepTimerState {
    data object Off : SleepTimerState
    data class Running(val remainingMs: Long) : SleepTimerState
    data object EndOfVideo : SleepTimerState
}

/** Pause-at-deadline timer; "end of video" mode is resolved by the ViewModel on completion. */
class SleepTimer(private val scope: CoroutineScope, private val onExpired: () -> Unit) {

    private val _state = MutableStateFlow<SleepTimerState>(SleepTimerState.Off)
    val state: StateFlow<SleepTimerState> = _state

    private var job: Job? = null

    fun start(durationMs: Long) {
        cancel()
        job = scope.launch {
            var remaining = durationMs
            while (remaining > 0) {
                _state.value = SleepTimerState.Running(remaining)
                delay(TICK_MS)
                remaining -= TICK_MS
            }
            _state.value = SleepTimerState.Off
            onExpired()
        }
    }

    fun startEndOfVideo() {
        cancel()
        _state.value = SleepTimerState.EndOfVideo
    }

    /** Called by the ViewModel when the current item finishes. */
    fun onVideoEnded(): Boolean {
        if (_state.value is SleepTimerState.EndOfVideo) {
            _state.value = SleepTimerState.Off
            return true
        }
        return false
    }

    fun cancel() {
        job?.cancel()
        job = null
        _state.value = SleepTimerState.Off
    }

    private companion object {
        const val TICK_MS = 1_000L
    }
}
