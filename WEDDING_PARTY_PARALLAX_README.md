# Wedding Party Parallax Section - Implementation Guide

## 🎉 What's New

I've completely transformed your wedding party section with a stunning parallax scroll effect inspired by the [Microsoft AI website](https://microsoft.ai/). 

## ✨ Features

### The Parallax Effect
- **Blurred Background Start**: Photos begin out of focus in the far background
- **3D Zoom Animation**: As you scroll, images travel forward in 3D space
- **Progressive Focus**: Blur decreases as photos approach the viewer
- **Text Reveal**: Person's information fades in when their photo is centered
- **Multi-layer Depth**: Other wedding party members remain visible in background
- **Bidirectional Animation**: Scrolling backwards reverses everything smoothly

### Technical Implementation
- **Scroll-driven Animation**: Uses `requestAnimationFrame` for 60fps smooth performance
- **3D Transforms**: CSS `translate3d` on Z-axis for depth illusion
- **Dynamic Blur**: Filter intensity calculated based on scroll position
- **Responsive Design**: Adapts to mobile and desktop viewports
- **Fixed Positioning**: Photos stay anchored while user scrolls

## 📁 Files Modified

### 1. `index.html`
**Lines 77-186**: Replaced the old card-based wedding party section with new parallax structure

**Key Changes:**
- Added `wedding-party-parallax` container
- Created 4 `wedding-party-block` sections (one per person)
- Each block contains:
  - `wedding-party-slides-container`: Fixed container for all photos
  - Multiple `wedding-party-slide` elements (main photo + background photos)
  - `wedding-party-content`: Text overlay with name and description

**Also Fixed:**
- Line 139: Fixed unclosed `<h3>` tag in FAQ section

### 2. `assets/css/styles.css`
**Lines 366-525**: Added comprehensive CSS for parallax effect

**Key Styles:**
- `.wedding-party-block`: 100vh sections for each person
- `.wedding-party-slides-container`: Fixed viewport with perspective
- `.wedding-party-slide`: Individual photo positioning with different layouts
- `.wedding-party-content`: Centered text overlay with backdrop blur
- Responsive breakpoints for mobile devices

### 3. `assets/js/main.js`
**Lines 322-420**: Added parallax scroll animation logic

**Key Functions:**
- `initWeddingPartyParallax()`: Main initialization
- `updateParallax()`: Calculates and applies scroll-based animations
- `onScroll()`: Throttled scroll listener with `requestAnimationFrame`

**Animation Logic:**
- Calculates scroll progress (0-1) for each block
- Maps progress to Z-axis position (-300vh to 100vh)
- Computes blur amount based on Z distance
- Fades content in/out at optimal viewing point

## 🎨 Customization Guide

### Adding/Removing Wedding Party Members

**To add a new member:**

1. Copy one of the existing `wedding-party-block` sections in `index.html`
2. Update the content:
   ```html
   <div class="wedding-party-content-inner">
     <p class="eyebrow">GROOMSMEN</p> <!-- or BRIDESMAIDS -->
     <h2>John Doe</h2>
     <p class="wedding-party-desc">Your custom description here.</p>
   </div>
   ```
3. Update image sources in the slides

**To remove a member:**
- Simply delete one of the `wedding-party-block` divs

### Changing Photos

**Option 1: Use Your Own Photos**
1. Add your images to `assets/images/` folder
2. Update the `src` attributes:
   ```html
   <img src="assets/images/your-photo.jpg" alt="Name" loading="lazy">
   ```

**Option 2: Use Different Placeholder Services**
- Currently using Unsplash
- Alternative: `https://picsum.photos/800/1200`
- Or: `https://via.placeholder.com/800x1200`

### Adjusting Animation Timing

In `assets/js/main.js`, around line 360:

```javascript
// Content visibility range (0 to 1)
const contentStart = 0.35;  // When text starts fading in
const contentEnd = 0.75;    // When text starts fading out
```

