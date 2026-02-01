import { NextRequest, NextResponse } from "next/server";
import { WebhookReceiver } from "livekit-server-sdk";
import { supabaseAdmin } from "@/lib/supabase";

const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const event = await receiver.receive(body, req.headers.get("Authorization") || "");

        console.log("LiveKit Webhook Received:", event.event);

        if (event.event === "egress_ended") {
            const egressInfo = event.egressInfo;
            if (!egressInfo) return NextResponse.json({ processed: false });

            const roomId = egressInfo.roomName;
            const egressId = egressInfo.egressId;
            const status = String(egressInfo.status);

            console.log(`Egress ${egressId} for Room ${roomId} ended with status ${status}`);
            if (status === 'EGRESS_FAILED') {
                console.error(`Recording failed for Room ${roomId}. Egress ID: ${egressId}`);
            } else if (status === 'EGRESS_COMPLETE') {
                console.log(`Recording completed successfully for Room ${roomId}`);
            }
        }

        if (event.event === "egress_updated" || event.event === "egress_ended") {
            const egressInfo = event.egressInfo as any;
            if (egressInfo?.file?.location) {
                const roomId = egressInfo.roomName;
                let fileUrl = egressInfo.file.location;

                // LiveKit might return just the filename/key for S3
                // If it's not a full URL, we need to construct the Supabase Storage Public URL
                if (!fileUrl.startsWith('http')) {
                    const S3_BUCKET = process.env.S3_BUCKET || "class-recordings";
                    const { data } = supabaseAdmin
                        .storage
                        .from(S3_BUCKET)
                        .getPublicUrl(fileUrl);

                    if (data?.publicUrl) {
                        fileUrl = data.publicUrl;
                    }
                }

                console.log(`Recording available for Room ${roomId}: ${fileUrl}`);

                // Update meeting with recording URL
                await supabaseAdmin
                    .from("meetings")
                    .update({
                        recording_url: fileUrl,
                        egress_id: null // Clear egress_id as it's finished
                    })
                    .eq("id", roomId);

                // Proactively trigger processing
                console.log(`Triggering processing for Room ${roomId} with URL: ${fileUrl}`);
                fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/process-recording`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roomId, fileUrl })
                }).catch(err => {
                    console.error("Failed to trigger process-recording:", err);
                });
            }
        }

        return NextResponse.json({ processed: true });
    } catch (error: any) {
        console.error("LiveKit Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
