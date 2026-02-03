-- Helper Functions (Security Definer to bypass RLS)
-- Renamed to v2 to ensure fresh creation with row_security = off

DROP FUNCTION IF EXISTS get_auth_user_org_id() CASCADE;
DROP FUNCTION IF EXISTS get_auth_user_role() CASCADE;

CREATE OR REPLACE FUNCTION get_auth_user_org_id_v2()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
SET row_security = off
STABLE
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION get_auth_user_role_v2()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
SET row_security = off
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 1. Create Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    subscription_tier TEXT DEFAULT 'starter',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own organization" ON public.organizations;
CREATE POLICY "Users can view their own organization"
    ON public.organizations FOR SELECT
    USING (
        auth.uid() = owner_id 
        OR 
        id = get_auth_user_org_id_v2()
    );

DROP POLICY IF EXISTS "Owners can update their organization" ON public.organizations;
CREATE POLICY "Owners can update their organization"
    ON public.organizations FOR UPDATE
    USING (auth.uid() = owner_id);

-- 2. Update Profiles Table
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id),
    ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'teacher'));

-- RLS Update for Profiles
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles in same organization" ON public.profiles;
CREATE POLICY "Users can view profiles in their organization"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = id 
        OR 
        organization_id = get_auth_user_org_id_v2()
    );

-- 3. Create Invites Table
CREATE TABLE IF NOT EXISTS public.organization_invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher')),
    token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- RLS for Invites
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins/Owners can view invites for their org" ON public.organization_invites;
CREATE POLICY "Admins/Owners can view invites for their org"
    ON public.organization_invites FOR SELECT
    USING (
        organization_id = get_auth_user_org_id_v2()
        AND 
        get_auth_user_role_v2() IN ('owner', 'admin')
    );

DROP POLICY IF EXISTS "Admins/Owners can create invites" ON public.organization_invites;
CREATE POLICY "Admins/Owners can create invites"
    ON public.organization_invites FOR INSERT
    WITH CHECK (
        organization_id = get_auth_user_org_id_v2()
        AND 
        get_auth_user_role_v2() IN ('owner', 'admin')
    );

-- 4. Update Meetings Table
ALTER TABLE public.meetings
    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- RLS Update for Meetings
DROP POLICY IF EXISTS "Org Admins view all org meetings" ON public.meetings;
CREATE POLICY "Org Admins view all org meetings"
    ON public.meetings FOR SELECT
    USING (
        organization_id = get_auth_user_org_id_v2()
        AND
        get_auth_user_role_v2() IN ('owner', 'admin')
    );

DROP POLICY IF EXISTS "Users can view their own meetings" ON public.meetings;
CREATE POLICY "Users can view their own meetings"
    ON public.meetings FOR SELECT
    USING (
        host_id = auth.uid()
    );

-- Ensure teachers still see their own (likely covered by existing "host_id = auth.uid()" policy, but explicit check doesn't hurt)
