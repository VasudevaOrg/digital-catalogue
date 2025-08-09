// src/lib/whatsappIntegration.ts
export interface WhatsAppConfig {
  businessNumber: string;
  businessName: string;
  welcomeMessage: string;
  quickReplies: string[];
  businessHours: {
    start: string;
    end: string;
    timezone: string;
  };
  autoResponses: {
    greeting: string;
    orderConfirmation: string;
    support: string;
  };
}

const defaultConfig: WhatsAppConfig = {
  businessNumber: "+919876543210",
  businessName: "Digital Catalogue",
  welcomeMessage: "Welcome to Digital Catalogue! How can we help you today?",
  quickReplies: [
    "View Products",
    "Check Delivery",
    "Order Status",
    "Customer Support",
  ],
  businessHours: {
    start: "09:00",
    end: "20:00",
    timezone: "Asia/Kolkata",
  },
  autoResponses: {
    greeting:
      "Hi! Thanks for contacting Digital Catalogue. We'll get back to you shortly!",
    orderConfirmation:
      "Thank you for your order! We've received it and will process it soon.",
    support: "Our support team will assist you. Please describe your issue.",
  },
};

export class WhatsAppIntegration {
  private config: WhatsAppConfig;

  constructor(config?: Partial<WhatsAppConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  // Generate WhatsApp URL with pre-filled message
  generateWhatsAppURL(message: string): string {
    const cleanNumber = this.config.businessNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  }

  // Open WhatsApp with message
  openWhatsApp(message: string): void {
    const url = this.generateWhatsAppURL(message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Check if currently within business hours
  isWithinBusinessHours(): boolean {
    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-GB", {
      hour12: false,
      timeZone: this.config.businessHours.timezone,
    });

    return (
      currentTime >= this.config.businessHours.start &&
      currentTime <= this.config.businessHours.end
    );
  }

  // Generate order message
  generateOrderMessage(orderData: any): string {
    const timestamp = new Date().toLocaleString("en-IN");

    let message = `🛒 *NEW ORDER ENQUIRY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Customer details
    message += `👤 *Customer Information:*\n`;
    message += `• Name: ${orderData.customerInfo.name}\n`;
    message += `• Phone: ${orderData.customerInfo.phoneNumber}\n`;
    if (orderData.customerInfo.email) {
      message += `• Email: ${orderData.customerInfo.email}\n`;
    }
    message += `\n`;

    // Order details
    message += `📋 *Order Details:*\n`;
    message += `• Order ID: ${orderData.orderId}\n`;
    message += `• Date & Time: ${timestamp}\n`;
    message += `• Total Items: ${orderData.items.length}\n\n`;

    // Items list
    message += `📦 *Items Ordered:*\n`;
    orderData.items.forEach((item: any, index: number) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   ├ Quantity: ${item.quantity}\n`;
      message += `   ├ Unit Price: ₹${item.product.price}\n`;
      message += `   ├ Weight: ${item.product.weight}kg each\n`;
      message += `   └ Subtotal: ₹${(
        item.product.price * item.quantity
      ).toFixed(2)}\n\n`;
    });

    // Order summary
    message += `💰 *Order Summary:*\n`;
    message += `• Subtotal: ₹${(
      orderData.totalAmount - orderData.deliveryFee
    ).toFixed(2)}\n`;
    message += `• Total Weight: ${orderData.totalWeight.toFixed(2)}kg\n`;

    if (orderData.deliveryType === "delivery") {
      message += `• Delivery Fee: ₹${orderData.deliveryFee.toFixed(2)}\n`;
    }

    message += `• *Grand Total: ₹${orderData.totalAmount.toFixed(2)}*\n\n`;

    // Delivery information
    message += `🚚 *Delivery Information:*\n`;
    if (orderData.deliveryType === "delivery") {
      message += `• Type: Home Delivery\n`;
      if (orderData.deliveryAddress) {
        message += `• Address:\n`;
        message += `  ${orderData.deliveryAddress.street}\n`;
        message += `  ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state}\n`;
        message += `  PIN: ${orderData.deliveryAddress.pincode}\n`;
      }
    } else {
      message += `• Type: Store Pickup\n`;
      message += `• Location: Your Store Address\n`;
    }

    message += `• Payment: ${
      orderData.paymentMethod === "prepaid"
        ? "Online Payment (Prepaid)"
        : "Cash on " +
          (orderData.deliveryType === "delivery" ? "Delivery" : "Pickup")
    }\n\n`;

    // Call to action
    message += `✅ *Please confirm this order to proceed*\n\n`;
    message += `Thank you for choosing ${this.config.businessName}! 🙏`;

