-- Add matchmaking fields to companies
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS business_type text DEFAULT 'both' NOT NULL,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS employee_count text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS logo_url text;

-- Create trade_terms table
CREATE TABLE IF NOT EXISTS trade_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  moq text,
  moq_value integer,
  moq_unit text,
  payment_terms jsonb NOT NULL DEFAULT '[]'::jsonb,
  incoterms jsonb NOT NULL DEFAULT '[]'::jsonb,
  lead_time text,
  lead_time_min integer,
  lead_time_max integer,
  port_of_loading text,
  sample_available boolean DEFAULT false,
  sample_lead_time text,
  oem_odm_available boolean DEFAULT false,
  production_capacity text,
  annual_export_volume text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(profile_id)
);
