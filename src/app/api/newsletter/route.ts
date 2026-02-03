
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('newsletter_subscribers')
            .upsert({ email }, { onConflict: 'email' });

        if (error) {
            console.error("Newsletter API Error:", error);
            return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Newsletter API Exception:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
