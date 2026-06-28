import { Router } from "express";
import * as notificationController from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// Get user notifications
router.get("/", notificationController.getUserNotifications);

// Get notifications by type
router.get("/type/:type", notificationController.getNotificationsByType);

// Get unread notification count
router.get("/count/unread", notificationController.getUnreadCount);

// Mark notification as read
router.patch("/:id/read", notificationController.markNotificationAsRead);

// Mark all notifications as read
router.patch("/read-all", notificationController.markAllNotificationsAsRead);

// Delete specific notification
router.delete("/:id", notificationController.deleteNotification);

// Delete all read notifications
router.delete("/read-all", notificationController.deleteAllReadNotifications);

// Admin/System route for creating notifications
router.post("/", notificationController.createNotification);

export default router;
