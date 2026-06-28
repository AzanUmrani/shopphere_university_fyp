import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product, Category, FilterOptions } from "../../types";
import { productAPI, categoryAPI } from "../../services/api";

interface ProductState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  newProducts: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: FilterOptions;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  featuredProducts: [],
  newProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  filters: {
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    tags: [],
    sortBy: "popularity",
    sortOrder: "desc",
  },
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
};

// Async thunks for API integration
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params?: {
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
    try {
      const response = await productAPI.getAllProducts(params);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: string) => {
    try {
      const response = await productAPI.getProductById(productId);
      return (response.data as any)?.product;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch product");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    try {
      const response = await categoryAPI.getCategories();
      return (response.data as any)?.categories || [];
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch categories");
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async ({
    query,
    filters,
  }: {
    query: string;
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    };
  }) => {
    try {
      const response = await productAPI.searchProducts(query, filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to search products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    setNewProducts: (state, action: PayloadAction<Product[]>) => {
      state.newProducts = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{ totalPages: number; totalProducts: number }>
    ) => {
      state.totalPages = action.payload.totalPages;
      state.totalProducts = action.payload.totalProducts;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      if (state.currentProduct?.id === action.payload) {
        state.currentProduct = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload) {
          const data = action.payload as any;
          state.products = data.products || [];
          if (data.pagination) {
            state.totalPages = data.pagination.totalPages || 1;
            state.totalProducts = data.pagination.totalItems || 0;
          }
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.currentProduct = action.payload as Product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch product";
      })

      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.categories = action.payload as Category[];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })

      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload) {
          const data = action.payload as any;
          state.products = data.products || [];
          if (data.pagination) {
            state.totalPages = data.pagination.totalPages || 1;
            state.totalProducts = data.pagination.totalItems || 0;
          }
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to search products";
      });
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setCategories,
  setFeaturedProducts,
  setNewProducts,
  setCurrentProduct,
  setSearchQuery,
  setFilters,
  resetFilters,
  setCurrentPage,
  setPagination,
  addProduct,
  updateProduct,
  removeProduct,
} = productSlice.actions;

export default productSlice.reducer;
