import os
import sys
import csv
import logging
import re
from pathlib import Path

import warnings
warnings.filterwarnings('ignore', category=UserWarning, module='xlrd')

import xlrd
import openpyxl
import pycountry

logging.basicConfig(level=logging.INFO, format="%(message)s")

HS_CHAPTER_DICT = {
    "01": "Live animals",
    "02": "Meat and edible meat offal",
    "03": "Fish and crustaceans, molluscs and other aquatic invertebrates",
    "04": "Dairy produce; birds' eggs; natural honey; edible products of animal origin, not elsewhere specified or included",
    "05": "Products of animal origin, not elsewhere specified or included",
    "06": "Live trees and other plants; bulbs, roots and the like; cut flowers and ornamental foliage",
    "07": "Edible vegetables and certain roots and tubers",
    "08": "Edible fruit and nuts; peel of citrus fruit or melons",
    "09": "Coffee, tea, maté and spices",
    "10": "Cereals",
    "11": "Products of the milling industry; malt; starches; inulin; wheat gluten",
    "12": "Oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit; industrial or medicinal plants; straw and fodder",
    "13": "Lac; gums, resins and other vegetable saps and extracts",
    "14": "Vegetable plaiting materials; vegetable products not elsewhere specified or included",
    "15": "Animal or vegetable fats and oils and their cleavage products; prepared edible fats; animal or vegetable waxes",
    "16": "Preparations of meat, of fish or of crustaceans, molluscs or other aquatic invertebrates",
    "17": "Sugars and sugar confectionery",
    "18": "Cocoa and cocoa preparations",
    "19": "Preparations of cereals, flour, starch or milk; pastrycooks' products",
    "20": "Preparations of vegetables, fruit, nuts or other parts of plants",
    "21": "Miscellaneous edible preparations",
    "22": "Beverages, spirits and vinegar",
    "23": "Residues and waste from the food industries; prepared animal fodder",
    "24": "Tobacco and manufactured tobacco substitutes",
    "25": "Salt; sulphur; earths and stone; plastering materials, lime and cement",
    "26": "Ores, slag and ash",
    "27": "Mineral fuels, mineral oils and products of their distillation; bituminous substances; mineral waxes",
    "28": "Inorganic chemicals; organic or inorganic compounds of precious metals, of rare-earth metals, of radioactive elements or of isotopes",
    "29": "Organic chemicals",
    "30": "Pharmaceutical products",
    "31": "Fertilisers",
    "32": "Tanning or dyeing extracts; tannins and their derivatives; dyes, pigments and other colouring matter; paints and varnishes; putty and other mastics; inks",
    "33": "Essential oils and resinoids; perfumery, cosmetic or toilet preparations",
    "34": "Soap, organic surface-active agents, washing preparations, lubricating preparations, artificial waxes, prepared waxes, polishing or scouring preparations, candles and similar articles, modelling pastes, \"dental waxes\" and dental preparations with a basis of plaster",
    "35": "Albuminoidal substances; modified starches; glues; enzymes",
    "36": "Explosives; pyrotechnic products; matches; pyrophoric alloys; certain combustible preparations",
    "37": "Photographic or cinematographic goods",
    "38": "Miscellaneous chemical products",
    "39": "Plastics and articles thereof",
    "40": "Rubber and articles thereof",
    "41": "Raw hides and skins (other than furskins) and leather",
    "42": "Articles of leather; saddlery and harness; travel goods, handbags and similar containers; articles of animal gut (other than silk-worm gut)",
    "43": "Furskins and artificial fur; manufactures thereof",
    "44": "Wood and articles of wood; wood charcoal",
    "45": "Cork and articles of cork",
    "46": "Manufactures of straw, of esparto or of other plaiting materials; basketware and wickerwork",
    "47": "Pulp of wood or of other fibrous cellulosic material; recovered (waste and scrap) paper or paperboard",
    "48": "Paper and paperboard; articles of paper pulp, of paper or of paperboard",
    "49": "Printed books, newspapers, pictures and other products of the printing industry; manuscripts, typescripts and plans",
    "50": "Silk",
    "51": "Wool, fine or coarse animal hair; horsehair yarn and woven fabric",
    "52": "Cotton",
    "53": "Other vegetable textile fibres; paper yarn and woven fabrics of paper yarn",
    "54": "Man-made filaments; strip and the like of man-made textile materials",
    "55": "Man-made staple fibres",
    "56": "Wadding, felt and nonwovens; special yarns; twine, cordage, ropes and cables and articles thereof",
    "57": "Carpets and other textile floor coverings",
    "58": "Special woven fabrics; tufted textile fabrics; lace; tapestries; trimmings; embroidery",
    "59": "Impregnated, coated, covered or laminated textile fabrics; textile articles of a kind suitable for industrial use",
    "60": "Knitted or crocheted fabrics",
    "61": "Articles of apparel and clothing accessories, knitted or crocheted",
    "62": "Articles of apparel and clothing accessories, not knitted or crocheted",
    "63": "Other made-up textile articles; sets; worn clothing and worn textile articles; rags",
    "64": "Footwear, gaiters and the like; parts of such articles",
    "65": "Headgear and parts thereof",
    "66": "Umbrellas, sun umbrellas, walking-sticks, seat-sticks, whips, riding-crops and parts thereof",
    "67": "Prepared feathers and down and articles made of feathers or of down; artificial flowers; articles of human hair",
    "68": "Articles of stone, plaster, cement, asbestos, mica or similar materials",
    "69": "Ceramic products",
    "70": "Glass and glassware",
    "71": "Natural or cultured pearls, precious or semi-precious stones, precious metals, metals clad with precious metal and articles thereof; imitation jewellery; coin",
    "72": "Iron and steel",
    "73": "Articles of iron or steel",
    "74": "Copper and articles thereof",
    "75": "Nickel and articles thereof",
    "76": "Aluminium and articles thereof",
    "77": "(Reserved for possible future use in the Harmonized System)",
    "78": "Lead and articles thereof",
    "79": "Zinc and articles thereof",
    "80": "Tin and articles thereof",
    "81": "Other base metals; cermets; articles thereof",
    "82": "Tools, implements, cutlery, spoons and forks, of base metal; parts thereof of base metal",
    "83": "Miscellaneous articles of base metal",
    "84": "Nuclear reactors, boilers, machinery and mechanical appliances; parts thereof",
    "85": "Electrical machinery and equipment and parts thereof; sound recorders and reproducers, television image and sound recorders and reproducers, and parts and accessories of such articles",
    "86": "Railway or tramway locomotives, rolling-stock and parts thereof; railway or tramway track fixtures and fittings and parts thereof; mechanical (including electro-mechanical) traffic signalling equipment of all kinds",
    "87": "Vehicles other than railway or tramway rolling-stock, and parts and accessories thereof",
    "88": "Aircraft, spacecraft, and parts thereof",
    "89": "Ships, boats and floating structures",
    "90": "Optical, photographic, cinematographic, measuring, checking, precision, medical or surgical instruments and apparatus; parts and accessories thereof",
    "91": "Clocks and watches and parts thereof",
    "92": "Musical instruments; parts and accessories of such articles",
    "93": "Arms and ammunition; parts and accessories thereof",
    "94": "Furniture; bedding, mattresses, mattress supports, cushions and similar stuffed furnishings; lamps and lighting fittings, not elsewhere specified or included; illuminated signs, illuminated name-plates and the like; prefabricated buildings",
    "95": "Toys, games and sports requisites; parts and accessories thereof",
    "96": "Miscellaneous manufactured articles",
    "97": "Works of art, collectors' pieces and antiques"
}

