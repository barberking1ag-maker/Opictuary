# Memorial Notification Network Enhancement
## Event Scheduling & Alert System for Saved Memorials

### Executive Summary
The Memorial Notification Network transforms passive memorial viewing into an active community engagement platform by enabling event scheduling (balloon releases, vigils, picnics, BBQs) with automated notifications to all memorial followers. This feature drives recurring platform engagement and strengthens community bonds around remembrance.

### Current Platform Capability
- Users can save memorials to their saved list
- Basic categorization of saved memorials exists
- No notification system for memorial updates or events

### Proposed Enhancement Architecture

## 1. Event Scheduling System

### Database Schema Additions
```typescript
// Memorial events table
memorial_events {
  id: string (UUID)
  memorialId: string (FK → memorials)
  createdBy: string (FK → users)
  eventType: enum [
    'balloon_release',
    'vigil',
    'picnic',
    'bbq',
    'prayer_service',
    'celebration_of_life',
    'birthday_remembrance',
    'anniversary_memorial',
    'candlelight_ceremony',
    'tree_planting',
    'bench_dedication',
    'custom'
  ]
  title: string
  description: text
  location: {
    name: string
    address: string
    coordinates: {lat, lng}
    virtualOption: boolean
    virtualLink?: string
  }
  datetime: timestamp
  duration: integer // minutes
  isRecurring: boolean
  recurrenceRule?: string // RFC 5545 RRULE format
  notificationSchedule: {
    twoWeeksBefore: boolean
    oneWeekBefore: boolean
    threeDaysBefore: boolean
    oneDayBefore: boolean
    morningOf: boolean
    oneHourBefore: boolean
  }
  rsvpEnabled: boolean
  maxAttendees?: integer
  supplies?: string[] // "Bring flowers", "Balloons provided"
  weatherContingency?: string
  status: enum ['draft', 'published', 'cancelled', 'completed']
  createdAt: timestamp
  updatedAt: timestamp
}

// Event RSVPs
event_rsvps {
  id: string
  eventId: string (FK → memorial_events)
  userId: string (FK → users)
  response: enum ['yes', 'no', 'maybe']
  attendeeCount: integer // +1s
  note?: string
  notificationsEnabled: boolean
  createdAt: timestamp
}

// Notification queue
notification_queue {
  id: string
  recipientId: string (FK → users)
  eventId: string (FK → memorial_events)
  memorialId: string (FK → memorials)
  notificationType: enum ['event_created', 'event_reminder', 'event_updated', 'event_cancelled']
  scheduledFor: timestamp
  channels: string[] // ['email', 'sms', 'push', 'in_app']
  status: enum ['pending', 'sent', 'failed', 'cancelled']
  attempts: integer
  lastAttemptAt?: timestamp
  error?: string
  sentAt?: timestamp
}

// User notification preferences
user_notification_preferences {
  userId: string (FK → users)
  emailEnabled: boolean
  smsEnabled: boolean
  pushEnabled: boolean
  inAppEnabled: boolean
  eventTypes: string[] // Which event types to notify about
  reminderSchedule: string[] // ['2_weeks', '1_week', '3_days', '1_day', 'morning_of', '1_hour']
  quietHours: {
    enabled: boolean
    start: time // 9pm
    end: time // 8am
    timezone: string
  }
  unsubscribeToken: string
}
```

### Technical Implementation

