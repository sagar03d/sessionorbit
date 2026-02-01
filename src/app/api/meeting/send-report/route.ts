
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { meetingId, email } = body;

        if (!meetingId || !email) {
            return NextResponse.json({ error: "Missing meetingId or email" }, { status: 400 });
        }

        // Fetch Summary & Meeting Details
        const { data: summaryData } = await supabaseAdmin
            .from('meeting_summaries')
            .select('summary')
            .eq('meeting_id', meetingId)
            .single();

        if (!summaryData?.summary) {
            return NextResponse.json({ error: "No summary found for this meeting" }, { status: 404 });
        }

        const { data: meeting } = await supabaseAdmin
            .from('meetings')
            .select('name')
            .eq('id', meetingId)
            .single();

        const meetingName = meeting?.name || "Session";

        // Send Email via Resend
        if (!process.env.RESEND_API_KEY) {
            console.warn("RESEND_API_KEY is missing. Mocking success.");
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return NextResponse.json({ success: true, mocked: true });
        }

        const { data, error } = await resend.emails.send({
            from: 'SessionOrbit Reports <reports@sessionorbit.com>', // Update with your verified domain
            to: [email],
            subject: `Session Insight Report: ${meetingName}`,
            html: summaryData.summary,
        });

        if (error) {
            console.error("Resend Error:", error);
            // Return 200 with error details to client if desired, or 500
            // For now, let's treat it as a failure
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error("Send Report Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
