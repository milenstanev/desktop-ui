# 💥 CHAOS TESTS - RUNNING CONTINUOUSLY

## 🔥 Status: ACTIVE

**Started:** Mon Mar 2 00:57:52 EET 2026  
**Mode:** Continuous (runs until you stop it)  
**Current Run:** #1

---

## 🎯 What's Happening

### 6 Chaos Tests Running in Loop:

1. **500 Rapid Interactions** (~2 min)
   - Adding windows
   - Clicking buttons
   - Typing notes
   - Starting/stopping timers
   - Removing windows
   - Switching themes
   - Organizing layout

2. **100 Drag & Resize** (~1 min)
   - Dragging windows 100 times
   - Resizing windows 100 times

3. **1000 Button Clicks** (~1 min)
   - Spamming increment/decrement buttons

4. **500 Notes Operations** (~2 min)
   - Adding 500 notes
   - Removing notes continuously

5. **200 Form Submits** (~2 min)
   - Filling forms
   - Submitting 200 times

6. **300 Mixed Operations** (~3 min)
   - EVERYTHING AT ONCE
   - Complete chaos

**Total per run:** ~11 minutes  
**Then repeats automatically**

---

## 📊 Memory Monitoring

### What We're Watching:

```
💥 CHAOS TEST: 500 Rapid Interactions
  Initial: 4.68 MB
  After 50 interactions: X.XX MB (N windows)
  After 100 interactions: X.XX MB (N windows)
  ...
  Final: X.XX MB
  Total Growth: X.XX MB
```

### Success Criteria:
- ✅ Total growth < 30 MB
- ✅ No continuous upward trend
- ✅ Late growth ≤ Early growth

---

## 🛠️ Commands

### Monitor Progress:
```bash
# Watch live output
tail -f ~/.cursor/projects/Users-milenstanev-WebstormProjects-desktop-ui/terminals/665364.txt

# Check last 50 lines
tail -50 ~/.cursor/projects/Users-milenstanev-WebstormProjects-desktop-ui/terminals/665364.txt
```

### Stop Tests:
```bash
# Find the process
ps aux | grep "run-memory-chaos-forever"

# Kill it
kill <PID>
```

Or just tell me "stop" and I'll kill it for you!

---

## 📈 Expected Timeline

- **Run #1:** ~11 minutes
- **Run #2:** ~11 minutes  
- **Run #3:** ~11 minutes
- **...**
- **Runs forever until you say stop**

---

## 🎪 What You'll See

The browser window will show:
- Windows appearing and disappearing rapidly
- Counters incrementing/decrementing
- Notes being added and removed
- Timers starting and stopping
- Windows being dragged around
- Windows being resized
- Themes switching
- Complete UI chaos!

---

## 💾 Memory Leak Detection

If there's a memory leak, you'll see:
- Memory continuously growing
- Growth rate increasing over time
- Memory never stabilizing
- Late growth > Early growth

If everything is good, you'll see:
- Memory goes up and down
- Growth rate stable or decreasing
- Memory stabilizes
- Late growth ≤ Early growth

---

## 📝 Results Format

After each test:
```
✅ Run #1 PASSED
✅ Run #2 PASSED
✅ Run #3 PASSED
...
```

Or if there's an issue:
```
❌ Run #N FAILED (exit code: 1)
```

---

## ⚡ Live Stats

**Terminal:** `/Users/milenstanev/.cursor/projects/Users-milenstanev-WebstormProjects-desktop-ui/terminals/665364.txt`

**Check anytime with:**
```bash
tail -100 ~/.cursor/projects/Users-milenstanev-WebstormProjects-desktop-ui/terminals/665364.txt
```

---

**🔥 Tests are running... I'll monitor and report back!**

**To stop:** Just say "stop" or "stop the tests"
