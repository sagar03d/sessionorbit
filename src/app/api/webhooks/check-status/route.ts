import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { EgressClient, EgressStatus } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get('meetingId');
    const egressId = searchParams.get('egressId');

    if (!meetingId && !egressId) {
        return NextResponse.json({
            error: 'meetingId or egressId required'
        }, { status: 400 });
    }

    try {
        let query = supabaseAdmin
            .from('meetings')
            .select('id, recording_url, egress_id, ended_at, created_at');

        if (meetingId) {
            query = query.eq('id', meetingId);
        } else if (egressId) {
            query = query.eq('egress_id', egressId);
        }

        const { data: meeting, error } = await query.single();

        if (error) {
            return NextResponse.json({
                error: 'Meeting not found',
                details: error.message
            }, { status: 404 });
        }

        let recordingUrl = meeting.recording_url;
        let webhookReceived = !!recordingUrl;
        let status = webhookReceived ? 'webhook_received' : 'pending';
        let updated = false;

        // If recording is missing, proactively check LiveKit
        if (!recordingUrl && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET) {
            console.log(`[CheckStatus] Checking LiveKit for meeting ${meeting.id}...`);
            const client = new EgressClient(
                process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
                process.env.LIVEKIT_API_KEY,
                process.env.LIVEKIT_API_SECRET
            );

            try {
                // List egress for this room
                const egressList = await client.listEgress({
                    roomName: meeting.id,
                });

                console.log(`[CheckStatus] Found ${egressList.length} egress items`);

                // Find the most recent COMPLETED egress
                const completedEgress = egressList
                    .filter(e => e.status === EgressStatus.EGRESS_COMPLETE)
                    .sort((a, b) => Number(b.endedAt || 0) - Number(a.endedAt || 0))[0] as any;

                if (completedEgress?.file?.location) {
                    let fileUrl = completedEgress.file.location;
                    console.log(`[CheckStatus] Found completed egress: ${completedEgress.egressId}, URL: ${fileUrl}`);

                    // Generate Public URL if needed
                    if (!fileUrl.startsWith('http')) {
                        const S3_BUCKET = process.env.S3_BUCKET || "class-recordings";
                        const { data } = supabaseAdmin
                            .storage
                            .from(S3_BUCKET)
                            .getPublicUrl(fileUrl);

                        if (data?.publicUrl) fileUrl = data.publicUrl;
                    }

                    // Update Database!
                    await supabaseAdmin
                        .from('meetings')
                        .update({
                            recording_url: fileUrl,
                            egress_id: null // Clear valid egress ID as it's done
                        })
                        .eq('id', meeting.id);

                    recordingUrl = fileUrl;
                    webhookReceived = true;
                    status = 'recovered_from_livekit';
                    updated = true;
                }
            } catch (lkError) {
                console.error("[CheckStatus] LiveKit API Error:", lkError);
            }
        }

        return NextResponse.json({
            meetingId: meeting.id,
            egressId: meeting.egress_id,
            recordingUrl,
            webhookReceived,
            status,
            updated,
            endedAt: meeting.ended_at,
            createdAt: meeting.created_at,
            message: webhookReceived
                ? (updated ? 'Fixed! Retrieved recording from LiveKit' : 'Recording available')
                : 'Waiting for webhook or processing'
        });
    } catch (error: any) {
        console.error('Error checking webhook status:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}
