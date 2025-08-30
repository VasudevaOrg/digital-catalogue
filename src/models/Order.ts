// src/models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem extends Document {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    weight: number;
    category: string;
    images: string[];
  };
  quantity: number;
  price: number;
  totalPrice: number;
  weight: number;
  totalWeight: number;
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

  // Financial Details
  totalAmount: number;
  totalWeight: number;
  deliveryFee: number;
  subtotal: number;

  // Order Details
  deliveryType: "delivery" | "pickup";
  paymentMethod: "prepaid" | "cash_on_pickup";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "confirmed" // Changed: Start with confirmed, removed pending
    | "delivered"
    | "cancelled";

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
    price: { type: Number, required: true },
    weight: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  weight: { type: Number, required: true },
  totalWeight: { type: Number, required: true },
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

    // Financial Details
    totalAmount: { type: Number, required: true, min: 0 },
    totalWeight: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },

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
      enum: [
        "confirmed", // Default status - order is confirmed
        "delivered", // Order has been delivered/picked up
        "cancelled", // Order was cancelled
      ],
      default: "confirmed", // Changed: Default to confirmed
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

// Indexes
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "customerInfo.phoneNumber": 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
OrderSchema.index({ deliveryType: 1, orderStatus: 1 });
OrderSchema.index({ "deliveryAddress.pincode": 1 });

// Pre-save middleware to add initial status to history
OrderSchema.pre("save", function (next) {
  if (this.isNew) {
    // Add initial status to history (confirmed)
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      notes: "Order confirmed automatically upon placement",
    });
  } else if (this.isModified("orderStatus")) {
    // Add status change to history
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      notes: `Status changed to ${this.orderStatus}`,
    });
  }

  // Calculate subtotal
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
      },
    },
  ]);
};

// Check if the model exists before creating it
const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
