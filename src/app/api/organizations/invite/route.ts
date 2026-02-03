
import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

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

    const { email, role } = await request.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        // 1. Get Requester's Profile & Org
        const { data: requesterProfile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*, organizations(*)')
            .eq('user_id', session.user.id)
            .single();

        if (profileError || !requesterProfile || !requesterProfile.organization_id) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }

        if (requesterProfile.role !== 'owner' && requesterProfile.role !== 'admin') {
            return NextResponse.json({ error: "Only admins can invite members" }, { status: 403 });
        }

        const org = requesterProfile.organizations;
        const orgId = requesterProfile.organization_id;

        // 2. Check Plan Limits
        const { count: memberCount } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', orgId);

        const { count: inviteCount } = await supabaseAdmin
            .from('organization_invites')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', orgId)
            .eq('status', 'pending');

        const totalSeatsUsed = (memberCount || 1) + (inviteCount || 0); // Include owner
        const limit = org.subscription_tier === 'pro' ? 5 : 1;
        // Note: 'starter' usually implies 1 seat (the owner), so they can't invite anyone?
        // Requirement says: "Solo teachers ($9 plan) are restricted to 1 seat." => They cannot invite.
        // "Pro agencies ($79 plan) can add up to 5 seats."

        if (totalSeatsUsed >= limit) {
            return NextResponse.json({
                error: `Plan limit reached. Your ${org.subscription_tier} plan allows ${limit} seats.`
            }, { status: 403 });
        }

        // 3. Create Invite
        const inviteToken = nanoid(32);
        const { data: invite, error: inviteError } = await supabaseAdmin
            .from('organization_invites')
            .insert([{
                organization_id: orgId,
                email,
                role: role || 'teacher',
                token: inviteToken,
                status: 'pending'
            }])
            .select()
            .single();

        if (inviteError) throw inviteError;

        // 4. Send Email (Mocked)
        // In production, call Resend/SendGrid here.
        console.log(`[MOCK EMAIL] Invite sent to ${email} with token: ${inviteToken}`);

        return NextResponse.json({ success: true, invite });

    } catch (error: any) {
        console.error("Invite error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
