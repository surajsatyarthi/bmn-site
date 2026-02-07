import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  // Fetch Full Profile
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, id),
    with: {
      company: true,
      products: true,
      tradeInterests: true,
      certifications: true,
      matches: true,
      campaigns: true,
      matchReveals: true,
    }
  });

  if (!profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: profile });
}
