
import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Fetch user profile to get role and organization
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role, organization_id')
        .eq('user_id', session.user.id)
        .single();

    const from = parseInt(searchParams.get("from") || "0");
    const to = parseInt(searchParams.get("to") || "9");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = supabaseAdmin
        .from('meetings')
        .select('*, profiles(full_name, email)', { count: 'exact' }); // Join profiles to show who hosted

    // RBAC Logic
    if (profile?.role === 'owner' || profile?.role === 'admin') {
        if (profile.organization_id) {
            // Admin sees all org meetings
            query = query.eq('organization_id', profile.organization_id);
        } else {
            // Fallback for solo admins without org (should have org, but if not, own meetings)
            query = query.eq('host_id', session.user.id);
        }
    } else {
        // Teachers (or others) see only their own
        query = query.eq('host_id', session.user.id);
    }

    query = query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (startDate) {
        query = query.gte('created_at', new Date(startDate).toISOString());
    }
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query = query.lte('created_at', end.toISOString());
    }

    const { data, error, count } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, count });
}

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
        const body = await request.json();
        const { host_code, moderator_code, participant_code, name } = body;

        const { data, error } = await supabaseAdmin
            .from('meetings')
            .insert([
                {
                    host_id: session.user.id,
                    name,
                    host_code,
                    moderator_code,
                    participant_code,
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Create meeting error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
