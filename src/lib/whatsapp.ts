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
    return `🛒 *ORDER CONFIRMATION REQUIRED*
━━━━━━━━━━━━━━━━━━━━━━━━━

Hello ${customer.name || "Customer"}! 👋

Thank you for your order with Digital Catalogue. We have received your order request and need your confirmation to proceed.

📋 *ORDER DETAILS*
📋 OEN (order enquiry number): ${order.invoiceNumber}
Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}
Time: ${new Date(order.createdAt).toLocaleTimeString("en-IN")}

📦 *ITEMS ORDERED*
${order.items
  .map(
    (item, index) =>
      `${index + 1}. ${item.product.name}
   Price: ₹${item.product.price} x ${item.quantity}
   Weight: ${(item.product.weight * item.quantity).toFixed(2)}kg
   Subtotal: ₹${(item.price * item.quantity).toFixed(2)}`,
  )
  .join("\n\n")}

💰 *ESTIMATE COPY*
Items Total: ₹${order.totalAmount - order.deliveryFee}
Total Weight: ${order.totalWeight}kg
Delivery Fee: ${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
*GRAND TOTAL: ₹${order.totalAmount}*

🚚 *DELIVERY INFORMATION*
Type: ${order.deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"}
${
  order.deliveryAddress
    ? `Address: ${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}`
    : ""
}
Payment: ${
      order.paymentMethod === "prepaid" ? "Prepaid (Online)" : "Cash on Pickup"
    }

━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 *PLEASE CONFIRM YOUR ORDER*

Reply to this message with:
✅ "CONFIRM" - To confirm your order
❌ "CANCEL" - To cancel your order
📝 "MODIFY" - To make changes

Our team will process your order within 15 minutes after confirmation.

📞 Need help? Call us: +91 91649 12322

Thank you for choosing Digital Catalogue! 🙏`;
  },

  orderConfirmation: (customer: Customer, order: Order) => {
    return `✅ *ORDER CONFIRMED*
━━━━━━━━━━━━━━━━━━━━━━━━━

Hello ${customer.name || "Customer"}! 👋

Great news! Your order has been confirmed and is now being processed.

📋 *ORDER DETAILS*
📋 OEN (order enquiry number): ${order.invoiceNumber}
Status: CONFIRMED ✅
Total Amount: ₹${order.totalAmount}

📦 *ITEMS*
${order.items
  .map((item, index) => `${index + 1}. ${item.product.name} x ${item.quantity}`)
  .join("\n")}

🚚 *DELIVERY INFORMATION*
${
  order.deliveryType === "delivery"
    ? `🏠 Home Delivery
📍 ${order.deliveryAddress?.street}, ${order.deliveryAddress?.city}
📅 Expected Delivery: Within 24-48 hours`
    : `🏪 Store Pickup
📍 SHOP No. 11, APMC Yard, Karnataka 573103
📅 Ready for Pickup: Within 2-4 hours`
}

💳 *PAYMENT*
Method: ${
      order.paymentMethod === "prepaid" ? "Prepaid (Online)" : "Cash on Pickup"
    }
Status: ${order.paymentStatus === "completed" ? "Paid ✅" : "Pending"}

📱 *TRACK YOUR ORDER*
We'll send you updates as your order progresses:
• Order Confirmed ✅
• Preparing 👨‍🍳
• Ready ${order.deliveryType === "pickup" ? "for Pickup 🏪" : "for Delivery 🚚"}
• Completed 🎉

Need assistance? Reply to this message or call +91 91649 12322

Thank you for shopping with Digital Catalogue! 🙏`;
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
      confirmed: "Your order has been confirmed and is being processed",
      preparing: "Your order is being prepared with care",
      ready:
        order.deliveryType === "pickup"
          ? "Your order is ready for pickup at our store"
          : "Your order is ready and out for dispatch",
      delivered: "Your order has been dispatched successfully",
      cancelled: "Your order has been cancelled",
    };

    return `${statusEmojis[order.orderStatus]} *ORDER UPDATE*
━━━━━━━━━━━━━━━━━━━━━━━━━

Hello ${customer.name || "Customer"}! 👋

📋 OEN (order enquiry number): ${order.invoiceNumber}
📊 Status: *${statusMessages[order.orderStatus]}*

${
  order.orderStatus === "ready" && order.deliveryType === "pickup"
    ? `
🏪 *PICKUP INSTRUCTIONS*
Your order is packed and ready for collection!

📍 Pickup Location:
Digital Catalogue Store
SHOP No. 11, APMC Yard
Karnataka 573103

⏰ Store Hours:
Monday - Saturday: 9:00 AM - 8:00 PM
Sunday: 10:00 AM - 6:00 PM

💳 Payment: ${
        order.paymentMethod === "cash_on_pickup"
          ? "Cash on Pickup"
          : "Already Paid"
      }

Please bring this message and a valid ID for pickup.`
    : ""
}

${
  order.orderStatus === "ready" && order.deliveryType === "delivery"
    ? `
🚚 *DELIVERY UPDATE*
Your order is out for dispatch!

