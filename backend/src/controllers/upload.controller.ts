import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import logger from "@/config/logger";
import { ProductImage, Product } from "@/models";
import { updateProductPrimaryImage } from "@/utils/imageHelper";

interface AuthRequest extends Request {
  user?: any;
}

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req: AuthRequest, file, cb) => {
    let uploadPath = "uploads/";

    // Organize uploads by type
    if (file.fieldname === "productImages") {
      uploadPath = "uploads/products/";
    } else if (file.fieldname === "businessLogo") {
      uploadPath = "uploads/creators/logos/";
    } else if (file.fieldname === "businessBanner") {
      uploadPath = "uploads/creators/banners/";
    } else if (file.fieldname === "avatar") {
      uploadPath = "uploads/users/avatars/";
    } else {
      uploadPath = "uploads/misc/";
    }

    // Ensure directory exists
    ensureDirectoryExists(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req: AuthRequest, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const userId = req.user?.id || "anonymous";
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${userId}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  },
});

// File filter for images
const fileFilter = (
  req: AuthRequest,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "5000000"), // 5MB default
    files: 10, // Maximum 10 files
  },
  fileFilter: fileFilter,
});

// Upload single image
export const uploadSingle = upload.single("image");

// Upload multiple product images
export const uploadProductImages = upload.array("productImages", 10);

// Upload creator assets
export const uploadCreatorAssets = upload.fields([
  { name: "businessLogo", maxCount: 1 },
  { name: "businessBanner", maxCount: 1 },
]);

// Upload user avatar
export const uploadAvatar = upload.single("avatar");

// Handle single image upload
export const handleSingleImageUpload = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const imageUrl = `/uploads/${path.relative(
      "uploads/",
      req.file.path
    )}`.replace(/\\/g, "/");

    return res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    logger.error("Error uploading image:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Handle multiple product images upload with database integration
export const handleProductImagesUploadWithDB = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists and belongs to user
    const product = await Product.findOne({
      where: {
        id: productId,
        ...(req.user.role !== "admin" ? { creatorId: req.user.id } : {}),
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not authorized",
      });
    }

    // Get the current count of images for this product to determine sort order
    const existingImagesCount = await ProductImage.count({
      where: { productId },
    });

    const uploadedImages = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const imageUrl = `/uploads/${path.relative(
        "uploads/",
        file.path
      )}`.replace(/\\/g, "/");

      // Create database record
      const productImage = await ProductImage.create({
        productId,
        imageUrl,
        altText: `${product.name} - Image ${existingImagesCount + i + 1}`,
        isPrimary: existingImagesCount === 0 && i === 0, // First image of the product is primary
        sortOrder: existingImagesCount + i,
      });

      uploadedImages.push({
        id: productImage.id,
        imageUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        isPrimary: productImage.isPrimary,
        sortOrder: productImage.sortOrder,
      });
    }

    // Update the product's primary image if this is the first image
    if (existingImagesCount === 0) {
      await updateProductPrimaryImage(productId);
    }

    return res.json({
      success: true,
      message: "Product images uploaded successfully",
      data: {
        images: uploadedImages,
        count: uploadedImages.length,
      },
    });
  } catch (error) {
    logger.error("Error uploading product images to database:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading product images",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Handle multiple product images upload
export const handleProductImagesUpload = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const images = req.files.map((file, index) => ({
      imageUrl: `/uploads/${path.relative("uploads/", file.path)}`.replace(
        /\\/g,
        "/"
      ),
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      isPrimary: index === 0, // First image is primary
      sortOrder: index,
    }));

    return res.json({
      success: true,
      message: "Product images uploaded successfully",
      data: {
        images,
        count: images.length,
      },
    });
  } catch (error) {
    logger.error("Error uploading product images:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading product images",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Handle creator assets upload
export const handleCreatorAssetsUpload = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const uploadedAssets: any = {};

    console.log("Files received:", Object.keys(files));

    if (files.businessLogo && files.businessLogo[0]) {
      const logoFile = files.businessLogo[0];
      console.log("Business logo file:", logoFile);

      // Construct the relative path from uploads directory
      const relativePath = path.relative("uploads/", logoFile.path);
      uploadedAssets.businessLogo = `/uploads/${relativePath}`.replace(
        /\\/g,
        "/"
      );

      console.log("Business logo path:", uploadedAssets.businessLogo);
    }

    if (files.businessBanner && files.businessBanner[0]) {
      const bannerFile = files.businessBanner[0];
      console.log("Business banner file:", bannerFile);

      // Construct the relative path from uploads directory
      const relativePath = path.relative("uploads/", bannerFile.path);
      uploadedAssets.businessBanner = `/uploads/${relativePath}`.replace(
        /\\/g,
        "/"
      );

      console.log("Business banner path:", uploadedAssets.businessBanner);
    }

    console.log("Uploaded assets:", uploadedAssets);

    return res.json({
      success: true,
      message: "Creator assets uploaded successfully",
      data: uploadedAssets,
    });
  } catch (error) {
    console.error("Error uploading creator assets:", error);
    logger.error("Error uploading creator assets:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading creator assets",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Handle user avatar upload
export const handleAvatarUpload = async (req: AuthRequest, res: Response) => {
  try {
    logger.info("Avatar upload request received", {
      user: req.user?.id,
      file: req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : null,
      files: req.files,
      body: req.body,
    });

    if (!req.user) {
      logger.warn("Avatar upload attempted without authentication");
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!req.file) {
      logger.warn("Avatar upload attempted without file", {
        user: req.user.id,
      });
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const avatarUrl = `/uploads/${path.relative(
      "uploads/",
      req.file.path
    )}`.replace(/\\/g, "/");

    logger.info("Avatar uploaded successfully", {
      user: req.user.id,
      filename: req.file.filename,
      avatarUrl,
    });

    return res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        avatarUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    logger.error("Error uploading avatar:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading avatar",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete uploaded file
export const deleteUploadedFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    // Find the file in uploads directory
    const uploadsDir = "uploads";
    const findFile = (dir: string, targetFilename: string): string | null => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const found = findFile(fullPath, targetFilename);
          if (found) return found;
        } else if (item === targetFilename) {
          return fullPath;
        }
      }

      return null;
    };

    const filePath = findFile(uploadsDir, filename);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting file:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
