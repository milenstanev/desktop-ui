# Manual UI Testing Checklist

**Application URL:** http://192.168.1.5:3000/

Use this checklist to manually verify the live UI is working correctly.

---

## 🎨 Visual & Theme Testing

### Theme Switching
- [ ] Application loads with light theme by default
- [ ] Theme selector is visible in header
- [ ] Can switch to dark theme
- [ ] Can switch to gradient theme
- [ ] Gradient theme shows blue-to-purple glassmorphism effect
- [ ] Theme persists after page reload
- [ ] All components look good in all three themes

### Visual Quality
- [ ] No visual glitches or broken layouts
- [ ] Text is readable in all themes
- [ ] Buttons have proper hover effects
- [ ] Windows have proper shadows and borders
- [ ] Glassmorphism effect works (gradient theme)
- [ ] Animations are smooth

---

## 🪟 Window Management

### Adding Windows
- [ ] "Add Counter" button works
- [ ] "Add Notes" button works
- [ ] "Add Timer" button works
- [ ] "Add Form Editor" button works
- [ ] "Add Simple Example" button works
- [ ] Windows appear with proper titles
- [ ] Multiple windows of same type can be added

### Window Interactions
- [ ] Can drag windows by header
- [ ] Can resize windows by dragging corners/edges
- [ ] Windows can be moved around freely
- [ ] Windows don't disappear off-screen
- [ ] Close button (×) works
- [ ] Clicking window brings it to front (z-index)

### Layout Controls
- [ ] "Organize Windows" button arranges windows in grid
- [ ] "Reset Layout" button removes all windows
- [ ] Layout persists after page reload (localStorage)

---

## 🧮 Counter Feature

- [ ] Counter starts at 0
- [ ] Increment button (+) increases count
- [ ] Decrement button (-) decreases count
- [ ] Count displays correctly
- [ ] Multiple counters work independently
- [ ] Counter state persists after page reload

---

## 📝 Notes Feature

- [ ] Input field is visible
- [ ] Can type in input field
- [ ] Pressing Enter adds note
- [ ] Notes appear in list
- [ ] Can add multiple notes
- [ ] Delete button (×) removes note
- [ ] Notes persist after page reload

---

## ⏱️ Timer Feature

- [ ] Timer starts at 00:00
- [ ] Start button begins timer
- [ ] Timer counts up (00:01, 00:02, etc.)
- [ ] Pause button stops timer
- [ ] Timer stays paused
- [ ] Reset button returns to 00:00
- [ ] Multiple timers work independently
- [ ] Timer format is MM:SS

---

## 📋 Form Editor Feature

### Form Loading
- [ ] Form loads with user data
- [ ] All fields are populated
- [ ] Loading state shows briefly

### Form Fields
- [ ] First Name field works
- [ ] Last Name field works
- [ ] Email field works
- [ ] Age field works (number input)
- [ ] Role dropdown works
- [ ] Active checkbox works

### Form Validation
- [ ] Empty required fields show errors on submit
- [ ] Invalid email shows error
- [ ] Age < 18 shows error
- [ ] Error messages appear below fields
- [ ] Error messages are red
- [ ] Focus moves to first error field

### Form Submission
- [ ] Valid form submits successfully
- [ ] Success alert appears
- [ ] Form resets with updated data
- [ ] Submit button is disabled during submission

---

## ⌨️ Keyboard Shortcuts

- [ ] Escape key closes focused window
- [ ] Cmd+W (Mac) or Ctrl+W (Windows) closes focused window
- [ ] Keyboard shortcuts work consistently

---

## ♿ Accessibility

### ARIA Attributes
- [ ] Desktop has role="application"
- [ ] Timer has role="timer" and aria-live="polite"
- [ ] Buttons have aria-labels
- [ ] Form fields have proper labels
- [ ] Error messages have role="alert"

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Focus indicators are visible
- [ ] Can activate buttons with Enter/Space
- [ ] Form fields are keyboard accessible

### Screen Reader (Optional)
- [ ] Screen reader announces window titles
- [ ] Screen reader announces button actions
- [ ] Screen reader announces form errors
- [ ] Screen reader announces timer updates

---

## 📱 Responsive Design

### Mobile (375px width)
- [ ] Application loads correctly
- [ ] Windows are sized appropriately
- [ ] Buttons are tappable
- [ ] Text is readable
- [ ] No horizontal scrolling

### Tablet (768px width)
- [ ] Layout adjusts properly
- [ ] Windows fit on screen
- [ ] All features work

### Desktop (1920px width)
- [ ] Full layout displays well
- [ ] Windows have appropriate sizes
- [ ] No wasted space

---

## 🚀 Performance

### Load Time
- [ ] Page loads in < 3 seconds
- [ ] No visible lag or freezing
- [ ] Smooth animations

### Lazy Loading
- [ ] Features load on-demand (check Network tab)
- [ ] Loading indicators appear briefly
- [ ] No long waits for features

### Memory Usage
- [ ] Open/close 20+ windows - no slowdown
- [ ] Memory usage stays reasonable (check DevTools)
- [ ] No memory leaks after extended use

---

## 💾 State Persistence

### LocalStorage
- [ ] Theme persists after reload
- [ ] Window positions persist after reload
- [ ] Counter values persist after reload
- [ ] Notes persist after reload
- [ ] Layout persists after reload

### Clear Storage
- [ ] Can clear localStorage (DevTools)
- [ ] Application resets to defaults
- [ ] No errors after clearing storage

---

## 🔧 Developer Tools

### Console
- [ ] No errors in console
- [ ] No warnings (except expected React/CRA warnings)
- [ ] PWA logs appear (if enabled)
- [ ] Web Vitals logs appear (if enabled)

### Network
- [ ] All resources load successfully
- [ ] No 404 errors
- [ ] Lazy-loaded chunks appear on-demand
- [ ] Service worker registered (production only)

### Performance
- [ ] No layout shifts (CLS)
- [ ] Fast interaction times (FID)
- [ ] Good paint times (LCP, FCP)

---

## 🌐 Browser Compatibility

Test in multiple browsers:

### Chrome/Edge
- [ ] All features work
- [ ] No visual issues
- [ ] Performance is good

### Firefox
- [ ] All features work
- [ ] No visual issues
- [ ] Performance is good

### Safari (Mac/iOS)
- [ ] All features work
- [ ] No visual issues
- [ ] Performance is good
- [ ] Cmd+W shortcut works

---

## 🐛 Edge Cases

### Error Handling
- [ ] Form validation errors display correctly
- [ ] API errors are caught (check ErrorBoundary)
- [ ] No crashes with invalid input

### Extreme Usage
- [ ] Can add 50+ windows without crash
- [ ] Can add 100+ notes without slowdown
- [ ] Timer works for extended periods
- [ ] Form handles very long input

### Network Issues
- [ ] Application works offline (if PWA enabled)
- [ ] Handles slow network gracefully
- [ ] Mock API delays don't break UI

---

## ✅ Final Checks

- [ ] All critical features work
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] UI looks professional
- [ ] Accessibility is good
- [ ] Works on target browsers
- [ ] Mobile experience is usable

---

## 📊 Test Results

**Date Tested:** _________________

**Tested By:** _________________

**Browser:** _________________

**OS:** _________________

**Issues Found:**
- 
- 
- 

**Overall Status:** ⬜ Pass  ⬜ Fail  ⬜ Needs Review

**Notes:**
