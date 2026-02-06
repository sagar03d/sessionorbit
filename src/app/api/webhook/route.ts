import { Webhooks } from "@dodopayments/nextjs";
import { PAYMENT_CONFIG } from "@/lib/payment-config";

export const POST = Webhooks({
  // Fallback if missing or if it's the default placeholder which causes build crash
  webhookKey: (PAYMENT_CONFIG.webhookKey && PAYMENT_CONFIG.webhookKey !== 'your_webhook_key_here')
    ? PAYMENT_CONFIG.webhookKey
    : "SGVsbG9Xb3JsZA==",
  onSubscriptionActive: async (payload) => {
    console.log("Received onSubscriptionActive webhook:", payload);
    const data = payload.data as any;
    const { metadata, product_id, customer, next_billing_date, id: subscription_id } = data;
    const userId = metadata?.userId;
    const email = customer?.email;

    if (!userId && !email) {
      console.error("No userId or email found in webhook payload");
      return;
    }

    // Map Product IDs to Plan Names
    // We map both the explicit 'starter' ID and the legacy 'squad' ID (if used) to their respective plans.
    const planMap: Record<string, string> = {
      [PAYMENT_CONFIG.productIds.pro!]: 'Pro',
      [PAYMENT_CONFIG.productIds.starter!]: 'Starter',
      // Fallback for legacy keys if they differ
      [PAYMENT_CONFIG.productIds.squad!]: 'Pro'
    };

    const planName = planMap[product_id] || 'Free';
    const expiryDate = next_billing_date || null;

    const { supabaseAdmin } = await import("@/lib/supabase");

    // 1. Update Profile (Our primary source for UI state)
    const profileUpdate = userId
      ? supabaseAdmin.from('profiles').update({ plan: planName, plan_expiry: expiryDate }).eq('id', userId)
      : supabaseAdmin.from('profiles').update({ plan: planName, plan_expiry: expiryDate }).eq('email', email);

    // 2. Sync Subscriptions Table
    let finalUserId = userId;
    if (!finalUserId && email) {
      const { data: userData } = await supabaseAdmin.from('profiles').select('id').eq('email', email).single();
      finalUserId = userData?.id;
    }

    if (finalUserId) {
      const { error: subError } = await supabaseAdmin.from('subscriptions').upsert({
        user_id: finalUserId,
        plan_name: planName,
        status: 'active',
        expiry_date: expiryDate,
        subscription_id: subscription_id,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      if (subError) console.error("Error syncing subscriptions table:", subError);
    }

    const { error: profileError } = await profileUpdate;
    if (profileError) {
      console.error("Error updating user plan in profile:", profileError);
    } else {
      console.log(`Successfully updated plan to ${planName} for ${userId || email}`);
    }
  },

  onSubscriptionCancelled: async (payload) => {
    console.log("Received onSubscriptionCancelled webhook:", payload);
    const data = payload.data as any;
    const { customer, id: subscription_id } = data;
    const email = customer?.email;

    const { supabaseAdmin } = await import("@/lib/supabase");

    // Check if we can find user by email (most reliable if we don't have userId in metadata here)
    if (email) {
      // Downgrade Profile to Free
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'Free', plan_expiry: null })
        .eq('email', email);

      if (profileError) console.error("Error downgrading profile:", profileError);
      else console.log(`Downgraded user ${email} to Free.`);

      // Update Subscription Status
      const { data: userData } = await supabaseAdmin.from('profiles').select('id').eq('email', email).single();
      if (userData?.id) {
        await supabaseAdmin.from('subscriptions')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('user_id', userData.id);
      }
    } else {
      console.error("No email found in cancellation webhook");
    }
  },

  onPaymentFailed: async (payload) => {
    console.error("Payment Failed Webhook Received:", payload);
    const data = payload.data as any;
    const { customer } = data;
    const email = customer?.email;

    // Log it, potentially mark subscription past_due if we had complex logic
    if (email) {
      const { supabaseAdmin } = await import("@/lib/supabase");
      // Find user and update subscription status to 'past_due' or similar if desired
      // For now, implemented as logging to avoid locking out users on soft fails immediately
      console.warn(`Payment failed for user ${email}.`);
    }
  },
});
