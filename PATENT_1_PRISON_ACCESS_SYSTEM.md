# PROVISIONAL PATENT APPLICATION
## USPTO Form PTO/SB/16 - Provisional Application Cover Sheet

**Application Type:** Provisional Patent Application  
**Entity Status:** Micro Entity  
**Filing Fee:** $65

---

## COVER SHEET INFORMATION

**Title of Invention:**  
SECURE PRISON ACCESS SYSTEM FOR DIGITAL MEMORIAL PLATFORMS WITH IDENTITY VERIFICATION AND TIME-LIMITED ACCESS TOKENS

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

**Docket Number:** OPI-001-PRISON  
**Application Date:** [DATE OF FILING]

---

## WRITTEN DESCRIPTION OF THE INVENTION

### 1. FIELD OF THE INVENTION

This invention relates to digital memorial platforms and, more specifically, to a secure system enabling incarcerated individuals to access digital memorial content through identity verification, payment processing, and time-limited access tokens while maintaining institutional security and monitoring requirements.

### 2. BACKGROUND OF THE INVENTION

Currently, incarcerated individuals have severely limited ability to participate in memorial services or maintain connections with deceased loved ones. Traditional memorial platforms are inaccessible due to:
- Lack of internet access in correctional facilities
- Inability to process payments through conventional methods
- Security concerns regarding unrestricted web access
- Need for monitoring and compliance with institutional regulations

Existing correctional facility telecommunications systems (GTL/ConnectNetwork, ViaPath Technologies, Securus Technologies) provide phone and video visitation services but do not offer memorial or grief support functionalities.

No existing platform provides a secure, monitored system for incarcerated individuals to:
- View digital memorials of deceased loved ones
- Contribute photos, videos, or written memories
- Participate in ongoing memorial activities
- Process payments through commissary accounts
- Access content within time-limited, secure sessions

### 3. SUMMARY OF THE INVENTION

The present invention provides a comprehensive prison access system for digital memorial platforms comprising:

**A. Identity Verification Module** that authenticates incarcerated users through:
- Integration with correctional facility inmate databases
- Multi-factor authentication using inmate ID numbers
- Verification of relationship to deceased individual
- Approval workflow requiring facility administrator clearance

**B. Payment Processing Module** that enables transactions via:
- Inmate commissary account integration
- Family payment portal for external contributions
- Partnership with prison telecommunications providers (GTL, ViaPath, Securus)
- Automated revenue sharing with correctional facilities (10-30% commission)

**C. Time-Limited Access Token System** that provides:
- 1-hour, 1-day, 1-week, or 1-month access packages
- Automatic session expiration upon time limit
- Token renewal capability with additional payment
- Grace period for ongoing memorial contributions (5-minute warning)

**D. Session Monitoring Module** that ensures security through:
- Real-time activity logging viewable by facility administrators
- Content moderation filters for user-generated submissions
- Automatic flagging of prohibited content
- Integration with facility security systems
- Screen recording capability for compliance

**E. Secure Access Interface** that restricts functionality to:
- Memorial viewing only (no general internet access)
- Whitelisted memorial pages only
- Disabled external links and downloads
- Kiosk mode preventing system navigation
- Watermarked content to prevent unauthorized distribution

### 4. DETAILED DESCRIPTION OF THE INVENTION

#### 4.1 System Architecture

The prison access system operates as a specialized layer within a digital memorial platform, comprising:

**Database Components:**
- Prison facility registry (facility_id, name, contact, partnership_status)
- Inmate verification records (inmate_id, facility_id, verification_status, approved_memorials)
- Access token registry (token_id, inmate_id, memorial_id, expiration_timestamp, remaining_time)
- Session monitoring logs (session_id, inmate_id, start_time, end_time, actions_taken, flagged_content)
- Payment transaction records (transaction_id, inmate_id, amount, payment_method, facility_commission)

**Backend API Endpoints:**
- POST /api/prison/verify-inmate (identity verification)
- POST /api/prison/request-access (memorial access request)
- POST /api/prison/purchase-token (payment processing)
- GET /api/prison/active-session (session status check)
- POST /api/prison/contribute (content submission with moderation)
- GET /api/prison/monitoring-dashboard (facility administrator view)

