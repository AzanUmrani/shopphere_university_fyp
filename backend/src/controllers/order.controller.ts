import { Request, Response } from "express";
import { Op } from "sequelize";
import { User, Product, ProductImage, Order, OrderItem } from "@/models";
import logger from "@/config/logger";

interface AuthRequest extends Request {
  user?: any;
}

// Create a new order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus = "pending",
      notes,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // Calculate totals and validate products
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid item data",
        });
      }

      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });
    }

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      totalAmount: totalAmount,
      status: "pending",
      paymentStatus,
      paymentMethod,
      shippingAddress: JSON.stringify(shippingAddress),
      notes,
    });

    // Create order items and update product stock
    for (const item of validatedItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      });

      // Update product stock
      await Product.decrement("stockQuantity", {
        by: item.quantity,
        where: { id: item.productId },
      });
    }

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "images"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: completeOrder,
    });
  } catch (error) {
    logger.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get user's orders
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = { userId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "images", "price"],
            },
          ],
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
          total: count,
          page: Number(page),
          pages: Math.ceil(count / Number(limit)),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching user orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "description", "images", "price"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order or is admin
    if (order.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    logger.error("Error fetching order:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const { status, paymentStatus, trackingNumber, notes } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check permissions
    const canUpdate =
      req.user.role === "admin" ||
      req.user.role === "creator" ||
      order.userId === req.user.id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Update allowed fields
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes !== undefined) updateData.notes = notes;

    await order.update(updateData);

    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "images"],
            },
          ],
        },
      ],
    });

    return res.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    logger.error("Error updating order:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Cancel order
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (order.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Check if order can be cancelled
    if (
      order.status === "cancelled" ||
      order.status === "delivered" ||
      order.status === "shipped"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    // Update order status
    await order.update({
      status: "cancelled",
      notes: reason ? `Cancelled: ${reason}` : "Cancelled by user",
    });

    // Restore product stock
    if (order.items) {
      for (const item of order.items) {
        await Product.increment("stockQuantity", {
          by: item.quantity,
          where: { id: item.productId },
        });
      }
    }

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    logger.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get creator's orders (for creator dashboard)
export const getCreatorOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Get orders that contain products from this creator
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "items",
          required: true,
          include: [
            {
              model: Product,
              as: "product",
              where: { creatorId: req.user.id },
              attributes: ["id", "name", "price", "sku"],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["id", "imageUrl", "altText", "isPrimary"],
                  where: { isPrimary: true },
                  required: false,
                  separate: true,
                  limit: 1,
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
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
          total: count,
          page: Number(page),
          pages: Math.ceil(count / Number(limit)),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching creator orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching creator orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get order statistics
export const getOrderStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    let whereClause: any = {};

    // If creator, only show stats for their products
    if (req.user.role === "creator") {
      // This would need a more complex query to get orders containing creator's products
      // For now, we'll return basic stats
    } else if (req.user.role !== "admin") {
      // Regular user can only see their own order stats
      whereClause.userId = req.user.id;
    }

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      Order.count({ where: whereClause }),
      Order.count({ where: { ...whereClause, status: "pending" } }),
      Order.count({ where: { ...whereClause, status: "completed" } }),
      Order.count({ where: { ...whereClause, status: "cancelled" } }),
      Order.sum("totalAmount", {
        where: { ...whereClause, status: "completed" },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: totalRevenue || 0,
      },
    });
  } catch (error) {
    logger.error("Error fetching order stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
