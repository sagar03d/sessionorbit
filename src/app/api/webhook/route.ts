import { Webhooks } from "@dodopayments/nextjs";

export const POST = Webhooks({
  // Fallback if missing or if it's the default placeholder which causes build crash
  webhookKey: (process.env.DODO_PAYMENTS_WEBHOOK_KEY && process.env.DODO_PAYMENTS_WEBHOOK_KEY !== 'your_webhook_key_here')
    ? process.env.DODO_PAYMENTS_WEBHOOK_KEY
    : "SGVsbG9Xb3JsZA==",
  onSubscriptionActive: async (payload) => {
    console.log("Received onSubscriptionActive webhook:", payload);
    const { metadata, product_id, customer, next_billing_date } = payload.data;
    const userId = metadata?.userId;
    const email = customer?.email;

    if (!userId && !email) {
      console.error("No userId or email found in webhook payload");
      return;
    }

    // Map Product IDs to Plan Names
    const planMap: Record<string, string> = {
      'pdt_0NX38bnP007wsa0DDEwb6': 'Pro',
      'pdt_0NX38hVNQLfyPmhCBbvfB': 'Squad'
    };

    const planName = product_id ? planMap[product_id] : 'Free';
    const expiryDate = next_billing_date || null;

    const { supabaseAdmin } = await import("@/lib/supabase");

    // 1. Update Profile (Our primary source for UI state)
    const profileUpdate = userId
      ? supabaseAdmin.from('profiles').update({ plan: planName, plan_expiry: expiryDate }).eq('id', userId)
      : supabaseAdmin.from('profiles').update({ plan: planName, plan_expiry: expiryDate }).eq('email', email);

    // 2. Sync Subscriptions Table (Our source of truth for history/active subs)
    // First find the user if we only have email
    let finalUserId = userId;
    if (!finalUserId && email) {
      const { data: userData } = await supabaseAdmin.from('profiles').select('id').eq('email', email).single();
      finalUserId = userData?.id;
    }

    if (finalUserId) {
      // Upsert into subscriptions
      const { error: subError } = await supabaseAdmin.from('subscriptions').upsert({
        user_id: finalUserId,
        plan_name: planName,
        status: 'active',
        expiry_date: expiryDate,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' }); // Assuming one active sub at a time for now

      if (subError) console.error("Error syncing subscriptions table:", subError);
    }

    const { error: profileError } = await profileUpdate;
    if (profileError) {
      console.error("Error updating user plan in profile:", profileError);
    } else {
      console.log(`Successfully updated plan to ${planName} and expiry to ${expiryDate} for ${userId || email}`);
    }
  },
  onPaymentSucceeded: async (payload) => {
    console.log("Received onPaymentSucceeded webhook:", payload);
    // similar logic could be added for one-time payments if any
  },
});
