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
    const batchId = searchParams.get('batchId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let query = supabase!.from('class_schedules').select('*').order('start_time', { ascending: true });

    if (batchId) query = query.eq('batch_id', batchId);
    if (from) query = query.gte('start_time', from);
    if (to) query = query.lte('end_time', to);

    const { data: schedules, error: dbError } = await query;

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ data: schedules });
}

export async function POST(req: NextRequest) {
    const { supabase, error } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const body = await req.json();
        const { batchId, startTime, endTime } = body;

        if (!batchId || !startTime || !endTime) {
            return NextResponse.json({ error: "batchId, startTime, and endTime are required" }, { status: 400 });
        }

        const { data: newSchedule, error: createError } = await supabase!
            .from('class_schedules')
            .insert([{
                batch_id: batchId,
                start_time: startTime,
                end_time: endTime
            }])
            .select()
            .single();

        if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });

        return NextResponse.json({ data: newSchedule });
    } catch (e) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    const { supabase, user, error, isManual } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Schedule ID is required" }, { status: 400 });

    // Verify Ownership via Batch -> Course
    const { data: schedule } = await supabase!
        .from('class_schedules')
        .select('batch_id')
        .eq('id', id)
        .single();

    if (!schedule) return NextResponse.json({ error: "Schedule not found" }, { status: 404 });

    const { data: batch } = await supabase!
        .from('batches')
        .select('course_id')
        .eq('id', schedule.batch_id)
        .single();

    if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    const { data: course } = await supabase!
        .from('courses')
        .select('user_id')
        .eq('id', batch.course_id)
        .single();

    // @ts-ignore
    if (!course || course.user_id !== user!.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error: deleteError } = await supabase!
        .from('class_schedules')
        .delete()
        .eq('id', id);

    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

    return NextResponse.json({ success: true });
}
