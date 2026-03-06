import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, matches } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
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
    redirect('/onboarding');
  }

  if (!profile.onboardingCompleted) {
    redirect('/onboarding');
  }

  // Fetch matches — wrapped in try/catch so DB errors never crash the page
  let transformedMatches: {
    id: string;
    counterpartyName: string;
    counterpartyCountry: string;
    counterpartyCity: string | null;
    matchedProducts: { hsCode: string; name: string }[];
    matchTier: 'best' | 'great' | 'good';
    matchReasons: string[];
    status: 'new' | 'viewed' | 'interested' | 'dismissed';
  }[] = [];

  let fetchError = false;

  try {
    const userMatches = await db
      .select({
        id: matches.id,
        counterpartyName: matches.counterpartyName,
        counterpartyCountry: matches.counterpartyCountry,
        counterpartyCity: matches.counterpartyCity,
        matchedProducts: matches.matchedProducts,
        matchTier: matches.matchTier,
        matchReasons: matches.matchReasons,
        status: matches.status,
        matchScore: matches.matchScore,
      })
      .from(matches)
      .where(eq(matches.profileId, user.id))
      .orderBy(desc(matches.matchScore));

    transformedMatches = userMatches.map(match => ({
      id: match.id,
      counterpartyName: match.counterpartyName,
      counterpartyCountry: match.counterpartyCountry,
      counterpartyCity: match.counterpartyCity,
      matchedProducts: match.matchedProducts as { hsCode: string; name: string }[],
      matchTier: match.matchTier as 'best' | 'great' | 'good',
      matchReasons: match.matchReasons as string[],
      status: match.status as 'new' | 'viewed' | 'interested' | 'dismissed',
    }));
  } catch (err) {
    console.error('[MatchesPage] Failed to fetch matches:', err);
    fetchError = true;
  }

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

      {fetchError ? (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-8 shadow-sm text-center">
          <p className="text-amber-800 font-medium">We had trouble loading your matches.</p>
          <p className="text-amber-600 text-sm mt-1">Please refresh the page to try again. If the issue persists, contact support.</p>
        </div>
      ) : transformedMatches.length === 0 ? (
        <div className="bg-white rounded-xl border border-bmn-border p-12 shadow-sm text-center space-y-3">
          <div className="text-5xl">🔍</div>
          <h2 className="text-xl font-semibold text-text-primary">Your matches are being computed</h2>
          <p className="text-text-secondary text-sm max-w-sm mx-auto">
            Our AI is analysing trade shipment records to find your best buyer matches. This usually takes less than a minute — please refresh the page.
          </p>
          <Link
            href="/matches"
            className="inline-block mt-4 px-6 py-2 bg-bmn-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Matches
          </Link>
        </div>
      ) : (
        <>
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
          <MatchesList initialMatches={transformedMatches} />
        </>
      )}
    </div>
  );
}
