# Opictuary - App Store Submission Checklist

## ✅ What's Ready

### 1. iOS Configuration ✓
- Info.plist configured with all required permissions
- Capacitor config updated for production
- Push notifications and background modes configured

### 2. Build System ✓
- Complete build script (`build-ios.sh`) with IPA generation
- Export options template for App Store distribution
- Automated archive and export process

### 3. Documentation ✓
- Apple Developer setup guide
- Icon generation instructions
- Build and deployment guides

## 📝 What You Need to Complete

### 1. Apple Developer Account ($99/year)
- [ ] Sign up at https://developer.apple.com
- [ ] Wait for approval (instant for Individual, 1-7 days for Organization)
- [ ] Note your Team ID (needed for build process)

### 2. Generate App Icons
- [ ] Create or obtain a 1024x1024 PNG icon (no transparency)
- [ ] Use one of these methods:
  - **Easy**: Go to https://www.appicon.co/ and upload your icon
  - **Manual**: Run the icon generator script
- [ ] Place generated icons in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### 3. Update Team ID
- [ ] Open `ios/App/ExportOptions.plist`
- [ ] Replace `YOUR_TEAM_ID` with your actual Apple Developer Team ID

### 4. Build Your App
```bash
# From project root:
./build-ios.sh full
```
This will create an IPA file at: `ios/App/build/App.ipa`

### 5. App Store Connect Setup
- [ ] Go to https://appstoreconnect.apple.com
- [ ] Create new app with Bundle ID: `com.opictuary.memorial`
- [ ] Fill in app information:
  - **Name**: Opictuary
  - **Category**: Lifestyle or Social Networking
  - **Age Rating**: 12+ (memorial content)

### 6. Prepare Marketing Materials

#### Screenshots Required
- [ ] iPhone 6.7" Display (1290 x 2796 pixels)
- [ ] iPhone 6.5" Display (1284 x 2778 pixels)
- [ ] iPhone 5.5" Display (1242 x 2208 pixels)
- [ ] iPad Pro 12.9" Display (2048 x 2732 pixels)

#### App Description (4000 characters max)
```
Opictuary - Honor and Remember Your Loved Ones

Opictuary is a dignified digital memorial platform that helps you preserve and share the memories of those who have passed. Create beautiful, lasting tributes that celebrate the lives of your loved ones.

Key Features:
• Create Memorial Pages - Build personalized memorial pages with photos, videos, and stories
• Photo & Video Galleries - Share cherished memories through interactive multimedia galleries
• QR Code Memorials - Generate QR codes to connect physical memorials with digital tributes
• Future Messages - Schedule messages to be delivered on special dates
• Memorial Events - Plan and manage memorial services and remembrance gatherings
• Crowdfunding Support - Organize fundraising for funeral expenses or charitable causes
• Grief Support Community - Connect with others who understand your journey
• Celebrity & Public Figure Tributes - Pay respects to public figures who've made an impact
• Alumni Memorials - Honor classmates and school community members
• Essential Worker Recognition - Special tributes for healthcare workers, first responders, and other heroes

Special Features:
• Prison Access System - Allows incarcerated individuals to view memorials of loved ones
• Funeral Program Builder - Create and share digital funeral programs
• Merchandise Integration - Order memorial products like photo books and keepsakes
• Multi-Faith Support - Customizable themes for different religious and cultural traditions
• Privacy Controls - Choose who can view and contribute to memorials

Opictuary provides a sacred digital space where memories live forever. Whether you're honoring a family member, friend, colleague, or public figure, our platform offers the tools and support you need during difficult times.

Join thousands of families who trust Opictuary to preserve their most precious memories.
```

#### Keywords (100 characters max)
```
memorial,obituary,remembrance,tribute,grief,funeral,cemetery,memories,memorial app,death,legacy
```

#### Privacy Policy URL
```
https://opictuary.com/privacy
```

#### Support URL
```
https://opictuary.com/support
```

### 7. Upload and Submit
- [ ] Upload IPA using Transporter app (download from Mac App Store)
- [ ] Wait for processing (10-30 minutes)
- [ ] Submit for TestFlight beta testing first
- [ ] After testing, submit for App Store review

## 📱 TestFlight Testing
1. Internal Testing (up to 100 testers)
   - Add team members immediately
   - No review required

2. External Testing (up to 10,000 testers)
   - Requires TestFlight review (24-48 hours)
   - Create public test link

## ⏰ Timeline Estimates
- Apple Developer Enrollment: 1-7 days
- Icon Generation: 30 minutes
- First Build: 1 hour
- TestFlight Approval: 24-48 hours
- App Store Review: 24-72 hours

## 🚀 Quick Commands

```bash
# Build for TestFlight
./build-ios.sh full

# Just prepare (no archive)
./build-ios.sh prepare

# Create archive only
./build-ios.sh archive

# Export IPA from existing archive
./build-ios.sh ipa

# Upload to App Store Connect (requires Transporter)
./build-ios.sh upload
```

## ⚠️ Important Notes

1. **Stripe/Apple Pay**: If using paid features, configure Apple Pay in App Store Connect
2. **Push Notifications**: Create APNs key in Apple Developer portal
3. **Content Review**: Memorial content requires clear moderation policy
4. **Subscriptions**: Must use Apple's In-App Purchase (not Stripe) for recurring payments

## 📞 Support Resources
- Apple Developer Forums: https://developer.apple.com/forums
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- TestFlight Documentation: https://developer.apple.com/testflight/

---

**Ready to submit?** Start with Step 1 (Apple Developer Account) and work through the checklist!