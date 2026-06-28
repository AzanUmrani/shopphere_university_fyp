import { Router } from "express";
import * as wishlistController from "../controllers/wishlist.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

// Add to wishlist
router.post("/", wishlistController.addToWishlist);

// Remove from wishlist
router.delete("/:productId", wishlistController.removeFromWishlist);

// Get user's wishlist
router.get("/", wishlistController.getUserWishlist);

// Check if product is in wishlist
router.get("/check/:productId", wishlistController.checkWishlistStatus);

// Get wishlist count
router.get("/count", wishlistController.getWishlistCount);

// Clear entire wishlist
router.delete("/", wishlistController.clearWishlist);

export default router;
