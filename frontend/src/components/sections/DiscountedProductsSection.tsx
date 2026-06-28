import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import Button from "../ui/Button";
import type { Product } from "../../types";

interface DiscountedProductsSectionProps {
  products: Product[];
  isVisible?: boolean;
  sectionTitle?: string;
  sectionSubtitle?: string;
  backgroundColor?: string;
  accentColor?: "emerald" | "blue" | "purple" | "red" | "amber";
  maxProducts?: number;
  showCountdown?: boolean;
  countdownHours?: number;
  countdownMinutes?: number;
  countdownSeconds?: number;
}

const DiscountedProductsSection = ({
  products,
  isVisible = true,
  sectionTitle = "Incredible Savings",
  sectionSubtitle = "Handpicked products with amazing discounts - Limited time offers you don't want to miss",
  backgroundColor = "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20",
  accentColor = "emerald",
  maxProducts = 8,
  showCountdown = true,
  countdownHours = 23,
  countdownMinutes = 45,
  countdownSeconds = 12,
}: DiscountedProductsSectionProps) => {
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  // Color configurations for different accent colors
  const colorConfig = {
    emerald: {
      primary: "emerald-500",
      secondary: "teal-600",
      light: "emerald-50",
      dark: "emerald-900/30",
      text: "emerald-600",
      darkText: "emerald-400",
      gradient: "from-emerald-500 to-teal-600",
      hoverGradient: "from-emerald-600 to-teal-700",
      borderLight: "emerald-200",
      borderDark: "emerald-700",
      bgHover: "emerald-50",
      darkBgHover: "emerald-900/30",
      discount: "from-red-500 to-pink-600",
      badge: "from-emerald-400 to-teal-400",
    },
    blue: {
      primary: "primary-500",
      secondary: "primary-600",
      light: "primary-50",
      dark: "primary-900/30",
      text: "primary-600",
      darkText: "primary-400",
      gradient: "from-primary-500 to-primary-600",
      hoverGradient: "from-primary-600 to-primary-700",
      borderLight: "primary-200",
      borderDark: "primary-700",
      bgHover: "primary-50",
      darkBgHover: "primary-900/30",
      discount: "from-red-500 to-pink-600",
      badge: "from-primary-400 to-primary-400",
    },
    purple: {
      primary: "secondary-500",
      secondary: "violet-600",
      light: "secondary-50",
      dark: "secondary-900/30",
      text: "secondary-600",
      darkText: "secondary-400",
      gradient: "from-secondary-500 to-violet-600",
      hoverGradient: "from-secondary-600 to-violet-700",
      borderLight: "secondary-200",
      borderDark: "secondary-700",
      bgHover: "secondary-50",
      darkBgHover: "secondary-900/30",
      discount: "from-red-500 to-pink-600",
      badge: "from-secondary-400 to-violet-400",
    },
    red: {
      primary: "red-500",
      secondary: "rose-600",
      light: "red-50",
      dark: "red-900/30",
      text: "red-600",
      darkText: "red-400",
      gradient: "from-red-500 to-rose-600",
      hoverGradient: "from-red-600 to-rose-700",
      borderLight: "red-200",
      borderDark: "red-700",
      bgHover: "red-50",
      darkBgHover: "red-900/30",
      discount: "from-orange-500 to-red-600",
      badge: "from-red-400 to-rose-400",
    },
    amber: {
      primary: "amber-500",
      secondary: "orange-600",
      light: "amber-50",
      dark: "amber-900/30",
      text: "amber-600",
      darkText: "amber-400",
      gradient: "from-amber-500 to-orange-600",
      hoverGradient: "from-amber-600 to-orange-700",
      borderLight: "amber-200",
      borderDark: "amber-700",
      bgHover: "amber-50",
      darkBgHover: "amber-900/30",
      discount: "from-red-500 to-pink-600",
      badge: "from-amber-400 to-orange-400",
    },
  };

  const colors = colorConfig[accentColor];

  const handleWishlistToggle = (productId: string) => {
    const newWishlist = new Set(wishlistItems);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlistItems(newWishlist);
  };

  const handleAddToCart = (product: Product) => {
    // Add to cart logic - will be connected to Redux store
    console.log("Adding to cart:", product);
  };

  if (!isVisible) {
    return null;
  }

  const displayProducts = products.slice(0, maxProducts);
  const totalProducts = products.length;
  const maxDiscount = Math.max(
    ...displayProducts.map(() => Math.floor(Math.random() * 60 + 20))
  );

  return (
    <section
      className={`py-20 ${backgroundColor} relative overflow-hidden transition-colors duration-300`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div
          className={`absolute top-1/4 left-1/4 w-80 h-80 bg-${colors.primary} rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-${colors.secondary} rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-${colors.primary} rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-4000`}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${colors.gradient} text-white font-bold text-sm mb-6 shadow-lg transform hover:scale-105 transition-all duration-300`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L3.09 8.26L4 21H20L20.91 8.26L12 2Z" />
            </svg>
            SPECIAL DISCOUNTS AVAILABLE
          </div>
          <h2
            className={`text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-${colors.text} via-${colors.secondary} to-${colors.text} dark:from-${colors.darkText} dark:via-${colors.darkText} dark:to-${colors.darkText} bg-clip-text text-transparent mb-6`}
          >
            {sectionTitle}
          </h2>
          <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {sectionSubtitle}
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mt-10 mb-4">
            <div className="text-center">
              <div
                className={`text-3xl lg:text-4xl font-bold text-${colors.text} dark:text-${colors.darkText}`}
              >
                {totalProducts}+
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Products on Sale
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl lg:text-4xl font-bold text-${colors.text} dark:text-${colors.darkText}`}
              >
                {maxDiscount}%
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Max Discount
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl lg:text-4xl font-bold text-${colors.text} dark:text-${colors.darkText}`}
              >
                24h
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Time Left
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {displayProducts.map((product, index) => {
            const discountPercentage = Math.floor(Math.random() * 60 + 20); // 20-80% discount
            const originalPrice = product.price;
            const discountedPrice =
              originalPrice * (1 - discountPercentage / 100);
            const savings = originalPrice - discountedPrice;
            const isWishlisted = wishlistItems.has(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-visible animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div
                    className={`bg-gradient-to-r ${colors.discount} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}
                  >
                    -{discountPercentage}%
                  </div>
                  <div
                    className={`mt-2 bg-${colors.primary} text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md`}
                  >
                    SAVE ${savings.toFixed(2)}
                  </div>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlistToggle(product.id)}
                  className={`absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 ${
                    isWishlisted
                      ? "bg-red-50 dark:bg-red-900/30"
                      : "group-group-hover:bg-red-50 dark:group-hover:bg-red-900/30"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted
                        ? "text-red-500 fill-current"
                        : "text-gray-600 dark:text-gray-300 group-hover:text-red-500"
                    }`}
                  />
                </button>

                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>

                  {/* Quick View Button */}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      size="sm"
                      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-[#333] dark:text-white border border-gray-200 dark:border-gray-600 
            hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
            transform scale-90 group-hover:scale-100 transition-all duration-300 p-4 rounded"
                      // className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transform scale-90 group-hover:scale-100 transition-all duration-300"
                    >
                      Quick View
                    </Button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  {/* Category & Brand */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-medium text-${colors.text} dark:text-${colors.darkText} bg-${colors.light} dark:bg-${colors.dark} px-2 py-1 rounded-full`}
                    >
                      {product.category}
                    </span>
                    {product.isNew && (
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <Link to={`/products/${product.id}`}>
                    <h3
                      className={`font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-${colors.text} dark:group-hover:text-${colors.darkText} transition-colors duration-300 line-clamp-2`}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "text-amber-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      ({product.reviewCount})
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-2xl font-bold text-${colors.text} dark:text-${colors.darkText}`}
                      >
                        ${discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div
                      className={`text-sm text-${colors.text} dark:text-${colors.darkText} font-semibold`}
                    >
                      You save ${savings.toFixed(2)}!
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {product.inStock ? (
                      <div
                        className={`flex items-center text-sm text-${colors.text} dark:text-${colors.darkText}`}
                      >
                        <div
                          className={`w-2 h-2 bg-${colors.primary} rounded-full mr-2`}
                        ></div>
                        In Stock - {Math.floor(Math.random() * 20 + 5)} left
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`flex-1 bg-gradient-to-r ${colors.gradient} hover:${colors.hoverGradient} disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.inStock ? "Add to Cart" : "Sold Out"}
                    </Button>
                    <Button
                      onClick={() => handleWishlistToggle(product.id)}
                      variant="outline"
                      size="sm"
                      className={`px-3 border-${colors.borderLight} dark:border-${colors.borderDark} text-${colors.text} dark:text-${colors.darkText} hover:bg-${colors.bgHover} dark:hover:bg-${colors.darkBgHover} transform hover:scale-105 transition-all duration-300`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-${colors.primary}/20 to-${colors.secondary}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Call-to-Action Section */}
        <div className="text-center">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Don't Miss Out on These Amazing Deals!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Limited time offers with up to {maxDiscount}% off on selected
                items
              </p>
            </div>

            {/* Urgency Countdown */}
            {showCountdown && (
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div
                  className={`bg-${colors.light} dark:bg-${colors.dark} rounded-xl px-4 py-3 min-w-20`}
                >
                  <div
                    className={`text-2xl font-bold text-${colors.text} dark:text-${colors.darkText}`}
                  >
                    {countdownHours}
                  </div>
                  <div
                    className={`text-xs font-medium text-${colors.text} dark:text-${colors.darkText}`}
                  >
                    Hours
                  </div>
                </div>
                <div
                  className={`bg-${colors.light} dark:bg-${colors.dark} rounded-xl px-4 py-3 min-w-20`}
                >
                  <div
                    className={`text-2xl font-bold text-${colors.text} dark:text-${colors.darkText}`}
                  >
                    {countdownMinutes}
                  </div>
                  <div
                    className={`text-xs font-medium text-${colors.text} dark:text-${colors.darkText}`}
                  >
                    Minutes
                  </div>
                </div>
                <div
                  className={`bg-${colors.light} dark:bg-${colors.dark} rounded-xl px-4 py-3 min-w-20`}
                >
                  <div
                    className={`text-2xl font-bold text-${colors.text} dark:text-${colors.darkText}`}
                  >
                    {countdownSeconds}
                  </div>
                  <div
                    className={`text-xs font-medium text-${colors.text} dark:text-${colors.darkText}`}
                  >
                    Seconds
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products?filter=discounted">
                <Button
                  size="lg"
                  className={`w-full sm:w-auto bg-gradient-to-r ${colors.gradient} hover:${colors.hoverGradient} text-white font-bold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                  </svg>
                  Shop All Discounted Items
                </Button>
              </Link>
              <Link to="/newsletter">
                <Button
                  variant="outline"
                  size="lg"
                  className={`w-full sm:w-auto border-2 border-${colors.borderLight} dark:border-${colors.borderDark} text-${colors.text} dark:text-${colors.darkText} hover:bg-${colors.bgHover} dark:hover:bg-${colors.darkBgHover} transform hover:scale-105 transition-all duration-300`}
                >
                  Get Notified of New Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements for Visual Appeal */}
      <div className="absolute top-20 right-20 animate-bounce">
        <div
          className={`w-6 h-6 bg-${colors.primary} rounded-full opacity-60`}
        ></div>
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce animation-delay-1000">
        <div
          className={`w-4 h-4 bg-${colors.secondary} rounded-full opacity-60`}
        ></div>
      </div>
      {/* <div className="absolute top-1/3 right-1/4 animate-bounce animation-delay-2000">
        <div
          className={`w-5 h-5 bg-${colors.primary} rounded-full opacity-60`}
        ></div>
      </div> */}
    </section>
  );
};

export default DiscountedProductsSection;
