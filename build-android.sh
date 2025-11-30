#!/bin/bash

# Opictuary Android Build Script
# This script builds a production-ready Android app bundle (AAB) for Google Play Store

set -e  # Exit on error

echo "🚀 Opictuary Android Build Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build web app
echo -e "${BLUE}Step 1/4: Building web application...${NC}"
npm run build

if [ ! -d "dist/public" ]; then
    echo -e "${RED}❌ Build failed! dist/public directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Web app built successfully${NC}"
echo ""

# Step 2: Sync to Capacitor
echo -e "${BLUE}Step 2/4: Syncing to Capacitor Android project...${NC}"
npx cap sync android

if [ ! -d "android/app/src/main/assets/public" ]; then
    echo -e "${RED}❌ Capacitor sync failed! Android assets not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Capacitor sync successful${NC}"
echo ""

# Step 3: Check for signing key
echo -e "${BLUE}Step 3/4: Checking signing configuration...${NC}"

if [ ! -f "android/key.properties" ]; then
    echo -e "${YELLOW}⚠️  No signing key found!${NC}"
    echo ""
    echo "To build a release APK/AAB, you need to generate a signing key."
    echo "Run this command to generate one:"
    echo ""
    echo "cd android && keytool -genkey -v -keystore opictuary-release.keystore \\"
    echo "  -alias opictuary-key -keyalg RSA -keysize 2048 -validity 10000"
    echo ""
    echo "Then create android/key.properties with:"
    echo "storeFile=opictuary-release.keystore"
    echo "storePassword=YOUR_PASSWORD"
    echo "keyAlias=opictuary-key"
    echo "keyPassword=YOUR_PASSWORD"
    echo ""
    echo -e "${YELLOW}Building DEBUG version instead...${NC}"
    BUILD_TYPE="Debug"
else
    echo -e "${GREEN}✅ Signing key configured${NC}"
    BUILD_TYPE="Release"
fi

echo ""

# Step 4: Build Android App Bundle
echo -e "${BLUE}Step 4/4: Building Android App Bundle (AAB)...${NC}"
cd android

if [ "$BUILD_TYPE" == "Release" ]; then
    echo "Building RELEASE version (signed for Play Store)..."
    ./gradlew bundleRelease
    
    if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
        AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
        FILE_SIZE=$(du -h "$AAB_PATH" | cut -f1)
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}✅ SUCCESS! Release AAB built!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "📦 File: ${BLUE}android/$AAB_PATH${NC}"
        echo -e "📏 Size: ${BLUE}$FILE_SIZE${NC}"
        echo ""
        echo "This AAB is ready for Google Play Store upload!"
        echo ""
    else
        echo -e "${RED}❌ Build failed! AAB not found.${NC}"
        cd ..
        exit 1
    fi
else
    echo "Building DEBUG version (for testing only)..."
    ./gradlew bundleDebug
    
    if [ -f "app/build/outputs/bundle/debug/app-debug.aab" ]; then
        AAB_PATH="app/build/outputs/bundle/debug/app-debug.aab"
        FILE_SIZE=$(du -h "$AAB_PATH" | cut -f1)
        echo ""
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}⚠️  Debug AAB built${NC}"
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "📦 File: ${BLUE}android/$AAB_PATH${NC}"
        echo -e "📏 Size: ${BLUE}$FILE_SIZE${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  This is a DEBUG build - NOT for Play Store!${NC}"
        echo "Generate a signing key to build a RELEASE version."
        echo ""
    else
        echo -e "${RED}❌ Build failed! AAB not found.${NC}"
        cd ..
        exit 1
    fi
fi

cd ..

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$BUILD_TYPE" == "Release" ]; then
    echo "1. ✅ Your AAB is ready for upload!"
    echo "2. Go to: https://play.google.com/console"
    echo "3. Create new app → Upload AAB"
    echo "4. Fill in store listing (see PLAY_STORE_LISTING_CONTENT.md)"
    echo "5. Submit for review!"
else
    echo "1. Generate signing key (see GOOGLE_PLAY_DEPLOYMENT_GUIDE.md)"
    echo "2. Run this script again to build RELEASE version"
    echo "3. Upload to Google Play Console"
fi

echo ""
echo "📖 Full guide: GOOGLE_PLAY_DEPLOYMENT_GUIDE.md"
echo ""
