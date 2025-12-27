# Wedding Party Parallax - Quick Start Guide 🚀

## ✅ What's Been Done

I've successfully implemented a stunning parallax scroll effect for your wedding party section, inspired by the Microsoft AI website. Here's what's ready to use:

### Files Updated
- ✅ `index.html` - New parallax wedding party section
- ✅ `assets/css/styles.css` - Parallax styling and animations  
- ✅ `assets/js/main.js` - Scroll-based animation engine
- ✅ Fixed HTML error in FAQ section

### New Files Created
- 📄 `WEDDING_PARTY_PARALLAX_README.md` - Complete technical documentation
- 📄 `WEDDING_PARTY_IMAGES_GUIDE.md` - Image setup instructions
- 📄 `QUICK_START.md` - This file!

## 🎬 How to Test It NOW

### Option 1: Open in Browser
1. Simply open `index.html` in your web browser
2. Scroll down to the "Wedding Party" section
3. **Scroll slowly** to see the effect - photos will zoom from blurred background into sharp focus!

### Option 2: Use a Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 🎨 What You'll See

As you scroll through the wedding party section:

1. **Groomsman 1 - Michael Rodriguez**
   - Photo starts blurred in background
   - Zooms forward and comes into focus
   - Text appears: "Junior's best friend since college and adventure partner."

2. **Bridesmaid 1 - Sarah Chen**
   - "Shaira's sister and lifelong confidante."

3. **Groomsman 2 - David Thompson**
   - "The life of the party and Junior's college roommate."

4. **Bridesmaid 2 - Emma Martinez**
   - "Shaira's best friend from childhood and travel companion."

## ⚡ Key Features Working

- ✨ **3D Depth Effect**: Photos move on Z-axis
- 🌫️ **Dynamic Blur**: Blur amount changes with distance
- 📝 **Text Fade-In**: Information appears at perfect moment
- 🔄 **Reversible**: Scroll up to see reverse animation
- 📱 **Responsive**: Works on mobile and desktop
- 🌍 **Bilingual**: Switch to Spanish to see translations

## 🖼️ Current Images

The section is using **placeholder images from Unsplash** so you can see the effect immediately. 

### To Replace with Real Photos:

**Quick Method:**
1. Save your wedding party photos in `assets/images/` folder
2. Name them: `groomsman1.jpg`, `bridesmaid1.jpg`, etc.
3. Update the image URLs in `index.html` (search for `images.unsplash.com`)

**Example:**
```html
<!-- Change this: -->
<img src="https://images.unsplash.com/photo-1507003211169..." alt="...">

<!-- To this: -->
<img src="assets/images/groomsman1.jpg" alt="Michael Rodriguez">
```

## ✏️ How to Customize

### Change Names & Descriptions

In `index.html`, find the wedding party section and update:

```html
<p class="eyebrow" data-i18n="wedding_party.groomsman1.role">GROOMSMEN</p>
<h2 data-i18n="wedding_party.groomsman1.name">Your Friend's Name</h2>
<p class="wedding-party-desc" data-i18n="wedding_party.groomsman1.desc">
  Your custom description here.
</p>
```

### Add More People

1. Copy an entire `<div class="wedding-party-block" data-party-block>` section
2. Paste it before the closing `</div>` of `wedding-party-parallax`
3. Update the content (name, role, description, images)

### Remove People

Delete one of the `wedding-party-block` sections from the HTML.

## 🔧 Pro Tips

### For Best Effect:
- **Scroll slowly** - The animation is designed for smooth, deliberate scrolling
- **Use trackpad/mouse wheel** - Better control than scrollbar dragging
- **Desktop first** - The effect shines on larger screens
- **High-quality photos** - Clear, well-lit portraits work best

### Performance:
- Keep image file sizes **under 500KB** each
- Use **portrait orientation** photos (2:3 or 3:4 aspect ratio)
- Compress images before uploading (tools: TinyPNG, Squoosh)

## 🌐 Test on Different Devices

### Desktop
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅

### Mobile
- iOS Safari ✅
- Chrome Mobile ✅
- Samsung Internet ✅

## 🎯 Next Steps

### Immediate:
1. ✅ Test the effect by scrolling through the wedding party section
2. ⬜ Replace placeholder images with real photos
3. ⬜ Update names and descriptions
4. ⬜ Adjust number of people (add/remove as needed)

### Optional:
5. ⬜ Fine-tune animation timing (see `WEDDING_PARTY_PARALLAX_README.md`)
6. ⬜ Customize colors and layout
7. ⬜ Add more wedding party members
8. ⬜ Update Spanish translations in `assets/js/main.js`

## 🐛 Troubleshooting

**Effect not working?**
- Open browser console (F12) and check for errors
- Make sure JavaScript is enabled
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Images not loading?**
- Check internet connection (using Unsplash CDN)
- Verify image URLs in HTML
- Look at Network tab in DevTools

**Animation choppy?**
- Close other browser tabs
- Check image file sizes (should be < 500KB)
- Try in incognito mode (extensions can slow things down)

## 📚 Documentation

For detailed technical information, see:
- **Complete Guide**: `WEDDING_PARTY_PARALLAX_README.md`
- **Image Setup**: `WEDDING_PARTY_IMAGES_GUIDE.md`

## 💡 Inspiration

This effect is inspired by the beautiful team section on the [Microsoft AI website](https://microsoft.ai/). The implementation uses:
- CSS 3D transforms
- Scroll-based JavaScript animations
- Dynamic blur filters
- Fixed positioning with perspective

## 🎉 Enjoy!

Your wedding party section is now ready with a professional, eye-catching parallax effect. Guests visiting your site will be wowed by the smooth animations and modern design!

---

**Questions?** Check the detailed README files or inspect the code - everything is well-commented!

**Happy Wedding Planning!** 💍✨


