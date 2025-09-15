// src/app/api/products/route.ts - Fixed with proper filtering
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const isRecommended = searchParams.get("isRecommended") === "true";
    const tagsParam = searchParams.get("tags");
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "10000");

    console.log("API Params received:", {
      page,
      limit,
      category,
      search,
      sortBy,
      sortOrder,
      isRecommended,
      tagsParam,
      minPrice,
      maxPrice,
    });

    // Build query for active products only
    const query: any = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Recommended filter
    if (isRecommended) {
      query.isRecommended = true;
    }

    // Tags filter
    if (tagsParam) {
      const tags = tagsParam
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      if (tags.length > 0) {
        query.tags = { $in: tags };
      }
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 10000) {
      query.price = {};
      if (minPrice > 0) {
        query.price.$gte = minPrice;
      }
      if (maxPrice < 10000) {
        query.price.$lte = maxPrice;
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    console.log("MongoDB Query:", JSON.stringify(query, null, 2));

    // Build sort object
    let sortObj: any = {};

    switch (sortBy) {
      case "price":
        sortObj.price = sortOrder === "desc" ? -1 : 1;
        break;
      case "newest":
        sortObj.createdAt = sortOrder === "desc" ? -1 : 1;
        break;
      case "recommended":
        sortObj.isRecommended = sortOrder === "desc" ? -1 : 1;
        sortObj.createdAt = -1; // Secondary sort by newest
        break;
      case "name":
      default:
        sortObj.name = sortOrder === "desc" ? -1 : 1;
        break;
    }

    console.log("Sort Object:", sortObj);

    // Execute query with pagination
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    console.log(`Found ${products.length} products out of ${total} total`);

    // Format products for client
    const formattedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: product._id.toString(),
      createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: product.updatedAt?.toISOString() || new Date().toISOString(),
      // Ensure required fields have defaults
      isRecommended: product.isRecommended || false,
      tags: product.tags || [],
      weightUnit: product.weightUnit || "kg",
    }));

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
