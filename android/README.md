# Unit Calculator (Android)

Offline-first electricity meter manager for people in Pakistan who run several meters against a
monthly unit limit. It eliminates manual calculations, remembers every reading on-device, and
makes it visually obvious whether consumption is safe or approaching the limit.

**Kotlin · Jetpack Compose · Material 3 · MVVM + Repository · Room · Hilt · DataStore · Coroutines/StateFlow**

No account, no cloud, no ads, no tracking. Internet is only used for opt-in features (bill sync,
scanner) planned in later milestones.

## Current status — MVP core (M0–M4)

Implemented:

- **Meters tab**: dashboard summary cards (totals, avg/day, projection, safe/warning/critical
  counts), search + sort, and per-meter cards with tap-to-reveal masked reference, an animated
  gradient progress bar (deep-green → dark-red), live consumed/remaining/percent, status badge,
  and expandable actions.
- **Add / edit meter** with full validation (current ≥ previous, target > 0, no negatives,
  optional decimals) and friendly inline errors.
- **Meter detail** with full reference, forecast (avg/day, projection, over/under), monthly reset,
  delete, and reading history.
- **Monthly reset** that snapshots the closed month to history and rolls the cycle forward.
- **Planning tab** (preview): billing-cycle window, expected-vs-actual pace, and forecast. The full
  day-by-day calendar and charts arrive in M5.
- **Settings**: theme (light/dark/system), monthly reading date, default target, decimals toggle,
  about.
- **Persistence**: Room database with a seeded starter meter on first launch; settings in DataStore.

Planned next (see `PLAN.md`): M5 planning calendar + charts, M6 history screen, M7 backup
export/import, M8 optional bill sync + OCR (isolated modules), M9 polish.

## Architecture

```
Compose UI → ViewModel (StateFlow) → Repository (interface) → Room / DataStore
                                    ↘ pure engines: CalculationEngine, MeterValidator
```

- **domain/** — framework-free models, engines and repository interfaces (fully unit-tested).
- **data/** — Room entities/DAOs, DataStore, mappers, repository implementations.
- **ui/** — theme (neumorphism + glassmorphism), navigation, reusable components, screens.
- **di/** — Hilt modules.

Electricity providers live in a code registry (`ElectricityProvider`), so adding a company is a
one-line change with no database migration.

## Build & run

Requires Android Studio (Ladybug or newer) with Android SDK 35.

```bash
cd android
./gradlew assembleDebug      # build
./gradlew test               # run JVM unit tests (engine, validator, billing cycle)
```

Or open the `android/` folder in Android Studio and press Run.

> Note: `minSdk = 26` (Android 8.0) so the adaptive launcher icon works without legacy fallbacks.
