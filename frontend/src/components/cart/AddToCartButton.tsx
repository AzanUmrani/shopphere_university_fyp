import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addToCartAsync } from "../../store/slices/cartSlice";
import  { addToast } from "../../store/slices/toastSlice";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  onSuccess,
  onError,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.cart);

  const handleAddToCart = async () => {
    if (disabled || isAdding || isLoading) return;

    console.log(
      "🛍️ [ADD TO CART BUTTON] Starting add to cart for product:",
      productId
    );
    setIsAdding(true);
    try {
      const result = await dispatch(
        addToCartAsync({ productId, quantity })
      ).unwrap();
      console.log("🛍️ [ADD TO CART BUTTON] Success:", result);
      if (onSuccess) {
        onSuccess();
        dispatch(addToast({
          type:`success`,
          title: `Great!`,
          message:`Item added to the Cart Successfully ✅`,
        }))
      }
    } catch (error) {
      console.error("🛍️ [ADD TO CART BUTTON] Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add item to cart";
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsAdding(false);
    }
  };

  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant classes
  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500",
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding || isLoading}
      className={combinedClasses}
      aria-label={`Add ${quantity} item${quantity > 1 ? "s" : ""} to cart`}
    >
      {isAdding ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Adding...
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 5l-1 5h10l1-5M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
