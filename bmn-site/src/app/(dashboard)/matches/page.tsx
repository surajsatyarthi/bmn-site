import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, matches } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import MatchesList from './MatchesList';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Matches | BMN',
  description: 'View verified international buyers matched to your products and trade interests.',
};

export default async function MatchesPage() {
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

  // Fetch matches for the user
  const userMatches = await db
    .select()
    .from(matches)
    .where(eq(matches.profileId, user.id))
    .orderBy(desc(matches.matchScore));

  // Transform matches - strip internal fields
  const transformedMatches = userMatches.map(match => ({
    id: match.id,
    counterpartyName: match.counterpartyName,
    counterpartyCountry: match.counterpartyCountry,
    counterpartyCity: match.counterpartyCity,
    matchedProducts: match.matchedProducts as { hsCode: string; name: string }[],
    matchTier: match.matchTier as 'best' | 'great' | 'good',
    matchReasons: match.matchReasons as string[],
    status: match.status as 'new' | 'viewed' | 'interested' | 'dismissed',
  }));

  // Count by tier
  const bestCount = transformedMatches.filter(m => m.matchTier === 'best').length;
  const greatCount = transformedMatches.filter(m => m.matchTier === 'great').length;
  const goodCount = transformedMatches.filter(m => m.matchTier === 'good').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-text-primary">Your Matches</h1>
        <p className="mt-1 text-text-secondary">
          Buyers matched to your products and trade interests
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Best Matches</p>
          <p className="text-2xl font-bold text-gradient-primary">{bestCount}</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <p className="text-sm text-teal-600 font-medium">Great Matches</p>
          <p className="text-2xl font-bold text-teal-700">{greatCount}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 font-medium">Good Matches</p>
          <p className="text-2xl font-bold text-gray-700">{goodCount}</p>
        </div>
      </div>

      {/* Matches List */}
      {transformedMatches.length > 0 ? (
        <MatchesList initialMatches={transformedMatches} />
      ) : (
        <div className="bg-white rounded-xl border border-bmn-border p-8 shadow-sm text-center">
          <p className="text-text-secondary text-lg">
            No matches found yet. Complete your profile to get personalized buyer matches.
          </p>
        </div>
      )}
    </div>
  );
}
