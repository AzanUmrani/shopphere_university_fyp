import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getCreatorOrders,
  getOrderStats,
} from "@/controllers/order.controller";

const router = Router();

// Create a new order
router.post("/", authenticate, createOrder);

// Get user's orders
router.get("/", authenticate, getUserOrders);

// Get order statistics
router.get("/stats", authenticate, getOrderStats);

// Get creator's orders (for creator dashboard)
router.get("/creator", authenticate, getCreatorOrders);

// Get order by ID
router.get("/:id", authenticate, getOrderById);

// Update order status
router.put("/:id/status", authenticate, updateOrderStatus);

// Cancel order
router.put("/:id/cancel", authenticate, cancelOrder);

export default router;
