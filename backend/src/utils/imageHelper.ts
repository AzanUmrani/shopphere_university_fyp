import { Product, ProductImage } from "@/models";
import logger from "@/config/logger";

/**
 * Image utility functions for handling product images
 */

// Function to get the full URL for an image
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it starts with /uploads, return as is (it's a relative path)
  if (imagePath.startsWith("/uploads")) {
    return imagePath;
  }

  // If it doesn't start with /uploads, add it
  if (imagePath.startsWith("uploads/")) {
    return `/${imagePath}`;
  }

  // Default case - assume it's a filename and prepend /uploads/products/
  return `/uploads/products/${imagePath}`;
};

// Function to format product images for frontend consumption
export const formatProductImages = (product: any) => {
  if (!product) return null;

  // Get images from the included ProductImage association
  const images = product.images || [];

  // Format images array with full URLs
  const formattedImages = images
    .map((img: any) => ({
      id: img.id,
      url: getImageUrl(img.imageUrl),
      alt: img.altText || product.name,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    }))
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder);

  // Get primary image from first image with isPrimary=true or first image in array
  let primaryImage = "";
  if (formattedImages.length > 0) {
    const primary = formattedImages.find((img: any) => img.isPrimary);
    primaryImage = primary ? primary.url : formattedImages[0].url;
  } else {
    // No images available, use placeholder
    primaryImage = getPlaceholderImage();
  }

  // Ensure we always have at least one image in the images array
  const imagesArray =
    formattedImages.length > 0
      ? formattedImages.map((img: any) => img.url)
      : [getPlaceholderImage()];

  // Create the final product object with properly formatted image data
  return {
    ...product.toJSON(),
    image: primaryImage, // Single primary image for backwards compatibility
    images: imagesArray, // Array of image URLs for frontend
    imageDetails: formattedImages, // Full image details with metadata
  };
};

// Function to format multiple products
export const formatProductsWithImages = (products: any[]) => {
  return products.map(formatProductImages);
};

// Function to create a default placeholder image if no images exist
export const getPlaceholderImage = () => {
  return "/uploads/products/placeholder-product.svg";
};

// Function to validate image URL
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;

  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const hasValidExtension = imageExtensions.some((ext) =>
    url.toLowerCase().includes(ext)
  );

  return hasValidExtension || url.startsWith("data:image/");
};

// Function to update product primary image when images change (simplified version)
export const updateProductPrimaryImage = async (productId: string) => {
  try {
    // Find the primary image and ensure it's marked correctly
    const primaryImage = await ProductImage.findOne({
      where: {
        productId,
        isPrimary: true,
      },
    });

    if (!primaryImage) {
      // If no primary image, set the first image by sort order as primary
      const firstImage = await ProductImage.findOne({
        where: { productId },
        order: [["sortOrder", "ASC"]],
      });

      if (firstImage) {
        await ProductImage.update(
          { isPrimary: true },
          { where: { id: firstImage.id } }
        );
      }
    }
  } catch (error) {
    logger.error("Error updating product primary image:", error);
  }
};

export default {
  getImageUrl,
  formatProductImages,
  formatProductsWithImages,
  getPlaceholderImage,
  isValidImageUrl,
  updateProductPrimaryImage,
};
