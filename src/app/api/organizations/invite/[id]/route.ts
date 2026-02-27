import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: inviteId } = await params;
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

    try {
        // 1. Get Requester's Profile & Org
        const { data: requesterProfile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError || !requesterProfile || !requesterProfile.organization_id) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }

        if (requesterProfile.role !== 'owner' && requesterProfile.role !== 'admin') {
            return NextResponse.json({ error: "Only admins can remove invites" }, { status: 403 });
        }

        const orgId = requesterProfile.organization_id;

        // 2. Fetch Invite to ensure it belongs to the same org
        const { data: invite, error: fetchError } = await supabaseAdmin
            .from('organization_invites')
            .select('*')
            .eq('id', inviteId)
            .single();

        if (fetchError || !invite) {
            return NextResponse.json({ error: "Invite not found" }, { status: 404 });
        }

        if (invite.organization_id !== orgId) {
            return NextResponse.json({ error: "Unauthorized to remove this invite" }, { status: 403 });
        }

        // 3. Delete the Invite
        const { error: deleteError } = await supabaseAdmin
            .from('organization_invites')
            .delete()
            .eq('id', inviteId);

        if (deleteError) throw deleteError;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Remove invite error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
