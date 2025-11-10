# PROVISIONAL PATENT APPLICATION
## Prison Memorial Access System - Claims

---

### CLAIMS

I claim:

**CLAIM 1 (Independent - Broadest System Claim)**

A secure memorial access system for incarcerated individuals, comprising:

(a) a memorial platform configured to host digital memorial pages, each memorial page comprising photos, videos, written tributes, and biographical information of a deceased person;

(b) a prison access module configured to operate on kiosk terminals within correctional facilities, said prison access module providing a secure interface to said memorial platform;

(c) an identity verification module configured to authenticate incarcerated individuals using prison-issued credentials;

(d) a payment processing module configured to charge incarcerated individuals on a time-based basis for memorial access, said payment processing module integrated with prison payment systems;

(e) a session management module configured to:
    (i) generate time-limited access tokens upon successful payment,
    (ii) grant access to memorial pages for a predetermined duration,
    (iii) automatically terminate access upon session expiration;

(f) a monitoring module configured to log all user activity including memorial views, photo interactions, video playback, and tribute readings; and

(g) an administrative interface configured to provide correctional facility staff with real-time visibility into active memorial access sessions and the ability to terminate sessions;

wherein incarcerated individuals can securely access memorial pages of deceased loved ones through monitored kiosk terminals while all activity is logged for security compliance.

---

**CLAIM 2 (Dependent - Session Duration)**

The system of claim 1, wherein the session management module is configured to enforce session duration limits of 15 to 60 minutes, with automatic termination upon time expiration.

---

**CLAIM 3 (Dependent - Payment Integration)**

The system of claim 1, wherein the payment processing module is configured to integrate with multiple prison payment providers including JPay, GTL, ViaPath Technologies, and commissary account systems, processing payments through vendor-specific APIs.

---

**CLAIM 4 (Dependent - Per-Minute Billing)**

The system of claim 1, wherein the payment processing module charges users on a per-minute basis at rates between $0.10 and $0.50 per minute, consistent with existing prison communication service rates.

---

**CLAIM 5 (Dependent - Revenue Sharing)**

The system of claim 1, further comprising a revenue distribution module configured to automatically calculate and distribute commission payments to correctional facilities, wherein the facility receives between 20% and 50% of gross revenue from memorial access sessions.

---

**CLAIM 6 (Dependent - Identity Verification Methods)**

The system of claim 1, wherein the identity verification module authenticates users through one or more methods selected from the group consisting of:
    (a) inmate identification numbers,
    (b) personal identification numbers (PINs),
    (c) biometric authentication,
    (d) facility-specific authentication credentials, and
    (e) integration with existing facility authentication systems.

---

**CLAIM 7 (Dependent - Pre-Approved Access Lists)**

The system of claim 1, further comprising an access control module configured to:
    (a) allow memorial owners to create pre-approved access lists containing specific inmate identification numbers,
    (b) grant immediate access to incarcerated individuals on said pre-approved lists upon payment, and
    (c) require approval workflows for access requests from individuals not on pre-approved lists.

---

**CLAIM 8 (Dependent - Family Approval Workflow)**

The system of claim 7, wherein when an incarcerated individual not on a pre-approved access list requests memorial access, the access control module:
    (a) sends notification to the memorial owner via email or SMS,
    (b) provides the memorial owner with information about the requesting individual including stated relationship to the deceased,
    (c) enables the memorial owner to approve or deny the access request, and
    (d) notifies the incarcerated individual of the approval decision.

---

**CLAIM 9 (Dependent - Content Filtering)**

The system of claim 1, further comprising a content filtering module configured to:
    (a) scan memorial photos for inappropriate content, gang symbols, or contraband depictions,
    (b) analyze memorial text for profanity, threats, or coded messages,
    (c) screen memorial videos for security concerns,
    (d) automatically block or flag content that exceeds predetermined security threshold scores, and
    (e) maintain audit logs of all content filtering decisions.

---

**CLAIM 10 (Dependent - Real-Time Monitoring Dashboard)**

The system of claim 1, wherein the administrative interface displays:
    (a) a list of all active memorial access sessions in real-time,
    (b) for each active session: inmate identifier, memorial name, kiosk location, elapsed time, remaining time, and cost,
    (c) revenue statistics including total daily revenue and facility commission earnings, and
    (d) controls for emergency session termination.

---

**CLAIM 11 (Dependent - Emergency Session Termination)**

The system of claim 10, wherein the administrative interface enables correctional staff to immediately terminate any active session, and upon termination:
    (a) the session token is invalidated,
    (b) the kiosk terminal is locked and returns to login screen,
    (c) a refund is optionally processed for unused session time, and
    (d) the termination event is logged with timestamp and reason.

---

**CLAIM 12 (Dependent - Activity Logging)**

The system of claim 1, wherein the monitoring module logs:
    (a) each photo viewed with timestamp and photo identifier,
    (b) each video played with timestamp, video identifier, and playback duration,
    (c) each written tribute read with timestamp and tribute identifier,
    (d) all user interactions with memorial content, and
    (e) session metadata including start time, end time, total duration, and total cost.

---

**CLAIM 13 (Dependent - Kiosk Security Features)**

