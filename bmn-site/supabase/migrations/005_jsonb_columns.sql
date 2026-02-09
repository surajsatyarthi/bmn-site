-- Migration: 004_jsonb_columns.sql
-- Convert text columns to jsonb in matches table
-- Data is already valid JSON stored as text

ALTER TABLE public.matches
  ALTER COLUMN matched_products TYPE jsonb USING matched_products::jsonb,
  ALTER COLUMN score_breakdown TYPE jsonb USING score_breakdown::jsonb,
  ALTER COLUMN match_reasons TYPE jsonb USING match_reasons::jsonb,
  ALTER COLUMN match_warnings TYPE jsonb USING match_warnings::jsonb,
  ALTER COLUMN trade_data TYPE jsonb USING trade_data::jsonb,
  ALTER COLUMN counterparty_contact TYPE jsonb USING counterparty_contact::jsonb;
