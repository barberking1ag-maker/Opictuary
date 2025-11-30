# PROVISIONAL PATENT APPLICATION
## Dynamic QR Code Memorial Upload System - Summary

---

### SUMMARY OF THE INVENTION

The present invention provides a comprehensive QR code system that bridges physical memorial artifacts (tombstones, memorial cards, funeral programs) with digital memorial platforms, enabling instant memorial access and simplified photo/video upload through context-aware, multi-purpose QR codes.

#### Core Innovation

Unlike traditional QR codes that serve a single static purpose (viewing a website), the present invention provides **dynamic, context-aware functionality** where a single QR code can:

1. **Initiate Memorial Viewing** - Open memorial page in mobile browser
2. **Enable Photo/Video Upload** - Facilitate public content contribution
3. **Trigger Tombstone Photo Upload** - Specific workflow for grave site photos
4. **Provide General Memorial Access** - Gateway to all memorial features

The system determines the appropriate action based on user context, URL parameters, and user selection, providing a unified entry point to memorial interaction.

#### System Components

**1. QR Code Generation Module**

A software module that generates unique QR codes for each memorial, encoding:
- Memorial unique identifier
- Memorial platform base URL
- Optional context parameters (e.g., `?action=tombstone_upload`)
- Error correction level for durability

The QR code is designed to be:
- Printable on small surfaces (as small as 0.5" x 0.5")
- Scannable from various distances (6 inches to 3 feet)
- Readable even if partially damaged or weathered
- Compatible with all standard QR code readers

**Example QR Code Data:**
```
https://opictuary.com/m/abc123?source=tombstone
https://opictuary.com/m/abc123?source=memorial_card
https://opictuary.com/m/abc123?action=upload
```

**2. Context Detection System**

When a QR code is scanned, the system analyzes:
- **URL Parameters**: Explicit action/source indicators
- **User Agent**: Mobile vs. desktop device
- **Referrer**: Where scan originated
- **Time Context**: Recent funeral vs. years later
- **Location** (optional): If geolocation enabled, detect if at cemetery

Based on this analysis, the system presents context-appropriate options:

**Tombstone QR Scan (at Cemetery):**
```
Welcome to John Smith's Memorial

What would you like to do?
● Take and upload tombstone photo
● View memorial page
● Upload other photos/videos
```

**Memorial Card QR Scan:**
```
John Smith Memorial (1950-2024)

Select an action:
● View memorial page
● Upload photos/videos
● Send condolences
```

**3. Upload Interface Module**

A mobile-optimized web interface that enables frictionless content upload:

**Key Features:**
- **No App Required**: Works in mobile browser (iOS Safari, Android Chrome)
- **No Account Required**: Upload without registration
- **Minimal Form**: Name (optional), relationship (optional), photo/video files
- **Multi-File Support**: Upload multiple photos/videos at once
- **Large File Handling**: Supports video files up to 500MB
- **Progress Indication**: Real-time upload progress bar
- **Error Recovery**: Resume interrupted uploads

**Upload Flow:**

1. **Scan QR Code** → Opens upload page on smartphone
2. **Select Upload Type**:
   - Tombstone photo (current grave appearance)
   - General photos (family memories, old photos)
   - Videos (funeral service, family tributes)
3. **Select Files** → Opens camera or photo library
4. **Optional Info**:
   - Your name (optional, can be anonymous)
   - Relationship to deceased (optional)
   - Photo description (optional)
5. **Upload** → Files transferred to cloud storage
6. **Moderation Queue** → Content awaits family approval
7. **Confirmation** → "Thank you! Your photos will appear after family review."

**4. Tombstone Photo Workflow**

A specialized upload path for cemetery visitors photographing graves:

**Unique Features:**
- **Pre-Categorization**: Automatically tagged as "tombstone photo"
- **Date Stamping**: Records when photo was taken
- **Location Tagging** (optional): GPS coordinates of grave
- **Condition Documentation**: Creates timeline of grave appearance over years
- **Auto-Grouping**: All tombstone photos grouped in separate gallery section

**Use Cases:**
- Family visits grave on anniversary, uploads current condition
- Descendants decades later see how grave looked in different eras
- Cemetery visitors contribute to visual history of memorial
- Seasonal variations documented (grave in spring, summer, fall, winter)

**Example Timeline:**
- 2024: Fresh tombstone installation
- 2025: One year later, flowers and decorations
- 2030: Weathered appearance, patina development
- 2050: Descendant's visit, historical documentation

**5. Physical Product Integration**

The QR code system is designed for integration into diverse physical memorial products:

**A. Tombstone Plaques**

**Materials:**
- Weather-resistant anodized aluminum
- Stainless steel with laser-etched code
- Granite with engraved code
- Ceramic with fired-on code

