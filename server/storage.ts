import {
  users,
  memorials,
  memories,
  condolences,
  scheduledMessages,
  fundraisers,
  donations,
  celebrityMemorials,
  celebrityDonations,
  griefSupport,
  legacyEvents,
  musicPlaylists,
  essentialWorkersMemorials,
  selfWrittenObituaries,
  advertisements,
  funeralHomePartners,
  partnerReferrals,
  partnerCommissions,
  partnerPayouts,
  prisonFacilities,
  prisonAccessRequests,
  prisonVerifications,
  prisonPayments,
  prisonAccessSessions,
  prisonAuditLogs,
  pushTokens,
  type User,
  type InsertUser,
  type Memorial,
  type InsertMemorial,
  type Memory,
  type InsertMemory,
  type Condolence,
  type InsertCondolence,
  type ScheduledMessage,
  type InsertScheduledMessage,
  type Fundraiser,
  type InsertFundraiser,
  type Donation,
  type InsertDonation,
  type CelebrityMemorial,
  type InsertCelebrityMemorial,
  type CelebrityDonation,
  type InsertCelebrityDonation,
  type GriefSupport,
  type InsertGriefSupport,
  type LegacyEvent,
  type InsertLegacyEvent,
  type MusicPlaylist,
  type InsertMusicPlaylist,
  type EssentialWorkerMemorial,
  type InsertEssentialWorkerMemorial,
  type SelfWrittenObituary,
  type InsertSelfWrittenObituary,
  type Advertisement,
  type InsertAdvertisement,
  type FuneralHomePartner,
  type InsertFuneralHomePartner,
  type PartnerReferral,
  type InsertPartnerReferral,
  type PartnerCommission,
  type InsertPartnerCommission,
  type PartnerPayout,
  type InsertPartnerPayout,
  type PrisonFacility,
  type InsertPrisonFacility,
  type PrisonAccessRequest,
  type InsertPrisonAccessRequest,
  type PrisonVerification,
  type InsertPrisonVerification,
  type PrisonPayment,
  type InsertPrisonPayment,
  type PrisonAccessSession,
  type InsertPrisonAccessSession,
  type PrisonAuditLog,
  type InsertPrisonAuditLog,
  type PushToken,
  type InsertPushToken,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Memorial operations
  getMemorial(id: string): Promise<Memorial | undefined>;
  getMemorialByInviteCode(inviteCode: string): Promise<Memorial | undefined>;
  createMemorial(memorial: InsertMemorial): Promise<Memorial>;
  updateMemorial(id: string, memorial: Partial<InsertMemorial>): Promise<Memorial | undefined>;
  listMemorials(): Promise<Memorial[]>;

  // Memory operations
  getMemoriesByMemorialId(memorialId: string): Promise<Memory[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  approveMemory(id: string): Promise<Memory | undefined>;
  rejectMemory(id: string): Promise<void>;

  // Condolence operations
  getCondolencesByMemorialId(memorialId: string): Promise<Condolence[]>;
  createCondolence(condolence: InsertCondolence): Promise<Condolence>;

  // Scheduled Message operations
  getScheduledMessagesByMemorialId(memorialId: string): Promise<ScheduledMessage[]>;
  createScheduledMessage(message: InsertScheduledMessage): Promise<ScheduledMessage>;
  updateScheduledMessage(id: string, message: Partial<InsertScheduledMessage>): Promise<ScheduledMessage | undefined>;

  // Fundraiser operations
  getFundraisersByMemorialId(memorialId: string): Promise<Fundraiser[]>;
  getFundraiser(id: string): Promise<Fundraiser | undefined>;
  createFundraiser(fundraiser: InsertFundraiser): Promise<Fundraiser>;
  
  // Donation operations
  getDonationsByFundraiserId(fundraiserId: string): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;

  // Celebrity Memorial operations
  listCelebrityMemorials(): Promise<CelebrityMemorial[]>;
  getCelebrityMemorial(id: string): Promise<CelebrityMemorial | undefined>;
  createCelebrityMemorial(memorial: InsertCelebrityMemorial): Promise<CelebrityMemorial>;
  createCelebrityDonation(donation: InsertCelebrityDonation): Promise<CelebrityDonation>;

  // Grief Support operations
  getGriefSupportByMemorialId(memorialId: string): Promise<GriefSupport | undefined>;
  upsertGriefSupport(support: InsertGriefSupport): Promise<GriefSupport>;

  // Legacy Event operations
  getLegacyEventsByMemorialId(memorialId: string): Promise<LegacyEvent[]>;
  createLegacyEvent(event: InsertLegacyEvent): Promise<LegacyEvent>;

  // Music Playlist operations
  getMusicPlaylistByMemorialId(memorialId: string): Promise<MusicPlaylist | undefined>;
  upsertMusicPlaylist(playlist: InsertMusicPlaylist): Promise<MusicPlaylist>;

  // Essential Workers Memorial operations
  listEssentialWorkersMemorials(category?: string): Promise<EssentialWorkerMemorial[]>;
  getEssentialWorkerMemorial(id: string): Promise<EssentialWorkerMemorial | undefined>;
  createEssentialWorkerMemorial(memorial: InsertEssentialWorkerMemorial): Promise<EssentialWorkerMemorial>;
  updateEssentialWorkerMemorial(id: string, memorial: Partial<InsertEssentialWorkerMemorial>): Promise<EssentialWorkerMemorial | undefined>;
  deleteEssentialWorkerMemorial(id: string): Promise<void>;

  // Self-Written Obituary operations
  getSelfWrittenObituaryByEmail(email: string): Promise<SelfWrittenObituary | undefined>;
  createSelfWrittenObituary(obituary: InsertSelfWrittenObituary): Promise<SelfWrittenObituary>;
  updateSelfWrittenObituary(id: string, obituary: Partial<InsertSelfWrittenObituary>): Promise<SelfWrittenObituary | undefined>;
  activateSelfWrittenObituary(id: string): Promise<SelfWrittenObituary | undefined>;

  // Advertisement operations
  listAdvertisements(category?: string): Promise<Advertisement[]>;
  getAdvertisement(id: string): Promise<Advertisement | undefined>;
  createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement>;
  updateAdvertisement(id: string, ad: Partial<InsertAdvertisement>): Promise<Advertisement | undefined>;
  deleteAdvertisement(id: string): Promise<void>;
  incrementAdImpression(id: string): Promise<void>;
  incrementAdClick(id: string): Promise<void>;

  // Funeral Home Partner operations
  listFuneralHomePartners(isActive?: boolean): Promise<FuneralHomePartner[]>;
  getFuneralHomePartner(id: string): Promise<FuneralHomePartner | undefined>;
  getFuneralHomePartnerByReferralCode(referralCode: string): Promise<FuneralHomePartner | undefined>;
  createFuneralHomePartner(partner: InsertFuneralHomePartner): Promise<FuneralHomePartner>;
  updateFuneralHomePartner(id: string, partner: Partial<InsertFuneralHomePartner>): Promise<FuneralHomePartner | undefined>;
  createPartnerReferral(referral: InsertPartnerReferral): Promise<PartnerReferral>;
  getPartnerReferralsByPartnerId(partnerId: string): Promise<PartnerReferral[]>;
  getPartnerReferralByMemorialId(memorialId: string): Promise<PartnerReferral | undefined>;
  createPartnerCommission(commission: InsertPartnerCommission): Promise<PartnerCommission>;
  getPartnerCommissionsByPartnerId(partnerId: string, status?: string): Promise<PartnerCommission[]>;
  updatePartnerCommissionStatus(id: string, status: string): Promise<PartnerCommission | undefined>;
  createPartnerPayout(payout: InsertPartnerPayout): Promise<PartnerPayout>;
  getPartnerPayoutsByPartnerId(partnerId: string): Promise<PartnerPayout[]>;
  updatePartnerPayoutStatus(id: string, status: string, paidAt?: Date): Promise<PartnerPayout | undefined>;

  // Prison Access System operations
  listPrisonFacilities(): Promise<PrisonFacility[]>;
  createPrisonFacility(facility: InsertPrisonFacility): Promise<PrisonFacility>;
  createPrisonAccessRequest(request: InsertPrisonAccessRequest): Promise<PrisonAccessRequest>;
  listPrisonAccessRequests(status?: string, memorialId?: string): Promise<PrisonAccessRequest[]>;
  getPrisonAccessRequest(id: string): Promise<PrisonAccessRequest | undefined>;
  updatePrisonAccessRequestStatus(id: string, status: string, adminNotes?: string): Promise<PrisonAccessRequest | undefined>;
  createPrisonVerification(verification: InsertPrisonVerification): Promise<PrisonVerification>;
  getPrisonVerificationsByRequestId(requestId: string): Promise<PrisonVerification[]>;
  createPrisonPayment(payment: InsertPrisonPayment): Promise<PrisonPayment>;
  confirmPrisonPayment(id: string): Promise<PrisonPayment | undefined>;
  createPrisonAccessSession(session: InsertPrisonAccessSession): Promise<PrisonAccessSession>;
  validatePrisonAccessToken(token: string): Promise<PrisonAccessSession | undefined>;
  deactivatePrisonAccessSession(id: string): Promise<PrisonAccessSession | undefined>;
  createPrisonAuditLog(log: InsertPrisonAuditLog): Promise<PrisonAuditLog>;
  getPrisonAuditLogs(requestId?: string, sessionId?: string): Promise<PrisonAuditLog[]>;

  // Push Token operations
  createPushToken(token: InsertPushToken): Promise<PushToken>;
  getPushTokensByMemorialId(memorialId: string): Promise<PushToken[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Memorial operations
  async getMemorial(id: string): Promise<Memorial | undefined> {
    const [memorial] = await db.select().from(memorials).where(eq(memorials.id, id));
    return memorial || undefined;
  }

  async getMemorialByInviteCode(inviteCode: string): Promise<Memorial | undefined> {
    const [memorial] = await db.select().from(memorials).where(eq(memorials.inviteCode, inviteCode));
    return memorial || undefined;
  }

  async createMemorial(memorial: InsertMemorial): Promise<Memorial> {
    const [created] = await db.insert(memorials).values(memorial).returning();
    return created;
  }

  async updateMemorial(id: string, memorial: Partial<InsertMemorial>): Promise<Memorial | undefined> {
    const [updated] = await db.update(memorials).set(memorial).where(eq(memorials.id, id)).returning();
    return updated || undefined;
  }

  async listMemorials(): Promise<Memorial[]> {
    return await db.select().from(memorials).orderBy(desc(memorials.createdAt));
  }

  // Memory operations
  async getMemoriesByMemorialId(memorialId: string): Promise<Memory[]> {
    return await db.select().from(memories).where(eq(memories.memorialId, memorialId)).orderBy(desc(memories.createdAt));
  }

  async createMemory(memory: InsertMemory): Promise<Memory> {
    const [created] = await db.insert(memories).values(memory).returning();
    return created;
  }

  async approveMemory(id: string): Promise<Memory | undefined> {
    const [approved] = await db.update(memories).set({ isApproved: true }).where(eq(memories.id, id)).returning();
    return approved || undefined;
  }

  async rejectMemory(id: string): Promise<void> {
    await db.delete(memories).where(eq(memories.id, id));
  }

  // Condolence operations
  async getCondolencesByMemorialId(memorialId: string): Promise<Condolence[]> {
    return await db.select().from(condolences).where(eq(condolences.memorialId, memorialId)).orderBy(desc(condolences.createdAt));
  }

  async createCondolence(condolence: InsertCondolence): Promise<Condolence> {
    const [created] = await db.insert(condolences).values(condolence).returning();
    return created;
  }

  // Scheduled Message operations
  async getScheduledMessagesByMemorialId(memorialId: string): Promise<ScheduledMessage[]> {
    return await db.select().from(scheduledMessages).where(eq(scheduledMessages.memorialId, memorialId)).orderBy(desc(scheduledMessages.createdAt));
  }

  async createScheduledMessage(message: InsertScheduledMessage): Promise<ScheduledMessage> {
    const [created] = await db.insert(scheduledMessages).values(message).returning();
    return created;
  }

  async updateScheduledMessage(id: string, message: Partial<InsertScheduledMessage>): Promise<ScheduledMessage | undefined> {
    const [updated] = await db.update(scheduledMessages).set(message).where(eq(scheduledMessages.id, id)).returning();
    return updated || undefined;
  }

  // Fundraiser operations
  async getFundraisersByMemorialId(memorialId: string): Promise<Fundraiser[]> {
    return await db.select().from(fundraisers).where(eq(fundraisers.memorialId, memorialId)).orderBy(desc(fundraisers.createdAt));
  }

  async getFundraiser(id: string): Promise<Fundraiser | undefined> {
    const [fundraiser] = await db.select().from(fundraisers).where(eq(fundraisers.id, id));
    return fundraiser || undefined;
  }

  async createFundraiser(fundraiser: InsertFundraiser): Promise<Fundraiser> {
    const [created] = await db.insert(fundraisers).values(fundraiser).returning();
    return created;
  }

  // Donation operations
  async getDonationsByFundraiserId(fundraiserId: string): Promise<Donation[]> {
    return await db.select().from(donations).where(eq(donations.fundraiserId, fundraiserId)).orderBy(desc(donations.createdAt));
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [created] = await db.insert(donations).values(donation).returning();
    
    // Update fundraiser current amount - cast to numeric to ensure proper addition
    await db.execute(sql`
      UPDATE fundraisers 
      SET current_amount = current_amount + CAST(${donation.amount} AS NUMERIC)
      WHERE id = ${donation.fundraiserId}
    `);
    
    return created;
  }

  // Celebrity Memorial operations
  async listCelebrityMemorials(): Promise<CelebrityMemorial[]> {
    return await db.select().from(celebrityMemorials).orderBy(desc(celebrityMemorials.createdAt));
  }

  async getCelebrityMemorial(id: string): Promise<CelebrityMemorial | undefined> {
    const [memorial] = await db.select().from(celebrityMemorials).where(eq(celebrityMemorials.id, id));
    return memorial || undefined;
  }

  async createCelebrityMemorial(memorial: InsertCelebrityMemorial): Promise<CelebrityMemorial> {
    const [created] = await db.insert(celebrityMemorials).values(memorial).returning();
    return created;
  }

  async createCelebrityDonation(donation: InsertCelebrityDonation): Promise<CelebrityDonation> {
    const [created] = await db.insert(celebrityDonations).values(donation).returning();
    
    // Increment fan count
    await db.execute(sql`
      UPDATE celebrity_memorials 
      SET fan_count = fan_count + 1
      WHERE id = ${donation.celebrityMemorialId}
    `);
    
    return created;
  }

  // Grief Support operations
  async getGriefSupportByMemorialId(memorialId: string): Promise<GriefSupport | undefined> {
    const [support] = await db.select().from(griefSupport).where(eq(griefSupport.memorialId, memorialId));
    return support || undefined;
  }

  async upsertGriefSupport(support: InsertGriefSupport): Promise<GriefSupport> {
    const existing = await this.getGriefSupportByMemorialId(support.memorialId);
    
    if (existing) {
      const [updated] = await db.update(griefSupport)
        .set({
          familyContact: support.familyContact,
          pastoralContact: support.pastoralContact,
          customContacts: support.customContacts as any,
        })
        .where(eq(griefSupport.memorialId, support.memorialId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(griefSupport).values({
        ...support,
        customContacts: support.customContacts as any,
      }).returning();
      return created;
    }
  }

  // Legacy Event operations
  async getLegacyEventsByMemorialId(memorialId: string): Promise<LegacyEvent[]> {
    return await db.select().from(legacyEvents).where(eq(legacyEvents.memorialId, memorialId)).orderBy(desc(legacyEvents.createdAt));
  }

  async createLegacyEvent(event: InsertLegacyEvent): Promise<LegacyEvent> {
    const [created] = await db.insert(legacyEvents).values(event).returning();
    return created;
  }

  // Music Playlist operations
  async getMusicPlaylistByMemorialId(memorialId: string): Promise<MusicPlaylist | undefined> {
    const [playlist] = await db.select().from(musicPlaylists).where(eq(musicPlaylists.memorialId, memorialId));
    return playlist || undefined;
  }

  async upsertMusicPlaylist(playlist: InsertMusicPlaylist): Promise<MusicPlaylist> {
    const existing = await this.getMusicPlaylistByMemorialId(playlist.memorialId);
    
    if (existing) {
      const [updated] = await db.update(musicPlaylists)
        .set({
          memorialId: playlist.memorialId,
          tracks: playlist.tracks as any,
        })
        .where(eq(musicPlaylists.memorialId, playlist.memorialId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(musicPlaylists).values({
        ...playlist,
        tracks: playlist.tracks as any,
      }).returning();
      return created;
    }
  }

  // Prison Access System operations
  async listPrisonFacilities(): Promise<PrisonFacility[]> {
    return await db.select().from(prisonFacilities).where(eq(prisonFacilities.isActive, true));
  }

  async createPrisonFacility(facility: InsertPrisonFacility): Promise<PrisonFacility> {
    const [created] = await db.insert(prisonFacilities).values(facility).returning();
    return created;
  }

  async createPrisonAccessRequest(request: InsertPrisonAccessRequest): Promise<PrisonAccessRequest> {
    const [created] = await db.insert(prisonAccessRequests).values(request).returning();
    return created;
  }

  async listPrisonAccessRequests(status?: string, memorialId?: string): Promise<PrisonAccessRequest[]> {
    let query = db.select().from(prisonAccessRequests);
    
    const conditions = [];
    if (status) {
      conditions.push(eq(prisonAccessRequests.status, status));
    }
    if (memorialId) {
      conditions.push(eq(prisonAccessRequests.memorialId, memorialId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(desc(prisonAccessRequests.createdAt));
  }

  async getPrisonAccessRequest(id: string): Promise<PrisonAccessRequest | undefined> {
    const [request] = await db.select().from(prisonAccessRequests).where(eq(prisonAccessRequests.id, id));
    return request || undefined;
  }

  async updatePrisonAccessRequestStatus(id: string, status: string, adminNotes?: string): Promise<PrisonAccessRequest | undefined> {
    const [updated] = await db.update(prisonAccessRequests)
      .set({ 
        status,
        adminNotes,
        updatedAt: new Date()
      })
      .where(eq(prisonAccessRequests.id, id))
      .returning();
    return updated || undefined;
  }

  async createPrisonVerification(verification: InsertPrisonVerification): Promise<PrisonVerification> {
    const [created] = await db.insert(prisonVerifications).values({
      ...verification,
      verificationData: verification.verificationData as any,
    }).returning();
    return created;
  }

  async getPrisonVerificationsByRequestId(requestId: string): Promise<PrisonVerification[]> {
    return await db.select().from(prisonVerifications).where(eq(prisonVerifications.requestId, requestId));
  }

  async createPrisonPayment(payment: InsertPrisonPayment): Promise<PrisonPayment> {
    const [created] = await db.insert(prisonPayments).values(payment).returning();
    return created;
  }

  async confirmPrisonPayment(id: string): Promise<PrisonPayment | undefined> {
    const [updated] = await db.update(prisonPayments)
      .set({ 
        status: 'confirmed',
        paidAt: new Date()
      })
      .where(eq(prisonPayments.id, id))
      .returning();
    return updated || undefined;
  }

  async createPrisonAccessSession(session: InsertPrisonAccessSession): Promise<PrisonAccessSession> {
    const [created] = await db.insert(prisonAccessSessions).values(session).returning();
    return created;
  }

  async validatePrisonAccessToken(token: string): Promise<PrisonAccessSession | undefined> {
    const [session] = await db.select()
      .from(prisonAccessSessions)
      .where(
        and(
          eq(prisonAccessSessions.accessToken, token),
          eq(prisonAccessSessions.isActive, true),
          sql`${prisonAccessSessions.expiresAt} > NOW()`
        )
      );

    if (session) {
      await db.update(prisonAccessSessions)
        .set({ lastAccessedAt: new Date() })
        .where(eq(prisonAccessSessions.id, session.id));
    }

    return session || undefined;
  }

  async deactivatePrisonAccessSession(id: string): Promise<PrisonAccessSession | undefined> {
    const [updated] = await db.update(prisonAccessSessions)
      .set({ isActive: false })
      .where(eq(prisonAccessSessions.id, id))
      .returning();
    return updated || undefined;
  }

  async createPrisonAuditLog(log: InsertPrisonAuditLog): Promise<PrisonAuditLog> {
    const [created] = await db.insert(prisonAuditLogs).values({
      ...log,
      metadata: log.metadata as any,
    }).returning();
    return created;
  }

  async getPrisonAuditLogs(requestId?: string, sessionId?: string): Promise<PrisonAuditLog[]> {
    let query = db.select().from(prisonAuditLogs);
    
    const conditions = [];
    if (requestId) {
      conditions.push(eq(prisonAuditLogs.requestId, requestId));
    }
    if (sessionId) {
      conditions.push(eq(prisonAuditLogs.sessionId, sessionId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(desc(prisonAuditLogs.createdAt));
  }

  // Essential Workers Memorial operations
  async listEssentialWorkersMemorials(category?: string): Promise<EssentialWorkerMemorial[]> {
    const conditions = [eq(essentialWorkersMemorials.isPublic, true)];
    
    if (category && category.trim() !== "") {
      conditions.push(eq(essentialWorkersMemorials.category, category));
    }

    return await db
      .select()
      .from(essentialWorkersMemorials)
      .where(and(...conditions))
      .orderBy(desc(essentialWorkersMemorials.createdAt));
  }

  async getEssentialWorkerMemorial(id: string): Promise<EssentialWorkerMemorial | undefined> {
    const [memorial] = await db.select().from(essentialWorkersMemorials).where(eq(essentialWorkersMemorials.id, id));
    return memorial || undefined;
  }

  async createEssentialWorkerMemorial(memorial: InsertEssentialWorkerMemorial): Promise<EssentialWorkerMemorial> {
    const [created] = await db.insert(essentialWorkersMemorials).values({
      ...memorial,
      honors: memorial.honors as any,
    }).returning();
    return created;
  }

  async updateEssentialWorkerMemorial(id: string, memorial: Partial<InsertEssentialWorkerMemorial>): Promise<EssentialWorkerMemorial | undefined> {
    const [updated] = await db.update(essentialWorkersMemorials)
      .set({
        ...memorial,
        honors: memorial.honors as any,
      })
      .where(eq(essentialWorkersMemorials.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEssentialWorkerMemorial(id: string): Promise<void> {
    await db.delete(essentialWorkersMemorials).where(eq(essentialWorkersMemorials.id, id));
  }

  // Self-Written Obituary operations
  async getSelfWrittenObituaryByEmail(email: string): Promise<SelfWrittenObituary | undefined> {
    const [obituary] = await db.select().from(selfWrittenObituaries).where(eq(selfWrittenObituaries.userEmail, email));
    return obituary || undefined;
  }

  async createSelfWrittenObituary(obituary: InsertSelfWrittenObituary): Promise<SelfWrittenObituary> {
    const [created] = await db.insert(selfWrittenObituaries).values(obituary).returning();
    return created;
  }

  async updateSelfWrittenObituary(id: string, obituary: Partial<InsertSelfWrittenObituary>): Promise<SelfWrittenObituary | undefined> {
    const [updated] = await db.update(selfWrittenObituaries)
      .set({
        ...obituary,
        updatedAt: new Date(),
      })
      .where(eq(selfWrittenObituaries.id, id))
      .returning();
    return updated || undefined;
  }

  async activateSelfWrittenObituary(id: string): Promise<SelfWrittenObituary | undefined> {
    const [activated] = await db.update(selfWrittenObituaries)
      .set({
        isActivated: true,
        activatedAt: new Date(),
      })
      .where(eq(selfWrittenObituaries.id, id))
      .returning();
    return activated || undefined;
  }

  // Advertisement operations
  async listAdvertisements(category?: string): Promise<Advertisement[]> {
    const conditions = [eq(advertisements.isActive, true)];
    
    if (category && category.trim() !== "") {
      conditions.push(eq(advertisements.category, category));
    }

    const ads = await db
      .select()
      .from(advertisements)
      .where(and(...conditions))
      .orderBy(desc(advertisements.createdAt));

    const now = new Date();
    return ads.filter(ad => !ad.expiresAt || new Date(ad.expiresAt) > now);
  }

  async getAdvertisement(id: string): Promise<Advertisement | undefined> {
    const [ad] = await db.select().from(advertisements).where(eq(advertisements.id, id));
    return ad || undefined;
  }

  async createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement> {
    const [created] = await db.insert(advertisements).values(ad).returning();
    return created;
  }

  async updateAdvertisement(id: string, ad: Partial<InsertAdvertisement>): Promise<Advertisement | undefined> {
    const [updated] = await db.update(advertisements)
      .set(ad)
      .where(eq(advertisements.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAdvertisement(id: string): Promise<void> {
    await db.delete(advertisements).where(eq(advertisements.id, id));
  }

  async incrementAdImpression(id: string): Promise<void> {
    await db.update(advertisements)
      .set({ impressions: sql`${advertisements.impressions} + 1` })
      .where(eq(advertisements.id, id));
  }

  async incrementAdClick(id: string): Promise<void> {
    await db.update(advertisements)
      .set({ clicks: sql`${advertisements.clicks} + 1` })
      .where(eq(advertisements.id, id));
  }

  // Funeral Home Partner operations
  async listFuneralHomePartners(isActive?: boolean): Promise<FuneralHomePartner[]> {
    const conditions = [];
    if (isActive !== undefined) {
      conditions.push(eq(funeralHomePartners.isActive, isActive));
    }

    const query = conditions.length > 0
      ? db.select().from(funeralHomePartners).where(and(...conditions))
      : db.select().from(funeralHomePartners);

    return await query.orderBy(desc(funeralHomePartners.createdAt));
  }

  async getFuneralHomePartner(id: string): Promise<FuneralHomePartner | undefined> {
    const [partner] = await db.select().from(funeralHomePartners).where(eq(funeralHomePartners.id, id));
    return partner || undefined;
  }

  async getFuneralHomePartnerByReferralCode(referralCode: string): Promise<FuneralHomePartner | undefined> {
    const [partner] = await db.select().from(funeralHomePartners).where(eq(funeralHomePartners.referralCode, referralCode));
    return partner || undefined;
  }

  async createFuneralHomePartner(partner: InsertFuneralHomePartner): Promise<FuneralHomePartner> {
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const [created] = await db.insert(funeralHomePartners).values({
      ...partner,
      referralCode,
    }).returning();
    return created;
  }

  async updateFuneralHomePartner(id: string, partner: Partial<InsertFuneralHomePartner>): Promise<FuneralHomePartner | undefined> {
    const [updated] = await db.update(funeralHomePartners)
      .set(partner)
      .where(eq(funeralHomePartners.id, id))
      .returning();
    return updated || undefined;
  }

  async createPartnerReferral(referral: InsertPartnerReferral): Promise<PartnerReferral> {
    const [created] = await db.insert(partnerReferrals).values(referral).returning();
    return created;
  }

  async getPartnerReferralsByPartnerId(partnerId: string): Promise<PartnerReferral[]> {
    return await db.select().from(partnerReferrals)
      .where(eq(partnerReferrals.partnerId, partnerId))
      .orderBy(desc(partnerReferrals.createdAt));
  }

  async getPartnerReferralByMemorialId(memorialId: string): Promise<PartnerReferral | undefined> {
    const [referral] = await db.select().from(partnerReferrals)
      .where(eq(partnerReferrals.memorialId, memorialId));
    return referral || undefined;
  }

  async createPartnerCommission(commission: InsertPartnerCommission): Promise<PartnerCommission> {
    const [created] = await db.insert(partnerCommissions).values(commission).returning();
    return created;
  }

  async getPartnerCommissionsByPartnerId(partnerId: string, status?: string): Promise<PartnerCommission[]> {
    const conditions = [eq(partnerCommissions.partnerId, partnerId)];
    if (status) {
      conditions.push(eq(partnerCommissions.status, status));
    }

    return await db.select().from(partnerCommissions)
      .where(and(...conditions))
      .orderBy(desc(partnerCommissions.createdAt));
  }

  async updatePartnerCommissionStatus(id: string, status: string): Promise<PartnerCommission | undefined> {
    const [updated] = await db.update(partnerCommissions)
      .set({ status })
      .where(eq(partnerCommissions.id, id))
      .returning();
    return updated || undefined;
  }

  async createPartnerPayout(payout: InsertPartnerPayout): Promise<PartnerPayout> {
    const [created] = await db.insert(partnerPayouts).values(payout).returning();
    return created;
  }

  async getPartnerPayoutsByPartnerId(partnerId: string): Promise<PartnerPayout[]> {
    return await db.select().from(partnerPayouts)
      .where(eq(partnerPayouts.partnerId, partnerId))
      .orderBy(desc(partnerPayouts.createdAt));
  }

  async updatePartnerPayoutStatus(id: string, status: string, paidAt?: Date): Promise<PartnerPayout | undefined> {
    const updateData: any = { status };
    if (paidAt) {
      updateData.paidAt = paidAt;
    }

    const [updated] = await db.update(partnerPayouts)
      .set(updateData)
      .where(eq(partnerPayouts.id, id))
      .returning();
    return updated || undefined;
  }

  // Push Token operations
  async createPushToken(token: InsertPushToken): Promise<PushToken> {
    const [created] = await db.insert(pushTokens).values(token).returning();
    return created;
  }

  async getPushTokensByMemorialId(memorialId: string): Promise<PushToken[]> {
    return await db.select().from(pushTokens)
      .where(eq(pushTokens.memorialId, memorialId))
      .orderBy(desc(pushTokens.createdAt));
  }
}

export const storage = new DatabaseStorage();
