// src/app/api/whatsapp/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

// Environment variables
const VERIFY_TOKEN =
  process.env.WEBHOOK_VERIFY_TOKEN || "digital_catalogue_webhook_2025_secure";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0";
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || "802685189585173";

// GET - Webhook Verification (Required by Meta)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log("🔍 Webhook verification attempt:");
  console.log("Mode:", mode);
  console.log("Token received:", token);
  console.log("Token expected:", VERIFY_TOKEN);
  console.log("Challenge:", challenge);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    return new Response(challenge, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } else {
    console.log("❌ Webhook verification failed!");
    return new Response("Forbidden", { status: 403 });
  }
}

// POST - Handle Incoming Messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📨 Incoming WhatsApp webhook:", JSON.stringify(body, null, 2));

    // Check if it's a message webhook
    if (
      body.entry &&
      body.entry[0]?.changes &&
      body.entry[0]?.changes[0]?.value?.messages
    ) {
      const change = body.entry[0].changes[0].value;
      const message = change.messages[0];
      const phone = message.from;
      const messageId = message.id;

      console.log(`📱 New message from ${phone}:`, message);

      // Prevent infinite loops - don't respond to our own messages
      if (change.metadata?.phone_number_id === WHATSAPP_PHONE_ID) {
        console.log("🔄 Ignoring our own message");
        return NextResponse.json({ status: "ignored" });
      }

      // Mark message as read
      await markMessageAsRead(messageId);

      // Process the message based on type
      switch (message.type) {
        case "text":
          await handleTextMessage(phone, message.text.body, messageId);
          break;
        case "interactive":
          await handleInteractiveMessage(phone, message.interactive, messageId);
          break;
        case "button":
          await handleButtonMessage(phone, message.button, messageId);
          break;
        default:
          console.log(`📝 Unhandled message type: ${message.type}`);
          await sendHelpMessage(phone);
      }
    }

    // Check for message status updates (delivered, read, etc.)
    if (
      body.entry &&
      body.entry[0]?.changes &&
      body.entry[0]?.changes[0]?.value?.statuses
    ) {
      const status = body.entry[0].changes[0].value.statuses[0];
      console.log(`📊 Message status update:`, status);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle text messages
async function handleTextMessage(
  phone: string,
  text: string,
  messageId: string
) {
  const normalizedText = text.toLowerCase().trim();

  console.log(`🔄 Processing text: "${normalizedText}" from ${phone}`);

  // Order-related keywords
  if (
    normalizedText.includes("confirm") ||
    normalizedText === "yes" ||
    normalizedText === "✅"
  ) {
    await handleOrderConfirmation(phone);
  } else if (
    normalizedText.includes("cancel") ||
    normalizedText === "no" ||
    normalizedText === "❌"
  ) {
    await handleOrderCancellation(phone);
  } else if (
    normalizedText.includes("modify") ||
    normalizedText.includes("change") ||
    normalizedText === "📝"
  ) {
    await handleOrderModification(phone);
  } else if (
    normalizedText.includes("help") ||
    normalizedText === "❓" ||
    normalizedText === "menu"
  ) {
    await sendHelpMessage(phone);
  } else if (
    normalizedText.includes("status") ||
    normalizedText.includes("track")
  ) {
    await handleOrderStatus(phone);
  } else if (
    normalizedText.includes("contact") ||
    normalizedText.includes("call")
  ) {
    await handleContactRequest(phone);
  }
  // Greetings
  else if (
    normalizedText.includes("hi") ||
    normalizedText.includes("hello") ||
    normalizedText.includes("hey")
  ) {
    await sendWelcomeMessage(phone);
  } else {
    // Default response with options
    await sendOptionsMenu(phone);
  }
}

// Handle interactive button responses
async function handleInteractiveMessage(
  phone: string,
  interactive: any,
  messageId: string
) {
  console.log(`🔘 Interactive message from ${phone}:`, interactive);

  const buttonId = interactive.button_reply?.id || interactive.list_reply?.id;

  switch (buttonId) {
    case "confirm_order":
      await handleOrderConfirmation(phone);
      break;
    case "modify_order":
      await handleOrderModification(phone);
      break;
    case "cancel_order":
      await handleOrderCancellation(phone);
      break;
    case "help_support":
      await sendHelpMessage(phone);
      break;
    case "add_items":
      await handleAddItems(phone);
      break;
    case "remove_items":
      await handleRemoveItems(phone);
      break;
    case "change_address":
      await handleChangeAddress(phone);
      break;
    case "contact_agent":
      await handleContactRequest(phone);
      break;
    default:
      await sendOptionsMenu(phone);
  }
}

// Handle button messages
async function handleButtonMessage(
  phone: string,
  button: any,
  messageId: string
) {
  console.log(`🔘 Button message from ${phone}:`, button);
  await handleInteractiveMessage(phone, { button_reply: button }, messageId);
}

// Action handlers
async function handleOrderConfirmation(phone: string) {
  const response = `✅ **ORDER CONFIRMED**

Thank you! Your order has been confirmed and is now being processed.

📋 **Next Steps:**
• Payment processing (if prepaid)
• Order preparation begins  
• You'll receive status updates

⏱️ **Timeline:**
• Pickup: Ready in 2-4 hours
• Delivery: 4-6 hours

📱 You can check status anytime by replying "STATUS"

Need anything else? Reply "HELP" for options.`;

  await sendMessage(phone, response);
  console.log(`📝 Order confirmed for ${phone}`);
}

async function handleOrderCancellation(phone: string) {
  const response = `❌ **ORDER CANCELLED**

We've cancelled your order as requested.

💰 **Refund Information:**
• Prepaid orders: 5-7 business days
• No charges for cancelled orders

🛒 **Place New Order:**
• Visit: https://digital-catalogue-red.vercel.app
• Browse our digital catalogue
• Call us: +91 82971 37702

Thank you for considering Digital Catalogue! 🙏

Want to place a new order? Reply "MENU"`;

  await sendMessage(phone, response);
  console.log(`📝 Order cancelled for ${phone}`);
}

async function handleOrderModification(phone: string) {
  const response = `📝 **ORDER MODIFICATION**

What would you like to modify?

Please choose an option:`;

  await sendMessage(phone, response);
  await sendModificationOptions(phone);
}

async function handleOrderStatus(phone: string) {
  const mockOrder = {
    id: "ORD20250109001",
    status: "confirmed",
    items: 3,
    total: "480.00",
    estimatedTime: "2-4 hours",
  };

  const statusEmojis: Record<string, string> = {
    pending: "⏳",
    confirmed: "✅",
    preparing: "👨‍🍳",
    ready: "📦",
    delivered: "🎉",
  };

  const response = `${statusEmojis[mockOrder.status]} **ORDER STATUS**

📋 **Order Details:**
Order ID: ${mockOrder.id}
Status: ${mockOrder.status.toUpperCase()}
Items: ${mockOrder.items}
Total: ₹${mockOrder.total}

⏱️ **Estimated Time:** ${mockOrder.estimatedTime}

🔔 We'll notify you when status changes!

Reply "HELP" for more options.`;

  await sendMessage(phone, response);
}

async function handleContactRequest(phone: string) {
  const response = `📞 **CONTACT SUPPORT**

Our team will contact you shortly!

📱 **Contact Methods:**
• WhatsApp Call: Within 5 minutes
• Phone Call: +91 82971 37702
• Email: support@digitalcatalogue.com

🏪 **Store Location:**
123 Main Street
Karnataka 573103

⏰ **Store Hours:**
Mon-Sat: 9:00 AM - 8:00 PM
Sunday: 10:00 AM - 6:00 PM

A team member will reach out soon! 👨‍💼`;

  await sendMessage(phone, response);
  console.log(`📞 Contact request from ${phone}`);
}

async function sendWelcomeMessage(phone: string) {
  const response = `👋 **Welcome to Digital Catalogue!**

How can I help you today?

🛒 **Order Related:**
• Check order status
• Modify your order  
• Cancel order
• Place new order

🆘 **Need Help?**
• Contact support
• Store information
• FAQ and guides

Reply with what you need or choose from the options below! 👇`;

  await sendMessage(phone, response);
  await sendOptionsMenu(phone);
}

async function sendOptionsMenu(phone: string) {
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "🛒 Order Options",
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
              id: "confirm_order",
              title: "✅ Confirm",
            },
          },
          {
            type: "reply",
            reply: {
              id: "modify_order",
              title: "📝 Modify",
            },
          },
          {
            type: "reply",
            reply: {
              id: "help_support",
              title: "❓ Help",
            },
          },
        ],
      },
    },
  };

  await sendWhatsAppMessage(payload);
}

