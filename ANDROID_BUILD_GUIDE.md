# ANDROID BUILD GUIDE
**Complete guide to building and deploying Opictuary on Google Play Store**

---

## 📋 PREREQUISITES

Before building your Android APK, ensure you have:

- ✅ Node.js and npm installed
- ✅ Capacitor CLI installed (`npm install -g @capacitor/cli`)
- ✅ Android Studio installed
- ✅ Java Development Kit (JDK 11 or higher)
- ✅ Opictuary app code (current project)

**Verify installations:**
```bash
node --version          # Should be 18+
npm --version           # Should be 9+
npx cap --version       # Should be 5+
java -version          # Should be 11+
```

---

## 🔧 STEP 1: PREPARE YOUR APP FOR PRODUCTION

### 1.1 Update App Configuration

**Edit `capacitor.config.ts`:**
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.opictuary.app',
  appName: 'Opictuary',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Remove any localhost URLs for production
  },
  android: {
    buildOptions: {
      releaseType: 'APK' // or 'AAB' for Android App Bundle
    }
  }
};

export default config;
```

**Key fields:**
- `appId`: Must be unique (e.g., `com.opictuary.app`)
- `appName`: Display name in app launcher
- `webDir`: Build output directory (should be `dist`)

### 1.2 Update Android Manifest

**Edit `android/app/src/main/AndroidManifest.xml`:**

Verify these permissions exist:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

### 1.3 Set Version Code and Version Name

**Edit `android/app/build.gradle`:**

Find the `defaultConfig` section:
```gradle
defaultConfig {
    applicationId "com.opictuary.app"
    minSdkVersion 22
    targetSdkVersion 33
    versionCode 1          // Increment for each release (1, 2, 3...)
    versionName "1.0.0"    // User-facing version (1.0.0, 1.0.1, 1.1.0...)
}
```

**Important:**
- `versionCode`: Must be incremented for every new release (1, 2, 3, 4...)
- `versionName`: User-facing version string (e.g., "1.0.0", "1.0.1")

### 1.4 Build Frontend for Production

**Build optimized production bundle:**
```bash
# Clean previous builds
rm -rf dist/

# Build production bundle (optimized, minified)
npm run build

# Verify build output
ls -la dist/
```

**Expected output:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

### 1.5 Sync with Capacitor

**Copy web assets to native project:**
```bash
# Sync web build to Android project
npx cap sync android

# Or copy only (if you don't want to update plugins)
npx cap copy android
```

**What this does:**
- Copies `dist/` folder to `android/app/src/main/assets/public/`
- Updates Capacitor plugins
- Syncs configuration

---

## 🔐 STEP 2: GENERATE SIGNING KEY

Android apps must be signed with a private key before release.

### 2.1 Generate Release Key

**Run this command (one-time setup):**
```bash
# Create a directory for keys (if it doesn't exist)
mkdir -p ~/android-keys/

# Generate keystore file
keytool -genkey -v -keystore ~/android-keys/opictuary-release.keystore -alias opictuary -keyalg RSA -keysize 2048 -validity 10000
```

**You'll be prompted for:**

1. **Keystore password:** Choose a strong password (e.g., `OpictuaryRelease2025!`)
   - ⚠️ **CRITICAL:** Save this password securely! You'll need it for every release.

2. **Key password:** Choose another strong password (can be same as keystore)
   - ⚠️ **CRITICAL:** Save this password too!

3. **Your information:**
   - First and last name: `Opictuary Inc.` (or your name)
   - Organizational unit: `Engineering`
   - Organization: `Opictuary`
   - City: `Your City`
   - State: `Your State`
   - Country code: `US` (or your country)

**Example:**
```bash
Enter keystore password: OpictuaryRelease2025!
Re-enter new password: OpictuaryRelease2025!

What is your first and last name?
  [Unknown]:  Opictuary Inc.
What is the name of your organizational unit?
  [Unknown]:  Engineering
What is the name of your organization?
  [Unknown]:  Opictuary
What is the name of your City or Locality?
  [Unknown]:  San Francisco
What is the name of your State or Province?
  [Unknown]:  California
What is the two-letter country code for this unit?
  [Unknown]:  US
