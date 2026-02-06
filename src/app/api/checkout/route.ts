import { Checkout } from "@dodopayments/nextjs";
import { PAYMENT_CONFIG } from "@/lib/payment-config";

export const GET = Checkout({
  bearerToken: PAYMENT_CONFIG.apiKey!,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: PAYMENT_CONFIG.env,
  type: "static",
});

export const POST = Checkout({
  bearerToken: (() => {
    console.log("SERVER CHECKOUT DEBUG:");
    console.log("Environment:", PAYMENT_CONFIG.env);
    console.log("API Key (Live):", process.env.DODO_PAYMENTS_API_KEY_LIVE?.slice(0, 5));
    console.log("API Key (Test):", process.env.DODO_PAYMENTS_API_KEY_TEST?.slice(0, 5));
    console.log("Selected Key:", PAYMENT_CONFIG.apiKey?.slice(0, 5));
    return PAYMENT_CONFIG.apiKey!;
  })(),
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: PAYMENT_CONFIG.env,
  type: "session",
});
