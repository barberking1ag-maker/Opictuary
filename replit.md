# Memorial Platform (Opictuary)

## Overview
Opictuary is a digital memorial platform for preserving memories of deceased loved ones, offering features like photo/video sharing, crowdfunding, legacy event planning, grief support, and celebrity tributes. It includes functionalities like Future Messages, enhanced memorial page design, database-backed saved memorials with categorization, server-side content moderation, a funeral program creation system, and merchandise services integration. The platform aims for dignified design, multi-faith customization, and privacy. The business model includes B2B partnerships with funeral homes, flower shops, merchandise vendors, and correctional facilities, generating revenue from platform fees, advertisements, partnerships, prison access services, and merchandise referrals.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
**Technology Stack:** React 18 with TypeScript, Vite, Wouter, TanStack Query, and Tailwind CSS.
**UI/UX Decisions:** "Dignity in Digital" design philosophy with a respectful, timeless aesthetic. Features multi-faith theming (rich purple backgrounds, gold accents), Radix UI primitives, shadcn/ui, custom component library, and specific typography (Crimson Text, Inter). It is a production-ready Progressive Web App (PWA) with smart install prompts, offline support, service worker caching, and standalone mode for iOS and Android.
**Key Components:** Over 30 reusable components for navigation, memorial displays, fundraising, legacy features, special memorials, and admin functions.
**Pages Implemented:** 18+ distinct pages covering core functionalities like Home, UserProfile, MyMemorials, CelebrityMemorials, GriefSupport, PartnerSignup, AdminDashboard, and others.

### Backend Architecture
**Technology Stack:** Express.js with Node.js and TypeScript, designed as a RESTful API.
**API Endpoints:** 80+ endpoints across 14 feature areas including Authentication & User Management, Memorials (CRUD, invite codes), QR Code System, Memories & Condolences, Fundraising & Donations (Stripe integration), Legacy Features (scheduled messages, event planning), Celebrity Memorials, Essential Workers, Self-Obituary, Advertisement Platform, Funeral Home Partners, Flower Shop Partners, Prison Access System, Push Notifications, and Analytics.
**Content Moderation System:** Server-side profanity filter applied to user-generated content before database persistence, blocking strong offensive language.

### Data Storage
**Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
**Database Tables:** Over 25 tables covering all core features, business systems, prison access, analytics, and infrastructure.
**Privacy & Access Control:** Invite code system for private memorials, optional public settings, role-based admin permissions, and verified QR code issuance.
**Security Patterns:** Zod validation, whitelisted fields, session-based authentication, CSRF protection, protected routes, lazy-loaded Stripe.

### Authentication & Authorization
**Replit Auth Integration:** OpenID Connect (OIDC) via Replit for session-based authentication using PostgreSQL.
**Authorization Patterns:** Role-based access control with granular permissions.

### Key Features & Systems
**Memorial QR Code System:** Comprehensive QR code generation for tombstones and memorial cards. Families can generate printable QR codes that link to memorial pages containing photos, videos, memories, and condolences. Features professional PDF download with purple/gold branding, clear scanning instructions, and the Opictuary tagline. QR codes support three purposes: tombstone upload (allows cemetery visitors to upload photos/videos), memorial view (links to memorial page), and general photo/video upload for memorial cards. QR codes can be continuously updated as families add new content to memorials.
**Prison Access System:** Provides secure, monitored access for incarcerated individuals to memorials, including identity verification, payment, time-limited access tokens, and session monitoring.
**Flower Shop Partnership System:** Connects users with local florists for sympathy flower delivery, operating on a 20% commission model. Includes partner registration, location-based search, order tracking, and commission management.
**Saved Memorials System:** Allows authenticated users to save memorials with relationship categorization (family, friend, colleague, etc.) and personal notes, persisting data in PostgreSQL.
**Future Messages System:** Enables memorial creators to schedule messages to be delivered to loved ones on future occasions, with pre-written templates, recurrence support, email delivery, and media attachments.
**Merchandise Services Integration:** Connects users with external services for physical memorial products like custom T-shirts, cardboard cutouts, and holographic tributes, with tracking for affiliate partnerships.
**Revenue Model:** Generates revenue through configurable platform fees (2.5%-5%) on fundraisers and donations, with higher fees for celebrity memorials.

### Analytics & Monitoring
**Admin Dashboard:** Real-time platform statistics (users, memorials, donations, revenue, page views) at `/admin` for authorized users.
**Analytics Integration:** Google Analytics 4 for general tracking and Plausible Analytics for privacy-focused web analytics. Custom database tables for internal page view and event tracking.

### Mobile App Publishing
**Android/Google Play Store & iOS/App Store:** Production build ready with Capacitor for native app deployment. Requires developer accounts and submission materials.

## External Dependencies
*   **Stripe**: Payment processing.
*   **`qrcode` library**: QR code generation.
*   **Google Fonts**: Crimson Text and Inter.
*   **Radix UI**: Accessible UI primitives.
*   **Lucide React**: Icon library.
*   **Capacitor**: Native mobile app features.
*   **Google Analytics**: Usage analytics and tracking.
*   **Plausible Analytics**: Privacy-focused web analytics.
*   **ConnectNetwork/GTL, ViaPath Technologies, Securus Technologies**: Integrations for the prison access system.