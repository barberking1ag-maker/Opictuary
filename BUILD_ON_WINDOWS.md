# Build Opictuary Android App on Windows

Simple step-by-step guide for building your Android app on Windows. **Total time: 1-2 hours**

---

## ✅ What You Need

- ✅ Windows computer (Windows 10 or 11)
- ✅ Internet connection
- ✅ 10GB free disk space
- ✅ 1-2 hours of time

---

## 📥 STEP 1: Download Android Studio (20-30 minutes)

### 1.1 Download Android Studio

**Link**: https://developer.android.com/studio

1. Click the green **"Download Android Studio"** button
2. Accept the terms and conditions
3. Click **"Download Android Studio for Windows"**
4. Wait for download to complete (~1GB file)

### 1.2 Install Android Studio

1. Find the downloaded file (usually in `Downloads` folder)
   - File name: `android-studio-2024.x.x.xx-windows.exe`
2. Double-click to run the installer
3. Click **"Next"** through the installation wizard
4. Keep all default settings
5. Click **"Install"**
6. Wait 10-15 minutes for installation
7. Click **"Finish"**

### 1.3 Complete Android Studio Setup

1. Android Studio will open
2. Choose **"Standard"** installation
3. Click **"Next"** → **"Finish"**
4. Wait for Android SDK to download (~5GB, takes 10-15 minutes)
5. When complete, you'll see the "Welcome to Android Studio" screen

✅ **Android Studio is now installed!**

---

## 📥 STEP 2: Download Your Replit Project (2-3 minutes)

### 2.1 Download from Replit

1. In your Replit project, click the **three dots menu** (⋮) in the top left
2. Select **"Download as zip"**
3. Save the file to your `Downloads` folder
4. Wait for download to complete

### 2.2 Extract the Project

1. Go to your `Downloads` folder
2. Find the ZIP file (something like `opictuary.zip`)
3. Right-click on the ZIP file
4. Select **"Extract All..."**
5. Click **"Extract"**
6. A new folder will open with your project files

✅ **Your project is now on your computer!**

---

## 🔑 STEP 3: Generate Signing Key (5 minutes)

This key is used to sign your app so Google knows it's from you.

### 3.1 Open Command Prompt

1. Press **Windows Key + R**
2. Type: `cmd`
3. Press **Enter**

### 3.2 Navigate to Your Project

In the Command Prompt, type this (replace `USERNAME` with your Windows username):

```cmd
cd C:\Users\USERNAME\Downloads\opictuary-main\android
```

Press **Enter**

### 3.3 Generate the Keystore

Copy and paste this entire command (all one line):

```cmd
keytool -genkey -v -keystore opictuary-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias opictuary-release
```

Press **Enter**

### 3.4 Answer the Questions

You'll be asked several questions:

**Enter keystore password:**
- Create a password (e.g., `MySecurePassword123`)
- Type it and press Enter
- **⚠️ WRITE THIS DOWN! You'll need it later!**

**Re-enter new password:**
- Type the same password again
- Press Enter

**What is your first and last name?**
- Type your name (e.g., `John Smith`)
- Press Enter

**What is the name of your organizational unit?**
- Type: `Development`
- Press Enter

**What is the name of your organization?**
- Type: `Opictuary`
- Press Enter

**What is the name of your City or Locality?**
- Type your city name
- Press Enter

**What is the name of your State or Province?**
- Type your state
- Press Enter

**What is the two-letter country code for this unit?**
- Type: `US` (or your country code)
- Press Enter

**Is CN=... correct?**
- Type: `yes`
- Press Enter

**Enter key password (RETURN if same as keystore password):**
- Just press **Enter** (uses same password)

✅ **File `opictuary-release-key.jks` created!**

### 3.5 Save Your Password

**⚠️ CRITICAL: Write down your password NOW**

Create a text file called `passwords.txt` and save:
```
Keystore Password: [your password here]
Key Password: [same password]
Keystore File: opictuary-release-key.jks
```

**Save this file somewhere safe!** Without this password, you cannot update your app!

---

## 🔧 STEP 4: Configure Signing (3 minutes)

### 4.1 Create key.properties File

1. In your project folder, navigate to: `android` folder
2. Right-click → **New** → **Text Document**
3. Name it: `key.properties` (remove the `.txt` extension)
4. Right-click the file → **Open with** → **Notepad**
5. Paste this content (replace YOUR_PASSWORD with your actual password):

```properties
storePassword=YOUR_PASSWORD
keyPassword=YOUR_PASSWORD
keyAlias=opictuary-release
storeFile=opictuary-release-key.jks
```

6. Save the file (Ctrl+S)
7. Close Notepad

### 4.2 Update build.gradle

