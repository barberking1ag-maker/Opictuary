# PROVISIONAL PATENT APPLICATION
## Prison Memorial Access System - Drawings Descriptions

---

### BRIEF DESCRIPTION OF THE DRAWINGS

The patent application drawings illustrate the prison memorial access system and its operation. The drawings are integral to understanding the invention and should be referenced in conjunction with the detailed description.

---

### FIGURE 1: System Architecture Diagram

**Description:**
Figure 1 illustrates the overall system architecture showing the interaction between cloud infrastructure, correctional facility networks, and family/public networks.

**Key Components Shown:**
- Cloud Platform layer containing:
  - Memorial Database
  - Payment Processing module
  - Session Management module
  - Content Filtering module
  - Monitoring & Logging module
  - Access Control module
- Correctional Facility Network layer containing:
  - Kiosk Terminals (multiple units)
  - Administrative Workstation
  - Payment Integration (JPay/GTL/ViaPath)
- Public/Family Networks layer containing:
  - Web Browser (desktop)
  - Mobile App (iOS)
  - Mobile App (Android)
- Bidirectional arrows showing data flow between layers

**Drawing Specification:**
```
┌────────────────────────────────────────────────────────────┐
│                   CLOUD PLATFORM                           │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │
│ │  Memorial    │ │   Payment    │ │    Session       │   │
│ │  Database    │ │  Processing  │ │   Management     │   │
│ └──────────────┘ └──────────────┘ └──────────────────┘   │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │
│ │   Content    │ │  Monitoring  │ │    Access        │   │
│ │   Filtering  │ │  & Logging   │ │    Control       │   │
│ └──────────────┘ └──────────────┘ └──────────────────┘   │
└──────────────────────┬─────────────────────────────────────┘
                       │ ▲
                       ▼ │
┌────────────────────────────────────────────────────────────┐
│            CORRECTIONAL FACILITY NETWORK                    │
│ ┌────────────────────────────────────────────────────────┐ │
│ │          KIOSK TERMINALS                               │ │
│ │ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │ │
│ │ │ Kiosk 1 │  │ Kiosk 2 │  │ Kiosk 3 │  │ Kiosk 4 │  │ │
│ │ │Day Room │  │Library  │  │Ed. Ctr. │  │Chapel   │  │ │
│ │ └─────────┘  └─────────┘  └─────────┘  └─────────┘  │ │
│ └────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │       ADMINISTRATIVE WORKSTATION                       │ │
│ │ ┌──────────────────────────────────────┐              │ │
│ │ │ Monitoring Dashboard (Web Browser)   │              │ │
│ │ └──────────────────────────────────────┘              │ │
│ └────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │       PAYMENT INTEGRATION                              │ │
│ │       JPay / GTL / ViaPath Accounts                    │ │
│ └────────────────────────────────────────────────────────┘ │
└──────────────────────┬─────────────────────────────────────┘
                       │ ▲
                       ▼ │
┌────────────────────────────────────────────────────────────┐
│               PUBLIC / FAMILY NETWORKS                      │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │
│ │ Web Browser  │ │  Mobile App  │ │   Mobile App     │   │
│ │  (Desktop)   │ │    (iOS)     │ │   (Android)      │   │
│ └──────────────┘ └──────────────┘ └──────────────────┘   │
└────────────────────────────────────────────────────────────┘

Reference Numbers:
10 - Cloud Platform
12 - Memorial Database
14 - Payment Processing Module
16 - Session Management Module
18 - Content Filtering Module
20 - Monitoring & Logging Module
22 - Access Control Module
30 - Correctional Facility Network
32 - Kiosk Terminal
34 - Administrative Workstation
36 - Payment Integration System
40 - Public/Family Network
42 - Web Browser Interface
44 - Mobile Application
```

---

### FIGURE 2: User Flow - Incarcerated Individual Accessing Memorial

**Description:**
Figure 2 shows the step-by-step process flow for an incarcerated individual accessing a memorial from a kiosk terminal.

**Process Steps Illustrated:**
1. Individual approaches kiosk and authenticates
2. System validates credentials
3. Individual searches for memorial
4. System displays search results
5. Individual selects memorial and requests access
6. System checks pre-approved access list
   - Path A: Pre-approved → Proceed to payment
   - Path B: Not approved → Request family permission
