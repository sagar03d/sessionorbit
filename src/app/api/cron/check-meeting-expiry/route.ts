import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { RoomServiceClient, EgressClient } from "livekit-server-sdk";
import { checkAndReportOverage } from "@/lib/usage";

// Optional: Verify CRON_SECRET if set
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
    // 1. Verify Authentication (if secret is configured)
    if (CRON_SECRET) {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        // 2. Calculate Cutoff Time (30 minutes ago)
        const cutoffTime = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        console.log(`[Cron] Checking for meetings started before ${cutoffTime}`);

        // 3. Find Expired Active Meetings
        const { data: expiredMeetings, error } = await supabaseAdmin
            .from('meetings')
            .select('id, host_id, created_at, egress_id')
            .eq('is_active', true)
            .lt('created_at', cutoffTime);

        if (error) {
            console.error("[Cron] Failed to fetch expired meetings:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!expiredMeetings || expiredMeetings.length === 0) {
            console.log("[Cron] No expired meetings found.");
            return NextResponse.json({ processed: 0, message: "No expired meetings" });
        }

        console.log(`[Cron] Found ${expiredMeetings.length} expired meetings. Terminating...`);

        // Initialize LiveKit Clients
        const roomService = new RoomServiceClient(
            process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
            process.env.LIVEKIT_API_KEY,
            process.env.LIVEKIT_API_SECRET
        );

        const egressClient = new EgressClient(
            process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
            process.env.LIVEKIT_API_KEY,
            process.env.LIVEKIT_API_SECRET
        );

        const results = [];

        // 4. Process Each Meeting
        for (const meeting of expiredMeetings) {
            try {
                console.log(`[Cron] Terminating meeting ${meeting.id}...`);

                // A. Stop Recording (if active)
                if (meeting.egress_id) {
                    try {
                        console.log(`[Cron] Stopping egress ${meeting.egress_id}...`);
                        await egressClient.stopEgress(meeting.egress_id);
                    } catch (err) {
                        console.error(`[Cron] Failed to stop egress for meeting ${meeting.id}`, err);
                        // Continue anyway to close the room
                    }
                }

                // B. Delete Room (Kicks everyone out)
                try {
                    console.log(`[Cron] Deleting room ${meeting.id}...`);
                    await roomService.deleteRoom(meeting.id);
                } catch (err) {
                    // Start: 2026-02-08 20:05:00 - Logic for catching 'room not found' is acceptable
                    console.error(`[Cron] Failed to delete room ${meeting.id} (might be already closed)`, err);
                }

                // C. Update Database
                // Calculate actual duration based on NOW (since we enforce break at 30m, duration is effectively ~30m or slightly more)
                const now = new Date();
                const created = new Date(meeting.created_at);
                const durationMs = now.getTime() - created.getTime();
                const durationMinutes = Math.max(1, Math.ceil(durationMs / 60000));

                const { error: updateError } = await supabaseAdmin
                    .from('meetings')
                    .update({
                        is_active: false,
                        ended_at: now.toISOString(),
                        duration_minutes: durationMinutes,
                        egress_id: null // Clear egress ID
                    })
                    .eq('id', meeting.id);

                if (updateError) {
                    console.error(`[Cron] Failed to update DB for meeting ${meeting.id}`, updateError);
                } else {
                    // D. Report Usage
                    await checkAndReportOverage(meeting.host_id, durationMinutes);
                    console.log(`[Cron] Successfully terminated meeting ${meeting.id}`);
                    results.push({ id: meeting.id, status: 'terminated', duration: durationMinutes });
                }

            } catch (innerErr) {
                console.error(`[Cron] Error processing meeting ${meeting.id}`, innerErr);
                results.push({ id: meeting.id, status: 'error', error: String(innerErr) });
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            results
        });

    } catch (error: any) {
        console.error("[Cron] Internal Server Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
