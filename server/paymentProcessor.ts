import Stripe from "stripe";
import { db } from "./db";
import { 
  donations, 
  fundraisers, 
  productOrders, 
  products, 
  memorials,
  flowerOrders,
  prisonPayments,
  celebrityDonations,
  partnerCommissions
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Initialize Stripe with secret key - gracefully handle missing configuration
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'  // Use valid Stripe API version
    });
    console.log('[PAYMENT PROCESSOR] Stripe initialized successfully');
  } catch (error) {
    console.warn('[PAYMENT PROCESSOR] Failed to initialize Stripe:', error);
    console.warn('[PAYMENT PROCESSOR] Payment features will be disabled');
  }
} else {
  console.warn('[PAYMENT PROCESSOR] Stripe secret key not configured. Payment features will be disabled');
}

// Platform fee percentage (10% for Opictuary)
const PLATFORM_FEE_PERCENTAGE = 0.10;
const PRISON_ACCESS_FEE = 50.00; // $50 for prison access

export interface CreateCheckoutSessionData {
  type: 'donation' | 'product' | 'flower' | 'prison_access' | 'celebrity_donation' | 'subscription';
  memorialId?: string;
  fundraiserId?: string;
  productId?: string;
  quantity?: number;
  customization?: any;
  celebrityMemorialId?: string;
  prisonAccessRequestId?: string;
  amount?: number;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export interface ProcessWebhookData {
  signature: string;
  payload: string | Buffer;
}

class PaymentProcessor {
  /**
   * Create a Stripe checkout session for various payment types
   */
  async createCheckoutSession(data: CreateCheckoutSessionData): Promise<Stripe.Checkout.Session> {
    if (!stripe) {
      console.error('[PAYMENT PROCESSOR] Cannot create checkout session - Stripe not initialized');
      throw new Error('Payment processing is not available. Please configure Stripe.');
    }
    
    const { type, successUrl, cancelUrl, customerEmail, metadata = {} } = data;

    try {
      let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      let paymentIntentData: Stripe.Checkout.SessionCreateParams.PaymentIntentData | undefined;

      switch (type) {
        case 'donation':
          if (!data.fundraiserId || !data.amount) {
            throw new Error('Fundraiser ID and amount required for donations');
          }

          // Get fundraiser details
          const fundraiser = await db.query.fundraisers.findFirst({
            where: eq(fundraisers.id, data.fundraiserId)
          });

          if (!fundraiser) {
            throw new Error('Fundraiser not found');
          }

          lineItems = [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Donation to ${fundraiser.title}`,
                description: fundraiser.description || undefined,
              },
              unit_amount: Math.round(data.amount * 100), // Convert to cents
            },
            quantity: 1,
          }];

          // Add platform fee as application fee
          paymentIntentData = {
            application_fee_amount: Math.round(data.amount * PLATFORM_FEE_PERCENTAGE * 100),
            metadata: {
              ...metadata,
              type: 'donation',
              fundraiserId: data.fundraiserId,
              memorialId: fundraiser.memorialId,
            }
          };
          break;

        case 'product':
          if (!data.productId || !data.quantity) {
            throw new Error('Product ID and quantity required for product purchases');
          }

          // Get product details
          const product = await db.query.products.findFirst({
            where: eq(products.id, data.productId)
          });

          if (!product) {
            throw new Error('Product not found');
          }

          lineItems = [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.description || undefined,
                images: product.images ? [product.images[0]] : undefined,
              },
              unit_amount: Math.round(parseFloat(product.basePrice) * 100),
            },
            quantity: data.quantity,
          }];

          // Add platform fee
          const productTotal = parseFloat(product.basePrice) * data.quantity;
          paymentIntentData = {
            application_fee_amount: Math.round(productTotal * PLATFORM_FEE_PERCENTAGE * 100),
            metadata: {
              ...metadata,
              type: 'product',
              productId: data.productId,
              quantity: data.quantity.toString(),
              customization: JSON.stringify(data.customization || {}),
            }
          };
          break;

        case 'prison_access':
          if (!data.prisonAccessRequestId) {
            throw new Error('Prison access request ID required');
          }

          lineItems = [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Prison Memorial Access',
                description: 'Secure access to view memorial from correctional facility',
              },
              unit_amount: Math.round(PRISON_ACCESS_FEE * 100),
            },
            quantity: 1,
          }];

          paymentIntentData = {
            metadata: {
              ...metadata,
              type: 'prison_access',
              requestId: data.prisonAccessRequestId,
            }
          };
          break;

        case 'celebrity_donation':
          if (!data.celebrityMemorialId || !data.amount) {
            throw new Error('Celebrity memorial ID and amount required');
          }

          lineItems = [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Celebrity Memorial Donation',
                description: 'Support and honor a celebrity\'s legacy',
              },
              unit_amount: Math.round(data.amount * 100),
            },
            quantity: 1,
          }];

          paymentIntentData = {
            application_fee_amount: Math.round(data.amount * PLATFORM_FEE_PERCENTAGE * 100),
            metadata: {
              ...metadata,
              type: 'celebrity_donation',
              celebrityMemorialId: data.celebrityMemorialId,
            }
          };
          break;

        case 'subscription':
          // Monthly subscription for premium features
          lineItems = [{
            price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID || 'price_default', // Set this in env
            quantity: 1,
          }];

          paymentIntentData = {
            metadata: {
              ...metadata,
              type: 'subscription',
              memorialId: data.memorialId || '',
            }
          };
          break;

        default:
          throw new Error(`Invalid payment type: ${type}`);
      }

      // Create the checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: type === 'subscription' ? 'subscription' : 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customerEmail,
        payment_intent_data: type !== 'subscription' ? paymentIntentData : undefined,
      });

      return session;
    } catch (error) {
      console.error('[PAYMENT PROCESSOR] Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Process Stripe webhook events
   */
  async processWebhook(signature: string, payload: string | Buffer): Promise<any> {
    try {
      if (!stripe) {
        console.warn('[PAYMENT PROCESSOR] Cannot process webhook - Stripe not initialized');
        return { received: true, warning: 'Stripe not configured' };
      }
      
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        console.warn('[PAYMENT PROCESSOR] Webhook secret not configured');
        return { received: true };
      }

      // Verify webhook signature
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      console.log(`[PAYMENT PROCESSOR] Processing webhook event: ${event.type}`);

      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
          break;

        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
          break;

        default:
          console.log(`[PAYMENT PROCESSOR] Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('[PAYMENT PROCESSOR] Webhook processing error:', error);
      throw error;
    }
  }

  /**
   * Handle successful checkout completion
   */
  private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const metadata = session.payment_intent && typeof session.payment_intent === 'object' 
      ? session.payment_intent.metadata 
      : {};

    const type = metadata.type;

    switch (type) {
      case 'donation':
        await this.recordDonation(session, metadata);
        break;

      case 'product':
        await this.createProductOrder(session, metadata);
        break;

      case 'prison_access':
        await this.approveAndActivatePrisonAccess(metadata.requestId);
        break;

      case 'celebrity_donation':
        await this.recordCelebrityDonation(session, metadata);
        break;

      default:
        console.log(`[PAYMENT PROCESSOR] Unknown payment type in checkout: ${type}`);
    }
  }

  /**
   * Record a donation in the database
   */
  private async recordDonation(session: Stripe.Checkout.Session, metadata: any) {
    try {
      const amount = session.amount_total ? session.amount_total / 100 : 0;
      
      await db.insert(donations).values({
        fundraiserId: metadata.fundraiserId,
        donorName: session.customer_details?.name || 'Anonymous',
        amount: amount.toString(),
        platformFeeAmount: (amount * PLATFORM_FEE_PERCENTAGE).toString(),
        isAnonymous: false,
        stripePaymentId: session.payment_intent?.toString(),
      });

      // Update fundraiser total
      const fundraiser = await db.query.fundraisers.findFirst({
        where: eq(fundraisers.id, metadata.fundraiserId)
      });

      if (fundraiser && fundraiser.currentAmount) {
        const currentRaised = parseFloat(fundraiser.currentAmount);
        const newTotal = currentRaised + amount;

        await db.update(fundraisers)
          .set({ 
            currentAmount: newTotal.toString()
          })
          .where(eq(fundraisers.id, metadata.fundraiserId));
      }

      console.log(`[PAYMENT PROCESSOR] Recorded donation of $${amount} to fundraiser ${metadata.fundraiserId}`);
    } catch (error) {
      console.error('[PAYMENT PROCESSOR] Error recording donation:', error);
    }
  }

  /**
   * Create a product order after successful payment
   */
  private async createProductOrder(session: Stripe.Checkout.Session, metadata: any) {
    try {
      const amount = session.amount_total ? session.amount_total / 100 : 0;
      
      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Get product details to calculate pricing
      const product = await db.query.products.findFirst({
        where: eq(products.id, metadata.productId)
      });
      
      if (!product) {
        throw new Error('Product not found for order creation');
      }
      
      const quantity = parseInt(metadata.quantity) || 1;
      const subtotal = parseFloat(product.basePrice) * quantity;
      
      await db.insert(productOrders).values({
        orderNumber: orderNumber,
        userId: metadata.userId || 'guest', // Would need to pass userId in metadata
        productId: metadata.productId,
        quantity: quantity,
        customization: metadata.customization ? JSON.parse(metadata.customization) : undefined,
        subtotal: subtotal.toString(),
        shipping: '0', // Could calculate based on location
        tax: '0', // Could calculate based on location
        total: amount.toString(),
        shippingAddress: {
          fullName: session.customer_details?.name || '',
          addressLine1: session.shipping_details?.address?.line1 || '',
          addressLine2: session.shipping_details?.address?.line2,
          city: session.shipping_details?.address?.city || '',
          state: session.shipping_details?.address?.state || '',
          zipCode: session.shipping_details?.address?.postal_code || '',
          country: session.shipping_details?.address?.country || 'US',
          phone: session.customer_details?.phone || '',
        },
        status: 'processing',
        paymentStatus: 'paid',
        paymentIntentId: session.payment_intent?.toString(),
      });

      console.log(`[PAYMENT PROCESSOR] Created product order ${orderNumber} for product ${metadata.productId}`);
    } catch (error) {
      console.error('[PAYMENT PROCESSOR] Error creating product order:', error);
    }
  }

  /**
   * Approve and activate prison access after payment
   */
  private async approveAndActivatePrisonAccess(requestId: string) {
    try {
      // This would update the prison access request to approved
      // and create a prison payment record
      console.log(`[PAYMENT PROCESSOR] Approving prison access request ${requestId}`);
      
      // Implementation would go here to update prison_access_requests
      // and create prison_payments record
    } catch (error) {
      console.error('[PAYMENT PROCESSOR] Error approving prison access:', error);
    }
  }

  /**
   * Record a celebrity memorial donation
   */
  private async recordCelebrityDonation(session: Stripe.Checkout.Session, metadata: any) {
    try {
      const amount = session.amount_total ? session.amount_total / 100 : 0;
      const platformAmount = amount * PLATFORM_FEE_PERCENTAGE;
      const charityAmount = amount - platformAmount;
      
      await db.insert(celebrityDonations).values({
        celebrityMemorialId: metadata.celebrityMemorialId,
        email: session.customer_details?.email || 'anonymous@example.com',
        amount: amount.toString(),
        charityAmount: charityAmount.toString(),
        platformAmount: platformAmount.toString(),
        stripePaymentId: session.payment_intent?.toString(),
      });

      console.log(`[PAYMENT PROCESSOR] Recorded celebrity donation of $${amount}`);
    } catch (error) {
      console.error('[PAYMENT PROCESSOR] Error recording celebrity donation:', error);
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log(`[PAYMENT PROCESSOR] Payment succeeded: ${paymentIntent.id}`);
    // Additional payment success handling
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    console.log(`[PAYMENT PROCESSOR] Payment failed: ${paymentIntent.id}`);
    // Handle payment failure (send notification, update order status, etc.)
  }

  /**
   * Handle subscription updates
   */
  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    console.log(`[PAYMENT PROCESSOR] Subscription updated: ${subscription.id}`);
    // Update subscription status in database
  }

  /**
   * Handle subscription cancellation
   */
  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    console.log(`[PAYMENT PROCESSOR] Subscription canceled: ${subscription.id}`);
    // Update subscription status to canceled
  }

  /**
   * Calculate platform fees for a given amount
   */
  calculatePlatformFee(amount: number): number {
    return Math.round(amount * PLATFORM_FEE_PERCENTAGE * 100) / 100;
  }

  /**
   * Verify payment status for an order or donation
   */
  async verifyPaymentStatus(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
    try {
      if (!stripe) {
        console.warn('[PAYMENT PROCESSOR] Stripe not initialized - cannot verify payment status');
        return null;
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('[PAYMENT PROCESSOR] Error verifying payment status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentProcessor = new PaymentProcessor();