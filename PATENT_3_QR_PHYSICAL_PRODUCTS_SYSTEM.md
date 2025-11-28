# PROVISIONAL PATENT APPLICATION

## Patent Title: QR-Embedded Physical Memorial Products with Dynamic Digital Content Linking

---

## ABSTRACT

A system and method for manufacturing physical memorial products (urns, plaques, stones, jewelry) embedded with machine-readable Quick Response (QR) codes that dynamically link to customizable digital memorial pages. The system enables seamless integration of physical and digital memorialization through encrypted QR codes, real-time content management, unique product identification, and secure access controls.

---

## BACKGROUND OF THE INVENTION

### Field of the Invention
This invention relates to memorial products and digital content management, specifically to methods for permanently linking physical memorial objects to living digital memorial pages through embedded QR code technology.

### Description of Related Art
Traditional memorial products (urns, headstones, plaques) are static and unchanging. Digital memorials exist only in virtual space. No prior art system seamlessly integrates physical products with dynamic digital content, allowing a family to update the digital memorial while the physical product remains unchanged.

---

## SUMMARY OF THE INVENTION

The present invention provides a system for:

1. **QR Code Generation**: Creating unique, encrypted QR codes for each product
2. **Product Manufacturing Integration**: Embedding QR codes into memorial products during manufacturing
3. **Dynamic Content Management**: Allowing digital memorial updates without product replacement
4. **Secure Access**: Protecting memorial content through access controls
5. **Analytics**: Tracking QR scans with privacy preservation
6. **E-Commerce Platform**: Complete product catalog, customization, and ordering
7. **Admin Dashboard**: Managing products, memorials, and analytics

---

## DETAILED DESCRIPTION OF THE INVENTION

### System Architecture

#### 1. QR Code Generation Module
- Unique QR code generated for each product ordered
- Encryption using AES-256
- URL encoded with:
  - Unique product ID
  - Memorial ID reference
  - Access token
  - Encryption key (hashed)
- QR version optimized for product size
- Error correction level set to 30%

#### 2. Product Manufacturing Interface
- API for manufacturers to:
  - Receive QR code before production
  - Print/etch QR code on product
  - Verify QR code quality
  - Report production completion
- Batch processing for bulk orders
- Quality assurance checkpoints

#### 3. Product Database
- Product catalog with specifications
- Available materials (bronze, ceramic, marble, etc.)
- Customization options
- Pricing and availability
- Manufacturing partner information
- Inventory tracking

#### 4. Digital Memorial Backend
- Linked memorial pages for each product
- Content storage (photos, videos, text)
- Access control by memorial ID
- Privacy settings (public/private)
- Visitor tracking (privacy-compliant)
- Comment and condolence system

#### 5. QR Scanning and Access Flow
1. User scans QR code with smartphone
2. QR contains encrypted URL
3. System decrypts QR data
4. Validates access permissions
5. Redirects to memorial page
6. Records scan metadata (location, time, device - privacy-preserved)
7. Displays memorial content

#### 6. E-Commerce Platform
- Product browsing and filtering
- Customization wizard
- Shopping cart
- Checkout process
- Payment processing (Stripe)
- Order tracking
- Customer service portal

#### 7. Admin Dashboard
- Product management
- Order fulfillment tracking
- QR code generation and verification
- Analytics and reporting
- Customer support tools
- Inventory management

### Technical Implementation

**Database Schema:**
```
products table:
- productId (UUID primary key)
- productName (varchar)
- category (enum: urn, plaque, stone, jewelry, etc.)
- material (varchar)
- dimensions (jsonb)
- basePrice (numeric)
- customizationOptions (jsonb)
- manufacturerId (UUID, foreign key)
- imageUrl (varchar)
- description (text)
- inStock (boolean)
- createdAt (timestamp)

product_orders table:
- orderId (UUID primary key)
- userId (UUID, foreign key)
- productId (UUID, foreign key)
- memorialId (UUID, foreign key)
- quantity (integer)
- customizations (jsonb)
- totalPrice (numeric)
- orderStatus (enum: pending, manufacturing, shipping, delivered)
- orderDate (timestamp)
- expectedDelivery (timestamp)
- trackingNumber (varchar)

qr_codes table:
- qrId (UUID primary key)
- orderId (UUID, foreign key)
- memorialId (UUID, foreign key)
- uniqueProductId (varchar, unique)
- qrCodeData (text, encrypted)
- qrImageUrl (varchar)
- accessToken (varchar, hashed)
- encryptionKey (varchar, hashed)
- qrVersion (integer)
- errorCorrectionLevel (varchar)
- generatedAt (timestamp)
- scans (jsonb array of scan records)

qr_scans table:
- scanId (UUID primary key)
- qrId (UUID, foreign key)
- scanTimestamp (timestamp)
- approxLocation (point, privacy-limited)
- deviceType (varchar, anonymized)
- osmessType (varchar, anonymized)
- sessionId (UUID)
- userConsent (boolean)

product_customization table:
- customizationId (UUID primary key)
- productId (UUID, foreign key)
- customizationType (varchar)
- fieldName (varchar)
- fieldOptions (jsonb)
- priceAdjustment (numeric)
```

