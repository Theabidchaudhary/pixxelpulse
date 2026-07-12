package com.orwyx.unitcalculator.domain.model

/** User-configurable preferences, persisted in DataStore. */
data class AppSettings(
    val themeMode: ThemeMode = ThemeMode.SYSTEM,
    /** Day of month (1..28) on which meters are read and the billing cycle rolls over. */
    val readingDate: Int = 1,
    val defaultTarget: Double = 200.0,
    val allowDecimals: Boolean = false,
)

enum class ThemeMode { LIGHT, DARK, SYSTEM }
