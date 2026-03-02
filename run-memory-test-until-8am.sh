#!/bin/bash

# Run memory endurance test until 8 AM and generate report

echo "🔥 Running Memory Endurance Tests Until 8:00 AM"
echo "=========================================="
echo "Start time: $(date)"
echo ""

RESULTS_FILE="memory-test-results.txt"
> $RESULTS_FILE

# Calculate seconds until 8 AM
TARGET_HOUR=8
CURRENT_HOUR=$(date +%H)
CURRENT_MIN=$(date +%M)
CURRENT_SEC=$(date +%S)

if [ $CURRENT_HOUR -lt $TARGET_HOUR ]; then
  # Same day
  HOURS_LEFT=$((TARGET_HOUR - CURRENT_HOUR))
else
  # Next day
  HOURS_LEFT=$((24 - CURRENT_HOUR + TARGET_HOUR))
fi

SECONDS_LEFT=$((HOURS_LEFT * 3600 - CURRENT_MIN * 60 - CURRENT_SEC))
END_TIME=$(($(date +%s) + SECONDS_LEFT))

echo "Will run until: $(date -r $END_TIME)"
echo "Estimated time: $HOURS_LEFT hours"
echo ""

RUN_COUNT=0

while [ $(date +%s) -lt $END_TIME ]; do
  RUN_COUNT=$((RUN_COUNT + 1))
  TIME_LEFT=$((END_TIME - $(date +%s)))
  HOURS_LEFT=$((TIME_LEFT / 3600))
  MINS_LEFT=$(((TIME_LEFT % 3600) / 60))
  
  echo "=========================================="
  echo "Run #$RUN_COUNT - $(date +%H:%M:%S)"
  echo "Time remaining: ${HOURS_LEFT}h ${MINS_LEFT}m"
  echo "=========================================="
  
  npx playwright test tests/memory-endurance.spec.ts --config=playwright.memory.config.ts 2>&1 | tee -a $RESULTS_FILE
  
  if [ $? -eq 0 ]; then
    echo "✅ Run $RUN_COUNT completed successfully"
  else
    echo "❌ Run $RUN_COUNT failed"
  fi
  
  echo ""
  
  # Check if we have time for another run (estimate 25 min per run)
  if [ $(($(date +%s) + 1500)) -gt $END_TIME ]; then
    echo "Not enough time for another full run. Stopping."
    break
  fi
done

echo ""
echo "=========================================="
echo "📊 FINAL MEMORY ANALYSIS"
echo "=========================================="
echo "End time: $(date)"
echo "Total runs completed: $RUN_COUNT"
echo ""

# Extract and analyze memory data
echo "Memory Growth Analysis:"
echo "----------------------"
grep "Total Growth:" $RESULTS_FILE | awk '{print $3, $4}' > growth_values.tmp

if [ -s growth_values.tmp ]; then
  # Calculate statistics
  awk '{sum+=$1; sumsq+=$1*$1} END {
    avg=sum/NR; 
    stddev=sqrt(sumsq/NR - avg*avg);
    print "Runs analyzed:", NR;
    print "Average growth:", avg, "MB";
    print "Std deviation:", stddev, "MB";
  }' growth_values.tmp
  
  echo ""
  echo "Growth per run:"
  grep "Total Growth:" $RESULTS_FILE | nl
  
  echo ""
  echo "Memory Leak Assessment:"
  LAST_5=$(grep "Total Growth:" $RESULTS_FILE | tail -5 | awk '{sum+=$3} END {print sum/NR}')
  FIRST_5=$(grep "Total Growth:" $RESULTS_FILE | head -5 | awk '{sum+=$3} END {print sum/NR}')
  
  echo "First 5 runs average: $FIRST_5 MB"
  echo "Last 5 runs average: $LAST_5 MB"
  
  if (( $(echo "$LAST_5 > $FIRST_5 * 1.5" | bc -l) )); then
    echo "⚠️  WARNING: Memory growth increasing over time - possible leak"
  else
    echo "✅ Memory growth stable - no leak detected"
  fi
fi

rm -f growth_values.tmp

echo ""
echo "Full results saved to: $RESULTS_FILE"
echo ""
echo "Test Summary:"
grep -E "ENDURANCE TEST RESULTS" -A 10 $RESULTS_FILE | tail -50
