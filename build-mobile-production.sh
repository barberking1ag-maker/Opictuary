#!/bin/bash

# Production Mobile Build Script for Opictuary
# This script builds the mobile app configured to connect to your published Replit backend

echo "🚀 Building Opictuary Mobile App for Production"
echo ""

# Check if PRODUCTION_API_URL is set
if [ -z "$PRODUCTION_API_URL" ]; then
  echo "❌ Error: PRODUCTION_API_URL environment variable is not set"
  echo ""
  echo "Please set your published Replit URL first:"
  echo "export PRODUCTION_API_URL=https://your-app-name.replit.app"
  echo ""
  echo "Example:"
  echo "export PRODUCTION_API_URL=https://opictuary-abc123.replit.app"
  exit 1
fi

echo "✅ Production API URL: $PRODUCTION_API_URL"
echo ""

# Build the web assets with production API URL
echo "📦 Building web assets..."
VITE_API_URL=$PRODUCTION_API_URL npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Web assets built successfully"
echo ""

# Update capacitor production config with the actual URL
echo "⚙️  Updating Capacitor production config..."
sed -i.bak "s|url: '.*'|url: '$PRODUCTION_API_URL'|g" capacitor.config.production.ts
echo "✅ Capacitor config updated"
echo ""

# Copy production config to main config
echo "📋 Using production configuration..."
cp capacitor.config.production.ts capacitor.config.ts
echo "✅ Production config applied"
echo ""

# Sync with native platforms
echo "🔄 Syncing with iOS and Android..."
npx cap sync

if [ $? -ne 0 ]; then
  echo "❌ Capacitor sync failed"
  exit 1
fi

echo ""
echo "✅ Build Complete!"
echo ""
echo "Next Steps:"
echo ""
echo "For iOS (requires Mac with Xcode):"
echo "  npx cap open ios"
echo "  - Archive the app in Xcode (Product > Archive)"
echo "  - Upload to App Store Connect"
echo ""
echo "For Android:"
echo "  npx cap open android"
echo "  - Build > Generate Signed Bundle/APK"
echo "  - Upload to Google Play Console"
echo ""
