export function emailHeader() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin-top: 40px;
            margin-bottom: 40px;
        }
        .header {
            background-color: #000000;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 32px 24px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin-top: 16px;
            margin-bottom: 16px;
        }
        .text-sm {
            font-size: 14px;
            color: #6b7280;
        }
        .divider {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 24px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SessionOrbit</h1>
        </div>
        <div class="content">
`;
}

export function emailFooter() {
    return `
        </div>
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                &copy; ${new Date().getFullYear()} SessionOrbit. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
`;
}

export function getInviteEmailHtml({
    orgName,
    inviterName,
    role,
    inviteUrl
}: {
    orgName: string;
    inviterName: string;
    role: string;
    inviteUrl: string;
}) {
    const body = `
        <h2 style="margin-top: 0; color: #111827;">You've been invited!</h2>
        <p>Hello,</p>
        <p>You have been invited by <strong>${inviterName}</strong> to join the organization <strong>${orgName}</strong> on SessionOrbit as a <strong>${role}</strong>.</p>
        <p>Click the button below to accept the invitation and securely join the team:</p>
        
        <div style="text-align: center; margin: 32px 0;">
            <a href="${inviteUrl}" class="button">Join ${orgName}</a>
        </div>
        
        <hr class="divider" />
        
        <p class="text-sm">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${inviteUrl}" style="word-break: break-all; color: #4F46E5;">${inviteUrl}</a>
        </p>
    `;

    return emailHeader() + body + emailFooter();
}
export function getOverageInvoiceEmailHtml({
    organizationName,
    ownerName,
    amountData,
    overageHours,
    overageReports,
    billingPeriod,
}: {
    organizationName: string;
    ownerName: string;
    amountData: string;
    overageHours: string;
    overageReports: number;
    billingPeriod: string;
}): string {
    const hasHours = parseFloat(overageHours) > 0;
    const hasReports = overageReports > 0;
    const body = `
        <h2 style="margin-top: 0; color: #111827;">Action Required: Usage Overage Invoice</h2>
        <p>Hello ${ownerName},</p>
        <p>This is an automatic notification regarding your organization <strong>${organizationName}</strong>. 
        Your monthly billing cycle for the period of <strong>${billingPeriod}</strong> has concluded.</p>
        
        <p>During this period, your usage exceeded the limits of your current subscription plan. Below is the summary of your overages:</p>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 24px 0;">
            <h3 style="margin-top: 0; margin-bottom: 12px; color: #0f172a;">Invoice Summary</h3>
            <hr class="divider" style="margin: 12px 0;" />
            
            ${hasHours ? `
                <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 15px;">
                    <strong>Extra Classroom Hours:</strong>
                    <span>${overageHours} hours</span>
                </div>
            ` : ''}

            ${hasReports ? `
                <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 15px;">
                    <strong>Extra AI Scribe Reports:</strong>
                    <span>${overageReports} reports</span>
                </div>
            ` : ''}

            <hr class="divider" style="margin: 12px 0;" />
            
            <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 18px; font-weight: bold;">
                <span>Total Amount Due:</span>
                <span style="color: #4F46E5;">$${amountData} USD</span>
            </div>
        </div>

        <p>Your usage counters have been reset to zero for the new month. If you have a card on file, it will be automatically charged in the next 3 days. Otherwise, please log in to your dashboard to settle the balance.</p>

        <div style="text-align: center; margin: 32px 0;">
            <a href="https://sessionorbit.com/dashboard/settings" class="button">View Billing Details</a>
        </div>

        <p>If you consistently exceed your limits, we recommend upgrading to a higher tier plan from your billing dashboard to lock in a lower fixed rate.</p>
        <p>Thank you for learning with us,<br />The SessionOrbit Team</p>
    `;

    return emailHeader() + body + emailFooter();
}
