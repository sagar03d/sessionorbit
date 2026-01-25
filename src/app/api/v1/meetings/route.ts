import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

// Helper to get authenticated supabase client
const getAuthedClient = async (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return { error: { message: "Missing Authorization header", status: 401 } };
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return { error: { message: "Unauthorized: Invalid token", status: 401 } };
    }

    return { supabase, user };
};

export async function GET(req: NextRequest) {
    const { supabase, error } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    const { data: meetings, error: dbError } = await supabase!
        .from('meetings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ data: meetings });
}

export async function POST(req: NextRequest) {
    const { supabase, user, error } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const body = await req.json();
        const { name } = body;

        const hostCode = nanoid(10);
        const participantCode = nanoid(10);
        const moderatorCode = nanoid(10);

        const { data: newMeeting, error: createError } = await supabase!
            .from('meetings')
            .insert([{
                host_id: user!.id,
                host_code: hostCode,
                participant_code: participantCode,
                moderator_code: moderatorCode,
                name: name || `Meeting ${new Date().toLocaleDateString()}`,
                is_active: true
            }])
            .select()
            .single();

        if (createError) {
            return NextResponse.json({ error: createError.message }, { status: 500 });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

        return NextResponse.json({
            data: {
                ...newMeeting,
                urls: {
                    host: `${appUrl}/room/${hostCode}`,
                    participant: `${appUrl}/room/${participantCode}`,
                    moderator: `${appUrl}/room/${moderatorCode}`
                }
            }
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
