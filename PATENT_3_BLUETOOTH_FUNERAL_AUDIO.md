# PROVISIONAL PATENT APPLICATION
## USPTO Form PTO/SB/16 - Provisional Application Cover Sheet

**Application Type:** Provisional Patent Application  
**Entity Status:** Micro Entity  
**Filing Fee:** $65

---

## COVER SHEET INFORMATION

**Title of Invention:**  
FUNERAL PROGRAM AUDIO PLAYBACK SYSTEM WITH BLUETOOTH CONNECTIVITY AND ITEM-LEVEL AUDIO CONTROL

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

**Docket Number:** OPI-003-BLUETOOTH  
**Application Date:** [DATE OF FILING]

---

## WRITTEN DESCRIPTION OF THE INVENTION

### 1. FIELD OF THE INVENTION

This invention relates to digital funeral programs and memorial services, and more specifically, to a system enabling audio playback of funeral program items (readings, songs, eulogies) with Bluetooth connectivity for wireless speaker integration and individual item-level audio control.

### 2. BACKGROUND OF THE INVENTION

Traditional funeral programs are printed documents listing the order of service but contain no multimedia elements. Digital funeral programs exist (FuneralProgramSite, QuickFuneral) but lack audio integration.

Existing limitations:
- **No audio playback:** Digital programs display text but cannot play audio
- **No Bluetooth connectivity:** Cannot connect to wireless speakers at service venue
- **No item-level control:** Cannot play specific program items (e.g., "play eulogy #2")
- **Separate audio management:** Audio files managed separately from printed/digital programs
- **Manual coordination:** Someone must manually cue audio at correct moments during service

Live streaming services (MemoryShare, EventLive, TribuCast) provide video/audio but:
- Cost $150-300 per service
- Require professional setup
- Focus on broadcasting, not in-person service audio enhancement
- Don't integrate with printed funeral programs

No existing system provides:
- Integrated audio playback from digital funeral program
- Bluetooth connectivity to venue sound systems
- Item-level audio control (play specific reading, song, or eulogy)
- Synchronization between printed program order and audio playback
- Self-service setup without professional AV technician

### 3. SUMMARY OF THE INVENTION

The present invention provides a comprehensive funeral program audio system comprising:

**A. Digital Funeral Program Builder** with audio attachment capability:
- Create funeral program with traditional text elements
- Attach audio files to individual program items
- Upload options: pre-recorded readings, songs, eulogies, instrumental music
- Program-level audio (background music throughout)
- Item-level audio (specific to each program element)

**B. Bluetooth Audio Streaming Module**:
- Connect digital program to Bluetooth speakers wirelessly
- Support for multiple speaker pairing (venue sound system)
- Auto-detect nearby Bluetooth devices
- One-click pairing during service
- Fallback to device speaker if Bluetooth unavailable

**C. Audio Playback Controller**:
- Play/pause buttons for each program item
- Program-level play all (sequential playback)
- Item-level manual triggers (tap to play specific reading)
- Volume control independent of venue system
- Audio progress indicator with seek capability

**D. Synchronized Program Display**:
- Digital program mirrors printed version layout
- Highlight current item during playback
- Auto-scroll to playing item
- Family/attendees follow along on devices or printed programs
- Service leader controls playback from tablet/phone

**E. Recording & Archival System**:
- Record live service audio through connected devices
- Auto-sync recorded audio to memorial page
- Generate timestamped chapters (eulogy starts at 12:34)
- Post-service audio library for family sharing

### 4. DETAILED DESCRIPTION OF THE INVENTION

#### 4.1 System Architecture

**Database Schema:**
```sql
funeral_programs (
  id UUID PRIMARY KEY,
  memorial_id UUID FOREIGN KEY,
  service_date DATE,
  service_time TIME,
  venue_name VARCHAR,
  program_title VARCHAR,
  background_audio_url VARCHAR (optional),
  created_by UUID FOREIGN KEY
)

program_items (
  id UUID PRIMARY KEY,
  funeral_program_id UUID FOREIGN KEY,
  item_type ENUM('opening', 'reading', 'song', 'eulogy', 'prayer', 'closing'),
  title VARCHAR,
  subtitle VARCHAR (optional, e.g., "by John Doe"),
  content TEXT,
  order_index INTEGER,
  audio_url VARCHAR (optional),
  audio_duration INTEGER (seconds)
)

bluetooth_connections (
  id UUID PRIMARY KEY,
  funeral_program_id UUID FOREIGN KEY,
  device_name VARCHAR,
  device_id VARCHAR (MAC address or Bluetooth ID),
  connected_at TIMESTAMP,
  disconnected_at TIMESTAMP
)

audio_playback_logs (
  id UUID PRIMARY KEY,
  funeral_program_id UUID FOREIGN KEY,
  program_item_id UUID FOREIGN KEY,
  played_at TIMESTAMP,
  played_by_user_id UUID (service leader),
  playback_duration INTEGER (actual seconds played),
  bluetooth_device_id UUID FOREIGN KEY (optional)
)
```

