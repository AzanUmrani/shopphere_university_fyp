import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Star } from "lucide-react";
import type { Product } from "../../types";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AddToCartButton } from "../cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import {
  setQuickViewProduct,
  addNotification,
} from "../../store/slices/uiSlice";
import { formatPrice, calculateDiscountPercentage } from "../../utils/helpers";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  showQuickActions?: boolean;
  viewMode?: "grid" | "list";
}

const ProductCard = ({
  product,
  variant = "default",
  showQuickActions = true,
  viewMode = "grid",
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(
    (item) => item.productId === product.id
  );

  const handleCartSuccess = () => {
    dispatch(
      addNotification({
        type: "success",
        title: "Added to Cart!",
        message: `${product.name} has been added to your cart.`,
        duration: 3000,
      })
    );
  };

  const handleCartError = (error: string) => {
    dispatch(
      addNotification({
        type: "error",
        title: "Cart Error",
        message: error,
        duration: 4000,
      })
    );
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(
        addToWishlist({
          id: `wishlist-${Date.now()}`,
          productId: product.id,
          userId: "current-user",
          addedAt: new Date().toISOString(),
        })
      );
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setQuickViewProduct(product.id));
  };

  const discountPercentage = product.originalPrice
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const imageHeight =
    variant === "compact" ? "h-40" : variant === "featured" ? "h-64" : "h-52";

  // List view
  if (viewMode === "list") {
    return (
      <Card
        className="flex flex-col h-full sm:flex-row gap-0 p-0 overflow-hidden hover:shadow-md transition-shadow duration-200"
        padding="none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative w-full sm:w-44 h-44 overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <Link to={`/products/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-105" : "scale-100"}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </Link>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.isNew && (
              <Badge variant="success" size="sm">New</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="danger" size="sm">-{discountPercentage}%</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <Link to={`/products/${product.id}`}>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-snug">
                  {product.name}
                </h3>
              </Link>
              {showQuickActions && (
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-1.5 rounded-lg transition-all duration-150 ${
                      isInWishlist
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={handleQuickView}
                    className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-current"
                        : "text-gray-200 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${product.inStock ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            <AddToCartButton
              productId={product.id}
              disabled={!product.inStock}
              size="sm"
              onSuccess={handleCartSuccess}
              onError={handleCartError}
            />
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      className="overflow-hidden group hover:shadow-md transition-all duration-200"
      padding="none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className={`relative ${imageHeight} overflow-hidden bg-gray-100 dark:bg-gray-800`}>
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${isHovered ? "scale-105" : "scale-100"}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </Link>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.isNew && (
            <Badge variant="success" size="sm">New</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="danger" size="sm">-{discountPercentage}%</Badge>
          )}
          {product.isFeatured && !product.isNew && (
            <Badge variant="warning" size="sm">Featured</Badge>
          )}
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div
            className={`absolute top-2.5 right-2.5 flex flex-col gap-1.5 transition-all duration-200 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            }`}
          >
            <button
              onClick={handleToggleWishlist}
              className={`p-1.5 rounded-lg shadow-sm transition-all duration-150 ${
                isInWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:text-gray-400"
              }`}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleQuickView}
              className="p-1.5 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add to cart overlay */}
        {isHovered && product.inStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <AddToCartButton
              productId={product.id}
              disabled={!product.inStock}
              size="sm"
              className="w-full"
              onSuccess={handleCartSuccess}
              onError={handleCartError}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        {product.brand && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 font-medium">
            {product.brand}
          </p>
        )}

        <Link to={`/products/${product.id}`}>
          <h3
            className={`font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-snug ${
              variant === "compact" ? "text-sm" : "text-sm"
            }`}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "text-amber-400 fill-current"
                    : "text-gray-200 dark:text-gray-700"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <span className={`text-[10px] font-medium ${product.inStock ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {variant !== "compact" && (
          <div className="mt-3">
            <AddToCartButton
              productId={product.id}
              disabled={!product.inStock}
              variant="outline"
              size="sm"
              className="w-full"
              onSuccess={handleCartSuccess}
              onError={handleCartError}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