7. Payment processing
8. Session token generation
9. Memorial content display
10. Activity logging
11. Automatic session termination

**Drawing Specification:**
```
START
  │
  ▼
┌─────────────────┐
│ Kiosk Login     │
│ Inmate ID + PIN │
└────────┬────────┘
         │
         ▼
┌─────────────────┐        ┌──────────────┐
│ Authentication  │───NO──▶│ Login Failed │
│ Valid?          │        │ Retry        │
└────────┬────────┘        └──────────────┘
         │ YES
         ▼
┌─────────────────┐
│ Search Memorial │
│ by Name/Date    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Display Search  │
│ Results         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Select Memorial │
│ Request Access  │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│ Check Pre-       │────YES──┐
│ Approved List?   │         │
└────────┬─────────┘         │
         │ NO                 │
         ▼                    │
┌──────────────────┐         │
│ Send Approval    │         │
│ Request to Family│         │
└────────┬─────────┘         │
         │                    │
         ▼                    │
┌──────────────────┐         │
│ Wait for Family  │         │
│ Approval         │         │
└────────┬─────────┘         │
         │ APPROVED           │
         ▼                    │
    ┌────────────────────────┘
    │
    ▼
┌─────────────────┐
│ Select Session  │
│ Duration (15/   │
│ 30/60 min)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Process Payment │
│ via Commissary/ │
│ JPay/GTL        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate Time-  │
│ Limited Session │
│ Token           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Display Memorial│
│ in Full-Screen  │
│ Kiosk Mode      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Log All User    │
│ Activity        │
│ (Photos, Videos)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ Time Expired OR │─────▶│ Admin        │
│ Manual End      │     │ Termination  │
└────────┬────────┘     └──────────────┘
         │
         ▼
┌─────────────────┐
│ Terminate       │
│ Session &       │
│ Logout          │
└────────┬────────┘
         │
         ▼
        END

Reference Numbers:
50 - Login Screen
52 - Authentication Module
54 - Search Interface
56 - Search Results Display
58 - Access Request
60 - Pre-Approval Check
62 - Family Approval Request
64 - Session Duration Selection
66 - Payment Processing
68 - Token Generation
70 - Memorial Display
72 - Activity Logging
74 - Session Termination
```

---

### FIGURE 3: Kiosk Login Screen Interface

**Description:**
Figure 3 shows the visual layout of the kiosk login screen as seen by an incarcerated individual.

**Drawing Specification:**
```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│             OPICTUARY MEMORIAL ACCESS                     │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                   │    │
│  │            [Memorial Icon/Logo]                  │    │
│  │                                                   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│                                                           │
│  Enter your Inmate ID:                                   │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [______]  [______]  [______]                   │    │
│  │   (6-digit ID number entry)                      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Enter your PIN:                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [•]  [•]  [•]  [•]                             │    │
│  │   (4-digit PIN entry, masked)                    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  LOGIN                            │   │
│  │              (Touch Button)                       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│                                                           │
│  Need Help? Contact Facility Staff                      │
│                                                           │
│                                                           │
│  Facility: [Facility Name]                              │
│  Kiosk ID: [Kiosk Identifier]                           │
│                                                           │
└───────────────────────────────────────────────────────────┘

Reference Numbers:
80 - Login Screen Container
82 - Memorial Access Logo/Branding
84 - Inmate ID Input Field
86 - PIN Input Field (Masked)
88 - Login Button
90 - Help Text
92 - Facility Identifier Display
```

---

### FIGURE 4: Memorial Viewing Interface (Kiosk Mode)

**Description:**
Figure 4 shows the memorial viewing interface as displayed on a kiosk terminal during an active session.

