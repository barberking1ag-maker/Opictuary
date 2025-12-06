import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, json, index, jsonb, uniqueIndex, check } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // No default - Replit Auth provides ID from sub claim
  email: varchar("email").unique("users_email_key"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  bio: text("bio"),
  timezone: varchar("timezone").default("America/New_York"),
  language: varchar("language", { length: 10 }).default("en"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User settings table for notification and privacy preferences
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  // Notification preferences
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  memorialUpdates: boolean("memorial_updates").default(true),
  donationReceipts: boolean("donation_receipts").default(true),
  scheduledMessageReminders: boolean("scheduled_message_reminders").default(true),
  // Privacy preferences
  shareActivityWithCreators: boolean("share_activity_with_creators").default(true),
  publicProfile: boolean("public_profile").default(true),
  // Other settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const memorials = pgTable("memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  birthDate: text("birth_date").notNull(),
  deathDate: text("death_date").notNull(),
  biography: text("biography"),
  epitaph: text("epitaph"),
  prefaceText: text("preface_text"),
  backgroundImage: text("background_image"),
  inviteCode: varchar("invite_code", { length: 20 }).notNull().unique(),
  religion: text("religion"),
  cemeteryName: text("cemetery_name"),
  cemeteryLocation: text("cemetery_location"),
  cemeteryCoordinates: json("cemetery_coordinates").$type<{ lat: number; lng: number }>(),
  fontFamily: text("font_family"),
  symbol: text("symbol"),
  timezone: varchar("timezone").default("America/New_York"),
  isPublic: boolean("is_public").default(false),
  creatorEmail: text("creator_email"),
  ownershipType: text("ownership_type").default("family_created"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_memorials_creator_email").on(table.creatorEmail),
  index("idx_memorials_created_at").on(table.createdAt),
  index("idx_memorials_is_public").on(table.isPublic),
]);

export const memorialAdmins = pgTable("memorial_admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("admin"),
  canManageQR: boolean("can_manage_qr").default(true),
  canEditMemorial: boolean("can_edit_memorial").default(true),
  canApproveContent: boolean("can_approve_content").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_memorial_admins_memorial_id").on(table.memorialId),
  index("idx_memorial_admins_email").on(table.email),
]);

export const qrCodes = pgTable("qr_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  purpose: text("purpose").notNull().default("tombstone"), // 'tombstone', 'memorial_card', 'event', 'general_upload'
  qrType: text("qr_type").default("standard"), // 'standard', 'premium', 'custom'
  issuedToEmail: text("issued_to_email"),
  expiresAt: timestamp("expires_at"),
  status: text("status").notNull().default("active"),
  // Media attachments visible when QR is scanned
  title: text("title"),
  description: text("description"),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  mediaType: text("media_type"), // 'video', 'image', 'message', 'mixed'
  // Analytics metadata
  totalScans: integer("total_scans").default(0),
  lastScannedAt: timestamp("last_scanned_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_qr_codes_memorial_id").on(table.memorialId),
  index("idx_qr_codes_status").on(table.status),
  index("idx_qr_codes_purpose").on(table.purpose),
]);

export const memories = pgTable("memories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  caption: text("caption").notNull(),
  mediaUrl: text("media_url"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_memories_memorial_id").on(table.memorialId),
  index("idx_memories_is_approved").on(table.isApproved),
]);

// QR Code scan analytics tracking
export const qrScans = pgTable("qr_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  qrCodeId: varchar("qr_code_id").notNull().references(() => qrCodes.id, { onDelete: "cascade" }),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  // Scan context
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  scannerType: text("scanner_type").default("visitor"), // 'visitor', 'family', 'admin'
  // Location data
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  geolocationConsent: boolean("geolocation_consent").default(false).notNull(),
  // Device & technical data
  userAgent: text("user_agent"),
  deviceType: text("device_type"), // 'mobile', 'tablet', 'desktop'
  browser: text("browser"),
  operatingSystem: text("operating_system"),
  ipAddress: text("ip_address"),
  // Scan outcome
  action: text("action"), // 'view_memorial', 'upload_photo', 'view_gallery', 'share'
  uploadedMediaId: varchar("uploaded_media_id").references(() => memories.id, { onDelete: "set null" }),
  sessionDuration: integer("session_duration"), // in seconds
  scannedAt: timestamp("scanned_at").defaultNow(),
}, (table) => [
  index("idx_qr_scans_qr_code_id").on(table.qrCodeId),
  index("idx_qr_scans_memorial_id").on(table.memorialId),
  index("idx_qr_scans_scanned_at").on(table.scannedAt),
  index("idx_qr_scans_scanner_type").on(table.scannerType),
]);

// Religious and spiritual symbols library
export const religiousSymbols = pgTable("religious_symbols", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'christian', 'islamic', 'jewish', 'buddhist', 'hindu', 'spiritual', 'cultural', 'custom'
  symbolUrl: text("symbol_url").notNull(),
  symbolUnicode: text("symbol_unicode"), // For text-based symbols like ✝️
  description: text("description"),
  isCustom: boolean("is_custom").default(false),
  uploadedBy: varchar("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_religious_symbols_category").on(table.category),
  index("idx_religious_symbols_is_custom").on(table.isCustom),
]);

// Memorial symbol associations
export const memorialSymbols = pgTable("memorial_symbols", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  symbolId: varchar("symbol_id").notNull().references(() => religiousSymbols.id, { onDelete: "cascade" }),
  position: integer("position").default(0), // For ordering multiple symbols
  size: text("size").default("medium"), // 'small', 'medium', 'large'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_memorial_symbols_memorial_id").on(table.memorialId),
]);

// Memorial playlists for slideshows
export const memorialPlaylists = pgTable("memorial_playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  songs: jsonb("songs").notNull().$type<Array<{
    title: string;
    artist: string;
    url?: string;
    spotifyId?: string;
    appleMusicId?: string;
    duration?: number;
  }>>().default([]),
  isDefault: boolean("is_default").default(false),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_memorial_playlists_memorial_id").on(table.memorialId),
  index("idx_memorial_playlists_is_default").on(table.isDefault),
]);

// Memorial slideshows with music
export const memorialSlideshows = pgTable("memorial_slideshows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  playlistId: varchar("playlist_id").references(() => memorialPlaylists.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  photoIds: jsonb("photo_ids").notNull().$type<string[]>().default([]), // Array of memory IDs
  transitionEffect: text("transition_effect").default("fade"), // 'fade', 'slide', 'zoom', 'ken-burns'
  photoDuration: integer("photo_duration").default(5000), // milliseconds per photo
  syncToBeats: boolean("sync_to_beats").default(false),
  autoplay: boolean("autoplay").default(true),
  loop: boolean("loop").default(true),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_memorial_slideshows_memorial_id").on(table.memorialId),
]);

// Video condolences
export const videoCondolences = pgTable("video_condolences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  relationship: text("relationship"), // 'friend', 'family', 'colleague', 'neighbor', etc.
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // seconds
  transcription: text("transcription"), // Auto-generated or manual
  isApproved: boolean("is_approved").default(false),
  isPrivate: boolean("is_private").default(false), // Only visible to family
  deliveryDate: timestamp("delivery_date"), // For time-locked delivery
  location: text("location"), // Where recorded from
  deviceType: text("device_type"), // 'mobile', 'webcam', 'professional'
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_video_condolences_memorial_id").on(table.memorialId),
  index("idx_video_condolences_is_approved").on(table.isApproved),
  index("idx_video_condolences_delivery_date").on(table.deliveryDate),
]);

// Memory Comments - comments on individual photos/videos
export const memoryComments = pgTable("memory_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memoryId: varchar("memory_id").notNull().references(() => memories.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  comment: text("comment").notNull(),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_memory_comments_memory_id").on(table.memoryId),
  index("idx_memory_comments_user_id").on(table.userId),
]);

// Memory Condolences - condolences on individual photos/videos
export const memoryCondolences = pgTable("memory_condolences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memoryId: varchar("memory_id").notNull().references(() => memories.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_memory_condolences_memory_id").on(table.memoryId),
  index("idx_memory_condolences_user_id").on(table.userId),
]);

// Memory Reactions - hearts/likes on individual photos/videos
export const memoryReactions = pgTable("memory_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memoryId: varchar("memory_id").notNull().references(() => memories.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  userName: text("user_name").notNull(),
  userEmail: text("user_email"),
  reactionType: text("reaction_type").notNull().default("heart"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_memory_reactions_memory_id").on(table.memoryId),
  index("idx_memory_reactions_user_id").on(table.userId),
  uniqueIndex("idx_memory_reactions_unique_user").on(table.memoryId, table.userId, table.userEmail),
]);

export const condolences = pgTable("condolences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_condolences_memorial_id").on(table.memorialId),
]);

// Memorial Likes - track who liked a memorial
export const memorialLikes = pgTable("memorial_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  userName: text("user_name").notNull(), // For non-logged in users
  userEmail: text("user_email"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_memorial_likes_memorial_id").on(table.memorialId),
  index("idx_memorial_likes_user_id").on(table.userId),
]);

// Memorial Comments - threaded comments on memorials
export const memorialComments = pgTable("memorial_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  comment: text("comment").notNull(),
  parentCommentId: varchar("parent_comment_id"), // For threaded replies
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_memorial_comments_memorial_id").on(table.memorialId),
  index("idx_memorial_comments_user_id").on(table.userId),
  index("idx_memorial_comments_parent_id").on(table.parentCommentId),
]);

// Memorial Condolence Reactions - emoji reactions for memorials (candle, prayer, flowers, heart)
export const memorialCondolenceReactions = pgTable("memorial_condolence_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  reactionType: text("reaction_type").notNull(), // 'candle', 'prayer', 'flowers', 'heart'
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  sessionId: varchar("session_id"), // For anonymous users
  userEmail: text("user_email"),
  userName: text("user_name"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  memorialIdIndex: index("idx_memorial_condolence_reactions_memorial_id").on(table.memorialId),
  reactionTypeIndex: index("idx_memorial_condolence_reactions_type").on(table.reactionType),
  // Partial unique index for authenticated users (ignores sessionId which is NULL)
  authenticatedUserUnique: uniqueIndex("authenticated_user_reaction_unique")
    .on(table.memorialId, table.reactionType, table.userId)
    .where(sql`${table.userId} IS NOT NULL`),
  // Partial unique index for anonymous users (ignores userId which is NULL)
  anonymousUserUnique: uniqueIndex("anonymous_user_reaction_unique")
    .on(table.memorialId, table.reactionType, table.sessionId)
    .where(sql`${table.sessionId} IS NOT NULL`),
  // Database-level CHECK constraint to enforce exactly one identity field
  identityCheck: check(
    "identity_check",
    sql`(
      (user_id IS NOT NULL AND session_id IS NULL) OR
      (user_id IS NULL AND session_id IS NOT NULL)
    )`
  ),
}));

// Saved Memorials - users can save memorials with relationship categories
export const savedMemorials = pgTable("saved_memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  relationshipCategory: text("relationship_category").notNull(), // 'family', 'friend', 'colleague', 'police_officer', 'firefighter', 'military', 'teacher', 'mentor', 'neighbor', 'acquaintance', 'other'
  customCategory: text("custom_category"), // For 'other' category
  notes: text("notes"), // Optional personal notes about the relationship
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_saved_memorials_user_id").on(table.userId),
  index("idx_saved_memorials_memorial_id").on(table.memorialId),
  index("idx_saved_memorials_relationship").on(table.relationshipCategory),
]);

// Memorial Live Streams - for virtual attendance
export const memorialLiveStreams = pgTable("memorial_live_streams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  streamUrl: text("stream_url").notNull(), // YouTube, Zoom, or other streaming URL
  streamType: text("stream_type").notNull(), // 'youtube', 'zoom', 'facebook', 'custom'
  scheduledStartTime: timestamp("scheduled_start_time").notNull(),
  scheduledEndTime: timestamp("scheduled_end_time"),
  isLive: boolean("is_live").default(false),
  viewerCount: integer("viewer_count").default(0),
  recordingUrl: text("recording_url"), // For post-event viewing
  isPublic: boolean("is_public").default(true),
  requiresPassword: boolean("requires_password").default(false),
  password: text("password"), // Optional password for private streams
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_memorial_live_streams_memorial_id").on(table.memorialId),
  index("idx_memorial_live_streams_start_time").on(table.scheduledStartTime),
]);

// Memorial Live Stream Viewers - track who joined virtual attendance
export const memorialLiveStreamViewers = pgTable("memorial_live_stream_viewers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  streamId: varchar("stream_id").notNull().references(() => memorialLiveStreams.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  viewerName: text("viewer_name").notNull(),
  viewerEmail: text("viewer_email"),
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  durationMinutes: integer("duration_minutes"),
}, (table) => [
  index("idx_memorial_live_stream_viewers_stream_id").on(table.streamId),
  index("idx_memorial_live_stream_viewers_user_id").on(table.userId),
]);

export const scheduledMessages = pgTable("scheduled_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  recipientName: text("recipient_name").notNull(),
  recipientEmail: text("recipient_email"),
  eventType: text("event_type").notNull(), // 'birthday', 'graduation', 'wedding', 'anniversary', 'baby_birth', 'holiday', 'mother_day', 'father_day', 'christmas', 'new_year', 'custom'
  customEventName: text("custom_event_name"), // For custom event types
  eventDate: text("event_date"),
  sendTime: text("send_time").default("09:00"), // Time of day to send (HH:MM format)
  message: text("message").notNull(),
  mediaUrl: text("media_url"), // Video or media URL for the milestone
  mediaType: text("media_type").default("text"), // 'text', 'video', 'image', 'mixed'
  attachmentUrls: text("attachment_urls").array(), // Multiple media attachments
  isRecurring: boolean("is_recurring").default(false),
  recurrenceInterval: text("recurrence_interval"), // 'daily', 'weekly', 'monthly', 'yearly', 'custom'
  recurrenceCount: integer("recurrence_count"), // Number of times to repeat (null = forever)
  recurrenceEndDate: timestamp("recurrence_end_date"), // When to stop recurring
  nextSendDate: timestamp("next_send_date"), // When to send next occurrence
  lastSentAt: timestamp("last_sent_at"), // Track when last sent for recurring messages
  sentCount: integer("sent_count").default(0), // Track how many times sent for recurring messages
  status: text("status").default("pending"), // 'draft', 'pending', 'sent', 'failed', 'completed'
  isSent: boolean("is_sent").default(false),
  sentAt: timestamp("sent_at"),
  // Email delivery tracking
  deliveryStatus: text("delivery_status").default("pending"), // 'pending', 'sent', 'failed', 'bounced'
  deliveryError: text("delivery_error"), // Error message if delivery failed
  deliveryAttempts: integer("delivery_attempts").default(0), // Number of delivery attempts
  lastDeliveryAttempt: timestamp("last_delivery_attempt"), // Timestamp of last delivery attempt
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_scheduled_messages_memorial_id").on(table.memorialId),
  index("idx_scheduled_messages_status").on(table.status),
  index("idx_scheduled_messages_event_date").on(table.eventDate),
  index("idx_scheduled_messages_next_send_date").on(table.nextSendDate),
  index("idx_scheduled_messages_delivery_status").on(table.deliveryStatus),
]);

