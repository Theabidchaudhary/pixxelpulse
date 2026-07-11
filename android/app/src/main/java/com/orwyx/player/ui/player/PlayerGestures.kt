package com.orwyx.player.ui.player

import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.calculateCentroidSize
import androidx.compose.foundation.gestures.calculatePan
import androidx.compose.foundation.gestures.calculateZoom
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.pointer.pointerInput
import kotlin.math.abs

/** Which continuous gesture is in progress. */
enum class DragMode { NONE, BRIGHTNESS, VOLUME, SEEK }

/**
 * Callbacks the player screen wires to the ViewModel / Activity.
 * All deltas are normalized: vertical drags in [-1, 1] over full screen height,
 * seek drags in fraction-of-width.
 */
interface PlayerGestureListener {
    fun onTap()
    fun onDoubleTap(zone: Int) // -1 left, 0 center, 1 right
    fun onLongPressStart()
    fun onLongPressEnd()
    fun onDragStart(mode: DragMode)
    fun onDragDelta(mode: DragMode, normalizedDelta: Float)
    fun onDragEnd(mode: DragMode)
    fun onPinch(zoomFactor: Float, pan: Offset)
    fun onTwoFingerTap()
}

/**
 * MX-style gesture engine:
 *  - single-finger vertical drag: brightness (left half) / volume (right half)
 *  - single-finger horizontal drag: seek with live preview
 *  - double-tap: skip back / play-pause / skip forward by zone
 *  - long-press: temporary 2x until release
 *  - pinch: zoom + pan
 *  - two-finger tap: lock
 *
 * Tap family runs through [detectTapGestures]; drags/pinch run through a custom
 * [awaitEachGesture] loop so multi-touch classification stays deterministic.
 * [sensitivity] scales drag response (user setting).
 */
fun Modifier.playerGestures(
    listener: PlayerGestureListener,
    sensitivity: Float,
    locked: Boolean,
): Modifier = this
    .pointerInput(locked, sensitivity) {
        if (locked) {
            // While locked, only taps get through (to reveal the unlock button).
            detectTapGestures(onTap = { listener.onTap() })
            return@pointerInput
        }
        detectTapGestures(
            onTap = { listener.onTap() },
            onDoubleTap = { offset ->
                val zone = when {
                    offset.x < size.width * 0.35f -> -1
                    offset.x > size.width * 0.65f -> 1
                    else -> 0
                }
                listener.onDoubleTap(zone)
            },
            onLongPress = { listener.onLongPressStart() },
            onPress = {
                tryAwaitRelease()
                listener.onLongPressEnd()
            },
        )
    }
    .pointerInput(locked, sensitivity) {
        if (locked) return@pointerInput
        val touchSlop = viewConfiguration.touchSlop
        awaitEachGesture {
            val down = awaitFirstDown(requireUnconsumed = false)
            val startTime = down.uptimeMillis
            var maxPointers = 1
            var pinching = false
            var dragMode = DragMode.NONE
            var accumulated = Offset.Zero

            while (true) {
                val event = awaitPointerEvent()
                val pressed = event.changes.filter { it.pressed }
                maxPointers = maxOf(maxPointers, pressed.size)

                if (pressed.isEmpty()) {
                    // Gesture finished.
                    val duration = event.changes.maxOf { it.uptimeMillis } - startTime
                    when {
                        dragMode != DragMode.NONE -> listener.onDragEnd(dragMode)
                        pinching -> Unit
                        maxPointers >= 2 && duration < TWO_FINGER_TAP_MS ->
                            listener.onTwoFingerTap()
                    }
                    break
                }

                if (pressed.size >= 2 && dragMode == DragMode.NONE) {
                    val zoom = event.calculateZoom()
                    val pan = event.calculatePan()
                    if (!pinching &&
                        (abs(zoom - 1f) > PINCH_ZOOM_THRESHOLD ||
                            event.calculateCentroidSize() > 0f && pan.getDistance() > touchSlop)
                    ) {
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
