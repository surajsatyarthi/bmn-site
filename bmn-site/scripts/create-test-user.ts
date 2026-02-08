
import postgres from 'postgres';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.log('No DATABASE_URL provided');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function createTestUser() {
    const email = 'smoke_test_bypass@example.com';
    const password = 'Password123!';
    
    try {
        console.log(`Creating verified user ${email} directly in DB...`);
        
        // 1. Check if exists
        const existing = await sql`SELECT id FROM auth.users WHERE email = ${email}`;
        if (existing.length > 0) {
            console.log('User already exists, updating password/confirmation...');
            await sql`
                UPDATE auth.users 
                SET encrypted_password = crypt(${password}, gen_salt('bf')),
                    email_confirmed_at = now(),
                    updated_at = now(),
                    raw_user_meta_data = '{"full_name": "Smoke Test User"}'
                WHERE email = ${email}
            `;
            console.log('User updated.');
            return;
        }

        // 2. Insert new user
        // Note: gen_random_uuid() and crypt() require extensions usually available.
        // We assume 'extensions' schema or public.
        // auth.users usually has uuid_generate_v4() or gen_random_uuid() as default for id.
        await sql`
            INSERT INTO auth.users (
                instance_id,
                id,
                aud,
                role,
                email,
                encrypted_password,
                email_confirmed_at,
                last_sign_in_at,
                raw_app_meta_data,
                raw_user_meta_data,
                created_at,
                updated_at,
                confirmation_token,
                recovery_token,
                email_change_token_new,
                is_super_admin
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                gen_random_uuid(), 
                'authenticated',
                'authenticated',
                ${email},
                crypt(${password}, gen_salt('bf')),
                now(),
                now(),
                '{"provider":"email","providers":["email"]}',
                '{"full_name": "Smoke Test User"}',
                now(),
                now(),
                '',
                '',
                '',
                false
            )
        `;
        console.log('User created successfully.');
        
    } catch (e) {
        console.error('Error creating user:', e);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

createTestUser();
