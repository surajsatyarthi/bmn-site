import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';


export const metadata = {
  title: 'Business Market Network',
  description: 'AI-Powered Business Network',
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  let user;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.error('[Onboarding] Auth check failed:', err);
    redirect('/login?error=service_unavailable');
  }

  if (!user) {
    redirect('/login');
  }

  let profile;
  try {
    profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
      with: { company: true },
    });

    if (!profile) {
      await db.insert(profiles).values({
        id: user.id,
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        tradeRole: 'exporter',
        onboardingStep: 1,
        onboardingCompleted: false,
      });

      profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id),
        with: { company: true },
      });
    }
  } catch (err) {
    console.error('[Onboarding] DB error:', err);
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800">Service temporarily unavailable</h2>
        <p className="text-gray-500 max-w-sm text-sm">
          We had trouble loading your profile. Please refresh the page to try again.
        </p>
        <a href="/onboarding" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
          Refresh
        </a>
      </div>
    );
  }

  if (!profile) {
    redirect('/login');
  }

  if (profile.onboardingCompleted) {
    redirect('/matches');
  }

  return (
    <OnboardingWizard
      initialStep={profile.onboardingStep || 1}
      initialData={JSON.parse(JSON.stringify(profile))}
    />
  );
}
