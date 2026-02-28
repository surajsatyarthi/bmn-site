-- ENTRY-15.0 — trade_shipments table + indexes + dedup constraint
-- Run once in Supabase SQL editor (already applied to production 2026-02-26)

CREATE TABLE IF NOT EXISTS trade_shipments (
  id                    SERIAL PRIMARY KEY,
  shipment_date         DATE NOT NULL,
  hs_code               VARCHAR(10),
  hs_description        TEXT,
  product_desc          TEXT,
  shipper_name          TEXT,
  shipper_address       TEXT,
  shipper_city          TEXT,
  shipper_country       TEXT,
  consignee_name        TEXT,
  consignee_address     TEXT,
  consignee_city        TEXT,
  consignee_country     TEXT,
  notify_party          TEXT,
  india_party_name      TEXT,
  india_party_email     TEXT,
  india_party_phone     TEXT,
  india_party_contact   TEXT,
  india_iec             TEXT,
  quantity              NUMERIC,
  quantity_unit         VARCHAR(30),
  fob_value_usd         NUMERIC,
  cif_value_usd         NUMERIC,
  port_origin           TEXT,
  port_dest             TEXT,
  shipment_mode         TEXT,
  trade_direction       VARCHAR(10),
  source_file           TEXT,
  company_id            INTEGER REFERENCES global_trade_companies(id),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Dedup constraint (required for ON CONFLICT in import_volza.py)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trade_shipments_dedup'
  ) THEN
    ALTER TABLE trade_shipments
      ADD CONSTRAINT trade_shipments_dedup
      UNIQUE (india_party_name, shipment_date, hs_code, port_dest);
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_trade_shipments_india_name  ON trade_shipments(india_party_name);
CREATE INDEX IF NOT EXISTS idx_trade_shipments_india_email ON trade_shipments(india_party_email);
CREATE INDEX IF NOT EXISTS idx_trade_shipments_iec         ON trade_shipments(india_iec);
CREATE INDEX IF NOT EXISTS idx_trade_shipments_hs          ON trade_shipments(hs_code);
CREATE INDEX IF NOT EXISTS idx_trade_shipments_company     ON trade_shipments(company_id);
CREATE INDEX IF NOT EXISTS idx_trade_shipments_date        ON trade_shipments(shipment_date);
