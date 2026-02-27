import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function PUT(request: Request) {
    const cookieStore = await cookies();

    // 1. Try Manual Auth Session
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
        const { full_name } = await request.json();

        if (!full_name || full_name.trim().length < 2) {
            return NextResponse.json({ error: "Name is too short" }, { status: 400 });
        }

        // Update profiles table
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ full_name })
            .eq('id', userId);

        if (profileError) throw profileError;

        // Also update auth user metadata if needed, but profiles is usually authoritative for display
        // We can also return successfully here

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
