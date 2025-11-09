# PROVISIONAL PATENT APPLICATION
## USPTO Form PTO/SB/16 - Provisional Application Cover Sheet

**Application Type:** Provisional Patent Application  
**Entity Status:** Micro Entity  
**Filing Fee:** $65

---

## COVER SHEET INFORMATION

**Title of Invention:**  
DYNAMIC QR CODE SYSTEM FOR MULTI-FUNCTION MEMORIAL ACCESS INCLUDING TOMBSTONE PHOTO UPLOAD AND PUBLIC CONTRIBUTION

**Inventor(s):**  
[YOUR FULL NAME]  
[YOUR FULL ADDRESS]  
[CITY, STATE, ZIP CODE]  
Citizenship: United States

**Correspondence Address:**  
[YOUR FULL NAME]  
[YOUR FULL ADDRESS]  
[CITY, STATE, ZIP CODE]  
Email: [YOUR EMAIL]  
Phone: [YOUR PHONE]

**Docket Number:** OPI-002-QR  
**Application Date:** [DATE OF FILING]

---

## WRITTEN DESCRIPTION OF THE INVENTION

### 1. FIELD OF THE INVENTION

This invention relates to QR code technology for memorial and cemetery applications and, more specifically, to a dynamic QR code system enabling multiple functionalities including tombstone photograph upload, memorial page viewing, and public photo/video contribution through a single scannable code affixed to grave markers or memorial cards.

### 2. BACKGROUND OF THE INVENTION

Current QR code memorial systems (Our Tributes, Turning Hearts, Monumark) provide static functionality: scanning the code displays a pre-existing memorial page. These systems cost $30-156 per QR code and offer only one-way information flow (view only, no contribution capability).

Limitations of existing memorial QR systems:
- **Static function:** Code only links to viewing a memorial page
- **No public contribution:** Visitors cannot upload photos or memories by scanning
- **Single-purpose:** Cannot support multiple use cases per code
- **No tombstone documentation:** No system for photographing the grave marker itself
- **Expensive:** Proprietary codes cost $30-156, limiting adoption

No existing system provides:
- Dynamic QR codes that enable both viewing AND contributing to memorials
- Tombstone photograph upload functionality directly from grave site
- Multi-function QR codes supporting three distinct workflows
- Public contribution capability for cemetery visitors
- Low-cost ($0) digital QR codes for funeral homes and families

### 3. SUMMARY OF THE INVENTION

The present invention provides a comprehensive dynamic QR code system for memorials comprising three distinct QR code types, each enabling different workflows:

**Type 1: Tombstone Photo Upload QR Code**
- Affixed to cemetery grave markers
- Scanning opens camera interface
- User photographs the tombstone
- Photo automatically uploaded to memorial page
- GPS coordinates and timestamp captured
- Memorial creator receives notification

**Type 2: Memorial View QR Code**
- Included on funeral programs, memorial cards
- Scanning opens memorial page directly
- No login required for public memorials
- Privacy-protected for invite-only memorials
- Tracks unique scans and geographic data

**Type 3: General Upload QR Code**
- Placed at memorial service venues, funeral homes
- Scanning opens contribution portal
- Visitors upload photos, videos, written memories
- Content enters moderation queue before publication
- Contributor can create account or remain anonymous

All three QR code types dynamically link to backend API endpoints that determine the appropriate workflow based on QR code metadata, enabling a single platform to support multiple use cases with context-aware functionality.

### 4. DETAILED DESCRIPTION OF THE INVENTION

#### 4.1 System Architecture

