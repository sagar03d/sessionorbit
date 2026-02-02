import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

const getAuthedClient = async (req: NextRequest) => {
    // 1. Try Standard Supabase Auth (Bearer Token)
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) return { supabase, user, isManual: false };
    }

    // 2. Try Manual Auth Cookie
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (sessionToken) {
            const payload = await verifySession(sessionToken);
            if (payload && payload.user) {
                return { supabase: supabaseAdmin, user: payload.user, isManual: true };
            }
        }
    } catch (e) {
        // Ignore cookie errors
    }

    return { error: { message: "Unauthorized", status: 401 } };
};

export async function GET(req: NextRequest) {
    const { supabase, error } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    const { data: courses, error: dbError } = await supabase!
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ data: courses });
}

export async function POST(req: NextRequest) {
    const { supabase, user, error } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const body = await req.json();
        const { name, code } = body;

        if (!name || !code) {
            return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
        }

        const { data: newCourse, error: createError } = await supabase!
            .from('courses')
            .insert([{
                user_id: user!.id,
                name,
                code
            }])
            .select()
            .single();

        if (createError) {
            return NextResponse.json({ error: createError.message }, { status: 500 });
        }

        return NextResponse.json({ data: newCourse });
    } catch (e) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    const { supabase, user, error, isManual } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Course ID is required" }, { status: 400 });

    let query = supabase!.from('courses').delete().eq('id', id);

    // Enforce ownership if manual (or safe redundancy for RLS)
    // Ensure we only delete if it belongs to user
    query = query.eq('user_id', user!.id);

    const { error: deleteError } = await query;

    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

    return NextResponse.json({ success: true });
}
