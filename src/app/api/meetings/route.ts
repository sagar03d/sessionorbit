
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
