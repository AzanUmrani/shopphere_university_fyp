import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector(selector);

// Pre-typed selectors for common use cases
export const useAuth = () => useAppSelector((state) => state.auth);
export const useCart = () => useAppSelector((state) => state.cart);
export const useProducts = () => useAppSelector((state) => state.products);
export const useWishlist = () => useAppSelector((state) => state.wishlist);
export const useOrders = () => useAppSelector((state) => state.orders);
export const useUI = () => useAppSelector((state) => state.ui);
