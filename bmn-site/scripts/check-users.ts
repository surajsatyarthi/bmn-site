
import postgres from 'postgres';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.log('No DATABASE_URL provided');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function checkUsers() {
    try {
        const users = await sql`
            SELECT id, email, encrypted_password, instance_id 
            FROM auth.users 
            WHERE email = 'smoke_test_bypass@example.com'
        `;
        console.log('Latest Users:');
        console.table(users);
    } catch (e) {
        console.error('Error fetching users:', e);
    } finally {
        await sql.end();
    }
}

checkUsers();
