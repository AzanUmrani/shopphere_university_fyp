import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product, ProductVariant } from "../../types";
import { cartAPI } from "../../services/api";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  isLoading: boolean;
  shippingCost: number;
  taxRate: number;
  discount: number;
  couponCode: string | null;
}

// Safely parse cart items from localStorage
const getInitialCartItems = (): CartItem[] => {
  try {
    const stored = localStorage.getItem("cartItems");
    const parsed = stored ? JSON.parse(stored) : [];
    // ensure each item has product & quantity
    return parsed.filter((item: any) => item?.product && item?.quantity);
  } catch (err) {
    console.error("Failed to parse cart items from localStorage:", err);
    return [];
  }
};

const initialState: CartState = {
  items: getInitialCartItems(),
  total: 0,
  itemCount: 0,
  isOpen: false,
  isLoading: false,
  shippingCost: 0,
  taxRate: 0.08, // 8% tax
  discount: 0,
  couponCode: null,
};

// Async thunks for cart API integration
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (
    payload: {
      product: Product;
      quantity?: number;
      variant?: ProductVariant;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartAPI.addToCart(
        payload.product.id,
        payload.quantity || 1,
        payload.variant?.id
      );
      return { ...payload, cartData: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add to cart");
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  "cart/updateCartItemAsync",
  async (
    payload: {
      itemId: string;
      quantity: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartAPI.updateCartItem(
        payload.itemId,
        payload.quantity
      );
      return { ...payload, cartData: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update cart");
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (payload: { itemId: string }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(payload.itemId);
      return { ...payload, cartData: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove from cart");
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.clearCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity?: number;
        variant?: ProductVariant;
      }>
    ) => {
      const { product, quantity = 1, variant } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          selectedVariant: variant,
        });
      }

      cartSlice.caseReducers.calculateTotals(state);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; variant?: ProductVariant }>
    ) => {
      const { productId, variant } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
          )
      );
      cartSlice.caseReducers.calculateTotals(state);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity: number;
        variant?: ProductVariant;
      }>
    ) => {
      const { productId, quantity, variant } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) =>
          item.product.id === productId &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
      );

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
      }

      cartSlice.caseReducers.calculateTotals(state);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.discount = 0;
      state.couponCode = null;
      localStorage.removeItem("cartItems");
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },

    setShippingCost: (state, action: PayloadAction<number>) => {
      state.shippingCost = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },

    applyCoupon: (
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
      cartSlice.caseReducers.calculateTotals(state);
    },

    removeCoupon: (state) => {
      state.couponCode = null;
      state.discount = 0;
      cartSlice.caseReducers.calculateTotals(state);
    },

    calculateTotals: (state) => {
      // subtotal calculation with safe checks
      const subtotal = state.items.reduce((sum, item) => {
        if (!item?.product || typeof item.quantity !== "number") return sum;
        const price =
          item.selectedVariant?.priceModifier != null
            ? item.product.price + item.selectedVariant.priceModifier
            : item.product.price;
        return sum + price * item.quantity;
      }, 0);

      // total quantity
      state.itemCount = state.items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );

      const discountAmount = state.discount;
      const subtotalAfterDiscount = subtotal - discountAmount;
      const tax = subtotalAfterDiscount * state.taxRate;

      state.total = subtotalAfterDiscount + tax + state.shippingCost;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action: any) => {
        state.items = action.payload.items || [];
        cartSlice.caseReducers.calculateTotals(state);
        localStorage.setItem("cartItems", JSON.stringify(state.items));
        state.isLoading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        console.error("Failed to fetch cart:", action.payload);
        state.isLoading = false;
      })

      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        // Fallback to local state if backend doesn't return cart data
        const { product, quantity = 1, variant } = action.payload;
        const existingIndex = state.items.findIndex(
          (item) =>
            item.product.id === product.id &&
            JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
        );

        if (existingIndex >= 0) {
          state.items[existingIndex].quantity += quantity;
        } else {
          state.items.push({
            product,
            quantity,
            selectedVariant: variant,
          });
        }

        cartSlice.caseReducers.calculateTotals(state);
        localStorage.setItem("cartItems", JSON.stringify(state.items));
        state.isLoading = false;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        console.error("Failed to add to cart:", action.payload);
        state.isLoading = false;
        // Fallback to local storage operation
        const { product, quantity = 1, variant } = action.meta.arg;
        const existingIndex = state.items.findIndex(
          (item) =>
            item.product.id === product.id &&
            JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
        );

        if (existingIndex >= 0) {
          state.items[existingIndex].quantity += quantity;
        } else {
          state.items.push({
            product,
            quantity,
            selectedVariant: variant,
          });
        }

        cartSlice.caseReducers.calculateTotals(state);
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      })

      // Update cart item
      .addCase(updateCartItemAsync.fulfilled, (state) => {
        // Note: This requires a different approach as we need to match by itemId
        // For now, we'll rely on the backend response or refetch the cart
        // In production, you'd want to sync the cart state properly
        cartSlice.caseReducers.calculateTotals(state);
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      })

      // Remove from cart
      .addCase(removeFromCartAsync.fulfilled, (state) => {
        // Similar to update, this needs proper syncing with backend
        cartSlice.caseReducers.calculateTotals(state);
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      })

      // Clear cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
        state.discount = 0;
        state.couponCode = null;
        localStorage.removeItem("cartItems");
      });
  },
});

// calculate initial totals
cartSlice.caseReducers.calculateTotals(initialState);

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  setShippingCost,
  applyCoupon,
  removeCoupon,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
