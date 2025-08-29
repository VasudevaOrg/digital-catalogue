// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { generateInvoiceNumber, generateOrderId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    console.log("📦 Creating new order...");

    await dbConnect();
    const orderData = await request.json();

    console.log("📋 Order data received:", JSON.stringify(orderData, null, 2));

    // Generate unique identifiers
    const orderId = generateOrderId();
    const invoiceNumber = generateInvoiceNumber();

    // Prepare order items with detailed information
    const orderItems = orderData.items.map((item: any) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description || "",
        price: item.product.price,
        weight: item.product.weight,
        category: item.product.category,
        images: item.product.images || [],
      },
      quantity: item.quantity,
      price: item.product.price,
      totalPrice: item.product.price * item.quantity,
      weight: item.product.weight,
      totalWeight: item.product.weight * item.quantity,
    }));

    // Calculate totals
    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.totalPrice,
      0
    );
    const deliveryFee = orderData.deliveryFee || 0;
    const totalAmount = subtotal + deliveryFee;
    const totalWeight = orderItems.reduce(
      (sum: number, item: any) => sum + item.totalWeight,
      0
    );

    // Create the order document
    const newOrder = new Order({
      orderId,
      invoiceNumber,

      // Customer Information
      customerInfo: {
        name: orderData.customerInfo.name,
        phoneNumber: orderData.customerInfo.phoneNumber,
        email: orderData.customerInfo.email || null,
      },

      // Order Items
      items: orderItems,

      // Financial Details
      totalAmount,
      totalWeight,
      deliveryFee,
      subtotal,

      // Order Details
      deliveryType: orderData.deliveryType,
      paymentMethod: orderData.paymentMethod,
      paymentStatus:
        orderData.paymentMethod === "prepaid" ? "pending" : "pending",
      orderStatus: "pending",

      // Delivery Information
      deliveryAddress: orderData.deliveryAddress || null,

      // Additional Details
      isEligibleForFreeDelivery: orderData.isEligibleForFreeDelivery || false,
      orderNotes: orderData.orderNotes || null,
      estimatedDeliveryDate:
        orderData.deliveryType === "delivery"
          ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
          : new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now

      // Communication
      whatsappMessageId: null, // Will be updated after WhatsApp message is sent
      whatsappStatus: null,

      // Status History (automatically added by pre-save middleware)
      statusHistory: [],
    });

    // Save the order to database
    const savedOrder = await newOrder.save();

    console.log("✅ Order saved to database:", savedOrder._id);

    // Format response
    const response = {
      success: true,
      order: {
        id: savedOrder._id.toString(),
        orderId: savedOrder.orderId,
        invoiceNumber: savedOrder.invoiceNumber,
        customerInfo: savedOrder.customerInfo,
        items: savedOrder.items,
        totalAmount: savedOrder.totalAmount,
        totalWeight: savedOrder.totalWeight,
        deliveryFee: savedOrder.deliveryFee,
        subtotal: savedOrder.subtotal,
        deliveryType: savedOrder.deliveryType,
        paymentMethod: savedOrder.paymentMethod,
        paymentStatus: savedOrder.paymentStatus,
        orderStatus: savedOrder.orderStatus,
        deliveryAddress: savedOrder.deliveryAddress,
        isEligibleForFreeDelivery: savedOrder.isEligibleForFreeDelivery,
        estimatedDeliveryDate: savedOrder.estimatedDeliveryDate,
        createdAt: savedOrder.createdAt,
        statusHistory: savedOrder.statusHistory,
      },
      message: "Order created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("❌ Create order error:", error);

    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          {
            success: false,
            message: "Order ID already exists. Please try again.",
            error: "DUPLICATE_ORDER_ID",
          },
          { status: 400 }
        );
      }

      if (error.message.includes("validation")) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid order data provided.",
            error: error.message,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order. Please try again.",
        error:
          process.env.NODE_ENV === "development"
            ? error
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const phoneNumber = searchParams.get("phoneNumber");
    const deliveryType = searchParams.get("deliveryType");

    // Build filter
    const filter: any = {};
    if (status) filter.orderStatus = status;
    if (phoneNumber) filter["customerInfo.phoneNumber"] = phoneNumber;
    if (deliveryType) filter.deliveryType = deliveryType;

    // Get total count
    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Fetch orders with pagination
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      id: order._id.toString(),
      orderId: order.orderId,
      invoiceNumber: order.invoiceNumber,
      customerInfo: order.customerInfo,
      items: order.items,
      totalAmount: order.totalAmount,
      totalWeight: order.totalWeight,
      deliveryFee: order.deliveryFee,
      deliveryType: order.deliveryType,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      deliveryAddress: order.deliveryAddress,
      isEligibleForFreeDelivery: order.isEligibleForFreeDelivery,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      statusHistory: order.statusHistory,
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("❌ Get orders error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
        error:
          process.env.NODE_ENV === "development"
            ? error
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}
