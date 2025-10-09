# Memorial Platform (Opictuary)

## Overview

Opictuary is a digital memorial platform that enables families and friends to create, share, and preserve memories of loved ones who have passed away. The platform combines traditional memorial elements with modern features including photo/video sharing, fundraising, legacy events, grief support resources, and celebrity memorial tributes. It emphasizes dignified design with multi-faith customization options and privacy-focused access controls via invite codes.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

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
- Neutral color palette by default with religion-specific accent colors
- Responsive layout with mobile-first considerations

**State Management:**
- TanStack Query for API data fetching and caching
- Local React state for UI interactions
- No global state management library (keeps architecture simple)

### Backend Architecture

**Server Framework:**
- Express.js running on Node.js
- TypeScript for type safety across frontend and backend
- ESM (ES Modules) format throughout the codebase

**API Design:**
- RESTful API structure under `/api` routes
- JSON request/response format
- Error handling middleware for consistent error responses
- Request logging middleware for debugging

**Development vs Production:**
- Vite dev server integration in development mode
- Static file serving in production
- Hot module replacement (HMR) in development

### Data Storage

**Database:**
- PostgreSQL (configured via Drizzle ORM)
- Neon serverless PostgreSQL provider (`@neondatabase/serverless`)
- WebSocket support for serverless database connections

**ORM Layer:**
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript types generated from database schema
- Migration support via `drizzle-kit`

**Data Models:**
- `memorials` - Core memorial pages with biographical information, creator tracking, and ownership type
- `memorialAdmins` - Role-based access control with granular permissions (QR management, content approval, memorial editing)
- `qrCodes` - QR code generation and issuance tracking for tombstone placement
- `memories` - Photo/video memories with approval workflow
- `condolences` - Sympathy messages from visitors
- `fundraisers` - Memorial fundraising campaigns
- `donations` - Fundraiser contribution records
- `legacyEvents` - Memorial events and gatherings
- `musicPlaylists` - Memorial music collections
- `scheduledMessages` - Time-locked messages for future delivery
- `griefSupport` - Grief counseling and support resources
- `celebrityMemorials` - Special memorial pages for public figures
- `celebrityDonations` - Charity donations tied to celebrity memorial access
- `prisonFacilities` - Correctional facility information for prison access integration
- `prisonAccessRequests` - Inmate access requests with relationship verification
- `prisonVerifications` - Identity and relationship verification records
- `prisonPayments` - Payment records for facility access fees
- `prisonAccessSessions` - Time-limited access tokens for inmates
- `prisonAuditLogs` - Immutable audit trail for all prison access actions

**Key Schema Decisions:**
- UUIDs for primary keys (generated via `gen_random_uuid()`)
- Invite code system for privacy control (unique codes required for access)
- Religion field for multi-faith theming
- Cemetery coordinates stored as JSON for mapping features
- Approval workflow for user-submitted content (memories)
- Soft privacy via `isPublic` boolean flag

### Authentication & Authorization

**Access Control:**
- Invite code-based access system (no traditional user authentication)
- Each memorial has a unique invite code required for viewing
- Optional public memorial setting for unrestricted access

**Privacy Model:**
- Privacy-first approach: memorials are private by default
- Invite codes act as shared secrets for access control
- No user accounts required for most features
- Content moderation through approval workflows

### Replit Authentication System

**Implementation (October 9, 2025):**
Opictuary uses Replit Auth (OpenID Connect) for authentication of memorial creators and administrators who need to manage content, generate QR codes, and access privileged features.

**Technical Stack:**
- OpenID Connect (OIDC) provider: Replit Auth
- Session storage: PostgreSQL with connect-pg-simple
- User identification: OIDC "sub" claim (no UUID generation)
- Middleware: isAuthenticated checks for valid session
- Client hook: useAuth() for authentication status

**Database Schema:**
- `users` table: Stores authenticated users from OIDC (id = sub claim, email, names, profile image)
- `sessions` table: Stores express-session data in PostgreSQL
- **Important**: users.id has NO DEFAULT - always provided by OIDC sub claim

**Authorization Pattern:**
All admin-level operations follow a consistent authorization pattern:

1. **Authentication Check**: Verify user has valid session (isAuthenticated middleware)
2. **Identity Lookup**: Find memorial associated with the resource being accessed
3. **Creator Check**: Verify user.email matches memorial.creatorEmail
4. **Admin Permission Check**: OR verify user has memorialAdmin role with specific permission
5. **Response**: 401 if unauthenticated, 403 if unauthorized, 200/204 if authorized

