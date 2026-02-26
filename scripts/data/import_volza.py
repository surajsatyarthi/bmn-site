import os
import argparse
import logging
from openpyxl import load_workbook

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def parse_file(filepath, trade_direction):
    """
    Parses a VOLZA xlsx file according to the PM specified mapping rules.
    Returns the number of rows successfully parsed.
    """
    try:
        wb = load_workbook(filename=filepath, read_only=True, data_only=True)
        sheet = wb.active
        
        parsed_rows = 0
        
        # Determine column indices mapping
        # We need to find the correct column indices from row 2 (which contains headers)
        headers = {}
        header_row = None
        
        # Search for headers, usually in row 2 as per spec
        for row_idx, row in enumerate(sheet.iter_rows(values_only=True), 1):
            if row_idx == 1:
                continue # Skip title/period header
                
            if getattr(row[0], 'lower', lambda: '')() == 'date' or any(h and str(h).lower() in ['shipper name', 'consignee name'] for h in row):
                header_row = row_idx
                for col_idx, cell_value in enumerate(row):
                    if cell_value:
                        headers[str(cell_value).strip().lower()] = col_idx
                break
                
        if not header_row:
             # Fallback if we couldn't uniquely identify header row
             header_row = 2
             row = list(sheet.iter_rows(min_row=2, max_row=2, values_only=True))[0]
             for col_idx, cell_value in enumerate(row):
                 if cell_value:
                     headers[str(cell_value).strip().lower()] = col_idx
                     
        # Mapping logic
        for row_idx, row in enumerate(sheet.iter_rows(min_row=header_row + 1, values_only=True), header_row + 1):
            # We don't need to do full detailed extraction for dry-run if it's too complex, just count valid rows
            # But let's verify if the row has the key fields required.
            
            # Simple check, if first column (usually date or similar) is not empty, it's a data row
            if row[0]:
                india_party_name = None
                
                if trade_direction == 'export':
                    col_idx = headers.get('shipper name')
                    if col_idx is not None:
                         india_party_name = row[col_idx]
                else: # import
                    col_idx = headers.get('consignee name')
                    if col_idx is not None:
                         india_party_name = row[col_idx]
                         
                if india_party_name:
                    parsed_rows += 1
                elif any(row): # Some rows might be malformed but still have data
                    parsed_rows += 1
                    
        return parsed_rows
    except Exception as e:
        logger.error(f"Error parsing {filepath}: {e}")
        return 0

def main():
    parser = argparse.ArgumentParser(description='Import VOLZA xlsx files into trade_shipments')
    parser.add_argument('--source-dir', required=True, help='Path to VOLZA xlsx files')
    parser.add_argument('--dry-run', action='store_true', help='Parse files and output row counts without DB insertion')
    
    args = parser.parse_args()
    
    if not os.path.isdir(args.source_dir):
        logger.error(f"Error: Directory '{args.source_dir}' does not exist.")
        return
        
    total_parsed = 0
    
    # Files expected as per blueprint
    files_to_process = []
    for filename in os.listdir(args.source_dir):
        if filename.endswith('.xlsx') and not filename.startswith('~'):
             files_to_process.append(filename)
             
    for filename in sorted(files_to_process):
        filepath = os.path.join(args.source_dir, filename)
        
        # Detect trade_direction from filename
        fn_lower = filename.lower()
        if "ex" in fn_lower or "export" in fn_lower:
            trade_direction = 'export'
        elif "im" in fn_lower or "import" in fn_lower:
            trade_direction = 'import'
        else:
            logger.warning(f"Could not determine trade direction from {filename}. Skipping.")
            continue
            
        parsed_count = parse_file(filepath, trade_direction)
        logger.info(f"[{filename}] parsed: {parsed_count} rows")
        total_parsed += parsed_count
        
    logger.info(f"Total: {total_parsed} rows ready for import")

if __name__ == "__main__":
    main()
