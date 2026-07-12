package com.orwyx.player.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.orwyx.player.data.settings.ThemeMode

// Deep navy/indigo "glass" identity, always used regardless of wallpaper —
// dynamic Material You color is deliberately not applied so the app keeps a
// consistent premium look across devices, matching the reference design.
private val InkNavy = Color(0xFF0A0C16)
private val SurfaceNavy = Color(0xFF10131F)
private val GlassCardNavy = Color(0xFF181C30)
private val Indigo = Color(0xFF5B7FFF)
private val IndigoDeep = Color(0xFF2C3B7E)

private val DarkColors = darkColorScheme(
    primary = Indigo,
    onPrimary = Color.White,
    primaryContainer = IndigoDeep,
    onPrimaryContainer = Color(0xFFDCE3FF),
    secondary = Color(0xFF8CA3FF),
    background = InkNavy,
    onBackground = Color(0xFFEDEFF7),
    surface = SurfaceNavy,
    onSurface = Color(0xFFEDEFF7),
    surfaceVariant = GlassCardNavy,
    onSurfaceVariant = Color(0xFFA6ACC4),
    outline = Color(0xFF2E3350),
    outlineVariant = Color(0xFF20233A),
)

private val LightColors = lightColorScheme(
    primary = Color(0xFF4A63D6),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFDCE3FF),
    onPrimaryContainer = Color(0xFF10184A),
    secondary = Color(0xFF5B72C4),
    background = Color(0xFFF5F6FB),
    onBackground = Color(0xFF14162B),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF14162B),
    surfaceVariant = Color(0xFFECEEF7),
    onSurfaceVariant = Color(0xFF5B5F78),
    outline = Color(0xFFD3D6E6),
)

/** Generously rounded, soft geometry across cards, sheets, and dialogs — glass-card language. */
private val OrwyxShapes = Shapes(
    extraSmall = RoundedCornerShape(10.dp),
    small = RoundedCornerShape(14.dp),
    medium = RoundedCornerShape(18.dp),
    large = RoundedCornerShape(24.dp),
    extraLarge = RoundedCornerShape(32.dp),
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
    MaterialTheme(
        colorScheme = if (dark) DarkColors else LightColors,
        shapes = OrwyxShapes,
        typography = OrwyxTypography,
        content = content,
    )
}
