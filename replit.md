# Memorial Platform (Opictuary)

## Overview

Opictuary is a digital memorial platform that enables families and friends to create, share, and preserve memories of loved ones who have passed away. The platform combines traditional memorial elements with modern features including photo/video sharing, fundraising, legacy events, grief support resources, and celebrity memorial tributes. It emphasizes dignified design with multi-faith customization options and privacy-focused access controls via invite codes.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**October 9, 2025 - Advertising Platform Fee System & Sales Tracking:**
- Implemented comprehensive sales tracking system for advertisements
- Platform fee model: Opictuary receives percentage of sales made through platform
- New advertisementSales table tracks individual sales with revenue and fee calculations
- Each sale records: saleAmount, platformFeePercentage, platformFeeAmount, customerEmail, orderReference
- Advertisements track aggregate metrics: totalSales, totalRevenue, totalPlatformFees
- API endpoints for recording sales (POST /api/advertisements/:id/sale) and retrieving sales data
- Referral codes uniquely identify and track sales through Opictuary
- Automatic fee calculation based on advertisement's commission percentage

**October 9, 2025 - Grief Support Enhancement:**
- Enhanced grief support resources with spiritual and mental health sections
- Added professional counseling resources (BetterHelp, Grief Recovery Method)
- Added faith-based support (Stephen Ministry, Jewish Bereavement, Islamic Counseling)
- Added mindfulness resources (Headspace meditation, What's Your Grief community)
- Organized resources by category: Mental Health & Counseling, Spiritual & Faith-Based Support

**October 9, 2025 - Replit Authentication & Authorization System:**
- Fully implemented Replit Auth using OpenID Connect (OIDC) with session storage
- Added users table (id from OIDC "sub" claim, no UUID default)
- Created authentication middleware (isAuthenticated) and protected routes
- Secured all admin and QR code endpoints with authentication + authorization checks
- Authorization pattern: verify user is creator OR has specific admin permissions
- Client-side useAuth hook and error handling utilities
- All tests passing: creator operations succeed, unauthorized access blocked with 403

**October 9, 2025 - Creator/Admin System & QR Code Management:**
- Added creator/admin roles system to distinguish memorial creator from deceased person
- Implemented role-based access control with granular permissions
- Added QR code generation and management system for tombstone placement
- QR codes are issued only to memorial creators/admins for security
- Support for both family-created and self-written memorial types
- New data models: memorialAdmins, qrCodes with full permission management

**October 4, 2025 - Mobile App Access Control Enhancement:**
- Implemented invite code verification flow for both web and mobile platforms
- Removed hardcoded memorial ID - all memorials now load dynamically based on invite code
- Added security requirement: invite code modal cannot be dismissed without valid code
- Push notification tokens now persist with correct memorial ID after verification
- QR scanner integration works seamlessly with invite code flow
- Unified access control across web and mobile experiences

## Mobile App Deployment

Opictuary is configured as a **native mobile application** using Capacitor + PWA technology:

**PWA Foundation:**
- Progressive Web App manifest for installability
- Service worker with offline caching strategy
- Mobile-optimized viewport and touch interactions
- App icons and splash screens

**Capacitor Integration:**
- iOS and Android native app containers
- Camera plugin for QR code scanning (`useQRScanner` hook)
- Push notifications for scheduled messages (`usePushNotifications` hook)
- Splash screen and status bar customization

**Build & Deployment:**
- `npm run build` - Builds production assets to `dist/public`
- `npx cap sync` - Syncs web assets to iOS/Android platforms
- `npx cap open ios` - Opens iOS project in Xcode
- `npx cap open android` - Opens Android project in Android Studio

**Native Features:**
- QR code scanning via device camera (extracts invite codes from QR data)
- Push notifications for scheduled messages (tokens persisted with memorial ID)
- Offline content caching
- Native splash screen and status bar styling

**Mobile-Specific Implementation:**
- Invite code modal opens automatically on app launch
- Modal cannot be dismissed until valid invite code is entered (security requirement)
- QR scanner parses both raw invite codes and URL-encoded codes
- Push notification tokens automatically registered after memorial access granted
- All memorial data loaded dynamically based on verified invite code
- Unified access flow for both web and mobile platforms

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS for styling with custom design system

**UI Component System:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui design system (New York style variant)
- Custom component library built on Radix primitives
- Font pairing: Crimson Text (serif) for headings, Inter (sans-serif) for body text

**Design Philosophy:**
- "Dignity in Digital" - respectful, timeless aesthetic
- Hybrid reference-based design inspired by Apple Memorial pages, Instagram, and GoFundMe
- Multi-faith theming support (Christian, Jewish, Islamic, Buddhist, Hindu, Non-religious)
- Rich purple backgrounds (280° hue), gold accents (45° hue), NO white backgrounds
- Color palette emphasizes dignity and remembrance

**PWA & Mobile:**
- Configured as Progressive Web App with offline support
- Capacitor integration for native iOS/Android features
- QR code scanning via camera
- Push notifications for scheduled messages
- Service worker for caching and offline functionality

### Backend Architecture

**Technology Stack:**
- Express.js with Node.js and TypeScript
- RESTful API design
- Middleware for error handling and request logging
- Vite integration for serving frontend assets

**API Structure:**
- Memorial CRUD operations
- Authentication and authorization endpoints
- QR code generation and management
- Media upload handling
- Fundraising and donation processing
- Prison access request processing
- Advertisement management

### Data Storage

**Database:**
- PostgreSQL (Neon serverless for scalability)
- Drizzle ORM for type-safe queries and schema management
- Session storage in PostgreSQL for Replit Auth

**Key Data Models:**
- `memorials` - Core memorial information
- `memorialAdmins` - Admin permissions and roles
- `qrCodes` - QR codes for tombstone placement
- `memories` - Photos, videos, and stories
- `condolences` - Visitor messages
- `fundraisers` / `donations` - Fundraising campaigns
- `legacyEvents` - Future life events (graduation, wedding, etc.)
- `musicPlaylists` - Memorial music selections
- `scheduledMessages` - Future message delivery
- `griefSupport` - Support resources and contacts
- `celebrityMemorials` / `celebrityDonations` - Public figure memorials
- `prisonAccessRequests` / `prisonAccessSessions` / `prisonAuditLogs` - Prison access system
- `advertisements` - Partner advertising with commission tracking
- `funeralHomePartners` / `partnerReferrals` / `partnerCommissions` - Partner revenue sharing

**Privacy & Access Control:**
- Invite code system for private memorial access
- Optional public memorial setting
- Role-based admin permissions
- QR codes only issued to verified creators/admins

### Authentication & Authorization

**Replit Auth Integration:**
- OpenID Connect (OIDC) provider
- Session-based authentication with PostgreSQL storage
- User data from OIDC claims (sub, email, first_name, last_name, profile_image_url)
- No password management required

**Authorization Patterns:**
- Memorial creator identification via email match
- Admin permission checks (canEditMemorial, canManageQR, canManageFundraisers, canManageEvents)
- Protected endpoints require authentication + specific permissions
- Client-side auth state management via useAuth hook

**Protected Resources:**
- Memorial editing and deletion
- QR code generation and management
- Admin management
- Fundraiser and legacy event creation
- Grief support contact management

### Prison Access System

**Purpose:**
Enable incarcerated individuals to access and view memorials of loved ones through a secure, monitored system integrated with correctional facility infrastructure.

**Workflow:**
1. **Request Submission**: Inmate submits access request with identity verification
2. **Relationship Verification**: Facility staff verify relationship to deceased
3. **Payment Processing**: Facility fee payment via Stripe
4. **Access Token Generation**: Time-limited secure token issued
5. **Monitored Session**: Access logged and audited
6. **Session Expiration**: Automatic token expiration

**Data Models:**
- `prisonAccessRequests` - Initial access requests with verification status
- `prisonAccessSessions` - Active/expired access sessions with tokens
- `prisonAuditLogs` - Complete audit trail of all prison access activity

**Security Features:**
- Multi-step identity and relationship verification
- Time-limited access tokens
- Session monitoring and logging
- Audit trail for compliance
- Integration with correctional facility systems

## External Dependencies

1. **Stripe**: Payment processing for donations, fundraisers, and prison access fees
2. **`qrcode` library**: QR code generation for tombstone placement
3. **Google Fonts**: Crimson Text and Inter typography
4. **Radix UI**: Accessible UI primitives
5. **Lucide React**: Icon library
6. **`class-variance-authority`**: Component variant management
7. **`cmdk`**: Command palette component
8. **`react-day-picker`**: Calendar component
9. **`vaul`**: Drawer component
10. **Capacitor**: Native mobile app features for iOS and Android
11. **ConnectNetwork/GTL, ViaPath Technologies, Securus Technologies**: Prison access system integration
