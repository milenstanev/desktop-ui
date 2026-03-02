# Live UI Testing Guide

Test your running application at: **http://192.168.1.5:3000/**

---

## 🚀 Quick Start

### Option 1: Automated Testing (Recommended)

Run the comprehensive automated test suite:

```bash
npm run test:live
```

This will:
- Check if the application is running
- Run 15+ automated tests covering all features
- Show results in a browser window
- Report any issues found

### Option 2: Manual Testing

Use the detailed checklist:

```bash
open MANUAL_TEST_CHECKLIST.md
```

Then manually verify each item while using the application.

---

## 📋 What Gets Tested

### Automated Tests (`test:live`)

1. **Application Loading**
   - Page loads successfully
   - Title and heading correct
   - Desktop container visible

2. **Theme Switching**
   - Light theme (default)
   - Dark theme
   - Gradient theme (glassmorphism)
   - Theme persistence

3. **Counter Feature**
   - Add window
   - Increment/decrement
   - Multiple counters
   - State persistence

4. **Notes Feature**
   - Add notes
   - Delete notes
   - Multiple notes
   - State persistence

5. **Timer Feature**
   - Start/pause/reset
   - Time display
   - Multiple timers

6. **Form Editor Feature**
   - Form loading
   - Field validation
   - Form submission
   - Error handling

7. **Window Management**
   - Add windows
   - Close windows
   - Drag windows
   - Resize windows

8. **Layout Controls**
   - Organize windows
   - Reset layout

9. **Keyboard Shortcuts**
   - Escape to close
   - Cmd/Ctrl+W to close

10. **Accessibility**
    - ARIA attributes
    - Keyboard navigation
    - Screen reader support

11. **Performance**
    - Load time < 3 seconds
    - Smooth interactions

12. **Responsive Design**
    - Mobile (375px)
    - Tablet (768px)
    - Desktop (1920px)

13. **PWA Features**
    - Service worker registration

---

## 🛠️ Test Files

- **`tests/live-ui-test.spec.ts`** - Automated Playwright tests
- **`test-live-ui.sh`** - Test runner script
- **`MANUAL_TEST_CHECKLIST.md`** - Manual testing checklist

---

## 📊 Running Tests

### Prerequisites

1. **Application must be running:**
   ```bash
   npm start
   ```
   Application should be accessible at http://192.168.1.5:3000/

2. **Playwright installed:**
   ```bash
   npx playwright install
   ```

### Run Automated Tests

**Headed mode (see browser):**
```bash
npm run test:live
```

**Headless mode (faster):**
```bash
npx playwright test tests/live-ui-test.spec.ts
```

**Debug mode:**
```bash
npx playwright test tests/live-ui-test.spec.ts --debug
```

**Specific test:**
```bash
npx playwright test tests/live-ui-test.spec.ts -g "Counter"
```

---

## 🐛 Troubleshooting

### Application Not Running
```
❌ Error: Application is not running at http://192.168.1.5:3000/
```

**Solution:** Start the application first:
```bash
npm start
```

### Port Already in Use
```
Something is already running on port 3000
```

**Solution:** Use a different port:
```bash
PORT=3001 npm start
```

Then update the URL in `tests/live-ui-test.spec.ts`:
```typescript
const LIVE_URL = 'http://192.168.1.5:3001/';
```

### Tests Failing
1. Check console for errors
2. Verify application is fully loaded
3. Clear localStorage and reload
4. Check network tab for failed requests
5. Run tests in debug mode

### Browser Not Opening
```bash
npx playwright install chromium
```

---

## 📈 Test Results

### Expected Results

All tests should **PASS** with:
- ✅ 15+ tests passing
- ✅ 0 tests failing
- ✅ No console errors
- ✅ Load time < 3 seconds

### Common Issues

**Flaky Tests:**
- Network timing issues
- Animation delays
- Race conditions

**Solution:** Tests include proper waits and retries

**Memory Leaks:**
- Open/close many windows
- Check DevTools Memory tab

**Solution:** All cleanup verified (see MEMORY_LEAK_ANALYSIS.md)

---

## 🎯 Test Coverage

### Features Tested
- ✅ All 5 window types (Counter, Notes, Timer, FormEditor, SimpleExample)
- ✅ All 3 themes (light, dark, gradient)
- ✅ Window management (add, close, drag, resize)
- ✅ Layout controls (organize, reset)
- ✅ Keyboard shortcuts (Escape, Cmd/Ctrl+W)
- ✅ Form validation and submission
- ✅ State persistence (localStorage)
- ✅ Accessibility (ARIA, keyboard nav)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Performance (load time, interactions)

### Not Tested (Manual Only)
- Visual appearance (colors, fonts, spacing)
- Browser compatibility (Chrome, Firefox, Safari)
- Network issues (offline, slow connection)
- Edge cases (extreme usage, invalid input)

---

## 📝 Reporting Issues

When reporting issues, include:

1. **Test that failed:**
   ```
   ✗ Can add and interact with Counter window
   ```

2. **Error message:**
   ```
   Error: locator.click: Timeout 30000ms exceeded
   ```

3. **Steps to reproduce:**
   - Open application
   - Click "Add Counter"
   - Click increment button

4. **Environment:**
   - Browser: Chrome 120
   - OS: macOS 14.0
   - Screen size: 1920x1080

5. **Screenshots/Video:**
   - Playwright captures automatically on failure
   - Check `test-results/` folder

---

## 🔄 Continuous Testing

### During Development

Run tests after each change:
```bash
npm run test:live
```

### Before Commits

Pre-commit hook runs:
- Linting
- Type checking
- Unit tests

### Before Release

Run full test suite:
```bash
npm run test:all
npm run test:flaky
npm run test:live
```

---

## 📚 Related Documentation

- **MANUAL_TEST_CHECKLIST.md** - Detailed manual testing guide
- **MEMORY_LEAK_ANALYSIS.md** - Memory leak analysis
- **README.md** - Project overview and setup
- **docs/PERFORMANCE.md** - Performance monitoring
- **docs/PWA_GUIDE.md** - PWA features

---

## ✅ Success Criteria

Your application is ready when:

1. ✅ All automated tests pass
2. ✅ Manual checklist completed
3. ✅ No console errors
4. ✅ Performance is good (< 3s load)
5. ✅ Works on all target browsers
6. ✅ Accessibility verified
7. ✅ Mobile experience is usable
8. ✅ State persists correctly
9. ✅ No memory leaks
10. ✅ Visual quality is professional

---

**Happy Testing!** 🎉
