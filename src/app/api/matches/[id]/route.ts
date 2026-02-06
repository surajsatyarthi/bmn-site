import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { matches } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

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
 * GET /api/matches/[id]
 * Get single match by ID. Auto-updates status to 'viewed' if currently 'new'.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch match - must belong to authenticated user
    const match = await db.query.matches.findFirst({
      where: and(eq(matches.id, id), eq(matches.profileId, user.id)),
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Auto-update status to 'viewed' if currently 'new'
    if (match.status === 'new') {
      await db
        .update(matches)
        .set({ status: 'viewed' })
        .where(eq(matches.id, id));
    }

    // Transform - STRIP matchScore and scoreBreakdown
    const response: MatchResponse = {
      id: match.id,
      counterpartyName: match.counterpartyName,
      counterpartyCountry: match.counterpartyCountry,
      counterpartyCity: match.counterpartyCity,
      matchedProducts: match.matchedProducts,
      matchTier: match.matchTier,
      matchReasons: match.matchReasons,
      matchWarnings: match.matchWarnings,
      status: match.status === 'new' ? 'viewed' : match.status, // Reflect new status
      revealed: match.revealed,
      tradeData: match.tradeData,
      // CRITICAL: Only include contact info for revealed matches
      counterpartyContact: match.revealed && match.counterpartyContact 
        ? match.counterpartyContact 
        : null,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    };

    return NextResponse.json({ match: response });

  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/matches/[id]
 * Update match status to 'interested' or 'dismissed'
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !['interested', 'dismissed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "interested" or "dismissed".' },
        { status: 400 }
      );
    }

    // Verify match belongs to user
    const match = await db.query.matches.findFirst({
      where: and(eq(matches.id, id), eq(matches.profileId, user.id)),
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Update status
    await db
      .update(matches)
      .set({ status })
      .where(eq(matches.id, id));

    return NextResponse.json({ success: true, status });

  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
