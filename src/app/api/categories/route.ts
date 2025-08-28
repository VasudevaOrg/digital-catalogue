// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get unique categories from active products
    const categories = await Product.distinct("category", { isActive: true });

    return NextResponse.json({
      success: true,
      data: categories.filter(Boolean), // Remove any null/undefined values
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