Increase the range for longer text display, decrease for shorter.

### Changing Layout Positions

In `assets/css/styles.css`, lines 412-453:

```css
/* Main photo position */
.wedding-party-slide:nth-child(1) {
  left: 5vmax;        /* Adjust horizontal position */
  width: 25vmax;      /* Adjust size */
  aspect-ratio: 3 / 4; /* Change photo proportions */
}
```

### Color Scheme

Update the content background in CSS:

```css
.wedding-party-content-inner {
  background: rgba(255, 255, 255, 0.95);  /* Change color/opacity */
  backdrop-filter: blur(10px);             /* Adjust blur strength */
}
```

## 🎯 Current Configuration

### Wedding Party Members

1. **Michael Rodriguez** - Groomsmen
   - "Junior's best friend since college and adventure partner."

2. **Sarah Chen** - Bridesmaids
   - "Shaira's sister and lifelong confidante."

3. **David Thompson** - Groomsmen
   - "The life of the party and Junior's college roommate."

4. **Emma Martinez** - Bridesmaids
   - "Shaira's best friend from childhood and travel companion."

### Placeholder Images
Currently using Unsplash photos for demonstration. Replace with actual wedding party photos.

## 📱 Responsive Behavior

- **Desktop (>768px)**: Full effect with large photo sizes
- **Mobile (≤768px)**: Adjusted photo positions and sizes for smaller screens
- **All devices**: Smooth 60fps animations with hardware acceleration

## 🚀 Performance Optimizations

1. **RequestAnimationFrame**: Prevents layout thrashing
2. **Transform3D**: GPU-accelerated animations
3. **Will-change**: Hints browser for optimization
4. **Lazy Loading**: Images load only when needed
5. **Passive Listeners**: Non-blocking scroll events

## 🔧 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (iOS 12+, macOS)
- ✅ Samsung Internet
- ⚠️ IE11 (degraded, no 3D transforms)

## 📊 Technical Details

### Z-Axis Range
- **Far background**: -300vh (fully blurred, invisible)
- **Background**: -200vh to -50vh (partially blurred)
- **Focus point**: 0vh (no blur, main photo)
- **Foreground**: 100vh (in focus, approaching viewer)

### Blur Calculation
```javascript
const maxBlur = 20;  // Maximum blur in pixels
const blurAmount = Math.abs(zPosition) / 5;  // Proportional to distance
```

### Opacity Calculation
- Fades out completely beyond -300vh
- Fades out when too close (>100vh)
- Full opacity in the -200vh to 100vh range

## 🎓 Learning Resources

This implementation uses concepts from:
- [CSS 3D Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [RequestAnimationFrame API](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [CSS Filter Effects](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) (future enhancement)

## 🐛 Troubleshooting

**Photos not appearing?**
- Check browser console for image loading errors
- Verify image URLs are accessible
- Check network tab in DevTools

**Animation stuttering?**
- Reduce image file sizes (< 500KB each)
- Check for other heavy scripts running
- Test in incognito mode to rule out extensions

**Content not showing?**
- Verify scroll position is in the trigger range
- Check console for JavaScript errors
- Ensure all data attributes are present

## 🔮 Future Enhancements

Potential additions:
- [ ] Touch/swipe navigation on mobile
- [ ] Keyboard navigation (arrow keys)
- [ ] Progress indicator dots
- [ ] Click to expand full biography
- [ ] Social media links for each person
- [ ] Photo gallery modal

## 📝 Notes

- The effect is best experienced on desktop with a mouse/trackpad for smooth scrolling
- Each person gets approximately one viewport height of scroll travel
- Total section height: 4 viewport heights (4 people × 1vh each)
- Consider reducing number of members on mobile for better UX

---

**Created**: November 30, 2025
**Inspiration**: [Microsoft AI Team Page](https://microsoft.ai/)
**Technology**: Vanilla JavaScript, CSS3, HTML5

