#!/bin/bash

##############################################################################
# Android Release Build Script for Opictuary
# 
# This script builds a production-ready Android App Bundle (.aab) for the
# Google Play Store submission.
##############################################################################

set -e # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="Opictuary"
APP_ID="com.opictuary.app"
BUILD_DIR="$(pwd)/android-build-output"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_DIR="${BUILD_DIR}/${TIMESTAMP}"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check for Android SDK (check if ANDROID_HOME or ANDROID_SDK_ROOT is set)
    if [[ -z "${ANDROID_HOME}" ]] && [[ -z "${ANDROID_SDK_ROOT}" ]]; then
        log_warning "ANDROID_HOME/ANDROID_SDK_ROOT not set. Android SDK might not be properly configured."
        log_warning "You may need to set: export ANDROID_HOME=/path/to/android/sdk"
    fi
    
    # Check for key.properties
    if [ ! -f "android/key.properties" ]; then
        log_error "android/key.properties not found!"
        log_error "Please create android/key.properties from android/key.properties.example"
        log_error "and configure your keystore settings for signing the release."
        exit 1
    fi
    
    # Check for keystore file
    KEYSTORE_PATH=$(grep storeFile android/key.properties | cut -d'=' -f2)
    if [ ! -z "$KEYSTORE_PATH" ]; then
        # Check if path is relative to android directory
        if [[ "$KEYSTORE_PATH" == /* ]]; then
            # Absolute path
            FULL_KEYSTORE_PATH="$KEYSTORE_PATH"
        else
            # Relative path
            FULL_KEYSTORE_PATH="android/$KEYSTORE_PATH"
        fi
        
        if [ ! -f "$FULL_KEYSTORE_PATH" ]; then
            log_warning "Keystore file not found at: $FULL_KEYSTORE_PATH"
            log_warning "Make sure the keystore file exists before proceeding."
        fi
    fi
    
    log_success "Prerequisites check completed"
}

# Clean previous builds
clean_build() {
    log_info "Cleaning previous builds..."
    
    # Clean frontend build
    rm -rf dist
    
    # Clean Android build directories
    rm -rf android/app/build
    rm -rf android/app/src/main/assets/public
    
    # Clean Gradle cache (optional, uncomment if needed)
    # cd android && ./gradlew clean && cd ..
    
    log_success "Clean completed"
}

# Build frontend with production configuration
build_frontend() {
    log_info "Building frontend for production..."
    
    # Use production capacitor config
    log_info "Using production Capacitor configuration..."
    cp capacitor.config.production.ts capacitor.config.ts
    
    # Build the frontend
    log_info "Running Vite build..."
    npm run build
    
    if [ ! -d "dist/public" ]; then
        log_error "Frontend build failed - dist/public directory not created"
        exit 1
    fi
    
    log_success "Frontend build completed"
}

# Sync Capacitor
sync_capacitor() {
    log_info "Syncing Capacitor with Android project..."
    
    # Install Capacitor dependencies if needed
    npx cap sync android
    
    log_success "Capacitor sync completed"
}

# Update version in Android project
update_version() {
    log_info "Updating version information..."
    
    # Get version from package.json
    VERSION=$(node -p "require('./package.json').version")
    log_info "App version: $VERSION"
    
    # Calculate version code (you may want to customize this logic)
    # For now, using timestamp-based version code to ensure it's always increasing
    VERSION_CODE=$(date +%Y%m%d%H)
    
    log_info "Version code: $VERSION_CODE"
    
    # Update build.gradle with version info
    sed -i.bak "s/versionCode [0-9]*/versionCode $VERSION_CODE/" android/app/build.gradle
    sed -i.bak "s/versionName \".*\"/versionName \"$VERSION\"/" android/app/build.gradle
    
    # Clean up backup files
    rm -f android/app/build.gradle.bak
    
    log_success "Version updated to $VERSION (code: $VERSION_CODE)"
}

# Build Android App Bundle
build_aab() {
    log_info "Building Android App Bundle (.aab)..."
    
    cd android
    
    # Make gradlew executable
    chmod +x gradlew
    
    # Build the release AAB
    log_info "Running Gradle build for release bundle..."
    ./gradlew bundleRelease
    
    cd ..
    
    # Check if AAB was created
    if [ ! -f "android/app/build/outputs/bundle/release/app-release.aab" ]; then
        log_error "AAB build failed - file not found"
        exit 1
    fi
    
    log_success "Android App Bundle build completed"
}

# Copy outputs to organized directory
copy_outputs() {
    log_info "Copying build outputs..."
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    # Copy AAB file with descriptive name
    cp android/app/build/outputs/bundle/release/app-release.aab \
       "$OUTPUT_DIR/${APP_NAME}-${VERSION}-release.aab"
    
    # Copy mapping file if it exists (for ProGuard/R8)
    if [ -f "android/app/build/outputs/mapping/release/mapping.txt" ]; then
        cp android/app/build/outputs/mapping/release/mapping.txt \
           "$OUTPUT_DIR/mapping.txt"
    fi
    
    # Generate build info
    cat > "$OUTPUT_DIR/build-info.txt" << EOF
Build Information
=================
App Name: ${APP_NAME}
App ID: ${APP_ID}
Version: ${VERSION}
Version Code: ${VERSION_CODE}
Build Date: $(date)
Build Type: Release (AAB for Google Play Store)

Files in this build:
- ${APP_NAME}-${VERSION}-release.aab : Android App Bundle for Google Play Store
$([ -f "$OUTPUT_DIR/mapping.txt" ] && echo "- mapping.txt : ProGuard/R8 mapping file (upload to Play Console for crash reports)")

Next Steps:
1. Upload the .aab file to Google Play Console
2. If mapping.txt exists, upload it for better crash report symbolication
3. Follow the Play Console submission process
EOF
    
    log_success "Build outputs copied to: $OUTPUT_DIR"
}

# Generate summary report
generate_report() {
    log_info "Generating build report..."
    
    cat << EOF

${GREEN}════════════════════════════════════════════════════════════════${NC}
${GREEN}            Android Release Build Completed Successfully!${NC}
${GREEN}════════════════════════════════════════════════════════════════${NC}

${BLUE}Build Details:${NC}
  • App Name: ${APP_NAME}
  • Package ID: ${APP_ID}
  • Version: ${VERSION} (Code: ${VERSION_CODE})
  • Output Location: ${OUTPUT_DIR}

${BLUE}Generated Files:${NC}
  • ${APP_NAME}-${VERSION}-release.aab (Upload to Google Play Console)
$([ -f "$OUTPUT_DIR/mapping.txt" ] && echo "  • mapping.txt (ProGuard/R8 mapping)")

${YELLOW}Next Steps:${NC}
  1. Open Google Play Console: https://play.google.com/console
  2. Navigate to your app
  3. Go to Release > Production
  4. Create new release
  5. Upload the AAB file: ${OUTPUT_DIR}/${APP_NAME}-${VERSION}-release.aab
  6. Complete the release notes and submission form

${YELLOW}Important Notes:${NC}
  • The AAB is signed with your release keystore
  • Make sure to keep your keystore and passwords secure
  • Test the app thoroughly before submitting to production
  • Consider testing with Internal/Closed testing tracks first

${GREEN}════════════════════════════════════════════════════════════════${NC}
EOF
}

# Main execution
main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         Opictuary Android Release Build Script            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    check_prerequisites
    clean_build
    build_frontend
    sync_capacitor
    update_version
    build_aab
    copy_outputs
    generate_report
    
    log_success "All tasks completed successfully! 🎉"
}

# Run the script
main "$@"