**Drawing Specification:**
```
┌───────────────────────────────────────────────────────────┐
│ JOHN MICHAEL SMITH (1950-2024)                           │
│ Time Remaining: 23:45              [END SESSION BUTTON]  │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                   │    │
│  │                                                   │    │
│  │          [Large Memorial Photo Display]          │    │
│  │              (Photo of Deceased)                  │    │
│  │                                                   │    │
│  │                                                   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Caption: "John's 65th Birthday Celebration - 2015"     │
│                                                           │
│  ┌──────────────────┐      Photo 12 of 47               │
│  │  ◀  PREVIOUS      │                   NEXT  ▶         │
│  │    PHOTO          │                                    │
│  └──────────────────┘      ┌──────────────────┐         │
│                             │    NEXT          │         │
│                             │    PHOTO         │         │
│                             └──────────────────┘         │
│                                                           │
├───────────────────────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────────┐    │
│  │📷      │  │🎬      │  │📝      │  │📖          │    │
│  │PHOTOS  │  │VIDEOS  │  │TRIBUTES│  │BIOGRAPHY   │    │
│  │(47)    │  │(8)     │  │(23)    │  │            │    │
│  └────────┘  └────────┘  └────────┘  └────────────┘    │
└───────────────────────────────────────────────────────────┘

Reference Numbers:
100 - Memorial Header (Name & Dates)
102 - Session Timer Display
104 - End Session Button
106 - Photo Display Area
108 - Photo Caption
110 - Photo Counter (X of Y)
112 - Previous Photo Button
114 - Next Photo Button
116 - Photos Tab
118 - Videos Tab
120 - Tributes Tab
122 - Biography Tab
```

---

### FIGURE 5: Administrative Monitoring Dashboard

**Description:**
Figure 5 illustrates the real-time monitoring dashboard accessed by correctional facility administrators.

**Drawing Specification:**
```
┌──────────────────────────────────────────────────────────────┐
│ OPICTUARY ADMIN DASHBOARD                                    │
│ Facility: California State Prison, San Quentin              │
│ Administrator: J. Martinez | [LOGOUT]                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ACTIVE SESSIONS (4)                                   │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ Inmate #12345 | Kiosk: Day Room 1                    │   │
│ │ Memorial: John M. Smith (1950-2024)                  │   │
│ │ Started: 2:34 PM | Remaining: 18:43 | Cost: $4.50   │   │
│ │ [VIEW DETAILS] [END SESSION] [FLAG CONTENT]          │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ Inmate #23456 | Kiosk: Library 2                     │   │
│ │ Memorial: Mary E. Johnson (1948-2024)                │   │
│ │ Started: 2:12 PM | Remaining: 8:22 | Cost: $2.25    │   │
│ │ [VIEW DETAILS] [END SESSION] [FLAG CONTENT]          │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ Inmate #34567 | Kiosk: Education Center 3            │   │
│ │ Memorial: Robert L. Davis (1955-2023)                │   │
│ │ Started: 2:45 PM | Remaining: 14:12 | Cost: $2.25   │   │
│ │ [VIEW DETAILS] [END SESSION] [FLAG CONTENT]          │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ Inmate #45678 | Kiosk: Chapel 1                      │   │
│ │ Memorial: Linda K. Brown (1962-2024)                 │   │
│ │ Started: 2:50 PM | Remaining: 29:05 | Cost: $4.50   │   │
│ │ [VIEW DETAILS] [END SESSION] [FLAG CONTENT]          │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ TODAY'S STATISTICS                                    │   │
│ │ ┌────────────┬────────────┬────────────┬───────────┐│   │
│ │ │ Sessions   │ Revenue    │ Facility   │ Platform  ││   │
│ │ │ Completed  │ Generated  │ Share      │ Share     ││   │
│ │ ├────────────┼────────────┼────────────┼───────────┤│   │
│ │ │    52      │  $187.50   │  $56.25    │ $131.25   ││   │
│ │ │            │            │  (30%)     │ (70%)     ││   │
│ │ └────────────┴────────────┴────────────┴───────────┘│   │
│ │                                                       │   │
│ │ Most Active Kiosk: Day Room 1 (15 sessions)         │   │
│ │ Average Session Duration: 24 minutes                 │   │
│ │ Total Minutes Accessed: 1,248 minutes                │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ QUICK ACTIONS                                         │   │
│ │ [VIEW ALL SESSIONS] [GENERATE REPORT] [SETTINGS]    │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Reference Numbers:
130 - Dashboard Header
132 - Active Sessions Panel
134 - Individual Session Entry
136 - Session Details (Inmate, Memorial, Time)
138 - Action Buttons (View/End/Flag)
140 - Statistics Panel
142 - Revenue Metrics
144 - Facility Commission Display
146 - Quick Actions Panel
```

---

### FIGURE 6: Payment Processing Flow Diagram

**Description:**
Figure 6 shows the payment processing sequence integrating with multiple prison payment vendors.

