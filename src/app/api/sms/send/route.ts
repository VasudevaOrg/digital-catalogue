import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message } = await request.json();

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, message: "Phone number and message are required" },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    if (!accountSid || !authToken || (!fromNumber && !messagingServiceSid)) {
      console.error("❌ Twilio credentials missing in env");
      return NextResponse.json(
        {
          success: false,
          message: "SMS service not configured (missing credentials)",
        },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Ensure phone number has +91 prefix if not present
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber.replace(/\D/g, "")}`;

    console.log(
      `📨 Sending SMS to ${formattedPhone} via ${
        messagingServiceSid ? "Service" : "Number"
      }...`
    );

    const messageData: any = {
      body: message,
      to: formattedPhone,
    };

    if (messagingServiceSid) {
      messageData.messagingServiceSid = messagingServiceSid;
    } else {
      messageData.from = fromNumber;
    }

    const result = await client.messages.create(messageData);

    console.log("✅ SMS sent successfully:", result.sid);

    return NextResponse.json({
      success: true,
      sid: result.sid,
      message: "SMS sent successfully",
    });
  } catch (error: any) {
    console.error("❌ SMS Send Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send SMS",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