#### Event Creation Flow
```javascript
class MemorialEventManager {
  async createEvent(eventData, creatorId) {
    // Validate creator has permission
    const canCreate = await this.validateEventCreator(creatorId, eventData.memorialId);
    if (!canCreate) throw new Error('UNAUTHORIZED');
    
    // Save event
    const event = await this.saveEvent({
      ...eventData,
      createdBy: creatorId,
      status: 'published'
    });
    
    // Get all memorial followers
    const followers = await this.getMemorialFollowers(eventData.memorialId);
    
    // Queue notifications based on schedule
    await this.queueEventNotifications(event, followers);
    
    // If recurring, generate future instances
    if (eventData.isRecurring) {
      await this.generateRecurringInstances(event, eventData.recurrenceRule);
    }
    
    return event;
  }
  
  async queueEventNotifications(event, followers) {
    const notificationSchedule = [
      { time: 'event_created', offset: 0 },
      { time: '2_weeks', offset: -14 * 24 * 60 },
      { time: '1_week', offset: -7 * 24 * 60 },
      { time: '3_days', offset: -3 * 24 * 60 },
      { time: '1_day', offset: -24 * 60 },
      { time: 'morning_of', offset: -8 * 60 }, // 8am day of
      { time: '1_hour', offset: -60 }
    ];
    
    for (const follower of followers) {
      const prefs = await this.getUserNotificationPrefs(follower.userId);
      
      for (const schedule of notificationSchedule) {
        if (this.shouldSendNotification(event, prefs, schedule)) {
          await this.queueNotification({
            recipientId: follower.userId,
            eventId: event.id,
            notificationType: schedule.time === 0 ? 'event_created' : 'event_reminder',
            scheduledFor: this.calculateNotificationTime(event.datetime, schedule.offset),
            channels: this.getEnabledChannels(prefs)
          });
        }
      }
    }
  }
}
```

#### Notification Delivery System
```javascript
class NotificationDeliveryService {
  async processNotificationQueue() {
    // Run every minute
    const pending = await this.getPendingNotifications();
    
    for (const notification of pending) {
      try {
        const user = await this.getUser(notification.recipientId);
        const event = await this.getEvent(notification.eventId);
        const memorial = await this.getMemorial(notification.memorialId);
        
        // Send through each channel
        const results = await Promise.allSettled([
          this.channels.email && this.sendEmail(user, event, memorial),
          this.channels.sms && this.sendSMS(user, event, memorial),
          this.channels.push && this.sendPushNotification(user, event, memorial),
          this.channels.inApp && this.createInAppNotification(user, event, memorial)
        ]);
        
        // Update notification status
        await this.markNotificationSent(notification.id);
        
      } catch (error) {
        await this.handleNotificationError(notification, error);
      }
    }
  }
  
  async sendEmail(user, event, memorial) {
    const template = this.getEmailTemplate(event.eventType);
    
    const emailData = {
      to: user.email,
      subject: `${event.title} - ${memorial.name}`,
      html: template({
        userName: user.name,
        memorialName: memorial.name,
        eventTitle: event.title,
        eventDate: this.formatDate(event.datetime),
        eventLocation: event.location.name,
        eventDescription: event.description,
        rsvpLink: `${BASE_URL}/events/${event.id}/rsvp`,
        unsubscribeLink: `${BASE_URL}/unsubscribe/${user.unsubscribeToken}`
      })
    };
    
    return await this.emailService.send(emailData);
  }
  
  async sendSMS(user, event, memorial) {
    if (!user.phone) return;
    
    const message = this.formatSMSMessage({
      event: event.title,
      memorial: memorial.name,
      date: this.formatDate(event.datetime),
      location: event.location.name
    });
    
    return await this.smsService.send({
      to: user.phone,
      message: message.substring(0, 160) // SMS character limit
    });
  }
}
```

## 2. Multi-Channel Notification Integration

### Supported Channels

#### Email (Primary)
- Rich HTML templates with memorial photos
- Calendar .ics attachments for easy adding
- RSVP buttons directly in email
- Unsubscribe links for compliance

#### SMS (High Priority)
```javascript
// Using Twilio or similar
const smsTemplates = {
  balloon_release: "🎈 Balloon release for {memorial} on {date} at {location}. RSVP: {link}",
  vigil: "🕯️ Candlelight vigil for {memorial} on {date} at {location}. Reply YES to attend",
  celebration: "🎉 Celebrating {memorial}'s life on {date}. Details: {link}"
};
```

