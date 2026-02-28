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
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