country_cache = {}

class Stats:
    def __init__(self):
        self.processed_files = 0
        self.error_files = 0
        self.rows_read = 0
        self.rows_written = 0
        self.skipped_blank_name = 0
        self.skipped_trade_data = 0
        self.lookup_failures = 0
        self.sample_rows = []

def extract_chapter(filename: str) -> str:
    match = re.search(r'(?i)ch_(\d+)', filename)
    if match:
        return str(match.group(1)).zfill(2)
    return ""

def strip_hs_prefix(product_text: str) -> str:
    if not product_text:
        return ""
    text = str(product_text).strip()
    if " - " in text:
        return text.split(" - ", 1)[1].strip()
    return text

def derive_trade_type(import_products: list, export_products: list) -> str:
    has_imports = any(p and str(p).strip() for p in import_products)
    has_exports = any(p and str(p).strip() for p in export_products)
    
    if has_imports and has_exports:
        return "both"
    if has_imports:
        return "importer"
    if has_exports:
        return "exporter"
    return None

def build_pipe_list(items: list) -> str:
    seen = set()
    valid_items = []
    for item in items:
        if item is not None and str(item).strip():
            stripped = str(item).strip()
            if stripped not in seen:
                seen.add(stripped)
                valid_items.append(stripped)
    return "|".join(valid_items[:6])

def normalize_country(name: str) -> str:
    cleaned = re.sub(r'\s*\([^)]*\)', '', name).strip()
    return cleaned

def get_country_code(name: str):
    if not name:
        return None
    name = str(name).strip()
    if not name:
        return None
        
    if name in country_cache:
        return country_cache[name]
    
    cleaned = normalize_country(name)
    try:
        results = pycountry.countries.search_fuzzy(cleaned)
        if results:
            code = results[0].alpha_2
            country_cache[name] = code
            return code
    except Exception:
        pass
    
    country_cache[name] = None
    return None

