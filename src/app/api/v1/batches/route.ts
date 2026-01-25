import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getAuthedClient = async (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) return { error: { message: "Missing Authorization header", status: 401 } };

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { error: { message: "Unauthorized: Invalid token", status: 401 } };

    return { supabase, user };
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
