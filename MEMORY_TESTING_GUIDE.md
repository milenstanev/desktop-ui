# Memory Testing Guide

Complete guide to testing memory consumption and detecting memory leaks in the Desktop UI application.

---

## 🎯 Quick Start

### Run Memory Tests

```bash
# Run all memory tests
npx playwright test tests/memory-consumption.spec.ts --headed

# Run specific test
npx playwright test tests/memory-consumption.spec.ts -g "50 windows"

# Run with memory profiling enabled
npx playwright test tests/memory-consumption.spec.ts --headed -- --js-flags="--expose-gc"
```

---

## 📊 What Gets Tested

### 1. **Initial Page Load**
- Baseline memory usage
- Should be < 50MB

### 2. **10 Window Cycles**
- Add and remove 10 windows
- Memory growth should be < 5MB
- Quick leak detection

### 3. **50 Window Cycles**
- Extended leak test
- Memory growth should be < 10MB
- Checks for continuous growth pattern

### 4. **20 Windows Open**
- Memory under load
- Additional memory < 30MB
- Cleanup verification

### 5. **Timer Running**
- Interval leak detection
- Memory growth < 2MB over 10 seconds
- No continuous growth

### 6. **Form Editor Cycles**
- Multiple form submissions
- Memory growth < 5MB
- Event listener cleanup

### 7. **Page Reload**
- Memory reset verification
- Should return to baseline

---

## 🔧 Setup for Memory Testing

### Chrome with Memory API

Memory tests require Chrome's `performance.memory` API:

```bash
# Launch Chrome with memory info enabled
chromium --enable-precise-memory-info

# Or set in Playwright config
use: {
  launchOptions: {
    args: ['--enable-precise-memory-info']
  }
}
```

### Enable Garbage Collection (Optional)

For more accurate tests:

```bash
# Launch with GC exposed
chromium --js-flags="--expose-gc"
```

---

## 📈 Manual Memory Profiling

### Using Chrome DevTools

1. **Open DevTools** (F12)
2. **Go to Memory tab**
3. **Take Heap Snapshot**
4. **Perform actions** (add/remove windows)
5. **Take another snapshot**
6. **Compare snapshots**

#### Step-by-Step:

```
1. Open app in Chrome
2. DevTools > Memory > Take snapshot (Snapshot 1)
3. Add 20 windows
4. Remove all windows
5. Click "Collect garbage" button
6. Take snapshot (Snapshot 2)
7. Compare: Snapshot 2 vs Snapshot 1
8. Look for "Detached DOM nodes" or growing objects
```

### What to Look For:

✅ **Good Signs:**
- Memory returns close to baseline after cleanup
- No "Detached DOM nodes"
- Event listeners count stays stable
- Redux store size is reasonable

❌ **Bad Signs:**
- Memory continuously grows
- Detached DOM nodes accumulate
- Event listeners increase without cleanup
- Redux store grows indefinitely

---

## 🧪 Memory Test Results Interpretation

### Example Output:

```
📊 Memory Test: 50 Window Cycles
  Initial: 25.34 MB
  After 10 cycles: 27.12 MB
  After 20 cycles: 28.45 MB
  After 30 cycles: 29.01 MB
  After 40 cycles: 29.67 MB
  After 50 cycles: 30.23 MB
  Final: 30.23 MB
  Total Growth: 4.89 MB
  Early growth (0-10): 1.78 MB
  Late growth (40-50): 0.56 MB
```

### Analysis:

✅ **Healthy Pattern:**
- Total growth < 10MB
- Late growth < Early growth (cleanup working)
- Linear or decreasing growth rate

❌ **Memory Leak Pattern:**
- Total growth > 20MB
- Late growth > Early growth (accumulation)
- Exponential growth rate

---

## 🔍 Advanced Memory Profiling

### 1. Chrome Performance Tab

**Record memory over time:**

```
1. DevTools > Performance
2. Check "Memory" checkbox
3. Click Record
4. Perform actions (add/remove windows 50x)
5. Stop recording
6. Analyze memory timeline
```

**Look for:**
- Sawtooth pattern (good - GC working)
- Continuous upward trend (bad - leak)
- Memory spikes that don't drop (bad - retained objects)

### 2. Allocation Timeline

**Find what's allocating memory:**

```
1. DevTools > Memory > Allocation instrumentation on timeline
2. Start recording
3. Perform actions
4. Stop recording
5. Analyze allocation bars
```

**Look for:**
- Blue bars (allocations)
- Gray bars (deallocations)
- Persistent blue bars (potential leaks)

