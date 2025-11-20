#!/usr/bin/env node

/**
 * iOS App Icon Generator for Opictuary
 * Generates all required icon sizes from a 1024x1024 source image
 */

const fs = require('fs');
const path = require('path');

// iOS App Icon Requirements (as of iOS 17)
const iconSizes = [
  // iPhone Notification
  { size: 40, scale: 2, idiom: 'iphone', filename: 'Icon-40@2x.png', purpose: 'notification' },
  { size: 40, scale: 3, idiom: 'iphone', filename: 'Icon-40@3x.png', purpose: 'notification' },
  
  // iPhone Settings
  { size: 29, scale: 2, idiom: 'iphone', filename: 'Icon-29@2x.png', purpose: 'settings' },
  { size: 29, scale: 3, idiom: 'iphone', filename: 'Icon-29@3x.png', purpose: 'settings' },
  
  // iPhone Spotlight
  { size: 40, scale: 2, idiom: 'iphone', filename: 'Icon-40@2x.png', purpose: 'spotlight' },
  { size: 40, scale: 3, idiom: 'iphone', filename: 'Icon-40@3x.png', purpose: 'spotlight' },
  
  // iPhone App
  { size: 60, scale: 2, idiom: 'iphone', filename: 'Icon-60@2x.png', purpose: 'app' },
  { size: 60, scale: 3, idiom: 'iphone', filename: 'Icon-60@3x.png', purpose: 'app' },
  
  // iPad Notification
  { size: 20, scale: 1, idiom: 'ipad', filename: 'Icon-20.png', purpose: 'notification' },
  { size: 20, scale: 2, idiom: 'ipad', filename: 'Icon-20@2x.png', purpose: 'notification' },
  
  // iPad Settings
  { size: 29, scale: 1, idiom: 'ipad', filename: 'Icon-29.png', purpose: 'settings' },
  { size: 29, scale: 2, idiom: 'ipad', filename: 'Icon-29@2x.png', purpose: 'settings' },
  
  // iPad Spotlight
  { size: 40, scale: 1, idiom: 'ipad', filename: 'Icon-40.png', purpose: 'spotlight' },
  { size: 40, scale: 2, idiom: 'ipad', filename: 'Icon-40@2x.png', purpose: 'spotlight' },
  
  // iPad Pro App
  { size: 83.5, scale: 2, idiom: 'ipad', filename: 'Icon-83.5@2x.png', purpose: 'app' },
  
  // iPad App
  { size: 76, scale: 1, idiom: 'ipad', filename: 'Icon-76.png', purpose: 'app' },
  { size: 76, scale: 2, idiom: 'ipad', filename: 'Icon-76@2x.png', purpose: 'app' },
  
  // App Store
  { size: 1024, scale: 1, idiom: 'ios-marketing', filename: 'Icon-1024.png', purpose: 'marketing' }
];

// Generate Contents.json for AppIcon.appiconset
function generateContentsJson() {
  const contents = {
    images: iconSizes.map(icon => ({
      size: `${icon.size}x${icon.size}`,
      idiom: icon.idiom,
      filename: icon.filename,
      scale: `${icon.scale}x`
    })),
    info: {
      version: 1,
      author: 'xcode'
    }
  };
  
  return JSON.stringify(contents, null, 2);
}

// Create icon generation instructions
function createIconInstructions() {
  console.log('📱 iOS App Icon Generation Instructions for Opictuary');
  console.log('=' .repeat(60));
  console.log('\nRequired: A 1024x1024 PNG image without transparency\n');
  
  console.log('Option 1: Using an online tool (Easiest):');
  console.log('1. Go to: https://www.appicon.co/');
  console.log('2. Upload your 1024x1024 icon');
  console.log('3. Select "iOS" platform');
  console.log('4. Download the generated icons');
  console.log('5. Copy all PNG files to: ios/App/App/Assets.xcassets/AppIcon.appiconset/\n');
  
  console.log('Option 2: Using ImageMagick (if installed):');
  console.log('Install: brew install imagemagick\n');
  
  console.log('Then run these commands:');
  iconSizes.forEach(icon => {
    const outputSize = icon.size * icon.scale;
    console.log(`convert icon-1024.png -resize ${outputSize}x${outputSize} ${icon.filename}`);
  });
  
  console.log('\nOption 3: Using Xcode:');
  console.log('1. Open ios/App/App.xcworkspace in Xcode');
  console.log('2. Select Assets.xcassets');
  console.log('3. Select AppIcon');
  console.log('4. Drag your 1024x1024 image to each slot');
  console.log('5. Xcode will resize automatically\n');
  
  console.log('Required Icon Sizes:');
  const uniqueSizes = new Set();
  iconSizes.forEach(icon => {
    const size = icon.size * icon.scale;
    uniqueSizes.add(`${size}x${size} (${icon.filename})`);
  });
  [...uniqueSizes].sort().forEach(size => console.log(`  - ${size}`));
  
  console.log('\n✅ Contents.json has been generated at:');
  console.log('   ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json');
}

// Save Contents.json
const contentsPath = path.join(__dirname, 'App/App/Assets.xcassets/AppIcon.appiconset/Contents.json');
const contentsJson = generateContentsJson();

try {
  fs.writeFileSync(contentsPath, contentsJson);
  console.log('✅ Contents.json created successfully!\n');
} catch (error) {
  console.log('⚠️  Could not write Contents.json automatically.');
  console.log('Please save the following content to:');
  console.log('ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json\n');
  console.log(contentsJson);
  console.log('\n');
}

// Display instructions
createIconInstructions();

// Create a simple shell script for ImageMagick conversion
const scriptContent = `#!/bin/bash
# iOS Icon Generator Script using ImageMagick
# Usage: ./generate-icons.sh icon-1024.png

if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-1024x1024-icon.png>"
  exit 1
fi

SOURCE_ICON="$1"
OUTPUT_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"

if ! command -v convert &> /dev/null; then
  echo "ImageMagick is not installed. Install with: brew install imagemagick"
  exit 1
fi

echo "Generating iOS icons from $SOURCE_ICON..."

${iconSizes.map(icon => {
  const outputSize = icon.size * icon.scale;
  return `convert "$SOURCE_ICON" -resize ${outputSize}x${outputSize} "$OUTPUT_DIR/${icon.filename}"`;
}).join('\n')}

echo "✅ All icons generated successfully!"
`;

try {
  const scriptPath = path.join(__dirname, 'generate-icons.sh');
  fs.writeFileSync(scriptPath, scriptContent);
  fs.chmodSync(scriptPath, '755');
  console.log('\n📄 Shell script created: ios/generate-icons.sh');
  console.log('   Usage: ./ios/generate-icons.sh path/to/your-icon.png');
} catch (error) {
  // Script creation is optional
}