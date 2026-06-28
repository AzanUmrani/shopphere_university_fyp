import { Request, Response } from "express";
import { Notification } from "../models";
import { AuthenticatedRequest } from "../types";
import { Op } from "sequelize";

export const getUserNotifications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20, unread = false } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = { userId };

    if (unread === "true") {
      whereClause.isRead = false;
    }

    const { rows: notifications, count } = await Notification.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    return res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const markNotificationAsRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const markAllNotificationsAsRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Notification.update(
      {
        isRead: true,
        readAt: new Date(),
      },
      {
        where: {
          userId,
          isRead: false,
        },
      }
    );

    return res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Notification.destroy({
      where: { id, userId },
    });

    if (result === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUnreadCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const count = await Notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, type, title, message, data } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        message: "userId, type, title, and message are required",
      });
    }

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data: data || null,
      isRead: false,
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotificationsByType = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { type } = req.params;
    const userId = req.user?.id;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: notifications, count } = await Notification.findAndCountAll({
      where: { userId, type },
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    return res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notifications by type:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAllReadNotifications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedCount = await Notification.destroy({
      where: {
        userId,
        isRead: false,
      },
    });

    return res.json({
      success: true,
      message: `${deletedCount} read notifications deleted successfully`,
      deletedCount,
    });
  } catch (error) {
    console.error("Error deleting read notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
