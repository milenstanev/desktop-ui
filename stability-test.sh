#!/bin/bash

# E2E Stability Test - Run tests 100 times
# This script runs the E2E test suite 100 times to verify stability

RUNS=100
PASSED=0
FAILED=0
FAILED_RUNS=()

echo "========================================"
echo "E2E Stability Test - $RUNS Runs"
echo "========================================"
echo ""

for i in $(seq 1 $RUNS); do
  echo "Run $i/$RUNS..."
  
  # Run E2E tests and capture exit code
  npm run test:e2e > /dev/null 2>&1
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -eq 0 ]; then
    PASSED=$((PASSED + 1))
    echo "✓ Run $i: PASSED"
  else
    FAILED=$((FAILED + 1))
    FAILED_RUNS+=($i)
    echo "✗ Run $i: FAILED (exit code: $EXIT_CODE)"
  fi
  
  # Brief pause between runs
  sleep 1
done

echo ""
echo "========================================"
echo "Stability Test Results"
echo "========================================"
echo "Total Runs:    $RUNS"
echo "Passed:        $PASSED"
echo "Failed:        $FAILED"
echo "Success Rate:  $(awk "BEGIN {printf \"%.2f\", ($PASSED/$RUNS)*100}")%"

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "Failed runs: ${FAILED_RUNS[*]}"
  exit 1
else
  echo ""
  echo "🎉 All tests passed! 100% stability achieved."
  exit 0
fi
