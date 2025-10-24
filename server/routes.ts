import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { ZodError } from "zod";
import { z } from "zod";

// User profile update schema - only allow specific fields
const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).strict(); // Reject any extra fields
import Stripe from "stripe";
import { 
  insertMemorialSchema, 
  insertMemorySchema, 
  insertCondolenceSchema,
  insertScheduledMessageSchema,
  insertFundraiserSchema,
  insertDonationSchema,
  insertCelebrityMemorialSchema,
  insertCelebrityDonationSchema,
  insertGriefSupportSchema,
  insertLegacyEventSchema,
  insertMusicPlaylistSchema,
  insertEssentialWorkerMemorialSchema,
  insertSelfWrittenObituarySchema,
  insertAdvertisementSchema,
  insertAdvertisementSaleSchema,
  insertFuneralHomePartnerSchema,
  insertPartnerReferralSchema,
  insertPartnerCommissionSchema,
  insertPartnerPayoutSchema,
  insertPrisonFacilitySchema,
  insertPrisonAccessRequestSchema,
  insertPrisonVerificationSchema,
  insertPrisonPaymentSchema,
  insertPrisonAccessSessionSchema,
  insertPrisonAuditLogSchema,
  insertPushTokenSchema,
  insertMemorialAdminSchema,
  insertQRCodeSchema,
  insertPageViewSchema,
  type QRCode,
} from "@shared/schema";

const inviteCodeSchema = z.object({
  inviteCode: z.string().min(1, "Invite code is required"),
});

// QR Code media validation schemas
const qrCodeMediaSchema = z.object({
  purpose: z.string().optional(),
  issuedToEmail: z.string().email().optional().or(z.literal('')),
  title: z.string().optional(),
  description: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  mediaType: z.enum(['video', 'image', 'message', 'mixed']).optional(),
});

const qrCodeMediaUpdateSchema = qrCodeMediaSchema.partial();

