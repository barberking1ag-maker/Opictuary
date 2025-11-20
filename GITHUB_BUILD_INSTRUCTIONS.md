# GitHub Actions Android Build Instructions

## ✅ Your GitHub Actions Workflow is Ready!

The workflow file `.github/workflows/build-android.yml` has been created and will automatically build your Android app with **version code 2025111411**.

## 🚀 Quick Setup Steps

### 1. Create Your Keystore Secret

First, you need to convert your keystore file to base64:

```bash
# On Mac/Linux:
base64 -i android/keystores/opictuary-upload.jks | pbcopy

# On Windows (Git Bash):
base64 android/keystores/opictuary-upload.jks | clip

# Or manually:
base64 android/keystores/opictuary-upload.jks > keystore.txt
# Then copy the content of keystore.txt
```

### 2. Add GitHub Secrets

Go to your GitHub repository:
1. Click **Settings** tab
2. Click **Secrets and variables** → **Actions**
3. Add these secrets:

| Secret Name | Value |
|------------|-------|
| `KEYSTORE_BASE64` | Paste the base64 string from step 1 |
| `KEYSTORE_PASSWORD` | Your keystore password |
| `KEY_ALIAS` | `upload` |
| `KEY_PASSWORD` | Your key password |

### 3. Push to GitHub

```bash
git add .
git commit -m "Add GitHub Actions workflow for Android build"
git push origin main
```

### 4. Watch It Build

1. Go to your repo's **Actions** tab
2. You'll see the workflow running (takes about 10-15 minutes)
3. When complete, click on the workflow run
4. Download the **app-release-v2025111411** artifact

### 5. Upload to Google Play

1. Extract the downloaded ZIP file
2. You'll find `app-release.aab` inside
3. Upload this to Google Play Console
4. It will have version code **2025111411** ✅

## 📋 What This Workflow Does

- Sets up Android SDK automatically
- Builds your React app
- Syncs with Capacitor
- Creates a signed AAB file
- Makes it downloadable

## 🔧 Troubleshooting

If the build fails:
- Check the **Actions** tab for error messages
- Ensure all secrets are set correctly
- The keystore password and key password must match what you used when creating the keystore

## 📦 Version Info

- **Current Version Code**: 2025111411
- **Version Name**: 1.0.0

The workflow will automatically detect and display these in the build summary.