**Frontend Components:**
- Kiosk-mode interface (locked-down browser environment)
- Simplified memorial viewer (read-only by default)
- Contribution portal (with moderation queue)
- Time remaining indicator (countdown timer)
- Session extension prompt (5 minutes before expiration)

#### 4.2 Identity Verification Process

**Step 1: Inmate Registration**
- Correctional facility administrator creates inmate account
- Required fields: inmate_id, full_name, date_of_birth, facility_id, housing_unit
- System generates unique prison_access_id

**Step 2: Memorial Access Request**
- Inmate submits request via facility terminal or administrator
- Required information: deceased_name, relationship, memorial_id (if known)
- System searches memorial database for matching names

**Step 3: Verification & Approval**
- System cross-references inmate records with memorial access permissions
- Facility administrator reviews request for security clearance
- Memorial creator receives notification to approve inmate access
- Upon approval, system generates access authorization record

**Step 4: Multi-Factor Authentication**
- Inmate enters prison_access_id + facility-assigned PIN
- System validates credentials against facility database
- Biometric verification (optional): fingerprint or facial recognition
- Successful authentication creates temporary session token

#### 4.3 Payment Processing Mechanism

**Payment Method 1: Commissary Account Integration**
- System integrates with facility commissary software (Keefe Group, Union Supply Direct)
- Inmate selects access duration: 1-hour ($25), 1-day ($50), 1-week ($100), 1-month ($150)
- Transaction debited from inmate commissary account
- Facility receives 10-30% commission automatically
- Transaction ID recorded in payment_transactions table

**Payment Method 2: Family Payment Portal**
- Family member creates account linked to inmate via prison_access_id
- Secure payment via credit card, debit card, or ACH transfer
- Payment processor: Stripe with prison-specific compliance features
- Family receives confirmation email with access details for inmate
- Funds transferred to inmate's memorial access balance

**Payment Method 3: Partnership with Prison Telecom Providers**
- Integration with GTL/ConnectNetwork, ViaPath, Securus APIs
- Billing added to existing phone/video visitation accounts
- Unified statement for all correctional services
- Revenue sharing: 70% platform, 30% telecom provider/facility

#### 4.4 Time-Limited Access Token System

**Token Generation:**
```
token_structure = {
  token_id: UUID,
  inmate_id: string,
  memorial_id: string,
  access_level: "view" | "contribute" | "full",
  purchased_duration: integer (minutes),
  remaining_duration: integer (minutes),
  expiration_timestamp: datetime,
  auto_renew: boolean,
  status: "active" | "expired" | "suspended"
}
```

**Token Validation:**
- Every 60 seconds, system checks remaining_duration
- When remaining_duration < 5 minutes, display warning notification
- At expiration_timestamp, automatically log out inmate
- If auto_renew enabled and balance sufficient, purchase new token
- Save current memorial page position for resumption

**Token Extension:**
- Inmate may purchase additional time before expiration
- Extension adds to remaining_duration (e.g., +60 minutes for $25)
- No limit on extensions during single session
- Pause capability: suspend token, resume within 24 hours without time penalty

#### 4.5 Session Monitoring & Security

**Real-Time Activity Logging:**
- Every user action logged with timestamp
- Logged events: page views, photo expansions, video plays, comment submissions, downloads
- Facility administrator dashboard displays:
  - Active sessions (inmate_name, memorial_name, time_elapsed)
  - Flagged content requiring review
  - Payment transaction history
  - Access violation attempts

**Content Moderation Pipeline:**
- All inmate-generated content (comments, photos, videos) enters moderation queue
- Automated profanity filter (using server-side filtering library)
- Manual review by facility administrator or memorial creator
- Approval/rejection workflow with notification to inmate
- Rejected content: stored for review, not publicly displayed

**Security Features:**
- Kiosk mode: Disabled browser navigation, no URL bar access
- Watermarking: All viewed images contain "For [Inmate Name] - [Facility Name] - [Date]"
- Screenshot prevention: CSS overlays and JavaScript detection
- External link blocking: All outbound links disabled
- Download restrictions: Save/print functions disabled
- Session recording: Optional screen capture for compliance (facility discretion)