async function sendModificationOptions(phone: string) {
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "📝 Modify Order",
      },
      body: {
        text: "Select what you'd like to change:",
      },
      footer: {
        text: "Digital Catalogue",
      },
      action: {
        button: "View Options",
        sections: [
          {
            title: "Order Changes",
            rows: [
              {
                id: "add_items",
                title: "➕ Add Items",
                description: "Add more products to your order",
              },
              {
                id: "remove_items",
                title: "➖ Remove Items",
                description: "Remove products from order",
              },
              {
                id: "change_address",
                title: "📍 Change Address",
                description: "Update delivery address",
              },
              {
                id: "contact_agent",
                title: "👨‍💼 Speak to Agent",
                description: "Talk to our team member",
              },
            ],
          },
        ],
      },
    },
  };

  await sendWhatsAppMessage(payload);
}

async function sendHelpMessage(phone: string) {
  const response = `❓ **HELP & SUPPORT**

🛒 **Order Commands:**
• "CONFIRM" - Confirm your order
• "CANCEL" - Cancel order  
• "MODIFY" - Change order details
• "STATUS" - Check order status

📞 **Contact:**
• Phone: +91 82971 37702
• Email: support@digitalcatalogue.com
• Store: 123 Main Street, Karnataka 573103

⏰ **Store Hours:**
Mon-Sat: 9AM-8PM | Sun: 10AM-6PM

🌐 **Website:** https://digital-catalogue-red.vercel.app

Just type your question or use the keywords above! 
Reply "MENU" to see all options.`;

  await sendMessage(phone, response);
}

