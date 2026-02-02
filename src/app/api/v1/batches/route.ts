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
    const { supabase, user, error } = await getAuthedClient(req);
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

export async function DELETE(req: NextRequest) {
    const { supabase, user, error, isManual } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Batch ID is required" }, { status: 400 });

    // Verify Ownership via Course
    // We need to know if this batch's course belongs to the user
    const { data: batch } = await supabase!
        .from('batches')
        .select('course_id, courses(user_id)')
        .eq('id', id)
        .single();

    // Check if batch exists and if joined course.user_id matches
    // Note: 'courses' is singular or plural depending on relation name. usually 'courses'.
    // If Supabase typings are strict, we might need 'courses!inner'.
    // Assuming simple relation. If query fails due to relation, we'll fix.

    // Simpler Manual Check:
    // 1. Get Batch -> CourseID
    // 2. Get Course -> UserID (if not using join)
    // Using join is better if configured. Let's try separate generic check to be safe & robust.

    const { data: existingBatch } = await supabase!
        .from('batches')
        .select('course_id')
        .eq('id', id)
        .single();

    if (!existingBatch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    const { data: course } = await supabase!
        .from('courses')
        .select('user_id')
        .eq('id', existingBatch.course_id)
        .single();

    if (!course || course.user_id !== user!.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error: deleteError } = await supabase!
        .from('batches')
        .delete()
        .eq('id', id);

    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

    return NextResponse.json({ success: true });
}
