-- Add recording_url to meetings to store the final playback link
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meetings' AND column_name = 'recording_url') THEN
        ALTER TABLE public.meetings ADD COLUMN recording_url TEXT;
    END IF;
END $$;