**Database Schema:**
```sql
qr_codes (
  id UUID PRIMARY KEY,
  memorial_id UUID FOREIGN KEY,
  qr_type ENUM('tombstone_upload', 'memorial_view', 'general_upload'),
  qr_code_url VARCHAR (generated URL),
  created_at TIMESTAMP,
  active BOOLEAN,
  scan_count INTEGER,
  last_scanned_at TIMESTAMP
)

qr_scans (
  id UUID PRIMARY KEY,
  qr_code_id UUID FOREIGN KEY,
  scanned_at TIMESTAMP,
  ip_address VARCHAR,
  user_agent VARCHAR,
  gps_latitude DECIMAL,
  gps_longitude DECIMAL,
  action_taken ENUM('viewed_memorial', 'uploaded_photo', 'uploaded_video', 'uploaded_memory')
)

tombstone_photos (
  id UUID PRIMARY KEY,
  memorial_id UUID FOREIGN KEY,
  qr_code_id UUID FOREIGN KEY,
  photo_url VARCHAR,
  uploaded_at TIMESTAMP,
  gps_coordinates POINT,
  cemetery_name VARCHAR (optional),
  uploaded_by_ip VARCHAR
)

public_contributions (
  id UUID PRIMARY KEY,
  memorial_id UUID FOREIGN KEY,
  qr_code_id UUID FOREIGN KEY,
  content_type ENUM('photo', 'video', 'memory'),
  content_url VARCHAR,
  caption TEXT,
  contributor_name VARCHAR (optional),
  contributor_email VARCHAR (optional),
  moderation_status ENUM('pending', 'approved', 'rejected'),
  uploaded_at TIMESTAMP
)
```

**Backend API Endpoints:**
```
POST /api/qr/generate
  Body: { memorial_id, qr_type }
  Returns: { qr_code_id, qr_code_url, download_url }

GET /api/qr/:qr_code_id/scan
  Returns: { redirect_url, qr_type, memorial_data }

POST /api/qr/:qr_code_id/upload-tombstone
  Body: { photo_file, gps_coordinates }
  Returns: { success, photo_url, memorial_id }

POST /api/qr/:qr_code_id/upload-contribution
  Body: { content_type, file, caption, contributor_info }
  Returns: { success, contribution_id, moderation_status }

GET /api/qr/:qr_code_id/analytics
  Returns: { scan_count, uploads, geographic_distribution }
```

**Frontend Workflows:**

**Workflow A: Tombstone Upload**
1. User scans tombstone QR code at cemetery
2. System detects qr_type = 'tombstone_upload'
3. Camera interface opens automatically
4. User photographs gravestone
5. Photo uploads with GPS coordinates
6. Success message: "Tombstone photo added to [Name]'s memorial"
7. Option to view full memorial page

**Workflow B: Memorial View**
1. User scans memorial card QR code
2. System detects qr_type = 'memorial_view'
3. Memorial page loads directly
4. For public memorials: immediate access
5. For private memorials: prompt for invite code
6. User can browse photos, videos, memories

**Workflow C: General Upload**
1. User scans upload QR code at funeral service
2. System detects qr_type = 'general_upload'
3. Contribution portal opens
4. User selects: Upload Photo, Upload Video, or Write Memory
5. Content uploads to moderation queue
6. Confirmation: "Your contribution awaits approval"
7. Option to create account for notification when approved

#### 4.2 QR Code Generation Process

**Step 1: Memorial Creator Initiates**
- Creator selects "Generate QR Codes" from memorial dashboard
- Options presented:
  - Tombstone Upload Code (for cemetery placement)
  - Memorial View Code (for funeral programs, cards)
  - General Upload Code (for service venues)
- Creator can generate all three or individual codes

**Step 2: QR Code Configuration**
- System generates unique UUID for qr_code_id
- Constructs URL: `https://opictuary.com/qr/{qr_code_id}`
- Embeds metadata in database linking to memorial_id and qr_type
- Generates QR code image using `qrcode` library
- Provides download options:
  - PNG (300 DPI for printing)
  - SVG (vector for large format)
  - PDF with instructions

**Step 3: QR Code Metadata Storage**
```javascript
{
  qr_code_id: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  memorial_id: "memorial-uuid",
  qr_type: "tombstone_upload",
  qr_code_url: "https://opictuary.com/qr/a1b2c3d4...",
  created_at: "2025-01-15T10:30:00Z",
  active: true,
  scan_count: 0,
  last_scanned_at: null
}
```

