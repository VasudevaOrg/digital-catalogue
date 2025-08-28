// src/lib/blobUtils.ts
import { put, list, del } from "@vercel/blob";

export interface CarouselImage {
  id: string;
  url: string;
  filename: string;
  order: number;
  uploadedAt: string;
}

export class BlobCarouselManager {
  private readonly CAROUSEL_PREFIX = "carousel/";

  /**
   * Get all carousel images from blob storage
   */
  async getCarouselImages(): Promise<CarouselImage[]> {
    try {
      const { blobs } = await list({
        prefix: this.CAROUSEL_PREFIX,
        limit: 20,
      });

      return blobs
        .filter((blob) => this.isValidImageFile(blob.pathname))
        .map((blob) => {
          const filename = blob.pathname.split("/").pop() || "";
          const order = this.extractOrderFromFilename(filename);

          return {
            id: blob.pathname,
            url: blob.url,
            filename,
            order,
            uploadedAt: blob.uploadedAt.toISOString(),
          };
        })
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
      throw new Error("Failed to fetch carousel images from blob storage");
    }
  }

  /**
   * Check if file is a valid image
   */
  private isValidImageFile(pathname: string): boolean {
    const filename = pathname.toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    return validExtensions.some((ext) => filename.endsWith(ext));
  }

  /**
   * Extract order number from filename (e.g., carousel-1.jpg -> 1)
   */
  private extractOrderFromFilename(filename: string): number {
    const match = filename.match(/carousel-(\d+)/);
    return match ? parseInt(match[1], 10) : 999; // Default to high number for unordered files
  }

  /**
   * Upload a carousel image
   */
  async uploadCarouselImage(
    file: File,
    order: number
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      if (!this.isValidImageFile(file.name)) {
        throw new Error(
          "Invalid file type. Please upload JPG, PNG, WEBP, or GIF files."
        );
      }

      const filename = `carousel-${order}.${file.name.split(".").pop()}`;
      const blob = await put(`${this.CAROUSEL_PREFIX}${filename}`, file, {
        access: "public",
        handleBlobUploadUrl: true,
      });

      return {
        success: true,
        url: blob.url,
      };
    } catch (error) {
      console.error("Error uploading carousel image:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  /**
   * Delete a carousel image
   */
  async deleteCarouselImage(
    pathname: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await del(pathname);
      return { success: true };
    } catch (error) {
      console.error("Error deleting carousel image:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed",
      };
    }
  }

  /**
   * Get carousel image by order
   */
  async getCarouselImageByOrder(order: number): Promise<CarouselImage | null> {
    try {
      const images = await this.getCarouselImages();
      return images.find((img) => img.order === order) || null;
    } catch (error) {
      console.error("Error getting carousel image by order:", error);
      return null;
    }
  }

  /**
   * Check if carousel images exist in blob storage
   */
  async hasCarouselImages(): Promise<boolean> {
    try {
      const { blobs } = await list({
        prefix: this.CAROUSEL_PREFIX,
        limit: 1,
      });

      return blobs.some((blob) => this.isValidImageFile(blob.pathname));
    } catch (error) {
      console.error("Error checking for carousel images:", error);
      return false;
    }
  }

  /**
   * Validate carousel setup
   */
  async validateCarouselSetup(): Promise<{
    isValid: boolean;
    imageCount: number;
    errors: string[];
  }> {
    try {
      const images = await this.getCarouselImages();
      const errors: string[] = [];

      if (images.length === 0) {
        errors.push("No carousel images found");
      }

      // Check for missing order numbers
      const orders = images.map((img) => img.order).sort((a, b) => a - b);
      for (let i = 1; i <= orders.length; i++) {
        if (!orders.includes(i)) {
          errors.push(`Missing carousel image for order ${i}`);
        }
      }

      return {
        isValid: errors.length === 0,
        imageCount: images.length,
        errors,
      };
    } catch (error) {
      return {
        isValid: false,
        imageCount: 0,
        errors: [error instanceof Error ? error.message : "Validation failed"],
      };
    }
  }
}

// Export singleton instance
export const blobCarouselManager = new BlobCarouselManager();

// Utility functions for carousel management
export const carouselUtils = {
  /**
   * Generate optimal filename for carousel image
   */
  generateCarouselFilename(originalName: string, order: number): string {
    const extension = originalName.split(".").pop();
    return `carousel-${order}.${extension}`;
  },

  /**
   * Validate image file
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Invalid file type. Please upload JPG, PNG, WEBP, or GIF files.",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size too large. Please upload images smaller than 5MB.",
      };
    }

    return { isValid: true };
  },

  /**
   * Optimize image for web (placeholder - in real app would use image optimization)
   */
  async optimizeImageForWeb(file: File): Promise<File> {
    // In a real application, you would implement image optimization here
    // For now, we'll just return the original file
    return file;
  },
};
