import { verifySession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
    const cookieStore = await cookies();

    // 1. Try Manual Auth Session
    const token = cookieStore.get("session_token")?.value;
    let userId = null;

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
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
        }

        // 1. Check if user already has an org
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('organization_id, plan')
            .eq('id', userId)
            .single();

        if (profile?.organization_id) {
            return NextResponse.json({ error: "User already belongs to an organization" }, { status: 400 });
        }

        const tier = profile?.plan?.toLowerCase() === 'agency' ? 'agency' :
            profile?.plan?.toLowerCase() === 'enterprise' ? 'enterprise' :
                profile?.plan?.toLowerCase() === 'pro' ? 'pro' : 'starter';

        // 2. Create Organization
        const { data: newOrg, error: orgError } = await supabaseAdmin
            .from('organizations')
            .insert([{
                name,
                owner_id: userId,
                subscription_tier: tier
            }])
            .select()
            .single();

        if (orgError) throw orgError;

        // 3. Update Profile with new org id and role
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                organization_id: newOrg.id,
                role: 'owner'
            })
            .eq('id', userId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, organization: newOrg });

    } catch (error: any) {
        console.error("Create organization error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
