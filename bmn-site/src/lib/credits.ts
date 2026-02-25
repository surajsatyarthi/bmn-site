import { db } from '@/lib/db';
import { matchReveals } from '@/lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function getMonthlyRevealCount(userId: string): Promise<number> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(matchReveals)
    .where(
      and(
        eq(matchReveals.profileId, userId),
        eq(matchReveals.monthKey, monthKey)
      )
    );
  
  return Number(result[0].count);
}
