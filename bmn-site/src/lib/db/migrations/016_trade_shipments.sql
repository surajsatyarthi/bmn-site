-- Migration 016: trade_shipments for VOLZA data import

CREATE TABLE trade_shipments (
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
  india_party_name      TEXT,    -- the Indian company (shipper on export, consignee on import)
  india_party_email     TEXT,    -- critical: from Shipper Email or Consignee E-mail
  india_party_phone     TEXT,
  india_party_contact   TEXT,    -- contact person name
  india_iec             TEXT,    -- Importer Exporter Code (govt ID)
  quantity              NUMERIC,
  quantity_unit         VARCHAR(30),
  fob_value_usd         NUMERIC,
  cif_value_usd         NUMERIC,
  port_origin           TEXT,
  port_dest             TEXT,
  shipment_mode         TEXT,
  trade_direction       VARCHAR(10),  -- 'export' | 'import'
  source_file           TEXT,
  company_id            UUID REFERENCES global_trade_companies(id),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trade_shipments_india_name  ON trade_shipments(india_party_name);
CREATE INDEX idx_trade_shipments_india_email ON trade_shipments(india_party_email);
CREATE INDEX idx_trade_shipments_iec         ON trade_shipments(india_iec);
CREATE INDEX idx_trade_shipments_hs          ON trade_shipments(hs_code);
CREATE INDEX idx_trade_shipments_company     ON trade_shipments(company_id);
CREATE INDEX idx_trade_shipments_date        ON trade_shipments(shipment_date);
