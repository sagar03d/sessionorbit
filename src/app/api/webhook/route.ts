import { Webhooks } from "@dodopayments/nextjs";

export const POST = Webhooks({
  // Fallback if missing or if it's the default placeholder which causes build crash
  webhookKey: (process.env.DODO_PAYMENTS_WEBHOOK_KEY && process.env.DODO_PAYMENTS_WEBHOOK_KEY !== 'your_webhook_key_here')
    ? process.env.DODO_PAYMENTS_WEBHOOK_KEY
    : "SGVsbG9Xb3JsZA==",
  onSubscriptionActive: async (payload) => {
    console.log("Received onSubscriptionActive webhook:", payload);
    // Add your business logic here
  },
  onPaymentSucceeded: async (payload) => {
    console.log("Received onPaymentSucceeded webhook:", payload);
    // Add your business logic here
  },
});
