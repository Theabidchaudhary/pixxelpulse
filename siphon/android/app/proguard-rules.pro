# kotlinx.serialization — keep generated serializers for API DTOs
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt
-keepclassmembers class app.vessel.data.remote.** {
    *** Companion;
}
-keepclasseswithmembers class app.vessel.data.remote.** {
    kotlinx.serialization.KSerializer serializer(...);
}

# OkHttp platform warnings
-dontwarn okhttp3.internal.platform.**
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**

# NewPipeExtractor pulls in Rhino (JS engine, used for YouTube signature
# deciphering) as a transitive dependency. Rhino's JavaToJSONConverters and
# RhinoScriptEngineFactory optionally reach for java.beans.* / javax.script.*
# — desktop-only introspection APIs that don't exist on Android and are never
# actually invoked there. Without these, R8 treats the missing classes as a
# hard build error rather than dead code.
-dontwarn java.beans.**
-dontwarn javax.script.**
