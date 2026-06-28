import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Creator,
  CreatorProduct,
  CreatorOrder,
  CreatorEarnings,
  CreatorPayout,
  CreatorNotification,
  CreatorInsight,
  ShippingProfile,
  CreatorCampaign,
} from "../../types/creator";
import {
  creatorAPI,
  creatorProductAPI,
  creatorOrderAPI,
} from "../../services/api";

interface CreatorState {
  profile: Creator | null;
  products: CreatorProduct[];
  orders: CreatorOrder[];
  earnings: CreatorEarnings[];
  payouts: CreatorPayout[];
  notifications: CreatorNotification[];
  insights: CreatorInsight | null;
  shippingProfiles: ShippingProfile[];
  campaigns: CreatorCampaign[];
  dashboardStats: {
    todayRevenue: number;
    todayOrders: number;
    totalProducts: number;
    pendingOrders: number;
    lowStockProducts: number;
    unreadNotifications: number;
  };
  loading: {
    profile: boolean;
    products: boolean;
    orders: boolean;
    earnings: boolean;
    payouts: boolean;
    insights: boolean;
    dashboard: boolean;
  };
  error: string | null;
}

const initialState: CreatorState = {
  profile: null,
  products: [],
  orders: [],
  earnings: [],
  payouts: [],
  notifications: [],
  insights: null,
  shippingProfiles: [],
  campaigns: [],
  dashboardStats: {
    todayRevenue: 0,
    todayOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    unreadNotifications: 0,
  },
  loading: {
    profile: false,
    products: false,
    orders: false,
    earnings: false,
    payouts: false,
    insights: false,
    dashboard: false,
  },
  error: null,
};

// Async thunks for real API calls
export const fetchCreatorProfile = createAsyncThunk(
  "creator/fetchProfile",
  async () => {
    try {
      const response = await creatorAPI.getProfile();
      // Backend returns { success, data: { creatorProfile } }
      const data = response.data as any;
      return (data?.creatorProfile || data) as Creator;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch creator profile");
    }
  },
);

export const applyToBeCreator = createAsyncThunk(
  "creator/applyToBeCreator",
  async (applicationData: any) => {
    try {
      const response = await creatorAPI.applyToBeCreator(applicationData);
      // Response is { success, message, data: { creatorProfile } }
      // Return just the creatorProfile for the state
      return response.data?.creatorProfile || response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to submit creator application");
    }
  },
);

export const checkCreatorStatus = createAsyncThunk(
  "creator/checkStatus",
  async () => {
    try {
      const response = await creatorAPI.getCreatorStatus();
      // Returns { success, message, data: { isCreator, role, creatorProfile? } }
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to check creator status");
    }
  },
);

export const updateCreatorProfile = createAsyncThunk(
  "creator/updateProfile",
  async (profileData: any) => {
    try {
      const response = await creatorAPI.updateProfile(profileData);
      return response.data as Creator;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update creator profile");
    }
  },
);

