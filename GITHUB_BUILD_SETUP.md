# Opictuary - GitHub Actions Build Setup Guide

This guide explains how to set up automated builds for iOS and Android using GitHub Actions.

## Quick Start

1. Push this code to a GitHub repository
2. Add the required secrets (see below)
3. Trigger the build workflows
4. Download the built apps from the Actions artifacts

---

## Android Build Setup

### Required GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name | Description |
|-------------|-------------|
| `RELEASE_KEYSTORE` | Base64-encoded keystore file |
| `KEYSTORE_PASSWORD` | Password for the keystore |
| `KEY_ALIAS` | Alias name for the signing key |
| `KEY_PASSWORD` | Password for the key alias |

### Generate a Keystore (if you don't have one)

```bash
keytool -genkey -v -keystore opictuary-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias opictuary -storepass YOUR_PASSWORD -keypass YOUR_PASSWORD \
  -dname "CN=Opictuary, OU=Memorial Platform, O=Opictuary Inc, L=City, ST=State, C=US"
```

### Convert Keystore to Base64

**On Mac/Linux:**
```bash
base64 -i opictuary-release.jks | pbcopy
# Paste this as RELEASE_KEYSTORE secret
```

**On Windows:**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("opictuary-release.jks")) | Set-Clipboard
# Paste this as RELEASE_KEYSTORE secret
```

### Trigger Android Build

1. Go to **Actions** tab in your GitHub repo
2. Click **Build Android App**
3. Click **Run workflow**
4. After completion, download `opictuary-release.aab` (for Google Play) or `opictuary-release.apk` (for direct install)

---

## iOS Build Setup

### Required GitHub Secrets

| Secret Name | Description |
|-------------|-------------|
| `IOS_CERTIFICATE_BASE64` | Base64-encoded distribution certificate (.p12) |
| `IOS_CERTIFICATE_PASSWORD` | Password for the .p12 certificate |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64-encoded provisioning profile (.mobileprovision) |
| `IOS_KEYCHAIN_PASSWORD` | Any secure password (for temporary keychain) |
| `APPLE_TEAM_ID` | Your Apple Developer Team ID |

### Get iOS Signing Assets

1. **Apple Developer Account Required** - Enroll at [developer.apple.com](https://developer.apple.com)

2. **Create App ID:**
   - Go to Certificates, Identifiers & Profiles
   - Create App ID with Bundle ID: `com.opictuary.memorial`

3. **Create Distribution Certificate:**
   - Request certificate via Keychain Access on Mac
   - Download and install the certificate
   - Export as .p12 file

4. **Create Provisioning Profile:**
   - Select "App Store" distribution
   - Select your App ID and certificate
   - Download the .mobileprovision file

### Convert iOS Assets to Base64

```bash
# Certificate
base64 -i Certificates.p12 | pbcopy
# Paste as IOS_CERTIFICATE_BASE64

# Provisioning Profile  
base64 -i YourApp.mobileprovision | pbcopy
# Paste as IOS_PROVISIONING_PROFILE_BASE64
```

### Trigger iOS Build

1. Go to **Actions** tab in your GitHub repo
2. Click **Build iOS**
3. Click **Run workflow**
4. After completion, download `Opictuary-iOS.zip` containing the IPA

---

## Uploading to App Stores

### Google Play Store

1. Download the `.aab` file from GitHub Actions artifacts
2. Go to [Google Play Console](https://play.google.com/console)
3. Create/open your app
4. Go to **Production** → **Create new release**
5. Upload the `.aab` file
6. Complete store listing and submit for review

### Apple App Store

1. Download the `.ipa` file from GitHub Actions artifacts
2. Use **Transporter** app (Mac) or **altool** to upload:
   ```bash
   xcrun altool --upload-app -f App.ipa -t ios -u YOUR_APPLE_ID -p APP_SPECIFIC_PASSWORD
   ```
3. Go to [App Store Connect](https://appstoreconnect.apple.com)
4. Complete app information and submit for review

---

## Existing Keystore Info (for reference)

If you already have a keystore from previous builds:

- Check `android/keystores/` folder
- Check `fresh.jks` or `opictuary-new.jks` in root
- Read `KEYSTORE_SECRET.txt` for existing credentials

---

## Troubleshooting

### Build Fails: "Keystore not found"
- Ensure `RELEASE_KEYSTORE` secret is properly base64-encoded
- Check there are no extra newlines in the secret

### Build Fails: "Wrong password"
- Verify `KEYSTORE_PASSWORD` and `KEY_PASSWORD` match your keystore
- Passwords are case-sensitive

### iOS Build Fails: "No provisioning profile"
- Ensure provisioning profile matches the app's Bundle ID
- Certificate must match the one in the provisioning profile

### Build Fails: "Node modules error"
- The workflow uses `npm ci` which requires `package-lock.json`
- Ensure package-lock.json is committed to the repo

---

## File Structure for GitHub

```
your-repo/
├── .github/
│   └── workflows/
│       ├── build-android.yml    # Android build workflow
│       └── build-ios.yml        # iOS build workflow
├── android/                     # Capacitor Android project
├── ios/                         # Capacitor iOS project  
├── client/                      # React frontend
├── server/                      # Express backend
├── shared/                      # Shared types/schemas
├── package.json
├── package-lock.json           # Required for npm ci
├── capacitor.config.ts
└── ... other files
```

---

## Need Help?

- [Capacitor CI/CD Docs](https://capacitorjs.com/docs/guides/ci-cd)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/app-store-connect/)
