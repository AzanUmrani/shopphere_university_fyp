const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Upload response types
interface UploadResponse {
  avatarUrl?: string;
  imageUrl?: string;
  filename: string;
  originalName: string;
  size: number;
  url?: string;
  path?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Include status code in error message for better error handling
        const errorMessage =
          data.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        throw error;
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Generic CRUD operations
  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: "GET" });
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: "DELETE" });
  }

  // File upload
  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();

    const config: RequestInit = {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("Upload request failed:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export type { ApiResponse };

// Authentication API methods
export const authAPI = {
  // Register new user
  register: (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => apiService.post("/auth/register", userData),

  // Login user
  login: (credentials: { email: string; password: string }) =>
    apiService.post("/auth/login", credentials),

  // Logout user
  logout: () => apiService.post("/auth/logout", {}),

  // Forgot password
  forgotPassword: (email: string) =>
    apiService.post("/auth/forgot-password", { email }),

  // Reset password
  resetPassword: (token: string, password: string, confirmPassword: string) =>
    apiService.post("/auth/reset-password", {
      token,
      password,
      confirmPassword,
    }),

  // Refresh token
  refreshToken: () => apiService.post("/auth/refresh", {}),

  // Get current user profile
  getProfile: () => apiService.get("/auth/profile"),

  // Update user profile
  updateProfile: (profileData: any) =>
    apiService.put("/auth/profile", profileData),

  // Change password
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) =>
    apiService.put("/auth/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    }),
};

// User API methods
export const userAPI = {
  // Get user by ID
  getUserById: (id: string) => apiService.get(`/users/${id}`),

  // Update user
  updateUser: (id: string, userData: any) =>
    apiService.put(`/users/${id}`, userData),

  // Delete user account
  deleteUser: (id: string) => apiService.delete(`/users/${id}`),

  // Get user addresses
  getAddresses: () => apiService.get("/users/addresses"),

  // Add address
  addAddress: (addressData: any) =>
    apiService.post("/users/addresses", addressData),

  // Update address
  updateAddress: (id: string, addressData: any) =>
    apiService.put(`/users/addresses/${id}`, addressData),

  // Delete address
  deleteAddress: (id: string) => apiService.delete(`/users/addresses/${id}`),
};

// Wishlist API methods
export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: () => apiService.get("/wishlist"),

  // Add product to wishlist
  addToWishlist: (productId: string) =>
    apiService.post("/wishlist", { productId }),

  // Remove product from wishlist
  removeFromWishlist: (productId: string) =>
    apiService.delete(`/wishlist/${productId}`),

  // Check if product is in wishlist
  checkWishlistStatus: (productId: string) =>
    apiService.get(`/wishlist/check/${productId}`),

  // Get wishlist count
  getWishlistCount: () => apiService.get("/wishlist/count"),

  // Clear entire wishlist
  clearWishlist: () => apiService.delete("/wishlist"),
};

// Notification API methods
export const notificationAPI = {
  // Get user notifications
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    read?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(
      `/notifications${queryString ? `?${queryString}` : ""}`,
    );
  },

  // Mark notification as read
  markAsRead: (id: string) => apiService.put(`/notifications/${id}/read`, {}),

  // Mark all notifications as read
  markAllAsRead: () => apiService.put("/notifications/read-all", {}),

  // Delete notification
  deleteNotification: (id: string) => apiService.delete(`/notifications/${id}`),

  // Get unread count
  getUnreadCount: () => apiService.get("/notifications/unread-count"),

  // Get notifications by type
  getNotificationsByType: (
    type: string,
    params?: { page?: number; limit?: number },
  ) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(
      `/notifications/type/${type}${queryString ? `?${queryString}` : ""}`,
    );
  },
};

// Payment API methods
export const paymentAPI = {
  // Create payment intent
  createPaymentIntent: (orderId: string, currency?: string) =>
    apiService.post("/payments/create-intent", { orderId, currency }),

  // Confirm payment
  confirmPayment: (paymentIntentId: string) =>
    apiService.post("/payments/confirm", { paymentIntentId }),

  // Get payment methods
  getPaymentMethods: () => apiService.get("/payments/methods"),

  // Add payment method
  addPaymentMethod: (paymentMethodData: {
    type: string;
    stripePaymentMethodId: string;
    isDefault?: boolean;
  }) => apiService.post("/payments/methods", paymentMethodData),

  // Request refund
  requestRefund: (orderId: string, amount?: number, reason?: string) =>
    apiService.post("/payments/refund", { orderId, amount, reason }),
};

// Admin API methods
export const adminAPI = {
  // Dashboard stats
  getDashboardStats: () => apiService.get("/admin/dashboard/stats"),

  // User management
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(
      `/admin/users${queryString ? `?${queryString}` : ""}`,
    );
  },

  updateUserStatus: (id: string, isActive: boolean) =>
    apiService.put(`/admin/users/${id}/status`, { isActive }),

  // Product management
  getAdminProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(
      `/admin/products${queryString ? `?${queryString}` : ""}`,
    );
  },

  updateProductStatus: (id: string, isActive: boolean) =>
    apiService.put(`/admin/products/${id}/active`, { isActive }),

  // Order management
  getAdminOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(
      `/admin/orders${queryString ? `?${queryString}` : ""}`,
    );
  },

  updateOrderStatus: (id: string, status: string) =>
    apiService.put(`/admin/orders/${id}/status`, { status }),

  // System notifications
  broadcastNotification: (notificationData: {
    title: string;
    message: string;
    type?: string;
    userRole?: string;
  }) => apiService.post("/admin/notifications/broadcast", notificationData),
};

