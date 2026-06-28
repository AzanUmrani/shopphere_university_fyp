import { Request, Response } from "express";
import { User, Product, Order, Category, Notification } from "../models";
import { AuthenticatedRequest } from "../types";
import { Op } from "sequelize";

// Dashboard Analytics
export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Get basic counts
    const [userCount, productCount, orderCount, categoryCount] =
      await Promise.all([
        User.count({ where: { role: { [Op.ne]: "admin" } } }),
        Product.count(),
        Order.count(),
        Category.count(),
      ]);

    // Get recent stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentUsers, recentOrders, recentProducts] = await Promise.all([
      User.count({
        where: {
          createdAt: { [Op.gte]: thirtyDaysAgo },
          role: { [Op.ne]: "admin" },
        },
      }),
      Order.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
      Product.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
    ]);

    // Get revenue (sum of completed orders)
    const totalRevenue =
      (await Order.sum("totalAmount", {
        where: { status: "completed" },
      })) || 0;

    const recentRevenue =
      (await Order.sum("totalAmount", {
        where: {
          status: "completed",
          createdAt: { [Op.gte]: thirtyDaysAgo },
        },
      })) || 0;

    return res.json({
      success: true,
      data: {
        totals: {
          users: userCount,
          products: productCount,
          orders: orderCount,
          categories: categoryCount,
          revenue: totalRevenue,
        },
        recent: {
          users: recentUsers,
          products: recentProducts,
          orders: recentOrders,
          revenue: recentRevenue,
        },
      },
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// User Management
export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {
      role: { [Op.ne]: "admin" }, // Exclude other admins
    };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (role && role !== "all") {
      whereClause.role = role;
    }

    const { rows: users, count } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    return res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot modify admin users",
      });
    }

    await user.update({ isActive });

    return res.json({
      success: true,
      message: "User status updated successfully",
      data: { id, isActive },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Product Management
export const getProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (isActive !== undefined && isActive !== "all") {
      whereClause.isActive = isActive === "true";
    }

    const { rows: products, count } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    return res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error getting products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProductStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value",
      });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({ isActive });

    return res.json({
      success: true,
      message: "Product status updated successfully",
      data: { id, isActive },
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Order Management
export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (status && status !== "all") {
      whereClause.status = status;
    }

    if (search) {
      whereClause.id = { [Op.like]: `%${search}%` };
    }

    const { rows: orders, count } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    return res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.update({ status });

    // Create notification for user
    await Notification.create({
      userId: order.userId,
      type: "order_update",
      title: "Order Status Updated",
      message: `Your order #${order.id} status has been updated to ${status}`,
      data: { orderId: order.id, status },
      isRead: false,
    });

    return res.json({
      success: true,
      message: "Order status updated successfully",
      data: { id, status },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// System Notifications
export const broadcastNotification = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { title, message, type = "system", userRole } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    // Get users to notify
    const whereClause: any = {
      role: { [Op.ne]: "admin" },
    };

    if (userRole && userRole !== "all") {
      whereClause.role = userRole;
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ["id"],
    });

    // Create notifications for all users
    const notifications = users.map((user) => ({
      userId: user.id,
      type,
      title,
      message,
      isRead: false,
    }));

    await Notification.bulkCreate(notifications);

    return res.json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      data: { recipients: users.length },
    });
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
