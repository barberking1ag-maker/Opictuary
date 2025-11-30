#!/bin/bash

##############################################################################
# Quick Android Build Script for Opictuary
# 
# This is a simplified version of the build script for quick builds.
# It assumes all prerequisites are already set up.
##############################################################################

set -e

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo "🚀 Quick Android Release Build for Opictuary"
echo "============================================"

# 1. Clean
echo "🧹 Cleaning previous builds..."
rm -rf dist android/app/build android/app/src/main/assets/public

# 2. Use production config
echo "📝 Setting production configuration..."
cp capacitor.config.production.ts capacitor.config.ts

# 3. Build frontend
echo "🔨 Building frontend..."
npm run build

# 4. Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

# 5. Build AAB
echo "📦 Building Android App Bundle..."
cd android
chmod +x gradlew
./gradlew bundleRelease
cd ..

# 6. Copy output
VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_DIR="android-build-output/${TIMESTAMP}"
mkdir -p "$OUTPUT_DIR"
cp android/app/build/outputs/bundle/release/app-release.aab \
   "$OUTPUT_DIR/Opictuary-${VERSION}-release.aab"

echo ""
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo "📁 Output: $OUTPUT_DIR/Opictuary-${VERSION}-release.aab"
echo ""
echo "Upload this file to Google Play Console 🎉"