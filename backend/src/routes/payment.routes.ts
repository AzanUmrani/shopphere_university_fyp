// import { Router } from "express";
// import { authenticate } from "@/middleware/auth";
// import * as paymentController from "../controllers/payment.controller";
// import { Stripe } from "@stripe/stripe-js";
// import { PaymentMethod } from "@/models";

// const router = Router();

// // Stripe webhook (no authentication required)
// router.post("/webhook", paymentController.handleStripeWebhook);

// // All other payment routes require authentication
// router.use(authenticate);

// // Payment intents
// router.post("/create-intent", paymentController.createPaymentIntent);
// router.post("/confirm", paymentController.confirmPayment);

// // Payment methods
// router.get("/methods", paymentController.getPaymentMethods);
// router.post("/methods", paymentController.addPaymentMethod);

// // Refunds
// router.post("/refund", paymentController.refundPayment);

// // Stripe
// const stripe = require("stripe")(process.env.STRIPE_SECRETE);

// // checkout stripe payment api
// router.post("/create-checkout-session", async (req, res) => {
//     try {
//         const { products } = req.body;

//         const lineItems = products.map((item:any) => ({
//             price_data: {
//                 currency: "usd",
//                 product_data: {
//                     name: item.product.name,
//                     images: [item.product.image],
//                 },
//                 // 1. Fixed Typo: unit_amount
//                 // 2. Fixed Math: Must be in cents (e.g., $10.00 -> 1000)
//                 unit_amount: Math.round(parseFloat(item.product.price) * 100),
//             },
//             quantity: item.quantity,
//         }));

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: lineItems,
//             mode: "payment",
//             // 3. Mandatory URLs (Update these to your frontend URLs)
//             success_url: "http://localhost:5173/checkout/success",
//             cancel_url: "http://localhost:5173/cart",
//         });

//         // 4. Return the ID
//         res.json({ id: session.id });
//     } catch (error) {
//         console.error("Stripe Session Error:", error);
//         res.status(500).json({ 
//             error: "Internal Server Error", 
//             // message: error.message 
//         });
//     }
// });

// export default router;

import express, { Request, Response } from "express";
const Stripe = require("stripe");

const router = express.Router();

router.post("/create-checkout-session", async (req: Request, res: Response): Promise<any> => {
  const secretKey = process.env.STRIPE_SECRETE;

  if (!secretKey) {
    console.error("❌ [BACKEND] STRIPE_SECRETE is missing from .env");
    return res.status(500).json({ error: "Server configuration error." });
  }

  const stripe = new Stripe(secretKey);

  try {
    const { products, taxAmount, shippingCost, shippingName } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Your cart is empty." });
    }

    // 1. Map your frontend cart items
    // We explicitly type this as 'any[]' to avoid strict inference issues during push
    const lineItems: any[] = products.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: item.product.image ? [item.product.image] : [],
          description: item.product.description || "",
        },
        unit_amount: Math.round(parseFloat(item.product.price) * 100),
      },
      quantity: item.quantity,
    }));

    // 2. Add Tax (Providing images and description to satisfy TS)
    if (taxAmount && taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Sales Tax (8%)",
            images: [], 
            description: "State and local taxes", 
          },
          unit_amount: Math.round(taxAmount * 100),
        },
        quantity: 1,
      });
    }

    // 3. Add Shipping (Providing images and description to satisfy TS)
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: shippingName || "Shipping Fees",
            images: [], 
            description: "Standard delivery charges", 
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:"http://localhost:5174/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5174/cart",
    });

    return res.status(200).json({ 
      id: session.id,
      url: session.url 
    });

  } catch (error: any) {
    console.error("❌ [BACKEND] Stripe Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default router;