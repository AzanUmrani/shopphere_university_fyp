import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchProductById, fetchProducts } from "../store/slices/productSlice";
import { addToCartAsync } from "../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import Button from "../components/ui/Button";
import ProductCard from "../components/product/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentProduct, products, isLoading, error } = useAppSelector(
    (state) => state.products
  );
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchProducts({ limit: 8 }));
    }
  }, [dispatch, id]);

  if (isLoading && !currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const isInCart = cartItems.some(
    (item) => item.product.id === currentProduct.id
  );
  const isInWishlist = wishlistItems.some(
    (item) => item.productId === currentProduct.id
  );
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== currentProduct.id && p.category === currentProduct.category
    )
    .slice(0, 4);

  const productImages = currentProduct.images || [currentProduct.image];

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await dispatch(
        addToCartAsync({
          productId: currentProduct.id,
          quantity,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(currentProduct.id));
    } else {
      dispatch(
        addToWishlist({
          id: `wishlist-${currentProduct.id}-${Date.now()}`,
          productId: currentProduct.id,
          userId: "current-user", // This should come from auth state
          addedAt: new Date().toISOString(),
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-primary-600 dark:hover:text-primary-400"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">
            {currentProduct.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={productImages[selectedImageIndex]}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-primary-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {currentProduct.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                by <span className="font-semibold">{currentProduct.brand}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(currentProduct.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {currentProduct.rating} ({currentProduct.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                ${currentProduct.price}
              </span>
              {currentProduct.originalPrice &&
                currentProduct.originalPrice > currentProduct.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${currentProduct.originalPrice}
                    </span>
                    <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-sm font-semibold">
                      {currentProduct.discount}% OFF
                    </span>
                  </>
                )}
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  currentProduct.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`font-semibold ${
                  currentProduct.inStock
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {currentProduct.inStock
                  ? `In Stock (${currentProduct.stockQuantity} available)`
                  : "Out of Stock"}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentProduct.description}
            </p>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(currentProduct.stockQuantity, quantity + 1)
                    )
                  }
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={quantity >= currentProduct.stockQuantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={!currentProduct.inStock || isAddingToCart}
                className="flex-1 flex items-center justify-center space-x-2"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {isAddingToCart
                    ? "Adding..."
                    : isInCart
                    ? "Added to Cart"
                    : "Add to Cart"}
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                className="p-3"
                size="lg"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist ? "fill-current text-red-500" : ""
                  }`}
                />
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                className="p-3"
                size="lg"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Shield className="w-5 h-5 text-primary-600" />
                <span>2-year warranty included</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