**Drawing Specification:**
```
User Selects              Payment System           External Payment
Session Duration          Determines Vendor         Provider (JPay/GTL)
     │                           │                         │
     ▼                           ▼                         │
┌─────────┐              ┌──────────────┐                │
│ 15 min  │              │ Facility:    │                │
│ 30 min  │─────────────▶│ San Quentin  │                │
│ 60 min  │              │ Vendor: JPay │                │
└─────────┘              └──────┬───────┘                │
                                 │                         │
                                 ▼                         │
                        ┌──────────────┐                  │
                        │ Check Inmate │                  │
                        │ Balance      │──────API Call───▶│
                        └──────┬───────┘                  │
                                │                          │
                                │◀─────Balance: $45.80────┘
                                │                          
                                ▼                          
                        ┌──────────────┐                  
                        │ Display Cost │                  
                        │ & Confirm    │                  
                        │ Dialog       │                  
                        └──────┬───────┘                  
                                │                          
                                ▼                          
                        User Confirms                      
                                │                          
                                ▼                          
                        ┌──────────────┐                  
                        │ Process      │                  
                        │ Payment via  │──────API Call───▶│
                        │ Vendor API   │                  │
                        └──────┬───────┘                  │
                                │                          │
                                │◀──Transaction ID: TX123──┘
                                │     Success              
                                ▼                          
                        ┌──────────────┐                  
                        │ Calculate    │                  
                        │ Revenue Share│                  
                        │ Platform: 70%│                  
                        │ Facility: 30%│                  
                        └──────┬───────┘                  
                                │                          
                                ▼                          
                        ┌──────────────┐                  
                        │ Generate     │                  
                        │ Session Token│                  
                        └──────┬───────┘                  
                                │                          
                                ▼                          
                        ┌──────────────┐                  
                        │ Grant Access │                  
                        │ to Memorial  │                  
                        └──────────────┘                  

Reference Numbers:
150 - Duration Selection Interface
152 - Facility/Vendor Lookup Module
154 - Balance Check API Call
156 - Payment Confirmation Dialog
158 - Payment Processing API
160 - Transaction Response
162 - Revenue Share Calculator
164 - Session Token Generator
166 - Access Grant Module
```

---

### FIGURE 7: Content Filtering Process Flow

**Description:**
Figure 7 illustrates the automated content filtering system that scans memorial content for security concerns before display.

**Drawing Specification:**
```
Memorial Content               Filtering Engine           Decision
Upload/Request                                            
     │                                                     
     ▼                                                     
┌─────────┐                                               
│ Photo   │                                               
│ Video   │                                               
│ Text    │                                               
└────┬────┘                                               
     │                                                     
     ▼                                                     
┌──────────────┐                                          
│ Content Type │                                          
│ Detection    │                                          
└──────┬───────┘                                          
       │                                                   
       ├───Photo──▶┌───────────────┐                     
       │            │ Image Analysis│                     
       │            │ - Inappropriate│                    
       │            │ - Gang Symbols│                     
       │            │ - Contraband  │                     
       │            │ - OCR Text    │                     
       │            └───────┬───────┘                     
       │                    │                              
       ├───Video──▶┌───────────────┐                     
       │            │ Video Analysis│                     
       │            │ - Content Scan│                     
       │            │ - Audio Track │                     
       │            └───────┬───────┘                     
       │                    │                              
       └───Text───▶┌───────────────┐                     
                    │ Text Analysis │                     
                    │ - Profanity   │                     
                    │ - Threats     │                     
                    │ - Coded Msgs  │                     
                    └───────┬───────┘                     
                            │                              
                            ▼                              
                    ┌───────────────┐                     
                    │ Calculate     │                     
                    │ Risk Scores   │                     
                    │ 0.0 to 1.0    │                     
                    └───────┬───────┘                     
                            │                              
                            ▼                              
                    ┌───────────────┐                     
                    │ Risk < 0.3?   │───YES──▶ ALLOW     
                    └───────┬───────┘                     
                            │ NO                           
                            ▼                              
                    ┌───────────────┐                     
                    │ Risk 0.3-0.7? │───YES──▶ FLAG FOR  
                    └───────┬───────┘          REVIEW     
                            │ NO                           
                            ▼                              
                    ┌───────────────┐                     
                    │ Risk > 0.7?   │───YES──▶ BLOCK     
                    └───────────────┘                     

Reference Numbers:
170 - Content Input
172 - Type Detection Module
174 - Image Analysis Module
176 - Video Analysis Module
178 - Text Analysis Module
180 - Risk Scoring Engine
182 - Decision Logic
184 - Allow Action
186 - Review Queue
188 - Block Action
```

