# PROVISIONAL PATENT APPLICATION
## Prison Memorial Access System - Detailed Description

---

### DETAILED DESCRIPTION OF THE INVENTION

The following detailed description, taken in conjunction with the accompanying drawings, provides a comprehensive explanation of the prison memorial access system according to the present invention.

---

## SYSTEM ARCHITECTURE

### Overview

The invention comprises a distributed software system with components deployed across three primary environments:

1. **Cloud Infrastructure** - Hosting the memorial platform, databases, and business logic
2. **Correctional Facility Networks** - Running kiosk integration software and administrative dashboards
3. **Family/Public Networks** - Supporting memorial creation and management via web and mobile applications

### Component Architecture Diagram (Figure 1)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUD PLATFORM                            │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │   Memorial    │  │    Payment    │  │    Session      │ │
│  │   Database    │  │   Processing  │  │   Management    │ │
│  └───────────────┘  └───────────────┘  └─────────────────┘ │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │   Content     │  │   Monitoring  │  │   Access        │ │
│  │   Filtering   │  │   & Logging   │  │   Control       │ │
│  └───────────────┘  └───────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ▲  │
                            │  ▼
┌─────────────────────────────────────────────────────────────┐
│              CORRECTIONAL FACILITY NETWORK                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           KIOSK TERMINALS                            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Kiosk 1  │  │ Kiosk 2  │  │ Kiosk 3  │  ...     │   │
│  │  │ (Day Rm) │  │ (Library)│  │ (Ed Ctr) │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        ADMINISTRATIVE WORKSTATION                    │   │
│  │  ┌──────────────────────────────────────────┐       │   │
│  │  │  Monitoring Dashboard (Browser-Based)    │       │   │
│  │  └──────────────────────────────────────────┘       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        PAYMENT INTEGRATION                           │   │
│  │        (JPay/GTL/ViaPath Accounts)                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▲  │
                            │  ▼
┌─────────────────────────────────────────────────────────────┐
│                  PUBLIC/FAMILY NETWORKS                      │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │  Web Browser  │  │  Mobile App   │  │  Mobile App     │ │
│  │  (Desktop)    │  │  (iOS)        │  │  (Android)      │ │
│  └───────────────┘  └───────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## DATABASE SCHEMA

### Core Tables

**memorials**
- `id` (primary key): Unique memorial identifier
- `deceased_name`: Full name of deceased person
- `birth_date`: Date of birth
- `death_date`: Date of death
- `biography`: Text biography
- `privacy_level`: "public" | "private" | "invite_only"
- `owner_user_id`: User ID of memorial creator
- `created_at`: Timestamp of memorial creation

**memorial_access_requests**
- `id` (primary key): Unique request identifier
- `memorial_id`: Foreign key to memorials table
- `inmate_id`: Prison-issued inmate identification number
- `facility_id`: Correctional facility identifier
- `request_status`: "pending" | "approved" | "denied"
- `requested_at`: Timestamp of access request
- `approved_at`: Timestamp of approval (if applicable)
- `approved_by_user_id`: User ID who approved request

**prison_access_sessions**
- `id` (primary key): Unique session identifier
- `memorial_id`: Foreign key to memorials table
- `inmate_id`: Prison-issued inmate ID
- `facility_id`: Correctional facility identifier
- `kiosk_id`: Specific kiosk terminal identifier
- `session_token`: Cryptographically secure session token
- `started_at`: Session start timestamp
- `expires_at`: Session expiration timestamp
- `ended_at`: Actual session end timestamp (may be before expiration)
- `duration_minutes`: Purchased session duration
- `cost_usd`: Total cost in USD
- `payment_method`: "commissary" | "jpay" | "gtl" | "viapath" | etc.
- `payment_transaction_id`: External payment system transaction ID

**session_activity_logs**
- `id` (primary key): Unique log entry identifier
- `session_id`: Foreign key to prison_access_sessions
- `activity_type`: "photo_viewed" | "video_played" | "tribute_read" | etc.
- `resource_id`: ID of viewed photo/video/tribute
- `timestamp`: Activity timestamp
- `metadata`: JSON field with additional context

