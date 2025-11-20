#!/bin/bash

echo "🚀 Building Opictuary Android App Bundle..."
echo "Version code: 2025111411"
echo ""

# Navigate to android directory
cd android

# Clean previous builds
echo "Cleaning old builds..."
./gradlew clean

# Build new AAB
echo "Building AAB (this takes 5-10 minutes)..."
./gradlew bundleRelease

# Check if build succeeded
if [ -f app/build/outputs/bundle/release/app-release.aab ]; then
    echo ""
    echo "✅ SUCCESS! Your AAB is ready at:"
    echo "android/app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "Copy it to your Desktop with:"
    echo "cp app/build/outputs/bundle/release/app-release.aab ~/Desktop/"
else
    echo "❌ Build failed. Please check error messages above."
fi