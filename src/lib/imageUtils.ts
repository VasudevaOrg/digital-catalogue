// src/lib/imageUtils.ts

/**
 * Utility functions for handling images from various sources
 */

export interface ImageSource {
  src: string;
  alt: string;
  isExternal: boolean;
  domain: string;
  isConfigured: boolean;
  isBlobStorage: boolean;
}

/**
 * Analyze image source and determine if it's safe for Next.js Image component
 */
export function analyzeImageSource(src: string, alt: string = ""): ImageSource {
  try {
    const url = new URL(src);
    const domain = url.hostname;

    // List of domains that are configured in next.config.js
    const configuredDomains = [
      "images.unsplash.com",
      "picsum.photos",
      "cdn.jsdelivr.net",
      "via.placeholder.com",
      "localhost",
    ];

    // Check if it's a Vercel blob storage URL
    const isBlobStorage = domain.includes(".public.blob.vercel-storage.com");

    // Check if domain is configured
    const isConfigured =
      configuredDomains.includes(domain) || domain === "your-domain.com";

    return {
      src,
      alt,
      isExternal: !src.startsWith("/"),
      domain,
      isConfigured: isConfigured || isBlobStorage,
      isBlobStorage,
    };
  } catch (error) {
    // If URL parsing fails, assume it's a local image
    return {
      src,
      alt,
      isExternal: false,
      domain: "local",
      isConfigured: true,
      isBlobStorage: false,
    };
  }
}

/**
 * Get optimized image props for different sources
 */
export function getOptimizedImageProps(src: string, alt: string = "") {
  const analysis = analyzeImageSource(src, alt);

  if (analysis.isBlobStorage) {
    // For blob storage, use regular img tag with optimizations
    return {
      useNextImage: false,
      props: {
        src: analysis.src,
        alt: analysis.alt,
        loading: "lazy" as const,
        decoding: "async" as const,
        style: {
          width: "100%",
          height: "100%",
          objectFit: "cover" as const,
        },
        onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
          console.warn("Failed to load image:", analysis.src);
          const target = e.target as HTMLImageElement;
          // You could set a fallback image here
          target.style.opacity = "0";
        },
      },
    };
  } else {
    // For other sources, use Next.js Image component
    return {
      useNextImage: true,
      props: {
        src: analysis.src,
        alt: analysis.alt,
        fill: true,
        className: "object-cover",
        priority: false,
      },
    };
  }
}

/**
 * Preload images for better performance
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(sources: string[]): Promise<void> {
  try {
    await Promise.all(sources.map((src) => preloadImage(src)));
    console.log(`✅ Preloaded ${sources.length} images`);
  } catch (error) {
    console.warn("⚠️ Some images failed to preload:", error);
  }
}