**facilities**
- `id` (primary key): Unique facility identifier
- `facility_name`: Official facility name
- `facility_type`: "federal" | "state" | "county" | "juvenile"
- `state`: Two-letter state code
- `payment_vendor`: "jpay" | "gtl" | "viapath" | "custom"
- `commission_rate`: Percentage commission (0.30 = 30%)
- `admin_email`: Contact email for facility administrators

---

## DETAILED USER FLOWS

### Flow 1: Memorial Family Enabling Prison Access

**Step 1: Memorial Creation**
A family member creates a memorial through the web or mobile application. They upload photos, videos, write biographical information, and configure privacy settings.

**Step 2: Prison Access Configuration**
The memorial owner navigates to Settings → Prison Access Settings within the memorial management interface.

**Step 3: Adding Approved Inmates**
The interface presents a form to add inmate IDs:
```
Enter Inmate Information:
- Inmate ID Number: [text input]
- Facility Name: [dropdown of available facilities]
- Relationship to Deceased: [dropdown: spouse, child, parent, sibling, friend, other]
- Access Duration: [radio buttons: permanent | 30 days | 60 days | 90 days]
```

**Step 4: System Processing**
Upon submission, the system:
- Validates inmate ID format
- Verifies facility exists in database
- Creates pre-approved access record
- Sends notification to facility kiosk system

**Step 5: Confirmation**
The memorial owner receives confirmation:
```
Prison access enabled for:
- Inmate ID: 12345-678
- Facility: California State Prison, San Quentin
- Relationship: Son
- Access expires: Never (permanent)

When this individual accesses the memorial from a facility kiosk, 
you will receive a notification via email.
```

### Flow 2: Incarcerated Individual Requesting Access

**Step 1: Kiosk Login**
The individual approaches a kiosk terminal in the facility day room, library, or education center. The kiosk displays a login screen:
```
OPICTUARY MEMORIAL ACCESS
─────────────────────────
Enter your Inmate ID: [6-digit input]
Enter your PIN: [4-digit masked input]

[Login Button]
```

The individual enters credentials. The system validates against the facility's authentication system.

**Step 2: Memorial Search**
Upon successful authentication, the search interface displays:
```
Search for Memorial
─────────────────────────
First Name: [text input]
Last Name: [text input]
Year of Death (optional): [year input]

[Search Button]
```

**Step 3: Search Results**
The system queries the memorial database and returns results:
```
Search Results: "John Smith"
─────────────────────────
1. John Michael Smith
   Born: March 15, 1950
   Died: August 2, 2024
   [Request Access Button]

2. John Robert Smith
   Born: June 7, 1963
   Died: September 12, 2024
   [Request Access Button]

3. John William Smith
   Born: January 22, 1942
   Died: October 5, 2024
   [Request Access Button]
```

**Step 4A: Pre-Approved Access Path**
If the inmate ID is already on the memorial's approved access list:
```
✓ Access Pre-Approved
─────────────────────────
Memorial: John Michael Smith (1950-2024)

You have been pre-approved to access this memorial 
by the family.

Select session duration:
○ 15 minutes - $2.25
○ 30 minutes - $4.50
○ 60 minutes - $9.00

Current commissary balance: $45.80

[Purchase Access Button]
```

**Step 4B: Request Approval Path**
If not pre-approved:
```
Access Approval Required
─────────────────────────
Memorial: John Michael Smith (1950-2024)

To access this memorial, you must request permission 
from the family.

What is your relationship to John Michael Smith?
[Dropdown: Son, Daughter, Spouse, Parent, Sibling, 
 Cousin, Friend, Other]

Optional message to family:
[Text area, 200 character limit]

[Submit Request Button]
```