Is CN=Opictuary Inc., OU=Engineering, O=Opictuary, L=San Francisco, ST=California, C=US correct?
  [no]:  yes

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10,000 days...
[Storing ~/android-keys/opictuary-release.keystore]
```

**Result:**
- Keystore file created at: `~/android-keys/opictuary-release.keystore`
- This file is CRITICAL - back it up securely!

### 2.2 Verify Keystore

**Check keystore details:**
```bash
keytool -list -v -keystore ~/android-keys/opictuary-release.keystore
```

Enter your keystore password when prompted. You should see:
- Alias name: opictuary
- Creation date
- Entry type: PrivateKeyEntry
- Certificate fingerprints (SHA1, SHA256)

---

## 🔑 STEP 3: CONFIGURE GRADLE FOR SIGNING

### 3.1 Create Keystore Properties File

**Create `android/keystore.properties`:**
```bash
nano android/keystore.properties
```

**Add these lines:**
```properties
storeFile=/Users/YOUR_USERNAME/android-keys/opictuary-release.keystore
storePassword=OpictuaryRelease2025!
keyAlias=opictuary
keyPassword=OpictuaryRelease2025!
```

**⚠️ IMPORTANT:**
- Replace `/Users/YOUR_USERNAME/` with your actual home directory path
- Replace passwords with your actual passwords
- This file contains secrets - DO NOT commit to git!

**Add to `.gitignore`:**
```bash
echo "android/keystore.properties" >> .gitignore
```

### 3.2 Update build.gradle

**Edit `android/app/build.gradle`:**

**Add at the top (before `android {`):**
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing config ...
```

**Add signing config (inside `android {`):**
```gradle
android {
    // ... other config ...

    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Full example `android/app/build.gradle`:**
```gradle
// Load keystore properties
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

apply plugin: 'com.android.application'

android {
    namespace "com.opictuary.app"
    compileSdkVersion 33

    defaultConfig {
        applicationId "com.opictuary.app"
        minSdkVersion 22
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
        debug {
            // Debug builds don't need signing
        }
    }
}

// ... rest of file ...
```

---

## 🏗️ STEP 4: BUILD RELEASE APK

### 4.1 Build APK via Gradle

**Navigate to android directory:**
```bash
cd android
```

**Build release APK:**
```bash
./gradlew assembleRelease
```

**Build process:**
- Downloads dependencies (first time only)
- Compiles app code
- Minifies assets
- Signs APK with your release key
- Outputs APK file

**Expected output:**
```
BUILD SUCCESSFUL in 2m 34s
37 actionable tasks: 37 executed
```

**Locate APK:**
```bash
ls -lh app/build/outputs/apk/release/
```

**Output:**
```
-rw-r--r--  1 user  staff   25M Nov 10 14:23 app-release.apk
```

### 4.2 Build AAB (Android App Bundle) - Recommended

**What is AAB?**
- Google Play's preferred format
- Smaller download sizes (20-30% reduction)
- Automatic optimization for different devices
- Required for new apps on Google Play (as of Aug 2021)

**Build AAB:**
```bash
./gradlew bundleRelease
```

**Locate AAB:**
```bash
ls -lh app/build/outputs/bundle/release/
```

**Output:**
```
-rw-r--r--  1 user  staff   18M Nov 10 14:25 app-release.aab
```

**Which to use?**
- **AAB:** For Google Play Store (recommended)
- **APK:** For direct distribution or testing

---

## ✅ STEP 5: TEST YOUR APK

Before uploading to Google Play, test the APK on a real device!

### 5.1 Install APK on Android Device

**Option 1: Android Studio**
1. Connect Android device via USB
2. Enable USB debugging on device
3. In Android Studio: Run → Install APK
4. Select `app-release.apk`
5. App installs on device

**Option 2: ADB (Command Line)**
```bash
# List connected devices
adb devices

# Install APK
adb install app/build/outputs/apk/release/app-release.apk

# If already installed, use -r to reinstall
adb install -r app/build/outputs/apk/release/app-release.apk
```

**Option 3: Transfer APK**
1. Copy APK to phone (email, Google Drive, USB)
2. On phone: Open APK file
3. Allow "Install from Unknown Sources" (if prompted)
4. Install app

### 5.2 Test Checklist

**Test these features on real device:**

- [ ] App launches successfully
- [ ] Login/authentication works
- [ ] Create memorial flow works
- [ ] Upload photos/videos
- [ ] View memorial gallery
- [ ] Generate QR code
- [ ] Make donation (test mode)
- [ ] Share memorial
- [ ] Offline functionality (if applicable)
- [ ] No crashes or errors

**Check for issues:**
- Slow loading times
- Broken images/assets
- API errors
- Missing functionality
- UI/UX problems

**If you find issues:**
1. Fix them in your codebase
2. Rebuild frontend: `npm run build`
3. Sync: `npx cap sync android`
4. Rebuild APK: `./gradlew assembleRelease`
5. Test again

---

## 📤 STEP 6: UPLOAD TO GOOGLE PLAY CONSOLE

### 6.1 Create Google Play Developer Account

**If you don't have an account:**

1. **Go to:** https://play.google.com/console
2. **Sign in** with Google account
3. **Pay registration fee:** $25 (one-time, lifetime access)
4. **Complete account details:**
   - Developer name: "Opictuary" (or your name)
   - Email: your@email.com
   - Website: https://opictuary.com
5. **Accept agreements:**
   - Developer Distribution Agreement
   - Export laws

**Account approval:** Usually instant, can take 1-2 days

### 6.2 Create App in Console

1. **Go to:** https://play.google.com/console/u/0/developers
2. **Click:** "Create app"
3. **Fill in details:**
   - App name: "Opictuary - Digital Memorials"
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
4. **Declarations:**
   - ☑ I confirm this app complies with Google Play's policies
   - ☑ I confirm this app is or will be compliant with US export laws
5. **Click:** "Create app"

### 6.3 Complete Store Listing

**Navigate to:** "Store presence" → "Main store listing"

**Fill in all fields:**

1. **App name:**
   ```
   Opictuary - Digital Memorials
   ```

2. **Short description:** (80 characters max)
   ```
   Honor loved ones with beautiful digital memorials, QR codes, and fundraising.
   ```

3. **Full description:** (4000 characters max)
   ```
   [Use the full description from GOOGLE_PLAY_STORE_LISTING.md]
   ```

4. **App icon:**
   - Upload 512 x 512 px PNG
   - Location: `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`
   - Use transparency if needed

5. **Feature graphic:**
   - Upload 1024 x 500 px PNG
   - Location: `attached_assets/generated_images/Opictuary_Google_Play_feature_graphic_6604aadf.png`

6. **Screenshots:** (minimum 2, maximum 8)
   - Upload 1080 x 1920 px PNG files
   - Follow screenshot guide in `GOOGLE_PLAY_ASSETS_GUIDE.md`

7. **Category:**
   - Application type: App
   - Category: Lifestyle
   - Tags: Memorial, Family, Remembrance

8. **Contact details:**
   - Email: support@opictuary.com
   - Phone: (optional)
   - Website: https://opictuary.com

9. **Privacy policy:**
   - URL: https://opictuary.com/privacy
   - (You'll need to create this page)

**Click "Save"**

### 6.4 Set Up Content Rating

**Navigate to:** "Content rating"

1. **Click:** "Start questionnaire"
2. **Select category:** "Utility, Productivity, Communication, or Other"
3. **Answer questions:**
   - Does your app contain violence? → No
   - Does your app contain sexual content? → No
   - Does your app contain profanity? → No (content moderation)
   - Does your app contain alcohol/drugs? → No
   - Does your app contain gambling? → No
4. **Submit:** Get IARC rating (usually Everyone)

**Click "Save"**

### 6.5 Select Target Audience

**Navigate to:** "Target audience"

1. **Target age groups:**
   - ☑ Ages 18+ (memorial platform is for adults)
2. **Appeal to children:**
   - ☐ No, my app does not appeal to children
3. **Store presence:**
   - Countries: Select "All countries" or specific ones

**Click "Save"**

### 6.6 Configure App Content

**Navigate to:** "App content"

**Complete these sections:**

1. **Privacy Policy:**
   - URL: https://opictuary.com/privacy

2. **Ads:**
   - Does your app contain ads? → No
   - (Unless you plan to add ads)

3. **App access:**
   - Special access needed? → No
   - (Or provide test credentials)

4. **Data safety:**
   - Click "Start"
   - Select data collected:
     - ☑ Personal info (name, email)
     - ☑ Photos and videos (memorial content)
     - ☑ Financial info (donations via Stripe)
   - Data security:
     - ☑ Data is encrypted in transit
     - ☑ Users can request data deletion
     - ☑ Data is encrypted at rest
   - Data usage:
     - Purpose: App functionality, fraud prevention
   - Data sharing:
     - ☑ No, we don't share data with third parties
     - (Or list: Stripe for payments)
   - Click "Submit"

**Click "Save" on all sections**

### 6.7 Create Production Release

**Navigate to:** "Release" → "Production"

1. **Click:** "Create new release"

2. **Upload app bundle:**
   - Click "Upload"
   - Select: `android/app/build/outputs/bundle/release/app-release.aab`
   - (Or `app-release.apk` if using APK)
   - Wait for upload to complete

3. **Release name:**
   ```
   1.0.0 (1)
   ```

4. **Release notes:** (What's new)
   ```
   🎉 Welcome to Opictuary v1.0!

   ✨ Features:
   • Create beautiful digital memorials
   • Upload unlimited photos & videos
   • Generate printable QR codes for tombstones
   • Crowdfund funeral expenses (3% platform fee)
   • Share memorials with family & friends
   • Multi-faith customization
   • Private or public memorials

   📱 Platform:
   • Native Android app with offline support
   • Fast, beautiful, respectful design
   • Secure payment processing via Stripe

   💜 Honor their legacy forever.
   ```

5. **Review release:**
   - Verify app bundle uploaded
   - Verify release notes
   - Check version code (should be 1)

6. **Click:** "Save"

7. **Click:** "Review release"

8. **Review warnings (if any):**
   - Fix any critical issues
   - Warnings are usually non-blocking

9. **Click:** "Start rollout to Production"

10. **Confirm rollout:**
    - ☑ I confirm this release complies with all policies
    - Click "Rollout"

**Release submitted! 🎉**

---

## ⏳ STEP 7: WAIT FOR REVIEW

### What Happens Next?

1. **Google Play Review:**
   - Timeline: 1-7 days (usually 2-3 days)
   - Google reviews for policy compliance
   - Automated testing for crashes/malware

2. **Review statuses:**
   - "In review" → Being reviewed by Google
   - "Approved" → App will go live soon
   - "Rejected" → Fix issues and resubmit

3. **If approved:**
   - App goes live on Google Play Store
   - Users can search and install
   - You'll receive email notification

4. **If rejected:**
   - Read rejection reason carefully
   - Fix the issue (content, policy, technical)
   - Resubmit new release
   - Response time: 1-2 days

### Track Review Status

**Check status:**
1. Go to Google Play Console
2. Navigate to "Release" → "Production"
3. Check release status

**Email notifications:**
- Google sends emails to developer account
- Check spam folder

---

## 🎉 STEP 8: POST-LAUNCH

### Your App is Live!

**Celebrate! 🎊** Your app is now on Google Play Store!

**Share your app:**
- Play Store URL: `https://play.google.com/store/apps/details?id=com.opictuary.app`
- Share on social media, website, email

### Monitor Performance

**Navigate to:** "Statistics" in Google Play Console

**Track metrics:**
- Installs: Daily active installs
- Uninstalls: Churn rate
- Ratings: Average star rating
- Reviews: User feedback
- Crashes: App stability

**Respond to reviews:**
- Reply to user reviews (builds trust)
- Fix bugs reported in reviews
- Thank users for positive feedback

### Update Your App

**When you need to release an update:**

1. **Make code changes**
2. **Increment version:**
   - Edit `android/app/build.gradle`
   - Bump `versionCode` (e.g., 1 → 2)
   - Bump `versionName` (e.g., "1.0.0" → "1.0.1")
3. **Build frontend:**
   ```bash
   npm run build
   npx cap sync android
   ```
4. **Build new APK/AAB:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
5. **Upload to Google Play Console:**
   - Create new release in Production
   - Upload new AAB
   - Add release notes
   - Submit for review

**Update timeline:**
- Usually faster than initial review (1-2 days)

---

## 🐛 TROUBLESHOOTING

### Build Errors

**Error: "Execution failed for task ':app:validateSigningRelease'"**
- **Cause:** Keystore file not found or wrong path
- **Fix:** Check `android/keystore.properties` paths
- **Verify:** Keystore exists at specified location

**Error: "minSdkVersion XX cannot be smaller than version XX"**
- **Cause:** Plugin requires higher Android version
- **Fix:** Edit `android/app/build.gradle`
  ```gradle
  defaultConfig {
      minSdkVersion 22  // Increase to 23, 24, etc.
  }
  ```

**Error: "Unsupported class file major version 61"**
- **Cause:** JDK version mismatch
- **Fix:** Use JDK 11 or JDK 17
  ```bash
  java -version  # Check version
  # Install correct JDK if needed
  ```

**Error: "Task :app:lintVitalRelease FAILED"**
- **Cause:** Lint errors in code
- **Fix:** Disable lint in `android/app/build.gradle`
  ```gradle
  android {
      lintOptions {
          checkReleaseBuilds false
          abortOnError false
      }
  }
  ```

### Upload Errors

**Error: "Upload failed: Version code 1 has already been used"**
- **Cause:** Version code not incremented
- **Fix:** Increase `versionCode` in `build.gradle`
  ```gradle
  versionCode 2  // Was 1, now 2
  ```

**Error: "You need to use a different package name"**
- **Cause:** Package name already exists on Play Store
- **Fix:** Change `applicationId` in `build.gradle`
  ```gradle
  applicationId "com.opictuary.memorials"  // Add suffix
  ```

**Error: "This release is not compliant with the Google Play 64-bit requirement"**
- **Cause:** Missing 64-bit builds (for apps targeting API 28+)
- **Fix:** Ensure `abiFilters` includes 64-bit architectures
  ```gradle
  ndk {
      abiFilters "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
  }
  ```

### Review Rejection

**Rejected for: "Violation of User Data policy"**
- **Cause:** Missing privacy policy or data handling disclosure
- **Fix:** Add privacy policy URL in store listing
- **Fix:** Complete "Data safety" section

**Rejected for: "Misleading content"**
- **Cause:** Screenshots/description don't match app functionality
- **Fix:** Update screenshots to show actual app
- **Fix:** Rewrite description to be accurate

**Rejected for: "Broken functionality"**
- **Cause:** App crashes or features don't work
- **Fix:** Test app thoroughly on multiple devices
- **Fix:** Fix bugs and resubmit

---

## 📚 REFERENCE

### Important Files

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | App configuration |
| `android/app/build.gradle` | Version, signing, dependencies |
| `android/app/src/main/AndroidManifest.xml` | Permissions, app info |
| `android/keystore.properties` | Signing key configuration (SECRET!) |
| `~/android-keys/opictuary-release.keystore` | Signing key file (BACKUP THIS!) |

### Important Commands

```bash
# Build production frontend
npm run build

# Sync to Android
npx cap sync android

# Build release APK
cd android && ./gradlew assembleRelease

# Build release AAB (recommended)
cd android && ./gradlew bundleRelease

# Install on device
adb install app/build/outputs/apk/release/app-release.apk

# Check keystore
keytool -list -v -keystore ~/android-keys/opictuary-release.keystore
```

### Version History

| Version | Version Code | Release Date | Notes |
|---------|--------------|--------------|-------|
| 1.0.0 | 1 | Nov 10, 2025 | Initial release |

**Increment for each release:**
- Patch (bug fixes): 1.0.0 → 1.0.1 (versionCode +1)
- Minor (new features): 1.0.1 → 1.1.0 (versionCode +1)
- Major (breaking changes): 1.1.0 → 2.0.0 (versionCode +1)

---

## 🎯 QUICK REFERENCE CHECKLIST

### Pre-Build
- [ ] Update `versionCode` and `versionName` in `build.gradle`
- [ ] Build production frontend: `npm run build`
- [ ] Sync to Android: `npx cap sync android`
- [ ] Keystore file exists and configured

### Build
- [ ] Navigate to `android/` directory
- [ ] Run `./gradlew bundleRelease` (or `assembleRelease` for APK)
- [ ] Locate AAB/APK in `app/build/outputs/`
- [ ] Install and test on real device

### Upload
- [ ] Google Play Developer account created ($25 fee)
- [ ] App created in Console
- [ ] Store listing complete (screenshots, description, icon)
- [ ] Content rating complete
- [ ] Privacy policy URL added
- [ ] AAB/APK uploaded
- [ ] Release notes written
- [ ] Submitted for review

### Post-Launch
- [ ] Monitor review status
- [ ] Respond to reviews
- [ ] Track installs and crashes
- [ ] Plan updates based on feedback

---

**You're ready to build and deploy! 🚀**

**Questions?** Check Google Play Console Help Center: https://support.google.com/googleplay/android-developer

**Created:** November 10, 2025  
**For:** Opictuary Android Build & Deployment  
**Status:** Complete guide ready to use!
