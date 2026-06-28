/**
 * Utility functions for handling images with CORS and error handling
 */

export interface ImageLoadOptions {
  crossOrigin?: "anonymous" | "use-credentials";
  timeout?: number;
}

/**
 * Preload an image to check if it's accessible
 */
export const preloadImage = (
  src: string,
  options: ImageLoadOptions = {}
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();

    if (options.crossOrigin) {
      img.crossOrigin = options.crossOrigin;
    }

    const timeout = options.timeout || 5000; // 5 second timeout

    const timeoutId = setTimeout(() => {
      resolve(false);
    }, timeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      resolve(false);
    };

    img.src = src;
  });
};

/**
 * Get full URL from avatar path
 */
export const getFullAvatarUrl = (
  avatarPath: string | undefined
): string | null => {
  if (!avatarPath) return null;

  // If it's already a full URL (starts with http), return as-is
  if (avatarPath.startsWith("http")) {
    return avatarPath;
  }

  // Otherwise, construct the full URL from the backend
  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5001";
  return `${baseUrl}${avatarPath.startsWith("/") ? "" : "/"}${avatarPath}`;
};

/**
 * Check if image is accessible (for debugging CORS issues)
 */
export const debugImageAccess = async (src: string): Promise<void> => {
  try {
    // Try to fetch the image
    const response = await fetch(src, { mode: "no-cors" });
    console.log("Fetch response status:", response.status);
    console.log("Fetch response type:", response.type);
  } catch (error) {
    console.error("Fetch error:", error);
  }

  // Try to load as image
  const canLoad = await preloadImage(src, { crossOrigin: "anonymous" });
  console.log("Can load as image:", canLoad);

  console.groupEnd();
};

/**
 * Generate fallback avatar based on user info
 */
export const generateFallbackAvatar = (
  firstName?: string,
  lastName?: string
): string => {
  const initials = `${firstName?.charAt(0) || ""}${
    lastName?.charAt(0) || ""
  }`.toUpperCase();
  const colors = [
    "bg-gradient-to-br from-purple-500 to-pink-500",
    "bg-gradient-to-br from-blue-500 to-cyan-500",
    "bg-gradient-to-br from-green-500 to-teal-500",
    "bg-gradient-to-br from-red-500 to-orange-500",
    "bg-gradient-to-br from-indigo-500 to-purple-500",
  ];

  const colorIndex = (firstName?.charCodeAt(0) || 0) % colors.length;
  return colors[colorIndex];
};
