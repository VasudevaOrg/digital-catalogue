// src/lib/carouselService.ts

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: string;
  primaryLink: string;
  secondaryCTA: string;
  secondaryLink: string;
  bgGradient: string;
  accentColor: string;
  image?: string;
}

// Static fallback slides (same as current HeroBanner)
const staticSlides: CarouselSlide[] = [
  {
    id: 1,
    title: "Premium Quality Groceries",
    subtitle: "Farm Fresh • Hand Picked • Quality Assured",
    description:
      "Discover our premium collection of fresh groceries, spices, and daily essentials delivered straight to your doorstep.",
    primaryCTA: "Shop Now",
    primaryLink: "/products",
    secondaryCTA: "Browse Categories",
    secondaryLink: "/categories",
    bgGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accentColor: "emerald",
  },
  {
    id: 2,
    title: "Free Delivery Available",
    subtitle: "On Orders Above ₹1,000 • Same Day Delivery",
    description:
      "Get free home delivery on eligible products when you order above ₹1,000. Fast, reliable, and secure delivery to your location.",
    primaryCTA: "Order Now",
    primaryLink: "/products",
    secondaryCTA: "Learn More",
    secondaryLink: "/products",
    bgGradient: "from-blue-600 via-indigo-600 to-purple-600",
    accentColor: "blue",
  },
  {
    id: 3,
    title: "WhatsApp Ordering",
    subtitle: "Quick • Easy • Instant Confirmation",
    description:
      "Browse our digital catalogue and place orders directly through WhatsApp for the most convenient shopping experience.",
    primaryCTA: "Chat Now",
    primaryLink: "https://wa.me/919448132930",
    secondaryCTA: "View Products",
    secondaryLink: "/products",
    bgGradient: "from-orange-600 via-red-600 to-pink-600",
    accentColor: "orange",
  },
];

export class CarouselService {
  private static instance: CarouselService;
  private cache: CarouselSlide[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): CarouselService {
    if (!CarouselService.instance) {
      CarouselService.instance = new CarouselService();
    }
    return CarouselService.instance;
  }

  async getCarouselSlides(): Promise<CarouselSlide[]> {
    // Check if cache is valid
    if (this.cache && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      console.log("🎠 Using cached carousel data");
      return this.cache;
    }

    console.log("🔄 Fetching fresh carousel data...");

    try {
      // Try to fetch dynamic content from blob storage
      const response = await fetch("/api/carousel", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`📡 Carousel API response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📋 Carousel API result:", {
        success: result.success,
        dataLength: result.data?.length || 0,
        count: result.count,
      });

      if (result.success && result.data && result.data.length > 0) {
        // Convert blob data to carousel slides
        const dynamicSlides: CarouselSlide[] = result.data.map(
          (item: any, index: number) => ({
            id: item.id || index + 1,
            title:
              item.title || staticSlides[index % staticSlides.length].title,
            subtitle:
              item.subtitle ||
              staticSlides[index % staticSlides.length].subtitle,
            description:
              item.description ||
              staticSlides[index % staticSlides.length].description,
            primaryCTA:
              item.cta || staticSlides[index % staticSlides.length].primaryCTA,
            primaryLink:
              item.ctaLink ||
              staticSlides[index % staticSlides.length].primaryLink,
            secondaryCTA:
              staticSlides[index % staticSlides.length].secondaryCTA,
            secondaryLink:
              staticSlides[index % staticSlides.length].secondaryLink,
            bgGradient:
              item.bgGradient ||
              staticSlides[index % staticSlides.length].bgGradient,
            accentColor:
              item.accentColor ||
              staticSlides[index % staticSlides.length].accentColor,
            image: item.image, // This will be the blob URL
          })
        );

        // Cache the dynamic slides
        this.cache = dynamicSlides;
        this.cacheTimestamp = Date.now();

        console.log(
          `✅ Loaded ${dynamicSlides.length} dynamic carousel slides from blob storage`
        );
        console.log(
          "🖼️ Carousel images:",
          dynamicSlides.map((s) => ({ title: s.title, hasImage: !!s.image }))
        );

        return dynamicSlides;
      } else {
        console.log("⚠️ No dynamic carousel data found, using static content");
        console.log("📊 API result details:", result);
        throw new Error("No dynamic carousel data available");
      }
    } catch (error) {
      console.warn(
        "⚠️ Failed to fetch dynamic carousel content, falling back to static slides:"
      );
      console.warn(
        "Error details:",
        error instanceof Error ? error.message : "Unknown error"
      );
      console.warn(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );

      // Fallback to static slides
      this.cache = staticSlides;
      this.cacheTimestamp = Date.now();
      console.log("📋 Using static slides:", staticSlides.length, "slides");

      return staticSlides;
    }
  }

  // Method to clear cache (useful when carousel is updated)
  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }

  // Method to preload carousel data
  async preloadCarousel(): Promise<void> {
    try {
      await this.getCarouselSlides();
    } catch (error) {
      console.warn("Failed to preload carousel:", error);
    }
  }
}

// Export singleton instance
export const carouselService = CarouselService.getInstance();
