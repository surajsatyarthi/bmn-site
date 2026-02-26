import Link from 'next/link';
import DashboardNav from '@/components/dashboard/DashboardNav';
import UserMenu from '@/components/dashboard/UserMenu';
import MobileNav from '@/components/dashboard/MobileNav';

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
    // DB is down — show a useful error rather than generic crash
    redirect('/login?error=service_unavailable');
  }

  // If user has no profile, send them to onboarding (which auto-creates it)
  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen flex flex-col bg-bmn-light-bg">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-bmn-border flex items-center justify-between px-6 sticky top-0 z-30 gap-4">
        <Link href="/" className="text-2xl font-display font-bold text-gradient-primary">
          BMN
        </Link>
        <div className="flex items-center gap-4">
          <UserMenu user={user} profile={profile} />
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-bmn-border hidden md:flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <DashboardNav />
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)]">
          <main className="flex-1 p-8 pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
