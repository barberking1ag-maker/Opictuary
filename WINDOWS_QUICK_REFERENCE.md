# Windows Build Quick Reference

## 🚀 Quick Command List

After you've completed the initial setup (Android Studio, signing key), use these commands to build updates:

### Navigate to Project
```cmd
cd C:\Users\YOUR_USERNAME\Downloads\opictuary-main
```

### Build Commands (Run in Order)
```cmd
npm run build
npx cap sync android
cd android
gradlew bundleRelease
```

### Find Your AAB File
```
android\app\build\outputs\bundle\release\app-release.aab
```

---

## 📋 Complete First-Time Setup

Follow **BUILD_ON_WINDOWS.md** for complete step-by-step instructions.

**Time needed**: 1-2 hours first time

---

## 🔑 Your Signing Key Location

After you create it, keep these safe:

**Keystore file**: `android\opictuary-release-key.jks`  
**Password**: [Write it down in a safe place]  
**Config file**: `android\key.properties`

⚠️ **CRITICAL**: Without these files, you cannot update your app!

---

## ⚡ Future Updates (15 minutes)

When you make changes to your app:

1. Make code changes in Replit
2. Download updated project as ZIP
3. Extract to your computer
4. Run these commands:

```cmd
cd C:\Users\YOUR_USERNAME\Downloads\opictuary-main
npm install
npm run build
npx cap sync android
cd android
gradlew bundleRelease
```

5. Find `app-release.aab` in the same location
6. Upload to Play Console

**Remember**: Increment version number in `android\app\build.gradle`:
- Change `versionCode 1` to `versionCode 2`, then `3`, etc.
- Change `versionName "1.0.0"` to `"1.1.0"`, `"1.2.0"`, etc.

---

## 🆘 Common Errors

### "keytool is not recognized"
**Solution**: Use full path to keytool:
```cmd
"C:\Program Files\Android\Android Studio\jbr\bin\keytool" -genkey -v -keystore opictuary-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias opictuary-release
```

### "npm is not recognized"
**Solution**: Install Node.js from https://nodejs.org

### "gradlew is not recognized"
**Solution**: Make sure you're in the `android` folder:
```cmd
cd android
```

### "BUILD FAILED"
**Solution**: Clean and rebuild:
```cmd
gradlew clean
gradlew bundleRelease
```

---

## 📞 Links

- **Android Studio**: https://developer.android.com/studio
- **Node.js**: https://nodejs.org
- **Play Console**: https://play.google.com/console

---

## ✅ Version Information

**App ID**: `com.opictuary.app`  
**Current Version**: 1.0.0 (versionCode 1)  
**Target SDK**: API 35 (Android 15) ✅ 2025 Ready

---

**For complete instructions, see BUILD_ON_WINDOWS.md**
