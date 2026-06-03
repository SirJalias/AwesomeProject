#!/usr/bin/env bash
#
# Build a *profileable* Android build and send it to the connected device.
#
# A profileable build is release-optimized (Hermes bytecode, bundled JS,
# minification, non-debuggable) but declares <profileable android:shell="true"/>
# so native profilers can attach — giving realistic performance/memory numbers,
# unlike a debug build. Ideal for measuring image cache / graphics memory.
#
# Usage:
#   scripts/android-profileable.sh [--launch] [--meminfo] [--no-install] [--clean]
#
#   (no flags)    Build the APK and install it on the current device.
#   --no-install  Build only; do not install.
#   --launch      Launch the app after installing.
#   --meminfo     Print image/graphics memory after launch (implies --launch).
#   --clean       Run a clean build.
#   -h, --help    Show this help.
#
# Tip: with multiple devices attached, set ANDROID_SERIAL=<serial> to choose one.

set -euo pipefail

APP_ID="com.awesomeproject"
MAIN_ACTIVITY="${APP_ID}/.MainActivity"
VARIANT="profileable"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="${ROOT_DIR}/android"
APK_PATH="${ANDROID_DIR}/app/build/outputs/apk/${VARIANT}/app-${VARIANT}.apk"

DO_INSTALL=true
DO_LAUNCH=false
DO_MEMINFO=false
DO_CLEAN=false

for arg in "$@"; do
  case "$arg" in
    --install)    DO_INSTALL=true ;;
    --no-install) DO_INSTALL=false ;;
    --launch)     DO_INSTALL=true; DO_LAUNCH=true ;;
    --meminfo)    DO_INSTALL=true; DO_LAUNCH=true; DO_MEMINFO=true ;;
    --clean)      DO_CLEAN=true ;;
    -h|--help)    grep '^#' "${BASH_SOURCE[0]}" | sed '1d;s/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg (use --help)"; exit 1 ;;
  esac
done

echo "==> Building ${VARIANT} APK (Hermes, bundled JS, non-debuggable + profileable)…"
cd "${ANDROID_DIR}"
GRADLE_TASK="assembleProfileable"
$DO_CLEAN && GRADLE_TASK="clean ${GRADLE_TASK}"
# shellcheck disable=SC2086
./gradlew :app:${GRADLE_TASK}

if [[ ! -f "${APK_PATH}" ]]; then
  echo "!! Expected APK not found at ${APK_PATH}"; exit 1
fi
echo "==> APK ready: ${APK_PATH}"
echo "    size: $(du -h "${APK_PATH}" | cut -f1)"

# Resolve which device to send the app to.
DEVICE_SERIAL=""
if $DO_INSTALL; then
  if [[ -n "${ANDROID_SERIAL:-}" ]]; then
    DEVICE_SERIAL="${ANDROID_SERIAL}"
  else
    DEVICE_SERIAL="$(adb devices | awk 'NR>1 && $2=="device" {print $1; exit}')"
  fi
  if [[ -z "${DEVICE_SERIAL}" ]]; then
    echo "!! No device/emulator connected — skipping install."
    echo "   Connect a device and re-run, or install manually:"
    echo "     adb install -r -d \"${APK_PATH}\""
    DO_INSTALL=false; DO_LAUNCH=false; DO_MEMINFO=false
  fi
fi

ADB=(adb)
[[ -n "${DEVICE_SERIAL}" ]] && ADB=(adb -s "${DEVICE_SERIAL}")

if $DO_INSTALL; then
  echo "==> Installing to ${DEVICE_SERIAL}…"
  if ! "${ADB[@]}" install -r -d "${APK_PATH}"; then
    # Recover from a stuck/duplicate pending install session
    # (INSTALL_FAILED_DUPLICATE_PACKAGE) by uninstalling and retrying clean.
    echo "   Install failed — clearing the existing/pending install and retrying clean…"
    "${ADB[@]}" uninstall "${APP_ID}" >/dev/null 2>&1 || true
    "${ADB[@]}" install -d "${APK_PATH}"
  fi
  echo "    Installed ${APP_ID} on ${DEVICE_SERIAL}."
fi

if $DO_LAUNCH; then
  echo "==> Launching ${MAIN_ACTIVITY}…"
  "${ADB[@]}" shell am start -n "${MAIN_ACTIVITY}" >/dev/null
fi

if $DO_MEMINFO; then
  echo "==> Waiting 6s for the home feed + images to load…"
  sleep 6
  echo "==> Image / graphics memory for ${APP_ID} (dumpsys meminfo):"
  echo "    (Graphics + EGL mtrack ≈ GPU-side bitmaps; Native Heap holds decoded images)"
  "${ADB[@]}" shell dumpsys meminfo "${APP_ID}" \
    | grep -Ei "Native Heap|Graphics|EGL mtrack|GL mtrack|TOTAL " || true
  echo
  echo "    Re-run anytime:  adb shell dumpsys meminfo ${APP_ID}"
fi

cat <<EOF

Next steps for profiling image consumption:
  • Memory snapshot:   adb shell dumpsys meminfo ${APP_ID}
  • Live graphics:     adb shell dumpsys gfxinfo ${APP_ID}
  • Android Studio:    Profiler → attach to '${APP_ID}' (profileable) → Memory
  • System trace:      record a Perfetto trace while scrolling the feed
EOF
