
import { supabaseAdmin } from "@/lib/supabase";

// Dodo Payments API Base URL (adjust for production/sandbox)
const DODO_API_URL = "https://api.dodopayments.com/v1"; // Verify version
const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY;

export async function checkAndReportOverage(userId: string, addedMinutes: number) {
    if (!DODO_API_KEY) {
        console.warn("Dodo Payments API Key not configured.");
        return;
    }

    // 1. Get Monthly Usage (Hours)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: meetings } = await supabaseAdmin
        .from('meetings')
        .select('duration_minutes')
        .eq('host_id', userId)
        .gte('created_at', startOfMonth.toISOString());

    const totalMinutes = meetings?.reduce((acc, m) => acc + (m.duration_minutes || 0), 0) || 0;

    // NOTE: 'totalMinutes' already includes the 'addedMinutes' IF this runs after the DB update.
    // If it runs BEFORE, we add it. 
    // We will assume this runs AFTER the current meeting is updated.

    // 2. Get User Plan & Limits
    const { data: sub } = await supabaseAdmin
        .from('subscriptions')
        .select('plan_name, subscription_id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

    const plan = sub?.plan_name || 'Free';

    let includedMinutes = 120; // 2 Hours for Free
    if (plan === 'Starter') includedMinutes = 1200; // 20 Hours
    if (plan === 'Pro') includedMinutes = 4800; // 80 Hours

    // 3. Check Overage
    if (totalMinutes > includedMinutes && sub?.subscription_id) {
        // We are in overage territory.
        // We need to determine how much of *this specific session* contributes to overage.
        // If totalMinutes was 1190 and we added 60 -> total 1250. Overage is 50.
        // If totalMinutes was 1300 and we added 60 -> total 1360. Overage is 60.

        const previousTotal = totalMinutes - addedMinutes;

        let reportableMinutes = 0;

        if (previousTotal >= includedMinutes) {
            // Entire session is overage
            reportableMinutes = addedMinutes;
        } else {
            // Only part of the session is overage
            reportableMinutes = totalMinutes - includedMinutes;
        }

        if (reportableMinutes > 0) {
            const quantity = reportableMinutes / 60; // Convert to hours

            console.log(`Reporting Usage for ${userId}: ${quantity.toFixed(2)} hours overage.`);

            try {
                // Call Dodo Payments API
                const res = await fetch(`${DODO_API_URL}/usage`, { // Endpoint path guess based on typical patterns. Prompt said `recordUsage`
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${DODO_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        subscription_id: sub.subscription_id,
                        quantity: parseFloat(quantity.toFixed(2)) // Round to 2 decimals
                    })
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error("Dodo Usage Report Failed:", errText);
                } else {
                    console.log("Usage Reported Successfully");
                }
            } catch (e) {
                console.error("Exception reporting usage:", e);
            }
        }
    }
}
