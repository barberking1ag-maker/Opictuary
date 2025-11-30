# PROVISIONAL PATENT APPLICATION
## Dynamic QR Code Memorial Upload System - Claims

---

### CLAIMS

I claim:

**CLAIM 1 (Independent - Broadest System Claim)**

A dynamic QR code memorial access system, comprising:

(a) a memorial platform configured to host digital memorial pages, each memorial page comprising photos, videos, written tributes, and biographical information of a deceased person;

(b) a QR code generation module configured to generate unique QR codes for each memorial, said QR codes encoding URLs containing a memorial identifier and optional context parameters;

(c) a physical product integration system configured to print said QR codes on physical memorial artifacts selected from the group consisting of tombstone plaques, memorial cards, and funeral programs;

(d) a context detection module configured to analyze QR code scan requests and determine user intent based on URL parameters, user device type, and source artifact;

(e) a multi-purpose interface module configured to present different user flows based on determined intent, said flows including:
    (i) memorial viewing,
    (ii) photo and video upload,
    (iii) tombstone photo upload, and
    (iv) written tribute submission;

(f) a mobile upload interface configured to enable photo and video upload from smartphones without requiring app installation or account creation;

(g) a content moderation system configured to queue uploaded content for family review before publication to the memorial page;

wherein scanning a single QR code provides access to multiple memorial functions, and wherein public users can contribute photos and videos to memorials by scanning QR codes on physical memorial artifacts.

---

**CLAIM 2 (Dependent - Context-Aware Functionality)**

The system of claim 1, wherein the context detection module determines user intent by analyzing URL parameters encoded in the QR code, and wherein different QR codes for the same memorial encode different source parameters to indicate whether the code originated from a tombstone, memorial card, or funeral program.

---

**CLAIM 3 (Dependent - Tombstone QR Codes)**

The system of claim 1, wherein QR codes printed on tombstone plaques encode a source parameter indicating "tombstone," and wherein the multi-purpose interface module, upon detecting said tombstone source parameter, presents an option to upload a current photograph of the grave site.

---

**CLAIM 4 (Dependent - Tombstone Photo Categorization)**

The system of claim 3, wherein uploaded tombstone photos are automatically categorized separately from general memorial photos, and wherein said tombstone photos are organized chronologically to document the appearance of the grave site over time.

---

**CLAIM 5 (Dependent - Memorial Card QR Codes)**

The system of claim 1, wherein QR codes printed on memorial cards encode URLs without specific action parameters, and wherein the multi-purpose interface module presents an action menu allowing users to select between viewing the memorial page and uploading content.

---

**CLAIM 6 (Dependent - No-App Upload)**

The system of claim 1, wherein the mobile upload interface operates entirely within a web browser on mobile devices, requiring no dedicated application installation, and wherein said interface integrates with native device camera and photo library through HTML5 APIs.

---

**CLAIM 7 (Dependent - Multi-File Upload)**

The system of claim 6, wherein the mobile upload interface supports simultaneous upload of multiple photos and videos, displays real-time upload progress for each file, and handles files up to 500MB in size.

---

**CLAIM 8 (Dependent - Anonymous Upload)**

The system of claim 1, wherein the mobile upload interface allows users to upload photos and videos without providing their name or creating an account, enabling anonymous memorial contributions.

---

**CLAIM 9 (Dependent - Moderation Queue)**

The system of claim 1, wherein the content moderation system creates a pending queue for all uploaded content, notifies memorial owners of new uploads via email or SMS, and provides a moderation dashboard where owners can approve, reject, or edit uploaded content before publication.

---

**CLAIM 10 (Dependent - Automated Content Filtering)**

The system of claim 9, wherein the content moderation system includes automated filtering that:
    (a) scans photos for inappropriate content using machine learning models,
    (b) analyzes text descriptions for profanity,
    (c) checks videos for inappropriate audio content, and
    (d) assigns risk scores to uploaded content, flagging high-risk uploads for mandatory manual review.

---

**CLAIM 11 (Dependent - QR Code Error Correction)**

The system of claim 1, wherein QR codes intended for tombstone plaques are generated with high error correction level (30% damage recovery) to maintain scannability despite outdoor weathering, and wherein QR codes for memorial cards use medium error correction level (15-25% damage recovery).

---

**CLAIM 12 (Dependent - Physical Product Specifications)**

The system of claim 1, wherein tombstone plaque QR codes are sized at minimum 1 inch by 1 inch to enable scanning from 3 feet away, and wherein memorial card QR codes are sized at 0.75 inches by 0.75 inches for close-range scanning.

---

**CLAIM 13 (Dependent - QR Scan Analytics)**

The system of claim 1, further comprising an analytics module that:
    (a) logs each QR code scan with timestamp, source artifact, and user device type,
    (b) tracks conversion rate from scans to uploads,
    (c) identifies most active scan sources, and
    (d) provides memorial owners with usage reports showing QR code engagement over time.

---

**CLAIM 14 (Dependent - Upload Attribution)**

The system of claim 1, wherein uploaded content can be attributed to named contributors or submitted anonymously, and wherein attributed content displays the contributor's name and relationship to deceased on the memorial page.

