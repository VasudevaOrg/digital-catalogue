// src/lib/whatsappTest.ts
import { demoProducts } from "./demoData";

// Mock WhatsApp service for testing
export class WhatsAppTestService {
  private phoneNumber = "+919876543210"; // Shop WhatsApp number

  // Generate WhatsApp message for order enquiry
  generateOrderEnquiry(orderData: any) {
    const { items, totalAmount, totalWeight, deliveryType, customerInfo } =
      orderData;

    let message = `🛒 *New Order Enquiry*\n\n`;
    message += `👤 *Customer:* ${
      customerInfo.name || customerInfo.phoneNumber
    }\n`;
    message += `📱 *Phone:* ${customerInfo.phoneNumber}\n\n`;

    message += `📦 *Items:*\n`;
    items.forEach((item: any) => {
      message += `• ${item.product.name} x ${item.quantity} - ₹${(
        item.product.price * item.quantity
      ).toFixed(2)}\n`;
    });

    message += `\n💰 *Total Amount:* ₹${totalAmount.toFixed(2)}\n`;
    message += `⚖️ *Total Weight:* ${totalWeight.toFixed(2)}kg\n`;
    message += `🚚 *Delivery Type:* ${
      deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"
    }\n\n`;

    if (orderData.deliveryAddress) {
      message += `📍 *Delivery Address:*\n`;
      message += `${orderData.deliveryAddress.street}\n`;
      message += `${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} - ${orderData.deliveryAddress.pincode}\n\n`;
    }

    message += `Please confirm this order to proceed.`;

    return message;
  }

  // Generate WhatsApp link for customer to send order
  generateCustomerOrderLink(orderData: any) {
    const message = this.generateOrderEnquiry(orderData);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${this.phoneNumber.replace(
      "+",
      ""
    )}?text=${encodedMessage}`;
  }

  // Generate order confirmation message
  generateOrderConfirmation(orderData: any) {
    let message = `✅ *Order Confirmed*\n\n`;
    message += `📋 *Order ID:* ${orderData.orderId}\n`;
    message += `💰 *Amount:* ₹${orderData.totalAmount.toFixed(2)}\n`;
    message += `📅 *Date:* ${new Date().toLocaleDateString()}\n\n`;

    message += `📦 *Items:*\n`;
    orderData.items.forEach((item: any) => {
      message += `• ${item.product.name} x ${item.quantity}\n`;
    });

    message += `\n🚚 Your order will be ${
      orderData.deliveryType === "delivery"
        ? "delivered to your address"
        : "ready for pickup at our store"
    }.\n\n`;
    message += `Thank you for choosing Digital Catalogue! 🙏`;

    return message;
  }

  // Generate status update message
  generateStatusUpdate(orderData: any, newStatus: string) {
    const statusEmojis: Record<string, string> = {
      pending: "⏳",
      confirmed: "✅",
      preparing: "👨‍🍳",
      ready: "📦",
      delivered: "🎉",
      cancelled: "❌",
    };

    const statusMessages: Record<string, string> = {
      pending: "Your order is pending confirmation",
      confirmed: "Your order has been confirmed and is being processed",
      preparing: "Your order is being prepared",
      ready:
        orderData.deliveryType === "pickup"
          ? "Your order is ready for pickup"
          : "Your order is ready for delivery",
      delivered: "Your order has been delivered successfully",
      cancelled: "Your order has been cancelled",
    };

    let message = `${statusEmojis[newStatus]} *Order Update*\n\n`;
    message += `📋 *Order ID:* ${orderData.orderId}\n`;
    message += `📊 *Status:* ${statusMessages[newStatus]}\n\n`;

    if (newStatus === "ready" && orderData.deliveryType === "pickup") {
      message += `🏪 Please visit our store to collect your order.\n`;
      message += `📍 Address: 123 Main Street, Your City, 573103\n`;
      message += `⏰ Store Hours: 9 AM - 8 PM\n\n`;
    }

    if (newStatus === "delivered") {
      message += `Thank you for shopping with us! 🙏\n`;
      message += `We hope you enjoy your products.\n\n`;
    }

    message += `For any queries, contact us on WhatsApp.`;

    return message;
  }

  // Test WhatsApp integration
  async testWhatsAppIntegration(orderData: any) {
    console.log("=== WhatsApp Integration Test ===");

    // 1. Customer Order Enquiry
    const enquiryMessage = this.generateOrderEnquiry(orderData);
    const whatsappLink = this.generateCustomerOrderLink(orderData);

    console.log("1. Customer Order Enquiry Message:");
    console.log(enquiryMessage);
    console.log("\nWhatsApp Link:");
    console.log(whatsappLink);

    // 2. Order Confirmation
    const confirmationMessage = this.generateOrderConfirmation(orderData);
    console.log("\n2. Order Confirmation Message:");
    console.log(confirmationMessage);

    // 3. Status Updates
    const statuses = ["confirmed", "preparing", "ready", "delivered"];
    statuses.forEach((status, index) => {
      const statusMessage = this.generateStatusUpdate(orderData, status);
      console.log(`\n${index + 3}. Status Update (${status}):`);
      console.log(statusMessage);
    });

    console.log("\n=== Integration Test Complete ===");

    return {
      enquiryMessage,
      whatsappLink,
      confirmationMessage,
      statusUpdates: statuses.map((status) => ({
        status,
        message: this.generateStatusUpdate(orderData, status),
      })),
    };
  }
}

// Sample order data for testing
export const sampleOrderData = {
  orderId: "ORD20240101001",
  customerInfo: {
    name: "John Doe",
    phoneNumber: "+919876543210",
  },
  items: [
    {
      product: demoProducts[0], // Basmati Rice
      quantity: 2,
    },
    {
      product: demoProducts[6], // Toor Dal
      quantity: 1,
    },
    {
      product: demoProducts[9], // Turmeric Powder
      quantity: 3,
    },
  ],
  totalAmount: 635, // Calculated from items
  totalWeight: 3.6, // Calculated from items
  deliveryType: "delivery",
  deliveryAddress: {
    street: "123 MG Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "573103",
  },
};

// Export instance for testing
export const whatsappTestService = new WhatsAppTestService();

// Function to open WhatsApp with pre-filled message
export const openWhatsAppOrder = (orderData: any) => {
  const link = whatsappTestService.generateCustomerOrderLink(orderData);
  window.open(link, "_blank");
};

// Function to simulate receiving order confirmation
export const simulateOrderConfirmation = (orderData: any) => {
  const message = whatsappTestService.generateOrderConfirmation(orderData);
  alert(`Order Confirmation Sent via WhatsApp:\n\n${message}`);
};
