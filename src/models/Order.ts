// src/models/Order.ts - Complete Updated Model with Discount Support
import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem extends Document {
  product: {
    id: string;
    name: string;
    description: string;
    price: number; // Discounted price (if applicable)
    originalPrice?: number; // Original price before discount
    weight: number;
    category: string;
    images: string[];
    discount?: any; // Store discount details
  };
  quantity: number;
  price: number; // Unit price (discounted)
  totalPrice: number; // Total for this item (discounted)
  weight: number;
  totalWeight: number;
  appliedDiscount?: number; // Amount of discount applied to this item
  savings?: number; // Amount saved on this item
}

export interface IOrder extends Document {
  orderId: string;
  invoiceNumber: string;

  // Customer Information
  customerInfo: {
    name: string;
    phoneNumber: string;
    email?: string;
  };

  // Order Items
  items: IOrderItem[];

  // Financial Details (with discount support)
  totalAmount: number; // Total with discounts applied
  originalAmount?: number; // Original total without discounts
  totalSavings?: number; // Total savings from discounts
  totalWeight: number;
  deliveryFee: number;
  subtotal: number; // Subtotal with discounts applied

  // Order Details
  deliveryType: "delivery" | "pickup";
  paymentMethod: "prepaid" | "cash_on_pickup";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "confirmed" | "delivered" | "cancelled";

  // Delivery Information
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };

  // Additional Details
  isEligibleForFreeDelivery: boolean;
  orderNotes?: string;
  estimatedDeliveryDate?: Date;

  // Communication
  whatsappMessageId?: string;
  whatsappStatus?: "sent" | "delivered" | "read" | "failed";

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Order History
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    notes?: string;
  }>;
}

const OrderItemSchema = new Schema({
  product: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Discounted price
    originalPrice: { type: Number }, // Original price before discount
    weight: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    discount: { type: Schema.Types.Mixed }, // Store discount info
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // Unit price (discounted)
  totalPrice: { type: Number, required: true }, // Total (discounted)
  weight: { type: Number, required: true },
  totalWeight: { type: Number, required: true },
  appliedDiscount: { type: Number, default: 0 }, // Discount amount
  savings: { type: Number, default: 0 }, // Savings amount
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Customer Information
    customerInfo: {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true, index: true },
      email: { type: String },
    },

    // Order Items
    items: [OrderItemSchema],

    // Financial Details (with discount support)
    totalAmount: { type: Number, required: true, min: 0 }, // With discounts
    originalAmount: { type: Number, min: 0 }, // Without discounts
    totalSavings: { type: Number, min: 0, default: 0 }, // Total savings
    totalWeight: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 }, // With discounts

    // Order Details
    deliveryType: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["prepaid", "cash_on_pickup"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ["confirmed", "delivered", "cancelled"],
      default: "confirmed",
      index: true,
    },

    // Delivery Information
    deliveryAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },

    // Additional Details
    isEligibleForFreeDelivery: { type: Boolean, default: false },
    orderNotes: { type: String },
    estimatedDeliveryDate: { type: Date },

    // Communication
    whatsappMessageId: { type: String },
    whatsappStatus: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"],
    },

    // Order History
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        notes: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "customerInfo.phoneNumber": 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
OrderSchema.index({ deliveryType: 1, orderStatus: 1 });
OrderSchema.index({ "deliveryAddress.pincode": 1 });
OrderSchema.index({ totalSavings: -1 }); // New index for analytics

// Pre-save middleware to add initial status to history
OrderSchema.pre("save", function (next) {
  if (this.isNew) {
    // Add initial status to history (confirmed)
    const savingsNote =
      this.totalSavings && this.totalSavings > 0
        ? ` Customer saved ₹${this.totalSavings.toFixed(2)} with discounts.`
        : "";

    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      notes: `Order confirmed automatically upon placement.${savingsNote}`,
    });
  } else if (this.isModified("orderStatus")) {
    // Add status change to history
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      notes: `Status changed to ${this.orderStatus}`,
    });
  }

  // Calculate subtotal (already discounted from items)
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);

  next();
});

// Instance methods
OrderSchema.methods.updateStatus = function (
  newStatus: string,
  notes?: string
) {
  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    notes: notes || `Status changed to ${newStatus}`,
  });
  return this.save();
};

OrderSchema.methods.addNote = function (note: string) {
  if (!this.orderNotes) {
    this.orderNotes = note;
  } else {
    this.orderNotes += `\n${new Date().toISOString()}: ${note}`;
  }
  return this.save();
};

OrderSchema.methods.getTotalWithoutDiscounts = function () {
  return this.originalAmount || this.totalAmount;
};

OrderSchema.methods.getDiscountPercentage = function () {
  if (!this.originalAmount || !this.totalSavings) return 0;
  return (this.totalSavings / this.originalAmount) * 100;
};

OrderSchema.methods.hasDiscounts = function () {
  return this.totalSavings && this.totalSavings > 0;
};

// Static methods
OrderSchema.statics.findByPhoneNumber = function (phoneNumber: string) {
  return this.find({ "customerInfo.phoneNumber": phoneNumber }).sort({
    createdAt: -1,
  });
};

OrderSchema.statics.findByStatus = function (status: string) {
  return this.find({ orderStatus: status }).sort({ createdAt: -1 });
};

OrderSchema.statics.findByDeliveryType = function (deliveryType: string) {
  return this.find({ deliveryType }).sort({ createdAt: -1 });
};

OrderSchema.statics.getOrderStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
        totalSavings: { $sum: { $ifNull: ["$totalSavings", 0] } },
        averageOrderValue: { $avg: "$totalAmount" },
        averageSavings: { $avg: { $ifNull: ["$totalSavings", 0] } },
      },
    },
  ]);
};

OrderSchema.statics.getDiscountStats = function () {
  return this.aggregate([
    {
      $match: {
        totalSavings: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: null,
        ordersWithDiscounts: { $sum: 1 },
        totalDiscountGiven: { $sum: "$totalSavings" },
        averageDiscount: { $avg: "$totalSavings" },
        maxDiscount: { $max: "$totalSavings" },
        minDiscount: { $min: "$totalSavings" },
      },
    },
  ]);
};

OrderSchema.statics.findOrdersWithDiscounts = function () {
  return this.find({
    totalSavings: { $gt: 0 },
  }).sort({ totalSavings: -1 });
};

// Check if the model exists before creating it
const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
