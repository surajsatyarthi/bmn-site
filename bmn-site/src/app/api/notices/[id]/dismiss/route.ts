import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { adminNotices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db
      .update(adminNotices)
      .set({ dismissed: true })
      .where(eq(adminNotices.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error dismissing notice:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
