# GOOGLE PLAY STORE SUBMISSION GUIDE FOR OPICTUARY
**Version:** 1.0.0  
**Date:** November 14, 2025  
**App ID:** com.opictuary.app

---

## 🔴 PRE-SUBMISSION CRITICAL ISSUES (From Phase 7 Testing)

### Must Fix Before Submission
1. ❌ **Authentication System** - Configure Replit Auth
2. ❌ **Firebase Setup** - Add google-services.json
3. ❌ **Push Notifications** - Configure FCM
4. ❌ **Production Server URL** - Update to https://opictuary.com
5. ❌ **Keystore Generation** - Create release signing key
6. ⚠️ **Permissions** - Add CAMERA, POST_NOTIFICATIONS to manifest
7. ❌ **Privacy Policy URL** - Must be live and accessible
8. ❌ **Terms of Service URL** - Must be live and accessible

---

## 🔑 STEP 1: GENERATE KEYSTORE AND KEY.PROPERTIES

### A. Generate Release Keystore
```bash
# Navigate to android directory
cd android

# Generate keystore (DO THIS ONCE AND KEEP SAFE!)
keytool -genkey -v -keystore opictuary-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias opictuary-release

# You'll be prompted for:
# Keystore password: [Choose a strong password]
# Re-enter password: [Same password]
# What is your first and last name? Opictuary
# What is the name of your organizational unit? Mobile Development
# What is the name of your organization? Opictuary Inc
# What is the name of your City or Locality? [Your City]
# What is the name of your State or Province? [Your State]
# What is the two-letter country code? US
# Is CN=Opictuary, OU=Mobile Development, O=Opictuary Inc, L=City, ST=State, C=US correct? yes
# Key password: [Same as keystore password or different]

# Backup your keystore immediately!
cp opictuary-release.jks ../keystores/
cp opictuary-release.jks ~/secure-backup/opictuary-release-backup.jks
```

### B. Create key.properties File
```bash
# Create key.properties in android directory
cat > android/key.properties << EOF
storeFile=opictuary-release.jks
storePassword=YOUR_KEYSTORE_PASSWORD_HERE
keyAlias=opictuary-release
keyPassword=YOUR_KEY_PASSWORD_HERE
EOF

# IMPORTANT: Add to .gitignore
echo "android/key.properties" >> .gitignore
echo "*.jks" >> .gitignore
echo "*.keystore" >> .gitignore
```

### C. Backup Critical Information
```bash
# Create secure backup document
cat > KEYSTORE_BACKUP_INFO.txt << EOF
==========================================
OPICTUARY ANDROID KEYSTORE INFORMATION
KEEP THIS INFORMATION SECURE!
==========================================

Keystore Location: android/opictuary-release.jks
Backup Location: keystores/opictuary-release.jks
Key Alias: opictuary-release
Keystore Password: [STORE SECURELY]
Key Password: [STORE SECURELY]

SHA1 Fingerprint: [Run: keytool -list -v -keystore opictuary-release.jks]
SHA256 Fingerprint: [Run command above to get]

CRITICAL: Never lose this keystore!
You cannot update your app without it.
==========================================
EOF

# Get fingerprints for Google Play Console
keytool -list -v -keystore opictuary-release.jks -alias opictuary-release
```

---

## 🌐 STEP 2: CONFIGURE PRODUCTION SERVER URL

### Update Capacitor Configuration
```typescript
// capacitor.config.production.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.opictuary.app',
  appName: 'Opictuary',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Production server URL
    url: 'https://opictuary.com',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2C1810",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#2C1810"
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
```

### Update API Configuration
```typescript
// client/src/config/api.ts
const API_CONFIG = {
  production: {
    API_URL: 'https://opictuary.com/api',
    WS_URL: 'wss://opictuary.com/ws'
  },
  development: {
    API_URL: 'http://localhost:5000/api',
    WS_URL: 'ws://localhost:5000/ws'
  }
};

export const config = API_CONFIG[process.env.NODE_ENV || 'development'];
```

---

## 📱 STEP 3: ADD REQUIRED PERMISSIONS

