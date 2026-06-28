import { Request, Response } from "express";
import { User, CreatorProfile, Product } from "@/models";
import logger from "@/config/logger";

interface AuthRequest extends Request {
  user?: any;
}

// Apply to become a creator
export const applyToBeCreator = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user already has a creator profile
    const existingProfile = await CreatorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (existingProfile) {
      // Ensure user role is set to creator in the database
      await User.update({ role: "creator" }, { where: { id: req.user.id } });

      return res.status(200).json({
        success: true,
        message: "Creator profile already exists",
        data: { creatorProfile: existingProfile },
      });
    }

    const {
      businessName,
      businessDescription,
      businessType,
      businessEmail,
      businessPhone,
      businessWebsite,
      businessAddress,
      taxId,
      socialMedia,
    } = req.body;

    // Create creator profile
    const creatorProfile = await CreatorProfile.create({
      userId: req.user.id,
      businessName,
      businessDescription,
      businessType,
      businessEmail,
      businessPhone,
      businessWebsite,
      businessAddress,
      taxId,
      socialMedia,
      commissionRate: 15.0, // Default 15%
      joinedAt: new Date(),
    });

    // Update user role to creator
    await User.update({ role: "creator" }, { where: { id: req.user.id } });

    return res.status(201).json({
      success: true,
      message: "Creator application submitted successfully",
      data: { creatorProfile },
    });
  } catch (error) {
    logger.error("Error applying to be creator:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting creator application",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get creator status and ensure role is synced
export const getCreatorStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user has a creator profile
    const creatorProfile = await CreatorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (creatorProfile) {
      // Ensure user role is set to creator
      await User.update({ role: "creator" }, { where: { id: req.user.id } });

      return res.json({
        success: true,
        message: "User is a creator",
        data: {
          isCreator: true,
          role: "creator",
          creatorProfile,
        },
      });
    }

    return res.json({
      success: true,
      message: "User is not a creator",
      data: {
        isCreator: false,
        role: "user",
      },
    });
  } catch (error) {
    logger.error("Error getting creator status:", error);
    return res.status(500).json({
      success: false,
      message: "Error getting creator status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get creator profile
export const getCreatorProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const creatorProfile = await CreatorProfile.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name", "email", "avatar"],
        },
      ],
    });

    if (!creatorProfile) {
      return res.status(404).json({
        success: false,
        message: "Creator profile not found",
      });
    }

    return res.json({
      success: true,
      message: "Creator profile retrieved successfully",
      data: { creatorProfile },
    });
  } catch (error) {
    logger.error("Error getting creator profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving creator profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update creator profile
export const updateCreatorProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const creatorProfile = await CreatorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!creatorProfile) {
      return res.status(404).json({
        success: false,
        message: "Creator profile not found",
      });
    }

    const {
      businessName,
      businessDescription,
      businessEmail,
      businessPhone,
      businessWebsite,
      businessLogo,
      businessBanner,
      businessAddress,
      bankAccount,
      socialMedia,
    } = req.body;

    await creatorProfile.update({
      ...(businessName && { businessName }),
      ...(businessDescription && { businessDescription }),
      ...(businessEmail && { businessEmail }),
      ...(businessPhone && { businessPhone }),
      ...(businessWebsite && { businessWebsite }),
      ...(businessLogo && { businessLogo }),
      ...(businessBanner && { businessBanner }),
      ...(businessAddress && { businessAddress }),
      ...(bankAccount && { bankAccount }),
      ...(socialMedia && { socialMedia }),
      lastActiveAt: new Date(),
    });

    return res.json({
      success: true,
      message: "Creator profile updated successfully",
      data: { creatorProfile },
    });
  } catch (error) {
    logger.error("Error updating creator profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating creator profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get creator dashboard stats
export const getCreatorStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const creatorProfile = await CreatorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!creatorProfile) {
      return res.status(404).json({
        success: false,
        message: "Creator profile not found",
      });
    }

    // Get product stats
    const totalProducts = await Product.count({
      where: { creatorId: req.user.id, isActive: true },
    });

    const activeProducts = await Product.count({
      where: { creatorId: req.user.id, isActive: true, inStock: true },
    });

    const outOfStockProducts = await Product.count({
      where: { creatorId: req.user.id, isActive: true, inStock: false },
    });

    // Mock earnings data (in a real app, this would come from order/payment data)
    const stats = {
      totalEarnings: creatorProfile.totalEarnings,
      totalSales: creatorProfile.totalSales,
      totalProducts,
      activeProducts,
      outOfStockProducts,
      averageRating: creatorProfile.rating,
      commissionRate: creatorProfile.commissionRate,
      monthlyEarnings: 0, // Would calculate from orders
      weeklyOrders: 0, // Would calculate from orders
      conversionRate: 2.5, // Mock data
      viewsThisMonth: 1250, // Mock data
    };

    return res.json({
      success: true,
      message: "Creator stats retrieved successfully",
      data: { stats },
    });
  } catch (error) {
    logger.error("Error getting creator stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving creator stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get creator by ID (public profile)
export const getCreatorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const creatorProfile = await CreatorProfile.findOne({
      where: { userId: id, isActive: true },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name", "avatar"],
        },
      ],
      attributes: [
        "id",
        "businessName",
        "businessDescription",
        "businessLogo",
        "businessBanner",
        "socialMedia",
        "rating",
        "totalSales",
        "totalProducts",
        "isVerified",
        "joinedAt",
      ],
    });

    if (!creatorProfile) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    // Get creator's featured products
    const featuredProducts = await Product.findAll({
      where: {
        creatorId: id,
        isActive: true,
        isFeatured: true,
      },
      limit: 8,
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      message: "Creator profile retrieved successfully",
      data: {
        creator: creatorProfile,
        featuredProducts,
      },
    });
  } catch (error) {
    logger.error("Error getting creator by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving creator",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
