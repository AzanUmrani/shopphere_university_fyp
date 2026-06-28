import { Router } from "express";
import { body, param } from "express-validator";
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  googleAuthCallback,
} from "@/controllers/auth.controller";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validation";

const router = Router();

// Validation rules
const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("First name is required and must be less than 100 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name is required and must be less than 100 characters"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Valid phone number is required"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const refreshTokenValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

const updateProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be less than 100 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be less than 100 characters"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Valid phone number is required"),
  body("avatar")
    .optional()
    .custom((value) => {
      if (!value) return true; // Optional field
      // Allow both full URLs and relative paths
      return (
        typeof value === "string" &&
        (value.startsWith("http://") ||
          value.startsWith("https://") ||
          value.startsWith("/uploads/"))
      );
    })
    .withMessage("Avatar must be a valid URL or upload path"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
];

const resetPasswordValidation = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

const verifyEmailValidation = [
  param("token").notEmpty().withMessage("Verification token is required"),
];

const googleAuthValidation = [
  body("id").notEmpty().withMessage("Google ID is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("name").notEmpty().withMessage("Google name is required"),
  body("picture").optional().isString().withMessage("Picture must be a string"),
];

// Public routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/refresh", refreshTokenValidation, validate, refreshToken);
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  forgotPassword
);
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  resetPassword
);
router.get(
  "/verify-email/:token",
  verifyEmailValidation,
  validate,
  verifyEmail
);
// Google OAuth endpoint
router.post("/google", googleAuthValidation, validate, googleAuthCallback);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post("/logout", logout);
router.get("/profile", getProfile);
router.put("/profile", updateProfileValidation, validate, updateProfile);
router.post(
  "/change-password",
  changePasswordValidation,
  validate,
  changePassword
);

export default router;
