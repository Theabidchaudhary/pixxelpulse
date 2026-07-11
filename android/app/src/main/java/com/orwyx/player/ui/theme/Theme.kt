package com.orwyx.player.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.orwyx.player.data.settings.ThemeMode

// Fallback brand palette for devices without Material You (dynamic color wins when available).
private val Ink = Color(0xFF0E1013)
private val Surface1Dark = Color(0xFF16181D)
private val Accent = Color(0xFF7DA9FF)
private val AccentDeep = Color(0xFF2B5CB8)

private val DarkColors = darkColorScheme(
    primary = Accent,
    onPrimary = Color(0xFF06182E),
    primaryContainer = AccentDeep,
    onPrimaryContainer = Color(0xFFDCE7FF),
    background = Ink,
    onBackground = Color(0xFFE4E6EB),
    surface = Ink,
    onSurface = Color(0xFFE4E6EB),
    surfaceVariant = Surface1Dark,
    onSurfaceVariant = Color(0xFFABB0BA),
    outline = Color(0xFF3A3F47),
)

private val LightColors = lightColorScheme(
    primary = AccentDeep,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFD8E2FF),
    onPrimaryContainer = Color(0xFF001A41),
    background = Color(0xFFFAFAFC),
    onBackground = Color(0xFF1A1C1F),
    surface = Color(0xFFFAFAFC),
    onSurface = Color(0xFF1A1C1F),
    surfaceVariant = Color(0xFFEFF0F4),
    onSurfaceVariant = Color(0xFF54575E),
    outline = Color(0xFFC6C9D0),
)

/** Rounded, soft geometry across cards, sheets, and dialogs. */
private val OrwyxShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(22.dp),
    extraLarge = RoundedCornerShape(28.dp),
)

@Composable
fun OrwyxTheme(
    themeMode: ThemeMode = ThemeMode.SYSTEM,
    content: @Composable () -> Unit,
) {
    val dark = when (themeMode) {
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
    }
    val context = LocalContext.current
    val colorScheme = when {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ->
            if (dark) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        dark -> DarkColors
        else -> LightColors
    }
    MaterialTheme(
        colorScheme = colorScheme,
        shapes = OrwyxShapes,
        typography = OrwyxTypography,
        content = content,
    )
}
