import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "@/middleware/auth";
import {
  uploadSingle,
  uploadProductImages,
  uploadCreatorAssets,
  uploadAvatar,
  handleSingleImageUpload,
  handleProductImagesUpload,
  handleProductImagesUploadWithDB,
  handleCreatorAssetsUpload,
  handleAvatarUpload,
  deleteUploadedFile,
} from "@/controllers/upload.controller";
import logger from "@/config/logger";

const router = Router();

// Multer error handling middleware
const handleMulterError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err) {
    logger.error("Multer error:", err);

    if (err.code === "UNEXPECTED_FIELD") {
      res.status(400).json({
        success: false,
        message: "Unexpected field in upload",
        error: `Expected field name but got: ${err.field}`,
      });
      return;
    }

    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        message: "File too large",
        error: "Maximum file size exceeded",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: "Upload error",
      error: err.message,
    });
    return;
  }
  next();
};

// Single image upload
router.post("/single", authenticate, uploadSingle, handleSingleImageUpload);

// Product images upload
router.post(
  "/products",
  authenticate,
  uploadProductImages,
  handleProductImagesUpload
);

// Product images upload with database integration
router.post(
  "/products/with-db",
  authenticate,
  uploadProductImages,
  handleProductImagesUploadWithDB
);

// Creator assets upload
router.post(
  "/creator-assets",
  authenticate,
  uploadCreatorAssets,
  handleCreatorAssetsUpload
);

// User avatar upload
router.post(
  "/avatar",
  authenticate,
  uploadAvatar,
  handleMulterError,
  handleAvatarUpload
);

// Delete uploaded file
router.delete("/:filename", authenticate, deleteUploadedFile);

export default router;
