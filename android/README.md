# Orwyx Player

A premium, fully offline Android video player. No ads, no analytics, no accounts,
no streaming, no recommendations — it exists only to organize and play your own
videos, beautifully and fast.

## Highlights

- **Library** — instant MediaStore scan + SAF folder trees, folders/all-videos
  browsing, instant search, continue watching, favorites, hidden folders, and a
  PIN/fingerprint-protected private folder. Delete/rename/share with proper
  scoped-storage consent flows.
- **Scale** — every sort key (name, date added, last played, size, duration,
  resolution, quality, frame rate) and filter (4K/1080p/720p, HDR/SDR,
  favorites, recently added/played, folder) runs as an indexed SQLite query
  through Paging 3, so 100,000+ videos scroll smoothly.
- **Formats** — MP4, MKV, AVI, MOV, WMV, FLV, WebM, MPEG, M4V, 3GP, TS and more,
  with AAC/MP3/AC3/E-AC3/DTS/FLAC/WAV/OGG audio via Media3's extractors and
  decoder fallback.
- **HDR** — HDR10, HDR10+, HLG, and Dolby Vision are detected per file
  (transfer function + MIME inspection), badged in the library, and rendered
  through the platform HDR pipeline on capable displays.
- **Playback** — pitch-corrected 0.25×–3× speed, frame stepping, repeat
  one/all, shuffle, sleep timer (including end-of-video), Picture-in-Picture,
  background audio-only playback, and automatic resume.
- **Gestures** — brightness (left), volume (right), horizontal seek with live
  preview, zone double-taps, long-press 2× hold, pinch zoom + pan, two-finger
  screen lock; sensitivity is user-tunable.
- **Subtitles** — SRT/ASS/SSA/SUB/VTT with sidecar auto-discovery, manual SAF
  picker, recents, live ± delay, encoding override, dialogue search, and full
  styling (size, color, outline, shadow, background, position, opacity) via an
  owned Compose renderer shared by external and embedded tracks.
- **Audio** — multiple audio tracks, PCM audio-delay processor for A/V sync,
  system equalizer, volume boost / loudness (LoudnessEnhancer), mono downmix,
  Bluetooth/headset controls through MediaSession.
- **Enhancement** — optional GPU pipeline (Media3 GlEffects: contrast, color,
  brightness) that toggles live during playback and disables itself gracefully
  on unsupported devices; documented extension points for sharpening, denoise,
  debanding, and NPU super-resolution.
- **AI subtitles** — on-device architecture (`ai/`) with final contracts for
  speech-to-text generation, translation, and summarization. Engines (e.g.
  whisper.cpp) plug in behind `SubtitleGenerator`; until a model is installed
  the UI shows a download-model state. Dialogue search works today.
- **Battery** — hardware decoding first with automatic fallback, battery-mode
  LoadControl tuning, throttled two-phase library scanning, Coil disk-cached
  thumbnails, and idle-free coroutines.

## Tech stack

Kotlin · Jetpack Compose (Material 3, dynamic color) · MVVM + clean layering ·
Room + Paging 3 · Media3/ExoPlayer · DataStore · Hilt · Coil (video frames) ·
SAF · minSdk 29 (Android 10) / targetSdk 35.

## Architecture

```
com.orwyx.player
├── domain/model      Pure models: Video, VideoFolder, LibraryQuery, HDR/resolution enums
├── data
│   ├── db            Room entities/DAO + parameterized dynamic query builder
│   ├── scanner       Fast MediaStore pass + throttled MediaExtractor enrichment (codec/fps/HDR)
│   ├── repository    Single source of truth for the UI
│   ├── settings      DataStore-backed AppSettings
│   └── files         Scoped-storage delete/rename/share (consent IntentSenders)
├── player            PlayerEngine (ExoPlayer), MediaSessionService, sleep timer
│   ├── audio         Audio delay + mono processors, equalizer/loudness controller
│   ├── subtitle      SRT/VTT/ASS/SSA/SUB parsers, SubtitleManager (delay, sidecars, search)
│   └── enhance       Media3 GlEffect enhancement pipeline
├── ai                On-device AI contracts + model manager (engines plug in)
├── core              Formatters, format tables, PIN (PBKDF2) security
└── ui                Compose: library (paged grid), player, vault, settings, theme, nav
```

Data flows one way: `scanner → Room → repository → ViewModel → Compose`. The
player UI talks to a single shared `PlayerEngine`; `PlaybackService` wraps the
same player in a `MediaSession` for notification/lockscreen/Bluetooth control.

## Building

Open `android/` in Android Studio (Ladybug+) and run the `app` configuration.
Android Studio generates the Gradle wrapper binary from
`gradle/wrapper/gradle-wrapper.properties` (Gradle 8.9) on first sync; from the
command line, run `gradle wrapper` once, then:

```
./gradlew :app:assembleDebug        # build
./gradlew :app:testDebugUnitTest    # JVM unit tests (parsers, formatters, query builder)
```

## Privacy

The `INTERNET` permission exists solely for user-initiated subtitle/AI-model
downloads. There is no telemetry, no analytics SDK, and no account system.
Private-folder PIN material is a salted PBKDF2 hash, excluded from backups.
