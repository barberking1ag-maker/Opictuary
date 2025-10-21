# Memorial Platform (Opictuary)

## Overview

Opictuary is a digital memorial platform designed to create, share, and preserve memories of deceased loved ones. It combines traditional memorial practices with modern features such as photo/video sharing, crowdfunding, legacy event planning, grief support, and celebrity tributes. The platform emphasizes dignified design, multi-faith customization, and privacy through invite-only access. The business vision is to offer a respectful and accessible way for families to honor legacies, with market potential in both personal memorials and B2B partnerships with funeral homes and correctional facilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript, Vite, Wouter (routing), TanStack Query (server state), Tailwind CSS (styling).

**UI/UX Decisions:**
- **Design Philosophy:** "Dignity in Digital" with a respectful, timeless aesthetic. Hybrid design inspired by Apple Memorials, Instagram, and GoFundMe.
- **Theming:** Multi-faith support (Christian, Jewish, Islamic, Buddhist, Hindu, Non-religious). Rich purple backgrounds, gold accents, no white backgrounds.
- **Components:** Radix UI primitives for accessibility, shadcn/ui (New York style), custom component library.
- **Typography:** Crimson Text (serif) for headings, Inter (sans-serif) for body text.
- **PWA & Mobile:** Progressive Web App with offline support, Capacitor integration for native iOS/Android features (QR scanning, push notifications).

### Backend Architecture

**Technology Stack:**
- Express.js with Node.js and TypeScript. RESTful API design.

**API Structure:**
- Comprehensive APIs for memorial CRUD, authentication, QR code management, media uploads, fundraising, prison access, and advertisement management.

### Data Storage

**Database:**
- PostgreSQL (Neon serverless) with Drizzle ORM for type-safe queries. Session storage in PostgreSQL for Replit Auth.

**Key Data Models:**
- Core entities include `memorials`, `memorialAdmins`, `qrCodes`, `memories`, `condolences`, `fundraisers`, `legacyEvents`, `musicPlaylists`, `scheduledMessages`, `griefSupport`, `celebrityMemorials`, `prisonAccessRequests`, `advertisements`, and `funeralHomePartners`.

**Privacy & Access Control:**
- Invite code system for private memorial access, optional public settings, role-based admin permissions, and QR codes issued only to verified creators/admins.

### Authentication & Authorization

**Replit Auth Integration:**
- OpenID Connect (OIDC) via Replit, session-based authentication using PostgreSQL. User data from OIDC claims.

**Authorization Patterns:**
- Role-based access control with granular permissions (e.g., `canEditMemorial`, `canManageQR`). Protected endpoints require authentication and specific permissions.

### Prison Access System

**Purpose:**
- Securely enable incarcerated individuals to access memorials of loved ones through a monitored system integrated with correctional facilities.

**Workflow:**
- Inmate request submission, relationship verification, payment processing (Stripe), time-limited access token generation, monitored session, and session expiration.

**Security Features:**
- Multi-step identity verification, time-limited tokens, session monitoring, comprehensive audit logs.

## External Dependencies

1.  **Stripe**: Payment processing for donations, fundraisers, and prison access fees.
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