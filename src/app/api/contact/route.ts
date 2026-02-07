
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message, type = 'contact' } = await request.json();

        if (!email || !message) {
            return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
        }

        const subjectMap: Record<string, string> = {
            'contact': 'New Contact Form Submission',
            'support': 'New Support Ticket',
            'newsletter': 'New Newsletter Signup'
        };

        const subject = subjectMap[type] || 'New Message from SessionOrbit';

        // In a real app, you might save to DB first.
        // Sending to sagar03d@gmail.com
        const data = await resend.emails.send({
            from: 'SessionOrbit <onboarding@resend.dev>', // Use verified domain or testing domain
            to: ['sagar03d@gmail.com'],
            subject: `${subject}: ${name || 'Unknown'}`,
            html: `
                <div>
                    <h1>${subject}</h1>
                    <p><strong>From:</strong> ${name || 'N/A'} (${email})</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                    <br/>
                    <p><small>Sent from sessionorbit.com</small></p>
                </div>
            `
        });

        if (data.error) {
            console.error("Resend Error:", data.error);
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
