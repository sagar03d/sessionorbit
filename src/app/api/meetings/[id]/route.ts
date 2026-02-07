
import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    let userId: string | null = null;

    // 1. Try Manual Auth Cookie
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
        // Fetch everything in parallel for performance
        const [meetingRes, participantsRes, transcriptsRes, summaryRes] = await Promise.all([
            supabaseAdmin.from('meetings').select('*').eq('id', id).single(),
            supabaseAdmin.from('meeting_participants').select('*').eq('meeting_id', id).order('joined_at', { ascending: true }),
            supabaseAdmin.from('meeting_transcriptions').select('*').eq('meeting_id', id).order('timestamp', { ascending: true }),
            supabaseAdmin.from('meeting_summaries').select('*').eq('meeting_id', id).maybeSingle()
        ]);

        if (meetingRes.error) {
            return NextResponse.json({ error: meetingRes.error.message }, { status: 404 });
        }

        // Verify ownership (optional but recommended)
        if (meetingRes.data.host_id !== userId) {
            return NextResponse.json({ error: "Unauthorized access to meeting" }, { status: 403 });
        }

        return NextResponse.json({
            meeting: meetingRes.data,
            participants: participantsRes.data || [],
            transcriptions: transcriptsRes.data || [],
            summary: summaryRes.data
        });

    } catch (error: any) {
        console.error("Error fetching meeting details:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