// Video Time Capsules - Pre-recorded videos that release on milestones
export const videoTimeCapsules = pgTable("video_time_capsules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  qrCodeId: varchar("qr_code_id").references(() => qrCodes.id, { onDelete: "set null" }), // Optional link to QR code
  
  // Video information
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(), // The pre-recorded video URL
  thumbnailUrl: text("thumbnail_url"), // Video thumbnail
  
  // Recipient/viewer information
  recipientName: text("recipient_name"), // Who the video is intended for (optional)
  recipientRelationship: text("recipient_relationship"), // e.g., "daughter", "son", "friend"
  
  // Milestone scheduling
  milestoneType: text("milestone_type").notNull(), // 'birthday', 'graduation', 'wedding', 'anniversary', 'baby_birth', 'holiday', 'custom'
  customMilestoneName: text("custom_milestone_name"), // For custom milestones
  releaseDate: text("release_date").notNull(), // When to unlock the video
  releaseTime: text("release_time").default("00:00"), // Time of day to release (HH:MM format)
  
  // Recurrence support (for annual milestones like birthdays)
  isRecurring: boolean("is_recurring").default(false),
  recurrenceInterval: text("recurrence_interval"), // 'yearly', 'custom'
  recurrenceEndDate: timestamp("recurrence_end_date"), // When to stop recurring
  nextReleaseDate: timestamp("next_release_date"), // When to release next occurrence
  releasedCount: integer("released_count").default(0), // Track how many times released
  
  // Release status
  status: text("status").default("scheduled"), // 'scheduled', 'released', 'viewed', 'expired'
  isReleased: boolean("is_released").default(false),
  releasedAt: timestamp("released_at"),
  
  // Visibility controls
  isPublic: boolean("is_public").default(false), // Whether visible to all memorial visitors
  requiresQRScan: boolean("requires_qr_scan").default(false), // Only accessible via QR code
  
  // Analytics
  viewCount: integer("view_count").default(0),
  uniqueViewers: integer("unique_viewers").default(0),
  lastViewedAt: timestamp("last_viewed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_video_time_capsules_memorial_id").on(table.memorialId),
  index("idx_video_time_capsules_qr_code_id").on(table.qrCodeId),
  index("idx_video_time_capsules_status").on(table.status),
  index("idx_video_time_capsules_release_date").on(table.releaseDate),
  index("idx_video_time_capsules_next_release_date").on(table.nextReleaseDate),
  index("idx_video_time_capsules_is_released").on(table.isReleased),
]);

// Track individual views of video time capsules
export const videoTimeCapsuleViews = pgTable("video_time_capsule_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  capsuleId: varchar("capsule_id").notNull().references(() => videoTimeCapsules.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  viewerName: text("viewer_name"),
  viewerEmail: text("viewer_email"),
  viewDuration: integer("view_duration"), // Seconds watched
  completedVideo: boolean("completed_video").default(false), // Whether they watched to the end
  viewedAt: timestamp("viewed_at").defaultNow(),
}, (table) => [
  index("idx_video_time_capsule_views_capsule_id").on(table.capsuleId),
  index("idx_video_time_capsule_views_user_id").on(table.userId),
  index("idx_video_time_capsule_views_viewed_at").on(table.viewedAt),
]);

export const fundraisers = pgTable("fundraisers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  goalAmount: decimal("goal_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  charityName: text("charity_name"),
  platformFeePercentage: decimal("platform_fee_percentage", { precision: 5, scale: 2 }).notNull().default("3.00"),
  // Expense breakdown - what the money will be used for
  expenseBreakdown: jsonb("expense_breakdown").$type<{
    burialCosts?: number;
    funeralService?: number;
    headstone?: number;
    flowers?: number;
    other?: number;
    otherDescription?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_fundraisers_memorial_id").on(table.memorialId),
]);

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fundraiserId: varchar("fundraiser_id").notNull().references(() => fundraisers.id, { onDelete: "cascade" }),
  donorName: text("donor_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFeeAmount: decimal("platform_fee_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  isAnonymous: boolean("is_anonymous").default(false),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_donations_fundraiser_id").on(table.fundraiserId),
  index("idx_donations_created_at").on(table.createdAt),
]);

export const celebrityMemorials = pgTable("celebrity_memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title").notNull(),
  biography: text("biography"),
  imageUrl: text("image_url"),
  charityName: text("charity_name").notNull(),
  donationAmount: decimal("donation_amount", { precision: 10, scale: 2 }).notNull().default("10"),
  platformPercentage: integer("platform_percentage").notNull().default(5),
  fanCount: integer("fan_count").default(0),
  
  // Profession categorization
  professionCategory: text("profession_category"),
  subProfession: text("sub_profession"),
  achievements: json("achievements").$type<Array<{ title: string; year: string; description?: string }>>(),
  awards: json("awards").$type<Array<{ name: string; year: string; category?: string }>>(),
  
  // Verification system
  verificationStatus: text("verification_status").default("pending"),
  verifiedBy: text("verified_by"),
  verificationDate: timestamp("verification_date"),
  verificationDocuments: json("verification_documents").$type<Array<{ type: string; url: string; uploadedAt: string }>>(),
  submitterName: text("submitter_name"),
  submitterEmail: text("submitter_email"),
  submitterRelationship: text("submitter_relationship"),
  submitterPhone: text("submitter_phone"),
  
  // Customization options
  memorialTemplate: text("memorial_template"),
  customStickers: json("custom_stickers").$type<Array<{ name: string; imageUrl: string; category: string }>>(),
  themeColors: json("theme_colors").$type<{ primary: string; secondary: string; accent: string }>(),
  
  // Dates
  birthDate: text("birth_date"),
  deathDate: text("death_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const celebrityDonations = pgTable("celebrity_donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  celebrityMemorialId: varchar("celebrity_memorial_id").notNull().references(() => celebrityMemorials.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  charityAmount: decimal("charity_amount", { precision: 10, scale: 2 }).notNull(),
  platformAmount: decimal("platform_amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_celebrity_donations_memorial_id").on(table.celebrityMemorialId),
  index("idx_celebrity_donations_created_at").on(table.createdAt),
]);

// Celebrity Fan Content - Exclusive videos and photos from estates (no comments for integrity)
export const celebrityFanContent = pgTable("celebrity_fan_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  celebrityMemorialId: varchar("celebrity_memorial_id").notNull().references(() => celebrityMemorials.id, { onDelete: "cascade" }),
  contentType: text("content_type").notNull(), // 'video_message', 'photo', 'video', 'audio_message'
  title: text("title").notNull(),
  description: text("description"),
  mediaUrl: text("media_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isVideoMessage: boolean("is_video_message").default(false), // Special flag for messages from the deceased to fans
  uploadedByEstate: boolean("uploaded_by_estate").default(true),
  uploaderName: text("uploader_name"),
  uploaderEmail: text("uploader_email"),
  viewCount: integer("view_count").default(0),
  isPublished: boolean("is_published").default(false), // Requires admin approval
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_celebrity_fan_content_memorial_id").on(table.celebrityMemorialId),
  index("idx_celebrity_fan_content_is_published").on(table.isPublished),
  index("idx_celebrity_fan_content_content_type").on(table.contentType),
]);

export const griefSupport = pgTable("grief_support", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().unique().references(() => memorials.id, { onDelete: "cascade" }),
  familyContact: text("family_contact"),
  pastoralContact: text("pastoral_contact"),
  customContacts: json("custom_contacts").$type<Array<{ label: string; value: string; type: string }>>(),
});

export const legacyEvents = pgTable("legacy_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  eventType: text("event_type").notNull(), // 'candlelight_vigil', 'barbecue', 'block_party', 'memorial_service', 'celebration_of_life', 'custom'
  description: text("description"),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time"),
  location: text("location"),
  attendeeCount: integer("attendee_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_legacy_events_memorial_id").on(table.memorialId),
]);

export const musicPlaylists = pgTable("music_playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().unique().references(() => memorials.id, { onDelete: "cascade" }),
  tracks: json("tracks").$type<Array<{ id: string; title: string; artist: string; duration: string }>>().notNull(),
});

// Essential Workers Memorials
export const essentialWorkersMemorials = pgTable("essential_workers_memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  profession: text("profession").notNull(),
  category: text("category").notNull(),
  department: text("department"),
  yearsOfService: integer("years_of_service"),
  biography: text("biography"),
  imageUrl: text("image_url"),
  lineOfDutyDeath: boolean("line_of_duty_death").default(false),
  honors: json("honors").$type<Array<{ award: string; year: string; description: string }>>(),
  birthDate: text("birth_date"),
  deathDate: text("death_date"),
  fontFamily: text("font_family"),
  symbol: text("symbol"),
  isPublic: boolean("is_public").default(true),
  // Professional Details - Category Specific
  rank: text("rank"), // Military/Police rank (e.g., "Captain", "Sergeant", "Lieutenant Colonel")
  badgeNumber: text("badge_number"), // Police/Fire badge number
  unit: text("unit"), // Hospital unit, Fire station, Military unit
  serviceBranch: text("service_branch"), // Military branch (Army, Navy, Air Force, Marines, Coast Guard)
  specialization: text("specialization"), // Medical specialization (e.g., "Emergency Medicine", "ICU Nurse")
  precinct: text("precinct"), // Police precinct/district
  station: text("station"), // Fire station number/name
  deployments: json("deployments").$type<Array<{ location: string; years: string; campaign?: string }>>(), // Military deployments
  certifications: text("certifications").array(), // Professional certifications
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_essential_workers_category").on(table.category),
  index("idx_essential_workers_is_public").on(table.isPublic),
  index("idx_essential_workers_created_at").on(table.createdAt),
]);

// Hood/Neighborhood Memorials
export const hoodMemorials = pgTable("hood_memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nickname: text("nickname"),
  birthDate: text("birth_date").notNull(),
  deathDate: text("death_date").notNull(),
  biography: text("biography"),
  epitaph: text("epitaph"),
  imageUrl: text("image_url"),
  // Neighborhood/Community Details
  neighborhoodName: text("neighborhood_name").notNull(),
  neighborhoodLogoUrl: text("neighborhood_logo_url"),
  clubName: text("club_name"),
  clubLogoUrl: text("club_logo_url"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  role: text("role"), // "Community Leader", "Youth Mentor", "Block Captain", etc.
  communityImpact: text("community_impact"),
  legendStatus: text("legend_status"), // "Hood Legend", "Community Icon", "Neighborhood OG", etc.
  // Memorial Settings
  fontFamily: text("font_family"),
  symbol: text("symbol"),
  isPublic: boolean("is_public").default(true),
  creatorEmail: text("creator_email"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_hood_memorials_neighborhood").on(table.neighborhoodName),
  index("idx_hood_memorials_city_state").on(table.city, table.state),
  index("idx_hood_memorials_is_public").on(table.isPublic),
  index("idx_hood_memorials_created_at").on(table.createdAt),
]);

// Self-Written Obituaries & Final Words
export const selfWrittenObituaries = pgTable("self_written_obituaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userEmail: text("user_email").notNull().unique(),
  fullName: text("full_name").notNull(),
  birthDate: text("birth_date"),
  biography: text("biography"),
  epitaph: text("epitaph"),
  finalWordsText: text("final_words_text"),
  finalWordsVideoUrl: text("final_words_video_url"),
  fontFamily: text("font_family"),
  symbol: text("symbol"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactEmail: text("emergency_contact_email"),
  emergencyContactPhone: text("emergency_contact_phone"),
  releaseInstructions: text("release_instructions"),
  isActivated: boolean("is_activated").default(false),
  activatedAt: timestamp("activated_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Neighborhoods table for managing community/neighborhood profiles
export const neighborhoods = pgTable("neighborhoods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  backgroundImage: text("background_image"),
  foundedYear: text("founded_year"),
  population: integer("population"),
  landmarks: text("landmarks").array(),
  notableFeatures: text("notable_features"),
  isPublic: boolean("is_public").default(true),
  creatorEmail: text("creator_email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_neighborhoods_state").on(table.state),
  index("idx_neighborhoods_city").on(table.city),
  index("idx_neighborhoods_creator_email").on(table.creatorEmail),
  uniqueIndex("idx_neighborhoods_unique_name").on(table.name, table.city, table.state),
]);

// Alumni Memorials - for honoring deceased alumni
export const alumniMemorials = pgTable("alumni_memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").references(() => memorials.id, { onDelete: "cascade" }).unique(),
  fullName: text("full_name").notNull(),
  preferredName: text("preferred_name"),
  birthDate: text("birth_date").notNull(),
  deathDate: text("death_date").notNull(),
  biography: text("biography"),
  epitaph: text("epitaph"),
  heroImageUrl: text("hero_image_url"),
  schoolName: text("school_name").notNull(),
  campusLocation: text("campus_location"),
  graduationYear: text("graduation_year"),
  degreeType: text("degree_type"),
  major: text("major"),
  schoolLogoUrl: text("school_logo_url"),
  activities: json("activities").$type<Array<{ name: string; role: string; years: string }>>(),
  notableAchievements: json("notable_achievements").$type<Array<string>>(),
  classNotes: text("class_notes"),
  isPublic: boolean("is_public").default(true),
  creatorEmail: text("creator_email"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_alumni_memorials_school_name").on(table.schoolName),
  index("idx_alumni_memorials_graduation_year").on(table.graduationYear),
  index("idx_alumni_memorials_major").on(table.major),
  index("idx_alumni_memorials_is_public").on(table.isPublic),
  index("idx_alumni_memorials_created_at").on(table.createdAt),
]);

// Prison Access System
export const prisonFacilities = pgTable("prison_facilities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  state: text("state").notNull(),
  facilityCode: text("facility_code").notNull().unique(),
  serviceProvider: text("service_provider"),
  feePerSession: decimal("fee_per_session", { precision: 10, scale: 2 }),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_prison_facilities_is_active").on(table.isActive),
  index("idx_prison_facilities_state").on(table.state),
]);

export const prisonAccessRequests = pgTable("prison_access_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  facilityId: varchar("facility_id").notNull().references(() => prisonFacilities.id),
  inmateFirstName: text("inmate_first_name").notNull(),
  inmateLastName: text("inmate_last_name").notNull(),
  inmateDocNumber: text("inmate_doc_number").notNull(),
  relationshipToDeceased: text("relationship_to_deceased").notNull(),
  requestedByName: text("requested_by_name").notNull(),
  requestedByEmail: text("requested_by_email").notNull(),
  requestedByPhone: text("requested_by_phone"),
  relationshipProofUrl: text("relationship_proof_url"),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_prison_access_memorial_id").on(table.memorialId),
  index("idx_prison_access_status").on(table.status),
  index("idx_prison_access_facility_id").on(table.facilityId),
  index("idx_prison_access_created_at").on(table.createdAt),
]);

export const prisonVerifications = pgTable("prison_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => prisonAccessRequests.id, { onDelete: "cascade" }),
  verificationType: text("verification_type").notNull(),
  verifiedBy: text("verified_by").notNull(),
  verificationData: json("verification_data").$type<Record<string, any>>(),
  status: text("status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_prison_verifications_request_id").on(table.requestId),
]);

export const prisonPayments = pgTable("prison_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => prisonAccessRequests.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  transactionId: text("transaction_id"),
  payerName: text("payer_name").notNull(),
  payerEmail: text("payer_email").notNull(),
  status: text("status").notNull().default("pending"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_prison_payments_request_id").on(table.requestId),
  index("idx_prison_payments_status").on(table.status),
]);

export const prisonAccessSessions = pgTable("prison_access_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => prisonAccessRequests.id, { onDelete: "cascade" }),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  accessToken: text("access_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_prison_sessions_request_id").on(table.requestId),
  index("idx_prison_sessions_memorial_id").on(table.memorialId),
  index("idx_prison_sessions_expires_at").on(table.expiresAt),
]);

export const prisonAuditLogs = pgTable("prison_audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").references(() => prisonAccessRequests.id, { onDelete: "set null" }),
  sessionId: varchar("session_id").references(() => prisonAccessSessions.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  performedBy: text("performed_by").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// BYUS Mediator App Tables
export const byusUsers = pgTable("byus_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: varchar("phone"),
  organization: text("organization"),
  role: text("role").default("user"), // user, mediator, admin
  isVerified: boolean("is_verified").default(false),
  verificationToken: text("verification_token"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_byus_users_email").on(table.email),
  index("idx_byus_users_role").on(table.role),
]);

export const byusMediations = pgTable("byus_mediations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => byusUsers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // dispute, divorce, business, family, other
  status: text("status").notNull().default("draft"), // draft, active, analyzing, resolved, archived
  party1Name: text("party1_name").notNull(),
  party1Email: text("party1_email"),
  party1Perspective: text("party1_perspective"),
  party2Name: text("party2_name").notNull(),
  party2Email: text("party2_email"),
  party2Perspective: text("party2_perspective"),
  desiredOutcome: text("desired_outcome"),
  additionalContext: text("additional_context"),
  aiAnalysisRequested: boolean("ai_analysis_requested").default(false),
  aiAnalysisCompleted: boolean("ai_analysis_completed").default(false),
  confidentialityLevel: text("confidentiality_level").default("standard"), // public, standard, confidential
  professionalReviewStatus: text("professional_review_status"), // null, pending, reviewed, approved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_byus_mediations_creator_id").on(table.creatorId),
  index("idx_byus_mediations_status").on(table.status),
  index("idx_byus_mediations_category").on(table.category),
  index("idx_byus_mediations_review_status").on(table.professionalReviewStatus),
]);

