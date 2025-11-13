import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { ZodError } from "zod";
import { z } from "zod";
import { moderateContent } from "./contentModeration";

// User profile update schema - allow phone, bio, timezone, language
const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
}).strict(); // Reject any extra fields
import Stripe from "stripe";
import { 
  insertMemorialSchema, 
  insertMemorySchema, 
  insertMemoryCommentSchema,
  insertMemoryCondolenceSchema,
  insertMemoryReactionSchema,
  insertCondolenceSchema,
  insertMemorialLikeSchema,
  insertMemorialCommentSchema,
  insertMemorialCondolenceReactionSchema,
  deleteMemorialCondolenceReactionSchema,
  insertSavedMemorialSchema,
  insertMemorialLiveStreamSchema,
  insertMemorialLiveStreamViewerSchema,
  insertScheduledMessageSchema,
  insertFundraiserSchema,
  insertDonationSchema,
  insertCelebrityMemorialSchema,
  insertCelebrityDonationSchema,
  insertCelebrityFanContentSchema,
  insertGriefSupportSchema,
  insertLegacyEventSchema,
  insertMusicPlaylistSchema,
  insertEssentialWorkerMemorialSchema,
  insertHoodMemorialSchema,
  insertNeighborhoodSchema,
  insertAlumniMemorialSchema,
  insertSelfWrittenObituarySchema,
  insertAdvertisementSchema,
  insertAdvertisementSaleSchema,
  insertFuneralHomePartnerSchema,
  insertPartnerReferralSchema,
  insertPartnerCommissionSchema,
  insertPartnerPayoutSchema,
  insertFlowerShopPartnerSchema,
  insertFlowerOrderSchema,
  insertFlowerCommissionSchema,
  insertFlowerPayoutSchema,
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
  insertAnalyticsEventSchema,
  insertSupportArticleSchema,
  insertSupportRequestSchema,
  insertGriefResourceSchema,
  insertUserSettingsSchema,
  insertMemorialEventSchema,
  insertMemorialEventRsvpSchema,
  insertFuneralProgramSchema,
  insertProgramItemSchema,
  insertMemorialDocumentarySchema,
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

  // Get user settings
  app.get('/api/user/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let settings = await storage.getUserSettings(userId);
      
      // If settings don't exist, create default settings
      if (!settings) {
        settings = await storage.upsertUserSettings({
          userId,
          emailNotifications: true,
          pushNotifications: true,
          memorialUpdates: true,
          donationReceipts: true,
          scheduledMessageReminders: true,
          shareActivityWithCreators: true,
          publicProfile: true,
        });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update user settings
  app.patch('/api/user/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate settings data
      const validatedData = insertUserSettingsSchema.parse({
        userId,
        ...req.body,
      });
      
      const updatedSettings = await storage.upsertUserSettings(validatedData);
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
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

  // Delete user account
  app.delete('/api/user/account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Delete the user and all their data
      await storage.deleteUser(userId);
      
      // Destroy the session
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
      });
      
      res.json({ 
        message: "Account deleted successfully",
        success: true 
      });
    } catch (error) {
      console.error("Error deleting user account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Memorial routes
  app.get("/api/memorials", async (req, res) => {
    try {
      // Parse and validate pagination parameters
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200); // Cap at 200
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }
      
      const memorials = await storage.listMemorials(limit, offset);
      
      // Backward compatible: return array by default, object with pagination if requested
      if (req.query.paginated === 'true') {
        const total = await storage.getMemorialsCount();
        res.json({
          data: memorials,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + memorials.length < total
          }
        });
      } else {
        // Legacy array response for backward compatibility
        res.json(memorials);
      }
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

  app.post("/api/memorials", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const { referralCode, ...memorialData } = req.body;
      
      // Auto-set creatorEmail from authenticated user for security
      const dataWithCreator = {
        ...memorialData,
        creatorEmail: userEmail,
      };
      
      const data = insertMemorialSchema.parse(dataWithCreator);
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

  // Simplified QR code generation endpoint
  app.post("/api/memorials/:memorialId/qr-codes", isAuthenticated, async (req: any, res) => {
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

      const { purpose = "tombstone_upload" } = req.body;
      const qrCode = await storage.generateQRCode(req.params.memorialId, purpose, userEmail);
      res.status(201).json(qrCode);
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

  // Public QR Code upload endpoint (no authentication required)
  app.post("/api/qr-codes/:code/upload", async (req, res) => {
    try {
      // Validate QR code exists and is for upload purpose
      const qrCode = await storage.getQRCodeByCode(req.params.code);
      
      if (!qrCode) {
        return res.status(404).json({ error: "Invalid QR code" });
      }

      if (qrCode.purpose !== "tombstone_upload") {
        return res.status(403).json({ error: "This QR code is not for uploading media" });
      }

      // Validate the memorial exists
      const memorial = await storage.getMemorial(qrCode.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      // Create memory with auto-approval for QR code uploads
      const data = insertMemorySchema.parse({
        ...req.body,
        memorialId: qrCode.memorialId,
        isApproved: true, // Auto-approve QR code uploads
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

  // Funeral Program routes
  app.get("/api/memorials/:memorialId/funeral-program", async (req, res) => {
    try {
      const program = await storage.getFuneralProgramByMemorialId(req.params.memorialId);
      if (!program) {
        return res.status(404).json({ error: "Funeral program not found" });
      }
      res.json(program);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/funeral-program", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const memorial = await storage.getMemorial(req.params.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      // Check if user is the creator or an admin
      const admins = await storage.getMemorialAdmins(req.params.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail && admin.canEditMemorial);

      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to create a funeral program for this memorial" });
      }

      const data = insertFuneralProgramSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      
      const program = await storage.createFuneralProgram(data);
      res.status(201).json(program);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/memorials/:memorialId/funeral-program", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const memorial = await storage.getMemorial(req.params.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      // Check if user is the creator or an admin
      const admins = await storage.getMemorialAdmins(req.params.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail && admin.canEditMemorial);

      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to update the funeral program" });
      }

      const data = insertFuneralProgramSchema.partial().parse(req.body);
      const program = await storage.updateFuneralProgram(req.params.memorialId, data);
      
      if (!program) {
        return res.status(404).json({ error: "Funeral program not found" });
      }
      
      res.json(program);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Program Items routes
  app.get("/api/funeral-programs/:programId/items", async (req, res) => {
    try {
      const items = await storage.getProgramItems(req.params.programId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/funeral-programs/:programId/items", isAuthenticated, async (req: any, res) => {
    try {
      const data = insertProgramItemSchema.parse({
        ...req.body,
        programId: req.params.programId,
      });
      
      const item = await storage.createProgramItem(data);
      res.status(201).json(item);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/program-items/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertProgramItemSchema.partial().parse(req.body);
      const item = await storage.updateProgramItem(req.params.id, data);
      
      if (!item) {
        return res.status(404).json({ error: "Program item not found" });
      }
      
      res.json(item);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/program-items/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteProgramItem(req.params.id);
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
      
      // Content moderation
      const moderated = moderateContent(data.caption);
      if (!moderated.isClean) {
        return res.status(400).json({ 
          error: "Your caption contains inappropriate language. Please revise and try again.",
          vulgarLanguageDetected: true,
        });
      }
      
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

  // Memory Comment routes (comments on individual photos/videos)
  app.get("/api/memories/:memoryId/comments", async (req, res) => {
    try {
      const comments = await storage.getMemoryComments(req.params.memoryId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/memories/:memoryId/comments/count", async (req, res) => {
    try {
      const count = await storage.getMemoryCommentsCount(req.params.memoryId);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memories/:memoryId/comments", async (req, res) => {
    try {
      const data = insertMemoryCommentSchema.parse({
        ...req.body,
        memoryId: req.params.memoryId,
      });
      
      // Content moderation
      const moderated = moderateContent(data.comment);
      if (!moderated.isClean) {
        return res.status(400).json({ 
          error: "Your comment contains inappropriate language. Please revise and try again.",
          vulgarLanguageDetected: true,
        });
      }
      
      const comment = await storage.createMemoryComment(data);
      res.status(201).json(comment);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/memory-comments/:id", async (req, res) => {
    try {
      await storage.deleteMemoryComment(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Memory Condolence routes (condolences on individual photos/videos)
  app.get("/api/memories/:memoryId/condolences", async (req, res) => {
    try {
      const condolences = await storage.getMemoryCondolences(req.params.memoryId);
      res.json(condolences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/memories/:memoryId/condolences/count", async (req, res) => {
    try {
      const count = await storage.getMemoryCondolencesCount(req.params.memoryId);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memories/:memoryId/condolences", async (req, res) => {
    try {
      const data = insertMemoryCondolenceSchema.parse({
        ...req.body,
        memoryId: req.params.memoryId,
      });
      
      const condolence = await storage.createMemoryCondolence(data);
      res.status(201).json(condolence);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/memories/:memoryId/condolences", async (req, res) => {
    try {
      const userId = req.body.userId;
      const userEmail = req.body.userEmail;
      await storage.deleteMemoryCondolence(req.params.memoryId, userId, userEmail);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Memory Reaction routes (hearts/likes on individual photos/videos)
  app.get("/api/memories/:memoryId/reactions", async (req, res) => {
    try {
      const reactions = await storage.getMemoryReactions(req.params.memoryId);
      res.json(reactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/memories/:memoryId/reactions/count", async (req, res) => {
    try {
      const count = await storage.getMemoryReactionsCount(req.params.memoryId);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/memories/:memoryId/reactions/user", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const userEmail = req.query.userEmail as string | undefined;
      const reaction = await storage.getUserMemoryReaction(req.params.memoryId, userId, userEmail);
      res.json({ hasReacted: !!reaction, reaction });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memories/:memoryId/reactions", async (req, res) => {
    try {
      const data = insertMemoryReactionSchema.parse({
        ...req.body,
        memoryId: req.params.memoryId,
        reactionType: req.body.reactionType || 'heart',
      });
      
      // Check if user has already reacted (idempotency check)
      const existingReaction = await storage.getUserMemoryReaction(
        req.params.memoryId,
        data.userId || undefined,
        data.userEmail || undefined
      );
      
      // If already reacted, return existing reaction (idempotent)
      if (existingReaction) {
        return res.status(200).json(existingReaction);
      }
      
      const reaction = await storage.createMemoryReaction(data);
      res.status(201).json(reaction);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/memories/:memoryId/reactions", async (req, res) => {
    try {
      const userId = req.body.userId;
      const userEmail = req.body.userEmail;
      await storage.deleteMemoryReaction(req.params.memoryId, userId, userEmail);
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
      
      // Content moderation
      const moderated = moderateContent(data.message);
      if (!moderated.isClean) {
        return res.status(400).json({ 
          error: "Your message contains inappropriate language. Please revise and try again.",
          vulgarLanguageDetected: true,
        });
      }
      
      const condolence = await storage.createCondolence(data);
      res.status(201).json(condolence);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Memorial Like routes
  app.get("/api/memorials/:memorialId/likes", async (req, res) => {
    try {
      const likes = await storage.getMemorialLikes(req.params.memorialId);
      res.json(likes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/memorials/:memorialId/likes/count", async (req, res) => {
    try {
      const count = await storage.getMemorialLikesCount(req.params.memorialId);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/likes", async (req, res) => {
    try {
      const data = insertMemorialLikeSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const like = await storage.createMemorialLike(data);
      res.status(201).json(like);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/memorials/:memorialId/likes", async (req, res) => {
    try {
      await storage.deleteMemorialLike(
        req.params.memorialId,
        req.body.userId,
        req.body.userEmail
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Memorial Comment routes
  app.get("/api/memorials/:memorialId/comments", async (req, res) => {
    try {
      const comments = await storage.getMemorialComments(req.params.memorialId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/comments", async (req, res) => {
    try {
      const data = insertMemorialCommentSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      
      // Content moderation
      const moderated = moderateContent(data.comment);
      if (!moderated.isClean) {
        return res.status(400).json({ 
          error: "Your comment contains inappropriate language. Please revise and try again.",
          vulgarLanguageDetected: true,
        });
      }
      
      const comment = await storage.createMemorialComment(data);
      res.status(201).json(comment);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/memorials/:memorialId/comments/:commentId", async (req, res) => {
    try {
      await storage.deleteMemorialComment(req.params.commentId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Memorial Condolence Reaction routes
  app.get("/api/memorials/:memorialId/condolence-reactions", async (req: any, res) => {
    try {
      const { memorialId } = req.params;
      const userId = req.user?.claims?.sub;
      const sessionId = req.headers['x-session-id'] as string | undefined;
      
      const reactions = await storage.getMemorialCondolenceReactions(memorialId);
      
      let userReactions: string[] = [];
      if (userId || sessionId) {
        const userReactionRecords = await storage.getUserMemorialCondolenceReactions({
          memorialId,
          userId,
          sessionId,
        });
        userReactions = userReactionRecords.map(r => r.reactionType);
      }
      
      res.json({ 
        reactions,
        userReactions 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/condolence-reactions", async (req, res) => {
    try {
      // Parse and validate request body with Zod schema (includes refinement check)
      const parsed = insertMemorialCondolenceReactionSchema.safeParse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      
      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid request", 
          errors: parsed.error.errors 
        });
      }
      
      // Explicit validation (redundant but defensive - additional layer)
      const data = parsed.data;
      const hasUserId = !!data.userId;
      const hasSessionId = !!data.sessionId;
      
      if (!hasUserId && !hasSessionId) {
        return res.status(400).json({ 
          message: "Either userId or sessionId must be provided" 
        });
      }
      
      if (hasUserId && hasSessionId) {
        return res.status(400).json({ 
          message: "Only one of userId or sessionId should be provided" 
        });
      }
      
      const reaction = await storage.addMemorialCondolenceReaction(data);
      res.status(201).json(reaction);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      if (error.message === "DUPLICATE_REACTION") {
        return res.status(409).json({ message: "You already reacted with this emoji" });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/memorials/:memorialId/condolence-reactions/:reactionType", async (req, res) => {
    try {
      // Validate request body
      const parsed = deleteMemorialCondolenceReactionSchema.safeParse({
        memorialId: req.params.memorialId,
        reactionType: req.params.reactionType,
        ...req.body
      });
      
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid request",
          errors: parsed.error.errors
        });
      }
      
      const data = parsed.data;
      
      // Explicit validation (defensive layer)
      const hasUserId = !!data.userId;
      const hasSessionId = !!data.sessionId;
      
      if (!hasUserId && !hasSessionId) {
        return res.status(400).json({
          message: "Either userId or sessionId must be provided for deletion"
        });
      }
      
      if (hasUserId && hasSessionId) {
        return res.status(400).json({
          message: "Only one of userId or sessionId should be provided for deletion"
        });
      }
      
      // Execute delete with identity enforcement
      const deleted = await storage.removeMemorialCondolenceReaction({
        memorialId: data.memorialId,
        reactionType: data.reactionType,
        userId: data.userId,
        sessionId: data.sessionId
      });
      
      res.json({
        message: "Condolence reaction removed successfully",
        reaction: deleted
      });
      
    } catch (error: any) {
      if (error.message === "MISSING_IDENTITY" || error.message === "DUPLICATE_IDENTITY") {
        return res.status(400).json({ message: error.message });
      }
      if (error.message.startsWith("NOT_FOUND")) {
        return res.status(404).json({ message: "Reaction not found or already deleted" });
      }
      console.error("Error removing condolence reaction:", error);
      res.status(500).json({ message: "Failed to remove condolence reaction" });
    }
  });

  // Saved Memorial routes
  app.get("/api/saved-memorials", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedMemorials = await storage.getSavedMemorials(userId);
      res.json(savedMemorials);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saved-memorials/:memorialId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedMemorial = await storage.getSavedMemorial(userId, req.params.memorialId);
      // Return success response regardless, with isSaved flag
      if (!savedMemorial) {
        return res.json({ isSaved: false, savedMemorial: null });
      }
      res.json({ isSaved: true, savedMemorial });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/saved-memorials", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertSavedMemorialSchema.parse({
        ...req.body,
        userId,
      });
      const savedMemorial = await storage.createSavedMemorial(data);
      res.status(201).json(savedMemorial);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/saved-memorials/:memorialId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteSavedMemorial(userId, req.params.memorialId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/saved-memorials/:id", isAuthenticated, async (req: any, res) => {
    try {
      const updated = await storage.updateSavedMemorial(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Saved memorial not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Memorial Live Stream routes
  app.get("/api/memorials/:memorialId/live-streams", async (req, res) => {
    try {
      const streams = await storage.getMemorialLiveStreams(req.params.memorialId);
      res.json(streams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/live-streams/:streamId", async (req, res) => {
    try {
      const stream = await storage.getMemorialLiveStream(req.params.streamId);
      if (!stream) {
        return res.status(404).json({ error: "Live stream not found" });
      }
      res.json(stream);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/live-streams", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const memorial = await storage.getMemorial(req.params.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      const admins = await storage.getMemorialAdmins(req.params.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);

      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to create live streams for this memorial" });
      }

      const data = insertMemorialLiveStreamSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      const stream = await storage.createMemorialLiveStream(data);
      res.status(201).json(stream);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/live-streams/:streamId", isAuthenticated, async (req: any, res) => {
    try {
      const stream = await storage.getMemorialLiveStream(req.params.streamId);
      if (!stream) {
        return res.status(404).json({ error: "Live stream not found" });
      }

      const memorial = await storage.getMemorial(stream.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      const userEmail = req.user.claims.email;
      const admins = await storage.getMemorialAdmins(stream.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);

      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const data = insertMemorialLiveStreamSchema.partial().parse(req.body);
      const updated = await storage.updateMemorialLiveStream(req.params.streamId, data);
      res.json(updated);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/live-streams/:streamId", isAuthenticated, async (req: any, res) => {
    try {
      const stream = await storage.getMemorialLiveStream(req.params.streamId);
      if (!stream) {
        return res.status(404).json({ error: "Live stream not found" });
      }

      const memorial = await storage.getMemorial(stream.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      const userEmail = req.user.claims.email;
      const admins = await storage.getMemorialAdmins(stream.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);

      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await storage.deleteMemorialLiveStream(req.params.streamId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Live Stream Viewer routes
  app.get("/api/live-streams/:streamId/viewers", async (req, res) => {
    try {
      const viewers = await storage.getLiveStreamViewers(req.params.streamId);
      res.json(viewers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/live-streams/:streamId/viewers", async (req, res) => {
    try {
      const data = insertMemorialLiveStreamViewerSchema.parse({
        ...req.body,
        streamId: req.params.streamId,
      });
      const viewer = await storage.createLiveStreamViewer(data);
      res.status(201).json(viewer);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/live-stream-viewers/:viewerId/leave", async (req, res) => {
    try {
      const { leftAt, durationMinutes } = req.body;
      await storage.updateLiveStreamViewer(req.params.viewerId, new Date(leftAt), durationMinutes);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Memorial Documentary routes
  app.get("/api/memorials/:memorialId/documentaries", async (req, res) => {
    try {
      const documentaries = await storage.getMemorialDocumentaries(req.params.memorialId);
      res.json(documentaries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/documentaries/:documentaryId", async (req, res) => {
    try {
      const documentary = await storage.getMemorialDocumentary(req.params.documentaryId);
      if (!documentary) {
        return res.status(404).json({ error: "Documentary not found" });
      }
      res.json(documentary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/documentaries", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const userId = req.user.claims.sub;
      const memorial = await storage.getMemorial(req.params.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      const admins = await storage.getMemorialAdmins(req.params.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);

      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to create documentaries for this memorial" });
      }

      const data = insertMemorialDocumentarySchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
        createdBy: userId,
      });
      const documentary = await storage.createMemorialDocumentary(data);
      res.status(201).json(documentary);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/documentaries/:documentaryId", isAuthenticated, async (req: any, res) => {
    try {
      const documentary = await storage.getMemorialDocumentary(req.params.documentaryId);
      if (!documentary) {
        return res.status(404).json({ error: "Documentary not found" });
      }

      const memorial = await storage.getMemorial(documentary.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      const userEmail = req.user.claims.email;
      const admins = await storage.getMemorialAdmins(documentary.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);

      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const data = insertMemorialDocumentarySchema.partial().parse(req.body);
      const updated = await storage.updateMemorialDocumentary(req.params.documentaryId, data);
      res.json(updated);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/documentaries/:documentaryId", isAuthenticated, async (req: any, res) => {
    try {
      const documentary = await storage.getMemorialDocumentary(req.params.documentaryId);
      if (!documentary) {
        return res.status(404).json({ error: "Documentary not found" });
      }

      const memorial = await storage.getMemorial(documentary.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }

      const userEmail = req.user.claims.email;
      const admins = await storage.getMemorialAdmins(documentary.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);

      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await storage.deleteMemorialDocumentary(req.params.documentaryId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/documentaries/:documentaryId/view", async (req, res) => {
    try {
      await storage.incrementDocumentaryViewCount(req.params.documentaryId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Scheduled Messages routes
  app.get("/api/memorials/:memorialId/scheduled-messages", isAuthenticated, async (req: any, res) => {
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
        return res.status(403).json({ error: "Forbidden: You do not have permission to view scheduled messages for this memorial" });
      }

      const messages = await storage.getScheduledMessagesByMemorialId(req.params.memorialId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/scheduled-messages", isAuthenticated, async (req: any, res) => {
    console.log('[CREATE SCHEDULED MESSAGE] Route hit:', req.params.memorialId);
    console.log('[CREATE SCHEDULED MESSAGE] Request body:', JSON.stringify(req.body, null, 2));
    
    try {
      const userEmail = req.user.claims.email;
      console.log('[CREATE SCHEDULED MESSAGE] User email:', userEmail);
      
      const memorial = await storage.getMemorial(req.params.memorialId);
      console.log('[CREATE SCHEDULED MESSAGE] Memorial found:', memorial ? 'yes' : 'no');
      
      if (!memorial) {
        console.log('[CREATE SCHEDULED MESSAGE] Memorial not found');
        return res.status(404).json({ error: "Memorial not found" });
      }

      // Check if user is the creator or an admin
      const admins = await storage.getMemorialAdmins(req.params.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);
      console.log('[CREATE SCHEDULED MESSAGE] Authorization check - isCreator:', isCreator, 'isAdmin:', isAdmin);

      if (!isCreator && !isAdmin) {
        console.log('[CREATE SCHEDULED MESSAGE] Authorization failed');
        return res.status(403).json({ error: "Forbidden: You do not have permission to create scheduled messages for this memorial" });
      }

      // Clean up empty strings to undefined for optional fields
      const cleanedBody = {
        ...req.body,
        recipientEmail: req.body.recipientEmail || undefined,
        eventDate: req.body.eventDate || undefined,
        mediaUrl: req.body.mediaUrl || undefined,
        mediaType: req.body.mediaType || undefined,
      };
      console.log('[CREATE SCHEDULED MESSAGE] Cleaned body:', JSON.stringify(cleanedBody, null, 2));

      const dataToValidate = {
        ...cleanedBody,
        memorialId: req.params.memorialId,
      };
      console.log('[CREATE SCHEDULED MESSAGE] Data to validate:', JSON.stringify(dataToValidate, null, 2));

      const data = insertScheduledMessageSchema.parse(dataToValidate);
      console.log('[CREATE SCHEDULED MESSAGE] Validation passed');
      
      const message = await storage.createScheduledMessage(data);
      console.log('[CREATE SCHEDULED MESSAGE] Message created:', message.id);
      
      res.status(201).json(message);
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.error('[CREATE SCHEDULED MESSAGE] Validation error:', JSON.stringify(error.errors, null, 2));
        console.error('[CREATE SCHEDULED MESSAGE] Received body:', JSON.stringify(req.body, null, 2));
        return res.status(400).json({ error: error.errors });
      }
      console.error('[CREATE SCHEDULED MESSAGE] Server error:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/scheduled-messages/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      
      // Get the scheduled message to find the memorial
      const message = await storage.getScheduledMessage(req.params.id);
      
      if (!message) {
        return res.status(404).json({ error: "Scheduled message not found" });
      }
      
      // Get the memorial to verify the creator
      const memorial = await storage.getMemorial(message.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      // Check if user is the creator or an admin
      const admins = await storage.getMemorialAdmins(message.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);
      
      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to update scheduled messages for this memorial" });
      }
      
      // Validate and parse request body (partial update)
      const validatedData = insertScheduledMessageSchema.partial().parse(req.body);
      
      const updated = await storage.updateScheduledMessage(req.params.id, validatedData);
      
      if (!updated) {
        return res.status(404).json({ error: "Scheduled message not found" });
      }
      
      res.json(updated);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/scheduled-messages/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      
      // Get the scheduled message to find the memorial
      const message = await storage.getScheduledMessage(req.params.id);
      
      if (!message) {
        return res.status(404).json({ error: "Scheduled message not found" });
      }
      
      // Get the memorial to verify the creator
      const memorial = await storage.getMemorial(message.memorialId);
      
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      // Check if user is the creator or an admin
      const admins = await storage.getMemorialAdmins(message.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);
      
      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to delete scheduled messages for this memorial" });
      }
      
      await storage.deleteScheduledMessage(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all upcoming messages for the current user across all memorials
  app.get("/api/scheduled-messages/upcoming", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      
      // Get all memorials where the user is the creator
      const memorials = await storage.getMemorialsByCreatorEmail(userEmail);
      
      // Create a map of memorial IDs to names for quick lookup
      const memorialMap = new Map(memorials.map(m => [m.id, m.name]));
      
      // Get all scheduled messages for all memorials
      const allMessagesArrays = await Promise.all(
        memorials.map(memorial => storage.getScheduledMessagesByMemorialId(memorial.id))
      );
      
      // Flatten the array and add memorial names
      const messagesWithMemorialNames = allMessagesArrays.flat().map(message => ({
        ...message,
        memorialName: memorialMap.get(message.memorialId) || 'Unknown Memorial'
      }));
      
      // Sort by event date
      const sortedMessages = messagesWithMemorialNames.sort((a, b) => {
        if (!a.eventDate) return 1;
        if (!b.eventDate) return -1;
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      });
      
      res.json(sortedMessages);
    } catch (error: any) {
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
      // Parse and validate pagination parameters
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }
      
      const donations = await storage.getDonationsByFundraiserId(req.params.fundraiserId, limit, offset);
      
      // Backward compatible: return array by default, object with pagination if requested
      if (req.query.paginated === 'true') {
        const total = await storage.getDonationsByFundraiserIdCount(req.params.fundraiserId);
        res.json({
          data: donations,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + donations.length < total
          }
        });
      } else {
        res.json(donations);
      }
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

      const fundraiser = await storage.getFundraiser(req.params.fundraiserId);
      if (!fundraiser) {
        return res.status(404).json({ error: "Fundraiser not found" });
      }

      const platformFeePercent = Number(fundraiser.platformFeePercentage);
      const donationAmount = Number(amount);
      const platformFee = (donationAmount * platformFeePercent) / 100;

      const paymentIntent = await getStripe().paymentIntents.create({
        amount: Math.round(donationAmount * 100),
        currency: "usd",
        metadata: {
          fundraiserId: req.params.fundraiserId,
          memorialId: fundraiser.memorialId,
          platformFeePercentage: platformFeePercent.toString(),
          platformFeeAmount: platformFee.toFixed(2),
          donationAmount: donationAmount.toFixed(2),
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        platformFee: platformFee.toFixed(2),
        total: donationAmount.toFixed(2),
      });
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
      // Parse and validate pagination parameters
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }
      
      const memorials = await storage.listCelebrityMemorials(limit, offset);
      
      // Backward compatible: return array by default, object with pagination if requested
      if (req.query.paginated === 'true') {
        const total = await storage.getCelebrityMemorialsCount();
        res.json({
          data: memorials,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + memorials.length < total
          }
        });
      } else {
        res.json(memorials);
      }
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

  // Celebrity Fan Content routes (exclusive videos/photos from estates)
  // Public: Get published fan content for a celebrity memorial
  app.get("/api/celebrity-memorials/:celebrityMemorialId/fan-content", async (req, res) => {
    try {
      const content = await storage.listCelebrityFanContent(req.params.celebrityMemorialId);
      
      // Admin can see all content including unpublished, others only see published
      const adminView = req.query.admin === 'true' && req.user && (req.user as any).isAdmin;
      const filteredContent = adminView ? content : content.filter(c => c.isPublished);
      
      res.json(filteredContent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Public: Get individual fan content (only if published or admin)
  app.get("/api/celebrity-fan-content/:id", async (req, res) => {
    try {
      const content = await storage.getCelebrityFanContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // Only allow viewing if published OR user is admin
      const isAdminUser = req.user && (req.user as any).isAdmin;
      if (!content.isPublished && !isAdminUser) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // Only increment view count for published content
      if (content.isPublished) {
        await storage.incrementFanContentViews(req.params.id);
      }
      
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected: Create celebrity fan content (admin only - for estate uploads)
  app.post("/api/celebrity-memorials/:celebrityMemorialId/fan-content", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const data = insertCelebrityFanContentSchema.parse({
        ...req.body,
        celebrityMemorialId: req.params.celebrityMemorialId,
      });
      const content = await storage.createCelebrityFanContent(data);
      res.status(201).json(content);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Protected: Publish celebrity fan content (admin only)
  app.put("/api/celebrity-fan-content/:id/publish", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.publishCelebrityFanContent(req.params.id);
      const content = await storage.getCelebrityFanContent(req.params.id);
      res.json(content);
    } catch (error: any) {
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
      // Parse and validate pagination parameters
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }
      
      const { category } = req.query;
      const memorials = await storage.listEssentialWorkersMemorials(category as string, limit, offset);
      
      // Backward compatible: return array by default, object with pagination if requested
      if (req.query.paginated === 'true') {
        const total = await storage.getEssentialWorkersMemorialsCount(category as string);
        res.json({
          data: memorials,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + memorials.length < total
          }
        });
      } else {
        res.json(memorials);
      }
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

  // Hood Memorial routes
  app.get("/api/hood-memorials", async (req, res) => {
    try {
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }

      const city = req.query.city as string | undefined;
      const state = req.query.state as string | undefined;
      
      const [memorials, count] = await Promise.all([
        storage.listHoodMemorials(city, state, limit, offset),
        storage.getHoodMemorialsCount(city, state),
      ]);
      
      res.json({
        memorials,
        count,
        limit,
        offset,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hood-memorials/:id", async (req, res) => {
    try {
      const memorial = await storage.getHoodMemorial(req.params.id);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      res.json(memorial);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hood-memorials", async (req, res) => {
    try {
      const data = insertHoodMemorialSchema.parse(req.body);
      const memorial = await storage.createHoodMemorial(data);
      res.status(201).json(memorial);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/hood-memorials/:id", async (req, res) => {
    try {
      const data = insertHoodMemorialSchema.partial().parse(req.body);
      const memorial = await storage.updateHoodMemorial(req.params.id, data);
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

  app.delete("/api/hood-memorials/:id", async (req, res) => {
    try {
      await storage.deleteHoodMemorial(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Neighborhood Routes
  app.get("/api/neighborhoods", async (req, res) => {
    try {
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        limit = Math.min(parseInt(req.query.limit as string), 200);
      }
      if (req.query.offset) {
        offset = parseInt(req.query.offset as string);
      }
      
      const city = req.query.city as string | undefined;
      const state = req.query.state as string | undefined;

      const neighborhoods = await storage.getNeighborhoods(city, state, limit, offset);
      const count = await storage.getNeighborhoodsCount(city, state);
      
      res.json({ neighborhoods, count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/neighborhoods/:id", async (req, res) => {
    try {
      const neighborhood = await storage.getNeighborhood(req.params.id);
      if (!neighborhood) {
        return res.status(404).json({ error: "Neighborhood not found" });
      }
      res.json(neighborhood);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/neighborhoods", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      const data = insertNeighborhoodSchema.parse({
        ...req.body,
        creatorEmail: userEmail,
      });
      const neighborhood = await storage.createNeighborhood(data);
      res.status(201).json(neighborhood);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/neighborhoods/:id", isAuthenticated, async (req: any, res) => {
    try {
      const data = insertNeighborhoodSchema.partial().parse(req.body);
      const neighborhood = await storage.updateNeighborhood(req.params.id, data);
      if (!neighborhood) {
        return res.status(404).json({ error: "Neighborhood not found" });
      }
      res.json(neighborhood);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/neighborhoods/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteNeighborhood(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Alumni Memorial routes
  app.get("/api/alumni-memorials/schools/autocomplete", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const schools = await storage.getSchoolsAutocomplete(query);
      res.json(schools);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/alumni-memorials", async (req, res) => {
    try {
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }

      const filters = {
        schoolName: req.query.schoolName as string | undefined,
        graduationYear: req.query.graduationYear as string | undefined,
        major: req.query.major as string | undefined,
        isPublic: req.query.isPublic === 'true' ? true : req.query.isPublic === 'false' ? false : undefined,
      };
      
      const [memorials, count] = await Promise.all([
        storage.listAlumniMemorials(filters, limit, offset),
        storage.getAlumniMemorialsCount(filters),
      ]);
      
      res.json({
        memorials,
        count,
        limit,
        offset,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/alumni-memorials/:id", async (req, res) => {
    try {
      const memorial = await storage.getAlumniMemorial(req.params.id);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      res.json(memorial);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/alumni-memorials", async (req, res) => {
    try {
      const data = insertAlumniMemorialSchema.parse(req.body);
      const memorial = await storage.createAlumniMemorial(data);
      res.status(201).json(memorial);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/alumni-memorials/:id", async (req, res) => {
    try {
      const data = insertAlumniMemorialSchema.partial().parse(req.body);
      const memorial = await storage.updateAlumniMemorial(req.params.id, data);
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

  app.delete("/api/alumni-memorials/:id", async (req, res) => {
    try {
      await storage.deleteAlumniMemorial(req.params.id);
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
      // Parse and validate pagination parameters
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }
      
      const { category } = req.query;
      const ads = await storage.listAdvertisements(category as string, limit, offset);
      
      // Backward compatible: return array by default, object with pagination if requested
      if (req.query.paginated === 'true') {
        const total = await storage.getAdvertisementsCount(category as string);
        res.json({
          data: ads,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + ads.length < total
          }
        });
      } else {
        res.json(ads);
      }
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
      // Parse and validate pagination parameters
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }
      
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
      const partners = await storage.listFuneralHomePartners(isActive, limit, offset);
      
      // Backward compatible: return array by default, object with pagination if requested
      if (req.query.paginated === 'true') {
        const total = await storage.getFuneralHomePartnersCount(isActive);
        res.json({
          data: partners,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + partners.length < total
          }
        });
      } else {
        res.json(partners);
      }
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
      // Parse and validate pagination parameters
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }
      
      const facilities = await storage.listPrisonFacilities(limit, offset);
      
      // Backward compatible: return array by default, object with pagination if requested
      if (req.query.paginated === 'true') {
        const total = await storage.getPrisonFacilitiesCount();
        res.json({
          data: facilities,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + facilities.length < total
          }
        });
      } else {
        res.json(facilities);
      }
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
      // Parse and validate pagination parameters
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }
      
      const { status, memorialId } = req.query;
      const requests = await storage.listPrisonAccessRequests(
        status as string,
        memorialId as string,
        limit,
        offset
      );
      
      // Backward compatible: return array by default, object with pagination if requested
      if (req.query.paginated === 'true') {
        const total = await storage.getPrisonAccessRequestsCount(
          status as string,
          memorialId as string
        );
        res.json({
          data: requests,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + requests.length < total
          }
        });
      } else {
        res.json(requests);
      }
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

  // Analytics - Event Tracking (no auth required - works for all visitors)
  app.post("/api/analytics/event", async (req, res) => {
    try {
      const user = req.user as any;
      const eventData = {
        eventName: req.body.eventName,
        eventCategory: req.body.eventCategory || null,
        eventLabel: req.body.eventLabel || null,
        eventValue: req.body.eventValue || null,
        userId: user?.claims?.sub || null,
        sessionId: req.sessionID || null,
        metadata: req.body.metadata || null,
      };
      
      const validated = insertAnalyticsEventSchema.parse(eventData);
      await storage.trackEvent(validated);
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

  // Get recent users (Admin only)
  app.get("/api/admin/recent-users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getRecentUsers(7); // Last 7 days
      res.json(users);
    } catch (error: any) {
      console.error("Error fetching recent users:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generate Play Store Screenshots (Admin only)
  app.post("/api/admin/generate-screenshots", isAuthenticated, isAdmin, async (req, res) => {
    try {
      console.log('🎬 Starting Play Store screenshot generation...');
      
      // Import the screenshot generation function (using API-based version for reliability)
      const { generateScreenshots } = await import('../scripts/generate-screenshots-api');
      
      const pdfPath = await generateScreenshots();
      
      res.json({ 
        success: true, 
        message: 'Screenshots generated successfully',
        path: pdfPath,
        count: 8
      });
    } catch (error: any) {
      console.error("Error generating screenshots:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Download generated screenshots PDF (Admin only)
  app.get("/api/admin/download-screenshots", isAuthenticated, isAdmin, (req, res) => {
    try {
      const path = require('path');
      const pdfPath = path.join(process.cwd(), 'play-store-screenshots', 'opictuary-play-store-screenshots.pdf');
      
      if (!require('fs').existsSync(pdfPath)) {
        return res.status(404).json({ error: 'Screenshots PDF not found. Please generate it first.' });
      }

      res.download(pdfPath, 'opictuary-play-store-screenshots.pdf');
    } catch (error: any) {
      console.error("Error downloading screenshots:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Flower Shop Partnership Routes
  // List flower shops (with optional filters)
  app.get("/api/flower-shops", async (req, res) => {
    try {
      // Parse and validate pagination parameters
      let limit = 50;
      let offset = 0;
      
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({ error: "Invalid limit parameter" });
        }
        limit = Math.min(parsedLimit, 200);
      }
      
      if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          return res.status(400).json({ error: "Invalid offset parameter" });
        }
        offset = parsedOffset;
      }
      
      const { city, state } = req.query;
      const partners = await storage.listFlowerShopPartners(
        city as string | undefined,
        state as string | undefined,
        limit,
        offset
      );
      
      // Backward compatible: return array by default, object with pagination if requested
      if (req.query.paginated === 'true') {
        const total = await storage.getFlowerShopPartnersCount(
          city as string | undefined,
          state as string | undefined
        );
        res.json({
          data: partners,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + partners.length < total
          }
        });
      } else {
        res.json(partners);
      }
    } catch (error: any) {
      console.error("Error fetching flower shops:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific flower shop
  app.get("/api/flower-shops/:id", async (req, res) => {
    try {
      const partner = await storage.getFlowerShopPartner(req.params.id);
      if (!partner) {
        return res.status(404).json({ error: "Flower shop not found" });
      }
      res.json(partner);
    } catch (error: any) {
      console.error("Error fetching flower shop:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Register new flower shop partner
  app.post("/api/flower-shops/register", async (req, res) => {
    try {
      const validated = insertFlowerShopPartnerSchema.parse(req.body);
      const partner = await storage.createFlowerShopPartner(validated);
      res.status(201).json(partner);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating flower shop:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create flower order
  app.post("/api/flower-orders", async (req, res) => {
    try {
      // Validate shopId is present
      if (!req.body.shopId) {
        return res.status(400).json({ error: "Shop ID is required" });
      }

      // Get shop info for commission rate
      const shop = await storage.getFlowerShopPartner(req.body.shopId);
      if (!shop) {
        return res.status(404).json({ error: "Flower shop not found" });
      }

      // Calculate commission (keep as decimal strings)
      const orderAmount = parseFloat(req.body.orderAmount || "0");
      const commissionRate = parseFloat(shop.commissionRate.toString());
      const commissionAmount = (orderAmount * commissionRate) / 100;

      const orderData = {
        ...req.body,
        orderAmount: req.body.orderAmount,
        commissionAmount: commissionAmount.toFixed(2),
      };

      const validated = insertFlowerOrderSchema.parse(orderData);
      const order = await storage.createFlowerOrder(validated);

      // Create commission record
      await storage.createFlowerCommission({
        shopId: order.shopId,
        orderId: order.id,
        orderAmount: order.orderAmount,
        commissionAmount: order.commissionAmount,
        commissionRate: shop.commissionRate,
        status: "pending",
      });

      res.status(201).json(order);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating flower order:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get flower orders by memorial
  app.get("/api/memorials/:memorialId/flower-orders", async (req, res) => {
    try {
      const orders = await storage.getFlowerOrdersByMemorialId(req.params.memorialId);
      res.json(orders);
    } catch (error: any) {
      console.error("Error fetching flower orders:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get all flower orders for a shop
  app.get("/api/admin/flower-shops/:shopId/orders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await storage.getFlowerOrdersByShopId(req.params.shopId);
      res.json(orders);
    } catch (error: any) {
      console.error("Error fetching shop orders:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get flower shop commissions
  app.get("/api/admin/flower-shops/:shopId/commissions", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const commissions = await storage.getFlowerCommissionsByShopId(req.params.shopId);
      res.json(commissions);
    } catch (error: any) {
      console.error("Error fetching shop commissions:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Support System ====================

  // Get all support articles (optionally filtered by category)
  app.get("/api/support/articles", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const articles = await storage.getSupportArticles(category);
      res.json(articles);
    } catch (error: any) {
      console.error("Error fetching support articles:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get a single support article
  app.get("/api/support/articles/:id", async (req, res) => {
    try {
      const article = await storage.getSupportArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementArticleView(req.params.id);
      
      res.json(article);
    } catch (error: any) {
      console.error("Error fetching support article:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Mark article as helpful
  app.post("/api/support/articles/:id/helpful", async (req, res) => {
    try {
      await storage.incrementArticleHelpful(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error marking article as helpful:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all grief resources (optionally filtered by category)
  app.get("/api/support/grief-resources", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const resources = await storage.getGriefResources(category);
      res.json(resources);
    } catch (error: any) {
      console.error("Error fetching grief resources:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get a single grief resource
  app.get("/api/support/grief-resources/:id", async (req, res) => {
    try {
      const resource = await storage.getGriefResource(req.params.id);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error: any) {
      console.error("Error fetching grief resource:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Submit a support request
  app.post("/api/support/requests", async (req, res) => {
    try {
      const validated = insertSupportRequestSchema.parse(req.body);
      const request = await storage.createSupportRequest(validated);
      res.status(201).json(request);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating support request:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get all support requests (optionally filtered by status)
  app.get("/api/admin/support/requests", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const requests = await storage.getSupportRequests(status);
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching support requests:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get a single support request
  app.get("/api/admin/support/requests/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const request = await storage.getSupportRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json(request);
    } catch (error: any) {
      console.error("Error fetching support request:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Update support request status
  app.patch("/api/admin/support/requests/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const updateData: any = {};
      if (req.body.status !== undefined) updateData.status = req.body.status;
      if (req.body.resolution !== undefined) updateData.resolution = req.body.resolution;
      if (req.body.priority !== undefined) updateData.priority = req.body.priority;
      if (req.body.assignedTo !== undefined) updateData.assignedTo = req.body.assignedTo;
      
      const updated = await storage.updateSupportRequest(req.params.id, updateData);
      
      if (!updated) {
        return res.status(404).json({ error: "Request not found" });
      }
      
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating support request:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Resolve support request
  app.post("/api/admin/support/requests/:id/resolve", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { resolution } = req.body;
      if (!resolution) {
        return res.status(400).json({ error: "Resolution text is required" });
      }
      
      const updated = await storage.resolveSupportRequest(req.params.id, resolution);
      
      if (!updated) {
        return res.status(404).json({ error: "Request not found" });
      }
      
      res.json(updated);
    } catch (error: any) {
      console.error("Error resolving support request:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Create support article
  app.post("/api/admin/support/articles", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertSupportArticleSchema.parse(req.body);
      const article = await storage.createSupportArticle(validated);
      res.status(201).json(article);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating support article:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Update support article
  app.patch("/api/admin/support/articles/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const updated = await storage.updateSupportArticle(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating support article:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Delete support article
  app.delete("/api/admin/support/articles/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteSupportArticle(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting support article:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Create grief resource
  app.post("/api/admin/support/grief-resources", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertGriefResourceSchema.parse(req.body);
      const resource = await storage.createGriefResource(validated);
      res.status(201).json(resource);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating grief resource:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Update grief resource
  app.patch("/api/admin/support/grief-resources/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const updated = await storage.updateGriefResource(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating grief resource:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Delete grief resource
  app.delete("/api/admin/support/grief-resources/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteGriefResource(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting grief resource:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Memorial Events routes
  // List memorial events (with optional memorial filter and pagination)
  app.get("/api/memorial-events", async (req, res) => {
    try {
      const memorialId = req.query.memorialId as string | undefined;
      const paginated = req.query.paginated === 'true';
      
      // Validate pagination parameters
      const rawLimit = Number(req.query.limit);
      const rawOffset = Number(req.query.offset);
      const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 200) : 50;
      const offset = !isNaN(rawOffset) && rawOffset >= 0 ? rawOffset : 0;

      if (paginated) {
        const [events, total] = await Promise.all([
          storage.listMemorialEvents(memorialId, limit, offset),
          storage.getMemorialEventsCount(memorialId)
        ]);
        res.json({
          data: events,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total
          }
        });
      } else {
        const events = await storage.listMemorialEvents(memorialId, limit, offset);
        res.json(events);
      }
    } catch (error: any) {
      console.error("Error listing memorial events:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific memorial event
  app.get("/api/memorial-events/:id", async (req, res) => {
    try {
      const event = await storage.getMemorialEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Memorial event not found" });
      }
      res.json(event);
    } catch (error: any) {
      console.error("Error getting memorial event:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create a memorial event (authenticated users only)
  app.post("/api/memorial-events", isAuthenticated, async (req: any, res) => {
    try {
      const validated = insertMemorialEventSchema.parse(req.body);
      const userEmail = req.user.claims.email;
      
      // Check if user is the creator or an admin of the memorial
      const memorial = await storage.getMemorial(validated.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      const admins = await storage.getMemorialAdmins(validated.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);
      
      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to create events for this memorial" });
      }
      
      const event = await storage.createMemorialEvent(validated);
      res.status(201).json(event);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating memorial event:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update a memorial event (authenticated users only)
  app.patch("/api/memorial-events/:id", isAuthenticated, async (req: any, res) => {
    try {
      // Validate partial update data
      const validated = insertMemorialEventSchema.partial().parse(req.body);
      const userEmail = req.user.claims.email;
      
      // Get the event and verify authorization
      const event = await storage.getMemorialEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Memorial event not found" });
      }
      
      const memorial = await storage.getMemorial(event.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      const admins = await storage.getMemorialAdmins(event.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);
      
      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to update this event" });
      }
      
      // Strip immutable fields to prevent privilege escalation
      const { memorialId, ...safeUpdate } = validated;
      
      const updated = await storage.updateMemorialEvent(req.params.id, safeUpdate);
      res.json(updated);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating memorial event:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a memorial event (authenticated users only)
  app.delete("/api/memorial-events/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      
      // Get the event and verify authorization
      const event = await storage.getMemorialEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Memorial event not found" });
      }
      
      const memorial = await storage.getMemorial(event.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      const admins = await storage.getMemorialAdmins(event.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);
      
      if (!isCreator && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to delete this event" });
      }
      
      await storage.deleteMemorialEvent(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting memorial event:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Memorial Event RSVP routes
  // List RSVPs for a memorial event
  app.get("/api/memorial-events/:eventId/rsvps", async (req, res) => {
    try {
      const rsvps = await storage.listEventRsvps(req.params.eventId);
      res.json(rsvps);
    } catch (error: any) {
      console.error("Error listing event RSVPs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create an RSVP for a memorial event
  app.post("/api/memorial-events/:eventId/rsvps", async (req, res) => {
    try {
      const validated = insertMemorialEventRsvpSchema.parse({
        ...req.body,
        eventId: req.params.eventId
      });
      const rsvp = await storage.createEventRsvp(validated);
      res.status(201).json(rsvp);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating event RSVP:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update an RSVP
  app.patch("/api/event-rsvps/:id", isAuthenticated, async (req: any, res) => {
    try {
      // Validate partial update data
      const validated = insertMemorialEventRsvpSchema.partial().parse(req.body);
      const userEmail = req.user.claims.email;
      
      // Get the RSVP and verify authorization
      const rsvp = await storage.getEventRsvp(req.params.id);
      if (!rsvp) {
        return res.status(404).json({ error: "RSVP not found" });
      }
      
      // User can update RSVP if they created it OR are admin of the memorial
      const event = await storage.getMemorialEvent(rsvp.eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      const memorial = await storage.getMemorial(event.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      const admins = await storage.getMemorialAdmins(event.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);
      const isRsvpOwner = rsvp.email === userEmail;
      
      if (!isCreator && !isAdmin && !isRsvpOwner) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to update this RSVP" });
      }
      
      // Strip immutable fields to prevent privilege escalation
      const { eventId, email, ...safeUpdate } = validated;
      
      const updated = await storage.updateEventRsvp(req.params.id, safeUpdate);
      res.json(updated);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating event RSVP:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete an RSVP
  app.delete("/api/event-rsvps/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user.claims.email;
      
      // Get the RSVP and verify authorization
      const rsvp = await storage.getEventRsvp(req.params.id);
      if (!rsvp) {
        return res.status(404).json({ error: "RSVP not found" });
      }
      
      // User can delete RSVP if they created it OR are admin of the memorial
      const event = await storage.getMemorialEvent(rsvp.eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      const memorial = await storage.getMemorial(event.memorialId);
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
      
      const admins = await storage.getMemorialAdmins(event.memorialId);
      const isCreator = memorial.creatorEmail === userEmail;
      const isAdmin = admins.some(admin => admin.email === userEmail);
      const isRsvpOwner = rsvp.email === userEmail;
      
      if (!isCreator && !isAdmin && !isRsvpOwner) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to delete this RSVP" });
      }
      
      await storage.deleteEventRsvp(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting event RSVP:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Chat Assistant routes
  app.get("/api/chat/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const messages = await storage.getChatMessages(userId, limit);
      res.json(messages);
    } catch (error: any) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      await storage.createChatMessage({
        userId,
        role: "user",
        content: message
      });

      const chatHistory = await storage.getChatMessages(userId, 20);
      
      const { openai } = await import("./openai");

      const stream = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for a memorial platform called Opictuary. You help users navigate the platform, create memorials, understand features, and provide compassionate support. Be empathetic, professional, and respectful given the sensitive nature of the platform."
          },
          ...chatHistory.map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content
          }))
        ],
        max_completion_tokens: 8192,
        stream: true
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let fullResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      await storage.createChatMessage({
        userId,
        role: "assistant",
        content: fullResponse
      });

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error("Error in chat:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  });

  app.delete("/api/chat/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteChatMessages(userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting chat messages:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
