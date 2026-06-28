import { Request, Response } from "express";
import { Wishlist, Product, User } from "../models";
import { AuthenticatedRequest } from "../types";
import { Op } from "sequelize";


export const addToWishlist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      where: { userId, productId },
    });

    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId,
      productId,
    });

    const fullWishlistItem = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Product,
          attributes: [
            "id",
            "title",
            "price",
            "images",
            "stockQuantity",
            "creatorId",
          ],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: fullWishlistItem,

    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromWishlist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Wishlist.destroy({
      where: { userId, productId },
    });

    if (result === 0) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    return res.json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserWishlist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: wishlistItems, count } = await Wishlist.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: [
            "id",
            "title",
            "description",
            "price",
            "images",
            "stockQuantity",
            "creatorId",
            "status",
          ],
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["id", "firstName", "lastName"],
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
        items: wishlistItems,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkWishlistStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const wishlistItem = await Wishlist.findOne({
      where: { userId, productId },
    });

    return res.json({
      success: true,
      inWishlist: !!wishlistItem,
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWishlistCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const count = await Wishlist.count({
      where: { userId },
    });

    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const clearWishlist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Wishlist.destroy({
      where: { userId },
    });

    return res.json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
