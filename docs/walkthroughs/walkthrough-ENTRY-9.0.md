# Walkthrough: ENTRY-9.0 global_trade_companies Schema

## What changed
Added `globalTradeCompanies` pgTable to `src/lib/db/schema.ts` and created the `0015_global_trade_companies.sql` schema migration with corresponding CREATE TABLE and CREATE INDEX statements.

## Why it was changed
This defines the new global trade intelligence database, fulfilling phase 1 of transforming the BMN platform into a large-scale self-serve data directory instead of a consultancy profile site. 

## How to verify it's working
1. Verify CI builds successfully, which includes formatting/linting schema.ts.
2. Run SQL script directly or wait for PM action (as specified in Ledger "Run SQL migration 015 in Supabase" after merge).
3. The codebase successfully exports the new table.

## How to roll back if it breaks
Revert the PR and drop the table `global_trade_companies` in Supabase. There are no UI dependencies or cascading relations tied to this new table.
