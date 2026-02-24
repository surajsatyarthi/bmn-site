import re
import pdb

def extract_chapter(filename: str) -> str:
    match = re.search(r'(?i)ch_(\d+)', filename)
    if match:
        return str(match.group(1)).zfill(2)
    return ""

def strip_hs_prefix(product_text: str) -> str:
    if not product_text:
        return ""
    text = str(product_text).strip()
    # Strip prefix up to and including ' - '
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
        if item and str(item).strip():
            stripped = str(item).strip()
            if stripped not in seen:
                seen.add(stripped)
                valid_items.append(stripped)
    return "|".join(valid_items[:6])

def test_extract_chapter():
    assert extract_chapter("Ch_2.xls") == "02"
    assert extract_chapter("Ch_39AtoF_exceptchina.xls") == "39"
    assert extract_chapter("CH_95_Exporter.xls") == "95"
    assert extract_chapter("Ch_84_Uk.xls") == "84"

def test_strip_hs_prefix():
    assert strip_hs_prefix("020329 - Frozen meat of swine") == "Frozen meat of swine"
    assert strip_hs_prefix("Live animals") == "Live animals"
    assert strip_hs_prefix("") == ""

def test_derive_trade_type():
    assert derive_trade_type(["A", "", ""], ["", "", ""]) == "importer"
    assert derive_trade_type(["A", "", ""], ["B", "", ""]) == "both"
    assert derive_trade_type(["", "", ""], ["", "", ""]) is None
    assert derive_trade_type(["", "", "A", ""], []) == "importer"
    assert derive_trade_type([], ["Exp1"]) == "exporter"

def test_build_pipe_list():
    assert build_pipe_list(["A", "", "B", "A", "C", ""]) == "A|B|C"
    assert build_pipe_list(["A", "A", "A"]) == "A"
    assert build_pipe_list(["1", "2", "3", "4", "5", "6", "7"]) == "1|2|3|4|5|6"
    assert build_pipe_list(["", None, "   "]) == ""

if __name__ == '__main__':
    test_extract_chapter()
    test_strip_hs_prefix()
    test_derive_trade_type()
    test_build_pipe_list()
    print("All tests passed.")
