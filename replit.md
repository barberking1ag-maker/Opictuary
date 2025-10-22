# Memorial Platform (Opictuary)

## Overview

Opictuary is a digital memorial platform dedicated to creating, sharing, and preserving memories of deceased loved ones. It integrates traditional memorial practices with modern functionalities like photo/video sharing, crowdfunding, legacy event planning, grief support, and celebrity tributes. The platform emphasizes dignified design, multi-faith customization, and privacy through invite-only access. Its business vision includes personal memorials and B2B partnerships with funeral homes and correctional facilities, generating revenue from advertisements, partnerships, and prison access services.

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
17 distinct pages covering core functionalities like Home, UserProfile, MyMemorials, CelebrityMemorials, GriefSupport, AdvertisingOpportunities, PartnerSignup, PrisonAccessRequest, and various admin and demo pages.

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
11. **ConnectNetwork/GTL, ViaPath Technologies, Securus Technologies**: Integrations for the prison access system.