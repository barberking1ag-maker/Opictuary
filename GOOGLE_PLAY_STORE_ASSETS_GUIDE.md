# GOOGLE PLAY STORE ASSETS PREPARATION GUIDE
**For Opictuary Android App Launch**

---

## REQUIRED ASSETS CHECKLIST

### ✅ Mandatory Assets (Must Have)
- [ ] App Icon (512x512 PNG, 32-bit)
- [ ] Feature Graphic (1024x500 PNG/JPEG)
- [ ] Screenshots: Minimum 2, Maximum 8 (Phone)
- [ ] Screenshots: Minimum 1 (7-inch tablet) - Optional but recommended
- [ ] Screenshots: Minimum 1 (10-inch tablet) - Optional but recommended
- [ ] Privacy Policy URL
- [ ] App Description (Short & Full)
- [ ] App Title

### ⚠️ Optional But Recommended
- [ ] Promo Video (YouTube link)
- [ ] TV Banner (1280x720 PNG) - If supporting Android TV
- [ ] 360° Promotional Video

---

## ASSET SPECIFICATIONS

### 1. APP ICON (512x512)

**Requirements:**
- **Dimensions:** 512x512 pixels
- **Format:** 32-bit PNG
- **File Size:** Max 1024KB
- **Design:** No transparency, square canvas

**Current Status:** ✅ You have icons at 192x192 and 512x512  
**Location:** `client/public/` directory

**Action Needed:**
- Verify your 512x512 icon meets Google Play requirements
- Upload to Google Play Console: "Store Listing" > "Graphics" > "Hi-res icon"

**Design Guidelines:**
- Use your current purple memorial theme
- Should be recognizable at small sizes
- No text (icon should be symbolic)
- Matches brand identity (Opictuary = digital memorials)

---

### 2. FEATURE GRAPHIC (1024x500)

**Requirements:**
- **Dimensions:** 1024x500 pixels (exactly)
- **Format:** PNG or JPEG
- **File Size:** Max 1024KB
- **Design:** Landscape banner showcasing your app

**What to Include:**
- App name: "Opictuary"
- Tagline: "Where Memories Live Forever" or "Preserve. Honor. Remember."
- Visual: Memorial candle, digital memorial page mockup, or flowers
- Color scheme: Your purple/gold theme (280° hue)
- Clean, professional design

**Template Suggestion:**
```
[Background: Rich purple gradient]
[Left side: App icon or memorial imagery]
[Right side: Text]
  - "OPICTUARY" (large, Crimson Text font)
  - "Where Memories Live Forever" (subtitle)
  - "Create Beautiful Digital Memorials" (description)
```

**Action Needed:**
- Create 1024x500 banner using Canva, Photoshop, or Figma
- Upload to Google Play Console: "Store Listing" > "Graphics" > "Feature graphic"

**I can generate this for you using AI image generation if you'd like!**

---

### 3. PHONE SCREENSHOTS (Minimum 2, Maximum 8)

**Requirements:**
- **Dimensions:** 16:9 or 9:16 aspect ratio
- **Format:** PNG or JPEG (24-bit)
- **Min Pixels:** 320px on shortest side
- **Max Pixels:** 3840px on longest side
- **Recommended:** 1080x1920 (portrait) or 1920x1080 (landscape)

**What to Screenshot (8 screenshots recommended):**

#### Screenshot 1: Home Screen / Browse Memorials
- Show the main landing page
- Display featured memorials
- Include navigation bar
- Shows "Browse Public Memorials" or search functionality

#### Screenshot 2: Memorial Page
- Beautiful memorial page for "Margaret Rose Johnson" or another example
- Shows photo gallery, obituary, life details
- Demonstrates clean, dignified design
- Include "Make a Donation" button visible

#### Screenshot 3: Photo Gallery
- Memorial photo gallery in grid view
- Shows multiple photos from a memorial
- Demonstrates media upload capability
- Include heart/like reactions visible

