# BUILD ANDROID AAB - GITHUB ACTIONS INSTRUCTIONS
**Date:** November 21, 2025  
**Version:** 2.0.0  
**Build System:** GitHub Actions

---

## 🚀 QUICK START - BUILD YOUR AAB NOW

Since the Android SDK is not available in the Replit environment, use GitHub Actions to build your signed Android App Bundle.

---

## ✅ WHAT'S ALREADY DONE

1. **Version Updated:** 
   - Version Name: `2.0.0` ✅
   - Version Code: `2025112100` ✅
   - File: `android/app/build.gradle`

2. **Production Build Created:**
   - Frontend built with `npm run build` ✅
   - Assets ready in `dist/public/` ✅

3. **Capacitor Synced:**
   - Web assets copied to Android project ✅
   - Plugins updated ✅

4. **Release Notes Created:**
   - Comprehensive documentation in `RELEASE_NOTES_v2.0.0.md` ✅
   - 60+ features documented ✅

---

## 📦 STEPS TO GET YOUR AAB FILE

### Option 1: Automatic Build (Push to GitHub)

1. **Commit and Push Your Changes:**
   ```bash
   git add -A
   git commit -m "Release v2.0.0 - Major update with 60+ features"
   git push origin main
   ```

2. **GitHub Actions will Automatically:**
   - ✅ Set up Android SDK
   - ✅ Install dependencies
   - ✅ Build production frontend
   - ✅ Sync Capacitor
   - ✅ Generate signed AAB
   - ✅ Upload as artifact

3. **Download Your AAB (5-10 minutes after push):**
   - Go to: https://github.com/[your-username]/[your-repo]/actions
   - Click on the latest workflow run
   - Scroll to "Artifacts" section
   - Download `app-release-bundle`
   - Extract ZIP to get `app-release.aab`

### Option 2: Manual Trigger (Without Push)

1. **Go to GitHub Actions:**
   - Navigate to: https://github.com/[your-username]/[your-repo]/actions
   - Select "Build Android App Bundle" workflow
   - Click "Run workflow" button
   - Select branch: `main`
   - Click "Run workflow"

2. **Wait for Build (~5-10 minutes)**

3. **Download AAB:**
   - Same as step 3 above

---

## 🔐 GITHUB SECRETS REQUIRED

Make sure these secrets are configured in your GitHub repository:

1. **Navigate to:** Settings → Secrets and variables → Actions

2. **Required Secrets:**
   ```
   KEYSTORE_BASE64      - Your keystore file encoded in base64
   KEYSTORE_PASSWORD    - Password for the keystore
   KEY_ALIAS           - Alias for the signing key
   KEY_PASSWORD        - Password for the key
   ```

3. **How to Create KEYSTORE_BASE64:**
   ```bash
   # If you have the keystore file locally:
   base64 android/keystores/opictuary-upload.jks | tr -d '\n'
   # Copy the output and paste as KEYSTORE_BASE64 secret
   ```

---

## 📱 GOOGLE PLAY CONSOLE UPLOAD

Once you have the AAB file:

### 1. Access Play Console
- Go to: https://play.google.com/console
- Select your Opictuary app

### 2. Create Internal Test Release
- Navigate to: Release → Testing → Internal testing
- Click "Create new release"

### 3. Upload AAB
- Click "Upload" 
- Select your `app-release.aab` file
- Wait for processing

### 4. Add Release Notes
- Copy content from `RELEASE_NOTES_v2.0.0.md`
- Paste in the release notes field
- Format as needed

### 5. Configure Release
- **Version name:** 2.0.0
- **Version code:** 2025112100 (auto-detected)
- **Release name:** Version 2.0.0 - Major Update

### 6. Review and Roll Out
- Review all information
- Click "Save"
- Click "Review release"
- Click "Start rollout to Internal testing"

---

## 🧪 TESTING THE AAB

### Before Upload - Local Testing
```bash
# Install bundletool (if not installed)
wget https://github.com/google/bundletool/releases/latest/download/bundletool-all.jar

# Generate APKs from AAB
java -jar bundletool-all.jar build-apks \
  --bundle=app-release.aab \
  --output=app-release.apks \
  --mode=universal

# Extract and install on device
unzip app-release.apks
adb install universal.apk
```

### After Upload - Internal Testing
1. Add testers in Play Console
2. Share testing link with testers
3. Testers join via link
4. Download and test from Play Store

---

## ✅ VERIFICATION CHECKLIST

### Build Verification
- [ ] AAB file size is reasonable (20-50 MB)
- [ ] Version code: 2025112100
- [ ] Version name: 2.0.0
- [ ] Package name: com.opictuary.memorial

### Features to Test
- [ ] Memorial creation and editing
- [ ] Photo/video upload
- [ ] QR code generation
- [ ] Event planner functionality
- [ ] Sports memorial creation
- [ ] Future messages scheduling
- [ ] User authentication
- [ ] Payment flow (test mode)

### Play Console Verification
- [ ] AAB uploads without errors
- [ ] Version detected correctly
- [ ] No signing issues
- [ ] Release notes formatted properly

---

## 🆘 TROUBLESHOOTING

### GitHub Actions Build Failed
- **Check:** Workflow logs for specific error
- **Common issues:**
  - Missing secrets → Add in GitHub settings
  - npm install failed → Clear cache and retry
  - Gradle error → Check build.gradle syntax

### AAB Not Downloading
- **Check:** Workflow completed successfully
- **Solution:** Artifacts expire after 30 days, rebuild if needed

### Play Console Upload Error
- **Version code conflict:** Increment version code
- **Signing mismatch:** Use same keystore as previous releases
- **Package name wrong:** Must be com.opictuary.memorial

### App Crashes on Install
- **Clear app data:** Uninstall old version first
- **Check logs:** `adb logcat` for crash details
- **Compatibility:** Ensure device meets minSdkVersion

---

## 📊 BUILD INFORMATION

### Current Build Details
```
App ID:         com.opictuary.memorial
App Name:       Opictuary
Version Name:   2.0.0
Version Code:   2025112100
Min SDK:        21 (Android 5.0)
Target SDK:     34 (Android 14)
Build Type:     Release (Signed)
```

### Included Features
- ✅ 60+ new features
- ✅ All Capacitor plugins
- ✅ Production optimizations
- ✅ Signed for Play Store

---

## 📞 SUPPORT

If you encounter issues:
1. Check GitHub Actions logs
2. Review this documentation
3. Check `ANDROID_BUILD_GUIDE.md`
4. Review `GOOGLE_PLAY_DEPLOYMENT_GUIDE.md`

---

## 🎉 SUCCESS INDICATORS

You'll know the build is successful when:
1. ✅ GitHub Actions shows green checkmark
2. ✅ AAB file downloads successfully
3. ✅ File size is ~20-50 MB
4. ✅ Play Console accepts the upload
5. ✅ Version shows as 2.0.0 in Play Console

---

**Ready to build!** Follow the steps above to get your AAB file and upload to Google Play Console.

---

*Last Updated: November 21, 2025*