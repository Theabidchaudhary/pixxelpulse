package com.orwyx.player.ui.player

import android.os.SystemClock
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.calculatePan
import androidx.compose.foundation.gestures.calculateZoom
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.pointer.pointerInput
import kotlinx.coroutines.withTimeoutOrNull
import kotlin.math.abs

/** Which continuous single-finger gesture is in progress. */
enum class DragMode { NONE, BRIGHTNESS, VOLUME, SEEK }

/**
 * Callbacks the player screen wires to the ViewModel / Activity.
 * All deltas are normalized: vertical drags in [-1, 1] over full screen height,
 * seek/long-press drags in fraction-of-width.
 */
interface PlayerGestureListener {
    fun onTap()
    /** -1 left third (seek back), 0 center third (play/pause), 1 right third (seek forward). */
    fun onDoubleTap(zone: Int)
    fun onLongPressStart()
    fun onLongPressDrag(normalizedDeltaX: Float)
    fun onLongPressEnd()
    fun onDragStart(mode: DragMode)
    fun onDragDelta(mode: DragMode, normalizedDelta: Float)
    fun onDragEnd(mode: DragMode)
    fun onPinch(zoomFactor: Float, pan: Offset)
    fun onTwoFingerTap()
}

/**
 * MX-style gesture engine:
 *  - left/center/right thirds double-tap: seek back / play-pause / seek forward
 *  - single-finger vertical drag: brightness (left half) / volume (right half)
 *  - single-finger horizontal drag: seek with live preview
 *  - long-press anywhere: temporary speed boost, adjustable by dragging left/right
 *    while still holding, reverting to the prior speed on release
 *  - pinch: zoom + pan
 *  - two-finger tap: lock
 *
 * Taps run through [detectTapGestures] in one pointerInput; drags, pinch, and
 * long-press-to-speed run through a second, independent [awaitEachGesture]
 * loop so long-press can keep reading move events for as long as the finger
 * stays down (something [detectTapGestures]'s onLongPress cannot do).
 * [sensitivity] scales drag response (user setting).
 */
fun Modifier.playerGestures(
    listener: PlayerGestureListener,
    sensitivity: Float,
    locked: Boolean,
): Modifier = this
    .pointerInput(locked) {
        if (locked) {
            // While locked, only taps get through (to reveal the unlock button).
            detectTapGestures(onTap = { listener.onTap() })
            return@pointerInput
        }
        detectTapGestures(
            onTap = { listener.onTap() },
            onDoubleTap = { offset ->
                val zone = when {
                    offset.x < size.width / 3f -> -1
                    offset.x > size.width * 2f / 3f -> 1
                    else -> 0
                }
                listener.onDoubleTap(zone)
            },
        )
    }
    .pointerInput(locked, sensitivity) {
        if (locked) return@pointerInput
        val touchSlop = viewConfiguration.touchSlop
        awaitEachGesture {
            val down = awaitFirstDown(requireUnconsumed = false)
            val startTime = down.uptimeMillis
            val downRealTime = SystemClock.uptimeMillis()
            var maxPointers = 1
            var pinching = false
            var dragMode = DragMode.NONE
            var longPressActive = false
            var accumulated = Offset.Zero

            while (true) {
                val remaining = viewConfiguration.longPressTimeoutMillis -
                    (SystemClock.uptimeMillis() - downRealTime)
                val event = if (!longPressActive && dragMode == DragMode.NONE && !pinching && remaining > 0) {
                    withTimeoutOrNull(remaining) { awaitPointerEvent() }
                } else {
                    awaitPointerEvent()
                }

                if (event == null) {
                    // No movement before the long-press timeout: start the speed hold.
                    if (maxPointers == 1) {
                        longPressActive = true
                        listener.onLongPressStart()
                    }
                    continue
                }

                val pressed = event.changes.filter { it.pressed }
                maxPointers = maxOf(maxPointers, pressed.size)

                if (pressed.isEmpty()) {
                    when {
                        longPressActive -> listener.onLongPressEnd()
                        dragMode != DragMode.NONE -> listener.onDragEnd(dragMode)
                        pinching -> Unit
                        maxPointers >= 2 &&
                            event.changes.maxOf { it.uptimeMillis } - startTime < TWO_FINGER_TAP_MS ->
                            listener.onTwoFingerTap()
                    }
                    break
                }

                if (longPressActive) {
                    val change = pressed.first()
                    val deltaX = change.position.x - change.previousPosition.x
                    if (deltaX != 0f) listener.onLongPressDrag(deltaX / size.width)
                    change.consume()
                    continue
                }

                if (pressed.size >= 2 && dragMode == DragMode.NONE) {
                    val zoom = event.calculateZoom()
                    val pan = event.calculatePan()
                    if (!pinching && (abs(zoom - 1f) > PINCH_ZOOM_THRESHOLD || pan.getDistance() > touchSlop)) {
                        pinching = true
                    }
                    if (pinching) {
                        listener.onPinch(zoom, pan)
                        event.changes.forEach { it.consume() }
                    }
                    continue
                }

                if (pressed.size == 1 && !pinching) {
                    val change = pressed.first()
                    val delta = change.position - change.previousPosition
                    accumulated += delta

                    if (dragMode == DragMode.NONE &&
                        (abs(accumulated.x) > touchSlop || abs(accumulated.y) > touchSlop)
                    ) {
                        dragMode = if (abs(accumulated.x) > abs(accumulated.y)) {
                            DragMode.SEEK
                        } else if (down.position.x < size.width / 2f) {
                            DragMode.BRIGHTNESS
                        } else {
                            DragMode.VOLUME
                        }
                        listener.onDragStart(dragMode)
                    }

                    if (dragMode != DragMode.NONE) {
                        val normalized = when (dragMode) {
                            DragMode.SEEK -> delta.x / size.width
                            // Up = increase, hence the negation.
                            else -> -delta.y / size.height
                        } * sensitivity
                        listener.onDragDelta(dragMode, normalized)
                        change.consume()
                    }
                }
            }
        }
    }

private const val TWO_FINGER_TAP_MS = 250L
private const val PINCH_ZOOM_THRESHOLD = 0.02f