#### 4.6 Facility Administrator Dashboard

**Dashboard Features:**
- View all active prison access sessions in real-time
- Monitor inmate contributions awaiting approval
- Review flagged content or security violations
- Generate revenue reports (facility commission earnings)
- Manage inmate access permissions (grant, revoke, suspend)
- Export compliance logs for auditing purposes

**Access Controls:**
- Role-based permissions: administrator, staff, security officer
- Audit trail: All administrator actions logged
- Emergency shutdown: Terminate all active sessions instantly
- Facility-wide settings: Default access levels, moderation requirements

### 5. CLAIMS OF INVENTION

**Primary Claim:**
A digital memorial access system for incarcerated individuals comprising: (a) an identity verification module authenticating users through correctional facility databases and multi-factor authentication; (b) a payment processing module integrating with inmate commissary accounts and prison telecommunications providers; (c) a time-limited access token system providing 1-hour to 1-month access with automatic expiration; (d) a session monitoring module logging all user activities viewable by facility administrators; and (e) a secure access interface restricting users to memorial viewing only.

**Dependent Claims:**

1. The system of claim 1 wherein the identity verification module requires approval from both facility administrators and memorial creators before granting access.

2. The system of claim 1 wherein the payment processing module automatically distributes commission payments (10-30%) to correctional facilities.

3. The system of claim 1 wherein the time-limited access token system provides a 5-minute warning before session expiration and offers token extension capability.

4. The system of claim 1 wherein the session monitoring module logs every user action with timestamp and displays real-time activity on facility administrator dashboard.

5. The system of claim 1 wherein the secure access interface operates in kiosk mode preventing browser navigation and disabling all external links and downloads.

6. A method for enabling incarcerated individuals to access digital memorials comprising: authenticating user identity through facility database integration; processing payment via commissary account or family payment portal; generating time-limited access token with automatic expiration; monitoring all session activities in real-time; and restricting interface to memorial viewing only.

7. The method of claim 6 further comprising watermarking all viewed content with inmate name, facility name, and access date.

8. The method of claim 6 further comprising moderating all inmate-generated content through automated profanity filtering and manual administrator approval before public display.

### 6. ADVANTAGES OF THE INVENTION

The prison access system provides multiple advantages over existing memorial platforms:

**For Incarcerated Individuals:**
- First-ever ability to view and contribute to memorials of deceased loved ones
- Maintain family connections during grief process
- Participate in ongoing memorial activities remotely
- Access within secure, compliant framework

**For Correctional Facilities:**
- Additional revenue stream (10-30% commission)
- Enhanced inmate welfare and mental health support
- Compliance with security and monitoring requirements
- Integration with existing commissary and telecommunications systems
- Reduced behavioral issues through family connection maintenance

**For Memorial Platform:**
- Untapped market: 1.2 million incarcerated individuals in U.S.
- Recurring revenue model: monthly access subscriptions
- Partnership opportunities with 1,800+ correctional facilities
- Social impact: grief support for underserved population
- Competitive differentiation: no other platform offers this functionality

**For Families:**
- Enables incarcerated loved ones to participate in memorials
- Flexible payment options (commissary or external)
- Real-time notification when inmate contributes content
- Peace of mind through monitored, secure access

### 7. COMMERCIAL APPLICATIONS

**Target Markets:**
- State and federal correctional facilities (1,800+ U.S. facilities)
- County jails (3,000+ U.S. facilities)
- Private prison operators (CoreCivic, GEO Group)
- Prison telecommunications providers (GTL, ViaPath, Securus)

**Revenue Model:**
- Inmate access fees: $25-150 per time period
- Facility commissions: 10-30% of all transactions
- Family payment processing: 2.9% + $0.30 transaction fee
- Enterprise licensing: $2,000-5,000/month per facility for unlimited inmates

