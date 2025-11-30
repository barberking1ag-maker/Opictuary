# PROVISIONAL PATENT APPLICATION
## Prison Memorial Access System - Summary Section

---

### SUMMARY OF THE INVENTION

The present invention provides a comprehensive secure memorial access system that enables incarcerated individuals to view digital memorials of deceased loved ones through monitored kiosk terminals in correctional facilities, while maintaining institutional security requirements and generating sustainable revenue through time-based access fees.

#### Core System Components

The invention comprises several integrated modules working together to deliver secure, monitored memorial access:

**1. Memorial Platform Module**
A web-based and mobile application platform that hosts digital memorial pages containing photos, videos, written tributes, biographical information, funeral service details, and family memories. This platform serves as the central repository for all memorial content and manages user permissions, privacy settings, and access controls.

**2. Prison Access Integration Layer**
A specialized software module that interfaces between the memorial platform and existing correctional facility kiosk systems. This layer adapts the memorial viewing experience to work within the security constraints and technical specifications of prison technology infrastructure, including systems operated by JPay (Securus Technologies), GTL (Global Tel Link), ViaPath Technologies, and proprietary state corrections systems.

**3. Identity Verification System**
A multi-factor authentication system that verifies the identity of incarcerated individuals using prison-issued credentials (inmate ID numbers, biometric data where available, or facility-specific authentication methods). The system can optionally verify family relationships between the incarcerated individual and the deceased person through:
- Pre-approved access lists created by memorial owners
- Facility records of approved visitors and family contacts
- Third-party verification services
- Manual approval workflows involving memorial families

**4. Payment Processing Module**
An integrated payment system that processes access fees using existing prison payment infrastructure, including:
- Commissary account deductions
- JPay/Securus payment accounts
- GTL payment systems
- State-specific inmate trust accounts
- Federal Bureau of Prisons TRULINCS accounts

The module supports per-minute billing (typically $0.15-$0.30 per minute, matching standard prison communication service rates), pre-paid session packages, and subscription models for frequent users.

**5. Session Management System**
A sophisticated session control system that:
- Generates time-limited access tokens (typically 15-60 minute validity)
- Enforces session duration limits
- Automatically terminates sessions upon expiration
- Prevents session hijacking or token sharing
- Logs all session activity with timestamps
- Provides real-time session monitoring for administrators
- Supports emergency session termination by correctional staff

**6. Content Filtering and Moderation Engine**
An automated content screening system that:
- Scans memorial photos for inappropriate content, gang symbols, or contraband
- Filters memorial text for profanity, threats, or coded messages
- Moderates video content for security concerns
- Blocks external links or downloadable files
- Detects and prevents screenshot attempts
- Watermarks displayed content to prevent unauthorized distribution
- Maintains audit logs of all filtered content

**7. Monitoring and Logging Infrastructure**
A comprehensive activity tracking system that records:
- All access requests and approvals
- Complete session history (user, memorial, duration, cost)
- Content viewed during each session
- User interactions (photo views, video plays, text readings)
- Payment transactions and commission distributions
- Security events (failed authentication, content filtering triggers)
- System performance and availability metrics

This logging system provides correctional administrators with full transparency and audit capabilities while supporting security compliance and incident investigation.

**8. Administrative Dashboard**
A web-based control panel for correctional facility staff that displays:
- Real-time list of active memorial access sessions
- Session details (inmate, memorial, elapsed time, remaining time)
- Revenue tracking (daily, weekly, monthly facility earnings)
- Security alerts and flagged content
- One-click emergency session termination
- Historical usage reports and analytics
- Configuration settings for facility-specific policies

#### Key Technical Innovations

**Adaptive Kiosk Integration**
Unlike traditional web applications that assume unrestricted internet access, the invention includes a novel kiosk adaptation layer that:
- Operates in full-screen locked mode (preventing browser navigation)
- Disables right-click, keyboard shortcuts, and developer tools
- Blocks all external links and navigation attempts
- Provides simplified, touch-optimized interface for prison hardware
- Adapts to varying screen sizes and input devices across facilities
- Functions on low-bandwidth connections common in corrections environments

**Multi-Vendor Payment Abstraction**
The payment processing module includes a unique abstraction layer that normalizes payment flows across different prison payment vendors. Each vendor (JPay, GTL, ViaPath, etc.) has different APIs, authentication methods, and payment protocols. The invention provides a single, unified payment interface that:
- Automatically detects which payment system is available at each facility
- Adapts payment flows to match vendor-specific requirements
- Handles vendor-specific error conditions and retry logic
- Reconciles payments across different systems for revenue tracking
- Distributes facility commissions according to contracts

**Relationship-Based Access Control**
The invention includes a novel access control mechanism that balances privacy with accessibility:
- Memorial owners can designate specific inmates by ID who should receive access
- Inmates can request access to memorials, triggering family notification
- Family members can approve or deny access requests in real-time
- The system suggests potential family connections based on shared last names or facility visitor records
- Once access is granted, it can be time-limited or permanent
- Access can be revoked at any time by memorial families

