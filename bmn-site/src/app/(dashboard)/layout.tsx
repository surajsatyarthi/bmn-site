import TopNav from '@/components/dashboard/TopNav';
import Sidebar from '@/components/dashboard/Sidebar';

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  return (
    <div className="min-h-screen flex flex-col bg-bmn-light-bg">
      <TopNav user={user} profile={profile} />

      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar />

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden">
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
