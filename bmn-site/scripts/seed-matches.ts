/**
 * Seed script for generating test match data
 * Run with: npx tsx scripts/seed-matches.ts [profileId]
 * 
 * If no profileId provided, uses first profile in database.
 */

import { db } from '../src/lib/db';
import { profiles, products, tradeInterests, matches } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

// Company name prefixes and suffixes for realistic names
const COMPANY_PREFIXES = [
  'Al Rashid', 'Golden Star', 'Pacific', 'Oriental', 'Global', 'Premier',
  'Royal', 'Imperial', 'Diamond', 'Sunrise', 'Blue Ocean', 'Continental',
  'Atlas', 'Horizon', 'Pinnacle', 'Elite', 'Crown', 'Prestige'
];

const COMPANY_SUFFIXES: Record<string, string[]> = {
  'UAE': ['Trading LLC', 'Imports FZE', 'General Trading', 'Commercial'],
  'USA': ['Inc.', 'Corporation', 'Trading Co.', 'Imports LLC'],
  'Germany': ['GmbH', 'Import Export GmbH', 'Handels GmbH', 'AG'],
  'Japan': ['Co. Ltd', 'Trading Corporation', 'Shoji Co.', 'Boeki'],
  'UK': ['Ltd', 'Trading Limited', 'Imports PLC', 'Group Ltd'],
  'Singapore': ['Pte Ltd', 'Trading Pte Ltd', 'Asia Pacific Pte Ltd'],
  'Netherlands': ['B.V.', 'Trading B.V.', 'Import B.V.'],
  'Brazil': ['Ltda', 'Importação S.A.', 'Comércio Ltda'],
  'Saudi Arabia': ['Trading Est.', 'Commercial Co.', 'Import Co.'],
  'Australia': ['Pty Ltd', 'Trading Pty Ltd', 'Imports Pty Ltd'],
};

const COUNTRIES = Object.keys(COMPANY_SUFFIXES);

