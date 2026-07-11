# Orwyx Player release rules.
# Media3, Room, Hilt, and Compose ship consumer rules; only app-specific keeps go here.

# Keep enum values referenced by name from persisted settings.
-keepclassmembers enum com.orwyx.player.domain.model.** { *; }
-keepclassmembers enum com.orwyx.player.data.settings.** { *; }

# Coroutines debug metadata is not needed in release.
-assumenosideeffects class kotlinx.coroutines.debug.internal.DebugProbesImpl {
    *** isInstalled$kotlinx_coroutines_debug();
}
