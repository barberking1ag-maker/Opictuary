# iOS App Icon Generation Guide for Opictuary

## Required Icon Files

The `Contents.json` file has been updated with all required icon sizes. You now need to generate the actual icon PNG files.

### Required Icon Sizes (in pixels):

#### iPhone Icons:
- Icon-20@2x.png (40x40)
- Icon-20@3x.png (60x60)
- Icon-29@2x.png (58x58)
- Icon-29@3x.png (87x87)
- Icon-40@2x.png (80x80)
- Icon-40@3x.png (120x120)
- Icon-60@2x.png (120x120)
- Icon-60@3x.png (180x180)

#### iPad Icons:
- Icon-20.png (20x20)
- Icon-20@2x.png (40x40)
- Icon-29.png (29x29)
- Icon-29@2x.png (58x58)
- Icon-40.png (40x40)
- Icon-40@2x.png (80x80)
- Icon-76.png (76x76)
- Icon-76@2x.png (152x152)
- Icon-83.5@2x.png (167x167)

#### App Store Icon:
- Icon-1024.png (1024x1024) - No transparency, no rounded corners

## Generation Methods

### Method 1: Online Tool (Easiest)
1. Go to https://www.appicon.co/
2. Upload your 1024x1024 source icon (PNG without transparency)
3. Select "iOS" platform
4. Download the generated icons
5. Extract and copy all PNG files to: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Method 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick if not already installed
brew install imagemagick

# Navigate to the icon directory
cd ios/App/App/Assets.xcassets/AppIcon.appiconset/

# Generate all icons from your 1024x1024 source
# Replace "source-icon.png" with your actual icon file path

# iPhone icons
convert source-icon.png -resize 40x40 Icon-20@2x.png
convert source-icon.png -resize 60x60 Icon-20@3x.png
convert source-icon.png -resize 58x58 Icon-29@2x.png
convert source-icon.png -resize 87x87 Icon-29@3x.png
convert source-icon.png -resize 80x80 Icon-40@2x.png
convert source-icon.png -resize 120x120 Icon-40@3x.png
convert source-icon.png -resize 120x120 Icon-60@2x.png
convert source-icon.png -resize 180x180 Icon-60@3x.png

# iPad icons
convert source-icon.png -resize 20x20 Icon-20.png
convert source-icon.png -resize 40x40 Icon-20@2x.png
convert source-icon.png -resize 29x29 Icon-29.png
convert source-icon.png -resize 58x58 Icon-29@2x.png
convert source-icon.png -resize 40x40 Icon-40.png
convert source-icon.png -resize 80x80 Icon-40@2x.png
convert source-icon.png -resize 76x76 Icon-76.png
convert source-icon.png -resize 152x152 Icon-76@2x.png
convert source-icon.png -resize 167x167 Icon-83.5@2x.png

# App Store icon (no alpha channel)
convert source-icon.png -resize 1024x1024 -background white -alpha remove -alpha off Icon-1024.png
```

### Method 3: Using Xcode (Visual)
1. Open `ios/App/App.xcworkspace` in Xcode
2. Navigate to `App` → `Assets.xcassets` → `AppIcon`
3. Drag your 1024x1024 source icon to the "1024pt App Store iOS" slot
4. Xcode will show warnings for missing icons
5. You can drag the same source icon to each slot, and Xcode will resize automatically

### Method 4: Automated Script
Run the provided script:
```bash
./ios/generate-app-icons.js
```
Then follow the instructions to use ImageMagick or an online tool.

## Icon Design Requirements

1. **No Transparency**: iOS app icons must not have transparent backgrounds
2. **No Rounded Corners**: Apple adds rounded corners automatically
3. **Simple Design**: Icons should be recognizable at small sizes
4. **Consistent Style**: Use the same design language as your app
5. **High Contrast**: Ensure good visibility on various backgrounds

## Verification

After generating all icons:
1. Open Xcode: `npx cap open ios`
2. Navigate to Assets.xcassets → AppIcon
3. Verify all slots are filled (no warnings)
4. Build the project to ensure icons are correctly configured

## Current Opictuary Icon Status

✅ Contents.json is properly configured with all required sizes
❌ Individual PNG files need to be generated from your source icon

## Next Steps

1. Prepare a 1024x1024 PNG icon without transparency
2. Use one of the methods above to generate all required sizes
3. Place all generated PNGs in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
4. Verify in Xcode that all icons are properly loaded