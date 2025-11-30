# Android Release Build Guide for Opictuary

## 📱 Overview

This guide provides comprehensive instructions for building and releasing the Opictuary Android app to the Google Play Store.

## 🎯 Quick Start

If you've already set up everything and just want to build:

```bash
./scripts/android-build-quick.sh
```

## 📋 Prerequisites

### 1. System Requirements

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Java JDK** (JDK 11 or 17 recommended)
- **Android Studio** (optional, but recommended for SDK management)

### 2. Android SDK Setup

You need the Android SDK installed. Options:

#### Option A: Using Android Studio (Recommended)
1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → SDK Manager
3. Install:
   - Android SDK Platform 35
   - Android SDK Build-Tools
   - Android SDK Command-line Tools

#### Option B: Command Line Tools Only
1. Download [Android command line tools](https://developer.android.com/studio#command-tools)
2. Set up environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk  # Linux/Mac
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

### 3. Keystore Setup

You need a keystore to sign your app for release:

```bash
./scripts/setup-android-keystore.sh
```

This script will:
- Create a new keystore in `keystores/opictuary-upload.jks`
- Generate `android/key.properties` with your configuration
- Add security files to `.gitignore`

**⚠️ IMPORTANT**: 
- **NEVER** lose your keystore or passwords
- **NEVER** commit these files to Git
- Keep secure backups in multiple locations

## 🚀 Building for Release

### Full Build Process

Run the comprehensive build script:

```bash
./scripts/build-android-release.sh
```

This script will:
1. ✅ Check all prerequisites
2. 🧹 Clean previous builds
3. 🔨 Build frontend with production configuration
4. 🔄 Sync Capacitor with Android
5. 📝 Update version information
6. 📦 Build Android App Bundle (.aab)
7. 📁 Organize outputs with timestamps
8. 📊 Generate build report

### Build Output

After a successful build, you'll find:

```
android-build-output/
└── YYYYMMDD_HHMMSS/
    ├── Opictuary-X.X.X-release.aab  # Upload this to Play Store
    ├── mapping.txt                   # ProGuard mapping (if enabled)
    └── build-info.txt                # Build details and instructions
```

## 📤 Uploading to Google Play Console

### 1. Access Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (or create new if first time)

### 2. Create a New Release

1. Navigate to **Release** → **Production**
2. Click **Create new release**
3. Click **Upload** and select your `.aab` file from `android-build-output/`

### 3. Complete Release Information

Fill in:
- **Release name**: e.g., "Version 1.0.0"
- **Release notes**: What's new in this version
- **Review and rollout**: Review all information

### 4. Submit for Review

1. Review all warnings and errors
2. Click **Start rollout to Production**
3. Google will review your app (usually 2-3 hours for updates, 1-3 days for new apps)

## 🔧 Configuration Details

### Capacitor Configuration

The production build uses `capacitor.config.production.ts`:
- **App ID**: `com.opictuary.app`
- **Production URL**: `https://eternal-tribute-barbering-tag.replit.app`
- **Android Scheme**: `https`

### Version Management

Version information is managed in:
- **package.json**: Version string (e.g., "1.0.0")
- **android/app/build.gradle**: Version code (auto-generated)

Version code is automatically generated using timestamp to ensure it's always increasing.

## 🐛 Troubleshooting

### Common Issues

#### 1. "key.properties not found"
**Solution**: Run `./scripts/setup-android-keystore.sh` to create keystore and configuration

#### 2. "Keystore file not found"
**Solution**: Ensure keystore exists at `keystores/opictuary-upload.jks`

#### 3. "ANDROID_HOME not set"
**Solution**: Set Android SDK path:
```bash
export ANDROID_HOME=/path/to/android/sdk
```

#### 4. "Gradle build failed"
**Solutions**:
- Clear Gradle cache: `cd android && ./gradlew clean`
- Update Gradle: `cd android && ./gradlew wrapper --gradle-version=8.7`
- Check Java version: `java -version` (should be 11 or 17)

#### 5. "Build tools not found"
**Solution**: Install required SDK components via Android Studio SDK Manager

### Build Failures

If the build fails, check:
1. **Logs**: Read the full error message
2. **Dependencies**: Run `npm install`
3. **Capacitor sync**: Run `npx cap sync android`
4. **Clean build**: Delete `node_modules`, `dist`, and Android build folders

## 📊 Build Verification

### Local Testing

Before uploading to Play Store:

1. **Install on device via USB**:
   ```bash
   cd android
   ./gradlew installRelease
   ```

2. **Extract APK from AAB** (requires bundletool):
   ```bash
   java -jar bundletool.jar build-apks \
     --bundle=path/to/app.aab \
     --output=app.apks \
     --mode=universal
   ```

### Play Console Testing Tracks

Use testing tracks before production:
1. **Internal testing**: For team members (instant)
2. **Closed testing**: For beta testers (instant)
3. **Open testing**: Public beta (review required)

## 🔒 Security Best Practices

1. **Keystore Security**:
   - Store in secure location (not in project directory for production)
   - Use strong passwords (minimum 16 characters)
   - Keep encrypted backups
   - Never share or commit to version control

2. **API Keys**:
   - Use environment variables
   - Different keys for debug/release
   - Restrict key usage in Google Cloud Console

3. **Code Signing**:
   - Enable Google Play App Signing
   - Keep upload certificate separate from app signing certificate

## 📝 Checklist Before Release

- [ ] Version number updated in `package.json`
- [ ] All features tested on physical devices
- [ ] Keystore and passwords securely backed up
- [ ] Release notes prepared
- [ ] Screenshots updated if UI changed
- [ ] App description updated if features added
- [ ] Privacy policy and terms of service current
- [ ] All required permissions justified
- [ ] ProGuard rules configured (if using)
- [ ] No debug code or logs in production

## 🚨 Emergency Procedures

### Lost Keystore

If you lose your keystore:
1. You **cannot** update the existing app
2. Contact Google Play support immediately
3. May need to publish as new app with new package name

### Rollback a Release

1. Go to Release → Production
2. Click on the problematic release
3. Select "Halt rollout" or "Resume previous version"

## 📚 Additional Resources

- [Android Developers Documentation](https://developer.android.com/distribute/console)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Bundle Format](https://developer.android.com/guide/app-bundle)

## 💡 Tips for Success

1. **Test thoroughly**: Use internal testing track first
2. **Monitor metrics**: Check crash rates and ANRs after release
3. **Respond to reviews**: Engage with user feedback
4. **Plan updates**: Regular updates improve ranking
5. **Optimize size**: Use App Bundle to reduce download size
6. **Follow guidelines**: Ensure compliance with Play Store policies

---

**Need help?** Check the troubleshooting section or consult the Android developer documentation.