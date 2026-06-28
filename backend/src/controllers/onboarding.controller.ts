import { Request, Response } from "express";
import { User, CreatorProfile } from "@/models";
import logger from "@/config/logger";

interface AuthRequest extends Request {
  user?: any;
}

type CreatorBusinessType =
  | "individual"
  | "small_business"
  | "corporation"
  | "non_profit"
  | "other";

const normalizeString = (value: unknown): string => {
  return typeof value === "string" ? value.trim() : "";
};

const toOptionalString = (value: unknown): string | undefined => {
  const normalized = normalizeString(value);
  return normalized.length > 0 ? normalized : undefined;
};

const normalizeBusinessType = (value: unknown): CreatorBusinessType => {
  const normalized = normalizeString(value).toLowerCase();

  const businessTypeMap: Record<string, CreatorBusinessType> = {
    individual: "individual",
    "sole proprietor": "individual",
    "individual / sole proprietor": "individual",
    llc: "small_business",
    partnership: "small_business",
    "small business": "small_business",
    small_business: "small_business",
    corporation: "corporation",
    "non-profit": "non_profit",
    "non profit": "non_profit",
    non_profit: "non_profit",
    other: "other",
  };

  return businessTypeMap[normalized] || "other";
};

const normalizeOptionalEmail = (value: unknown): string | undefined => {
  const email = normalizeString(value);
  if (!email) return undefined;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email) ? email : undefined;
};

const normalizeOptionalWebsite = (value: unknown): string | undefined => {
  const website = normalizeString(value);
  if (!website) return undefined;

  const urlWithProtocol = /^https?:\/\//i.test(website)
    ? website
    : `https://${website}`;

  try {
    const parsed = new URL(urlWithProtocol);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return undefined;
    }
    return urlWithProtocol;
  } catch {
    return undefined;
  }
};

const hasAnyNonEmptyValue = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;
  return Object.values(value as Record<string, unknown>).some(
    (entry) => normalizeString(entry).length > 0,
  );
};

