import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { getOverageInvoiceEmailHtml } from '@/lib/emails/templates';

const resend = new Resend(process.env.RESEND_API_KEY!);

// Plan Limits & Pricing
const PLAN_LIMITS = {
    free: { hours: 5, reports: 10, overage_price_per_hour: 0, overage_price_per_report: 0 },
    starter: { hours: 25, reports: 25, overage_price_per_hour: 0.80, overage_price_per_report: 0.20 },
    pro: { hours: 100, reports: 100, overage_price_per_hour: 1.25, overage_price_per_report: 0.30 },
    agency: { hours: 400, reports: 400, overage_price_per_hour: 1.10, overage_price_per_report: 0.25 },
    enterprise: { hours: Infinity, reports: Infinity, overage_price_per_hour: 0, overage_price_per_report: 0 },
};

export async function GET(request: Request) {
    // 1. Verify Cron Request (e.g. Vercel Cron Secret)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("Starting monthly billing cron job...");

        // 2. Fetch Organizations that need billing today
        // We look for organizations where the current day matches their billing_cycle_anchor day.
        // For simplicity in a cron, we might just query all orgs in a real production app and filter, or use Postgres EXTRACT.
        // We'll use a direct query here finding orgs whose billing cycle day matches today's day.

        const today = new Date();
        const currentDay = today.getDate();

        // Note: In a robust system you'd handle end-of-month dates (e.g. signed up on 31st, but current month only has 30 days).
        // For this implementation, we will fetch all active organizations and filter in application logic for simplicity and reliability,
        // or write a specific Supabase RPC. We'll fetch all here for safety, assuming small-medium scale.

        const { data: organizations, error: orgsError } = await supabaseAdmin
            .from('organizations')
            .select('id, name, owner_id, subscription_tier, billing_cycle_anchor, classroom_hours_used, ai_scribe_reports_used');

        if (orgsError) throw orgsError;

        let processedCount = 0;
        let invoiceCount = 0;

        for (const org of organizations) {
            if (!org.billing_cycle_anchor) continue;

            const anchorDate = new Date(org.billing_cycle_anchor);
            const anchorDay = anchorDate.getDate();

            // Handle end of month edge cases (e.g., signed up on 31st, today is 30th of a 30-day month)
            const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const targetBillingDay = Math.min(anchorDay, daysInCurrentMonth);

            // Is today their billing day? And is it actually a new month since their anchor? (Avoid running multiple times a day)
            // In a real system you'd track "last_billed_at" to be perfectly safe.
            if (currentDay === targetBillingDay) {
                // Determine limits and overages
                const planId = (org.subscription_tier || 'starter').toLowerCase() as keyof typeof PLAN_LIMITS;
                const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.starter;

                const hoursUsed = parseFloat(org.classroom_hours_used || '0');
                const reportsUsed = parseInt(org.ai_scribe_reports_used || '0');

                let totalAmount = 0;
                let overageHours = 0;
                let overageReports = 0;

                if (hoursUsed > limits.hours) {
                    overageHours = hoursUsed - limits.hours;
                    totalAmount += overageHours * limits.overage_price_per_hour;
                }

                if (reportsUsed > limits.reports) {
                    overageReports = reportsUsed - limits.reports;
                    totalAmount += overageReports * limits.overage_price_per_report;
                }

                // 3. Create Invoice if there are overages
                if (totalAmount > 0) {
                    const billingPeriodStart = new Date(today.getFullYear(), today.getMonth() - 1, targetBillingDay).toISOString();
                    const billingPeriodEnd = today.toISOString();

                    const { data: invoice, error: invoiceError } = await supabaseAdmin
                        .from('invoices')
                        .insert({
                            organization_id: org.id,
                            amount: totalAmount,
                            status: 'pending',
                            billing_period_start: billingPeriodStart,
                            billing_period_end: billingPeriodEnd
                        })
                        .select()
                        .single();

                    if (invoiceError) {
                        console.error(`Error creating invoice for org ${org.id}:`, invoiceError);
                        continue;
                    }

                    invoiceCount++;

                    // 4. Send Email to Owner
                    // Fetch owner email
                    const { data: owner } = await supabaseAdmin
                        .from('profiles')
                        .select('email, full_name')
                        .eq('id', org.owner_id)
                        .single();

                    if (owner?.email) {
                        try {
                            await resend.emails.send({
                                from: 'SessionOrbit Billing <billing@sessionorbit.com>',
                                to: owner.email,
                                subject: `Action Required: Invoice for ${org.name} Overage Usage`,
                                html: getOverageInvoiceEmailHtml({
                                    organizationName: org.name,
                                    ownerName: owner.full_name || 'Customer',
                                    amountData: totalAmount.toFixed(2),
                                    overageHours: overageHours.toFixed(1),
                                    overageReports,
                                    billingPeriod: `${new Date(billingPeriodStart).toLocaleDateString()} - ${today.toLocaleDateString()}`
                                })
                            });
                        } catch (emailError) {
                            console.error(`Error sending invoice email to ${owner.email}:`, emailError);
                        }
                    }
                }

                // 5. Reset Usage for the new month
                const { error: resetError } = await supabaseAdmin
                    .from('organizations')
                    .update({
                        classroom_hours_used: 0,
                        ai_scribe_reports_used: 0
                    })
                    .eq('id', org.id);

                if (resetError) {
                    console.error(`Error resetting usage for org ${org.id}:`, resetError);
                }

                processedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${processedCount} organizations. Created ${invoiceCount} overage invoices.`
        });

    } catch (error: any) {
        console.error("Billing cron job error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
