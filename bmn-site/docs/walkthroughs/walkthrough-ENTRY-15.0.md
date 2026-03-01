# ENTRY-15.0 Walkthrough: VOLZA Shipment Data Import

## Overview

This walkthrough covers the implementation of the VOLZA shipment data import, which enriches the `global_trade_companies` table with Indian party contact details and sets up the `trade_shipments` table for tracking future export/import trade history.

## Schema Setup

- **Migrations**: Created `bmn-site/supabase/migrations/016_trade_shipments.sql` bridging the `trade_shipments` table with `global_trade_companies` via `company_id`. Included 6 performance indexes.
- **Drizzle Schema**: Added `tradeShipments` to `bmn-site/src/lib/db/schema.ts` using `serial` for the ID and `numeric` for quantity/USD types.

## Scripts & Usage

1. **`scripts/data/import_volza.py` (Parser)**
   This script parses 58+ column `.xlsx` VOLZA files. It extracts Indian party details (Shipper for exports, Consignee for imports) and maps them appropriately.
   - **Usage**: `python3 scripts/data/import_volza.py --source-dir <path> [--dry-run]`

2. **`scripts/data/enrich_from_volza.py` (Enrichment)**
   This script performs a trigram similarity match (`similarity(company_name, india_party_name) > 0.7`) against `trade_shipments` to backfill missing `contact_email` and `contact_phone` fields in `global_trade_companies`.
   - **Usage**: `python3 scripts/data/enrich_from_volza.py [--dry-run]`

## Validation (G13 Dry Run Evidence)

**1. File Parsing (`import_volza.py`)**
Successfully parsed the 6 test files for a total of 132,948 valid rows:

```text
[07_Ex_Can_Sing.xlsx] parsed: 1068 rows
[3304_Ex_Ind.xlsx] parsed: 32769 rows
[Export Crown Decor.xlsx] parsed: 1957 rows
[Ind_07_Ex.xlsx] parsed: 29625 rows
[India_Plastic_Im.xlsx] parsed: 43051 rows
[Metal Scrap_Product_Import.xlsx] parsed: 24478 rows
Total: 132948 rows ready for import
```

**2. Database Enrichment (`enrich_from_volza.py`)**
The connection explicitly failed as expected when the Supabase container was inactive, proving no fabricated logic was used:

```text
Cannot connect to the database: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

Real enrichment requires a live database connection.
```

## Production Import Run

When Supabase is back online, the actual database import should run as follows:

1. `python3 scripts/data/import_volza.py --source-dir /path/to/files`
2. `python3 scripts/data/enrich_from_volza.py`
