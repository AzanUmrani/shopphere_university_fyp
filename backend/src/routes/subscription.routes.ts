import { Router, Request, Response } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";
import { authenticate } from "../middleware/auth";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validation";
import { Subscription } from "../models/Subscription";
import { SubscriptionPlan } from "../models/SubscriptionPlan";
import { User } from "../models/User";
import { CreatorProfile } from "../models/CreatorProfile";

const router = Router();

// Validation middleware
const createPlanValidation = [
  body("name")
    .notEmpty()
    .withMessage("Plan name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Plan name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be a positive number"),
  body("currency")
    .optional()
    .isIn(["usd", "eur", "gbp", "cad", "aud"])
    .withMessage("Invalid currency"),
  body("billingPeriod")
    .isIn(["monthly", "yearly"])
    .withMessage("Billing period must be monthly or yearly"),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),
  body("maxSubscribers")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max subscribers must be a positive integer"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const updatePlanValidation = [
  param("planId").isUUID().withMessage("Invalid plan ID"),
  body("name")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Plan name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),
  body("maxSubscribers")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max subscribers must be a positive integer"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const subscribeValidation = [
  param("planId").isUUID().withMessage("Invalid plan ID"),
];

const cancelSubscriptionValidation = [
  param("subscriptionId").isUUID().withMessage("Invalid subscription ID"),
  body("immediate")
    .optional()
    .isBoolean()
    .withMessage("immediate must be a boolean"),
];

const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

// Routes

// Create a subscription plan (Creator only)
router.post(
  "/plans",
  authenticate,
  createPlanValidation,
  validate,
  SubscriptionController.createPlan
);

// Get subscription plans for a creator
router.get(
  "/plans/creator/:creatorId?",
  authenticate,
  param("creatorId").optional().isUUID().withMessage("Invalid creator ID"),
  paginationValidation,
  validate,
  SubscriptionController.getCreatorPlans
);

// Get all active subscription plans (public)
router.get(
  "/plans/active",
  paginationValidation,
  query("creatorId").optional().isUUID().withMessage("Invalid creator ID"),
  validate,
  SubscriptionController.getAvailablePlans
);

// Update a subscription plan (Creator only)
router.put(
  "/plans/:planId",
  authenticate,
  updatePlanValidation,
  validate,
  SubscriptionController.updatePlan
);

// Subscribe to a plan
router.post(
  "/subscribe/:planId",
  authenticate,
  subscribeValidation,
  validate,
  SubscriptionController.subscribe
);

// Get user's subscriptions
router.get(
  "/my-subscriptions",
  authenticate,
  SubscriptionController.getUserSubscriptions
);

// Cancel a subscription
router.put(
  "/subscriptions/:subscriptionId/cancel",
  authenticate,
  cancelSubscriptionValidation,
  validate,
  SubscriptionController.cancelSubscription
);

// Get subscription analytics (Creator only)
router.get(
  "/analytics",
  authenticate,
  SubscriptionController.getSubscriptionAnalytics
);

// Stripe webhook endpoint (no authentication required)
router.post(
  "/webhook",
  // Note: For Stripe webhooks, we need raw body, not JSON parsed
  // This should be handled in app.ts with express.raw() middleware
  SubscriptionController.handleWebhook
);

// Get specific subscription plan details
router.get(
  "/plans/:planId",
  param("planId").isUUID().withMessage("Invalid plan ID"),
  validate,
  async (req: Request, res: Response) => {
    try {
      const { planId } = req.params;

      const plan = await SubscriptionPlan.findByPk(planId, {
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "name", "email"],
            include: [
              {
                model: CreatorProfile,
                as: "creatorProfile",
                attributes: ["bio", "website", "socialLinks"],
              },
            ],
          },
        ],
      });

      if (!plan) {
        return res.status(404).json({ message: "Subscription plan not found" });
      }

      return res.json({
        message: "Subscription plan retrieved successfully",
        plan,
      });
    } catch (error) {
      console.error("Error fetching subscription plan:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get subscription details
router.get(
  "/subscriptions/:subscriptionId",
  authenticate,
  param("subscriptionId").isUUID().withMessage("Invalid subscription ID"),
  validate,
  async (req: Request, res: Response) => {
    try {
      const { subscriptionId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const subscription = await Subscription.findOne({
        where: {
          id: subscriptionId,
          userId,
        },
        include: [
          {
            model: SubscriptionPlan,
            as: "plan",
            include: [
              {
                model: User,
                as: "creator",
                attributes: ["id", "name", "email"],
              },
            ],
          },
        ],
      });

      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      return res.json({
        message: "Subscription retrieved successfully",
        subscription,
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get creator's subscribers
router.get(
  "/creator/subscribers",
  authenticate,
  paginationValidation,
  validate,
  async (req: Request, res: Response) => {
    try {
      const creatorId = (req as any).user?.id;
      const { page = 1, limit = 20 } = req.query;

      if (!creatorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const offset = (Number(page) - 1) * Number(limit);

      const subscriptions = await Subscription.findAndCountAll({
        include: [
          {
            model: SubscriptionPlan,
            as: "plan",
            where: { creatorId },
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      return res.json({
        message: "Creator subscribers retrieved successfully",
        subscribers: subscriptions.rows,
        pagination: {
          total: subscriptions.count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(subscriptions.count / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Error fetching creator subscribers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
