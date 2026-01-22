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
          status: 'processing'
        })
        .where(eq(productOrders.id, orderId));

      // Check inventory (if tracking inventory)
      const product = await db.query.products.findFirst({
        where: eq(products.id, order.productId)
      });

      if (product && product.stockStatus === 'out_of_stock') {
        // Insufficient stock
        await this.handleInsufficientStock(order);
        return false;
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
          trackingNumber: trackingNumber,
          carrier: shippingCarrier,
          estimatedDelivery: estimatedDeliveryDate
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

      let newStockStatus: string;

      switch (operation) {
        case 'add':
          newStockStatus = quantity > 10 ? 'in_stock' : (quantity > 0 ? 'low_stock' : 'out_of_stock');
          break;
        case 'subtract':
          newStockStatus = 'low_stock';
          break;
        case 'set':
          newStockStatus = quantity > 10 ? 'in_stock' : (quantity > 0 ? 'low_stock' : 'out_of_stock');
          break;
        default:
          throw new Error('Invalid operation');
      }

      await db.update(products)
        .set({
          stockStatus: newStockStatus,
          updatedAt: new Date()
        })
        .where(eq(products.id, productId));

      // Check if low stock alert needed
      if (newStockStatus === 'low_stock' || newStockStatus === 'out_of_stock') {
        await this.sendLowStockAlert(product, quantity);
      }

      console.log(`[FULFILLMENT] Updated inventory for product ${productId}: ${newStockStatus}`);
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
        carrier: order.carrier,
        deliveredAt: order.deliveredAt,
        estimatedDelivery: order.estimatedDelivery,
        product: {
          name: (order.product as any)?.name
        },
        quantity: order.quantity,
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
          status: 'assigned'
        })
        .where(eq(flowerOrders.id, orderId));

      // Calculate and create commission record
      const orderAmountValue = parseFloat(order.orderAmount);
      const commissionAmount = orderAmountValue * (parseFloat(partner.commissionRate) / 100);

      await db.insert(flowerCommissions).values({
        shopId: partnerId,
        orderId: orderId,
        orderAmount: order.orderAmount,
        commissionAmount: commissionAmount.toString(),
        commissionRate: partner.commissionRate
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
        internalNotes: 'Insufficient stock - awaiting restock'
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

    if (product) {
      await db.update(products)
        .set({
          stockStatus: 'in_stock',
          updatedAt: new Date()
        })
        .where(eq(products.id, product.id));

      console.log(`[FULFILLMENT] Restored stock for product ${product.id}`);
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
      
      const ordersWithDates = orders.filter(o => o.deliveredAt && o.createdAt);
      const averageFulfillmentTime = ordersWithDates.length > 0 
        ? ordersWithDates.reduce((sum, o) => {
            const time = o.deliveredAt!.getTime() - o.createdAt!.getTime();
            return sum + time;
          }, 0) / ordersWithDates.length 
        : 0;

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