**QR Encryption Algorithm:**
- Algorithm: AES-256-CBC
- Key derivation: PBKDF2 with SHA-256
- IV: 128-bit random per QR
- Payload structure:
  ```
  {
    productId: UUID,
    memorialId: UUID,
    accessToken: JWT,
    timestamp: unix_time,
    version: 1
  }
  ```

**API Endpoints:**
- `POST /api/products` - Get product list
- `GET /api/products/:id` - Get product details
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order status
- `POST /api/qr/generate` - Generate QR code
- `GET /api/qr/scan/:qrId` - Handle QR scan
- `GET /api/memorial/:qrId` - Retrieve memorial content
- `POST /api/qr/scan/track` - Track scan analytics

**Scan Privacy Protection:**
- Location data limited to city level (not exact GPS)
- Device types anonymized (not individual device IDs)
- No persistent user tracking across QR codes
- User consent required for analytics
- Automatic data retention limits

---

## CLAIMS

### Independent Claims

**Claim 1:** A system for integrating physical memorial products with digital memorial content, comprising:
- a QR code generation module creating unique, encrypted QR codes;
- a manufacturing interface for embedding QR codes in physical products;
- a digital memorial database storing content linked by QR ID;
- a QR scanning system decrypting codes and validating access;
- a content delivery system providing memorial information to QR scanners;
- an analytics module tracking scans with privacy preservation;
- an e-commerce platform for product ordering and customization;
- an admin dashboard for product and content management.

**Claim 2:** The system of Claim 1, wherein the QR code is generated by:
- creating unique product identifiers;
- encrypting product and memorial IDs using AES-256;
- generating QR version optimized for product size;
- setting error correction to at least 25%;
- generating QR image with sufficient resolution for reliable scanning.

**Claim 3:** The system of Claim 1, wherein QR code data includes:
- encrypted product identification number;
- encrypted memorial page reference;
- access control token;
- timestamp of QR generation;
- version information for future compatibility.

**Claim 4:** The system of Claim 1, wherein the scanning process comprises:
- capturing QR image with mobile device;
- decrypting QR content using stored encryption key;
- validating access permissions for user;
- recording anonymous scan metadata (time, approximate location);
- redirecting to corresponding memorial page.

**Claim 5:** The system of Claim 1, wherein the digital memorial content may be updated:
- without changing the physical product;
- by authorized memorial administrators;
- in real-time to all future scans;
- while preserving previous scan records;
- with version history tracking.

**Claim 6:** A method for manufacturing and deploying QR-embedded memorial products, comprising:
- user selecting product type and customization;
- generating unique QR code for order;
- providing QR code to manufacturer;
- manufacturer embedding QR code in product;
- shipping physical product with QR code to customer;
- customer and family managing digital memorial via web interface;
- future users scanning QR code to access memorial.

**Claim 7:** The method of Claim 6, wherein the physical product includes:
- engraved, printed, or etched QR code;
- QR code visible and scannable by smartphone;
- optional engraved text directing user to scan code;
- QR code integrated into product design aesthetically.

**Claim 8:** The method of Claim 6, wherein the digital memorial content may include:
- biographical information;
- photo and video galleries;
- family condolences and messages;
- life timeline and achievements;
- charitable donation links;
- event information;
- accessibility features (alt text, captions).

**Claim 9:** A privacy-preserving analytics system for QR-embedded products, comprising:
- recording scan timestamp without user identification;
- recording approximate location (city-level only);
- recording device type without specific device ID;
- aggregating scan data into statistical reports;
- allowing opt-in user consent for analytics;
- implementing automatic data retention limits;
- preventing cross-product user tracking.

**Claim 10:** An e-commerce system for QR-enabled memorial products, comprising:
- product catalog with filtering and search;
- customization wizard for personalization options;
- shopping cart and checkout;
- payment processing with fraud prevention;
- order tracking and customer notifications;
- integration with manufacturing partners;
- customer service portal for support.

---

## ADVANTAGES OF THE INVENTION

1. **Bridge Physical and Digital**: Connects permanent physical memorials to living digital content
2. **Dynamic Updates**: Allows memorial updates without product replacement
3. **Accessibility**: Makes memorials accessible to distant family members
4. **Analytics**: Provides insights into memorial engagement without compromising privacy
5. **Scalability**: Supports unlimited products and memorials
6. **Revenue Stream**: Creates new product sales opportunity
7. **Customization**: Allows extensive personalization options
8. **Authenticity**: Physical + digital provides complete memorial experience

---

## DRAWINGS

[Figure 1: QR Code Lifecycle - Generation to Scanning]
[Figure 2: Manufacturing Integration Flow]
[Figure 3: System Architecture Overview]
[Figure 4: QR Scan Decryption and Redirect Process]
[Figure 5: E-Commerce Platform Interface]
[Figure 6: Admin Dashboard - Analytics View]

---

## CONCLUSION

The present invention solves the fundamental problem of integrating physical and digital memorial experiences through innovative QR code technology and secure linking mechanisms. This represents a significant advancement in memorial product technology and digital content management.

---

## FILING INFORMATION

**Applicant:** [Company/Individual Name]
**Filing Date:** [Date]
**Invention Title:** QR-Embedded Physical Memorial Products with Dynamic Digital Content Linking
**Application Type:** Provisional Patent Application
**Classification:** G06Q (E-commerce systems)
