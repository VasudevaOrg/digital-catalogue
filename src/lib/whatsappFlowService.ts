// src/lib/whatsappFlowService.ts
// Complete WhatsApp Conversational Flow Management Service

interface UserSession {
  phone: string;
  state: ConversationState;
  lastInteraction: Date;
  data: Record<string, any>;
  messageHistory: string[];
}

type ConversationState =
  | "welcome"
  | "main_menu"
  | "order_tracking"
  | "awaiting_order_id"
  | "awaiting_phone_number"
  | "order_details"
  | "order_list"
  | "order_management"
  | "shopping_flow"
  | "help_support"
  | "contact_flow"
  | "feedback_flow";

interface FlowResponse {
  messages: WhatsAppMessagePayload[];
  nextState: ConversationState;
  sessionData?: Record<string, any>;
}

interface WhatsAppMessagePayload {
  type: "text" | "interactive" | "template";
  content: any;
}

export class WhatsAppFlowService {
  private sessions: Map<string, UserSession> = new Map();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Clean up expired sessions every 10 minutes
    setInterval(() => this.cleanupExpiredSessions(), 10 * 60 * 1000);
  }

  // Main entry point for processing messages
  async processMessage(phone: string, message: any): Promise<FlowResponse> {
    const session = this.getOrCreateSession(phone);

    console.log(
      `🔄 Processing message from ${phone} in state: ${session.state}`
    );

    // Add message to history
    session.messageHistory.push(
      `${new Date().toISOString()}: ${JSON.stringify(message)}`
    );

    // Keep only last 10 messages in history
    if (session.messageHistory.length > 10) {
      session.messageHistory = session.messageHistory.slice(-10);
    }

    try {
      const response = await this.handleMessageByState(session, message);

      // Update session
      session.state = response.nextState;
      session.lastInteraction = new Date();
      if (response.sessionData) {
        session.data = { ...session.data, ...response.sessionData };
      }

      this.sessions.set(phone, session);
      return response;
    } catch (error) {
      console.error(`Error processing message for ${phone}:`, error);
      return this.handleError(session);
    }
  }

  // Handle messages based on current state
  private async handleMessageByState(
    session: UserSession,
    message: any
  ): Promise<FlowResponse> {
    switch (session.state) {
      case "welcome":
        return this.handleWelcomeState(session, message);

      case "main_menu":
        return this.handleMainMenuState(session, message);

      case "order_tracking":
        return this.handleOrderTrackingState(session, message);

      case "awaiting_order_id":
        return await this.handleAwaitingOrderIdState(session, message);

      case "awaiting_phone_number":
        return await this.handleAwaitingPhoneNumberState(session, message);

      case "order_details":
        return this.handleOrderDetailsState(session, message);

      case "order_list":
        return this.handleOrderListState(session, message);

      case "order_management":
        return this.handleOrderManagementState(session, message);

      case "shopping_flow":
        return this.handleShoppingFlowState(session, message);

      case "help_support":
        return this.handleHelpSupportState(session, message);

      case "contact_flow":
        return this.handleContactFlowState(session, message);

      case "feedback_flow":
        return this.handleFeedbackFlowState(session, message);

      default:
        return this.handleDefaultState(session, message);
    }
  }

  // Welcome state handler
  private handleWelcomeState(session: UserSession, message: any): FlowResponse {
    const text = this.extractTextFromMessage(message).toLowerCase();

    // Check for specific intents
    if (this.containsOrderTrackingKeywords(text)) {
      return {
        messages: [this.createOrderTrackingMenu()],
        nextState: "order_tracking",
      };
    }

    if (this.containsShoppingKeywords(text)) {
      return {
        messages: [this.createShoppingMessage()],
        nextState: "shopping_flow",
      };
    }

    if (this.containsHelpKeywords(text)) {
      return {
        messages: [this.createHelpMessage()],
        nextState: "help_support",
      };
    }

    // Default to main menu
    return {
      messages: [
        this.createTextMessage(
          "👋 Welcome to Digital Catalogue! How can I help you today?"
        ),
        this.createMainMenu(),
      ],
      nextState: "main_menu",
    };
  }

  // Main menu state handler
  private handleMainMenuState(
    session: UserSession,
    message: any
  ): FlowResponse {
    const buttonId = this.extractButtonId(message);
    const text = this.extractTextFromMessage(message).toLowerCase();

    switch (buttonId || text) {
      case "track_order":
      case "track":
      case "order":
        return {
          messages: [this.createOrderTrackingMenu()],
          nextState: "order_tracking",
        };

      case "shop_now":
      case "shop":
      case "buy":
        return {
          messages: [this.createShoppingMessage()],
          nextState: "shopping_flow",
        };

      case "help_support":
      case "help":
        return {
          messages: [this.createHelpMessage()],
          nextState: "help_support",
        };

      default:
        return {
          messages: [
            this.createTextMessage("Please choose from the options below:"),
            this.createMainMenu(),
          ],
          nextState: "main_menu",
        };
    }
  }

  // Order tracking state handler
  private handleOrderTrackingState(
    session: UserSession,
    message: any
  ): FlowResponse {
    const buttonId = this.extractButtonId(message);
    const text = this.extractTextFromMessage(message);

    switch (buttonId) {
      case "track_by_id":
        return {
          messages: [
            this.createTextMessage(
              "🔍 *Track by Order ID*\n\nPlease enter your Order ID or Invoice Number:\n\n*Example:* ORD202501090001 or INV250109001\n\nType your order ID below:"
            ),
          ],
          nextState: "awaiting_order_id",
        };

      case "track_by_phone":
        return {
          messages: [
            this.createTextMessage(
              "📱 *Track by Phone Number*\n\nPlease enter the phone number used for the order:\n\n*Example:* 9876543210 or +91 9876543210\n\nType your phone number below:"
            ),
          ],
          nextState: "awaiting_phone_number",
        };

      case "recent_orders":
        return this.handleRecentOrdersRequest(session);

      case "back_to_menu":
        return {
          messages: [this.createMainMenu()],
          nextState: "main_menu",
        };

      default:
        // If user types order ID directly
        if (this.isOrderIdFormat(text)) {
          return this.processOrderIdInput(session, text);
        }

        // If user types phone number directly
        if (this.isPhoneNumberFormat(text)) {
          return this.processPhoneNumberInput(session, text);
        }

        return {
          messages: [this.createOrderTrackingMenu()],
          nextState: "order_tracking",
        };
    }
  }

  // Awaiting order ID state handler
  private async handleAwaitingOrderIdState(
    session: UserSession,
    message: any
  ): Promise<FlowResponse> {
    const orderId = this.extractTextFromMessage(message).trim();
    return await this.processOrderIdInput(session, orderId);
  }

  // Awaiting phone number state handler
  private async handleAwaitingPhoneNumberState(
    session: UserSession,
    message: any
  ): Promise<FlowResponse> {
    const phoneNumber = this.extractTextFromMessage(message).trim();
    return await this.processPhoneNumberInput(session, phoneNumber);
  }

  // Order details state handler
  private handleOrderDetailsState(
    session: UserSession,
    message: any
  ): FlowResponse {
    const buttonId = this.extractButtonId(message);

    switch (buttonId) {
      case "modify_order":
        return this.handleOrderModificationRequest(session);

      case "cancel_order":
        return this.handleOrderCancellationRequest(session);

      case "reorder":
        return this.handleReorderRequest(session);

      case "back_to_tracking":
        return {
          messages: [this.createOrderTrackingMenu()],
          nextState: "order_tracking",
        };

      default:
        return {
          messages: [this.createOrderManagementOptions()],
          nextState: "order_details",
        };
    }
  }

  // Process order ID input
  private async processOrderIdInput(
    session: UserSession,
    orderId: string
  ): Promise<FlowResponse> {
    try {
      const order = await this.findOrderById(orderId);

      if (order) {
        return {
          messages: [
            this.createOrderDetailsMessage(order),
            this.createOrderManagementOptions(),
          ],
          nextState: "order_details",
          sessionData: { currentOrder: order },
        };
      } else {
        return {
          messages: [
            this.createTextMessage(
              `❌ *Order Not Found*\n\nSorry, I couldn't find an order with ID: *${orderId}*\n\nPlease check your order ID and try again:`
            ),
            this.createOrderTrackingMenu(),
          ],
          nextState: "order_tracking",
        };
      }
    } catch (error) {
      return {
        messages: [
          this.createTextMessage(
            "Sorry, I encountered an error while searching for your order. Please try again or contact our support team."
          ),
          this.createMainMenu(),
        ],
        nextState: "main_menu",
      };
    }
  }

  // Process phone number input
  private async processPhoneNumberInput(
    session: UserSession,
    phoneNumber: string
  ): Promise<FlowResponse> {
    try {
      const orders = await this.findOrdersByPhone(phoneNumber);

      if (orders.length > 0) {
        return {
          messages: [this.createOrdersListMessage(orders)],
          nextState: "order_list",
          sessionData: { orders },
        };
      } else {
        return {
          messages: [
            this.createTextMessage(
              `❌ *No Orders Found*\n\nSorry, I couldn't find any orders for phone number: *${phoneNumber}*\n\nPlease check the phone number and try again:`
            ),
            this.createOrderTrackingMenu(),
          ],
          nextState: "order_tracking",
        };
      }
    } catch (error) {
      return {
        messages: [
          this.createTextMessage(
            "Sorry, I encountered an error while searching for orders. Please try again or contact our support team."
          ),
          this.createMainMenu(),
        ],
        nextState: "main_menu",
      };
    }
  }

  // Handle recent orders request
  private async handleRecentOrdersRequest(
    session: UserSession
  ): Promise<FlowResponse> {
    try {
      const orders = await this.findRecentOrdersForPhone(session.phone);

      if (orders.length > 0) {
        return {
          messages: [this.createOrdersListMessage(orders)],
          nextState: "order_list",
          sessionData: { orders },
        };
      } else {
        return {
          messages: [
            this.createTextMessage(
              "📦 *No Recent Orders*\n\nI couldn't find any recent orders for your number.\n\nWould you like to:\n• Try tracking with Order ID\n• Start shopping now"
            ),
            this.createOrderTrackingMenu(),
          ],
          nextState: "order_tracking",
        };
      }
    } catch (error) {
      return {
        messages: [
          this.createTextMessage(
            "Sorry, I encountered an error while fetching your orders. Please try again or contact our support team."
          ),
        ],
        nextState: "main_menu",
      };
    }
  }

  // Handle shopping flow
  private handleShoppingFlowState(
    session: UserSession,
    message: any
  ): FlowResponse {
    return {
      messages: [this.createMainMenu()],
      nextState: "main_menu",
    };
  }

  // Handle help support
  private handleHelpSupportState(
    session: UserSession,
    message: any
  ): FlowResponse {
    const text = this.extractTextFromMessage(message).toLowerCase();

    if (text.includes("contact") || text.includes("call")) {
      return {
        messages: [this.createContactMessage()],
        nextState: "contact_flow",
      };
    }

    return {
      messages: [this.createMainMenu()],
      nextState: "main_menu",
    };
  }

  // Handle error state
  private handleError(session: UserSession): FlowResponse {
    return {
      messages: [
        this.createTextMessage(
          "Sorry, I encountered an error. Let me help you get back on track."
        ),
        this.createMainMenu(),
      ],
      nextState: "main_menu",
    };
  }

  // Handle default state
  private handleDefaultState(session: UserSession, message: any): FlowResponse {
    return {
      messages: [
        this.createTextMessage("Let me help you with that."),
        this.createMainMenu(),
      ],
      nextState: "main_menu",
    };
  }

  // Message creation helpers
  private createTextMessage(text: string): WhatsAppMessagePayload {
    return {
      type: "text",
      content: {
        messaging_product: "whatsapp",
        to: "", // Will be filled by the caller
        type: "text",
        text: { body: text },
      },
    };
  }

  private createMainMenu(): WhatsAppMessagePayload {
    return {
      type: "interactive",
      content: {
        messaging_product: "whatsapp",
        to: "", // Will be filled by the caller
        type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "text",
            text: "🛒 Digital Catalogue Services",
          },
          body: {
            text: "What would you like to do?",
          },
          footer: {
            text: "Choose an option below",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "track_order",
                  title: "📦 Track Order",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "shop_now",
                  title: "🛍️ Shop Now",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "help_support",
                  title: "❓ Help & Support",
                },
              },
            ],
          },
        },
      },
    };
  }

  private createOrderTrackingMenu(): WhatsAppMessagePayload {
    return {
      type: "interactive",
      content: {
        messaging_product: "whatsapp",
        to: "", // Will be filled by the caller
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "📦 Order Tracking",
          },
          body: {
            text: "How would you like to track your order?",
          },
          footer: {
            text: "Digital Catalogue",
          },
          action: {
            button: "Track Order",
            sections: [
              {
                title: "Tracking Options",
                rows: [
                  {
                    id: "track_by_id",
                    title: "🔍 Track by Order ID",
                    description: "Enter your Order ID or Invoice Number",
                  },
                  {
                    id: "track_by_phone",
                    title: "📱 Track by Phone Number",
                    description: "Show orders for your phone number",
                  },
                  {
                    id: "recent_orders",
                    title: "📋 Recent Orders",
                    description: "View your last 5 orders",
                  },
                ],
              },
              {
                title: "Other Options",
                rows: [
                  {
                    id: "back_to_menu",
                    title: "⬅️ Back to Main Menu",
                    description: "Return to main menu",
                  },
                ],
              },
            ],
          },
        },
      },
    };
  }

  private createOrderDetailsMessage(order: any): WhatsAppMessagePayload {
    const statusEmojis: Record<string, string> = {
      confirmed: "✅",
      delivered: "🎉",
      cancelled: "❌",
    };

    const message = `${statusEmojis[order.orderStatus] || "📦"} *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━

📋 *Order Information*
Order ID: ${order.orderId}
Invoice: ${order.invoiceNumber || "N/A"}
Status: *${order.orderStatus.toUpperCase()}*
Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}

👤 *Customer*
Name: ${order.customerInfo.name}
Phone: +91${order.customerInfo.phoneNumber}

📦 *Items (${order.items.length})*
${order.items
  .map(
    (item: any, index: number) =>
      `${index + 1}. ${item.product.name} x ${item.quantity}`
  )
  .join("\n")}

💰 *Order Summary*
Total Amount: ₹${order.totalAmount}
Total Weight: ${order.totalWeight}kg
Delivery Fee: ${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}

🚚 *Delivery Details*
Type: ${order.deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"}
${
  order.deliveryAddress
    ? `Address: ${order.deliveryAddress.street}, ${order.deliveryAddress.city}`
    : "Pickup Location: Digital Catalogue Store"
}

💳 *Payment*
Method: ${
      order.paymentMethod === "prepaid" ? "Prepaid (Online)" : "Cash on Pickup"
    }
Status: ${order.paymentStatus || "Pending"}

━━━━━━━━━━━━━━━━━━━━━━━━━
Need help with this order? Choose an option below:`;

    return this.createTextMessage(message);
  }

  private createOrderManagementOptions(): WhatsAppMessagePayload {
    return {
      type: "interactive",
      content: {
        messaging_product: "whatsapp",
        to: "", // Will be filled by the caller
        type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "text",
            text: "📦 Order Management",
          },
          body: {
            text: "What would you like to do with this order?",
          },
          footer: {
            text: "Choose an option",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "modify_order",
                  title: "📝 Modify Order",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "cancel_order",
                  title: "❌ Cancel Order",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "reorder",
                  title: "🔄 Reorder",
                },
              },
            ],
          },
        },
      },
    };
  }

  private createOrdersListMessage(orders: any[]): WhatsAppMessagePayload {
    let message = `📦 *YOUR RECENT ORDERS*
━━━━━━━━━━━━━━━━━━━━━━━━━

Found ${orders.length} recent orders:

`;

    orders.forEach((order, index) => {
      const statusEmoji =
        order.orderStatus === "confirmed"
          ? "✅"
          : order.orderStatus === "delivered"
          ? "🎉"
          : "❌";

      message += `${index + 1}. ${statusEmoji} *${order.orderId}*
   Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}
   Amount: ₹${order.totalAmount}
   Status: ${order.orderStatus.toUpperCase()}
   Items: ${order.items.length}

`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━━━━
To get details of any order, just send me the Order ID.`;

    return this.createTextMessage(message);
  }

  private createShoppingMessage(): WhatsAppMessagePayload {
    const message = `🛍️ *Start Shopping*
━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to shop for premium quality groceries?

🌐 *Visit Our Website*
https://digital-catalogue-red.vercel.app

📱 *Browse Categories:*
• 🌾 Rice & Grains
• 🫒 Oils & Cooking Essentials
• 🌶️ Spices & Herbs  
• 🥛 Dairy Products
• 🥬 Fresh Vegetables
• And much more!

🚚 *Free Delivery* on orders ₹1000+
💳 *Multiple Payment Options*
📱 *WhatsApp Order Confirmation*

Happy Shopping! 🙏`;

    return this.createTextMessage(message);
  }

  private createHelpMessage(): WhatsAppMessagePayload {
    const message = `❓ *HELP & SUPPORT*
━━━━━━━━━━━━━━━━━━━━━━━━━

🛒 *Order Commands:*
• Type "track" - Track your orders
• Type "shop" - Browse our products  
• Type "help" - Show this menu
• Type "menu" - Main menu

📦 *Order Tracking:*
• Enter your Order ID directly
• Use your phone number to find orders
• Check recent order history

📞 *Contact Support:*
• Phone: +91 82971 37702
• WhatsApp: This number
• Email: support@digitalcatalogue.com

🏪 *Store Information:*
• Address: 123 Main Street, Karnataka 573103
• Hours: Mon-Sat 9AM-8PM, Sun 10AM-6PM
• Free Delivery: Orders ₹1000+

🌐 *Website:* https://digital-catalogue-red.vercel.app

Just type your question and I'll help you! 😊`;

    return this.createTextMessage(message);
  }

  private createContactMessage(): WhatsAppMessagePayload {
    const message = `📞 *CONTACT INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━

🏪 *Digital Catalogue Store*

📱 *Phone:* +91 82971 37702
💬 *WhatsApp:* +91 82971 37702
📧 *Email:* support@digitalcatalogue.com

📍 *Store Address:*
123 Main Street
Karnataka 573103
India

⏰ *Store Hours:*
Monday - Saturday: 9:00 AM - 8:00 PM
Sunday: 10:00 AM - 6:00 PM

🌐 *Website:*
https://digital-catalogue-red.vercel.app

🚚 *Delivery Available:*
Free delivery on orders ₹1000+
Same day delivery available

Our team will contact you shortly! 👨‍💼`;

    return this.createTextMessage(message);
  }

  // Order management handlers
  private handleOrderModificationRequest(session: UserSession): FlowResponse {
    const order = session.data?.currentOrder;

    if (!order) {
      return {
        messages: [
          this.createTextMessage("Please first track your order to modify it."),
          this.createOrderTrackingMenu(),
        ],
        nextState: "order_tracking",
      };
    }

    if (order.orderStatus !== "confirmed") {
      return {
        messages: [
          this.createTextMessage(`❌ *Cannot Modify Order*

This order cannot be modified as it is already *${order.orderStatus.toUpperCase()}*.

Only confirmed orders can be modified.`),
        ],
        nextState: "order_details",
      };
    }

    const message = `📝 *Order Modification Request*

Order ID: ${order.orderId}
Current Status: ${order.orderStatus.toUpperCase()}

To modify your order, our team will contact you directly.

What would you like to modify?
• Add items
• Remove items  
• Change delivery address
• Change delivery time

Please call us at +91 82971 37702 or our team will contact you within 10 minutes.

Order modifications are subject to availability and may affect the total amount.`;

    return {
      messages: [this.createTextMessage(message)],
      nextState: "order_details",
    };
  }

  private handleOrderCancellationRequest(session: UserSession): FlowResponse {
    const order = session.data?.currentOrder;

    if (!order) {
      return {
        messages: [
          this.createTextMessage("Please first track your order to cancel it."),
          this.createOrderTrackingMenu(),
        ],
        nextState: "order_tracking",
      };
    }

    if (order.orderStatus !== "confirmed") {
      return {
        messages: [
          this.createTextMessage(`❌ *Cannot Cancel Order*

This order cannot be cancelled as it is already *${order.orderStatus.toUpperCase()}*.

Only confirmed orders can be cancelled.`),
        ],
        nextState: "order_details",
      };
    }

    const message = `❌ *Order Cancellation Request*

Order ID: ${order.orderId}
Amount: ₹${order.totalAmount}

Are you sure you want to cancel this order?

⚠️ *Cancellation Policy:*
• Orders can be cancelled within 30 minutes of confirmation
• Prepaid orders will be refunded within 5-7 business days
• No cancellation fees for confirmed orders

To confirm cancellation, please call us at +91 82971 37702 

Our team will process your request immediately.`;

    return {
      messages: [this.createTextMessage(message)],
      nextState: "order_details",
    };
  }

  private handleReorderRequest(session: UserSession): FlowResponse {
    const order = session.data?.currentOrder;

    if (!order) {
      return {
        messages: [
          this.createTextMessage(
            "Please first track your order to reorder it."
          ),
          this.createOrderTrackingMenu(),
        ],
        nextState: "order_tracking",
      };
    }

    const message = `🔄 *Reorder Items*

Order ID: ${order.orderId}
Original Amount: ₹${order.totalAmount}

Items in this order:
${order.items
  .map(
    (item: any, index: number) =>
      `${index + 1}. ${item.product.name} x ${item.quantity}`
  )
  .join("\n")}

🛒 *To Reorder:*
Visit our website: https://digital-catalogue-red.vercel.app

Or call us at +91 82971 37702 and mention this Order ID.

Our team can help you place the same order with current prices and availability.`;

    return {
      messages: [this.createTextMessage(message), this.createMainMenu()],
      nextState: "main_menu",
    };
  }

  // Utility methods
  private getOrCreateSession(phone: string): UserSession {
    const existing = this.sessions.get(phone);
    if (existing) {
      existing.lastInteraction = new Date();
      return existing;
    }

    const newSession: UserSession = {
      phone,
      state: "welcome",
      lastInteraction: new Date(),
      data: {},
      messageHistory: [],
    };

    this.sessions.set(phone, newSession);
    return newSession;
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [phone, session] of this.sessions.entries()) {
      if (
        now.getTime() - session.lastInteraction.getTime() >
        this.SESSION_TIMEOUT
      ) {
        this.sessions.delete(phone);
        console.log(`🧹 Cleaned up expired session for ${phone}`);
      }
    }
  }

  private extractTextFromMessage(message: any): string {
    if (message.type === "text") {
      return message.text?.body || "";
    }
    if (message.type === "interactive") {
      return (
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        ""
      );
    }
    return "";
  }

  private extractButtonId(message: any): string | null {
    if (message.type === "interactive") {
      return (
        message.interactive?.button_reply?.id ||
        message.interactive?.list_reply?.id ||
        null
      );
    }
    return null;
  }

  private containsOrderTrackingKeywords(text: string): boolean {
    const keywords = ["track", "order", "status", "delivery", "where", "when"];
    return keywords.some((keyword) => text.includes(keyword));
  }

  private containsShoppingKeywords(text: string): boolean {
    const keywords = ["shop", "buy", "product", "catalogue", "purchase"];
    return keywords.some((keyword) => text.includes(keyword));
  }

  private containsHelpKeywords(text: string): boolean {
    const keywords = ["help", "support", "assist", "problem", "issue"];
    return keywords.some((keyword) => text.includes(keyword));
  }

  private isOrderIdFormat(text: string): boolean {
    // Check if text looks like an order ID (ORD... or INV...)
    return /^(ORD|INV|ord|inv)[0-9a-zA-Z]+$/i.test(text.trim());
  }

  private isPhoneNumberFormat(text: string): boolean {
    // Check if text looks like a phone number
    const cleaned = text.replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 13;
  }

  // Database operations (to be implemented)
  private async findOrderById(orderId: string): Promise<any | null> {
    try {
      // Import database connection and Order model
      const dbConnect = require("@/lib/mongodb").default;
      const Order = require("@/models/Order").default;

      await dbConnect();

      const order = await Order.findOne({
        $or: [{ orderId: orderId }, { invoiceNumber: orderId }],
      }).lean();

      return order;
    } catch (error) {
      console.error("Error finding order by ID:", error);
      throw error;
    }
  }

  private async findOrdersByPhone(phoneNumber: string): Promise<any[]> {
    try {
      const dbConnect = require("@/lib/mongodb").default;
      const Order = require("@/models/Order").default;

      await dbConnect();

      // Clean phone number and create variants
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const phoneVariants = [
        phoneNumber,
        cleanPhone,
        `91${cleanPhone}`,
        `+91${cleanPhone}`,
      ];

      const orders = await Order.find({
        "customerInfo.phoneNumber": { $in: phoneVariants },
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      return orders;
    } catch (error) {
      console.error("Error finding orders by phone:", error);
      throw error;
    }
  }

  private async findRecentOrdersForPhone(phone: string): Promise<any[]> {
    try {
      // Clean phone number (remove +91 prefix if present)
      const cleanPhone = phone.replace(/^\+91/, "").replace(/\D/g, "");

      const phoneVariants = [
        phone,
        cleanPhone,
        `91${cleanPhone}`,
        `+91${cleanPhone}`,
      ];

      return await this.findOrdersByPhone(cleanPhone);
    } catch (error) {
      console.error("Error finding recent orders:", error);
      throw error;
    }
  }

  // Contact flow handlers
  private handleContactFlowState(
    session: UserSession,
    message: any
  ): FlowResponse {
    return {
      messages: [this.createMainMenu()],
      nextState: "main_menu",
    };
  }

  private handleFeedbackFlowState(
    session: UserSession,
    message: any
  ): FlowResponse {
    return {
      messages: [
        this.createTextMessage(
          "Thank you for your feedback! We appreciate your input."
        ),
        this.createMainMenu(),
      ],
      nextState: "main_menu",
    };
  }

  private handleOrderListState(
    session: UserSession,
    message: any
  ): FlowResponse {
    const text = this.extractTextFromMessage(message);

    // If user types an order ID from the list
    if (this.isOrderIdFormat(text)) {
      return this.processOrderIdInput(session, text);
    }

    return {
      messages: [this.createOrderTrackingMenu()],
      nextState: "order_tracking",
    };
  }

  private handleOrderManagementState(
    session: UserSession,
    message: any
  ): FlowResponse {
    const buttonId = this.extractButtonId(message);

    switch (buttonId) {
      case "back_to_tracking":
        return {
          messages: [this.createOrderTrackingMenu()],
          nextState: "order_tracking",
        };

      default:
        return {
          messages: [this.createMainMenu()],
          nextState: "main_menu",
        };
    }
  }

  // Get session info (for debugging)
  public getSessionInfo(phone: string): UserSession | null {
    return this.sessions.get(phone) || null;
  }

  // Clear session (for testing or reset)
  public clearSession(phone: string): void {
    this.sessions.delete(phone);
  }

  // Get all active sessions (for admin/debugging)
  public getActiveSessions(): UserSession[] {
    return Array.from(this.sessions.values());
  }
}

// Export singleton instance
export const whatsappFlowService = new WhatsAppFlowService();
