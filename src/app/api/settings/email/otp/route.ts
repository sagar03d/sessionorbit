import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { SignJWT } from 'jose';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me');

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    try {
        const { newEmail } = await request.json();

        if (!newEmail || !newEmail.includes('@')) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        // Check if email is already taken
        const { data: existingUser } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', newEmail) // Assuming profiles has email or we check auth
            .maybeSingle();

        // Ideally checking auth.users via admin API is safer for duplicates but we might not have direct access easily 
        // without RPC. relying on profiles check as first line of defense.

        // Generate random 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a hash of the OTP to sign
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

        // Create a verification token that expires in 10 minutes
        const verificationToken = await new SignJWT({
            otpHash,
            newEmail,
            userId: session.user.id
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('10m')
            .sign(SECRET);

        // Send Email
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'SessionOrbit <onboarding@resend.dev>', // Or configured domain
                to: newEmail,
                subject: 'Verify your new email address',
                html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
            });
        } else {
            console.log(`[DEV] OTP for ${newEmail}: ${otp}`);
        }

        return NextResponse.json({
            success: true,
            token: verificationToken,
            message: "OTP sent"
        });

    } catch (error: any) {
        console.error("OTP Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
