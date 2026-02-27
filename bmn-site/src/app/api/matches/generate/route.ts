import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/lib/db';
import { generateMatchesForUser } from '@/lib/matching/engine';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const matches = await generateMatchesForUser(user.id, db);

    return NextResponse.json({ count: matches?.length || 0 });
  } catch (error) {
    console.error('Error generating matches:', error);
    return NextResponse.json({ error: 'Failed to generate matches' }, { status: 500 });
  }
}
