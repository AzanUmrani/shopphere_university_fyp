import { Request, Response } from "express";
import Stripe from "stripe";
import { SubscriptionPlan } from "@/models/SubscriptionPlan";
import { Subscription } from "@/models/Subscription";
import { User } from "@/models/User";
import { Op } from "sequelize";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const stripe =
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY.startsWith("sk_")
    ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia",
      })
    : null;

// Helper function to check if Stripe is available
const checkStripe = () => {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable."
    );
  }
  return stripe;
};

export class SubscriptionController {
  // Create a subscription plan
  static async createPlan(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const {
        name,
        description,
        price,
        currency = "usd",
        features = [],
        duration = "monthly",
      } = req.body;
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Create Stripe product
      const product = await checkStripe().products.create({
        name,
        description,
        metadata: {
          creatorId,
          planType: "subscription",
        },
      });

      // Create Stripe price
      const stripePrice = await checkStripe().prices.create({
        unit_amount: price * 100, // Convert to cents
        currency,
        recurring: {
          interval: duration === "yearly" ? "year" : "month",
        },
        product: product.id,
      });

      // Create subscription plan in database
      const plan = await SubscriptionPlan.create({
        name,
        description,
        price,
        currency,
        duration: duration as "monthly" | "yearly",
        interval: duration as "monthly" | "yearly",
        features,
        creatorId,
        stripeProductId: product.id,
        stripePriceId: stripePrice.id,
        isActive: true,
        subscriberCount: 0,
        currentSubscribers: 0,
        maxSubscribers: undefined,
      });

      res.status(201).json({
        message: "Subscription plan created successfully",
        plan,
      });
    } catch (error: any) {
      console.error("Create plan error:", error);
      res
        .status(500)
        .json({ message: "Failed to create plan", error: error.message });
    }
  }

  // Get creator's subscription plans
  static async getCreatorPlans(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const plans = await SubscriptionPlan.findAll({
        where: { creatorId },
        include: [
          {
            model: Subscription,
            as: "subscriptions",
            include: [
              {
                model: User,
                as: "subscriber",
                attributes: ["id", "firstName", "lastName", "email"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ plans });
    } catch (error: any) {
      console.error("Get creator plans error:", error);
      res
        .status(500)
        .json({ message: "Failed to get plans", error: error.message });
    }
  }

  // Get all available subscription plans
  static async getAvailablePlans(req: Request, res: Response): Promise<void> {
    try {
      const { creatorId, category, minPrice, maxPrice } = req.query;

      const whereClause: any = {
        isActive: true,
      };

      if (creatorId) {
        whereClause.creatorId = creatorId;
      }

      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price[Op.gte] = Number(minPrice);
        if (maxPrice) whereClause.price[Op.lte] = Number(maxPrice);
      }

      const plans = await SubscriptionPlan.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
        order: [["subscriberCount", "DESC"]],
      });

      res.status(200).json({ plans });
    } catch (error: any) {
      console.error("Get available plans error:", error);
      res
        .status(500)
        .json({ message: "Failed to get plans", error: error.message });
    }
  }

  // Subscribe to a plan
  static async subscribe(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { planId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Get subscription plan
      const plan = await SubscriptionPlan.findByPk(planId);
      if (!plan) {
        res.status(404).json({ message: "Subscription plan not found" });
        return;
      }

      if (!plan.isActive) {
        res.status(400).json({ message: "Subscription plan is not active" });
        return;
      }

      // Check if user already has an active subscription to this plan
      const existingSubscription = await Subscription.findOne({
        where: {
          userId,
          planId,
          status: "active",
        },
      });

      if (existingSubscription) {
        res.status(400).json({
          message: "You already have an active subscription to this plan",
        });
        return;
      }

      // Get or create Stripe customer
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      let stripeCustomerId = user.stripeCustomerId;

      if (!stripeCustomerId) {
        const customer = await checkStripe().customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          metadata: {
            userId: user.id,
          },
        });

        stripeCustomerId = customer.id;
        await user.update({ stripeCustomerId });
      }

      // Create Stripe subscription
      const stripeSubscription = await checkStripe().subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: plan.stripePriceId }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      // Create subscription in database
      const subscription = await Subscription.create({
        userId,
        creatorId: plan.creatorId,
        planId,
        amount: plan.price,
        currency: plan.currency,
        interval: plan.duration,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId,
        status: "pending",
        currentPeriodStart: new Date(
          stripeSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          stripeSubscription.current_period_end * 1000
        ),
        cancelAtPeriodEnd: false,
      });

      res.status(201).json({
        message: "Subscription created successfully",
        subscription,
        clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent
          ?.client_secret,
      });
    } catch (error: any) {
      console.error("Subscribe error:", error);
      res.status(500).json({
        message: "Failed to create subscription",
        error: error.message,
      });
    }
  }

  // Get user's subscriptions
  static async getUserSubscriptions(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const subscriptions = await Subscription.findAll({
        where: { userId },
        include: [
          {
            model: SubscriptionPlan,
            as: "plan",
            include: [
              {
                model: User,
                as: "creator",
                attributes: ["id", "firstName", "lastName", "email"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ subscriptions });
    } catch (error: any) {
      console.error("Get user subscriptions error:", error);
      res
        .status(500)
        .json({ message: "Failed to get subscriptions", error: error.message });
    }
  }

  // Cancel subscription
  static async cancelSubscription(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { subscriptionId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const subscription = await Subscription.findOne({
        where: { id: subscriptionId, userId },
      });

      if (!subscription) {
        res.status(404).json({ message: "Subscription not found" });
        return;
      }

      if (subscription.status === "cancelled") {
        res.status(400).json({ message: "Subscription is already cancelled" });
        return;
      }

      if (subscription.stripeSubscriptionId) {
        // Cancel Stripe subscription at period end
        await checkStripe().subscriptions.update(
          subscription.stripeSubscriptionId,
          {
            cancel_at_period_end: true,
          }
        );
      } else {
        // If no Stripe subscription, cancel immediately
        await checkStripe().subscriptions.cancel(
          subscription.stripeSubscriptionId!
        );
      }

      // Update subscription in database
      await subscription.update({
        cancelAtPeriodEnd: true,
        status: "cancelled",
        cancelledAt: new Date(),
      });

      res.status(200).json({
        message: "Subscription cancelled successfully",
        subscription,
      });
    } catch (error: any) {
      console.error("Cancel subscription error:", error);
      res.status(500).json({
        message: "Failed to cancel subscription",
        error: error.message,
      });
    }
  }

  // Handle Stripe webhooks
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const sig = req.headers["stripe-signature"] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      let event: Stripe.Event;

      try {
        event = checkStripe().webhooks.constructEvent(
          req.body,
          sig,
          endpointSecret
        );
      } catch (err: any) {
        console.log(`Webhook signature verification failed.`, err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Handle the event
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
          const stripeSubscription = event.data.object as Stripe.Subscription;
          await SubscriptionController.updateSubscriptionFromStripe(
            stripeSubscription
          );
          break;

        case "customer.subscription.deleted":
          const deletedSubscription = event.data.object as Stripe.Subscription;
          await Subscription.update(
            {
              status: "cancelled",
              cancelledAt: new Date(deletedSubscription.canceled_at! * 1000),
            },
            {
              where: { stripeSubscriptionId: deletedSubscription.id },
            }
          );
          break;

        case "invoice.payment_succeeded":
          const invoice = event.data.object as Stripe.Invoice;
          if (invoice.subscription) {
            await SubscriptionController.handleSuccessfulPayment(invoice);
          }
          break;

        case "invoice.payment_failed":
          const failedInvoice = event.data.object as Stripe.Invoice;
          if (failedInvoice.subscription) {
            await Subscription.update(
              { status: "inactive" },
              {
                where: {
                  stripeSubscriptionId: failedInvoice.subscription as string,
                },
              }
            );
          }
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res
        .status(500)
        .json({ message: "Webhook handling failed", error: error.message });
    }
  }

  // Update subscription plan
  static async updatePlan(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { planId } = req.params;
      const { name, description, price, features, isActive } = req.body;
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const plan = await SubscriptionPlan.findOne({
        where: { id: planId, creatorId },
      });

      if (!plan) {
        res.status(404).json({ message: "Subscription plan not found" });
        return;
      }

      // Update Stripe product if needed
      if (name || description) {
        await checkStripe().products.update(plan.stripeProductId!, {
          name,
          description,
        });
      }

      // Update plan in database
      await plan.update({
        name: name || plan.name,
        description: description || plan.description,
        features: features || plan.features,
        isActive: isActive !== undefined ? isActive : plan.isActive,
      });

      res.status(200).json({
        message: "Subscription plan updated successfully",
        plan,
      });
    } catch (error: any) {
      console.error("Update plan error:", error);
      res
        .status(500)
        .json({ message: "Failed to update plan", error: error.message });
    }
  }

  // Get subscription analytics for creator
  static async getSubscriptionAnalytics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Get total subscribers
      const totalSubscribers = await Subscription.count({
        where: {
          creatorId,
          status: "active",
        },
      });

      // Get total revenue this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyRevenue = await Subscription.sum("amount", {
        where: {
          creatorId,
          status: "active",
          createdAt: {
            [Op.gte]: startOfMonth,
          },
        },
      });

      // Get total revenue this year
      const startOfYear = new Date();
      startOfYear.setMonth(0, 1);
      startOfYear.setHours(0, 0, 0, 0);

      const yearlyRevenue = await Subscription.sum("amount", {
        where: {
          creatorId,
          status: "active",
          createdAt: {
            [Op.gte]: startOfYear,
          },
        },
      });

      // Get subscription plans with subscriber counts
      const plans = await SubscriptionPlan.findAll({
        where: { creatorId },
        include: [
          {
            model: Subscription,
            as: "subscriptions",
            where: { status: "active" },
            required: false,
          },
        ],
      });

      const analytics = {
        totalSubscribers,
        monthlyRevenue: monthlyRevenue || 0,
        yearlyRevenue: yearlyRevenue || 0,
        plans: plans.map((plan) => {
          const planData = plan.toJSON() as any;
          return {
            ...planData,
            activeSubscribers: planData.subscriptions?.length || 0,
          };
        }),
      };

      res.status(200).json({ analytics });
    } catch (error: any) {
      console.error("Get analytics error:", error);
      res
        .status(500)
        .json({ message: "Failed to get analytics", error: error.message });
    }
  }

  // Helper methods
  private static async updateSubscriptionFromStripe(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    await Subscription.update(
      {
        status: stripeSubscription.status as
          | "active"
          | "inactive"
          | "cancelled"
          | "expired"
          | "pending",
        currentPeriodStart: new Date(
          stripeSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          stripeSubscription.current_period_end * 1000
        ),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      },
      {
        where: { stripeSubscriptionId: stripeSubscription.id },
      }
    );
  }

  private static async handleSuccessfulPayment(
    invoice: Stripe.Invoice
  ): Promise<void> {
    await Subscription.update(
      { status: "active" },
      { where: { stripeSubscriptionId: invoice.subscription as string } }
    );
  }
}
