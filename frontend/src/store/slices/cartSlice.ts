import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Types matching your backend API response
interface ApiCartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  variantData: any;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    originalPrice: string;
    brand: string;
    rating: string;
    reviewCount: number;
    inStock: boolean;
    stockQuantity: number;
    discount: string;
    images: string[];
    image: string;
    imageDetails: Array<{
      id: string;
      url: string;
      alt: string;
      isPrimary: boolean;
      sortOrder: number;
    }>;
    discountedPrice: number;
  };
}

interface ApiCartData {
  id: string;
  items: ApiCartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface CartState {
  items: ApiCartItem[];
  total: number;
  itemCount: number;
  cartId: string | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  cartId: null,
  isOpen: false,
  isLoading: false,
  error: null,
};

// Helper to generate or get session ID for guest users
const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem("cart-session-id");
  console.log("🔑 [SESSION] Existing session ID:", sessionId);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("cart-session-id", sessionId);
    console.log("🔑 [SESSION] Created new session ID:", sessionId);
  }

  return sessionId;
};

// Helper to get session ID or auth token
const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const authToken = localStorage.getItem("authToken");
  console.log("🔐 [AUTH] Token exists:", !!authToken);

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
    console.log("🔐 [AUTH] Using Bearer token");
  } else {
    // For guest users, ensure we have a session ID
    const sessionId = getOrCreateSessionId();
    headers["x-session-id"] = sessionId;
    console.log("🔐 [AUTH] Using session ID:", sessionId);
  }

  return headers;
};

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 [FETCH CART] Starting...");
      const headers = getAuthHeaders();
      console.log("🔍 [FETCH CART] Headers:", headers);

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "GET",
        headers,
      });

      console.log("🔍 [FETCH CART] Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ApiCartData> = await response.json();
      console.log("🔍 [FETCH CART] Result:", result);

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch cart");
      }

      return result.data;
    } catch (error: any) {
      console.error("❌ [FETCH CART] Error:", error);
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (
    payload: {
      productId: string;
      quantity?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("🛒 [ADD TO CART] Starting with payload:", payload);
      const headers = getAuthHeaders();
      console.log("🛒 [ADD TO CART] Headers:", headers);

      const requestBody = {
        productId: payload.productId,
        quantity: payload.quantity || 1,
      };
      console.log("🛒 [ADD TO CART] Request body:", requestBody);

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log("🛒 [ADD TO CART] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🛒 [ADD TO CART] Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ApiCartData> = await response.json();
      console.log("🛒 [ADD TO CART] Success result:", result);

      if (!result.success) {
        throw new Error(result.message || "Failed to add to cart");
      }

      return result.data;
    } catch (error: any) {
      console.error("❌ [ADD TO CART] Error:", error);
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
      const response = await fetch(
        `${API_BASE_URL}/cart/items/${payload.itemId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            quantity: payload.quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ApiCartData> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update cart item");
      }

      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update cart item");
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (payload: { itemId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cart/items/${payload.itemId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ApiCartData> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to remove from cart");
      }

      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove from cart");
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ApiCartData> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to clear cart");
      }

      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to clear cart");
    }
  }
);

// Thunk for increasing quantity
export const increaseQuantityAsync = createAsyncThunk(
  "cart/increaseQuantityAsync",
  async (payload: { itemId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };
      const item = state.cart.items.find((item) => item.id === payload.itemId);

      if (!item) {
        throw new Error("Item not found in cart");
      }

      const newQuantity = item.quantity + 1;

      const response = await fetch(
        `${API_BASE_URL}/cart/items/${payload.itemId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ApiCartData> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to increase quantity");
      }

      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to increase quantity");
    }
  }
);

// Thunk for decreasing quantity
export const decreaseQuantityAsync = createAsyncThunk(
  "cart/decreaseQuantityAsync",
  async (payload: { itemId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };
      const item = state.cart.items.find((item) => item.id === payload.itemId);

      if (!item) {
        throw new Error("Item not found in cart");
      }

      const newQuantity = Math.max(1, item.quantity - 1);

      const response = await fetch(
        `${API_BASE_URL}/cart/items/${payload.itemId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ApiCartData> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to decrease quantity");
      }

      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to decrease quantity");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload.items;
        state.total = action.payload.totalAmount;
        state.itemCount = action.payload.itemCount;
        state.cartId = action.payload.id;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        console.log("🔄 [REDUX] Add to cart PENDING");
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        console.log(
          "✅ [REDUX] Add to cart FULFILLED with payload:",
          action.payload
        );
        console.log("✅ [REDUX] Previous item count:", state.itemCount);
        state.isLoading = false;
        state.error = null;
        state.items = action.payload.items;
        state.total = action.payload.totalAmount;
        state.itemCount = action.payload.itemCount;
        state.cartId = action.payload.id;
        console.log("✅ [REDUX] New item count:", state.itemCount);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        console.error("❌ [REDUX] Add to cart REJECTED:", action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update cart item
      .addCase(updateCartItemAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload.items;
        state.total = action.payload.totalAmount;
        state.itemCount = action.payload.itemCount;
        state.cartId = action.payload.id;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload.items;
        state.total = action.payload.totalAmount;
        state.itemCount = action.payload.itemCount;
        state.cartId = action.payload.id;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Clear cart
      .addCase(clearCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload.items || [];
        state.total = action.payload.totalAmount || 0;
        state.itemCount = action.payload.itemCount || 0;
        state.cartId = action.payload.id;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Increase quantity
      .addCase(increaseQuantityAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(increaseQuantityAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload.items;
        state.total = action.payload.totalAmount;
        state.itemCount = action.payload.itemCount;
        state.cartId = action.payload.id;
      })
      .addCase(increaseQuantityAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Decrease quantity
      .addCase(decreaseQuantityAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(decreaseQuantityAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload.items;
        state.total = action.payload.totalAmount;
        state.itemCount = action.payload.itemCount;
        state.cartId = action.payload.id;
      })
      .addCase(decreaseQuantityAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleCart, setCartOpen, clearError } = cartSlice.actions;

export default cartSlice.reducer;