export const byusAnalysis = pgTable("byus_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mediationId: varchar("mediation_id").notNull().references(() => byusMediations.id, { onDelete: "cascade" }),
  aiProvider: text("ai_provider").default("openai"),
  fairnessScore: integer("fairness_score"), // 0-100
  party1BiasScore: integer("party1_bias_score"), // 0-100
  party2BiasScore: integer("party2_bias_score"), // 0-100
  suggestedSolution: text("suggested_solution"),
  keyPoints: jsonb("key_points").$type<string[]>().default([]),
  compromiseAreas: jsonb("compromise_areas").$type<Array<{area: string, suggestion: string}>>().default([]),
  legalConsiderations: text("legal_considerations"),
  emotionalFactors: jsonb("emotional_factors").$type<Array<{factor: string, impact: string}>>().default([]),
  nextSteps: jsonb("next_steps").$type<string[]>().default([]),
  confidence: integer("confidence"), // 0-100
  analysisVersion: integer("analysis_version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_analysis_mediation_id").on(table.mediationId),
  index("idx_byus_analysis_fairness_score").on(table.fairnessScore),
]);

export const byusMediationHistory = pgTable("byus_mediation_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mediationId: varchar("mediation_id").notNull().references(() => byusMediations.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => byusUsers.id, { onDelete: "set null" }),
  action: text("action").notNull(), // created, updated, analyzed, resolved, comment_added
  description: text("description"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_history_mediation_id").on(table.mediationId),
  index("idx_byus_history_user_id").on(table.userId),
  index("idx_byus_history_action").on(table.action),
]);

export const byusMediationComments = pgTable("byus_mediation_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mediationId: varchar("mediation_id").notNull().references(() => byusMediations.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => byusUsers.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  isPrivate: boolean("is_private").default(false), // Only visible to mediators
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_comments_mediation_id").on(table.mediationId),
  index("idx_byus_comments_user_id").on(table.userId),
]);

// BYUS Mental Health Data Tables

// Health Profiles - anonymized patient profiles
export const byusHealthProfiles = pgTable("byus_health_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pseudonymousId: varchar("pseudonymous_id").notNull().unique(), // For privacy
  demographicHash: text("demographic_hash").notNull(), // Encrypted demographic data
  ageGroup: text("age_group").notNull(), // 18-25, 26-35, 36-45, 46-55, 56-65, 65+
  region: text("region"), // General geographic area
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_byus_health_profiles_pseudonymous_id").on(table.pseudonymousId),
  index("idx_byus_health_profiles_age_group").on(table.ageGroup),
  index("idx_byus_health_profiles_region").on(table.region),
  index("idx_byus_health_profiles_created_at").on(table.createdAt),
]);

// Diagnoses - anonymized diagnosis records
export const byusDiagnoses = pgTable("byus_diagnoses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  healthProfileId: varchar("health_profile_id").notNull().references(() => byusHealthProfiles.id, { onDelete: "cascade" }),
  diagnosisCode: text("diagnosis_code").notNull(), // Anonymized condition category
  severity: text("severity").notNull(), // mild, moderate, severe
  reportedDate: timestamp("reported_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_diagnoses_health_profile_id").on(table.healthProfileId),
  index("idx_byus_diagnoses_diagnosis_code").on(table.diagnosisCode),
  index("idx_byus_diagnoses_severity").on(table.severity),
  index("idx_byus_diagnoses_is_active").on(table.isActive),
  index("idx_byus_diagnoses_reported_date").on(table.reportedDate),
]);

// Prescriptions - anonymized medication records
export const byusPrescriptions = pgTable("byus_prescriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  healthProfileId: varchar("health_profile_id").notNull().references(() => byusHealthProfiles.id, { onDelete: "cascade" }),
  medicationCategory: text("medication_category").notNull(), // General category, not specific drugs
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  effectiveness: integer("effectiveness"), // 0-100
  sideEffectsSeverity: integer("side_effects_severity"), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_prescriptions_health_profile_id").on(table.healthProfileId),
  index("idx_byus_prescriptions_medication_category").on(table.medicationCategory),
  index("idx_byus_prescriptions_start_date").on(table.startDate),
  index("idx_byus_prescriptions_end_date").on(table.endDate),
  check("effectiveness_range", sql`effectiveness >= 0 AND effectiveness <= 100`),
  check("side_effects_severity_range", sql`side_effects_severity >= 0 AND side_effects_severity <= 100`),
]);

// Crisis Events - tracking mental health crisis events
export const byusCrisisEvents = pgTable("byus_crisis_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  healthProfileId: varchar("health_profile_id").notNull().references(() => byusHealthProfiles.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // anxiety, panic, depression, suicidal_ideation, other
  severity: integer("severity").notNull(), // 1-10
  triggerCategory: text("trigger_category"),
  interventionUsed: text("intervention_used"), // breathing, grounding, hotline, emergency
  outcome: text("outcome").notNull(), // resolved, escalated, ongoing
  safeWordUsed: boolean("safe_word_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_crisis_events_health_profile_id").on(table.healthProfileId),
  index("idx_byus_crisis_events_event_type").on(table.eventType),
  index("idx_byus_crisis_events_severity").on(table.severity),
  index("idx_byus_crisis_events_outcome").on(table.outcome),
  index("idx_byus_crisis_events_created_at").on(table.createdAt),
  check("severity_range", sql`severity >= 1 AND severity <= 10`),
]);

// Crisis Companion - pre-configured crisis support messages
export const byusCrisisCompanion = pgTable("byus_crisis_companion", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  category: text("category").notNull(), // calming, grounding, breathing, affirmation, emergency
  audioUrl: text("audio_url"), // Optional audio version
  priority: integer("priority").notNull().default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_crisis_companion_category").on(table.category),
  index("idx_byus_crisis_companion_priority").on(table.priority),
  index("idx_byus_crisis_companion_is_active").on(table.isActive),
]);

// BYUS Therapist Review System - Updated
export const byusTherapists = pgTable("byus_therapists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => byusUsers.id, { onDelete: "cascade" }),
  licenseNumber: text("license_number").notNull(),
  specializations: jsonb("specializations").$type<string[]>().notNull().default([]),
  availability: jsonb("availability").$type<{
    monday?: { start: string; end: string }[];
    tuesday?: { start: string; end: string }[];
    wednesday?: { start: string; end: string }[];
    thursday?: { start: string; end: string }[];
    friday?: { start: string; end: string }[];
    saturday?: { start: string; end: string }[];
    sunday?: { start: string; end: string }[];
  }>().default({}),
  isVerified: boolean("is_verified").default(false),
  canReviewCrisis: boolean("can_review_crisis").default(false),
  responseTime: text("response_time").notNull().default("24hour"), // immediate, 1hour, 24hour
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_therapists_user_id").on(table.userId),
  index("idx_byus_therapists_is_verified").on(table.isVerified),
  index("idx_byus_therapists_can_review_crisis").on(table.canReviewCrisis),
  index("idx_byus_therapists_response_time").on(table.responseTime),
]);

// Professional Reviews - Updated for both mediation and crisis reviews
export const byusProfessionalReviews = pgTable("byus_professional_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mediationId: varchar("mediation_id").references(() => byusMediations.id, { onDelete: "cascade" }), // Optional
  crisisEventId: varchar("crisis_event_id").references(() => byusCrisisEvents.id, { onDelete: "cascade" }), // Optional
  therapistId: varchar("therapist_id").notNull().references(() => byusTherapists.id, { onDelete: "cascade" }),
  reviewType: text("review_type").notNull(), // mediation, crisis, diagnosis
  originalContent: text("original_content").notNull(),
  professionalNotes: text("professional_notes").notNull(),
  recommendations: jsonb("recommendations").$type<{
    immediate?: string[];
    shortTerm?: string[];
    longTerm?: string[];
    referrals?: string[];
  }>().default({}),
  approvalStatus: text("approval_status").notNull().default("pending"), // approved, modified, rejected
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_professional_reviews_mediation_id").on(table.mediationId),
  index("idx_byus_professional_reviews_crisis_event_id").on(table.crisisEventId),
  index("idx_byus_professional_reviews_therapist_id").on(table.therapistId),
  index("idx_byus_professional_reviews_review_type").on(table.reviewType),
  index("idx_byus_professional_reviews_approval_status").on(table.approvalStatus),
  check("review_target_check", sql`
    (mediation_id IS NOT NULL AND crisis_event_id IS NULL) OR
    (mediation_id IS NULL AND crisis_event_id IS NOT NULL) OR
    (review_type = 'diagnosis')
  `),
]);

// Memorial Product & Service Advertisements
export const advertisements = pgTable("advertisements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  productName: text("product_name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  websiteUrl: text("website_url"),
  pricing: text("pricing"),
  commissionPercentage: integer("commission_percentage"), // Percentage Opictuary receives from sales made through platform
  referralCode: text("referral_code").unique(), // Unique code for tracking sales through Opictuary
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  isActive: boolean("is_active").default(true),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  totalSales: integer("total_sales").default(0),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0"),
  totalPlatformFees: decimal("total_platform_fees", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
}, (table) => [
  index("idx_advertisements_category").on(table.category),
  index("idx_advertisements_status").on(table.status),
  index("idx_advertisements_is_active").on(table.isActive),
  index("idx_advertisements_created_at").on(table.createdAt),
]);

// Advertisement Sales Tracking
export const advertisementSales = pgTable("advertisement_sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  advertisementId: varchar("advertisement_id").notNull().references(() => advertisements.id, { onDelete: "cascade" }),
  referralCode: text("referral_code").notNull(),
  saleAmount: decimal("sale_amount", { precision: 10, scale: 2 }).notNull(),
  platformFeePercentage: integer("platform_fee_percentage").notNull(),
  platformFeeAmount: decimal("platform_fee_amount", { precision: 10, scale: 2 }).notNull(),
  customerEmail: text("customer_email"),
  orderReference: text("order_reference"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_advertisement_sales_ad_id").on(table.advertisementId),
  index("idx_advertisement_sales_created_at").on(table.createdAt),
]);

// Funeral Home Partnership System
export const funeralHomePartners = pgTable("funeral_home_partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("3.00"),
  referralCode: text("referral_code").notNull().unique(),
  bankAccountName: text("bank_account_name"),
  bankAccountNumber: text("bank_account_number"),
  bankRoutingNumber: text("bank_routing_number"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_funeral_partners_is_active").on(table.isActive),
  index("idx_funeral_partners_state").on(table.state),
]);

export const partnerReferrals = pgTable("partner_referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => funeralHomePartners.id, { onDelete: "cascade" }),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  referralCode: text("referral_code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_partner_referrals_partner_id").on(table.partnerId),
  index("idx_partner_referrals_memorial_id").on(table.memorialId),
]);

export const partnerCommissions = pgTable("partner_commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => funeralHomePartners.id, { onDelete: "cascade" }),
  referralId: varchar("referral_id").notNull().references(() => partnerReferrals.id, { onDelete: "cascade" }),
  transactionType: text("transaction_type").notNull(),
  transactionId: varchar("transaction_id").notNull(),
  transactionAmount: decimal("transaction_amount", { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_partner_commissions_partner_id").on(table.partnerId),
  index("idx_partner_commissions_status").on(table.status),
]);

export const partnerPayouts = pgTable("partner_payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => funeralHomePartners.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  status: text("status").notNull().default("pending"),
  paidAt: timestamp("paid_at"),
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_partner_payouts_partner_id").on(table.partnerId),
  index("idx_partner_payouts_status").on(table.status),
]);

// Flower Shop Partnership System
export const flowerShopPartners = pgTable("flower_shop_partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  websiteUrl: text("website_url"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("20.00"),
  specialties: text("specialties").array().default(sql`ARRAY[]::text[]`),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  bankAccountName: text("bank_account_name"),
  bankAccountNumber: text("bank_account_number"),
  bankRoutingNumber: text("bank_routing_number"),
  isActive: boolean("is_active").default(true),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_flower_shops_city").on(table.city),
  index("idx_flower_shops_state").on(table.state),
  index("idx_flower_shops_is_active").on(table.isActive),
]);

export const flowerOrders = pgTable("flower_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull().references(() => flowerShopPartners.id, { onDelete: "cascade" }),
  memorialId: varchar("memorial_id").references(() => memorials.id, { onDelete: "set null" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  recipientName: text("recipient_name").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryDate: text("delivery_date"),
  deliveryTime: text("delivery_time"),
  arrangementType: text("arrangement_type"),
  specialInstructions: text("special_instructions"),
  orderAmount: decimal("order_amount", { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  orderMethod: text("order_method").notNull().default("referral"),
  externalOrderId: text("external_order_id"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_flower_orders_shop_id").on(table.shopId),
  index("idx_flower_orders_memorial_id").on(table.memorialId),
  index("idx_flower_orders_status").on(table.status),
  index("idx_flower_orders_created_at").on(table.createdAt),
]);

export const flowerCommissions = pgTable("flower_commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull().references(() => flowerShopPartners.id, { onDelete: "cascade" }),
  orderId: varchar("order_id").notNull().references(() => flowerOrders.id, { onDelete: "cascade" }),
  orderAmount: decimal("order_amount", { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_flower_commissions_shop_id").on(table.shopId),
  index("idx_flower_commissions_status").on(table.status),
]);

export const flowerPayouts = pgTable("flower_payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull().references(() => flowerShopPartners.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  status: text("status").notNull().default("pending"),
  paidAt: timestamp("paid_at"),
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_flower_payouts_shop_id").on(table.shopId),
  index("idx_flower_payouts_status").on(table.status),
]);

// Funeral Program tables
export const funeralPrograms = pgTable("funeral_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }).unique(),
  // Service information
  serviceDate: text("service_date"),
  serviceTime: text("service_time"),
  serviceName: text("service_name").default("Celebration of Life"),
  serviceLocation: text("service_location"),
  serviceAddress: text("service_address"),
  // Program details
  welcomeMessage: text("welcome_message"),
  closingMessage: text("closing_message"),
  // Family information
  survivedBy: text("survived_by"),
  predeceased: text("predeceased"),
  pallbearers: text("pallbearers"),
  honoraryPallbearers: text("honorary_pallbearers"),
  // Additional sections
  acknowledgments: text("acknowledgments"),
  specialThanks: text("special_thanks"),
  repastLocation: text("repast_location"),
  repastAddress: text("repast_address"),
  // Customization
  coverImageUrl: text("cover_image_url"),
  themeColor: text("theme_color"),
  // Audio and Bluetooth features
  backgroundAudioUrl: text("background_audio_url"),
  enableBluetoothAudio: boolean("enable_bluetooth_audio").default(false),
  bluetoothDeviceName: text("bluetooth_device_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_funeral_programs_memorial_id").on(table.memorialId),
]);

export const programItems = pgTable("program_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programId: varchar("program_id").notNull().references(() => funeralPrograms.id, { onDelete: "cascade" }),
  // Item details
  orderIndex: integer("order_index").notNull(),
  itemType: text("item_type").notNull(), // 'hymn', 'reading', 'prayer', 'eulogy', 'music', 'poem', 'tribute', 'other'
  title: text("title").notNull(),
  description: text("description"),
  performedBy: text("performed_by"),
  // Content
  lyrics: text("lyrics"),
  content: text("content"),
  duration: text("duration"),
  // Audio support
  audioUrl: text("audio_url"),
  audioType: text("audio_type"), // 'recording', 'music', 'speech'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_program_items_program_id").on(table.programId),
  index("idx_program_items_order").on(table.orderIndex),
]);

// Analytics tracking tables
export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  path: text("path").notNull(),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_page_views_path").on(table.path),
  index("idx_page_views_user_id").on(table.userId),
  index("idx_page_views_created_at").on(table.createdAt),
]);

