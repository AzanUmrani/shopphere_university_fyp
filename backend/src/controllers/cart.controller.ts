import { Request, Response } from "express";
import { Product, User, Cart, CartItem } from "../models";
import { AuthenticatedRequest } from "../types";
import { formatProductsWithImages } from "../utils/imageHelper";
import { Op } from "sequelize";
import logger from "../config/logger";

// Helper function to get or create cart for user
const getOrCreateCart = async (
  userId?: string,
  sessionId?: string
): Promise<Cart> => {
  try {
    let cart: Cart | null = null;

    if (userId) {
      // For authenticated users, find cart by user ID
      cart = await Cart.findOne({
        where: { userId },
      });
    } else if (sessionId) {
      // For guest users, find cart by session ID
      cart = await Cart.findOne({
        where: { sessionId },
      });
    }

    // If no cart found, create new one
    if (!cart) {
      if (!userId && !sessionId) {
        throw new Error("Either userId or sessionId must be provided");
      }

      const cartData: any = {};
      if (userId) cartData.userId = userId;
      if (sessionId) cartData.sessionId = sessionId;

      cart = await Cart.create(cartData);
    }

    return cart;
  } catch (error) {
    logger.error("Error getting or creating cart:", error);
    throw error;
  }
};

// Helper function to calculate cart totals
const calculateCartTotals = (items: any[]) => {
  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { totalAmount, itemCount };
};