const CITIES: Record<string, string[]> = {
  'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'USA': ['New York', 'Los Angeles', 'Houston', 'Miami'],
  'Germany': ['Hamburg', 'Frankfurt', 'Munich', 'Berlin'],
  'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya'],
  'UK': ['London', 'Manchester', 'Birmingham', 'Liverpool'],
  'Singapore': ['Singapore'],
  'Netherlands': ['Rotterdam', 'Amsterdam', 'Utrecht'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Santos'],
  'Saudi Arabia': ['Jeddah', 'Riyadh', 'Dammam'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane'],
};

const MATCH_REASONS = [
  'Exact product match on {} categories',
  'Active buyer — {} shipments in last 6 months',
  'Volume compatible with your capacity',
  'Strong import history from India',
  'Certified buyer with established track record',
  'Looking for new suppliers in your region',
  'Trade volume matches your production scale',
  'Favorable payment terms history',
  'Growing market demand in their region',
  'Previously sourced similar products',
];

const MATCH_WARNINGS = [
  'New to importing from India',
  'Payment terms typically NET 60',
  'Requires product samples before order',
  'High quality standards — be prepared for audits',
  'Seasonal buyer — peak orders in Q4',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCompanyName(country: string): string {
  const prefix = randomItem(COMPANY_PREFIXES);
  const suffixes = COMPANY_SUFFIXES[country] || ['Trading Co.'];
  const suffix = randomItem(suffixes);
  return `${prefix} ${suffix}`;
}

function generateMatchReasons(productCount: number): string[] {
  const reasons: string[] = [];
  const count = randomInt(2, 4);
  const shuffled = [...MATCH_REASONS].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < count && i < shuffled.length; i++) {
    let reason = shuffled[i];
    reason = reason.replace('{}', String(randomInt(2, 5)));
    reasons.push(reason);
  }
  return reasons;
}

function generateMatchWarnings(): string[] | null {
  if (Math.random() > 0.4) return null; // 60% chance of no warnings
  const count = randomInt(1, 2);
  const shuffled = [...MATCH_WARNINGS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateScoreBreakdown(score: number): object {
  // Distribute the score across components
  const productMatch = randomInt(20, 30);
  const volumeMatch = randomInt(15, 25);
  const historyScore = randomInt(10, 20);
  const regionScore = score - productMatch - volumeMatch - historyScore;
  
  return {
    productMatch: Math.max(0, productMatch),
    volumeMatch: Math.max(0, volumeMatch),
    historyScore: Math.max(0, historyScore),
    regionScore: Math.max(0, regionScore),
  };
}

function generateTradeData(): object | null {
  if (Math.random() > 0.7) return null; // 30% chance of no trade data
  return {
    volume: `$${randomInt(50, 500)}K/month`,
    frequency: `${randomInt(4, 24)} shipments/year`,
    yearsActive: randomInt(2, 15),
  };
}

function generateContactInfo(): object {
  const firstNames = ['Ahmed', 'Michael', 'Hans', 'Takeshi', 'James', 'Wei', 'Jan', 'Carlos', 'Mohammed', 'David'];
  const lastNames = ['Khan', 'Smith', 'Mueller', 'Tanaka', 'Wilson', 'Chen', 'de Vries', 'Silva', 'Al-Rashid', 'Brown'];
  
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const domain = ['gmail.com', 'outlook.com', 'company.com', 'trade.com'][randomInt(0, 3)];
  
  return {
    name: `${firstName} ${lastName}`,
    title: randomItem(['Procurement Manager', 'Import Director', 'Buyer', 'CEO', 'Trade Manager']),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    phone: `+${randomInt(1, 99)} ${randomInt(100, 999)} ${randomInt(1000000, 9999999)}`,
    website: Math.random() > 0.5 ? `https://www.${lastName.toLowerCase()}trading.com` : null,
  };
}

function getTierFromScore(score: number): 'best' | 'great' | 'good' {
  if (score >= 80) return 'best';
  if (score >= 60) return 'great';
  return 'good';
}

async function seedMatches(targetProfileId?: string) {
  console.log('🌱 Starting match seeding...');
  
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
  
  // Get profile's products and trade interests for realistic matching
  const userProducts = await db.select().from(products).where(eq(products.profileId, profileId));
  const userInterests = await db.select().from(tradeInterests).where(eq(tradeInterests.profileId, profileId));
  
  console.log(`📦 Profile has ${userProducts.length} products and ${userInterests.length} trade interests`);
  
  // Generate match distribution: ~5 best, ~8 great, ~5 good
  const scoreDistribution = [
    ...Array(5).fill(null).map(() => randomInt(80, 98)), // best
    ...Array(8).fill(null).map(() => randomInt(60, 79)), // great
    ...Array(randomInt(5, 7)).fill(null).map(() => randomInt(50, 59)), // good
  ];
  
  const matchesToInsert: any[] = [];
  
  for (const score of scoreDistribution) {
    // Use countries from user's trade interests if available, else random
    const country = userInterests.length > 0 
      ? randomItem(userInterests).countryName 
      : randomItem(COUNTRIES);
    
    const countryForCity = CITIES[country] ? country : randomItem(COUNTRIES);
    const city = randomItem(CITIES[countryForCity] || ['Capital City']);
    
    // Use products from user's products if available
    const matchedProductsList = userProducts.length > 0
      ? userProducts.slice(0, randomInt(1, Math.min(3, userProducts.length))).map(p => ({
          hsCode: p.hsCode,
          name: p.name,
        }))
      : [{ hsCode: '0901', name: 'Coffee' }, { hsCode: '0902', name: 'Tea' }].slice(0, randomInt(1, 2));
    
    matchesToInsert.push({
      profileId,
      counterpartyName: generateCompanyName(country),
      counterpartyCountry: country,
      counterpartyCity: city,
      matchedProducts: matchedProductsList,
      matchScore: score,
      matchTier: getTierFromScore(score),
      scoreBreakdown: generateScoreBreakdown(score),
      matchReasons: generateMatchReasons(matchedProductsList.length),
      matchWarnings: generateMatchWarnings(),
      status: 'new' as const,
      revealed: false,
      tradeData: generateTradeData(),
      counterpartyContact: generateContactInfo(),
    });
  }
  
  // Insert matches
  console.log(`💾 Inserting ${matchesToInsert.length} matches...`);
  
  const inserted = await db.insert(matches).values(matchesToInsert).returning({ id: matches.id });
  
  console.log(`✅ Successfully seeded ${inserted.length} matches:`);
  console.log(`   - Best (80-100): ${matchesToInsert.filter(m => m.matchScore >= 80).length}`);
  console.log(`   - Great (60-79): ${matchesToInsert.filter(m => m.matchScore >= 60 && m.matchScore < 80).length}`);
  console.log(`   - Good (50-59): ${matchesToInsert.filter(m => m.matchScore < 60).length}`);
}

// Run
const profileIdArg = process.argv[2];
seedMatches(profileIdArg)
  .then(() => {
    console.log('🎉 Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
