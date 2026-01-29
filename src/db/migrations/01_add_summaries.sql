-- Create meeting_summaries table
CREATE TABLE IF NOT EXISTS public.meeting_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
    summary TEXT, -- The AI generated summary
    transcript JSONB, -- The full Deepgram JSON output
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.meeting_summaries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Summaries are viewable by meeting host." ON public.meeting_summaries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.meetings
            WHERE id = meeting_summaries.meeting_id
            AND host_id = auth.uid()
        )
    );

-- Add egress_id to meetings to track active cloud recording
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meetings' AND column_name = 'egress_id') THEN
        ALTER TABLE public.meetings ADD COLUMN egress_id TEXT;
    END IF;
    -- Ensure whiteboard_data exists (it is used in frontend)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meetings' AND column_name = 'whiteboard_data') THEN
        ALTER TABLE public.meetings ADD COLUMN whiteboard_data JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;