**Protected Endpoints:**
```
GET    /api/memorials/:id/admins          - Creator or admin can view
POST   /api/memorials/:id/admins          - Only creator can add admins
DELETE /api/memorial-admins/:id           - Only creator can delete admins
GET    /api/memorials/:id/qr-codes        - Creator or QR admin can view
POST   /api/memorials/:id/qr-codes/generate - Creator or QR admin can generate
DELETE /api/qr-codes/:id                  - Creator or QR admin can delete
```

**Client-Side Integration:**
- `useAuth()` hook provides: { user, isLoading, isAuthenticated }
- `handleAuthError()` utility for consistent error handling
- Login redirects to `/api/login` (initiates OIDC flow)
- Logout via `/api/logout` (destroys session)

**Security Features:**
- Session-based authentication (not JWT)
- CSRF protection via session cookies
- Granular role-based permissions (canManageQR, canApproveContent, canEditMemorial)
- Authorization checks on every protected endpoint
- Proper HTTP status codes (401 unauthenticated, 403 forbidden)

**Optional Enhancements (Architect Suggestions):**
- Email normalization to lowercase for consistency
- Audit logging for admin actions
- Expanded test coverage for edge cases

### External Dependencies

**Third-Party Services:**

1. **Stripe** - Payment processing
   - React Stripe.js integration for payment forms
   - Handles donations and fundraiser contributions
   - Platform fee collection (typically 5% on celebrity memorials)

2. **QR Code Generation** - `qrcode` library
   - Generates QR codes for tombstone placement
   - Allows visitors to scan and access digital memorial from physical grave

3. **Google Fonts** - Typography
   - Crimson Text (serif)
   - Inter (sans-serif)

**UI Component Dependencies:**
- Radix UI suite (20+ component primitives)
- Lucide React (icon library)
- class-variance-authority (component variant management)
- cmdk (command palette component)
- react-day-picker (calendar component)
- vaul (drawer component)

**Development Tools:**
- Replit-specific plugins for dev experience
- TypeScript for static type checking
- PostCSS with Tailwind CSS for styling
- ESBuild for production builds

**Potential Future Integrations:**
- Google Maps API (cemetery location mapping)
- Video hosting service (memorial videos)
- Email service (scheduled message delivery)
- SMS/phone service (grief hotline integrations)

### Prison Access System

**Integration with Correctional Facilities:**
Opictuary provides a specialized access system allowing incarcerated individuals to view memorials of loved ones through verified, paid sessions managed by prison facilities.

**Third-Party Provider Integration:**
- ConnectNetwork/GTL
- ViaPath Technologies
- Securus Technologies
- Other facility-specific communication providers

**Multi-Step Verification Workflow:**
1. **Access Request Submission** - Family member or friend submits request on behalf of inmate
2. **Identity Verification** - Validates inmate identity using DOC number and facility records
3. **Relationship Verification** - Confirms relationship to deceased via documentation
4. **Payment Processing** - Collects facility fees (typically $0.15/minute)
5. **Access Token Issuance** - Generates time-limited secure access token for inmate use
6. **Session Monitoring** - Tracks usage, logs all actions, maintains audit trail

**Security & Compliance:**
- All sessions are monitored and recorded
- Immutable audit logs for regulatory compliance
- IP address and user agent tracking
- Time-limited access tokens that auto-expire
- Facility admin controls for session management

**Payment Model:**
- Per-minute pricing set by correctional facility
- Payment collected from family/friends before access granted
- Integration with existing facility payment providers
- Transparent fee disclosure

**API Endpoints:**
- `GET /api/prison-facilities` - List active prison facilities
- `POST /api/prison-access-requests` - Submit new access request
- `GET /api/prison-access-requests/:id` - Retrieve request details
- `PATCH /api/prison-access-requests/:id/status` - Update request status
- `POST /api/prison-access-requests/:requestId/verifications` - Submit verification
- `POST /api/prison-access-requests/:requestId/payments` - Process payment
- `POST /api/prison-access-sessions` - Create access session
- `GET /api/prison-access-sessions/validate/:token` - Validate access token
- `GET /api/prison-audit-logs` - Retrieve audit logs for compliance