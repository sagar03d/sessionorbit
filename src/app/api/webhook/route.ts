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

  onPaymentSucceeded: async (payload) => {
    console.log("Received onPaymentSucceeded webhook:", payload);
    const data = payload.data as any;
    const { metadata, product_id, customer, amount } = data;
    const registrationId = metadata?.registration_id;

    if (registrationId && product_id === (PAYMENT_CONFIG.productIds.demo || "pdt_demo_class")) {
      const { supabaseAdmin } = await import("@/lib/supabase");

      // 1. Fetch registration details
      const { data: regData, error: fetchError } = await supabaseAdmin
        .from('academy_demo_registrations')
        .select('*')
        .eq('id', registrationId)
        .single();

      if (fetchError || !regData) {
        console.error("Error fetching registration for email:", fetchError);
        return;
      }

      // 2. Update status
      const { error: dbError } = await supabaseAdmin
        .from('academy_demo_registrations')
        .update({
          payment_status: 'completed',
          amount_paid: amount || 100
        })
        .eq('id', registrationId);

      if (dbError) {
        console.error("Error updating registration status after payment:", dbError);
      } else {
        console.log(`Successfully completed registration ${registrationId} after payment.`);

        // 3. Send Confirmation Email
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);

          await resend.emails.send({
            from: 'Sagar from Orbit Academy <onboarding@resend.dev>',
            to: [regData.email],
            subject: '🚀 Mission Confirmed: Your seat is reserved, Cadet!',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
                <h2 style="color: #2d1b69;">🚀 Mission Confirmed: Your seat is reserved, Cadet!</h2>
                <p>Hi ${regData.name},</p>
                <p>Welcome to the crew! We’ve successfully received your $1 Mission Registration for Orbit Academy.</p>
                <p>By joining this demo, you’ve taken the first step in giving <strong>${regData.child_name || 'your child'}</strong> a front-row seat to the future of space exploration.</p>
                
                <h3 style="color: #7b2ff7; margin-top: 30px;">What Happens Next?</h3>
                <p>We keep our demo sessions small (maximum 5 students) to ensure every cadet gets personal interaction with Commander Nova and our interactive flight deck.</p>
                
                <p><strong>The Schedule:</strong> Our mission directors are currently finalizing the flight manifest.</p>
                <p><strong>The Notification:</strong> You will receive a follow-up email within the next 30 days with your specific date and time slot.</p>
                <p><strong>The Gear:</strong> You don't need to install any software! SessionOrbit runs directly in your browser. We’ll send a "Pre-Flight Check" link 24 hours before your session.</p>
                
                <div style="background: #f8f6ff; padding: 20px; border-radius: 10px; border: 1px solid #e0d7ff; margin-top: 30px;">
                  <h3 style="color: #2d1b69; margin-top: 0;">Your Founder’s Bonus 🎁</h3>
                  <p style="margin-bottom: 0;">As promised, because you are one of our First Orbiters, we have already flagged your account for a <strong>$10 credit</strong>. This will be automatically applied to your first month’s subscription if you decide to join the Academy full-time after the demo.</p>
                </div>
                
                <p style="margin-top: 30px;">In the meantime, check out Commander Nova’s latest briefing:<br/>
                <a href="https://www.instagram.com/sessionorbit" style="color: #00f2ff; text-decoration: none; font-weight: bold;">Follow our Mission on Instagram →</a></p>
                
                <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                  Stay tuned, and prepare for liftoff!<br/><br/>
                  <strong>Sagar D.</strong><br/>
                  Founder, SessionOrbit & Orbit Academy
                </p>
              </div>
            `
          });
          console.log(`Confirmation email sent to ${regData.email}`);
        } catch (emailErr) {
          console.error("Failed to send confirmation email:", emailErr);
        }
      }
    }
  },
});
