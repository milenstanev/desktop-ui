#!/usr/bin/env bash
set -euo pipefail

# Start main app and analytics remote for Playwright suites.
# Main app: port 3000, Analytics: port 3002

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

cleanup() {
  trap - EXIT INT TERM
  if [[ -n "${MAIN_PID:-}" ]]; then
    kill "$MAIN_PID" 2>/dev/null || true
  fi
  if [[ -n "${ANALYTICS_PID:-}" ]]; then
    kill "$ANALYTICS_PID" 2>/dev/null || true
  fi
  wait "${MAIN_PID:-}" "${ANALYTICS_PID:-}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

if [[ ! -d build ]]; then
  echo "build/ not found. Running npm run build..."
  npm run build
fi

npx serve -s build -l 3000 &
MAIN_PID=$!

npm run start --prefix src/features/remotes/analytics &
ANALYTICS_PID=$!

# Keep this launcher alive while both servers are healthy.
while kill -0 "$MAIN_PID" 2>/dev/null && kill -0 "$ANALYTICS_PID" 2>/dev/null; do
  sleep 1
done

# Force non-zero exit if either server dies unexpectedly.
exit 1
