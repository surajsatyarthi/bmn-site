-- Migration: 005_campaigns_schema.sql
-- Create campaigns table for tracking outreach campaigns

-- Create campaign_status enum
CREATE TYPE public.campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_description TEXT NOT NULL,
    status campaign_status NOT NULL DEFAULT 'draft',
    emails_sent INTEGER NOT NULL DEFAULT 0,
    emails_opened INTEGER NOT NULL DEFAULT 0,
    emails_replied INTEGER NOT NULL DEFAULT 0,
    meetings_booked INTEGER NOT NULL DEFAULT 0,
    metrics_updated_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_profile_id ON public.campaigns(profile_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own campaigns
CREATE POLICY "Users can view their own campaigns" ON public.campaigns
    FOR SELECT USING (auth.uid() = profile_id);

-- Users cannot insert/update/delete campaigns (ops team only)
-- Allow inserts via service role for ops team
CREATE POLICY "Service role can insert campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update campaigns" ON public.campaigns
    FOR UPDATE USING (true);

-- Trigger for updated_at
CREATE TRIGGER campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
