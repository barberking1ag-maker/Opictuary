import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { z } from "zod";
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
} from "@shared/schema";

const inviteCodeSchema = z.object({
  inviteCode: z.string().min(1, "Invite code is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
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
      const data = insertMemorialSchema.parse(req.body);
      const memorial = await storage.createMemorial(data);
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

  app.post("/api/fundraisers/:fundraiserId/donations", async (req, res) => {
    try {
      const data = insertDonationSchema.parse({
        ...req.body,
        fundraiserId: req.params.fundraiserId,
      });
      const donation = await storage.createDonation(data);
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

  // Grief Support routes
  app.get("/api/memorials/:memorialId/grief-support", async (req, res) => {
    try {
      const support = await storage.getGriefSupportByMemorialId(req.params.memorialId);
      res.json(support || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/memorials/:memorialId/grief-support", async (req, res) => {
    try {
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

  const httpServer = createServer(app);
  return httpServer;
}
