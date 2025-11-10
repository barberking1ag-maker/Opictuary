# PROVISIONAL PATENT FILING GUIDE
**Step-by-Step Plan to File Two Provisional Patents for Opictuary**

---

## 📋 OVERVIEW

You're filing **Provisional Patent Applications (PPAs)** for two innovations:

1. **Prison Memorial Access System** (highest priority - $500M market, zero competition)
2. **Dynamic QR Code Upload System** (unique, defensible, high value)

**Why provisional patents?**
- ✅ Gives you **12 months** to file full utility patent
- ✅ Establishes "patent pending" status (use in marketing, investor pitches)
- ✅ Costs **$75-$3,000** (vs. $10K-$25K for full utility patent)
- ✅ Can test market fit before committing to expensive full patent
- ✅ Priority date secured (your filing date = your invention date)

**Timeline:**
- Provisional patent: File NOW → 12 months to decide on full utility patent
- Full utility patent: File within 12 months → 2-3 years to approval

---

## 💰 COST BREAKDOWN

### DIY Filing (Cheapest)

| Item | Cost |
|------|------|
| USPTO filing fee (micro entity) | $75 per patent |
| Patent drawings (DIY or Fiverr) | $0-$200 per patent |
| Patent attorney review (optional) | $500-$1,000 per patent |
| **TOTAL (2 patents, DIY)** | **$150-$2,650** |

### With Patent Attorney (Recommended)

| Item | Cost |
|------|------|
| USPTO filing fee (micro entity) | $75 per patent |
| Attorney drafting fee | $1,500-$3,000 per patent |
| Patent drawings (professional) | $200-$500 per patent |
| **TOTAL (2 patents, attorney)** | **$3,550-$7,150** |

