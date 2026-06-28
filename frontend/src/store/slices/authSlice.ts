import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // New flag to track if auth has been initialized
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false, // Start as false
  error: null,
  token: localStorage.getItem("authToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isInitialized = true;
      state.error = null;
    },
    setAuthInitialized: (state) => {
      state.isInitialized = true;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem("authToken", action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      localStorage.removeItem("authToken");
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem("authToken", action.payload.token);
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      localStorage.removeItem("authToken");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("authToken");
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  initializeAuth,
  setAuthInitialized,
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
