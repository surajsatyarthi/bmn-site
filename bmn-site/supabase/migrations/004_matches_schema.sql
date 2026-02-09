-- Migration: 004_matches_schema.sql
-- Creates matches and match_reveals tables for buyer matching system

-- CREATE ENUM TYPE
DO $$ BEGIN
    CREATE TYPE public.match_status AS ENUM ('new', 'viewed', 'interested', 'dismissed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    counterparty_name TEXT NOT NULL,
    counterparty_country TEXT NOT NULL,
    counterparty_city TEXT,
    matched_products TEXT NOT NULL, -- JSONB as text
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    match_tier TEXT NOT NULL CHECK (match_tier IN ('best', 'great', 'good')),
    score_breakdown TEXT NOT NULL, -- JSONB as text
    match_reasons TEXT NOT NULL, -- JSONB array as text
    match_warnings TEXT, -- JSONB array as text
    status public.match_status NOT NULL DEFAULT 'new',
    revealed BOOLEAN NOT NULL DEFAULT false,
    trade_data TEXT, -- JSONB as text
    counterparty_contact TEXT, -- JSONB as text
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- MATCH REVEALS TABLE
CREATE TABLE IF NOT EXISTS public.match_reveals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    revealed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    month_key TEXT NOT NULL -- Format: '2026-02'
);

-- INDEXES
CREATE INDEX idx_matches_profile_id ON public.matches(profile_id);
CREATE INDEX idx_matches_match_score ON public.matches(match_score);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_match_reveals_profile_id ON public.match_reveals(profile_id);
CREATE INDEX idx_match_reveals_month_key ON public.match_reveals(month_key);
CREATE INDEX idx_match_reveals_profile_month ON public.match_reveals(profile_id, month_key);

-- ROW LEVEL SECURITY
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_reveals ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES: Users can only see/manage their own matches
CREATE POLICY "Users can view their own matches" ON public.matches
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own matches" ON public.matches
    FOR UPDATE USING (auth.uid() = profile_id);

-- Note: INSERT is typically done by system/admin, not user
CREATE POLICY "System can insert matches" ON public.matches
    FOR INSERT WITH CHECK (true);

-- RLS POLICIES: Users can only see/manage their own reveals
CREATE POLICY "Users can view their own reveals" ON public.match_reveals
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own reveals" ON public.match_reveals
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- UPDATED_AT TRIGGER (reuses existing function from 001)
CREATE TRIGGER on_matches_updated
    BEFORE UPDATE ON public.matches
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
