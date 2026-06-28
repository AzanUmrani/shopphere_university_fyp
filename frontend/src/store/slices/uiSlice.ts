import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark" | "auto";
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchModalOpen: boolean;
  cartDrawerOpen: boolean;
  wishlistDrawerOpen: boolean;
  filterDrawerOpen: boolean;
  quickViewProduct: string | null;
  notifications: Notification[];
  isLoading: boolean;
  loadingMessage: string;
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  createdAt: string;
}

const initialState: UIState = {
  theme:
    (localStorage.getItem("theme") as "light" | "dark" | "auto") || "light",
  sidebarOpen: true,
  mobileMenuOpen: false,
  searchModalOpen: false,
  cartDrawerOpen: false,
  wishlistDrawerOpen: false,
  filterDrawerOpen: false,
  quickViewProduct: null,
  notifications: [],
  isLoading: false,
  loadingMessage: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "auto">) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
    },
    setSearchModalOpen: (state, action: PayloadAction<boolean>) => {
      state.searchModalOpen = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.cartDrawerOpen = action.payload;
    },
    toggleWishlistDrawer: (state) => {
      state.wishlistDrawerOpen = !state.wishlistDrawerOpen;
    },
    setWishlistDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.wishlistDrawerOpen = action.payload;
    },
    toggleFilterDrawer: (state) => {
      state.filterDrawerOpen = !state.filterDrawerOpen;
    },
    setFilterDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.filterDrawerOpen = action.payload;
    },
    setQuickViewProduct: (state, action: PayloadAction<string | null>) => {
      state.quickViewProduct = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "createdAt">>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (
      state,
      action: PayloadAction<{ isLoading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || "";
    },
    closeAllDrawers: (state) => {
      state.mobileMenuOpen = false;
      state.searchModalOpen = false;
      state.cartDrawerOpen = false;
      state.wishlistDrawerOpen = false;
      state.filterDrawerOpen = false;
      state.quickViewProduct = null;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearchModal,
  setSearchModalOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  toggleWishlistDrawer,
  setWishlistDrawerOpen,
  toggleFilterDrawer,
  setFilterDrawerOpen,
  setQuickViewProduct,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  closeAllDrawers,
} = uiSlice.actions;

export default uiSlice.reducer;