export const fetchCreatorProducts = createAsyncThunk(
  "creator/fetchProducts",
  async () => {
    try {
      const response = await creatorProductAPI.getMyProducts();
      // Backend returns { success, data: { products, pagination } }
      const data = response.data as any;
      return (
        Array.isArray(data) ? data : data?.products || []
      ) as CreatorProduct[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch creator products");
    }
  },
);

export const createProduct = createAsyncThunk(
  "creator/createProduct",
  async (productData: any) => {
    try {
      const response = await creatorProductAPI.createProduct(productData);
      return response.data as CreatorProduct;
    } catch (error: any) {
      throw new Error(error.message || "Failed to create product");
    }
  },
);

export const updateProduct = createAsyncThunk(
  "creator/updateProduct",
  async ({ id, productData }: { id: string; productData: any }) => {
    try {
      const response = await creatorProductAPI.updateProduct(id, productData);
      return response.data as CreatorProduct;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update product");
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "creator/deleteProduct",
  async (productId: string) => {
    try {
      await creatorProductAPI.deleteProduct(productId);
      return productId;
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete product");
    }
  },
);

export const fetchCreatorOrders = createAsyncThunk(
  "creator/fetchOrders",
  async (params?: { page?: number; limit?: number; status?: string }) => {
    try {
      const response = await creatorOrderAPI.getCreatorOrders(params);
      // Backend returns { success, data: { orders, pagination } }
      const data = response.data as any;
      return (
        Array.isArray(data) ? data : data?.orders || []
      ) as CreatorOrder[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch creator orders");
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "creator/updateOrderStatus",
  async ({ orderId, status }: { orderId: string; status: string }) => {
    try {
      const response = await creatorOrderAPI.updateOrderStatus(orderId, status);
      return { orderId, order: response.data };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update order status");
    }
  },
);

export const fetchDashboardStats = createAsyncThunk(
  "creator/fetchDashboardStats",
  async () => {
    try {
      const response = await creatorAPI.getStats();
      // Backend returns { success, data: { stats } } with different field names
      const data = response.data as any;
      const stats = data?.stats || data || {};
      return {
        todayRevenue: stats.totalEarnings || 0,
        todayOrders: stats.weeklyOrders || stats.totalSales || 0,
        totalProducts: stats.totalProducts || 0,
        pendingOrders: stats.pendingOrders || 0,
        lowStockProducts: stats.outOfStockProducts || 0,
        unreadNotifications: stats.unreadNotifications || 0,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch dashboard stats");
    }
  },
);

export const fetchCreatorEarnings = createAsyncThunk(
  "creator/fetchEarnings",
  async () => {
    // TODO: Implement earnings API endpoint
    // Mock implementation for now
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [] as CreatorEarnings[];
  },
);

const creatorSlice = createSlice({
  name: "creator",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (
      state,
      action: PayloadAction<{
        key: keyof CreatorState["loading"];
        value: boolean;
      }>,
    ) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    addProductLocal: (state, action: PayloadAction<CreatorProduct>) => {
      state.products.push(action.payload);
    },
    updateProductLocal: (state, action: PayloadAction<CreatorProduct>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProductLocal: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    updateOrderStatusLocal: (
      state,
      action: PayloadAction<{ orderId: string; status: string }>,
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.fulfillmentStatus.status = action.payload.status as any;
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload,
      );
      if (notification) {
        notification.isRead = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.isRead = true;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply to be Creator
      .addCase(applyToBeCreator.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(applyToBeCreator.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(applyToBeCreator.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.error.message || "Failed to apply to be creator";
      })

      // Check Creator Status
      .addCase(checkCreatorStatus.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(checkCreatorStatus.fulfilled, (state, action) => {
        state.loading.profile = false;
        if (action.payload.creatorProfile) {
          state.profile = action.payload.creatorProfile;
        }
      })
      .addCase(checkCreatorStatus.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.error.message || "Failed to check creator status";
      })

      // Fetch Profile
      .addCase(fetchCreatorProfile.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(fetchCreatorProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchCreatorProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.error.message || "Failed to fetch profile";
      })

      // Update Profile
      .addCase(updateCreatorProfile.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(updateCreatorProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(updateCreatorProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.error.message || "Failed to update profile";
      })

      // Fetch Products
      .addCase(fetchCreatorProducts.pending, (state) => {
        state.loading.products = true;
        state.error = null;
      })
      .addCase(fetchCreatorProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = action.payload;
      })
      .addCase(fetchCreatorProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading.products = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.error.message || "Failed to create product";
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading.products = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading.products = false;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.error.message || "Failed to update product";
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading.products = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.error.message || "Failed to delete product";
      })

      // Fetch Orders
      .addCase(fetchCreatorOrders.pending, (state) => {
        state.loading.orders = true;
        state.error = null;
      })
      .addCase(fetchCreatorOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload;
      })
      .addCase(fetchCreatorOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error = action.error.message || "Failed to fetch orders";
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order && action.payload.order) {
          Object.assign(order, action.payload.order);
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update order status";
      })

      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.dashboard = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.dashboardStats = action.payload as typeof state.dashboardStats;
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.loading.dashboard = false;
      })

      // Fetch Earnings
      .addCase(fetchCreatorEarnings.pending, (state) => {
        state.loading.earnings = true;
        state.error = null;
      })
      .addCase(fetchCreatorEarnings.fulfilled, (state, action) => {
        state.loading.earnings = false;
        state.earnings = action.payload;
      })
      .addCase(fetchCreatorEarnings.rejected, (state, action) => {
        state.loading.earnings = false;
        state.error = action.error.message || "Failed to fetch earnings";
      });
  },
});

export const {
  clearError,
  setLoading,
  addProductLocal,
  updateProductLocal,
  deleteProductLocal,
  updateOrderStatusLocal,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = creatorSlice.actions;

export default creatorSlice.reducer;
