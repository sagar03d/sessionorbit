
import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import { getInviteEmailHtml } from "@/lib/emails/templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    const cookieStore = await cookies();
    // 1. Try Manual Auth Cookie
    const token = cookieStore.get("session_token")?.value;
    let userId = null;

    if (token) {
        const session = await verifySession(token);
        if (session && session.user) {
            userId = session.user.id;
        }
    }

    // 2. Try Supabase Auth Header (Bearer)
    if (!userId) {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const sbToken = authHeader.split(' ')[1];
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(sbToken);
            if (!error && user) {
                userId = user.id;
            }
        }
    }

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role } = await request.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        // 1. Get Requester's Profile
        const { data: requesterProfile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError || !requesterProfile || !requesterProfile.organization_id) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }

        if (requesterProfile.role !== 'owner' && requesterProfile.role !== 'admin') {
            return NextResponse.json({ error: "Only admins can invite members" }, { status: 403 });
        }

        const orgId = requesterProfile.organization_id;

        // Fetch Organization explicitly to avoid nested join mapping issues
        const { data: org, error: orgFetchError } = await supabaseAdmin
            .from('organizations')
            .select('*')
            .eq('id', orgId)
            .single();

        if (orgFetchError || !org) {
            return NextResponse.json({ error: "Organization details not found" }, { status: 404 });
        }

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

        // 4. Send Email
        if (process.env.RESEND_API_KEY) {
            const origin = request.headers.get("origin") || new URL(request.url).origin;
            const inviteUrl = `${origin}/join?token=${inviteToken}`;
            await resend.emails.send({
                from: 'SessionOrbit <no-reply@sessionorbit.com>',
                to: email,
                subject: `You've been invited to join ${org.name} on SessionOrbit`,
                html: getInviteEmailHtml({
                    orgName: org.name,
                    inviterName: requesterProfile.full_name || 'an administrator',
                    role: role || 'teacher',
                    inviteUrl: inviteUrl
                })
            });
            console.log(`[EMAIL COMPLETED] Invite sent to ${email} with token: ${inviteToken}`);
        } else {
            console.log(`[MOCK EMAIL] Invite sent to ${email} with token: ${inviteToken}`);
        }

        return NextResponse.json({ success: true, invite });

    } catch (error: any) {
        console.error("Invite error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
