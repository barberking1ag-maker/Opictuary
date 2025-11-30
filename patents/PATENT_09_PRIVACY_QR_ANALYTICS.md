# PROVISIONAL PATENT APPLICATION

## PRIVACY-COMPLIANT QR CODE ANALYTICS FOR MEMORIAL PLATFORMS

**Application Type:** Provisional Patent Application  
**Filing Date:** [TO BE FILED]  
**Applicant:** [YOUR NAME]  
**Status:** READY FOR USPTO FILING

---

## TITLE OF INVENTION

**System and Method for Collecting, Anonymizing, and Presenting Memorial QR Code Scan Analytics While Maintaining Visitor Privacy Compliance**

---

## FIELD OF THE INVENTION

The present invention relates to QR code technology and memorial platforms, specifically to a system that collects meaningful analytics about QR code scans at physical memorial locations while ensuring visitor privacy through anonymization, aggregation, and compliance with privacy regulations.

---

## BACKGROUND OF THE INVENTION

### The Problem

Memorial QR codes create a bridge between physical and digital memorials, but analytics present unique challenges:

1. **Meaningful Insights Needed:** Families want to know their loved one is remembered (scan counts, visitor patterns).

2. **Privacy Sensitivity:** Memorial visitors expect privacy; individual tracking would be inappropriate.

3. **Location Sensitivity:** Revealing exact visitor locations at cemeteries or memorial sites raises concerns.

4. **Regulatory Compliance:** GDPR, CCPA, and other privacy laws restrict data collection.

5. **Stalking/Safety Concerns:** Revealing when specific individuals visit memorials could enable surveillance.

### Prior Art Deficiencies

**Google Analytics:** General web analytics not designed for memorial privacy requirements; individual tracking.

**Bitly/URL Shorteners:** Basic click analytics without memorial-specific aggregation or privacy features.

**QR Code Generators:** Simple scan counting without location intelligence or anonymization.

**Cemetery Visitor Systems:** Physical entry logs without digital integration or privacy-compliant analytics.

**No existing system provides:** (a) memorial-specific privacy requirements, (b) anonymization appropriate for grief contexts, (c) aggregated location intelligence without individual tracking, (d) family-appropriate analytics dashboards, and (e) multi-jurisdictional privacy compliance.

---

## SUMMARY OF THE INVENTION

The present invention provides:

1. **Privacy-First Data Collection** capturing scans without individual identification
2. **Location Anonymization** providing geographic insights without precise tracking
3. **Temporal Aggregation** showing patterns without revealing specific visit times
4. **Family-Friendly Dashboard** presenting meaningful insights respectfully
5. **Compliance Engine** ensuring GDPR, CCPA, and other regulatory adherence
6. **Opt-In Visitor Features** enabling voluntary engagement without mandatory tracking

---

## DETAILED DESCRIPTION OF THE INVENTION

### System Architecture

```
PRIVACY-COMPLIANT QR ANALYTICS SYSTEM
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                   QR SCAN EVENT                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │    Scan     │  │   Privacy   │  │    Anonymized       │ │
│  │  Detection  │  │   Filter    │  │    Storage          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  AGGREGATION ENGINE                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Temporal  │  │  Geographic │  │    Statistical      │ │
│  │  Grouping   │  │  Clustering │  │    Aggregation      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Family    │  │    Trend    │  │    Privacy          │ │
│  │  Dashboard  │  │   Reports   │  │   Controls          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component 1: Privacy-First Data Collection

Capturing useful data without individual identification:

```
DATA COLLECTED (Anonymized):
├── SCAN EVENT DATA
│   ├── QR code identifier (which memorial)
│   ├── Timestamp (rounded to hour)
│   ├── Device category (mobile/tablet/desktop)
│   ├── Operating system family (iOS/Android/Other)
│   └── Session ID (random, not linked to user)
│
├── ANONYMIZED LOCATION
│   ├── Country
│   ├── State/Region
│   ├── City (only if population > 100,000)
│   ├── General area (5-mile radius clustering)
│   └── NEVER: Precise coordinates, street addresses
│
└── CONTEXT SIGNALS
    ├── Referrer category (direct, search, social, link)
    ├── Time zone
    └── Language preference