**Step 4: Physical Production Guidance**
- For tombstone codes: Weatherproof vinyl sticker (2"×2", 3"×3")
- For memorial cards: Printed on card stock
- For service venues: Foam board or acrylic stand (8.5"×11")
- Instructions PDF provided for self-printing or professional printing

#### 4.3 Dynamic Functionality Implementation

**Scan Detection & Routing:**
```javascript
// When QR code scanned, user arrives at:
GET https://opictuary.com/qr/:qr_code_id

// Backend route handler:
app.get('/qr/:qr_code_id', async (req, res) => {
  const qrCode = await db.findQRCode(req.params.qr_code_id);
  
  // Log scan event
  await db.logScan({
    qr_code_id: qrCode.id,
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    scanned_at: new Date()
  });
  
  // Increment scan count
  await db.incrementScanCount(qrCode.id);
  
  // Route based on QR type
  if (qrCode.qr_type === 'tombstone_upload') {
    res.redirect(`/upload-tombstone/${qrCode.memorial_id}?qr=${qrCode.id}`);
  } else if (qrCode.qr_type === 'memorial_view') {
    res.redirect(`/memorial/${qrCode.memorial_id}`);
  } else if (qrCode.qr_type === 'general_upload') {
    res.redirect(`/contribute/${qrCode.memorial_id}?qr=${qrCode.id}`);
  }
});
```

**Tombstone Upload Interface:**
```javascript
// /upload-tombstone/:memorial_id page
- Display: "Photograph the tombstone of [Deceased Name]"
- Auto-open camera on mobile devices
- Capture photo with GPS coordinates
- Upload to backend with metadata
- Display success confirmation
- Option: "View Full Memorial" button
```

**Public Contribution Interface:**
```javascript
// /contribute/:memorial_id page
- Display: "Add to [Deceased Name]'s Memorial"
- Tabs: Photos | Videos | Written Memories
- File upload with drag-and-drop
- Optional fields:
  - Your name (optional)
  - Your email (for notification - optional)
  - Caption/description
- Submit to moderation queue
- Confirmation message with expected approval timeline
```

#### 4.4 Content Moderation & Approval

**Moderation Queue:**
- All tombstone photos: Auto-approved (low risk)
- All public contributions: Require manual approval
- Memorial creator receives notification:
  - Email: "New contribution awaiting approval"
  - Dashboard badge: "3 pending contributions"

**Approval Workflow:**
- Creator reviews pending contributions
- Actions: Approve, Reject, Edit Caption
- If approved: Content published to memorial page
- If rejected: Contributor notified (if email provided)
- Contributor receives notification when approved:
  - Email: "Your contribution to [Name]'s memorial has been published"

**Spam & Abuse Prevention:**
- Rate limiting: Max 5 uploads per IP per hour
- Profanity filter on text content
- Image recognition for inappropriate content (optional)
- Report/flag system for published content

#### 4.5 Analytics & Tracking

**QR Code Performance Metrics:**
- Total scans
- Unique visitors (by IP)
- Geographic distribution (GPS coordinates from scans)
- Time-based scan patterns (peak times/days)
- Conversion rate: scans → contributions
- Popular QR type (which workflow most used)

**Memorial Creator Dashboard:**
```
QR Code Analytics:
- Tombstone Upload Code: 127 scans, 45 photos uploaded
- Memorial View Code: 342 scans, 89 unique visitors
- General Upload Code: 56 scans, 23 contributions

Geographic Map:
- Interactive map showing scan locations (GPS clusters)
- Cemetery visit frequency over time

Recent Activity:
- 15 tombstone photos added in last 30 days
- 8 public contributions pending approval
- 234 total memorial views from QR scans
```

#### 4.6 Cemetery & Funeral Home Partnership Integration

**For Cemeteries:**
- Bulk QR code generation for existing grave markers
- Partnership program: Cemeteries offer "Digital Memory Upgrade" service
- Revenue share: Cemetery receives $10-20 per QR code installation
- Cemetery map integration: Link GPS coordinates to cemetery plot maps

**For Funeral Homes:**
- White-label QR codes with funeral home branding
- Included in funeral packages automatically
- Funeral home receives credit on memorial pages
- "In partnership with [Funeral Home Name]" badge

