# ENTRY-15.0 — Stage 3 Dry-Run Report

**Date:** 2026-02-27T06:33 IST
**Branch:** fix/entry-15-import-fix

---

## 1. Dedup Check on Live DB

**Query:**
```sql
SELECT india_party_name, shipment_date, hs_code, port_dest, COUNT(*)
FROM trade_shipments
GROUP BY india_party_name, shipment_date, hs_code, port_dest
HAVING COUNT(*) > 1
LIMIT 5;
```

**Result — Duplicates found in existing 10,000 rows:**

| india_party_name | shipment_date | hs_code | port_dest | count |
|---|---|---|---|---|
| FITTREE INTERNATIONAL LLP | 2025-10-22 | 07133300 | Rotterdam | 2 |
| KVN Impex Pvt Ltd | 2025-10-05 | 39012000 | Cochin Sea | 4 |
| G V M Woven | 2025-10-09 | 39021000 | Reliance Sez | 2 |
| Nexton Foods Pvt Ltd | 2025-10-30 | 07104000 | Jebel Ali | 2 |
| JR ONE KOTHARI FOOTWEAR PRIVATE LIMITED | 2025-10-09 | 39013000 | Madras Sea | 3 |

**Implication:** The existing 10k rows contain duplicates — the dedup constraint does not yet exist in production (only PK exists). The new script will:
1. Auto-create the `trade_shipments_dedup` constraint before inserting
2. Use `ON CONFLICT DO NOTHING` — so re-inserting existing rows is safe

**PM action required before Stage 4:** The constraint must be added to production first. The script does this automatically on first run.

---

## 2. Dry-Run — All VOLZA Files

**Command:**
```bash
python3 scripts/data/import_volza.py --source-dir '/Users/user/Desktop/BMN/Database' --dry-run
```

**Bug fixed during this stage:** Initial direction detection regex used `\bex\b` (word boundaries) which failed on filenames like `3304_Ex_Ind.xlsx` and `Ind_07_Ex.xlsx` (underscores aren't word boundaries in Python regex). Fixed to `(?<![a-z])ex(?![a-z])` — now correctly matches `_Ex_` patterns.

**Results per file:**

| File | Direction | Rows Parsed |
|------|-----------|-------------|
| 07_Ex_Can_Sing.xlsx | export | 1,068 |
| 3304_Ex_Ind.xlsx | export | 32,769 |
| Export Crown Decor.xlsx | export | 1,957 |
| Ind_07_Ex.xlsx | export | 29,625 |
| India_Plastic_Im.xlsx | import | 43,051 |
| Metal Scrap_Product_Import.xlsx | import | 24,478 |
| **TOTAL (6 files)** | | **132,948** |

**Skipped (ambiguous filenames — no Ex/Im/Export/Import pattern):**
- Email_Campaign_07.xlsx — not trade data
- Frozen Food.xlsx
- Frozen Vegetables.xlsx
- HS07 (1).xlsx
- USA_India (1).xlsx
- USA_India39 (1).xlsx
- Vegetables.xlsx

---

## 3. Analysis

| Metric | Value |
|--------|-------|
| Rows from parseable VOLZA files | **132,948** |
| G3 target | 178,083 |
| Gap | 45,135 rows |
| Skipped files | 7 (ambiguous names) |
| Existing rows in DB | 10,000 (with duplicates) |

**132,948 < 178,083 target.** The 45k gap is likely in the 7 skipped files. PM should confirm whether files like `USA_India (1).xlsx`, `Vegetables.xlsx`, `Frozen Food.xlsx` are VOLZA export/import files that need direction assigned manually, or are non-VOLZA data that should be excluded.

---

## 4. Recommendation for Stage 4

Before running the live import, PM to confirm:
1. Should any of the 7 skipped files be force-assigned a direction? (e.g. USA_India = export, Frozen Food = export)
2. Approve adding the dedup constraint to production (script does this automatically) — or run it manually first in Supabase SQL editor:
   ```sql
   ALTER TABLE trade_shipments
     ADD CONSTRAINT trade_shipments_dedup
     UNIQUE (india_party_name, shipment_date, hs_code, port_dest);
   ```
3. If skipped files are confirmed as non-VOLZA, the realistic import target is **132,948 rows** (not 178,083)
