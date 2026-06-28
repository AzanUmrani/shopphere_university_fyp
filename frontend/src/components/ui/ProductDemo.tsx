import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Star,
  Truck,
} from "lucide-react";
import Button from "./Button";

interface DemoSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  feature: string;
  highlights: string[];
}

interface ProductDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductDemo: React.FC<ProductDemoProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const demoSlides: DemoSlide[] = [
    {
      id: 1,
      title: "Smart Product Discovery",
      description:
        "AI-powered recommendations help you find exactly what you're looking for",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      feature: "🤖 AI Recommendations",
      highlights: [
        "Personalized suggestions",
        "Smart filtering",
        "Visual search",
      ],
    },
    {
      id: 2,
      title: "Seamless Shopping Cart",
      description:
        "Add items, save for later, and checkout with just a few clicks",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      feature: "🛒 Smart Cart",
      highlights: ["One-click add to cart", "Save for later", "Quick checkout"],
    },
    {
      id: 3,
      title: "Wishlist & Favorites",
      description:
        "Keep track of products you love and get notified about price drops",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
      feature: "❤️ Wishlist",
      highlights: [
        "Price drop alerts",
        "Easy organization",
        "Share with friends",
      ],
    },
    {
      id: 4,
      title: "Fast & Secure Checkout",
      description: "Multiple payment options with bank-level security",
      image:
        "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop",
      feature: "🔒 Secure Payment",
      highlights: [
        "Multiple payment methods",
        "256-bit encryption",
        "Express checkout",
      ],
    },
    {
      id: 5,
      title: "Order Tracking & Reviews",
      description: "Track your orders in real-time and share your experience",
      image:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop",
      feature: "📦 Order Tracking",
      highlights: ["Real-time updates", "Review system", "Customer support"],
    },
  ];

  useEffect(() => {
    if (isAutoPlaying && isOpen) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, isOpen, demoSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + demoSlides.length) % demoSlides.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Demo Content */}
      <div className="relative w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                ShopSphere Interactive Demo
              </h2>
              <p className="text-primary-100 mt-1">
                Discover our powerful features
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Demo Slides */}
        <div className="relative h-96 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {demoSlides.map((slide) => (
              <div key={slide.id} className="w-full flex-shrink-0 flex">
                {/* Content Side */}
                <div className="w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-3">
                      {slide.feature}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {slide.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {slide.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Demo Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary-500 to-secondary-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Try It Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      Add to Wishlist
                    </Button>
                  </div>
                </div>

                {/* Image Side */}
                <div className="w-1/2 relative overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Floating elements for interactivity */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="text-sm font-semibold">4.9/5</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold ">
                        Free Shipping
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-center gap-2 mb-4">
            {demoSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary-500 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Slide {currentSlide + 1} of {demoSlides.length}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close Demo
              </Button>
              <Button
                className="bg-gradient-to-r from-primary-500 to-secondary-600"
                onClick={() => {
                  onClose();
                  window.location.href = "/products";
                }}
              >
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDemo;
