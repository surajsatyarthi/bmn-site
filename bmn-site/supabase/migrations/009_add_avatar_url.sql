-- Migration: 006_add_avatar_url.sql
-- Add avatar_url column to profiles table

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

COMMENT ON COLUMN public.profiles.avatar_url IS 'URL of the user profile picture (from Google or Upload)';
