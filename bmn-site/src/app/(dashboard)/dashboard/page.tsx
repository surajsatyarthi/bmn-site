import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, companies, products, tradeInterests, certifications, matches, campaigns, adminNotices } from '@/lib/db/schema';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Users, Megaphone, MapPin, ArrowRight, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminNotice } from '@/components/dashboard/AdminNotice';

const tierStyles = {
  best: 'bg-blue-100 text-bmn-blue',
  great: 'bg-teal-100 text-teal-700',
  good: 'bg-gray-100 text-gray-600',
};

const tierLabels = {
  best: 'Best',
  great: 'Great',
  good: 'Good',
};

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | BMN',
  description: 'Manage your trade profile, view your matches, and track your active outreach campaigns.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  if (!profile) {
    redirect('/login');
  }

  if (!profile.onboardingCompleted) {
    redirect('/onboarding');
  }

  // Calculate profile completion
  const company = await db.query.companies.findFirst({
    where: eq(companies.profileId, user.id),
  });
  
  const userProducts = await db.select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.profileId, user.id));
  
  const userInterests = await db.select({ count: sql<number>`count(*)::int` })
    .from(tradeInterests)
    .where(eq(tradeInterests.profileId, user.id));
  
  const userCerts = await db.select({ count: sql<number>`count(*)::int` })
    .from(certifications)
    .where(eq(certifications.profileId, user.id));

  // Profile completion calculation
  let completionScore = 0;
  const maxScore = 5;
  
  if (profile.tradeRole) completionScore++;
  if (userProducts[0]?.count > 0) completionScore++;
  if (userInterests[0]?.count > 0) completionScore++;
  if (company?.name) completionScore++;
  if (userCerts[0]?.count > 0) completionScore++;
  
  const profileCompletion = Math.round((completionScore / maxScore) * 100);

  // Get matches count (score >= 50)
  const matchCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(matches)
    .where(and(
      eq(matches.profileId, user.id),
      gte(matches.matchScore, 50)
    ));

  // Get recent matches (top 5)
  const recentMatches = await db
    .select()
    .from(matches)
    .where(eq(matches.profileId, user.id))
    .orderBy(desc(matches.matchScore))
    .limit(5);

  const transformedMatches = recentMatches.map(match => ({
    id: match.id,
    counterpartyName: match.counterpartyName,
    counterpartyCountry: match.counterpartyCountry,
    matchedProducts: match.matchedProducts as { hsCode: string; name: string }[],
    matchTier: match.matchTier as 'best' | 'great' | 'good',
  }));

  // Get active campaigns count
  const activeCampaignCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(campaigns)
    .where(and(
      eq(campaigns.profileId, user.id),
      eq(campaigns.status, 'active')
    ));



  // Get recent campaigns (top 3, active first)
  const recentCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.profileId, user.id))
    .orderBy(desc(campaigns.createdAt))
    .limit(3);

  // Get active notices
  const activeNotices = await db.query.adminNotices.findMany({
    where: and(
      eq(adminNotices.userId, user.id),
      eq(adminNotices.dismissed, false)
    ),
    orderBy: desc(adminNotices.createdAt),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-text-primary">Dashboard</h1>
        <p className="mt-1 text-text-secondary">Welcome back, {profile.fullName.split(' ')[0]}.</p>
      </div>

      <AdminNotice notices={activeNotices} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Completion */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="h-5 w-5 icon-gradient-primary" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Profile Completion</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">{profileCompletion}%</p>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-bmn-blue rounded-full transition-all"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>

        {/* Matches Found */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Matches Found</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">{matchCount[0]?.count || 0}</p>
          <p className="text-sm text-text-secondary mt-1">Qualified buyers</p>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Megaphone className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Active Campaigns</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">{activeCampaignCount[0]?.count || 0}</p>
          <p className="text-sm text-text-secondary mt-1">Outreach in progress</p>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="bg-white rounded-xl border border-bmn-border shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-bmn-border">
          <h2 className="text-lg font-semibold text-text-primary">Recent Matches</h2>
          {transformedMatches.length > 0 && (
            <Link 
              href="/matches"
              className="flex items-center gap-1 text-sm font-medium text-gradient-primary hover:underline hover:decoration-bmn-blue"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        
        <div className="divide-y divide-bmn-border">
          {transformedMatches.length > 0 ? (
            transformedMatches.map(match => (
              <Link 
                key={match.id}
                href={`/matches/${match.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-semibold rounded-full',
                      tierStyles[match.matchTier]
                    )}>
                      {tierLabels[match.matchTier]}
                    </span>
                    <span className="font-medium text-text-primary truncate">
                      {match.counterpartyName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {match.counterpartyCountry}
                    </span>
                    <span className="truncate">
                      {match.matchedProducts.map(p => p.name).join(', ')}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-text-secondary shrink-0" />
              </Link>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-text-secondary">
                No matches yet. Complete your profile to get personalized buyer matches.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Activity */}
      <div className="bg-white rounded-xl border border-bmn-border shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-bmn-border">
          <h2 className="text-lg font-semibold text-text-primary">Campaign Activity</h2>
          {recentCampaigns.length > 0 && (
            <Link 
              href="/campaigns"
              className="flex items-center gap-1 text-sm font-medium text-gradient-primary hover:underline hover:decoration-bmn-blue"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        
        <div className="divide-y divide-bmn-border">
          {recentCampaigns.length > 0 ? (
            recentCampaigns.map(campaign => (
              <Link 
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-amber-50 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{campaign.name}</p>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-semibold rounded-full',
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      campaign.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                      'bg-blue-100 text-bmn-blue'
                    )}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                    <span>{campaign.emailsSent} sent</span>
                    <span>{campaign.emailsReplied} replies</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-text-secondary shrink-0" />
              </Link>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-text-secondary">
                No campaigns yet. Mark matches as &apos;Interested&apos; to begin outreach.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
