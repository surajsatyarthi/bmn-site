import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
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

  // Fetch all profiles for dropdown
  const allProfiles = await db.query.profiles.findMany({
    orderBy: [desc(profiles.createdAt)],
    columns: {
       id: true,
       fullName: true,
       tradeRole: true,
    },
    with: {
       company: {
          columns: { name: true }
       }
    }
  });

  return NextResponse.json({ users: allProfiles });
}
