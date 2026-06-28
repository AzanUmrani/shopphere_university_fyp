import React, { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { Link } from "react-router-dom";
import {
  removeFromCartAsync,
  increaseQuantityAsync,
  decreaseQuantityAsync,
  clearCartAsync,
  clearError,
} from "../../store/slices/cartSlice";
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  Trash2,
  ArrowRight,
  Package,
} from "lucide-react";
import Badge from "../ui/Badge";

const CartDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { items, total, itemCount, isLoading, error } = useAppSelector(
    (state) => state.cart
  );

  console.log("🛒 [CART DROPDOWN] Current state:", { itemCount, items: items.length, total, isLoading, error });

  useEffect(() => {
    if (error) dispatch(clearError());
  }, [error, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleIncreaseQuantity = async (itemId: string) => {
    await dispatch(increaseQuantityAsync({ itemId }));
  };

  const handleDecreaseQuantity = async (itemId: string) => {
    await dispatch(decreaseQuantityAsync({ itemId }));
  };

  const handleRemoveItem = async (itemId: string) => {
    await dispatch(removeFromCartAsync({ itemId }));
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      await dispatch(clearCartAsync());
    }
  };

  if (error) {
    return (
      <div className="relative">
        <button
          onClick={() => dispatch(clearError())}
          className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Shopping cart (click to retry)"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-white dark:border-gray-900">
            !
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            variant="danger"
            size="sm"
            className="absolute -top-1 -right-1 min-w-[1.1rem] h-4 flex items-center justify-center text-[10px] border-2 border-white dark:border-gray-900"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden animate-scale-in">
          {isLoading ? (
            <div className="p-8 flex flex-col items-center">
              <div className="animate-spin rounded-full h-7 w-7 border-2 border-primary-600 border-t-transparent mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Add some products to get started
              </p>
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Browse Products
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Cart
                </h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Items */}
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.product.images?.[0] || item.product.image || "/api/placeholder/400/400"}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100 dark:border-gray-800 flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/api/placeholder/400/400";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1.5">
                          ${parseFloat(item.product.price).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDecreaseQuantity(item.id)}
                            className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
                            disabled={isLoading || item.quantity <= 1}
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white min-w-[1.25rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item.id)}
                            className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
                            disabled={isLoading}
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-40 flex-shrink-0"
                        disabled={isLoading}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Subtotal</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {total < 50 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                    Add ${(50 - total).toFixed(2)} more for free shipping
                  </p>
                )}

                <div className="space-y-2">
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    View Cart
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex gap-2">
                    <Link
                      to="/checkout"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium px-4 py-2 rounded-lg text-center transition-colors"
                    >
                      Checkout
                    </Link>
                    {items.length > 0 && (
                      <button
                        onClick={handleClearCart}
                        className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-red-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 rounded-lg transition-colors disabled:opacity-40"
                        disabled={isLoading}
                        title="Clear cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