export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventName: text("event_name").notNull(),
  eventCategory: text("event_category"),
  eventLabel: text("event_label"),
  eventValue: integer("event_value"),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_analytics_events_name").on(table.eventName),
  index("idx_analytics_events_category").on(table.eventCategory),
  index("idx_analytics_events_user_id").on(table.userId),
  index("idx_analytics_events_created_at").on(table.createdAt),
]);

// Relations
export const memorialsRelations = relations(memorials, ({ many, one }) => ({
  memories: many(memories),
  condolences: many(condolences),
  scheduledMessages: many(scheduledMessages),
  fundraisers: many(fundraisers),
  griefSupport: one(griefSupport),
  legacyEvents: many(legacyEvents),
  musicPlaylist: one(musicPlaylists),
  admins: many(memorialAdmins),
  qrCodes: many(qrCodes),
  funeralProgram: one(funeralPrograms),
  liveStreams: many(memorialLiveStreams),
  documentaries: many(memorialDocumentaries),
}));

export const memorialAdminsRelations = relations(memorialAdmins, ({ one }) => ({
  memorial: one(memorials, {
    fields: [memorialAdmins.memorialId],
    references: [memorials.id],
  }),
}));

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
  memorial: one(memorials, {
    fields: [qrCodes.memorialId],
    references: [memorials.id],
  }),
}));

export const memoriesRelations = relations(memories, ({ one }) => ({
  memorial: one(memorials, {
    fields: [memories.memorialId],
    references: [memorials.id],
  }),
}));

export const condolencesRelations = relations(condolences, ({ one }) => ({
  memorial: one(memorials, {
    fields: [condolences.memorialId],
    references: [memorials.id],
  }),
}));

export const scheduledMessagesRelations = relations(scheduledMessages, ({ one }) => ({
  memorial: one(memorials, {
    fields: [scheduledMessages.memorialId],
    references: [memorials.id],
  }),
}));

export const fundraisersRelations = relations(fundraisers, ({ one, many }) => ({
  memorial: one(memorials, {
    fields: [fundraisers.memorialId],
    references: [memorials.id],
  }),
  donations: many(donations),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  fundraiser: one(fundraisers, {
    fields: [donations.fundraiserId],
    references: [fundraisers.id],
  }),
}));

export const celebrityMemorialsRelations = relations(celebrityMemorials, ({ many }) => ({
  donations: many(celebrityDonations),
  fanContent: many(celebrityFanContent),
}));

export const celebrityDonationsRelations = relations(celebrityDonations, ({ one }) => ({
  celebrityMemorial: one(celebrityMemorials, {
    fields: [celebrityDonations.celebrityMemorialId],
    references: [celebrityMemorials.id],
  }),
}));

export const celebrityFanContentRelations = relations(celebrityFanContent, ({ one }) => ({
  celebrityMemorial: one(celebrityMemorials, {
    fields: [celebrityFanContent.celebrityMemorialId],
    references: [celebrityMemorials.id],
  }),
}));

export const pushTokens = pgTable("push_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  platform: text("platform").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const funeralProgramsRelations = relations(funeralPrograms, ({ one, many }) => ({
  memorial: one(memorials, {
    fields: [funeralPrograms.memorialId],
    references: [memorials.id],
  }),
  items: many(programItems),
}));

export const programItemsRelations = relations(programItems, ({ one }) => ({
  program: one(funeralPrograms, {
    fields: [programItems.programId],
    references: [funeralPrograms.id],
  }),
}));

export const pushTokensRelations = relations(pushTokens, ({ one }) => ({
  memorial: one(memorials, {
    fields: [pushTokens.memorialId],
    references: [memorials.id],
  }),
}));

// Memorial Events - balloon releases, picnics, after-services, etc.
export const memorialEvents = pgTable("memorial_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // 'balloon_release', 'memorial_picnic', 'memorial_barbecue', 'after_service', 'celebration_of_life', 'anniversary_gathering', 'custom'
  title: text("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  eventTime: text("event_time"), // HH:MM format
  location: text("location"),
  address: text("address"),
  coordinates: json("coordinates").$type<{ lat: number; lng: number }>(),
  organizer: text("organizer"), // Name of person organizing
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  isPublic: boolean("is_public").default(true),
  sendReminders: boolean("send_reminders").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_memorial_events_memorial_id").on(table.memorialId),
  index("idx_memorial_events_event_date").on(table.eventDate),
  index("idx_memorial_events_event_type").on(table.eventType),
]);

// Memorial Event RSVPs - track who is attending
export const memorialEventRsvps = pgTable("memorial_event_rsvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => memorialEvents.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  attendeeCount: integer("attendee_count").default(1),
  response: text("response").notNull(), // 'attending', 'not_attending', 'maybe'
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_memorial_event_rsvps_event_id").on(table.eventId),
]);

export const memorialEventsRelations = relations(memorialEvents, ({ one, many }) => ({
  memorial: one(memorials, {
    fields: [memorialEvents.memorialId],
    references: [memorials.id],
  }),
  rsvps: many(memorialEventRsvps),
}));

export const memorialEventRsvpsRelations = relations(memorialEventRsvps, ({ one }) => ({
  event: one(memorialEvents, {
    fields: [memorialEventRsvps.eventId],
    references: [memorialEvents.id],
  }),
}));

// Memorial Documentaries - full-length video content for memorial tributes
export const memorialDocumentaries = pgTable("memorial_documentaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(), // Video file URL or embed URL
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // Duration in seconds
  chapters: json("chapters").$type<Array<{ title: string; time: number }>>(), // Video chapters
  captions: text("captions"), // URL to captions/subtitles file
  isPublic: boolean("is_public").default(true),
  viewCount: integer("view_count").default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_documentaries_memorial_id").on(table.memorialId),
  index("idx_documentaries_created_by").on(table.createdBy),
]);

export const memorialDocumentariesRelations = relations(memorialDocumentaries, ({ one }) => ({
  memorial: one(memorials, {
    fields: [memorialDocumentaries.memorialId],
    references: [memorials.id],
  }),
  creator: one(users, {
    fields: [memorialDocumentaries.createdBy],
    references: [users.id],
  }),
}));

