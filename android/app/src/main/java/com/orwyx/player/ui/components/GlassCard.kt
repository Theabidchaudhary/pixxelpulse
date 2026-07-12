package com.orwyx.player.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.dp

/** Frosted-glass tile treatment shared by library cards: soft tint + hairline edge. */
@Composable
fun Modifier.glassCard(shape: Shape = MaterialTheme.shapes.large): Modifier =
    this
        .clip(shape)
        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f), shape)
        .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f), shape)
