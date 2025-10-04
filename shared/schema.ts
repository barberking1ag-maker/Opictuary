import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memories = pgTable("memories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  caption: text("caption").notNull(),
  mediaUrl: text("media_url"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const condolences = pgTable("condolences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scheduledMessages = pgTable("scheduled_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  recipientName: text("recipient_name").notNull(),
  recipientEmail: text("recipient_email"),
  eventType: text("event_type").notNull(),
  eventDate: text("event_date"),
  message: text("message").notNull(),
  mediaUrl: text("media_url"),
  isSent: boolean("is_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fundraisers = pgTable("fundraisers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  goalAmount: decimal("goal_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  charityName: text("charity_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fundraiserId: varchar("fundraiser_id").notNull().references(() => fundraisers.id, { onDelete: "cascade" }),
  donorName: text("donor_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

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
});

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
  description: text("description"),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time"),
  location: text("location"),
  attendeeCount: integer("attendee_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  createdAt: timestamp("created_at").defaultNow(),
});

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
});

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
});

export const prisonVerifications = pgTable("prison_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => prisonAccessRequests.id, { onDelete: "cascade" }),
  verificationType: text("verification_type").notNull(),
  verifiedBy: text("verified_by").notNull(),
  verificationData: json("verification_data").$type<Record<string, any>>(),
  status: text("status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

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
});

export const prisonAccessSessions = pgTable("prison_access_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => prisonAccessRequests.id, { onDelete: "cascade" }),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  accessToken: text("access_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  isActive: boolean("is_active").default(true),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

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
});

export const partnerReferrals = pgTable("partner_referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => funeralHomePartners.id, { onDelete: "cascade" }),
  memorialId: varchar("memorial_id").notNull().references(() => memorials.id, { onDelete: "cascade" }),
  referralCode: text("referral_code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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
});

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
});

// Relations
export const memorialsRelations = relations(memorials, ({ many, one }) => ({
  memories: many(memories),
  condolences: many(condolences),
  scheduledMessages: many(scheduledMessages),
  fundraisers: many(fundraisers),
  griefSupport: one(griefSupport),
  legacyEvents: many(legacyEvents),
  musicPlaylist: one(musicPlaylists),
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
}));

export const celebrityDonationsRelations = relations(celebrityDonations, ({ one }) => ({
  celebrityMemorial: one(celebrityMemorials, {
    fields: [celebrityDonations.celebrityMemorialId],
    references: [celebrityMemorials.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMemorialSchema = createInsertSchema(memorials).omit({
  id: true,
  createdAt: true,
});

export const insertMemorySchema = createInsertSchema(memories).omit({
  id: true,
  createdAt: true,
});

export const insertCondolenceSchema = createInsertSchema(condolences).omit({
  id: true,
  createdAt: true,
});

export const insertScheduledMessageSchema = createInsertSchema(scheduledMessages).omit({
  id: true,
  createdAt: true,
  isSent: true,
});

export const insertFundraiserSchema = createInsertSchema(fundraisers).omit({
  id: true,
  createdAt: true,
  currentAmount: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertCelebrityMemorialSchema = createInsertSchema(celebrityMemorials).omit({
  id: true,
  createdAt: true,
  fanCount: true,
});

export const insertCelebrityDonationSchema = createInsertSchema(celebrityDonations).omit({
  id: true,
  createdAt: true,
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

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMemorial = z.infer<typeof insertMemorialSchema>;
export type Memorial = typeof memorials.$inferSelect;

export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Memory = typeof memories.$inferSelect;

export type InsertCondolence = z.infer<typeof insertCondolenceSchema>;
export type Condolence = typeof condolences.$inferSelect;

export type InsertScheduledMessage = z.infer<typeof insertScheduledMessageSchema>;
export type ScheduledMessage = typeof scheduledMessages.$inferSelect;

export type InsertFundraiser = z.infer<typeof insertFundraiserSchema>;
export type Fundraiser = typeof fundraisers.$inferSelect;

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export type InsertCelebrityMemorial = z.infer<typeof insertCelebrityMemorialSchema>;
export type CelebrityMemorial = typeof celebrityMemorials.$inferSelect;

export type InsertCelebrityDonation = z.infer<typeof insertCelebrityDonationSchema>;
export type CelebrityDonation = typeof celebrityDonations.$inferSelect;

export type InsertGriefSupport = z.infer<typeof insertGriefSupportSchema>;
export type GriefSupport = typeof griefSupport.$inferSelect;

export type InsertLegacyEvent = z.infer<typeof insertLegacyEventSchema>;
export type LegacyEvent = typeof legacyEvents.$inferSelect;

export type InsertMusicPlaylist = z.infer<typeof insertMusicPlaylistSchema>;
export type MusicPlaylist = typeof musicPlaylists.$inferSelect;

export type InsertEssentialWorkerMemorial = z.infer<typeof insertEssentialWorkerMemorialSchema>;
export type EssentialWorkerMemorial = typeof essentialWorkersMemorials.$inferSelect;

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

export type InsertFuneralHomePartner = z.infer<typeof insertFuneralHomePartnerSchema>;
export type FuneralHomePartner = typeof funeralHomePartners.$inferSelect;

export type InsertPartnerReferral = z.infer<typeof insertPartnerReferralSchema>;
export type PartnerReferral = typeof partnerReferrals.$inferSelect;

export type InsertPartnerCommission = z.infer<typeof insertPartnerCommissionSchema>;
export type PartnerCommission = typeof partnerCommissions.$inferSelect;

export type InsertPartnerPayout = z.infer<typeof insertPartnerPayoutSchema>;
export type PartnerPayout = typeof partnerPayouts.$inferSelect;
