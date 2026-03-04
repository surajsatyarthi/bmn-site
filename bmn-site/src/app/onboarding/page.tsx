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
    redirect('/login?error=service_unavailable');
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
