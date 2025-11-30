# Memorial Platform (Opictuary)

## Overview
**Opictuary** is the world's first continuum memorial platform - a comprehensive remembrance operating system that keeps every chapter of a life story connected before, during, and long after memorial services.

**Brand Tagline:** "Honor every life, in every dimension."

**Platform Definition:** A memorial operating system that goes beyond traditional obituaries to capture the full story of every life - every achievement, every connection, every dimension of who someone truly was. Through adaptive, multi-faith storytelling, living legacy achievements, and always-on family collaboration, Opictuary transforms remembrance into an evolving ecosystem that's interactive, inclusive, and revenue-ready for partners.

**Key Capabilities:**
- Immersive memorial hubs with multimedia galleries
- AI-guided storytelling and chat assistance
- Scheduled future messages and time capsules
- QR-activated physical touchpoints
- **Continuum Celebrations Hub** with multi-faith holidays, birthdays, and weddings
  - 50+ multi-faith holidays (Hindu, Jewish, Islamic, Christian, Buddhist, Sikh, and more)
  - Birthday celebrations with Bluetooth playlists, live streaming, and shopping spree
  - Wedding gift registries with cash gift support
- Family tree integration
- GPS cemetery navigation
- Olympian/athletic legacy scoring
- Celebrity and alumni memorial systems
- Prison access for incarcerated loved ones
- Live streaming memorial services
- Crowdfunding and merchandise integration

**Business Model:** B2B partnerships with funeral homes, flower shops, correctional facilities, and alumni associations, generating revenue through platform fees, advertisements, partnerships, prison access services, and merchandise referrals. Protected by 22 provisional patents with $13.2M valuation.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The platform follows a "Dignity in Digital" design philosophy with a respectful, timeless aesthetic and multi-faith theming. It utilizes Radix UI primitives, shadcn/ui, a custom component library, and specific typography (Crimson Text, Inter). The frontend is a production-ready Progressive Web App (PWA) with offline support and standalone mode. Navigation is designed for feature discoverability, including specialized memorial types, a comprehensive main navigation dropdown, and a detailed footer. Accessibility features are implemented for WCAG compliance.

### Technical Implementations
**Frontend:** Built with React 18, TypeScript, Vite, Wouter, TanStack Query, and Tailwind CSS, featuring over 30 reusable components and 18+ distinct pages.
**Backend:** Developed using Express.js with Node.js and TypeScript, designed as a RESTful API with over 80 endpoints.
**Content Moderation:** Implements server-side profanity filtering.
**Authentication:** Integrates Replit Auth (OpenID Connect) for session-based authentication.
**Authorization:** Employs role-based access control.
**Data Storage:** Uses PostgreSQL (Neon serverless) with Drizzle ORM, comprising over 25 tables.
**Security:** Features Zod validation, whitelisted fields, session-based authentication, CSRF protection, protected routes, and lazy-loaded Stripe.

### Feature Specifications
**Memorial Photo & Video Gallery:** Supports interactive galleries with various media types, commenting, and sharing.
**Memorial QR Code System:** Generates printable QR codes linking to memorial pages with privacy-compliant analytics.
**Prison Access System:** Provides secure, monitored access to memorials for incarcerated individuals.
**Flower Shop Partnership System:** Connects users with local florists.
**Saved Memorials System:** Allows authenticated users to save and categorize memorials.
**Future Messages System:** Enables scheduling of future messages with templates, recurrence, and media attachments.
**Merchandise Services Integration:** Connects users with external services for physical memorial products.
**Essential Worker Memorial Creation System:** Guided creation flow for honoring essential workers.
**Celebrity Memorial Interactive System:** Enhanced platform for celebrity tributes with verification processes.
**Celebrity Fan Content System:** Exclusive content platform for celebrity memorial estates.
**Funeral Program Audio & Bluetooth System:** Integrates audio and Bluetooth connectivity for funeral service programs.
**Memorial Events System:** Comprehensive event planning with notifications and RSVP tracking.
**Cemetery Location Mapping:** Stores cemetery coordinates for future map integration.
**Birthday Celebration Platform:** Annual birthday wish system allowing visitors to submit heartfelt messages on the deceased's birthday, organized by year with relationship tracking.
**Olympian Memorial System:** Enhanced athletic memorial with detailed Olympic legacy scoring, medal tracking, career statistics, and Olympic Games history timeline.
**Alumni Memorial System:** Comprehensive system for honoring deceased alumni with university-themed design and creation wizards.
**AI Chat Assistant:** OpenAI-powered assistant for user support and navigation, accessible via a floating button.
**QR-Activated Physical Memorial Products System:** Full-stack e-commerce platform for physical memorial products with embedded QR codes, product catalog, customization wizard, order management, admin dashboard, and secure Stripe payment processing.
**Revenue Model:** Configurable platform fees on fundraisers/donations and revenue from physical memorial products.

### System Design Choices
The system prioritizes privacy with an invite code system for private memorials, optional public settings, and role-based admin permissions. It is built for scalability and maintainability with a clear separation of concerns.

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