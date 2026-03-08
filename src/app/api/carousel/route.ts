// src/app/api/carousel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      blobs.map((b) => b.pathname.split("/").pop()),
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
          `📄 File: ${filename}, isImage: ${isImage}, isActive: ${isActive}`,
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
            .pop()} (order: ${bOrder})`,
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
          let category = "";

          const decodeField = (str: string) => {
            try {
              const decoded = decodeURIComponent(
                (str || "").replace(/%2D/g, "-").replace(/%2E/g, "."),
              );
              // Backward compatibility: replace underscores with space if no space exists
              if (!decoded.includes(" ") && decoded.includes("_")) {
                return decoded.replace(/[_]/g, " ");
              }
              return decoded;
            } catch (e) {
              return str.replace(/[_]/g, " ");
            }
          };

          // Find title, description, and category parts
          const titleIndex = parts.findIndex((part) => part === "title");
          const descIndex = parts.findIndex((part) => part === "desc");
          const orderIndex = parts.findIndex((part) => part === "order");
          const catIndex = parts.findIndex((part) => part === "cat");

          if (titleIndex >= 0 && titleIndex + 1 < parts.length) {
            const titleEnd =
              descIndex > titleIndex
                ? descIndex
                : orderIndex > titleIndex
                  ? orderIndex
                  : catIndex > titleIndex
                    ? catIndex
                    : parts.length;
            title = decodeField(
              parts.slice(titleIndex + 1, titleEnd).join("-"),
            );
          }

          if (descIndex >= 0 && descIndex + 1 < parts.length) {
            const descEnd =
              orderIndex > descIndex
                ? orderIndex
                : catIndex > descIndex
                  ? catIndex
                  : parts.length;
            description = decodeField(
              parts.slice(descIndex + 1, descEnd).join("-"),
            );
          }

          if (catIndex >= 0 && catIndex + 1 < parts.length) {
            // Category goes until the file extension dot
            const lastPart = parts[parts.length - 1];
            const catEnd = parts.length - 1;

            category = parts.slice(catIndex + 1, catEnd).join("-");

            // Add the name part before the dot if it exists
            const nameBeforeDot = lastPart.split(".")[0];
            if (
              nameBeforeDot &&
              nameBeforeDot !== "jpg" &&
              nameBeforeDot !== "png" &&
              nameBeforeDot !== "webp" &&
              nameBeforeDot !== "jpeg"
            ) {
              category = category
                ? `${category}-${nameBeforeDot}`
                : nameBeforeDot;
            }
            category = decodeField(category);
          }

          // Clean up empty values
          if (!title || title === "inn" || title.trim() === "") {
            title = `Premium Quality Products`;
          }
          if (!description || description.trim() === "") {
            description = "Discover our premium collection of quality products";
          }

          return { title, description, category };
        };

        const { title, description, category } =
          extractInfoFromFilename(filename);

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
          ctaLink: category
            ? `/products?category=${encodeURIComponent(category)}`
            : "/products",
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
      { status: 500 },
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