**Backend API Endpoints:**
```
POST /api/funeral-programs
  Body: { memorial_id, service_date, service_time, venue_name, program_title }
  Returns: { funeral_program_id }

POST /api/funeral-programs/:id/items
  Body: { item_type, title, subtitle, content, order_index, audio_file }
  Returns: { program_item_id, audio_url }

GET /api/funeral-programs/:id/bluetooth-devices
  Returns: { available_devices: [{ name, id, signal_strength }] }

POST /api/funeral-programs/:id/bluetooth-connect
  Body: { device_id }
  Returns: { connection_status, device_name }

POST /api/funeral-programs/:id/play-item
  Body: { program_item_id }
  Returns: { audio_url, duration }

GET /api/funeral-programs/:id/live
  Returns: { program_data, current_item_playing, bluetooth_status }
```

**Frontend Components:**
- Funeral Program Builder (drag-and-drop program items, audio upload)
- Live Service Controller (playback controls, Bluetooth pairing)
- Attendee View (read-only program with live updates)
- Post-Service Archive (recorded audio with chapters)

#### 4.2 Funeral Program Creation with Audio

**Step 1: Create Program Structure**
- Service leader logs into platform
- Selects "Create Funeral Program" for memorial
- Enters service details: date, time, venue
- Chooses program template or blank

**Step 2: Add Program Items**
- Add items in service order:
  - Opening prayer
  - Reading #1 (Bible verse, poem)
  - Song #1 (hymn, favorite song)
  - Eulogy #1 (family member)
  - Eulogy #2 (friend)
  - Song #2
  - Closing prayer
- Each item has:
  - Title (e.g., "23rd Psalm")
  - Subtitle (e.g., "Read by Sarah Johnson")
  - Content (text of reading)
  - Audio file attachment (optional)

**Step 3: Attach Audio Files**
- For each item, option to "Attach Audio"
- Upload sources:
  - Pre-recorded file (MP3, WAV, M4A)
  - Record now (browser microphone)
  - Select from music library (public domain hymns, instrumentals)
- Audio processing:
  - Auto-convert to web-compatible format (MP3)
  - Generate waveform visualization
  - Extract duration metadata
  - Store in cloud (AWS S3, Cloudinary)

**Step 4: Set Program-Level Audio (Optional)**
- Background music playing during entire service
- Fade in/out when item-level audio plays
- Volume control: 20-40% for ambiance

**Step 5: Preview & Print**
- Preview digital program with playback controls
- Generate PDF for printing (traditional programs for attendees)
- QR code on printed program links to live digital version

#### 4.3 Bluetooth Audio Connection System

**Pre-Service Setup (30 minutes before):**
- Service leader opens digital program on tablet/phone
- Taps "Connect to Bluetooth Speaker"
- System scans for nearby Bluetooth devices
- Available devices listed:
  - "Church Sound System"
  - "Portable Speaker #1"
  - "Portable Speaker #2"
- Select device(s) to connect
- One-click pairing (modern Bluetooth 5.0)
- Connection confirmation: "Connected to Church Sound System"

**Multi-Speaker Support:**
- Connect to multiple Bluetooth speakers simultaneously
- Use case: Large venue with distributed speakers
- Audio synced across all connected devices
- Master volume control affects all speakers

**Bluetooth API Integration:**
```javascript
// Web Bluetooth API (Chrome/Edge support)
navigator.bluetooth.requestDevice({
  filters: [{ services: ['audio_service'] }]
})
.then(device => device.gatt.connect())
.then(server => {
  // Connected to Bluetooth device
  // Stream audio via Web Audio API
})
.catch(error => {
  // Fallback: Play through device speaker
});
```

**Fallback Mechanisms:**
- If Bluetooth unavailable: Play through device speaker
- If connection drops mid-service: Auto-reconnect or fallback
- Attendee devices: Can also connect via QR code scan (play along on phones)

#### 4.4 Audio Playback Controller

**Service Leader Interface:**
- Digital program displayed on tablet
- Each item has play button
- Playback controls:
  - ▶️ Play (start item audio)
  - ⏸️ Pause
  - ⏹️ Stop
  - ⏩ Skip forward 15 seconds
  - ⏪ Rewind 15 seconds
  - 🔊 Volume slider
- Current item highlighted in green
- Progress bar showing playback position

