import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  X,
  Star,
  Grid3X3,
  List,
  Share2,
  ArrowRight,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  removeFromWishlist,
  clearWishlist,
} from "../store/slices/wishlistSlice";
import { addToCartAsync } from "../store/slices/cartSlice";
import { fetchProducts } from "../store/slices/productSlice";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const { products } = useAppSelector((state) => state.products);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 100 }));
    }
  }, [dispatch, products.length]);

  const wishlistProducts = wishlistItems
    .map((wishlistItem) => {
      const product = products.find((p) => p.id === wishlistItem.productId);
      if (product) {
        return {
          ...product,
          addedAt: wishlistItem.addedAt,
          images:
            product.images && product.images.length > 0
              ? product.images
              : [product.image || "/api/placeholder/400/400"],
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
        };
      }
      return null;
    })
    .filter((product) => product !== null);

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await dispatch(addToCartAsync({ productId, quantity: 1 })).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to remove all items from your wishlist?")) {
      dispatch(clearWishlist());
    }
  };

  const sortedProducts = [...wishlistProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
      case "price-high":
        return parseFloat(b.price.toString()) - parseFloat(a.price.toString());
      case "name":
        return a.name.localeCompare(b.name);
      case "recent":
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  if (wishlistItems.length > 0 && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading wishlist products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Wishlist is Empty
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Save items you love to your wishlist and come back to them anytime.
            </p>
            <Link to="/products">
              <Button>
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  navigator.share &&
                  navigator.share({ title: "My ShopSphere Wishlist", url: window.location.href })
                }
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={handleClearWishlist}
                className="flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-3.5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
            >
              <option value="recent">Recently Added</option>
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">View:</span>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedProducts.map((product) => (
              <Card
                key={product.id}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative overflow-hidden">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-7 h-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 transition-colors shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-secondary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center mb-2.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < product.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-200 dark:text-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">
                      ({product.reviewCount})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <span className="text-xs text-secondary-600 dark:text-secondary-400 font-medium">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    fullWidth
                    size="sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                    Add to Cart
                  </Button>

                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                    Added {new Date(product.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative flex-shrink-0">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-28 h-28 object-cover rounded-lg border border-gray-100 dark:border-gray-800"
                      />
                    </Link>
                    {product.isNew && (
                      <span className="absolute -top-1.5 -right-1.5 bg-secondary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-center sm:justify-start mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < product.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-200 dark:text-gray-700"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 dark:text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Added {new Date(product.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button onClick={() => handleAddToCart(product.id)} size="sm" className="flex-1 sm:flex-none">
                      <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                      Add to Cart
                    </Button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="w-9 h-9 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations placeholder */}
        {wishlistProducts.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                You Might Also Like
              </h2>
              <Link to="/products">
                <button className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors">
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
            <div className="h-20 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-sm text-gray-400 dark:text-gray-600">
              Product recommendations will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