// Creator API methods
export const creatorAPI = {
  // Apply to become a creator
  applyToBeCreator: (applicationData: any) =>
    apiService.post("/creators/apply", applicationData),

  // Get creator status (checks if user is creator and syncs role)
  getCreatorStatus: () => apiService.get("/creators/status"),

  // Get creator profile
  getProfile: () => apiService.get("/creators/profile"),

  // Update creator profile
  updateProfile: (profileData: any) =>
    apiService.put("/creators/profile", profileData),

  // Get creator stats
  getStats: () => apiService.get("/creators/stats"),

  // Get creator by ID (public)
  getCreatorById: (id: string) => apiService.get(`/creators/${id}`),
};

// Creator Onboarding API methods
export const onboardingAPI = {
  // Get all onboarding data
  getOnboardingData: () => apiService.get("/onboarding/data"),

  // Save Step 1: Personal Information
  saveStep1: (data: any) => apiService.post("/onboarding/step-1", data),

  // Save Step 2: Shop Information
  saveStep2: (data: any) => apiService.post("/onboarding/step-2", data),

  // Save Step 3: Business Information
  saveStep3: (data: any) => apiService.post("/onboarding/step-3", data),

  // Save Step 4: Payment Information
  saveStep4: (data: any) => apiService.post("/onboarding/step-4", data),

  // Save Step 5: Plan Information
  saveStep5: (data: any) => apiService.post("/onboarding/step-5", data),

  // Complete onboarding and create creator profile
  completeOnboarding: () => apiService.post("/onboarding/complete", {}),

  // Clear onboarding data
  clearOnboardingData: () => apiService.delete("/onboarding/data"),
};

// Product API methods for creators
export const creatorProductAPI = {
  // Get creator's products
  getMyProducts: () => apiService.get("/products/creator/my-products"),

  // Create product
  createProduct: (productData: any) =>
    apiService.post("/products", productData),

  // Update product
  updateProduct: (id: string, productData: any) =>
    apiService.put(`/products/${id}`, productData),

  // Delete product
  deleteProduct: (id: string) => apiService.delete(`/products/${id}`),

  // Get all products with filters
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(`/products${queryString ? `?${queryString}` : ""}`);
  },

  // Get product by ID
  getProduct: (id: string) => apiService.get(`/products/${id}`),
};

// Order API methods for creators
export const creatorOrderAPI = {
  // Get creator's orders
  getCreatorOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(
      `/orders/creator${queryString ? `?${queryString}` : ""}`,
    );
  },

  // Get order statistics
  getOrderStats: () => apiService.get("/orders/stats"),

  // Get order by ID
  getOrder: (id: string) => apiService.get(`/orders/${id}`),

  // Update order status
  updateOrderStatus: (id: string, status: string) =>
    apiService.put(`/orders/${id}/status`, { status }),

  // Cancel order
  cancelOrder: (id: string, reason?: string) =>
    apiService.put(`/orders/${id}/cancel`, { reason }),
};

// Upload API methods
export const uploadAPI = {
  // Upload single image
  uploadSingle: (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiService.upload("/upload/single", formData);
  },

  // Upload product images
  uploadProductImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiService.upload("/upload/products", formData);
  },

  // Upload creator assets
  uploadCreatorAssets: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiService.upload("/upload/creator-assets", formData);
  },

  // Upload avatar
  uploadAvatar: (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiService.upload("/upload/avatar", formData);
  },

  // Delete uploaded file
  deleteFile: (filename: string) => apiService.delete(`/upload/${filename}`),
};

// Product API methods for public use
export const productAPI = {
  // Get all products with filters
  getAllProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
    isNew?: boolean;
    isFeatured?: boolean;
    inStock?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(`/products${queryString ? `?${queryString}` : ""}`);
  },

  // Get product by ID
  getProductById: (id: string) => apiService.get(`/products/${id}`),

  // Search products
  searchProducts: (
    query: string,
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    },
  ) => {
    const queryParams = new URLSearchParams({ search: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(`/products?${queryString}`);
  },
};

// Cart API methods
export const cartAPI = {
  // Get user's cart
  getCart: () => apiService.get("/cart"),

  // Add item to cart
  addToCart: (productId: string, quantity: number = 1, variantId?: string) =>
    apiService.post("/cart/items", { productId, quantity, variantId }),

  // Update cart item quantity
  updateCartItem: (itemId: string, quantity: number) =>
    apiService.put(`/cart/items/${itemId}`, { quantity }),

  // Remove item from cart
  removeFromCart: (itemId: string) =>
    apiService.delete(`/cart/items/${itemId}`),

  // Clear entire cart
  clearCart: () => apiService.delete("/cart"),
};

// Order API methods
export const orderAPI = {
  // Get user's orders
  getOrders: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiService.get(`/orders${queryString ? `?${queryString}` : ""}`);
  },

  // Get order by ID
  getOrderById: (id: string) => apiService.get(`/orders/${id}`),

  // Create new order
  createOrder: (orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      variantId?: string;
    }>;
    shippingAddressId: string;
    billingAddressId: string;
    paymentMethodId: string;
    notes?: string;
  }) => apiService.post("/orders", orderData),

  // Cancel order
  cancelOrder: (orderId: string, reason?: string) =>
    apiService.post(`/orders/${orderId}/cancel`, { reason }),
};

// Category API methods
export const categoryAPI = {
  getCategories: () => apiService.get("/categories"),

  getCategoryById: (id: string) => apiService.get(`/categories/${id}`),

  createCategory: (categoryData: any) =>
    apiService.post("/categories", categoryData),

  updateCategory: (id: string, categoryData: any) =>
    apiService.put(`/categories/${id}`, categoryData),

  deleteCategory: (id: string) => apiService.delete(`/categories/${id}`),
};
