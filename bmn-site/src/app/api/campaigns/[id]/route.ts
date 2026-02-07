import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { campaigns } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

interface CampaignResponse {
  id: string;
  name: string;
  targetDescription: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  meetingsBooked: number;
  metricsUpdatedAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GET /api/campaigns/[id]
 * Get single campaign by ID
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

    // Fetch campaign - must belong to authenticated user
    const campaign = await db.query.campaigns.findFirst({
      where: and(eq(campaigns.id, id), eq(campaigns.profileId, user.id)),
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Transform
    const response: CampaignResponse = {
      id: campaign.id,
      name: campaign.name,
      targetDescription: campaign.targetDescription,
      status: campaign.status,
      emailsSent: campaign.emailsSent,
      emailsOpened: campaign.emailsOpened,
      emailsReplied: campaign.emailsReplied,
      meetingsBooked: campaign.meetingsBooked,
      metricsUpdatedAt: campaign.metricsUpdatedAt,
      startedAt: campaign.startedAt,
      completedAt: campaign.completedAt,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    };

    return NextResponse.json({ campaign: response });

  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
