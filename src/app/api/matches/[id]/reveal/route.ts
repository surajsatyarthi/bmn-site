import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { matches, matchReveals, profiles } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

/**
 * POST /api/matches/[id]/reveal
 * Reveal match contact details (with free tier gating)
 * 
 * Free tier: 3 reveals per month
 * Returns full match with contact info on success
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success } = rateLimit(`reveal:${user.id}`, 10, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const { id } = await params;

    // Verify match belongs to user
    const match = await db.query.matches.findFirst({
      where: and(eq(matches.id, id), eq(matches.profileId, user.id)),
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // If already revealed, return success (idempotent)
    if (match.revealed) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const revealCount = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(matchReveals)
        .where(
          and(
            eq(matchReveals.profileId, user.id),
            eq(matchReveals.monthKey, currentMonth)
          )
        );

      return NextResponse.json({
        match: {
          id: match.id,
          counterpartyName: match.counterpartyName,
          counterpartyCountry: match.counterpartyCountry,
          counterpartyCity: match.counterpartyCity,
          matchedProducts: match.matchedProducts,
          matchTier: match.matchTier,
          matchReasons: match.matchReasons,
          matchWarnings: match.matchWarnings,
          status: match.status,
          revealed: true,
          tradeData: match.tradeData,
          counterpartyContact: match.counterpartyContact,
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
        },
        reveals: {
          used: revealCount[0]?.count || 0,
          remaining: Math.max(0, 3 - (revealCount[0]?.count || 0)),
          total: 3,
        },
      });
    }

    // Get user's plan
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check reveal eligibility for free tier
    const currentMonth = new Date().toISOString().slice(0, 7); // '2026-02'
    
    if (profile.plan === 'free') {
      const revealCount = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(matchReveals)
        .where(
          and(
            eq(matchReveals.profileId, user.id),
            eq(matchReveals.monthKey, currentMonth)
          )
        );

      const used = revealCount[0]?.count || 0;

      if (used >= 3) {
        return NextResponse.json(
          { 
            error: 'Reveal limit reached',
            reveals: { used: 3, remaining: 0, total: 3 },
            message: 'Upgrade to Pro for unlimited reveals',
          },
          { status: 403 }
        );
      }
    }

    // Perform reveal
    // 1. Set matches.revealed = true
    await db
      .update(matches)
      .set({ revealed: true })
      .where(eq(matches.id, id));

    // 2. Insert into matchReveals
    await db.insert(matchReveals).values({
      profileId: user.id,
      matchId: id,
      monthKey: currentMonth,
    });

    // Get updated reveal count
    const newRevealCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(matchReveals)
      .where(
        and(
          eq(matchReveals.profileId, user.id),
          eq(matchReveals.monthKey, currentMonth)
        )
      );

    const used = newRevealCount[0]?.count || 0;

    // Return full match with contact info
    return NextResponse.json({
      match: {
        id: match.id,
        counterpartyName: match.counterpartyName,
        counterpartyCountry: match.counterpartyCountry,
        counterpartyCity: match.counterpartyCity,
        matchedProducts: match.matchedProducts,
        matchTier: match.matchTier,
        matchReasons: match.matchReasons,
        matchWarnings: match.matchWarnings,
        status: match.status,
        revealed: true,
        tradeData: match.tradeData,
        counterpartyContact: match.counterpartyContact,
        createdAt: match.createdAt,
        updatedAt: match.updatedAt,
      },
      reveals: {
        used,
        remaining: profile.plan === 'free' ? Math.max(0, 3 - used) : 'unlimited',
        total: profile.plan === 'free' ? 3 : 'unlimited',
      },
    });

  } catch (error) {
    console.error('Error revealing match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
