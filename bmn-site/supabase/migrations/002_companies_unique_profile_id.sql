-- Drop existing non-unique index and replace with unique constraint
DROP INDEX IF EXISTS idx_companies_profile_id;
CREATE UNIQUE INDEX idx_companies_profile_id ON public.companies(profile_id);
