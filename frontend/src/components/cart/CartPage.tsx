import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Trash2, Minus, Plus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  fetchCart,
  removeFromCartAsync,
  increaseQuantityAsync,
  decreaseQuantityAsync,
  clearCartAsync,
  updateCartItemAsync,
  clearError,
} from "../../store/slices/cartSlice";
import Button from "../ui/Button";

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total, itemCount, isLoading, error } = useAppSelector(
    (state) => state.cart
  );

  const handleIncreaseQuantity = async (itemId: string) => {
    await dispatch(increaseQuantityAsync({ itemId }));
  };

  const handleDecreaseQuantity = async (itemId: string) => {
    await dispatch(decreaseQuantityAsync({ itemId }));
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await dispatch(updateCartItemAsync({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = async (itemId: string) => {
    await dispatch(removeFromCartAsync({ itemId }));
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      await dispatch(clearCartAsync());
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 py-12 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mb-4"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 py-12 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl mb-4 inline-block">
              <p className="font-semibold text-sm">Error loading cart</p>
              <p className="text-sm mt-1 text-red-600 dark:text-red-300">{error}</p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(fetchCart());
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {itemCount > 0
                ? `${itemCount} item${itemCount > 1 ? "s" : ""}`
                : "Your cart is empty"}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors flex items-center gap-1.5"
              disabled={isLoading}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Start adding some items to your cart!
            </p>
            <Link to="/products">
              <Button size="md">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Items List */}
            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map((item) => (
                    <li key={item.id} className="p-5">
                      <div className="flex gap-4">
                        <img
                          src={
                            item.product.images?.[0] ||
                            item.product.image ||
                            "/placeholder-product.svg"
                          }
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-product.svg";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                                {item.product.name}
                              </h3>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                                {item.product.description}
                              </p>
                            </div>
                            <p className="text-base font-bold text-gray-900 dark:text-white flex-shrink-0">
                              ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity */}
                            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleDecreaseQuantity(item.id)}
                                className="px-2.5 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
                                disabled={isLoading || item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value);
                                  if (newQuantity && newQuantity > 0 && newQuantity <= 99) {
                                    handleUpdateQuantity(item.id, newQuantity);
                                  }
                                }}
                                className="w-10 text-center text-sm bg-transparent text-gray-900 dark:text-white border-0 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none py-1.5"
                                disabled={isLoading}
                              />
                              <button
                                onClick={() => handleIncreaseQuantity(item.id)}
                                className="px-2.5 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
                                disabled={isLoading || item.quantity >= 99}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                ${parseFloat(item.product.price).toFixed(2)} each
                              </span>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                                disabled={isLoading}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sticky top-20">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-secondary-600 dark:text-secondary-400">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Tax</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      At checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-5">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={handleCheckout}
                    fullWidth
                    disabled={isLoading || items.length === 0}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                  <Link to="/products">
                    <Button variant="secondary" fullWidth>
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && items.length > 0 && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-6 py-4 rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-7 w-7 border-2 border-primary-600 border-t-transparent mx-auto mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Updating cart...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