Upon submission:
```
Request Submitted
─────────────────────────
Your access request has been sent to the memorial family.

You will receive a notification at this kiosk when your 
request is approved or denied. This typically takes 1-3 days.

Request ID: REQ-2024-001234
Submitted: November 10, 2024, 2:34 PM

[Return to Search] [Logout]
```

The system sends email notification to memorial owner:
```
Subject: Prison Memorial Access Request - John Michael Smith

An incarcerated individual has requested access to the memorial 
for John Michael Smith (1950-2024).

Requester Information:
- Inmate ID: 12345-678
- Facility: California State Prison, San Quentin
- Stated Relationship: Son
- Message: "This is my father. I would like to see photos from 
  his life and read the tributes people have shared."

Approve or deny this request:
[Approve Access Button] [Deny Access Button]

Note: This individual will pay $0.15 per minute to access the 
memorial. All access is monitored and logged for security.
```

**Step 5: Payment Processing**
When access is approved (either pre-approved or after request approval), the individual selects session duration and proceeds to payment.

The payment interface shows:
```
Confirm Purchase
─────────────────────────
Memorial: John Michael Smith (1950-2024)
Duration: 30 minutes
Cost: $4.50
Facility Commission: $1.35 (30%)
Platform Fee: $3.15 (70%)

Payment Method: Commissary Account
Current Balance: $45.80
New Balance: $41.30

By confirming, you agree to the terms of service.

[Confirm Purchase] [Cancel]
```

Upon confirmation, the system:
- Calls the appropriate payment provider API (JPay, GTL, etc.)
- Requests deduction from inmate's account
- Waits for payment confirmation (typically 2-5 seconds)
- Generates session token upon successful payment

**Step 6: Session Activation**
Once payment is confirmed:
```
Access Granted
─────────────────────────
Memorial: John Michael Smith (1950-2024)

Time Remaining: 30:00

You may now view photos, videos, and tributes.

[Begin Viewing Memorial]
```

The kiosk switches to full-screen memorial viewing mode.

**Step 7: Memorial Viewing Interface**
The memorial displays in a simplified, kiosk-optimized interface:
```
┌─────────────────────────────────────────────────────┐
│ JOHN MICHAEL SMITH (1950-2024)                      │
│ Time Remaining: 28:43                   [End Session]│
├─────────────────────────────────────────────────────┤
│                                                      │
│        [Large Photo Display Area]                    │
│                                                      │
│  [◀ Previous Photo]    Photo 3 of 47    [Next Photo ▶]│
│                                                      │
├─────────────────────────────────────────────────────┤
│ [📷 Photos] [🎬 Videos] [📝 Tributes] [📖 Biography]│
└─────────────────────────────────────────────────────┘
```

The individual can:
- Navigate through photo galleries using large touch-friendly buttons
- Play videos (with volume control)
- Read written tributes from family and friends
- View biographical timeline
- See funeral service information

All navigation is logged:
```
Session Activity Log (Internal):
14:35:12 - Photo viewed: photo_id_123 (John's 50th birthday)
14:35:45 - Photo viewed: photo_id_124 (Family reunion 2015)
14:36:23 - Video played: video_id_45 (John's retirement speech)
14:39:10 - Tribute read: tribute_id_78 (From daughter Sarah)
```

**Step 8: Session Countdown**
As the session approaches expiration, warnings display:
```
⚠ 5 Minutes Remaining
You have 5 minutes left in your session.
[Add 15 More Minutes - $2.25] [Continue]
```

```
⚠ 1 Minute Remaining
Your session will end in 60 seconds.
[Add 15 More Minutes - $2.25] [Continue]
```

**Step 9: Session Termination**
When time expires:
```
Session Ended
─────────────────────────
Memorial: John Michael Smith (1950-2024)

Thank you for using Opictuary Memorial Access.

Session Summary:
- Duration: 30 minutes
- Photos viewed: 23
- Videos watched: 2
- Tributes read: 8
- Cost: $4.50

You may purchase another session to continue viewing.

[Start New Session] [Logout]
```

