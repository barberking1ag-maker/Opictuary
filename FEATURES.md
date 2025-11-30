# Opictuary - Complete Feature List

## Platform Overview
Opictuary is a compassionate digital memorial platform with a rich purple and gold design philosophy, offering comprehensive memorial management, social features, business partnerships, and advanced scheduling capabilities.

---

## 🎨 Core Memorial Features

### 1. Memorial Creation & Management
- **Create Memorials**: Full memorial creation with photos, videos, biography, dates
- **Multi-Faith Customization**: Customizable themes for different religious and cultural traditions
- **Privacy Controls**: Public memorials or private with invite-code access
- **Memorial Admin System**: Multi-user admin access for family collaboration
- **Memorial Gallery**: Interactive photo and video galleries with lightbox viewing
- **QR Code System**: Generate printable QR codes for tombstones and memorial cards

### 2. Interactive Memorial Gallery
- **Lightbox Modal**: Full-size photo/video viewing with interactive controls
- **Heart Reactions**: Like individual photos/videos with real-time count display
  - Multi-layer duplicate protection (client lock + server idempotency + database constraints)
  - Toggle functionality with visual feedback (filled/unfilled heart)
- **Share Functionality**: Share memories via Web Share API or clipboard
- **Download Feature**: Direct download of photos to user's device
- **Keyboard Navigation**: Arrow keys for prev/next, Escape to close
- **Comments System**: Integrated commenting on individual memories
- **Condolences**: Per-photo/video condolence functionality
- **Guest Support**: Authenticated users and guests can participate (guests provide name)
- **Video Detection**: Auto-detect video formats (mp4, webm, ogg, mov) and platforms (YouTube, Vimeo)
- **Optimistic Updates**: Instant UI feedback with React Query synchronization

### 3. QR Code Memorial System
- **Professional PDF Downloads**: Purple/gold branded QR codes with scanning instructions
- **Three QR Code Types**:
  - Tombstone Upload: Allow cemetery visitors to upload photos/videos
  - Memorial View: Direct link to memorial page
  - General Upload: For memorial cards and keepsakes
- **Continuous Updates**: QR codes update automatically as families add content
- **Tagline Integration**: "Preserving Memories. Honoring Lives." on every QR code

### 4. Saved Memorials System
- **Save Memorials**: Bookmark memorials for quick access
- **Relationship Categorization**: Family, friend, colleague, etc.
- **Personal Notes**: Add private notes to saved memorials
- **PostgreSQL Persistence**: All data stored in database

---

## 🌟 Special Memorial Types

### 5. Celebrity Memorials
- **Interactive Profession Categories**: 10 category cards (Sports, Actors, Musicians, Royalty, etc.)
- **Sub-Profession Selection**: Specific fields (Basketball, Film, Pop Music, etc.)
- **4-Step Creation Wizard**:
  1. Basic Information (name, profession, dates, bio)
  2. Charity Information (donation platform integration)
  3. Achievements & Awards (JSON arrays with title, year, description)
  4. Family/Legal Verification (relationship, contact info)
- **Verification System**: All submissions default to "pending" status, require admin approval
- **Customization**: Memorial templates, custom theme colors, profession-specific stickers
- **Fan Content Platform**: Admin-only exclusive content upload for estates
  - Video messages, exclusive photos, behind-the-scenes content, tribute videos
  - Draft management with publish/unpublish controls
  - View tracking for analytics
  - Estate integrity (no public comments to prevent spam)

### 6. Essential Worker Memorials
- **Category-Specific Forms**: Police, Fire, Medical, Military
- **2-Step Creation Wizard**:
  1. Basic Information (name, profession, department, years of service, bio)
  2. Professional Details (rank, badge number, unit, certifications, etc.)
- **Dynamic Fields**: Category-specific fields (deployments, specializations, precincts)
- **Professional Badges**: Display rank, badge number, unit details on memorial cards
- **Line-of-Duty Status**: Honor those who died in service
- **Database Schema**: Extended table with dedicated columns for professional credentials

### 7. Self-Written Obituaries
- **Pre-Write Your Story**: Write your own obituary in advance
- **Personal Touch**: Control your own narrative and legacy
- **Future Activation**: Can be activated by family when needed

---

## 📅 Events & Scheduling

### 8. Memorial Events System
- **Event Types**: Balloon releases, candlelight vigils, memorial picnics, BBQs, tree plantings, charity walks, scholarship announcements
- **RSVP Tracking**: Guest list management with attendance confirmation
- **Email & SMS Notifications**: Automatic reminders with `sendReminders` flag
- **Location Management**: Event locations with details for attendees
- **Database Integration**: `memorialEvents` and `memorialEventRsvps` tables