**Merchandising Opportunities:**
- Pre-printed QR stickers sold to funeral homes (bulk pricing)
- Custom engraved QR plaques for grave markers
- Memorial cards with embedded QR codes
- Digital funeral programs with QR access

### 5. CLAIMS OF INVENTION

**Primary Claim:**
A dynamic QR code system for memorial applications comprising: (a) a QR code generation module creating three distinct code types - tombstone upload, memorial view, and general upload - each linked to a unique memorial; (b) a scan detection and routing module that determines appropriate workflow based on QR code type; (c) a tombstone photograph upload interface enabling direct photo capture and GPS-tagged storage when scanning cemetery-placed codes; (d) a public contribution portal allowing visitors to upload photos, videos, or written memories when scanning contribution codes; and (e) a content moderation system requiring approval before publishing user-generated content.

**Dependent Claims:**

1. The system of claim 1 wherein the tombstone upload QR code automatically opens camera interface upon scanning and captures GPS coordinates with each photo.

2. The system of claim 1 wherein the memorial view QR code provides immediate access for public memorials and prompts for invite code for private memorials.

3. The system of claim 1 wherein the general upload QR code enables anonymous contribution or optional account creation for approval notifications.

4. The system of claim 1 wherein all QR code scans are logged with timestamp, IP address, user agent, and GPS coordinates for analytics.

5. The system of claim 1 wherein the content moderation system auto-approves tombstone photos but requires manual review for public contributions.

6. A method for enabling public memorial contributions via QR codes comprising: generating a unique QR code linked to a memorial and designated as one of three types (tombstone upload, memorial view, general upload); detecting QR code scan and routing user to appropriate interface based on type; capturing content (photo, video, or text) with associated metadata; submitting content to moderation queue; notifying memorial creator for approval; and publishing approved content to memorial page.

7. The method of claim 6 further comprising capturing GPS coordinates with all uploads and displaying geographic distribution of scans on analytics dashboard.

8. The method of claim 6 wherein tombstone upload codes are designed for weatherproof vinyl stickers affixed to grave markers and general upload codes are designed for funeral service venues.

### 6. ADVANTAGES OF THE INVENTION

**Over Static QR Memorial Codes (Our Tributes, Turning Hearts, Monumark):**
- Dynamic functionality: Single code supports multiple workflows
- Public contribution: Visitors can add content, not just view
- Tombstone documentation: Automatically capture grave marker photos
- Free QR generation: No $30-156 per-code cost
- Analytics: Track scans, geographic data, conversion rates

**For Memorial Creators:**
- Three QR codes cover all use cases (cemetery, funeral, service)
- Automated tombstone photo collection from cemetery visitors
- Centralized moderation of public contributions
- Analytics on memorial engagement and reach
- No recurring costs for QR codes

**For Cemetery Visitors:**
- Easy contribution: Scan and upload in seconds
- No app download required (web-based)
- Anonymous contribution option
- Immediate feedback on submission status

**For Funeral Homes & Cemeteries:**
- Value-added service for families
- Revenue opportunity: Charge for QR installation/printing
- Modern, tech-forward offering
- Partnership branding on memorial pages

### 7. COMMERCIAL APPLICATIONS

**Target Markets:**
- Families creating new memorials (primary users)
- Funeral homes offering digital memorial packages
- Cemeteries modernizing services with QR grave markers
- Memorial card printing companies
- Monument and headstone manufacturers

**Revenue Model:**
- Free QR code generation (drives platform adoption)
- Premium memorials include enhanced QR analytics
- Funeral home partnerships: $200-500/month for white-label QR codes
- Cemetery partnerships: $10-20 per QR installation fee
- Merchandise: Pre-printed QR stickers sold to funeral homes ($2-5 each)

**Market Size:**
- 2.8 million deaths annually in U.S.
- 19,000+ funeral homes
- 144,000+ cemeteries
- Estimated 40% adoption of digital memorials (1.1M annually)
- If 30% use QR codes: 330,000 memorials/year with QR codes

