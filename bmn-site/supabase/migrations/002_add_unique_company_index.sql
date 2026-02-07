-- Add unique index for profile_id on companies table (D3 Fix)
CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_profile_id_unique ON public.companies(profile_id);
