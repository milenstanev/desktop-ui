#!/bin/bash

# Live UI Stability Test - 100+ Runs
# Tests the running application at http://192.168.1.5:3000/

RUNS=100
LIVE_URL="http://192.168.1.5:3000/"

echo "========================================="
echo "Live UI Stability Test - $RUNS Runs"
echo "========================================="
echo ""

# Check if the server is running
echo "Checking if application is running at $LIVE_URL..."
if ! curl -s --head "$LIVE_URL" | head -n 1 | grep "HTTP/1.[01] [23].." > /dev/null; then
  echo "❌ Error: Application is not running at $LIVE_URL"
  echo "Please start the application first with: npm start"
  exit 1
fi

echo "✅ Application is running"
echo ""

# Initialize counters
PASSED=0
FAILED=0
FAILED_RUNS=""

# Run tests multiple times
for i in $(seq 1 $RUNS); do
  echo "Run $i/$RUNS..."
  
  # Run Playwright tests (headless for speed) with live config
  if npx playwright test --config=playwright.live.config.ts --reporter=line > /dev/null 2>&1; then
    PASSED=$((PASSED + 1))
    echo "✓ Run $i: PASSED"
  else
    FAILED=$((FAILED + 1))
    FAILED_RUNS="$FAILED_RUNS $i"
    echo "✗ Run $i: FAILED"
  fi
done

echo ""
echo "========================================="
echo "Stability Test Results"
echo "========================================="
echo "Total Runs:    $RUNS"
echo "Passed:        $PASSED"
echo "Failed:        $FAILED"

# Calculate success rate
if [ $RUNS -gt 0 ]; then
  SUCCESS_RATE=$(awk "BEGIN {printf \"%.2f\", ($PASSED / $RUNS) * 100}")
  echo "Success Rate:  $SUCCESS_RATE%"
fi

echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All tests passed! 100% stability achieved."
else
  echo "⚠️  Some tests failed. Failed runs:$FAILED_RUNS"
  echo ""
  echo "To debug, run a single test with:"
  echo "npx playwright test tests/live-ui-test.spec.ts --headed --debug"
fi

echo ""
echo "========================================="

exit $FAILED
