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

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
    with: {
        company: true, // Fetch related company data
    }
  });

  if (!profile) {
    redirect('/login');
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
