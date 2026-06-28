import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);

// User Management
router.get("/users", adminController.getUsers);
router.patch("/users/:id/status", adminController.updateUserStatus);

// Product Management
router.get("/products", adminController.getProducts);
router.patch("/products/:id/active", adminController.updateProductStatus);

// Order Management
router.get("/orders", adminController.getOrders);
router.patch("/orders/:id/status", adminController.updateOrderStatus);

// System Notifications
router.post("/notifications/broadcast", adminController.broadcastNotification);

export default router;
