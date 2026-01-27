
import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        // 1. Fetch Profile
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        // 2. Fetch Subscription
        const { data: subData } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .maybeSingle();

        const activeProfile = {
            ...profile,
            plan: subData?.plan_name || profile?.plan || 'Free',
            plan_expiry: subData?.expiry_date || profile?.plan_expiry
        };

        // 3. Fetch Usage (Meetings this month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count } = await supabaseAdmin
            .from('meetings')
            .select('*', { count: 'exact', head: true })
            .eq('host_id', userId)
            .gte('created_at', startOfMonth.toISOString());

        return NextResponse.json({
            profile: activeProfile,
            usage: count || 0
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