The system:
- Terminates the session token
- Logs final session statistics
- Clears all memorial content from kiosk cache
- Calculates facility commission
- Sends session summary to memorial owner

### Flow 3: Facility Administrator Monitoring

**Step 1: Dashboard Login**
A correctional staff member logs into the administrative dashboard from any computer on the facility network:
```
https://admin.opictuary.com/facility/san-quentin

Username: [email]
Password: [password]
Two-Factor Code: [6 digits]

[Login]
```

**Step 2: Real-Time Monitoring**
The dashboard displays active sessions:
```
┌─────────────────────────────────────────────────────────────┐
│ OPICTUARY ADMIN DASHBOARD - San Quentin State Prison        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ACTIVE SESSIONS (3)                                      │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Inmate #12345 | Kiosk: Day Room 1                       │ │
│ │ Memorial: John Michael Smith (1950-2024)                │ │
│ │ Started: 2:34 PM | Remaining: 18:43 | Cost: $4.50      │ │
│ │ [View Details] [End Session] [Flag Content]             │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Inmate #23456 | Kiosk: Library 2                        │ │
│ │ Memorial: Mary Johnson (1948-2024)                      │ │
│ │ Started: 2:12 PM | Remaining: 8:22 | Cost: $2.25       │ │
│ │ [View Details] [End Session] [Flag Content]             │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Inmate #34567 | Kiosk: Education Center 3               │ │
│ │ Memorial: Robert Davis (1955-2023)                      │ │
│ │ Started: 2:45 PM | Remaining: 14:12 | Cost: $2.25      │ │
│ │ [View Details] [End Session] [Flag Content]             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ TODAY'S STATISTICS                                       │ │
│ │ Sessions: 47 | Revenue: $187.50 | Facility Share: $56.25│ │
│ │ Most Active Kiosk: Day Room 1 (12 sessions)            │ │
│ │ Average Session: 22 minutes                              │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Step 3: Session Details**
Clicking "View Details" shows comprehensive session information:
```
SESSION DETAILS - Inmate #12345
─────────────────────────────────────
Memorial: John Michael Smith (1950-2024)
Memorial Owner: Sarah Smith (sarahsmith@email.com)
Relationship: Pre-approved (Son)

Session Information:
- Start Time: Nov 10, 2024, 2:34:12 PM
- Purchased Duration: 30 minutes
- Time Remaining: 18:43
- Cost: $4.50 (Platform: $3.15, Facility: $1.35)
- Kiosk: Day Room 1 (IP: 192.168.1.105)

Activity Log:
14:35:12 - Viewed photo: "John's 50th birthday party"
14:35:45 - Viewed photo: "Family reunion 2015"
14:36:23 - Started video: "John's retirement speech" (2:34 duration)
14:39:10 - Read tribute from Sarah Smith (daughter)
14:42:30 - Viewed photo: "John and grandchildren 2020"
14:44:15 - Viewed photo: "John's military service photo 1970"

Content Flags: None
Security Alerts: None

[End Session Now] [Download Full Log] [Generate Report]
```

**Step 4: Emergency Session Termination**
If administrators observe concerning behavior or need to end a session for any reason, they click "End Session":
```
Confirm Session Termination
─────────────────────────────
You are about to end the active session for Inmate #12345.

Reason (required):
○ Security concern
○ Facility emergency
○ Policy violation
○ Technical issue
○ Other: [text input]

Notes (optional):
[Text area for additional context]

Refund remaining time?
☑ Yes, refund 18:43 ($2.81) to inmate account
☐ No refund

[Confirm Termination] [Cancel]
```

Upon confirmation, the session immediately terminates and the kiosk displays:
```
Session Terminated by Facility Staff
─────────────────────────────
Your session has been ended by facility administration.

Remaining balance refunded: $2.81

Please contact facility staff if you have questions.