#### Push Notifications (Mobile App)
```javascript
// Using Firebase Cloud Messaging
const pushPayload = {
  notification: {
    title: event.title,
    body: `${event.eventType} for ${memorial.name}`,
    icon: memorial.photoUrl,
    click_action: `OPEN_EVENT_${event.id}`
  },
  data: {
    eventId: event.id,
    memorialId: memorial.id,
    eventType: event.eventType
  }
};
```

#### In-App Notifications
- Bell icon with unread count
- Timeline of upcoming events
- Quick RSVP without leaving page

## 3. Event Types & Templates

### Pre-Configured Event Types

```javascript
const eventTemplates = {
  balloon_release: {
    icon: '🎈',
    defaultTitle: 'Balloon Release Ceremony',
    suggestedDuration: 30,
    defaultDescription: 'Join us as we release balloons in memory of {name}',
    supplies: ['Biodegradable balloons will be provided'],
    weatherSensitive: true
  },
  
  vigil: {
    icon: '🕯️',
    defaultTitle: 'Candlelight Vigil',
    suggestedDuration: 60,
    defaultDescription: 'A peaceful gathering to honor {name}\'s memory',
    supplies: ['Candles provided', 'Bring photos to share'],
    bestTime: 'evening'
  },
  
  picnic: {
    icon: '🧺',
    defaultTitle: 'Memorial Picnic',
    suggestedDuration: 180,
    defaultDescription: 'Celebrate {name}\'s life with food and fellowship',
    supplies: ['Bring a dish to share', 'Chairs recommended'],
    weatherSensitive: true
  },
  
  bbq: {
    icon: '🍖',
    defaultTitle: 'Memorial BBQ',
    suggestedDuration: 240,
    defaultDescription: 'Honor {name} the way they loved - with good food and friends',
    supplies: ['Meat will be provided', 'Bring sides/drinks'],
    weatherSensitive: true
  },
  
  birthday_remembrance: {
    icon: '🎂',
    defaultTitle: 'Birthday Remembrance',
    suggestedDuration: 120,
    defaultDescription: 'Celebrating {name}\'s birthday in heaven',
    isRecurring: true,
    recurrenceRule: 'FREQ=YEARLY'
  }
};
```

## 4. Smart Notification Features

### Intelligent Scheduling
```javascript
class SmartScheduler {
  // Avoid quiet hours
  adjustForQuietHours(scheduledTime, userPrefs) {
    if (!userPrefs.quietHours.enabled) return scheduledTime;
    
    const hour = scheduledTime.getHours();
    const { start, end } = userPrefs.quietHours;
    
    if (hour >= start || hour < end) {
      // Push to next morning
      return this.setTime(scheduledTime, end, 0);
    }
    return scheduledTime;
  }
  
  // Weather-aware rescheduling
  async checkWeatherContingency(event) {
    if (!event.weatherSensitive) return;
    
    const forecast = await this.weatherAPI.getForecast(
      event.location.coordinates,
      event.datetime
    );
    
    if (forecast.precipitation > 70) {
      await this.notifyWeatherConcern(event, forecast);
    }
  }
  
  // Conflict detection
  async detectEventConflicts(userId, eventDateTime) {
    const userEvents = await this.getUserEvents(userId, eventDateTime);
    
    if (userEvents.length > 0) {
      return {
        hasConflict: true,
        conflictingEvents: userEvents
      };
    }
    return { hasConflict: false };
  }
}
```

### Notification Aggregation
```javascript
// Batch multiple notifications
class NotificationAggregator {
  async aggregateNotifications(userId) {
    const pending = await this.getPendingForUser(userId);
    
    if (pending.length > 3) {
      // Combine into digest
      return this.createDigestNotification(pending);
    }
    
    return pending;
  }
}
```

## 5. RSVP & Attendance Management

