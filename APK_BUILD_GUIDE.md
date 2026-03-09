# Local APK Build Guide

## Prerequisites

- Java 17+ (`java -version`)
- Android SDK with `ANDROID_HOME` set (e.g. `/home/melnerdz/Android/Sdk`)
- `adb` available in PATH (comes with Android SDK platform-tools)

---

## Step 1 — Install dependencies

```bash
pnpm install
```

---

## Step 2 — Generate the native Android project

```bash
npx expo prebuild --platform android
```

This creates the `android/` folder with all Gradle files.
Your package name `host.dardev.kinetixfitnesstracker` is already set in `app.json`.

> **Note:** The `android/` folder is auto-generated. Avoid committing it unless you plan to stay in bare workflow permanently.

---

## Step 3 — Build the APK

Navigate into the android folder first:

```bash
cd android
```

**Debug APK** (no signing needed, recommended for first build):

```bash
./gradlew assembleDebug
```

**Release APK** (optimized, produces an unsigned APK):

```bash
./gradlew assembleRelease
```

> First build takes **5–15 minutes** — Gradle downloads all dependencies. Subsequent builds are much faster.

---

## Step 4 — Locate the APK

After the build completes:

| Build Type | Output Path |
|---|---|
| Debug | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Release | `android/app/build/outputs/apk/release/app-release-unsigned.apk` |

---

## Step 5 — Install on your physical device

Enable **USB Debugging** on your Android device, connect via USB, then run:

```bash
# From project root
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Verify your device is detected before installing:

```bash
adb devices
```

---

## Re-running After Code Changes

If you already have the `android/` folder and just changed JS/TS code:

```bash
# No need to re-run prebuild — just rebuild the APK
cd android && ./gradlew assembleDebug
```

If you changed `app.json` (plugins, package name, icons, etc.), re-run prebuild:

```bash
npx expo prebuild --platform android --clean
```

> `--clean` wipes the old `android/` folder and regenerates it fresh.
