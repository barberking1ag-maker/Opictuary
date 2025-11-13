# 🚀 How to Build Your Android App with GitHub Actions

This guide shows you how to automatically build your Android app (.aab file) using GitHub Actions - completely free!

---

## 📋 **Prerequisites**

- GitHub account (free)
- This Replit project pushed to GitHub

---

## 🔧 **Step 1: Push Your Code to GitHub**

### **Option A: If you haven't connected to GitHub yet:**

1. **In Replit:** Click the "Version Control" button (left sidebar)
2. Click "Create a Git repository"
3. Click "Connect to GitHub"
4. Follow the prompts to connect your GitHub account
5. Push your code

### **Option B: If already connected:**

1. Make sure all your changes are committed
2. Push to GitHub

---

## 🔐 **Step 2: Add Secrets to GitHub**

You need to add 4 secrets to your GitHub repository:

### **Go to your GitHub repository:**
1. Click **Settings** tab
2. Click **Secrets and variables** → **Actions** (in the left sidebar)
3. Click **New repository secret**

### **Add these 4 secrets one by one:**

#### **Secret 1: KEYSTORE_BASE64**
- **Name:** `KEYSTORE_BASE64`
- **Value:** You need to generate this value first:
  
  **In Replit Shell, run this command:**
  ```bash
  base64 keystores/opictuary-upload.jks | tr -d '\n'
  ```
  
  - This will output a long string of letters and numbers
  - Copy the ENTIRE output (it's very long!)
  - Paste into the secret value field on GitHub
  
  **⚠️ IMPORTANT:** Do NOT save this to a file or commit it to GitHub!

#### **Secret 2: KEYSTORE_PASSWORD**
- **Name:** `KEYSTORE_PASSWORD`
- **Value:** `OpictuarySecure2025!`

#### **Secret 3: KEY_ALIAS**
- **Name:** `KEY_ALIAS`
- **Value:** `opictuary-upload`

#### **Secret 4: KEY_PASSWORD**
- **Name:** `KEY_PASSWORD`
- **Value:** `OpictuarySecure2025!`

**⚠️ Important:** Make sure the secret names are EXACTLY as shown above (case-sensitive!)

---

## ▶️ **Step 3: Run the Build**

### **Automatic builds:**
- The app will build automatically whenever you push code to the `main` branch

### **Manual build (recommended for first time):**

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Click **Build Android App Bundle** (left sidebar)
4. Click **Run workflow** button (top right)
5. Click the green **Run workflow** button in the dropdown
6. Wait 5-10 minutes for the build to complete ⏱️

---

## 📥 **Step 4: Download Your App**

After the build finishes:

1. Stay on the **Actions** tab
2. Click on the completed workflow run (green checkmark ✅)
3. Scroll down to **Artifacts** section
4. Click **app-release** to download a ZIP file
5. Extract the ZIP file
6. You'll find **app-release.aab** inside!

---

## 📱 **Step 5: Upload to Google Play Console**

1. Log in to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to **Production** → **Releases** (or Testing → Internal testing)
4. Click **Create new release**
5. Upload **app-release.aab**
6. Fill in release notes
7. Click **Review release** → **Start rollout**

---

## 🎉 **That's It!**

Your app will now build automatically in the cloud whenever you push code!

---

## 🔄 **Future Builds**

Whenever you want to build a new version:
- Just push your code to GitHub
- Or manually trigger the workflow (Steps 3-4 above)
- Download the new .aab file
- Upload to Google Play Console

---

## ⚠️ **Troubleshooting**

### **Build failed?**
- Check that all 4 secrets are added correctly
- Make sure secret names match EXACTLY (case-sensitive)
- Check the error logs in the Actions tab

### **Can't download artifact?**
- Make sure the build completed successfully (green checkmark)
- Artifacts are kept for 30 days

### **Need help?**
- Check the workflow logs in the Actions tab
- The logs show exactly what went wrong

---

## 📝 **Important Notes**

- **Never commit** the `keystores/` folder or `android/key.properties` to GitHub
  - These are in `.gitignore` and should stay private
- Keep your keystore password (`opictuary2025`) safe and private
- If you lose the keystore, you'll need to create a new one and update Google Play App Signing

---

## 🎯 **Quick Reference**

**Build your app:**
1. Push code to GitHub OR manually trigger workflow
2. Wait 5-10 minutes
3. Download artifact from Actions tab
4. Extract ZIP to get .aab file
5. Upload to Google Play Console

**That's all there is to it!** 🚀
