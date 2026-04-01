-- Create academy_demo_registrations table
CREATE TABLE IF NOT EXISTS public.academy_demo_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    child_name TEXT,
    child_age INTEGER,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    amount_paid INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.academy_demo_registrations ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
DROP POLICY IF EXISTS "Service role has full access" ON public.academy_demo_registrations;
CREATE POLICY "Service role has full access"
    ON public.academy_demo_registrations
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Optional: Allow public to insert but not select/update
DROP POLICY IF EXISTS "Anyone can register" ON public.academy_demo_registrations;
CREATE POLICY "Anyone can register"
    ON public.academy_demo_registrations
    FOR INSERT
    WITH CHECK (true);
ALTER TABLE public.academy_demo_registrations 
ADD COLUMN IF NOT EXISTS child_name TEXT,
ADD COLUMN IF NOT EXISTS child_age INTEGER,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS amount_paid INTEGER DEFAULT 0;
