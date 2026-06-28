import { Response } from "express";
import { Op } from "sequelize";
import { User, Product, ProductImage, CreatorProfile } from "@/models";
import logger from "@/config/logger";

interface AuthRequest {
  user?: any;
  query: any;
  params: any;
  body: any;
}

// Get all products with filters
export const getProducts = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "DESC",
      isNew,
      isFeatured,
      inStock,
      creatorId,
    } = req.query;

    const whereClause: any = { isActive: true };

    // Apply filters
    if (category) {
      whereClause.categoryId = category;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } },
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    if (isNew !== undefined) {
      whereClause.isNew = isNew === "true";
    }

    if (isFeatured !== undefined) {
      whereClause.isFeatured = isFeatured === "true";
    }

    if (inStock !== undefined) {
      whereClause.inStock = inStock === "true";
    }

    if (creatorId) {
      whereClause.creatorId = creatorId;
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "imageUrl", "altText", "isPrimary", "sortOrder"],
          order: [["sortOrder", "ASC"]],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
          include: [
            {
              model: CreatorProfile,
              as: "creatorProfile",
              attributes: ["businessName", "rating", "isVerified"],
            },
          ],
        },
      ],
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string),
      order: [[sortBy as string, sortOrder as string]],
      distinct: true,
    });

    const totalPages = Math.ceil(count / parseInt(limit as string));

    return res.json({
      success: true,
      message: "Products retrieved successfully",
      data: {
        products,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count,
          pages: totalPages,
        },
      },
    });
  } catch (error) {
    logger.error("Error getting products:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get product by ID
export const getProductById = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "imageUrl", "altText", "isPrimary", "sortOrder"],
          order: [["sortOrder", "ASC"]],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
          include: [
            {
              model: CreatorProfile,
              as: "creatorProfile",
              attributes: [
                "businessName",
                "businessDescription",
                "rating",
                "isVerified",
                "totalSales",
                "joinedAt",
              ],
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product retrieved successfully",
      data: { product },
    });
  } catch (error) {
    logger.error("Error getting product by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create product (creator only)
export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user is a creator
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [{ model: CreatorProfile, as: "creatorProfile" }],
    });

    if (!user || user.role !== "creator" || !(user as any).creatorProfile) {
      return res.status(403).json({
        success: false,
        message: "Creator access required",
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      sku,
      categoryId,
      brand,
      stockQuantity,
      tags = [],
      features = [],
      specifications = {},
      discount = 0,
      weight,
      dimensions,
      metaTitle,
      metaDescription,
      images = [],
    } = req.body;

    // Generate unique SKU if not provided
    const finalSku = sku || `${user.id}-${Date.now()}`;

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      originalPrice,
      sku: finalSku,
      categoryId,
      creatorId: req.user.id,
      brand,
      stockQuantity,
      inStock: stockQuantity > 0,
      tags,
      features,
      specifications,
      discount,
      weight,
      dimensions,
      metaTitle,
      metaDescription,
      isNew: true,
      rating: 0,
      reviewCount: 0,
      isFeatured: false,
      isDigital: false,
      viewCount: 0,
      salesCount: 0,
      isActive: true,
    });

    // Add images if provided
    if (images && images.length > 0) {
      const productImages = images.map((img: any, index: number) => ({
        productId: product.id,
        imageUrl: img.url,
        altText: img.altText || name,
        isPrimary: index === 0,
        sortOrder: index,
      }));

      await ProductImage.bulkCreate(productImages);
    }

    // Update creator's total products count
    await CreatorProfile.increment("totalProducts", {
      where: { userId: req.user.id },
    });

    // Fetch the created product with associations
    const createdProduct = await Product.findOne({
      where: { id: product.id },
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "imageUrl", "altText", "isPrimary", "sortOrder"],
          order: [["sortOrder", "ASC"]],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product: createdProduct },
    });
  } catch (error) {
    logger.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update product (creator only)
export const updateProduct = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, creatorId: req.user.id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied",
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      sku,
      categoryId,
      brand,
      stockQuantity,
      tags,
      features,
      specifications,
      discount,
      weight,
      dimensions,
      metaTitle,
      metaDescription,
      isNew,
      isFeatured,
      isActive,
      images,
    } = req.body;

    // Update product
    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price !== undefined ? price : product.price,
      originalPrice:
        originalPrice !== undefined ? originalPrice : product.originalPrice,
      sku: sku || product.sku,
      categoryId: categoryId || product.categoryId,
      brand: brand || product.brand,
      stockQuantity:
        stockQuantity !== undefined ? stockQuantity : product.stockQuantity,
      inStock:
        stockQuantity !== undefined ? stockQuantity > 0 : product.inStock,
      tags: tags || product.tags,
      features: features || product.features,
      specifications: specifications || product.specifications,
      discount: discount !== undefined ? discount : product.discount,
      weight: weight !== undefined ? weight : product.weight,
      dimensions: dimensions || product.dimensions,
      metaTitle: metaTitle || product.metaTitle,
      metaDescription: metaDescription || product.metaDescription,
      isNew: isNew !== undefined ? isNew : product.isNew,
      isFeatured: isFeatured !== undefined ? isFeatured : product.isFeatured,
      isActive: isActive !== undefined ? isActive : product.isActive,
    });

    // Update images if provided
    if (images && images.length > 0) {
      // Delete existing images
      await ProductImage.destroy({ where: { productId: id } });

      // Add new images
      const productImages = images.map((img: any, index: number) => ({
        productId: id,
        imageUrl: img.url,
        altText: img.altText || name || product.name,
        isPrimary: index === 0,
        sortOrder: index,
      }));

      await ProductImage.bulkCreate(productImages);
    }

    // Fetch updated product
    const updatedProduct = await Product.findOne({
      where: { id },
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "imageUrl", "altText", "isPrimary", "sortOrder"],
          order: [["sortOrder", "ASC"]],
        },
      ],
    });

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    logger.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete product (creator only)
export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, creatorId: req.user.id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied",
      });
    }

    // Delete associated images
    await ProductImage.destroy({ where: { productId: id } });

    // Delete product
    await product.destroy();

    // Update creator's total products count
    await CreatorProfile.decrement("totalProducts", {
      where: { userId: req.user.id },
    });

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get creator's products
export const getCreatorProducts = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      page = 1,
      limit = 12,
      search,
      isActive,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const whereClause: any = { creatorId: req.user.id };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "imageUrl", "altText", "isPrimary", "sortOrder"],
          order: [["sortOrder", "ASC"]],
        },
      ],
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string),
      order: [[sortBy as string, sortOrder as string]],
    });

    const totalPages = Math.ceil(count / parseInt(limit as string));

    return res.json({
      success: true,
      message: "Creator products retrieved successfully",
      data: {
        products,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count,
          pages: totalPages,
        },
      },
    });
  } catch (error) {
    logger.error("Error getting creator products:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving creator products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
