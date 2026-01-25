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