The system of claim 1, wherein the prison access module implements security controls comprising:
    (a) full-screen locked mode preventing browser navigation,
    (b) disabled right-click context menus,
    (c) blocked keyboard shortcuts for developer tools and view source,
    (d) screenshot detection and prevention mechanisms,
    (e) visual watermarks on displayed content identifying the viewing inmate and facility, and
    (f) automatic logout upon inactivity.

---

**CLAIM 14 (Dependent - Multi-Facility Support)**

The system of claim 1, configured to operate across multiple correctional facilities simultaneously, wherein:
    (a) each facility is assigned a unique facility identifier,
    (b) facility-specific configuration includes payment vendor, commission rate, and security policies,
    (c) session data is segregated by facility for independent reporting, and
    (d) the system adapts to facility-specific kiosk hardware and network infrastructure.

---

**CLAIM 15 (Independent - Method Claim)**

A method for providing secure memorial access to incarcerated individuals, comprising the steps of:

(a) hosting digital memorial pages on a web-based platform, each memorial page comprising multimedia content related to a deceased person;

(b) receiving an access request from an incarcerated individual via a kiosk terminal in a correctional facility, said request identifying a specific memorial page;

(c) verifying the identity of the incarcerated individual using prison-issued authentication credentials;

(d) determining whether the incarcerated individual is authorized to access the requested memorial page based on pre-approved access lists or family approval;

(e) processing payment from the incarcerated individual's prison payment account for time-based memorial access;

(f) upon successful payment, generating a time-limited session token and granting access to the memorial page;

(g) displaying memorial content on the kiosk terminal in a secure, monitored environment;

(h) logging all user interactions with the memorial content including photos viewed, videos played, and tributes read;

(i) automatically terminating access upon session expiration; and

(j) distributing revenue from the access fee between the platform operator and the correctional facility.

---

**CLAIM 16 (Dependent - Method with Family Notification)**

The method of claim 15, further comprising:
    (a) when the incarcerated individual is not on a pre-approved access list, sending a notification to a memorial owner requesting approval for access;
    (b) receiving approval or denial from the memorial owner; and
    (c) granting access only upon receiving approval from the memorial owner.

---

**CLAIM 17 (Dependent - Method with Content Filtering)**

The method of claim 15, further comprising, before displaying memorial content:
    (a) scanning all memorial photos, videos, and text for security concerns;
    (b) assigning security risk scores to each piece of content;
    (c) blocking content that exceeds predetermined security threshold scores; and
    (d) logging all content filtering decisions for audit purposes.

---

**CLAIM 18 (Dependent - Method with Revenue Distribution)**

The method of claim 15, wherein the step of distributing revenue comprises:
    (a) calculating a facility commission as a percentage of the access fee, said percentage between 20% and 50%;
    (b) allocating the facility commission to the correctional facility's account; and
    (c) allocating the remaining revenue to the platform operator's account.

---

**CLAIM 19 (Independent - Memorial Access Token)**

A computer-readable session token for authorizing time-limited memorial access, comprising:
    (a) a unique token identifier;
    (b) a memorial identifier specifying which memorial page is accessible;
    (c) an inmate identifier specifying which incarcerated individual is authorized;
    (d) a facility identifier specifying which correctional facility the access is occurring from;
    (e) an issuance timestamp indicating when the token was created;
    (f) an expiration timestamp indicating when the token becomes invalid;
    (g) a cryptographic signature verifying the authenticity of the token; and
    (h) metadata including purchased session duration and payment transaction identifier;

wherein the token is validated on each content request and becomes invalid upon expiration or administrative session termination.

---

**CLAIM 20 (Dependent - Token Security)**

The session token of claim 19, wherein:
    (a) the cryptographic signature is generated using HMAC-SHA256 algorithm with a secret key;
    (b) the token is encoded in base64 format for transmission; and
    (c) token validation includes verifying the signature matches the payload and checking that the current time is before the expiration timestamp.

---

### CLAIMS SUMMARY

**Independent Claims:** 3 (Claims 1, 15, 19)
- Claim 1: System claim (broadest protection)
- Claim 15: Method claim (protects the process)
- Claim 19: Data structure claim (protects the session token)

**Dependent Claims:** 17 (Claims 2-14, 16-18, 20)
- Claims 2-14: Expand on system features
- Claims 16-18: Expand on method steps
- Claim 20: Expands on token security

**Total Claims:** 20

---

### CLAIM STRATEGY

**Broad to Narrow Approach:**
- Claim 1 is intentionally broad to capture the core invention
- Claims 2-14 add specific implementation details, making it harder for competitors to design around the patent
- If Claim 1 is rejected as too broad, Claims 2-14 provide narrower fallback positions

**Multi-Form Protection:**
- System claims (1-14) protect the apparatus/software
- Method claims (15-18) protect the process/workflow
- Data structure claim (19-20) protects the session token format

**Defensive Depth:**
- Multiple claims covering different aspects make it difficult for competitors to offer similar service without infringing at least one claim
- Even if some claims are invalidated, others may remain enforceable

---

**End of Claims Section**

*Total: 20 claims / Approximately 1,800 words / 3-4 pages*

**This Claims section is now ready for USPTO provisional patent filing.**

---

**Created:** November 10, 2025  
**For:** Opictuary Provisional Patent Application  
**Innovation:** Prison Memorial Access System  
**Status:** Claims section complete
