import { Checkout } from "@dodopayments/nextjs";
import { PAYMENT_CONFIG } from "@/lib/payment-config";

export const GET = Checkout({
  bearerToken: PAYMENT_CONFIG.apiKey!,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: PAYMENT_CONFIG.env,
  type: "static",
});

export const POST = Checkout({
  bearerToken: PAYMENT_CONFIG.apiKey!,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: PAYMENT_CONFIG.env,
  type: "session",
});
