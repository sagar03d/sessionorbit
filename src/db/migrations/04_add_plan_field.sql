-- Add plan field to profiles table for subscription tier tracking
-- Migration: 04_add_plan_field.sql

ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise'));

-- Add comment
COMMENT ON COLUMN public.profiles.plan IS 'User subscription plan tier';

-- Create index for efficient plan-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