📍 Delivery Address:
${order.deliveryAddress?.street}
${order.deliveryAddress?.city}, ${order.deliveryAddress?.state} - ${order.deliveryAddress?.pincode}

Our delivery partner will contact you shortly.
Expected delivery: Within 2-3 hours`
    : ""
}

${
  order.orderStatus === "delivered"
    ? `
🎉 *THANK YOU!*
We hope you enjoy your products!

⭐ Rate your experience and share feedback.
🔄 Reorder anytime through WhatsApp!`
    : ""
}

Need assistance? Reply to this message anytime.

Thank you for choosing Digital Catalogue! 🙏`;
  },

  deliveryUpdate: (customer: Customer, order: Order) => {
    return `🚚 *DELIVERY UPDATE*
━━━━━━━━━━━━━━━━━━━━━━━━━

Hello ${customer.name || "Customer"}! 👋

Your order is out for dispatch and will reach you soon.

📋 OEN (order enquiry number): ${order.invoiceNumber}
📍 Delivery Address:
${order.deliveryAddress?.street}
${order.deliveryAddress?.city}, ${order.deliveryAddress?.state} - ${
      order.deliveryAddress?.pincode
    }

💰 Total Amount: ₹${order.totalAmount}
💳 Payment: ${
      order.paymentStatus === "completed" ? "Paid ✅" : "Cash on Delivery"
    }

🕐 Expected delivery time: Within 2-3 hours
📞 Delivery partner will call you before arrival

Please ensure someone is available at the delivery address.

Need to reschedule? Reply to this message.

Thank you for your patience! 🙏`;
  },

  promotional: (customer: Customer, message: string) => {
    return `🎉 *SPECIAL OFFER*
━━━━━━━━━━━━━━━━━━━━━━━━━

Hello ${customer.name || "Customer"}! 👋

${message}

🛍️ *HOW TO ORDER*
1. Browse our digital catalogue
2. Add items to basket
3. Buy with your details
4. Get instant WhatsApp confirmation

📱 Visit our website or reply to this message!
🚚 Free delivery on orders ₹1000+
💳 Multiple payment options available

*Terms and conditions apply.
Valid while stocks last.

Thank you for being our valued customer! 🙏`;
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
    messageType: WhatsAppMessage["messageType"] = "promotional",
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
      "order_enquiry",
    );
    return result.success;
  }

  async sendOrderConfirmation(
    customer: Customer,
    order: Order,
  ): Promise<boolean> {
    const message = whatsappTemplates.orderConfirmation(customer, order);
    const result = await this.sendMessage(
      customer.phoneNumber,
      message,
      "order_confirmation",
    );
    return result.success;
  }

  async sendOrderStatusUpdate(
    customer: Customer,
    order: Order,
  ): Promise<boolean> {
    const message = whatsappTemplates.orderStatusUpdate(customer, order);
    const result = await this.sendMessage(
      customer.phoneNumber,
      message,
      "status_update",
    );
    return result.success;
  }

  async sendDeliveryUpdate(customer: Customer, order: Order): Promise<boolean> {
    const message = whatsappTemplates.deliveryUpdate(customer, order);
    const result = await this.sendMessage(
      customer.phoneNumber,
      message,
      "delivery_update",
    );
    return result.success;
  }

  async sendPromotionalMessage(
    customers: Customer[],
    message: string,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const customer of customers) {
      const fullMessage = whatsappTemplates.promotional(customer, message);
      const result = await this.sendMessage(
        customer.phoneNumber,
        fullMessage,
        "promotional",
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
    messageId: string,
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
    limit: number = 50,
  ): Promise<WhatsAppMessage[]> {
    try {
      const response = await api.get(
        `/api/whatsapp/history/${customerId}?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.error("WhatsApp history error:", error);
      return [];
    }
  }
}

export const whatsappService = new WhatsAppService();

// Helper function to send order enquiry directly (used in checkout)
export const sendOrderEnquiry = async (
  orderData: any,
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Create customer object from order data
    const customer = {
      id: "temp",
      phoneNumber: orderData.customerInfo.phoneNumber,
      name: orderData.customerInfo.name,
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    // Create order object for WhatsApp template
    const order = {
      id: orderData.orderId,
      customerId: customer.id,
      customer: customer,
      items: orderData.items.map((item: any) => ({
        id: `item_${item.product.id}`,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        returned: false,
        returnedQuantity: 0,
      })),
      totalAmount: orderData.totalAmount,
      totalWeight: orderData.totalWeight,
      deliveryType: orderData.deliveryType,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: "pending" as const,
      orderStatus: "pending" as const,
      deliveryAddress: orderData.deliveryAddress,
      deliveryFee: orderData.deliveryFee,
      invoiceNumber: orderData.orderId,
      createdAt: orderData.orderDate || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Send WhatsApp message using the service
    const whatsappService = new WhatsAppService();
    const success = await whatsappService.sendOrderEnquiry(customer, order);

    if (success) {
      return { success: true, messageId: `msg_${Date.now()}` };
    } else {
      return { success: false, error: "Failed to send WhatsApp message" };
    }
  } catch (error: any) {
    console.error("Error sending order enquiry:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
};