### 3. Heap Snapshot Comparison

**Find leaked objects:**

```
1. Take snapshot before actions
2. Perform 50 window cycles
3. Force GC (if available)
4. Take snapshot after
5. Switch to "Comparison" view
6. Sort by "Size Delta"
```

**Common leaks:**
- Event listeners
- Timers (setInterval/setTimeout)
- Redux state
- React components
- Closures holding references

---

## 🛠️ Debugging Memory Leaks

### If Tests Fail:

1. **Identify the leak source:**
   ```bash
   # Run specific failing test
   npx playwright test tests/memory-consumption.spec.ts -g "Timer" --headed
   ```

2. **Use Chrome DevTools:**
   - Take heap snapshots
   - Look for "Detached DOM nodes"
   - Check event listener count
   - Analyze retained objects

3. **Check common causes:**
   - Missing `removeEventListener`
   - Uncleaned `setInterval`
   - Redux state not cleaned up
   - React refs not cleared
   - Closures holding references

4. **Verify cleanup:**
   ```typescript
   useEffect(() => {
     const handler = () => {};
     window.addEventListener('event', handler);
     
     return () => {
       window.removeEventListener('event', handler); // ✅ Cleanup
     };
   }, []);
   ```

---

## 📋 Memory Leak Checklist

### Event Listeners
- [ ] All `addEventListener` have matching `removeEventListener`
- [ ] Cleanup in `useEffect` return function
- [ ] No global event listeners without cleanup

### Timers
- [ ] All `setInterval` are cleared
- [ ] All `setTimeout` are cleared (if component unmounts)
- [ ] Timer refs are properly managed

### Redux State
- [ ] Dynamic reducers are removed when not needed
- [ ] State doesn't grow indefinitely
- [ ] Old data is cleaned up

### React Components
- [ ] No circular references
- [ ] Refs are cleared on unmount
- [ ] No closures holding old props/state

### DOM
- [ ] No detached DOM nodes
- [ ] Elements are properly removed
- [ ] No orphaned event listeners

---

## 🎯 Memory Budgets

### Recommended Limits:

| Scenario | Memory Budget | Status |
|----------|--------------|--------|
| Initial load | < 50 MB | ✅ |
| 10 window cycles | < 5 MB growth | ✅ |
| 50 window cycles | < 10 MB growth | ✅ |
| 20 windows open | < 30 MB additional | ✅ |
| Timer running (10s) | < 2 MB growth | ✅ |
| Form submissions (10x) | < 5 MB growth | ✅ |

### Current Status:

Based on memory leak analysis (see `MEMORY_LEAK_ANALYSIS.md`):

✅ **All tests passing**
✅ **No memory leaks detected**
✅ **Proper cleanup verified**

---

## 🔄 Continuous Memory Monitoring

### In Development:

```bash
# Run memory tests after changes
npm run test:memory

# Watch for regressions
npm run test:memory -- --watch
```

### In CI/CD:

```yaml
# Add to GitHub Actions
- name: Memory Tests
  run: npx playwright test tests/memory-consumption.spec.ts
```

### Production Monitoring:

Use Web Vitals (already integrated):

```typescript
// src/index.tsx
reportWebVitals((metric) => {
  if (metric.name === 'CLS' || metric.name === 'LCP') {
    // Monitor performance metrics
    console.log(metric);
  }
});
```

---

## 📚 Resources

### Chrome DevTools Docs:
- [Memory Profiling](https://developer.chrome.com/docs/devtools/memory-problems/)
- [Heap Snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots/)
- [Allocation Timeline](https://developer.chrome.com/docs/devtools/memory-problems/allocation-profiler/)

### React Memory Management:
- [useEffect Cleanup](https://react.dev/reference/react/useEffect#removing-unnecessary-effect-dependencies)
- [useRef for Timers](https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref)

### Redux Memory:
- [Dynamic Reducers](https://redux.js.org/usage/code-splitting)
- [Reducer Manager Pattern](https://github.com/reduxjs/redux/issues/2295)

---

## ✅ Success Criteria

Your application has good memory management if:

1. ✅ All memory tests pass
2. ✅ Memory returns to baseline after cleanup
3. ✅ No continuous growth over time
4. ✅ No detached DOM nodes
5. ✅ Event listeners are cleaned up
6. ✅ Timers are properly managed
7. ✅ Redux state is reasonable
8. ✅ Performance stays smooth over time

---

**Current Status: ✅ EXCELLENT**

All memory tests pass. No leaks detected. Production-ready memory management.
