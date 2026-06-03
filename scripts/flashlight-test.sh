#!/usr/bin/env bash
#
# Run a Flashlight performance test (CPU / RAM / FPS) while a Maestro flow
# drives the app, and write a results file you can compare across builds.
#
# Mirrors:
#   flashlight test --bundleId com.awesomeproject --iterationCount 1 \
#     --testCommand "maestro test .maestro/browse-products.yaml"
#
# Usage:
#   scripts/flashlight-test.sh [--iterations N] [--flow FILE] [--output FILE] [--record]
#
#   --iterations N  Number of measurement iterations (default: 1).
#   --flow FILE     Maestro flow to run (default: .maestro/browse-products.yaml).
#   --output FILE   Results JSON path (default: results_<rn-minor>.json, e.g. results_85.json).
#   --record        Also record a video of each iteration.
#   -h, --help      Show this help.
#
# After the run:
#   flashlight report <output>                     # open the single-run report
#   flashlight report results_83.json results_85.json   # compare two builds
#
# Tip: with multiple devices attached, set ANDROID_SERIAL=<serial> to choose one.

set -euo pipefail

APP_ID="com.awesomeproject"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

ITERATIONS=1
FLOW=".maestro/browse-products.yaml"
RN_VERSION="$(node -e "console.log(require('react-native/package.json').version)" 2>/dev/null || echo "unknown")"
RN_MINOR="$(echo "${RN_VERSION}" | cut -d. -f2)"
OUTPUT="results_${RN_MINOR}.json"
RECORD=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --iterations) ITERATIONS="$2"; shift 2 ;;
    --flow)       FLOW="$2"; shift 2 ;;
    --output)     OUTPUT="$2"; shift 2 ;;
    --record)     RECORD=true; shift ;;
    -h|--help)    grep '^#' "${BASH_SOURCE[0]}" | sed '1d;s/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1 (use --help)"; exit 1 ;;
  esac
done

# Resolve the flashlight binary (PATH or the default install location).
FLASHLIGHT="$(command -v flashlight 2>/dev/null || true)"
if [[ -z "${FLASHLIGHT}" && -x "${HOME}/.flashlight/bin/flashlight" ]]; then
  FLASHLIGHT="${HOME}/.flashlight/bin/flashlight"
fi
if [[ -z "${FLASHLIGHT}" ]]; then
  echo "!! flashlight is not installed."
  echo "   Install it with:"
  echo "       curl https://get.flashlight.dev | bash"
  echo "   then re-run this script (restart your shell or add ~/.flashlight/bin to PATH)."
  exit 1
fi

command -v maestro >/dev/null 2>&1 || { echo "!! maestro not found (the test flow needs it)."; exit 1; }
[[ -f "${FLOW}" ]] || { echo "!! Maestro flow not found: ${FLOW}"; exit 1; }

SERIAL="${ANDROID_SERIAL:-$(adb devices | awk 'NR>1 && $2=="device" {print $1; exit}')}"
[[ -n "${SERIAL}" ]] || { echo "!! No device/emulator connected."; exit 1; }
export ANDROID_SERIAL="${SERIAL}"

if ! adb -s "${SERIAL}" shell pm list packages 2>/dev/null | grep -q "package:${APP_ID}$"; then
  echo "!! ${APP_ID} is not installed on ${SERIAL}."
  echo "   Build & install it first:  pnpm android:profileable"
  exit 1
fi

echo "==> Flashlight test"
echo "    device:     ${SERIAL}"
echo "    bundleId:   ${APP_ID}"
echo "    iterations: ${ITERATIONS}"
echo "    flow:       ${FLOW}"
echo "    output:     ${OUTPUT}"

FLAGS=(--bundleId "${APP_ID}"
       --iterationCount "${ITERATIONS}"
       --testCommand "maestro test ${FLOW}"
       --resultsFilePath "${OUTPUT}"
       --resultsTitle "RN ${RN_VERSION}")
$RECORD && FLAGS+=(--record)

"${FLASHLIGHT}" test "${FLAGS[@]}"

echo
echo "==> Done. Results written to ${OUTPUT}"
echo "    View:     flashlight report ${OUTPUT}"
if [[ -f "results_83.json" && "${OUTPUT}" != "results_83.json" ]]; then
  echo "    Compare:  flashlight report results_83.json ${OUTPUT}"
fi
