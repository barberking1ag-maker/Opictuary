# Memorial Platform (Opictuary)

## Overview

Opictuary is a digital memorial platform dedicated to creating, sharing, and preserving memories of deceased loved ones. It integrates traditional memorial practices with modern functionalities like photo/video sharing, crowdfunding, legacy event planning, grief support, and celebrity tributes. The platform emphasizes dignified design, multi-faith customization, and privacy through invite-only access. Its business vision includes personal memorials and B2B partnerships with funeral homes and correctional facilities, generating revenue from platform fees on fundraisers, advertisements, partnerships, and prison access services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
React 18 with TypeScript, Vite, Wouter, TanStack Query, and Tailwind CSS.

**UI/UX Decisions:**
- **Design Philosophy:** "Dignity in Digital" with a respectful, timeless aesthetic, inspired by Apple Memorials, Instagram, and GoFundMe.
- **Theming:** Multi-faith support (Christian, Jewish, Islamic, Buddhist, Hindu, Non-religious) with rich purple backgrounds (#1a0f29), gold accents, and no white backgrounds.
- **Components:** Utilizes Radix UI primitives for accessibility, shadcn/ui (New York style), and a custom component library.
- **Typography:** Crimson Text (serif) for headings, Inter (sans-serif) for body text.
- **PWA & Mobile:** Production-ready Progressive Web App with:
  - Smart install prompts with 7-day cooldown
  - Offline support with navigation fallback for deep links
  - Service worker caching for static and dynamic assets
  - Standalone mode for app-like experience
  - Purple theme colors matching brand
  - Works on iOS and Android devices
  - Capacitor integration available for future native features

**Key Components:**
A library of over 30 reusable components covering navigation, memorial displays, fundraising, legacy features, special memorials, and admin functions (e.g., UserMenu, MemorialHero, FundraiserProgress, CelebrityMemorialCard, AdminContentPanel).

**Pages Implemented:**
18+ distinct pages covering core functionalities like Home, UserProfile, MyMemorials, CelebrityMemorials, GriefSupport, AdvertisingOpportunities, PartnerSignup, PrisonAccessRequest, AdminDashboard, Privacy, and various admin and demo pages.

### Backend Architecture

**Technology Stack:**
Express.js with Node.js and TypeScript, designed as a RESTful API.

**API Endpoints:**
74 endpoints across 13 feature areas including:
- **Authentication & User Management:** User profile and memorial retrieval.
- **Memorials:** CRUD operations for memorials, invite code validation.
- **QR Code System:** Generation and management of QR codes.
- **Memories & Condolences:** CRUD and approval workflows.
- **Fundraising & Donations:** Fundraiser management, donation recording, Stripe payment integration.
- **Legacy Features:** Scheduled messages, event planning, music playlists, grief support.
- **Celebrity Memorials:** Listings, details, and donation tracking.
- **Essential Workers:** Memorials for frontline personnel.
- **Self-Obituary:** Creation and scheduled publication.
- **Advertisement Platform:** Submission, approval, sales tracking, and analytics.
- **Funeral Home Partners:** Partner registration, referral tracking, commissions.
- **Prison Access System:** Facility registration, access requests, identity verification, payments, session management, and audit logs.
- **Push Notifications:** Token registration.

### Data Storage

**Database:**
PostgreSQL (Neon serverless) with Drizzle ORM for type-safe queries.

**Database Tables:**
Over 20 tables covering all core features, fundraising, legacy features, special memorials, business systems (advertisements, partnerships), prison access, and infrastructure (users, sessions, push tokens).

**Privacy & Access Control:**
Features invite code system for private memorials, optional public settings, role-based admin permissions, and verified QR code issuance.

**Security Patterns:**
- Strict Zod validation on API endpoints
- Whitelisted fields for profile updates
- Session-based authentication with PostgreSQL storage
- CSRF protection via sameSite: 'lax' cookies
- Protected routes with authentication middleware
- Lazy-loaded Stripe to prevent boot failures
- Auto-creating session tables for deployment safety

### Authentication & Authorization

**Replit Auth Integration:**
OpenID Connect (OIDC) via Replit for session-based authentication using PostgreSQL.

**Authorization Patterns:**
Role-based access control with granular permissions (e.g., `canEditMemorial`, `canManageQR`).

### Prison Access System

**Purpose:**
Provides secure, monitored access for incarcerated individuals to memorials, integrated with correctional facilities.

**Workflow:**
Inmate request, relationship verification, Stripe payment, time-limited access token, monitored session, and session expiration.

**Security Features:**
Multi-step identity verification, time-limited tokens, session monitoring, and comprehensive audit logs.

## Revenue Model

**Platform Fees:**
The platform generates revenue through configurable platform fees on fundraisers and donations.

**Fundraiser Platform Fees:**
- Configurable fee range: 2.5% - 5.0% per fundraiser
- Default fee: 3% for standard memorial fundraisers
- Celebrity memorials: 5% platform fee
- Fee percentage stored at fundraiser creation time
- Validated to ensure fees remain within the 2.5-5% range

**Fee Calculation:**
- Platform fee automatically calculated on each donation
- Formula: `platformFeeAmount = donationAmount × platformFeePercentage / 100`
- Fee amount stored with each donation for audit trail
- Donation amounts update fundraiser progress immediately

**Admin Revenue Tracking:**
- Admin dashboard displays total platform revenue
- Revenue calculated as sum of all platformFeeAmount values across all donations
- Real-time updates as new donations are processed
- Historical fee tracking for financial reporting

## Analytics & Monitoring

**Admin Dashboard:**
- Real-time platform statistics at `/admin` route (admin users only)
- Metrics: users, memorials, memories, donations, revenue, page views
- Top pages tracking

**Analytics Integration:**
- **Google Analytics 4**: Tracks page views and user interactions (requires VITE_GA_MEASUREMENT_ID secret)
- **Plausible Analytics**: Privacy-focused analytics automatically enabled on production domain
- **Database Analytics**: Custom page_views and custom_events tables for internal tracking

**Access Control:**
- Admin dashboard protected with isAdmin middleware
- Admin menu item visible only to admin users
- Set `isAdmin: true` in users table to grant admin access

## Mobile App Publishing

**Android/Google Play Store:**
- Production build ready with Capacitor
- App ID: `com.opictuary.app`
- Build instructions in `PLAY_STORE_GUIDE.md`
- Requires Google Play Developer account ($25 one-time fee)
- Review timeline: 1-7 days

**iOS/App Store:**
- Capacitor iOS platform integrated
- Requires Apple Developer account ($99/year)
- TestFlight for beta testing
- App Store Connect for submission

**Required Materials:**
- App screenshots (2-8 images)
- Feature graphic (1024x500)
- Privacy policy (available at `/privacy`)
- Content rating questionnaire
- Store listing descriptions

## External Dependencies

1.  **Stripe**: Payment processing.
2.  **`qrcode` library**: QR code generation.
3.  **Google Fonts**: Crimson Text and Inter.
4.  **Radix UI**: Accessible UI primitives.
5.  **Lucide React**: Icon library.
6.  **`class-variance-authority`**: Component variant management.
7.  **`cmdk`**: Command palette component.
8.  **`react-day-picker`**: Calendar component.
9.  **`vaul`**: Drawer component.
10. **Capacitor**: Native mobile app features for iOS and Android.
11. **Google Analytics**: Usage analytics and tracking.
12. **Plausible Analytics**: Privacy-focused web analytics.
13. **ConnectNetwork/GTL, ViaPath Technologies, Securus Technologies**: Integrations for the prison access system.