// src/app/api/whatsapp/send/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message, messageType } = await request.json();

    // Validate input
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, message: "Phone number and message are required" },
        { status: 400 }
      );
    }

    // Clean phone number (remove country code if present, add 91 prefix)
    let cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    }
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Format phone number for WhatsApp API
    const formattedPhone = `91${cleanPhone}`;

    // WhatsApp Business API configuration
    const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
    const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

    // Demo mode - WhatsApp API not configured
    if (!WHATSAPP_PHONE_ID || !WHATSAPP_ACCESS_TOKEN) {
      console.log("\n📱 WHATSAPP DEMO MODE - API NOT CONFIGURED");
      console.log("=".repeat(60));
      console.log(`📞 To: +${formattedPhone}`);
      console.log(`📝 Type: ${messageType}`);
      console.log(`⏰ Timestamp: ${new Date().toLocaleString("en-IN")}`);
      console.log("\n📄 MESSAGE CONTENT:");
      console.log("-".repeat(40));
      console.log(message);
      console.log("=".repeat(60));
      console.log("\n🔧 TO ENABLE REAL WHATSAPP MESSAGING:");
      console.log("1. Get WhatsApp Business API credentials from Meta");
      console.log("2. Create .env.local file with:");
      console.log("   WHATSAPP_PHONE_ID=your_phone_id");
      console.log("   WHATSAPP_ACCESS_TOKEN=your_token");
      console.log("3. Restart the development server");
      console.log("=".repeat(60));

      // For demo purposes, simulate successful sending
      return NextResponse.json({
        success: true,
        messageId: `demo_${Date.now()}`,
        message: "Demo mode: Message logged in console",
        demo: true,
        demoInfo: {
          recipient: `+${formattedPhone}`,
          messageType: messageType,
          timestamp: new Date().toISOString(),
          instructions: [
            "This message was logged in the server console",
            "To enable real WhatsApp messaging, configure API credentials",
            "Check console output above to see the full message content",
          ],
        },
      });
    }

    // Real WhatsApp API implementation
    try {
      const whatsappPayload = {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: {
          body: message,
        },
      };

      const response = await fetch(
        `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(whatsappPayload),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("WhatsApp API error:", responseData);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to send WhatsApp message",
            error: responseData.error?.message || "WhatsApp API error",
          },
          { status: response.status }
        );
      }

      // Log successful message for tracking
      console.log(`✅ WhatsApp message sent successfully:`, {
        to: formattedPhone,
        messageId: responseData.messages?.[0]?.id,
        messageType,
        timestamp: new Date().toISOString(),
      });

      // Store message in database (implement based on your database choice)
      await saveMessageToDatabase({
        phoneNumber: formattedPhone,
        message,
        messageType,
        messageId: responseData.messages?.[0]?.id,
        status: "sent",
        sentAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        messageId: responseData.messages?.[0]?.id,
        message: "WhatsApp message sent successfully",
      });
    } catch (apiError: any) {
      console.error("WhatsApp API request failed:", apiError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to WhatsApp API",
          error: apiError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while processing WhatsApp message",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Function to save message to database (implement based on your database)
async function saveMessageToDatabase(messageData: any) {
  // This is a placeholder - implement based on your database choice
  console.log("💾 Message data for database:", {
    to: messageData.phoneNumber,
    type: messageData.messageType,
    status: messageData.status,
    messageId: messageData.messageId,
    timestamp: messageData.sentAt,
  });
}

// GET endpoint to retrieve message status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "Message ID is required" },
        { status: 400 }
      );
    }

    // For demo purposes, return mock status
    const mockStatuses = ["sent", "delivered", "read"];
    const randomStatus =
      mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

    return NextResponse.json({
      success: true,
      messageId,
      status: randomStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error retrieving message status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve message status" },
      { status: 500 }
    );
  }
}
