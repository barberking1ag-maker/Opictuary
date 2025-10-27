# Google Play Store Submission Guide for Opictuary

## Overview
This comprehensive guide walks you through publishing Opictuary to the Google Play Store with 2025 requirements. Your app is production-ready and configured with Capacitor for Android deployment.

---

## Quick Start Checklist

- [x] Google Play Developer account created ($25 paid)
- [ ] App store materials prepared (descriptions, screenshots, graphics)
- [ ] Android build environment set up
- [ ] Release AAB built and signed
- [ ] Privacy policy published and accessible
- [ ] Content rating completed
- [ ] App submitted for review

---

## Part 1: App Store Materials & Descriptions

### 1.1 App Name
**Opictuary** (30 character limit: ✅ 9 characters)

### 1.2 Short Description (80 characters max)
**Option 1** (79 chars):
```
Create beautiful digital memorials. Share memories, honor loved ones forever.
```

**Option 2** (80 chars):
```
Digital memorial platform to honor and remember loved ones with dignity & love.
```

**Option 3** (77 chars):
```
Honor loved ones with digital memorials, fundraisers, and legacy features.
```

### 1.3 Full Description (4000 characters max)

```
Opictuary is a compassionate digital memorial platform that helps you create, share, and preserve the memories of loved ones who have passed away. Built with dignity and respect, Opictuary brings traditional memorial practices into the digital age.

✨ BEAUTIFUL DIGITAL MEMORIALS
Create stunning tribute pages with photos, videos, and stories that honor your loved one's legacy. Each memorial becomes a timeless space where family and friends can gather, share, and remember together.

💬 MEMORIES & CONDOLENCES
Friends and family can post heartfelt memories, share condolences, and celebrate the moments that made your loved one special. Every story adds to their lasting legacy.

💰 MEMORIAL FUNDRAISING
Set up fundraisers for funeral expenses, charity donations, or memorial funds with secure Stripe payment processing. Track donations with transparency and manage expenses with detailed breakdowns.

📱 QR CODES FOR MEMORIAL SITES
Generate QR codes for tombstones, memorial plaques, or physical memorial locations. Visitors can scan the code to instantly access the full digital memorial, bridging the physical and digital worlds.

⭐ CELEBRITY & ESSENTIAL WORKER MEMORIALS
Discover and contribute to public memorials for celebrities, frontline healthcare workers, military personnel, and community heroes who made a difference.

🔒 PRIVACY & SECURITY
Choose between public memorials accessible to everyone or private, invite-only spaces for intimate family remembrance. You control who can view and contribute to each memorial.

📅 MEMORIAL EVENTS
Plan and coordinate memorial events like balloon releases, candlelight vigils, picnics, and anniversary gatherings. Send invitations and track RSVPs all in one place.

💌 LEGACY FEATURES
• Schedule future messages to be delivered to loved ones on special dates
• Create music playlists of meaningful songs
• Plan legacy events and gatherings
• Access grief support resources and communities

🌸 FLOWER DELIVERY PARTNERSHIPS
Send sympathy flowers directly from the memorial page through our local florist partners.

🕊️ MULTI-FAITH SUPPORT
Respectful of all faiths and beliefs - Christian, Jewish, Islamic, Buddhist, Hindu, non-religious, and secular ceremonies. Each memorial can be customized to honor individual traditions.

💜 DIGNITY IN DIGITAL
Every feature is designed with compassion and respect. From our elegant purple and gold design to our carefully crafted user experience, Opictuary ensures that honoring a life is treated with the reverence it deserves.

🌍 PRESERVE MEMORIES FOREVER
Digital memorials never fade. Photos don't yellow, videos don't deteriorate, and stories are preserved for future generations to discover and cherish.

WHO USES OPICTUARY?
• Families creating lasting tributes for loved ones
• Funeral homes offering digital memorial services
• Communities honoring essential workers and heroes
• Individuals planning their own legacy and final messages
• Memorial parks and cemeteries providing QR code access

FEATURES AT A GLANCE:
✓ Unlimited photo and video uploads
✓ Secure fundraising with expense tracking
✓ QR code generation for physical memorials
✓ Memorial event planning and RSVPs
✓ Scheduled future messages
✓ Music playlists and legacy planning
✓ Grief support resources
✓ Privacy controls (public or invite-only)
✓ Mobile-optimized for all devices
✓ Beautiful, respectful design
✓ Multi-faith customization

Download Opictuary today and create a lasting digital tribute that celebrates the life, love, and legacy of those who matter most.

With love and remembrance,
The Opictuary Team
```

