#!/bin/bash

# Run memory endurance test 100 times and collect results

echo "🔥 Running Memory Endurance Test 100 Times"
echo "=========================================="
echo ""

RESULTS_FILE="memory-test-results.txt"
> $RESULTS_FILE

for i in {1..100}
do
  echo "Run $i/100..."
  npx playwright test tests/memory-endurance.spec.ts --config=playwright.memory.config.ts 2>&1 | tee -a $RESULTS_FILE
  
  if [ $? -eq 0 ]; then
    echo "✅ Run $i completed successfully"
  else
    echo "❌ Run $i failed"
  fi
  
  echo ""
done

echo ""
echo "=========================================="
echo "📊 FINAL MEMORY ANALYSIS"
echo "=========================================="

# Extract memory growth values
echo ""
echo "Memory Growth per Run:"
grep "Total Growth:" $RESULTS_FILE

echo ""
echo "Summary Statistics:"
grep -E "(Initial Memory|Final Memory|Total Growth|Operations)" $RESULTS_FILE | tail -20

echo ""
echo "Full results saved to: $RESULTS_FILE"
