#!/bin/bash

# Opictuary iOS Build Script
# This script builds the iOS app for TestFlight/App Store distribution

echo "🍎 Building Opictuary for iOS..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUILD_MODE="${1:-prepare}"  # prepare, archive, or ipa
CONFIGURATION="${2:-Release}"  # Debug or Release
SCHEME="App"
WORKSPACE="ios/App/App.xcworkspace"
ARCHIVE_PATH="ios/App/build/Opictuary.xcarchive"
EXPORT_PATH="ios/App/build"
EXPORT_OPTIONS="ios/App/ExportOptions.plist"

# Function to print usage
print_usage() {
    echo ""
    echo "Usage: ./build-ios.sh [mode] [configuration]"
    echo ""
    echo "Modes:"
    echo "  prepare  - Install dependencies and sync (default)"
    echo "  archive  - Create archive for App Store"
    echo "  ipa      - Create IPA file from archive"
    echo "  full     - Complete build with IPA generation"
    echo ""
    echo "Configuration:"
    echo "  Release  - Production build (default)"
    echo "  Debug    - Development build"
    echo ""
    echo "Examples:"
    echo "  ./build-ios.sh                  # Prepare only"
    echo "  ./build-ios.sh archive           # Create archive"
    echo "  ./build-ios.sh ipa               # Export IPA from existing archive"
    echo "  ./build-ios.sh full Release      # Complete production build"
    echo ""
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ Error: This script must be run on macOS${NC}"
    exit 1
fi

# Check for Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}❌ Error: Xcode is not installed${NC}"
    echo "Please install Xcode from the Mac App Store"
    exit 1
fi

# Check for Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""
echo -e "${BLUE}Build Mode: $BUILD_MODE${NC}"
echo -e "${BLUE}Configuration: $CONFIGURATION${NC}"
echo ""

# Function to prepare the build
prepare_build() {
    # Step 1: Install dependencies
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ npm install failed${NC}"
        exit 1
    fi

    # Step 2: Build web assets
    echo -e "${YELLOW}🔨 Building web assets...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi

    # Step 3: Sync with iOS
    echo -e "${YELLOW}📱 Syncing with iOS...${NC}"
    npx cap sync ios
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Capacitor sync failed${NC}"
        exit 1
    fi

    # Step 4: Install CocoaPods dependencies
    echo -e "${YELLOW}🧩 Installing iOS dependencies...${NC}"
    cd ios/App

    # Check if pod is installed
    if ! command -v pod &> /dev/null; then
        echo -e "${YELLOW}Installing CocoaPods...${NC}"
        sudo gem install cocoapods
    fi

    pod install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Pod install failed${NC}"
        exit 1
    fi

    cd ../..
    
    echo -e "${GREEN}✅ Build preparation complete!${NC}"
}

# Function to create archive
create_archive() {
    echo -e "${YELLOW}📦 Creating archive...${NC}"
    
    # Create build directory if it doesn't exist
    mkdir -p ios/App/build
    
    # Clean previous builds
    echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
    xcodebuild clean -workspace "$WORKSPACE" -scheme "$SCHEME" -configuration "$CONFIGURATION"
    
    # Create archive
    echo -e "${YELLOW}📱 Building archive (this may take several minutes)...${NC}"
    xcodebuild archive \
        -workspace "$WORKSPACE" \
        -scheme "$SCHEME" \
        -configuration "$CONFIGURATION" \
        -archivePath "$ARCHIVE_PATH" \
        -allowProvisioningUpdates \
        CODE_SIGN_STYLE=Automatic \
        DEVELOPMENT_TEAM="${DEVELOPMENT_TEAM}" \
        | xcpretty --color
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Archive creation failed${NC}"
        echo "Make sure you have:"
        echo "1. Configured your Apple Developer Team ID"
        echo "2. Valid provisioning profiles"
        echo "3. Proper code signing certificates"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Archive created successfully!${NC}"
    echo "Archive location: $ARCHIVE_PATH"
}

# Function to export IPA
export_ipa() {
    echo -e "${YELLOW}📤 Exporting IPA...${NC}"
    
    # Check if archive exists
    if [ ! -d "$ARCHIVE_PATH" ]; then
        echo -e "${RED}❌ Archive not found at: $ARCHIVE_PATH${NC}"
        echo "Run './build-ios.sh archive' first"
        exit 1
    fi
    
    # Check if ExportOptions.plist exists
    if [ ! -f "$EXPORT_OPTIONS" ]; then
        echo -e "${RED}❌ ExportOptions.plist not found at: $EXPORT_OPTIONS${NC}"
        echo "Make sure to configure the ExportOptions.plist file with your Team ID"
        exit 1
    fi
    
    # Export IPA
    echo -e "${YELLOW}📱 Exporting IPA (this may take a few minutes)...${NC}"
    xcodebuild -exportArchive \
        -archivePath "$ARCHIVE_PATH" \
        -exportPath "$EXPORT_PATH" \
        -exportOptionsPlist "$EXPORT_OPTIONS" \
        -allowProvisioningUpdates \
        | xcpretty --color
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ IPA export failed${NC}"
        echo "Check your ExportOptions.plist configuration"
        exit 1
    fi
    
    echo -e "${GREEN}✅ IPA exported successfully!${NC}"
    echo "IPA location: $EXPORT_PATH/App.ipa"
}

# Function to upload to App Store Connect
upload_ipa() {
    echo -e "${YELLOW}📤 Uploading to App Store Connect...${NC}"
    
    IPA_PATH="$EXPORT_PATH/App.ipa"
    
    if [ ! -f "$IPA_PATH" ]; then
        echo -e "${RED}❌ IPA not found at: $IPA_PATH${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Validating IPA...${NC}"
    xcrun altool --validate-app \
        -f "$IPA_PATH" \
        -t ios \
        --apiKey "${APP_STORE_API_KEY}" \
        --apiIssuer "${APP_STORE_ISSUER_ID}"
    
    if [ $? -eq 0 ]; then
        echo -e "${YELLOW}Uploading to App Store Connect...${NC}"
        xcrun altool --upload-app \
            -f "$IPA_PATH" \
            -t ios \
            --apiKey "${APP_STORE_API_KEY}" \
            --apiIssuer "${APP_STORE_ISSUER_ID}"
            
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ IPA uploaded successfully!${NC}"
        else
            echo -e "${YELLOW}⚠️  Upload failed. You can manually upload via Transporter app${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Validation failed. Please check your IPA configuration${NC}"
    fi
}

# Main execution logic
case "$BUILD_MODE" in
    prepare)
        prepare_build
        echo ""
        echo "Next steps:"
        echo "1. Configure ExportOptions.plist with your Team ID"
        echo "2. Run: ./build-ios.sh archive"
        echo "3. Run: ./build-ios.sh ipa"
        ;;
    
    archive)
        prepare_build
        create_archive
        echo ""
        echo "Next step: ./build-ios.sh ipa"
        ;;
    
    ipa)
        export_ipa
        echo ""
        echo "Ready to upload to App Store Connect!"
        echo "Use Transporter app or Xcode Organizer"
        ;;
    
    full)
        prepare_build
        create_archive
        export_ipa
        echo ""
        echo -e "${GREEN}🎉 Complete build successful!${NC}"
        echo "IPA ready at: $EXPORT_PATH/App.ipa"
        echo ""
        echo "To upload to App Store Connect:"
        echo "1. Open Transporter app"
        echo "2. Sign in with your Apple ID"
        echo "3. Drag the IPA file"
        echo "4. Click Deliver"
        ;;
    
    upload)
        upload_ipa
        ;;
    
    help|--help|-h)
        print_usage
        ;;
    
    *)
        echo -e "${RED}❌ Invalid mode: $BUILD_MODE${NC}"
        print_usage
        exit 1
        ;;
esac

echo ""
echo "For detailed instructions, see:"
echo "  - ios/APPLE_STORE_SETUP_GUIDE.md"
echo "  - ios/APPLE_DEVELOPER_REQUIREMENTS.md"