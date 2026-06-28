import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import {
  getFullAvatarUrl,
  preloadImage,
  debugImageAccess,
} from "../../utils/imageUtils";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  firstName?: string;
  lastName?: string;
  className?: string;
  fallbackClassName?: string;
  debug?: boolean;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  firstName,
  lastName,
  className = "",
  fallbackClassName = "",
  debug = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fullAvatarUrl = getFullAvatarUrl(src);
  const displayName =
    alt || `${firstName || ""} ${lastName || ""}`.trim() || "User";

  // Generate initials for fallback
  const initials =
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() ||
    "?";

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);

    if (fullAvatarUrl && debug) {
      debugImageAccess(fullAvatarUrl);
    }
  }, [fullAvatarUrl, debug]);

  // Preload image to check accessibility
  useEffect(() => {
    if (!fullAvatarUrl) {
      setIsLoading(false);
      return;
    }

    preloadImage(fullAvatarUrl, { crossOrigin: "anonymous" }).then(
      (canLoad) => {
        setIsLoading(false);
        if (!canLoad) {
          setImageError(true);
          console.warn("Avatar image failed to preload:", fullAvatarUrl);
        }
      }
    );
  }, [fullAvatarUrl]);

  const baseClasses = `${sizeClasses[size]} rounded-full border-2 border-secondary-200 dark:border-secondary-700 group-hover:border-secondary-400 transition-colors`;
  const fallbackClasses = `${sizeClasses[size]} bg-gradient-to-br from-secondary-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium`;

  if (!fullAvatarUrl || imageError || isLoading) {
    return (
      <div className={`${fallbackClasses} ${fallbackClassName}`}>
        {initials.length > 1 ? (
          <span
            className={
              size === "sm"
                ? "text-xs"
                : size === "md"
                ? "text-sm"
                : "text-base"
            }
          >
            {initials}
          </span>
        ) : (
          <User
            className={
              size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"
            }
          />
        )}
      </div>
    );
  }

  return (
    <img
      src={fullAvatarUrl}
      alt={displayName}
      className={`${baseClasses} ${className}`}
      crossOrigin="anonymous"
      onError={() => {
        console.error("Avatar image failed to load:", {
          originalSrc: src,
          fullUrl: fullAvatarUrl,
          error: "Image load error - likely CORS or 404",
        });
        setImageError(true);
      }}
      onLoad={() => {
        if (debug) {
          console.log("Avatar image loaded successfully:", fullAvatarUrl);
        }
      }}
    />
  );
};

export default Avatar;
