import { db } from '@/lib/db';
import { matches } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// RateLimit: Admin routes are protected by Auth, explicit rate limiting deferred.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin Check
  const requesterProfile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.id, user.id),
  });

  if (!requesterProfile?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const isBulk = body.matches && Array.isArray(body.matches);
    const payload = isBulk ? body.matches : [body.match || body];

    if (!payload || payload.length === 0) {
       return NextResponse.json({ error: 'No match data provided' }, { status: 400 });
    }

    // Validation
    for (const item of payload) {
       if (!item.profileId || !item.counterpartyName || !item.matchScore) {
          return NextResponse.json({ error: 'Missing required fields: profileId, counterpartyName, matchScore' }, { status: 400 });
       }
    }

    // Insert Matches
    const result = await db.insert(matches).values(payload).returning();

    return NextResponse.json({ success: true, count: result.length, matches: result });
  } catch (error: unknown) {
    console.error('Match Upload Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload matches';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
