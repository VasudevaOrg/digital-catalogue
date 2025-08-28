// src/app/api/carousel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET(request: NextRequest) {
  try {
    console.log("🎠 Fetching carousel data from blob storage...");

    // List all files in the carousel folder
    const { blobs } = await list({
      prefix: "carousel/",
      limit: 20,
    });

    console.log(
      `📁 Found ${blobs.length} files in carousel folder:`,
      blobs.map((b) => b.pathname.split("/").pop())
    );

    // Filter and sort carousel items based on your admin's naming pattern
    const carouselItems = blobs
      .filter((blob) => {
        const filename = blob.pathname.split("/").pop() || "";
        const isImage =
          filename.endsWith(".jpg") ||
          filename.endsWith(".jpeg") ||
          filename.endsWith(".png") ||
          filename.endsWith(".webp") ||
          filename.endsWith(".gif");

        // Check if filename contains "active-true" (indicating it's active)
        const isActive = filename.includes("active-true");

        console.log(
          `📄 File: ${filename}, isImage: ${isImage}, isActive: ${isActive}`
        );

        return isImage && isActive;
      })
      .sort((a, b) => {
        // Extract order from filename (e.g., "order-2" -> 2)
        const getOrderFromFilename = (pathname: string) => {
          const filename = pathname.split("/").pop() || "";
          const orderMatch = filename.match(/order-(\d+)/);
          return orderMatch ? parseInt(orderMatch[1], 10) : 999;
        };

        const aOrder = getOrderFromFilename(a.pathname);
        const bOrder = getOrderFromFilename(b.pathname);

        console.log(
          `🔢 Sorting: ${a.pathname
            .split("/")
            .pop()} (order: ${aOrder}) vs ${b.pathname
            .split("/")
            .pop()} (order: ${bOrder})`
        );

        return aOrder - bOrder;
      })
      .map((blob, index) => {
        const filename = blob.pathname.split("/").pop() || "";

        // Extract title and description from filename
        const extractInfoFromFilename = (filename: string) => {
          // Pattern: timestamp-index-title-description-order-X-active-true.ext
          const parts = filename.split("-");
          let title = "Premium Quality Products";
          let description = "Discover our premium collection";

          // Find title and description parts
          const titleIndex = parts.findIndex((part) => part === "title");
          const descIndex = parts.findIndex((part) => part === "desc");
          const orderIndex = parts.findIndex((part) => part === "order");

          if (titleIndex >= 0 && titleIndex + 1 < parts.length) {
            const titleEnd =
              descIndex > titleIndex
                ? descIndex
                : orderIndex > titleIndex
                ? orderIndex
                : parts.length;
            title = parts
              .slice(titleIndex + 1, titleEnd)
              .join(" ")
              .replace(/[_]/g, " ");
          }

          if (descIndex >= 0 && descIndex + 1 < parts.length) {
            const descEnd = orderIndex > descIndex ? orderIndex : parts.length;
            description = parts
              .slice(descIndex + 1, descEnd)
              .join(" ")
              .replace(/[_]/g, " ");
          }

          // Clean up empty values
          if (!title || title === "inn" || title.trim() === "") {
            title = `Premium Quality Products`;
          }
          if (!description || description.trim() === "") {
            description = "Discover our premium collection of quality products";
          }

          return { title, description };
        };

        const { title, description } = extractInfoFromFilename(filename);

        console.log(`✨ Creating carousel item ${index + 1}:`, {
          title,
          description,
          image: blob.url,
        });

        return {
          id: index + 1,
          image: blob.url,
          title: title,
          subtitle: "Farm Fresh • Hand Picked • Quality Assured",
          description: description,
          cta: "Shop Now",
          ctaLink: "/products",
          bgGradient: getGradientForIndex(index),
          accentColor: getAccentColorForIndex(index),
        };
      });

    console.log(`🎯 Final carousel items: ${carouselItems.length}`);

    return NextResponse.json({
      success: true,
      data: carouselItems,
      count: carouselItems.length,
    });
  } catch (error) {
    console.error("❌ Error fetching carousel data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch carousel data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to get gradient based on index
function getGradientForIndex(index: number): string {
  const gradients = [
    "from-emerald-600 via-teal-600 to-cyan-600",
    "from-blue-600 via-indigo-600 to-purple-600",
    "from-orange-600 via-red-600 to-pink-600",
    "from-violet-600 via-purple-600 to-indigo-600",
    "from-rose-600 via-pink-600 to-fuchsia-600",
  ];
  return gradients[index % gradients.length];
}

// Helper function to get accent color based on index
function getAccentColorForIndex(index: number): string {
  const colors = ["emerald", "blue", "orange", "violet", "rose"];
  return colors[index % colors.length];
}
