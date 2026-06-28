import { useEffect } from "react";
import { useAppDispatch } from "./redux";
import {
  initializeAuth,
  logout,
  updateUser,
  setAuthInitialized,
} from "../store/slices/authSlice";
import { fetchCart } from "../store/slices/cartSlice";
import { checkCreatorStatus } from "../store/slices/creatorSlice";
import { authService } from "../services/auth";

export const useAuthInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuthentication = async () => {
      const token = authService.getToken();
      let hasResolvedAuthState = false;

      console.log("[Auth Init] Starting authentication initialization...");
      console.log("[Auth Init] Token found:", token ? "Yes" : "No");

      if (token) {
        try {
          console.log("[Auth Init] Validating token...");
          // Validate token by fetching user profile
          const response = await authService.validateToken();

          if (response.success && response.data?.user) {
            console.log(
              "[Auth Init] Token valid, user:",
              response.data.user.email,
            );
            // Token is valid, initialize auth state
            dispatch(
              initializeAuth({
                user: response.data.user,
                token: token,
              }),
            );
            hasResolvedAuthState = true;

            // Check if user is a creator and sync their role
            try {
              const creatorStatus: any =
                await dispatch(checkCreatorStatus()).unwrap();
              if (creatorStatus.isCreator && creatorStatus.role === "creator") {
                console.log("[Auth Init] User is a creator, updating role");
                dispatch(updateUser({ role: "creator" }));
              }
            } catch (error) {
              // Silently fail - user can still use the app even if creator status check fails
              console.log("[Auth Init] Creator status check skipped:", error);
            }
          } else {
            // Token validation returned unsuccessful response - clear it
            console.warn(
              "[Auth Init] Token validation unsuccessful - logging out",
            );
            dispatch(logout());
            hasResolvedAuthState = true;
          }
        } catch (error: any) {
          // Check if it's an authentication error (401)
          const errorMessage = error.message || "";
          const statusCode = error.status || 0;
          const isAuthError =
            statusCode === 401 ||
            errorMessage.includes("Invalid token") ||
            errorMessage.includes("Authentication required") ||
            errorMessage.includes("Access denied") ||
            errorMessage.includes("Unauthorized");

          if (isAuthError) {
            console.error(
              "[Auth Init] Authentication failed - clearing session:",
              errorMessage,
            );
            dispatch(logout());
            hasResolvedAuthState = true;
          } else {
            // Network or server error - log but don't clear session
            console.warn(
              "[Auth Init] Failed to validate token (network/server error):",
              errorMessage,
            );
            console.warn(
              "[Auth Init] Keeping session active - will retry on next request",
            );
          }
        }
      } else {
        console.log("[Auth Init] No token found, user not authenticated");
        dispatch(setAuthInitialized());
        hasResolvedAuthState = true;
      }

      if (!hasResolvedAuthState) {
        dispatch(setAuthInitialized());
      }

      // Initialize cart after auth is settled (small delay to avoid race conditions)
      setTimeout(() => {
        dispatch(fetchCart());
      }, 100);
    };

    initializeAuthentication();
  }, [dispatch]);
};
