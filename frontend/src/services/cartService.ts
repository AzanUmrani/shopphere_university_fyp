import type { Cart, ApiResponse, CartCountResponse } from "../types/cart";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

class CartService {
  private getHeaders(sessionId?: string, token?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (sessionId && !token) {
      headers["x-session-id"] = sessionId;
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("auth-token");
  }

  async getCart(sessionId?: string): Promise<ApiResponse<Cart>> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "GET",
        headers: this.getHeaders(sessionId, token || undefined),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting cart:", error);
      return {
        success: false,
        data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
        message: "Failed to get cart",
      };
    }
  }

  async addToCart(
    productId: string,
    quantity: number = 1,
    sessionId?: string
  ): Promise<ApiResponse<Cart>> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        headers: this.getHeaders(sessionId, token || undefined),
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding to cart:", error);
      return {
        success: false,
        data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
        message: "Failed to add item to cart",
      };
    }
  }

  async updateCartItem(
    itemId: string,
    quantity: number,
    sessionId?: string
  ): Promise<ApiResponse<Cart>> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: "PUT",
        headers: this.getHeaders(sessionId, token || undefined),
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating cart item:", error);
      return {
        success: false,
        data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
        message: "Failed to update cart item",
      };
    }
  }

  async removeFromCart(
    itemId: string,
    sessionId?: string
  ): Promise<ApiResponse<Cart>> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: "DELETE",
        headers: this.getHeaders(sessionId, token || undefined),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error removing from cart:", error);
      return {
        success: false,
        data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
        message: "Failed to remove item from cart",
      };
    }
  }

  async clearCart(sessionId?: string): Promise<ApiResponse<Cart>> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: this.getHeaders(sessionId, token || undefined),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error clearing cart:", error);
      return {
        success: false,
        data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
        message: "Failed to clear cart",
      };
    }
  }

  async getCartCount(
    sessionId?: string
  ): Promise<ApiResponse<CartCountResponse>> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/cart/count`, {
        method: "GET",
        headers: this.getHeaders(sessionId, token || undefined),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting cart count:", error);
      return {
        success: false,
        data: { count: 0 },
        message: "Failed to get cart count",
      };
    }
  }

  async mergeGuestCart(sessionId: string): Promise<ApiResponse<Cart>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error("No auth token available");
      }

      const response = await fetch(`${API_BASE_URL}/cart/merge`, {
        method: "POST",
        headers: this.getHeaders(sessionId, token),
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error merging guest cart:", error);
      return {
        success: false,
        data: { id: null, items: [], totalAmount: 0, itemCount: 0 },
        message: "Failed to merge guest cart",
      };
    }
  }
}

export const cartService = new CartService();
export default cartService;