1. Navigate to: `android\app\` folder
2. Open `build.gradle` with Notepad
3. Find the line that says `apply plugin: 'com.android.application'`
4. **Add this code right after that line:**

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

5. Find the `android {` section
6. **Add this code inside the android block (after the defaultConfig section):**

```gradle
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file('../' + keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
```

7. Find `buildTypes {` section
8. **Update the release section to:**

```gradle
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
```

9. Save the file (Ctrl+S)
10. Close Notepad

✅ **Signing is configured!**

---

## 🏗️ STEP 5: Build the Web App (5 minutes)

### 5.1 Open Command Prompt in Project Root

1. Press **Windows Key + R**
2. Type: `cmd`
3. Press **Enter**
4. Navigate to your project (replace USERNAME):

```cmd
cd C:\Users\USERNAME\Downloads\opictuary-main
```

Press Enter

### 5.2 Install Dependencies (if needed)

```cmd
npm install
```

Press Enter and wait 2-3 minutes

### 5.3 Build the Web App

```cmd
npm run build
```

Press Enter and wait 1-2 minutes

✅ **Web app built successfully!**

### 5.4 Sync to Android

```cmd
npx cap sync android
```

Press Enter and wait 30 seconds

✅ **Files synced to Android project!**

---

## 📱 STEP 6: Build the Android App Bundle (10-15 minutes)

### 6.1 Navigate to Android Folder

In Command Prompt:

```cmd
cd android
```

Press Enter

### 6.2 Build the Release Bundle

```cmd
gradlew bundleRelease
```

Press Enter

**This will take 10-15 minutes the first time.** You'll see lots of text scrolling. This is normal!

Wait for it to say: **BUILD SUCCESSFUL**

✅ **Your Android app is built!**

---

## 📦 STEP 7: Find Your App Bundle (1 minute)

Your app bundle (`.aab` file) is located at:

```
C:\Users\USERNAME\Downloads\opictuary-main\android\app\build\outputs\bundle\release\app-release.aab
```

### 7.1 Locate the File

1. Open File Explorer
2. Navigate to your project folder
3. Go to: `android\app\build\outputs\bundle\release\`
4. You'll see: **`app-release.aab`**

### 7.2 Copy to Desktop (Optional)

Right-click `app-release.aab` → **Copy**

Go to Desktop → Right-click → **Paste**

✅ **This is your Android app file!** This is what you upload to Google Play Store!

---

## 🚀 STEP 8: Upload to Play Console (15 minutes)

Now you're ready to submit to Google Play Store!

### 8.1 Login to Play Console

1. Go to: https://play.google.com/console
2. Sign in with your Google account

### 8.2 Upload Your App

Follow the instructions in **`READY_TO_SUBMIT.md`** starting at Step 6.

You'll upload the `app-release.aab` file you just created.

---

## ✅ SUCCESS! What You Accomplished

✅ Installed Android Studio  
✅ Downloaded your project  
✅ Generated signing key  
✅ Configured signing  
✅ Built web app  
✅ Built Android app bundle (.aab)  
✅ Ready to upload to Play Store!

---

## 🆘 Troubleshooting

### Error: "keytool is not recognized"

**Fix**: Java is not in your PATH. 

1. Find where Java is installed (usually `C:\Program Files\Android\Android Studio\jbr\bin\`)
2. Use full path:
```cmd
"C:\Program Files\Android\Android Studio\jbr\bin\keytool" -genkey -v -keystore opictuary-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias opictuary-release
```

### Error: "npm is not recognized"

**Fix**: Install Node.js

1. Go to: https://nodejs.org
2. Download and install Node.js LTS version
3. Restart Command Prompt
4. Try again

### Error: "gradlew is not recognized"

**Fix**: You're in the wrong folder

1. Make sure you're in the `android` folder
2. Run: `cd android`
3. Try again

### Build Failed with Errors

**Fix**: Clean and rebuild

```cmd
gradlew clean
gradlew bundleRelease
```

### Can't Find app-release.aab

**Check this exact path** (replace USERNAME):
```
C:\Users\USERNAME\Downloads\opictuary-main\android\app\build\outputs\bundle\release\app-release.aab
```

If still not there:
1. Check Command Prompt output for errors
2. Make sure BUILD SUCCESSFUL appeared
3. Try building again

---

## 📞 Need More Help?

- Full detailed guide: See `PLAY_STORE_GUIDE.md`
- Copy-paste materials: See `READY_TO_SUBMIT.md`
- Checklist: See `PLAY_STORE_CHECKLIST.md`

---

## 🎉 What's Next?

After you upload your app to Play Console:

1. Google reviews your app (1-7 days)
2. You get approval email
3. Your app goes LIVE on Play Store! 🚀

Your app will be at:
```
https://play.google.com/store/apps/details?id=com.opictuary.app
```

---

**Congratulations! You're ready to publish Opictuary to the Play Store!** 🎊
