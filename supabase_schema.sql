-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,

  constraint full_name_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a function to handle new user signups
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security modeller;

-- Create a trigger each time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- New meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    participant_code TEXT UNIQUE NOT NULL,
    moderator_code TEXT UNIQUE NOT NULL,
    host_code TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- Set up RLS for meetings
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active meetings by standard select (filtered by code in application logic)
CREATE POLICY "Meetings are viewable by anyone." ON public.meetings
    FOR SELECT USING (is_active = true);

-- Only authenticated users can create meetings
CREATE POLICY "Authenticated users can create meetings." ON public.meetings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only hosts can update or delete their own meetings
CREATE POLICY "Hosts can update their own meetings." ON public.meetings
    FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own meetings." ON public.meetings
    FOR DELETE USING (auth.uid() = host_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetings_participant_code ON public.meetings(participant_code);
CREATE INDEX IF NOT EXISTS idx_meetings_moderator_code ON public.meetings(moderator_code);
CREATE INDEX IF NOT EXISTS idx_meetings_host_code ON public.meetings(host_code);
