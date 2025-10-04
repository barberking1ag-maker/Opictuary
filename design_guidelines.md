# Memorial Platform Design Guidelines

## Design Approach

**Selected Approach:** Hybrid Reference-Based
- **Primary Inspiration:** Apple Memorial pages (elegant restraint), Instagram (photo/video sharing), GoFundMe (transparent fundraising)
- **Core Principle:** "Dignity in Digital" - Create a respectful, timeless space that honors life while supporting the grieving process

**Design Philosophy:** Balance emotional warmth with functional clarity. Every interaction should feel purposeful and respectful, never trivial or cluttered.

## Core Design Elements

### A. Color Palette

**Neutral Foundation (Default/Multi-faith):**
- Primary: 220 15% 25% (Deep slate - grounding, serious without being harsh)
- Surface: 220 20% 97% (Soft warm white)
- Text: 220 15% 15% (Near black with slight warmth)
- Borders: 220 15% 88% (Subtle, refined)

**Accent Colors (Sparingly):**
- Life Celebration: 35 65% 55% (Warm amber - only for celebratory moments like legacy events)
- Support Actions: 200 40% 50% (Calm blue - for helpful actions like grief resources)

**Religion-Specific Themes:**
The app dynamically adjusts to selected faith traditions:
- Christian: Soft purple and gold accents, cross motifs
- Jewish: Blue and white, Star of David patterns
- Islamic: Deep green and gold, geometric patterns
- Buddhist: Saffron and gold, lotus imagery
- Hindu: Saffron and marigold tones, Om symbols
- Non-religious: Maintain neutral palette with nature-inspired accents

### B. Typography

**Font Families:**
- Primary: 'Crimson Text' (serif) - Dignified, readable, timeless for headings and important content
- Secondary: 'Inter' (sans-serif) - Clean, accessible for body text and UI elements

**Hierarchy:**
- Hero/Page Titles: text-4xl to text-6xl, font-serif, font-semibold
- Section Headers: text-2xl to text-3xl, font-serif, font-medium
- Card Titles: text-xl, font-serif, font-medium
- Body Text: text-base, font-sans, leading-relaxed
- Metadata/Labels: text-sm, font-sans, text-slate-600

### C. Layout System

**Spacing Primitives:** Use tailwind units of 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Card gaps: gap-6 to gap-8
- Element margins: mb-4, mb-6, mb-8

**Grid Strategy:**
- Mobile: Single column (stack everything)
- Tablet: 2-column for photo galleries, features
- Desktop: 3-column max for memory galleries, 2-column for main content/sidebar

### D. Component Library

**Navigation:**
- Top nav: Transparent over hero, becomes solid white with subtle shadow on scroll
- Tab navigation for obituary sections (Timeline, Memories, Messages, Events)
- Floating action button for key actions (Add Memory, Leave Condolence)

**Cards & Content:**
- Memory Cards: Rounded-xl borders, soft shadows, hover lift effect (very subtle)
- Obituary Hero: Full-width with respectful gradient overlay (dark to transparent) over memorial photo
- Photo/Video Grid: Masonry layout with lightbox viewing
- Administrator Approval Queue: Distinct yellow-tinted cards for pending items

**Forms & Inputs:**
- Clean, generous input fields with soft focus rings (ring-2 ring-slate-300)
- Multi-step forms for obituary creation with progress indicator
- Date pickers for scheduled messages with calendar visual
- Rich text editor for condolences and messages

**Interactive Elements:**
- Primary Buttons: Solid with primary color, rounded-lg, px-6 py-3
- Secondary Buttons: Outline with backdrop-blur-md when over images
- Icon Buttons: Circular, subtle hover background
- Donation Progress: Horizontal bar with smooth animation, show amount/goal clearly

**Data Display:**
- Donor List: Avatar + name + amount in clean rows
- Event Calendar: Card-based with date badge, details, RSVP count
- Condolence Feed: Timeline-style with user avatar, message, timestamp
- Live Stream: 16:9 aspect ratio embed with participant count

**Modals & Overlays:**
- Invitation Code Entry: Centered modal with soft backdrop blur
- QR Code Display: Clean white card with high-contrast QR, download option
- Scheduled Message Preview: Card with lock icon, trigger date prominently displayed
- Religion Selector: Visual grid with symbols and color previews

### E. Unique Features Design

**Scheduled Messages:**
- Dashboard view: Calendar with message bubbles on future dates
- Message card: Envelope icon, recipient name, trigger event, preview text
- Sent notification: Gentle animation when code is sent to recipient

**QR Code Tombstone Feature:**
- Generate page: Preview tombstone with QR placement
- QR design: Memorial border frame option, weather-resistant reminder
- Linked content: Video player or image gallery with fade-in

**Legacy Event System:**
- Event card: Large date badge, event type icon, location map preview
- Notification badge: Subtle animation on "Legacy" button when event approaching
- RSVP interface: Simple yes/no with attendee count

**Flower Shop Integration:**
- "Send Flowers" button: Floral icon, connects to local shops
- Shop cards: Photo, name, distance, quick order button
- Delivery tracking: Timeline showing order → delivery → confirmation

**Grief Support Resources:**
- Floating help button: Always accessible in bottom right
- Resource cards: Icon, service type (hotline/counselor/religious leader), contact button
- Crisis mode: Prominent suicide prevention hotline if detected keywords

**Celebrity/Fan Obituaries:**
- Special badge/indicator for public memorial
- Donation gate: "$10 to [Charity Name] unlocks access"
- Transparent donation split: Show percentage to charity vs. platform
- Fan wall: Public condolences from supporters worldwide

## Images

**Hero Section:** Yes, large hero image
- Full-width memorial photo of the deceased (16:9 or 3:2 aspect ratio)
- Respectful dark gradient overlay (bottom to top) for text readability
- Name, dates, and primary action (Enter Code/Create Memorial) overlaid on image

**Additional Images:**
- Memory Gallery: User-uploaded photos in masonry grid
- Profile Photos: Circular avatars for users leaving condolences
- Event Images: Featured photo for legacy events
- Background Patterns: Subtle, religion-specific textures (very low opacity)

## Accessibility & Interactions

**Dark Mode:** Not default for this app - maintain light, hopeful tone unless user specifically requests
**Animations:** Minimal and respectful - gentle fades, no bouncy or playful effects
**Focus States:** Clear ring indicators for keyboard navigation
**Loading States:** Soft skeleton screens, never harsh spinners
**Error States:** Compassionate messaging, helpful recovery actions

## Platform Adaptation

**Mobile Priority:**
- Bottom navigation for main sections
- Swipeable photo galleries
- Simplified live stream controls
- One-tap donation amounts

**Desktop Enhancement:**
- Sidebar for navigation and quick actions
- Multi-column memory display
- Picture-in-picture for live streams
- Advanced filtering and search