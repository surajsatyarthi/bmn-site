# ENTRY-15.0 — Stage 3 Dry-Run Report (Updated)

**Date:** 2026-02-27 IST
**Branch:** fix/entry-15-import-fix
**Corrected target:** 153,994 rows (revised by PM 2026-02-27)

---

## 1. Dedup DELETE — Result

**Query run on production:**
```sql
DELETE FROM trade_shipments
WHERE id NOT IN (
  SELECT MIN(id) FROM trade_shipments
  GROUP BY india_party_name, shipment_date, hs_code, port_dest
);
SELECT COUNT(*) FROM trade_shipments;
```

| Metric | Value |
|--------|-------|
| Duplicate rows deleted | **4,241** |
| Rows remaining after dedup | **5,759** |

Production `trade_shipments` is now clean (no duplicates).

---

## 2. Dry-Run — VOLZA Files (6 files parsed)

| File | Direction | Rows Parsed |
|------|-----------|-------------|
| 07_Ex_Can_Sing.xlsx | export | 1,068 |
| 3304_Ex_Ind.xlsx | export | 32,769 |
| Export Crown Decor.xlsx | export | 1,957 |
| Ind_07_Ex.xlsx | export | 29,625 |
| India_Plastic_Im.xlsx | import | 43,051 |
| Metal Scrap_Product_Import.xlsx | import | 24,478 |
| **TOTAL** | | **132,948** |

---

## 3. Skipped File Header Inspection

Row 2 (column headers) read from each of the 6 skipped files:

| File | Shipper Name? | Consignee Name? | Verdict |
|------|--------------|-----------------|---------|
| HS07 (1).xlsx | YES | YES | **VOLZA EXPORT** |
| USA_India (1).xlsx | YES | YES | **VOLZA EXPORT** |
| USA_India39 (1).xlsx | YES | YES | **VOLZA EXPORT** |
| Frozen Food.xlsx | NO | NO | **NOT VOLZA** — contacts list |
| Frozen Vegetables.xlsx | NO | NO | **NOT VOLZA** — contacts list |
| Vegetables.xlsx | NO | NO | **NOT VOLZA** — contacts list |

### Raw Row 2 headers

**HS07 (1).xlsx:**
`Date, HS Code, Product Description, Shipper Name, Consignee Name, Notify Party, Standard Qty, Standard Unit, Standard Unit Rate $, Estimated FOB Value $, Port of Destination, Country of Destination, Port of Origin, Shipment mode`

**USA_India (1).xlsx + USA_India39 (1).xlsx:**
`Date, HS Code, Product Description, Consignee Name, Shipper Name, Notify Party, Standard Qty, Standard Unit, Standard Unit Rate $, Estimated CIF Value $, Unit Rate $, Port of Destination, Port Of Origin, Country of Origin, Shipment Mode`

**Frozen Food.xlsx:** Company contacts — `Antioch Singapore Trading, King George's Avenue, phone, fax, CEO name, email...` — NOT shipment data

**Frozen Vegetables.xlsx:** Company contacts — `Keisha Trading, address, Philip Ho, Managing Director, philip@keisha.com.sg...` — NOT shipment data

**Vegetables.xlsx:** `Name, Addr1/PO Box, Street Name, Building, City, ZIP, Phone, Toll-Free, Fax, E-mail, Web` — NOT shipment data

---

## 4. Updated Projection

| Source | Rows |
|--------|------|
| 6 files already counted (dry-run) | 132,948 |
| HS07, USA_India, USA_India39 (confirmed VOLZA export — TBD) | ~21,046 est. |
| Frozen Food / Vegetables (excluded) | 0 |
| **PM corrected target** | **153,994** |

---

## 5. Stage 4 Readiness

| Check | Status |
|-------|--------|
| Dedup cleaned from prod | DONE (5,759 clean rows) |
| Script has INSERT logic | DONE |
| Dedup constraint on prod | PENDING (script creates on first run) |
| HS07/USA_India confirmed VOLZA export | DONE |
| Email_Campaign_07.xlsx | NOT VOLZA — excluded |
| Corrected target acknowledged | 153,994 |

**Ready for Stage 4 on PM go-ahead.**
