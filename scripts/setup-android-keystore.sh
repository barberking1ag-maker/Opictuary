#!/bin/bash

##############################################################################
# Android Keystore Setup Script for Opictuary
# 
# This script helps you create and configure the keystore for signing your
# Android releases.
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Main function
main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         Opictuary Android Keystore Setup Script           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Check if keystore directory exists
    KEYSTORE_DIR="keystores"
    if [ ! -d "$KEYSTORE_DIR" ]; then
        log_info "Creating keystores directory..."
        mkdir -p "$KEYSTORE_DIR"
    fi
    
    KEYSTORE_FILE="$KEYSTORE_DIR/opictuary-upload.jks"
    
    # Check if keystore already exists
    if [ -f "$KEYSTORE_FILE" ]; then
        log_warning "Keystore already exists at: $KEYSTORE_FILE"
        echo "Do you want to create a new keystore? This will overwrite the existing one. (y/N): "
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            log_info "Using existing keystore"
            update_key_properties
            exit 0
        fi
    fi
    
    log_info "Creating new keystore for Opictuary..."
    echo ""
    echo "Please provide the following information for your keystore:"
    echo "(These values will be used for signing your app releases)"
    echo ""
    
    # Gather keystore information
    read -p "Enter your full name (e.g., John Doe): " FULL_NAME
    read -p "Enter your organizational unit (e.g., Mobile Development): " ORG_UNIT
    read -p "Enter your organization name (e.g., Opictuary Inc): " ORG_NAME
    read -p "Enter your city/locality (e.g., San Francisco): " CITY
    read -p "Enter your state/province (e.g., CA): " STATE
    read -p "Enter your country code (e.g., US): " COUNTRY
    
    echo ""
    log_info "Creating keystore with the following information:"
    echo "  CN=$FULL_NAME, OU=$ORG_UNIT, O=$ORG_NAME, L=$CITY, S=$STATE, C=$COUNTRY"
    echo ""
    
    # Get passwords
    while true; do
        read -s -p "Enter keystore password (min 6 characters): " STORE_PASSWORD
        echo ""
        read -s -p "Confirm keystore password: " STORE_PASSWORD_CONFIRM
        echo ""
        
        if [ "$STORE_PASSWORD" = "$STORE_PASSWORD_CONFIRM" ]; then
            if [ ${#STORE_PASSWORD} -ge 6 ]; then
                break
            else
                log_error "Password must be at least 6 characters long"
            fi
        else
            log_error "Passwords do not match. Please try again."
        fi
    done
    
    # Generate keystore
    log_info "Generating keystore..."
    
    keytool -genkey -v \
        -keystore "$KEYSTORE_FILE" \
        -alias opictuary-release \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass "$STORE_PASSWORD" \
        -keypass "$STORE_PASSWORD" \
        -dname "CN=$FULL_NAME, OU=$ORG_UNIT, O=$ORG_NAME, L=$CITY, S=$STATE, C=$COUNTRY"
    
    if [ $? -eq 0 ]; then
        log_success "Keystore created successfully at: $KEYSTORE_FILE"
        
        # Update key.properties file
        update_key_properties_with_password "$STORE_PASSWORD"
    else
        log_error "Failed to create keystore"
        exit 1
    fi
}

update_key_properties() {
    log_info "Updating android/key.properties..."
    
    if [ -f "android/key.properties" ]; then
        log_info "key.properties already exists. Please ensure it's configured correctly."
    else
        log_error "android/key.properties not found. Please configure it manually."
        echo ""
        echo "Create android/key.properties with the following content:"
        echo ""
        echo "storePassword=YOUR_KEYSTORE_PASSWORD"
        echo "keyPassword=YOUR_KEYSTORE_PASSWORD"
        echo "keyAlias=opictuary-release"
        echo "storeFile=keystores/opictuary-upload.jks"
    fi
}

update_key_properties_with_password() {
    local password=$1
    
    log_info "Creating android/key.properties..."
    
    cat > android/key.properties << EOF
# Keystore properties for signing Android releases
# NEVER commit this file to version control!
storePassword=$password
keyPassword=$password
keyAlias=opictuary-release
storeFile=keystores/opictuary-upload.jks
EOF
    
    log_success "android/key.properties created"
    
    # Add to .gitignore if not already there
    if ! grep -q "key.properties" .gitignore 2>/dev/null; then
        echo "android/key.properties" >> .gitignore
        log_info "Added key.properties to .gitignore"
    fi
    
    echo ""
    log_warning "IMPORTANT SECURITY NOTES:"
    echo "  1. NEVER commit key.properties or the keystore file to version control"
    echo "  2. Keep a secure backup of your keystore and passwords"
    echo "  3. If you lose the keystore, you cannot update your app on Google Play"
    echo "  4. Store the keystore password in a secure password manager"
    echo ""
    log_success "Keystore setup complete! You can now run ./scripts/build-android-release.sh"
}

# Run the script
main "$@"