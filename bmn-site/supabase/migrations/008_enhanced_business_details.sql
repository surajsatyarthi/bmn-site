-- Add new fields to companies table for enhanced business details
-- Migration: 007_enhanced_business_details.sql

ALTER TABLE public.companies
ADD COLUMN last_year_export_usd NUMERIC(10, 2), -- USD in millions, e.g., 1.5 = $1.5M
ADD COLUMN current_export_countries JSONB,      -- Array of country codes: ["US", "GB", "DE"]
ADD COLUMN office_locations JSONB;              -- Array of {country, state, city}

-- Add comment for clarity
COMMENT ON COLUMN public.companies.last_year_export_usd IS 'Last year export value in USD millions';
COMMENT ON COLUMN public.companies.current_export_countries IS 'Array of ISO country codes where company currently exports';
COMMENT ON COLUMN public.companies.office_locations IS 'Array of additional office locations: [{country, state, city}]';
