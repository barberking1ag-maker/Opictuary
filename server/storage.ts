import {
  users,
  userSettings,
  memorials,
  memorialAdmins,
  qrCodes,
  memories,
  memoryComments,
  memoryCondolences,
  memoryReactions,
  condolences,
  memorialLikes,
  memorialComments,
  savedMemorials,
  memorialLiveStreams,
  memorialLiveStreamViewers,
  scheduledMessages,
  fundraisers,
  donations,
  celebrityMemorials,
  celebrityDonations,
  celebrityFanContent,
  griefSupport,
  legacyEvents,
  musicPlaylists,
  essentialWorkersMemorials,
  selfWrittenObituaries,
  advertisements,
  advertisementSales,
  funeralHomePartners,
  partnerReferrals,
  partnerCommissions,
  partnerPayouts,
  flowerShopPartners,
  flowerOrders,
  flowerCommissions,
  flowerPayouts,
  prisonFacilities,
  prisonAccessRequests,
  prisonVerifications,
  prisonPayments,
  prisonAccessSessions,
  prisonAuditLogs,
  pushTokens,
  pageViews,
  analyticsEvents,
  supportArticles,
  supportRequests,
  griefResources,
  memorialEvents,
  memorialEventRsvps,
  funeralPrograms,
  programItems,
  memorialDocumentaries,
  type User,
  type InsertUser,
  type UpsertUser,
  type UserSettings,
  type InsertUserSettings,
  type Memorial,
  type InsertMemorial,
  type MemorialAdmin,
  type InsertMemorialAdmin,
  type QRCode,
  type InsertQRCode,
  type Memory,
  type InsertMemory,
  type MemoryComment,
  type InsertMemoryComment,
  type MemoryCondolence,
  type InsertMemoryCondolence,
  type MemoryReaction,
  type InsertMemoryReaction,
  type Condolence,
  type InsertCondolence,
  type MemorialLike,
  type InsertMemorialLike,
  type MemorialComment,
  type InsertMemorialComment,
  type SavedMemorial,
  type InsertSavedMemorial,
  type MemorialLiveStream,
  type InsertMemorialLiveStream,
  type MemorialLiveStreamViewer,
  type InsertMemorialLiveStreamViewer,
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
  type CelebrityFanContent,
  type InsertCelebrityFanContent,
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
  type AdvertisementSale,
  type InsertAdvertisementSale,
  type FuneralHomePartner,
  type InsertFuneralHomePartner,
  type PartnerReferral,
  type InsertPartnerReferral,
  type PartnerCommission,
  type InsertPartnerCommission,
  type PartnerPayout,
  type InsertPartnerPayout,
  type FlowerShopPartner,
  type InsertFlowerShopPartner,
  type FlowerOrder,
  type InsertFlowerOrder,
  type FlowerCommission,
  type InsertFlowerCommission,
  type FlowerPayout,
  type InsertFlowerPayout,
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
  type PageView,
  type InsertPageView,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type SupportArticle,
  type InsertSupportArticle,
  type SupportRequest,
  type InsertSupportRequest,
  type GriefResource,
  type InsertGriefResource,
  type MemorialEvent,
  type InsertMemorialEvent,
  type MemorialEventRsvp,
  type InsertMemorialEventRsvp,
  type FuneralProgram,
  type InsertFuneralProgram,
  type ProgramItem,
  type InsertProgramItem,
  type MemorialDocumentary,
  type InsertMemorialDocumentary,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";
import * as QRCodeGenerator from "qrcode";

export interface IStorage {
  // User operations (Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User Settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  deleteUser(userId: string): Promise<void>;

  // Memorial operations
  getMemorial(id: string): Promise<Memorial | undefined>;
  getMemorialByInviteCode(inviteCode: string): Promise<Memorial | undefined>;
  getMemorialsByCreatorEmail(email: string): Promise<Memorial[]>;
  createMemorial(memorial: InsertMemorial): Promise<Memorial>;
  updateMemorial(id: string, memorial: Partial<InsertMemorial>): Promise<Memorial | undefined>;
  listMemorials(limit?: number, offset?: number): Promise<Memorial[]>;
  getMemorialsCount(): Promise<number>;

  // Memorial Admin operations
  getMemorialAdmins(memorialId: string): Promise<MemorialAdmin[]>;
  getMemorialAdminById(id: string): Promise<MemorialAdmin | undefined>;
  createMemorialAdmin(admin: InsertMemorialAdmin): Promise<MemorialAdmin>;
  deleteMemorialAdmin(id: string): Promise<void>;

  // QR Code operations
  getQRCodesByMemorialId(memorialId: string): Promise<QRCode[]>;
  getQRCodeById(id: string): Promise<QRCode | undefined>;
  getQRCodeByCode(code: string): Promise<QRCode | undefined>;
  generateQRCode(
    memorialId: string, 
    purpose: string, 
    issuedToEmail?: string,
    title?: string,
    description?: string,
    videoUrl?: string,
    imageUrl?: string,
    mediaType?: string
  ): Promise<QRCode>;
  updateQRCode(id: string, data: Partial<Pick<QRCode, 'title' | 'description' | 'videoUrl' | 'imageUrl' | 'mediaType'>>): Promise<QRCode | undefined>;
  deleteQRCode(id: string): Promise<void>;

  // Memory operations
  getMemoriesByMemorialId(memorialId: string): Promise<Memory[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  approveMemory(id: string): Promise<Memory | undefined>;
  rejectMemory(id: string): Promise<void>;

  // Memory Comment operations (comments on individual photos/videos)
  getMemoryComments(memoryId: string): Promise<MemoryComment[]>;
  createMemoryComment(comment: InsertMemoryComment): Promise<MemoryComment>;
  deleteMemoryComment(id: string): Promise<void>;
  getMemoryCommentsCount(memoryId: string): Promise<number>;

  // Memory Condolence operations (condolences on individual photos/videos)
  getMemoryCondolences(memoryId: string): Promise<MemoryCondolence[]>;
  createMemoryCondolence(condolence: InsertMemoryCondolence): Promise<MemoryCondolence>;
  deleteMemoryCondolence(memoryId: string, userId?: string, userEmail?: string): Promise<void>;
  getMemoryCondolencesCount(memoryId: string): Promise<number>;

  // Memory Reaction operations (hearts/likes on individual photos/videos)
  getMemoryReactions(memoryId: string): Promise<MemoryReaction[]>;
  createMemoryReaction(reaction: InsertMemoryReaction): Promise<MemoryReaction>;
  deleteMemoryReaction(memoryId: string, userId?: string, userEmail?: string): Promise<void>;
  getMemoryReactionsCount(memoryId: string): Promise<number>;
  getUserMemoryReaction(memoryId: string, userId?: string, userEmail?: string): Promise<MemoryReaction | undefined>;

  // Condolence operations
  getCondolencesByMemorialId(memorialId: string): Promise<Condolence[]>;
  createCondolence(condolence: InsertCondolence): Promise<Condolence>;

  // Memorial Like operations
  getMemorialLikes(memorialId: string): Promise<MemorialLike[]>;
  createMemorialLike(like: InsertMemorialLike): Promise<MemorialLike>;
  deleteMemorialLike(memorialId: string, userId?: string, userEmail?: string): Promise<void>;
  getMemorialLikesCount(memorialId: string): Promise<number>;

  // Memorial Comment operations
  getMemorialComments(memorialId: string): Promise<MemorialComment[]>;
  createMemorialComment(comment: InsertMemorialComment): Promise<MemorialComment>;
  deleteMemorialComment(id: string): Promise<void>;

  // Saved Memorial operations
  getSavedMemorials(userId: string): Promise<SavedMemorial[]>;
  getSavedMemorial(userId: string, memorialId: string): Promise<SavedMemorial | undefined>;
  createSavedMemorial(savedMemorial: InsertSavedMemorial): Promise<SavedMemorial>;
  deleteSavedMemorial(userId: string, memorialId: string): Promise<void>;
  updateSavedMemorial(id: string, data: Partial<InsertSavedMemorial>): Promise<SavedMemorial | undefined>;

  // Memorial Live Stream operations
  getMemorialLiveStreams(memorialId: string): Promise<MemorialLiveStream[]>;
  getMemorialLiveStream(id: string): Promise<MemorialLiveStream | undefined>;
  createMemorialLiveStream(stream: InsertMemorialLiveStream): Promise<MemorialLiveStream>;
  updateMemorialLiveStream(id: string, stream: Partial<InsertMemorialLiveStream>): Promise<MemorialLiveStream | undefined>;
  deleteMemorialLiveStream(id: string): Promise<void>;

  // Memorial Live Stream Viewer operations
  getLiveStreamViewers(streamId: string): Promise<MemorialLiveStreamViewer[]>;
  createLiveStreamViewer(viewer: InsertMemorialLiveStreamViewer): Promise<MemorialLiveStreamViewer>;
  updateLiveStreamViewer(id: string, leftAt: Date, durationMinutes: number): Promise<void>;

  // Memorial Documentary operations
  getMemorialDocumentaries(memorialId: string): Promise<MemorialDocumentary[]>;
  getMemorialDocumentary(id: string): Promise<MemorialDocumentary | undefined>;
  createMemorialDocumentary(documentary: InsertMemorialDocumentary): Promise<MemorialDocumentary>;
  updateMemorialDocumentary(id: string, documentary: Partial<InsertMemorialDocumentary>): Promise<MemorialDocumentary | undefined>;
  deleteMemorialDocumentary(id: string): Promise<void>;
  incrementDocumentaryViewCount(id: string): Promise<void>;

  // Scheduled Message operations
  getScheduledMessagesByMemorialId(memorialId: string): Promise<ScheduledMessage[]>;
  getScheduledMessage(id: string): Promise<ScheduledMessage | undefined>;
  createScheduledMessage(message: InsertScheduledMessage): Promise<ScheduledMessage>;
  updateScheduledMessage(id: string, message: Partial<InsertScheduledMessage>): Promise<ScheduledMessage | undefined>;
  deleteScheduledMessage(id: string): Promise<void>;

  // Fundraiser operations
  getFundraisersByMemorialId(memorialId: string): Promise<Fundraiser[]>;
  getFundraiser(id: string): Promise<Fundraiser | undefined>;
  createFundraiser(fundraiser: InsertFundraiser): Promise<Fundraiser>;
  
  // Donation operations
  getDonationsByFundraiserId(fundraiserId: string, limit?: number, offset?: number): Promise<Donation[]>;
  getDonationsByFundraiserIdCount(fundraiserId: string): Promise<number>;
  createDonation(donation: InsertDonation): Promise<Donation>;

  // Celebrity Memorial operations
  listCelebrityMemorials(limit?: number, offset?: number): Promise<CelebrityMemorial[]>;
  getCelebrityMemorialsCount(): Promise<number>;
  getCelebrityMemorial(id: string): Promise<CelebrityMemorial | undefined>;
  createCelebrityMemorial(memorial: InsertCelebrityMemorial): Promise<CelebrityMemorial>;
  createCelebrityDonation(donation: InsertCelebrityDonation): Promise<CelebrityDonation>;
  
  // Celebrity Fan Content operations (exclusive videos/photos from estates)
  listCelebrityFanContent(celebrityMemorialId: string): Promise<CelebrityFanContent[]>;
  getCelebrityFanContent(id: string): Promise<CelebrityFanContent | undefined>;
  createCelebrityFanContent(content: InsertCelebrityFanContent): Promise<CelebrityFanContent>;
  incrementFanContentViews(id: string): Promise<void>;
  publishCelebrityFanContent(id: string): Promise<void>;

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
  listEssentialWorkersMemorials(category?: string, limit?: number, offset?: number): Promise<EssentialWorkerMemorial[]>;
  getEssentialWorkersMemorialsCount(category?: string): Promise<number>;
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
  listAdvertisements(category?: string, limit?: number, offset?: number): Promise<Advertisement[]>;
  getAdvertisementsCount(category?: string): Promise<number>;
  getAdvertisement(id: string): Promise<Advertisement | undefined>;
  createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement>;
  updateAdvertisement(id: string, ad: Partial<InsertAdvertisement>): Promise<Advertisement | undefined>;
  deleteAdvertisement(id: string): Promise<void>;
  incrementAdImpression(id: string): Promise<void>;
  incrementAdClick(id: string): Promise<void>;

  // Advertisement Sales Tracking
  recordSale(sale: InsertAdvertisementSale): Promise<AdvertisementSale>;
  getAdvertisementSales(advertisementId: string): Promise<AdvertisementSale[]>;
  getSalesByReferralCode(referralCode: string): Promise<AdvertisementSale[]>;

  // Funeral Home Partner operations
  listFuneralHomePartners(isActive?: boolean, limit?: number, offset?: number): Promise<FuneralHomePartner[]>;
  getFuneralHomePartnersCount(isActive?: boolean): Promise<number>;
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

  // Flower Shop Partnership operations
  listFlowerShopPartners(city?: string, state?: string, limit?: number, offset?: number): Promise<FlowerShopPartner[]>;
  getFlowerShopPartnersCount(city?: string, state?: string): Promise<number>;
  getFlowerShopPartner(id: string): Promise<FlowerShopPartner | undefined>;
  createFlowerShopPartner(partner: InsertFlowerShopPartner): Promise<FlowerShopPartner>;
  updateFlowerShopPartner(id: string, partner: Partial<InsertFlowerShopPartner>): Promise<FlowerShopPartner | undefined>;
  createFlowerOrder(order: InsertFlowerOrder): Promise<FlowerOrder>;
  getFlowerOrder(id: string): Promise<FlowerOrder | undefined>;
  getFlowerOrdersByShopId(shopId: string): Promise<FlowerOrder[]>;
  getFlowerOrdersByMemorialId(memorialId: string): Promise<FlowerOrder[]>;
  updateFlowerOrderStatus(id: string, status: string, completedAt?: Date): Promise<FlowerOrder | undefined>;
  createFlowerCommission(commission: InsertFlowerCommission): Promise<FlowerCommission>;
  getFlowerCommissionsByShopId(shopId: string): Promise<FlowerCommission[]>;
  updateFlowerCommissionStatus(id: string, status: string, approvedAt?: Date): Promise<FlowerCommission | undefined>;
  createFlowerPayout(payout: InsertFlowerPayout): Promise<FlowerPayout>;
  getFlowerPayoutsByShopId(shopId: string): Promise<FlowerPayout[]>;
  updateFlowerPayoutStatus(id: string, status: string, paidAt?: Date): Promise<FlowerPayout | undefined>;

  // Prison Access System operations
  listPrisonFacilities(limit?: number, offset?: number): Promise<PrisonFacility[]>;
  getPrisonFacilitiesCount(): Promise<number>;
  createPrisonFacility(facility: InsertPrisonFacility): Promise<PrisonFacility>;
  createPrisonAccessRequest(request: InsertPrisonAccessRequest): Promise<PrisonAccessRequest>;
  listPrisonAccessRequests(status?: string, memorialId?: string, limit?: number, offset?: number): Promise<PrisonAccessRequest[]>;
  getPrisonAccessRequestsCount(status?: string, memorialId?: string): Promise<number>;
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

  // Analytics operations
  trackPageView(pageView: InsertPageView): Promise<PageView>;
  trackEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;

  // Admin Analytics
  getAdminStats(): Promise<any>;
  getRecentUsers(days: number): Promise<User[]>;

  // Support Article operations
  getSupportArticles(category?: string): Promise<SupportArticle[]>;
  getSupportArticle(id: string): Promise<SupportArticle | undefined>;
  createSupportArticle(article: InsertSupportArticle): Promise<SupportArticle>;
  updateSupportArticle(id: string, article: Partial<InsertSupportArticle>): Promise<SupportArticle | undefined>;
  deleteSupportArticle(id: string): Promise<void>;
  incrementArticleView(id: string): Promise<void>;
  incrementArticleHelpful(id: string): Promise<void>;

  // Support Request operations
  getSupportRequests(status?: string): Promise<SupportRequest[]>;
  getSupportRequest(id: string): Promise<SupportRequest | undefined>;
  createSupportRequest(request: InsertSupportRequest): Promise<SupportRequest>;
  updateSupportRequest(id: string, request: Partial<InsertSupportRequest>): Promise<SupportRequest | undefined>;
  resolveSupportRequest(id: string, resolution: string): Promise<SupportRequest | undefined>;

  // Grief Resource operations
  getGriefResources(category?: string): Promise<GriefResource[]>;
  getGriefResource(id: string): Promise<GriefResource | undefined>;
  createGriefResource(resource: InsertGriefResource): Promise<GriefResource>;
  updateGriefResource(id: string, resource: Partial<InsertGriefResource>): Promise<GriefResource | undefined>;
  deleteGriefResource(id: string): Promise<void>;

  // Memorial Events operations
  listMemorialEvents(memorialId?: string, limit?: number, offset?: number): Promise<MemorialEvent[]>;
  getMemorialEventsCount(memorialId?: string): Promise<number>;
  getMemorialEvent(id: string): Promise<MemorialEvent | undefined>;
  createMemorialEvent(event: InsertMemorialEvent): Promise<MemorialEvent>;
  updateMemorialEvent(id: string, event: Partial<InsertMemorialEvent>): Promise<MemorialEvent | undefined>;
  deleteMemorialEvent(id: string): Promise<void>;
  
  // Memorial Event RSVP operations
  listEventRsvps(eventId: string): Promise<MemorialEventRsvp[]>;
  getEventRsvp(id: string): Promise<MemorialEventRsvp | undefined>;
  createEventRsvp(rsvp: InsertMemorialEventRsvp): Promise<MemorialEventRsvp>;
  updateEventRsvp(id: string, rsvp: Partial<InsertMemorialEventRsvp>): Promise<MemorialEventRsvp | undefined>;
  deleteEventRsvp(id: string): Promise<void>;

  // Funeral Program operations
  getFuneralProgramByMemorialId(memorialId: string): Promise<FuneralProgram | undefined>;
  createFuneralProgram(program: InsertFuneralProgram): Promise<FuneralProgram>;
  updateFuneralProgram(memorialId: string, program: Partial<InsertFuneralProgram>): Promise<FuneralProgram | undefined>;
  deleteFuneralProgram(memorialId: string): Promise<void>;

  // Program Items operations
  getProgramItems(programId: string): Promise<ProgramItem[]>;
  createProgramItem(item: InsertProgramItem): Promise<ProgramItem>;
  updateProgramItem(id: string, item: Partial<InsertProgramItem>): Promise<ProgramItem | undefined>;
  deleteProgramItem(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // First check if user exists by email
    const [existingUser] = userData.email 
      ? await db.select().from(users).where(eq(users.email, userData.email))
      : [];

    if (existingUser) {
      // Update existing user
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(userData.email ? eq(users.email, userData.email) : eq(users.id, userData.id))
        .returning();
      return user;
    }

    // Insert new user
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User Settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings || undefined;
  }

  async upsertUserSettings(settingsData: InsertUserSettings): Promise<UserSettings> {
    const [existingSettings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, settingsData.userId));

    if (existingSettings) {
      // Update existing settings
      const [settings] = await db
        .update(userSettings)
        .set({
          ...settingsData,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, settingsData.userId))
        .returning();
      return settings;
    }

    // Insert new settings
    const [settings] = await db
      .insert(userSettings)
      .values(settingsData)
      .returning();
    return settings;
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete user and all related data
    // The user record will cascade delete most related records automatically
    
    // Simply delete the user - this will cascade to all related records
    // that have onDelete: "cascade" in their foreign key references:
    // - userSettings (cascades)
    // - memorialComments (cascades via userId foreign key)
    // - memoryComments (cascades via userId foreign key)  
    // - memorialLikes (cascades via userId foreign key)
    // - memoryCondolences (cascades via userId foreign key)
    // - memorialEventRsvps (cascades via userId foreign key)
    // - savedMemorials (cascades via userId foreign key)
    // - pushTokens (cascades via userId foreign key)
    // - memorialLiveStreamViewers (cascades via userId foreign key)
    
    await db.delete(users).where(eq(users.id, userId));
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

  async getMemorialsByCreatorEmail(email: string): Promise<Memorial[]> {
    const results = await db.select().from(memorials).where(eq(memorials.creatorEmail, email));
    return results;
  }

  async createMemorial(memorial: InsertMemorial): Promise<Memorial> {
    const [created] = await db.insert(memorials).values(memorial).returning();
    return created;
  }

  async updateMemorial(id: string, memorial: Partial<InsertMemorial>): Promise<Memorial | undefined> {
    const [updated] = await db.update(memorials).set(memorial).where(eq(memorials.id, id)).returning();
    return updated || undefined;
  }

  async listMemorials(limit: number = 50, offset: number = 0): Promise<Memorial[]> {
    const effectiveLimit = Math.min(limit, 200);
    return await db.select().from(memorials).orderBy(desc(memorials.createdAt)).limit(effectiveLimit).offset(offset);
  }

  async getMemorialsCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(memorials);
    return result.count;
  }

  // Memorial Admin operations
  async getMemorialAdmins(memorialId: string): Promise<MemorialAdmin[]> {
    return await db.select().from(memorialAdmins).where(eq(memorialAdmins.memorialId, memorialId)).orderBy(desc(memorialAdmins.createdAt));
  }

  async getMemorialAdminById(id: string): Promise<MemorialAdmin | undefined> {
    const [admin] = await db.select().from(memorialAdmins).where(eq(memorialAdmins.id, id));
    return admin || undefined;
  }

  async createMemorialAdmin(admin: InsertMemorialAdmin): Promise<MemorialAdmin> {
    const [created] = await db.insert(memorialAdmins).values(admin).returning();
    return created;
  }

  async deleteMemorialAdmin(id: string): Promise<void> {
    await db.delete(memorialAdmins).where(eq(memorialAdmins.id, id));
  }

  // QR Code operations
  async getQRCodesByMemorialId(memorialId: string): Promise<QRCode[]> {
    return await db.select().from(qrCodes).where(eq(qrCodes.memorialId, memorialId)).orderBy(desc(qrCodes.createdAt));
  }

  async getQRCodeById(id: string): Promise<QRCode | undefined> {
    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, id));
    return qrCode || undefined;
  }

  async getQRCodeByCode(code: string): Promise<QRCode | undefined> {
    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.code, code));
    return qrCode || undefined;
  }

  async generateQRCode(
    memorialId: string, 
    purpose: string, 
    issuedToEmail?: string,
    title?: string,
    description?: string,
    videoUrl?: string,
    imageUrl?: string,
    mediaType?: string
  ): Promise<QRCode> {
    const memorial = await this.getMemorial(memorialId);
    if (!memorial) {
      throw new Error("Memorial not found");
    }
    
    // Generate QR code URL based on purpose
    let qrCodeData: string;
    if (purpose === "upload" || purpose === "tombstone_upload") {
      qrCodeData = `https://opictuary.app/memorial/${memorial.inviteCode}/upload`;
    } else {
      qrCodeData = `https://opictuary.app/memorial/${memorial.inviteCode}`;
    }
    
    const qrCodeString = await QRCodeGenerator.toDataURL(qrCodeData, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 512,
    });
    
    const [created] = await db.insert(qrCodes).values({
      memorialId,
      code: qrCodeString,
      purpose,
      issuedToEmail,
      title,
      description,
      videoUrl,
      imageUrl,
      mediaType,
      status: "active",
    }).returning();
    
    return created;
  }

  async updateQRCode(id: string, data: Partial<Pick<QRCode, 'title' | 'description' | 'videoUrl' | 'imageUrl' | 'mediaType'>>): Promise<QRCode | undefined> {
    const [updated] = await db.update(qrCodes).set(data).where(eq(qrCodes.id, id)).returning();
    return updated || undefined;
  }

  async deleteQRCode(id: string): Promise<void> {
    await db.delete(qrCodes).where(eq(qrCodes.id, id));
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

  // Memory Comment operations (comments on individual photos/videos)
  async getMemoryComments(memoryId: string): Promise<MemoryComment[]> {
    return await db.select().from(memoryComments).where(eq(memoryComments.memoryId, memoryId)).orderBy(desc(memoryComments.createdAt));
  }

  async createMemoryComment(comment: InsertMemoryComment): Promise<MemoryComment> {
    const [created] = await db.insert(memoryComments).values(comment).returning();
    return created;
  }

  async deleteMemoryComment(id: string): Promise<void> {
    await db.delete(memoryComments).where(eq(memoryComments.id, id));
  }

  async getMemoryCommentsCount(memoryId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(memoryComments).where(eq(memoryComments.memoryId, memoryId));
    return result[0]?.count || 0;
  }

  // Memory Condolence operations (condolences on individual photos/videos)
  async getMemoryCondolences(memoryId: string): Promise<MemoryCondolence[]> {
    return await db.select().from(memoryCondolences).where(eq(memoryCondolences.memoryId, memoryId)).orderBy(desc(memoryCondolences.createdAt));
  }

  async createMemoryCondolence(condolence: InsertMemoryCondolence): Promise<MemoryCondolence> {
    const [created] = await db.insert(memoryCondolences).values(condolence).returning();
    return created;
  }

  async deleteMemoryCondolence(memoryId: string, userId?: string, userEmail?: string): Promise<void> {
    const conditions = [eq(memoryCondolences.memoryId, memoryId)];
    if (userId) {
      conditions.push(eq(memoryCondolences.userId, userId));
    } else if (userEmail) {
      conditions.push(eq(memoryCondolences.authorEmail, userEmail));
    }
    await db.delete(memoryCondolences).where(and(...conditions));
  }

  async getMemoryCondolencesCount(memoryId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(memoryCondolences).where(eq(memoryCondolences.memoryId, memoryId));
    return result[0]?.count || 0;
  }

  // Memory Reaction operations (hearts/likes on individual photos/videos)
  async getMemoryReactions(memoryId: string): Promise<MemoryReaction[]> {
    return await db.select().from(memoryReactions).where(eq(memoryReactions.memoryId, memoryId)).orderBy(desc(memoryReactions.createdAt));
  }

  async createMemoryReaction(reaction: InsertMemoryReaction): Promise<MemoryReaction> {
    const [created] = await db.insert(memoryReactions).values(reaction).returning();
    return created;
  }

  async deleteMemoryReaction(memoryId: string, userId?: string, userEmail?: string): Promise<void> {
    const conditions = [eq(memoryReactions.memoryId, memoryId)];
    if (userId) {
      conditions.push(eq(memoryReactions.userId, userId));
    } else if (userEmail) {
      conditions.push(eq(memoryReactions.userEmail, userEmail));
    }
    await db.delete(memoryReactions).where(and(...conditions));
  }

  async getMemoryReactionsCount(memoryId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(memoryReactions).where(eq(memoryReactions.memoryId, memoryId));
    return result[0]?.count || 0;
  }

  async getUserMemoryReaction(memoryId: string, userId?: string, userEmail?: string): Promise<MemoryReaction | undefined> {
    const conditions = [eq(memoryReactions.memoryId, memoryId)];
    if (userId) {
      conditions.push(eq(memoryReactions.userId, userId));
    } else if (userEmail) {
      conditions.push(eq(memoryReactions.userEmail, userEmail));
    } else {
      return undefined;
    }
    const [reaction] = await db.select().from(memoryReactions).where(and(...conditions));
    return reaction || undefined;
  }

  // Condolence operations
  async getCondolencesByMemorialId(memorialId: string): Promise<Condolence[]> {
    return await db.select().from(condolences).where(eq(condolences.memorialId, memorialId)).orderBy(desc(condolences.createdAt));
  }

  async createCondolence(condolence: InsertCondolence): Promise<Condolence> {
    const [created] = await db.insert(condolences).values(condolence).returning();
    return created;
  }

  // Memorial Like operations
  async getMemorialLikes(memorialId: string): Promise<MemorialLike[]> {
    return await db.select().from(memorialLikes).where(eq(memorialLikes.memorialId, memorialId)).orderBy(desc(memorialLikes.createdAt));
  }

  async createMemorialLike(like: InsertMemorialLike): Promise<MemorialLike> {
    const [created] = await db.insert(memorialLikes).values(like).returning();
    return created;
  }

  async deleteMemorialLike(memorialId: string, userId?: string, userEmail?: string): Promise<void> {
    const conditions = [eq(memorialLikes.memorialId, memorialId)];
    if (userId) {
      conditions.push(eq(memorialLikes.userId, userId));
    } else if (userEmail) {
      conditions.push(eq(memorialLikes.userEmail, userEmail));
    }
    await db.delete(memorialLikes).where(and(...conditions));
  }

  async getMemorialLikesCount(memorialId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(memorialLikes).where(eq(memorialLikes.memorialId, memorialId));
    return result[0]?.count || 0;
  }

  // Memorial Comment operations
  async getMemorialComments(memorialId: string): Promise<MemorialComment[]> {
    return await db.select().from(memorialComments).where(eq(memorialComments.memorialId, memorialId)).orderBy(desc(memorialComments.createdAt));
  }

  async createMemorialComment(comment: InsertMemorialComment): Promise<MemorialComment> {
    const [created] = await db.insert(memorialComments).values(comment).returning();
    return created;
  }

  async deleteMemorialComment(id: string): Promise<void> {
    await db.delete(memorialComments).where(eq(memorialComments.id, id));
  }

  // Saved Memorial operations
  async getSavedMemorials(userId: string): Promise<SavedMemorial[]> {
    return await db.select().from(savedMemorials).where(eq(savedMemorials.userId, userId)).orderBy(desc(savedMemorials.createdAt));
  }

  async getSavedMemorial(userId: string, memorialId: string): Promise<SavedMemorial | undefined> {
    const [saved] = await db.select().from(savedMemorials)
      .where(and(eq(savedMemorials.userId, userId), eq(savedMemorials.memorialId, memorialId)));
    return saved;
  }

  async createSavedMemorial(savedMemorial: InsertSavedMemorial): Promise<SavedMemorial> {
    const [created] = await db.insert(savedMemorials).values(savedMemorial).returning();
    return created;
  }

  async deleteSavedMemorial(userId: string, memorialId: string): Promise<void> {
    await db.delete(savedMemorials)
      .where(and(eq(savedMemorials.userId, userId), eq(savedMemorials.memorialId, memorialId)));
  }

  async updateSavedMemorial(id: string, data: Partial<InsertSavedMemorial>): Promise<SavedMemorial | undefined> {
    const [updated] = await db.update(savedMemorials)
      .set(data)
      .where(eq(savedMemorials.id, id))
      .returning();
    return updated;
  }

  // Memorial Live Stream operations
  async getMemorialLiveStreams(memorialId: string): Promise<MemorialLiveStream[]> {
    return await db.select().from(memorialLiveStreams).where(eq(memorialLiveStreams.memorialId, memorialId)).orderBy(desc(memorialLiveStreams.scheduledStartTime));
  }

  async getMemorialLiveStream(id: string): Promise<MemorialLiveStream | undefined> {
    const [stream] = await db.select().from(memorialLiveStreams).where(eq(memorialLiveStreams.id, id));
    return stream || undefined;
  }

  async createMemorialLiveStream(stream: InsertMemorialLiveStream): Promise<MemorialLiveStream> {
    const [created] = await db.insert(memorialLiveStreams).values(stream).returning();
    return created;
  }

  async updateMemorialLiveStream(id: string, stream: Partial<InsertMemorialLiveStream>): Promise<MemorialLiveStream | undefined> {
    const [updated] = await db.update(memorialLiveStreams).set(stream).where(eq(memorialLiveStreams.id, id)).returning();
    return updated || undefined;
  }

  async deleteMemorialLiveStream(id: string): Promise<void> {
    await db.delete(memorialLiveStreams).where(eq(memorialLiveStreams.id, id));
  }

  // Memorial Live Stream Viewer operations
  async getLiveStreamViewers(streamId: string): Promise<MemorialLiveStreamViewer[]> {
    return await db.select().from(memorialLiveStreamViewers).where(eq(memorialLiveStreamViewers.streamId, streamId)).orderBy(desc(memorialLiveStreamViewers.joinedAt));
  }

  async createLiveStreamViewer(viewer: InsertMemorialLiveStreamViewer): Promise<MemorialLiveStreamViewer> {
    const [created] = await db.insert(memorialLiveStreamViewers).values(viewer).returning();
    return created;
  }

  async updateLiveStreamViewer(id: string, leftAt: Date, durationMinutes: number): Promise<void> {
    await db.update(memorialLiveStreamViewers).set({ leftAt, durationMinutes }).where(eq(memorialLiveStreamViewers.id, id));
  }

  // Memorial Documentary operations
  async getMemorialDocumentaries(memorialId: string): Promise<MemorialDocumentary[]> {
    return await db.select().from(memorialDocumentaries).where(eq(memorialDocumentaries.memorialId, memorialId)).orderBy(desc(memorialDocumentaries.createdAt));
  }

  async getMemorialDocumentary(id: string): Promise<MemorialDocumentary | undefined> {
    const [documentary] = await db.select().from(memorialDocumentaries).where(eq(memorialDocumentaries.id, id));
    return documentary || undefined;
  }

  async createMemorialDocumentary(documentary: InsertMemorialDocumentary): Promise<MemorialDocumentary> {
    const [created] = await db.insert(memorialDocumentaries).values(documentary as any).returning();
    return created;
  }

  async updateMemorialDocumentary(id: string, documentary: Partial<InsertMemorialDocumentary>): Promise<MemorialDocumentary | undefined> {
    const [updated] = await db.update(memorialDocumentaries).set(documentary as any).where(eq(memorialDocumentaries.id, id)).returning();
    return updated || undefined;
  }

  async deleteMemorialDocumentary(id: string): Promise<void> {
    await db.delete(memorialDocumentaries).where(eq(memorialDocumentaries.id, id));
  }

  async incrementDocumentaryViewCount(id: string): Promise<void> {
    await db.update(memorialDocumentaries)
      .set({ viewCount: sql`${memorialDocumentaries.viewCount} + 1` })
      .where(eq(memorialDocumentaries.id, id));
  }

  // Scheduled Message operations
  async getScheduledMessagesByMemorialId(memorialId: string): Promise<ScheduledMessage[]> {
    return await db.select().from(scheduledMessages).where(eq(scheduledMessages.memorialId, memorialId)).orderBy(desc(scheduledMessages.createdAt));
  }

  async getScheduledMessage(id: string): Promise<ScheduledMessage | undefined> {
    const [message] = await db.select().from(scheduledMessages).where(eq(scheduledMessages.id, id));
    return message || undefined;
  }

  async createScheduledMessage(message: InsertScheduledMessage): Promise<ScheduledMessage> {
    const [created] = await db.insert(scheduledMessages).values(message).returning();
    return created;
  }

  async updateScheduledMessage(id: string, message: Partial<InsertScheduledMessage>): Promise<ScheduledMessage | undefined> {
    const [updated] = await db.update(scheduledMessages).set(message).where(eq(scheduledMessages.id, id)).returning();
    return updated || undefined;
  }

  async deleteScheduledMessage(id: string): Promise<void> {
    await db.delete(scheduledMessages).where(eq(scheduledMessages.id, id));
  }

  // Fundraiser operations
  async getFundraisersByMemorialId(memorialId: string): Promise<Fundraiser[]> {
    return await db.select().from(fundraisers).where(eq(fundraisers.memorialId, memorialId)).orderBy(desc(fundraisers.createdAt));
  }

  async getFundraiser(id: string): Promise<Fundraiser | undefined> {
    const [fundraiser] = await db.select().from(fundraisers).where(eq(fundraisers.id, id));
    return fundraiser || undefined;
  }

  async createFundraiser(fundraiserData: InsertFundraiser): Promise<Fundraiser> {
    const [created] = await db.insert(fundraisers).values(fundraiserData as any).returning();
    return created;
  }

  // Donation operations
  async getDonationsByFundraiserId(fundraiserId: string, limit: number = 50, offset: number = 0): Promise<Donation[]> {
    const effectiveLimit = Math.min(limit, 200);
    return await db.select().from(donations).where(eq(donations.fundraiserId, fundraiserId)).orderBy(desc(donations.createdAt)).limit(effectiveLimit).offset(offset);
  }

  async getDonationsByFundraiserIdCount(fundraiserId: string): Promise<number> {
    const [result] = await db.select({ count: count() }).from(donations).where(eq(donations.fundraiserId, fundraiserId));
    return result.count;
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    // Get fundraiser to retrieve platform fee percentage
    const fundraiser = await this.getFundraiser(donation.fundraiserId);
    if (!fundraiser) {
      throw new Error("Fundraiser not found");
    }

    // Calculate platform fee amount
    const donationAmount = Number(donation.amount);
    const platformFeePercentage = Number(fundraiser.platformFeePercentage);
    const platformFeeAmount = (donationAmount * platformFeePercentage / 100).toFixed(2);

    // Insert donation with calculated platform fee
    const [created] = await db.insert(donations).values({
      ...donation,
      platformFeeAmount,
    }).returning();
    
    // Update fundraiser current amount - cast to numeric to ensure proper addition
    await db.execute(sql`
      UPDATE fundraisers 
      SET current_amount = current_amount + CAST(${donation.amount} AS NUMERIC)
      WHERE id = ${donation.fundraiserId}
    `);
    
    return created;
  }

  // Celebrity Memorial operations
  async listCelebrityMemorials(limit: number = 50, offset: number = 0): Promise<CelebrityMemorial[]> {
    const effectiveLimit = Math.min(limit, 200);
    return await db.select().from(celebrityMemorials).orderBy(desc(celebrityMemorials.createdAt)).limit(effectiveLimit).offset(offset);
  }

  async getCelebrityMemorialsCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(celebrityMemorials);
    return result.count;
  }

  async getCelebrityMemorial(id: string): Promise<CelebrityMemorial | undefined> {
    const [memorial] = await db.select().from(celebrityMemorials).where(eq(celebrityMemorials.id, id));
    return memorial || undefined;
  }

  async createCelebrityMemorial(memorial: InsertCelebrityMemorial): Promise<CelebrityMemorial> {
    const [created] = await db.insert(celebrityMemorials).values({
      ...memorial,
      achievements: memorial.achievements as any,
      awards: memorial.awards as any,
      verificationDocuments: memorial.verificationDocuments as any,
      customStickers: memorial.customStickers as any,
      themeColors: memorial.themeColors as any,
    }).returning();
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

  // Celebrity Fan Content operations (exclusive videos/photos from estates)
  async listCelebrityFanContent(celebrityMemorialId: string): Promise<CelebrityFanContent[]> {
    return await db.select()
      .from(celebrityFanContent)
      .where(eq(celebrityFanContent.celebrityMemorialId, celebrityMemorialId))
      .orderBy(desc(celebrityFanContent.createdAt));
  }

  async getCelebrityFanContent(id: string): Promise<CelebrityFanContent | undefined> {
    const [content] = await db.select().from(celebrityFanContent).where(eq(celebrityFanContent.id, id));
    return content || undefined;
  }

  async createCelebrityFanContent(content: InsertCelebrityFanContent): Promise<CelebrityFanContent> {
    const [created] = await db.insert(celebrityFanContent).values(content).returning();
    return created;
  }

  async incrementFanContentViews(id: string): Promise<void> {
    await db.execute(sql`
      UPDATE celebrity_fan_content 
      SET view_count = view_count + 1
      WHERE id = ${id}
    `);
  }

  async publishCelebrityFanContent(id: string): Promise<void> {
    await db.update(celebrityFanContent)
      .set({ isPublished: true })
      .where(eq(celebrityFanContent.id, id));
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
  async listPrisonFacilities(limit: number = 50, offset: number = 0): Promise<PrisonFacility[]> {
    const effectiveLimit = Math.min(limit, 200);
    return await db.select().from(prisonFacilities).where(eq(prisonFacilities.isActive, true)).limit(effectiveLimit).offset(offset);
  }

  async getPrisonFacilitiesCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(prisonFacilities).where(eq(prisonFacilities.isActive, true));
    return result.count;
  }

  async createPrisonFacility(facility: InsertPrisonFacility): Promise<PrisonFacility> {
    const [created] = await db.insert(prisonFacilities).values(facility).returning();
    return created;
  }

  async createPrisonAccessRequest(request: InsertPrisonAccessRequest): Promise<PrisonAccessRequest> {
    const [created] = await db.insert(prisonAccessRequests).values(request).returning();
    return created;
  }

  async listPrisonAccessRequests(status?: string, memorialId?: string, limit: number = 50, offset: number = 0): Promise<PrisonAccessRequest[]> {
    const effectiveLimit = Math.min(limit, 200);
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

    return await query.orderBy(desc(prisonAccessRequests.createdAt)).limit(effectiveLimit).offset(offset);
  }

  async getPrisonAccessRequestsCount(status?: string, memorialId?: string): Promise<number> {
    const conditions = [];
    if (status) {
      conditions.push(eq(prisonAccessRequests.status, status));
    }
    if (memorialId) {
      conditions.push(eq(prisonAccessRequests.memorialId, memorialId));
    }

    let query = db.select({ count: count() }).from(prisonAccessRequests);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const [result] = await query;
    return result.count;
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
  async listEssentialWorkersMemorials(category?: string, limit: number = 50, offset: number = 0): Promise<EssentialWorkerMemorial[]> {
    const effectiveLimit = Math.min(limit, 200);
    const conditions = [eq(essentialWorkersMemorials.isPublic, true)];
    
    if (category && category.trim() !== "") {
      conditions.push(eq(essentialWorkersMemorials.category, category));
    }

    return await db
      .select()
      .from(essentialWorkersMemorials)
      .where(and(...conditions))
      .orderBy(desc(essentialWorkersMemorials.createdAt))
      .limit(effectiveLimit)
      .offset(offset);
  }

  async getEssentialWorkersMemorialsCount(category?: string): Promise<number> {
    const conditions = [eq(essentialWorkersMemorials.isPublic, true)];
    
    if (category && category.trim() !== "") {
      conditions.push(eq(essentialWorkersMemorials.category, category));
    }

    const [result] = await db
      .select({ count: count() })
      .from(essentialWorkersMemorials)
      .where(and(...conditions));
    return result.count;
  }

  async getEssentialWorkerMemorial(id: string): Promise<EssentialWorkerMemorial | undefined> {
    const [memorial] = await db.select().from(essentialWorkersMemorials).where(eq(essentialWorkersMemorials.id, id));
    return memorial || undefined;
  }

  async createEssentialWorkerMemorial(memorial: InsertEssentialWorkerMemorial): Promise<EssentialWorkerMemorial> {
    const [created] = await db.insert(essentialWorkersMemorials).values({
      ...memorial,
      honors: memorial.honors as any,
      deployments: memorial.deployments as any,
      certifications: memorial.certifications as any,
    }).returning();
    return created;
  }

  async updateEssentialWorkerMemorial(id: string, memorial: Partial<InsertEssentialWorkerMemorial>): Promise<EssentialWorkerMemorial | undefined> {
    const [updated] = await db.update(essentialWorkersMemorials)
      .set({
        ...memorial,
        honors: memorial.honors as any,
        deployments: memorial.deployments as any,
        certifications: memorial.certifications as any,
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
  async listAdvertisements(category?: string, limit: number = 50, offset: number = 0): Promise<Advertisement[]> {
    const effectiveLimit = Math.min(limit, 200);
    const conditions = [eq(advertisements.isActive, true)];
    
    if (category && category.trim() !== "") {
      conditions.push(eq(advertisements.category, category));
    }

    const ads = await db
      .select()
      .from(advertisements)
      .where(and(...conditions))
      .orderBy(desc(advertisements.createdAt))
      .limit(effectiveLimit)
      .offset(offset);

    const now = new Date();
    return ads.filter(ad => !ad.expiresAt || new Date(ad.expiresAt) > now);
  }

  async getAdvertisementsCount(category?: string): Promise<number> {
    const conditions = [eq(advertisements.isActive, true)];
    
    if (category && category.trim() !== "") {
      conditions.push(eq(advertisements.category, category));
    }

    const [result] = await db
      .select({ count: count() })
      .from(advertisements)
      .where(and(...conditions));
    return result.count;
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

  async updateAdvertisementStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Advertisement | undefined> {
    const [updated] = await db.update(advertisements)
      .set({ status })
      .where(eq(advertisements.id, id))
      .returning();
    return updated || undefined;
  }

  async listAdvertisementsByStatus(status?: 'pending' | 'approved' | 'rejected'): Promise<Advertisement[]> {
    if (status) {
      return await db.select().from(advertisements)
        .where(eq(advertisements.status, status))
        .orderBy(desc(advertisements.createdAt));
    }
    return await db.select().from(advertisements)
      .orderBy(desc(advertisements.createdAt));
  }

  // Advertisement Sales Tracking
  async recordSale(sale: InsertAdvertisementSale): Promise<AdvertisementSale> {
    const [recorded] = await db.insert(advertisementSales).values(sale).returning();
    
    // Update advertisement totals
    await db.update(advertisements)
      .set({
        totalSales: sql`${advertisements.totalSales} + 1`,
        totalRevenue: sql`${advertisements.totalRevenue} + ${sale.saleAmount}`,
        totalPlatformFees: sql`${advertisements.totalPlatformFees} + ${sale.platformFeeAmount}`,
      })
      .where(eq(advertisements.id, sale.advertisementId));
    
    return recorded;
  }

  async getAdvertisementSales(advertisementId: string): Promise<AdvertisementSale[]> {
    return await db
      .select()
      .from(advertisementSales)
      .where(eq(advertisementSales.advertisementId, advertisementId))
      .orderBy(desc(advertisementSales.createdAt));
  }

  async getSalesByReferralCode(referralCode: string): Promise<AdvertisementSale[]> {
    return await db
      .select()
      .from(advertisementSales)
      .where(eq(advertisementSales.referralCode, referralCode))
      .orderBy(desc(advertisementSales.createdAt));
  }

  // Funeral Home Partner operations
  async listFuneralHomePartners(isActive?: boolean, limit: number = 50, offset: number = 0): Promise<FuneralHomePartner[]> {
    const effectiveLimit = Math.min(limit, 200);
    const conditions = [];
    if (isActive !== undefined) {
      conditions.push(eq(funeralHomePartners.isActive, isActive));
    }

    const query = conditions.length > 0
      ? db.select().from(funeralHomePartners).where(and(...conditions))
      : db.select().from(funeralHomePartners);

    return await query.orderBy(desc(funeralHomePartners.createdAt)).limit(effectiveLimit).offset(offset);
  }

  async getFuneralHomePartnersCount(isActive?: boolean): Promise<number> {
    const conditions = [];
    if (isActive !== undefined) {
      conditions.push(eq(funeralHomePartners.isActive, isActive));
    }

    const query = conditions.length > 0
      ? db.select({ count: count() }).from(funeralHomePartners).where(and(...conditions))
      : db.select({ count: count() }).from(funeralHomePartners);

    const [result] = await query;
    return result.count;
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

  // Flower Shop Partnership operations
  async listFlowerShopPartners(city?: string, state?: string, limit: number = 50, offset: number = 0): Promise<FlowerShopPartner[]> {
    const effectiveLimit = Math.min(limit, 200);
    const conditions = [eq(flowerShopPartners.isActive, true)];
    
    if (city) {
      conditions.push(eq(flowerShopPartners.city, city));
    }
    if (state) {
      conditions.push(eq(flowerShopPartners.state, state));
    }

    return await db.select().from(flowerShopPartners)
      .where(and(...conditions))
      .orderBy(desc(flowerShopPartners.rating))
      .limit(effectiveLimit)
      .offset(offset);
  }

  async getFlowerShopPartnersCount(city?: string, state?: string): Promise<number> {
    const conditions = [eq(flowerShopPartners.isActive, true)];
    
    if (city) {
      conditions.push(eq(flowerShopPartners.city, city));
    }
    if (state) {
      conditions.push(eq(flowerShopPartners.state, state));
    }

    const [result] = await db.select({ count: count() }).from(flowerShopPartners)
      .where(and(...conditions));
    return result.count;
  }

  async getFlowerShopPartner(id: string): Promise<FlowerShopPartner | undefined> {
    const [partner] = await db.select().from(flowerShopPartners).where(eq(flowerShopPartners.id, id));
    return partner || undefined;
  }

  async createFlowerShopPartner(partner: InsertFlowerShopPartner): Promise<FlowerShopPartner> {
    const [created] = await db.insert(flowerShopPartners).values(partner).returning();
    return created;
  }

  async updateFlowerShopPartner(id: string, partner: Partial<InsertFlowerShopPartner>): Promise<FlowerShopPartner | undefined> {
    const [updated] = await db.update(flowerShopPartners)
      .set(partner)
      .where(eq(flowerShopPartners.id, id))
      .returning();
    return updated || undefined;
  }

  async createFlowerOrder(order: InsertFlowerOrder): Promise<FlowerOrder> {
    const [created] = await db.insert(flowerOrders).values(order).returning();
    return created;
  }

  async getFlowerOrder(id: string): Promise<FlowerOrder | undefined> {
    const [order] = await db.select().from(flowerOrders).where(eq(flowerOrders.id, id));
    return order || undefined;
  }

  async getFlowerOrdersByShopId(shopId: string): Promise<FlowerOrder[]> {
    return await db.select().from(flowerOrders)
      .where(eq(flowerOrders.shopId, shopId))
      .orderBy(desc(flowerOrders.createdAt));
  }

  async getFlowerOrdersByMemorialId(memorialId: string): Promise<FlowerOrder[]> {
    return await db.select().from(flowerOrders)
      .where(eq(flowerOrders.memorialId, memorialId))
      .orderBy(desc(flowerOrders.createdAt));
  }

  async updateFlowerOrderStatus(id: string, status: string, completedAt?: Date): Promise<FlowerOrder | undefined> {
    const updateData: any = { status };
    if (completedAt) {
      updateData.completedAt = completedAt;
    }

    const [updated] = await db.update(flowerOrders)
      .set(updateData)
      .where(eq(flowerOrders.id, id))
      .returning();
    return updated || undefined;
  }

  async createFlowerCommission(commission: InsertFlowerCommission): Promise<FlowerCommission> {
    const [created] = await db.insert(flowerCommissions).values(commission).returning();
    return created;
  }

  async getFlowerCommissionsByShopId(shopId: string): Promise<FlowerCommission[]> {
    return await db.select().from(flowerCommissions)
      .where(eq(flowerCommissions.shopId, shopId))
      .orderBy(desc(flowerCommissions.createdAt));
  }

  async updateFlowerCommissionStatus(id: string, status: string, approvedAt?: Date): Promise<FlowerCommission | undefined> {
    const updateData: any = { status };
    if (approvedAt) {
      updateData.approvedAt = approvedAt;
    }

    const [updated] = await db.update(flowerCommissions)
      .set(updateData)
      .where(eq(flowerCommissions.id, id))
      .returning();
    return updated || undefined;
  }

  async createFlowerPayout(payout: InsertFlowerPayout): Promise<FlowerPayout> {
    const [created] = await db.insert(flowerPayouts).values(payout).returning();
    return created;
  }

  async getFlowerPayoutsByShopId(shopId: string): Promise<FlowerPayout[]> {
    return await db.select().from(flowerPayouts)
      .where(eq(flowerPayouts.shopId, shopId))
      .orderBy(desc(flowerPayouts.createdAt));
  }

  async updateFlowerPayoutStatus(id: string, status: string, paidAt?: Date): Promise<FlowerPayout | undefined> {
    const updateData: any = { status };
    if (paidAt) {
      updateData.paidAt = paidAt;
    }

    const [updated] = await db.update(flowerPayouts)
      .set(updateData)
      .where(eq(flowerPayouts.id, id))
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

  // Analytics operations
  async trackPageView(pageView: InsertPageView): Promise<PageView> {
    const [created] = await db.insert(pageViews).values(pageView).returning();
    return created;
  }

  async trackEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [created] = await db.insert(analyticsEvents).values(event).returning();
    return created;
  }

  // Admin Analytics
  async getAdminStats(): Promise<any> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Users stats
    const [totalUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [newUsersToday] = await db.select({ count: sql<number>`count(*)::int` }).from(users)
      .where(sql`${users.createdAt} >= ${today}`);
    const [newUsersWeek] = await db.select({ count: sql<number>`count(*)::int` }).from(users)
      .where(sql`${users.createdAt} >= ${weekAgo}`);
    const [newUsersMonth] = await db.select({ count: sql<number>`count(*)::int` }).from(users)
      .where(sql`${users.createdAt} >= ${monthAgo}`);

    // Memorials stats
    const [totalMemorials] = await db.select({ count: sql<number>`count(*)::int` }).from(memorials);
    const [publicMemorials] = await db.select({ count: sql<number>`count(*)::int` }).from(memorials)
      .where(eq(memorials.isPublic, true));
    const [privateMemorials] = await db.select({ count: sql<number>`count(*)::int` }).from(memorials)
      .where(eq(memorials.isPublic, false));
    const [memorialsWeek] = await db.select({ count: sql<number>`count(*)::int` }).from(memorials)
      .where(sql`${memorials.createdAt} >= ${weekAgo}`);

    // Memories stats
    const [totalMemories] = await db.select({ count: sql<number>`count(*)::int` }).from(memories);
    const [approvedMemories] = await db.select({ count: sql<number>`count(*)::int` }).from(memories)
      .where(eq(memories.isApproved, true));
    const [pendingMemories] = await db.select({ count: sql<number>`count(*)::int` }).from(memories)
      .where(eq(memories.isApproved, false));
    const [memoriesWeek] = await db.select({ count: sql<number>`count(*)::int` }).from(memories)
      .where(sql`${memories.createdAt} >= ${weekAgo}`);

    // Fundraisers stats
    const [totalFundraisers] = await db.select({ count: sql<number>`count(*)::int` }).from(fundraisers);
    const [activeFundraisers] = await db.select({ count: sql<number>`count(*)::int` }).from(fundraisers)
      .where(sql`${fundraisers.currentAmount} < ${fundraisers.goalAmount}`);
    const [totalRaised] = await db.select({ 
      total: sql<number>`COALESCE(sum(${fundraisers.currentAmount})::numeric, 0)` 
    }).from(fundraisers);
    const [avgGoal] = await db.select({ 
      avg: sql<number>`COALESCE(avg(${fundraisers.goalAmount})::numeric, 0)` 
    }).from(fundraisers);

    // Donations stats
    const [totalDonations] = await db.select({ count: sql<number>`count(*)::int` }).from(donations);
    const [totalAmount] = await db.select({ 
      total: sql<number>`COALESCE(sum(${donations.amount})::numeric, 0)` 
    }).from(donations);
    const [avgDonation] = await db.select({ 
      avg: sql<number>`COALESCE(avg(${donations.amount})::numeric, 0)` 
    }).from(donations);
    const [donationsWeek] = await db.select({ count: sql<number>`count(*)::int` }).from(donations)
      .where(sql`${donations.createdAt} >= ${weekAgo}`);

    // Platform Revenue - Total platform fees from fundraiser donations
    const [platformRevenue] = await db.select({ 
      total: sql<number>`COALESCE(sum(${donations.platformFeeAmount})::numeric, 0)` 
    }).from(donations);

    // Page views stats (using raw SQL since pageViews table might not be in schema types yet)
    let pageViewsStats = {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    };
    
    try {
      const totalViews = await db.execute(sql`SELECT COUNT(*)::int as count FROM page_views`);
      const viewsToday = await db.execute(sql`SELECT COUNT(*)::int as count FROM page_views WHERE created_at >= ${today}`);
      const viewsWeek = await db.execute(sql`SELECT COUNT(*)::int as count FROM page_views WHERE created_at >= ${weekAgo}`);
      const viewsMonth = await db.execute(sql`SELECT COUNT(*)::int as count FROM page_views WHERE created_at >= ${monthAgo}`);
      
      pageViewsStats = {
        total: (totalViews.rows[0] as any)?.count || 0,
        today: (viewsToday.rows[0] as any)?.count || 0,
        thisWeek: (viewsWeek.rows[0] as any)?.count || 0,
        thisMonth: (viewsMonth.rows[0] as any)?.count || 0,
      };
    } catch (error) {
      console.log("Page views table not yet populated");
    }

    // Top pages
    let topPages: Array<{ path: string; views: number }> = [];
    try {
      const topPagesResult = await db.execute(sql`
        SELECT path, COUNT(*)::int as views 
        FROM page_views 
        WHERE created_at >= ${weekAgo}
        GROUP BY path 
        ORDER BY views DESC 
        LIMIT 5
      `);
      topPages = topPagesResult.rows.map((row: any) => ({
        path: row.path,
        views: row.views,
      }));
    } catch (error) {
      console.log("Page views table not yet populated");
    }

    // Analytics Events stats
    let analyticsStats = {
      totalViews: 0,
      totalShares: 0,
      totalSaves: 0,
      viewsThisWeek: 0,
      sharesThisWeek: 0,
      savesThisWeek: 0,
    };

    try {
      const viewEvents = await db.execute(sql`SELECT COUNT(*)::int as count FROM analytics_events WHERE event_type = 'memorial_view'`);
      const shareEvents = await db.execute(sql`SELECT COUNT(*)::int as count FROM analytics_events WHERE event_type = 'memorial_share'`);
      const saveEvents = await db.execute(sql`SELECT COUNT(*)::int as count FROM analytics_events WHERE event_type = 'memorial_save'`);
      
      const viewEventsWeek = await db.execute(sql`SELECT COUNT(*)::int as count FROM analytics_events WHERE event_type = 'memorial_view' AND created_at >= ${weekAgo}`);
      const shareEventsWeek = await db.execute(sql`SELECT COUNT(*)::int as count FROM analytics_events WHERE event_type = 'memorial_share' AND created_at >= ${weekAgo}`);
      const saveEventsWeek = await db.execute(sql`SELECT COUNT(*)::int as count FROM analytics_events WHERE event_type = 'memorial_save' AND created_at >= ${weekAgo}`);

      analyticsStats = {
        totalViews: (viewEvents.rows[0] as any)?.count || 0,
        totalShares: (shareEvents.rows[0] as any)?.count || 0,
        totalSaves: (saveEvents.rows[0] as any)?.count || 0,
        viewsThisWeek: (viewEventsWeek.rows[0] as any)?.count || 0,
        sharesThisWeek: (shareEventsWeek.rows[0] as any)?.count || 0,
        savesThisWeek: (saveEventsWeek.rows[0] as any)?.count || 0,
      };
    } catch (error) {
      console.log("Analytics events table not yet populated");
    }

    // Top memorials by engagement
    let topMemorials: Array<{ memorialId: string; views: number; shares: number; saves: number }> = [];
    try {
      const topMemorialsResult = await db.execute(sql`
        SELECT 
          memorial_id,
          COUNT(CASE WHEN event_type = 'memorial_view' THEN 1 END)::int as views,
          COUNT(CASE WHEN event_type = 'memorial_share' THEN 1 END)::int as shares,
          COUNT(CASE WHEN event_type = 'memorial_save' THEN 1 END)::int as saves
        FROM analytics_events 
        WHERE memorial_id IS NOT NULL AND created_at >= ${weekAgo}
        GROUP BY memorial_id 
        ORDER BY views DESC 
        LIMIT 10
      `);
      topMemorials = topMemorialsResult.rows.map((row: any) => ({
        memorialId: row.memorial_id,
        views: row.views || 0,
        shares: row.shares || 0,
        saves: row.saves || 0,
      }));
    } catch (error) {
      console.log("Analytics events table not yet populated");
    }

    // Support statistics
    let supportStats = {
      totalArticles: 0,
      totalResources: 0,
      totalRequests: 0,
      pendingRequests: 0,
      resolvedRequests: 0,
      requestsThisWeek: 0,
      totalArticleViews: 0,
      partnerRequests: 0,
      partnerPendingRequests: 0,
    };

    try {
      const [totalArticles] = await db.select({ count: sql<number>`count(*)::int` }).from(supportArticles);
      const [totalResources] = await db.select({ count: sql<number>`count(*)::int` }).from(griefResources);
      const [totalRequests] = await db.select({ count: sql<number>`count(*)::int` }).from(supportRequests);
      const [pendingRequests] = await db.select({ count: sql<number>`count(*)::int` }).from(supportRequests)
        .where(eq(supportRequests.status, 'open'));
      const [resolvedRequests] = await db.select({ count: sql<number>`count(*)::int` }).from(supportRequests)
        .where(eq(supportRequests.status, 'resolved'));
      const [requestsWeek] = await db.select({ count: sql<number>`count(*)::int` }).from(supportRequests)
        .where(sql`${supportRequests.createdAt} >= ${weekAgo}`);
      const [partnerRequests] = await db.select({ count: sql<number>`count(*)::int` }).from(supportRequests)
        .where(eq(supportRequests.isPartnerRequest, true));
      const [partnerPending] = await db.select({ count: sql<number>`count(*)::int` }).from(supportRequests)
        .where(and(eq(supportRequests.isPartnerRequest, true), eq(supportRequests.status, 'open')));
      const [totalViews] = await db.select({ 
        total: sql<number>`COALESCE(sum(${supportArticles.viewCount})::numeric, 0)` 
      }).from(supportArticles);

      supportStats = {
        totalArticles: totalArticles.count || 0,
        totalResources: totalResources.count || 0,
        totalRequests: totalRequests.count || 0,
        pendingRequests: pendingRequests.count || 0,
        resolvedRequests: resolvedRequests.count || 0,
        requestsThisWeek: requestsWeek.count || 0,
        totalArticleViews: totalViews.total || 0,
        partnerRequests: partnerRequests.count || 0,
        partnerPendingRequests: partnerPending.count || 0,
      };
    } catch (error) {
      console.log("Support tables not yet populated");
    }

    // Partner stats - Funeral Homes
    let funeralHomeStats = {
      total: 0,
      active: 0,
      newThisWeek: 0,
      newThisMonth: 0,
      totalReferrals: 0,
      totalCommissions: 0,
      pendingPayouts: 0,
    };

    try {
      const [totalFuneralHomes] = await db.select({ count: sql<number>`count(*)::int` }).from(funeralHomePartners);
      const [activeFuneralHomes] = await db.select({ count: sql<number>`count(*)::int` }).from(funeralHomePartners)
        .where(eq(funeralHomePartners.isActive, true));
      const [newFuneralHomesWeek] = await db.select({ count: sql<number>`count(*)::int` }).from(funeralHomePartners)
        .where(sql`${funeralHomePartners.createdAt} >= ${weekAgo}`);
      const [newFuneralHomesMonth] = await db.select({ count: sql<number>`count(*)::int` }).from(funeralHomePartners)
        .where(sql`${funeralHomePartners.createdAt} >= ${monthAgo}`);
      
      const [totalReferrals] = await db.select({ count: sql<number>`count(*)::int` }).from(partnerReferrals);
      const [totalCommissions] = await db.select({ 
        total: sql<number>`COALESCE(sum(${partnerCommissions.commissionAmount})::numeric, 0)` 
      }).from(partnerCommissions);
      const [pendingPayouts] = await db.select({ 
        total: sql<number>`COALESCE(sum(${partnerPayouts.amount})::numeric, 0)` 
      }).from(partnerPayouts)
        .where(eq(partnerPayouts.status, 'pending'));

      funeralHomeStats = {
        total: totalFuneralHomes.count || 0,
        active: activeFuneralHomes.count || 0,
        newThisWeek: newFuneralHomesWeek.count || 0,
        newThisMonth: newFuneralHomesMonth.count || 0,
        totalReferrals: totalReferrals.count || 0,
        totalCommissions: totalCommissions.total || 0,
        pendingPayouts: pendingPayouts.total || 0,
      };
    } catch (error) {
      console.log("Funeral home partner tables not yet populated");
    }

    // Partner stats - Flower Shops
    let flowerShopStats = {
      total: 0,
      active: 0,
      newThisWeek: 0,
      newThisMonth: 0,
      totalOrders: 0,
      totalCommissions: 0,
      pendingPayouts: 0,
    };

    try {
      const [totalFlowerShops] = await db.select({ count: sql<number>`count(*)::int` }).from(flowerShopPartners);
      const [activeFlowerShops] = await db.select({ count: sql<number>`count(*)::int` }).from(flowerShopPartners)
        .where(eq(flowerShopPartners.isActive, true));
      const [newFlowerShopsWeek] = await db.select({ count: sql<number>`count(*)::int` }).from(flowerShopPartners)
        .where(sql`${flowerShopPartners.createdAt} >= ${weekAgo}`);
      const [newFlowerShopsMonth] = await db.select({ count: sql<number>`count(*)::int` }).from(flowerShopPartners)
        .where(sql`${flowerShopPartners.createdAt} >= ${monthAgo}`);
      
      const [totalOrders] = await db.select({ count: sql<number>`count(*)::int` }).from(flowerOrders);
      const [totalCommissions] = await db.select({ 
        total: sql<number>`COALESCE(sum(${flowerCommissions.commissionAmount})::numeric, 0)` 
      }).from(flowerCommissions);
      const [pendingPayouts] = await db.select({ 
        total: sql<number>`COALESCE(sum(${flowerPayouts.amount})::numeric, 0)` 
      }).from(flowerPayouts)
        .where(eq(flowerPayouts.status, 'pending'));

      flowerShopStats = {
        total: totalFlowerShops.count || 0,
        active: activeFlowerShops.count || 0,
        newThisWeek: newFlowerShopsWeek.count || 0,
        newThisMonth: newFlowerShopsMonth.count || 0,
        totalOrders: totalOrders.count || 0,
        totalCommissions: totalCommissions.total || 0,
        pendingPayouts: pendingPayouts.total || 0,
      };
    } catch (error) {
      console.log("Flower shop partner tables not yet populated");
    }

    return {
      users: {
        total: totalUsers.count || 0,
        newToday: newUsersToday.count || 0,
        newThisWeek: newUsersWeek.count || 0,
        newThisMonth: newUsersMonth.count || 0,
      },
      memorials: {
        total: totalMemorials.count || 0,
        public: publicMemorials.count || 0,
        private: privateMemorials.count || 0,
        createdThisWeek: memorialsWeek.count || 0,
      },
      memories: {
        total: totalMemories.count || 0,
        approved: approvedMemories.count || 0,
        pending: pendingMemories.count || 0,
        createdThisWeek: memoriesWeek.count || 0,
      },
      fundraisers: {
        total: totalFundraisers.count || 0,
        active: activeFundraisers.count || 0,
        totalRaised: totalRaised.total || 0,
        averageGoal: avgGoal.avg || 0,
      },
      donations: {
        total: totalDonations.count || 0,
        totalAmount: totalAmount.total || 0,
        averageDonation: avgDonation.avg || 0,
        thisWeek: donationsWeek.count || 0,
      },
      platformRevenue: {
        total: platformRevenue.total || 0,
      },
      pageViews: pageViewsStats,
      topPages,
      analytics: analyticsStats,
      topMemorials,
      support: supportStats,
      partners: {
        funeralHomes: funeralHomeStats,
        flowerShops: flowerShopStats,
      },
    };
  }

  async getRecentUsers(days: number): Promise<User[]> {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const recentUsers = await db.select().from(users)
      .where(sql`${users.createdAt} >= ${daysAgo}`)
      .orderBy(desc(users.createdAt));
    
    return recentUsers;
  }

  // Support Article operations
  async getSupportArticles(category?: string): Promise<SupportArticle[]> {
    const conditions = [eq(supportArticles.isPublished, true)];
    if (category) {
      conditions.push(eq(supportArticles.category, category));
    }
    const results = await db.select().from(supportArticles).where(and(...conditions)).orderBy(supportArticles.sortOrder, supportArticles.createdAt);
    return results;
  }

  async getSupportArticle(id: string): Promise<SupportArticle | undefined> {
    const [article] = await db.select().from(supportArticles).where(eq(supportArticles.id, id));
    return article || undefined;
  }

  async createSupportArticle(article: InsertSupportArticle): Promise<SupportArticle> {
    const [created] = await db.insert(supportArticles).values(article).returning();
    return created;
  }

  async updateSupportArticle(id: string, article: Partial<InsertSupportArticle>): Promise<SupportArticle | undefined> {
    const [updated] = await db.update(supportArticles).set({ ...article, updatedAt: new Date() }).where(eq(supportArticles.id, id)).returning();
    return updated || undefined;
  }

  async deleteSupportArticle(id: string): Promise<void> {
    await db.delete(supportArticles).where(eq(supportArticles.id, id));
  }

  async incrementArticleView(id: string): Promise<void> {
    await db.update(supportArticles).set({ viewCount: sql`${supportArticles.viewCount} + 1` }).where(eq(supportArticles.id, id));
  }

  async incrementArticleHelpful(id: string): Promise<void> {
    await db.update(supportArticles).set({ helpfulCount: sql`${supportArticles.helpfulCount} + 1` }).where(eq(supportArticles.id, id));
  }

  // Support Request operations
  async getSupportRequests(status?: string): Promise<SupportRequest[]> {
    let query = db.select().from(supportRequests);
    if (status) {
      query = query.where(eq(supportRequests.status, status)) as any;
    }
    const results = await query.orderBy(desc(supportRequests.createdAt));
    return results;
  }

  async getSupportRequest(id: string): Promise<SupportRequest | undefined> {
    const [request] = await db.select().from(supportRequests).where(eq(supportRequests.id, id));
    return request || undefined;
  }

  async createSupportRequest(request: InsertSupportRequest): Promise<SupportRequest> {
    const [created] = await db.insert(supportRequests).values(request).returning();
    return created;
  }

  async updateSupportRequest(id: string, request: Partial<InsertSupportRequest>): Promise<SupportRequest | undefined> {
    const [updated] = await db.update(supportRequests).set({ ...request, updatedAt: new Date() }).where(eq(supportRequests.id, id)).returning();
    return updated || undefined;
  }

  async resolveSupportRequest(id: string, resolution: string): Promise<SupportRequest | undefined> {
    const [updated] = await db.update(supportRequests).set({ 
      status: 'resolved', 
      resolution, 
      resolvedAt: new Date(),
      updatedAt: new Date()
    }).where(eq(supportRequests.id, id)).returning();
    return updated || undefined;
  }

  // Grief Resource operations
  async getGriefResources(category?: string): Promise<GriefResource[]> {
    const conditions = [eq(griefResources.isVerified, true)];
    if (category) {
      conditions.push(eq(griefResources.category, category));
    }
    const results = await db.select().from(griefResources).where(and(...conditions)).orderBy(desc(griefResources.isEmergency), desc(griefResources.sortOrder));
    return results;
  }

  async getGriefResource(id: string): Promise<GriefResource | undefined> {
    const [resource] = await db.select().from(griefResources).where(eq(griefResources.id, id));
    return resource || undefined;
  }

  async createGriefResource(resource: InsertGriefResource): Promise<GriefResource> {
    const [created] = await db.insert(griefResources).values(resource).returning();
    return created;
  }

  async updateGriefResource(id: string, resource: Partial<InsertGriefResource>): Promise<GriefResource | undefined> {
    const [updated] = await db.update(griefResources).set(resource).where(eq(griefResources.id, id)).returning();
    return updated || undefined;
  }

  async deleteGriefResource(id: string): Promise<void> {
    await db.delete(griefResources).where(eq(griefResources.id, id));
  }

  // Memorial Events operations
  async listMemorialEvents(memorialId?: string, limit: number = 50, offset: number = 0): Promise<MemorialEvent[]> {
    const effectiveLimit = Math.min(limit, 200);
    
    if (memorialId) {
      return await db.select().from(memorialEvents)
        .where(eq(memorialEvents.memorialId, memorialId))
        .orderBy(desc(memorialEvents.eventDate))
        .limit(effectiveLimit)
        .offset(offset);
    }
    
    return await db.select().from(memorialEvents)
      .orderBy(desc(memorialEvents.eventDate))
      .limit(effectiveLimit)
      .offset(offset);
  }

  async getMemorialEventsCount(memorialId?: string): Promise<number> {
    if (memorialId) {
      const [result] = await db.select({ count: count() })
        .from(memorialEvents)
        .where(eq(memorialEvents.memorialId, memorialId));
      return result.count;
    }
    
    const [result] = await db.select({ count: count() }).from(memorialEvents);
    return result.count;
  }

  async getMemorialEvent(id: string): Promise<MemorialEvent | undefined> {
    const [event] = await db.select().from(memorialEvents).where(eq(memorialEvents.id, id));
    return event || undefined;
  }

  async createMemorialEvent(event: InsertMemorialEvent): Promise<MemorialEvent> {
    const [created] = await db.insert(memorialEvents).values(event).returning();
    return created;
  }

  async updateMemorialEvent(id: string, event: Partial<InsertMemorialEvent>): Promise<MemorialEvent | undefined> {
    const [updated] = await db.update(memorialEvents).set(event).where(eq(memorialEvents.id, id)).returning();
    return updated || undefined;
  }

  async deleteMemorialEvent(id: string): Promise<void> {
    await db.delete(memorialEvents).where(eq(memorialEvents.id, id));
  }

  // Memorial Event RSVP operations
  async listEventRsvps(eventId: string): Promise<MemorialEventRsvp[]> {
    return await db.select().from(memorialEventRsvps)
      .where(eq(memorialEventRsvps.eventId, eventId))
      .orderBy(desc(memorialEventRsvps.createdAt));
  }

  async getEventRsvp(id: string): Promise<MemorialEventRsvp | undefined> {
    const [rsvp] = await db.select().from(memorialEventRsvps).where(eq(memorialEventRsvps.id, id));
    return rsvp || undefined;
  }

  async createEventRsvp(rsvp: InsertMemorialEventRsvp): Promise<MemorialEventRsvp> {
    const [created] = await db.insert(memorialEventRsvps).values(rsvp).returning();
    return created;
  }

  async updateEventRsvp(id: string, rsvp: Partial<InsertMemorialEventRsvp>): Promise<MemorialEventRsvp | undefined> {
    const [updated] = await db.update(memorialEventRsvps).set(rsvp).where(eq(memorialEventRsvps.id, id)).returning();
    return updated || undefined;
  }

  async deleteEventRsvp(id: string): Promise<void> {
    await db.delete(memorialEventRsvps).where(eq(memorialEventRsvps.id, id));
  }

  // Funeral Program operations
  async getFuneralProgramByMemorialId(memorialId: string): Promise<FuneralProgram | undefined> {
    const [program] = await db.select().from(funeralPrograms).where(eq(funeralPrograms.memorialId, memorialId));
    return program || undefined;
  }

  async createFuneralProgram(program: InsertFuneralProgram): Promise<FuneralProgram> {
    const [created] = await db.insert(funeralPrograms).values(program).returning();
    return created;
  }

  async updateFuneralProgram(memorialId: string, program: Partial<InsertFuneralProgram>): Promise<FuneralProgram | undefined> {
    const [updated] = await db.update(funeralPrograms)
      .set({ ...program, updatedAt: new Date() })
      .where(eq(funeralPrograms.memorialId, memorialId))
      .returning();
    return updated || undefined;
  }

  async deleteFuneralProgram(memorialId: string): Promise<void> {
    await db.delete(funeralPrograms).where(eq(funeralPrograms.memorialId, memorialId));
  }

  // Program Items operations
  async getProgramItems(programId: string): Promise<ProgramItem[]> {
    return await db.select().from(programItems)
      .where(eq(programItems.programId, programId))
      .orderBy(programItems.orderIndex);
  }

  async createProgramItem(item: InsertProgramItem): Promise<ProgramItem> {
    const [created] = await db.insert(programItems).values(item).returning();
    return created;
  }

  async updateProgramItem(id: string, item: Partial<InsertProgramItem>): Promise<ProgramItem | undefined> {
    const [updated] = await db.update(programItems).set(item).where(eq(programItems.id, id)).returning();
    return updated || undefined;
  }

  async deleteProgramItem(id: string): Promise<void> {
    await db.delete(programItems).where(eq(programItems.id, id));
  }
}

export const storage = new DatabaseStorage();
