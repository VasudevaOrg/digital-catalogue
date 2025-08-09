// src/lib/whatsapp.ts
import { Order, Customer, WhatsAppMessage } from "@/types";
import { api } from "./api";

export interface WhatsAppMessageTemplate {
  orderEnquiry: (customer: Customer, order: Order) => string;
  orderConfirmation: (customer: Customer, order: Order) => string;
  orderStatusUpdate: (customer: Customer, order: Order) => string;
  deliveryUpdate: (customer: Customer, order: Order) => string;
  promotional: (customer: Customer, message: string) => string;
}

export const whatsappTemplates: WhatsAppMessageTemplate = {
  orderEnquiry: (customer: Customer, order: Order) => {
    return `🛒 *Order Enquiry - #${order.invoiceNumber}*

Hello ${customer.name || "Customer"}!

Thank you for your interest in our products. Here are your order details:

📦 *Items:*
${order.items
  .map(
    (item) =>
      `• ${item.product.name} x ${item.quantity} - ₹${
        item.price * item.quantity
      }`
  )
  .join("\n")}

💰 *Total Amount:* ₹${order.totalAmount}
⚖️ *Total Weight:* ${order.totalWeight}kg
🚚 *Delivery Type:* ${
      order.deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"
    }
💳 *Payment:* ${
      order.paymentMethod === "prepaid" ? "Prepaid" : "Cash on Pickup"
    }

${
  order.deliveryAddress
    ? `📍 *Delivery Address:*
${order.deliveryAddress.street}
${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}`
    : ""
}

Please confirm if you'd like to proceed with this order.

Thanks,
Digital Catalogue Team`;
  },

  orderConfirmation: (customer: Customer, order: Order) => {
    return `✅ *Order Confirmed - #${order.invoiceNumber}*

Hello ${customer.name || "Customer"}!

Your order has been confirmed and is being processed.

📦 *Order Details:*
${order.items
  .map((item) => `• ${item.product.name} x ${item.quantity}`)
  .join("\n")}

💰 *Total: ₹${order.totalAmount}*
🚚 *${order.deliveryType === "delivery" ? "Delivery" : "Pickup"}*
📅 *Order Date:* ${new Date(order.createdAt).toLocaleDateString()}

${
  order.deliveryType === "delivery"
    ? "🚚 Your order will be delivered to your address."
    : "🏪 Your order will be ready for pickup at our store."
}

We'll keep you updated on your order status.

Thank you for choosing us!`;
  },

  orderStatusUpdate: (customer: Customer, order: Order) => {
    const statusEmojis = {
      pending: "⏳",
      confirmed: "✅",
      preparing: "👨‍🍳",
      ready: "📦",
      delivered: "🎉",
      cancelled: "❌",
    };

    const statusMessages = {
      pending: "Your order is pending confirmation",
      confirmed: "Your order has been confirmed",
      preparing: "Your order is being prepared",
      ready:
        order.deliveryType === "pickup"
          ? "Your order is ready for pickup"
          : "Your order is ready for delivery",
      delivered: "Your order has been delivered successfully",
      cancelled: "Your order has been cancelled",
    };

    return `${statusEmojis[order.orderStatus]} *Order Update - #${
      order.invoiceNumber
    }*

Hello ${customer.name || "Customer"}!

${statusMessages[order.orderStatus]}.

${
  order.orderStatus === "ready" && order.deliveryType === "pickup"
    ? "🏪 Please visit our store to collect your order."
    : ""
}

${
  order.orderStatus === "delivered"
    ? "Thank you for shopping with us! We hope you enjoy your products."
    : ""
}

Current Status: *${order.orderStatus.toUpperCase()}*

For any queries, feel free to contact us.`;
  },

  deliveryUpdate: (customer: Customer, order: Order) => {
    return `🚚 *Delivery Update - #${order.invoiceNumber}*

Hello ${customer.name || "Customer"}!

Your order is out for delivery and will reach you soon.

📍 *Delivery Address:*
${order.deliveryAddress?.street}
${order.deliveryAddress?.city}, ${order.deliveryAddress?.state} - ${
      order.deliveryAddress?.pincode
    }

💰 *Total Amount:* ₹${order.totalAmount}
💳 *Payment:* ${order.paymentStatus === "completed" ? "Paid" : "Pending"}

Our delivery partner will contact you shortly.

Thank you for your patience!`;
  },

  promotional: (customer: Customer, message: string) => {
    return `🎉 *Special Offer for ${customer.name || "You"}!*

${message}

🛍️ Shop now at our digital catalogue!

*Terms and conditions apply.`;
  },
};

export class WhatsAppService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY || "";
    this.baseUrl = process.env.WHATSAPP_API_URL || "https://api.whatsapp.com";
  }

  async sendMessage(
    phoneNumber: string,
    message: string,
    messageType: WhatsAppMessage["messageType"] = "promotional"
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await api.post("/api/whatsapp/send", {
        phoneNumber,
        message,
        messageType,
      });

      return {
        success: true,
        messageId: response.data.messageId,
      };
    } catch (error: any) {
      console.error("WhatsApp send error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to send WhatsApp message",
      };
    }
  }

  async sendOrderEnquiry(customer: Customer, order: Order): Promise<boolean> {
    const message = whatsappTemplates.orderEnquiry(customer, order);
    const result = await this.sendMessage(
      customer.phoneNumber,
      message,
      "order_enquiry"
    );
    return result.success;
  }

  async sendOrderConfirmation(
    customer: Customer,
    order: Order
  ): Promise<boolean> {
    const message = whatsappTemplates.orderConfirmation(customer, order);
    const result = await this.sendMessage(
      customer.phoneNumber,
      message,
      "order_confirmation"
    );
    return result.success;
  }

  async sendOrderStatusUpdate(
    customer: Customer,
    order: Order
  ): Promise<boolean> {
    const message = whatsappTemplates.orderStatusUpdate(customer, order);
    const result = await this.sendMessage(
      customer.phoneNumber,
      message,
      "status_update"
    );
    return result.success;
  }

  async sendDeliveryUpdate(customer: Customer, order: Order): Promise<boolean> {
    const message = whatsappTemplates.deliveryUpdate(customer, order);
    const result = await this.sendMessage(
      customer.phoneNumber,
      message,
      "delivery_update"
    );
    return result.success;
  }

  async sendPromotionalMessage(
    customers: Customer[],
    message: string
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const customer of customers) {
      const fullMessage = whatsappTemplates.promotional(customer, message);
      const result = await this.sendMessage(
        customer.phoneNumber,
        fullMessage,
        "promotional"
      );

      if (result.success) {
        success++;
      } else {
        failed++;
      }

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return { success, failed };
  }

  async getMessageStatus(
    messageId: string
  ): Promise<WhatsAppMessage["status"]> {
    try {
      const response = await api.get(`/api/whatsapp/status/${messageId}`);
      return response.data.status;
    } catch (error) {
      console.error("WhatsApp status check error:", error);
      return "failed";
    }
  }

  async getMessageHistory(
    customerId: string,
    limit: number = 50
  ): Promise<WhatsAppMessage[]> {
    try {
      const response = await api.get(
        `/api/whatsapp/history/${customerId}?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("WhatsApp history error:", error);
      return [];
    }
  }
}

export const whatsappService = new WhatsAppService();