// Support System Tables
export const supportArticles = pgTable("support_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // "help_center", "grief_support", "technical", "partner"
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  isPublished: boolean("is_published").default(true),
  viewCount: integer("view_count").default(0),
  helpfulCount: integer("helpful_count").default(0),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supportRequests = pgTable("support_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  category: text("category").notNull(), // "technical", "grief", "partner", "general"
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open"), // "open", "in_progress", "resolved", "closed"
  priority: text("priority").default("normal"), // "low", "normal", "high", "urgent"
  assignedTo: varchar("assigned_to").references(() => users.id, { onDelete: "set null" }),
  email: text("email").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  memorialId: varchar("memorial_id").references(() => memorials.id, { onDelete: "set null" }),
  isPartnerRequest: boolean("is_partner_request").default(false),
  partnerType: text("partner_type"), // "funeral_home", "flower_shop", "correctional_facility", null for non-partner
  partnerAccountId: text("partner_account_id"), // Links to partner's account for tracking
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const griefResources = pgTable("grief_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  resourceType: text("resource_type").notNull(), // "hotline", "article", "video", "counselor", "support_group"
  category: text("category").notNull(), // "crisis", "bereavement", "child_loss", "suicide", "military", "general"
  url: text("url"),
  phoneNumber: text("phone_number"),
  availability: text("availability"), // "24/7", "Business Hours", etc.
  isVerified: boolean("is_verified").default(true),
  isEmergency: boolean("is_emergency").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportRequestsRelations = relations(supportRequests, ({ one }) => ({
  user: one(users, {
    fields: [supportRequests.userId],
    references: [users.id],
  }),
  memorial: one(memorials, {
    fields: [supportRequests.memorialId],
    references: [memorials.id],
  }),
  assignedToUser: one(users, {
    fields: [supportRequests.assignedTo],
    references: [users.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemorialSchema = createInsertSchema(memorials).omit({
  id: true,
  createdAt: true,
});

export const insertMemorySchema = createInsertSchema(memories).omit({
  id: true,
  createdAt: true,
});

export const insertMemoryCommentSchema = createInsertSchema(memoryComments).omit({
  id: true,
  createdAt: true,
});

export const insertMemoryCondolenceSchema = createInsertSchema(memoryCondolences).omit({
  id: true,
  createdAt: true,
});

export const insertMemoryReactionSchema = createInsertSchema(memoryReactions).omit({
  id: true,
  createdAt: true,
});

export const insertCondolenceSchema = createInsertSchema(condolences).omit({
  id: true,
  createdAt: true,
});

export const insertMemorialLikeSchema = createInsertSchema(memorialLikes).omit({
  id: true,
  createdAt: true,
});

export const insertMemorialCommentSchema = createInsertSchema(memorialComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemorialCondolenceReactionSchema = createInsertSchema(memorialCondolenceReactions).omit({
  id: true,
  createdAt: true,
}).refine(
  (data) => {
    // Require exactly ONE of userId or sessionId (not both, not neither)
    const hasUserId = !!data.userId;
    const hasSessionId = !!data.sessionId;
    return (hasUserId && !hasSessionId) || (!hasUserId && hasSessionId);
  },
  {
    message: "Exactly one of userId or sessionId must be provided (not both, not neither)"
  }
);

export const deleteMemorialCondolenceReactionSchema = z.object({
  memorialId: z.string(),
  reactionType: z.enum(['heart', 'prayer', 'candle', 'flower', 'dove']),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
}).refine(
  (data) => {
    // Require exactly ONE of userId or sessionId
    const hasUserId = !!data.userId;
    const hasSessionId = !!data.sessionId;
    return (hasUserId && !hasSessionId) || (!hasUserId && hasSessionId);
  },
  {
    message: "Exactly one of userId or sessionId must be provided for deletion (not both, not neither)"
  }
);

export const insertSavedMemorialSchema = createInsertSchema(savedMemorials).omit({
  id: true,
  createdAt: true,
});

export const insertMemorialLiveStreamSchema = createInsertSchema(memorialLiveStreams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemorialLiveStreamViewerSchema = createInsertSchema(memorialLiveStreamViewers).omit({
  id: true,
  joinedAt: true,
});

export const insertScheduledMessageSchema = createInsertSchema(scheduledMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isSent: true,
  sentAt: true,
}).extend({
  customEventName: z.string().optional(),
  sendTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (use HH:MM)").optional(),
  attachmentUrls: z.array(z.string().url()).optional(),
  isRecurring: z.boolean().optional(),
  recurrenceInterval: z.enum(['yearly', 'monthly', 'custom']).optional(),
  status: z.enum(['draft', 'pending', 'sent', 'failed']).optional(),
});

export const insertVideoTimeCapsuleSchema = createInsertSchema(videoTimeCapsules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isReleased: true,
  releasedAt: true,
  viewCount: true,
  uniqueViewers: true,
  lastViewedAt: true,
  releasedCount: true,
}).extend({
  customMilestoneName: z.string().optional(),
  releaseTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (use HH:MM)").optional(),
  isRecurring: z.boolean().optional(),
  recurrenceInterval: z.enum(['yearly']).optional(),
  status: z.enum(['scheduled', 'released', 'viewed', 'expired']).optional(),
});

export const insertVideoTimeCapsuleViewSchema = createInsertSchema(videoTimeCapsuleViews).omit({
  id: true,
  viewedAt: true,
});

export const insertFundraiserSchema = createInsertSchema(fundraisers).omit({
  id: true,
  createdAt: true,
  currentAmount: true,
}).refine(
  (data) => {
    const fee = Number(data.platformFeePercentage || 3);
    return fee >= 2.5 && fee <= 5;
  },
  {
    message: "Platform fee must be between 2.5% and 5%",
    path: ["platformFeePercentage"],
  }
);

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertCelebrityMemorialSchema = createInsertSchema(celebrityMemorials).omit({
  id: true,
  createdAt: true,
  fanCount: true,
  verificationStatus: true,
  verifiedBy: true,
  verificationDate: true,
});

export const insertCelebrityDonationSchema = createInsertSchema(celebrityDonations).omit({
  id: true,
  createdAt: true,
});

export const insertCelebrityFanContentSchema = createInsertSchema(celebrityFanContent).omit({
  id: true,
  createdAt: true,
  viewCount: true,
  isPublished: true,
});

export const insertGriefSupportSchema = createInsertSchema(griefSupport).omit({
  id: true,
});

export const insertLegacyEventSchema = createInsertSchema(legacyEvents).omit({
  id: true,
  createdAt: true,
  attendeeCount: true,
});

export const insertMusicPlaylistSchema = createInsertSchema(musicPlaylists).omit({
  id: true,
});

export const insertEssentialWorkerMemorialSchema = createInsertSchema(essentialWorkersMemorials).omit({
  id: true,
  createdAt: true,
});

export const insertHoodMemorialSchema = createInsertSchema(hoodMemorials).omit({
  id: true,
  createdAt: true,
});

export const insertNeighborhoodSchema = createInsertSchema(neighborhoods).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlumniMemorialSchema = createInsertSchema(alumniMemorials).omit({
  id: true,
  createdAt: true,
});

export const insertSelfWrittenObituarySchema = createInsertSchema(selfWrittenObituaries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  activatedAt: true,
});

export const insertPrisonFacilitySchema = createInsertSchema(prisonFacilities).omit({
  id: true,
  createdAt: true,
});

export const insertPrisonAccessRequestSchema = createInsertSchema(prisonAccessRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertPrisonVerificationSchema = createInsertSchema(prisonVerifications).omit({
  id: true,
  createdAt: true,
});

export const insertPrisonPaymentSchema = createInsertSchema(prisonPayments).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertPrisonAccessSessionSchema = createInsertSchema(prisonAccessSessions).omit({
  id: true,
  createdAt: true,
  isActive: true,
});

export const insertPrisonAuditLogSchema = createInsertSchema(prisonAuditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertAdvertisementSchema = createInsertSchema(advertisements).omit({
  id: true,
  createdAt: true,
  impressions: true,
  clicks: true,
  totalSales: true,
  totalRevenue: true,
  totalPlatformFees: true,
});

export const insertAdvertisementSaleSchema = createInsertSchema(advertisementSales).omit({
  id: true,
  createdAt: true,
});

export const insertFuneralHomePartnerSchema = createInsertSchema(funeralHomePartners).omit({
  id: true,
  createdAt: true,
  referralCode: true,
});

export const insertPartnerReferralSchema = createInsertSchema(partnerReferrals).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerCommissionSchema = createInsertSchema(partnerCommissions).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerPayoutSchema = createInsertSchema(partnerPayouts).omit({
  id: true,
  createdAt: true,
});

export const insertFlowerShopPartnerSchema = createInsertSchema(flowerShopPartners).omit({
  id: true,
  createdAt: true,
});

export const insertFlowerOrderSchema = createInsertSchema(flowerOrders).omit({
  id: true,
  createdAt: true,
});

export const insertFlowerCommissionSchema = createInsertSchema(flowerCommissions).omit({
  id: true,
  createdAt: true,
});

export const insertFlowerPayoutSchema = createInsertSchema(flowerPayouts).omit({
  id: true,
  createdAt: true,
});

export const insertPushTokenSchema = createInsertSchema(pushTokens).omit({
  id: true,
  createdAt: true,
});

export const insertMemorialAdminSchema = createInsertSchema(memorialAdmins).omit({
  id: true,
  createdAt: true,
});

export const insertQRCodeSchema = createInsertSchema(qrCodes).omit({
  id: true,
  createdAt: true,
  totalScans: true,
  lastScannedAt: true,
});

export const insertQRScanSchema = createInsertSchema(qrScans).omit({
  id: true,
  scannedAt: true,
});

export const qrScanRequestSchema = z.object({
  geolocationConsent: z.coerce.boolean().default(false),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  city: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional().nullable(),
  browser: z.string().optional().nullable(),
  operatingSystem: z.string().optional().nullable(),
  action: z.string().default('view_memorial'),
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export const insertSupportArticleSchema = createInsertSchema(supportArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  helpfulCount: true,
});

export const insertSupportRequestSchema = createInsertSchema(supportRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  priority: true,
});

export const insertGriefResourceSchema = createInsertSchema(griefResources).omit({
  id: true,
  createdAt: true,
});

export const insertMemorialEventSchema = createInsertSchema(memorialEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemorialEventRsvpSchema = createInsertSchema(memorialEventRsvps).omit({
  id: true,
  createdAt: true,
});

export const insertMemorialDocumentarySchema = createInsertSchema(memorialDocumentaries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReligiousSymbolSchema = createInsertSchema(religiousSymbols).omit({
  id: true,
  createdAt: true,
});

export const insertMemorialSymbolSchema = createInsertSchema(memorialSymbols).omit({
  id: true,
  createdAt: true,
});

export const insertMemorialPlaylistSchema = createInsertSchema(memorialPlaylists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemorialSlideshowSchema = createInsertSchema(memorialSlideshows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export const insertVideoCondolenceSchema = createInsertSchema(videoCondolences).omit({
  id: true,
  createdAt: true,
  views: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

export type InsertMemorial = z.infer<typeof insertMemorialSchema>;
export type Memorial = typeof memorials.$inferSelect;

export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Memory = typeof memories.$inferSelect;

export type InsertMemoryComment = z.infer<typeof insertMemoryCommentSchema>;
export type MemoryComment = typeof memoryComments.$inferSelect;

export type InsertMemoryCondolence = z.infer<typeof insertMemoryCondolenceSchema>;
export type MemoryCondolence = typeof memoryCondolences.$inferSelect;

export type InsertMemoryReaction = z.infer<typeof insertMemoryReactionSchema>;
export type MemoryReaction = typeof memoryReactions.$inferSelect;

export type InsertCondolence = z.infer<typeof insertCondolenceSchema>;
export type Condolence = typeof condolences.$inferSelect;

export type InsertMemorialLike = z.infer<typeof insertMemorialLikeSchema>;
export type MemorialLike = typeof memorialLikes.$inferSelect;

export type InsertMemorialComment = z.infer<typeof insertMemorialCommentSchema>;
export type MemorialComment = typeof memorialComments.$inferSelect;

export type InsertMemorialCondolenceReaction = z.infer<typeof insertMemorialCondolenceReactionSchema>;
export type DeleteMemorialCondolenceReaction = z.infer<typeof deleteMemorialCondolenceReactionSchema>;
export type MemorialCondolenceReaction = typeof memorialCondolenceReactions.$inferSelect;

export type InsertSavedMemorial = z.infer<typeof insertSavedMemorialSchema>;
export type SavedMemorial = typeof savedMemorials.$inferSelect;

export type InsertMemorialLiveStream = z.infer<typeof insertMemorialLiveStreamSchema>;
export type MemorialLiveStream = typeof memorialLiveStreams.$inferSelect;

export type InsertMemorialLiveStreamViewer = z.infer<typeof insertMemorialLiveStreamViewerSchema>;
export type MemorialLiveStreamViewer = typeof memorialLiveStreamViewers.$inferSelect;

export type InsertScheduledMessage = z.infer<typeof insertScheduledMessageSchema>;
export type ScheduledMessage = typeof scheduledMessages.$inferSelect;

export type InsertVideoTimeCapsule = z.infer<typeof insertVideoTimeCapsuleSchema>;
export type VideoTimeCapsule = typeof videoTimeCapsules.$inferSelect;

export type InsertVideoTimeCapsuleView = z.infer<typeof insertVideoTimeCapsuleViewSchema>;
export type VideoTimeCapsuleView = typeof videoTimeCapsuleViews.$inferSelect;

export type InsertFundraiser = z.infer<typeof insertFundraiserSchema>;
export type Fundraiser = typeof fundraisers.$inferSelect;

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export type InsertCelebrityMemorial = z.infer<typeof insertCelebrityMemorialSchema>;
export type CelebrityMemorial = typeof celebrityMemorials.$inferSelect;

export type InsertCelebrityDonation = z.infer<typeof insertCelebrityDonationSchema>;
export type CelebrityDonation = typeof celebrityDonations.$inferSelect;

export type InsertCelebrityFanContent = z.infer<typeof insertCelebrityFanContentSchema>;
export type CelebrityFanContent = typeof celebrityFanContent.$inferSelect;

export type InsertGriefSupport = z.infer<typeof insertGriefSupportSchema>;
export type GriefSupport = typeof griefSupport.$inferSelect;

export type InsertLegacyEvent = z.infer<typeof insertLegacyEventSchema>;
export type LegacyEvent = typeof legacyEvents.$inferSelect;

export type InsertMusicPlaylist = z.infer<typeof insertMusicPlaylistSchema>;
export type MusicPlaylist = typeof musicPlaylists.$inferSelect;

export type InsertEssentialWorkerMemorial = z.infer<typeof insertEssentialWorkerMemorialSchema>;
export type EssentialWorkerMemorial = typeof essentialWorkersMemorials.$inferSelect;

export type InsertHoodMemorial = z.infer<typeof insertHoodMemorialSchema>;
export type HoodMemorial = typeof hoodMemorials.$inferSelect;

export type InsertNeighborhood = z.infer<typeof insertNeighborhoodSchema>;
export type Neighborhood = typeof neighborhoods.$inferSelect;

export type InsertAlumniMemorial = z.infer<typeof insertAlumniMemorialSchema>;
export type AlumniMemorial = typeof alumniMemorials.$inferSelect;

export type InsertSelfWrittenObituary = z.infer<typeof insertSelfWrittenObituarySchema>;
export type SelfWrittenObituary = typeof selfWrittenObituaries.$inferSelect;

export type InsertPrisonFacility = z.infer<typeof insertPrisonFacilitySchema>;
export type PrisonFacility = typeof prisonFacilities.$inferSelect;

export type InsertPrisonAccessRequest = z.infer<typeof insertPrisonAccessRequestSchema>;
export type PrisonAccessRequest = typeof prisonAccessRequests.$inferSelect;

export type InsertPrisonVerification = z.infer<typeof insertPrisonVerificationSchema>;
export type PrisonVerification = typeof prisonVerifications.$inferSelect;

export type InsertPrisonPayment = z.infer<typeof insertPrisonPaymentSchema>;
export type PrisonPayment = typeof prisonPayments.$inferSelect;

export type InsertPrisonAccessSession = z.infer<typeof insertPrisonAccessSessionSchema>;
export type PrisonAccessSession = typeof prisonAccessSessions.$inferSelect;

export type InsertPrisonAuditLog = z.infer<typeof insertPrisonAuditLogSchema>;
export type PrisonAuditLog = typeof prisonAuditLogs.$inferSelect;

export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
export type Advertisement = typeof advertisements.$inferSelect;

export type InsertAdvertisementSale = z.infer<typeof insertAdvertisementSaleSchema>;
export type AdvertisementSale = typeof advertisementSales.$inferSelect;

export type InsertFuneralHomePartner = z.infer<typeof insertFuneralHomePartnerSchema>;
export type FuneralHomePartner = typeof funeralHomePartners.$inferSelect;

export type InsertPartnerReferral = z.infer<typeof insertPartnerReferralSchema>;
export type PartnerReferral = typeof partnerReferrals.$inferSelect;

export type InsertPartnerCommission = z.infer<typeof insertPartnerCommissionSchema>;
export type PartnerCommission = typeof partnerCommissions.$inferSelect;

export type InsertPartnerPayout = z.infer<typeof insertPartnerPayoutSchema>;
export type PartnerPayout = typeof partnerPayouts.$inferSelect;

export type InsertFlowerShopPartner = z.infer<typeof insertFlowerShopPartnerSchema>;
export type FlowerShopPartner = typeof flowerShopPartners.$inferSelect;

export type InsertFlowerOrder = z.infer<typeof insertFlowerOrderSchema>;
export type FlowerOrder = typeof flowerOrders.$inferSelect;

export type InsertFlowerCommission = z.infer<typeof insertFlowerCommissionSchema>;
export type FlowerCommission = typeof flowerCommissions.$inferSelect;

export type InsertFlowerPayout = z.infer<typeof insertFlowerPayoutSchema>;
export type FlowerPayout = typeof flowerPayouts.$inferSelect;

export type InsertPushToken = z.infer<typeof insertPushTokenSchema>;
export type PushToken = typeof pushTokens.$inferSelect;

export type InsertMemorialAdmin = z.infer<typeof insertMemorialAdminSchema>;
export type MemorialAdmin = typeof memorialAdmins.$inferSelect;

export type InsertQRCode = z.infer<typeof insertQRCodeSchema>;
export type QRCode = typeof qrCodes.$inferSelect;

export type InsertQRScan = z.infer<typeof insertQRScanSchema>;
export type QRScan = typeof qrScans.$inferSelect;

export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

export type InsertSupportArticle = z.infer<typeof insertSupportArticleSchema>;
export type SupportArticle = typeof supportArticles.$inferSelect;

export type InsertSupportRequest = z.infer<typeof insertSupportRequestSchema>;
export type SupportRequest = typeof supportRequests.$inferSelect;

export type InsertGriefResource = z.infer<typeof insertGriefResourceSchema>;
export type GriefResource = typeof griefResources.$inferSelect;

export type InsertMemorialEvent = z.infer<typeof insertMemorialEventSchema>;
export type MemorialEvent = typeof memorialEvents.$inferSelect;

export type InsertMemorialEventRsvp = z.infer<typeof insertMemorialEventRsvpSchema>;
export type MemorialEventRsvp = typeof memorialEventRsvps.$inferSelect;

export type InsertMemorialDocumentary = z.infer<typeof insertMemorialDocumentarySchema>;
export type MemorialDocumentary = typeof memorialDocumentaries.$inferSelect;

export type InsertReligiousSymbol = z.infer<typeof insertReligiousSymbolSchema>;
export type ReligiousSymbol = typeof religiousSymbols.$inferSelect;

export type InsertMemorialSymbol = z.infer<typeof insertMemorialSymbolSchema>;
export type MemorialSymbol = typeof memorialSymbols.$inferSelect;

export type InsertMemorialPlaylist = z.infer<typeof insertMemorialPlaylistSchema>;
export type MemorialPlaylist = typeof memorialPlaylists.$inferSelect;

export type InsertMemorialSlideshow = z.infer<typeof insertMemorialSlideshowSchema>;
export type MemorialSlideshow = typeof memorialSlideshows.$inferSelect;

export type InsertVideoCondolence = z.infer<typeof insertVideoCondolenceSchema>;
export type VideoCondolence = typeof videoCondolences.$inferSelect;

// Funeral Program schemas
export const insertFuneralProgramSchema = createInsertSchema(funeralPrograms).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProgramItemSchema = createInsertSchema(programItems).omit({ id: true, createdAt: true });

export type InsertFuneralProgram = z.infer<typeof insertFuneralProgramSchema>;
export type FuneralProgram = typeof funeralPrograms.$inferSelect;

export type InsertProgramItem = z.infer<typeof insertProgramItemSchema>;
export type ProgramItem = typeof programItems.$inferSelect;

// BYUS Feedback table
export const byusFeedback = pgTable("byus_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mediationId: varchar("mediation_id").notNull().references(() => byusMediations.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => byusUsers.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5
  feedbackText: text("feedback_text"),
  helpful: boolean("helpful"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_byus_feedback_mediation_id").on(table.mediationId),
  index("idx_byus_feedback_user_id").on(table.userId),
  index("idx_byus_feedback_rating").on(table.rating),
  index("idx_byus_feedback_created_at").on(table.createdAt),
  check("rating_range", sql`rating >= 1 AND rating <= 5`),
]);

// Create insert schemas and types for BYUS tables
export const insertByusUserSchema = createInsertSchema(byusUsers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertByusMediationSchema = createInsertSchema(byusMediations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertByusAnalysisSchema = createInsertSchema(byusAnalysis).omit({ id: true, createdAt: true });
export const insertByusMediationHistorySchema = createInsertSchema(byusMediationHistory).omit({ id: true, createdAt: true });
export const insertByusMediationCommentSchema = createInsertSchema(byusMediationComments).omit({ id: true, createdAt: true });
export const insertByusFeedbackSchema = createInsertSchema(byusFeedback).omit({ id: true, createdAt: true });
export const insertByusHealthProfileSchema = createInsertSchema(byusHealthProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertByusDiagnosisSchema = createInsertSchema(byusDiagnoses).omit({ id: true, createdAt: true });
export const insertByusPrescriptionSchema = createInsertSchema(byusPrescriptions).omit({ id: true, createdAt: true });
export const insertByusCrisisEventSchema = createInsertSchema(byusCrisisEvents).omit({ id: true, createdAt: true });
export const insertByusCrisisCompanionSchema = createInsertSchema(byusCrisisCompanion).omit({ id: true, createdAt: true });
export const insertByusTherapistSchema = createInsertSchema(byusTherapists).omit({ id: true, createdAt: true });
export const insertByusProfessionalReviewSchema = createInsertSchema(byusProfessionalReviews).omit({ id: true, createdAt: true, reviewedAt: true });

export type InsertByusUser = z.infer<typeof insertByusUserSchema>;
export type ByusUser = typeof byusUsers.$inferSelect;

export type InsertByusMediation = z.infer<typeof insertByusMediationSchema>;
export type ByusMediation = typeof byusMediations.$inferSelect;

export type InsertByusAnalysis = z.infer<typeof insertByusAnalysisSchema>;
export type ByusAnalysis = typeof byusAnalysis.$inferSelect;

export type InsertByusMediationHistory = z.infer<typeof insertByusMediationHistorySchema>;
export type ByusMediationHistory = typeof byusMediationHistory.$inferSelect;

export type InsertByusMediationComment = z.infer<typeof insertByusMediationCommentSchema>;
export type ByusMediationComment = typeof byusMediationComments.$inferSelect;

export type InsertByusFeedback = z.infer<typeof insertByusFeedbackSchema>;
export type ByusFeedback = typeof byusFeedback.$inferSelect;

export type InsertByusHealthProfile = z.infer<typeof insertByusHealthProfileSchema>;
export type ByusHealthProfile = typeof byusHealthProfiles.$inferSelect;

export type InsertByusDiagnosis = z.infer<typeof insertByusDiagnosisSchema>;
export type ByusDiagnosis = typeof byusDiagnoses.$inferSelect;

export type InsertByusPrescription = z.infer<typeof insertByusPrescriptionSchema>;
export type ByusPrescription = typeof byusPrescriptions.$inferSelect;

export type InsertByusCrisisEvent = z.infer<typeof insertByusCrisisEventSchema>;
export type ByusCrisisEvent = typeof byusCrisisEvents.$inferSelect;

export type InsertByusCrisisCompanion = z.infer<typeof insertByusCrisisCompanionSchema>;
export type ByusCrisisCompanion = typeof byusCrisisCompanion.$inferSelect;

export type InsertByusTherapist = z.infer<typeof insertByusTherapistSchema>;
export type ByusTherapist = typeof byusTherapists.$inferSelect;

export type InsertByusProfessionalReview = z.infer<typeof insertByusProfessionalReviewSchema>;
export type ByusProfessionalReview = typeof byusProfessionalReviews.$inferSelect;

// Physical Memorial Products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'plaques', 'headstone-markers', 'memorial-cards', 'urns', 'keepsakes'
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  images: json("images").$type<string[]>().default([]),
  customizationOptions: json("customization_options").$type<{
    engraving?: { maxCharacters: number; fonts: string[] };
    materials?: string[];
    sizes?: string[];
    qrPlacement?: string[];
  }>(),
  dimensions: text("dimensions"), // e.g., "12x8 inches"
  material: text("material"), // e.g., "Bronze", "Granite", "Stainless Steel"
  isActive: boolean("is_active").default(true),
  stockStatus: text("stock_status").default("in_stock"), // 'in_stock', 'low_stock', 'out_of_stock', 'pre_order'
  estimatedDeliveryDays: integer("estimated_delivery_days").default(14),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_products_category").on(table.category),
  index("idx_products_is_active").on(table.isActive),
]);

// Product Orders
export const productOrders = pgTable("product_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  userId: varchar("user_id").notNull().references(() => users.id),
  memorialId: varchar("memorial_id").references(() => memorials.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").default(1),
  // Customization details
  customization: json("customization").$type<{
    engravingText?: string;
    font?: string;
    material?: string;
    size?: string;
    qrPlacement?: string;
  }>(),
  // Pricing
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  // Shipping address
  shippingAddress: json("shipping_address").$type<{
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  }>().notNull(),
  // Order status
  status: text("status").default("pending"), // 'pending', 'processing', 'in_production', 'shipped', 'delivered', 'cancelled'
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'paid', 'failed', 'refunded'
  paymentIntentId: text("payment_intent_id"),
  // Fulfillment
  trackingNumber: text("tracking_number"),
  carrier: text("carrier"),
  estimatedDelivery: timestamp("estimated_delivery"),
  deliveredAt: timestamp("delivered_at"),
  // QR code reference (generated when order is processed)
  qrCodeId: varchar("qr_code_id").references(() => qrCodes.id),
  // AI Design customization (for memorial cards)
  aiDesignPrompt: text("ai_design_prompt"),
  aiDesignStyle: text("ai_design_style"), // 'realistic', 'watercolor', 'oil_painting', 'digital_art', 'sketch'
  aiDesignImageUrl: text("ai_design_image_url"),
  aiDesignPremium: decimal("ai_design_premium", { precision: 10, scale: 2 }).default("0"),
  // Notes
  customerNotes: text("customer_notes"),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_product_orders_user_id").on(table.userId),
  index("idx_product_orders_memorial_id").on(table.memorialId),
  index("idx_product_orders_status").on(table.status),
  index("idx_product_orders_created_at").on(table.createdAt),
]);

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProductOrderSchema = createInsertSchema(productOrders).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProductOrder = z.infer<typeof insertProductOrderSchema>;
export type ProductOrder = typeof productOrders.$inferSelect;

// AI Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_chat_messages_user_id").on(table.userId),
  index("idx_chat_messages_created_at").on(table.createdAt),
]);

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Memorial Event Planner Tables

// Event Templates for different memorial types
export const eventTemplates = pgTable("event_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 'Funeral', 'Memorial Service', 'Celebration of Life', etc.
  description: text("description"),
  category: text("category").notNull(), // 'traditional', 'celebration', 'religious', 'military'
  defaultDuration: integer("default_duration"), // in minutes
  suggestedTimeline: json("suggested_timeline").$type<{
    daysBeforeEvent: number;
    taskName: string;
    description: string;
  }[]>(),
  defaultBudgetRange: json("default_budget_range").$type<{
    min: number;
    max: number;
    currency: string;
  }>(),
  culturalConsiderations: json("cultural_considerations").$type<{
    religion?: string;
    customs?: string[];
    restrictions?: string[];
  }>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_event_templates_category").on(table.category),
]);

// Predefined checklists for event planning
export const eventChecklists = pgTable("event_checklists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").references(() => eventTemplates.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // 'venue', 'catering', 'flowers', 'transportation', 'documentation'
  itemName: text("item_name").notNull(),
  description: text("description"),
  isRequired: boolean("is_required").default(false),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  sortOrder: integer("sort_order").default(0),
  tips: text("tips"), // Helpful tips for this checklist item
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_event_checklists_template_id").on(table.templateId),
  index("idx_event_checklists_category").on(table.category),
]);

// Actual memorial events being planned
export const memorialEventPlans = pgTable("memorial_event_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").references(() => memorials.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").references(() => eventTemplates.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  eventName: text("event_name").notNull(),
  eventType: text("event_type").notNull(), // 'funeral', 'memorial_service', 'celebration_of_life'
  eventDate: timestamp("event_date").notNull(),
  eventTime: text("event_time"), // Store as string for flexibility
  venue: json("venue").$type<{
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    capacity?: number;
    coordinates?: { lat: number; lng: number };
  }>(),
  expectedAttendees: integer("expected_attendees"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  status: text("status").default("planning"), // 'planning', 'confirmed', 'in_progress', 'completed', 'cancelled'
  // Live streaming details
  isLiveStreaming: boolean("is_live_streaming").default(false),
  streamingUrl: text("streaming_url"),
  streamingPlatform: text("streaming_platform"), // 'youtube', 'zoom', 'facebook', 'custom'
  // Guest management
  rsvpEnabled: boolean("rsvp_enabled").default(true),
  guestListPublic: boolean("guest_list_public").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_memorial_event_plans_memorial_id").on(table.memorialId),
  index("idx_memorial_event_plans_user_id").on(table.userId),
  index("idx_memorial_event_plans_event_date").on(table.eventDate),
  index("idx_memorial_event_plans_status").on(table.status),
]);

// Tasks within each memorial event
export const eventTasks = pgTable("event_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => memorialEventPlans.id, { onDelete: "cascade" }),
  checklistId: varchar("checklist_id").references(() => eventChecklists.id),
  taskName: text("task_name").notNull(),
  description: text("description"),
  category: text("category"), // 'venue', 'catering', 'flowers', etc.
  dueDate: timestamp("due_date"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  status: text("status").default("pending"), // 'pending', 'in_progress', 'completed', 'cancelled'
  priority: text("priority").default("medium"), // 'low', 'medium', 'high', 'urgent'
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  vendorId: varchar("vendor_id").references(() => vendorListings.id),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_event_tasks_event_id").on(table.eventId),
  index("idx_event_tasks_status").on(table.status),
  index("idx_event_tasks_due_date").on(table.dueDate),
]);

// Service provider/vendor listings
export const vendorListings = pgTable("vendor_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: text("business_name").notNull(),
  category: text("category").notNull(), // 'florist', 'caterer', 'funeral_home', 'photographer', 'musician'
  description: text("description"),
  contactName: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  address: json("address").$type<{
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  serviceArea: json("service_area").$type<string[]>(), // List of zip codes or cities served
  pricing: json("pricing").$type<{
    startingPrice?: number;
    priceRange?: { min: number; max: number };
    priceUnit?: string; // 'per_person', 'per_hour', 'per_event'
  }>(),
  rating: decimal("rating", { precision: 2, scale: 1 }), // Average rating out of 5
  reviewCount: integer("review_count").default(0),
  certifications: json("certifications").$type<string[]>(),
  specializations: json("specializations").$type<string[]>(), // e.g., 'Jewish ceremonies', 'Military honors'
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  partnerSince: timestamp("partner_since"),
  commissionRate: decimal("commission_rate", { precision: 4, scale: 2 }), // Platform commission percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_vendor_listings_category").on(table.category),
  index("idx_vendor_listings_is_active").on(table.isActive),
]);

// Vendor bookings for events
export const vendorBookings = pgTable("vendor_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => memorialEventPlans.id, { onDelete: "cascade" }),
  vendorId: varchar("vendor_id").notNull().references(() => vendorListings.id),
  taskId: varchar("task_id").references(() => eventTasks.id),
  serviceType: text("service_type").notNull(),
  bookingDate: timestamp("booking_date").notNull(),
  serviceDetails: json("service_details").$type<{
    description: string;
    duration?: number;
    quantity?: number;
    specialRequests?: string;
  }>(),
  quotedPrice: decimal("quoted_price", { precision: 10, scale: 2 }),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }),
  status: text("status").default("requested"), // 'requested', 'quoted', 'confirmed', 'completed', 'cancelled'
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'deposit_paid', 'paid', 'refunded'
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }),
  contractUrl: text("contract_url"),
  notes: text("notes"),
  confirmedAt: timestamp("confirmed_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_vendor_bookings_event_id").on(table.eventId),
  index("idx_vendor_bookings_vendor_id").on(table.vendorId),
  index("idx_vendor_bookings_status").on(table.status),
]);

// Sports Memorial Tables

// Athlete profiles for sports memorials
export const athleteProfiles = pgTable("athlete_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }).unique(),
  sport: text("sport").notNull(), // 'football', 'basketball', 'baseball', 'soccer', etc.
  level: text("level").notNull(), // 'professional', 'college', 'high_school', 'olympic'
  position: text("position"),
  jerseyNumber: text("jersey_number"),
  teams: json("teams").$type<{
    teamName: string;
    startYear: number;
    endYear?: number;
    league?: string;
    achievements?: string[];
  }[]>(),
  careerHighlights: json("career_highlights").$type<string[]>(),
  awards: json("awards").$type<{
    name: string;
    year: number;
    description?: string;
  }[]>(),
  hallOfFameInductions: json("hall_of_fame_inductions").$type<{
    organization: string;
    year: number;
    location?: string;
  }[]>(),
  nicknames: json("nicknames").$type<string[]>(),
  rivalries: json("rivalries").$type<string[]>(),
  coachingCareer: json("coaching_career").$type<{
    team: string;
    role: string;
    startYear: number;
    endYear?: number;
    achievements?: string[];
  }[]>(),
  mediaLinks: json("media_links").$type<{
    type: string; // 'highlight_reel', 'interview', 'documentary'
    url: string;
    title: string;
  }[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_athlete_profiles_sport").on(table.sport),
  index("idx_athlete_profiles_level").on(table.level),
]);

// Career statistics for athletes
export const athleteStats = pgTable("athlete_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  athleteProfileId: varchar("athlete_profile_id").notNull().references(() => athleteProfiles.id, { onDelete: "cascade" }),
  season: text("season"), // '2023-24', '2023', etc.
  team: text("team"),
  league: text("league"),
  category: text("category").notNull(), // 'career', 'season', 'playoffs', 'single_game'
  statType: text("stat_type").notNull(), // 'offensive', 'defensive', 'pitching', 'batting', etc.
  stats: json("stats").$type<Record<string, any>>().notNull(), // Flexible JSON for sport-specific stats
  gamesPlayed: integer("games_played"),
  isCareerTotal: boolean("is_career_total").default(false),
  source: text("source"), // 'ESPN', 'Official League Stats', etc.
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_athlete_stats_athlete_profile_id").on(table.athleteProfileId),
  index("idx_athlete_stats_category").on(table.category),
  index("idx_athlete_stats_season").on(table.season),
]);

// Team memorial walls
export const teamMemorials = pgTable("team_memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamName: text("team_name").notNull(),
  sport: text("sport").notNull(),
  level: text("level").notNull(), // 'professional', 'college', 'high_school'
  league: text("league"),
  season: text("season"), // For championship teams
  description: text("description"),
  bannerImageUrl: text("banner_image_url"),
  logoUrl: text("logo_url"),
  achievements: json("achievements").$type<string[]>(),
  roster: json("roster").$type<{
    memorialId?: string;
    playerName: string;
    position: string;
    jerseyNumber: string;
    role?: string; // 'captain', 'mvp', etc.
  }[]>(),
  coaches: json("coaches").$type<{
    name: string;
    role: string;
    memorialId?: string;
  }[]>(),
  championshipDetails: json("championship_details").$type<{
    title: string;
    year: number;
    opponent?: string;
    score?: string;
    venue?: string;
  }>(),
  isPublic: boolean("is_public").default(true),
  creatorId: varchar("creator_id").references(() => users.id),
  organizationApproved: boolean("organization_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_team_memorials_sport").on(table.sport),
  index("idx_team_memorials_team_name").on(table.teamName),
  index("idx_team_memorials_season").on(table.season),
]);

// Athletic Legacy Score tracking
export const athleticLegacyScores = pgTable("athletic_legacy_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  athleteProfileId: varchar("athlete_profile_id").notNull().references(() => athleteProfiles.id, { onDelete: "cascade" }).unique(),
  // Component scores (0-100 each)
  statisticalScore: integer("statistical_score").default(0), // Based on career stats
  achievementScore: integer("achievement_score").default(0), // Championships, awards
  impactScore: integer("impact_score").default(0), // Influence on sport
  fanEngagementScore: integer("fan_engagement_score").default(0), // Memorial interactions
  mediaPresenceScore: integer("media_presence_score").default(0), // Coverage, documentaries
  // Overall legacy score (weighted average)
  overallScore: integer("overall_score").default(0),
  scoreHistory: json("score_history").$type<{
    date: string;
    score: number;
    reason?: string;
  }[]>().default([]),
  lastCalculated: timestamp("last_calculated"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_athletic_legacy_scores_overall_score").on(table.overallScore),
]);

// Jersey retirement and hall of fame tracking
export const jerseyRetirements = pgTable("jersey_retirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  athleteProfileId: varchar("athlete_profile_id").notNull().references(() => athleteProfiles.id, { onDelete: "cascade" }),
  teamMemorialId: varchar("team_memorial_id").references(() => teamMemorials.id),
  organization: text("organization").notNull(),
  jerseyNumber: text("jersey_number").notNull(),
  retirementDate: timestamp("retirement_date"),
  ceremonyDetails: json("ceremony_details").$type<{
    location?: string;
    attendees?: string[];
    speechTranscript?: string;
    videoUrl?: string;
    photoUrls?: string[];
  }>(),
  isVirtual: boolean("is_virtual").default(false), // For virtual ceremonies on the platform
  bannerLocation: text("banner_location"), // Physical location of retired jersey
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_jersey_retirements_athlete_profile_id").on(table.athleteProfileId),
  index("idx_jersey_retirements_organization").on(table.organization),
]);

// ============================================
// PET MEMORIAL SYSTEM
// ============================================

// Pet Memorials - dedicated tribute pages for beloved pets
export const petMemorials = pgTable("pet_memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorEmail: text("creator_email").notNull(),
  
  // Pet basic info
  name: text("name").notNull(),
  species: text("species").notNull(), // 'dog', 'cat', 'bird', 'rabbit', 'horse', 'fish', 'reptile', 'other'
  breed: text("breed"),
  color: text("color"),
  birthDate: text("birth_date"),
  passingDate: text("passing_date").notNull(),
  age: text("age"), // Human-readable age like "12 years"
  
  // Personality and characteristics
  personality: text("personality").array(), // ['playful', 'loyal', 'cuddly', 'energetic', 'calm']
  favoriteActivities: text("favorite_activities").array(),
  favoriteFood: text("favorite_food"),
  favoriteToy: text("favorite_toy"),
  specialTraits: text("special_traits"), // What made them unique
  
  // Memorial content
  biography: text("biography"),
  epitaph: text("epitaph"), // Short tribute message
  rainbowBridgeMessage: text("rainbow_bridge_message"), // Special tribute
  
  // Media
  profilePhoto: text("profile_photo"),
  coverPhoto: text("cover_photo"),
  galleryPhotos: text("gallery_photos").array(),
  
  // Theme customization
  theme: text("theme").default("rainbow_bridge"), // 'rainbow_bridge', 'garden', 'starlight', 'forest', 'ocean'
  primaryColor: text("primary_color"),
  
  // Vet and care info (optional)
  vetClinic: text("vet_clinic"),
  microchipId: text("microchip_id"),
  causeOfPassing: text("cause_of_passing"),
  
  // Settings
  isPublic: boolean("is_public").default(true),
  allowCondolences: boolean("allow_condolences").default(true),
  inviteCode: varchar("invite_code", { length: 20 }).notNull().unique(),
  
  // Analytics
  viewCount: integer("view_count").default(0),
  candleLitCount: integer("candle_lit_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_pet_memorials_creator_email").on(table.creatorEmail),
  index("idx_pet_memorials_species").on(table.species),
  index("idx_pet_memorials_is_public").on(table.isPublic),
]);

// Pet Memorial Photos - gallery images with memories
export const petMemorialPhotos = pgTable("pet_memorial_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petMemorialId: varchar("pet_memorial_id").notNull().references(() => petMemorials.id, { onDelete: "cascade" }),
  photoUrl: text("photo_url").notNull(),
  caption: text("caption"),
  dateTaken: text("date_taken"),
  location: text("location"),
  isFavorite: boolean("is_favorite").default(false),
  uploadedBy: text("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_pet_memorial_photos_pet_memorial_id").on(table.petMemorialId),
]);

// Pet Memorial Condolences
export const petMemorialCondolences = pgTable("pet_memorial_condolences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petMemorialId: varchar("pet_memorial_id").notNull().references(() => petMemorials.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  message: text("message").notNull(),
  relationship: text("relationship"), // 'friend', 'neighbor', 'vet', 'groomer', 'family'
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_pet_memorial_condolences_pet_memorial_id").on(table.petMemorialId),
]);

// Pet Memorial Candles - virtual candles lit in memory
export const petMemorialCandles = pgTable("pet_memorial_candles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petMemorialId: varchar("pet_memorial_id").notNull().references(() => petMemorials.id, { onDelete: "cascade" }),
  litBy: text("lit_by").notNull(),
  litByEmail: text("lit_by_email"),
  message: text("message"),
  candleType: text("candle_type").default("standard"), // 'standard', 'eternal', 'rainbow'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_pet_memorial_candles_pet_memorial_id").on(table.petMemorialId),
]);

// ============================================
// LIVING LEGACY ACHIEVEMENT SYSTEM
// ============================================

// Living Legacy - pre-mortem memorial building for milestone tracking
export const livingLegacies = pgTable("living_legacies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Person info
  fullName: text("full_name").notNull(),
  birthDate: text("birth_date"),
  currentAge: integer("current_age"),
  location: text("location"),
  occupation: text("occupation"),
  
  // Life story in progress
  biography: text("biography"),
  lifePhilosophy: text("life_philosophy"),
  favoriteQuote: text("favorite_quote"),
  
  // Media
  profilePhoto: text("profile_photo"),
  coverPhoto: text("cover_photo"),
  
  // Privacy
  isPublic: boolean("is_public").default(false),
  publishAfterPassing: boolean("publish_after_passing").default(true),
  designatedExecutorEmail: text("designated_executor_email"),
  
  // Progress tracking
  completionPercentage: integer("completion_percentage").default(0),
  lastUpdatedSection: text("last_updated_section"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_living_legacies_user_id").on(table.userId),
]);

// Living Legacy Achievements - milestones and accomplishments
export const livingLegacyAchievements = pgTable("living_legacy_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  livingLegacyId: varchar("living_legacy_id").notNull().references(() => livingLegacies.id, { onDelete: "cascade" }),
  
  category: text("category").notNull(), // 'education', 'career', 'family', 'travel', 'hobby', 'volunteer', 'award', 'personal'
  title: text("title").notNull(),
  description: text("description"),
  date: text("date"),
  location: text("location"),
  photoUrl: text("photo_url"),
  importance: integer("importance").default(5), // 1-10 scale
  isHighlight: boolean("is_highlight").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_living_legacy_achievements_living_legacy_id").on(table.livingLegacyId),
  index("idx_living_legacy_achievements_category").on(table.category),
]);