async function handleAddItems(phone: string) {
  const response = `➕ **ADD ITEMS**

You can add items by:

🌐 **Visit Website:**
https://digital-catalogue-red.vercel.app

📱 **Browse Categories:**
• Rice & Grains
• Oils & Spices  
• Pulses & Lentils
• Dairy Products

💬 **Tell Us Here:**
Just type the items you want to add!

Example: "Add 1kg basmati rice and turmeric powder"

⏰ **Note:** Items can be added within 30 minutes of order placement.`;

  await sendMessage(phone, response);
}

async function handleRemoveItems(phone: string) {
  const response = `➖ **REMOVE ITEMS**

Tell us what you'd like to remove from your order.

💬 **How to Remove:**
Type what you want to remove:
• "Remove brown rice"
• "Remove 2kg items"
• "Remove everything except rice"

⚠️ **Important:**
• Items can be removed within 30 minutes
• Refund will be processed for removed items
• Minimum order value may apply

What would you like to remove?`;

  await sendMessage(phone, response);
}

async function handleChangeAddress(phone: string) {
  const response = `📍 **CHANGE DELIVERY ADDRESS**

Please provide your new address in this format:

📝 **Format:**
Street Address
City, State
Pincode

📍 **Example:**
123 MG Road, Jayanagar  
Bangalore, Karnataka
560041

⚠️ **Note:**
• Address changes possible within 30 minutes
• Delivery charges may vary by location
• We deliver within 573103 area

Please share your new address:`;

  await sendMessage(phone, response);
}

// Utility functions
async function sendMessage(phone: string, text: string) {
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text },
  };

  await sendWhatsAppMessage(payload);
}

async function sendWhatsAppMessage(payload: any) {
  try {
    if (!WHATSAPP_ACCESS_TOKEN) {
      console.error(
        "❌ WHATSAPP_ACCESS_TOKEN not found in environment variables"
      );
      return;
    }

    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Failed to send message:", data);
    } else {
      console.log("✅ Message sent successfully:", data.messages?.[0]?.id);
    }

    return data;
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
}

async function markMessageAsRead(messageId: string) {
  try {
    if (!WHATSAPP_ACCESS_TOKEN) return;

    const payload = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    };

    await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
  }
}