[Logout]
```

---

## TECHNICAL IMPLEMENTATION DETAILS

### Session Token Generation

Session tokens are generated using cryptographically secure methods to prevent forgery or hijacking:

```typescript
function generateSessionToken(
  memorialId: string,
  inmateId: string,
  facilityId: string,
  durationMinutes: number
): SessionToken {
  const tokenId = generateUUID(); // Cryptographically random UUID
  const issuedAt = Date.now();
  const expiresAt = issuedAt + (durationMinutes * 60 * 1000);
  
  const tokenPayload = {
    tokenId,
    memorialId,
    inmateId,
    facilityId,
    issuedAt,
    expiresAt,
    tokenType: 'prison_access'
  };
  
  // Sign token with secret key using HMAC-SHA256
  const signature = hmacSHA256(JSON.stringify(tokenPayload), SECRET_KEY);
  
  return {
    token: base64Encode(JSON.stringify(tokenPayload) + '.' + signature),
    expiresAt
  };
}
```

### Payment Provider Integration

The payment abstraction layer supports multiple vendors through a unified interface:

```typescript
interface PaymentProvider {
  name: string; // 'jpay' | 'gtl' | 'viapath' | 'custom'
  
  checkBalance(inmateId: string, facilityId: string): Promise<number>;
  
  processPayment(
    inmateId: string,
    facilityId: string,
    amount: number,
    description: string
  ): Promise<PaymentResult>;
  
  refundPayment(
    transactionId: string,
    amount: number
  ): Promise<RefundResult>;
}

// JPay-specific implementation
class JPayProvider implements PaymentProvider {
  name = 'jpay';
  
  async checkBalance(inmateId: string, facilityId: string): Promise<number> {
    // Call JPay API to check commissary balance
    const response = await fetch('https://api.jpay.com/v2/balance', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JPAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inmateId, facilityId })
    });
    
    const data = await response.json();
    return data.balanceUSD;
  }
  
  async processPayment(
    inmateId: string,
    facilityId: string,
    amount: number,
    description: string
  ): Promise<PaymentResult> {
    // Deduct from JPay commissary account
    const response = await fetch('https://api.jpay.com/v2/debit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JPAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inmateId,
        facilityId,
        amount,
        description,
        merchantId: OPICTUARY_MERCHANT_ID
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        transactionId: data.transactionId,
        newBalance: data.newBalance
      };
    } else {
      return {
        success: false,
        error: data.errorMessage
      };
    }
  }
  
  async refundPayment(transactionId: string, amount: number): Promise<RefundResult> {
    // Process refund through JPay
    // ... implementation details
  }
}

// Factory pattern to select appropriate provider
function getPaymentProvider(facilityId: string): PaymentProvider {
  const facility = getFacilityById(facilityId);
  
  switch (facility.paymentVendor) {
    case 'jpay':
      return new JPayProvider();
    case 'gtl':
      return new GTLProvider();
    case 'viapath':
      return new ViaPathProvider();
    default:
      return new CustomProvider(facility.customPaymentConfig);
  }
}
```

### Content Filtering System

The content filtering engine scans memorial content for security concerns:

```typescript
interface ContentFilterResult {
  allowed: boolean;
  confidence: number; // 0.0 to 1.0
  flaggedReasons: string[];
  suggestedAction: 'allow' | 'review' | 'block';
}

