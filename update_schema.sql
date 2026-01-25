-- Add ended_at to meetings if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meetings' AND column_name = 'ended_at') THEN
        ALTER TABLE public.meetings ADD COLUMN ended_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add scheduled_at to meetings if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meetings' AND column_name = 'scheduled_at') THEN
        ALTER TABLE public.meetings ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Table for Meeting Participants
CREATE TABLE IF NOT EXISTS public.meeting_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for guest users if we support them later
    name TEXT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    left_at TIMESTAMP WITH TIME ZONE,
    talk_time_seconds INTEGER DEFAULT 0,
    role TEXT DEFAULT 'participant'
);

-- Enable RLS
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

-- Policies for Participants
CREATE POLICY "Participants are viewable by everyone in the meeting." ON public.meeting_participants
    FOR SELECT USING (true); -- Simplified for now, ideally strictly filtered by meeting match

CREATE POLICY "Participants can insert themselves." ON public.meeting_participants
    FOR INSERT WITH CHECK (true); -- Allow insertion (client logic controls this)

CREATE POLICY "Participants can update themselves." ON public.meeting_participants
    FOR UPDATE USING (true); -- Simplified

-- Table for Transcriptions
CREATE TABLE IF NOT EXISTS public.meeting_transcriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
    participant_id UUID REFERENCES public.meeting_participants(id) ON DELETE SET NULL, -- Optional link
    speaker_name TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.meeting_transcriptions ENABLE ROW LEVEL SECURITY;

-- Policies for Transcriptions
CREATE POLICY "Transcriptions are viewable by everyone in the meeting." ON public.meeting_transcriptions
    FOR SELECT USING (true);

CREATE POLICY "Participants can insert transcription." ON public.meeting_transcriptions
    FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_participants_meeting_id ON public.meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_transcriptions_meeting_id ON public.meeting_transcriptions(meeting_id);
