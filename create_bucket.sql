-- Create the 'class-recordings' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('class-recordings', 'class-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) on the bucket items
-- (Buckets themselves don't typically have RLS enabled via SQL in the same way, the policies apply to storage.objects)

-- Policy: Allow public access to view files (needed for playback)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'class-recordings' );

-- Policy: Allow authenticated uploads (e.g. Service Role or Authenticated Users)
-- For LiveKit Egress (server-side), it usually uses the Service Role Key which bypasses RLS.
-- However, if using customer-provided credentials that map to a user, or if we want to be safe:
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'class-recordings' AND auth.role() = 'authenticated' );

-- Policy: Allow service role to do everything (implicit, but explicit doesn't hurt if RLS is strict)
-- Note: Service role usually bypasses RLS.
