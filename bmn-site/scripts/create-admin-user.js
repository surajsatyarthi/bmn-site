const postgres = require('postgres');

const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
const sql = postgres(connectionString);

async function createAdmin() {
  try {
    console.log('Checking if admin user already exists...');
    const existingUsers = await sql`
      SELECT id FROM auth.users WHERE email = 'admin@bmn.local'
    `;

    if (existingUsers.length > 0) {
      console.log('Admin user already exists with ID:', existingUsers[0].id);
      return;
    }

    console.log('Creating admin user...');
    
    // Execute as a transaction
    await sql.begin(async sql => {
      // 1. Create auth user
      const [adminUser] = await sql`
        INSERT INTO auth.users (
          id,
          email,
          encrypted_password,
          email_confirmed_at,
          raw_app_meta_data,
          raw_user_meta_data,
          created_at,
          updated_at,
          confirmation_token,
          role,
          aud
        ) VALUES (
          gen_random_uuid(),
          'admin@bmn.local',
          crypt('AdminPass123!', gen_salt('bf')),
          NOW(),
          '{"provider":"email","providers":["email"]}',
          '{"full_name":"BMN Admin"}',
          NOW(),
          NOW(),
          '',
          'authenticated',
          'authenticated'
        )
        RETURNING id;
      `;
      
      const adminUserId = adminUser.id;
      console.log(`Admin auth user created with ID: ${adminUserId}`);

      // 2. Create profile
      await sql`
        INSERT INTO public.profiles (
          id,
          full_name,
          trade_role,
          onboarding_step,
          onboarding_completed,
          is_admin,
          plan
        ) VALUES (
          ${adminUserId},
          'BMN Admin',
          'both',
          6,
          true,
          true,
          'enterprise'
        );
      `;
      console.log('Admin profile created successfully.');
    });

    console.log('Admin user creation process completed.');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sql.end();
  }
}

createAdmin();
