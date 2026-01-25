ALTER TABLE public.meetings 
ADD COLUMN IF NOT EXISTS whiteboard_data JSONB DEFAULT '{}'::jsonb;
