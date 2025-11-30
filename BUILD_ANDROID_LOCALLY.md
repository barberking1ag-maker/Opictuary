# BUILD ANDROID APP LOCALLY
**Building Opictuary APK/AAB on Your Computer**

---

## 🤔 WHY BUILD LOCALLY?

Replit doesn't have Java/Android SDK installed, so we can't build the Android app directly here. But don't worry - it's easy to build on your own computer!

**Time required:** 30 minutes (first time), 5 minutes (future builds)

---

## 📱 TWO OPTIONS TO BUILD

### **Option 1: Build on Your Computer** (Recommended)
- Best for: If you have a laptop/desktop
- Tools needed: Android Studio (free)
- Time: 30 min setup, 5 min builds after

### **Option 2: Use GitHub Actions** (Advanced)
- Best for: If you're mobile-only
- Tools needed: GitHub account (free)
- Time: 1 hour setup, automatic builds after

**Choose Option 1 if you have access to a computer. It's faster and easier!**

---

## 🚀 OPTION 1: BUILD ON YOUR COMPUTER

### **Step 1: Download Your Code**

**From Replit:**
1. Click **File** → **Export as Zip**
2. Download `opictuary.zip` to your computer
3. Extract the zip file

**Or use Git:**
```bash
git clone https://your-replit-url.git
cd opictuary
```

### **Step 2: Install Android Studio**

**Download Android Studio (FREE):**
- Go to: https://developer.android.com/studio
- Click "Download Android Studio"
- Follow installer for your OS (Windows/Mac/Linux)

**Install time:** 10-15 minutes

**What it installs:**
- Android SDK
- Java JDK
- Build tools
- Emulator (for testing)

### **Step 3: Setup Android Studio**

**First Time Setup:**
1. Open Android Studio
2. Welcome screen → "More Actions" → "SDK Manager"
3. Check these are installed:
   - ✅ Android SDK Platform 35 (or latest)
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator (optional, for testing)

4. Click "Apply" if anything is missing

**This takes 5-10 minutes to download components.**

### **Step 4: Install Node.js (if not already installed)**

**Check if you have Node:**
```bash
node --version
# Should show v20.x.x or higher
```

**If not installed:**
- Go to: https://nodejs.org
- Download LTS version
- Install

### **Step 5: Build the App**

**Open Terminal/Command Prompt in your project folder:**

```bash
# 1. Install dependencies
npm install

# 2. Build web app
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Open in Android Studio
npx cap open android
```

**Android Studio will open with your project loaded!**

### **Step 6: Generate Signing Key (First Time Only)**

**In Terminal/Command Prompt:**

```bash
cd android

keytool -genkey -v -keystore opictuary-release.keystore \
  -alias opictuary-key -keyalg RSA -keysize 2048 -validity 10000
```

**You'll be asked:**
- Password: (create strong password - SAVE IT!)
- Your name: [Your Name]
- Organization: Opictuary
- City: [Your City]
- State: [Your State]
- Country: US (or your country code)

**SAVE THIS PASSWORD!** You'll need it for every future update.

### **Step 7: Configure Signing**

**Create file: `android/key.properties`**

```properties
storeFile=opictuary-release.keystore
storePassword=YOUR_PASSWORD_HERE
keyAlias=opictuary-key
keyPassword=YOUR_PASSWORD_HERE
```

**Replace `YOUR_PASSWORD_HERE` with the password you created in Step 6.**

⚠️ **NEVER commit this file to Git!** Keep it private.

### **Step 8: Build Release AAB**

**In Terminal (from project root):**

```bash
cd android
./gradlew bundleRelease
```

**On Windows:**
```bash
cd android
gradlew.bat bundleRelease
```

**Build time:** 2-5 minutes (first time), 30 seconds after

**Output location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

**✅ This AAB is ready for Google Play Store!**

### **Step 9: Verify Your Build**

**Check file size:**
```bash
# Mac/Linux
ls -lh android/app/build/outputs/bundle/release/

# Windows
dir android\app\build\outputs\bundle\release\
```

**Expected size:** 10-50 MB (yours is likely ~15-25 MB)

**✅ If you see `app-release.aab`, you're done!**

---

## 🔄 FUTURE UPDATES (MUCH FASTER!)

**After you've done the setup once, updating is EASY:**

```bash
# 1. Make your changes in Replit
# 2. Download updated code
# 3. Build:
npm run build
npx cap sync android
cd android
./gradlew bundleRelease

# Done! New AAB ready in 2-3 minutes.
```

---

## 🐛 TROUBLESHOOTING

### **"JAVA_HOME not set"**
**Solution:** Android Studio installs Java automatically. Restart terminal or:

**Mac/Linux:**
```bash
export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jbr/Contents/Home
```

**Windows:**
```bash
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
```

### **"SDK location not found"**
**Solution:** Create `android/local.properties`:

**Mac:**
```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

**Windows:**
```properties
sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

**Linux:**
```properties
sdk.dir=/home/YOUR_USERNAME/Android/Sdk
```

### **"Gradle build failed"**
**Solution:**
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

### **"Permission denied" on Mac/Linux**
**Solution:**
```bash
chmod +x android/gradlew
```

### **Build is slow**
**First build:** 5-10 minutes (normal - downloading dependencies)
**Future builds:** 30 seconds - 2 minutes

