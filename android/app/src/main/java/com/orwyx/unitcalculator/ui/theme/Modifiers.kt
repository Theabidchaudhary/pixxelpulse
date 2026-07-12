package com.orwyx.unitcalculator.ui.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Soft dual-shadow neumorphic surface: a dark shadow bottom-right and a light highlight
 * top-left, giving cards a gently raised, tactile feel in both themes.
 */
@Composable
fun Modifier.neumorphic(
    shape: RoundedCornerShape = RoundedCornerShape(24.dp),
    elevation: Dp = 10.dp,
    surface: Color = androidx.compose.material3.MaterialTheme.colorScheme.surface,
): Modifier {
    val neu = LocalNeuColors.current
    return this
        .shadow(
            elevation = elevation,
            shape = shape,
            ambientColor = neu.shadow,
            spotColor = neu.shadow,
        )
        .drawBehind {
            // Subtle top-left highlight to complete the neumorphic illusion.
            drawRoundRectHighlight(neu.highlight)
        }
        .background(color = surface, shape = shape)
}

private fun androidx.compose.ui.graphics.drawscope.DrawScope.drawRoundRectHighlight(
    highlight: Color,
) {
    drawRect(
        brush = Brush.linearGradient(
            colors = listOf(highlight.copy(alpha = 0.35f), Color.Transparent),
            start = Offset.Zero,
            end = Offset(size.width * 0.5f, size.height * 0.5f),
        ),
    )
}

/**
 * Light glassmorphism: a translucent tinted fill with a faint gradient sheen and hairline
 * border. Best layered over a colourful or blurred backdrop.
 */
@Composable
fun Modifier.glass(
    shape: Shape = RoundedCornerShape(24.dp),
    tint: Color = androidx.compose.material3.MaterialTheme.colorScheme.surface,
    alpha: Float = 0.65f,
): Modifier = this
    .background(
        brush = Brush.verticalGradient(
            colors = listOf(
                tint.copy(alpha = alpha),
                tint.copy(alpha = alpha * 0.75f),
            ),
        ),
        shape = shape,
    )
