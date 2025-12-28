import { NextRequest, NextResponse } from "next/server";
import { whatsappFlowService } from "@/lib/whatsappFlowService";

const VERIFY_TOKEN =
  process.env.WHATSAPP_VERIFY_TOKEN || "digital_catalogue_webhook_2025_secure";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0";
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// Your business phone number (what customers see/message)
const BUSINESS_PHONE_NUMBER = "15556233859";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log("🔍 Webhook verification attempt:");
  console.log("Mode:", mode);
  console.log("Token received:", token);
  console.log("Expected token:", VERIFY_TOKEN);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } else {
    console.log("❌ Webhook verification failed!");
    return new Response("Forbidden", { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("\n📨 INCOMING WEBHOOK:");
    console.log(JSON.stringify(body, null, 2));

    // Check if it's a message webhook
    if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
      const change = body.entry[0].changes[0].value;
      const message = change.messages[0];
      const fromPhone = message.from;
      const messageId = message.id;

      console.log(`\n📱 MESSAGE RECEIVED:`);
      console.log(`From: ${fromPhone}`);
      console.log(`Message ID: ${messageId}`);
      console.log(`Message Type: ${message.type}`);
      console.log(`Content:`, message);

      // ⭐ CORRECT LOOP PREVENTION ⭐
      // The key insight: customer messages will ALWAYS have your phone_number_id in metadata
      // We should only ignore messages that are FROM your business number
      // A real customer message from 919164912322 should be processed!

      // Method 1: Check if message is FROM our business phone number
      if (
        fromPhone === BUSINESS_PHONE_NUMBER ||
        fromPhone === `91${BUSINESS_PHONE_NUMBER}`
      ) {
        console.log("🔄 Ignoring message from our own business number");
        return NextResponse.json({ status: "ignored_own_message" });
      }

      // Method 2: Check for specific echo indicators (message_echoes webhook field)
      // If you have message_echoes enabled, those would be the messages to ignore
      if (body.entry[0].changes[0].field === "message_echoes") {
        console.log("🔄 Ignoring message echo");
        return NextResponse.json({ status: "ignored_echo" });
      }

      // Method 3: Customer messages from test numbers should be processed
      // Your test number 919164912322 sending "hi" should reach here
      console.log("✅ This is a customer message - processing...");

      try {
        // Mark message as read
        console.log("📖 Marking message as read...");
        await markMessageAsRead(messageId);

        // Process through flow service
        console.log("🔄 Processing through flow service...");
        const flowResponse = await whatsappFlowService.processMessage(
          fromPhone,
          message
        );

        console.log(
          `📤 Flow service returned ${flowResponse.messages.length} messages`
        );
        console.log(`🎯 Next state: ${flowResponse.nextState}`);

        // Send response messages
        for (let i = 0; i < flowResponse.messages.length; i++) {
          const messagePayload = flowResponse.messages[i];
          messagePayload.content.to = fromPhone;

          console.log(
            `📡 Sending message ${i + 1}/${
              flowResponse.messages.length
            } to ${fromPhone}`
          );
          console.log(`Message type: ${messagePayload.type}`);

          const sendResult = await sendWhatsAppMessage(messagePayload.content);

          if (!sendResult.success) {
            console.error(
              `❌ Failed to send message ${i + 1}:`,
              sendResult.error
            );
            break; // Stop sending if one fails
          }

          // Small delay between messages
          if (i < flowResponse.messages.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        console.log("✅ Flow processing completed successfully");
      } catch (flowError) {
        console.error("❌ Flow processing error:", flowError);

        // Send fallback message
        console.log("📤 Sending fallback error message...");
        await sendWhatsAppMessage({
          messaging_product: "whatsapp",
          to: fromPhone,
          type: "text",
          text: {
            body: "Sorry, I encountered an error. Please try again or contact our support team at +91 91649 12322.",
          },
        });
      }
    }

    // Handle message status updates (delivered, read, etc.)
    if (body.entry?.[0]?.changes?.[0]?.value?.statuses) {
      const status = body.entry[0].changes[0].value.statuses[0];
      console.log("\n📊 MESSAGE STATUS UPDATE:");
      console.log(`Message ID: ${status.id}`);
      console.log(`Status: ${status.status}`);
      console.log(`Recipient: ${status.recipient_id}`);
    }

    return NextResponse.json({ status: "success", processed: true });
  } catch (error) {
    console.error("\n❌ WEBHOOK ERROR:");
    console.error("Error details:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack"
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

async function sendWhatsAppMessage(payload: any) {
  try {
    console.log(`📡 Attempting to send WhatsApp message:`);
    console.log(`  To: ${payload.to}`);
    console.log(`  Type: ${payload.type}`);
    console.log(
      `  Content preview:`,
      payload.type === "text"
        ? payload.text?.body?.substring(0, 50)
        : "Interactive message"
    );

    if (!WHATSAPP_ACCESS_TOKEN) {
      throw new Error(
        "WHATSAPP_ACCESS_TOKEN not found in environment variables"
      );
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
    console.log(`  Status: ${response.status} ${response.statusText}`);
    console.log(`  Response:`, JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ Message sent successfully");
      console.log(`  Message ID: ${data.messages?.[0]?.id}`);
      return { success: true, data };
    } else {
      console.error("❌ Message send failed");

      // Detailed error logging
      if (data.error?.code === 131000) {
        console.error("📱 ERROR: Phone number not in test recipients list");
        console.error(
          "   Solution: Add the phone number to your test recipients in Meta Developer Console"
        );
      } else if (data.error?.code === 190) {
        console.error("🔑 ERROR: Access token expired or invalid");
        console.error(
          "   Solution: Generate a new access token in Meta Developer Console"
        );
      } else if (data.error?.code === 100) {
        console.error("📋 ERROR: Invalid parameter in message payload");
      } else {
        console.error("❓ UNKNOWN ERROR:", data.error);
      }

      return { success: false, error: data };
    }
  } catch (error) {
    console.error("❌ Network/Request error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

async function markMessageAsRead(messageId: string) {
  try {
    if (!WHATSAPP_ACCESS_TOKEN) {
      console.log("⚠️ No access token, skipping read receipt");
      return;
    }

    console.log(`📖 Marking message as read: ${messageId}`);

    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Message marked as read successfully");
    } else {
      console.error("❌ Mark as read failed:", data);
    }
  } catch (error) {
    console.error("❌ Mark as read error:", error);
  }
}
