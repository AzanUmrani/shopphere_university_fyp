import { Router } from "express";
import { optionalAuth, requireAuth } from "@/middleware/auth";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCreatorProducts,
} from "@/controllers/product.controller";

const router = Router();

// Public routes
router.get("/", optionalAuth, getProducts);
router.get("/:id", optionalAuth, getProductById);

// Creator routes (require authentication)
router.post("/", requireAuth, createProduct);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);
router.get("/creator/my-products", requireAuth, getCreatorProducts);

export default router;
