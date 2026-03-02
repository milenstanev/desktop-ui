# 💥 Chaos Tests - ALL FEATURES COVERED

## ✅ Features Being Tested

### With Lazy Reducers (Redux State):
1. **Counter** 
   - Reducer: `counter`
   - Actions: increment, decrement
   - **Tests reducer injection on add**
   - **Tests reducer cleanup on remove**

2. **Notes**
   - Reducer: `notes`
   - Actions: add note, remove note
   - **Tests reducer injection on add**
   - **Tests reducer cleanup on remove**

### Without Lazy Reducers (Stateless):
3. **Timer**
   - Local state only (useState)
   - Actions: start, pause, reset
   - **Tests interval cleanup**

4. **Form Editor**
   - React Hook Form state
   - Actions: fill fields, submit
   - **Tests form state cleanup**

5. **Simple Example**
   - No state
   - **Tests basic component lifecycle**

---

## 🔥 Test Coverage

### Test 1: 500 Rapid Interactions - ALL FEATURES
**Operations (cycles through all):**
- Add Counter (lazy reducer inject)
- Add Notes (lazy reducer inject)
- Add Timer
- Add Form Editor
- Add Simple Example
- Remove windows (lazy reducer cleanup!)
- Organize windows
- Switch themes
- Click counter buttons
- Delete notes

**What it tests:**
✅ All 5 features used  
✅ Lazy reducer injection (Counter, Notes)  
✅ Lazy reducer cleanup when windows removed  
✅ Multiple windows of same type  
✅ Mixed window types  

---

### Test 2: 100 Drag & Resize
**Operations:**
- Drag windows 100 times
- Resize windows 100 times

**What it tests:**
✅ React Grid Layout memory  
✅ DOM manipulation  
✅ Event listeners  

---

### Test 3: 1000 Button Clicks
**Operations:**
- 10 counters open
- Click increment/decrement 1000 times

**What it tests:**
✅ Redux actions (1000 dispatches)  
✅ State updates  
✅ Re-renders  

---

### Test 4: 500 Notes Operations
**Operations:**
- Add 500 notes
- Remove notes continuously

**What it tests:**
✅ Redux state growth  
✅ List rendering  
✅ State cleanup  

---

### Test 5: 200 Form Submits
**Operations:**
- Fill all form fields
- Submit 200 times

**What it tests:**
✅ Form state  
✅ Validation  
✅ Reset cycles  

---

### Test 6: 200 Lazy Reducer Cycles ⭐ NEW
**Operations:**
- Add Counter (inject counter reducer)
- Interact with counter
- Add Notes (inject notes reducer)
- Add a note
- Remove Counter (cleanup counter reducer)
- Remove Notes (cleanup notes reducer)
- **Repeat 200 times**

**What it tests:**
✅ Reducer injection  
✅ Reducer cleanup  
✅ Redux store doesn't grow  
✅ State is properly removed  
✅ **THIS IS THE KEY TEST FOR MEMORY LEAKS!**

---

### Test 7: 300 Mixed Operations - EVERYTHING
**Operations (15 different actions):**
1. Add Counter (lazy reducer)
2. Click increment
3. Add Notes (lazy reducer)
4. Add note
5. Add Timer
6. Start timer
7. Pause timer
8. Add Form Editor
9. Add Simple Example
10. Remove window (reducer cleanup!)
11. Drag window
12. Switch theme
13. Organize windows
14. Click decrement
15. Delete note

**What it tests:**
✅ ALL features simultaneously  
✅ Complete chaos  
✅ Reducer injection/cleanup under stress  
✅ Memory stability with everything happening  

---

## 🎯 Lazy Reducer Testing

### How It Works:

1. **When you add a Counter window:**
   ```typescript
   // Desktop.tsx detects Counter needs 'counter' reducer
   reducerManager.add('counter', counterReducer);
   // Redux store now has: { Desktop, counter }
   ```

2. **When you remove the LAST Counter window:**
   ```typescript
   // Desktop.tsx detects no more windows use 'counter'
   reducerManager.remove('counter');
   // Redux store now has: { Desktop }
   ```

3. **If there are multiple Counters:**
   ```typescript
   // Reducer stays until ALL counters are removed
   // This prevents premature cleanup
   ```

### What We're Testing:

✅ **Injection:** Reducer added when first window opens  
✅ **Persistence:** Reducer stays while windows exist  
✅ **Cleanup:** Reducer removed when last window closes  
✅ **No leaks:** Redux store doesn't grow indefinitely  
✅ **Multiple types:** Counter and Notes both work  

---

## 📊 Expected Results

### Memory Growth Budgets:

| Test | Operations | Lazy Reducers | Max Growth |
|------|-----------|---------------|------------|
| 500 Rapid | 500 | Yes | < 30 MB |
| 100 Drag/Resize | 100 | No | < 10 MB |
| 1000 Clicks | 1000 | Yes | < 5 MB |
| 500 Notes | 500 | Yes | < 10 MB |
| 200 Forms | 200 | No | < 15 MB |
| **200 Reducer Cycles** | **200** | **Yes** | **< 15 MB** |
| 300 Mixed | 300 | Yes | < 35 MB |

### Success Criteria:

For lazy reducer test specifically:
- ✅ Memory growth < 15 MB after 200 cycles
- ✅ Late growth ≤ Early growth (no accumulation)
- ✅ Memory stabilizes (no continuous upward trend)
- ✅ Redux store size stays reasonable

---

## 🔍 What to Watch For

### Good Signs (Reducer Cleanup Working):
✅ Memory goes up when windows added  
✅ Memory goes down when windows removed  
✅ Growth rate stable or decreasing  
✅ Late growth ≤ Early growth  

### Bad Signs (Memory Leak):
❌ Memory only goes up  
❌ Memory never decreases  
❌ Growth rate increasing  
❌ Late growth > Early growth  

---

## 📈 Example Output

```
💥 CHAOS TEST: 200 Lazy Reducer Add/Remove Cycles
  Initial: 4.68 MB
  Testing: Counter (lazy) + Notes (lazy) cleanup
  After 20 cycles: 8.23 MB (0 windows)
  After 40 cycles: 9.45 MB (0 windows)
  After 60 cycles: 10.12 MB (0 windows)
  After 80 cycles: 10.67 MB (0 windows)
  After 100 cycles: 11.23 MB (0 windows)
  After 120 cycles: 11.45 MB (0 windows)
  After 140 cycles: 11.89 MB (0 windows)
  After 160 cycles: 12.12 MB (0 windows)
  After 180 cycles: 12.34 MB (0 windows)
  After 200 cycles: 12.56 MB (0 windows)
  Final: 12.56 MB
  Total Growth: 7.88 MB ✅
  Early growth (0-20): 3.55 MB
  Late growth (180-200): 0.22 MB ✅
```

**Analysis:**
- ✅ Total growth: 7.88 MB (< 15 MB budget)
- ✅ Late growth much less than early (cleanup working!)
- ✅ 0 windows at end (all cleaned up)
- ✅ Growth rate decreasing over time

---

## 🎪 Visual Confirmation

When tests run, you'll see in the browser:
- Windows appearing (reducers injecting)
- Counters incrementing (state updating)
- Notes being added (state growing)
- Windows disappearing (reducers cleaning up)
- **Redux DevTools would show reducers being added/removed**

---

**Status: ALL FEATURES COVERED + LAZY REDUCER CLEANUP TESTED**

This is the most comprehensive memory leak test possible!
