# PROVISIONAL PATENT APPLICATION
## USPTO Form PTO/SB/16 - Provisional Application Cover Sheet

**Application Type:** Provisional Patent Application  
**Entity Status:** Micro Entity  
**Filing Fee:** $65

---

## COVER SHEET INFORMATION

**Title of Invention:**  
NEIGHBORHOOD-BASED COMMUNITY MEMORIAL SYSTEM FOR LOCAL TRIBUTE AND GEOGRAPHIC DISCOVERY

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

**Docket Number:** OPI-004-HOOD  
**Application Date:** [DATE OF FILING]

---

## WRITTEN DESCRIPTION OF THE INVENTION

### 1. FIELD OF THE INVENTION

This invention relates to digital memorial platforms and community tribute systems, and more specifically, to a neighborhood-based memorial discovery and creation system enabling communities to honor local figures through geographic categorization, community contribution, and hyperlocal memorial networks.

### 2. BACKGROUND OF THE INVENTION

Existing digital memorial platforms (Legacy.com, GatheringUs, ForeverMissed) focus on individual or family-created memorials without community or geographic context. Limitations include:

- **No geographic categorization:** Memorials not organized by neighborhood or community
- **No community focus:** Platforms serve individual families, not collective community memory
- **No local discovery:** Cannot find memorials of people from your neighborhood
- **No "neighborhood legends":** No dedicated space for community figures (local activists, teachers, business owners)
- **Scattered community tributes:** Community members create separate memorials, fragmenting collective memory

Social media memorial pages (Facebook, Instagram) provide community engagement but:
- Temporary and scattered across platforms
- No permanent memorial archive
- Privacy restrictions limit community participation
- Deleted when account holders remove them

Physical community memorials (murals, plaques) are:
- Expensive to create and maintain
- Limited to small dedications or quotes
- No multimedia (photos, videos, stories)
- Cannot be updated with new memories over time

No existing platform provides:
- Neighborhood-specific memorial categorization
- Community-created memorials for local figures
- Geographic discovery (find memorials from your neighborhood)
- Collaborative community tribute system
- Hyperlocal memorial networks

### 3. SUMMARY OF THE INVENTION

The present invention provides a comprehensive Hood Memorials system (neighborhood-based community memorials) comprising:

**A. Geographic Categorization System**:
- Memorials tagged with neighborhood/community location
- City-wide neighborhood directory
- Browse memorials by neighborhood (e.g., "South Side Chicago," "Brooklyn Heights")
- Map view showing memorial density by area
- Community boundaries defined by user input or census data

**B. Community Memorial Creation**:
- Any community member can create "Hood Memorial" for local figure
- Collaborative editing: Multiple contributors add content
- Community verification: Neighbors confirm individual's connection to area
- Public by default (private option available)
- No family relationship required to create

**C. Local Figure Categories**:
- Community activists & organizers
- Local business owners (barbers, shop owners, restaurant operators)
- Neighborhood teachers & mentors
- Street performers & artists
- Block club leaders
- Local sports figures & coaches
- Community elders

**D. Geographic Discovery & Search**:
- "Memorials Near Me" (GPS-based)
- Search by neighborhood name
- Filter by relationship to community (lived there, worked there, frequented there)
- Browse by category (activists, business owners, etc.)
- Interactive map with memorial markers

**E. Community Contribution Portal**:
- Any community member can add photos, videos, stories
- Upvote/downvote system for most meaningful contributions
- Community moderation (flag inappropriate content)
- "I knew them" verification (build credibility)

### 4. DETAILED DESCRIPTION OF THE INVENTION

#### 4.1 System Architecture

