import type { Express } from "express";
import { z } from "zod";
import { paymentProcessor } from "./paymentProcessor";
import { prisonAccessManager } from "./prisonAccessManager";
import { productFulfillmentService } from "./productFulfillmentService";
import { verificationService } from "./verificationService";
import { storage } from "./storage";
import { isAuthenticated, isAdmin } from "./replitAuth";

// Payment schemas
const createCheckoutSessionSchema = z.object({
  type: z.enum(['donation', 'product', 'flower', 'prison_access', 'celebrity_donation', 'subscription']),
  memorialId: z.string().optional(),
  fundraiserId: z.string().optional(),
  productId: z.string().optional(),
  quantity: z.number().optional(),
  customization: z.any().optional(),
  celebrityMemorialId: z.string().optional(),
  prisonAccessRequestId: z.string().optional(),
  amount: z.number().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  customerEmail: z.string().email().optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  trackingNumber: z.string().optional(),
  shippingCarrier: z.string().optional(),
  notes: z.string().optional(),
});

const approveAccessRequestSchema = z.object({
  approvedBy: z.string(),
  approvedByEmail: z.string().email(),
  verificationNotes: z.string().optional(),
  expirationDate: z.string().optional(),
});

const verifyAlumniSchema = z.object({
  universityEmail: z.string().email(),
  studentId: z.string().optional(),
  graduationYear: z.number(),
  degreeName: z.string(),
  verificationDocuments: z.array(z.string()).optional(),
});

const verifyCelebrityEstateSchema = z.object({
  estateRepresentativeName: z.string(),
  estateRepresentativeEmail: z.string().email(),
  estateDocuments: z.array(z.string()),
  relationshipToDeceased: z.string(),
  legalDocumentationType: z.enum(['power_of_attorney', 'estate_executor', 'family_member', 'management_company']),
});

const verifyHoodMemorialSchema = z.object({
  verifiedBy: z.string(),
  communityReferences: z.array(z.string()),
  localNewsArticles: z.array(z.string()).optional(),
  socialMediaProfiles: z.array(z.string()).optional(),
});