// Lazy-load Stripe only when needed to avoid boot crashes if not configured
let stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate and whitelist only allowed fields
      const validatedData = updateProfileSchema.parse(req.body);
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        ...validatedData,
      });
      
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get user's memorials
  app.get('/api/user/memorials', isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const memorials = await storage.getMemorialsByCreatorEmail(userEmail);
      res.json(memorials);
    } catch (error) {
      console.error("Error fetching user memorials:", error);
      res.status(500).json({ message: "Failed to fetch memorials" });
    }
  });

  // Memorial routes
  app.get("/api/memorials", async (req, res) => {
    try {
      const memorials = await storage.listMemorials();
      res.json(memorials);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/memorials/:id", async (req, res) => {
    try {
      const memorial = await storage.getMemorial(req.params.id);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      res.json(memorial);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/validate-code", async (req, res) => {
    try {
      const { inviteCode } = inviteCodeSchema.parse(req.body);
      const memorial = await storage.getMemorialByInviteCode(inviteCode);
      if (!memorial) {
        return res.status(404).json({ error: "Invalid invite code" });
      }
      res.json(memorial);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials", async (req, res) => {
    try {
      const { referralCode, ...memorialData } = req.body;
      const data = insertMemorialSchema.parse(memorialData);
      const memorial = await storage.createMemorial(data);

      if (referralCode && referralCode.trim() !== "") {
        const partner = await storage.getFuneralHomePartnerByReferralCode(referralCode.trim());
        if (partner && partner.isActive) {
          await storage.createPartnerReferral({
            partnerId: partner.id,
            memorialId: memorial.id,
            referralCode: referralCode.trim(),
          });
        }
      }

      res.status(201).json(memorial);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/memorials/:id", async (req, res) => {
    try {
      const data = insertMemorialSchema.partial().parse(req.body);
      const memorial = await storage.updateMemorial(req.params.id, data);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      res.json(memorial);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Memorial Admin routes (protected)
  app.get("/api/memorials/:memorialId/admins", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const memorial = await storage.getMemorial(req.params.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      // Check if user is the creator or an admin
      const admins = await storage.getMemorialAdmins(req.params.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);

      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to view this memorial's admins" });
      }

      res.json(admins);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/admins", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const memorial = await storage.getMemorial(req.params.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      // Only the creator can add new admins
      if (memorial.creatorEmail !== userEmail) {
        return res.status(403).json({ error: "Forbidden: Only the memorial creator can add admins" });
      }

      const data = insertMemorialAdminSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const admin = await storage.createMemorialAdmin(data);
      res.status(201).json(admin);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/memorial-admins/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      
      // Get the admin record to find the memorial
      const adminToDelete = await storage.getMemorialAdminById(req.params.id);
      
      if (!adminToDelete) {
        return res.status(404).json({ error: "Admin not found" });
      }
      
      // Get the memorial to verify the creator
      const memorial = await storage.getMemorial(adminToDelete.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      // Only the memorial creator can delete admins
      if (memorial.creatorEmail !== userEmail) {
        return res.status(403).json({ error: "Forbidden: Only the memorial creator can remove admins" });
      }
      
      await storage.deleteMemorialAdmin(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // QR Code routes (protected)
  app.get("/api/memorials/:memorialId/qr-codes", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const memorial = await storage.getMemorial(req.params.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      // Check if user is the creator or an admin with QR management permission
      const admins = await storage.getMemorialAdmins(req.params.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isQRAdmin = admins.some(admin => admin.email === userEmail && admin.canManageQR);

      if (!isCreator && !isQRAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to view QR codes for this memorial" });
      }

      const qrCodes = await storage.getQRCodesByMemorialId(req.params.memorialId);
      res.json(qrCodes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/qr-codes/generate", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const memorial = await storage.getMemorial(req.params.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      // Check if user is the creator or an admin with QR management permission
      const admins = await storage.getMemorialAdmins(req.params.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isQRAdmin = admins.some(admin => admin.email === userEmail && admin.canManageQR);

      if (!isCreator && !isQRAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to generate QR codes for this memorial" });
      }

      // Validate request body
      const validatedData = qrCodeMediaSchema.parse(req.body);
      const { purpose, issuedToEmail, title, description, videoUrl, imageUrl, mediaType } = validatedData;
      
      const qrCode = await storage.generateQRCode(
        req.params.memorialId,
        purpose || "tombstone",
        issuedToEmail || undefined,
        title,
        description,
        videoUrl || undefined,
        imageUrl || undefined,
        mediaType
      );
      res.status(201).json(qrCode);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/qr-codes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      
      // Get the QR code to find the memorial
      const qrCode = await storage.getQRCodeById(req.params.id);
      
      if (!qrCode) {
        return res.status(404).json({ error: "QR code not found" });
      }
      
      // Get the memorial to verify the creator
      const memorial = await storage.getMemorial(qrCode.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      // Check if user is the creator or an admin with QR management permission
      const admins = await storage.getMemorialAdmins(qrCode.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isQRAdmin = admins.some(admin => admin.email === userEmail && admin.canManageQR);
      
      if (!isCreator && !isQRAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to update QR codes for this memorial" });
      }
      
      // Validate and parse request body
      const validatedData = qrCodeMediaUpdateSchema.parse(req.body);
      
      // Filter to only include provided fields to avoid overwriting with undefined
      const updates: Partial<Pick<QRCode, 'title' | 'description' | 'videoUrl' | 'imageUrl' | 'mediaType'>> = {};
      if (validatedData.title !== undefined) updates.title = validatedData.title;
      if (validatedData.description !== undefined) updates.description = validatedData.description;
      if (validatedData.videoUrl !== undefined) updates.videoUrl = validatedData.videoUrl || null;
      if (validatedData.imageUrl !== undefined) updates.imageUrl = validatedData.imageUrl || null;
      if (validatedData.mediaType !== undefined) updates.mediaType = validatedData.mediaType;
      
      // Guard against empty update payloads
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }
      
      const updated = await storage.updateQRCode(req.params.id, updates);
      
      if (!updated) {
        return res.status(404).json({ error: "QR code not found" });
      }
      
      res.json(updated);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/qr-codes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      
      // Get the QR code to find the memorial
      const qrCode = await storage.getQRCodeById(req.params.id);
      
      if (!qrCode) {
        return res.status(404).json({ error: "QR code not found" });
      }
      
      // Get the memorial to verify the creator
      const memorial = await storage.getMemorial(qrCode.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      // Check if user is the creator or an admin with QR management permission
      const admins = await storage.getMemorialAdmins(qrCode.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isQRAdmin = admins.some(admin => admin.email === userEmail && admin.canManageQR);
      
      if (!isCreator && !isQRAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to delete QR codes for this memorial" });
      }
      
      await storage.deleteQRCode(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Memory routes
  app.get("/api/memorials/:memorialId/memories", async (req, res) => {
    try {
      const memories = await storage.getMemoriesByMemorialId(req.params.memorialId);
      res.json(memories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/memories", async (req, res) => {
    try {
      const data = insertMemorySchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const memory = await storage.createMemory(data);
      res.status(201).json(memory);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memories/:id/approve", async (req, res) => {
    try {
      const memory = await storage.approveMemory(req.params.id);
      if (!memory) {
        return res.status(404).json({ error: "Memory not found" });
      }
      res.json(memory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/memories/:id", async (req, res) => {
    try {
      await storage.rejectMemory(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Condolence routes
  app.get("/api/memorials/:memorialId/condolences", async (req, res) => {
    try {
      const condolences = await storage.getCondolencesByMemorialId(req.params.memorialId);
      res.json(condolences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/condolences", async (req, res) => {
    try {
      const data = insertCondolenceSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const condolence = await storage.createCondolence(data);
      res.status(201).json(condolence);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Scheduled Messages routes
  app.get("/api/memorials/:memorialId/scheduled-messages", async (req, res) => {
    try {
      const messages = await storage.getScheduledMessagesByMemorialId(req.params.memorialId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/scheduled-messages", async (req, res) => {
    try {
      const data = insertScheduledMessageSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const message = await storage.createScheduledMessage(data);
      res.status(201).json(message);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Fundraiser routes
  app.get("/api/memorials/:memorialId/fundraisers", async (req, res) => {
    try {
      const fundraisers = await storage.getFundraisersByMemorialId(req.params.memorialId);
      res.json(fundraisers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/fundraisers/:id", async (req, res) => {
    try {
      const fundraiser = await storage.getFundraiser(req.params.id);
      if (!fundraiser) {
        return res.status(404).json({ error: "Fundraiser not found" });
      }
      res.json(fundraiser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/fundraisers", async (req, res) => {
    try {
      const data = insertFundraiserSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const fundraiser = await storage.createFundraiser(data);
      res.status(201).json(fundraiser);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Donation routes
  app.get("/api/fundraisers/:fundraiserId/donations", async (req, res) => {
    try {
      const donations = await storage.getDonationsByFundraiserId(req.params.fundraiserId);
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/fundraisers/:fundraiserId/create-donation-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid donation amount" });
      }

      const paymentIntent = await getStripe().paymentIntents.create({
        amount: Math.round(Number(amount) * 100),
        currency: "usd",
        metadata: {
          fundraiserId: req.params.fundraiserId,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/fundraisers/:fundraiserId/donations", async (req, res) => {
    try {
      const data = insertDonationSchema.parse({
        ...req.body,
        fundraiserId: req.params.fundraiserId,
      });
      const donation = await storage.createDonation(data);

      const fundraiser = await storage.getFundraiser(req.params.fundraiserId);
      if (fundraiser) {
        const referral = await storage.getPartnerReferralByMemorialId(fundraiser.memorialId);
        if (referral) {
          const partner = await storage.getFuneralHomePartner(referral.partnerId);
          if (partner && partner.isActive) {
            const commissionRate = Number(partner.commissionRate) / 100;
            const commissionAmount = Number(donation.amount) * commissionRate;

            await storage.createPartnerCommission({
              partnerId: partner.id,
              referralId: referral.id,
              transactionType: 'donation',
              transactionId: donation.id,
              transactionAmount: donation.amount.toString(),
              commissionAmount: commissionAmount.toFixed(2),
              status: 'pending',
            });
          }
        }
      }

      res.status(201).json(donation);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Celebrity Memorial routes
  app.get("/api/celebrity-memorials", async (req, res) => {
    try {
      const memorials = await storage.listCelebrityMemorials();
      res.json(memorials);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/celebrity-memorials/:id", async (req, res) => {
    try {
      const memorial = await storage.getCelebrityMemorial(req.params.id);
      if (!memorial) {
        return res.status(404).json({ error: "Celebrity memorial not found" });
      }
      res.json(memorial);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/celebrity-memorials", async (req, res) => {
    try {
      const data = insertCelebrityMemorialSchema.parse(req.body);
      const memorial = await storage.createCelebrityMemorial(data);
      res.status(201).json(memorial);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/celebrity-memorials/:id/donate", async (req, res) => {
    try {
      const data = insertCelebrityDonationSchema.parse({
        ...req.body,
        celebrityMemorialId: req.params.id,
      });
      const donation = await storage.createCelebrityDonation(data);
      res.status(201).json(donation);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Legacy Event routes
  app.get("/api/memorials/:memorialId/legacy-events", async (req, res) => {
    try {
      const events = await storage.getLegacyEventsByMemorialId(req.params.memorialId);
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/legacy-events", async (req, res) => {
    try {
      const data = insertLegacyEventSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const event = await storage.createLegacyEvent(data);
      res.status(201).json(event);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Music Playlist routes
  app.get("/api/memorials/:memorialId/playlist", async (req, res) => {
    try {
      const playlist = await storage.getMusicPlaylistByMemorialId(req.params.memorialId);
      res.json(playlist || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/playlist", async (req, res) => {
    try {
      const data = insertMusicPlaylistSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const playlist = await storage.upsertMusicPlaylist(data);
      res.status(201).json(playlist);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Grief Support routes
  app.get("/api/memorials/:memorialId/grief-support", async (req, res) => {
    try {
      const support = await storage.getGriefSupportByMemorialId(req.params.memorialId);
      res.json(support || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/grief-support", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      
      const memorial = await storage.getMemorial(req.params.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      const admins = await storage.getMemorialAdmins(req.params.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const canEdit = admins.some(admin => admin.email === userEmail && admin.canEditMemorial);
      
      if (!isCreator && !canEdit) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to manage grief support for this memorial" });
      }
      
      const data = insertGriefSupportSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const support = await storage.upsertGriefSupport(data);
      res.status(201).json(support);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Essential Workers Memorial routes
  app.get("/api/essential-workers", async (req, res) => {
    try {
      const { category } = req.query;
      const memorials = await storage.listEssentialWorkersMemorials(category as string);
      res.json(memorials);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/essential-workers/:id", async (req, res) => {
    try {
      const memorial = await storage.getEssentialWorkerMemorial(req.params.id);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      res.json(memorial);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/essential-workers", async (req, res) => {
    try {
      const data = insertEssentialWorkerMemorialSchema.parse(req.body);
      const memorial = await storage.createEssentialWorkerMemorial(data);
      res.status(201).json(memorial);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/essential-workers/:id", async (req, res) => {
    try {
      const data = insertEssentialWorkerMemorialSchema.partial().parse(req.body);
      const memorial = await storage.updateEssentialWorkerMemorial(req.params.id, data);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      res.json(memorial);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/essential-workers/:id", async (req, res) => {
    try {
      await storage.deleteEssentialWorkerMemorial(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Self-Written Obituary routes
  app.get("/api/self-obituary/:email", async (req, res) => {
    try {
      const obituary = await storage.getSelfWrittenObituaryByEmail(req.params.email);
      res.json(obituary || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/self-obituary", async (req, res) => {
    try {
      const data = insertSelfWrittenObituarySchema.parse(req.body);
      const obituary = await storage.createSelfWrittenObituary(data);
      res.status(201).json(obituary);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/self-obituary/:id", async (req, res) => {
    try {
      const data = insertSelfWrittenObituarySchema.partial().parse(req.body);
      const obituary = await storage.updateSelfWrittenObituary(req.params.id, data);
      if (!obituary) {
        return res.status(404).json({ error: "Obituary not found" });
      }
      res.json(obituary);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/self-obituary/:id/activate", async (req, res) => {
    try {
      const obituary = await storage.activateSelfWrittenObituary(req.params.id);
      if (!obituary) {
        return res.status(404).json({ error: "Obituary not found" });
      }
      res.json(obituary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Advertisement routes
  app.get("/api/advertisements", async (req, res) => {
    try {
      const { category } = req.query;
      const ads = await storage.listAdvertisements(category as string);
      res.json(ads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/advertisements/:id", async (req, res) => {
    try {
      const ad = await storage.getAdvertisement(req.params.id);
      if (!ad) {
        return res.status(404).json({ error: "Advertisement not found" });
      }
      res.json(ad);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/advertisements", async (req, res) => {
    try {
      const data = insertAdvertisementSchema.parse(req.body);
      const ad = await storage.createAdvertisement(data);
      res.status(201).json(ad);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/advertisements/:id", async (req, res) => {
    try {
      const data = insertAdvertisementSchema.partial().parse(req.body);
      const ad = await storage.updateAdvertisement(req.params.id, data);
      if (!ad) {
        return res.status(404).json({ error: "Advertisement not found" });
      }
      res.json(ad);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/advertisements/:id", async (req, res) => {
    try {
      await storage.deleteAdvertisement(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/advertisements/:id/impression", async (req, res) => {
    try {
      await storage.incrementAdImpression(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/advertisements/:id/click", async (req, res) => {
    try {
      await storage.incrementAdClick(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Advertisement Sales Tracking routes
  const recordSaleSchema = z.object({
    saleAmount: z.number().positive("Sale amount must be greater than 0"),
    customerEmail: z.string().email().optional(),
    orderReference: z.string().optional(),
  });

  app.post("/api/advertisements/:id/sale", async (req, res) => {
    try {
      const data = recordSaleSchema.parse(req.body);

      const ad = await storage.getAdvertisement(req.params.id);
      if (!ad) {
        return res.status(404).json({ error: "Advertisement not found" });
      }

      if (!ad.referralCode) {
        return res.status(400).json({ error: "Advertisement does not have a referral code" });
      }

      const platformFeePercentage = ad.commissionPercentage || 0;
      const platformFeeAmount = (data.saleAmount * platformFeePercentage / 100).toFixed(2);

      const sale = await storage.recordSale({
        advertisementId: req.params.id,
        referralCode: ad.referralCode,
        saleAmount: data.saleAmount.toString(),
        platformFeePercentage,
        platformFeeAmount,
        customerEmail: data.customerEmail,
        orderReference: data.orderReference,
      });

      res.status(201).json(sale);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/advertisements/:id/sales", async (req, res) => {
    try {
      const sales = await storage.getAdvertisementSales(req.params.id);
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/referral-sales/:referralCode", async (req, res) => {
    try {
      const sales = await storage.getSalesByReferralCode(req.params.referralCode);
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Advertisement Status Management
  // TODO: In production, add admin role verification here
  app.patch("/api/advertisements/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'pending', 'approved', or 'rejected'" });
      }

      const ad = await storage.updateAdvertisementStatus(req.params.id, status);
      if (!ad) {
        return res.status(404).json({ error: "Advertisement not found" });
      }

      res.json(ad);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/advertisements/by-status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'pending', 'approved', or 'rejected'" });
      }

      const ads = await storage.listAdvertisementsByStatus(status as 'pending' | 'approved' | 'rejected');
      res.json(ads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Funeral Home Partner routes
  app.get("/api/funeral-home-partners", async (req, res) => {
    try {
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
      const partners = await storage.listFuneralHomePartners(isActive);
      res.json(partners);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/funeral-home-partners/by-code/:code", async (req, res) => {
    try {
      const partner = await storage.getFuneralHomePartnerByReferralCode(req.params.code);
      if (!partner) {
        return res.status(404).json({ error: "Partner not found" });
      }
      res.json(partner);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/funeral-home-partners/:id", async (req, res) => {
    try {
      const partner = await storage.getFuneralHomePartner(req.params.id);
      if (!partner) {
        return res.status(404).json({ error: "Partner not found" });
      }
      res.json(partner);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/funeral-home-partners", async (req, res) => {
    try {
      const data = insertFuneralHomePartnerSchema.parse(req.body);
      const partner = await storage.createFuneralHomePartner(data);
      res.status(201).json(partner);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      if (error.message?.includes('unique constraint') && error.message?.includes('email')) {
        return res.status(409).json({ error: 'A partner with this email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/funeral-home-partners/:id", async (req, res) => {
    try {
      const data = insertFuneralHomePartnerSchema.partial().parse(req.body);
      const partner = await storage.updateFuneralHomePartner(req.params.id, data);
      if (!partner) {
        return res.status(404).json({ error: "Partner not found" });
      }
      res.json(partner);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/funeral-home-partners/:partnerId/referrals", async (req, res) => {
    try {
      const referrals = await storage.getPartnerReferralsByPartnerId(req.params.partnerId);
      res.json(referrals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/funeral-home-partners/:partnerId/referrals", async (req, res) => {
    try {
      const data = insertPartnerReferralSchema.parse({
        ...req.body,
        partnerId: req.params.partnerId,
      });
      const referral = await storage.createPartnerReferral(data);
      res.status(201).json(referral);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/funeral-home-partners/:partnerId/commissions", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const commissions = await storage.getPartnerCommissionsByPartnerId(req.params.partnerId, status);
      res.json(commissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/funeral-home-partners/:partnerId/payouts", async (req, res) => {
    try {
      const payouts = await storage.getPartnerPayoutsByPartnerId(req.params.partnerId);
      res.json(payouts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Prison Access System routes
  
  // Prison Facilities
  app.get("/api/prison-facilities", async (req, res) => {
    try {
      const facilities = await storage.listPrisonFacilities();
      res.json(facilities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/prison-facilities", async (req, res) => {
    try {
      const data = insertPrisonFacilitySchema.parse(req.body);
      const facility = await storage.createPrisonFacility(data);
      res.status(201).json(facility);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Prison Access Requests
  app.post("/api/prison-access-requests", async (req, res) => {
    try {
      const data = insertPrisonAccessRequestSchema.parse(req.body);
      const request = await storage.createPrisonAccessRequest(data);
      
      const auditLog = insertPrisonAuditLogSchema.parse({
        requestId: request.id,
        action: "REQUEST_CREATED",
        performedBy: data.requestedByEmail,
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined,
        metadata: { requestData: data },
      });
      await storage.createPrisonAuditLog(auditLog);

      res.status(201).json(request);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/prison-access-requests", async (req, res) => {
    try {
      const { status, memorialId } = req.query;
      const requests = await storage.listPrisonAccessRequests(
        status as string,
        memorialId as string
      );
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/prison-access-requests/:id", async (req, res) => {
    try {
      const request = await storage.getPrisonAccessRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json(request);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/prison-access-requests/:id/status", async (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      const request = await storage.updatePrisonAccessRequestStatus(
        req.params.id,
        status,
        adminNotes
      );
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      const auditLog = insertPrisonAuditLogSchema.parse({
        requestId: request.id,
        action: `STATUS_CHANGED_TO_${status.toUpperCase()}`,
        performedBy: req.body.performedBy || "admin",
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined,
        metadata: { newStatus: status, notes: adminNotes },
      });
      await storage.createPrisonAuditLog(auditLog);

      res.json(request);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Prison Verifications
  app.post("/api/prison-access-requests/:requestId/verifications", async (req, res) => {
    try {
      const data = insertPrisonVerificationSchema.parse({
        ...req.body,
        requestId: req.params.requestId,
      });
      const verification = await storage.createPrisonVerification(data);

      const auditLog = insertPrisonAuditLogSchema.parse({
        requestId: req.params.requestId,
        action: `VERIFICATION_${data.verificationType.toUpperCase()}_${data.status.toUpperCase()}`,
        performedBy: data.verifiedBy,
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined,
        metadata: { verificationType: data.verificationType, status: data.status },
      });
      await storage.createPrisonAuditLog(auditLog);

      res.status(201).json(verification);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/prison-access-requests/:requestId/verifications", async (req, res) => {
    try {
      const verifications = await storage.getPrisonVerificationsByRequestId(req.params.requestId);
      res.json(verifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Prison Payments
  app.post("/api/prison-access-requests/:requestId/payments", async (req, res) => {
    try {
      const data = insertPrisonPaymentSchema.parse({
        ...req.body,
        requestId: req.params.requestId,
      });
      const payment = await storage.createPrisonPayment(data);

      const auditLog = insertPrisonAuditLogSchema.parse({
        requestId: req.params.requestId,
        action: "PAYMENT_INITIATED",
        performedBy: data.payerEmail,
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined,
        metadata: { amount: data.amount, paymentMethod: data.paymentMethod },
      });
      await storage.createPrisonAuditLog(auditLog);

      res.status(201).json(payment);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/prison-payments/:id/confirm", async (req, res) => {
    try {
      const payment = await storage.confirmPrisonPayment(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      const auditLog = insertPrisonAuditLogSchema.parse({
        requestId: payment.requestId,
        action: "PAYMENT_CONFIRMED",
        performedBy: "system",
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined,
        metadata: { paymentId: payment.id, amount: payment.amount },
      });
      await storage.createPrisonAuditLog(auditLog);

      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Prison Access Sessions
  app.post("/api/prison-access-sessions", async (req, res) => {
    try {
      const data = insertPrisonAccessSessionSchema.parse(req.body);
      const session = await storage.createPrisonAccessSession(data);

      const auditLog = insertPrisonAuditLogSchema.parse({
        requestId: data.requestId,
        sessionId: session.id,
        action: "ACCESS_SESSION_CREATED",
        performedBy: "system",
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined,
        metadata: { memorialId: data.memorialId, expiresAt: data.expiresAt },
      });
      await storage.createPrisonAuditLog(auditLog);

      res.status(201).json(session);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/prison-access-sessions/validate/:token", async (req, res) => {
    try {
      const session = await storage.validatePrisonAccessToken(req.params.token);
      if (!session) {
        return res.status(404).json({ error: "Invalid or expired access token" });
      }

      const auditLog = insertPrisonAuditLogSchema.parse({
        requestId: session.requestId,
        sessionId: session.id,
        action: "ACCESS_TOKEN_VALIDATED",
        performedBy: "inmate",
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined,
        metadata: { memorialId: session.memorialId },
      });
      await storage.createPrisonAuditLog(auditLog);

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/prison-access-sessions/:id/deactivate", async (req, res) => {
    try {
      const session = await storage.deactivatePrisonAccessSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const auditLog = insertPrisonAuditLogSchema.parse({
        requestId: session.requestId,
        sessionId: session.id,
        action: "ACCESS_SESSION_DEACTIVATED",
        performedBy: req.body.performedBy || "admin",
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined,
        metadata: { reason: req.body.reason },
      });
      await storage.createPrisonAuditLog(auditLog);

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Prison Audit Logs
  app.get("/api/prison-audit-logs", async (req, res) => {
    try {
      const { requestId, sessionId } = req.query;
      const logs = await storage.getPrisonAuditLogs(
        requestId as string,
        sessionId as string
      );
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Push Notifications
  app.post("/api/push-tokens", async (req, res) => {
    try {
      const data = insertPushTokenSchema.parse(req.body);
      const pushToken = await storage.createPushToken(data);
      res.json(pushToken);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics - Page View Tracking (no auth required - works for all visitors)
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const user = req.user as any;
      const pageViewData = {
        path: req.body.path,
        userId: user?.claims?.sub || null, // Optional - works for anonymous users too
        sessionId: req.sessionID || null,
        userAgent: req.headers['user-agent'] || null,
      };
      
      const validated = insertPageViewSchema.parse(pageViewData);
      await storage.trackPageView(validated);
      res.json({ success: true });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Analytics
  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
