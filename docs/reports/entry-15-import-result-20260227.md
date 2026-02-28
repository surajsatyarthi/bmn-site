# ENTRY-15.0 — Stage 4 Final Import Result (Option B)

**Date:** 2026-02-27 IST
**Branch:** fix/entry-15-import-fix

## Final Database Count (Option B - No Deduplication)

```sql
SELECT COUNT(*) FROM trade_shipments;
```
**Result:** **154,003 rows**

*Note: The script was executed with Option B (plain INSERT, no `ON CONFLICT` deduplication). The target was ≥ 153,000 rows. The final count matches the combined total of all 9 processed VOLZA files, achieving 100% data retention from the parsed sources.*

---

## Terminal Output (All 4 Passes)

```text
--- OPTION B: PASS 1 ---
Connecting to database...
Connected for plain INSERT (Option B).
[07_Ex_Can_Sing.xlsx] Starting (direction=export, dry_run=False)
[07_Ex_Can_Sing.xlsx] 1000/1000 rows inserted...
[07_Ex_Can_Sing.xlsx] DONE — 1068 rows inserted
[3304_Ex_Ind.xlsx] Starting (direction=export, dry_run=False)
[3304_Ex_Ind.xlsx] 1000/1000 rows inserted...
...
[3304_Ex_Ind.xlsx] 32000/32000 rows inserted...
[3304_Ex_Ind.xlsx] DONE — 32769 rows inserted
[Email_Campaign_07.xlsx] Cannot detect trade direction — skipping.
[Export Crown Decor.xlsx] Starting (direction=export, dry_run=False)
[Export Crown Decor.xlsx] 1000/1000 rows inserted...
[Export Crown Decor.xlsx] DONE — 1957 rows inserted
[Frozen Food.xlsx] Cannot detect trade direction — skipping.
[Frozen Vegetables.xlsx] Cannot detect trade direction — skipping.
[HS07 (1).xlsx] Cannot detect trade direction — skipping.
[Ind_07_Ex.xlsx] Starting (direction=export, dry_run=False)
[Ind_07_Ex.xlsx] 1000/1000 rows inserted...
...
[Ind_07_Ex.xlsx] 29000/29000 rows inserted...
[Ind_07_Ex.xlsx] DONE — 29625 rows inserted
[India_Plastic_Im.xlsx] Starting (direction=import, dry_run=False)
[India_Plastic_Im.xlsx] 1000/1000 rows inserted...
...
[India_Plastic_Im.xlsx] 43000/43000 rows inserted...
[India_Plastic_Im.xlsx] DONE — 43051 rows inserted
[Metal Scrap_Product_Import.xlsx] Starting (direction=import, dry_run=False)
[Metal Scrap_Product_Import.xlsx] 1000/1000 rows inserted...
...
[Metal Scrap_Product_Import.xlsx] 24000/24000 rows inserted...
[Metal Scrap_Product_Import.xlsx] DONE — 24478 rows inserted
[USA_India (1).xlsx] Cannot detect trade direction — skipping.
[USA_India39 (1).xlsx] Cannot detect trade direction — skipping.
[Vegetables.xlsx] Cannot detect trade direction — skipping.

Grand total: 132948 rows inserted across 13 file(s)

--- OPTION B: PASS 2 ---
Connecting to database...
Connected for plain INSERT (Option B).
[HS07 (1).xlsx] Starting (direction=export, dry_run=False)
[HS07 (1).xlsx] 1000/1000 rows inserted...
...
[HS07 (1).xlsx] DONE — 7815 rows inserted

Grand total: 7815 rows inserted across 1 file(s)

--- OPTION B: PASS 3 ---
Connecting to database...
Connected for plain INSERT (Option B).
[USA_India (1).xlsx] Starting (direction=export, dry_run=False)
[USA_India (1).xlsx] 1000/1000 rows inserted...
...
[USA_India (1).xlsx] DONE — 4025 rows inserted

Grand total: 4025 rows inserted across 1 file(s)

--- OPTION B: PASS 4 ---
Connecting to database...
Connected for plain INSERT (Option B).
[USA_India39 (1).xlsx] Starting (direction=export, dry_run=False)
[USA_India39 (1).xlsx] 1000/1000 rows inserted...
...
[USA_India39 (1).xlsx] 9000/9000 rows inserted...
[USA_India39 (1).xlsx] DONE — 9215 rows inserted

Grand total: 9215 rows inserted across 1 file(s)
```

## Readiness
- Target of ≥ 153,000 rows met perfectly (**154,003**).
- NO FATAL errors occurred. All passes exited with code 0.
- All non-VOLZA files correctly skipped.
- Import process is extremely fast via `execute_values` and zero constraint validation overhead.

**Awaiting PM verification and NEXT instructions (e.g. `enrich_from_volza.py`).**