**Market Size:**
- 1.2 million incarcerated individuals in U.S.
- Average inmate stay: 2.6 years
- Estimated 400,000 deaths annually affecting incarcerated individuals
- Potential market: $500M+ annually (assuming 20% adoption at $100/user/year)

### 8. DRAWINGS AND DIAGRAMS

**Figure 1: System Architecture Diagram**
- Components: Web Application Layer, Prison Access Module, Facility Integration Layer, Commissary API, Memorial Database
- Data flow: Inmate Request → Identity Verification → Payment Processing → Token Generation → Monitored Session → Content Moderation

**Figure 2: Identity Verification Flowchart**
- Steps: Inmate Login → Facility Database Lookup → Multi-Factor Authentication → Memorial Access Request → Administrator Approval → Access Granted

**Figure 3: Payment Processing Flow**
- Three paths: Commissary Integration, Family Payment Portal, Telecom Provider Billing
- All converge to Token Generation with Facility Commission

**Figure 4: Session Monitoring Dashboard**
- Administrator view showing: Active Sessions Table, Flagged Content Queue, Revenue Reports, Access Permissions Manager

**Figure 5: Time-Limited Token Lifecycle**
- States: Purchased → Active → Warning (5 min remaining) → Expired → Renewable

### 9. PRIOR ART DIFFERENTIATION

**Existing Technologies:**
- Prison telecommunications (GTL, ViaPath, Securus): Provide phone and video visitation but NO memorial access
- Digital memorial platforms (Legacy.com, GatheringUs): Open internet access, unsuitable for correctional facilities
- Commissary systems (Keefe Group, Union Supply): Handle purchases but not specialized memorial access

**Novel Aspects of Present Invention:**
- First secure memorial access system designed for correctional facilities
- Time-limited token system balancing access and security
- Integrated payment processing through commissary accounts
- Real-time session monitoring with content moderation
- Kiosk-mode interface preventing general internet access
- Automated revenue sharing with facilities and telecom providers

### 10. IMPLEMENTATION DETAILS

**Technology Stack:**
- Backend: Node.js with Express, PostgreSQL database
- Authentication: OAuth 2.0 with facility database integration
- Payment Processing: Stripe API with custom commissary connectors
- Monitoring: Real-time websocket connections, activity logging
- Frontend: React with kiosk mode restrictions, CSS watermarking

**Database Schema:**
```sql
prison_facilities (id, name, contact_email, partnership_status, commission_rate)
inmate_verifications (id, inmate_id, facility_id, full_name, dob, verified_at)
prison_access_tokens (id, inmate_id, memorial_id, duration_minutes, expires_at, status)
prison_sessions (id, token_id, start_time, end_time, actions_log, flagged_content)
prison_payments (id, inmate_id, amount, method, facility_commission, processed_at)
```

**API Integration Requirements:**
- Facility inmate database (SOAP or REST API)
- Commissary systems (Keefe Group API, Union Supply Direct API)
- Prison telecom providers (GTL API, ViaPath API, Securus API)
- Payment processors (Stripe, ACH/bank transfers)

### 11. CONCLUSION

This provisional patent application describes a novel prison access system for digital memorial platforms that solves a critical unmet need: enabling incarcerated individuals to maintain connections with deceased loved ones in a secure, monitored environment. The invention's unique combination of identity verification, payment processing through commissary accounts, time-limited access tokens, real-time session monitoring, and secure kiosk-mode interface differentiates it from all existing technologies. With an addressable market of 1.2 million incarcerated individuals and 1,800+ correctional facilities in the U.S. alone, this invention represents a significant commercial opportunity while providing meaningful social impact.

---

## DECLARATION (To be signed upon filing)

I hereby declare that all statements made herein of my own knowledge are true and that all statements made on information and belief are believed to be true; and further that these statements were made with the knowledge that willful false statements and the like so made are punishable by fine or imprisonment, or both, under Section 1001 of Title 18 of the United States Code.

**Inventor Signature:** _________________________  
**Date:** _________________________

---

**END OF PROVISIONAL PATENT APPLICATION**  
**Total Pages:** 11  
**Docket Number:** OPI-001-PRISON  
**Filing Date:** [TO BE ASSIGNED BY USPTO]
