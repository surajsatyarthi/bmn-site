import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, matches } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Check, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import RevealGate from '@/components/matches/RevealGate';
import { cn } from '@/lib/utils';


export const metadata = {
  title: 'Business Market Network',
  description: 'AI-Powered Business Network',
};

const tierStyles = {
  best: 'bg-blue-100 text-bmn-blue',
  great: 'bg-teal-100 text-teal-700',
  good: 'bg-gray-100 text-gray-600',
};

const tierLabels = {
  best: 'Best Match',
  great: 'Great Match',
  good: 'Good Match',
};

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
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

  // Fetch the match
  const match = await db.query.matches.findFirst({
    where: and(eq(matches.id, id), eq(matches.profileId, user.id)),
  });

  if (!match) {
    notFound();
  }

  // Auto-update status to viewed if new
  if (match.status === 'new') {
    await db
      .update(matches)
      .set({ status: 'viewed' })
      .where(eq(matches.id, id));
  }

  // Fields are already parsed by Drizzle jsonb columns
  const matchedProducts = match.matchedProducts as { hsCode: string; name: string }[];
  const matchReasons = match.matchReasons as string[];
  const matchWarnings = match.matchWarnings as string[] | null;
  const tradeData = match.tradeData as { volume: string; frequency: string; yearsActive: number } | null;
  const contact = match.revealed && match.counterpartyContact 
    ? match.counterpartyContact as { name: string; title: string; email: string; phone: string; website: string | null }
    : null;

  const location = match.counterpartyCity 
    ? `${match.counterpartyCity}, ${match.counterpartyCountry}`
    : match.counterpartyCountry;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        href="/matches"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Matches
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-full',
              tierStyles[match.matchTier as keyof typeof tierStyles]
            )}>
              {tierLabels[match.matchTier as keyof typeof tierLabels]}
            </span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold font-display text-text-primary mb-2">
          {match.counterpartyName}
        </h1>
        
        <div className="flex items-center gap-2 text-text-secondary">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Matched Products */}
          <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-bmn-blue" />
              <h2 className="text-lg font-semibold text-text-primary">Matched Products</h2>
            </div>
            <div className="space-y-2">
              {matchedProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">{product.hsCode}</span>
                  <span className="text-text-primary">{product.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Match Reasons */}
          <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Why This Match</h2>
            <div className="space-y-3">
              {matchReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-text-secondary">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {matchWarnings && matchWarnings.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h2 className="text-lg font-semibold text-amber-800 mb-4">Things to Note</h2>
              <div className="space-y-3">
                {matchWarnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-amber-800">{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Trade Data */}
          {tradeData && (
            <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-bmn-blue" />
                <h2 className="text-lg font-semibold text-text-primary">Trade History</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-text-secondary">Volume</p>
                  <p className="font-semibold text-text-primary">{tradeData.volume}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Frequency</p>
                  <p className="font-semibold text-text-primary">{tradeData.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Years Active</p>
                  <p className="font-semibold text-text-primary">{tradeData.yearsActive}</p>
                </div>
              </div>
            </div>
          )}

          {/* Business Details / Reveal Gate */}
          <RevealGate 
            matchId={match.id}
            revealed={match.revealed}
            contact={contact}
          />
        </div>
      </div>
    </div>
  );
}