### 8. DRAWINGS AND DIAGRAMS

**Figure 1: System Architecture**
- Components: QR Code Generator, Scan Router, Upload Interfaces (3 types), Moderation Queue, Analytics Engine
- Data flow: Generate QR → Scan QR → Route by Type → Upload Content → Moderate → Publish

**Figure 2: Tombstone Upload Workflow**
- Steps: Cemetery Visitor → Scans Tombstone QR → Camera Opens → Captures Photo → GPS Tagged → Uploads → Auto-Approved → Published

**Figure 3: Memorial View Workflow**
- Steps: User → Scans Memorial Card QR → Memorial Page Loads → Public Access (or Invite Code Prompt) → Browse Content

**Figure 4: General Upload Workflow**
- Steps: Service Attendee → Scans Upload QR → Contribution Portal → Select Type → Upload Content → Moderation Queue → Approval → Published

**Figure 5: QR Code Types Visual Comparison**
- Three QR codes side-by-side
- Labels: "Tombstone Upload" (for cemetery), "Memorial View" (for cards), "General Upload" (for services)
- Use case examples for each

**Figure 6: Analytics Dashboard**
- Scan count chart over time
- Geographic map with scan locations (GPS clusters)
- Contribution conversion funnel
- Top-performing QR type

### 9. PRIOR ART DIFFERENTIATION

**Existing QR Memorial Systems:**
- **Our Tributes, Turning Hearts, Monumark:** Static view-only QR codes ($30-156)
- **Limitation:** No contribution capability, single function, expensive

**General QR Code Systems:**
- **QR code generators (QRCode Monkey, QR Code Generator):** Create codes but no memorial-specific workflows
- **Limitation:** No backend integration, no moderation, no analytics

**Novel Aspects of Present Invention:**
- First dynamic QR system with three distinct memorial workflows
- Tombstone photo upload functionality from cemetery
- Public contribution capability with moderation
- GPS-tagged scans and analytics
- Free QR generation for unlimited memorials
- Context-aware routing based on QR type metadata

### 10. IMPLEMENTATION DETAILS

**Technology Stack:**
- QR Code Generation: `qrcode` npm library
- Image Upload: AWS S3 or Cloudinary
- GPS Capture: Browser Geolocation API
- Backend: Node.js/Express with PostgreSQL
- Analytics: Custom dashboard with Chart.js

**Database Relationships:**
```
memorials (1) → (many) qr_codes
qr_codes (1) → (many) qr_scans
qr_codes (1) → (many) tombstone_photos
qr_codes (1) → (many) public_contributions
```

**Security Considerations:**
- Rate limiting on uploads (prevent spam)
- Content moderation before publication
- Watermarking on tombstone photos (cemetery name + date)
- IP tracking for abuse prevention
- CAPTCHA on contribution forms (optional)

### 11. CONCLUSION

This provisional patent application describes a novel dynamic QR code system for memorials that revolutionizes how families, cemetery visitors, and service attendees interact with digital memorials. Unlike existing static QR systems that only link to viewing a memorial page, this invention provides three distinct workflows - tombstone photo upload, memorial viewing, and public contribution - all through context-aware QR codes. The system's combination of dynamic routing, GPS-tagged content, moderation workflows, and comprehensive analytics differentiates it from all prior art. With an addressable market of 1.1+ million digital memorials annually in the U.S., this invention provides significant commercial value while enabling meaningful public participation in memorial preservation.

---

## DECLARATION (To be signed upon filing)

I hereby declare that all statements made herein of my own knowledge are true and that all statements made on information and belief are believed to be true; and further that these statements were made with the knowledge that willful false statements and the like so made are punishable by fine or imprisonment, or both, under Section 1001 of Title 18 of the United States Code.

**Inventor Signature:** _________________________  
**Date:** _________________________

---

**END OF PROVISIONAL PATENT APPLICATION**  
**Total Pages:** 10  
**Docket Number:** OPI-002-QR  
**Filing Date:** [TO BE ASSIGNED BY USPTO]