---

### FIGURE 8: Database Schema Diagram

**Description:**
Figure 8 shows the relational database schema for the prison memorial access system, including all major tables and their relationships.

**Drawing Specification:**
```
┌──────────────────────┐
│ memorials            │
├──────────────────────┤
│ PK: id               │
│ deceased_name        │
│ birth_date           │
│ death_date           │
│ biography            │
│ privacy_level        │
│ owner_user_id        │
│ created_at           │
└──────────┬───────────┘
           │
           │ (one-to-many)
           │
           ▼
┌────────────────────────────┐
│ memorial_access_requests   │
├────────────────────────────┤
│ PK: id                     │
│ FK: memorial_id            │
│ inmate_id                  │
│ facility_id                │
│ request_status             │
│ requested_at               │
│ approved_at                │
│ approved_by_user_id        │
└──────────┬─────────────────┘
           │
           │ (one-to-many)
           │
           ▼
┌──────────────────────────────┐
│ prison_access_sessions       │
├──────────────────────────────┤
│ PK: id                       │
│ FK: memorial_id              │
│ inmate_id                    │
│ facility_id                  │
│ kiosk_id                     │
│ session_token                │
│ started_at                   │
│ expires_at                   │
│ ended_at                     │
│ duration_minutes             │
│ cost_usd                     │
│ payment_method               │
│ payment_transaction_id       │
└──────────┬───────────────────┘
           │
           │ (one-to-many)
           │
           ▼
┌────────────────────────────┐
│ session_activity_logs      │
├────────────────────────────┤
│ PK: id                     │
│ FK: session_id             │
│ activity_type              │
│ resource_id                │
│ timestamp                  │
│ metadata                   │
└────────────────────────────┘

┌──────────────────────┐
│ facilities           │
├──────────────────────┤
│ PK: id               │
│ facility_name        │
│ facility_type        │
│ state                │
│ payment_vendor       │
│ commission_rate      │
│ admin_email          │
└──────────────────────┘

Reference Numbers:
190 - memorials table
192 - memorial_access_requests table
194 - prison_access_sessions table
196 - session_activity_logs table
198 - facilities table
200 - Primary Key (PK) indicators
202 - Foreign Key (FK) relationships
204 - One-to-many relationship arrows
```

---

### DRAWING CREATION INSTRUCTIONS

**For USPTO Provisional Patent Filing:**

1. **Format**: Black ink on white paper, or digital equivalent
2. **Size**: 8.5" x 11" (US Letter) with 1-inch margins on all sides
3. **Line Weight**: Consistent line thickness (0.5mm to 1mm)
4. **Labels**: All reference numbers must be clearly legible (minimum 12-point font)
5. **Figure Numbers**: Each figure numbered sequentially (FIG. 1, FIG. 2, etc.)
6. **Multiple Sheets**: Each drawing on separate sheet if needed for clarity

**Creation Methods:**

**Option 1: DIY (Free)**
- Tool: Microsoft PowerPoint, Google Slides, or Figma
- Process: Recreate diagrams using shapes and text boxes
- Export: Save as high-resolution PNG or PDF
- Cost: $0

**Option 2: Fiverr ($50-$200)**
- Search: "patent drawings"
- Provide: These descriptions + rough sketches
- Turnaround: 2-5 days
- Cost: $50-$200 for all 8 figures

**Option 3: Professional Patent Illustrator ($200-$500)**
- Services: PatentDrawingExpress.com, PatentArt.com
- Quality: USPTO-compliant professional quality
- Turnaround: 3-7 days
- Cost: $200-$500 for all 8 figures

---

**End of Drawings Descriptions Section**

*Total: 8 figures with detailed specifications*

**This Drawings section is now ready for USPTO provisional patent filing.**

---

**Created:** November 10, 2025  
**For:** Opictuary Provisional Patent Application  
**Innovation:** Prison Memorial Access System  
**Status:** Drawings descriptions complete
