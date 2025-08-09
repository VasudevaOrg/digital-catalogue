// src/lib/whatsappService.ts
import { Order, Customer, Product, CartItem } from "@/types";

export interface WhatsAppOrderData {
  orderId: string;
  customerInfo: {
    name: string;
    phoneNumber: string;
  };
  items: CartItem[];
  totalAmount: number;
  totalWeight: number;
  deliveryType: "delivery" | "pickup";
  paymentMethod: "prepaid" | "cash_on_pickup";
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryFee: number;
}

export interface WhatsAppConfig {
  businessPhone: string;
  businessName: string;
  storeAddress: string;
  workingHours: string;
  supportEmail: string;
}

const config: WhatsAppConfig = {
  businessPhone: "+919876543210",
  businessName: "Digital Catalogue",
  storeAddress: "123 Main Street, Your City, 573103, Karnataka, India",
  workingHours: "Mon-Sat: 9:00 AM - 8:00 PM, Sunday: 10:00 AM - 6:00 PM",
  supportEmail: "support@digitalcatalogue.com",
};

export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor(customConfig?: Partial<WhatsAppConfig>) {
    this.config = { ...config, ...customConfig };
  }

  // Generate order enquiry message
  generateOrderEnquiry(orderData: WhatsAppOrderData): string {
    const {
      orderId,
      customerInfo,
      items,
      totalAmount,
      totalWeight,
      deliveryType,
      paymentMethod,
      deliveryAddress,
      deliveryFee,
    } = orderData;

    let message = `🛒 *New Order Enquiry*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Customer Information
    message += `👤 *Customer Details:*\n`;
    message += `• Name: ${customerInfo.name}\n`;
    message += `• Phone: ${customerInfo.phoneNumber}\n\n`;

    // Order Information
    message += `📋 *Order Details:*\n`;
    message += `• Order ID: ${orderId}\n`;
    message += `• Date: ${new Date().toLocaleDateString("en-IN")}\n`;
    message += `• Time: ${new Date().toLocaleTimeString("en-IN")}\n\n`;

    // Items List
    message += `📦 *Items Ordered:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   • Quantity: ${item.quantity}\n`;
      message += `   • Price: ₹${item.product.price} each\n`;
      message += `   • Weight: ${item.product.weight}kg each\n`;
      message += `   • Subtotal: ₹${(
        item.product.price * item.quantity
      ).toFixed(2)}\n\n`;
    });

    // Order Summary
    message += `💰 *Order Summary:*\n`;
    message += `• Subtotal: ₹${(totalAmount - deliveryFee).toFixed(2)}\n`;
    message += `• Total Weight: ${totalWeight.toFixed(2)}kg\n`;

    if (deliveryType === "delivery") {
      message += `• Delivery Fee: ₹${deliveryFee.toFixed(2)}\n`;
    }

    message += `• *Total Amount: ₹${totalAmount.toFixed(2)}*\n\n`;

    // Delivery Information
    message += `🚚 *Delivery Information:*\n`;
    if (deliveryType === "delivery") {
      message += `• Type: Home Delivery\n`;
      if (deliveryAddress) {
        message += `• Address:\n`;
        message += `  ${deliveryAddress.street}\n`;
        message += `  ${deliveryAddress.city}, ${deliveryAddress.state}\n`;
        message += `  PIN: ${deliveryAddress.pincode}\n`;
      }
    } else {
      message += `• Type: Store Pickup\n`;
      message += `• Store Address: ${this.config.storeAddress}\n`;
    }
    message += `• Payment: ${
      paymentMethod === "prepaid"
        ? "Online Payment"
        : "Cash on " + (deliveryType === "delivery" ? "Delivery" : "Pickup")
    }\n\n`;

    // Business Information
    message += `🏪 *${this.config.businessName}*\n`;
    message += `📍 ${this.config.storeAddress}\n`;
    message += `⏰ ${this.config.workingHours}\n`;
    message += `📧 ${this.config.supportEmail}\n\n`;

    message += `*Please confirm this order to proceed with processing.*\n\n`;
    message += `Thank you for choosing ${this.config.businessName}! 🙏`;

    return message;
  }

  // Generate order confirmation message
  generateOrderConfirmation(orderData: WhatsAppOrderData): string {
    let message = `✅ *Order Confirmed!*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `🎉 Thank you for your order!\n\n`;

    message += `📋 *Order ID:* ${orderData.orderId}\n`;
    message += `💰 *Total Amount:* ₹${orderData.totalAmount.toFixed(2)}\n`;
    message += `📅 *Confirmed on:* ${new Date().toLocaleDateString(
      "en-IN"
    )} at ${new Date().toLocaleTimeString("en-IN")}\n\n`;

    message += `📦 *Items Confirmed:*\n`;
    orderData.items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} x${item.quantity}\n`;
    });

    message += `\n🚚 *What's Next?*\n`;
    if (orderData.deliveryType === "delivery") {
      message += `• Your order will be prepared and delivered to your address\n`;
      message += `• Expected delivery: 1-2 business days\n`;
      message += `• You'll receive updates as your order progresses\n`;
    } else {
      message += `• Your order will be prepared for pickup\n`;
      message += `• We'll notify you when it's ready (usually within 2-4 hours)\n`;
      message += `• Pickup from: ${this.config.storeAddress}\n`;
    }

    message += `\n📱 *Stay Updated:*\n`;
    message += `• Order status updates will be sent via WhatsApp\n`;
    message += `• For any queries, reply to this message\n\n`;

    message += `Thank you for choosing ${this.config.businessName}! 🙏`;

    return message;
  }

  // Generate status update message
  generateStatusUpdate(
    orderData: WhatsAppOrderData,
    status: string,
    customMessage?: string
  ): string {
    const statusEmojis: Record<string, string> = {
      pending: "⏳",
      confirmed: "✅",
      preparing: "👨‍🍳",
      ready: "📦",
      out_for_delivery: "🚚",
      delivered: "🎉",
      cancelled: "❌",
    };

    const statusMessages: Record<string, string> = {
      pending: "Your order is pending confirmation",
      confirmed: "Your order has been confirmed and will be processed soon",
      preparing: "Your order is being prepared",
      ready:
        orderData.deliveryType === "pickup"
          ? "Your order is ready for pickup!"
          : "Your order is ready for delivery",
      out_for_delivery: "Your order is out for delivery",
      delivered: "Your order has been delivered successfully! 🎉",
      cancelled: "Your order has been cancelled",
    };

    let message = `${statusEmojis[status]} *Order Status Update*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `📋 *Order ID:* ${orderData.orderId}\n`;
    message += `📊 *Status:* ${statusMessages[status]}\n`;
    message += `📅 *Updated on:* ${new Date().toLocaleDateString(
      "en-IN"
    )} at ${new Date().toLocaleTimeString("en-IN")}\n\n`;

    if (customMessage) {
      message += `📝 *Additional Information:*\n${customMessage}\n\n`;
    }

    if (status === "ready" && orderData.deliveryType === "pickup") {
      message += `🏪 *Pickup Details:*\n`;
      message += `• Location: ${this.config.storeAddress}\n`;
      message += `• Working Hours: ${this.config.workingHours}\n`;
      message += `• Please bring a valid ID for pickup\n\n`;
    }

    if (status === "out_for_delivery") {
      message += `🚚 *Delivery Information:*\n`;
      message += `• Our delivery partner will contact you shortly\n`;
      message += `• Please keep your phone accessible\n`;
      message += `• Have the exact change ready if paying cash\n\n`;
    }

    if (status === "delivered") {
      message += `🎉 *Thank you for your business!*\n`;
      message += `• We hope you enjoy your products\n`;
      message += `• Rate your experience by replying to this message\n`;
      message += `• Order again anytime!\n\n`;
    }

    message += `For any questions, feel free to message us!\n`;
    message += `${this.config.businessName} Team 📱`;

    return message;
  }

  // Generate product inquiry message
  generateProductInquiry(product: Product, quantity: number = 1): string {
    let message = `🛍️ *Product Inquiry*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `Hi! I'm interested in the following product:\n\n`;

    message += `📦 *Product Details:*\n`;
    message += `• Name: *${product.name}*\n`;
    message += `• Price: ₹${product.price}\n`;
    message += `• Weight: ${product.weight}kg\n`;
    message += `• Category: ${product.category}\n`;
    message += `• Quantity Needed: ${quantity}\n\n`;

    message += `💰 *Total Cost:* ₹${(product.price * quantity).toFixed(2)}\n\n`;

    if (product.isEligibleForFreeDelivery) {
      message += `🚚 *Free Delivery Available!*\n\n`;
    }

    message += `Please let me know:\n`;
    message += `• Availability and stock status\n`;
    message += `• Delivery options and charges\n`;
    message += `• Any current offers or discounts\n\n`;

    message += `Thank you! 🙏`;

    return message;
  }

  // Generate bulk order inquiry
  generateBulkOrderInquiry(
    items: { product: Product; quantity: number }[]
  ): string {
    let message = `📋 *Bulk Order Inquiry*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `Hi! I'm interested in placing a bulk order for the following items:\n\n`;

    let totalAmount = 0;
    let totalWeight = 0;

    message += `📦 *Items Required:*\n`;
    items.forEach((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      const itemWeight = item.product.weight * item.quantity;
      totalAmount += itemTotal;
      totalWeight += itemWeight;

      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   • Quantity: ${item.quantity}\n`;
      message += `   • Unit Price: ₹${item.product.price}\n`;
      message += `   • Subtotal: ₹${itemTotal.toFixed(2)}\n`;
      message += `   • Weight: ${itemWeight.toFixed(2)}kg\n\n`;
    });

    message += `💰 *Order Summary:*\n`;
    message += `• Total Items: ${items.length}\n`;
    message += `• Total Weight: ${totalWeight.toFixed(2)}kg\n`;
    message += `• Estimated Total: ₹${totalAmount.toFixed(2)}\n\n`;

    message += `🤝 *Request for:*\n`;
    message += `• Bulk pricing/discounts\n`;
    message += `• Delivery arrangements\n`;
    message += `• Payment terms\n`;
    message += `• Stock availability confirmation\n\n`;

    message += `Looking forward to your response! 🙏`;

    return message;
  }

  // Generate support/help message
  generateSupportMessage(issue: string): string {
    let message = `🆘 *Customer Support Request*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `Hi ${this.config.businessName} team,\n\n`;

    message += `I need assistance with the following:\n\n`;
    message += `❓ *Issue/Query:*\n${issue}\n\n`;

    message += `📅 *Date:* ${new Date().toLocaleDateString("en-IN")}\n`;
    message += `⏰ *Time:* ${new Date().toLocaleTimeString("en-IN")}\n\n`;

    message += `Please help me resolve this issue. Thank you! 🙏`;

    return message;
  }

  // Open WhatsApp with pre-filled message
  openWhatsApp(message: string): void {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.config.businessPhone.replace(
      "+",
      ""
    )}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  }

  // Send order enquiry via WhatsApp
  sendOrderEnquiry(orderData: WhatsAppOrderData): void {
    const message = this.generateOrderEnquiry(orderData);
    this.openWhatsApp(message);
  }

  // Send product inquiry via WhatsApp
  sendProductInquiry(product: Product, quantity: number = 1): void {
    const message = this.generateProductInquiry(product, quantity);
    this.openWhatsApp(message);
  }

  // Send bulk order inquiry via WhatsApp
  sendBulkOrderInquiry(items: { product: Product; quantity: number }[]): void {
    const message = this.generateBulkOrderInquiry(items);
    this.openWhatsApp(message);
  }

  // Send support request via WhatsApp
  sendSupportRequest(issue: string): void {
    const message = this.generateSupportMessage(issue);
    this.openWhatsApp(message);
  }

  // Send general contact message
  sendGeneralMessage(customMessage: string): void {
    let message = `👋 Hi ${this.config.businessName} team,\n\n`;
    message += customMessage;
    message += `\n\nThank you! 🙏`;
    this.openWhatsApp(message);
  }

  // Get WhatsApp link for sharing
  getWhatsAppLink(message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${this.config.businessPhone.replace(
      "+",
      ""
    )}?text=${encodedMessage}`;
  }

  // Check if WhatsApp is available
  isWhatsAppAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      window.navigator.userAgent.includes("WhatsApp")
    );
  }

  // Get business info
  getBusinessInfo(): WhatsAppConfig {
    return this.config;
  }

  // Update business configuration
  updateConfig(newConfig: Partial<WhatsAppConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();

// Export utility functions
export const WhatsAppUtils = {
  // Format phone number for WhatsApp
  formatPhoneNumber: (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Add country code if missing
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
      return `+${cleaned}`;
    }

    return phone;
  },

  // Check if phone number is valid
  isValidPhoneNumber: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    return (
      cleaned.length === 10 ||
      (cleaned.length === 12 && cleaned.startsWith("91"))
    );
  },

  // Generate quick action messages
  quickMessages: {
    greeting:
      "Hi! I'm interested in your products. Could you please share your catalog?",
    availability:
      "Hi! Is this product available? Please let me know the current stock status.",
    pricing: "Hi! Could you please share the pricing details for this product?",
    delivery: "Hi! What are your delivery options and charges for my location?",
    bulk: "Hi! I'm interested in bulk orders. Do you offer wholesale pricing?",
    support: "Hi! I need help with my order. Could you please assist me?",
  },

  // Message templates for different scenarios
  templates: {
    orderEnquiry: (orderId: string) =>
      `Hi! I'm inquiring about order #${orderId}. Could you please provide the current status?`,

    productAvailability: (productName: string) =>
      `Hi! Is "${productName}" currently available? Please let me know the stock status and delivery options.`,

    complaint: (issue: string) =>
      `Hi! I have an issue with my recent order: ${issue}. Please help me resolve this.`,

    feedback: (rating: number, comment: string) =>
      `Hi! I'd like to provide feedback for my recent order. Rating: ${rating}/5 stars. Comment: ${comment}`,
  },
};

// React hook for WhatsApp integration
export const useWhatsApp = () => {
  const sendMessage = (message: string) => {
    whatsappService.openWhatsApp(message);
  };

  const sendOrderEnquiry = (orderData: WhatsAppOrderData) => {
    whatsappService.sendOrderEnquiry(orderData);
  };

  const sendProductInquiry = (product: Product, quantity: number = 1) => {
    whatsappService.sendProductInquiry(product, quantity);
  };

  const sendSupportRequest = (issue: string) => {
    whatsappService.sendSupportRequest(issue);
  };

  const getBusinessInfo = () => {
    return whatsappService.getBusinessInfo();
  };

  return {
    sendMessage,
    sendOrderEnquiry,
    sendProductInquiry,
    sendSupportRequest,
    getBusinessInfo,
    isAvailable: whatsappService.isWhatsAppAvailable(),
  };
};
