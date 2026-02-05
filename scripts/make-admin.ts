#!/usr/bin/env tsx

/**
 * Direct database update to make user admin
 * Uses the DATABASE_URL connection string
 */

import { db } from '../src/lib/db';
import { users } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

async function makeAdmin() {
  try {
    console.log('\n🔍 Making directoryantigravity@gmail.com an admin...\n');
    
    const result = await db
      .update(users)
      .set({ 
        role: 'ADMIN',
        updatedAt: new Date()
      })
      .where(eq(users.email, 'directoryantigravity@gmail.com'))
      .returning();

    if (result.length > 0) {
      console.log('✅ SUCCESS! You are now an admin!');
      console.log(`   Email: ${result[0].email}`);
      console.log(`   Role: ${result[0].role}`);
      console.log(`   Name: ${result[0].name || 'Not set'}\n`);
      console.log('🚀 Refresh http://localhost:3000/dashboard to see Edward\'s panel!\n');
    } else {
      console.log('❌ No user found with that email. Make sure you\'ve signed in at least once.\n');
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