// Living Legacy Bucket List - things to accomplish
export const livingLegacyBucketList = pgTable("living_legacy_bucket_list", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  livingLegacyId: varchar("living_legacy_id").notNull().references(() => livingLegacies.id, { onDelete: "cascade" }),
  
  item: text("item").notNull(),
  category: text("category"), // 'travel', 'experience', 'skill', 'relationship', 'giving'
  isCompleted: boolean("is_completed").default(false),
  completedDate: text("completed_date"),
  completionNotes: text("completion_notes"),
  photoUrl: text("photo_url"),
  priority: integer("priority").default(3), // 1-5 scale
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_living_legacy_bucket_list_living_legacy_id").on(table.livingLegacyId),
]);

// Living Legacy Messages - pre-written messages for loved ones
export const livingLegacyMessages = pgTable("living_legacy_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  livingLegacyId: varchar("living_legacy_id").notNull().references(() => livingLegacies.id, { onDelete: "cascade" }),
  
  recipientName: text("recipient_name").notNull(),
  recipientEmail: text("recipient_email"),
  recipientRelationship: text("recipient_relationship"),
  
  subject: text("subject"),
  message: text("message").notNull(),
  videoUrl: text("video_url"),
  
  deliveryTrigger: text("delivery_trigger").default("after_passing"), // 'after_passing', 'specific_date', 'milestone'
  deliveryDate: text("delivery_date"),
  deliveryMilestone: text("delivery_milestone"), // 'wedding', 'graduation', 'first_child'
  
  isDelivered: boolean("is_delivered").default(false),
  deliveredAt: timestamp("delivered_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_living_legacy_messages_living_legacy_id").on(table.livingLegacyId),
]);

