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
}

export const storage = new DatabaseStorage();
