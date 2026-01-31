import { NextRequest, NextResponse } from "next/server";
import { EgressClient, EncodedFileOutput, EncodedFileType } from "livekit-server-sdk";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { roomId, action } = body;

        if (!roomId || !action) {
            return NextResponse.json({ error: "Missing roomId or action" }, { status: 400 });
        }

        const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL;
        const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
        const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

        // Use standard S3 credentials that point to Supabase Storage
        // These must be set in your .env
        const S3_ENDPOINT = process.env.S3_ENDPOINT; // e.g. https://<project-ref>.supabase.co/storage/v1/s3
        const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
        const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
        const S3_BUCKET = process.env.S3_BUCKET || "class-recordings";
        const S3_REGION = process.env.S3_REGION || "us-east-1"; // Supabase usually ignores this or uses specific one

        if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
            return NextResponse.json({ error: "LiveKit credentials not configured" }, { status: 500 });
        }

        if (!S3_ENDPOINT || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
            console.warn("S3 credentials missing. Uploding to storage might fail.");
            // We still try, but logging is better
        }

        const egressClient = new EgressClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

        if (action === "START") {
            // 1. Fetch participant_code to construct the join URL
            const { data: meetingData, error: meetingError } = await supabaseAdmin
                .from("meetings")
                .select("participant_code")
                .eq("id", roomId)
                .single();

            if (meetingError || !meetingData) {
                throw new Error("Meeting not found");
            }

            // 2. Generate Access Token for the Recorder
            const { AccessToken } = await import("livekit-server-sdk");
            const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
                identity: `recorder-${roomId}`,
                name: "Recorder",
            });
            at.addGrant({
                roomJoin: true,
                room: roomId,
                canPublish: false,
                canSubscribe: true,
                hidden: true, // Invisible to other users
            });
            const recorderToken = await at.toJwt();

            // 3. Construct the Web Url
            const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sessionorbit.com";
            // Ensure we use the correct route pattern: /room/[code]
            const webUrl = `${BASE_URL}/room/${meetingData.participant_code}?recorder_token=${recorderToken}`;

            console.log("Starting Web Egress on URL:", webUrl);

            const filename = `recording-${roomId}-${Date.now()}.mp4`;

            // Configure Output to S3 (Supabase Storage)
            const fileOutput = new EncodedFileOutput({
                fileType: EncodedFileType.MP4,
                filepath: filename, // Just filename or path/filename
                output: {
                    case: "s3",
                    value: {
                        accessKey: S3_ACCESS_KEY || "",
                        secret: S3_SECRET_KEY || "",
                        region: S3_REGION,
                        endpoint: S3_ENDPOINT,
                        bucket: S3_BUCKET,
                        forcePathStyle: true,
                    }
                }
            });

            // Start Web Egress
            const info = await egressClient.startWebEgress(
                webUrl,
                {
                    file: fileOutput,
                },
                {
                    width: 1920,
                    height: 1080,
                    audioOnly: false,
                    videoOnly: false,
                }
            );

            // Update meeting status with egress_id
            await supabaseAdmin
                .from("meetings")
                .update({ egress_id: info.egressId })
                .eq("id", roomId);

            return NextResponse.json({ success: true, egressId: info.egressId });
        }

        if (action === "STOP") {
            // Find egress_id from DB
            const { data: meeting } = await supabaseAdmin
                .from("meetings")
                .select("egress_id")
                .eq("id", roomId)
                .single();

            if (!meeting?.egress_id) {
                return NextResponse.json({ error: "No active recording found for this meeting" }, { status: 404 });
            }

            const info = await egressClient.stopEgress(meeting.egress_id);

            // Clear egress_id
            await supabaseAdmin
                .from("meetings")
                .update({ egress_id: null })
                .eq("id", roomId);

            // TRIGGER PROCESSING (Optional: Could be done via webhook separately)
            // We can fire-and-forget the processing endpoint here if we know the filename,
            // BUT Egress takes time to upload. Better to rely on Supabase Storage Webhook OR LiveKit Webhook.
            // For MVP simplicty -> We'll assume the user stops it, and we might trigger processing 
            // after a delay or just let the user click "Generate Report".
            // However, the PROMPT said: "Once the tutor clicks 'End Session'... The Flow: Class ends -> Audio saved -> Processing"
            // So arguably we should trigger it here or in the 'end-class' flow.
            // Since we don't have the final file url easily here until it finishes, 
            // We might need to wait for LiveKit's 'EGRESS_COMPLETE' webhook.
            // FOR NOW: We just stop it. The file will appear in Supabase.
            // We'll implement a separate 'Generate Report' button or trigger it via the webhook route I'll build next.

            return NextResponse.json({ success: true, info });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("Recording API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
}