### RSVP Flow
```javascript
class RSVPManager {
  async handleRSVP(eventId, userId, response) {
    const existing = await this.getExistingRSVP(eventId, userId);
    
    if (existing) {
      await this.updateRSVP(existing.id, response);
    } else {
      await this.createRSVP({
        eventId,
        userId,
        response,
        notificationsEnabled: true
      });
    }
    
    // Notify event creator
    await this.notifyCreatorOfRSVP(eventId, userId, response);
    
    // Update attendance count
    await this.updateAttendanceCount(eventId);
    
    return { success: true };
  }
  
  async sendRSVPReminders(eventId) {
    const maybes = await this.getMaybeRSVPs(eventId);
    
    for (const rsvp of maybes) {
      await this.sendReminderToConfirm(rsvp);
    }
  }
}
```

## 6. Revenue Generation

### Premium Event Features ($4.99/month)
- Unlimited event creation (free tier: 3/month)
- Advanced RSVP management with waitlists
- Custom event templates
- Weather monitoring & alerts
- Professional invitation designs
- Event photo galleries
- Post-event thank you automation

### B2B Partnerships
- **Funeral Homes**: White-label event system ($500/month)
- **Florists**: Event supply partnerships (15% commission)
- **Event Venues**: Preferred location listings ($100/month)
- **Catering Services**: BBQ/picnic partnerships (10% referral)

## 7. Implementation Roadmap

### Phase 1: Core Event System (Week 1-2)
- Basic event CRUD operations
- Memorial event association
- Simple notification queue
- Email notifications only

### Phase 2: Multi-Channel Delivery (Week 3-4)
- SMS integration (Twilio)
- Push notifications (Firebase)
- In-app notification center
- User preference management

### Phase 3: Smart Features (Week 5-6)
- RSVP system
- Recurring events
- Weather integration
- Conflict detection
- Quiet hours respect

### Phase 4: Premium Features (Week 7-8)
- Event templates marketplace
- Photo galleries
- Attendance tracking
- Post-event surveys
- Analytics dashboard

## 8. Technical Requirements

### External Services
```javascript
// Required integrations
const services = {
  email: 'SendGrid or AWS SES',
  sms: 'Twilio or MessageBird',
  push: 'Firebase Cloud Messaging',
  weather: 'OpenWeatherMap API',
  calendar: 'Google Calendar API',
  maps: 'Google Maps or Mapbox'
};

// Environment variables needed
SENDGRID_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
FIREBASE_SERVER_KEY=
OPENWEATHER_API_KEY=
```

### Performance Considerations
- Queue processing with Redis/Bull
- Notification batching for efficiency
- Rate limiting to prevent spam
- Retry logic with exponential backoff
- Dead letter queue for failed notifications

## 9. Success Metrics

### Engagement Metrics
- Events created per memorial
- RSVP rate
- Notification open rate
- Event attendance rate
- Recurring event retention

### Revenue Metrics
- Premium subscription conversion
- Partnership revenue
- Average revenue per event
- Lifetime value increase

### Community Impact
- Community gathering frequency
- Multi-generational attendance
- Grief support connections made
- Memorial visit frequency increase

## 10. Competitive Advantages

| Feature | Opictuary | Facebook Events | Evite | Funeral Home Sites |
|---------|-----------|-----------------|-------|-------------------|
| Memorial-specific | ✅ | ❌ | ❌ | ⚠️ Limited |
| Recurring memorials | ✅ | ⚠️ | ⚠️ | ❌ |
| Multi-channel alerts | ✅ | ⚠️ | ✅ | ❌ |
| Weather contingency | ✅ | ❌ | ❌ | ❌ |
| Grief-appropriate | ✅ | ❌ | ❌ | ✅ |
| Integrated with memorial | ✅ | ❌ | ❌ | ⚠️ |

## Conclusion

The Memorial Notification Network transforms Opictuary from a static memorial platform into an active community hub. By facilitating real-world gatherings through intelligent event scheduling and multi-channel notifications, it drives recurring engagement, strengthens community bonds, and creates new revenue opportunities while maintaining the platform's dignified, respectful approach to remembrance.

Expected impact:
- 40% increase in monthly active users
- 3x increase in platform visits per user
- $50K-100K annual revenue from premium subscriptions
- $25K-50K from B2B partnerships