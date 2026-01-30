import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";
import OpenAI from "openai";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { roomId, fileUrl } = body;
        // NOTE: If using Supabase Storage events, the body format will differ.
        // For this MVP, we assume the client or a previous step sends `roomId` and `fileUrl`.
        // Alternatively, if passed just `roomId`, we might search for the latest file in the bucket.

        if (!roomId || !fileUrl) {
            return NextResponse.json({ error: "Missing roomId or fileUrl" }, { status: 400 });
        }

        // 1. Setup Clients
        const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const resend = new Resend(process.env.RESEND_API_KEY);

        console.log(`Processing recording for Room ${roomId}...`);

        // 2. Transcribe with Deepgram
        // If fileUrl is a standard bucket URL, it might be private.
        // We attempt to get a signed URL if it's from Supabase Storage.
        let transcriptionUrl = fileUrl;
        if (fileUrl.includes('supabase.co')) {
            try {
                // Extract bucket and path from URL if possible, or just use as is if already signed
                // For now, we'll try to generate a signed URL if it's not already one.
                const urlParts = new URL(fileUrl);
                const pathParts = urlParts.pathname.split('/storage/v1/object/public/');
                if (pathParts.length > 1) {
                    const fullPath = pathParts[1];
                    const firstSlash = fullPath.indexOf('/');
                    const bucket = fullPath.substring(0, firstSlash);
                    const fileKey = fullPath.substring(firstSlash + 1);

                    const { data: signedData } = await supabaseAdmin.storage
                        .from(bucket)
                        .createSignedUrl(fileKey, 3600); // 1 hour

                    if (signedData?.signedUrl) {
                        transcriptionUrl = signedData.signedUrl;
                        console.log("Using signed URL for transcription");
                    }
                }
            } catch (e) {
                console.warn("Failed to generate signed URL, falling back to original URL:", e);
            }
        }

        const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
            { url: transcriptionUrl },
            {
                model: "nova-2",
                smart_format: true,
                diarize: true,
                punctuate: true,
                paragraphs: true,
            }
        );

        if (error) throw error;
        // Result keys: results.channels[0].alternatives[0].transcript
        const transcriptText = result.results?.channels[0]?.alternatives[0]?.transcript || "";

        if (!transcriptText) {
            return NextResponse.json({ message: "No speech detected" });
        }

        console.log("Transcription complete. Length:", transcriptText.length);

        // 3. Summarize with OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert educational assistant. Summarize the following class transcript. Identify the key topics discussed, any homework or action items assigned, and the overall student engagement level. Format the output as clean HTML."
                },
                {
                    role: "user",
                    content: transcriptText
                }
            ]
        });

        const summaryHtml = completion.choices[0].message.content || "<p>No summary generated.</p>";

        // 4. Save to Database
        await supabaseAdmin
            .from("meeting_summaries")
            .insert({
                meeting_id: roomId,
                summary: summaryHtml,
                transcript: result // Store full JSON for advanced usage later
            });

        // 5. Send Email
        // Fetch host email
        const { data: meeting } = await supabaseAdmin
            .from("meetings")
            .select("name, host_id")
            .eq("id", roomId)
            .single();

        let userEmail = "test@example.com"; // Fallback
        if (meeting?.host_id) {
            const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(meeting.host_id);
            if (userData?.user?.email) userEmail = userData.user.email;
        }

        await resend.emails.send({
            from: 'Session Orbit <updates@sessionorbit.com>', // Verify this domain in Resend
            // or use 'onboarding@resend.dev' for testing
            to: userEmail,
            subject: `Class Summary: ${meeting?.name || 'Session'}`,
            html: `
                <h1>Class Summary</h1>
                <p><strong>Class:</strong> ${meeting?.name}</p>
                <hr />
                ${summaryHtml}
                <br />
                <p>Full transcription is available in your dashboard.</p>
            `
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Processing API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
}
