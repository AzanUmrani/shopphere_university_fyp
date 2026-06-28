import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { addToCartAsync } from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import {
  setSearchQuery,
  fetchProducts,
  fetchCategories,
  setCurrentPage,
} from "../store/slices/productSlice";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ProductCard from "../components/product/ProductCard";
import {
  ProductListAd,
  SidebarAd,
  ProductDemoVideoAd,
  GoogleBannerAd,
} from "../components/ads/AdComponents";

const mockCategories = [
  { id: "all", name: "All Categories" },
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "accessories", name: "Accessories" },
  { id: "home-kitchen", name: "Home & Kitchen" },
];

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    categories,
    searchQuery,
    isLoading,
    error,
    currentPage,
    totalPages,
  } = useAppSelector((state) => state.products);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy, priceRange, currentPage]);

  const loadProducts = () => {
    const params: any = {
      page: currentPage,
      limit: 12,
      sortBy,
      sortOrder: sortBy === "price-low" ? "asc" : "desc",
    };
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (localSearchQuery) params.search = localSearchQuery;
    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 500) params.maxPrice = priceRange[1];
    dispatch(fetchProducts(params));
  };

  const handleAddToCart = async (product: any) => {
    try {
      await dispatch(addToCartAsync({ productId: product.id, quantity: 1 })).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleAddToWishlist = (product: any) => {
    dispatch(
      addToWishlist({
        id: `wishlist-${Date.now()}`,
        productId: product.id,
        userId: "current-user",
        addedAt: new Date().toISOString(),
      })
    );
  };

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearchQuery));
    loadProducts();
  };

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery !== localSearchQuery) loadProducts();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Discover our curated collection of high-quality products
          </p>

          {/* Search */}
          <div className="max-w-xl relative">
            <Input
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for products..."
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              className="pr-20"
            />
            <Button
              onClick={handleSearch}
              size="sm"
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {products?.length || 0} products
          </span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-60 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-5">
                <Filter className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  Filters
                </h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === "all"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories?.map((category: any) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Price Range
                </h3>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-primary-600 mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>$0</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    Up to ${priceRange[1]}
                  </span>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 dark:focus:border-primary-600 outline-none transition-colors"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Sidebar Ad */}
            <SidebarAd />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {products?.length || 0}
                </span>{" "}
                products found
                {selectedCategory !== "all" && (
                  <span className="ml-1">
                    in{" "}
                    {mockCategories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                )}
                {localSearchQuery && (
                  <span className="ml-1">for "{localSearchQuery}"</span>
                )}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product List Ad */}
            <div className="mb-6">
              <ProductListAd />
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mb-4"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Error loading products
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                <Button onClick={loadProducts} size="sm" variant="outline">
                  Try Again
                </Button>
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setLocalSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange([0, 500]);
                    dispatch(setSearchQuery(""));
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products?.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products?.map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-36 h-36 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-1.5 mb-3">
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
                              {product.rating} ({product.reviewCount} reviews)
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              product.inStock
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            }`}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ${product.price}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAddToWishlist(product)}
                              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-red-200 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              size="sm"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {products && products.length > 0 && currentPage < totalPages && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                >
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Demo Video */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Discover Product Features
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Watch detailed product demonstrations and reviews
            </p>
          </div>
          <ProductDemoVideoAd />
        </div>
      </div>

      {/* Google Banner Ad */}
      <div className="py-8 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GoogleBannerAd />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
