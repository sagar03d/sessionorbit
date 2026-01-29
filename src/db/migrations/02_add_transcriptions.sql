-- Create meeting_transcriptions table
CREATE TABLE IF NOT EXISTS public.meeting_transcriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
    participant_id UUID REFERENCES public.meeting_participants(id) ON DELETE SET NULL,
    speaker_name TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.meeting_transcriptions ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Insert: Allow anyone (guests included) to insert transcriptions.
CREATE POLICY "Allow public insert" ON public.meeting_transcriptions
    FOR INSERT WITH CHECK (true);

-- 2. Select: Host can view all. Participants can view their own meeting's transcriptions.
CREATE POLICY "Hosts and participants can view" ON public.meeting_transcriptions
    FOR SELECT USING (
        -- Is Host
        EXISTS (
            SELECT 1 FROM public.meetings
            WHERE id = meeting_transcriptions.meeting_id
            AND host_id = auth.uid()
        )
        OR
        -- Is Participant (Authenticated)
        EXISTS (
            SELECT 1 FROM public.meeting_participants
            WHERE meeting_id = meeting_transcriptions.meeting_id
            AND user_id = auth.uid()
        )
    );
