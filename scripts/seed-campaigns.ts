/**
 * Seed script for generating test campaign data
 * Run with: npx tsx scripts/seed-campaigns.ts [profileId]
 * 
 * If no profileId provided, uses first profile in database.
 */

import { db } from '../src/lib/db';
import { products, tradeInterests, campaigns } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function hoursAgo(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
}

async function seedCampaigns(targetProfileId?: string) {
  console.log('🌱 Starting campaign seeding...');
  
  // Get profile
  let profileId = targetProfileId;
  
  if (!profileId) {
    const firstProfile = await db.query.profiles.findFirst();
    if (!firstProfile) {
      console.error('❌ No profiles found in database. Create a user first.');
      process.exit(1);
    }
    profileId = firstProfile.id;
    console.log(`📋 Using first profile: ${profileId}`);
  }
  
  // Get profile's products and trade interests for realistic campaign names
  const userProducts = await db.select().from(products).where(eq(products.profileId, profileId));
  const userInterests = await db.select().from(tradeInterests).where(eq(tradeInterests.profileId, profileId));
  
  console.log(`📦 Profile has ${userProducts.length} products and ${userInterests.length} trade interests`);
  
  // Generate campaign names based on products and interests
  function generateCampaignName(index: number): { name: string; target: string } {
    const product = userProducts[index % Math.max(1, userProducts.length)]?.name || 'Products';
    const country = userInterests[index % Math.max(1, userInterests.length)]?.countryName || 'International';
    
    return {
      name: `${product} — ${country} Buyers`,
      target: `${country} importers of ${product}`,
    };
  }
  
  const campaignsToInsert = [];
  
  // Campaign 1: Active, 2-4 weeks old, good metrics
  const camp1 = generateCampaignName(0);
  campaignsToInsert.push({
    profileId,
    name: camp1.name,
    targetDescription: camp1.target,
    status: 'active' as const,
    emailsSent: randomInt(150, 200),
    emailsOpened: randomInt(50, 70),
    emailsReplied: randomInt(8, 12),
    meetingsBooked: randomInt(2, 4),
    metricsUpdatedAt: hoursAgo(randomInt(2, 18)),
    startedAt: daysAgo(randomInt(14, 28)),
    completedAt: null,
    createdAt: daysAgo(randomInt(20, 35)),
  });
  
  // Campaign 2: Active, 1-2 weeks old, early stage
  const camp2 = generateCampaignName(1);
  campaignsToInsert.push({
    profileId,
    name: camp2.name,
    targetDescription: camp2.target,
    status: 'active' as const,
    emailsSent: randomInt(50, 80),
    emailsOpened: randomInt(15, 28),
    emailsReplied: randomInt(2, 5),
    meetingsBooked: randomInt(0, 1),
    metricsUpdatedAt: hoursAgo(randomInt(4, 20)),
    startedAt: daysAgo(randomInt(7, 14)),
    completedAt: null,
    createdAt: daysAgo(randomInt(10, 18)),
  });
  
  // Campaign 3: Completed, 6-8 weeks old, full run
  const camp3 = generateCampaignName(2);
  const completedDaysAgo = randomInt(42, 56);
  campaignsToInsert.push({
    profileId,
    name: camp3.name,
    targetDescription: camp3.target,
    status: 'completed' as const,
    emailsSent: randomInt(300, 400),
    emailsOpened: randomInt(100, 140),
    emailsReplied: randomInt(15, 22),
    meetingsBooked: randomInt(4, 7),
    metricsUpdatedAt: daysAgo(completedDaysAgo - 5),
    startedAt: daysAgo(completedDaysAgo + 30),
    completedAt: daysAgo(completedDaysAgo),
    createdAt: daysAgo(completedDaysAgo + 35),
  });
  
  // Campaign 4: Draft, not started yet
  const camp4 = generateCampaignName(3);
  campaignsToInsert.push({
    profileId,
    name: camp4.name,
    targetDescription: camp4.target,
    status: 'draft' as const,
    emailsSent: 0,
    emailsOpened: 0,
    emailsReplied: 0,
    meetingsBooked: 0,
    metricsUpdatedAt: null,
    startedAt: null,
    completedAt: null,
    createdAt: daysAgo(randomInt(1, 3)),
  });
  
  // Campaign 5: Paused, partial run (50% chance)
  if (Math.random() > 0.5) {
    const camp5 = generateCampaignName(4);
    campaignsToInsert.push({
      profileId,
      name: camp5.name,
      targetDescription: camp5.target,
      status: 'paused' as const,
      emailsSent: randomInt(80, 120),
      emailsOpened: randomInt(25, 40),
      emailsReplied: randomInt(3, 6),
      meetingsBooked: randomInt(1, 2),
      metricsUpdatedAt: daysAgo(randomInt(5, 10)),
      startedAt: daysAgo(randomInt(25, 35)),
      completedAt: null,
      createdAt: daysAgo(randomInt(30, 40)),
    });
  }
  
  // Insert campaigns
  console.log(`💾 Inserting ${campaignsToInsert.length} campaigns...`);
  
  const inserted = await db.insert(campaigns).values(campaignsToInsert).returning({ id: campaigns.id });
  
  console.log(`✅ Successfully seeded ${inserted.length} campaigns:`);
  console.log(`   - Active: ${campaignsToInsert.filter(c => c.status === 'active').length}`);
  console.log(`   - Draft: ${campaignsToInsert.filter(c => c.status === 'draft').length}`);
  console.log(`   - Completed: ${campaignsToInsert.filter(c => c.status === 'completed').length}`);
  console.log(`   - Paused: ${campaignsToInsert.filter(c => c.status === 'paused').length}`);
}

// Run
const profileIdArg = process.argv[2];
seedCampaigns(profileIdArg)
  .then(() => {
    console.log('🎉 Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
