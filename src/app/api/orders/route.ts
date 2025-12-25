// src/app/api/orders/route.ts - Complete Updated with Discount Support
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

    // Prepare order items with DISCOUNTED prices
    const orderItems = orderData.items.map((item: any) => {
      // DEBUG LOG: Check if selectedVariant exists in incoming item
      if (item.product.selectedVariant) {
        console.log(
          "🔍 Found selectedVariant in incoming item:",
          item.product.name,
          item.product.selectedVariant
        );
      } else {
        console.log(
          "⚠️ NO selectedVariant in incoming item:",
          item.product.name
        );
      }

      // Use the price already calculated in checkout (which includes discount)
      const unitPrice = item.product.price; // This is already the discounted price from checkout
      const totalPrice = unitPrice * item.quantity;
      const totalWeight = item.product.weight * item.quantity;

      return {
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description || "",
          price: unitPrice, // Store discounted unit price
          originalPrice: item.product.originalPrice || unitPrice, // Store original price if available
          weight: item.product.weight,
          weightUnit: item.product.weightUnit, // Store weight unit
          category: item.product.category,
          images: item.product.images || [],
          discount: item.product.discount, // Store discount information
          selectedVariant: item.product.selectedVariant, // Store selected variant details
        },
        quantity: item.quantity,
        price: unitPrice, // Unit price (discounted)
        totalPrice: totalPrice, // Total for this item (discounted)
        weight: item.product.weight,
        totalWeight: totalWeight,
        appliedDiscount: item.appliedDiscount || 0, // Track discount applied
        savings: item.savings || 0, // Track savings
      };
    });

    // Calculate totals using DISCOUNTED prices
    const subtotal =
      orderData.subtotal ||
      orderItems.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

    const deliveryFee = orderData.deliveryFee || 0;
    const totalAmount = subtotal + deliveryFee;

    const totalWeight = orderItems.reduce(
      (sum: number, item: any) => sum + item.totalWeight,
      0
    );

    const totalSavings = orderItems.reduce(
      (sum: number, item: any) => sum + (item.savings || 0),
      0
    );

    // Create the order document with discounted prices
    const newOrder = new Order({
      orderId,
      invoiceNumber,

      // Customer Information
      customerInfo: {
        name: orderData.customerInfo.name,
        phoneNumber: orderData.customerInfo.phoneNumber,
        email: orderData.customerInfo.email || null,
      },

      // Order Items (with discounted prices)
      items: orderItems,

      // Financial Details (using discounted totals)
      totalAmount, // Total with discounts applied
      originalAmount: orderData.originalAmount, // Original total without discounts
      totalSavings, // Total savings from discounts
      totalWeight,
      deliveryFee,
      subtotal, // Subtotal with discounts applied

      // Order Details
      deliveryType: orderData.deliveryType,
      paymentMethod: orderData.paymentMethod,
      paymentStatus:
        orderData.paymentMethod === "prepaid" ? "pending" : "pending",
      orderStatus: "confirmed",

      // Delivery Information
      deliveryAddress: orderData.deliveryAddress || null,

      // Additional Details
      isEligibleForFreeDelivery: orderData.isEligibleForFreeDelivery || false,
      orderNotes: orderData.orderNotes || null,
      estimatedDeliveryDate:
        orderData.deliveryType === "delivery"
          ? new Date(Date.now() + 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 4 * 60 * 60 * 1000),

      // Communication
      whatsappMessageId: null,
      whatsappStatus: null,

      // Status History
      statusHistory: [],
    });

    // Save the order to database
    const savedOrder = await newOrder.save();

    console.log("✅ Order saved with discounted prices:", {
      orderId: savedOrder.orderId,
      totalAmount: savedOrder.totalAmount,
      originalAmount: orderData.originalAmount,
      savings: totalSavings,
    });

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
        originalAmount: orderData.originalAmount,
        totalSavings: totalSavings,
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
      message:
        totalSavings > 0
          ? `Order confirmed successfully! You saved ₹${totalSavings.toFixed(
              2
            )}`
          : "Order confirmed successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("❌ Create order error:", error);

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
      originalAmount: order.originalAmount,
      totalSavings: order.totalSavings,
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
