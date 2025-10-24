# Google Play Store Submission Guide for Opictuary

## Overview
This guide walks you through publishing Opictuary to the Google Play Store. The app is ready to build and submit!

---

## Prerequisites

### 1. Google Play Developer Account
- **Cost**: $25 one-time registration fee
- **Sign up**: https://play.google.com/console/signup
- **Processing**: Account approval typically takes 24-48 hours

### 2. Required Information
- Developer/Company name
- Contact email
- Privacy policy URL (we'll create this)
- App category: Lifestyle
- Content rating questionnaire responses

---

## Step 1: Build the Release APK/AAB

### Generate Signing Key (First Time Only)

You'll need to generate a keystore file to sign your app. **Keep this file safe** - you'll need it for all future updates!

```bash
# Generate a new keystore (run this in Replit Shell)
keytool -genkey -v -keystore opictuary-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias opictuary-release

# You'll be asked for:
# - Keystore password (SAVE THIS!)
# - Key password (SAVE THIS!)
# - Your name/organization details
```

**IMPORTANT**: Download and save the `opictuary-release-key.jks` file and passwords somewhere secure (password manager, encrypted drive, etc.). If you lose this, you won't be able to update your app!

### Configure Gradle for Signing

Create the file `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=opictuary-release
storeFile=/path/to/opictuary-release-key.jks
```

Update `android/app/build.gradle` to include signing configuration:

```gradle
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
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
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

### Build the Release Bundle

```bash
# Make sure you're in the android directory
cd android

# Build the release AAB (Android App Bundle - required for Play Store)
./gradlew bundleRelease

# The signed AAB will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Alternatively**, build APK for testing:
```bash
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## Step 2: Prepare Store Listing Materials

### App Information
- **App name**: Opictuary
- **Short description** (80 chars max): 
  > "Create dignified digital memorials for loved ones. Share memories, condolences."
  
- **Full description** (4000 chars max):
```
Opictuary is a compassionate digital memorial platform that helps you create, share, and preserve the memories of loved ones who have passed away.

KEY FEATURES:

🕊️ Beautiful Digital Memorials
Create dignified tribute pages with photos, videos, and stories that honor your loved one's legacy.

💐 Share Memories & Condolences
Friends and family can post memories, condolences, and share their favorite moments together.

🎗️ Memorial Fundraising
Set up fundraisers for funeral expenses, charity donations, or memorial funds with integrated Stripe payments.

📱 QR Codes for Tombstones
Generate QR codes for physical memorial sites, allowing visitors to access the digital memorial instantly.

⭐ Celebrity Memorials
Discover and contribute to memorials for public figures, essential workers, and community heroes.

🔒 Privacy Controls
Choose between public memorials or private, invite-only spaces for intimate remembrance.

🎵 Legacy Features
• Schedule future messages to loved ones
• Plan memorial events and gatherings
• Create music playlists of meaningful songs
• Access grief support resources

💜 Dignity in Digital
Built with respect and compassion, Opictuary brings traditional memorial practices into the digital age while maintaining the reverence and dignity that honoring a life deserves.

MULTI-FAITH SUPPORT
Respectful of all faiths and beliefs - Christian, Jewish, Islamic, Buddhist, Hindu, and secular ceremonies.

Download Opictuary today and create a lasting tribute that celebrates the life and legacy of those who matter most.
```

### Screenshots Required
You need 2-8 screenshots. Take these from the app:
- Landing page (hero section)
- Memorial page example
- Memories/condolences section
- Fundraising feature
- QR code feature
- User profile/my memorials

**Sizes**: 
- Phone: 16:9 aspect ratio, min 320px
- Tablet (optional): 16:9 aspect ratio

### Feature Graphic
- **Size**: 1024 x 500 px
- Create a banner with the Opictuary logo and tagline: "Dignity in Digital"

### App Icon
- Already created at: `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`
- **Required size**: 512 x 512 px
- Upload the high-res version to Play Store

---

## Step 3: Privacy Policy

Google Play requires a privacy policy URL. Create one at your published domain:

**URL**: `https://[your-replit-domain].replit.app/privacy`

**Content** (minimum required):
```markdown
# Privacy Policy for Opictuary

Last updated: [Current Date]

## Information We Collect
- User account information (email, name, profile photo via Replit authentication)
- Memorial content (photos, videos, text)
- Payment information (processed securely through Stripe)
- Analytics data (page views, usage patterns)

## How We Use Your Information
- To provide memorial services
- To process donations and payments
- To improve our platform
- To send important notifications about memorials you're connected to

## Data Sharing
- We do not sell your personal information
- Payment data is processed securely by Stripe
- Memorial content visibility is controlled by memorial creators (public/private settings)

## Your Rights
- Access your data
- Delete your account and data
- Control memorial privacy settings

## Contact
Email: [your-email]@[domain].com

## Changes
We may update this policy and will notify users of significant changes.
```

---

## Step 4: Content Rating

Complete the content rating questionnaire in Play Console:
- Select all applicable categories
- Answer honestly about content
- Opictuary likely qualifies for "Everyone" or "Everyone 10+" rating

---

## Step 5: Upload to Play Console

1. **Go to**: https://play.google.com/console
2. **Create new app**
3. **Fill in details**:
   - App name: Opictuary
   - Default language: English (US)
   - App or Game: App
   - Free or Paid: Free (with in-app purchases for donations)
4. **Dashboard > Production**:
   - Create new release
   - Upload the AAB file
   - Fill in release notes
5. **Store listing**:
   - Upload all screenshots
   - Add descriptions
   - Set category: Lifestyle
6. **Content rating**:
   - Complete questionnaire
7. **Privacy policy**:
   - Add URL
8. **Submit for review**

---

## Step 6: Review Process

- **Timeline**: 1-7 days (usually 2-3 days)
- **Possible outcomes**:
  - ✅ Approved: App goes live!
  - ⚠️ Needs changes: Address issues and resubmit
  - ❌ Rejected: Review rejection reasons and fix

---

## Post-Launch

### Updates
To publish updates:
1. Increment `versionCode` and `versionName` in `android/app/build.gradle`
2. Build new AAB
3. Upload to Play Console > Production
4. Submit new release

### Monitoring
- Track downloads and ratings in Play Console
- Respond to user reviews
- Monitor crash reports

---

## Troubleshooting

### Build Fails
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew bundleRelease
```

### Signing Issues
- Verify key.properties paths are correct
- Ensure keystore password is correct
- Check that keystore file exists

### Upload Rejected
- Ensure app is signed
- Check that versionCode is incremented
- Verify AAB file integrity

---

## Support Resources

- **Play Console Help**: https://support.google.com/googleplay/android-developer
- **Capacitor Docs**: https://capacitorjs.com/docs/android
- **Gradle Docs**: https://developer.android.com/studio/build

---

## Checklist

- [ ] Google Play Developer account created ($25 paid)
- [ ] Signing keystore generated and saved securely
- [ ] Release AAB built successfully
- [ ] Screenshots captured (2-8 images)
- [ ] Feature graphic created (1024x500)
- [ ] Privacy policy published
- [ ] Content rating completed
- [ ] Store listing filled out
- [ ] AAB uploaded to Play Console
- [ ] App submitted for review

---

**Good luck with your launch! 🚀**
