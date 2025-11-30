# Google Play Store Launch Checklist for Opictuary

Quick reference checklist for publishing your app to Google Play Store.

---

## ✅ Phase 1: Account Setup
- [x] **Created Google Play Developer account** ($25 one-time fee paid)
- [x] **Account approved** (24-48 hour wait after signup)
- [ ] **Verified developer email** (check inbox for verification link)

---

## ✅ Phase 2: Prepare Materials

### Graphics & Assets
- [ ] **App icon** (512x512 PNG)
  - Location: `/client/public/icon-512.png`
  - Status: Already created ✓
  
- [ ] **Feature graphic** (1024x500 PNG/JPEG)
  - Design: Purple background (#1a0f29) + Angel halo logo + "Dignity in Digital"
  - Tool: Canva, Figma, or Photoshop
  
- [ ] **Screenshots** (2-8 images required)
  - [ ] Screenshot 1: Home/Landing page
  - [ ] Screenshot 2: Memorial page
  - [ ] Screenshot 3: Memories section
  - [ ] Screenshot 4: Fundraiser feature
  - [ ] Screenshot 5: QR code feature
  - [ ] Screenshot 6: Legacy features
  - [ ] Screenshot 7: User profile
  - [ ] Screenshot 8: Mobile view

### Text Content
- [ ] **Short description** (80 chars)
  - Copy from `PLAY_STORE_MATERIALS.md`
  
- [ ] **Full description** (4000 chars)
  - Copy from `PLAY_STORE_MATERIALS.md`
  
- [ ] **Release notes**
  - Copy from `PLAY_STORE_MATERIALS.md`

### Legal & Compliance
- [ ] **Privacy policy published**
  - URL: `https://[your-domain].replit.app/privacy`
  - Status: Already created ✓
  
- [ ] **Content rating questionnaire ready**
  - Answers prepared in `PLAY_STORE_MATERIALS.md`

---

## ✅ Phase 3: Build Android App

### Setup
- [ ] **Install Android Studio** (if building locally)
- [ ] **Java JDK 17+** installed
- [ ] **Updated version numbers** in `android/app/build.gradle`
  - versionCode: 1
  - versionName: "1.0.0"
  - targetSdkVersion: 35 (API Level 35 - required for 2025)

### Generate Signing Key (ONE TIME ONLY)
- [ ] **Created release keystore**
  ```bash
  keytool -genkey -v -keystore opictuary-release-key.jks \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -alias opictuary-release
  ```
  
- [ ] **Saved keystore file securely**
  - Downloaded `opictuary-release-key.jks`
  - Backed up to cloud storage (encrypted)
  
- [ ] **Saved passwords securely**
  - Keystore password → Password manager
  - Key password → Password manager
  - ⚠️ CRITICAL: Without these, you cannot update your app!

### Configure Signing
- [ ] **Created `android/key.properties`**
  ```properties
  storePassword=YOUR_KEYSTORE_PASSWORD
  keyPassword=YOUR_KEY_PASSWORD
  keyAlias=opictuary-release
  storeFile=../opictuary-release-key.jks
  ```
  
- [ ] **Updated `android/app/build.gradle`** with signing config
- [ ] **Added to .gitignore**: `android/key.properties`

### Build Release Bundle
- [ ] **Built production web app**
  ```bash
  npm run build
  ```
  
- [ ] **Synced Capacitor**
  ```bash
  npx cap sync android
  ```
  
- [ ] **Built Android App Bundle (AAB)**
  ```bash
  cd android
  ./gradlew clean
  ./gradlew bundleRelease
  ```
  
- [ ] **Located AAB file**
  - Path: `android/app/build/outputs/bundle/release/app-release.aab`
  - File size: Check it's 5-20 MB (reasonable size)

### Test Release (Optional but Recommended)
- [ ] **Built test APK**
  ```bash
  ./gradlew assembleRelease
  ```
  
- [ ] **Installed on Android device**
  ```bash
  adb install app-release.apk
  ```
  
- [ ] **Tested app functionality**
  - App opens correctly
  - Can create memorial
  - Navigation works
  - No crashes

---

## ✅ Phase 4: Play Console Setup

### Create App
- [ ] **Logged into Play Console**
  - URL: https://play.google.com/console
  
- [ ] **Created new app**
  - App name: Opictuary
  - Language: English (United States)
  - Type: App
  - Pricing: Free
  
- [ ] **Accepted policies**
  - Developer Program Policies ✓
  - US export laws ✓

### Complete Dashboard Tasks

#### Required Tasks
- [ ] **App access** → "No special access needed"
- [ ] **Ads** → "Yes" (you have advertising features)
- [ ] **Content rating**
  - Started questionnaire
  - Category: All other app types
  - Answered all questions
  - Submitted for rating
  - Expected: Everyone or Everyone 10+
  
- [ ] **Target audience** → 18+ (memorial content)
- [ ] **News app** → No
- [ ] **COVID-19 apps** → No
- [ ] **Data safety**
  - Collects: Name, Email, Photos, Videos, Analytics
  - Encrypted in transit: Yes
  - Can delete data: Yes
  - Submitted data safety form
  
- [ ] **Government apps** → No
- [ ] **Financial features** → No

### Store Listing
- [ ] **Uploaded app icon** (512x512)
- [ ] **Uploaded feature graphic** (1024x500)
- [ ] **Uploaded screenshots** (2-8 phone screenshots)
- [ ] **Uploaded tablet screenshots** (optional)
- [ ] **Added short description**
- [ ] **Added full description**
- [ ] **Set category** → Lifestyle
- [ ] **Added contact email**
- [ ] **Added website URL**
- [ ] **Added privacy policy URL**

---

## ✅ Phase 5: Upload & Submit

### Upload Release
- [ ] **Navigated to Production**
  - Release → Production → Create new release
  
- [ ] **Enabled Play App Signing**
  - Selected "Let Google manage and protect your app signing key"
  
- [ ] **Uploaded AAB file**
  - app-release.aab uploaded successfully
  - Processing completed (no errors)
  
- [ ] **Added release notes**
  - Copied from PLAY_STORE_MATERIALS.md
  
- [ ] **Saved release**

### Set Distribution
- [ ] **Selected countries/regions**
  - Recommended: All countries
  - Minimum: US, Canada, UK, Australia
  
- [ ] **Confirmed pricing** → Free

### Final Review
- [ ] **Checked dashboard** → All tasks complete (green checkmarks)
- [ ] **Reviewed all details**
  - App name correct
  - Screenshots look good
  - Description accurate
  - Privacy policy accessible
  - AAB uploaded
  
- [ ] **Clicked "Review release"**
- [ ] **Clicked "Start rollout to production"**
- [ ] **Confirmed submission**

---

## ✅ Phase 6: Post-Submission

### Wait for Review
- [ ] **Received submission confirmation email**
- [ ] **Waiting for review** (1-7 days, typically 2-4 days)
- [ ] **Checking Play Console daily** for status updates

### After Approval
- [ ] **Received approval email** 🎉
- [ ] **App status changed to "Published"**
- [ ] **App live on Play Store**
  - URL: `https://play.google.com/store/apps/details?id=com.opictuary.app`
  
- [ ] **Verified app listing**
  - App appears in search
  - All graphics display correctly
  - Download button works
  
- [ ] **Shared with users**
  - Posted on your website
  - Shared on social media
  - Notified funeral home partners

### Monitor Performance
- [ ] **Set up review monitoring**
  - Respond to user reviews within 24-48 hours
  
- [ ] **Check crash reports** weekly
  - Release → App vitals → Crashes & ANRs
  
- [ ] **Track downloads**
  - Grow → Acquisition reports

---

## ✅ Future Updates Checklist

When you want to release an update:

- [ ] Make code changes
- [ ] Increment version in `android/app/build.gradle`:
  - versionCode: 2 (was 1)
  - versionName: "1.1.0" (was "1.0.0")
- [ ] Build web app: `npm run build`
- [ ] Sync: `npx cap sync android`
- [ ] Build AAB: `cd android && ./gradlew bundleRelease`
- [ ] Upload to Play Console → Production → Create new release
- [ ] Add release notes describing changes
- [ ] Submit for review (faster than first submission)

---

## 🚨 Critical Reminders

### NEVER LOSE THESE:
- ⚠️ **Keystore file**: `opictuary-release-key.jks`
- ⚠️ **Keystore password**
- ⚠️ **Key password**

Without these files and passwords, you **CANNOT UPDATE YOUR APP**. Ever. You'd have to create a new app with a different package name.

### Backup Strategy:
1. Save keystore file in 3+ locations:
   - Password manager (as attachment)
   - Encrypted cloud storage (Google Drive, Dropbox)
   - External hard drive (encrypted)
   - Company secure server
   
2. Save passwords in password manager with note: "CRITICAL: Required for all Opictuary app updates"

---

## 📊 Current Status

**Account**: ✅ Created  
**Materials**: ⏳ In Progress  
**Build**: ⏳ Not Started  
**Upload**: ⏳ Not Started  
**Review**: ⏳ Pending  
**Live**: ⏳ Not Published  

---

## 📞 Need Help?

- **Detailed build guide**: See `PLAY_STORE_GUIDE.md`
- **Copy-paste materials**: See `PLAY_STORE_MATERIALS.md`
- **Official support**: https://support.google.com/googleplay/android-developer
- **Capacitor docs**: https://capacitorjs.com/docs/android

---

## 🎯 Next Immediate Steps

1. **Create feature graphic** (1024x500) in Canva or Photoshop
2. **Take 2-8 screenshots** of your app using Chrome DevTools
3. **Set up Android build environment** (install Android Studio)
4. **Generate signing keystore** and save securely
5. **Build release AAB** following commands in Phase 3

**Estimated time to complete**: 2-4 hours (first time)

---

**You've got this! 🚀 Let's get Opictuary on the Play Store!**
