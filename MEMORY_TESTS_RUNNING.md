# Memory Tests - Currently Running

## 🔥 Active Tests

### 1. Regular Memory Tests (`test:memory`)
**Status:** Running  
**Tests:** 7 tests  
**Duration:** ~5-10 minutes  

- Initial page load baseline
- 10 window cycles
- 50 window cycles  
- 20 windows open
- Timer running (10s)
- Form editor cycles
- Page reload

### 2. Chaos Tests (`test:memory:chaos`)
**Status:** Running  
**Tests:** 6 EXTREME tests  
**Duration:** ~15-20 minutes  

#### Test Details:

**💥 Test 1: 500 Rapid Interactions**
- Add Counter → Click 3x
- Add Notes → Type note
- Add Timer → Start/Stop
- Remove windows
- Organize windows
- Switch themes
- **All happening rapidly in rotation**

**💥 Test 2: 100 Drag & Resize**
- 5 windows open
- Drag each window 100 times
- Resize each window 100 times
- **Constant mouse movement**

**💥 Test 3: 1000 Button Clicks**
- 10 counters open
- Click increment/decrement 1000 times
- **Button spam test**

**💥 Test 4: 500 Notes Operations**
- Add 500 notes
- Remove notes when > 5
- **Rapid add/remove cycle**

**💥 Test 5: 200 Form Submits**
- Fill all form fields
- Submit 200 times
- **Form spam test**

**💥 Test 6: 300 Mixed Operations**
- Add windows
- Click buttons
- Drag windows
- Switch themes
- Remove windows
- Start/stop timers
- Add/remove notes
- **EVERYTHING AT ONCE**

---

## 📊 What We're Testing

### Memory Leak Detection:
✅ Event listeners cleanup  
✅ Timer intervals cleanup  
✅ Redux state cleanup  
✅ React component cleanup  
✅ DOM node cleanup  
✅ Closure cleanup  

### Activity Types:
✅ Window add/remove (hundreds of times)  
✅ Button clicks (thousands of times)  
✅ Form submissions (hundreds of times)  
✅ Drag operations (hundreds of times)  
✅ Resize operations (hundreds of times)  
✅ Theme switches (many times)  
✅ Timer start/stop (many times)  
✅ Note add/remove (hundreds of times)  

---

## 🎯 Expected Results

### Memory Budgets:

| Test | Operations | Max Growth | Status |
|------|-----------|------------|--------|
| 500 Rapid Interactions | 500 | < 30 MB | Testing... |
| 100 Drag & Resize | 100 | < 10 MB | Testing... |
| 1000 Button Clicks | 1000 | < 5 MB | Testing... |
| 500 Notes Operations | 500 | < 10 MB | Testing... |
| 200 Form Submits | 200 | < 15 MB | Testing... |
| 300 Mixed Operations | 300 | < 35 MB | Testing... |

### Success Criteria:
- ✅ Memory growth stays within budget
- ✅ No continuous upward trend
- ✅ Late growth ≤ Early growth (no accumulation)
- ✅ Memory stabilizes after operations

---

## 📈 How to Monitor

### Watch Tests in Real-Time:

1. **Terminal Output:**
   - Shows memory snapshots every N operations
   - Displays current memory usage
   - Shows window count

2. **Browser Window:**
   - Tests run in headed mode
   - You can see the chaos happening
   - Watch windows being added/removed/moved

3. **Memory Snapshots:**
   ```
   After 50 operations: 25.34 MB (3 windows)
   After 100 operations: 27.12 MB (5 windows)
   After 150 operations: 28.45 MB (2 windows)
   ```

---

## 🔍 What to Look For

### Good Signs:
✅ Memory goes up and down (sawtooth pattern)  
✅ Memory returns to baseline after cleanup  
✅ Growth rate decreases over time  
✅ No continuous upward trend  

### Bad Signs:
❌ Memory only goes up  
❌ Memory never goes down  
❌ Growth rate increases over time  
❌ Memory keeps growing linearly  

---

## 🛠️ Commands

```bash
# Check regular memory tests
tail -f ~/.cursor/projects/Users-milenstanev-WebstormProjects-desktop-ui/terminals/390952.txt

# Check chaos tests
tail -f ~/.cursor/projects/Users-milenstanev-WebstormProjects-desktop-ui/terminals/152604.txt

# Run all memory tests together
npm run test:memory:all

# Run specific test
npm run test:memory:chaos -- -g "500 Rapid"
```

---

## ⏱️ Estimated Completion

- **Regular Tests:** ~10 minutes
- **Chaos Tests:** ~20 minutes
- **Total:** ~30 minutes

---

## 📝 Results Will Show

For each test:
```
💥 CHAOS TEST: 500 Rapid Interactions
  Initial: 4.61 MB
  After 50 interactions: 8.23 MB (3 windows)
  After 100 interactions: 11.45 MB (5 windows)
  After 150 interactions: 12.67 MB (2 windows)
  ...
  After 500 interactions: 28.34 MB (4 windows)
  Final: 28.34 MB
  Total Growth: 23.73 MB ✅
  Early growth (0-50): 3.62 MB
  Late growth (450-500): 2.11 MB ✅
```

✅ = Passed (within budget, no accumulation)  
❌ = Failed (exceeded budget or shows accumulation)

---

**Status: Tests are running... Check back in ~30 minutes for full results!**
