// import React, { createContext, useContext, useReducer, useEffect } from "react";
// import type { ReactNode } from "react";
// import type {
//   Cart,
//   CartItem,
//   ApiResponse,
//   CartCountResponse,
// } from "../types/cart";

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// class CartService {
//   private getHeaders(sessionId?: string, token?: string) {
//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//     };

//     if (sessionId && !token) {
//       headers["x-session-id"] = sessionId;
//     }

//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }

//     return headers;
//   }

//   private getAuthToken(): string | null {
//     return localStorage.getItem("authToken");
//   }

//   async getCart(sessionId?: string): Promise<ApiResponse<Cart>> {
//     try {
//       const token = this.getAuthToken();
//       const response = await fetch(`${API_BASE_URL}/cart`, {
//         method: "GET",
//         headers: this.getHeaders(sessionId, token || undefined),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error getting cart:", error);
//       return {
//         success: false,
//         data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
//         message: "Failed to get cart",
//       };
//     }
//   }

//   async addToCart(
//     productId: string,
//     quantity: number = 1,
//     sessionId?: string
//   ): Promise<ApiResponse<Cart>> {
//     try {
//       const token = this.getAuthToken();
//       const response = await fetch(`${API_BASE_URL}/cart/items`, {
//         method: "POST",
//         headers: this.getHeaders(sessionId, token || undefined),
//         body: JSON.stringify({ productId, quantity }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       return {
//         success: false,
//         data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
//         message: "Failed to add item to cart",
//       };
//     }
//   }

//   async updateCartItem(
//     itemId: string,
//     quantity: number,
//     sessionId?: string
//   ): Promise<ApiResponse<Cart>> {
//     try {
//       const token = this.getAuthToken();
//       const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
//         method: "PUT",
//         headers: this.getHeaders(sessionId, token || undefined),
//         body: JSON.stringify({ quantity }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error updating cart item:", error);
//       return {
//         success: false,
//         data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
//         message: "Failed to update cart item",
//       };
//     }
//   }

//   async removeFromCart(
//     itemId: string,
//     sessionId?: string
//   ): Promise<ApiResponse<Cart>> {
//     try {
//       const token = this.getAuthToken();
//       const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
//         method: "DELETE",
//         headers: this.getHeaders(sessionId, token || undefined),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//       return {
//         success: false,
//         data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
//         message: "Failed to remove item from cart",
//       };
//     }
//   }

//   async clearCart(sessionId?: string): Promise<ApiResponse<Cart>> {
//     try {
//       const token = this.getAuthToken();
//       const response = await fetch(`${API_BASE_URL}/cart/clear`, {
//         method: "DELETE",
//         headers: this.getHeaders(sessionId, token || undefined),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//       return {
//         success: false,
//         data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
//         message: "Failed to clear cart",
//       };
//     }
//   }

//   async getCartCount(
//     sessionId?: string
//   ): Promise<ApiResponse<CartCountResponse>> {
//     try {
//       const token = this.getAuthToken();
//       const response = await fetch(`${API_BASE_URL}/cart/count`, {
//         method: "GET",
//         headers: this.getHeaders(sessionId, token || undefined),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error getting cart count:", error);
//       return {
//         success: false,
//         data: { count: 0 },
//         message: "Failed to get cart count",
//       };
//     }
//   }

//   async mergeGuestCart(sessionId: string): Promise<ApiResponse<Cart>> {
//     try {
//       const token = this.getAuthToken();
//       if (!token) {
//         throw new Error("No auth token available");
//       }

//       const response = await fetch(`${API_BASE_URL}/cart/merge`, {
//         method: "POST",
//         headers: this.getHeaders(sessionId, token),
//         body: JSON.stringify({ sessionId }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error merging guest cart:", error);
//       return {
//         success: false,
//         data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
//         message: "Failed to merge guest cart",
//       };
//     }
//   }
// }

// const cartService = new CartService();

