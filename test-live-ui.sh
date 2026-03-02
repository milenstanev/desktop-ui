#!/bin/bash

# Live UI Test Runner
# Tests the running application at http://192.168.1.5:3000/

echo "========================================="
echo "Live UI Test"
echo "========================================="
echo ""
echo "Testing application at: http://192.168.1.5:3000/"
echo ""

# Check if the server is running
if ! curl -s --head http://192.168.1.5:3000/ | head -n 1 | grep "HTTP/1.[01] [23].." > /dev/null; then
  echo "❌ Error: Application is not running at http://192.168.1.5:3000/"
  echo "Please start the application first with: npm start"
  exit 1
fi

echo "✅ Application is running"
echo ""

# Run Playwright tests against live server
echo "Running Playwright tests..."
npx playwright test --config=playwright.live.config.ts --headed

echo ""
echo "========================================="
echo "Test complete!"
echo "========================================="
