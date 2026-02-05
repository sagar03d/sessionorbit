import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import crypto from 'crypto';

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
        const { otp, verificationToken } = await request.json();

        if (!otp || !verificationToken) {
            return NextResponse.json({ error: "Missing OTP or token" }, { status: 400 });
        }

        // Verify the token
        let payload;
        try {
            const result = await jwtVerify(verificationToken, SECRET);
            payload = result.payload;
        } catch (e) {
            return NextResponse.json({ error: "Invalid or expired OTP session" }, { status: 400 });
        }

        const { otpHash, newEmail, userId } = payload as any;

        if (userId !== session.user.id) {
            return NextResponse.json({ error: "Session mismatch" }, { status: 403 });
        }

        // Verify OTP match
        const inputHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (inputHash !== otpHash) {
            return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
        }

        // Perform Update
        // 1. Update Auth User
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { email: newEmail, email_confirm: true }
        );

        if (authError) throw authError;

        // 2. Update Profiles table (if it stores email denormalized)
        // Check if profiles has email column (it didn't in my previous task! I fixed a bug where it wasn't there)
        // Wait, the previous task was "error: column profiles_1.email does not exist".
        // SO PROFILES TABLE DOES NOT HAVE EMAIL COLUMN.
        // I should NOT try to update it here.

        // However, I should invalidate the session or rely on the client to re-login?
        // Actually, since we use manual session JWT, we might want to issue a new one or force logout.
        // For security, let's just return success and let client handle it. 
        // Or if we want to be seamless, we update the session cookie?

        // Let's force a signout on client side to be safe/simple for now, as changing email invalidates auth mostly.

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Verify Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
