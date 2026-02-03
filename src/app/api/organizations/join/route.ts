
import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

    const { token: inviteToken } = await request.json();

    if (!inviteToken) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    try {
        // 1. Verify Invite
        const { data: invite, error: inviteError } = await supabaseAdmin
            .from('organization_invites')
            .select('*')
            .eq('token', inviteToken)
            .single();

        if (inviteError || !invite) {
            return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
        }

        if (invite.status !== 'pending') {
            return NextResponse.json({ error: "Invite already accepted or expired" }, { status: 400 });
        }

        if (new Date(invite.expires_at) < new Date()) {
            return NextResponse.json({ error: "Invite expired" }, { status: 400 });
        }

        // 2. Validate Email (Optional: Strict check if logged in user email matches invite email)
        // For now, we allow the user to accept if they have the token, assuming the token link was secure.
        // But strictly, we should check `session.user.email === invite.email`. (Note: session.user.email might come from session or profile)

        // 3. Update Profile
        // We need to see if the user already belongs to an org. 
        // Logic: Overwrite existing org? Or fail?
        // Let's assume overwrite or they must leave first. Simplest is overwrite.

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
                organization_id: invite.organization_id,
                role: invite.role
            })
            .eq('user_id', session.user.id);

        if (profileError) throw profileError;

        // 4. Mark Invite Accepted
        await supabaseAdmin
            .from('organization_invites')
            .update({ status: 'accepted' })
            .eq('id', invite.id);

        return NextResponse.json({ success: true, organizationId: invite.organization_id });

    } catch (error: any) {
        console.error("Join org error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