**Database Schema:**
```sql
neighborhoods (
  id UUID PRIMARY KEY,
  name VARCHAR,
  city VARCHAR,
  state VARCHAR,
  country VARCHAR,
  boundary_polygon GEOGRAPHY (geographic boundaries),
  population INTEGER (optional),
  created_at TIMESTAMP
)

hood_memorials (
  id UUID PRIMARY KEY,
  deceased_name VARCHAR,
  nickname VARCHAR (optional, e.g., "Big Tony"),
  birth_year INTEGER,
  death_year INTEGER,
  neighborhood_id UUID FOREIGN KEY,
  category ENUM('activist', 'business_owner', 'teacher', 'artist', 'athlete', 'elder', 'other'),
  known_for TEXT (e.g., "Owned Tony's Barbershop for 40 years"),
  created_by_user_id UUID FOREIGN KEY,
  memorial_visibility ENUM('public', 'community_only', 'private'),
  verification_count INTEGER (community members who verified connection),
  contribution_count INTEGER (photos, videos, stories added)
)

neighborhood_connections (
  id UUID PRIMARY KEY,
  hood_memorial_id UUID FOREIGN KEY,
  connection_type ENUM('lived', 'worked', 'frequented', 'grew_up'),
  address VARCHAR (optional, for "lived" or "worked"),
  years_active VARCHAR (e.g., "1975-2020"),
  details TEXT (e.g., "Lived on 5th and Main, raised 3 kids there")
)

community_contributions (
  id UUID PRIMARY KEY,
  hood_memorial_id UUID FOREIGN KEY,
  contributor_user_id UUID FOREIGN KEY,
  contribution_type ENUM('photo', 'video', 'story', 'memory'),
  content_url VARCHAR (for photo/video),
  story_text TEXT (for written memories),
  upvotes INTEGER,
  downvotes INTEGER,
  created_at TIMESTAMP,
  verification_claim BOOLEAN (contributor claims "I knew them")
)

memorial_geographic_data (
  id UUID PRIMARY KEY,
  hood_memorial_id UUID FOREIGN KEY,
  latitude DECIMAL,
  longitude DECIMAL,
  location_type ENUM('home_address', 'business_address', 'hangout_spot', 'memorial_site'),
  location_name VARCHAR (e.g., "Tony's Barbershop"),
  active_years VARCHAR
)
```

**Backend API Endpoints:**
```
GET /api/neighborhoods
  Returns: { neighborhoods: [{ id, name, city, memorial_count }] }

GET /api/neighborhoods/:id/memorials
  Returns: { hood_memorials: [{ name, nickname, category, known_for, contribution_count }] }

POST /api/hood-memorials
  Body: { deceased_name, nickname, neighborhood_id, category, known_for, neighborhood_connections }
  Returns: { hood_memorial_id }

POST /api/hood-memorials/:id/contribute
  Body: { contribution_type, content_file, story_text, verification_claim }
  Returns: { contribution_id }

GET /api/hood-memorials/nearby
  Query: { latitude, longitude, radius_miles }
  Returns: { nearby_memorials: [{ name, distance_miles, neighborhood }] }

POST /api/hood-memorials/:id/verify-connection
  Body: { user_id }
  Returns: { verification_count }

GET /api/hood-memorials/map-data
  Query: { city, state }
  Returns: { memorial_markers: [{ latitude, longitude, name, category }] }
```

**Frontend Components:**
- Hood Memorial Creation Wizard
- Neighborhood Directory Browser
- Interactive Memorial Map
- Community Contribution Portal
- "Near Me" Discovery Feed

#### 4.2 Geographic Categorization System

**Neighborhood Definition:**
- User-defined neighborhoods: Creator inputs neighborhood name during memorial creation
- System suggests neighborhoods based on:
  - City-provided neighborhood boundaries (if available)
  - U.S. Census tracts
  - Popular neighborhood names (crowdsourced)
  - User GPS location
- Neighborhoods stored in database with:
  - Name (e.g., "Bronzeville," "East Harlem")
  - City, State, Country
  - Optional boundary polygon (geographic coordinates)
  - Memorial count (auto-updated)

**Memorial-Neighborhood Linking:**
- Primary neighborhood: Where deceased primarily lived or worked
- Secondary neighborhoods: Other areas with strong connection
- Multiple neighborhood tags supported (e.g., "Grew up in South Bronx, worked in Harlem")

**Browse by Neighborhood:**
- City page lists all neighborhoods with memorial counts
- Example: "Chicago Neighborhoods"
  - South Side (127 memorials)
  - North Side (89 memorials)
  - West Side (103 memorials)
  - etc.
- Click neighborhood → view all Hood Memorials from that area