### 9. Future Messages System (Scheduled Messages)
- **Message Scheduling**: Schedule messages for future delivery to loved ones
- **Event Types**: Birthdays, graduations, weddings, anniversaries, holidays, custom events
- **Pre-Written Templates**: Library of compassionate message templates
- **Recurring Messages**: Yearly, monthly, or custom recurrence patterns
- **Email Delivery**: Automatic email delivery on scheduled dates
- **Media Attachments**: Attach photos/videos to future messages
- **Draft Management**: Save messages as drafts before scheduling
- **Status Tracking**: Draft, pending, sent, failed statuses
- **Per-Memorial Management**: Create/edit/delete messages from memorial pages
- **Dashboard View**: NEW - Comprehensive "Upcoming Messages" dashboard
  - View ALL upcoming messages across ALL memorials
  - Filter by: Upcoming, Next 7 Days, Drafts, Sent
  - Statistics: Messages in next 7 days, next 30 days, total upcoming
  - Quick navigation to memorial pages
  - Date sorting and status badges

---

## 🎭 Funeral Services

### 10. Funeral Program Creator
- **Program-Level Audio**: Background music for entire ceremony
- **Bluetooth Support**: `enableBluetoothAudio` flag and device name pairing
- **Item-Level Audio**: Individual audio clips for readings, eulogies, tributes, prayers
- **Audio Types**: Background music, readings, eulogies, musical tributes, prayers, silence/reflection
- **Program Structure**: Order of service with customizable items
- **PDF Export**: Printable funeral programs
- **Database Schema**: Extended with `backgroundAudioUrl`, `enableBluetoothAudio`, `bluetoothDeviceName`, `audioUrl`, `audioType`

### 11. Live Streaming Capabilities
- **Memorial Service Streaming**: Live stream funeral services
- **Existing Infrastructure**: `memorialLiveStreams` table with full API routes
- **Embed Support**: Integration with streaming platforms
- **Viewer Tracking**: Monitor who's watching
- **Session Management**: Time-limited access and duration tracking

### 12. Memorial Documentaries
- **Video Hosting**: Upload and host memorial video documentaries
- **Chapter System**: JSON array of chapters with timestamps for easy navigation
- **Captions/Subtitles**: Text array for accessibility
- **Privacy Controls**: Public or private documentaries
- **View Tracking**: Analytics with atomic view count increment
- **Thumbnail Support**: Custom thumbnails for video previews
- **Database Schema**: `memorialDocumentaries` table with full CRUD API

---

## 💰 Fundraising & Donations

### 13. Memorial Fundraising (Stripe Integration)
- **Existing Stripe System**: Complete Stripe integration for donations
- **Fundraiser Creation**: Set goals and track progress
- **Donation Tracking**: Full donation history and analytics
- **Platform Fees**: Configurable 2.5%-5% platform fees
- **Celebrity Memorial Fees**: Higher fees for celebrity memorial fundraisers
- **API Routes**: `/api/fundraisers` endpoints fully implemented

---

## 🤝 Business Partnerships

### 14. Funeral Home Partnership System
- **Partner Registration**: Funeral homes can sign up
- **Referral Tracking**: Track referrals from platform
- **Commission Management**: Automated commission calculations
- **Payout System**: Partner payout tracking and management

### 15. Flower Shop Partnership System
- **20% Commission Model**: Revenue sharing with florists
- **Location-Based Search**: Find local flower shops
- **Sympathy Flower Delivery**: Order flowers for memorials
- **Order Tracking**: Track flower delivery status
- **Commission Management**: Automated flower commission tracking

### 16. Advertisement Platform
- **Memorial Page Ads**: Respectful advertising opportunities
- **Advertiser Submission**: Apply to advertise on platform
- **Admin Review**: Advertisement approval workflow
- **Analytics Tracking**: Ad performance metrics

---

## 🔒 Special Access Systems

### 17. Prison Access System
- **Secure Access**: Monitored access for incarcerated individuals
- **Identity Verification**: Verification of prisoner identity
- **Payment Integration**: ConnectNetwork/GTL, ViaPath, Securus integrations
- **Time-Limited Tokens**: Session-based access with expiration
- **Audit Logging**: Complete audit trail of prison access sessions
- **Session Monitoring**: Track active sessions and duration

---

## 🗺️ Location & Navigation

### 18. Cemetery Location Mapping
- **GPS Coordinates**: Store latitude/longitude for burial sites
- **Cemetery Information**: Name, address, section, plot number
- **Map Integration Ready**: Prepared for Google Maps, Mapbox, OpenStreetMap
- **Visitor Guidance**: Help visitors find exact burial locations

---

## 📊 Analytics & Administration

### 19. Admin Dashboard
- **Real-Time Statistics**: Users, memorials, donations, revenue, page views
- **Platform Overview**: Comprehensive platform health monitoring
- **Authorization**: Role-based admin access at `/admin`
- **Screenshot Management**: Admin screenshot tools

### 20. Analytics Integration
- **Google Analytics 4**: General tracking and user behavior
- **Plausible Analytics**: Privacy-focused web analytics
- **Custom Database Tracking**: Internal page view and event tracking
- **Page View Analytics**: Track popular memorial pages