    return message;
  }

  // Generate product inquiry message
  generateProductInquiry(product: any, quantity: number = 1): string {
    let message = `🛍️ *PRODUCT INQUIRY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `Hi! I'm interested in:\n\n`;

    message += `📦 *Product Details:*\n`;
    message += `• Name: *${product.name}*\n`;
    message += `• Price: ₹${product.price}\n`;
    message += `• Weight: ${product.weight}kg\n`;
    message += `• Category: ${product.category}\n`;
    message += `• Quantity Needed: ${quantity}\n\n`;

    message += `💰 *Total Cost: ₹${(product.price * quantity).toFixed(2)}*\n\n`;

    if (product.isEligibleForFreeDelivery) {
      message += `🚚 *Free Delivery Available!*\n\n`;
    }

    message += `Please let me know:\n`;
    message += `• Current availability\n`;
    message += `• Delivery options\n`;
    message += `• Any ongoing offers\n\n`;

    message += `Thank you! 🙏`;

    return message;
  }

  // Generate support message
  generateSupportMessage(issue: string): string {
    let message = `🆘 *CUSTOMER SUPPORT REQUEST*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `Hi ${this.config.businessName} team,\n\n`;
    message += `I need assistance with:\n\n`;
    message += `❓ *Issue/Query:*\n${issue}\n\n`;

    const timestamp = new Date().toLocaleString("en-IN");
    message += `📅 *Reported on:* ${timestamp}\n\n`;

    message += `Please help me resolve this. Thank you! 🙏`;

    return message;
  }

  // Generate bulk order inquiry
  generateBulkInquiry(items: any[]): string {
    let message = `📦 *BULK ORDER INQUIRY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `Hi! I'm interested in bulk quantities:\n\n`;

    let totalAmount = 0;
    let totalWeight = 0;

    message += `📋 *Items Required:*\n`;
    items.forEach((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      const itemWeight = item.product.weight * item.quantity;
      totalAmount += itemTotal;
      totalWeight += itemWeight;

      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   ├ Quantity: ${item.quantity}\n`;
      message += `   ├ Unit Price: ₹${item.product.price}\n`;
      message += `   └ Subtotal: ₹${itemTotal.toFixed(2)}\n\n`;
    });

    message += `💰 *Bulk Order Summary:*\n`;
    message += `• Total Items: ${items.length} types\n`;
    message += `• Total Weight: ${totalWeight.toFixed(2)}kg\n`;
    message += `• Estimated Total: ₹${totalAmount.toFixed(2)}\n\n`;

    message += `🤝 *Looking for:*\n`;
    message += `• Bulk pricing/wholesale rates\n`;
    message += `• Volume discounts\n`;
    message += `• Delivery arrangements\n`;
    message += `• Payment terms\n\n`;

    message += `Please share your best rates! 🙏`;

    return message;
  }

  // Get configuration
  getConfig(): WhatsAppConfig {
    return this.config;
  }

  // Update configuration
  updateConfig(newConfig: Partial<WhatsAppConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const whatsappIntegration = new WhatsAppIntegration();

// Utility functions for React components
export const useWhatsAppIntegration = () => {
  const sendOrderEnquiry = (orderData: any) => {
    const message = whatsappIntegration.generateOrderMessage(orderData);
    whatsappIntegration.openWhatsApp(message);
  };

  const sendProductInquiry = (product: any, quantity: number = 1) => {
    const message = whatsappIntegration.generateProductInquiry(
      product,
      quantity
    );
    whatsappIntegration.openWhatsApp(message);
  };

  const sendSupportRequest = (issue: string) => {
    const message = whatsappIntegration.generateSupportMessage(issue);
    whatsappIntegration.openWhatsApp(message);
  };

  const sendBulkInquiry = (items: any[]) => {
    const message = whatsappIntegration.generateBulkInquiry(items);
    whatsappIntegration.openWhatsApp(message);
  };

  const sendCustomMessage = (message: string) => {
    whatsappIntegration.openWhatsApp(message);
  };

  const isBusinessOpen = () => {
    return whatsappIntegration.isWithinBusinessHours();
  };

  const getBusinessNumber = () => {
    return whatsappIntegration.getConfig().businessNumber;
  };

  return {
    sendOrderEnquiry,
    sendProductInquiry,
    sendSupportRequest,
    sendBulkInquiry,
    sendCustomMessage,
    isBusinessOpen,
    getBusinessNumber,
  };
};

// Quick message templates
export const WhatsAppTemplates = {
  greeting: "Hi! I'm interested in your products. Could you please help me?",
  catalog:
    "Hi! Could you please share your product catalog with current prices?",
  delivery:
    "Hi! What are your delivery charges and areas? Do you deliver to my location?",
  bulk: "Hi! I'm interested in bulk orders. Do you offer wholesale pricing?",
  support: "Hi! I need help with my order. Could you please assist me?",
  availability: (productName: string) =>
    `Hi! Is "${productName}" currently available? Please let me know the stock status.`,
  order: (orderId: string) =>
    `Hi! I'm inquiring about my order #${orderId}. Could you please provide the current status?`,
  complaint: (issue: string) =>
    `Hi! I have an issue with my recent order: ${issue}. Please help me resolve this.`,
  feedback: (rating: number, comment: string) =>
    `Hi! I'd like to provide feedback for my recent order. Rating: ${rating}/5 stars. ${comment}`,
};