---

**CLAIM 15 (Independent - Method Claim)**

A method for enabling public photo and video upload to digital memorials via QR codes, comprising the steps of:

(a) hosting a digital memorial page for a deceased person on a web-based platform;

(b) generating a unique QR code encoding a URL that includes said memorial's unique identifier;

(c) printing said QR code on a physical memorial artifact selected from the group consisting of a tombstone plaque, memorial card, and funeral program;

(d) receiving a scan request when a user scans said QR code with a mobile device;

(e) analyzing said scan request to determine user intent based on URL parameters and device characteristics;

(f) presenting a context-appropriate interface based on said determined intent;

(g) when user selects upload function, presenting a mobile-optimized upload interface that:
    (i) allows file selection from device camera or photo library,
    (ii) accepts multiple photos and videos simultaneously,
    (iii) requires no app installation or account creation,
    (iv) collects optional contributor name and relationship information;

(h) receiving uploaded photos and videos and storing them in a moderation queue;

(i) notifying the memorial owner of new uploads;

(j) receiving approval or rejection from memorial owner for each upload; and

(k) upon approval, publishing approved content to the memorial page with optional attribution to the contributor.

---

**CLAIM 16 (Dependent - Tombstone Photo Upload Method)**

The method of claim 15, wherein when the QR code is printed on a tombstone plaque, the context-appropriate interface specifically prompts the user to upload a current photograph of the grave site, and wherein said tombstone photograph is categorized separately from general memorial photos and timestamped to document when it was taken.

---

**CLAIM 17 (Dependent - Bulk QR Generation Method)**

The method of claim 15, further comprising:
    (a) generating QR codes for multiple memorials simultaneously in bulk,
    (b) exporting said QR codes as image files suitable for print production, and
    (c) integrating QR code generation with funeral home management software to automatically create QR codes when memorials are established.

---

**CLAIM 18 (Dependent - Multi-Source Tracking Method)**

The method of claim 15, wherein multiple QR codes are generated for a single memorial, each QR code containing a different source parameter indicating whether it originated from a tombstone, memorial card, or funeral program, and wherein scan analytics track which source generates the most user engagement.

---

**CLAIM 19 (Independent - QR Code Data Structure)**

A QR code for memorial access, encoding a URL comprising:
    (a) a memorial platform domain,
    (b) a unique memorial identifier,
    (c) a source parameter indicating the physical artifact type on which the QR code is printed, said type selected from the group consisting of "tombstone," "memorial_card," and "funeral_program," and
    (d) an optional action parameter indicating a suggested user action selected from the group consisting of "upload," "view," and "tombstone_photo";

wherein scanning said QR code with a mobile device opens a web browser to said URL, and wherein the memorial platform presents different interfaces based on said source parameter and action parameter.

---

**CLAIM 20 (Dependent - Tombstone QR Structure)**

The QR code of claim 19, wherein the source parameter is set to "tombstone" and the action parameter is set to "tombstone_photo," causing the memorial platform to present an interface specifically designed for uploading current photographs of the grave site.

---

### CLAIMS SUMMARY

**Independent Claims:** 3 (Claims 1, 15, 19)
- Claim 1: System claim (broadest protection)
- Claim 15: Method claim (protects the process)
- Claim 19: Data structure claim (protects QR code URL format)

**Dependent Claims:** 17 (Claims 2-14, 16-18, 20)
- Claims 2-14: Expand on system features
- Claims 16-18: Expand on method steps
- Claim 20: Expands on QR code structure

**Total Claims:** 20

---

### CLAIM STRATEGY

**Broad to Narrow Approach:**
- Claim 1 is intentionally broad to capture the core innovation
- Claims 2-14 add specific implementation details, creating defensive depth
- If Claim 1 is rejected as too broad, narrower claims provide fallback positions

**Multi-Form Protection:**
- System claims (1-14) protect the apparatus/software
- Method claims (15-18) protect the process/workflow
- Data structure claim (19-20) protects the QR code URL format

**Key Differentiators from Prior Art:**
- **Multi-purpose functionality**: Single QR code serves multiple functions (prior art: single-purpose codes)
- **Public upload capability**: QR codes enable content contribution (prior art: view-only)
- **Context-aware behavior**: System adapts to source artifact and user intent (prior art: static behavior)
- **Tombstone photo workflow**: Specialized handling for grave site documentation (prior art: no such feature)
- **No-app upload**: Browser-based mobile upload without app installation (prior art: requires apps)

**Defensive Depth:**
- Multiple claims covering different aspects make design-around difficult
- Even if some claims are invalidated, others likely remain enforceable
- Combination of broad and narrow claims provides strong patent protection

---

**End of Claims Section**

*Total: 20 claims / Approximately 1,600 words / 3-4 pages*

**This Claims section is now ready for USPTO provisional patent filing.**

---

**Created:** November 10, 2025  
**For:** Opictuary Provisional Patent Application  
**Innovation:** Dynamic QR Code Memorial Upload System  
**Status:** Claims section complete
