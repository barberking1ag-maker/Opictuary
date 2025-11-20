# Apple App Store Setup Guide for Opictuary

## Prerequisites

### 1. Apple Developer Account ($99/year)
- Go to https://developer.apple.com
- Click "Enroll"
- Choose "Individual" or "Organization"
- Complete enrollment with Apple ID
- Wait for approval (instant for Individual, 1-7 days for Organization)

### 2. Required Software
- **macOS** (required for iOS builds)
- **Xcode** (download from Mac App Store - free, ~7GB)
- **Xcode Command Line Tools**:
  ```bash
  xcode-select --install
  ```
- **CocoaPods** (if not installed):
  ```bash
  sudo gem install cocoapods
  ```

## Step-by-Step Build Process

### Step 1: Build the Web Assets
```bash
npm install
npm run build
```

### Step 2: Sync with iOS
```bash
npx cap sync ios
```

### Step 3: Install iOS Dependencies
```bash
cd ios/App
pod install
cd ../..
```

### Step 4: Open in Xcode
```bash
npx cap open ios
```
Or manually open: `ios/App/App.xcworkspace` (NOT .xcodeproj!)

### Step 5: Configure Signing in Xcode
1. In Xcode, select the "App" project in navigator
2. Select "App" target
3. Go to "Signing & Capabilities" tab
4. Check "Automatically manage signing"
5. Select your Team from dropdown
6. Bundle Identifier should be: `com.opictuary.memorial`

### Step 6: Configure Build Settings
1. Select "Any iOS Device (arm64)" as build target
2. Go to Product → Scheme → Edit Scheme
3. Select "Run" → "Info" tab
4. Change Build Configuration to "Release"

### Step 7: Create Archive for App Store
1. Product → Archive
2. Wait for build (5-10 minutes)
3. When complete, Organizer window opens
4. Click "Distribute App"
5. Choose "App Store Connect"
6. Follow prompts to upload

## App Store Connect Setup

### 1. Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+"
3. Fill in:
   - **Platform**: iOS
   - **Name**: Opictuary
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: com.opictuary.memorial
   - **SKU**: opictuary-001

### 2. Required Information
- **Category**: Lifestyle or Social Networking
- **Content Rating**: 12+ (due to memorial content)
- **Privacy Policy URL**: https://opictuary.com/privacy
- **Support URL**: https://opictuary.com/support

### 3. App Information to Prepare
- **Description** (max 4000 chars)
- **Keywords** (100 chars max, comma-separated)
- **Screenshots**:
  - iPhone 6.7" (1290 x 2796)
  - iPhone 6.5" (1284 x 2778 or 1242 x 2688)
  - iPhone 5.5" (1242 x 2208)
  - iPad Pro 12.9" (2048 x 2732)
- **App Icon**: 1024x1024 PNG without transparency

### 4. TestFlight Setup
1. Upload build via Xcode
2. Wait for processing (10-30 minutes)
3. Add internal testers (up to 100)
4. Add external testers (up to 10,000)
5. Submit for Beta App Review

## Common Issues & Solutions

### Issue: "No signing certificate"
**Solution**: In Xcode → Preferences → Accounts → Manage Certificates → "+" → Apple Development

### Issue: "Profile doesn't include capability"
**Solution**: 
1. Go to developer.apple.com
2. Certificates, Identifiers & Profiles
3. Edit App ID → Enable required capabilities
4. Regenerate provisioning profile

### Issue: "Build failed - pods not installed"
**Solution**:
```bash
cd ios/App
pod deintegrate
pod install
```

### Issue: Push Notifications Not Working
**Solution**:
1. Enable Push Notifications in App ID (developer.apple.com)
2. Create APNs Auth Key
3. Add to project capabilities in Xcode

## Build Script for CI/CD

Create `build-ios.sh`:
```bash
#!/bin/bash

# Build web assets
npm run build

# Sync with iOS
npx cap sync ios

# Install pods
cd ios/App
pod install

# Build archive (requires proper certificates)
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath build/App.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist

echo "IPA created at: ios/App/build/App.ipa"
```

## Estimated Timeline

1. **Apple Developer Enrollment**: 1-7 days
2. **Initial Build Setup**: 2-3 hours
3. **App Store Connect Setup**: 1 hour
4. **TestFlight Approval**: 24-48 hours
5. **App Store Review**: 24-72 hours

## Important Notes

- **Stripe Integration**: Requires additional Apple Pay setup in App Store Connect
- **Push Notifications**: Requires APNs certificates configuration
- **In-App Purchases**: If using subscriptions, must use Apple's IAP (not Stripe)
- **Content Moderation**: Memorial content requires clear moderation policy

## Support Resources

- Apple Developer Documentation: https://developer.apple.com/documentation
- Capacitor iOS Docs: https://capacitorjs.com/docs/ios
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

## Next Steps

1. Enroll in Apple Developer Program
2. Install Xcode
3. Follow build process above
4. Submit to TestFlight for testing
5. Submit to App Store for review

For questions, refer to the Capacitor documentation or Apple Developer forums.