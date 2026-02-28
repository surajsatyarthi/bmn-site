import TopNav from '@/components/dashboard/TopNav';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Auth check ---
  let user;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.error('[DashboardLayout] Auth check failed:', err);
    redirect('/login');
  }

  if (!user) {
    redirect('/login');
  }

  // --- Profile check ---
  let profile;
  try {
    profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });
  } catch (err) {
    console.error('[DashboardLayout] Profile query failed:', err);
    redirect('/login?error=service_unavailable');
  }

  // If user has no profile, send them to onboarding (which auto-creates it)
  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen flex flex-col bg-bmn-light-bg">
      <TopNav user={user} profile={profile} />
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-sm text-amber-900">
        🧪 <strong>Internal Beta</strong> — AI matching is seeded for{' '}
        <strong>HS Chapter 33 (Cosmetics/Soaps)</strong> and{' '}
        <strong>HS Chapter 07 (Vegetables)</strong> only.
        Please select one of these during onboarding to see your AI matches.
      </div>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
