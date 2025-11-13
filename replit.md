# Memorial Platform (Opictuary)

## Overview
Opictuary is a digital memorial platform designed to preserve memories of deceased loved ones. It offers a comprehensive suite of features including photo/video sharing, crowdfunding, legacy event planning, grief support, celebrity tributes, and alumni memorials. Key functionalities include Future Messages, enhanced memorial page design, database-backed saved memorials with categorization, server-side content moderation, a funeral program creation system, merchandise services integration, and a unique prison access system. The platform emphasizes dignified design, multi-faith customization, and privacy. The business model includes B2B partnerships with funeral homes, flower shops, merchandise vendors, correctional facilities, and alumni associations, generating revenue through platform fees, advertisements, partnerships, prison access services, alumni association B2B partnerships, and merchandise referrals.

## Current Traction
- **145 users** (organic growth, no paid marketing)
- **Accelerating viral growth** - gained 24 users in short period
- **20+ users/day acquisition rate** (demonstrating strong viral coefficient)
- **Production-ready platform** with 44 pages, 85+ API endpoints, 7 revenue streams

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The platform follows a "Dignity in Digital" design philosophy, employing a respectful and timeless aesthetic with multi-faith theming (rich purple backgrounds, gold accents). It utilizes Radix UI primitives, shadcn/ui, a custom component library, and specific typography (Crimson Text, Inter). The frontend is a production-ready Progressive Web App (PWA) with smart install prompts, offline support, service worker caching, and standalone mode.

### Technical Implementations
**Frontend:** Built with React 18, TypeScript, Vite, Wouter, TanStack Query, and Tailwind CSS. It includes over 30 reusable components and 18+ distinct pages for core functionalities.
**Backend:** Developed using Express.js with Node.js and TypeScript, designed as a RESTful API with over 80 endpoints across 14 feature areas.
**Content Moderation:** Implements server-side profanity filtering for user-generated content.
**Authentication:** Integrates Replit Auth (OpenID Connect) for session-based authentication.
**Authorization:** Employs role-based access control with granular permissions.
**Data Storage:** Uses PostgreSQL (Neon serverless) with Drizzle ORM, comprising over 25 tables.
**Security:** Features Zod validation, whitelisted fields, session-based authentication, CSRF protection, protected routes, and lazy-loaded Stripe.

### Feature Specifications
**Memorial Photo & Video Gallery:** Comprehensive gallery with interactive lightbox, heart/like reactions, share functionality (Web Share API/clipboard), download options, keyboard navigation, and integrated commenting. Supports browser-native video formats (.mp4, .webm, .ogg, .mov, .m4v) with CDN/S3 signed URL compatibility (strips query parameters), YouTube and Vimeo embeds with safe fallbacks, and graceful degradation for streaming manifests (.m3u8, .mpd) showing helpful guidance messages instead of broken media.
**Memorial QR Code System:** Generates printable QR codes for tombstones and memorial cards, linking to memorial pages. Codes support tombstone upload, memorial view, and general photo/video upload.
**Prison Access System:** Provides secure, monitored access for incarcerated individuals to memorials, including identity verification, payment, time-limited access tokens, and session monitoring.
**Flower Shop Partnership System:** Connects users with local florists for sympathy flower delivery, operating on a commission model.
**Saved Memorials System:** Allows authenticated users to save memorials with categorization and personal notes.
**Future Messages System:** Enables scheduling of future messages with templates, recurrence support, email delivery, media attachments, and a global dashboard for management.
**Merchandise Services Integration:** Connects users with external services for physical memorial products.
**Essential Worker Memorial Creation System:** Guided creation flow for honoring first responders and essential workers with category-specific forms and professional detail display.
**Celebrity Memorial Interactive System:** Enhanced platform with profession categorization, a 4-step creation wizard including charity information, achievements, awards, and a robust family/legal verification process.
**Celebrity Fan Content System:** Exclusive content platform for celebrity memorial estates (videos, photos, messages) with admin-only creation/publishing, draft management, and view tracking.
**Funeral Program Audio & Bluetooth System:** Enhanced funeral service programs with program-level and item-level audio capabilities, and Bluetooth connectivity for wireless speakers.
**Memorial Events System:** Comprehensive event planning for memorial gatherings with event types, email/text notifications, and RSVP tracking.
**Cemetery Location Mapping:** Storage of cemetery coordinates and information for future map integration.
**Alumni Memorial System:** Comprehensive system for honoring deceased alumni with university-themed design (deep blue #1E3A8A, gold #F59E0B accents). Features a 4-step creation wizard (personal info, education, activities/achievements, review) with school name autocomplete, degree type selection (BA, BS, MA, MS, MBA, PhD, JD, MD), major/field of study tracking, campus activities and involvement history, notable achievements, and class notes. Browse page offers filtering by school name, graduation year, and major with pagination. Detail pages display full alumni profiles with professional formatting. Supports both public and private memorial settings. Designed for potential B2B partnerships with alumni associations and educational institutions.
**AI Chat Assistant:** Intelligent chat assistant powered by OpenAI (via Replit AI Integrations) that helps users navigate the platform, create memorials, and understand features. Features include real-time streaming responses, persistent message history, and empathetic support tailored to the memorial platform context. Accessible via floating button on all pages.
**Revenue Model:** Configurable platform fees (2.5%-5%) on fundraisers and donations, with higher fees for celebrity memorials.

### System Design Choices
The system prioritizes privacy with an invite code system for private memorials, optional public settings, and role-based admin permissions. It is built for scalability and maintainability with a clear separation of concerns between frontend and backend.

## Mobile App Configuration
**Android App Icons:** Properly configured adaptive icons using Google Play badge artwork:
- Foreground layer: assets/icon-foreground.png (1024x1024 with proper padding)
- Background layer: Solid color #1a0f29 (theme color) defined in values/ic_launcher_background.xml
- All 48 mipmap density assets generated via capacitor-assets
- Adaptive icon XML files configured without insets for full-bleed backgrounds
- Ready for Google Play Store submission

**Build System:** GitHub Actions CI/CD pipeline configured for automated Android .aab builds with secure keystore management (see GITHUB_ACTIONS_BUILD_GUIDE.md)

## External Dependencies
*   **Stripe**: Payment processing.
*   **`qrcode` library**: QR code generation.
*   **Google Fonts**: Crimson Text and Inter.
*   **Radix UI**: Accessible UI primitives.
*   **Lucide React**: Icon library.
*   **Capacitor**: Native mobile app features and Android build system.
*   **Google Analytics**: Usage analytics and tracking.
*   **Plausible Analytics**: Privacy-focused web analytics.
*   **ConnectNetwork/GTL, ViaPath Technologies, Securus Technologies**: Integrations for the prison access system.