**Specifications:**
- Size: 2" x 2" to 4" x 6"
- QR code size: Minimum 1" x 1" for 3-foot scan distance
- Mounting: Adhesive backing or screw holes
- Durability: 20+ year outdoor lifespan
- UV resistance: Code remains scannable despite sun exposure
- Water resistance: Sealed against rain and moisture

**Mounting Locations:**
- Front of tombstone (below epitaph)
- Side of monument base
- Dedicated memorial plaque next to grave

**B. Memorial Cards (Prayer Cards)**

**Format:**
- Standard size: 2" x 3.5" (business card size)
- Cardstock: 14pt or 16pt thickness
- Coating: UV coating or lamination for durability

**Design Integration:**
- QR code on reverse side (back of card)
- Size: 0.75" x 0.75" for close-range scanning
- Surrounding text: "Scan to view memorial & share photos"
- Maintains traditional memorial card aesthetic on front

**Distribution:**
- Printed in sets of 100-300 per memorial
- Distributed at funeral service
- Mailed to distant family members
- Included in thank-you cards
- Kept in wallets and Bibles for years

**C. Funeral Programs**

**Integration Options:**
- QR code on back cover
- QR code on inside back page
- QR code next to order of service

**Functionality:**
- Attendees can upload photos from service in real-time
- Scan during memorial to access photo slideshow
- Post-service upload of personal memories

**6. Content Moderation System**

Since QR codes enable public upload, robust moderation is essential:

**Pre-Publication Review:**
- All uploads enter moderation queue
- Memorial owner receives notification of new uploads
- Owner can approve, reject, or edit before publishing

**Automated Filtering:**
- Profanity detection in descriptions
- Inappropriate image detection (AI-powered)
- Duplicate photo detection
- File format validation
- File size limits (photos: 50MB, videos: 500MB)

**Moderation Interface:**
Memorial owner sees:
```
New Uploads Pending Review (3)

1. Tombstone Photo
   Uploaded by: Anonymous
   Date: November 10, 2024
   [Preview image]
   [Approve] [Reject] [Edit Details]

2. Memorial Service Video (2:34)
   Uploaded by: Sarah Johnson (daughter)
   Description: "Dad's eulogy from the service"
   [Preview]
   [Approve] [Reject]

3. Family Photo (5 photos)
   Uploaded by: Mike Smith
   Description: "Family reunion 2015"
   [Preview]
   [Approve All] [Review Individually]
```

**Approval Options:**
- **Auto-Approve**: Owner can pre-approve specific people or all uploads
- **Manual Review**: Each upload requires owner approval
- **Delegated Moderation**: Owner can designate other family members as moderators

**7. Analytics and Tracking**

The system tracks QR code usage to provide insights:

**Memorial Owner Dashboard:**
```
QR Code Activity - Last 30 Days

Scans: 47 total
├─ Tombstone QR: 12 scans
├─ Memorial Cards: 28 scans
└─ Funeral Program: 7 scans

Uploads: 23 items
├─ Tombstone Photos: 4
├─ Family Photos: 15
└─ Videos: 4

Scan Locations:
├─ Mobile (iOS): 32
├─ Mobile (Android): 13
└─ Desktop: 2

Most Active Day: November 2 (funeral date) - 19 scans

Conversion Rate:
Scans → Uploads: 48.9% (23 uploads / 47 scans)
```

**Business Intelligence:**
- Which QR placement drives most engagement (tombstone vs. card vs. program)
- Time between funeral and ongoing QR scans (engagement decay curve)
- Upload conversion rates
- Content type preferences

**8. Multi-Memorial Management**

For funeral homes and memorial service providers managing hundreds or thousands of memorials:

**Bulk QR Code Generation:**
- Generate QR codes for multiple memorials simultaneously
- Export codes as PNG/SVG for print production
- Batch integration with memorial card printing services
- Automated code generation upon memorial creation

**Integration with Funeral Home Software:**
- API connections to funeral home management systems
- Automatic QR code generation when obituary is created
- Seamless handoff from funeral home to family
- White-label options for funeral home branding

---

### KEY TECHNICAL INNOVATIONS

**Innovation 1: Context-Aware Multi-Purpose QR Code**

Traditional QR codes encode a static URL leading to a single destination. The present invention encodes a **dynamic entry point** that adapts behavior based on:
- URL parameters embedded in code
- User device characteristics
- Time since memorial creation
- User's selected action

This enables a **single QR code** to serve multiple purposes rather than requiring separate codes for viewing vs. uploading.

**Innovation 2: Tombstone Photo Categorization**

