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
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
            return { supabase, user };
        }
    }

    // 2. Try Manual Auth Cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken) {
        const payload = await verifySession(sessionToken);
        if (payload && payload.user) {
            // Valid manual session. We must use ADMIN client to act on behalf of user (or fetching their data)
            // returning `supabaseAdmin` but user ID context is critical.
            // For RLS-like filtering, the ROUTE handler must append .eq('user_id', user.id).
            // We return `supabaseAdmin` as `supabase` client, but caller must recognize it is ADMIN and filter manually.
            // OR we use `supabaseAdmin` but we trust the route logic.
            return { supabase: supabaseAdmin, user: payload.user, isManual: true };
        }
    }

    return { error: { message: "Unauthorized: Invalid token or session", status: 401 } };
};

export async function GET(req: NextRequest) {
    const { supabase, user, error, isManual } = await getAuthedClient(req);
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    let query = supabase!
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    // Enforce ownership if manual (RLS doesn't apply automatically to admin client)
    // Even for Supabase client, explicit filter is safe.
    if (isManual) {
        query = query.eq('user_id', user!.id);
    }
    // Note: If using standard Supabase client with RLS, the RLS takes care of it, but adding .eq is harmless/redundant.

    const { data: courses, error: dbError } = await query;

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