// ============================================
// FAMILY TREE INTEGRATION
// ============================================

// Family Tree Connections - link memorials to family relationships
export const familyTreeConnections = pgTable("family_tree_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // The person whose family tree this is
  primaryMemorialId: varchar("primary_memorial_id").references(() => memorials.id, { onDelete: "cascade" }),
  primaryLivingLegacyId: varchar("primary_living_legacy_id").references(() => livingLegacies.id, { onDelete: "cascade" }),
  
  // The related person
  relatedMemorialId: varchar("related_memorial_id").references(() => memorials.id, { onDelete: "set null" }),
  relatedLivingLegacyId: varchar("related_living_legacy_id").references(() => livingLegacies.id, { onDelete: "set null" }),
  relatedPersonName: text("related_person_name"), // For people without memorials
  
  // Relationship details
  relationship: text("relationship").notNull(), // 'parent', 'child', 'sibling', 'spouse', 'grandparent', 'grandchild', 'aunt_uncle', 'niece_nephew', 'cousin'
  relationshipDetail: text("relationship_detail"), // 'mother', 'father', 'brother', 'sister', etc.
  isBloodRelative: boolean("is_blood_relative").default(true),
  
  // Marriage details (for spouse relationships)
  marriageDate: text("marriage_date"),
  marriageLocation: text("marriage_location"),
  
  // Verification
  isVerified: boolean("is_verified").default(false),
  verifiedBy: varchar("verified_by").references(() => users.id, { onDelete: "set null" }),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_family_tree_primary_memorial").on(table.primaryMemorialId),
  index("idx_family_tree_primary_living_legacy").on(table.primaryLivingLegacyId),
  index("idx_family_tree_related_memorial").on(table.relatedMemorialId),
  index("idx_family_tree_relationship").on(table.relationship),
]);

// ============================================
// HOLIDAY MEMORIAL TIMELINE
// ============================================

// Holiday Events - memorial holiday reminders and celebration planning
export const holidayEvents = pgTable("holiday_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  
  name: text("name").notNull(),
  date: text("date").notNull(), // ISO date format
  eventType: text("event_type").notNull().default("custom"), // 'birthday', 'anniversary', 'holiday', 'custom'
  description: text("description"),
  
  // Reminder settings
  reminderEnabled: boolean("reminder_enabled").default(true),
  reminderDaysBefore: integer("reminder_days_before").default(7),
  
  // Celebration planning
  celebrationPlan: text("celebration_plan"),
  traditions: text("traditions").array(),
  
  isRecurring: boolean("is_recurring").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_holiday_events_memorial_id").on(table.memorialId),
  index("idx_holiday_events_date").on(table.date),
  index("idx_holiday_events_type").on(table.eventType),
]);

export const insertHolidayEventSchema = createInsertSchema(holidayEvents).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertHolidayEvent = z.infer<typeof insertHolidayEventSchema>;
export type HolidayEvent = typeof holidayEvents.$inferSelect;

// ============================================
// BIRTHDAY CELEBRATION PLATFORM
// ============================================

// Birthday Wishes - annual birthday messages for memorials
export const birthdayWishes = pgTable("birthday_wishes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  message: text("message").notNull(),
  relationship: text("relationship"),
  year: integer("year").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_birthday_wishes_memorial_id").on(table.memorialId),
  index("idx_birthday_wishes_year").on(table.year),
]);

export const insertBirthdayWishSchema = createInsertSchema(birthdayWishes).omit({ id: true, createdAt: true });
export type InsertBirthdayWish = z.infer<typeof insertBirthdayWishSchema>;
export type BirthdayWish = typeof birthdayWishes.$inferSelect;

// ============================================
// CONTINUUM CELEBRATIONS SYSTEM
// ============================================

// Holiday Catalog - comprehensive multi-faith holiday database
export const holidayCatalog = pgTable("holiday_catalog", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  name: text("name").notNull(),
  description: text("description"),
  
  // Categorization
  category: text("category").notNull(), // 'religious', 'cultural', 'national', 'international', 'secular'
  faithTradition: text("faith_tradition"), // 'christian', 'jewish', 'islamic', 'hindu', 'buddhist', 'sikh', 'pagan', 'secular', 'universal'
  region: text("region"), // 'global', 'north_america', 'europe', 'asia', 'africa', 'middle_east', 'oceania', 'south_america'
  country: text("country"), // ISO country code for national holidays
  
  // Date handling
  dateType: text("date_type").notNull().default("fixed"), // 'fixed', 'lunar', 'calculated', 'variable'
  fixedMonth: integer("fixed_month"), // 1-12 for fixed date holidays
  fixedDay: integer("fixed_day"), // 1-31 for fixed date holidays
  calculationRule: text("calculation_rule"), // For variable holidays like Easter, Eid, etc.
  
  // Styling and assets
  iconName: text("icon_name"), // Lucide icon name
  primaryColor: text("primary_color"), // Hex color for theming
  secondaryColor: text("secondary_color"),
  bannerImageUrl: text("banner_image_url"),
  
  // Content
  traditions: text("traditions").array(),
  greetings: text("greetings").array(), // Traditional greetings in multiple languages
  symbolism: text("symbolism"),
  
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_holiday_catalog_category").on(table.category),
  index("idx_holiday_catalog_faith").on(table.faithTradition),
  index("idx_holiday_catalog_region").on(table.region),
]);

// Celebration Wallets - hold funds from donations for shopping spree
export const celebrationWallets = pgTable("celebration_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Owner reference (can be memorial, living legacy, or user)
  memorialId: varchar("memorial_id").references(() => memorials.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  
  // Wallet details
  walletType: text("wallet_type").notNull(), // 'birthday', 'wedding', 'celebration', 'memorial'
  walletName: text("wallet_name").notNull(),
  
  // Balance tracking
  totalReceived: decimal("total_received", { precision: 10, scale: 2 }).default("0.00"),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0.00"),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).default("0.00"),
  
  // Spending limits
  spendingLimit: decimal("spending_limit", { precision: 10, scale: 2 }),
  requiresApproval: boolean("requires_approval").default(false),
  approverEmail: text("approver_email"),
  
  // Status
  status: text("status").notNull().default("active"), // 'active', 'frozen', 'closed'
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_celebration_wallets_memorial").on(table.memorialId),
  index("idx_celebration_wallets_user").on(table.userId),
  index("idx_celebration_wallets_type").on(table.walletType),
]);

// Wallet Transactions - ledger for wallet deposits and spending
export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").notNull().references(() => celebrationWallets.id, { onDelete: "cascade" }),
  
  transactionType: text("transaction_type").notNull(), // 'deposit', 'withdrawal', 'purchase', 'refund'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  
  // Source/destination info
  sourceType: text("source_type"), // 'donation', 'gift', 'transfer', 'refund'
  sourceId: varchar("source_id"), // Reference to donation ID, order ID, etc.
  donorName: text("donor_name"),
  donorEmail: text("donor_email"),
  
  // Purchase info (for spending)
  merchantName: text("merchant_name"),
  orderReference: text("order_reference"),
  itemDescription: text("item_description"),
  
  // Balance after transaction
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  
  // Metadata
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_wallet_transactions_wallet").on(table.walletId),
  index("idx_wallet_transactions_type").on(table.transactionType),
  index("idx_wallet_transactions_date").on(table.createdAt),
]);

// Shopping Spree Orders - track purchases from wallet funds
export const shoppingSpreeOrders = pgTable("shopping_spree_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").notNull().references(() => celebrationWallets.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  
  // Order details
  orderNumber: text("order_number").notNull(),
  merchantName: text("merchant_name").notNull(),
  merchantUrl: text("merchant_url"),
  
  // Items
  items: jsonb("items").notNull().$type<Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string;
  }>>().default([]),
  
  // Totals
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0.00"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0.00"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Shipping
  shippingAddress: jsonb("shipping_address").$type<{
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>(),
  
  // Status tracking
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  
  // Approval workflow
  approvalStatus: text("approval_status").default("pending"), // 'pending', 'approved', 'rejected'
  approvedBy: varchar("approved_by").references(() => users.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_shopping_spree_orders_wallet").on(table.walletId),
  index("idx_shopping_spree_orders_user").on(table.userId),
  index("idx_shopping_spree_orders_status").on(table.status),
]);

// Wedding Registries - gift registries for weddings and celebrations
export const weddingRegistries = pgTable("wedding_registries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Owner info
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Event details
  eventType: text("event_type").notNull().default("wedding"), // 'wedding', 'anniversary', 'baby_shower', 'birthday', 'graduation'
  eventName: text("event_name").notNull(), // "John & Jane's Wedding"
  eventDate: text("event_date"),
  eventLocation: text("event_location"),
  
  // Couple/honoree info
  primaryPersonName: text("primary_person_name").notNull(),
  secondaryPersonName: text("secondary_person_name"), // For weddings
  
  // Styling
  coverImageUrl: text("cover_image_url"),
  themeColor: text("theme_color"),
  message: text("message"), // Welcome message for guests
  
  // Sharing
  shareCode: varchar("share_code", { length: 20 }).notNull().unique(),
  isPublic: boolean("is_public").default(false),
  
  // Wallet link for cash gifts
  walletId: varchar("wallet_id").references(() => celebrationWallets.id, { onDelete: "set null" }),
  
  status: text("status").notNull().default("active"), // 'draft', 'active', 'completed', 'archived'
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_wedding_registries_user").on(table.userId),
  index("idx_wedding_registries_event_type").on(table.eventType),
  index("idx_wedding_registries_share_code").on(table.shareCode),
]);

// Registry Items - products in a wedding registry
export const registryItems = pgTable("registry_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  registryId: varchar("registry_id").notNull().references(() => weddingRegistries.id, { onDelete: "cascade" }),
  
  // Product info
  productName: text("product_name").notNull(),
  productDescription: text("product_description"),
  productUrl: text("product_url"),
  productImageUrl: text("product_image_url"),
  retailerName: text("retailer_name"),
  
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  
  // Quantity tracking
  quantityRequested: integer("quantity_requested").notNull().default(1),
  quantityPurchased: integer("quantity_purchased").default(0),
  
  // Category
  category: text("category"), // 'kitchen', 'bedroom', 'living', 'outdoor', 'experience', 'cash', 'other'
  priority: text("priority").default("normal"), // 'must_have', 'high', 'normal', 'nice_to_have'
  
  // Notes
  personalNote: text("personal_note"), // Why this item is special
  
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_registry_items_registry").on(table.registryId),
  index("idx_registry_items_category").on(table.category),
]);

// Registry Gifts - track who purchased what
export const registryGifts = pgTable("registry_gifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  registryItemId: varchar("registry_item_id").notNull().references(() => registryItems.id, { onDelete: "cascade" }),
  registryId: varchar("registry_id").notNull().references(() => weddingRegistries.id, { onDelete: "cascade" }),
  
  // Gifter info
  gifterName: text("gifter_name").notNull(),
  gifterEmail: text("gifter_email"),
  gifterUserId: varchar("gifter_user_id").references(() => users.id, { onDelete: "set null" }),
  
  // Gift details
  quantity: integer("quantity").notNull().default(1),
  amount: decimal("amount", { precision: 10, scale: 2 }), // For partial gifts or cash contributions
  
  // Message
  giftMessage: text("gift_message"),
  
  // Status
  status: text("status").notNull().default("purchased"), // 'reserved', 'purchased', 'shipped', 'delivered'
  isAnonymous: boolean("is_anonymous").default(false),
  
  // Thank you tracking
  thankYouSent: boolean("thank_you_sent").default(false),
  thankYouSentAt: timestamp("thank_you_sent_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_registry_gifts_item").on(table.registryItemId),
  index("idx_registry_gifts_registry").on(table.registryId),
  index("idx_registry_gifts_gifter").on(table.gifterUserId),
]);

