# Memorial Platform (Opictuary)

## Overview

Opictuary is a digital memorial platform designed to create, share, and preserve memories of deceased loved ones. It combines traditional memorial practices with modern features such as photo/video sharing, crowdfunding, legacy event planning, grief support, and celebrity tributes. The platform emphasizes dignified design, multi-faith customization, and privacy through invite-only access.

**Current Implementation Status:**
- ✅ User authentication & profile management system
- ✅ Advertisement platform with approval workflow and sales tracking
- ✅ Branding system with reusable badge components
- ✅ Database schema for all major features (memorials, fundraisers, QR codes, prison access, etc.)
- 🚧 Memorial creation and viewing (schema ready, UI in progress)
- 🚧 Fundraising and donation processing (schema ready, UI in progress)
- 🚧 Prison access system (schema ready, UI in progress)

**Business Vision:**
The platform offers a respectful and accessible way for families to honor legacies, with market potential in both personal memorials and B2B partnerships with funeral homes and correctional facilities. Revenue streams include platform fees from advertisements, funeral home partnerships, and prison access services.

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

**Key Components:**
- **UserMenu** - Authentication-aware navigation component with login/signup buttons or user dropdown menu
- **UserAvatar** - Profile image display with fallback to user initials
- **OpictuaryLogo** - Compact navigation branding with angel halo badge
- **OpictuaryBadge** - Reusable branding badges (Classic Angel Halo & Halo-Inspired Tech variants)
- **Footer** - Platform-wide footer with quick links and branding

**Pages:**
- **UserProfile** (`/profile`) - Tabbed interface for managing profile, settings, notifications, and privacy
- **MyMemorials** (`/my-memorials`) - Dashboard showing user's created memorials
- **AdvertisementAdmin** (`/advertisement-admin`) - Admin dashboard for managing advertisement approvals
- **BadgePreview** (`/badge-preview`) - Showcase of branding badge components

### Backend Architecture

**Technology Stack:**
- Express.js with Node.js and TypeScript. RESTful API design.

**API Structure:**
- **Authentication & User Management:**
  - GET `/api/auth/user` - Get current authenticated user
  - PATCH `/api/user/profile` - Update user profile (firstName, lastName only - Zod validated)
  - GET `/api/user/memorials` - Get memorials created by authenticated user
- **Advertisements:**
  - POST `/api/advertisements` - Create advertisement submission
  - PATCH `/api/advertisements/:id/status` - Approve/reject advertisements (admin)
  - POST `/api/advertisements/:id/sale` - Record sale and platform fee
- **Memorial System** (schema ready, endpoints in development):
  - Memorial CRUD, QR code management, memories, condolences, fundraising
- **Prison Access** (schema ready, endpoints in development):
  - Access request submission, verification, payment processing, session management
- **Additional Features** (schema ready):
  - Legacy events, scheduled messages, grief support resources, celebrity memorials

### Data Storage

**Database:**
- PostgreSQL (Neon serverless) with Drizzle ORM for type-safe queries. Session storage in PostgreSQL for Replit Auth.

**Key Data Models:**
- Core entities include `memorials`, `memorialAdmins`, `qrCodes`, `memories`, `condolences`, `fundraisers`, `legacyEvents`, `musicPlaylists`, `scheduledMessages`, `griefSupport`, `celebrityMemorials`, `prisonAccessRequests`, `advertisements`, and `funeralHomePartners`.

**Privacy & Access Control:**
- Invite code system for private memorial access, optional public settings, role-based admin permissions, and QR codes issued only to verified creators/admins.

**Security Patterns:**
- Strict Zod validation on all API endpoints to prevent privilege escalation
- User profile updates only allow whitelisted fields (firstName, lastName)
- Session-based authentication with PostgreSQL storage
- Protected routes require authentication middleware

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

## Recent Changes

**October 21, 2025 - User Profile & Account Management System:**
- Implemented comprehensive user profile management with tabbed interface
- Created UserAvatar component with profile image support and fallback initials (displays user's first/last name initials)
- Built UserMenu dropdown component with context-aware authentication states:
  - Non-authenticated: Login and Sign Up buttons using window.location.href (prevents SPA hijacking)
  - Authenticated: User avatar, dropdown menu with Profile, My Memorials, Logout options
- Added UserProfile page with 4 tabs:
  - Profile: Edit firstName, lastName (with form state synchronization via useEffect)
  - Settings: Account management options (Coming Soon)
  - Notifications: Email, push, memorial update preferences (Coming Soon - local state only)
  - Privacy: Data download, account deletion controls (Coming Soon)
- Created MyMemorials page showing user's created memorials (filtered by creator email)
- Backend API endpoints with security:
  - PATCH /api/user/profile - Strict Zod validation (only allows firstName, lastName) to prevent privilege escalation
  - GET /api/user/memorials - Returns memorials created by authenticated user
- Added getMemorialsByCreatorEmail method to storage interface and DatabaseStorage implementation
- Enhanced navigation header with notifications bell (placeholder with badge counter)
- All authentication flows properly use server-side redirects instead of client-side routing
- Profile updates persist correctly and form state syncs with auth data

**October 21, 2025 - App Badge Integration:**
- Created reusable badge component system for branding across the platform
- Built OpictuaryBadge component with two design variants and three sizes
  - Classic Angel Halo: Traditional design with golden angel halo (elegant, serif typography)
  - Halo-Inspired Tech: Futuristic design with metallic styling, blue glow effects, and tech elements
  - Sizes: small (60x80px), medium (90x120px), large (300x400px for marketing)
- Built OpictuaryLogo component for navigation header
  - Compact badge with "Opictuary" branding text
  - Optional tagline: "Honoring Life · Preserving Legacy"
  - Responsive design (tagline hidden on mobile)
- Integrated logo into navigation header across all pages
- Created Footer component with small badge display
  - Appears on all pages for brand consistency
  - Contains Quick Links, Services, and Contact sections
  - Links to: Celebrity Memorials, Essential Workers, Create Memorial, Partner Program, Advertising, App Badges
- Enhanced /badge-preview page to showcase all badge components
  - Interactive display of both badge variants
  - Size comparison (small, medium, large)
  - Logo component examples with/without taglines
  - Usage examples and implementation guide
  - Download buttons for marketing use
- Badge design uses uploaded image (IMG_0102_1760999703535.jpeg) as background
- SVG overlay system creates consistent branding across all badge instances
- Components are fully reusable throughout the codebase

**October 15, 2025 - Advertisement Approval Workflow:**
- Added status field to advertisements (pending, approved, rejected)
- All new submissions start as 'pending' and require admin approval
- Created admin dashboard at /advertisement-admin for managing submissions
- Three-tab interface: Pending (awaiting review), Approved (active ads), Rejected (declined ads)
- Status update API endpoints with approve/reject functionality
- Status badges with icons: Clock (pending), CheckCircle (approved), XCircle (rejected)
- Advertisers notified of pending review status upon submission
- Comprehensive approval workflow tested end-to-end

**October 9, 2025 - Advertising Platform Fee System & Sales Tracking:**
- Implemented comprehensive sales tracking system for advertisements
- Platform fee model: Opictuary receives percentage of sales made through platform
- New advertisementSales table tracks individual sales with revenue and fee calculations
- Each sale records: saleAmount, platformFeePercentage, platformFeeAmount, customerEmail, orderReference
- Advertisements track aggregate metrics: totalSales, totalRevenue, totalPlatformFees
- API endpoints for recording sales (POST /api/advertisements/:id/sale) and retrieving sales data
- Referral codes uniquely identify and track sales through Opictuary