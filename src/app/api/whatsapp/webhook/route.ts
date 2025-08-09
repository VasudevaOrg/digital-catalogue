// src/app/api/whatsapp/webhook/route.ts
// Enhanced WhatsApp webhook with comprehensive debugging
import { NextRequest, NextResponse } from "next/server";

// Environment variables
const VERIFY_TOKEN =
  process.env.WEBHOOK_VERIFY_TOKEN || "digital_catalogue_webhook_2025_secure";
const WHATSAPP_ACCESS_TOKEN =
  process.env.WHATSAPP_ACCESS_TOKEN ||
  "EAASGzwVtiEMBPGm6BInc139gzjfusde8Fh5cov4LGhsjD8fSeWFCfS8vbpDreIYpkaKsz9UI40H9pjWBXOFI63zRehjrxs52E6JFeoLijDxVZCZAgbZCQwZAo28GpYoyTpiN2uJTktilWRLe0soDsD6DZAW0aOI7aRzrqL4tmAZB09ZCH8xJ0MrdupNsuQRJRlHTeZBguTVZAkdq12cyfS3HIsQNRvPJShz1jRts2Dd2ycUg1IgZDZD";
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

    console.log("\n" + "=".repeat(80));
    console.log("📨 INCOMING WHATSAPP WEBHOOK");
    console.log("=".repeat(80));
    console.log("Raw body:", JSON.stringify(body, null, 2));
    console.log("Timestamp:", new Date().toISOString());

    // Detailed webhook structure analysis
    if (body.entry && Array.isArray(body.entry)) {
      console.log(`📋 Found ${body.entry.length} entries`);

      for (let i = 0; i < body.entry.length; i++) {
        const entry = body.entry[i];
        console.log(`\n🔍 Entry ${i + 1}:`, JSON.stringify(entry, null, 2));

        if (entry.changes && Array.isArray(entry.changes)) {
          console.log(`📝 Found ${entry.changes.length} changes`);

          for (let j = 0; j < entry.changes.length; j++) {
            const change = entry.changes[j];
            console.log(
              `\n📑 Change ${j + 1}:`,
              JSON.stringify(change, null, 2)
            );

            if (change.value) {
              console.log("📊 Change Value Analysis:");
              console.log("- Metadata:", change.value.metadata);
              console.log("- Messages:", change.value.messages);
              console.log("- Statuses:", change.value.statuses);
              console.log("- Contacts:", change.value.contacts);
            }
          }
        }
      }
    }

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

      console.log("\n" + "📱".repeat(20));
      console.log("📱 PROCESSING INCOMING MESSAGE");
      console.log("📱".repeat(20));
      console.log(`📞 From: ${phone}`);
      console.log(`🆔 Message ID: ${messageId}`);
      console.log(`📝 Message Type: ${message.type}`);
      console.log(`🕐 Timestamp: ${message.timestamp}`);
      console.log(`📋 Full Message:`, JSON.stringify(message, null, 2));

      // Check contacts if available
      if (change.contacts && change.contacts.length > 0) {
        console.log(
          `👤 Contact Info:`,
          JSON.stringify(change.contacts[0], null, 2)
        );
      }

      // Prevent infinite loops - don't respond to our own messages
      if (change.metadata?.phone_number_id === WHATSAPP_PHONE_ID) {
        console.log("🔄 Ignoring our own message to prevent loop");
        return NextResponse.json({ status: "ignored_own_message" });
      }

      // Mark message as read first
      console.log("✅ Marking message as read...");
      await markMessageAsRead(messageId);

      // Process the message based on type
      console.log(`🔄 Processing ${message.type} message...`);
      switch (message.type) {
        case "text":
          console.log(`📝 Text content: "${message.text.body}"`);
          await handleTextMessage(phone, message.text.body, messageId);
          break;
        case "interactive":
          console.log(
            `🔘 Interactive content:`,
            JSON.stringify(message.interactive, null, 2)
          );
          await handleInteractiveMessage(phone, message.interactive, messageId);
          break;
        case "button":
          console.log(
            `🔘 Button content:`,
            JSON.stringify(message.button, null, 2)
          );
          await handleButtonMessage(phone, message.button, messageId);
          break;
        default:
          console.log(`❓ Unhandled message type: ${message.type}`);
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
      console.log("\n📊 MESSAGE STATUS UPDATE:");
      console.log("Status details:", JSON.stringify(status, null, 2));

      // Log status information
      console.log(`📨 Message ID: ${status.id}`);
      console.log(`📍 Status: ${status.status}`);
      console.log(`📞 Recipient: ${status.recipient_id}`);
      console.log(`🕐 Timestamp: ${status.timestamp}`);
    }

    console.log("\n✅ Webhook processed successfully");
    return NextResponse.json({ status: "success", processed: true });
  } catch (error) {
    console.error("\n❌ WEBHOOK ERROR:");
    console.error("Error details:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Enhanced text message handler with better logging
async function handleTextMessage(
  phone: string,
  text: string,
  messageId: string
) {
  const normalizedText = text.toLowerCase().trim();

  console.log(`\n🔄 PROCESSING TEXT MESSAGE`);
  console.log(`📞 From: ${phone}`);
  console.log(`📝 Original: "${text}"`);
  console.log(`🔤 Normalized: "${normalizedText}"`);

  // Order-related keywords with enhanced matching
  if (
    normalizedText.includes("confirm") ||
    normalizedText === "yes" ||
    normalizedText === "✅" ||
    normalizedText.includes("confirm order") ||
    normalizedText.includes("yes confirm")
  ) {
    console.log("✅ Detected: Order Confirmation");
    await handleOrderConfirmation(phone);
  } else if (
    normalizedText.includes("cancel") ||
    normalizedText === "no" ||
    normalizedText === "❌" ||
    normalizedText.includes("cancel order")
  ) {
    console.log("❌ Detected: Order Cancellation");
    await handleOrderCancellation(phone);
  } else if (
    normalizedText.includes("modify") ||
    normalizedText.includes("change") ||
    normalizedText === "📝" ||
    normalizedText.includes("modify order")
  ) {
    console.log("📝 Detected: Order Modification");
    await handleOrderModification(phone);
  } else if (
    normalizedText.includes("help") ||
    normalizedText === "❓" ||
    normalizedText === "menu" ||
    normalizedText.includes("support")
  ) {
    console.log("❓ Detected: Help Request");
    await sendHelpMessage(phone);
  } else if (
    normalizedText.includes("status") ||
    normalizedText.includes("track") ||
    normalizedText.includes("order status")
  ) {
    console.log("📊 Detected: Status Check");
    await handleOrderStatus(phone);
  } else if (
    normalizedText.includes("contact") ||
    normalizedText.includes("call") ||
    normalizedText.includes("talk to agent")
  ) {
    console.log("📞 Detected: Contact Request");
    await handleContactRequest(phone);
  }
  // Greetings
  else if (
    normalizedText.includes("hi") ||
    normalizedText.includes("hello") ||
    normalizedText.includes("hey") ||
    normalizedText.includes("good morning") ||
    normalizedText.includes("good afternoon") ||
    normalizedText.includes("good evening")
  ) {
    console.log("👋 Detected: Greeting");
    await sendWelcomeMessage(phone);
  } else {
    console.log("🤖 Detected: General inquiry - sending options menu");
    await sendOptionsMenu(phone);
  }
}

// Enhanced interactive message handler
async function handleInteractiveMessage(
  phone: string,
  interactive: any,
  messageId: string
) {
  console.log(`\n🔘 PROCESSING INTERACTIVE MESSAGE`);
  console.log(`📞 From: ${phone}`);
  console.log(`🔘 Interactive data:`, JSON.stringify(interactive, null, 2));

  const buttonId = interactive.button_reply?.id || interactive.list_reply?.id;
  console.log(`🔘 Button/List ID: ${buttonId}`);

  switch (buttonId) {
    case "confirm_order":
      console.log("✅ Interactive: Order Confirmation");
      await handleOrderConfirmation(phone);
      break;
    case "modify_order":
      console.log("📝 Interactive: Order Modification");
      await handleOrderModification(phone);
      break;
    case "cancel_order":
      console.log("❌ Interactive: Order Cancellation");
      await handleOrderCancellation(phone);
      break;
    case "help_support":
      console.log("❓ Interactive: Help Support");
      await sendHelpMessage(phone);
      break;
    default:
      console.log(
        `🤖 Interactive: Unknown button "${buttonId}" - sending options`
      );
      await sendOptionsMenu(phone);
  }
}

// Enhanced button message handler
async function handleButtonMessage(
  phone: string,
  button: any,
  messageId: string
) {
  console.log(`\n🔘 PROCESSING BUTTON MESSAGE`);
  console.log(`📞 From: ${phone}`);
  console.log(`🔘 Button data:`, JSON.stringify(button, null, 2));
  await handleInteractiveMessage(phone, { button_reply: button }, messageId);
}

// Enhanced order confirmation handler
async function handleOrderConfirmation(phone: string) {
  console.log(`✅ Processing order confirmation for ${phone}`);

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

// Enhanced order cancellation handler
async function handleOrderCancellation(phone: string) {
  console.log(`❌ Processing order cancellation for ${phone}`);

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

// Enhanced order modification handler
async function handleOrderModification(phone: string) {
  console.log(`📝 Processing order modification for ${phone}`);

  const response = `📝 **ORDER MODIFICATION**

What would you like to modify?

Please choose an option:`;

  await sendMessage(phone, response);
  await sendModificationOptions(phone);
}

// Enhanced order status handler
async function handleOrderStatus(phone: string) {
  console.log(`📊 Processing order status check for ${phone}`);

  // Mock order data - in real implementation, fetch from database
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
  console.log(`📊 Status sent for ${phone}`);
}

// Enhanced contact request handler
async function handleContactRequest(phone: string) {
  console.log(`📞 Processing contact request for ${phone}`);

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
  console.log(`📞 Contact request processed for ${phone}`);
}

// Enhanced welcome message
async function sendWelcomeMessage(phone: string) {
  console.log(`👋 Sending welcome message to ${phone}`);

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

// Enhanced options menu
async function sendOptionsMenu(phone: string) {
  console.log(`📋 Sending options menu to ${phone}`);

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

// Enhanced modification options
async function sendModificationOptions(phone: string) {
  console.log(`📝 Sending modification options to ${phone}`);

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

// Enhanced help message
async function sendHelpMessage(phone: string) {
  console.log(`❓ Sending help message to ${phone}`);

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

// Enhanced message sending function
async function sendMessage(phone: string, text: string) {
  console.log(`📤 Sending text message to ${phone}`);
  console.log(`📝 Message length: ${text.length} characters`);
  console.log(`📝 Message preview: "${text.substring(0, 100)}..."`);

  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text },
  };

  await sendWhatsAppMessage(payload);
}

// Enhanced WhatsApp API message sender
async function sendWhatsAppMessage(payload: any) {
  try {
    console.log(`📡 SENDING WHATSAPP MESSAGE`);
    console.log(`🎯 To: ${payload.to}`);
    console.log(`📨 Type: ${payload.type}`);
    console.log(`📦 Payload:`, JSON.stringify(payload, null, 2));

    if (!WHATSAPP_ACCESS_TOKEN) {
      console.error(
        "❌ WHATSAPP_ACCESS_TOKEN not found in environment variables"
      );
      return { success: false, error: "No access token" };
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

    console.log(`📨 WhatsApp API Response:`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("❌ Failed to send message:", data);
      return { success: false, error: data };
    } else {
      console.log("✅ Message sent successfully:", data.messages?.[0]?.id);
      return { success: true, data };
    }
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return { success: false, error };
  }
}

// Enhanced read receipt function
async function markMessageAsRead(messageId: string) {
  try {
    console.log(`✅ Marking message as read: ${messageId}`);

    if (!WHATSAPP_ACCESS_TOKEN) {
      console.log("⚠️ No access token, skipping read receipt");
      return;
    }

    const payload = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    };

    console.log(`📧 Read receipt payload:`, JSON.stringify(payload, null, 2));

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
    console.log(`✅ Read receipt response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Error marking message as read:", error);
  }
}
