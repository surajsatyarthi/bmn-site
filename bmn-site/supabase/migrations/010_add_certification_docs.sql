-- Migration: 010_add_certification_docs.sql
-- Add certification_docs column to profiles table

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS certification_docs JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.profiles.certification_docs is 'List of uploaded certification documents';
