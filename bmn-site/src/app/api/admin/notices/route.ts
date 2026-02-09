import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { adminNotices, profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const noticeSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['document_upload_request', 'general', 'urgent']),
  title: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
      columns: { isAdmin: true }
    });

    if (!profile?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = noticeSchema.parse(body);

    const [notice] = await db.insert(adminNotices).values({
      userId: validatedData.userId,
      type: validatedData.type,
      title: validatedData.title,
      message: validatedData.message,
    }).returning();

    return NextResponse.json(notice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating notice:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
