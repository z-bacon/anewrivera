# Wedding Party Images Guide

## Required Images

To make the parallax wedding party section work, you need to add the following images to the `assets/images/` folder:

### Image Files Needed:
1. **groomsman1.jpg** - Photo of Michael Rodriguez (Groomsman 1)
2. **groomsman2.jpg** - Photo of David Thompson (Groomsman 2)
3. **bridesmaid1.jpg** - Photo of Sarah Chen (Bridesmaid 1)
4. **bridesmaid2.jpg** - Photo of Emma Martinez (Bridesmaid 2)

### Image Specifications:
- **Format:** JPG or PNG
- **Recommended dimensions:** 800x1200px minimum (portrait orientation)
- **Aspect ratio:** 2:3 or 3:4 works best
- **File size:** Keep under 500KB each for optimal performance
- **Quality:** High-quality, well-lit photos work best for the blur-to-focus effect

### Temporary Placeholder Option:

If you don't have images yet, you can use placeholder services:

1. **Unsplash Source API:**
   ```
   https://source.unsplash.com/800x1200/?portrait
   ```

2. **Placeholder.com:**
   ```
   https://via.placeholder.com/800x1200/c87a57/ffffff?text=Groomsman+1
   ```

### How to Update:

1. Add your images to `assets/images/` folder
2. Make sure the filenames match:
   - `groomsman1.jpg`
   - `groomsman2.jpg`
   - `bridesmaid1.jpg`
   - `bridesmaid2.jpg`

### Customization:

To edit the wedding party members, update the HTML in `index.html` around line 77-104:
- Change names in the `<h2>` tags
- Update the role (GROOMSMEN/BRIDESMAIDS) in the `<p class="eyebrow">` tags
- Modify the descriptions in `<p class="wedding-party-desc">` tags
- Update image paths if using different filenames

## How It Works

The parallax effect:
1. **Starts blurred** - Images begin out of focus in the background
2. **Zooms into view** - As you scroll, the main person's photo moves forward
3. **Comes into focus** - The blur decreases as the photo approaches
4. **Text appears** - Person's name and description fade in when photo is centered
5. **Reverses on scroll up** - Everything plays backward when scrolling up

Each wedding party member gets their own full-screen section with this effect!


