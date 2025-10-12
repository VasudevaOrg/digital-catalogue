// src/app/api/whatsapp/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message, messageType, orderData } =
      await request.json();

    // Validate input
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    // Clean phone number - for test setup, use the exact format Meta expects
    let cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone; // Keep as is for Indian numbers
    } else if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`; // Add country code
    }

    if (cleanPhone !== "918985346102") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This number is not in the test phone list. Only +91 89853 46102 is allowed for testing.",
        },
        { status: 400 }
      );
    }

    // WhatsApp Business API configuration
    const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0";
    const WHATSAPP_PHONE_ID = "802685189585173";
    const WHATSAPP_ACCESS_TOKEN =
      process.env.WHATSAPP_ACCESS_TOKEN ||
      "EAASGzwVtiEMBPt4e2LEZAdCIZBWzvwwzqKQo8hzBnuRbObShSjTBEXv1ZBkPBtHdoBBxJmCHSScdzXphTsRZBkL6qKBklQV0DEPx2mz5dZAJjEIdgjxLv3S7rfdqx48u8QYwDDW8MYB6I5AI4ZCZBoOoWpBXicAx59iG5O7VzFTLyeB2K4DcZAjU9VQEgNNnCJd9JsMoIcIkaDKw9RZBx2iu4weCTNyZAGABLFJcf66v9HzpgZD";

    console.log("\n📱 WHATSAPP API - ENHANCED WITH DATABASE INTEGRATION");
    console.log("=".repeat(70));
    console.log(
      `📞 From: Test Number +1 (555) 623-3859 (Phone ID: ${WHATSAPP_PHONE_ID})`
    );
    console.log(`📞 To: +${cleanPhone} (Your test number)`);
    console.log(`📝 Type: ${messageType}`);
    console.log(`⏰ Timestamp: ${new Date().toLocaleString("en-IN")}`);

    try {
      let whatsappPayload;

      // For order messages, use your custom catalogue_template
      if (messageType === "order_enquiry" && orderData) {
        console.log("\n📋 SENDING CATALOGUE_TEMPLATE MESSAGE");
        console.log("Order Data:", JSON.stringify(orderData, null, 2));

        // Format items list for display
        const itemsList =
          orderData.items
            ?.map(
              (item: any, index: number) =>
                `${index + 1}. ${item.product?.name || "Product"} x ${
                  item.quantity
                }`
            )
            .join(", ") || "No items";

        // Use your custom catalogue_template
        whatsappPayload = {
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "template",
          template: {
            name: "catalogue_template", // Your exact template name
            language: {
              code: "en", // English language code
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: orderData.customerInfo?.name || "Customer", // {{1}} - Customer Name
                  },
                  {
                    type: "text",
                    text:
                      orderData.orderId ||
                      orderData.invoiceNumber ||
                      "ORD123456", // {{2}} - Order ID
                  },
                  {
                    type: "text",
                    text: new Date().toLocaleDateString("en-IN"), // {{3}} - Order Date
                  },
                  {
                    type: "text",
                    text: orderData.totalAmount?.toFixed(2) || "0.00", // {{4}} - Total Amount
                  },
                  {
                    type: "text",
                    text: orderData.items?.length?.toString() || "0", // {{5}} - Item Count
                  },
                  {
                    type: "text",
                    text:
                      orderData.deliveryType === "delivery"
                        ? "Home Delivery"
                        : "Store Pickup", // {{6}} - Delivery Type
                  },
                  {
                    type: "text",
                    text:
                      orderData.paymentMethod === "prepaid"
                        ? "Prepaid (Online)"
                        : "Cash on Pickup", // {{7}} - Payment Method
                  },
                ],
              },
            ],
          },
        };

        console.log("📦 Using catalogue_template with order data...");
        console.log("Template parameters:");
        console.log(
          "{{1}} Customer Name:",
          orderData.customerInfo?.name || "Customer"
        );
        console.log(
          "{{2}} Order ID:",
          orderData.orderId || orderData.invoiceNumber || "ORD123456"
        );
        console.log("{{3}} Date:", new Date().toLocaleDateString("en-IN"));
        console.log(
          "{{4}} Amount:",
          orderData.totalAmount?.toFixed(2) || "0.00"
        );
        console.log("{{5}} Items:", orderData.items?.length?.toString() || "0");
        console.log(
          "{{6}} Delivery:",
          orderData.deliveryType === "delivery"
            ? "Home Delivery"
            : "Store Pickup"
        );
        console.log(
          "{{7}} Payment:",
          orderData.paymentMethod === "prepaid"
            ? "Prepaid (Online)"
            : "Cash on Pickup"
        );
      } else {
        // Fallback to hello_world template if no order data or different message type
        console.log("\n📋 FALLBACK TO HELLO_WORLD TEMPLATE");
        whatsappPayload = {
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "template",
          template: {
            name: "hello_world",
            language: {
              code: "en_US",
            },
          },
        };
      }

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
          errorMessage = `Phone number +${cleanPhone} is not in your test list. Please add it in Meta Developer Console.`;
        } else if (responseData.error?.code === 131047) {
          errorMessage =
            "Re-engagement message - User must message you first before you can send custom messages.";
        } else if (responseData.error?.code === 190) {
          errorMessage =
            "WhatsApp access token expired. Please get a new token from Meta Developer Console.";
        } else if (responseData.error?.code === 132000) {
          errorMessage =
            "Template not found. Please check if 'catalogue_template' is approved and available.";
        } else if (responseData.error?.code === 132012) {
          errorMessage =
            "Template parameter count mismatch. Check that all 7 variables are provided correctly.";
        } else if (responseData.error?.message) {
          errorMessage = responseData.error.message;
        }

        return NextResponse.json(
          {
            success: false,
            message: errorMessage,
            error: responseData.error,
            errorCode: responseData.error?.code,
            debugInfo: {
              templateName: whatsappPayload.template?.name,
              phoneNumber: cleanPhone,
              phoneId: WHATSAPP_PHONE_ID,
              parameterCount:
                whatsappPayload.template?.components?.[0]?.parameters?.length,
            },
          },
          { status: response.status }
        );
      }

      // WhatsApp message sent successfully
      const messageId = responseData.messages?.[0]?.id;

      console.log(`✅ WhatsApp message sent successfully:`, {
        from: `Test Number +1 (555) 623-3859 (Phone ID: ${WHATSAPP_PHONE_ID})`,
        to: `+${cleanPhone}`,
        messageId: messageId,
        messageType,
        templateUsed: whatsappPayload.template?.name,
        timestamp: new Date().toISOString(),
      });

      // 🔥 NEW: Update order in database with WhatsApp message details
      // 🔥 NEW: Update order in database with WhatsApp message details
      if (messageType === "order_enquiry" && orderData && messageId) {
        // Run database update asynchronously to not block response
        setImmediate(async () => {
          try {
            console.log(
              "\n💾 UPDATING ORDER IN DATABASE WITH WHATSAPP DETAILS"
            );

            await dbConnect();

            // Find order by orderId or invoiceNumber
            const order = await Order.findOne({
              $or: [
                { orderId: orderData.orderId },
                { invoiceNumber: orderData.invoiceNumber },
                { orderId: orderData.invoiceNumber }, // Sometimes they might be swapped
              ],
            });

            if (order) {
              // Update order with WhatsApp message details
              order.whatsappMessageId = messageId;
              order.whatsappStatus = "sent";
              order.statusHistory.push({
                status: order.orderStatus,
                timestamp: new Date(),
                notes: `WhatsApp order confirmation sent successfully. Message ID: ${messageId}`,
              });

              await order.save();

              console.log(`✅ Order updated with WhatsApp details:`, {
                orderId: order.orderId,
                whatsappMessageId: messageId,
                whatsappStatus: "sent",
              });
            } else {
              console.warn(`⚠️ Order not found for WhatsApp update:`, {
                searchCriteria: {
                  orderId: orderData.orderId,
                  invoiceNumber: orderData.invoiceNumber,
                },
              });
            }
          } catch (dbError) {
            console.error(
              "❌ Failed to update order with WhatsApp details:",
              dbError
            );
            // Don't fail the entire request if database update fails
          }
        });
      }

      // Store message in database (implement based on your database choice)
      await saveMessageToDatabase({
        phoneNumber: cleanPhone,
        message: `Template: ${whatsappPayload.template?.name}`,
        messageType,
        messageId: messageId,
        status: "sent",
        sentAt: new Date().toISOString(),
        orderData: orderData || null,
      });

      return NextResponse.json({
        success: true,
        messageId: messageId,
        message: "WhatsApp order confirmation sent successfully",
        templateUsed: whatsappPayload.template?.name,
        messageType: whatsappPayload.type,
        recipient: `+${cleanPhone}`,
        from: "+1 (555) 623-3859",
        timestamp: new Date().toISOString(),
        orderUpdated:
          messageType === "order_enquiry" && messageId ? true : false,
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

// Enhanced function to save message to database
async function saveMessageToDatabase(messageData: any) {
  try {
    console.log("💾 Saving WhatsApp message data:", {
      to: messageData.phoneNumber,
      type: messageData.messageType,
      status: messageData.status,
      messageId: messageData.messageId,
      template: messageData.message,
      timestamp: messageData.sentAt,
      hasOrderData: !!messageData.orderData,
    });

    // Here you could save to a WhatsAppMessages collection if needed
    // For now, we're just logging it
  } catch (error) {
    console.error("❌ Failed to save message to database:", error);
  }
}

// GET endpoint for message status
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

    // Return mock status for now
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