**Character count**: 3,047 / 4,000 ✅

### 1.4 App Category
**Primary**: Lifestyle  
**Secondary**: Social

### 1.5 Tags/Keywords (for ASO - App Store Optimization)
```
digital memorial, obituary, tribute, memorial fundraiser, grief support, 
condolences, in memoriam, legacy planning, funeral, remembrance, memorial page, 
tribute page, online memorial, virtual memorial, memorial website
```

---

## Part 2: Graphics Requirements

### 2.1 App Icon
- **Size**: 512 x 512 px
- **Format**: 32-bit PNG with alpha channel
- **Max file size**: 1024 KB
- **Your icon**: Use the angel halo logo from `/client/public/icon-512.png`
- **Status**: ✅ Already created

### 2.2 Feature Graphic (Required)
- **Size**: 1024 x 500 px
- **Format**: JPEG or PNG
- **Purpose**: Displayed in Play Store promotional sections
- **Design suggestion**:
  - Rich purple background (#1a0f29)
  - Angel halo logo centered or left-aligned
  - Text: "Opictuary - Dignity in Digital"
  - Gold accent text (#D4AF37)

### 2.3 Screenshots (Required: 2-8 images)
**Phone Screenshots**:
- **Minimum**: 2 screenshots
- **Maximum**: 8 screenshots
- **Dimensions**: 
  - Min: 320px on shortest side
  - Max: 3840px on longest side
  - Aspect ratio: Max 2:1
- **Format**: JPEG or PNG (no alpha)

**Recommended Screenshots to Capture**:
1. **Home page** - Show the landing hero section
2. **Memorial page** - Beautiful memorial with photos
3. **Memories section** - Condolences and shared memories
4. **Fundraiser** - Fundraising progress and donation feature
5. **QR Code feature** - Generate QR codes for memorials
6. **Legacy features** - Scheduled messages or event planning
7. **User profile** - My memorials dashboard
8. **Mobile-optimized view** - Show responsive design

**How to capture screenshots**:
1. Open your published app on a mobile device or browser
2. Use Chrome DevTools device emulator (F12 → Toggle Device Toolbar)
3. Set to iPhone 12 Pro (390 x 844) or similar
4. Take screenshots of key features
5. Optionally add text overlays: "Create Beautiful Memorials", "Honor Their Legacy", etc.

### 2.4 Tablet Screenshots (Optional but Recommended)
- Same requirements as phone screenshots
- Shows your app works great on tablets too
- Aspect ratio: 16:9 or similar

### 2.5 Promo Video (Optional)
- **Platform**: YouTube
- **Length**: 30-120 seconds
- **Content**: Quick walkthrough of creating a memorial and key features

---

## Part 3: Build Process for Android

### 3.1 Prerequisites

**System Requirements**:
- Node.js 18+ (already installed on Replit)
- Java Development Kit (JDK) 17+ 
- Android SDK (can be installed via Android Studio)
- Gradle (included with Android project)

**Important**: Since you're on Replit, you may need to download the project and build locally on your computer with Android Studio, OR use GitHub Actions for automated builds.

### 3.2 Update Version Numbers

Before building, update version in `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.opictuary.app"
        minSdkVersion 22
        targetSdkVersion 35  // ⚠️ REQUIRED: API Level 35 for 2025
        versionCode 1        // Increment for each release: 1, 2, 3...
        versionName "1.0.0"  // User-facing version: 1.0.0, 1.1.0, 2.0.0...
    }
}
```

**2025 Requirement**: Target SDK must be API Level 35 (Android 15) or higher

### 3.3 Sync Capacitor and Build Web Assets

```bash
# Build the production web app
npm run build

# Sync web assets to Android project
npx cap sync android

# Copy any updates to native Android project
npx cap copy android
```

### 3.4 Generate Signing Key (First Time Only)

**⚠️ CRITICAL**: You need this keystore file to sign your app. **Keep it safe forever** - without it, you cannot update your app!

```bash
# Generate release keystore
keytool -genkey -v -keystore opictuary-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias opictuary-release

# You'll be prompted for:
# - Keystore password (create a strong password)
# - Key password (can be same as keystore password)
# - Your name/organization details
```

**Save these securely**:
1. Download `opictuary-release-key.jks` file
2. Save passwords in password manager
3. Keep backup in secure cloud storage (encrypted)

### 3.5 Configure Signing

Create `android/key.properties` file:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=opictuary-release
storeFile=../opictuary-release-key.jks
```

**⚠️ Important**: 
- Do NOT commit this file to git
- Add to `.gitignore`: `android/key.properties`
- Keep this file secure and private

Update `android/app/build.gradle` to load signing config:

```gradle
// Add at the top, before android block
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true  // Enable code shrinking
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3.6 Build the Android App Bundle (AAB)

**Option A: Using Gradle (recommended)**

```bash
# Navigate to android directory
cd android

# Clean previous builds
./gradlew clean

# Build release AAB (Android App Bundle)
./gradlew bundleRelease

# Output location:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Option B: Using Android Studio**

1. Open Android Studio
2. File → Open → Select `android` folder
3. Build → Generate Signed Bundle / APK
4. Select "Android App Bundle"
5. Choose your keystore file and enter passwords
6. Select "release" build variant
7. Click "Finish"

**Result**: You'll get `app-release.aab` file (this is what you upload to Play Store)

### 3.7 Test the Release Build (Optional but Recommended)

```bash
# Build APK for testing on device
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk

# Install on connected Android device
adb install app-release.apk
```

---

## Part 4: Privacy Policy

### 4.1 Privacy Policy URL

**Your Privacy Policy**: Already created at `/privacy` route

**Published URL**: `https://[your-domain].replit.app/privacy`

**Status**: ✅ Already implemented

### 4.2 Verify Privacy Policy Content

Your privacy policy must include:
- ✅ What data you collect (user info, memorial content, payment data)
- ✅ How you use the data (provide services, process payments)
- ✅ Third-party services (Stripe for payments)
- ✅ User rights (access, delete, privacy controls)
- ✅ Contact information
- ✅ Policy updates

**Action**: Review your `/privacy` page and ensure all sections are complete and accurate.

---

## Part 5: Play Console Setup & Submission

### 5.1 Access Play Console

1. Go to https://play.google.com/console
2. Sign in with your Google account (the one you used for $25 payment)
3. You should see your developer account dashboard

### 5.2 Create New App

1. Click **"Create app"**
2. Fill in details:

**App details**:
- **App name**: Opictuary
- **Default language**: English (United States)
- **App or game**: App
- **Free or paid**: Free
  - ⚠️ **Important**: Cannot change from free to paid later
  - You can have in-app purchases (donations) with free app

3. **Declarations**:
   - [x] I confirm this app complies with Google Play's Developer Program Policies
   - [x] I confirm this app complies with US export laws

4. Click **"Create app"**

### 5.3 Complete Dashboard Tasks

You'll see a dashboard with required tasks. Complete each section:

#### A) App Access
- Navigate to: **Set up your app** → **App access**
- Question: *"Do users need special access to use your app?"*
- Answer: **No** (unless you have restricted features)
- Click **Save**

#### B) Ads
- Navigate to: **Set up your app** → **Ads**
- Question: *"Does your app contain ads?"*
- Answer: **Yes** (you have advertising opportunities feature)
- Click **Save**

#### C) Content Rating
1. Navigate to: **Set up your app** → **Content rating**
2. Click **Start questionnaire**
3. Enter your email address
4. Select category: **All other app types**
5. Answer questionnaire honestly:
   - Violence: No
   - Sexual content: No
   - Language: No
   - Controlled substances: No
   - Gambling: No
   - User interaction: **Yes** (users can share content)
   - Shares location: No
   - Personal info requests: **Yes** (emails for memorials)
6. Review and submit
7. Expected rating: **Everyone** or **Everyone 10+**

#### D) Target Audience
- Navigate to: **Set up your app** → **Target audience**
- Select age groups: **18+** (memorial content may be sensitive)
- Click **Save**

#### E) News App
- Navigate to: **Set up your app** → **News app**
- Answer: **No** (not a news app)
- Click **Save**

#### F) COVID-19 Contact Tracing and Status Apps
- Navigate to: **Set up your app** → **COVID-19 apps**
- Answer: **No**
- Click **Save**

#### G) Data Safety
1. Navigate to: **Set up your app** → **Data safety**
2. Click **Start**
3. Answer questions:

**Does your app collect or share user data?**
- Answer: **Yes**

**Data collected**:
- Personal info:
  - [x] Name
  - [x] Email address
  - [x] User IDs
- Photos and videos:
  - [x] Photos (user uploaded)
  - [x] Videos (user uploaded)
- App activity:
  - [x] App interactions (page views, analytics)

**Is data encrypted in transit?**
- Answer: **Yes**

**Can users request data deletion?**
- Answer: **Yes** (you should implement this feature if not already available)

4. Click **Save and publish**

#### H) Government Apps
- Navigate to: **Set up your app** → **Government apps**
- Answer: **No**
- Click **Save**

#### I) Financial Features
- Navigate to: **Set up your app** → **Financial features**
- Answer: **No** (you use Stripe for payments, not providing financial services)
- Click **Save**

### 5.4 Store Listing

Navigate to: **Grow** → **Main store listing**

**App details**:
- **App name**: Opictuary (pre-filled)
- **Short description**: (paste from section 1.2)
- **Full description**: (paste from section 1.3)

**Graphics**:
1. **App icon**: Upload 512x512 PNG
2. **Feature graphic**: Upload 1024x500 PNG/JPEG
3. **Phone screenshots**: Upload 2-8 images
4. **Tablet screenshots**: (optional) Upload if you have them

**Categorization**:
- **App category**: Lifestyle
- **Tags**: memorial, tribute, grief support (select from available tags)

**Contact details**:
- **Email**: your-email@domain.com
- **Phone**: (optional) your phone number
- **Website**: https://[your-domain].replit.app

**External marketing** (optional):
- **Privacy policy**: https://[your-domain].replit.app/privacy (REQUIRED)

Click **Save**

### 5.5 Store Settings

Navigate to: **Grow** → **Store settings**

**App details**:
- **App name**: Opictuary
- **Default language**: English (United States)

**Contact details**:
- Verify email and website

Click **Save**

### 5.6 Upload Release Bundle

1. Navigate to: **Release** → **Production**
2. Click **Create new release**

**App integrity**:
- **Play App Signing**: 
  - Choose **"Let Google manage and protect your app signing key (recommended)"**
  - This is required for new apps

**App bundles**:
3. Click **Upload** button
4. Select your `app-release.aab` file
5. Wait for upload and processing

**Release details**:
6. **Release name**: Version 1.0.0 (auto-filled from your versionName)
7. **Release notes** (What's new):

```
Welcome to Opictuary - Digital Memorial Platform

Initial release features:
• Create beautiful digital memorials for loved ones
• Share memories, photos, and videos
• Memorial fundraising with secure Stripe payments
• Generate QR codes for physical memorial sites
• Plan memorial events and gatherings
• Schedule future messages to loved ones
• Access grief support resources
• Multi-faith memorial customization
• Privacy controls (public or invite-only memorials)

Thank you for choosing Opictuary to honor and remember those who matter most.
```

8. Click **Save**

### 5.7 Countries and Regions

1. Navigate to: **Release** → **Production** → **Countries / regions**
2. Click **Add countries / regions**
3. Select:
   - **Option A**: All countries (240+ countries)
   - **Option B**: Specific countries (US, Canada, UK, etc.)
4. Click **Save**

### 5.8 Pricing

1. Navigate to: **Monetize** → **App pricing**
2. Select: **Free**
3. Click **Save**

Note: You can still have in-app purchases and accept donations as a free app

### 5.9 In-app Products (Optional - for donations)

If you want to offer donation tiers as in-app products:

1. Navigate to: **Monetize** → **In-app products**
2. Create products for donation amounts
3. This is optional - you can also accept donations through Stripe on your website

### 5.10 Review and Rollout

1. Go back to **Dashboard**
2. Check that all tasks are complete (green checkmarks)
3. Navigate to: **Release** → **Production**
4. Click **Review release**
5. Review all details carefully
6. Click **Start rollout to production**
7. Confirm rollout

---

## Part 6: Review Process

### 6.1 Timeline
- **First submission**: 1-7 days (typically 2-4 days)
- **Updates**: Few hours to 2 days
- **Average**: 3 days

### 6.2 What Happens During Review

Google's automated and human reviewers will:
1. Check for policy violations
2. Test basic functionality
3. Verify content rating accuracy
4. Check for malware/unsafe code
5. Verify privacy policy compliance

### 6.3 Possible Outcomes

**✅ Approved**:
- You'll receive email notification
- App status changes to "Published"
- App appears on Play Store within few hours
- Celebrate! 🎉

**⚠️ Needs Changes**:
- Google sends email with specific issues
- Make required changes
- Resubmit for review

**❌ Rejected**:
- Email explains policy violations
- Fix all issues mentioned
- Update app bundle if needed
- Resubmit with explanation of fixes

### 6.4 After Approval

**Your app will be live at**:
```
https://play.google.com/store/apps/details?id=com.opictuary.app
```

**Track performance**:
- Downloads and installs
- User ratings and reviews
- Crash reports and ANRs (App Not Responding)
- User acquisition metrics

---

## Part 7: Post-Launch Updates

### 7.1 Update Process

1. **Make changes** to your app
2. **Increment version** in `android/app/build.gradle`:
```gradle
versionCode 2        // Was 1, now 2
versionName "1.1.0"  // Was "1.0.0", now "1.1.0"
```

3. **Build new AAB**:
```bash
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

4. **Upload to Play Console**:
   - Navigate to: **Release** → **Production** → **Create new release**
   - Upload new AAB
   - Add release notes describing changes
   - Submit for review

5. **Review and rollout** (usually faster than initial submission)

### 7.2 Responding to Reviews

- Navigate to: **Grow** → **Ratings and reviews**
- Respond to user feedback professionally
- Address bug reports and feature requests
- Thank users for positive reviews

### 7.3 Monitoring Crashes

- Navigate to: **Release** → **App vitals** → **Crashes & ANRs**
- Monitor crash-free rate
- Fix critical crashes promptly
- Release updates to improve stability

---

## Part 8: Marketing & ASO (App Store Optimization)

### 8.1 Optimize Store Listing

**Keywords to include naturally in description**:
- Primary: memorial, obituary, tribute, digital memorial
- Secondary: grief support, condolences, funeral, remembrance
- Long-tail: online memorial, virtual memorial, memorial fundraiser

### 8.2 Encourage Reviews

- Ask satisfied users to rate and review
- Respond to all reviews professionally
- Maintain 4.0+ star rating for better rankings

### 8.3 Promote Your App

**On your website**:
- Add Google Play badge to your website
- Link: https://play.google.com/intl/en_us/badges/

**Social media**:
- Share launch announcement
- Create demo videos
- Showcase user testimonials (with permission)

**Funeral home partnerships**:
- Provide them with Play Store link
- Create co-branded marketing materials

---

## Part 9: Troubleshooting

### Build Issues

**Error: Build failed**
```bash
cd android
./gradlew clean
./gradlew bundleRelease --stacktrace
```

**Error: Signing key not found**
- Verify `key.properties` paths are correct
- Check keystore file exists at specified location
- Verify passwords are correct (no extra spaces)

**Error: Target SDK version**
- Update `targetSdkVersion` to 35 in `build.gradle`
- Sync and rebuild

### Upload Issues

**Error: Upload failed - key validation**
- Ensure app is signed with keystore
- Check signing configuration in build.gradle
- Verify AAB file is not corrupted

**Error: Version code conflict**
- Increment `versionCode` to be higher than previous
- Cannot reuse version codes

**Error: Package name conflict**
- Verify `applicationId` is unique: `com.opictuary.app`
- Check no other app uses this ID

### Review Rejections

**Common reasons**:
- Privacy policy missing or incomplete
- Content rating inaccurate
- Permissions not explained
- Crashes on startup
- Violates developer policies

**Fix and resubmit**:
1. Read rejection email carefully
2. Fix ALL issues mentioned
3. Test thoroughly
4. Resubmit with explanation

---

## Part 10: Complete Checklist

### Pre-Build
- [x] Google Play Developer account created ($25 paid)
- [ ] Version numbers updated in build.gradle
- [ ] Target SDK set to API Level 35
- [ ] Web app built (`npm run build`)
- [ ] Capacitor synced (`npx cap sync android`)

### Signing & Building
- [ ] Release keystore generated and saved securely
- [ ] Passwords saved in password manager
- [ ] key.properties file created
- [ ] Signing config added to build.gradle
- [ ] Release AAB built successfully
- [ ] AAB file tested (optional but recommended)

### Store Materials
- [ ] App icon (512x512) prepared
- [ ] Feature graphic (1024x500) created
- [ ] 2-8 phone screenshots captured
- [ ] Tablet screenshots captured (optional)
- [ ] Short description written (80 chars)
- [ ] Full description written (4000 chars)
- [ ] Release notes written
- [ ] Promo video created (optional)

### Privacy & Compliance
- [ ] Privacy policy published and accessible
- [ ] Privacy policy URL verified
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed
- [ ] All required declarations accepted

### Play Console
- [ ] App created in Play Console
- [ ] App access settings configured
- [ ] Ads declaration completed
- [ ] Target audience set (18+)
- [ ] Store listing completed with all graphics
- [ ] Contact details added
- [ ] Category selected (Lifestyle)
- [ ] Countries/regions selected
- [ ] Pricing set (Free)

### Upload & Release
- [ ] Play App Signing enabled
- [ ] AAB file uploaded
- [ ] Release notes added
- [ ] All dashboard tasks completed
- [ ] Release reviewed
- [ ] App submitted for review

### Post-Submission
- [ ] Confirmation email received
- [ ] App approved (wait 1-7 days)
- [ ] App live on Play Store
- [ ] Play Store link shared with users
- [ ] Monitoring reviews and ratings
- [ ] Tracking crashes and performance

---

## Part 11: Important Reminders

### DO:
✅ Keep your signing keystore file backed up in multiple secure locations  
✅ Save all passwords in a password manager  
✅ Test your release build before uploading  
✅ Read rejection emails carefully and fix ALL issues  
✅ Respond to user reviews professionally  
✅ Monitor crash reports and fix critical issues  
✅ Update regularly with new features and bug fixes  
✅ Increment version code for every release  

### DON'T:
❌ Commit key.properties or keystore files to git  
❌ Share your signing keys with anyone  
❌ Reuse version codes  
❌ Change from free to paid after launch  
❌ Misrepresent content in rating questionnaire  
❌ Ignore user reviews and crash reports  
❌ Upload APK files (use AAB format)  
❌ Skip testing your release build  

---

## Part 12: Support Resources

**Official Documentation**:
- Play Console: https://play.google.com/console
- Developer Policies: https://play.google.com/about/developer-content-policy/
- Target API Requirements: https://developer.android.com/google/play/requirements/target-sdk
- App Bundle Guide: https://developer.android.com/guide/app-bundle

**Capacitor Documentation**:
- Android Guide: https://capacitorjs.com/docs/android
- Publishing: https://capacitorjs.com/docs/android/deploying-to-google-play

**Community Support**:
- Stack Overflow: Tag `android` or `google-play`
- Capacitor Community: https://ionic.io/community

**Direct Support**:
- Play Console Help: https://support.google.com/googleplay/android-developer
- Contact Google Play Support (from Play Console)

---

## Part 13: Quick Reference

### Key Files
- App bundle: `android/app/build/outputs/bundle/release/app-release.aab`
- Build config: `android/app/build.gradle`
- Signing config: `android/key.properties`
- Keystore: `opictuary-release-key.jks`

### Key Commands
```bash
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Build release AAB
cd android && ./gradlew bundleRelease

# Build test APK
cd android && ./gradlew assembleRelease
```

### Version Updates
```gradle
// android/app/build.gradle
defaultConfig {
    versionCode 1        // Increment: 1, 2, 3, 4...
    versionName "1.0.0"  // Semantic: 1.0.0, 1.1.0, 2.0.0...
}
```

### Application ID
```
com.opictuary.app
```

### Play Store URL (after approval)
```
https://play.google.com/store/apps/details?id=com.opictuary.app
```

---

## Congratulations! 🎉

You're now ready to publish Opictuary to the Google Play Store. This guide covers everything from building your first release to managing updates and growing your user base.

**Questions or issues?** Refer to the troubleshooting section or official documentation linked above.

**Good luck with your launch!** 🚀

---

*Last updated: October 27, 2025*
