import { db } from '../src/lib/db';
import { profiles } from '../src/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

async function seedUsers() {
  console.log('🌱 Seeding users...');

  try {
    const adminId = 'd0d4cd51-3444-486d-9669-0260026e6438'; // Fixed UUID for consistency
    
    await db.insert(profiles).values({
      id: adminId,
      fullName: 'Antigravity Admin',
      tradeRole: 'both',
      isAdmin: true,
      onboardingCompleted: true,
      onboardingStep: 6,
      phone: '+1234567890',
      whatsapp: '+1234567890',
      monthlyVolume: '100k+',
      plan: 'pro'
    }).onConflictDoUpdate({
      target: profiles.id,
      set: { isAdmin: true }
    });

    console.log('✅ Admin user seeded.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed users:', error);
    process.exit(1);
  }
}

seedUsers();
