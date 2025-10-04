# Memorial Platform (Opictuary)

## Overview

Opictuary is a digital memorial platform that enables families and friends to create, share, and preserve memories of loved ones who have passed away. The platform combines traditional memorial elements with modern features including photo/video sharing, fundraising, legacy events, grief support resources, and celebrity memorial tributes. It emphasizes dignified design with multi-faith customization options and privacy-focused access controls via invite codes.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- `memorials` - Core memorial pages with biographical information
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