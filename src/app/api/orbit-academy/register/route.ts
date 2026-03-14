import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, date, time } = await request.json();

        if (!name || !email || !date || !time) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // 1. Save to Database
        const { error: dbError } = await supabaseAdmin
            .from('academy_demo_registrations')
            .insert([
                { 
                    name, 
                    email, 
                    preferred_date: date, 
                    preferred_time: time 
                }
            ]);

        if (dbError) {
            console.error("Database Error:", dbError);
            return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
        }

        // 2. Send Email Notification
        const emailData = await resend.emails.send({
            from: 'Orbit Academy <onboarding@resend.dev>',
            to: ['sagar03d@gmail.com'],
            subject: `New Demo Class Registration: ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2d1b69;">New Orbit Academy Registration 🚀</h2>
                    <p>A new student has registered for a free demo class.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Preferred Date:</strong> ${date}</p>
                    <p><strong>Preferred Time:</strong> ${time}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
                    <p><small style="color: #888;">This registration was captured from the early-access landing page.</small></p>
                </div>
            `
        });

        if (emailData.error) {
            console.error("Resend Error:", emailData.error);
            // We don't return error here because the DB save succeeded
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Registration API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
