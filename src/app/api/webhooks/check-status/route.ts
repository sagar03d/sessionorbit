import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

        const webhookReceived = !!meeting.recording_url;
        const status = webhookReceived ? 'webhook_received' : 'pending';

        return NextResponse.json({
            meetingId: meeting.id,
            egressId: meeting.egress_id,
            recordingUrl: meeting.recording_url,
            webhookReceived,
            status,
            endedAt: meeting.ended_at,
            createdAt: meeting.created_at,
            message: webhookReceived
                ? 'Webhook received and recording URL saved'
                : 'Waiting for webhook from LiveKit'
        });
    } catch (error: any) {
        console.error('Error checking webhook status:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}
