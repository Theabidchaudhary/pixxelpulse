package com.orwyx.player.ui.player

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.orwyx.player.data.settings.AppSettings

/**
 * Unified subtitle renderer for embedded and external tracks.
 *
 * Honors user styling: text scale, color, opacity, outline, shadow, background,
 * and vertical position. Drawing text twice (stroke underneath, fill on top)
 * produces the outline without expensive blur effects — fast enough for 60fps.
 */
@Composable
fun SubtitleOverlay(
    text: String?,
    settings: AppSettings,
    modifier: Modifier = Modifier,
) {
    if (text.isNullOrBlank()) return

    BoxWithConstraints(modifier = modifier.fillMaxWidth()) {
        val bottomPadding = maxHeight * settings.subtitleBottomOffsetFraction
        val fontSize = (18f * settings.subtitleTextScale).sp
        val fillColor = Color(settings.subtitleColor).copy(alpha = settings.subtitleOpacity)

        val baseStyle = TextStyle(
            fontSize = fontSize,
            lineHeight = fontSize * 1.25f,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center,
            shadow = if (settings.subtitleShadow) {
                Shadow(color = Color.Black.copy(alpha = 0.9f), offset = Offset(0f, 2f), blurRadius = 4f)
            } else {
                null
            },
        )

        val backgroundModifier = if (settings.subtitleBackground) {
            Modifier.background(Color.Black.copy(alpha = 0.55f), RoundedCornerShape(6.dp))
        } else {
            Modifier
        }

        androidx.compose.foundation.layout.Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = bottomPadding, start = 24.dp, end = 24.dp)
                .then(backgroundModifier)
                .padding(horizontal = 10.dp, vertical = 4.dp),
        ) {
            if (settings.subtitleOutline) {
                Text(
                    text = text,
                    style = baseStyle.copy(
                        color = Color.Black.copy(alpha = settings.subtitleOpacity),
                        drawStyle = Stroke(width = 6f),
                    ),
                )
            }
            Text(text = text, style = baseStyle.copy(color = fillColor))
        }
    }
}