### Update AndroidManifest.xml
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Required Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    
    <!-- Optional but Recommended -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
                     android:maxSdkVersion="28" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" 
                     android:maxSdkVersion="32" />
    
    <!-- Camera Feature Declaration -->
    <uses-feature android:name="android.hardware.camera" 
                  android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" 
                  android:required="false" />
    
    <!-- QR Code Scanner Support -->
    <uses-feature android:name="android.hardware.camera.any" 
                  android:required="false" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="false">
        
        <!-- Firebase Messaging Service -->
        <service
            android:name="com.google.firebase.messaging.FirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
        
        <!-- Main Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Deep Linking for QR Codes -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" 
                      android:host="opictuary.com" 
                      android:pathPrefix="/memorial" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 🔥 STEP 4: SETUP FIREBASE AND GOOGLE-SERVICES.JSON

### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Project name: `opictuary-app`
4. Enable Google Analytics: Yes
5. Choose Analytics account or create new

### B. Add Android App to Firebase
1. Click Android icon in project overview
2. Register app:
   - Package name: `com.opictuary.app`
   - App nickname: `Opictuary`
   - SHA-1: [From keystore command above]
3. Download `google-services.json`
4. Place in `android/app/` directory

### C. Configure Firebase Services
```bash
# Install Firebase dependencies
cd android
./gradlew :app:dependencies | grep firebase

# Add to android/app/build.gradle if not present
dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.3.1'
    implementation 'com.google.firebase:firebase-analytics:21.5.0'
    implementation 'com.google.firebase:firebase-crashlytics:18.6.0'
}

# Add to android/build.gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
        classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'
    }
}
```

### D. Initialize Firebase in Application
```typescript
// client/src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "opictuary-app.firebaseapp.com",
  projectId: "opictuary-app",
  storageBucket: "opictuary-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);
```

---

## 🏗️ STEP 5: BUILD RELEASE AAB FILE

### A. Clean Build Environment
```bash
# Clean previous builds
cd android
./gradlew clean
rm -rf app/build
cd ..
```

### B. Sync and Build Production
```bash
# Copy production config
cp capacitor.config.production.ts capacitor.config.ts

# Sync with native projects
npx cap sync android

# Build production web assets
npm run build:prod

# Copy to Android
npx cap copy android
```

### C. Generate Release AAB
```bash
# Navigate to Android directory
cd android

# Build release AAB (App Bundle)
./gradlew bundleRelease

# Output location:
# android/app/build/outputs/bundle/release/app-release.aab

# Verify AAB
java -jar bundletool.jar validate --bundle=app-release.aab

# Test AAB locally
java -jar bundletool.jar build-apks \
  --bundle=app-release.aab \
  --output=opictuary.apks \
  --mode=universal \
  --ks=opictuary-release.jks \
  --ks-key-alias=opictuary-release

# Extract and install test APK
unzip opictuary.apks
adb install universal.apk
```

---

## 📸 ASSET REQUIREMENTS

### Screenshot Specifications (MINIMUM 2, RECOMMENDED 6-8)
```
Required Formats:
- Type: JPEG or 24-bit PNG (no alpha)
- Minimum dimension: 320px
- Maximum dimension: 3840px
- Aspect ratio: Must not exceed 2:1

Recommended Sizes:
- Phone: 1080 x 1920 px (most common)
- 7" Tablet: 1200 x 1920 px
- 10" Tablet: 1600 x 2560 px

Required Screenshots:
1. App home/landing screen
2. Memorial creation screen
3. Memorial gallery view
4. QR code generation
5. Fundraising feature
6. Celebrity memorials
7. Prison access feature (unique)
8. User profile/dashboard
```

