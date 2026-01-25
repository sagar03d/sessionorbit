import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    try {
        // 1. Auth check
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
        }

        // Create Authenticated Client
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
        )

        // Validate Token
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { scheduleId } = body;

        if (!scheduleId) {
            return NextResponse.json({ error: "Missing scheduleId" }, { status: 400 });
        }

        // 2. Check existing schedule for room_code
        // Note: We use the same authenticated client, so RLS must allow reading class_schedules
        const { data: schedule, error: startError } = await supabase
            .from('class_schedules')
            .select('*')
            .eq('id', scheduleId)
            .single();

        if (startError || !schedule) {
            console.error("Schedule Fetch Error", startError);
            return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
        }

        if (schedule.room_code) {
            // Already started
            const { data: existingMeeting } = await supabase
                .from('meetings')
                .select('*')
                .eq('host_code', schedule.room_code)
                .single();

            // Return existing
            return NextResponse.json({
                meeting: existingMeeting,
                hostUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/room/${schedule.room_code}`,
                participantUrl: existingMeeting ? `${process.env.NEXT_PUBLIC_APP_URL || ''}/room/${existingMeeting.participant_code}` : null,
            });
        }

        // 3. Create new meeting
        const hostCode = nanoid(10);
        const participantCode = nanoid(10);
        const moderatorCode = nanoid(10);

        const { data: newMeeting, error } = await supabase
            .from('meetings')
            .insert([{
                host_id: user.id,
                host_code: hostCode,
                participant_code: participantCode,
                moderator_code: moderatorCode,
                name: `Class - ${scheduleId.slice(0, 6)}`,
                is_active: true
            }])
            .select()
            .single();

        if (error) {
            console.error("Error creating meeting:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 4. Update schedule
        const { error: updateError } = await supabase
            .from('class_schedules')
            .update({
                room_code: hostCode,
                status: 'ongoing'
            })
            .eq('id', scheduleId);

        if (updateError) {
            console.error("Error updating schedule:", updateError);
        }

        return NextResponse.json({
            meeting: newMeeting,
            hostUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/room/${newMeeting.host_code}`,
            participantUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/room/${newMeeting.participant_code}`,
        });

    } catch (e) {
        console.error("Internal Error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