DATA NOT COLLECTED (Privacy Protection):
├── IP addresses (immediately discarded after geo-lookup)
├── Device identifiers
├── Browser fingerprints
├── User accounts (unless voluntarily logged in)
├── Cross-session tracking
├── Precise GPS coordinates
├── Behavioral tracking
└── Cookie-based identification

SCAN EVENT SCHEMA:
qr_scan_events {
  id: uuid PRIMARY KEY
  qr_code_id: uuid REFERENCES qr_codes
  memorial_id: uuid REFERENCES memorials
  scan_hour: timestamp (rounded)
  device_category: enum (mobile, tablet, desktop)
  os_family: enum (ios, android, other)
  country: varchar
  region: varchar
  city_cluster: varchar (anonymized)
  referrer_category: varchar
  timezone: varchar
  created_at: timestamp
}
```

### Component 2: Location Anonymization

Geographic insights without privacy invasion:

```
LOCATION ANONYMIZATION TECHNIQUES:

1. PRECISION REDUCTION
   ├── Raw GPS: 37.7749° N, 122.4194° W
   ├── Anonymized: "San Francisco Bay Area"
   └── Never stored: Precise coordinates

2. POPULATION THRESHOLD
   ├── Cities < 100,000: Grouped to nearest larger city
   ├── Cities 100,000-1M: City name only
   ├── Cities > 1M: Can show neighborhood-level (e.g., "Manhattan")
   └── Rural areas: State/region level only

3. K-ANONYMITY
   ├── Minimum group size: 5 scans before revealing location
   ├── Below threshold: "Multiple locations" displayed
   └── Prevents single-visitor identification

4. TEMPORAL DELAY
   ├── Location data released after 24-48 hour delay
   ├── Prevents real-time tracking
   └── Still provides meaningful patterns

5. CEMETERY-SPECIFIC PROTECTIONS
   ├── Cemetery names never revealed in analytics
   ├── "Scanned at memorial location" vs home/work
   ├── Protects sensitive visit patterns
   └── Respects grief privacy

ANONYMIZATION ALGORITHM:
function anonymize_location(raw_coordinates) {
  // 1. Reverse geocode to city
  city = reverse_geocode(raw_coordinates)
  
  // 2. Check population threshold
  if (city.population < 100000) {
    return nearest_large_city(city)
  }
  
  // 3. Add to cluster, check k-anonymity
  cluster = add_to_cluster(city, memorial_id)
  if (cluster.size < 5) {
    return null  // Don't reveal until threshold met
  }
  
  // 4. Return anonymized location
  return city.name + ", " + city.region
}
```

### Component 3: Temporal Aggregation

Showing patterns without revealing specific visits:

```
TEMPORAL AGGREGATION RULES:

1. TIME ROUNDING
   ├── Scans stored with hour precision only
   ├── Never minute or second precision
   └── Prevents "exactly 3:47 PM" identification

2. AGGREGATION WINDOWS
   ├── Hourly counts (24 buckets per day)
   ├── Daily counts (7 buckets per week)
   ├── Weekly counts (4-5 buckets per month)
   └── Monthly/yearly for long-term trends

3. MINIMUM THRESHOLD DISPLAY
   ├── "1-5 visits" vs exact count when low
   ├── Exact counts only above threshold
   └── Prevents single-visit identification

4. PATTERN PRESENTATION
   ├── "Most visits on weekends" (not specific days)
   ├── "Peak hours: morning" (not "10 AM")
   ├── "Holiday spikes" (not specific dates initially)
   └── Aggregated insights over raw data

TEMPORAL DISPLAY EXAMPLES:
┌────────────────────────────────────────────────────────────┐
│ WHAT FAMILY SEES:                                          │
│ ├── "52 visits in the past month"                          │
│ ├── "Most visits on weekends"                              │
│ ├── "Visitors from 12 states/regions"                      │
│ ├── "Anniversary day saw increased visits"                 │
│ └── "Consistent visits throughout the year"                │
│                                                             │
│ WHAT FAMILY DOESN'T SEE:                                   │
│ ├── "John visited at 3:47 PM on Tuesday"                   │
│ ├── "Someone visited from 123 Main St"                     │
│ ├── "The same person visited 5 times"                      │
│ └── Any individual-identifying information                 │
└────────────────────────────────────────────────────────────┘
```

### Component 4: Family-Friendly Dashboard

Meaningful insights presented respectfully:

```
DASHBOARD SECTIONS:

1. VISITS SUMMARY
   ┌────────────────────────────────────────────────────┐
   │ 💙 [Memorial Name] Has Been Visited               │
   │                                                    │
   │     ████████████████████  247 times               │
   │                                                    │
   │ This Month: 52    |    Last Month: 38             │
   │ All Time: 247     |    Since: March 2024          │
   └────────────────────────────────────────────────────┘

2. GEOGRAPHIC REACH
   ┌────────────────────────────────────────────────────┐
   │ 🌍 Visitors From Around the World                 │
   │                                                    │
   │ [Map with regional highlights - no pins]          │
   │                                                    │
   │ United States: 78%   UK: 8%   Canada: 6%          │
   │ 12 countries total                                │
   └────────────────────────────────────────────────────┘

3. MEANINGFUL PATTERNS
   ┌────────────────────────────────────────────────────┐
   │ 📅 When [Name] Is Remembered                      │
   │                                                    │
   │ [Gentle heatmap - no individual points]           │
   │                                                    │
   │ "Visits increase on weekends and around           │
   │  the anniversary of [Name]'s passing"             │
   └────────────────────────────────────────────────────┘

4. SPECIAL DATES
   ┌────────────────────────────────────────────────────┐
   │ 🕯️ Anniversary Recognition                       │
   │                                                    │
   │ "On [Name]'s birthday, 12 people visited          │
   │  the memorial - a beautiful tribute."             │
   └────────────────────────────────────────────────────┘

DASHBOARD DATA REQUIREMENTS:
- No individual visitor identification
- Aggregated statistics only
- Positive, comforting framing
- Emphasis on being remembered
- Privacy-first language
```

### Component 5: Compliance Engine

Multi-jurisdictional privacy regulation adherence:

```
SUPPORTED REGULATIONS:

1. GDPR (European Union)
   ├── Lawful basis: Legitimate interest (aggregated analytics)
   ├── Data minimization: Only necessary data collected
   ├── Purpose limitation: Memorial analytics only
   ├── Storage limitation: Aggregated data retained, raw purged
   ├── Right to erasure: Visitor data never personally identifiable
   └── Data protection by design: Anonymization at collection

2. CCPA (California)
   ├── No sale of personal information
   ├── Disclosure of data practices
   ├── Right to delete: Raw data purged after aggregation
   └── Opt-out mechanisms for additional features