// // Re-export types for convenience
// export type { Cart, CartItem } from "../types/cart";

// interface CartState {
//   cart: Cart;
//   loading: boolean;
//   error: string | null;
// }

// // Actions
// type CartAction =
//   | { type: "SET_LOADING"; payload: boolean }
//   | { type: "SET_ERROR"; payload: string | null }
//   | { type: "SET_CART"; payload: Cart }
//   | { type: "ADD_ITEM"; payload: CartItem }
//   | { type: "UPDATE_ITEM"; payload: { id: string; quantity: number } }
//   | { type: "REMOVE_ITEM"; payload: string }
//   | { type: "CLEAR_CART" }
//   | { type: "SET_ITEM_COUNT"; payload: number };

// // Initial state
// const initialState: CartState = {
//   cart: {
//     id: null,
//     items: [],
//     totalAmount: 0,
//     itemCount: 0,
//   },
//   loading: false,
//   error: null,
// };

// // Reducer
// const cartReducer = (state: CartState, action: CartAction): CartState => {
//   switch (action.type) {
//     case "SET_LOADING":
//       return { ...state, loading: action.payload };

//     case "SET_ERROR":
//       return { ...state, error: action.payload, loading: false };

//     case "SET_CART":
//       return { ...state, cart: action.payload, loading: false, error: null };

//     case "ADD_ITEM": {
//       const existingItemIndex = state.cart.items.findIndex(
//         (item) => item.productId === action.payload.productId
//       );

//       let newItems: CartItem[];
//       if (existingItemIndex > -1) {
//         // Update existing item quantity
//         newItems = state.cart.items.map((item, index) =>
//           index === existingItemIndex
//             ? { ...item, quantity: item.quantity + action.payload.quantity }
//             : item
//         );
//       } else {
//         // Add new item
//         newItems = [...state.cart.items, action.payload];
//       }

//       const newCart = {
//         ...state.cart,
//         items: newItems,
//         itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
//         totalAmount: newItems.reduce(
//           (sum, item) => sum + item.quantity * item.product.price,
//           0
//         ),
//       };

//       return { ...state, cart: newCart };
//     }

//     case "UPDATE_ITEM": {
//       const newItems = state.cart.items.map((item) =>
//         item.id === action.payload.id
//           ? { ...item, quantity: action.payload.quantity }
//           : item
//       );

//       const newCart = {
//         ...state.cart,
//         items: newItems,
//         itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
//         totalAmount: newItems.reduce(
//           (sum, item) => sum + item.quantity * item.product.price,
//           0
//         ),
//       };

//       return { ...state, cart: newCart };
//     }

//     case "REMOVE_ITEM": {
//       const newItems = state.cart.items.filter(
//         (item) => item.id !== action.payload
//       );

//       const newCart = {
//         ...state.cart,
//         items: newItems,
//         itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
//         totalAmount: newItems.reduce(
//           (sum, item) => sum + item.quantity * item.product.price,
//           0
//         ),
//       };

//       return { ...state, cart: newCart };
//     }

//     case "CLEAR_CART":
//       return {
//         ...state,
//         cart: {
//           ...state.cart,
//           items: [],
//           totalAmount: 0,
//           itemCount: 0,
//         },
//       };

//     case "SET_ITEM_COUNT":
//       return {
//         ...state,
//         cart: {
//           ...state.cart,
//           itemCount: action.payload,
//         },
//       };

//     default:
//       return state;
//   }
// };

// // Context
// interface CartContextType {
//   state: CartState;
//   addToCart: (productId: string, quantity?: number) => Promise<void>;
//   updateCartItem: (itemId: string, quantity: number) => Promise<void>;
//   removeFromCart: (itemId: string) => Promise<void>;
//   clearCart: () => Promise<void>;
//   getCart: () => Promise<void>;
//   getCartCount: () => Promise<void>;
//   refreshCart: () => Promise<void>;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// // Provider component
// interface CartProviderProps {
//   children: ReactNode;
// }