#### Screenshot 4: Create Memorial Flow
- Screenshot of memorial creation form
- Shows fields: Name, Date of Birth, Date of Passing
- Professional, easy-to-use interface
- Include "Upload Photo" button

#### Screenshot 5: Fundraiser / Donation
- Donation modal or fundraiser page
- Shows donation amount selection
- Platform fee transparency (3%)
- Stripe payment integration visible

#### Screenshot 6: QR Code Feature
- Memorial QR code display
- Show "Print QR Code" or "Download" option
- Unique differentiator (patent-protected)
- Include tombstone icon or visual

#### Screenshot 7: Grief Support / Resources
- Grief support page
- Shows categories (loss of parent, spouse, child)
- Professional resources
- Demonstrates care and empathy

#### Screenshot 8: User Profile / Dashboard
- User's memorial dashboard
- Shows "Your Memorials" list
- Recent activity or notifications
- Easy navigation to create new memorial

**How to Capture Screenshots:**

**Option 1: Using Chrome DevTools (Recommended)**
1. Open https://[your-replit-url].replit.dev in Chrome
2. Press F12 to open DevTools
3. Click "Toggle Device Toolbar" icon (phone icon) or press Ctrl+Shift+M
4. Select device: "Pixel 5" (1080x2340) or "Samsung Galaxy S20" (1440x3200)
5. Navigate to the page you want to screenshot
6. Click three dots menu > "Capture screenshot"
7. Save as PNG

**Option 2: Using Android Emulator**
1. If you have Android Studio installed
2. Launch emulator with Pixel 5 or similar device
3. Load your app URL in Chrome on emulator
4. Use emulator's screenshot tool (Camera icon in toolbar)

**Option 3: Using Real Android Device**
1. Load app on your Android phone
2. Take screenshots using Power + Volume Down
3. Transfer screenshots to computer via USB or Google Photos

**Screenshot Optimization:**
- Remove any test data (ensure professional memorials only)
- Use realistic, tasteful memorial names and dates
- Ensure UI is fully loaded (no loading spinners)
- Check for any console errors or debug info
- Crop to exactly 1080x1920 if needed

---

### 4. TABLET SCREENSHOTS (Optional but Recommended)

**7-inch Tablet (e.g., Nexus 7):**
- **Dimensions:** 1200x1920 or 1920x1200
- Minimum 1-2 screenshots
- Shows tablet-optimized layout

**10-inch Tablet (e.g., Pixel C):**
- **Dimensions:** 2560x1800 or 1800x2560
- Minimum 1-2 screenshots
- Shows larger screen experience

**What to Show on Tablet Screenshots:**
- Memorial page with sidebar visible (wider layout)
- Photo gallery in grid (more photos per row)
- Dashboard with more content visible
- Demonstrates responsive design

**Capture Method:**
- Use Chrome DevTools > Device Toolbar
- Select "Nest Hub Max" or "iPad Pro" for tablet view
- Adjust dimensions to match required sizes

---

### 5. PROMO VIDEO (Optional)

**Requirements:**
- **Length:** 30 seconds to 2 minutes
- **Format:** YouTube link
- **Content:** App overview, key features

**What to Include:**
1. Opening: "Opictuary - Where Memories Live Forever"
2. Show: Creating a memorial (quick walkthrough)
3. Show: Photo gallery and memories
4. Show: QR code feature (unique!)
5. Show: Fundraising for families
6. Closing: "Available now on Google Play"

**Tools to Create:**
- Screen recording: OBS Studio, Loom, or Windows Game Bar
- Video editing: DaVinci Resolve (free), Canva Video
- Upload to YouTube as "Unlisted" and paste link in Google Play Console

---

## ASSET CREATION WORKFLOW

### Step 1: Gather Current Assets ✅
You already have:
- App icons (192x192, 512x512) in `client/public/`
- Logo and branding