### Generate Screenshots Script
```javascript
// scripts/generate-play-store-screenshots.js
const puppeteer = require('puppeteer');

const screenshots = [
  { url: '/', name: '1_home_screen.png', title: 'Beautiful Memorial Platform' },
  { url: '/create-memorial', name: '2_create_memorial.png', title: 'Create Lasting Tributes' },
  { url: '/memorial/sample', name: '3_memorial_view.png', title: 'Interactive Memorial Pages' },
  { url: '/qr-generator', name: '4_qr_codes.png', title: 'QR Codes for Tombstones' },
  { url: '/fundraising', name: '5_fundraising.png', title: 'Memorial Fundraising' },
  { url: '/celebrities', name: '6_celebrities.png', title: 'Celebrity Memorials' },
  { url: '/prison-access', name: '7_prison_access.png', title: 'Prison Access System' },
  { url: '/profile', name: '8_profile.png', title: 'Manage Your Memorials' }
];

async function generateScreenshots() {
  const browser = await puppeteer.launch();
  
  for (const screenshot of screenshots) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.goto(`https://opictuary.com${screenshot.url}`);
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: `play-store-assets/${screenshot.name}`,
      fullPage: false
    });
  }
  
  await browser.close();
}
```

### Feature Graphic (REQUIRED: 1024 x 500 px)
```
Format: JPEG or 24-bit PNG (no alpha)
Dimensions: Exactly 1024 x 500 px
Content Guidelines:
- App name prominently displayed
- Key value proposition
- Brand colors (purple #5B21B6, gold #FFC700)
- No excessive text
- High quality imagery

Text Overlay:
"Opictuary"
"Preserve Memories Forever"
"Digital Memorials • QR Tombstones • Prison Access"
```

### App Icon (REQUIRED: 512 x 512 px)
```
Format: 32-bit PNG (with alpha)
Dimensions: Exactly 512 x 512 px
Design Requirements:
- No rounded corners (Google adds them)
- Full bleed to edges
- High resolution
- Follows Material Design guidelines
- Already created at: assets/icon-only.png
```

### Promotional Video (OPTIONAL but RECOMMENDED)
```
Format: YouTube or direct upload
Duration: 30 seconds - 2 minutes
Resolution: 1080p minimum
Content:
- App walkthrough
- Key features demonstration
- User testimonials
- Unique features (prison access, QR codes)
```

---

## 📝 PLAY CONSOLE SUBMISSION STEPS

### 1. App Details
```
Default Language: English (United States)
App Name: Opictuary
Short Description (80 chars max):
"Digital memorials with QR codes, fundraising & unique prison access system"

Full Description (4000 chars max):
"Opictuary is a revolutionary digital memorial platform that helps families preserve and share memories of their loved ones forever.

KEY FEATURES:
✦ Create Beautiful Digital Memorials
Build lasting tributes with photos, videos, stories, and memories that celebrate a life well-lived.

✦ QR Codes for Physical Memorials
Generate QR codes for tombstones, memorial plaques, and funeral programs - bridging physical and digital remembrance.

✦ Memorial Fundraising
Raise funds for funeral expenses, charities, or causes your loved one cared about with integrated fundraising tools.

✦ Unique Prison Access System
First-of-its-kind feature allowing incarcerated individuals to safely view memorial pages of loved ones (with facility approval).

✦ Future Messages
Schedule messages to be delivered on special dates - birthdays, anniversaries, or other meaningful occasions.

✦ Celebrity & Public Figure Memorials
Explore and contribute to memorials of celebrities, essential workers, and public figures.

✦ Multi-Faith Support
Customizable themes for various religious and cultural traditions.

✦ Privacy Controls
Choose between public memorials or private family-only spaces with invite codes.

✦ Interactive Features
Visitors can leave condolences, share memories, light virtual candles, and send virtual flowers.

✦ Funeral Program Creator
Design and share digital funeral programs with integrated audio for services.

WHY OPICTUARY?
• Preserve memories forever in the cloud
• Share with family worldwide
• No monthly fees for basic memorials
• Secure and private
• Mobile-friendly for on-the-go access
• Regular updates and new features

Join thousands of families preserving legacies with Opictuary."
```

### 2. Content Rating Questionnaire
```
Violence: None
Sexual Content: None
Language: Mild (user-generated content)
Controlled Substance: None
Target Age: 18+ (death-related content)

Interactive Elements:
- Users can interact: Yes
- Shares location: No
- Shares personal info: Yes (memorial creation)
- Digital purchases: Yes (fundraising, premium features)

Data Collection:
- Personal information: Yes
- Financial information: Yes (for donations)
- Photos/Media: Yes
- Authentication info: Yes
```

### 3. Data Safety Section
```
Data Collection:
✓ Name and email (Account creation)
✓ Photos and videos (Memorial content)
✓ Financial info (Optional - for donations)
✓ App interactions (Analytics)

Data Sharing:
- No data sold to third parties
- Payment processing with Stripe
- Analytics with Google Analytics

Data Deletion:
- Users can request account deletion
- Data retained for 30 days then permanently deleted

Security Practices:
- Data encrypted in transit
- Data encrypted at rest
- Independent security review conducted
```

### 4. Privacy Policy Requirements
```html
<!-- Required Privacy Policy Sections -->
<!DOCTYPE html>
<html>
<head>
  <title>Opictuary Privacy Policy</title>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p>Effective Date: November 14, 2025</p>
  
  <h2>Information We Collect</h2>
  <ul>
    <li>Account information (name, email)</li>
    <li>Memorial content (photos, videos, text)</li>
    <li>Payment information (processed by Stripe)</li>
    <li>Usage data (analytics, crash reports)</li>
  </ul>
  
  <h2>How We Use Information</h2>
  <ul>
    <li>Provide memorial services</li>
    <li>Process donations and payments</li>
    <li>Send notifications (with consent)</li>
    <li>Improve our services</li>
  </ul>
  
  <h2>Data Security</h2>
  <p>We use industry-standard encryption and security measures...</p>
  
  <h2>Your Rights</h2>
  <ul>
    <li>Access your data</li>
    <li>Correct inaccuracies</li>
    <li>Delete your account</li>
    <li>Export your data</li>
  </ul>
  
  <h2>Contact Us</h2>
  <p>Email: privacy@opictuary.com</p>
</body>
</html>
```

### 5. App Category and Tags
```
Category: Lifestyle
Subcategory: Social

Tags (5 maximum):
- memorial
- obituary
- remembrance
- funeral
- memories

Target Audience:
- Age: 18 and above
- Interests: Family, Remembrance
```

### 6. Pricing and Distribution
```
Pricing Model: Free with In-App Purchases
Countries: All countries and regions

In-App Products:
- Premium Memorial ($4.99/month)
- Legacy Features ($9.99/month)
- Celebrity Memorial Unlock ($10.00)
- QR Plaque Order ($29.99)
- Remove Ads ($2.99)

Distribution Options:
✓ Google Play Store
✓ Opt in to Play App Signing
✓ Include in Android Instant Apps: No
✓ Pre-registration: Optional
```

---

## ✅ PRE-SUBMISSION TESTING CHECKLIST

### Technical Testing
- [ ] App installs successfully on multiple devices
- [ ] All features work without crashes
- [ ] Camera permission request works
- [ ] Push notifications permission works
- [ ] Payment processing works (test mode)
- [ ] Deep links work (QR codes)
- [ ] App works offline (basic features)
- [ ] No memory leaks
- [ ] Battery usage acceptable
- [ ] App size under 150MB

### Content Testing
- [ ] No placeholder text ("Lorem ipsum")
- [ ] All images load correctly
- [ ] No broken links
- [ ] Privacy policy accessible
- [ ] Terms of service accessible
- [ ] Contact information working

### Device Testing Matrix
```bash
# Test on these minimum configurations:
- Android 5.0 (API 21) - Oldest supported
- Android 8.0 (API 26) - Common older devices
- Android 11 (API 30) - Modern baseline
- Android 14 (API 34) - Latest version

# Screen sizes to test:
- Small phone (5")
- Standard phone (6")
- Large phone (6.7")
- 7" tablet
- 10" tablet

# Use Firebase Test Lab:
gcloud firebase test android run \
  --type=robo \
  --app=app-release.aab \
  --device=model=Pixel2,version=28 \
  --device=model=Nexus6,version=21 \
  --device=model=Pixel6,version=31
```

### Performance Benchmarks
```
App Launch Time: < 3 seconds
Screen Load Time: < 2 seconds
Network Timeout: 30 seconds
Memory Usage: < 200MB
Battery Drain: < 2% per hour active
APK Size: < 50MB
AAB Size: < 150MB
```

---

## 📤 SUBMISSION PROCESS

### Step 1: Create Developer Account
```
1. Go to https://play.google.com/console
2. Pay $25 one-time registration fee
3. Complete identity verification
4. Set up payment profile
5. Accept developer agreement
```

### Step 2: Create App
```
1. Click "Create app"
2. App name: Opictuary
3. Default language: English (US)
4. App type: App
5. Category: Free
6. Accept declarations
```

### Step 3: Upload AAB
```
1. Go to "Production" → "Releases"
2. Click "Create new release"
3. Upload app-release.aab
4. Release name: 1.0.0
5. Release notes: "Initial release"
6. Save and review
```

### Step 4: Complete Store Listing
```
1. Upload screenshots (minimum 2)
2. Upload feature graphic
3. Upload app icon
4. Fill in descriptions
5. Add video (optional)
6. Save
```

### Step 5: Complete Content Rating
```
1. Start questionnaire
2. Select app category
3. Answer all questions
4. Submit for rating
5. Apply rating to app
```

### Step 6: Set Up Pricing
```
1. Set as Free
2. Add in-app products if needed
3. Set country availability
4. Accept terms
```

### Step 7: Submit for Review
```
1. Review all sections (must show ✓)
2. Fix any warnings
3. Submit for review
4. Wait 2-24 hours for review
```

---

## 🚀 POST-SUBMISSION TASKS

### Monitor Review Status
```bash
# Check status every few hours
# Common review times:
# First submission: 2-24 hours
# Updates: 1-3 hours

# Possible outcomes:
# - Approved: Celebrate!
# - Rejected: Fix issues and resubmit
# - Suspended: Serious violation (rare)
```

### After Approval
1. **Announce Launch**
   - Social media posts
   - Email to users
   - Press release

2. **Monitor Metrics**
   - Install rates
   - Crash reports
   - User reviews
   - Revenue

3. **Respond to Reviews**
   - Thank positive reviews
   - Address concerns
   - Fix reported bugs

4. **Plan Updates**
   - Bug fixes (1.0.1)
   - Feature updates (1.1.0)
   - Regular maintenance

---

## 📊 SUCCESS METRICS

### Day 1 Goals
- 100+ installs
- 4.0+ star rating
- <1% crash rate
- 5+ reviews

### Week 1 Goals
- 1,000+ installs
- 4.2+ star rating
- 50+ reviews
- First revenue

### Month 1 Goals
- 10,000+ installs
- 4.3+ star rating
- Featured possibility
- $1,000+ revenue

---

## 🆘 TROUBLESHOOTING COMMON ISSUES

### Build Failures
```bash
# Clear cache and rebuild
cd android
./gradlew clean
rm -rf .gradle
rm -rf app/build
cd ..
npx cap sync android

# Check for duplicate classes
./gradlew :app:dependencies | grep duplicate

# Verify Android SDK
sdkmanager --list
sdkmanager --update
```

### Signing Issues
```bash
# Verify keystore
keytool -list -keystore opictuary-release.jks

# Check key.properties
cat android/key.properties

# Verify build.gradle has signing config
grep -A 10 "signingConfigs" android/app/build.gradle
```

### Upload Failures
```
Common causes:
1. Version code not incremented
2. Package name mismatch
3. Signing certificate changed
4. AAB corrupted
5. Permissions not declared

Solutions:
- Increment versionCode in build.gradle
- Verify package name matches
- Use same keystore
- Rebuild AAB
- Check AndroidManifest.xml
```

---

## 📋 FINAL CHECKLIST BEFORE SUBMISSION

### Code & Build
- [ ] Version code incremented
- [ ] Version name updated
- [ ] Production API URL configured
- [ ] Debug logging disabled
- [ ] ProGuard configured (if using)
- [ ] AAB generated and tested
- [ ] Keystore backed up securely

### Store Assets
- [ ] 2-8 screenshots uploaded
- [ ] Feature graphic created (1024x500)
- [ ] App icon uploaded (512x512)
- [ ] Descriptions written
- [ ] Privacy policy live
- [ ] Terms of service live

### Testing
- [ ] Tested on minimum API level
- [ ] Tested on latest API level
- [ ] All permissions work
- [ ] Payments work (test mode)
- [ ] No crashes in test lab
- [ ] Performance acceptable

### Legal & Compliance
- [ ] Content rating completed
- [ ] Data safety declared
- [ ] Privacy policy linked
- [ ] Terms of service linked
- [ ] Copyright cleared
- [ ] GDPR compliant

---

**Document Version:** 1.0.0  
**Last Updated:** November 14, 2025  
**Next Review:** After first submission

## Support Resources
- Google Play Console: https://play.google.com/console
- Android Developers: https://developer.android.com
- Capacitor Docs: https://capacitorjs.com
- Firebase Console: https://console.firebase.google.com