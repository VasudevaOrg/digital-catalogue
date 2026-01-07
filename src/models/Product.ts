// src/models/Product.ts - Updated with new fields
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  weight: number;
  weightUnit:
    | "kg"
    | "grams"
    | "ltr"
    | "ml"
    | "box"
    | "bags"
    | "pieces"
    | "other";
  category: string;
  images: string[];
  stock: number;
  isEligibleForFreeDelivery: boolean;
  isRecommended: boolean; // New field
  tags: string[]; // New field
  lowStockThreshold: number;
  costPrice?: number;
  supplier?: string;
  sku: string;
  isActive: boolean;
  hasVariants?: boolean;
  variants?: any[];
  discount?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    weightUnit: {
      type: String,
      enum: ["kg", "grams", "ltr", "ml", "box", "bags", "pieces", "other"],
      default: "kg",
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    stock: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    isEligibleForFreeDelivery: {
      type: Boolean,
      default: true,
      index: true,
    },
    isRecommended: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    costPrice: {
      type: Number,
      min: 0,
    },
    supplier: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      uppercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variants: [Schema.Types.Mixed],
    discount: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
ProductSchema.index({
  name: "text",
  description: "text",
  category: "text",
  tags: "text",
});
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ price: 1, isActive: 1 });
ProductSchema.index({ stock: 1, isActive: 1 });
ProductSchema.index({ isActive: 1, createdAt: -1 });
ProductSchema.index({ isRecommended: 1, isActive: 1 });
ProductSchema.index({ tags: 1, isActive: 1 });
ProductSchema.index({ price: 1, category: 1, isActive: 1 });

// Pre-save middleware
ProductSchema.pre("save", function (next) {
  // Normalize tags to lowercase
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = this.tags
      .map((tag) => tag.toLowerCase().trim())
      .filter((tag) => tag.length > 0);
    // Remove duplicates
    this.tags = [...new Set(this.tags)];
  }

  // Ensure SKU is uppercase
  if (this.sku) {
    this.sku = this.sku.toUpperCase().trim();
  }

  next();
});

// Instance methods
ProductSchema.methods.isLowStock = function () {
  return this.stock <= this.lowStockThreshold;
};

ProductSchema.methods.isInStock = function () {
  return this.stock > 0;
};

ProductSchema.methods.addTag = function (tag: string) {
  const normalizedTag = tag.toLowerCase().trim();
  if (normalizedTag && !this.tags.includes(normalizedTag)) {
    this.tags.push(normalizedTag);
  }
  return this;
};

ProductSchema.methods.removeTag = function (tag: string) {
  const normalizedTag = tag.toLowerCase().trim();
  this.tags = this.tags.filter((t: string) => t !== normalizedTag);
  return this;
};

ProductSchema.methods.hasTag = function (tag: string) {
  const normalizedTag = tag.toLowerCase().trim();
  return this.tags.includes(normalizedTag);
};

ProductSchema.methods.toggleRecommended = function () {
  this.isRecommended = !this.isRecommended;
  return this;
};

ProductSchema.methods.getFormattedWeight = function () {
  const units: Record<string, string> = {
    kg: "kg",
    grams: "g",
    ltr: "L",
    ml: "ml",
    box: "box",
    bags: "bags",
    pieces: "pcs",
    other: "unit",
  };

  const unit = units[this.weightUnit] || this.weightUnit;

  // Auto-convert large values
  if (this.weightUnit === "grams" && this.weight >= 1000) {
    return `${(this.weight / 1000).toFixed(1)} kg`;
  }
  if (this.weightUnit === "ml" && this.weight >= 1000) {
    return `${(this.weight / 1000).toFixed(1)} L`;
  }

  return `${this.weight} ${unit}`;
};

// Static methods
ProductSchema.statics.findByCategory = function (category: string) {
  return this.find({ category, isActive: true }).sort({ name: 1 });
};

ProductSchema.statics.findByTag = function (tag: string) {
  return this.find({ tags: tag.toLowerCase(), isActive: true }).sort({
    name: 1,
  });
};

ProductSchema.statics.findByTags = function (tags: string[]) {
  const normalizedTags = tags.map((tag) => tag.toLowerCase().trim());
  return this.find({ tags: { $in: normalizedTags }, isActive: true }).sort({
    name: 1,
  });
};

ProductSchema.statics.findRecommended = function () {
  return this.find({ isRecommended: true, isActive: true }).sort({
    createdAt: -1,
  });
};

ProductSchema.statics.findLowStock = function () {
  return this.find({
    $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    isActive: true,
  }).sort({ stock: 1 });
};

ProductSchema.statics.findByPriceRange = function (
  minPrice: number,
  maxPrice: number
) {
  return this.find({
    price: { $gte: minPrice, $lte: maxPrice },
    isActive: true,
  }).sort({ price: 1 });
};

ProductSchema.statics.searchProducts = function (searchQuery: string) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { category: { $regex: searchQuery, $options: "i" } },
          { tags: { $regex: searchQuery, $options: "i" } },
          { sku: { $regex: searchQuery, $options: "i" } },
        ],
      },
    ],
  }).sort({ name: 1 });
};

ProductSchema.statics.getProductStats = function () {
  return this.aggregate([
    {
      $match: { isActive: true },
    },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
        averagePrice: { $avg: "$price" },
        totalStock: { $sum: "$stock" },
        recommendedCount: {
          $sum: { $cond: [{ $eq: ["$isRecommended", true] }, 1, 0] },
        },
        lowStockCount: {
          $sum: {
            $cond: [{ $lte: ["$stock", "$lowStockThreshold"] }, 1, 0],
          },
        },
        outOfStockCount: {
          $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
        },
      },
    },
  ]);
};

ProductSchema.statics.getCategoryStats = function () {
  return this.aggregate([
    {
      $match: { isActive: true },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
        averagePrice: { $avg: "$price" },
        totalStock: { $sum: "$stock" },
        recommendedCount: {
          $sum: { $cond: [{ $eq: ["$isRecommended", true] }, 1, 0] },
        },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

ProductSchema.statics.getTagStats = function () {
  return this.aggregate([
    {
      $match: { isActive: true },
    },
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
        averagePrice: { $avg: "$price" },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// Validation middleware
ProductSchema.pre("validate", function (next) {
  // Ensure price is positive
  if (this.price < 0) {
    next(new Error("Price must be positive"));
  }

  // Ensure weight is positive
  if (this.weight < 0) {
    next(new Error("Weight must be positive"));
  }

  // Ensure stock is not negative
  if (this.stock < 0) {
    next(new Error("Stock cannot be negative"));
  }

  next();
});

// Check if the model exists before creating it
const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
