import { db } from '@/lib/db';
import { matches } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

    // Validation Schema
    const MatchSchema = z.object({
      profileId: z.string().uuid(),
      counterpartyName: z.string().min(1),
      matchScore: z.number().min(0).max(100),
      matchTier: z.enum(['best', 'great', 'good']),
      scoreBreakdown: z.record(z.string(), z.any()).optional(),
      matchReasons: z.array(z.string()).optional(),
      matchedProducts: z.array(z.object({
        hsCode: z.string(),
        name: z.string()
      })).min(1)
    });

    // Validate payload
    for (const item of payload) {
       const validation = MatchSchema.safeParse(item);
       if (!validation.success) {
          return NextResponse.json({ 
            error: 'Validation failed', 
            details: validation.error.format() 
          }, { status: 400 });
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