**Automated Sequential Playback:**
- "Play All" button starts from top
- Auto-advances to next item when current finishes
- 3-second pause between items (configurable)
- Service leader can interrupt to speak between items

**Manual Item Triggering:**
- During service, leader can tap any item to play immediately
- Use case: Service runs differently than planned, skip ahead
- Example: Eulogy #3 speaker didn't arrive, skip to Song #2

**Real-Time Synchronization:**
- When service leader plays item, all attendee devices update
- Live indicator: "Now playing: Eulogy by Sarah Johnson"
- Attendees follow along on printed programs
- Digital attendees see highlighted current item

#### 4.5 Attendee Experience

**Before Service:**
- Attendees receive printed program with QR code
- QR code links to live digital program
- Attendees scan QR, digital program opens on phone

**During Service:**
- Digital program syncs with service leader's playback
- Current item highlighted in real-time
- Option to "Follow Along" (auto-scroll to current item)
- Attendees can play audio on personal devices (headphones for hard-of-hearing)
- Volume control independent of venue speakers

**After Service:**
- Digital program remains accessible
- Recorded service audio available (if recorded)
- Timestamped chapters: Jump to specific eulogy or song
- Share program + audio with remote family members

#### 4.6 Recording & Archival Features

**Live Service Recording:**
- Option: "Record Service Audio"
- Captures audio from:
  - Bluetooth-connected microphones
  - Device microphone
  - Mixed audio (program audio + live speeches)
- Real-time upload to cloud storage

**Post-Service Audio Archive:**
- Recorded audio automatically attached to memorial page
- Chapters generated from program items:
  - 0:00 - Opening Prayer
  - 3:45 - Reading #1 (23rd Psalm)
  - 6:20 - Song #1 (Amazing Grace)
  - 10:15 - Eulogy #1 (Sarah Johnson)
  - 22:30 - Eulogy #2 (Michael Thompson)
  - 35:00 - Song #2 (In the Garden)
  - 38:45 - Closing Prayer
- Click chapter to jump to that moment
- Download option: Full recording or individual chapters

**Family Sharing:**
- Share archived program + audio via email
- Private link (password-protected for family only)
- Embed on memorial page
- Add to future messages (send recording on 1-year anniversary)

### 5. CLAIMS OF INVENTION

**Primary Claim:**
A funeral program audio playback system comprising: (a) a digital funeral program builder enabling audio file attachment to individual program items; (b) a Bluetooth audio streaming module connecting to wireless speakers at service venues; (c) an audio playback controller providing item-level manual triggers and program-level sequential playback; (d) a synchronized program display highlighting current item during playback; and (e) a recording and archival system generating timestamped chapters from program items.

**Dependent Claims:**

1. The system of claim 1 wherein the Bluetooth audio streaming module supports connection to multiple wireless speakers simultaneously with synchronized audio output.

2. The system of claim 1 wherein the audio playback controller enables service leaders to manually trigger playback of any program item regardless of service order.

3. The system of claim 1 wherein the synchronized program display updates in real-time across all attendee devices when service leader initiates playback.

4. The system of claim 1 wherein the recording and archival system auto-generates chapters corresponding to program items with clickable timestamps.

5. The system of claim 1 further comprising program-level background audio with automatic fade-in/fade-out when item-level audio plays.

6. A method for integrating audio playback into funeral services comprising: creating a digital funeral program with audio attachments for each item; connecting to Bluetooth speakers at service venue; playing audio for specific program items via manual triggers or sequential auto-play; synchronizing playback status across attendee devices; and recording service audio with auto-generated timestamped chapters.

7. The method of claim 6 wherein attendee devices receive real-time updates highlighting current program item when service leader initiates playback.

8. The method of claim 6 further comprising generating a QR code on printed funeral programs linking to live digital program with audio playback.

### 6. ADVANTAGES OF THE INVENTION

**Over Existing Solutions:**
- **Digital programs (FuneralProgramSite, QuickFuneral):** Add audio capability, no existing systems have this
- **Live streaming services ($150-300):** Provide in-person audio enhancement without expensive streaming setup
- **Manual AV coordination:** Eliminate need for technician to cue audio manually

**For Families & Service Leaders:**
- Professional audio playback without AV technician
- Pre-record readings from family members who can't attend
- Play deceased's favorite songs at exact moments
- Record entire service for absent family members
- Cost-effective: $0 vs. $150-300 for live streaming

**For Attendees:**
- Follow along on printed or digital program
- Hard-of-hearing individuals can use headphones on personal devices
- Post-service access to recorded audio
- Share memorial audio with remote relatives

**For Funeral Homes:**
- Modern service offering
- Differentiation from competitors
- Upsell opportunity: "Enhanced Digital Program - $99"
- Reduced need for in-house AV equipment/staff

