import { Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import { User } from "@/models/User";
import { UserPreferences } from "@/models/UserPreferences";
import { AuthenticatedRequest, ApiResponse } from "@/types";
import { cacheService } from "@/config/redis";
import logger from "@/config/logger";

// Generate JWT tokens
const generateTokens = (userId: string, email: string, role: string) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET as string;

  const accessToken = jwt.sign({ id: userId, email, role }, jwtSecret);

  const refreshToken = jwt.sign({ id: userId, email, role }, jwtRefreshSecret);

  return { accessToken, refreshToken };
};

// Register user
export const register = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      newsletter = true,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: "user",
      isActive: true,
      isEmailVerified: false,
      emailVerificationToken: crypto.randomBytes(32).toString("hex"),
    });

    // Create user preferences
    await UserPreferences.create({
      userId: user.id,
      newsletter,
      smsNotifications: true,
      emailNotifications: true,
      theme: "light",
      currency: "USD",
      language: "en",
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Cache user session
    await cacheService.set(
      `user_session:${user.id}`,
      { userId: user.id, email: user.email, role: user.role },
      24 * 60 * 60 // 24 hours
    );

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.toJSON(),
        token: accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Login user
export const login = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { email, password, rememberMe = false } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Cache user session
    const cacheExpiry = rememberMe ? 90 * 24 * 60 * 60 : 24 * 60 * 60; // 90 days or 24 hours
    await cacheService.set(
      `user_session:${user.id}`,
      { userId: user.id, email: user.email, role: user.role },
      cacheExpiry
    );

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toJSON(),
        token: accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Logout user
export const logout = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    if (req.userId) {
      // Remove user session from cache
      await cacheService.del(`user_session:${req.userId}`);
      logger.info(`User logged out: ${req.user?.email}`);
    }

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Refresh token
export const refreshToken = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
      return;
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Update cache
    await cacheService.set(
      `user_session:${user.id}`,
      { userId: user.id, email: user.email, role: user.role },
      24 * 60 * 60 // 24 hours
    );

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    logger.error("Token refresh error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

// Get current user profile
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Get user with preferences
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: UserPreferences,
          as: "preferences",
        },
      ],
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: { user: user.toJSON() },
    });
  } catch (error) {
    logger.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update user profile
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { firstName, lastName, phone, avatar } = req.body;

    // Update user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    logger.info(`User profile updated: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: user.toJSON() },
    });
  } catch (error) {
    logger.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Change password
export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    // Update password
    user.password = newPassword; // Will be hashed by model hook
    await user.save();

    // Clear all user sessions to force re-login
    const cacheKeys = await cacheService.keys(`user_session:${user.id}*`);
    for (const key of cacheKeys) {
      await cacheService.del(key);
    }

    logger.info(`Password changed for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Request password reset
export const forgotPassword = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not
      res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // TODO: Send email with reset token
    logger.info(
      `Password reset requested for: ${user.email}, token: ${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent",
    });
  } catch (error) {
    logger.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Reset password
export const resetPassword = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        passwordResetToken: token,
      },
    });

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
      return;
    }

    // Update password and clear reset token
    user.password = newPassword; // Will be hashed by model hook
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    // Clear all user sessions
    const cacheKeys = await cacheService.keys(`user_session:${user.id}*`);
    for (const key of cacheKeys) {
      await cacheService.del(key);
    }

    logger.info(`Password reset completed for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Verify email
export const verifyEmail = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    logger.info(`Email verified for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    logger.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Google OAuth Callback Handler
export const googleAuthCallback = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id, email, name, picture } = req.body;

    if (!id || !email) {
      res.status(400).json({
        success: false,
        message: "Missing required Google OAuth data",
      });
      return;
    }

    // Check if user already exists
    let user = await User.findOne({ 
      where: { 
        [Op.or]: [
          { googleId: id },
          { email: email }
        ]
      } 
    });

    // If user doesn't exist, create a new one
    if (!user) {
      // Safely parse name - handle cases where name might be undefined or have no space
      const nameParts = (name || "Google User").split(" ");
      const firstName = nameParts[0] || "Google";
      const lastName = nameParts.slice(1).join(" ") || "User";

      user = await User.create({
        email,
        password: crypto.randomBytes(16).toString("hex"), // Random password for oauth users
        firstName: firstName || "Google",
        lastName,
        googleId: id,
        googleEmail: email,
        googleName: name,
        googleAvatar: picture || null,
        oauthProvider: "google",
        role: "user",
        isActive: true,
        isEmailVerified: true, // Google verified emails are trusted
        avatar: picture || null,
      });

      logger.info(`New user created via Google OAuth: ${email}`);
    } else {
      // Update existing user with Google information if not already set
      if (!user.googleId) {
        user.googleId = id;
        user.googleEmail = email;
        user.googleName = name;
        user.isEmailVerified = true; // Trust Google's email verification
        if (picture && !user.avatar) {
          user.avatar = picture;
          user.googleAvatar = picture;
        }
        user.oauthProvider = "google";
        await user.save();
        logger.info(`Google account linked to existing user: ${email}`);
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Cache user session
    await cacheService.set(
      `user_session:${user.id}`,
      { userId: user.id, email: user.email, role: user.role },
      24 * 60 * 60 // 24 hours
    );

    logger.info(`User logged in via Google OAuth: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      data: {
        user: user.toJSON(),
        token: accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error("Google OAuth callback error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
