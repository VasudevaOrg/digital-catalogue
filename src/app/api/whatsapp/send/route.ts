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

    // Hardcoded WhatsApp Business API configuration
    const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0";
    const WHATSAPP_PHONE_ID = "802685189585173";
    const WHATSAPP_ACCESS_TOKEN =
      "EAASGzwVtiEMBPNLYbV406Ly6aNw1fwBIqQyo80Eq3vs2sTcqUBadrQAzo2ZACGZAevffH57gD6GURmZAFPWFc9sbYLlcvU65xu1i4aiBl0dY883sXXzTTzEd1oe3kCd3Urb3KAzEg3wbZB69CluW1Rl7OV6Mp8cK2IG2SmJ2l52kD8ZAW6ZCZAweBKS83yLpsEXKepOMJBCmWh7hR2CFtS9nvpyDKELmVJL2rNb57PTpExMnAZDZD";

    console.log("\n📱 WHATSAPP API - LIVE MODE");
    console.log("=".repeat(60));
    console.log(`📞 From: Business Number (Phone ID: ${WHATSAPP_PHONE_ID})`);
    console.log(`📞 To: +${formattedPhone}`);
    console.log(`📝 Type: ${messageType}`);
    console.log(`⏰ Timestamp: ${new Date().toLocaleString("en-IN")}`);
    console.log("\n📄 MESSAGE CONTENT:");
    console.log("-".repeat(40));
    console.log(message);
    console.log("=".repeat(60));

    try {
      const whatsappPayload = {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: {
          body: message,
        },
      };

      console.log("\n🚀 Sending to WhatsApp API...");
      console.log(`📡 URL: ${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`);
      console.log(`🔑 Token: ${WHATSAPP_ACCESS_TOKEN.substring(0, 20)}...`);
      console.log("📦 Payload:", JSON.stringify(whatsappPayload, null, 2));

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

      console.log("\n📨 WhatsApp API Response:");
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log("Response:", JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        console.error("❌ WhatsApp API error:", responseData);

        // Handle specific error codes
        let errorMessage = "Failed to send WhatsApp message";
        if (responseData.error?.code === 131000) {
          errorMessage =
            "Recipient phone number not in test list. Add the number to your WhatsApp Business test list.";
        } else if (responseData.error?.code === 190) {
          errorMessage =
            "WhatsApp access token expired. Please get a new token from Meta Developer Console.";
        } else if (responseData.error?.message) {
          errorMessage = responseData.error.message;
        }

        return NextResponse.json(
          {
            success: false,
            message: errorMessage,
            error: responseData.error,
            errorCode: responseData.error?.code,
          },
          { status: response.status }
        );
      }

      // Log successful message for tracking
      console.log(`✅ WhatsApp message sent successfully:`, {
        from: `Phone ID: ${WHATSAPP_PHONE_ID}`,
        to: `+${formattedPhone}`,
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
        recipient: `+${formattedPhone}`,
        timestamp: new Date().toISOString(),
      });
    } catch (apiError: any) {
      console.error("❌ WhatsApp API request failed:", apiError);
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
    console.error("❌ WhatsApp send error:", error);
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