def process_file(file_path: Path, writer, stats: Stats):
    filename = file_path.name
    hs_chapter = extract_chapter(filename)
    hs_description = HS_CHAPTER_DICT.get(hs_chapter, "")
    rows = []
    
    try:
        if filename.endswith(".xls"):
            wb = xlrd.open_workbook(str(file_path))
            sheet = wb.sheet_by_index(0)
            for row_idx in range(2, sheet.nrows):
                rows.append((row_idx, sheet.row_values(row_idx)))
        elif filename.endswith(".xlsx"):
            wb = openpyxl.load_workbook(file_path, read_only=True, data_only=True)
            sheet = wb.active
            for row_idx, row in enumerate(sheet.iter_rows(values_only=True)):
                if row_idx < 2:
                    continue
                rows.append((row_idx, row))
        else:
            return
            
        file_valid_rows = 0
        file_skipped_blank = 0
        file_skipped_trade = 0
        
        for row_idx, row in rows:
            if not row:
                continue
                
            row = list(row) + [""] * max(0, 15 - len(row))
            
            stats.rows_read += 1
            
            company_name = str(row[0]).strip() if row[0] is not None else ""
            if not company_name:
                stats.skipped_blank_name += 1
                file_skipped_blank += 1
                logging.info(f"[SKIP] Row {row_idx + 1} in {filename}: company_name blank")
                continue
                
            country_name = str(row[2]).strip() if row[2] is not None else ""
            
            raw_imports = [row[3], row[4], row[5]]
            import_products = [strip_hs_prefix(str(p)) for p in raw_imports if p is not None]
            
            raw_exports = [row[9], row[10], row[11]]
            export_products = [strip_hs_prefix(str(p)) for p in raw_exports if p is not None]
            
            trade_type = derive_trade_type(import_products, export_products)
            
            if not trade_type:
                stats.skipped_trade_data += 1
                file_skipped_trade += 1
                logging.info(f"[SKIP] Row {row_idx + 1} in {filename}: no trade data (all product columns blank)")
                continue
                
            country_code = get_country_code(country_name)
            if country_code is None and country_name:
                stats.lookup_failures += 1
                logging.info(f"[COUNTRY] '{country_name}' \u2192 lookup failed \u2192 NULL (kept row)")
                
            top_products = build_pipe_list(import_products + export_products)
            
            import_countries = [str(row[6]), str(row[7]), str(row[8])]
            export_countries = [str(row[12]), str(row[13]), str(row[14])]
            partner_countries = build_pipe_list(import_countries + export_countries)
            
            out_row = {
                "company_name": company_name,
                "country_code": country_code if country_code else "",
                "country_name": country_name,
                "hs_chapter": hs_chapter,
                "hs_description": hs_description,
                "trade_type": trade_type,
                "top_products": top_products,
                "partner_countries": partner_countries,
                "contact_email": "",
                "contact_phone": ""
            }
            
            writer.writerow(out_row)
            stats.rows_written += 1
            file_valid_rows += 1
            
            if stats.rows_written <= 50:
                stats.sample_rows.append(out_row)
                
        stats.processed_files += 1
        logging.info(f"[FILE] {filename}: {len(rows)} data rows read, {file_valid_rows} written")

    except Exception as e:
        stats.error_files += 1
        logging.info(f"[FILE] {filename}: ERROR \u2014 [{str(e)}] \u2014 SKIPPED")

def main():
    source_dir = Path("/Users/satyarthi/Desktop/Database/Santander/Reach Business counterpart")
    out_csv_path = Path("scripts/data/santander_combined.csv")
    sample_csv_path = Path("scripts/data/santander_sample_50.csv")
    
    out_csv_path.parent.mkdir(parents=True, exist_ok=True)
    
    headers = [
        "company_name", "country_code", "country_name", "hs_chapter", "hs_description",
        "trade_type", "top_products", "partner_countries", "contact_email", "contact_phone"
    ]
    
    files = [f for f in source_dir.iterdir() if f.is_file() and not f.name.startswith(".")]
    
    stats = Stats()
    
    with open(out_csv_path, 'w', newline='', encoding='utf-8') as out_f:
        writer = csv.DictWriter(out_f, fieldnames=headers)
        writer.writeheader()
        
        for file_path in files:
            process_file(file_path, writer, stats)
            
    with open(sample_csv_path, 'w', newline='', encoding='utf-8') as sample_f:
        sample_writer = csv.DictWriter(sample_f, fieldnames=headers)
        sample_writer.writeheader()
        for sample_row in stats.sample_rows:
            sample_writer.writerow(sample_row)

    logging.info(f"[SUMMARY] Files: {len(files)} | Processed: {stats.processed_files} | Errors: {stats.error_files}")
    logging.info(f"[SUMMARY] Rows read: {stats.rows_read:,} | Written: {stats.rows_written:,} | Skipped (blank name): {stats.skipped_blank_name:,} | Skipped (no trade data): {stats.skipped_trade_data:,}")
    
    total_valid = stats.rows_written
    null_rate = 0.0
    if total_valid > 0:
        null_rate = (stats.lookup_failures / total_valid) * 100
    logging.info(f"[SUMMARY] Country lookup failures: {stats.lookup_failures:,} ({null_rate:.1f}% NULL rate)")
    
    if null_rate > 30:
        logging.error("Country code NULL rate exceeds 30%. Failing.")
        sys.exit(1)

if __name__ == "__main__":
    main()
