import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
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
        const { full_name } = await request.json();

        if (!full_name || full_name.trim().length < 2) {
            return NextResponse.json({ error: "Name is too short" }, { status: 400 });
        }

        // Update profiles table
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ full_name })
            .eq('user_id', session.user.id);

        if (profileError) throw profileError;

        // Also update auth user metadata if needed, but profiles is usually authoritative for display
        // We can also return successfully here

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
