// src/app/api/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const { status, notes, whatsappMessageId, whatsappStatus } = body;

    console.log(`📊 Updating order status: ${id} -> ${status}`);

    // Validate status if provided - Updated valid statuses
    const validStatuses = ["confirmed", "delivered", "cancelled"];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status: ${status}. Valid statuses: ${validStatuses.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    let hasChanges = false;

    // Update order status if provided
    if (status && status !== order.orderStatus) {
      console.log(`📊 Status change: ${order.orderStatus} -> ${status}`);
      order.orderStatus = status;
      hasChanges = true;

      // Add to status history
      order.statusHistory.push({
        status: status,
        timestamp: new Date(),
        notes: notes || `Status updated to ${status}`,
      });
    }

    // Update WhatsApp information if provided
    if (whatsappMessageId && whatsappMessageId !== order.whatsappMessageId) {
      order.whatsappMessageId = whatsappMessageId;
      hasChanges = true;
    }

    if (whatsappStatus && whatsappStatus !== order.whatsappStatus) {
      order.whatsappStatus = whatsappStatus;
      hasChanges = true;
    }

    // Set estimated delivery date if moving to confirmed and not already set
    if (status === "confirmed" && !order.estimatedDeliveryDate) {
      order.estimatedDeliveryDate =
        order.deliveryType === "delivery"
          ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          : new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours
      hasChanges = true;
    }

    // Only save if there are actual changes
    if (!hasChanges) {
      console.log(`ℹ️ No changes to save for order ${order.orderId}`);
      return NextResponse.json({
        success: true,
        order: {
          id: order._id.toString(),
          orderId: order.orderId,
          invoiceNumber: order.invoiceNumber,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          whatsappMessageId: order.whatsappMessageId,
          whatsappStatus: order.whatsappStatus,
          estimatedDeliveryDate: order.estimatedDeliveryDate,
          statusHistory: order.statusHistory,
          updatedAt: order.updatedAt,
        },
        message: "No changes to update",
      });
    }

    const updatedOrder = await order.save();

    console.log(
      `✅ Order status updated: ${updatedOrder.orderId} -> ${updatedOrder.orderStatus}`
    );

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder._id.toString(),
        orderId: updatedOrder.orderId,
        invoiceNumber: updatedOrder.invoiceNumber,
        orderStatus: updatedOrder.orderStatus,
        paymentStatus: updatedOrder.paymentStatus,
        whatsappMessageId: updatedOrder.whatsappMessageId,
        whatsappStatus: updatedOrder.whatsappStatus,
        estimatedDeliveryDate: updatedOrder.estimatedDeliveryDate,
        statusHistory: updatedOrder.statusHistory,
        updatedAt: updatedOrder.updatedAt,
      },
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("❌ Update order status error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { id } = await params;

    // Find order by ID or orderId
    let order;

    // Try to find by MongoDB _id first
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).lean();
    }

    // If not found, try to find by orderId
    if (!order) {
      order = await Order.findOne({ orderId: id }).lean();
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order._id.toString(),
        orderId: order.orderId,
        invoiceNumber: order.invoiceNumber,
        customerInfo: order.customerInfo,
        items: order.items,
        totalAmount: order.totalAmount,
        totalWeight: order.totalWeight,
        deliveryFee: order.deliveryFee,
        subtotal: order.subtotal,
        deliveryType: order.deliveryType,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        deliveryAddress: order.deliveryAddress,
        isEligibleForFreeDelivery: order.isEligibleForFreeDelivery,
        orderNotes: order.orderNotes,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        whatsappMessageId: order.whatsappMessageId,
        whatsappStatus: order.whatsappStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        statusHistory: order.statusHistory,
      },
    });
  } catch (error) {
    console.error("❌ Get order error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}
