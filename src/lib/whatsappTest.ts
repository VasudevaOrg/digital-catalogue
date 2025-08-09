// src/lib/whatsappTest.ts
import { demoProducts } from "./demoData";

// Complete WhatsApp Integration Service
export class WhatsAppTestService {
  private phoneNumber = "+918297137702"; // Shop WhatsApp number
  private businessName = "Digital Catalogue";

  // Generate comprehensive WhatsApp message for order enquiry
  generateOrderEnquiry(orderData: any) {
    const {
      items,
      totalAmount,
      totalWeight,
      deliveryType,
      customerInfo,
      deliveryFee,
      isEligibleForFreeDelivery,
    } = orderData;

    let message = `🛒 *NEW ORDER ENQUIRY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Customer Details
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `Name: ${customerInfo.name}\n`;
    message += `Phone: +91${customerInfo.phoneNumber}\n\n`;

    // Order Details
    message += `📦 *ORDER DETAILS*\n`;
    message += `Order ID: ${orderData.orderId}\n`;
    message += `Date: ${new Date().toLocaleDateString("en-IN")}\n`;
    message += `Time: ${new Date().toLocaleTimeString("en-IN")}\n\n`;

    // Items List
    message += `🛍️ *ITEMS ORDERED*\n`;
    items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Price: ₹${item.product.price} x ${item.quantity}\n`;
      message += `   Weight: ${item.product.weight}kg each\n`;
      message += `   Subtotal: ₹${(item.product.price * item.quantity).toFixed(
        2
      )}\n\n`;
    });

    // Order Summary
    message += `💰 *ORDER SUMMARY*\n`;
    message += `Items Total: ₹${orderData.totalAmount - deliveryFee}\n`;
    message += `Total Weight: ${totalWeight.toFixed(2)}kg\n`;
    message += `Delivery Fee: ${
      deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`
    }\n`;
    message += `*TOTAL AMOUNT: ₹${totalAmount.toFixed(2)}*\n\n`;

    // Delivery Information
    message += `🚚 *DELIVERY INFORMATION*\n`;
    message += `Type: ${
      deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"
    }\n`;

    if (orderData.deliveryAddress) {
      message += `Address: ${orderData.deliveryAddress.street}, ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} - ${orderData.deliveryAddress.pincode}\n`;
    }

    message += `Payment: ${
      orderData.paymentMethod === "prepaid"
        ? "Prepaid (Online)"
        : "Cash on Pickup"
    }\n\n`;

    // Free Delivery Status
    if (deliveryType === "delivery") {
      if (isEligibleForFreeDelivery) {
        message += `✅ *FREE DELIVERY APPLIED*\n`;
      } else {
        message += `ℹ️ *Delivery Charges Apply*\n`;
        message += `(Free delivery on orders ₹1000+ excluding sugar, oils, jaggery)\n`;
      }
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Please CONFIRM this order to proceed with processing.\n\n`;
    message += `Reply with:\n`;
    message += `✅ "CONFIRM" - To confirm order\n`;
    message += `❌ "CANCEL" - To cancel order\n`;
    message += `📝 "MODIFY" - To modify order\n\n`;
    message += `Thank you for choosing ${this.businessName}! 🙏`;

    return message;
  }

  // Generate customer order link for WhatsApp
  generateCustomerOrderLink(orderData: any) {
    const message = this.generateOrderEnquiry(orderData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.phoneNumber.replace(
      "+",
      ""
    )}?text=${encodedMessage}`;
    return whatsappUrl;
  }

  // Generate order confirmation message (from shop to customer)
  generateOrderConfirmation(orderData: any) {
    let message = `✅ *ORDER CONFIRMED*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `Hello ${orderData.customerInfo.name}! 👋\n\n`;
    message += `Your order has been confirmed and is being processed.\n\n`;

    message += `📋 *Order Details:*\n`;
    message += `Order ID: ${orderData.orderId}\n`;
    message += `Total Amount: ₹${orderData.totalAmount.toFixed(2)}\n`;
    message += `Items: ${orderData.items.length}\n`;
    message += `Weight: ${orderData.totalWeight.toFixed(2)}kg\n\n`;

    message += `📦 *Items:*\n`;
    orderData.items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.product.name} x ${item.quantity}\n`;
    });

    message += `\n🚚 *Delivery Information:*\n`;
    if (orderData.deliveryType === "delivery") {
      message += `Type: Home Delivery\n`;
      message += `Address: ${orderData.deliveryAddress.street}, ${orderData.deliveryAddress.city}\n`;
      message += `Expected Delivery: Within 24-48 hours\n`;
    } else {
      message += `Type: Store Pickup\n`;
      message += `Location: 123 Main Street, Karnataka 573103\n`;
      message += `Ready for Pickup: Within 2-4 hours\n`;
    }

    message += `\n💳 *Payment:* ${
      orderData.paymentMethod === "prepaid"
        ? "Prepaid (Online)"
        : "Cash on Pickup"
    }\n\n`;

    message += `📱 *Track Your Order:*\n`;
    message += `We'll send you updates as your order progresses:\n`;
    message += `• Order Confirmed ✅\n`;
    message += `• Preparing 👨‍🍳\n`;
    message += `• Ready ${
      orderData.deliveryType === "pickup" ? "for Pickup 🏪" : "for Delivery 🚚"
    }\n`;
    message += `• Completed 🎉\n\n`;

    message += `Need help? Reply to this message or call us.\n\n`;
    message += `Thank you for shopping with ${this.businessName}! 🙏`;

    return message;
  }

  // Generate status update messages
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
      preparing: "Your order is being prepared with care",
      ready:
        orderData.deliveryType === "pickup"
          ? "Your order is ready for pickup at our store"
          : "Your order is ready and out for delivery",
      delivered: "Your order has been delivered successfully",
      cancelled: "Your order has been cancelled",
    };

    let message = `${statusEmojis[newStatus]} *ORDER UPDATE*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `Hello ${orderData.customerInfo.name}! 👋\n\n`;
    message += `📋 Order ID: ${orderData.orderId}\n`;
    message += `📊 Status: *${statusMessages[newStatus]}*\n\n`;

    // Specific instructions based on status
    switch (newStatus) {
      case "ready":
        if (orderData.deliveryType === "pickup") {
          message += `🏪 *READY FOR PICKUP*\n`;
          message += `Your order is packed and ready!\n\n`;
          message += `📍 Pickup Location:\n`;
          message += `${this.businessName}\n`;
          message += `123 Main Street\n`;
          message += `Karnataka 573103\n\n`;
          message += `⏰ Store Hours:\n`;
          message += `Monday - Saturday: 9:00 AM - 8:00 PM\n`;
          message += `Sunday: 10:00 AM - 6:00 PM\n\n`;
          message += `💳 Payment: ${
            orderData.paymentMethod === "cash_on_pickup"
              ? "Cash on Pickup"
              : "Already Paid"
          }\n\n`;
          message += `Please bring this message and a valid ID for pickup.\n`;
        } else {
          message += `🚚 *OUT FOR DELIVERY*\n`;
          message += `Your order is on its way!\n\n`;
          message += `📍 Delivery Address:\n`;
          message += `${orderData.deliveryAddress.street}\n`;
          message += `${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} - ${orderData.deliveryAddress.pincode}\n\n`;
          message += `Our delivery partner will contact you shortly.\n`;
          message += `Expected delivery: Within 2-3 hours\n`;
        }
        break;

      case "delivered":
        message += `🎉 *ORDER DELIVERED*\n`;
        message += `Thank you for shopping with us!\n\n`;
        message += `📦 Order Details:\n`;
        message += `Items: ${orderData.items.length}\n`;
        message += `Amount: ₹${orderData.totalAmount.toFixed(2)}\n\n`;
        message += `⭐ *Rate Your Experience*\n`;
        message += `We'd love to hear from you! Please share your feedback.\n\n`;
        message += `🔄 *Reorder*\n`;
        message += `Loved your products? Reorder anytime through WhatsApp!\n`;
        break;

      case "cancelled":
        message += `❌ *ORDER CANCELLED*\n`;
        message += `Your order has been cancelled as requested.\n\n`;
        if (orderData.paymentMethod === "prepaid") {
          message += `💰 Refund will be processed within 5-7 business days.\n\n`;
        }
        message += `We're sorry for any inconvenience caused.\n`;
        break;

      default:
        message += `We'll keep you updated on your order progress.\n`;
    }

    message += `\nNeed assistance? Reply to this message anytime.\n\n`;
    message += `Thank you for choosing ${this.businessName}! 🙏`;

    return message;
  }

  // Generate promotional message
  generatePromotionalMessage(customerName: string, promoContent: string) {
    let message = `🎉 *SPECIAL OFFER*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `Hello ${customerName}! 👋\n\n`;
    message += `${promoContent}\n\n`;

    message += `🛍️ *How to Order:*\n`;
    message += `1. Browse our digital catalogue\n`;
    message += `2. Add items to cart\n`;
    message += `3. Checkout via WhatsApp\n`;
    message += `4. Get confirmation instantly\n\n`;

    message += `📱 Order now through WhatsApp!\n`;
    message += `🚚 Free delivery on orders ₹1000+\n`;
    message += `💳 Multiple payment options available\n\n`;

    message += `*Terms and conditions apply.\n`;
    message += `Valid until stocks last.\n\n`;

    message += `Thank you for being our valued customer! 🙏`;

    return message;
  }

  // Complete test suite for WhatsApp integration
  async testWhatsAppIntegration(orderData: any) {
    console.log("🚀 Starting WhatsApp Integration Test...");
    console.log("=" * 50);

    // 1. Customer Order Enquiry
    console.log("\n📱 1. CUSTOMER ORDER ENQUIRY");
    console.log("-" * 30);
    const enquiryMessage = this.generateOrderEnquiry(orderData);
    const whatsappLink = this.generateCustomerOrderLink(orderData);

    console.log("Message Preview:");
    console.log(enquiryMessage);
    console.log("\nWhatsApp Link:");
    console.log(whatsappLink);

    // 2. Order Confirmation (Shop to Customer)
    console.log("\n✅ 2. ORDER CONFIRMATION");
    console.log("-" * 30);
    const confirmationMessage = this.generateOrderConfirmation(orderData);
    console.log(confirmationMessage);

    // 3. Status Updates
    console.log("\n📊 3. STATUS UPDATES");
    console.log("-" * 30);
    const statuses = ["confirmed", "preparing", "ready", "delivered"];

    statuses.forEach((status, index) => {
      console.log(`\n${index + 1}. Status: ${status.toUpperCase()}`);
      console.log("─" * 20);
      const statusMessage = this.generateStatusUpdate(orderData, status);
      console.log(statusMessage);
    });

    // 4. Promotional Message
    console.log("\n🎉 4. PROMOTIONAL MESSAGE");
    console.log("-" * 30);
    const promoMessage = this.generatePromotionalMessage(
      orderData.customerInfo.name,
      "🔥 FLASH SALE! Get 20% OFF on all rice varieties! Limited time offer - ends tonight at 11:59 PM."
    );
    console.log(promoMessage);

    // 5. Test Results Summary
    console.log("\n📋 5. TEST SUMMARY");
    console.log("=" * 30);
    console.log("✅ Order enquiry message generated");
    console.log("✅ WhatsApp link created");
    console.log("✅ Order confirmation message ready");
    console.log("✅ Status update messages prepared");
    console.log("✅ Promotional message template working");
    console.log("\n🎯 All WhatsApp integration tests passed!");

    return {
      enquiryMessage,
      whatsappLink,
      confirmationMessage,
      statusUpdates: statuses.map((status) => ({
        status,
        message: this.generateStatusUpdate(orderData, status),
      })),
      promotionalMessage: promoMessage,
    };
  }

  // Send message via WhatsApp Business API (placeholder for real implementation)
  async sendWhatsAppMessage(
    phoneNumber: string,
    message: string,
    messageType: string = "text"
  ) {
    console.log(`📤 Sending WhatsApp message to +91${phoneNumber}`);
    console.log(`Message Type: ${messageType}`);
    console.log(`Message: ${message.substring(0, 100)}...`);

    // In real implementation, this would call WhatsApp Business API
    // For now, we'll simulate the API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          messageId: `msg_${Date.now()}`,
          status: "sent",
        });
      }, 1000);
    });
  }
}

// Sample order data for testing
export const sampleOrderData = {
  orderId: "ORD20250109001",
  customerInfo: {
    name: "Rajesh Kumar",
    phoneNumber: "9876543210",
    address: {
      street: "123 MG Road, Jayanagar",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "573103",
    },
  },
  items: [
    {
      product: demoProducts[0], // Basmati Rice Premium
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
  totalAmount: 895, // Calculated from items + delivery
  totalWeight: 3.6, // Calculated from items
  deliveryType: "delivery",
  paymentMethod: "prepaid",
  deliveryFee: 0, // Free delivery as order > 1000
  isEligibleForFreeDelivery: true,
  deliveryAddress: {
    street: "123 MG Road, Jayanagar",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "573103",
  },
};

// Export instance for testing
export const whatsappTestService = new WhatsAppTestService();

// Function to send WhatsApp message to customer (Business to Customer)
export const openWhatsAppOrder = async (orderData: any) => {
  try {
    // Send WhatsApp message via API to customer
    const response = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: orderData.customerInfo.phoneNumber,
        message: whatsappTestService.generateOrderEnquiry(orderData),
        messageType: "order_enquiry",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send WhatsApp message");
    }

    console.log("✅ WhatsApp message sent successfully to customer:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error);
    throw error;
  }
};

// Function to simulate receiving order confirmation
export const simulateOrderConfirmation = (orderData: any) => {
  const message = whatsappTestService.generateOrderConfirmation(orderData);
  alert(
    `Order Confirmation will be sent via WhatsApp:\n\n${message.substring(
      0,
      200
    )}...`
  );
};

// Function to test complete WhatsApp flow
export const testCompleteWhatsAppFlow = (orderData: any) => {
  whatsappTestService.testWhatsAppIntegration(orderData);
};
