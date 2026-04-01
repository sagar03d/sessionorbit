import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { parentName, email, childName, childAge, date, time } = await request.json();

        if (!parentName || !email || !childName || !childAge || !date || !time) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // 1. Save to Database (Status: Pending)
        const { data: dbData, error: dbError } = await supabaseAdmin
            .from('academy_demo_registrations')
            .insert([
                {
                    name: parentName,
                    email,
                    child_name: childName,
                    child_age: parseInt(childAge),
                    preferred_date: date,
                    preferred_time: time,
                    payment_status: 'pending',
                    amount_paid: 100
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("Database Error:", dbError);
            return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
        }

        // 2. Send Feedback Confirmation Email
        try {
            await resend.emails.send({
                from: 'Orbit Academy <onboarding@resend.dev>',
                to: [email, 'sagar03d@gmail.com'], // Send to both parent and admin
                subject: `🚀 Mission Initiated: Demo Registration for ${childName}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;">
                        <h2 style="color: #2d1b69;">Mission Initiated! 🚀</h2>
                        <p>Hi ${parentName},</p>
                        <p>Your registration for an Orbit Academy demo class has been received. We're excited to have <strong>${childName}</strong> join us!</p>
                        
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #7b2ff7;">Registration Details:</h3>
                            <p style="margin: 5px 0;"><strong>Student Name:</strong> ${childName}</p>
                            <p style="margin: 5px 0;"><strong>Student Age:</strong> ${childAge}</p>
                            <p style="margin: 5px 0;"><strong>Requested Date:</strong> ${date}</p>
                            <p style="margin: 5px 0;"><strong>Requested Time:</strong> ${time}</p>
                        </div>

                        <p>If you haven't completed your $1 payment yet, please follow the instructions on the screen to secure your seat. You will receive a final <strong>Mission Confirmed</strong> email once the payment is processed.</p>
                        
                        <p>Stay tuned for liftoff!</p>
                        <p>— Sagar D.<br/>Founder, Orbit Academy</p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error("Email notification error:", emailErr);
        }

        return NextResponse.json({ success: true, registrationId: dbData.id });
    } catch (error: any) {
        console.error("Registration API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
