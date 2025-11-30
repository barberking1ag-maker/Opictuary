#!/bin/bash

# Create GitHub Upload Package for Opictuary
echo "📦 Creating GitHub upload package..."

# Create a clean directory for the package
rm -rf github-upload
mkdir -p github-upload

# Copy essential files (excluding node_modules, build outputs, and large generated files)
rsync -av --progress \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude '*.tar.gz' \
  --exclude '*.aab' \
  --exclude '*.apk' \
  --exclude '*.ipa' \
  --exclude 'android/app/build' \
  --exclude 'android/.gradle' \
  --exclude 'ios/App/build' \
  --exclude 'ios/DerivedData' \
  --exclude 'android-web-bundle-*' \
  --exclude 'Opictuary-Complete*' \
  --exclude 'opictuary-complete*' \
  --exclude 'opictuary-code*' \
  --exclude 'opictuary-github-files*' \
  ./ github-upload/

# Create the zip file
cd github-upload
zip -r ../opictuary-github-ready.zip . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

# Get file size
SIZE=$(du -h opictuary-github-ready.zip | cut -f1)

echo ""
echo "✅ Package created: opictuary-github-ready.zip ($SIZE)"
echo ""
echo "📋 Next Steps:"
echo "1. Download 'opictuary-github-ready.zip'"
echo "2. Extract and push to your GitHub repository"
echo "3. Add the required secrets (see GITHUB_BUILD_SETUP.md)"
echo "4. Trigger the build workflows"