async function filterMemorialPhoto(photoUrl: string): Promise<ContentFilterResult> {
  // Download image
  const imageBuffer = await downloadImage(photoUrl);
  
  // Check 1: Inappropriate content detection (using ML model)
  const inappropriateScore = await detectInappropriateContent(imageBuffer);
  
  // Check 2: Gang symbol detection
  const gangSymbolScore = await detectGangSymbols(imageBuffer);
  
  // Check 3: Text in image (OCR + profanity filter)
  const extractedText = await performOCR(imageBuffer);
  const profanityScore = await detectProfanity(extractedText);
  
  // Check 4: Weapon/contraband detection
  const contrabandScore = await detectContraband(imageBuffer);
  
  const flaggedReasons = [];
  let allowed = true;
  
  if (inappropriateScore > 0.7) {
    flaggedReasons.push('Potentially inappropriate content detected');
    allowed = false;
  }
  
  if (gangSymbolScore > 0.6) {
    flaggedReasons.push('Possible gang-related imagery detected');
    allowed = false;
  }
  
  if (profanityScore > 0.5) {
    flaggedReasons.push('Profanity detected in image text');
    allowed = false;
  }
  
  if (contrabandScore > 0.8) {
    flaggedReasons.push('Possible contraband/weapons depicted');
    allowed = false;
  }
  
  return {
    allowed,
    confidence: Math.max(inappropriateScore, gangSymbolScore, profanityScore, contrabandScore),
    flaggedReasons,
    suggestedAction: allowed ? 'allow' : (flaggedReasons.length > 1 ? 'block' : 'review')
  };
}
```

### Kiosk Security Measures

The kiosk interface implements multiple security controls:

**1. Full-Screen Lock Mode**
```javascript
// Prevent navigation away from memorial viewing
window.addEventListener('beforeunload', (e) => {
  if (sessionActive) {
    e.preventDefault();
    e.returnValue = 'Your session is still active. Are you sure you want to leave?';
  }
});

// Disable right-click context menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
});

// Disable keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Block F12 (developer tools)
  if (e.keyCode === 123) {
    e.preventDefault();
    return false;
  }
  
  // Block Ctrl+Shift+I (inspect element)
  if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
    e.preventDefault();
    return false;
  }
  
  // Block Ctrl+U (view source)
  if (e.ctrlKey && e.keyCode === 85) {
    e.preventDefault();
    return false;
  }
});
```

**2. Screenshot Prevention**
```javascript
// Detect screenshot attempts (browser-specific)
document.addEventListener('keydown', (e) => {
  // Windows: Print Screen, Alt+Print Screen
  if (e.keyCode === 44) {
    logSecurityEvent('screenshot_attempt', sessionId);
    alert('Screenshots are not permitted during memorial viewing sessions.');
    e.preventDefault();
  }
});

// Add visual watermark to deter screenshots
function addWatermark() {
  const watermark = document.createElement('div');
  watermark.style.position = 'fixed';
  watermark.style.top = '0';
  watermark.style.left = '0';
  watermark.style.width = '100%';
  watermark.style.height = '100%';
  watermark.style.pointerEvents = 'none';
  watermark.style.opacity = '0.1';
  watermark.style.zIndex = '9999';
  watermark.textContent = `INMATE #${inmateId} - ${facilityName} - ${new Date().toISOString()}`;
  watermark.style.fontSize = '48px';
  watermark.style.transform = 'rotate(-45deg)';
  document.body.appendChild(watermark);
}
```

**3. Automatic Session Heartbeat**
```javascript
// Send heartbeat every 30 seconds to maintain session
setInterval(async () => {
  if (sessionActive) {
    const response = await fetch('/api/prison-access/heartbeat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        timestamp: Date.now()
      })
    });
    
    if (!response.ok) {
      // Session was terminated server-side
      endSessionLocal('Session terminated by administrator');
    }
  }
}, 30000);
```

---

## REVENUE DISTRIBUTION ALGORITHM

The system automatically calculates and distributes revenue between the platform and correctional facilities:

```typescript
interface RevenueShare {
  totalRevenue: number;
  platformShare: number;
  facilityShare: number;
  facilityCommissionRate: number;
}

function calculateRevenueShare(
  sessionCost: number,
  facilityId: string
): RevenueShare {
  const facility = getFacilityById(facilityId);
  const commissionRate = facility.commissionRate; // e.g., 0.30 for 30%
  
  const facilityShare = sessionCost * commissionRate;
  const platformShare = sessionCost - facilityShare;
  
  return {
    totalRevenue: sessionCost,
    platformShare,
    facilityShare,
    facilityCommissionRate: commissionRate
  };
}