// Bluetooth Playlist Sessions - for live celebration music sharing
export const bluetoothPlaylistSessions = pgTable("bluetooth_playlist_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Event reference
  memorialId: varchar("memorial_id").references(() => memorials.id, { onDelete: "cascade" }),
  eventId: varchar("event_id"), // Reference to memorial event
  
  // Session host
  hostUserId: varchar("host_user_id").references(() => users.id, { onDelete: "set null" }),
  hostDeviceName: text("host_device_name"),
  
  // Session details
  sessionName: text("session_name").notNull(),
  sessionCode: varchar("session_code", { length: 8 }).notNull().unique(), // Short code to join
  
  // Playlist
  playlistId: varchar("playlist_id").references(() => memorialPlaylists.id, { onDelete: "set null" }),
  currentTrackIndex: integer("current_track_index").default(0),
  isPlaying: boolean("is_playing").default(false),
  
  // Connected devices
  connectedDevices: jsonb("connected_devices").$type<Array<{
    deviceId: string;
    deviceName: string;
    deviceType: string;
    connectedAt: string;
  }>>().default([]),
  maxDevices: integer("max_devices").default(20),
  
  // Status
  status: text("status").notNull().default("active"), // 'active', 'paused', 'ended'
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_bluetooth_sessions_memorial").on(table.memorialId),
  index("idx_bluetooth_sessions_host").on(table.hostUserId),
  index("idx_bluetooth_sessions_code").on(table.sessionCode),
]);

// Live Celebration Sessions - for streaming celebrations with friends
export const liveCelebrationSessions = pgTable("live_celebration_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Event type
  celebrationType: text("celebration_type").notNull(), // 'birthday', 'holiday', 'anniversary', 'graduation', 'wedding', 'memorial'
  memorialId: varchar("memorial_id").references(() => memorials.id, { onDelete: "cascade" }),
  
  // Host info
  hostUserId: varchar("host_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  hostName: text("host_name").notNull(),
  
  // Session details
  title: text("title").notNull(),
  description: text("description"),
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end"),
  
  // Joining
  joinCode: varchar("join_code", { length: 10 }).notNull().unique(),
  password: text("password"), // Optional password protection
  maxParticipants: integer("max_participants").default(50),
  
  // Stream settings
  streamUrl: text("stream_url"),
  streamType: text("stream_type").default("video"), // 'video', 'audio_only', 'photo_slideshow'
  isRecordingEnabled: boolean("is_recording_enabled").default(false),
  recordingUrl: text("recording_url"),
  
  // Features
  chatEnabled: boolean("chat_enabled").default(true),
  reactionsEnabled: boolean("reactions_enabled").default(true),
  photosEnabled: boolean("photos_enabled").default(true),
  
  // Playlist integration
  playlistSessionId: varchar("playlist_session_id").references(() => bluetoothPlaylistSessions.id, { onDelete: "set null" }),
  
  // Status
  status: text("status").notNull().default("scheduled"), // 'scheduled', 'live', 'ended', 'cancelled'
  actualStartedAt: timestamp("actual_started_at"),
  actualEndedAt: timestamp("actual_ended_at"),
  
  // Stats
  peakViewers: integer("peak_viewers").default(0),
  totalViews: integer("total_views").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_live_celebrations_host").on(table.hostUserId),
  index("idx_live_celebrations_memorial").on(table.memorialId),
  index("idx_live_celebrations_type").on(table.celebrationType),
  index("idx_live_celebrations_scheduled").on(table.scheduledStart),
  index("idx_live_celebrations_code").on(table.joinCode),
]);

// Live Celebration Participants - track who joined
export const liveCelebrationParticipants = pgTable("live_celebration_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => liveCelebrationSessions.id, { onDelete: "cascade" }),
  
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  participantName: text("participant_name").notNull(),
  participantEmail: text("participant_email"),
  
  role: text("role").notNull().default("viewer"), // 'host', 'co_host', 'speaker', 'viewer'
  
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  durationMinutes: integer("duration_minutes"),
  
  // Engagement
  reactionsCount: integer("reactions_count").default(0),
  messagesCount: integer("messages_count").default(0),
  photosShared: integer("photos_shared").default(0),
}, (table) => [
  index("idx_live_participants_session").on(table.sessionId),
  index("idx_live_participants_user").on(table.userId),
]);

// Export schemas and types for new Celebration tables
export const insertHolidayCatalogSchema = createInsertSchema(holidayCatalog).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertHolidayCatalog = z.infer<typeof insertHolidayCatalogSchema>;
export type HolidayCatalog = typeof holidayCatalog.$inferSelect;

export const insertCelebrationWalletSchema = createInsertSchema(celebrationWallets).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCelebrationWallet = z.infer<typeof insertCelebrationWalletSchema>;
export type CelebrationWallet = typeof celebrationWallets.$inferSelect;

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({ id: true, createdAt: true });
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;

export const insertShoppingSpreeOrderSchema = createInsertSchema(shoppingSpreeOrders).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertShoppingSpreeOrder = z.infer<typeof insertShoppingSpreeOrderSchema>;
export type ShoppingSpreeOrder = typeof shoppingSpreeOrders.$inferSelect;

export const insertWeddingRegistrySchema = createInsertSchema(weddingRegistries).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWeddingRegistry = z.infer<typeof insertWeddingRegistrySchema>;
export type WeddingRegistry = typeof weddingRegistries.$inferSelect;

export const insertRegistryItemSchema = createInsertSchema(registryItems).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertRegistryItem = z.infer<typeof insertRegistryItemSchema>;
export type RegistryItem = typeof registryItems.$inferSelect;

export const insertRegistryGiftSchema = createInsertSchema(registryGifts).omit({ id: true, createdAt: true });
export type InsertRegistryGift = z.infer<typeof insertRegistryGiftSchema>;
export type RegistryGift = typeof registryGifts.$inferSelect;

export const insertBluetoothPlaylistSessionSchema = createInsertSchema(bluetoothPlaylistSessions).omit({ id: true, createdAt: true });
export type InsertBluetoothPlaylistSession = z.infer<typeof insertBluetoothPlaylistSessionSchema>;
export type BluetoothPlaylistSession = typeof bluetoothPlaylistSessions.$inferSelect;

export const insertLiveCelebrationSessionSchema = createInsertSchema(liveCelebrationSessions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLiveCelebrationSession = z.infer<typeof insertLiveCelebrationSessionSchema>;
export type LiveCelebrationSession = typeof liveCelebrationSessions.$inferSelect;

export const insertLiveCelebrationParticipantSchema = createInsertSchema(liveCelebrationParticipants).omit({ id: true });
export type InsertLiveCelebrationParticipant = z.infer<typeof insertLiveCelebrationParticipantSchema>;
export type LiveCelebrationParticipant = typeof liveCelebrationParticipants.$inferSelect;

// Multi-Faith Templates - prayer and ceremony templates
export const multiFaithTemplates = pgTable("multi_faith_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  faith: text("faith").notNull(), // 'christian', 'catholic', 'jewish', 'islamic', 'hindu', 'buddhist', 'sikh', 'shinto', 'native_american', 'pagan', 'spiritual', 'secular', 'universal'
  category: text("category").notNull(), // 'prayer', 'ceremony', 'reading', 'blessing', 'song', 'ritual'
  
  title: text("title").notNull(),
  content: text("content").notNull(),
  source: text("source"), // Scripture reference or origin
  language: text("language").default("en"),
  
  // Usage context
  suitableFor: text("suitable_for").array(), // ['funeral', 'memorial', 'anniversary', 'birthday']
  tone: text("tone"), // 'comforting', 'celebratory', 'reflective', 'hopeful'
  
  // Customization
  isCustomizable: boolean("is_customizable").default(true),
  placeholders: text("placeholders").array(), // ['[NAME]', '[RELATIONSHIP]', '[DATE]']
  
  isPublic: boolean("is_public").default(true),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  
  usageCount: integer("usage_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_multi_faith_templates_faith").on(table.faith),
  index("idx_multi_faith_templates_category").on(table.category),
]);

// Export schemas and types for Pet Memorials
export const insertPetMemorialSchema = createInsertSchema(petMemorials).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true, candleLitCount: true });
export const insertPetMemorialPhotoSchema = createInsertSchema(petMemorialPhotos).omit({ id: true, createdAt: true });
export const insertPetMemorialCondolenceSchema = createInsertSchema(petMemorialCondolences).omit({ id: true, createdAt: true });
export const insertPetMemorialCandleSchema = createInsertSchema(petMemorialCandles).omit({ id: true, createdAt: true });

export type InsertPetMemorial = z.infer<typeof insertPetMemorialSchema>;
export type PetMemorial = typeof petMemorials.$inferSelect;
export type InsertPetMemorialPhoto = z.infer<typeof insertPetMemorialPhotoSchema>;
export type PetMemorialPhoto = typeof petMemorialPhotos.$inferSelect;
export type InsertPetMemorialCondolence = z.infer<typeof insertPetMemorialCondolenceSchema>;
export type PetMemorialCondolence = typeof petMemorialCondolences.$inferSelect;
export type InsertPetMemorialCandle = z.infer<typeof insertPetMemorialCandleSchema>;
export type PetMemorialCandle = typeof petMemorialCandles.$inferSelect;

// Export schemas and types for Living Legacy
export const insertLivingLegacySchema = createInsertSchema(livingLegacies).omit({ id: true, createdAt: true, updatedAt: true, completionPercentage: true });
export const insertLivingLegacyAchievementSchema = createInsertSchema(livingLegacyAchievements).omit({ id: true, createdAt: true });
export const insertLivingLegacyBucketListSchema = createInsertSchema(livingLegacyBucketList).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLivingLegacyMessageSchema = createInsertSchema(livingLegacyMessages).omit({ id: true, createdAt: true, updatedAt: true, isDelivered: true, deliveredAt: true });

export type InsertLivingLegacy = z.infer<typeof insertLivingLegacySchema>;
export type LivingLegacy = typeof livingLegacies.$inferSelect;
export type InsertLivingLegacyAchievement = z.infer<typeof insertLivingLegacyAchievementSchema>;
export type LivingLegacyAchievement = typeof livingLegacyAchievements.$inferSelect;
export type InsertLivingLegacyBucketList = z.infer<typeof insertLivingLegacyBucketListSchema>;
export type LivingLegacyBucketList = typeof livingLegacyBucketList.$inferSelect;
export type InsertLivingLegacyMessage = z.infer<typeof insertLivingLegacyMessageSchema>;
export type LivingLegacyMessage = typeof livingLegacyMessages.$inferSelect;

// Export schemas and types for Family Tree
export const insertFamilyTreeConnectionSchema = createInsertSchema(familyTreeConnections).omit({ id: true, createdAt: true });
export type InsertFamilyTreeConnection = z.infer<typeof insertFamilyTreeConnectionSchema>;
export type FamilyTreeConnection = typeof familyTreeConnections.$inferSelect;

// Export schemas and types for Multi-Faith
export const insertMultiFaithTemplateSchema = createInsertSchema(multiFaithTemplates).omit({ id: true, createdAt: true, updatedAt: true, usageCount: true });
export type InsertMultiFaithTemplate = z.infer<typeof insertMultiFaithTemplateSchema>;
export type MultiFaithTemplate = typeof multiFaithTemplates.$inferSelect;

// Export schemas and types for Memorial Event Planner
export const insertEventTemplateSchema = createInsertSchema(eventTemplates).omit({ id: true, createdAt: true });
export const insertEventChecklistSchema = createInsertSchema(eventChecklists).omit({ id: true, createdAt: true });
export const insertMemorialEventPlanSchema = createInsertSchema(memorialEventPlans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEventTaskSchema = createInsertSchema(eventTasks).omit({ id: true, createdAt: true });
export const insertVendorListingSchema = createInsertSchema(vendorListings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertVendorBookingSchema = createInsertSchema(vendorBookings).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertEventTemplate = z.infer<typeof insertEventTemplateSchema>;
export type EventTemplate = typeof eventTemplates.$inferSelect;
export type InsertEventChecklist = z.infer<typeof insertEventChecklistSchema>;
export type EventChecklist = typeof eventChecklists.$inferSelect;
export type InsertMemorialEventPlan = z.infer<typeof insertMemorialEventPlanSchema>;
export type MemorialEventPlan = typeof memorialEventPlans.$inferSelect;
export type InsertEventTask = z.infer<typeof insertEventTaskSchema>;
export type EventTask = typeof eventTasks.$inferSelect;
export type InsertVendorListing = z.infer<typeof insertVendorListingSchema>;
export type VendorListing = typeof vendorListings.$inferSelect;
export type InsertVendorBooking = z.infer<typeof insertVendorBookingSchema>;
export type VendorBooking = typeof vendorBookings.$inferSelect;

// Export schemas and types for Sports Memorials
export const insertAthleteProfileSchema = createInsertSchema(athleteProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAthleteStatSchema = createInsertSchema(athleteStats).omit({ id: true, createdAt: true });
export const insertTeamMemorialSchema = createInsertSchema(teamMemorials).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAthleticLegacyScoreSchema = createInsertSchema(athleticLegacyScores).omit({ id: true, createdAt: true, updatedAt: true });
export const insertJerseyRetirementSchema = createInsertSchema(jerseyRetirements).omit({ id: true, createdAt: true });

export type InsertAthleteProfile = z.infer<typeof insertAthleteProfileSchema>;
export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteStat = z.infer<typeof insertAthleteStatSchema>;
export type AthleteStat = typeof athleteStats.$inferSelect;
export type InsertTeamMemorial = z.infer<typeof insertTeamMemorialSchema>;
export type TeamMemorial = typeof teamMemorials.$inferSelect;
export type InsertAthleticLegacyScore = z.infer<typeof insertAthleticLegacyScoreSchema>;
export type AthleticLegacyScore = typeof athleticLegacyScores.$inferSelect;
export type InsertJerseyRetirement = z.infer<typeof insertJerseyRetirementSchema>;
export type JerseyRetirement = typeof jerseyRetirements.$inferSelect;

// AI Memorial Cards - AI-generated personalized memorial cards
export const aiMemorialCards = pgTable("ai_memorial_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").references(() => memorials.id, { onDelete: "cascade" }),
  
  // Card content
  templateId: text("template_id").notNull(), // 'classic', 'modern', 'faith', 'celebration'
  headline: text("headline").notNull(),
  tributeText: text("tribute_text").notNull(),
  quote: text("quote"),
  
  // Personalization data
  honoreeName: text("honoree_name").notNull(),
  birthDate: text("birth_date"),
  deathDate: text("death_date"),
  relationship: text("relationship"),
  keyMemories: text("key_memories"),
  tone: text("tone").notNull().default("comforting"), // 'comforting', 'celebratory', 'spiritual', 'formal'
  
  // Visual
  photoUrl: text("photo_url"),
  backgroundColor: text("background_color"),
  
  // Metadata
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  isPublic: boolean("is_public").default(false),
  downloadCount: integer("download_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_ai_memorial_cards_memorial_id").on(table.memorialId),
  index("idx_ai_memorial_cards_created_by").on(table.createdBy),
]);

// Export schemas and types for AI Memorial Cards
export const insertAiMemorialCardSchema = createInsertSchema(aiMemorialCards).omit({ id: true, createdAt: true, updatedAt: true, downloadCount: true });
export type InsertAiMemorialCard = z.infer<typeof insertAiMemorialCardSchema>;
export type AiMemorialCard = typeof aiMemorialCards.$inferSelect;
