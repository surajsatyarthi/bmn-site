import argparse
import logging
import sys
import psycopg2
from psycopg2.extras import DictCursor

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description='Enrich global_trade_companies with VOLZA data')
    parser.add_argument('--dry-run', action='store_true', help='Perform similarity matching without executing UPDATEs')
    
    args = parser.parse_args()
    
    try:
        conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/postgres")
        cursor = conn.cursor(cursor_factory=DictCursor)
        
        # Verify pg_trgm extension exists
        cursor.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")
        conn.commit()
    except Exception as e:
        logger.error(f"Cannot connect to the database: {e}")
        logger.error("Real enrichment requires a live database connection.")
        sys.exit(1)
        
    logger.info("Starting enrichment process...")
    
    try:
        # 1. Find count of NULL contact emails
        cursor.execute("SELECT COUNT(*) FROM global_trade_companies WHERE contact_email IS NULL;")
        null_count = cursor.fetchone()[0]
        logger.info(f"Companies missing contact email: {null_count}")
        
        # 2. Match based on trigram similarity. 
        match_query = """
        SELECT 
            c.id, c.company_name, t.india_party_name, t.india_party_email, t.india_party_phone
        FROM 
            global_trade_companies c
        JOIN 
            trade_shipments t 
        ON 
            similarity(c.company_name, t.india_party_name) > 0.7
        WHERE 
            c.contact_email IS NULL AND t.india_party_email IS NOT NULL;
        """
        
        cursor.execute(match_query)
        matches = cursor.fetchall()
        
        logger.info(f"Found {len(matches)} fuzzy matches.")
        
        if args.dry_run:
            logger.info("--dry-run specified. Simulated match summary:")
            if null_count > 0:
                match_rate = (len(matches) / null_count) * 100
                logger.info(f"Potential match rate for blank records: {match_rate:.1f}%")
            logger.info("No database records were modified.")
        else:
            logger.info("Applying updates...")
            updates = 0
            for match in matches:
                company_id = match['id']
                email = match['india_party_email']
                phone = match['india_party_phone']
                
                update_query = """
                UPDATE global_trade_companies 
                SET contact_email = %s, contact_phone = %s 
                WHERE id = %s;
                """
                cursor.execute(update_query, (email, phone, company_id))
                updates += 1
                
            conn.commit()
            logger.info(f"Successfully updated {updates} records.")

    except Exception as e:
         logger.error(f"Query execution failed: {e}")
         if not args.dry_run:
             conn.rollback()

    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
