-- Migration 015: Create global_trade_companies table
-- Source: ENTRY-9.0 blueprint (PROJECT_LEDGER.md)

CREATE TABLE IF NOT EXISTS global_trade_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  country_code CHAR(2),
  country_name TEXT,
  hs_chapter CHAR(2),
  hs_description TEXT,
  trade_type TEXT CHECK (trade_type IN ('importer', 'exporter', 'both')),
  top_products TEXT[],
  partner_countries TEXT[],
  contact_email TEXT,
  contact_phone TEXT,
  data_source TEXT DEFAULT 'santander',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gtc_country ON global_trade_companies(country_code);
CREATE INDEX IF NOT EXISTS idx_gtc_hs ON global_trade_companies(hs_chapter);
CREATE INDEX IF NOT EXISTS idx_gtc_name ON global_trade_companies USING gin(to_tsvector('english', company_name));
