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
        if (!error && user) return { supabase, user };
    }

    // 2. Try Manual Auth Cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken) {
        const payload = await verifySession(sessionToken);
        if (payload && payload.user) {
            return { supabase: supabaseAdmin, user: payload.user, isManual: true };
        }
    }

    return { error: { message: "Unauthorized", status: 401 } };
};

export async function GET(req: NextRequest) {
    const { supabase, error } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    let query = supabase!.from('batches').select('*').order('created_at', { ascending: false });

    if (courseId) {
        query = query.eq('course_id', courseId);
    }

    const { data: batches, error: dbError } = await query;

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ data: batches });
}

export async function POST(req: NextRequest) {
    const { supabase, error } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const body = await req.json();
        const { name, code, courseId } = body;

        if (!name || !code || !courseId) {
            return NextResponse.json({ error: "Name, code, and courseId are required" }, { status: 400 });
        }

        // Verify Course Ownership if using Manual Auth (Admin Client bypasses RLS)
        // For Standard Auth, RLS handles it, but check doesn't hurt.
        const { data: course } = await supabase!
            .from('courses')
            .select('user_id')
            .eq('id', courseId)
            .single();

        // @ts-ignore
        if (!course || course.user_id !== user!.id) {
            return NextResponse.json({ error: "Unauthorized access to this course" }, { status: 403 });
        }

        const { data: newBatch, error: createError } = await supabase!
            .from('batches')
            .insert([{
                course_id: courseId,
                name,
                code
            }])
            .select()
            .single();

        if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });

        return NextResponse.json({ data: newBatch });
    } catch (e) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
