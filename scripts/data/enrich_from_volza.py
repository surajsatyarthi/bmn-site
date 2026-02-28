import argparse
import logging
import sys
import psycopg2
from psycopg2.extras import DictCursor
import os
import re

def get_db_connection():
    # Try to find .env.local
    env_path = os.path.join(os.path.dirname(__file__), '../../bmn-site/.env.local')
    if os.path.exists(env_path):
        raw = open(env_path).read()
        db_url = re.search(r'DATABASE_URL="(.+?)"', raw).group(1)
    else:
        db_url = os.environ.get('DATABASE_URL')
        
    if not db_url:
        raise ValueError("DATABASE_URL not found in environment or .env.local")
        
    # Strip pgbouncer param — psycopg2 doesn't support it and it breaks things
    db_url = re.sub(r'\?.*', '', db_url)
    return psycopg2.connect(db_url)

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description='Enrich global_trade_companies with VOLZA data')
    parser.add_argument('--dry-run', action='store_true', help='Perform similarity matching without executing UPDATEs')
    
    args = parser.parse_args()
    
    try:
        conn = get_db_connection()
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
        # Set similarity threshold (0.7) for the % operator
        cursor.execute("SET pg_trgm.similarity_threshold = 0.7;")
        
        # We process in chunks to avoid Supabase statement timeouts (max 2 minutes)
        cursor.execute("SELECT id, company_name FROM global_trade_companies WHERE contact_email IS NULL;")
        blank_companies = cursor.fetchall()
        
        logger.info(f"Companies missing contact email: {len(blank_companies)}")
        null_count = len(blank_companies)
        
        CHUNK_SIZE = 5000
        matches = []
        
        logger.info(f"Processing in chunks of {CHUNK_SIZE} to prevent DB timeouts...")
        
        for i in range(0, len(blank_companies), CHUNK_SIZE):
            chunk = blank_companies[i:i + CHUNK_SIZE]
            chunk_ids = tuple([c['id'] for c in chunk])
            
            logger.info(f"Processing chunk {i//CHUNK_SIZE + 1}/{(len(blank_companies) // CHUNK_SIZE) + 1}...")
            
            match_query = """
            SELECT 
                c.id, c.company_name, t.india_party_name, t.india_party_email, t.india_party_phone
            FROM 
                global_trade_companies c
            JOIN 
                trade_shipments t 
            ON 
                c.company_name %% t.india_party_name
            WHERE 
                c.id = ANY(%s::uuid[]) AND t.india_party_email IS NOT NULL;
            """
            
            cursor.execute(match_query, (list(chunk_ids),))
            chunk_matches = cursor.fetchall()
            matches.extend(chunk_matches)
            
        logger.info(f"Found {len(matches)} fuzzy matches globally.")
        
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
