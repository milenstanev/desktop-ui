#!/bin/bash

# Desktop UI - Complete Test Suite Runner
# This script runs all tests and provides a comprehensive report

set -e

echo "=========================================="
echo "Desktop UI - Complete Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Linter
echo "Step 1/4: Running linter..."
echo "------------------------------------------"
if npm run lint; then
    echo -e "${GREEN}✓ Linter passed${NC}"
else
    echo -e "${RED}✗ Linter failed${NC}"
    exit 1
fi
echo ""

# Step 2: Build
echo "Step 2/4: Building production bundle..."
echo "------------------------------------------"
if npm run build; then
    echo -e "${GREEN}✓ Build passed${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo ""

# Step 3: Unit Tests
echo "Step 3/4: Running unit tests..."
echo "------------------------------------------"
if npm run test:unit; then
    echo -e "${GREEN}✓ Unit tests passed${NC}"
else
    echo -e "${RED}✗ Unit tests failed${NC}"
    exit 1
fi
echo ""

# Step 4: E2E Tests
echo "Step 4/4: Running E2E tests..."
echo "------------------------------------------"
if npm run test:e2e; then
    echo -e "${GREEN}✓ E2E tests passed${NC}"
else
    echo -e "${RED}✗ E2E tests failed${NC}"
    exit 1
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}ALL TESTS PASSED!${NC}"
echo "=========================================="
echo ""
echo "Summary:"
echo "  ✓ Linter: Clean"
echo "  ✓ Build: Success"
echo "  ✓ Unit Tests: All passing"
echo "  ✓ E2E Tests: All passing"
echo ""
echo "The codebase is ready for release!"