// export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   // Generate or get session ID for guest users
//   const getSessionId = () => {
//     let sessionId = localStorage.getItem("cart-session-id");
//     if (!sessionId) {
//       sessionId = `session_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;
//       localStorage.setItem("cart-session-id", sessionId);
//     }
//     return sessionId;
//   };

//   // Load cart on mount
//   useEffect(() => {
//     getCart();
//   }, []);

//   const addToCart = async (productId: string, quantity: number = 1) => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "SET_ERROR", payload: null });

//       const sessionId = getSessionId();
//       const result = await cartService.addToCart(
//         productId,
//         quantity,
//         sessionId
//       );

//       if (result.success) {
//         dispatch({ type: "SET_CART", payload: result.data });
//       } else {
//         dispatch({
//           type: "SET_ERROR",
//           payload: result.message || "Failed to add item to cart",
//         });
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       dispatch({ type: "SET_ERROR", payload: "Failed to add item to cart" });
//     }
//   };

//   const updateCartItem = async (itemId: string, quantity: number) => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "SET_ERROR", payload: null });

//       const sessionId = getSessionId();
//       const result = await cartService.updateCartItem(
//         itemId,
//         quantity,
//         sessionId
//       );

//       if (result.success) {
//         dispatch({ type: "SET_CART", payload: result.data });
//       } else {
//         dispatch({
//           type: "SET_ERROR",
//           payload: result.message || "Failed to update cart item",
//         });
//       }
//     } catch (error) {
//       console.error("Error updating cart item:", error);
//       dispatch({ type: "SET_ERROR", payload: "Failed to update cart item" });
//     }
//   };

//   const removeFromCart = async (itemId: string) => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "SET_ERROR", payload: null });

//       const sessionId = getSessionId();
//       const result = await cartService.removeFromCart(itemId, sessionId);

//       if (result.success) {
//         dispatch({ type: "SET_CART", payload: result.data });
//       } else {
//         dispatch({
//           type: "SET_ERROR",
//           payload: result.message || "Failed to remove item from cart",
//         });
//       }
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//       dispatch({
//         type: "SET_ERROR",
//         payload: "Failed to remove item from cart",
//       });
//     }
//   };

//   const clearCart = async () => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "SET_ERROR", payload: null });

//       const sessionId = getSessionId();
//       const result = await cartService.clearCart(sessionId);

//       if (result.success) {
//         dispatch({ type: "SET_CART", payload: result.data });
//       } else {
//         dispatch({
//           type: "SET_ERROR",
//           payload: result.message || "Failed to clear cart",
//         });
//       }
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//       dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" });
//     }
//   };

//   const getCart = async () => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "SET_ERROR", payload: null });

//       const sessionId = getSessionId();
//       const result = await cartService.getCart(sessionId);

//       if (result.success) {
//         dispatch({ type: "SET_CART", payload: result.data });
//       } else {
//         dispatch({
//           type: "SET_ERROR",
//           payload: result.message || "Failed to load cart",
//         });
//       }
//     } catch (error) {
//       console.error("Error getting cart:", error);
//       dispatch({ type: "SET_ERROR", payload: "Failed to load cart" });
//     }
//   };

//   const getCartCount = async () => {
//     try {
//       const sessionId = getSessionId();
//       const result = await cartService.getCartCount(sessionId);

//       if (result.success) {
//         dispatch({ type: "SET_ITEM_COUNT", payload: result.data.count });
//       }
//     } catch (error) {
//       console.error("Error getting cart count:", error);
//     }
//   };

//   const refreshCart = async () => {
//     await getCart();
//   };

//   const value: CartContextType = {
//     state,
//     addToCart,
//     updateCartItem,
//     removeFromCart,
//     clearCart,
//     getCart,
//     getCartCount,
//     refreshCart,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// // Hook to use cart context
// export const useCart = (): CartContextType => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };

// export default CartContext;
