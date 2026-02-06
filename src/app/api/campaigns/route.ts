import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { campaigns } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

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
 * GET /api/campaigns
 * List campaigns for authenticated user
 * 
 * Query params:
 * - status: 'draft' | 'active' | 'paused' | 'completed'
 * - sort: 'recent' (default) | 'active_first'
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'draft' | 'active' | 'paused' | 'completed' | null;
    const sort = searchParams.get('sort') || 'recent';

    // Build conditions
    const conditions = [eq(campaigns.profileId, user.id)];
    
    if (status) {
      conditions.push(eq(campaigns.status, status));
    }

    // Get campaigns with ordering
    let campaignResults;
    
    if (sort === 'active_first') {
      // Custom sorting: active first, then by createdAt desc
      // Drizzle doesn't have CASE WHEN, so we'll sort in memory
      campaignResults = await db
        .select()
        .from(campaigns)
        .where(and(...conditions))
        .orderBy(desc(campaigns.createdAt));
      
      // Sort active first
      campaignResults.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return 0;
      });
    } else {
      campaignResults = await db
        .select()
        .from(campaigns)
        .where(and(...conditions))
        .orderBy(desc(campaigns.createdAt));
    }

    // Transform results
    const transformedCampaigns: CampaignResponse[] = campaignResults.map(campaign => ({
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
    }));

    return NextResponse.json({ campaigns: transformedCampaigns });

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