**My recommendation:** 
- **DIY the provisional** ($150-$650 total for both)
- **Hire attorney for full utility** (12 months later, after you've raised capital)

**Why?** 
- Provisional patents don't need perfect claims or formatting
- You can write detailed descriptions yourself
- Save $7K now, spend it on marketing
- Use raised capital to hire attorney for full utility patent

---

## 🎯 MICRO ENTITY STATUS (Critical for Low Fees!)

**Micro entity = $75 filing fee (vs. $150 small entity, $300 large entity)**

**You qualify if you meet ALL of these:**
1. ✅ Filed fewer than 5 patent applications
2. ✅ Gross income < $200,000 (you qualify!)
3. ✅ Not assigned to organization with income > $200K
4. ✅ Not obligated to assign to such organization

**How to claim micro entity status:**
- Form: PTO/SB/15A (Certification of Micro Entity Status - Gross Income Basis)
- File WITH your provisional patent application
- Save $150-$225 per patent!

**Download form:** https://www.uspto.gov/patents/basics/using-legal-services/fee-schedule

---

## 📝 PROVISIONAL PATENT #1: PRISON MEMORIAL ACCESS SYSTEM

### Innovation Summary

**Title:** "Secure Memorial Access System for Incarcerated Individuals"

**Problem Solved:**
- 2.3 million incarcerated individuals cannot access online memorials
- Correctional facilities block most internet access
- Families want loved ones in prison to see memorials of deceased family

**Your Solution:**
- Secure kiosk system in prisons
- Identity verification via prison ID
- Time-limited access tokens (15-30 minutes)
- Pay-per-minute revenue model ($0.15/minute)
- Session monitoring and logging
- Integration with prison payment systems (JPay, Securus, GTL)

**Why it's patentable:**
1. **Novel:** No existing system connects prisons to memorial platforms
2. **Non-obvious:** Combines memorial access + prison security + payment systems in unique way
3. **Useful:** Solves real problem for 2.3M people + their families

---

### Step-by-Step Filing Process

#### Step 1: Write Detailed Description (2-3 days)

**What to include (10-20 pages):**

**A. Background of the Invention**
```
Field of the Invention:
This invention relates to secure digital memorial access systems, 
specifically enabling incarcerated individuals to access memorial pages 
of deceased loved ones via monitored kiosks in correctional facilities.

Background:
Currently, 2.3 million incarcerated individuals in the United States 
lack access to online memorial platforms due to internet restrictions 
in correctional facilities. When a family member passes away, 
incarcerated individuals cannot view photos, videos, tributes, or 
participate in digital memorials. This causes significant emotional 
distress and hinders the grieving process.

Existing systems like JPay and GTL provide email and messaging services 
but do not offer memorial access. Legacy memorial platforms like 
Legacy.com are web-based and incompatible with prison kiosk systems.

There is a need for a secure, monitored memorial access system that 
balances security requirements of correctional facilities with the 
emotional needs of incarcerated individuals.
```

**B. Summary of the Invention**
```
The present invention provides a secure memorial access system 
comprising:

1. A memorial platform accessible via web browser or mobile app
2. A secure access module for correctional facility kiosks
3. An identity verification system using prison ID credentials
4. A payment processing module integrated with prison payment providers
5. A time-limited access token system (15-60 minute sessions)
6. A session monitoring and logging system for security compliance
7. A content filtering system for inappropriate material
8. An administrative dashboard for correctional staff oversight

The system allows incarcerated individuals to:
- Request access to specific memorial pages
- Verify identity using prison-issued credentials
- Pay for access using existing prison payment accounts (commissary, JPay)
- View memorial content (photos, videos, tributes) in time-limited sessions
- All activity is logged and monitored for security

The system provides correctional facilities with:
- Full oversight of all memorial access requests
- Real-time monitoring of active sessions
- Content filtering to block inappropriate material
- Activity logs for security audits
- Revenue sharing from access fees
```

**C. Detailed Description of the Invention**

**Write 5-10 pages describing:**

1. **System Architecture**
   - Memorial platform (web/mobile)
   - Prison kiosk integration layer
   - Identity verification API
   - Payment processing module
   - Session management system
   - Monitoring/logging system

2. **User Flow (Incarcerated Individual)**
   ```
   Step 1: Individual approaches kiosk in facility
   Step 2: Logs in using prison ID credentials
   Step 3: Searches for deceased loved one's memorial
   Step 4: Requests access to memorial
   Step 5: System verifies relationship (optional: family member verification)
   Step 6: Payment processed via prison payment account ($0.15/min)
   Step 7: Access granted for 15-30 minute session
   Step 8: Individual views photos, videos, tributes
   Step 9: Session ends automatically after time limit
   Step 10: Activity logged for security audit
   ```

3. **User Flow (Family Member)**
   ```
   Step 1: Family creates memorial on Opictuary platform
   Step 2: Family adds incarcerated loved one's prison ID to access list
   Step 3: System notifies individual of pending access request
   Step 4: Individual requests access from kiosk
   Step 5: Family receives notification of access request
   Step 6: Family can approve/deny access
   Step 7: If approved, individual can purchase access time
   ```

4. **Technical Implementation**
   - Database schema (memorial_access_requests table)
   - API endpoints (/api/prison-access/request, /api/prison-access/verify)
   - Session token generation (JWT with 30-minute expiration)
   - Payment integration (Stripe + JPay/GTL APIs)
   - Content filtering (profanity filter, inappropriate content detection)
   - Monitoring webhooks (real-time activity to correctional staff)

5. **Security Features**
   - All sessions logged with timestamps, IP addresses, memorial IDs
   - Screenshots prohibited (detected and session terminated)
   - Download/print disabled
   - Kiosk mode (full-screen, no browser controls)
   - Automatic logout after inactivity
   - Emergency kill-switch for correctional staff

6. **Revenue Model**
   - $0.15/minute access fee (standard prison service rate)
   - Payment via prison commissary account or JPay
   - 70% to platform, 30% to correctional facility
   - Average session: 20 minutes = $3.00 revenue
   - 2.3M potential users × 2 sessions/year = $13.8M market

**D. Claims (1-3 pages)**

**Write 10-20 claims describing your invention:**

**Independent Claim 1 (Broadest):**
```
1. A memorial access system for incarcerated individuals, comprising:
   a. a memorial platform hosting digital memorial pages
   b. a secure access module configured to operate on kiosks in 
      correctional facilities
   c. an identity verification module configured to authenticate users 
      via prison-issued credentials
   d. a payment processing module configured to charge users on a 
      per-minute basis
   e. a session management module configured to grant time-limited 
      access to memorial pages
   f. a monitoring module configured to log all user activity
   wherein incarcerated individuals can access memorial pages of 
   deceased loved ones in a secure, monitored environment
```

**Dependent Claim 2 (Adds specific feature):**
```
2. The system of claim 1, wherein the session management module 
   terminates access after a predetermined time period of 15-60 minutes
```

**Dependent Claim 3:**
```
3. The system of claim 1, wherein the payment processing module 
   integrates with existing prison payment providers including JPay, 
   GTL, and Securus Technologies
```

**Dependent Claim 4:**
```
4. The system of claim 1, wherein the monitoring module sends 
   real-time activity logs to correctional facility administrators
```

**Continue with 6-16 more claims covering:**
- Family verification system
- Content filtering
- Emergency kill-switch
- Revenue sharing model
- Multi-memorial access packages
- Photo/video playback restrictions
- Relationship verification
- Audit trail generation

**Pro tip:** More claims = broader protection. Aim for 15-20 claims total.

---

#### Step 2: Create Patent Drawings (1-2 days)

**Required drawings (5-10 figures):**

**Figure 1: System Architecture Diagram**
```
+------------------+       +------------------+
|  Family Member   |       | Incarcerated     |
|  (Web/Mobile)    |       | Individual       |
+--------+---------+       | (Kiosk)          |
         |                 +--------+---------+
         |                          |
         v                          v
+------------------+       +------------------+
| Memorial         |<----->| Prison Access    |
| Platform         |       | Module           |
+--------+---------+       +--------+---------+
         |                          |
         |                          |
         v                          v
+------------------+       +------------------+
| Database         |       | Payment          |
| (Memorials,      |       | Integration      |
|  Access Logs)    |       | (JPay, GTL)      |
+------------------+       +------------------+
```

**Figure 2: User Flow (Incarcerated Individual)**
```
[Kiosk Login] → [Search Memorial] → [Request Access] → 
[Payment] → [View Memorial] → [Session End] → [Log Activity]
```

**Figure 3: User Flow (Family Member)**
```
[Create Memorial] → [Add Access List] → [Approve Request] → 
[Receive Notification] → [View Access Logs]
```

**Figure 4: Session Management Screen (Kiosk)**
```
+--------------------------------+
| OPICTUARY PRISON ACCESS        |
+--------------------------------+
| Memorial: John Doe (1950-2024) |
| Requested by: Inmate #12345    |
| Time Remaining: 18:32          |
| Cost: $0.15/minute             |
+--------------------------------+
| [View Photos] [View Videos]    |
| [Read Tributes] [End Session]  |
+--------------------------------+
| Session Activity: Logged       |
+--------------------------------+
```

**Figure 5: Admin Monitoring Dashboard**
```
+--------------------------------+
| CORRECTIONAL ADMIN DASHBOARD   |
+--------------------------------+
| Active Sessions: 3             |
| Today's Revenue: $47.25        |
+--------------------------------+
| Inmate #12345 | Memorial: J.Doe|
| Time: 12:34    | Cost: $2.40   |
| [Monitor] [End Session]        |
+--------------------------------+
```

**How to create drawings:**

**Option 1: DIY (Free)**
- Tools: PowerPoint, Google Slides, Figma
- Export as PNG or PDF
- Label everything clearly
- Black and white only (color optional)

**Option 2: Fiverr ($50-$200)**
- Search "patent drawings"
- Provide sketches + descriptions
- Turnaround: 2-5 days

**Option 3: Professional Patent Illustrator ($200-$500)**
- Higher quality, USPTO-compliant
- Search "patent illustrator" or use services like PatentDrawingExpress.com

**USPTO Requirements:**
- Black ink on white paper (or digital equivalent)
- Minimum 1 inch margins
- Clear, legible labels
- Figure numbers in sequential order
- Reference numbers match description

---

#### Step 3: Fill Out USPTO Forms (1 hour)

**Required Forms:**

**Form 1: Application Data Sheet (ADS) - Form PTO/SB/14**
- Download: https://www.uspto.gov/patents/basics/apply/forms
- Fill in:
  - Inventor name(s): Your name
  - Title of invention: "Secure Memorial Access System for Incarcerated Individuals"
  - Correspondence address: Your mailing address
  - Application type: Provisional

**Form 2: Micro Entity Certification - Form PTO/SB/15A**
- Download: Same USPTO forms page
- Certify that you meet all 4 micro entity requirements
- Sign and date

**Form 3: Cover Sheet**
- Simple 1-page document stating:
  ```
  PROVISIONAL PATENT APPLICATION
  
  Title: Secure Memorial Access System for Incarcerated Individuals
  
  Inventor: [Your Name]
  Address: [Your Address]
  
  Number of pages: XX
  Number of drawings: XX
  
  Submitted: [Date]
  ```

---

#### Step 4: Assemble Application Package (1 hour)

**Order of documents:**

1. Cover sheet
2. Application Data Sheet (ADS)
3. Micro Entity Certification
4. Specification (description + claims) - 10-20 pages
5. Drawings (Figures 1-10) - 5-10 pages
6. Optional: Supporting materials (screenshots, code snippets)

**Total package:** 20-40 pages

**Save as PDF:** `Opictuary_Prison_Access_Provisional_Patent.pdf`

---

#### Step 5: File with USPTO (1 hour)

**Two filing methods:**

**Option A: Online Filing (Recommended)**

1. **Create USPTO account:**
   - Go to: https://www.uspto.gov/patents/apply
   - Click "Patent Center" (new system)
   - Create account with email/password

2. **Start new application:**
   - Log in to Patent Center
   - Click "New Application"
   - Select "Provisional Application"

3. **Upload documents:**
   - Upload your PDF package
   - Fill in application details (title, inventor, etc.)
   - Attach ADS and Micro Entity forms

4. **Pay filing fee:**
   - Micro entity fee: $75
   - Pay via credit card or EFT

5. **Submit:**
   - Review everything
   - Click "Submit"
   - You'll receive confirmation email with application number

**Option B: Mail Filing (Slower)**

1. **Print application package** (3 copies)
2. **Mail to:**
   ```
   Commissioner for Patents
   P.O. Box 1450
   Alexandria, VA 22313-1450
   ```
3. **Include check:** $75 payable to "Director of the USPTO"
4. **Wait 2-4 weeks** for confirmation

**I recommend:** Online filing (faster, cheaper, easier)

---

#### Step 6: Receive Confirmation (1-7 days)

**What you'll get:**
- Serial number (e.g., 63/123,456)
- Filing date (this is your priority date!)
- Receipt confirming payment

**Save this information!** You need it to file full utility patent in 12 months.

**Use in marketing:**
- "Patent Pending" status
- Include in pitch deck: "Prison access system - U.S. Patent Pending"
- Tell investors: "We have 7 provisional patents filed"

---

## 📝 PROVISIONAL PATENT #2: DYNAMIC QR CODE UPLOAD SYSTEM

### Innovation Summary

**Title:** "Dynamic QR Code System for Uploading Content to Digital Memorials"

**Problem Solved:**
- Traditional memorials are physical only (no digital component)
- QR codes on tombstones are static (link to one memorial page)
- Visitors can't easily contribute content to memorials
- Families want ongoing photo/video uploads after funeral

**Your Solution:**
- Generate unique QR codes for each memorial
- Print codes on tombstones, memorial cards, funeral programs
- Scan code → upload photos/videos directly to memorial
- Multiple actions: View memorial, upload content, donate
- Trackable (know who visited, when, from where)

**Why it's patentable:**
1. **Novel:** QR codes exist, but not for dynamic memorial uploads
2. **Non-obvious:** Combines QR + memorial + multi-action upload system
3. **Useful:** Solves real problem for families and visitors

---

### Step-by-Step Filing Process

#### Step 1: Write Detailed Description (2-3 days)

**What to include (10-20 pages):**

**A. Background of the Invention**
```
Field of the Invention:
This invention relates to digital memorial systems, specifically 
dynamic QR codes that enable visitors to contribute content to 
online memorials via tombstone scanning.

Background:
Traditional memorials are static physical markers (headstones, plaques) 
with no digital component. Families create online memorials separately, 
requiring visitors to manually search for the memorial URL.

Some companies offer QR codes on tombstones that link to a memorial page. 
However, these are static links with single function (view only). 
Visitors cannot contribute photos, videos, or tributes without 
navigating complex web forms.

There is a need for a dynamic QR code system that enables multiple 
actions (view, upload, donate, share) from a single tombstone scan, 
while maintaining memorial privacy and security.
```

**B. Summary of the Invention**
```
The present invention provides a dynamic QR code system comprising:

1. A QR code generation module that creates unique codes for each memorial
2. A multi-action landing page triggered by QR code scan
3. An upload module for photos, videos, and tributes
4. A privacy control system (public vs. private memorials)
5. A location tracking module (cemetery coordinates from scan)
6. An analytics module (visitor tracking, scan metrics)
7. A printable template system (tombstone, memorial card, funeral program)

The system allows visitors to:
- Scan QR code on tombstone or memorial card
- Choose action: View memorial, upload content, donate, share
- Upload photos/videos taken at graveside
- Leave written tributes
- Make donations to memorial fund
- All without creating account (optional account for advanced features)

The system provides families with:
- Trackable QR codes (know who visited, when)
- Automatic content aggregation from multiple sources
- Privacy controls (approve uploads before public display)
- Print-ready QR designs for tombstones, cards, programs
- Cemetery location mapping
```

**C. Detailed Description of the Invention**

**Write 5-10 pages describing:**

1. **System Architecture**
   - Memorial platform (database of memorials)
   - QR code generation engine
   - Multi-action landing page router
   - Upload processing pipeline
   - Privacy/moderation system
   - Analytics tracking

2. **QR Code Generation Process**
   ```
   Step 1: User creates memorial on platform
   Step 2: System generates unique memorial ID (e.g., mem_abc123)
   Step 3: QR code created with URL: opictuary.com/qr/mem_abc123
   Step 4: QR design customized (colors, logo, memorial name)
   Step 5: Printable PDF generated
   Step 6: User downloads and sends to engraver/printer
   Step 7: QR code engraved on tombstone or printed on memorial card
   ```

3. **Visitor Flow (Scanning QR Code)**
   ```
   Step 1: Visitor uses smartphone to scan QR code on tombstone
   Step 2: Browser opens: opictuary.com/qr/mem_abc123
   Step 3: Landing page displays:
      - Memorial name & photo
      - Action buttons:
        [📖 View Memorial]
        [📸 Upload Photos]
        [💬 Leave Tribute]
        [💰 Donate]
        [🔗 Share]
   Step 4: Visitor selects action (e.g., Upload Photos)
   Step 5: Camera opens or file picker displayed
   Step 6: Visitor selects photo(s) from phone or takes new photo
   Step 7: Optional: Visitor adds caption/description
   Step 8: Photo uploaded to memorial (pending approval if private)
   Step 9: Success message displayed
   Step 10: Visitor can perform additional actions or exit
   ```

4. **Technical Implementation**
   - QR code library (qrcode.js, Google Charts API)
   - URL routing (/qr/:memorialId)
   - File upload handling (Multer, AWS S3)
   - Image processing (compression, thumbnail generation)
   - Geolocation capture (browser Geolocation API)
   - Analytics tracking (visitor IP, device, timestamp)
   - Moderation queue (if private memorial)

5. **Privacy & Security Features**
   - Public memorials: Uploads appear immediately
   - Private memorials: Uploads held in moderation queue
   - Family approves/rejects uploads via email notification
   - Spam detection (rate limiting, profanity filter)
   - DMCA compliance (copyright violation reporting)

6. **QR Code Customization Options**
   - Color schemes (match memorial theme)
   - Logo embedding (photo of deceased in center)
   - Size variations (1 inch to 12 inches)
   - Format options (SVG, PNG, PDF)
   - Print templates:
     - Tombstone engraving (3x3 inch)
     - Memorial card (2x2 inch)
     - Funeral program (1x1 inch)
     - Event signage (8x8 inch)

7. **Analytics & Tracking**
   - Total scans (all-time, monthly, weekly)
   - Unique visitors (IP-based)
   - Location data (cemetery coordinates)
   - Most popular actions (view > upload > donate)
   - Time-of-day patterns (weekends > weekdays)
   - Device types (90% mobile, 10% desktop)

**D. Claims (1-3 pages)**

**Write 10-20 claims describing your invention:**

**Independent Claim 1 (Broadest):**
```
1. A dynamic QR code system for digital memorials, comprising:
   a. a memorial platform hosting digital memorial pages
   b. a QR code generation module configured to create unique codes 
      for each memorial
   c. a multi-action landing page configured to present multiple 
      actions upon QR code scan
   d. an upload module configured to receive photos, videos, and 
      text tributes from visitors
   e. a privacy control module configured to moderate uploads based 
      on memorial privacy settings
   f. an analytics module configured to track scans, uploads, and 
      visitor behavior
   wherein visitors can scan a QR code on a physical memorial marker 
   and contribute content to the associated digital memorial
```

**Dependent Claim 2:**
```
2. The system of claim 1, wherein the multi-action landing page 
   presents options to view the memorial, upload content, donate 
   funds, or share the memorial with others
```

**Dependent Claim 3:**
```
3. The system of claim 1, wherein the upload module captures 
   geolocation data from the visitor's device to map cemetery locations
```

**Dependent Claim 4:**
```
4. The system of claim 1, wherein the privacy control module holds 
   uploads in a moderation queue for private memorials until approved 
   by the memorial creator
```

**Continue with 6-16 more claims covering:**
- QR code customization (colors, logos)
- Print templates for different surfaces
- Relationship verification for private memorials
- Visitor notification system (email alerts on new uploads)
- Analytics dashboard for memorial owners
- Multi-memorial QR codes (one code links to multiple memorials)
- Tombstone upload feature (photo of tombstone linked to memorial)
- Offline mode (cache memorial for offline viewing)

---

#### Step 2: Create Patent Drawings (1-2 days)

**Required drawings (5-10 figures):**

**Figure 1: System Architecture Diagram**
```
+------------------+       +------------------+
|  Visitor         |       |  Memorial        |
|  (Smartphone)    |       |  Creator         |
+--------+---------+       +--------+---------+
         |                          |
         | Scan QR                  | Create Memorial
         v                          v
+------------------+       +------------------+
| QR Code          |       | Memorial         |
| Landing Page     |<----->| Platform         |
+--------+---------+       +--------+---------+
         |                          |
         | Upload                   |
         v                          v
+------------------+       +------------------+
| Upload           |       | Moderation       |
| Module           |       | Queue            |
+------------------+       +------------------+
```

**Figure 2: QR Code on Tombstone**
```
+--------------------------------+
|                                |
|        JOHN DOE                |
|      1950 - 2024               |
|                                |
|   "Forever in our hearts"      |
|                                |
|     +--------+                 |
|     |  QR    |                 |
|     | CODE   | <--- Scan here  |
|     +--------+     to view     |
|                    memorial    |
+--------------------------------+
```

**Figure 3: Multi-Action Landing Page**
```
+--------------------------------+
| OPICTUARY                      |
+--------------------------------+
|  Photo of John Doe             |
|  John Doe (1950-2024)          |
+--------------------------------+
| [📖 View Memorial]             |
| [📸 Upload Photos]             |
| [💬 Leave Tribute]             |
| [💰 Donate to Memorial Fund]   |
| [🔗 Share Memorial]            |
+--------------------------------+
| 234 visitors • 47 photos       |
+--------------------------------+
```

**Figure 4: Upload Flow**
```
[Scan QR] → [Select Action: Upload] → [Choose Photos] → 
[Add Caption] → [Submit] → [Success/Pending Approval]
```

**Figure 5: Moderation Queue (Memorial Creator View)**
```
+--------------------------------+
| PENDING UPLOADS                |
+--------------------------------+
| Photo by Visitor #1            |
| Uploaded: Nov 10, 2024 2:34pm  |
| Location: Oakland Cemetery     |
| [Approve] [Reject] [View]      |
+--------------------------------+
| Photo by Visitor #2            |
| Uploaded: Nov 10, 2024 3:12pm  |
| [Approve] [Reject] [View]      |
+--------------------------------+
```

**Figure 6: Analytics Dashboard**
```
+--------------------------------+
| QR CODE ANALYTICS              |
+--------------------------------+
| Total Scans: 234               |
| Unique Visitors: 189           |
| Photos Uploaded: 47            |
| Tributes: 23                   |
| Donations: $1,240              |
+--------------------------------+
| Scan Activity (Last 30 Days)   |
| [Bar Chart Showing Daily Scans]|
+--------------------------------+
| Top Locations:                 |
| • Oakland Cemetery (145 scans) |
| • Memorial Service (67 scans)  |
| • Home (22 scans)              |
+--------------------------------+
```

---

#### Step 3: Fill Out USPTO Forms (1 hour)

**Same forms as Patent #1:**

1. Application Data Sheet (ADS) - Form PTO/SB/14
   - Title: "Dynamic QR Code System for Uploading Content to Digital Memorials"
   - Inventor: Your name

2. Micro Entity Certification - Form PTO/SB/15A
   - Same certification as Patent #1

3. Cover Sheet
   - Same format, updated title

---

#### Step 4: Assemble Application Package (1 hour)

**Order of documents:**

1. Cover sheet
2. Application Data Sheet (ADS)
3. Micro Entity Certification
4. Specification (description + claims) - 10-20 pages
5. Drawings (Figures 1-10) - 5-10 pages

**Total package:** 20-40 pages

**Save as PDF:** `Opictuary_QR_Upload_Provisional_Patent.pdf`

---

#### Step 5: File with USPTO (1 hour)

**Same process as Patent #1:**

1. Log in to USPTO Patent Center
2. Click "New Application"
3. Select "Provisional Application"
4. Upload PDF package
5. Pay $75 filing fee (micro entity)
6. Submit

**Total time:** 1 hour
**Total cost:** $75

---

## 📊 COMPLETE FILING TIMELINE

### Week 1: Research & Writing

**Days 1-3: Patent #1 (Prison Access System)**
- Day 1: Write background, summary (5-8 pages)
- Day 2: Write detailed description (10-15 pages)
- Day 3: Write claims (2-3 pages)

**Days 4-5: Patent #2 (QR Code System)**
- Day 4: Write background, summary, description (10-15 pages)
- Day 5: Write claims (2-3 pages)

### Week 2: Drawings & Forms

**Days 6-7: Create Drawings**
- Day 6: Patent #1 drawings (5-10 figures)
- Day 7: Patent #2 drawings (5-10 figures)

**Day 8: Fill Out Forms**
- Complete ADS forms (both patents)
- Complete Micro Entity certifications (both)
- Create cover sheets (both)

### Week 3: Assemble & File

**Day 9: Assemble Packages**
- Compile all documents for both patents
- Create final PDFs
- Review everything

**Day 10: File with USPTO**
- Create USPTO account
- File Patent #1 online
- File Patent #2 online
- Pay fees ($150 total)

**Day 11-17: Wait for Confirmation**
- Receive serial numbers
- Save confirmation emails
- Update investor materials with "Patent Pending" status

**Total time:** 10-17 days  
**Total cost (DIY):** $150-$650  
**Total cost (with attorney):** $3,550-$7,150

---

## 💡 PRO TIPS FOR PROVISIONAL PATENTS

### Do's:
✅ **Write as much detail as possible** (10-30 pages ideal)
✅ **Include drawings** (even rough sketches help)
✅ **Describe all possible variations** of your invention
✅ **Use clear, simple language** (don't worry about "patent-ese")
✅ **Include code snippets** if applicable
✅ **Screenshot your app** showing the features
✅ **Claim micro entity status** to save $150-$225 per patent
✅ **File before public disclosure** (pitching to investors counts!)

### Don'ts:
❌ **Don't skip the description** (most important part!)
❌ **Don't worry about perfect claims** (you can refine in full utility patent)
❌ **Don't disclose publicly before filing** (kills your patent rights!)
❌ **Don't wait too long** (file ASAP to secure priority date)
❌ **Don't forget to file full utility patent within 12 months**

---

## 🎯 AFTER YOU FILE (12-Month Countdown)

**You have 12 months to:**

1. **Use "Patent Pending" status** in all marketing
   - Update website, pitch deck, investor materials
   - Add to LinkedIn, Twitter bio
   - Tell investors: "2 patents pending, 5 more provisional applications in progress"

2. **Test market fit**
   - Validate that prison access system has demand
   - Test QR code adoption with funeral homes
   - Gather data to strengthen full utility patent

3. **Raise capital**
   - Use patents as leverage in fundraising
   - "We have strong IP moat with 7 patents pending"
   - Investors LOVE patents (defensibility)

4. **Decide on full utility patent (Month 10-12)**
   - Option A: File full utility patent ($10K-$25K with attorney)
   - Option B: Abandon provisional if market validation fails
   - Option C: File continuation if you need more time

5. **Hire patent attorney (if filing full utility)**
   - Use raised capital to hire attorney ($10K-$15K per patent)
   - Attorney will draft professional claims
   - Much higher chance of approval with attorney

---

## 💰 FUNDING YOUR PATENTS

**Where to get $150-$7,150 for filing:**

### Option 1: Self-Fund ($150 DIY)
- Use personal savings
- File DIY provisionals
- Hire attorney later (12 months) after raising capital

### Option 2: Angel Investor Advance ($3K-$7K)
- Ask angel investor for advance to file professional provisionals
- Include in overall seed round terms
- "We need $5K to file 2 patents professionally - can you advance this?"

### Option 3: Small Business Grant ($5K-$50K)
- SBIR/STTR grants (small business innovation research)
- State-level small business grants
- Minority/women-owned business grants
- Timeline: 3-6 months approval

### Option 4: Crowdfunding ($1K-$10K)
- Launch on Republic/Wefunder
- Pitch: "Help us protect our innovation with patents"
- Offer perks (lifetime free accounts, etc.)

**My recommendation:** DIY both provisionals for $150, then use raised capital to hire attorney for full utility patents.

---

## 📋 COMPLETE FILING CHECKLIST

### Patent #1: Prison Access System

**Phase 1: Writing**
- [ ] Background section (2-3 pages)
- [ ] Summary section (1-2 pages)
- [ ] Detailed description (10-15 pages)
  - [ ] System architecture
  - [ ] User flows (incarcerated individual, family)
  - [ ] Technical implementation
  - [ ] Security features
  - [ ] Revenue model
- [ ] Claims (15-20 claims, 2-3 pages)

**Phase 2: Drawings**
- [ ] Figure 1: System architecture
- [ ] Figure 2: User flow (incarcerated)
- [ ] Figure 3: User flow (family)
- [ ] Figure 4: Kiosk interface
- [ ] Figure 5: Admin dashboard
- [ ] Additional figures as needed

**Phase 3: Forms**
- [ ] Application Data Sheet (ADS)
- [ ] Micro Entity Certification
- [ ] Cover sheet

**Phase 4: Filing**
- [ ] Assemble PDF package
- [ ] Create USPTO account
- [ ] File online
- [ ] Pay $75 fee
- [ ] Receive confirmation

---

### Patent #2: QR Code Upload System

**Phase 1: Writing**
- [ ] Background section (2-3 pages)
- [ ] Summary section (1-2 pages)
- [ ] Detailed description (10-15 pages)
  - [ ] System architecture
  - [ ] QR code generation
  - [ ] Visitor flow
  - [ ] Technical implementation
  - [ ] Privacy/security
  - [ ] Analytics
- [ ] Claims (15-20 claims, 2-3 pages)

**Phase 2: Drawings**
- [ ] Figure 1: System architecture
- [ ] Figure 2: QR code on tombstone
- [ ] Figure 3: Multi-action landing page
- [ ] Figure 4: Upload flow
- [ ] Figure 5: Moderation queue
- [ ] Figure 6: Analytics dashboard

**Phase 3: Forms**
- [ ] Application Data Sheet (ADS)
- [ ] Micro Entity Certification
- [ ] Cover sheet

**Phase 4: Filing**
- [ ] Assemble PDF package
- [ ] File online (same USPTO account)
- [ ] Pay $75 fee
- [ ] Receive confirmation

---

## 🎯 NEXT STEPS

**This Week:**
1. Read this guide thoroughly
2. Start writing Patent #1 (prison access system)
3. Aim for 2-3 pages per day

**Week 2:**
1. Finish Patent #1 description
2. Start Patent #2 (QR code system)

**Week 3:**
1. Create all drawings (10-20 figures total)
2. Fill out USPTO forms

**Week 4:**
1. Assemble both packages
2. File both provisionals online
3. Celebrate "Patent Pending" status! 🎉

**Month 2-12:**
1. Use patents in fundraising
2. Build traction (5,000 users, $200K ARR)
3. Raise $500K-$750K seed round

**Month 10-12:**
1. Hire patent attorney ($10K-$15K per patent)
2. File full utility patents (before 12-month deadline!)
3. Full utility patents = 2-3 years to approval

---

## 📚 RESOURCES

**USPTO Resources:**
- Patent Center (filing system): https://patentcenter.uspto.gov
- Fee schedule: https://www.uspto.gov/patents/basics/using-legal-services/fee-schedule
- Forms: https://www.uspto.gov/patents/basics/apply/forms
- General info: https://www.uspto.gov/patents/basics

**Patent Drafting Help:**
- Nolo's "Patent It Yourself" book ($40, comprehensive DIY guide)
- YouTube: "How to Write a Provisional Patent" tutorials
- USPTO's free workshops: https://www.uspto.gov/learning-and-resources

**Patent Attorneys (For Full Utility Later):**
- UpCounsel: Find patent attorneys ($200-$400/hour)
- LegalZoom: Flat-fee patent services ($1,500-$3,000)
- Local patent bar: Search "patent attorney [your city]"

**Patent Drawing Services:**
- Fiverr: Search "patent drawings" ($50-$200)
- PatentDrawingExpress.com: Professional service ($150-$500)
- DIY: Use PowerPoint/Figma + export to PDF

---

## ⚠️ IMPORTANT WARNINGS

**1. Don't Publicly Disclose Before Filing**
- Pitching to investors = public disclosure
- File BEFORE sending pitch deck to anyone outside NDAs
- Once disclosed, you have 12 months to file (or lose rights)

**2. Don't Miss the 12-Month Deadline**
- Provisional patent expires after 12 months
- Must file full utility patent before expiration
- Missing deadline = lose priority date

**3. Don't File Too Many Provisional Patents**
- Each costs $75-$3,000
- You'll need to file full utility for each ($10K-$25K each)
- Focus on 2-3 highest-value patents first

**4. Don't Skip the Description**
- Claims are important, but description is CRITICAL
- Full utility patent can only claim what's in provisional description
- Write everything you can think of (more = better)

---

## 🎉 YOU'RE READY TO FILE!

**Summary:**
- **2 provisional patents** to file (prison access + QR code)
- **$150 total cost** (DIY, micro entity)
- **10-17 days** to complete
- **12 months** to file full utility patents
- **"Patent Pending"** status immediately
- **Use in fundraising** to show strong IP moat

**Next action:** Start writing Patent #1 description TODAY! 🚀

---

**Created:** November 10, 2025  
**For:** Opictuary Provisional Patent Applications  
**Priority:** Prison Access System (#1) + QR Code Upload System (#2)  
**Status:** Ready to file! Start writing today!