**Interactive Map:**
- Map view of city with memorial markers
- Clustering: Multiple memorials in same area shown as cluster (e.g., "23 memorials")
- Click cluster → zoom to individual memorial markers
- Click memorial marker → view memorial preview
- Filter by category: "Show only business owners"

#### 4.3 Community Memorial Creation Workflow

**Step 1: Initiate Hood Memorial**
- User clicks "Create Hood Memorial"
- Prompt: "Honor a neighborhood legend"
- Required fields:
  - Full name
  - Nickname (optional)
  - Birth year / Death year
  - Neighborhood (autocomplete from existing or create new)
  - Category (activist, business owner, teacher, etc.)
  - Known for (short description, e.g., "Owned the corner store for 50 years")

**Step 2: Neighborhood Connections**
- Add connection details:
  - Connection type: Lived, Worked, Frequented, Grew up
  - Address (optional, for privacy can be general like "5th Street")
  - Years active: "1960-2015"
  - Details: Free-text description
- Multiple connections supported (lived in Area A, worked in Area B)

**Step 3: Initial Content**
- Add founding content:
  - Profile photo
  - 3-5 initial photos
  - Opening story: "Why this person matters to our community"
- Set visibility:
  - Public (anyone can view)
  - Community only (only users who verify neighborhood connection)
  - Private (invite-only)

**Step 4: Community Verification**
- Other users can "Verify Connection" if they also knew the deceased
- Each verification adds credibility
- High verification count = trusted community memorial
- Display badge: "Verified by 47 community members"

**Step 5: Launch & Promote**
- Memorial goes live
- Share link on social media with neighborhood hashtag
- System suggests: "Share in [Neighborhood Name] Facebook groups"
- Creator becomes primary moderator

#### 4.4 Community Contribution System

**How Community Members Add Content:**
- Any visitor to Hood Memorial can click "Add to This Memorial"
- Contribution options:
  - Upload Photo: From personal collection
  - Upload Video: Home videos, interview clips
  - Write Memory: Personal story or anecdote
  - Add Location: "They used to hang out at [place]"

**Verification System:**
- Contributors can check: "I personally knew them"
- Adds "Verified Contributor" badge
- Increases trust score for contribution
- Prioritizes content from verified contributors

**Upvote/Downvote System:**
- Community members vote on contributions
- Upvotes = meaningful, accurate, valuable
- Downvotes = inappropriate, inaccurate, low-quality
- Top-voted contributions featured prominently
- Low-voted contributions moved to bottom (but not deleted)

**Community Moderation:**
- Any user can flag inappropriate content
- Flags reviewed by:
  - Memorial creator (primary moderator)
  - Platform admins (if serious violation)
- Flagged content hidden until review
- Multiple flags trigger auto-hide with review notification

**Contribution Display:**
- "Community Contributions" section on memorial page
- Sorted by: Top Voted, Most Recent, Verified Contributors
- Each contribution shows:
  - Contributor name (or "Anonymous" if preferred)
  - "I knew them" verification badge
  - Upvote/downvote count
  - Timestamp

#### 4.5 Geographic Discovery Features

**"Near Me" Discovery:**
- Uses device GPS to find memorials within X miles
- Filter options:
  - Distance: 1 mile, 5 miles, 10 miles
  - Category: All, Business Owners, Activists, etc.
  - Time period: Deceased in 2020s, 2010s, 2000s, etc.
- Results displayed as:
  - List view: Sorted by distance
  - Map view: Markers on interactive map

**Neighborhood Directory:**
- Browse all neighborhoods in city
- Sort by: Most memorials, Alphabetical, Recent activity
- Click neighborhood → see all Hood Memorials
- Filter by category within neighborhood

**Search Functionality:**
- Search bar: "Find Hood Memorials"
- Search by:
  - Name (deceased name or nickname)
  - Neighborhood name
  - Known for keywords (e.g., "barbershop," "teacher")
  - Address (find memorials associated with specific location)
- Auto-suggest as user types

**Memorial Map View:**
- City-wide map with all Hood Memorial markers
- Color-coded by category:
  - Blue: Business owners
  - Green: Activists
  - Yellow: Teachers
  - Purple: Artists
  - Red: Athletes
  - Orange: Elders
- Click marker → memorial preview pop-up
- "Directions" link (Google Maps integration)

#### 4.6 Local Figure Categories