The system recognizes **tombstone photos** as a distinct content type requiring special handling:
- Automatic categorization separate from general photos
- Timeline-based organization showing grave evolution
- Optional geolocation tagging for cemetery mapping
- Seasonal and condition documentation

No prior memorial QR system provides specialized tombstone photo workflows.

**Innovation 3: Public Upload with Family Moderation**

The system balances two competing needs:
- **Public access**: Anyone with QR code can upload
- **Family control**: Memorial owners moderate before publication

The moderation queue system provides this balance, enabling broad content collection while maintaining family authority over published content.

**Innovation 4: Physical Artifact Integration**

The QR code design accommodates diverse physical memorial products:
- Weather-resistant tombstone plaques (20+ year lifespan)
- Small memorial cards (0.75" x 0.75" minimum)
- Multi-page funeral programs

Each physical format has optimized QR code size, error correction level, and contextual parameters.

**Innovation 5: No-App Upload Flow**

Mobile upload works entirely in web browser:
- No app download required
- No account creation required
- Native device camera integration
- HTML5 file upload with progress tracking
- Works on iOS and Android identically

This removes all friction from public contribution process.

---

### OPERATIONAL SCENARIOS

**Scenario 1: Tombstone Visitor (Distant Relative)**

1. Cousin visiting cemetery for first time in 20 years
2. Finds grave, sees QR code plaque on tombstone
3. Scans code with iPhone camera
4. System detects tombstone context, offers: "Upload current tombstone photo?"
5. Cousin takes photo of grave, adds name: "Jennifer (cousin)"
6. Photo uploads to memorial's tombstone gallery
7. Memorial owner (deceased's daughter) receives notification
8. Approves photo, now visible in memorial's "Tombstone Photos Over Time" section
9. Other family members see how grave looks today

**Scenario 2: Memorial Card Holder (Friend from Funeral)**

1. Attended funeral, received memorial card, kept it in wallet
2. Six months later, finds old photos from college days with deceased
3. Scans QR code on memorial card
4. System opens upload interface
5. Selects 3 photos from college (1995-1998)
6. Adds description: "From our fraternity days at State College"
7. Uploads photos
8. Memorial owner reviews and approves
9. Photos appear in memorial gallery with attribution: "Shared by Mark T."

**Scenario 3: Funeral Program Attendee (Real-Time Upload)**

1. Attending funeral service, receives program with QR code
2. During service, emotional moment inspires photo sharing
3. Scans QR code during service
4. Uploads video of deceased from family reunion two years ago
5. Video enters moderation queue
6. Later that evening, memorial owner approves
7. Video appears in memorial, other funeral attendees notified

**Scenario 4: Cemetery Visitor (Stranger)**

1. Walking through historic cemetery
2. Notices interesting tombstone with QR code
3. Scans out of curiosity
4. Views memorial page of person buried there (1890-1965)
5. Fascinated by their history
6. Shares memorial link with genealogy research group

---

### ADVANTAGES OVER PRIOR ART

**vs. Static QR Tombstone Plaques:**
- Prior art: View-only links to memorial page
- Present invention: View AND upload from same code
- Prior art: Single-purpose code
- Present invention: Context-aware multi-purpose functionality

**vs. Manual Memorial Website Access:**
- Prior art: User must search for memorial or remember URL
- Present invention: Instant access via QR scan
- Prior art: Upload requires finding website, creating account
- Present invention: Upload in 30 seconds, no account needed

**vs. Separate QR Codes for Each Function:**
- Prior art: Different codes for view vs. upload (if upload exists at all)
- Present invention: Single code adapts to user intent
- Prior art: Cluttered tombstone with multiple codes
- Present invention: Clean design with single code

---

### SCALABILITY AND BUSINESS MODEL

**Technical Scalability:**
- Cloud-hosted memorial platform handles unlimited QR scans
- CDN distribution for global low-latency access
- Elastic file storage for uploaded photos/videos
- Database indexed for fast memorial lookup by QR code ID

**Physical Product Revenue:**
- **Tombstone Plaques**: $50-$200 per plaque
- **Memorial Card Printing**: $50-$150 per 100 cards
- **Funeral Program Integration**: $25-$100 per service
- **Bulk Funeral Home Partnerships**: Subscription licensing

**Recurring Value:**
- Memorial families pay once for QR products
- QR codes continue generating engagement for decades
- Increased memorial platform stickiness (families stay because of QR investment)
- Network effects: More QR distribution = more uploads = richer memorials

---

**End of Summary Section**

*Total: Approximately 2,200 words / 4-5 pages*

**This Summary section is now ready for USPTO provisional patent filing.**

---

**Created:** November 10, 2025  
**For:** Opictuary Provisional Patent Application  
**Innovation:** Dynamic QR Code Memorial Upload System  
**Status:** Summary section complete
