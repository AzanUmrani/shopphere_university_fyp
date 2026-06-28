import { useState } from "react";
import { Play, X, ExternalLink } from "lucide-react";
import Button from "../ui/Button";

interface YouTubeAdProps {
  videoId: string; // YouTube video ID
  title: string;
  description?: string;
  thumbnailUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  autoPlay?: boolean;
  variant?: "inline" | "modal" | "banner" | "sidebar";
  size?: "sm" | "md" | "lg";
  onClose?: () => void;
  className?: string;
}

const YouTubeAd = ({
  videoId,
  title,
  description,
  thumbnailUrl,
  ctaText = "Learn More",
  ctaUrl,
  autoPlay = false,
  variant = "inline",
  size = "md",
  onClose,
  className = "",
}: YouTubeAdProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const thumbnail = thumbnailUrl || defaultThumbnail;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${
    autoPlay ? 1 : 0
  }&rel=0&modestbranding=1`;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleCtaClick = () => {
    if (ctaUrl) {
      window.open(ctaUrl, "_blank");
    }
  };

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  if (!isVisible) return null;

  // Modal variant
  if (variant === "modal") {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-semibold rounded">
                SPONSORED
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mt-1">
                {title}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Video */}
          <div className="relative">
            {!isVideoLoaded ? (
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsVideoLoaded(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors group"
                >
                  <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </button>
              </div>
            ) : (
              <iframe
                src={embedUrl}
                className="w-full aspect-video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {description}
              </p>
            )}
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              {ctaUrl && (
                <Button
                  onClick={handleCtaClick}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {ctaText}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant
  if (variant === "banner") {
    return (
      <div
        className={`w-full bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-24 h-16 bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setIsVideoLoaded(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
            >
              <Play className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-semibold rounded">
                AD
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Sponsored
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {title}
            </h4>
            {description && (
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                {description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {ctaUrl && (
              <Button
                size="sm"
                onClick={handleCtaClick}
                className="bg-red-600 hover:bg-red-700"
              >
                {ctaText}
              </Button>
            )}
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === "sidebar") {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      >
        {/* Video */}
        <div className="relative">
          {!isVideoLoaded ? (
            <div className="relative aspect-video bg-gray-900">
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsVideoLoaded(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors group"
              >
                <div className="bg-red-600 hover:bg-red-700 rounded-full p-3 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
              </button>
              {/* Ad Label */}
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                AD
              </div>
            </div>
          ) : (
            <iframe
              src={embedUrl}
              className="w-full aspect-video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            />
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between">
            {ctaUrl && (
              <Button
                size="sm"
                onClick={handleCtaClick}
                className="bg-red-600 hover:bg-red-700 flex-1 mr-2"
              >
                {ctaText}
              </Button>
            )}
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div
      className={`${sizeClasses[size]} mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {/* Video */}
      <div className="relative">
        {!isVideoLoaded ? (
          <div className="relative aspect-video bg-gray-900">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setIsVideoLoaded(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors group"
            >
              <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </button>
            {/* Ad Label */}
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
              SPONSORED
            </div>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            className="w-full aspect-video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {description}
          </p>
        )}
        {ctaUrl && (
          <Button
            onClick={handleCtaClick}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {ctaText}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default YouTubeAd;
