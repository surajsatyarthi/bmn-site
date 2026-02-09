SELECT relname, relrowsecurity FROM pg_class JOIN pg_namespace ON pg_naALTER TABLE public.companiesADD COLUMN IF NOT EXISTS last_year_export_usd TEXT,
ADD COLUMN IF NOT EXISTS current_export_countries JSONB,
ADD COLUMN IF NOT EXISTS office_locations JSONB;mespace.oid = pg_class.relnamespace WHERE relname = 'profiles' AND nspname = 'public';