**Category Descriptions & Use Cases:**

**1. Community Activists & Organizers**
- Definition: Individuals who fought for neighborhood rights, organized protests, led community initiatives
- Examples: Civil rights leaders, tenant rights organizers, anti-violence activists
- Special fields: Causes championed, organizations led, achievements

**2. Local Business Owners**
- Definition: Small business operators who served the community for years
- Examples: Corner store owners, barbers, restaurant operators, repair shops
- Special fields: Business name, location, years of operation

**3. Neighborhood Teachers & Mentors**
- Definition: Educators (formal or informal) who shaped young lives
- Examples: School teachers, coaches, after-school program leaders
- Special fields: Schools taught at, subjects, years active

**4. Street Performers & Artists**
- Definition: Musicians, muralists, dancers who brought art to the streets
- Examples: Street musicians, graffiti artists, poets
- Special fields: Art form, known locations, signature works

**5. Block Club Leaders**
- Definition: Individuals who organized block parties, cleanups, safety initiatives
- Examples: Block captains, neighborhood watch leaders
- Special fields: Blocks served, initiatives led

**6. Local Sports Figures & Coaches**
- Definition: Playground legends, community league coaches, local athletic heroes
- Examples: Streetball legends, little league coaches
- Special fields: Sports played, teams coached, achievements

**7. Community Elders**
- Definition: Long-time residents known for wisdom, storytelling, or community presence
- Examples: Grandmothers who watched the whole block's kids, storytellers
- Special fields: Years in neighborhood, known gathering spots

### 5. CLAIMS OF INVENTION

**Primary Claim:**
A neighborhood-based digital memorial system comprising: (a) a geographic categorization module organizing memorials by neighborhood with boundary definitions and discovery capabilities; (b) a community memorial creation workflow enabling any community member to honor local figures without family relationship requirement; (c) a local figure categorization system classifying memorials by community role (activist, business owner, teacher, artist, athlete, elder); (d) a geographic discovery engine providing GPS-based "Near Me" search and interactive map views; and (e) a community contribution portal allowing multiple users to add photos, videos, and stories with upvote/downvote functionality.

**Dependent Claims:**

1. The system of claim 1 wherein the geographic categorization module defines neighborhoods through user input, census data, or city-provided boundaries.

2. The system of claim 1 wherein the community memorial creation workflow includes community verification system where users confirm deceased individual's connection to neighborhood.

3. The system of claim 1 wherein the local figure categorization system includes seven categories: activists, business owners, teachers, artists, athletes, block club leaders, and elders.

4. The system of claim 1 wherein the geographic discovery engine enables filtering by distance (1, 5, 10 miles), category, and time period.

5. The system of claim 1 wherein the community contribution portal displays "Verified Contributor" badge for users who personally knew the deceased.

6. A method for creating neighborhood-based memorials comprising: receiving memorial creation request with deceased information and neighborhood designation; enabling multiple community members to add content collaboratively; verifying community connections through user confirmation; organizing memorials geographically with map markers; and providing discovery through GPS-based search and neighborhood browsing.

7. The method of claim 6 further comprising upvote/downvote system for community-contributed content with top-voted contributions featured prominently.

8. The method of claim 6 wherein memorial creation does not require family relationship, enabling community members to honor local figures independently.

### 6. ADVANTAGES OF THE INVENTION

**Over Existing Memorial Platforms:**
- **Family-only focus (Legacy.com, GatheringUs):** Hood Memorials enable community-wide participation for local figures
- **No geographic organization:** First platform to categorize memorials by neighborhood
- **Limited discovery:** "Near Me" and map views enable finding memorials geographically

**For Communities:**
- Preserve collective memory of neighborhood legends
- Honor individuals who might not have traditional family-created memorials
- Strengthen community identity through shared tribute
- Document local history and cultural heritage
- Create permanent archive (vs. temporary social media posts)

**For Individuals Honored:**
- Local heroes, business owners, activists get permanent recognition
- Community collectively contributes, creating richer tribute
- Geographic connection preserved (e.g., "South Side legend")
- Legacy accessible to future generations in neighborhood

**For Users:**
- Discover memorials of people from your neighborhood
- Connect with shared community history
- Contribute to tributes even if not family
- Find memorials while visiting old neighborhood

