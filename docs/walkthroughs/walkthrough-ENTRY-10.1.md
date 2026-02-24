# Walkthrough: ENTRY-10.1 — Santander XLS-to-CSV Conversion Pipeline

## What was Changed
- Created `scripts/data/xls_to_csv.py` to convert 194 Santander raw `.xls` and `.xlsx` files into a single consolidated `santander_combined.csv`.
- Added `tests/scripts/data/test_xls_to_csv.py` containing unit tests for pure transformation functions (G6 tests).
- Normalization logic extracts HS chapter from filename, dedupes and pipes products and partner countries, and looks up ISO country codes using `pycountry` with a fallback cache.
- Sample output `santander_sample_50.csv` demonstrates exact match to the proposed DB schema for the next import stage.

## Why it was Changed
- The product's core value relies on Santander data for 4.4M companies. The original dataset sits in 194 split Excel files spanning different formats. The existing `import-santander.ts` script expects a unified CSV. This pipeline automates that extraction, cleans the fields, resolves country codes, and flags missing or blank entries, maintaining high data integrity without crashing.

## How to Verify
- Run `python3 scripts/data/xls_to_csv.py` against the absolute path to the data folder.
- Ensure exit code `0`. (Fails with code `1` only if NULL country code rate > 30%).
- Read the console logs. The final printouts provide a high-level summary. Current successful execution:
  - `Files: 194 | Processed: 190 | Errors: 4` (Corrupt files skipped correctly)
  - `Rows read: 4,409,635 | Written: 4,387,109`
  - `Country lookup failures: 159,924 (3.6% NULL rate)`
- Review the `scripts/data/santander_sample_50.csv` checked into the repository.
- Verify 100% test passing via `python3 tests/scripts/data/test_xls_to_csv.py`.

## Rollback / Recovery
- The script only reads data. It writes output locally to `scripts/data/santander_combined.csv` which is gitignored.
- If data conversion logic needs changing, modify `xls_to_csv.py` and run it again to completely overwrite `santander_combined.csv`.
