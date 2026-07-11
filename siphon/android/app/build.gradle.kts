plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ksp)
}

android {
    namespace = "app.vessel"
    compileSdk = 34

    defaultConfig {
        applicationId = "app.vessel"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        // Baked-in default API — the deployed Vessel backend. Override with
        // -PsiphonApiBaseUrl=... at build time, or per-install from Settings.
        buildConfigField(
            "String",
            "SIPHON_API_BASE_URL",
            "\"${project.findProperty("siphonApiBaseUrl") ?: "https://pixxelpulse.onrender.com"}\"",
        )
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

// Ship a human-readable file name instead of Gradle's default
// "app-debug.apk" / "app-release-unsigned.apk". outputFileName is only
// settable on the internal impl class, not the public VariantOutput type.
androidComponents {
    onVariants { variant ->
        variant.outputs
            .filterIsInstance<com.android.build.api.variant.impl.VariantOutputImpl>()
            .forEach { output ->
                output.outputFileName.set("Vessel-${android.defaultConfig.versionName}-${variant.name}.apk")
            }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.androidx.documentfile)
    implementation(libs.okhttp)
    implementation(libs.coil.compose)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.serialization.json)

    // On-device YouTube extraction — resolves straight from the user's own
    // phone/network instead of a shared server IP, sidestepping the
    // datacenter-IP bot-blocking that plagues server-side yt-dlp. Same
    // approach the NewPipe app uses.
    implementation("com.github.TeamNewPipe:NewPipeExtractor:v0.26.3")

    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
}
