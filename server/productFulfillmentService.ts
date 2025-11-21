import { db } from "./db";
import { 
  productOrders, 
  products,
  memorials,
  flowerOrders,
  flowerShopPartners,
  flowerCommissions
} from "@shared/schema";
import { eq, and, or, gte, lte, ne, inArray, isNotNull } from "drizzle-orm";
import { emailService } from "./emailService";

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface UpdateOrderStatusData {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
  shippingCarrier?: string;
  notes?: string;
}

export interface InventoryUpdateData {
  productId: string;
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
}

export interface FulfillmentData {
  orderId: string;
  trackingNumber: string;
  shippingCarrier: string;
  estimatedDeliveryDate?: Date;
}

class ProductFulfillmentService {
  /**
   * Process a new order for fulfillment
   */
  async processOrderForFulfillment(orderId: string): Promise<boolean> {
    try {
      const order = await db.query.productOrders.findFirst({
        where: eq(productOrders.id, orderId),
        with: {
          product: true
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.paymentStatus !== 'paid') {
        throw new Error('Order not paid');
      }

      // Update order status to processing
      await db.update(productOrders)
        .set({
          status: 'processing',
          processingStartedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(productOrders.id, orderId));

      // Check inventory (if tracking inventory)
      const product = await db.query.products.findFirst({
        where: eq(products.id, order.productId)
      });

      if (product && product.stockQuantity !== null) {
        const newStock = product.stockQuantity - order.quantity;
        
        if (newStock < 0) {
          // Insufficient stock
          await this.handleInsufficientStock(order);
          return false;
        }

        // Update product stock
        await db.update(products)
          .set({
            stockQuantity: newStock,
            updatedAt: new Date()
          })
          .where(eq(products.id, product.id));
      }

      // Send order to fulfillment center (in production, this would integrate with 3PL API)
      await this.sendToFulfillmentCenter(order);

      // Send order confirmation email
      await this.sendOrderConfirmationEmail(order);

      console.log(`[FULFILLMENT] Processing order ${orderId} for fulfillment`);
      return true;
    } catch (error) {
      console.error('[FULFILLMENT] Error processing order:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(data: UpdateOrderStatusData): Promise<boolean> {
    const { orderId, status, trackingNumber, shippingCarrier, notes } = data;

    try {
      const order = await db.query.productOrders.findFirst({
        where: eq(productOrders.id, orderId)
      });

      if (!order) {
        throw new Error('Order not found');
      }

      const updateData: any = {
        status: status,
        updatedAt: new Date()
      };

      // Add specific fields based on status
      switch (status) {
        case 'shipped':
          updateData.shippedAt = new Date();
          updateData.trackingNumber = trackingNumber;
          updateData.shippingCarrier = shippingCarrier;
          break;
        case 'delivered':
          updateData.deliveredAt = new Date();
          break;
        case 'cancelled':
          updateData.cancelledAt = new Date();
          updateData.cancellationReason = notes;
          // Restore inventory if needed
          await this.restoreInventory(order);
          break;
      }

      if (notes) {
        updateData.fulfillmentNotes = notes;
      }

      await db.update(productOrders)
        .set(updateData)
        .where(eq(productOrders.id, orderId));

      // Send status update email
      if (['shipped', 'delivered', 'cancelled'].includes(status)) {
        await this.sendStatusUpdateEmail(order, status, trackingNumber, shippingCarrier);
      }

      console.log(`[FULFILLMENT] Updated order ${orderId} status to ${status}`);
      return true;
    } catch (error) {
      console.error('[FULFILLMENT] Error updating order status:', error);
      throw error;
    }
  }

  /**
   * Ship an order
   */
  async shipOrder(data: FulfillmentData): Promise<boolean> {
    const { orderId, trackingNumber, shippingCarrier, estimatedDeliveryDate } = data;

    try {
      const order = await db.query.productOrders.findFirst({
        where: eq(productOrders.id, orderId)
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'processing') {
        throw new Error('Order is not in processing status');
      }

      await db.update(productOrders)
        .set({
          status: 'shipped',
          shippedAt: new Date(),
          trackingNumber: trackingNumber,
          shippingCarrier: shippingCarrier,
          estimatedDeliveryDate: estimatedDeliveryDate,
          updatedAt: new Date()
        })
        .where(eq(productOrders.id, orderId));

      // Send shipping confirmation email
      await this.sendShippingConfirmationEmail(order, trackingNumber, shippingCarrier);

      console.log(`[FULFILLMENT] Shipped order ${orderId}`);
      return true;
    } catch (error) {
      console.error('[FULFILLMENT] Error shipping order:', error);
      throw error;
    }
  }

  /**
   * Update product inventory
   */
  async updateInventory(data: InventoryUpdateData): Promise<boolean> {
    const { productId, quantity, operation } = data;

    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId)
      });

      if (!product) {
        throw new Error('Product not found');
      }

      let newStock: number;
      const currentStock = product.stockQuantity || 0;

      switch (operation) {
        case 'add':
          newStock = currentStock + quantity;
          break;
        case 'subtract':
          newStock = Math.max(0, currentStock - quantity);
          break;
        case 'set':
          newStock = quantity;
          break;
        default:
          throw new Error('Invalid operation');
      }

      await db.update(products)
        .set({
          stockQuantity: newStock,
          updatedAt: new Date()
        })
        .where(eq(products.id, productId));

      // Check if low stock alert needed
      if (newStock <= 10) {
        await this.sendLowStockAlert(product, newStock);
      }

      console.log(`[FULFILLMENT] Updated inventory for product ${productId}: ${newStock}`);
      return true;
    } catch (error) {
      console.error('[FULFILLMENT] Error updating inventory:', error);
      throw error;
    }
  }

  /**
   * Get order fulfillment status
   */
  async getOrderFulfillmentStatus(orderId: string): Promise<any> {
    try {
      const order = await db.query.productOrders.findFirst({
        where: eq(productOrders.id, orderId),
        with: {
          product: true
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return {
        orderId: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        shippingCarrier: order.shippingCarrier,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        product: {
          name: order.product.name,
          sku: order.product.sku
        },
        quantity: order.quantity,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        shippingAddress: order.shippingAddress
      };
    } catch (error) {
      console.error('[FULFILLMENT] Error getting order status:', error);
      throw error;
    }
  }

  /**
   * Process flower order with partner
   */
  async processFlowerOrder(orderId: string, partnerId: string): Promise<boolean> {
    try {
      const order = await db.query.flowerOrders.findFirst({
        where: eq(flowerOrders.id, orderId)
      });

      if (!order) {
        throw new Error('Flower order not found');
      }

      const partner = await db.query.flowerShopPartners.findFirst({
        where: eq(flowerShopPartners.id, partnerId)
      });

      if (!partner) {
        throw new Error('Partner not found');
      }

      // Update order with partner assignment
      await db.update(flowerOrders)
        .set({
          partnerId: partnerId,
          status: 'assigned',
          assignedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(flowerOrders.id, orderId));

      // Calculate and create commission record
      const orderAmount = parseFloat(order.totalAmount);
      const commissionAmount = orderAmount * (partner.commissionRate / 100);

      await db.insert(flowerCommissions).values({
        partnerId: partnerId,
        orderId: orderId,
        orderAmount: orderAmount.toString(),
        commissionRate: partner.commissionRate.toString(),
        commissionAmount: commissionAmount.toString(),
        status: 'pending',
        calculatedAt: new Date()
      });

      // Send order to partner (in production, this would use partner's API)
      await this.sendFlowerOrderToPartner(order, partner);

      console.log(`[FULFILLMENT] Assigned flower order ${orderId} to partner ${partnerId}`);
      return true;
    } catch (error) {
      console.error('[FULFILLMENT] Error processing flower order:', error);
      throw error;
    }
  }

  /**
   * Handle insufficient stock scenario
   */
  private async handleInsufficientStock(order: any): Promise<void> {
    await db.update(productOrders)
      .set({
        status: 'pending',
        fulfillmentNotes: 'Insufficient stock - awaiting restock',
        updatedAt: new Date()
      })
      .where(eq(productOrders.id, order.id));

    // Send notification to admin and customer
    console.log(`[FULFILLMENT] Insufficient stock for order ${order.id}`);
  }

  /**
   * Restore inventory for cancelled order
   */
  private async restoreInventory(order: any): Promise<void> {
    const product = await db.query.products.findFirst({
      where: eq(products.id, order.productId)
    });

    if (product && product.stockQuantity !== null) {
      await db.update(products)
        .set({
          stockQuantity: product.stockQuantity + order.quantity,
          updatedAt: new Date()
        })
        .where(eq(products.id, product.id));

      console.log(`[FULFILLMENT] Restored ${order.quantity} units to product ${product.id}`);
    }
  }

  /**
   * Send order to fulfillment center
   */
  private async sendToFulfillmentCenter(order: any): Promise<void> {
    // In production, this would integrate with 3PL API
    // For now, log the action
    console.log(`[FULFILLMENT] Sending order ${order.id} to fulfillment center`);
    
    // Simulate API call
    const fulfillmentData = {
      orderId: order.id,
      productSKU: order.product?.sku,
      quantity: order.quantity,
      shippingAddress: order.shippingAddress,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customization: order.customizationDetails
    };

    // In production: await thirdPartyLogisticsAPI.createOrder(fulfillmentData);
  }

  /**
   * Send flower order to partner
   */
  private async sendFlowerOrderToPartner(order: any, partner: any): Promise<void> {
    // In production, this would integrate with partner's API
    console.log(`[FULFILLMENT] Sending flower order ${order.id} to partner ${partner.businessName}`);
    
    // Partner would receive order details via API or email
  }

  /**
   * Send order confirmation email
   */
  private async sendOrderConfirmationEmail(order: any): Promise<void> {
    if (!order.customerEmail) return;

    const html = `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Status:</strong> Processing</p>
      <p><strong>Total:</strong> $${order.totalPrice}</p>
      <p>We'll send you a shipping confirmation email once your order ships.</p>
    `;

    await emailService.sendEmail({
      to: order.customerEmail,
      subject: 'Order Confirmation - Opictuary',
      html: html,
      text: html.replace(/<[^>]*>/g, '')
    });
  }

  /**
   * Send shipping confirmation email
   */
  private async sendShippingConfirmationEmail(order: any, trackingNumber: string, carrier: string): Promise<void> {
    if (!order.customerEmail) return;

    const html = `
      <h2>Your Order Has Shipped!</h2>
      <p>Good news! Your order has been shipped.</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p><strong>Carrier:</strong> ${carrier}</p>
      <p>You can track your package using the tracking number above.</p>
    `;

    await emailService.sendEmail({
      to: order.customerEmail,
      subject: 'Shipping Confirmation - Opictuary',
      html: html,
      text: html.replace(/<[^>]*>/g, '')
    });
  }

  /**
   * Send status update email
   */
  private async sendStatusUpdateEmail(order: any, status: string, trackingNumber?: string, carrier?: string): Promise<void> {
    if (!order.customerEmail) return;

    let subject = 'Order Status Update - Opictuary';
    let message = '';

    switch (status) {
      case 'delivered':
        subject = 'Your Order Has Been Delivered!';
        message = 'Your order has been successfully delivered.';
        break;
      case 'cancelled':
        subject = 'Order Cancelled';
        message = 'Your order has been cancelled. If you paid for this order, a refund will be processed.';
        break;
    }

    const html = `
      <h2>${subject}</h2>
      <p>${message}</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
    `;

    await emailService.sendEmail({
      to: order.customerEmail,
      subject: subject,
      html: html,
      text: html.replace(/<[^>]*>/g, '')
    });
  }

  /**
   * Send low stock alert
   */
  private async sendLowStockAlert(product: any, currentStock: number): Promise<void> {
    console.log(`[FULFILLMENT] Low stock alert for product ${product.name}: ${currentStock} units remaining`);
    
    // In production, send email to admin
    // await emailService.sendAdminAlert({...});
  }

  /**
   * Get fulfillment metrics
   */
  async getFulfillmentMetrics(startDate: Date, endDate: Date): Promise<any> {
    try {
      const orders = await db.query.productOrders.findMany({
        where: and(
          gte(productOrders.createdAt, startDate),
          lte(productOrders.createdAt, endDate)
        )
      });

      const totalOrders = orders.length;
      const shippedOrders = orders.filter(o => o.status === 'shipped').length;
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
      const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
      
      const averageFulfillmentTime = orders
        .filter(o => o.shippedAt && o.createdAt)
        .reduce((sum, o) => {
          const time = o.shippedAt!.getTime() - o.createdAt.getTime();
          return sum + time;
        }, 0) / shippedOrders || 0;

      return {
        totalOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        fulfillmentRate: totalOrders > 0 ? (deliveredOrders / totalOrders * 100).toFixed(2) + '%' : '0%',
        averageFulfillmentHours: Math.round(averageFulfillmentTime / (1000 * 60 * 60))
      };
    } catch (error) {
      console.error('[FULFILLMENT] Error getting metrics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const productFulfillmentService = new ProductFulfillmentService();