### 7. COMMERCIAL APPLICATIONS

**Target Markets:**
- Urban communities with strong neighborhood identities
- Historically significant neighborhoods (Harlem, South Side Chicago, etc.)
- Diaspora communities preserving cultural heritage
- Local historians and archivists

**Revenue Model:**
- Free Hood Memorial creation (drives adoption)
- Premium neighborhoods: Featured placement, enhanced map markers ($99/year)
- City partnerships: White-label neighborhood memorial directories
- Local business sponsorships: "Sponsored by [Local Business] in memory of neighborhood"

**Market Size:**
- Estimated 100,000+ "neighborhood legends" die annually in U.S. (local figures known in community)
- If 10% get Hood Memorials: 10,000 new memorials/year
- Average 20 community contributions per memorial
- 200,000 user engagements annually

### 8. DRAWINGS AND DIAGRAMS

**Figure 1: System Architecture**
- Components: Neighborhood Database, Hood Memorial Registry, Geographic Discovery Engine, Community Contribution Portal, Map View Generator

**Figure 2: Hood Memorial Creation Workflow**
- Steps: Enter Info → Add Neighborhood → Set Category → Add Initial Content → Launch → Community Contributes

**Figure 3: Neighborhood Directory Interface**
- Screenshot: List of neighborhoods with memorial counts, map view toggle

**Figure 4: Interactive Memorial Map**
- Screenshot: City map with color-coded markers, category filters, cluster view

**Figure 5: Community Contribution Portal**
- Screenshot: "Add to Memorial" interface, upvote/downvote buttons, verified contributor badges

**Figure 6: "Near Me" Discovery Feed**
- Screenshot: GPS-based list of nearby Hood Memorials, distance indicators, category tags

### 9. PRIOR ART DIFFERENTIATION

**Existing Technologies:**
- **Legacy.com, GatheringUs, ForeverMissed:** Family-created memorials, no geographic categorization, no community focus
- **Social media memorial pages:** Temporary, scattered, no permanent archive
- **Physical community memorials:** Expensive, limited content, cannot be updated

**Novel Aspects of Present Invention:**
- First neighborhood-based memorial categorization system
- Community-created memorials (not family-restricted)
- Geographic discovery via GPS and interactive maps
- Local figure categories (activists, business owners, etc.)
- Upvote/downvote system for community-contributed content
- Verification system for community connection claims

### 10. IMPLEMENTATION DETAILS

**Technology Stack:**
- Frontend: React with Google Maps API for interactive map
- Backend: Node.js/Express with PostgreSQL and PostGIS (geographic data)
- Geolocation: Browser Geolocation API, IP-based fallback
- Boundary Data: U.S. Census TIGER/Line shapefiles, city open data APIs

**Geographic Data Handling:**
- PostGIS extension for PostgreSQL (geographic queries)
- ST_Contains function: Check if memorial within neighborhood boundary
- ST_Distance function: Calculate miles between user and memorial
- Clustering algorithm: Group nearby markers for map performance

### 11. CONCLUSION

This provisional patent application describes a novel neighborhood-based community memorial system that enables communities to honor local figures through geographic categorization, collaborative contribution, and hyperlocal discovery. Unlike existing platforms that focus on family-created individual memorials, this invention recognizes the importance of community memory and provides tools for collective tribute to neighborhood legends. The system's combination of geographic organization, community creation workflows, local figure categories, GPS-based discovery, and collaborative contribution differentiates it from all prior art. With an addressable market of 10,000+ neighborhood memorials annually, this invention provides meaningful social impact by preserving community history and cultural heritage.

---

## DECLARATION (To be signed upon filing)

I hereby declare that all statements made herein of my own knowledge are true and that all statements made on information and belief are believed to be true; and further that these statements were made with the knowledge that willful false statements and the like so made are punishable by fine or imprisonment, or both, under Section 1001 of Title 18 of the United States Code.

**Inventor Signature:** _________________________  
**Date:** _________________________

---

**END OF PROVISIONAL PATENT APPLICATION**  
**Total Pages:** 10  
**Docket Number:** OPI-004-HOOD  
**Filing Date:** [TO BE ASSIGNED BY USPTO]
