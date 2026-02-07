import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { matches } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

interface MatchResponse {
  id: string;
  counterpartyName: string;
  counterpartyCountry: string;
  counterpartyCity: string | null;
  matchedProducts: { hsCode: string; name: string }[];
  matchTier: string;
  matchReasons: string[];
  matchWarnings: string[] | null;
  status: string;
  revealed: boolean;
  tradeData: { volume: string; frequency: string; yearsActive: number } | null;
  counterpartyContact: { name: string; email: string; phone: string; website: string | null; title: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GET /api/matches
 * List matches for authenticated user with filtering and pagination
 * 
 * Query params:
 * - tier: 'best' | 'great' | 'good'
 * - country: string
 * - status: 'new' | 'viewed' | 'interested' | 'dismissed'
 * - sort: 'relevance' (default) | 'recent'
 * - page: number (default 1)
 * - limit: number (default 20)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier');
    const country = searchParams.get('country');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = (page - 1) * limit;

    // Build conditions
    const conditions = [eq(matches.profileId, user.id)];
    
    if (tier) {
      conditions.push(eq(matches.matchTier, tier));
    }
    if (country) {
      conditions.push(eq(matches.counterpartyCountry, country));
    }
    if (status) {
      conditions.push(eq(matches.status, status as 'new' | 'viewed' | 'interested' | 'dismissed'));
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(matches)
      .where(and(...conditions));
    
    const total = countResult[0]?.count || 0;

    // Get matches with ordering
    const orderBy = sort === 'recent' 
      ? desc(matches.createdAt)
      : desc(matches.matchScore); // relevance = by score

    const matchResults = await db
      .select()
      .from(matches)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Transform results - STRIP matchScore and scoreBreakdown (internal only)
    // and strip counterpartyContact for unrevealed matches
    const transformedMatches: MatchResponse[] = matchResults.map(match => ({
      id: match.id,
      counterpartyName: match.counterpartyName,
      counterpartyCountry: match.counterpartyCountry,
      counterpartyCity: match.counterpartyCity,
      matchedProducts: match.matchedProducts,
      matchTier: match.matchTier,
      matchReasons: match.matchReasons,
      matchWarnings: match.matchWarnings,
      status: match.status,
      revealed: match.revealed,
      tradeData: match.tradeData,
      // CRITICAL: Only include contact info for revealed matches
      counterpartyContact: match.revealed && match.counterpartyContact 
        ? match.counterpartyContact 
        : null,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    }));

    return NextResponse.json({
      matches: transformedMatches,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
