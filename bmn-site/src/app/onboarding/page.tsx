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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
    with: {
        company: true, // Fetch related company data
    }
  });

  // AUTO-CREATE PROFILE: If user is verified but has no profile, create one
  // This prevents infinite redirect loop between /onboarding and /login
  if (!profile) {
    console.log(`[Onboarding] Creating profile for new user: ${user.id}`);
    
    await db.insert(profiles).values({
      id: user.id,
      fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      tradeRole: 'exporter', // Default - will be updated in onboarding
      onboardingStep: 1,
      onboardingCompleted: false,
    });

    // Fetch the newly created profile
    profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
      with: {
        company: true,
      }
    });

    if (!profile) {
      // This should never happen, but safety check
      console.error('[Onboarding] Failed to create profile');
      redirect('/login');
    }
  }

  if (profile.onboardingCompleted) {
    redirect('/dashboard');
  }

  return (
    <OnboardingWizard
      initialStep={profile.onboardingStep || 1}
      initialData={profile}
    />
  );
}
