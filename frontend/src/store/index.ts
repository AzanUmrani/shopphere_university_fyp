import { configureStore } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";
import uiReducer from "./slices/uiSlice";
import creatorReducer from "./slices/creatorSlice";
import creatorOnboardingReducer from "../store/slices/creatorOnboardingSlice";
import themeReducer from "../store/slices/themeSlice"
import toastReducer from "../store/slices/toastSlice"
import socketReducer from './slices/socketSlice';
import { socketMiddleware } from '../store/middleware/socketMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    ui: uiReducer,
    creator: creatorReducer,
    creatorOnboarding: creatorOnboardingReducer,
    theme: themeReducer,
    toast: toastReducer,
    socket: socketReducer,
    
    
  },
middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(socketMiddleware as Middleware), 

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