---

## 🚀 OPTION 2: GITHUB ACTIONS (MOBILE-ONLY USERS)

**If you don't have a computer, use GitHub to build automatically!**

### **Setup (One Time):**

**1. Create GitHub Repository**
- Go to: https://github.com
- Create account (free)
- Create new repository "opictuary"
- Make it private (important for security!)

**2. Push Your Code to GitHub**

From Replit shell:
```bash
git remote add github https://github.com/YOUR_USERNAME/opictuary.git
git push github main
```

**3. Add Secrets to GitHub**

- Go to your repo → Settings → Secrets → New repository secret
- Add these secrets:

**KEYSTORE_FILE** (base64 encoded keystore):
```bash
# First, generate keystore on any computer:
keytool -genkey -v -keystore opictuary.keystore \
  -alias opictuary -keyalg RSA -keysize 2048 -validity 10000

# Then encode it:
base64 opictuary.keystore
# Copy the output
```

**KEYSTORE_PASSWORD** = your keystore password  
**KEY_ALIAS** = opictuary  
**KEY_PASSWORD** = your key password

**4. Create GitHub Action Workflow**

Create `.github/workflows/build-android.yml`:

```yaml
name: Build Android App

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build web app
        run: npm run build
        
      - name: Sync Capacitor
        run: npx cap sync android
        
      - name: Decode keystore
        run: |
          echo "${{ secrets.KEYSTORE_FILE }}" | base64 -d > android/opictuary.keystore
          
      - name: Create key.properties
        run: |
          echo "storeFile=opictuary.keystore" > android/key.properties
          echo "storePassword=${{ secrets.KEYSTORE_PASSWORD }}" >> android/key.properties
          echo "keyAlias=${{ secrets.KEY_ALIAS }}" >> android/key.properties
          echo "keyPassword=${{ secrets.KEY_PASSWORD }}" >> android/key.properties
          
      - name: Build AAB
        run: cd android && ./gradlew bundleRelease
        
      - name: Upload AAB
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: android/app/build/outputs/bundle/release/app-release.aab
```

**5. Trigger Build**

Every time you push to GitHub, it automatically builds!

**Download your AAB:**
1. Go to Actions tab in GitHub
2. Click latest workflow run
3. Download "app-release" artifact
4. Unzip to get your AAB

**Time:** 5-10 minutes per build (automated)

---

## 📋 COMPARISON

| Method | Setup Time | Build Time | Best For |
|--------|-----------|------------|----------|
| **Local (Computer)** | 30 min | 2-3 min | Everyone with PC access |
| **GitHub Actions** | 60 min | 5-10 min | Mobile-only users |
| **Cloud Service** | Varies | 10-20 min | Advanced users |

**Recommendation:** Use Local (Computer) if possible!

---

## ✅ ONCE YOU HAVE YOUR AAB

**You're ready for Google Play Store!**

1. Go to: https://play.google.com/console
2. Create app
3. Upload `app-release.aab`
4. Fill in store listing (use `PLAY_STORE_LISTING_CONTENT.md`)
5. Submit for review!

**Full instructions:** See `GOOGLE_PLAY_DEPLOYMENT_GUIDE.md`

---

## 💡 TIPS

**Keep Your Keystore SAFE:**
- ⚠️ If you lose it, you can NEVER update your app!
- Back it up to:
  - Cloud storage (Google Drive, Dropbox)
  - USB drive
  - Email yourself
  - Multiple locations!

**Security:**
- Never commit `key.properties` to Git
- Never commit keystore file to Git
- Never share your keystore password

**Updates:**
- Same keystore for ALL future versions
- Increment version code in `android/app/build.gradle`
- Rebuild and upload to Play Store

---

## 🎯 QUICK START (TL;DR)

**For users with a computer:**

```bash
# 1. Install Android Studio (one time)
# Download from: https://developer.android.com/studio

# 2. Download code from Replit

# 3. Build (in project folder):
npm install
npm run build
npx cap sync android

# 4. Generate key (one time):
cd android
keytool -genkey -v -keystore opictuary-release.keystore \
  -alias opictuary-key -keyalg RSA -keysize 2048 -validity 10000

# 5. Create android/key.properties with your password

# 6. Build release:
./gradlew bundleRelease

# 7. Upload:
# android/app/build/outputs/bundle/release/app-release.aab
```

**That's it!** 🚀

---

## 📞 NEED HELP?

**Common questions:**
- **"I don't have a computer"** → Use GitHub Actions (Option 2)
- **"Build is failing"** → Check Troubleshooting section above
- **"Where's my AAB?"** → `android/app/build/outputs/bundle/release/`
- **"How do I update?"** → Rebuild with new code, increment version

**Still stuck?** Ask me and I'll help troubleshoot!

---

## ✅ SUCCESS CHECKLIST

Before uploading to Google Play:

- [ ] Android Studio installed
- [ ] Keystore generated (and backed up!)
- [ ] key.properties configured
- [ ] Release AAB built successfully
- [ ] AAB file size is reasonable (10-50 MB)
- [ ] Keystore password saved safely
- [ ] Ready to upload to Play Console

**All checkboxes checked?** You're ready to launch! 🎉

---

**Next step:** Follow `GOOGLE_PLAY_DEPLOYMENT_GUIDE.md` to upload to Play Store! 📱
