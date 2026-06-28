import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ExternalLink, ArrowRight, Star, Zap, Gift } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

interface AdvertisementProps {
  variant?: "banner" | "sidebar" | "card" | "hero" | "inline" | "popup";
  size?: "sm" | "md" | "lg" | "xl";
  title: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
}

const Advertisement = ({
  variant = "card",
  size = "md",
  title,
  description,
  imageUrl,
  ctaText = "Shop Now",
  ctaUrl = "#",
  backgroundColor = "bg-gradient-to-r from-secondary-600 to-pink-600",
  textColor = "text-white",
  showCloseButton = false,
  onClose,
  className = "",
}: AdvertisementProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleCtaClick = () => {
    if (ctaUrl.startsWith("http") || ctaUrl.startsWith("//")) {
      // External link
      window.open(ctaUrl, "_blank");
    } else if (ctaUrl.startsWith("#")) {
      // Anchor link - scroll to section
      const element = document.querySelector(ctaUrl);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Internal route
      navigate(ctaUrl);
    }
  };

  if (!isVisible) return null;

  // Hero Banner Variant
  if (variant === "hero") {
    return (
      <div className={`relative ${backgroundColor} ${textColor} ${className}`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Gift className="w-8 h-8 mr-3" />
                <span className="text-sm font-medium uppercase tracking-wide opacity-90">
                  Special Offer
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-xl mb-8 opacity-90 leading-relaxed">
                  {description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={handleCtaClick}
                >
                  {ctaText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Learn More
                </Button>
              </div>
            </div>
            {imageUrl && (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold transform rotate-12">
                  <Star className="w-4 h-4 inline mr-1" />
                  Hot Deal!
                </div>
              </div>
            )}
          </div>
        </div>
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  // Banner Variant
  if (variant === "banner") {
    const sizeClasses = {
      sm: "py-3",
      md: "py-4",
      lg: "py-6",
      xl: "py-8",
    };

    return (
      <div
        className={`${backgroundColor} ${textColor} ${sizeClasses[size]} ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Zap className="w-6 h-6 animate-pulse" />
              <div>
                <h3 className="font-bold text-lg">{title}</h3>
                {description && (
                  <p className="text-sm opacity-90">{description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                onClick={handleCtaClick}
              >
                {ctaText}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-black/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card Variant
  if (variant === "card") {
    const sizeClasses = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-10",
    };

    return (
      <Card
        className={`relative overflow-hidden ${sizeClasses[size]} ${className}`}
      >
        <div className={`absolute inset-0 ${backgroundColor}`} />
        <div className="relative z-10">
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 bg-black/20 rounded hover:bg-black/40 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className={`font-bold text-xl mb-2 ${textColor}`}>{title}</h3>
              {description && (
                <p className={`mb-4 ${textColor} opacity-90`}>{description}</p>
              )}
              <Button
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                onClick={handleCtaClick}
              >
                {ctaText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            {imageUrl && (
              <div className="ml-6 flex-shrink-0">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-32 h-32 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Sidebar Variant
  if (variant === "sidebar") {
    return (
      <Card className={`relative overflow-hidden ${className}`}>
        <div className={`absolute inset-0 ${backgroundColor}`} />
        <div className="relative z-10 p-6">
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 bg-black/20 rounded hover:bg-black/40 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-32 object-cover rounded-lg mb-4 shadow-lg"
            />
          )}
          <h3 className={`font-bold text-lg mb-2 ${textColor}`}>{title}</h3>
          {description && (
            <p className={`text-sm mb-4 ${textColor} opacity-90`}>
              {description}
            </p>
          )}
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            onClick={handleCtaClick}
          >
            {ctaText}
          </Button>
        </div>
      </Card>
    );
  }

  // Inline Variant
  if (variant === "inline") {
    return (
      <div
        className={`${backgroundColor} ${textColor} rounded-lg p-4 my-6 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="w-12 h-12 object-cover rounded-lg"
              />
            )}
            <div>
              <h4 className="font-semibold">{title}</h4>
              {description && (
                <p className="text-sm opacity-90">{description}</p>
              )}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            onClick={handleCtaClick}
          >
            {ctaText}
          </Button>
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="ml-2 p-1 hover:bg-black/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Popup Variant
  if (variant === "popup") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="relative max-w-md w-full">
          <div className={`absolute inset-0 ${backgroundColor} rounded-lg`} />
          <div className="relative z-10 p-6">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 bg-black/20 rounded hover:bg-black/40 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className={`font-bold text-2xl mb-3 ${textColor}`}>{title}</h3>
            {description && (
              <p className={`mb-6 ${textColor} opacity-90`}>{description}</p>
            )}
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                fullWidth
                className="bg-white text-gray-900 hover:bg-gray-100"
                onClick={handleCtaClick}
              >
                {ctaText}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default Advertisement;
