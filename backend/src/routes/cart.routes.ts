import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authenticate, optionalAuth } from "@/middleware/auth";

const router = Router();

// Apply optional authentication to all cart routes
router.use(optionalAuth);

// Get cart (supports both authenticated and guest users)
router.get("/", cartController.getCart);

// Add item to cart (supports both authenticated and guest users)
router.post("/items", cartController.addToCart);

// Update cart item (supports both authenticated and guest users)
router.put("/items/:id", cartController.updateCartItem);

// Remove item from cart (supports both authenticated and guest users)
router.delete("/items/:id", cartController.removeFromCart);

// Clear cart (supports both authenticated and guest users)
router.delete("/", cartController.clearCart);

// Get cart count (supports both authenticated and guest users)
router.get("/count", cartController.getCartCount);

// Merge guest cart with user cart (requires authentication)
router.post("/merge", authenticate, cartController.mergeGuestCart);

export default router;
