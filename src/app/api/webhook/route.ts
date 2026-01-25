import { Webhooks } from "@dodopayments/nextjs";

export const POST = Webhooks({
  // Fallback to a valid base64 string during build/dev if missing to prevent crash
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY || "SGVsbG9Xb3JsZA==",
  onSubscriptionActive: async (payload) => {
    console.log("Received onSubscriptionActive webhook:", payload);
    // Add your business logic here
  },
  onPaymentSucceeded: async (payload) => {
    console.log("Received onPaymentSucceeded webhook:", payload);
    // Add your business logic here
  },
});
