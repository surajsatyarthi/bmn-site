'use server';

import { db } from '@/lib/db';
import { tools } from '@/drizzle/schema';
import { eq, and, desc, gt, isNull, sql } from 'drizzle-orm';
import { findContactEmail } from './apollo';
import { auth } from '@/auth';
import { users } from '@/drizzle/schema';

/**
 * Extract domain from tool URL
 */
function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return null;
  }
}

export type EnrichmentStats = {
  total: number;
  enriched: number;
  failed: number;
  creditsUsed: number;
  results: Array<{
    toolName: string;
    email: string | null;
    status: 'success' | 'failed' | 'skipped';
    message: string;
  }>;
};

/**
 * Enrich contact emails for top unverified tools
 */
export async function enrichContactEmails(limit: number = 50): Promise<EnrichmentStats> {
  try {
    // Verify admin access
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Authentication required');
    }

    const user = (await db.select().from(users).where(eq(users.id, session.user.id)).limit(1))[0];
    if (user?.role !== 'ADMIN') {
      throw new Error('Admin access required');
    }

    const stats: EnrichmentStats = {
      total: 0,
      enriched: 0,
      failed: 0,
      creditsUsed: 0,
      results: [],
    };

    // Get top unverified tools without contact emails
    const candidates = await db
      .select({
        id: tools.id,
        name: tools.name,
        url: tools.website,
        searchVolumeSignal: tools.searchVolumeSignal,
      })
      .from(tools)
      .where(
        and(
          eq(tools.isVerified, false),
          gt(tools.searchVolumeSignal, 1000),
          isNull(tools.contactEmail)
        )
      )
      .orderBy(desc(tools.searchVolumeSignal))
      .limit(limit);

    stats.total = candidates.length;

    // Enrich each candidate
    for (const tool of candidates) {
      if (!tool.url) {
        stats.results.push({
          toolName: tool.name,
          email: null,
          status: 'skipped',
          message: 'No website URL configured',
        });
        stats.failed++;
        continue;
      }

      const domain = extractDomain(tool.url);

      if (!domain) {
        stats.results.push({
          toolName: tool.name,
          email: null,
          status: 'skipped',
          message: 'Could not extract domain from URL',
        });
        stats.failed++;
        continue;
      }

      // Find contact via Apollo
      const result = await findContactEmail(domain, tool.name);
      stats.creditsUsed += result.creditsUsed;

      if (result.success && result.email) {
        // Update tool with contact email
        await db
          .update(tools)
          .set({
            contactEmail: result.email,
            updatedAt: new Date(),
          })
          .where(eq(tools.id, tool.id));

        stats.enriched++;
        stats.results.push({
          toolName: tool.name,
          email: result.email,
          status: 'success',
          message: result.message,
        });
      } else {
        stats.failed++;
        stats.results.push({
          toolName: tool.name,
          email: null,
          status: 'failed',
          message: result.message,
        });
      }

      // Rate limiting: wait 100ms between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return stats;
  } catch (error: any) {
    console.error('Enrichment Error:', error);
    throw new Error(error.message || 'Contact enrichment failed');
  }
}

/**
 * Alias for enrichContactEmails (for backward compatibility)
 */
export const enrichContactsForUnverifiedTools = enrichContactEmails;