// Get all onboarding data
export const getOnboardingData = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Onboarding data retrieved successfully",
      data: {
        onboardingData: user.tempOnboardingData || {},
      },
    });
  } catch (error) {
    logger.error("Error getting onboarding data:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving onboarding data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Save Step 1: Personal Information
export const saveStep1Personal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { firstName, lastName, email, phone, dateOfBirth, profileImage } =
      req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get existing onboarding data or create new object
    const onboardingData = user.tempOnboardingData || {};

    // Update Step 1 data
    onboardingData.personalInfo = {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      profileImage,
    };

    // Save to database
    await user.update({ tempOnboardingData: onboardingData });

    return res.json({
      success: true,
      message: "Step 1 data saved successfully",
      data: {
        personalInfo: onboardingData.personalInfo,
      },
    });
  } catch (error) {
    logger.error("Error saving step 1 data:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving personal information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Save Step 2: Shop Information
export const saveStep2Shop = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      shopName,
      shopUrl,
      shopDescription,
      category,
      subCategories,
      website,
      instagram,
      shopLogo,
      shopBanner,
    } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get existing onboarding data or create new object
    const onboardingData = user.tempOnboardingData || {};

    // Update Step 2 data
    onboardingData.shopInfo = {
      shopName,
      shopUrl,
      shopDescription,
      category,
      subCategories,
      website,
      instagram,
      shopLogo,
      shopBanner,
    };

    // Save to database
    await user.update({ tempOnboardingData: onboardingData });

    return res.json({
      success: true,
      message: "Step 2 data saved successfully",
      data: {
        shopInfo: onboardingData.shopInfo,
      },
    });
  } catch (error) {
    logger.error("Error saving step 2 data:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving shop information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Save Step 3: Business Information
export const saveStep3Business = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      businessType,
      businessName,
      taxId,
      businessPhone,
      businessEmail,
      businessAddress,
      businessLicense,
    } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get existing onboarding data or create new object
    const onboardingData = user.tempOnboardingData || {};

    // Update Step 3 data
    onboardingData.businessInfo = {
      businessType,
      businessName,
      taxId,
      businessPhone,
      businessEmail,
      businessAddress,
      businessLicense,
    };

    // Save to database
    await user.update({ tempOnboardingData: onboardingData });

    return res.json({
      success: true,
      message: "Step 3 data saved successfully",
      data: {
        businessInfo: onboardingData.businessInfo,
      },
    });
  } catch (error) {
    logger.error("Error saving step 3 data:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving business information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Save Step 4: Payment Information
export const saveStep4Payment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      accountType,
      bankAccount,
      paypalEmail,
      termsAccepted,
      privacyAccepted,
      processingTimeAccepted,
    } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get existing onboarding data or create new object
    const onboardingData = user.tempOnboardingData || {};

    // Update Step 4 data
    onboardingData.paymentInfo = {
      accountType,
      bankAccount,
      paypalEmail,
      termsAccepted,
      privacyAccepted,
      processingTimeAccepted,
    };

    // Save to database
    await user.update({ tempOnboardingData: onboardingData });

    return res.json({
      success: true,
      message: "Step 4 data saved successfully",
      data: {
        paymentInfo: onboardingData.paymentInfo,
      },
    });
  } catch (error) {
    logger.error("Error saving step 4 data:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving payment information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Save Step 5: Plan Information
export const saveStep5Plan = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { selectedPlan, billingCycle } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get existing onboarding data or create new object
    const onboardingData = user.tempOnboardingData || {};

    // Update Step 5 data
    onboardingData.planInfo = {
      selectedPlan,
      billingCycle,
    };

    // Save to database
    await user.update({ tempOnboardingData: onboardingData });

    return res.json({
      success: true,
      message: "Step 5 data saved successfully",
      data: {
        planInfo: onboardingData.planInfo,
      },
    });
  } catch (error) {
    logger.error("Error saving step 5 data:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving plan information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Complete onboarding and create creator profile
export const completeOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const onboardingData = user.tempOnboardingData;

    if (!onboardingData) {
      return res.status(400).json({
        success: false,
        message: "No onboarding data found. Please complete all steps first.",
      });
    }

    // Check if creator profile already exists
    const existingProfile = await CreatorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (existingProfile) {
      return res.status(200).json({
        success: true,
        message: "Creator profile already exists",
        data: { creatorProfile: existingProfile },
      });
    }

    const businessName =
      normalizeString(onboardingData.shopInfo?.shopName) ||
      normalizeString(onboardingData.businessInfo?.businessName);

    if (!businessName) {
      return res.status(400).json({
        success: false,
        message: "Business name is required to complete onboarding.",
      });
    }

    const businessType = normalizeBusinessType(
      onboardingData.businessInfo?.businessType,
    );

    const businessAddress = hasAnyNonEmptyValue(
      onboardingData.businessInfo?.businessAddress,
    )
      ? onboardingData.businessInfo?.businessAddress
      : undefined;

    const bankAccount = hasAnyNonEmptyValue(
      onboardingData.paymentInfo?.bankAccount,
    )
      ? onboardingData.paymentInfo?.bankAccount
      : undefined;

    const instagram = toOptionalString(onboardingData.shopInfo?.instagram);
    const socialMedia = instagram ? { instagram } : undefined;

    // Create creator profile from onboarding data
    const creatorProfile = await CreatorProfile.create({
      userId: req.user.id,
      businessName,
      businessDescription: toOptionalString(
        onboardingData.shopInfo?.shopDescription,
      ),
      businessType,
      businessEmail: normalizeOptionalEmail(
        onboardingData.businessInfo?.businessEmail ||
          onboardingData.personalInfo?.email,
      ),
      businessPhone: toOptionalString(
        onboardingData.businessInfo?.businessPhone ||
          onboardingData.personalInfo?.phone,
      ),
      businessWebsite: normalizeOptionalWebsite(
        onboardingData.shopInfo?.website,
      ),
      businessLogo: toOptionalString(onboardingData.shopInfo?.shopLogo),
      businessBanner: toOptionalString(onboardingData.shopInfo?.shopBanner),
      businessAddress,
      taxId: toOptionalString(onboardingData.businessInfo?.taxId),
      bankAccount,
      socialMedia,
      commissionRate: 15.0, // Default 15%
      joinedAt: new Date(),
    });

    // Update user role to creator
    await user.update({ role: "creator" });

    // Clear temp onboarding data
    await user.update({ tempOnboardingData: null });

    return res.status(201).json({
      success: true,
      message: "Onboarding completed successfully",
      data: { creatorProfile },
    });
  } catch (error) {
    logger.error("Error completing onboarding:", error);

    const errorName = (error as any)?.name;
    if (
      errorName === "SequelizeValidationError" ||
      errorName === "SequelizeDatabaseError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid onboarding data. Please verify business details and optional website/email fields.",
        error:
          error instanceof Error ? error.message : "Unknown validation error",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error completing onboarding",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Clear onboarding data
export const clearOnboardingData = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.update({ tempOnboardingData: null });

    return res.json({
      success: true,
      message: "Onboarding data cleared successfully",
    });
  } catch (error) {
    logger.error("Error clearing onboarding data:", error);
    return res.status(500).json({
      success: false,
      message: "Error clearing onboarding data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
