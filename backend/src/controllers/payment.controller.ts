import { Request, Response } from "express";
import Stripe from "stripe";
import { Order, OrderItem, Product, User, PaymentMethod } from "../models";
import { AuthenticatedRequest } from "../types";

// Initialize Stripe
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_development",
  {
    apiVersion: "2025-02-24.acacia",
  }
);

// Create payment intent
export const createPaymentIntent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orderId, currency = "usd" } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get order details
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Order is not in pending status",
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: order.id,
        userId: userId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order payment status
    await order.update({
      paymentStatus: "pending",
    });

    // Store payment intent ID in order notes for reference
    const notesData = order.notes ? JSON.parse(order.notes) : {};
    notesData.paymentIntentId = paymentIntent.id;
    await order.update({ notes: JSON.stringify(notesData) });

    return res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: order.totalAmount,
      },
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
    });
  }
};

// Confirm payment
export const confirmPayment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Payment intent does not belong to this user",
      });
    }

    // Find associated order
    const order = await Order.findByPk(paymentIntent.metadata.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status based on payment status
    let orderStatus:
      | "pending"
      | "confirmed"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled" = "pending";
    let paymentStatus: "pending" | "paid" | "failed" | "refunded" = "pending";

    switch (paymentIntent.status) {
      case "succeeded":
        orderStatus = "processing";
        paymentStatus = "paid";
        break;
      case "requires_payment_method":
      case "canceled":
        orderStatus = "cancelled";
        paymentStatus = "failed";
        break;
      default:
        paymentStatus = "pending";
    }

    // Store payment date in notes if successful
    const notesData = order.notes ? JSON.parse(order.notes) : {};
    if (paymentIntent.status === "succeeded") {
      notesData.paidAt = new Date().toISOString();
    }
    notesData.paymentIntentId = paymentIntent.id;

    await order.update({
      status: orderStatus,
      paymentStatus,
      notes: JSON.stringify(notesData),
    });

    return res.json({
      success: true,
      data: {
        paymentStatus: paymentIntent.status,
        orderStatus,
        order: {
          id: order.id,
          totalAmount: order.totalAmount,
          status: orderStatus,
        },
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
    });
  }
};

// Get payment methods for user
export const getPaymentMethods = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const paymentMethods = await PaymentMethod.findAll({
      where: { userId, isActive: true },
      attributes: { exclude: ["metadata"] },
    });

    return res.json({
      success: true,
      data: { paymentMethods },
    });
  } catch (error) {
    console.error("Error getting payment methods:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get payment methods",
    });
  }
};

// Add payment method
export const addPaymentMethod = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { type, stripePaymentMethodId, isDefault = false } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get payment method details from Stripe
    const stripePaymentMethod = await stripe.paymentMethods.retrieve(
      stripePaymentMethodId
    );

    // If setting as default, update other payment methods
    if (isDefault) {
      await PaymentMethod.update({ isDefault: false }, { where: { userId } });
    }

    // Create payment method record
    const paymentMethod = await PaymentMethod.create({
      userId,
      type,
      provider: "stripe",
      providerPaymentMethodId: stripePaymentMethodId,
      cardLast4: stripePaymentMethod.card?.last4 || undefined,
      cardBrand: stripePaymentMethod.card?.brand || undefined,
      cardExpMonth: stripePaymentMethod.card?.exp_month || undefined,
      cardExpYear: stripePaymentMethod.card?.exp_year || undefined,
      isDefault,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      data: { paymentMethod },
      message: "Payment method added successfully",
    });
  } catch (error) {
    console.error("Error adding payment method:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add payment method",
    });
  }
};

// Stripe webhook handler
export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({
        success: false,
        message: "Webhook secret not configured",
      });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).json({
        success: false,
        message: "Webhook signature verification failed",
      });
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Find order by metadata
        const order = await Order.findByPk(paymentIntent.metadata.orderId);

        if (order) {
          const notesData = order.notes ? JSON.parse(order.notes) : {};
          notesData.paymentIntentId = paymentIntent.id;
          notesData.paidAt = new Date().toISOString();

          await order.update({
            status: "processing",
            paymentStatus: "paid",
            notes: JSON.stringify(notesData),
          });
        }
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;

        // Find order by metadata
        const failedOrder = await Order.findByPk(
          failedPayment.metadata.orderId
        );

        if (failedOrder) {
          const notesData = failedOrder.notes
            ? JSON.parse(failedOrder.notes)
            : {};
          notesData.paymentIntentId = failedPayment.id;

          await failedOrder.update({
            status: "cancelled",
            paymentStatus: "failed",
            notes: JSON.stringify(notesData),
          });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    return res.status(500).json({
      success: false,
      message: "Webhook handling failed",
    });
  }
};

// Refund payment
export const refundPayment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orderId, amount, reason } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get order details
    const order = await Order.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order can be refunded
    const orderNotes = order.notes ? JSON.parse(order.notes) : {};
    const paymentIntentId = orderNotes.paymentIntentId;

    if (!paymentIntentId || order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Order payment cannot be refunded",
      });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
      reason: reason || "requested_by_customer",
      metadata: {
        orderId: order.id,
        userId: userId,
      },
    });

    // Update order status
    orderNotes.refundId = refund.id;
    orderNotes.refundedAt = new Date().toISOString();

    await order.update({
      status: "cancelled",
      paymentStatus: "refunded",
      notes: JSON.stringify(orderNotes),
    });

    return res.json({
      success: true,
      data: {
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          status: refund.status,
        },
      },
      message: "Refund processed successfully",
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process refund",
    });
  }
};