// Get cart with all items
export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const sessionId =
      (req.headers["x-session-id"] as string) ||
      (req as any).sessionID ||
      `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (!userId && !sessionId) {
      return res.json({
        success: true,
        data: {
          id: null,
          items: [],
          totalAmount: 0,
          itemCount: 0,
        },
      });
    }

    const cart = await getOrCreateCart(userId, sessionId);

    // Get all cart items with product details and images
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: require("../models").ProductImage,
              as: "images",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format products with images using our image helper
    const itemsWithFormattedProducts = cartItems.map((item) => {
      const product = item.product;
      if (product) {
        const formattedProduct = formatProductsWithImages([product])[0];
        return {
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
          variantData: item.variantData,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          product: formattedProduct,
        };
      }
      return item;
    });

    const { totalAmount, itemCount } = calculateCartTotals(
      itemsWithFormattedProducts
    );

    return res.json({
      success: true,
      data: {
        id: cart.id,
        items: itemsWithFormattedProducts,
        totalAmount,
        itemCount,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Error fetching cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// Add item to cart
export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId, quantity = 1, variantData } = req.body;
    const userId = req.user?.id;
    const sessionId =
      (req.headers["x-session-id"] as string) ||
      (req as any).sessionID ||
      `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID and quantity required",
      });
    }

    // Check if product exists and is available
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.inStock || product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} items available in stock`,
      });
    }

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    let cartItem: CartItem;

    if (existingItem) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + quantity;

      if (product.stockQuantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more items. Only ${
            product.stockQuantity - existingItem.quantity
          } more available`,
        });
      }

      existingItem.quantity = newQuantity;
      if (variantData) {
        existingItem.variantData = variantData;
      }
      cartItem = await existingItem.save();
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
        variantData: variantData || null,
      });
    }

    // Get updated cart item with product details
    const updatedItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: require("../models").ProductImage,
              as: "images",
            },
          ],
        },
      ],
    });

    // Get the full updated cart to return
    const updatedCart = await getOrCreateCart(userId, sessionId);

    // Get all cart items with product details and images
    const cartItems = await CartItem.findAll({
      where: { cartId: updatedCart.id },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: require("../models").ProductImage,
              as: "images",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format products with images using our image helper
    const itemsWithFormattedProducts = cartItems.map((item) => {
      const product = item.product;
      if (product) {
        const formattedProduct = formatProductsWithImages([product])[0];
        return {
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
          variantData: item.variantData,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          product: formattedProduct,
        };
      }
      return item;
    });

    const { totalAmount, itemCount } = calculateCartTotals(
      itemsWithFormattedProducts
    );

    return res.status(201).json({
      success: true,
      message: existingItem
        ? "Cart item updated successfully"
        : "Item added to cart successfully",
      data: {
        id: updatedCart.id,
        items: itemsWithFormattedProducts,
        totalAmount,
        itemCount,
        createdAt: updatedCart.createdAt,
        updatedAt: updatedCart.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity required",
      });
    }

    // Find cart item
    const cartItem = await CartItem.findByPk(id, {
      include: [
        {
          model: Cart,
          as: "cart",
          where: userId ? { userId } : { sessionId: { [Op.ne]: null } },
        },
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Check stock availability
    if (cartItem.product && cartItem.product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.product.stockQuantity} items available in stock`,
      });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    // Get the full updated cart to return
    const sessionId =
      (req.headers["x-session-id"] as string) || (req as any).sessionID;
    const updatedCart = await getOrCreateCart(userId, sessionId);

    // Get all cart items with product details and images
    const cartItems = await CartItem.findAll({
      where: { cartId: updatedCart.id },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: require("../models").ProductImage,
              as: "images",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format products with images using our image helper
    const itemsWithFormattedProducts = cartItems.map((item) => {
      const product = item.product;
      if (product) {
        const formattedProduct = formatProductsWithImages([product])[0];
        return {
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
          variantData: item.variantData,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          product: formattedProduct,
        };
      }
      return item;
    });

    const { totalAmount, itemCount } = calculateCartTotals(
      itemsWithFormattedProducts
    );

    return res.json({
      success: true,
      message: "Cart item updated successfully",
      data: {
        id: updatedCart.id,
        items: itemsWithFormattedProducts,
        totalAmount,
        itemCount,
        createdAt: updatedCart.createdAt,
        updatedAt: updatedCart.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Error updating cart item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};

// Remove item from cart
export const removeFromCart = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Find and delete cart item
    const cartItem = await CartItem.findByPk(id, {
      include: [
        {
          model: Cart,
          as: "cart",
          where: userId ? { userId } : { sessionId: { [Op.ne]: null } },
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await cartItem.destroy();

    // Get the updated cart after removal
    const sessionId =
      (req.headers["x-session-id"] as string) || (req as any).sessionID;
    const updatedCart = await getOrCreateCart(userId, sessionId);

    // Get all remaining cart items with product details and images
    const cartItems = await CartItem.findAll({
      where: { cartId: updatedCart.id },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: require("../models").ProductImage,
              as: "images",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format products with images using our image helper
    const itemsWithFormattedProducts = cartItems.map((item) => {
      const product = item.product;
      if (product) {
        const formattedProduct = formatProductsWithImages([product])[0];
        return {
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
          variantData: item.variantData,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          product: formattedProduct,
        };
      }
      return item;
    });

    const { totalAmount, itemCount } = calculateCartTotals(
      itemsWithFormattedProducts
    );

    return res.json({
      success: true,
      message: "Item removed from cart successfully",
      data: {
        id: updatedCart.id,
        items: itemsWithFormattedProducts,
        totalAmount,
        itemCount,
        createdAt: updatedCart.createdAt,
        updatedAt: updatedCart.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Error removing from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};

// Clear entire cart
export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const sessionId =
      (req.headers["x-session-id"] as string) || (req as any).sessionID;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: "User or session required",
      });
    }

    // Find cart
    const whereClause: any = {};
    if (userId) {
      whereClause.userId = userId;
    } else if (sessionId) {
      whereClause.sessionId = sessionId;
    }

    const cart = await Cart.findOne({ where: whereClause });

    if (cart) {
      // Delete all cart items
      await CartItem.destroy({
        where: { cartId: cart.id },
      });
    }

    // Return the cleared cart structure
    const updatedCart = cart || (await getOrCreateCart(userId, sessionId));

    return res.json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        id: updatedCart.id,
        items: [],
        totalAmount: 0,
        itemCount: 0,
        createdAt: updatedCart.createdAt,
        updatedAt: updatedCart.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

// Get cart item count
export const getCartCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const sessionId =
      (req.headers["x-session-id"] as string) || (req as any).sessionID;

    if (!userId && !sessionId) {
      return res.json({
        success: true,
        count: 0,
      });
    }

    // Find cart
    const whereClause: any = {};
    if (userId) {
      whereClause.userId = userId;
    } else if (sessionId) {
      whereClause.sessionId = sessionId;
    }

    const cart = await Cart.findOne({ where: whereClause });

    if (!cart) {
      return res.json({
        success: true,
        count: 0,
      });
    }

    // Count total items in cart
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      attributes: ["quantity"],
    });

    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return res.json({
      success: true,
      count: totalCount,
    });
  } catch (error) {
    logger.error("Error fetching cart count:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart count",
      count: 0,
    });
  }
};

// Merge guest cart with user cart when user logs in
export const mergeGuestCart = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { sessionId, guestCartItems } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!sessionId && !guestCartItems) {
      return res.status(400).json({
        success: false,
        message: "Guest session ID or cart items required",
      });
    }

    // Get or create user cart
    const userCart = await getOrCreateCart(userId);

    let guestCart: Cart | null = null;
    let itemsToMerge: CartItem[] = [];

    // If sessionId is provided, get guest cart from database
    if (sessionId) {
      guestCart = await Cart.findOne({
        where: { sessionId },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
              },
            ],
          },
        ],
      });

      if (guestCart && guestCart.items) {
        itemsToMerge = guestCart.items;
      }
    }

    // If guestCartItems are provided directly (from frontend localStorage)
    if (guestCartItems && Array.isArray(guestCartItems)) {
      for (const guestItem of guestCartItems) {
        if (guestItem.productId && guestItem.quantity) {
          // Verify product exists
          const product = await Product.findByPk(guestItem.productId);
          if (product) {
            // Check if item already exists in user cart
            const existingUserItem = await CartItem.findOne({
              where: {
                cartId: userCart.id,
                productId: guestItem.productId,
              },
            });

            if (existingUserItem) {
              // Update quantity (ensure we don't exceed stock)
              const newQuantity = Math.min(
                existingUserItem.quantity + guestItem.quantity,
                product.stockQuantity
              );
              existingUserItem.quantity = newQuantity;

              // Update variant data if provided
              if (guestItem.variantData) {
                existingUserItem.variantData = guestItem.variantData;
              }

              await existingUserItem.save();
            } else {
              // Create new cart item
              const quantity = Math.min(
                guestItem.quantity,
                product.stockQuantity
              );
              await CartItem.create({
                cartId: userCart.id,
                productId: guestItem.productId,
                quantity: quantity,
                variantData: guestItem.variantData || null,
              });
            }
          }
        }
      }
    }

    // Merge items from database guest cart
    for (const guestItem of itemsToMerge) {
      if (!guestItem.product) continue;

      // Check if item already exists in user cart
      const existingUserItem = await CartItem.findOne({
        where: {
          cartId: userCart.id,
          productId: guestItem.productId,
        },
      });

      if (existingUserItem) {
        // Update quantity (ensure we don't exceed stock)
        const newQuantity = Math.min(
          existingUserItem.quantity + guestItem.quantity,
          guestItem.product.stockQuantity
        );
        existingUserItem.quantity = newQuantity;

        // Update variant data if provided
        if (guestItem.variantData) {
          existingUserItem.variantData = guestItem.variantData;
        }

        await existingUserItem.save();
      } else {
        // Create new cart item in user cart
        const quantity = Math.min(
          guestItem.quantity,
          guestItem.product.stockQuantity
        );
        await CartItem.create({
          cartId: userCart.id,
          productId: guestItem.productId,
          quantity: quantity,
          variantData: guestItem.variantData || null,
        });
      }
    }

    // Delete guest cart if it exists
    if (guestCart) {
      await CartItem.destroy({ where: { cartId: guestCart.id } });
      await guestCart.destroy();
    }

    // Return updated user cart
    const updatedCart = await getCart(req, res);

    return res.json({
      success: true,
      message: "Guest cart merged successfully",
      data: updatedCart,
    });
  } catch (error) {
    logger.error("Error merging guest cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to merge guest cart",
    });
  }
};
