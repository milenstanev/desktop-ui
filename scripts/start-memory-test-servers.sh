#!/bin/bash
# Start main app and analytics remote for memory/endurance tests
# Main app: port 3000, Analytics: port 3002

cd "$(dirname "$0")/.."

# Start main app in background
npx serve -s build -l 3000 &
MAIN_PID=$!

# Start analytics remote in background
(cd src/features/remotes/analytics && npm run start) &
ANALYTICS_PID=$!

# Wait for both - script exits when either dies (Playwright will have started by then)
wait $MAIN_PID $ANALYTICS_PID
