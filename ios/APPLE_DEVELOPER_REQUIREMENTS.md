# Apple Developer Requirements for Opictuary

## Table of Contents
1. [Pre-Submission Checklist](#pre-submission-checklist)
2. [Apple Developer Account Setup](#apple-developer-account-setup)
3. [Push Notifications Setup](#push-notifications-setup)
4. [Apple Pay / Stripe Integration](#apple-pay--stripe-integration)
5. [Entitlements Configuration](#entitlements-configuration)
6. [App Store Connect Requirements](#app-store-connect-requirements)
7. [Build & Deployment Process](#build--deployment-process)

---

## Pre-Submission Checklist

### ✅ Essential Requirements
- [ ] **Apple Developer Account** ($99/year) - Individual or Organization
- [ ] **macOS Computer** with Xcode installed (latest version)
- [ ] **App Icons Generated** - All required sizes (see ICON_GENERATION_GUIDE.md)
- [ ] **Bundle Identifier** set to: `com.opictuary.memorial`
- [ ] **App Version** and **Build Number** configured
- [ ] **Code Signing Certificates** generated
- [ ] **Provisioning Profiles** created
- [ ] **Privacy Policy URL** available
- [ ] **Support URL** available
- [ ] **App Screenshots** for all required device sizes

### ✅ Technical Requirements
- [ ] **iOS Minimum Version**: 13.0
- [ ] **Device Support**: iPhone and iPad
- [ ] **Orientation Support**: Portrait and Landscape
- [ ] **Architecture**: arm64 (Apple Silicon)

---

## Apple Developer Account Setup

### 1. Enrollment Process
1. Go to [developer.apple.com](https://developer.apple.com)
2. Click "Enroll"
3. Choose account type:
   - **Individual**: Instant approval, personal liability
   - **Organization**: 1-7 days approval, requires D-U-N-S number
4. Pay $99 annual fee
5. Wait for activation email

### 2. Team ID Configuration
1. Log in to [developer.apple.com](https://developer.apple.com)
2. Go to Account → Membership
3. Copy your **Team ID** (10-character string)
4. Update `ios/App/ExportOptions.plist`:
   ```xml
   <key>teamID</key>
   <string>YOUR_TEAM_ID_HERE</string>
   ```

### 3. App ID Creation
1. Go to Certificates, Identifiers & Profiles
2. Click Identifiers → "+"
3. Select "App IDs" → Continue
4. Select "App" → Continue
5. Configure:
   - **Description**: Opictuary Memorial App
   - **Bundle ID**: Explicit → `com.opictuary.memorial`
   - **Capabilities**: Enable required features (see below)
6. Click Register

---

## Push Notifications Setup

### 1. Enable Push Notifications Capability
1. In Apple Developer Portal:
   - Go to Identifiers → Select your App ID
   - Check "Push Notifications"
   - Click Save

2. In Xcode:
   ```
   1. Open ios/App/App.xcworkspace
   2. Select App target → Signing & Capabilities
   3. Click "+ Capability"
   4. Add "Push Notifications"
   5. Add "Background Modes" → Check "Remote notifications"
   ```

### 2. Create APNs Authentication Key
1. Go to Keys in Apple Developer Portal
2. Click "+" to create new key
3. Name: "Opictuary Push Notifications"
4. Check "Apple Push Notifications service (APNs)"
5. Click Continue → Register
6. Download the `.p8` file (SAVE IT SECURELY!)
7. Note the **Key ID** (10-character string)

### 3. Configure Server-Side APNs
```javascript
// Server configuration example
const apnsConfig = {
  keyId: "YOUR_KEY_ID",
  teamId: "YOUR_TEAM_ID",
  bundleId: "com.opictuary.memorial",
  keyPath: "./AuthKey_YOUR_KEY_ID.p8",
  production: true  // false for development
};
```

### 4. Entitlements File
Ensure `ios/App/App/App.entitlements` contains:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>aps-environment</key>
    <string>production</string>
</dict>
</plist>
```

---

## Apple Pay / Stripe Integration

### 1. Enable Apple Pay Capability
1. In Apple Developer Portal:
   - Go to Identifiers → Select your App ID
   - Check "Apple Pay Payment Processing"
   - Click Configure
   - Create or select Merchant IDs
   - Click Save

### 2. Create Merchant ID
1. Go to Identifiers → Click "+"
2. Select "Merchant IDs" → Continue
3. Configure:
   - **Description**: Opictuary Payments
   - **Identifier**: `merchant.com.opictuary.memorial`
4. Click Register

### 3. Stripe Configuration
1. In Stripe Dashboard:
   - Go to Settings → Apple Pay
   - Add your Apple Merchant ID
   - Verify domain ownership
   - Download Apple Pay certificate

2. In Xcode:
   ```
   1. Select App target → Signing & Capabilities
   2. Click "+ Capability"
   3. Add "Apple Pay"
   4. Select your Merchant ID
   ```

### 4. Entitlements Update
Add to `ios/App/App/App.entitlements`:
```xml
<key>com.apple.developer.in-app-payments</key>
<array>
    <string>merchant.com.opictuary.memorial</string>
</array>
```

---

## Entitlements Configuration

### Complete Entitlements File
Create/Update `ios/App/App/App.entitlements`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Push Notifications -->
    <key>aps-environment</key>
    <string>production</string>
    
    <!-- Apple Pay -->
    <key>com.apple.developer.in-app-payments</key>
    <array>
        <string>merchant.com.opictuary.memorial</string>
    </array>
    
    <!-- Associated Domains (for Universal Links) -->
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:opictuary.com</string>
        <string>webcredentials:opictuary.com</string>
    </array>
    
    <!-- App Groups (if needed for data sharing) -->
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.opictuary.memorial</string>
    </array>
</dict>
</plist>
```

### Xcode Configuration
1. Open `ios/App/App.xcworkspace`
2. Select App target → Build Settings
3. Search for "Code Signing Entitlements"
4. Set to: `App/App.entitlements`

---

## App Store Connect Requirements

### 1. Create App
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click My Apps → "+"
3. Configure:
   - **Platform**: iOS
   - **Name**: Opictuary
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: com.opictuary.memorial
   - **SKU**: OPICTUARY-001

### 2. App Information
- **Category**: Lifestyle
- **Secondary Category**: Social Networking
- **Content Rights**: Own all rights
- **Age Rating**: 12+ (Infrequent/Mild Mature/Suggestive Themes)

### 3. Pricing and Availability
- **Price**: Free
- **Availability**: All countries and regions

### 4. Privacy Policy
Required fields:
- **Privacy Policy URL**: https://opictuary.com/privacy
- **Privacy Choices URL**: https://opictuary.com/privacy-choices
- **Data Collection**: Disclose all data types collected

### 5. App Review Information
- **Demo Account**: Provide test credentials
- **Notes**: Explain memorial creation process
- **Contact Information**: Technical contact details

---

## Build & Deployment Process

### 1. Environment Variables
Create `.env.production` file:
```bash
# Apple Developer
DEVELOPMENT_TEAM=YOUR_TEAM_ID
APP_STORE_API_KEY=YOUR_API_KEY
APP_STORE_ISSUER_ID=YOUR_ISSUER_ID

# Stripe (for Apple Pay)
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_APPLE_MERCHANT_ID=merchant.com.opictuary.memorial
```

### 2. Build Commands
```bash
# Initial setup
./build-ios.sh prepare

# Create archive
DEVELOPMENT_TEAM=YOUR_TEAM_ID ./build-ios.sh archive

# Generate IPA
./build-ios.sh ipa

# Complete build
DEVELOPMENT_TEAM=YOUR_TEAM_ID ./build-ios.sh full

# Upload to App Store Connect (requires API key)
APP_STORE_API_KEY=xxx APP_STORE_ISSUER_ID=xxx ./build-ios.sh upload
```

### 3. Manual Upload via Transporter
1. Download [Transporter](https://apps.apple.com/us/app/transporter/id1450874784) from Mac App Store
2. Sign in with Apple ID
3. Drag `ios/App/build/App.ipa`
4. Click "Deliver"
5. Wait for processing (10-30 minutes)

### 4. TestFlight Setup
1. In App Store Connect → TestFlight
2. Wait for build to process
3. Add compliance information
4. Add internal testers (up to 100)
5. Submit for Beta App Review
6. Add external testers (up to 10,000)

---

## Troubleshooting

### Common Issues

#### "No signing certificate"
```bash
# In Xcode
Preferences → Accounts → Manage Certificates → "+" → Apple Distribution
```

#### "Profile doesn't include capability"
1. Update App ID capabilities in Apple Developer Portal
2. Regenerate provisioning profiles
3. Download and install new profiles

#### "Missing compliance"
Add to `Info.plist`:
```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

#### "Invalid Bundle ID"
Ensure Bundle ID matches exactly: `com.opictuary.memorial`

---

## Final Submission Checklist

### Before Submission
- [ ] All app icons provided
- [ ] Screenshots for all required sizes
- [ ] App description (max 4000 chars)
- [ ] Keywords (100 chars max)
- [ ] Support URL active
- [ ] Privacy Policy URL active
- [ ] Test account credentials ready
- [ ] Build uploaded to App Store Connect
- [ ] TestFlight testing complete

### App Review Guidelines Compliance
- [ ] No placeholder content
- [ ] All features functional
- [ ] No crashes or bugs
- [ ] Appropriate content rating
- [ ] Clear user interface
- [ ] Proper error handling
- [ ] Network error messages
- [ ] Offline functionality where applicable

---

## Support Resources

- **Apple Developer Forums**: [developer.apple.com/forums](https://developer.apple.com/forums)
- **App Store Review Guidelines**: [developer.apple.com/app-store/review/guidelines](https://developer.apple.com/app-store/review/guidelines)
- **Human Interface Guidelines**: [developer.apple.com/design/human-interface-guidelines](https://developer.apple.com/design/human-interface-guidelines)
- **Capacitor iOS Documentation**: [capacitorjs.com/docs/ios](https://capacitorjs.com/docs/ios)

---

## Timeline Estimates

- **Developer Account Approval**: 1-7 days
- **App ID & Certificates Setup**: 1 hour
- **Build Configuration**: 2-3 hours
- **TestFlight Processing**: 24-48 hours
- **Beta Testing Period**: 3-7 days
- **App Store Review**: 24-72 hours
- **Total Time to Launch**: 7-14 days

---

## Next Steps

1. **Immediate Actions**:
   - Enroll in Apple Developer Program
   - Generate all app icons
   - Configure Team ID in ExportOptions.plist

2. **Development**:
   - Run `./build-ios.sh prepare`
   - Test on physical device
   - Fix any capability issues

3. **Submission**:
   - Run `./build-ios.sh full`
   - Upload IPA via Transporter
   - Submit for review

For questions or issues, consult the troubleshooting section or Apple Developer support.