This approach respects the privacy wishes of memorial families while enabling legitimate memorial access for incarcerated loved ones.

**Revenue Sharing Automation**
The system automatically calculates and distributes revenue shares to correctional facilities without manual intervention:
- Tracks all billable session time at facility level
- Applies facility-specific commission rates (typically 30-50%)
- Generates monthly revenue reports
- Supports multiple payment methods for facility disbursements
- Provides detailed transaction records for accounting

#### Operational Flow

**Typical Use Case - Incarcerated Individual Accessing Memorial:**

1. **Authentication**: Individual approaches a kiosk in the facility common area or education center and logs in using their inmate ID and PIN/password

2. **Memorial Search**: Individual searches for deceased loved one by name, viewing a list of matching memorials

3. **Access Request**: Individual selects a specific memorial and requests access

4. **Verification Path A (Pre-Approved)**: If the individual's inmate ID is on the memorial's pre-approved access list, proceed directly to payment

5. **Verification Path B (Request Approval)**: If not pre-approved, system notifies the memorial owner via email/SMS requesting permission; individual must wait for approval (minutes to days depending on family response time)

6. **Payment Selection**: Once approved, individual selects session duration (15, 30, or 60 minutes) and confirms purchase

7. **Payment Processing**: System deducts payment from inmate's commissary account or designated prison payment account

8. **Session Activation**: System generates a time-limited access token and displays the memorial in full-screen kiosk mode

9. **Content Viewing**: Individual can:
   - View photo galleries with slideshow mode
   - Watch uploaded videos
   - Read written tributes from family and friends
   - View biographical information
   - See funeral service details
   - Read condolence messages

10. **Session Termination**: When time expires, session automatically ends and user is logged out; all activity is logged for security review

**Typical Use Case - Memorial Family Creating Access:**

1. **Memorial Creation**: Family creates memorial on the platform (web or mobile app)

2. **Access Configuration**: Family navigates to "Prison Access" settings

3. **Adding Inmates**: Family enters inmate ID(s) of incarcerated loved ones who should have access

4. **Notification**: System sends notification to facility kiosk system that access is available

5. **Usage Tracking**: Family can view logs of when incarcerated loved ones accessed the memorial, which photos they viewed, and how long they spent

6. **Revenue Awareness**: Family understands that access fees support the service and generate revenue for the correctional facility

#### Objects and Advantages Over Prior Art

The present invention provides numerous advantages over existing systems:

**vs. Traditional Prison Communication Systems (JPay, GTL):**
- First system to provide memorial-specific content access
- Enables asynchronous family connection (deceased person's memorial lives on permanently)
- Provides richer multimedia experience than email or messaging
- Supports grief processing and emotional closure
- Creates new revenue stream for facilities beyond phone/email

**vs. Existing Memorial Platforms (Legacy.com, Ever Loved):**
- First to integrate with prison kiosk infrastructure
- First to provide comprehensive security monitoring and logging
- First to support prison payment systems
- First to balance family privacy with incarcerated access
- First to provide administrative oversight tools

**vs. No System (Current State):**
- Enables incarcerated individuals to participate in digital grieving process
- Maintains family connections during critical emotional periods
- Supports rehabilitation through continued family bonds
- Generates revenue for correctional facilities
- Provides families peace of mind that incarcerated loved ones can honor the deceased

#### Scalability and Adaptability

The system is designed for deployment across diverse correctional environments:

- **Federal Prisons**: Compatible with Bureau of Prisons TRULINCS kiosk infrastructure
- **State Prisons**: Adaptable to 50 different state corrections systems
- **County Jails**: Deployable on common jail kiosk systems
- **Juvenile Facilities**: Configurable with age-appropriate content filtering
- **Military Prisons**: Compatible with DoD corrections systems

The architecture supports:
- Cloud-based deployment for scalability
- Multi-tenant operation (each facility operates independently)
- Configurable security policies per facility
- Flexible revenue sharing arrangements
- Integration with existing facility IT infrastructure
- Minimal staff training requirements

#### Broader Applications

While designed primarily for prison memorial access, the core technology enables other applications:

- **Hospital ICU Memorial Access**: Enabling patients to view memorials during extended hospitalizations
- **Assisted Living Facilities**: Helping elderly residents access memorials on simplified devices
- **Military Deployment**: Allowing deployed service members to access memorials via secure networks
- **International Access**: Enabling memorial viewing in countries with internet restrictions

The fundamental innovation—secure, monitored access to memorial content through controlled terminals—has applications wherever internet access is restricted but emotional connection is needed.

---

**End of Summary Section**

*Total: Approximately 1,600 words / 3 pages*

**This Summary section is now ready for USPTO provisional patent filing.**

---

**Created:** November 10, 2025  
**For:** Opictuary Provisional Patent Application  
**Innovation:** Prison Memorial Access System  
**Status:** Summary section complete