// Monthly revenue reconciliation
async function generateMonthlyRevenueReport(
  facilityId: string,
  month: number,
  year: number
): Promise<RevenueReport> {
  // Query all sessions for this facility in the given month
  const sessions = await db.query(`
    SELECT 
      COUNT(*) as session_count,
      SUM(cost_usd) as total_revenue,
      AVG(duration_minutes) as avg_duration,
      SUM(cost_usd * $1) as facility_share
    FROM prison_access_sessions
    WHERE facility_id = $2
      AND EXTRACT(MONTH FROM started_at) = $3
      AND EXTRACT(YEAR FROM started_at) = $4
  `, [facility.commissionRate, facilityId, month, year]);
  
  return {
    facilityId,
    facilityName: facility.facilityName,
    month,
    year,
    sessionCount: sessions.rows[0].session_count,
    totalRevenue: sessions.rows[0].total_revenue,
    facilityShare: sessions.rows[0].facility_share,
    platformShare: sessions.rows[0].total_revenue - sessions.rows[0].facility_share,
    averageSessionDuration: sessions.rows[0].avg_duration
  };
}
```

---

## SCALABILITY CONSIDERATIONS

### Database Optimization

**Indexing Strategy:**
```sql
-- Index on memorial searches
CREATE INDEX idx_memorials_deceased_name ON memorials(deceased_name);
CREATE INDEX idx_memorials_death_date ON memorials(death_date);

-- Index on access requests for fast lookups
CREATE INDEX idx_access_requests_inmate_memorial 
  ON memorial_access_requests(inmate_id, memorial_id);

-- Index on sessions for facility reporting
CREATE INDEX idx_sessions_facility_date 
  ON prison_access_sessions(facility_id, started_at);

-- Index on activity logs for session details
CREATE INDEX idx_activity_logs_session 
  ON session_activity_logs(session_id, timestamp);
```

**Database Partitioning:**
For large-scale deployments, session tables can be partitioned by month:
```sql
CREATE TABLE prison_access_sessions (
  -- columns as defined above
) PARTITION BY RANGE (started_at);

CREATE TABLE prison_access_sessions_2024_11 
  PARTITION OF prison_access_sessions
  FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

CREATE TABLE prison_access_sessions_2024_12 
  PARTITION OF prison_access_sessions
  FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
```

### Caching Strategy

**Memorial Content Caching:**
```typescript
// Cache memorial data in Redis to reduce database load
import Redis from 'redis';
const redis = Redis.createClient();

async function getMemorialData(memorialId: string): Promise<Memorial> {
  // Check cache first
  const cached = await redis.get(`memorial:${memorialId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Query database if not cached
  const memorial = await db.memorials.findById(memorialId);
  
  // Cache for 1 hour
  await redis.setex(`memorial:${memorialId}`, 3600, JSON.stringify(memorial));
  
  return memorial;
}
```

### Load Balancing

For high-traffic facilities, multiple kiosk requests are load-balanced across application servers:

```
                    ┌──────────────────┐
                    │  Load Balancer   │
                    └────────┬─────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌───────────┐     ┌───────────┐    ┌───────────┐
    │  App      │     │  App      │    │  App      │
    │  Server 1 │     │  Server 2 │    │  Server 3 │
    └─────┬─────┘     └─────┬─────┘    └─────┬─────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Database    │
                    │   (Primary)   │
                    └───────┬───────┘
                            │
                    ┌───────┴───────┐
                    │               │
                    ▼               ▼
            ┌───────────┐   ┌───────────┐
            │ Database  │   │ Database  │
            │ (Replica) │   │ (Replica) │
            └───────────┘   └───────────┘
```

---

**End of Detailed Description Section**

*Total: Approximately 5,000 words / 10-12 pages*

**This Detailed Description section is now ready for USPTO provisional patent filing.**

---

**Created:** November 10, 2025  
**For:** Opictuary Provisional Patent Application  
**Innovation:** Prison Memorial Access System  
**Status:** Detailed Description section complete