### 7. COMMERCIAL APPLICATIONS

**Target Markets:**
- Funeral homes offering digital service enhancements
- Churches and places of worship
- Families planning DIY memorial services
- Memorial service venues (event spaces, parks)

**Revenue Model:**
- Free funeral program creation (drives adoption)
- Premium feature: Bluetooth audio playback ($49 one-time or included in premium memorial)
- Service recording & archival: $99 add-on
- Funeral home enterprise: $299/month for unlimited programs with audio

**Market Size:**
- 2.8 million deaths annually in U.S.
- Estimated 80% have funeral services (2.24 million)
- If 20% adopt digital programs with audio: 448,000 annually
- Average revenue $99 per service: $44.4M market potential

### 8. DRAWINGS AND DIAGRAMS

**Figure 1: System Architecture**
- Components: Program Builder, Audio Storage, Bluetooth Module, Playback Controller, Recording System, Memorial Archive
- Data flow: Create Program → Attach Audio → Connect Bluetooth → Play Audio → Record Service → Archive to Memorial

**Figure 2: Funeral Program Builder Interface**
- Screenshot: Drag-and-drop program items, audio upload buttons, preview panel

**Figure 3: Bluetooth Connection Flow**
- Steps: Scan Devices → Select Speaker → Pair → Connection Confirmed → Audio Streaming Active

**Figure 4: Service Leader Playback Controller**
- Screenshot: Digital program with play buttons, current item highlighted, volume control, Bluetooth status indicator

**Figure 5: Attendee Live Program View**
- Screenshot: Digital program on phone, current item highlighted, "Now playing: Eulogy #1" banner

**Figure 6: Post-Service Audio Archive**
- Screenshot: Recorded service with chaptered timeline, clickable timestamps, download button

### 9. PRIOR ART DIFFERENTIATION

**Existing Funeral Technologies:**
- **Printed programs:** No audio, static
- **Digital programs (FuneralProgramSite):** Text-only, no multimedia
- **Live streaming (MemoryShare, TribuCast):** Video broadcast, not in-person audio enhancement, expensive ($150-300)

**Bluetooth Audio Systems:**
- **Consumer Bluetooth speakers:** No funeral-specific integration
- **Church sound systems:** Require manual AV operation

**Novel Aspects of Present Invention:**
- First integration of audio playback into digital funeral programs
- Bluetooth connectivity for wireless venue sound systems
- Item-level audio control (play specific readings, songs)
- Real-time synchronization across attendee devices
- Auto-generated chaptered recordings from program structure
- QR code linking printed programs to live digital audio

### 10. IMPLEMENTATION DETAILS

**Technology Stack:**
- Frontend: React with Web Bluetooth API and Web Audio API
- Audio Storage: AWS S3 with CloudFront CDN
- Streaming: HLS (HTTP Live Streaming) for low-latency playback
- Recording: MediaRecorder API (browser-based)
- Bluetooth: Web Bluetooth API (Chrome, Edge support)

**Bluetooth Compatibility:**
- Supports Bluetooth 4.0+ devices
- Fallback for older browsers: Native device speaker
- Multi-device pairing: Up to 7 simultaneous Bluetooth connections

**Audio Formats:**
- Input: MP3, WAV, M4A, AAC, FLAC
- Output: MP3 (web-optimized, 128 kbps)
- Recording: MP3 or WAV (user selectable)

**Security & Privacy:**
- Audio files encrypted in transit (HTTPS)
- Private funeral programs require authentication
- Recording requires explicit consent notification

### 11. CONCLUSION

This provisional patent application describes a novel funeral program audio playback system with Bluetooth connectivity that revolutionizes how audio is integrated into memorial services. Unlike existing digital programs (text-only) or live streaming services (expensive, broadcast-focused), this invention provides in-person audio enhancement through item-level playback control, wireless speaker integration, and synchronized attendee experiences. The system's combination of Bluetooth connectivity, manual/auto playback, real-time synchronization, and archived recordings differentiates it from all prior art. With a potential market of 448,000 services annually, this invention addresses a clear need for affordable, professional audio integration in funeral services.

---

## DECLARATION (To be signed upon filing)

I hereby declare that all statements made herein of my own knowledge are true and that all statements made on information and belief are believed to be true; and further that these statements were made with the knowledge that willful false statements and the like so made are punishable by fine or imprisonment, or both, under Section 1001 of Title 18 of the United States Code.

**Inventor Signature:** _________________________  
**Date:** _________________________

---

**END OF PROVISIONAL PATENT APPLICATION**  
**Total Pages:** 10  
**Docket Number:** OPI-003-BLUETOOTH  
**Filing Date:** [TO BE ASSIGNED BY USPTO]
