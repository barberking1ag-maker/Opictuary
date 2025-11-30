# 🚀 Build Opictuary Android App - Simple Guide

## ✅ **Everything is Ready - Just 3 Steps!**

Your Opictuary app is 100% ready to build. Just follow these simple steps on your computer:

---

## 📥 **Step 1: Download These Files**

Download these folders from Replit (right-click → Download):
- **`android/`** folder (contains your app)
- **`dist/`** folder (contains the web files)

---

## 💻 **Step 2: Install Android Studio** (One-Time, 10 minutes)

1. Go to: https://developer.android.com/studio
2. Click **"Download Android Studio"**
3. Install it (just click "Next" through everything)
4. Open Android Studio

---

## 🔨 **Step 3: Build the AAB File** (2 minutes)

### A. Open the Project:
1. In Android Studio: **File → Open**
2. Select the **`android`** folder you downloaded
3. Wait for it to load (1-2 minutes)

### B. Build:
1. Click **Build → Generate Signed Bundle / APK**
2. Choose **Android App Bundle**
3. Click **Next**

### C. Sign the App:
You'll need to create or use a keystore:

**If you don't have a keystore yet:**
- Click **"Create new..."**
- Fill in:
  - Key store path: Save it somewhere safe (like Documents/opictuary-key.jks)
  - Password: `OpictuarySecure2025!` (or your own password - remember it!)
  - Alias: `opictuary`
  - Validity: 25 years
  - First Name: Your name
  - Organization: Opictuary
- Click **OK**

**If you already have a keystore:**
- Browse to your existing `.jks` or `.keystore` file
- Enter your password and alias

### D. Finish Building:
1. Select **release** build variant
2. Click **Finish**
3. Wait 1-2 minutes

### E. Find Your AAB File:
Android Studio will show you where the file is saved. It's usually at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📤 **Step 4: Upload to Google Play**

1. Go to **Google Play Console**: https://play.google.com/console
2. Click your app (or create new app)
3. Go to **Testing → Internal testing** (in left sidebar)
4. Click **"Create new release"**
5. Upload the **`app-release.aab`** file
6. Add release notes: "Updated with memorial features, AI cards, payments"
7. Click **"Review release"** → **"Start rollout to Internal testing"**

---

## ✅ **That's It!**

Your app is now uploaded to Google Play Console!

---

## 📋 **Your Keystore Info** (Save This!)

**These credentials are already configured in your project:**
- Password: `OpictuarySecure2025!`
- Alias: `opictuary-upload`
- File location: `android/keystores/opictuary-upload.jks`

⚠️ **IMPORTANT:** Keep your keystore file and password safe! You need them for every app update.

---

## 💡 **Need Help?**

If you get stuck at any step, just let me know which step and I'll guide you through it!

---

## 🎯 **Quick Summary**

```
1. Download `android` folder from Replit
2. Install Android Studio (one-time)
3. Open project in Android Studio
4. Build → Generate Signed Bundle
5. Upload to Google Play Console
6. Done! 🎉
```

**Total time: 15-20 minutes** (including Android Studio installation)