export function registerExtendedRoutes(app: Express) {
  // ===== PAYMENT ENDPOINTS =====
  
  // Create Stripe checkout session
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const data = createCheckoutSessionSchema.parse(req.body);
      const session = await paymentProcessor.createCheckoutSession(data);
      
      res.json({ 
        sessionId: session.id,
        url: session.url 
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create checkout session' });
      }
    }
  });

  // Stripe webhook endpoint
  app.post("/api/stripe/webhook", async (req, res) => {
    try {
      const signature = req.headers['stripe-signature'] as string;
      
      if (!signature) {
        return res.status(400).json({ error: 'No signature provided' });
      }

      const result = await paymentProcessor.processWebhook(signature, req.body);
      res.json(result);
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: 'Webhook processing failed' });
    }
  });

  // Verify payment status
  app.get("/api/stripe/payment-status/:paymentIntentId", isAuthenticated, async (req: any, res) => {
    try {
      const { paymentIntentId } = req.params;
      const status = await paymentProcessor.verifyPaymentStatus(paymentIntentId);
      res.json({ status: status.status, amount: status.amount });
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify payment status' });
    }
  });

  // ===== PRISON ACCESS ENDPOINTS =====
  
  // Approve prison access request
  app.post("/api/prison-access-requests/:id/approve", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const data = approveAccessRequestSchema.parse(req.body);
      
      const result = await prisonAccessManager.approveRequest({
        requestId: id,
        ...data,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
      });

      res.json({ success: result });
    } catch (error) {
      console.error('Error approving request:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to approve request' });
      }
    }
  });

  // Deny prison access request
  app.post("/api/prison-access-requests/:id/deny", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ error: 'Denial reason is required' });
      }

      const result = await prisonAccessManager.denyRequest(id, reason, req.user.email);
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to deny request' });
    }
  });

  // Start prison access session
  app.post("/api/prison-access-sessions/start", async (req, res) => {
    try {
      const { requestId, facilityId } = req.body;
      
      if (!requestId || !facilityId) {
        return res.status(400).json({ error: 'Request ID and facility ID required' });
      }

      const sessionId = await prisonAccessManager.startSession({
        requestId,
        facilityId,
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
      });

      res.json({ sessionId });
    } catch (error) {
      console.error('Error starting session:', error);
      res.status(500).json({ error: 'Failed to start session' });
    }
  });

  // End prison access session
  app.post("/api/prison-access-sessions/:id/end", async (req, res) => {
    try {
      const { id } = req.params;
      const { reason = 'manual' } = req.body;
      
      const result = await prisonAccessManager.endSession(id, reason);
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to end session' });
    }
  });

  // Log session activity
  app.post("/api/prison-access-sessions/:id/activity", async (req, res) => {
    try {
      const { id } = req.params;
      const { activity, details } = req.body;
      
      if (!activity) {
        return res.status(400).json({ error: 'Activity description required' });
      }

      const result = await prisonAccessManager.logSessionActivity(id, activity, details);
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log activity' });
    }
  });

  // Get facility statistics
  app.get("/api/prison-facilities/:id/statistics", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      
      const stats = await prisonAccessManager.getFacilityStatistics(
        id,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  });

  // ===== PRODUCT ORDER ENDPOINTS =====
  
  // Process order for fulfillment
  app.post("/api/product-orders/:id/process", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const result = await productFulfillmentService.processOrderForFulfillment(id);
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process order' });
    }
  });

  // Update order status
  app.patch("/api/product-orders/:id/status", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const data = updateOrderStatusSchema.parse(req.body);
      
      const result = await productFulfillmentService.updateOrderStatus({
        orderId: id,
        ...data
      });

      res.json({ success: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to update order status' });
      }
    }
  });

  // Ship order
  app.post("/api/product-orders/:id/ship", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { trackingNumber, shippingCarrier, estimatedDeliveryDate } = req.body;
      
      if (!trackingNumber || !shippingCarrier) {
        return res.status(400).json({ error: 'Tracking number and carrier required' });
      }

      const result = await productFulfillmentService.shipOrder({
        orderId: id,
        trackingNumber,
        shippingCarrier,
        estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : undefined
      });

      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to ship order' });
    }
  });

  // Get order fulfillment status
  app.get("/api/product-orders/:id/fulfillment-status", async (req, res) => {
    try {
      const { id } = req.params;
      const status = await productFulfillmentService.getOrderFulfillmentStatus(id);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get order status' });
    }
  });

  // Update product inventory
  app.patch("/api/products/:id/inventory", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { quantity, operation } = req.body;
      
      if (typeof quantity !== 'number' || !['add', 'subtract', 'set'].includes(operation)) {
        return res.status(400).json({ error: 'Invalid quantity or operation' });
      }

      const result = await productFulfillmentService.updateInventory({
        productId: id,
        quantity,
        operation
      });

      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update inventory' });
    }
  });

  // Get fulfillment metrics
  app.get("/api/fulfillment/metrics", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const metrics = await productFulfillmentService.getFulfillmentMetrics(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get metrics' });
    }
  });

  // ===== VERIFICATION ENDPOINTS =====
  
  // Verify alumni memorial
  app.post("/api/alumni-memorials/:id/verify", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const data = verifyAlumniSchema.parse(req.body);
      
      const result = await verificationService.verifyAlumniMemorial({
        memorialId: id,
        ...data
      });

      res.json({ verified: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to verify alumni memorial' });
      }
    }
  });

  // Verify celebrity estate
  app.post("/api/celebrity-memorials/:id/verify-estate", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const data = verifyCelebrityEstateSchema.parse(req.body);
      
      const result = await verificationService.verifyCelebrityEstate({
        memorialId: id,
        ...data
      });

      res.json({ submitted: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to submit estate verification' });
      }
    }
  });

  // Approve celebrity estate verification
  app.post("/api/celebrity-memorials/:id/approve-estate", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      const result = await verificationService.approveCelebrityEstateVerification(
        id,
        req.user.email,
        notes
      );

      res.json({ approved: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to approve estate' });
    }
  });

  // Verify hood memorial
  app.post("/api/hood-memorials/:id/verify", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const data = verifyHoodMemorialSchema.parse(req.body);
      
      const result = await verificationService.verifyHoodMemorial({
        memorialId: id,
        ...data
      });

      res.json({ verified: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to verify hood memorial' });
      }
    }
  });

  // Moderate hood memorial
  app.post("/api/hood-memorials/:id/moderate", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { action, reason } = req.body;
      
      if (!['approve', 'flag', 'remove'].includes(action)) {
        return res.status(400).json({ error: 'Invalid moderation action' });
      }

      const result = await verificationService.moderateHoodMemorial(id, action, reason);
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to moderate memorial' });
    }
  });

  // Get nearby hood memorials
  app.get("/api/hood-memorials/nearby", async (req, res) => {
    try {
      const { lat, lng, radius = '10' } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude required' });
      }

      const memorials = await verificationService.getNearbyHoodMemorials(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseFloat(radius as string)
      );

      res.json(memorials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get nearby memorials' });
    }
  });

  // ===== PRODUCT ORDERS LIST =====
  
  // Get all product orders
  app.get("/api/product-orders", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const orders = await storage.getProductOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get orders' });
    }
  });

  // Get single product order
  app.get("/api/product-orders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const order = await storage.getProductOrder(req.params.id);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get order' });
    }
  });
}