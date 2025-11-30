# iOS GitHub Secrets Setup Guide

This guide explains how to set up the required GitHub secrets for the iOS build workflow.

## Required Secrets

You need to add these 4 secrets to your GitHub repository:

| Secret Name | Description |
|-------------|-------------|
| `IOS_CERTIFICATE_BASE64` | Your Apple Distribution certificate (p12 file, base64 encoded) |
| `IOS_CERTIFICATE_PASSWORD` | Password for the p12 certificate |
| `IOS_PROVISIONING_PROFILE_BASE64` | Your App Store provisioning profile (base64 encoded) |
| `IOS_KEYCHAIN_PASSWORD` | Any password you choose (used temporarily during build) |

---

## Step 1: Create Distribution Certificate

### In Apple Developer Portal:

1. Go to [developer.apple.com](https://developer.apple.com)
2. Click **Certificates, Identifiers & Profiles**
3. Click **Certificates** → **+** (Create new)
4. Select **Apple Distribution** → Continue
5. You'll be asked to upload a Certificate Signing Request (CSR)

### Create CSR (requires Mac with Keychain Access):

**On a Mac:**
1. Open **Keychain Access** (Applications → Utilities)
2. Menu: **Keychain Access** → **Certificate Assistant** → **Request a Certificate From a Certificate Authority**
3. Enter:
   - Your email address
   - Common Name (your name)
   - Select **"Saved to disk"**
   - Leave CA Email empty
4. Click Continue and save the `.certSigningRequest` file

**Important:** You MUST create the CSR on the same Mac where you'll export the .p12 file. The private key is stored locally and is required for the export.

### Complete certificate creation:
1. Upload the CSR to Apple
2. Download the `.cer` file
3. Double-click to install in Keychain (Mac) or use conversion tools

---

## Step 2: Export Certificate as P12

### On a Mac:
1. Open **Keychain Access**
2. Find your certificate under **My Certificates**
3. Right-click → **Export**
4. Choose **Personal Information Exchange (.p12)**
5. Set a strong password (save this - it's `IOS_CERTIFICATE_PASSWORD`)
6. Save the file

### Convert to Base64:
```bash
base64 -i certificate.p12 -o certificate_base64.txt
```

The contents of `certificate_base64.txt` is your `IOS_CERTIFICATE_BASE64` secret.

---

## Step 3: Create Provisioning Profile

### In Apple Developer Portal:

1. Go to **Profiles** → **+** (Create new)
2. Select **App Store** (under Distribution section)
3. Click Continue
4. Select your App ID: `com.opictuary.memorial`
5. Click Continue
6. Select your Distribution Certificate
7. Click Continue
8. Name it: `Opictuary App Store Profile`
9. Click Generate
10. Download the `.mobileprovision` file

### Convert to Base64:
```bash
base64 -i profile.mobileprovision -o profile_base64.txt
```

The contents of `profile_base64.txt` is your `IOS_PROVISIONING_PROFILE_BASE64` secret.

---

## Step 4: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

| Name | Value |
|------|-------|
| `IOS_CERTIFICATE_BASE64` | (paste base64 content from step 2) |
| `IOS_CERTIFICATE_PASSWORD` | (password you set when exporting p12) |
| `IOS_PROVISIONING_PROFILE_BASE64` | (paste base64 content from step 3) |
| `IOS_KEYCHAIN_PASSWORD` | (any password, e.g., `build123`) |

Optional:
| `APPLE_TEAM_ID` | `CRPD7WHX8V` (already configured in ExportOptions.plist) |

---

## Step 5: Register App ID (if not done)

Make sure your App ID is registered:

1. Go to **Identifiers** in Apple Developer Portal
2. Click **+** → **App IDs** → **App**
3. Enter:
   - Description: `Opictuary Memorial App`
   - Bundle ID: `com.opictuary.memorial` (Explicit)
4. Enable capabilities as needed (Push Notifications, etc.)
5. Click Register

---

## Step 6: Run the Build

1. Go to your GitHub repository
2. Click **Actions** → **Build iOS**
3. Click **Run workflow**
4. Wait for the build to complete
5. Download the IPA from the artifacts

---

## Uploading to App Store Connect

After the build completes:

### Option 1: Transporter App (Easiest)
1. Download [Transporter](https://apps.apple.com/app/transporter/id1450874784) on Mac
2. Sign in with your Apple ID
3. Drag the IPA file into Transporter
4. Click **Deliver**

### Option 2: Web Upload
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create your app if not exists
3. Use the web uploader (under TestFlight)

---

## Troubleshooting

### "No signing certificate found"
- Make sure certificate is not expired
- Verify base64 encoding is correct (no extra spaces/newlines)

### "Provisioning profile doesn't match"
- Regenerate profile with the correct certificate
- Ensure App ID matches exactly: `com.opictuary.memorial`

### "Code signing is required"
- Check all 4 secrets are set correctly
- Verify certificate password is correct

---

## Quick Reference

Your current configuration:
- **Bundle ID**: `com.opictuary.memorial`
- **Team ID**: `CRPD7WHX8V`
- **App Name**: Opictuary
