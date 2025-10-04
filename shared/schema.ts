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