---

## 💚 Support & Resources

### 21. Grief Support System
- **Support Resources**: Curated grief support content
- **Articles & Guides**: Helpful information for grieving families
- **Support Hub**: Centralized support portal at `/support`
- **Resource Library**: Extensive grief resources database

---

## 👤 User Features

### 22. User Profile & Management
- **Replit Auth Integration**: OpenID Connect (OIDC) session-based authentication
- **User Settings**: Customizable user preferences
- **My Memorials**: Dashboard showing all user's memorials
- **Saved Memorials**: Quick access to bookmarked memorials
- **User Menu**: Account navigation and logout

---

## 📱 Mobile & PWA

### 23. Progressive Web App (PWA)
- **Smart Install Prompts**: Context-aware installation suggestions
- **Offline Support**: Service worker caching
- **Standalone Mode**: Full-screen app experience
- **iOS & Android**: Production-ready mobile app capabilities
- **Capacitor Integration**: Native mobile features ready

### 24. Mobile App Publishing Ready
- **Android/Google Play**: Capacitor build configuration
- **iOS/App Store**: App Store submission ready
- **Push Notifications**: Capacitor push notification support
- **Splash Screen**: Professional loading screen
- **Status Bar**: Native status bar customization

---

## 🎨 Design & Theming

### 25. Multi-Faith Theming
- **Rich Purple Theme**: 280° hue purple backgrounds
- **Gold Accents**: 45° hue gold highlights
- **"Dignity in Digital" Philosophy**: Respectful, timeless aesthetic
- **Custom Typography**: Crimson Text for headings, Inter for body
- **Radix UI Primitives**: Accessible component library
- **shadcn/ui Components**: Production-ready component system
- **Dark Mode Ready**: Theme switching capabilities

---

## 🔧 Technical Features

### 26. Database Architecture
- **PostgreSQL (Neon)**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database queries
- **25+ Tables**: Comprehensive data model
- **Migrations**: Safe schema updates with `npm run db:push`

### 27. API Architecture
- **80+ Endpoints**: Complete RESTful API
- **14 Feature Areas**: Organized route structure
- **Zod Validation**: Request/response validation
- **Session Authentication**: Secure user sessions
- **CSRF Protection**: Cross-site request forgery protection

### 28. Content Moderation
- **Server-Side Filtering**: Profanity filter before database persistence
- **Blocked Content**: Strong offensive language prevention
- **User-Generated Content**: All submissions moderated

---

## 🌐 Integration Capabilities

### 29. External Service Integrations
- **Stripe**: Payment processing (configured)
- **Replit Auth**: Authentication (configured)
- **Google Analytics**: Usage tracking (configured)
- **QR Code Generation**: `qrcode` library
- **Prison Services**: ConnectNetwork, ViaPath, Securus
- **Plausible Analytics**: Privacy-focused analytics

---

## 📄 Legal & Privacy

### 30. Privacy & Legal
- **Privacy Policy**: Comprehensive privacy documentation at `/privacy`
- **Terms of Service**: Platform terms and conditions
- **Data Protection**: Secure data handling practices
- **User Consent**: Clear consent mechanisms

---

## 🎯 Merchandise Services (Planned)

### 31. Memorial Merchandise Integration
- **Custom T-Shirts**: Memorial apparel services
- **Cardboard Cutouts**: Life-size memorial cutouts
- **Holographic Tributes**: Innovative memorial technology
- **Affiliate Tracking**: Partnership revenue tracking

---

## Summary Statistics

- **30+ Major Feature Sets**
- **80+ API Endpoints**
- **25+ Database Tables**
- **18+ Frontend Pages**
- **30+ Reusable Components**
- **Multi-Platform**: Web, iOS, Android
- **Complete Business Model**: B2B partnerships, advertising, platform fees, prison services

---

## Recent Additions (Latest Update)

### Upcoming Messages Dashboard
- **Centralized View**: See all scheduled messages across all memorials
- **Smart Filtering**: Upcoming, Next 7 Days, Drafts, Sent
- **Quick Statistics**: Messages in next 7/30 days, total upcoming
- **Easy Navigation**: Jump directly to memorial pages
- **Status Management**: Visual status badges and sorting

### Memorial Documentaries Backend
- **Complete API**: Full CRUD operations for video documentaries
- **Chapter Navigation**: Timestamp-based chapter system
- **View Analytics**: Track documentary views
- **Privacy Controls**: Public/private documentary settings
- **Database Ready**: Schema pushed and active

---

## Platform Philosophy

**"Preserving Memories. Honoring Lives."**

Opictuary combines cutting-edge technology with compassionate design to create a dignified space for memorializing loved ones. Our platform serves families, funeral homes, flower shops, and communities while maintaining the highest standards of respect and privacy.

---

*Last Updated: November 1, 2025*