### Step 2: Create Feature Graphic 🎨
**Option A: Use Canva**
1. Go to Canva.com (free account)
2. Create custom size: 1024x500
3. Search templates: "App Banner" or "Mobile App"
4. Customize with:
   - Text: "OPICTUARY - Where Memories Live Forever"
   - Colors: Purple (#8B5CF6) and Gold (#F59E0B)
   - Visual: Memorial imagery or app mockup
5. Download as PNG (1024KB max)

**Option B: AI Generation (I can do this!)**
- I can generate a professional feature graphic using the generate_image_tool
- Just ask and I'll create it based on your brand guidelines

### Step 3: Capture Screenshots 📸
**Recommended Order:**
1. Clear browser cache and cookies
2. Open app in Chrome DevTools mobile view
3. Navigate to each page (list above)
4. Ensure professional sample data is visible
5. Capture each screenshot (1080x1920)
6. Save with descriptive names:
   - `01_home_screen.png`
   - `02_memorial_page.png`
   - `03_photo_gallery.png`
   - etc.

### Step 4: Optimize Images 🖼️
**Using Free Tools:**
- **TinyPNG** (tinypng.com) - Compress without quality loss
- **Squoosh** (squoosh.app) - Google's image optimizer
- **Resize Images** - If dimensions need adjustment

**Checklist:**
- [ ] All images under 1024KB
- [ ] Correct dimensions (exactly 1024x500 for feature graphic)
- [ ] PNG format (preferred) or JPEG
- [ ] No transparency issues
- [ ] Professional appearance

### Step 5: Organize Files 📁
Create folder structure:
```
google-play-assets/
├── icon/
│   └── hi-res-icon-512x512.png
├── feature-graphic/
│   └── feature-graphic-1024x500.png
├── screenshots/
│   ├── phone/
│   │   ├── 01_home_screen.png
│   │   ├── 02_memorial_page.png
│   │   ├── 03_photo_gallery.png
│   │   ├── 04_create_memorial.png
│   │   ├── 05_fundraiser.png
│   │   ├── 06_qr_code.png
│   │   ├── 07_grief_support.png
│   │   └── 08_dashboard.png
│   ├── 7-inch-tablet/
│   │   ├── 01_tablet_home.png
│   │   └── 02_tablet_memorial.png
│   └── 10-inch-tablet/
│       └── 01_tablet_wide.png
└── video/
    └── promo-video-youtube-link.txt
```

---

## UPLOAD TO GOOGLE PLAY CONSOLE

### Navigation Path:
1. Go to Google Play Console: play.google.com/console
2. Select your app: "Opictuary"
3. Left sidebar: "Store presence" > "Main store listing"

### Upload Locations:

**App Icon:**
- Section: "Graphics"
- Field: "Hi-res icon"
- Upload: 512x512 PNG

**Feature Graphic:**
- Section: "Graphics"
- Field: "Feature graphic"
- Upload: 1024x500 PNG/JPEG

**Phone Screenshots:**
- Section: "Screenshots"
- Field: "Phone"
- Upload: 2-8 images (1080x1920 recommended)
- Drag to reorder (first screenshot shows first)

**Tablet Screenshots (Optional):**
- Field: "7-inch tablet" - Upload 1-2 images
- Field: "10-inch tablet" - Upload 1-2 images

**Promo Video (Optional):**
- Field: "Promo video"
- Paste YouTube URL (unlisted video is fine)

---

## QUALITY CHECKLIST

### Before Submitting:
- [ ] All images are professional quality (no blurriness)
- [ ] No test data or placeholder text visible
- [ ] Consistent branding across all assets
- [ ] No spelling or grammar errors in screenshots
- [ ] Feature graphic is eye-catching and clear
- [ ] Screenshots show key features (memorial creation, QR codes, fundraising)
- [ ] App icon is recognizable at small sizes
- [ ] All files are under size limits
- [ ] Images have correct dimensions (verified)
- [ ] No copyrighted material used without permission

### Google Play Requirements:
- [ ] No misleading or deceptive imagery
- [ ] No excessive text in screenshots (show the UI)
- [ ] No device frames around screenshots (Google adds them)
- [ ] Screenshots show actual app functionality
- [ ] Feature graphic doesn't include device mockups (just the content)
- [ ] All assets follow Google Play Design Guidelines

---

## COMMON MISTAKES TO AVOID

❌ **Don't:**
- Use low-resolution or blurry images
- Include test data (e.g., "Test User", "Lorem Ipsum")
- Add device frames to screenshots (Google does this automatically)
- Use copyrighted stock photos without license
- Include promotional text like "50% OFF!" in images
- Submit screenshots with loading spinners or errors visible
- Use feature graphic with too much text (focus on visuals)

✅ **Do:**
- Use actual app interface (clean, production-ready)
- Show key differentiators (QR codes, fundraising, memorials)
- Maintain consistent branding (purple/gold theme)
- Ensure all text is readable at small sizes
- Highlight unique features (prison access, hood memorials)
- Use professional, tasteful memorial examples
- Test images on different screen sizes before uploading

---

## TOOLS & RESOURCES

### Image Creation:
- **Canva** (canva.com) - Free, easy feature graphic creation
- **Figma** (figma.com) - Professional design tool
- **Photoshop** - If you have access

### Screenshot Capture:
- **Chrome DevTools** - Built-in, free
- **Android Studio Emulator** - Official Android tool
- **Physical Android Device** - Best for authentic screenshots

### Image Optimization:
- **TinyPNG** (tinypng.com) - Compress PNG files
- **Squoosh** (squoosh.app) - Google's image optimizer
- **ImageOptim** - Mac app for optimization

### Video Creation:
- **OBS Studio** - Free screen recording
- **Loom** - Easy screen + webcam recording
- **DaVinci Resolve** - Free video editing

### Dimension Verification:
- **Image Size** (imagesize.org) - Check image dimensions
- **Online Image Resizer** - Adjust dimensions if needed

---

## NEXT STEPS

### Option 1: I Can Help Generate Assets
**I can create:**
- ✅ Feature Graphic (1024x500) using AI image generation
- ✅ App Icon variations if needed
- ✅ Promotional graphics

**Just ask me:** "Generate the feature graphic for Google Play"

### Option 2: You Create Assets Manually
**Follow this guide:**
1. Create feature graphic using Canva (30 minutes)
2. Capture 8 phone screenshots using Chrome DevTools (1 hour)
3. Capture 2-4 tablet screenshots (30 minutes)
4. Optimize all images with TinyPNG (15 minutes)
5. Upload to Google Play Console (30 minutes)

**Total time:** 2-3 hours

### Option 3: Hybrid Approach
- I generate feature graphic
- You capture screenshots from your live app
- I create upload checklist and guide you through submission

---

## GOOGLE PLAY CONSOLE REFERENCE

### Asset Limits:
| Asset Type | Min | Max | Dimensions | Format | Max Size |
|------------|-----|-----|------------|--------|----------|
| Hi-res Icon | 1 | 1 | 512x512 | PNG | 1024KB |
| Feature Graphic | 1 | 1 | 1024x500 | PNG/JPEG | 1024KB |
| Phone Screenshots | 2 | 8 | 320-3840px | PNG/JPEG | - |
| 7" Tablet Screenshots | 0 | 8 | 320-3840px | PNG/JPEG | - |
| 10" Tablet Screenshots | 0 | 8 | 320-3840px | PNG/JPEG | - |
| Promo Video | 0 | 1 | YouTube URL | - | - |

### Screenshot Aspect Ratios Accepted:
- 16:9 (landscape)
- 9:16 (portrait)  ✅ Recommended for mobile
- 4:3
- 3:4

---

## READY TO PROCEED?

**What would you like to do?**

1. **"Generate feature graphic"** - I'll create the 1024x500 banner using AI
2. **"Guide me through screenshots"** - I'll walk you through capturing each one
3. **"Upload checklist"** - I'll give you a final checklist before submission
4. **"All of the above"** - I'll do it all!

Let me know and I'll help you prepare professional Google Play Store assets for your Opictuary app launch! 🚀

---

**Created:** November 10, 2025  
**For:** Opictuary Android App Launch  
**Status:** Ready to execute