3. COPPA (Children's Privacy)
   ├── No collection from users under 13
   ├── Age-neutral data collection (device type only)
   └── Parental controls for family accounts

4. Other Jurisdictions
   ├── Brazil LGPD
   ├── Canada PIPEDA
   ├── Australia Privacy Act
   └── Modular compliance framework for new regulations

COMPLIANCE IMPLEMENTATION:
compliance_settings {
  memorial_id: uuid REFERENCES memorials
  analytics_enabled: boolean DEFAULT true
  data_retention_days: integer DEFAULT 365
  geographic_precision: enum (country, region, city)
  share_aggregate_publicly: boolean DEFAULT false
  gdpr_basis: varchar
  consent_collected: boolean
  last_reviewed: timestamp
}

DATA LIFECYCLE:
1. Scan event captured (raw data)
2. Immediate anonymization (IP discarded)
3. Aggregation processing (hourly)
4. Raw event deletion (24-48 hours)
5. Aggregated data retention (configurable)
6. Analytics presentation (privacy-filtered)
```

### Component 6: Opt-In Visitor Features

Voluntary engagement without mandatory tracking:

```
OPTIONAL VISITOR FEATURES:

1. "I VISITED" CHECK-IN (Opt-In)
   ├── Visitor voluntarily checks in
   ├── Can leave name or remain anonymous
   ├── Adds to public tribute board
   ├── Shows family someone visited
   └── Never tracked without explicit action

2. TRIBUTE SUBMISSION (Opt-In)
   ├── Leave a memory or message
   ├── Add photo tribute
   ├── Requires moderation
   └── Links visit to meaningful content

3. NOTIFICATION SIGN-UP (Opt-In)
   ├── Get notified of memorial events
   ├── Anniversary reminders
   ├── New tributes posted
   └── Email address stored with consent

4. FAMILY CONNECTION (Opt-In)
   ├── "I'm family" button
   ├── Request admin access
   ├── Connect with memorial managers
   └── Verified relationship process

OPT-IN DATA HANDLING:
- Separate from anonymous analytics
- Explicit consent required
- Can be deleted on request
- Not used for tracking non-opted visitors
- Clear privacy notice at each step

VISITOR OPT-IN SCHEMA:
visitor_opt_ins {
  id: uuid PRIMARY KEY
  memorial_id: uuid REFERENCES memorials
  visitor_name: varchar (optional)
  visitor_email: varchar (optional)
  opt_in_type: enum (check_in, tribute, notifications, family)
  consent_timestamp: timestamp
  consent_text_version: varchar
  data_retention_preference: varchar
  created_at: timestamp
}
```

---

## CLAIMS

### Independent Claims

**Claim 1:** A computer-implemented system for privacy-compliant memorial QR code analytics, comprising:
   a) A privacy-first data collection module capturing scan events without individual identification;
   b) A location anonymization engine reducing geographic precision and applying k-anonymity thresholds;
   c) A temporal aggregation processor grouping events into privacy-preserving time windows;
   d) A family-friendly dashboard presenting meaningful insights without revealing individual visitors;
   e) A compliance engine ensuring adherence to GDPR, CCPA, and other privacy regulations.

**Claim 2:** A method for collecting and presenting memorial QR code analytics while protecting visitor privacy, comprising:
   a) Capturing scan event data without storing IP addresses or device identifiers;
   b) Anonymizing location data to regional precision with population-based thresholds;
   c) Aggregating temporal data into hour-level or larger windows;
   d) Applying minimum count thresholds before displaying statistics;
   e) Presenting aggregated insights through a memorial-appropriate interface.

**Claim 3:** A system for location anonymization in memorial analytics, comprising:
   a) Precision reduction algorithms converting coordinates to regional identifiers;
   b) Population-based thresholds hiding locations below minimum city size;
   c) K-anonymity enforcement requiring minimum scan counts before revealing locations;
   d) Cemetery-specific protections never revealing memorial site names in analytics.

### Dependent Claims

**Claim 4:** The system of Claim 1, wherein the data collection module immediately discards IP addresses after geo-lookup.

**Claim 5:** The system of Claim 1, wherein the temporal aggregation applies 24-48 hour delays before presenting location data.

**Claim 6:** The method of Claim 2, wherein location data is only revealed when at least 5 scans from the same region are recorded.

**Claim 7:** The method of Claim 2, further comprising opt-in visitor features allowing voluntary identification.

**Claim 8:** The system of Claim 3, wherein compliance engine supports modular adaptation to new privacy regulations.

**Claim 9:** The system of Claim 1, wherein the dashboard presents statistics with positive, comforting framing appropriate for grieving families.

**Claim 10:** A non-transitory computer-readable medium storing instructions for performing the method of Claim 2.

---

## ABSTRACT

A system and method for collecting and presenting QR code scan analytics for memorial platforms while ensuring visitor privacy through anonymization, aggregation, and regulatory compliance. The invention captures meaningful data (scan counts, general regions, time patterns) without individual identification, applies location anonymization with population thresholds and k-anonymity, aggregates temporal data into privacy-preserving windows, and presents insights through a family-friendly dashboard that emphasizes the memorial being remembered rather than surveillance of visitors. The system includes compliance with GDPR, CCPA, and other privacy regulations while offering opt-in features for visitors who wish to voluntarily identify themselves.

---

## PRIVACY AND COMMERCIAL VALUE

### Privacy Innovation

This invention solves the fundamental tension between:
- **Family desire:** Wanting to know their loved one is remembered
- **Visitor expectation:** Privacy during sensitive grief-related visits
- **Regulatory requirement:** Compliance with global privacy laws

### Market Opportunity

- **QR Memorial Products:** Growing market with no privacy-compliant analytics solution
- **Cemetery/Funeral Industry:** Partners need privacy-compliant visitor insights
- **Consumer Trust:** Privacy-first approach builds trust in sensitive market

### Competitive Moat

This patent protects:
- Memorial-specific anonymization requirements
- Location privacy thresholds for sensitive sites
- Temporal aggregation methodology
- Family-appropriate analytics presentation
- Multi-jurisdictional compliance framework

---

**FILING CHECKLIST:**
- [ ] Complete inventor information
- [ ] Pay $70 filing fee (Micro Entity)
- [ ] Submit via USPTO EFS-Web
- [ ] Receive provisional application number
- [ ] Set 12-month reminder for non-provisional filing
