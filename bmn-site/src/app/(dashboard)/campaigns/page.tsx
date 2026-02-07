import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, campaigns } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Mail, MessageSquare, BarChart3 } from 'lucide-react';
import CampaignCard from '@/components/campaigns/CampaignCard';

export default async function CampaignsPage() {
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

  // Fetch campaigns for the user
  const userCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.profileId, user.id))
    .orderBy(desc(campaigns.createdAt));

  // Calculate stats
  const activeCount = userCampaigns.filter(c => c.status === 'active').length;
  const totalSent = userCampaigns.reduce((sum, c) => sum + c.emailsSent, 0);
  const totalReplied = userCampaigns.reduce((sum, c) => sum + c.emailsReplied, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-text-primary">Your Campaigns</h1>
        <p className="mt-1 text-text-secondary">
          Outreach campaigns BMN runs on your behalf
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-600 font-medium">Active Campaigns</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{activeCount}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 icon-gradient-primary" />
            <p className="text-sm text-gradient-primary font-medium">Total Emails Sent</p>
          </div>
          <p className="text-2xl font-bold text-bmn-navy">{totalSent}</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-teal-600" />
            <p className="text-sm text-teal-600 font-medium">Total Replies</p>
          </div>
          <p className="text-2xl font-bold text-teal-700">{totalReplied}</p>
        </div>
      </div>

      {/* Campaigns List */}
      {userCampaigns.length > 0 ? (
        <div className="space-y-4">
          {userCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-bmn-border p-8 shadow-sm text-center">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No campaigns yet</h3>
          <p className="text-text-secondary mb-4">
            Once you mark matches as &apos;Interested&apos;, our team will create targeted outreach campaigns.
          </p>
          <Link
            href="/matches"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2"
          >
            Browse Matches
          </Link>
        </div>
      )}
    </div>
  );
}
