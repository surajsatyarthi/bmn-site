import { requireAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { profiles, matches, campaigns } from '@/lib/db/schema';
import { count, eq, desc } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, CheckCircle2, Search, BarChart3, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Business Market Network',
  description: 'AI-Powered Business Network',
};

// Helper for time ago
function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = await createClient();

  // 1. Fetch Stats
  const [
    totalUsersResult,
    onboardingCompleteResult,
    totalMatchesResult,
    activeCampaignsResult,
    recentProfiles
  ] = await Promise.all([
    db.select({ count: count() }).from(profiles),
    db.select({ count: count() }).from(profiles).where(eq(profiles.onboardingCompleted, true)),
    db.select({ count: count() }).from(matches),
    db.select({ count: count() }).from(campaigns).where(eq(campaigns.status, 'active')),
    db.query.profiles.findMany({
      orderBy: [desc(profiles.createdAt)],
      limit: 10,
    })
  ]);

  const totalUsers = totalUsersResult[0].count;
  const completedUsers = onboardingCompleteResult[0].count;
  const onboardingRate = totalUsers > 0 ? Math.round((completedUsers / totalUsers) * 100) : 0;
  
  // 2. Fetch Emails for Recent Profiles
  // We fetch each user's email individually since batch fetch by ID isn't direct in Admin API without listing all
  const profilesWithEmails = await Promise.all(
    recentProfiles.map(async (p) => {
      const { data: { user } } = await supabase.auth.admin.getUserById(p.id);
      return {
        ...p,
        email: user?.email || 'Unknown'
      };
    })
  );

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers.toLocaleString(),
      subtext: 'Registered accounts',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Onboarding Complete',
      value: completedUsers.toLocaleString(),
      subtext: `${onboardingRate}% completion rate`,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Total Matches',
      value: totalMatchesResult[0].count.toLocaleString(),
      subtext: 'Generated matches',
      icon: Search,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'Active Campaigns',
      value: activeCampaignsResult[0].count.toLocaleString(),
      subtext: 'Running now',
      icon: BarChart3,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of platform activity and recent signups.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Signups */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Signups</h2>
            <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                     <th className="px-6 py-3">User</th>
                     <th className="px-6 py-3">Role</th>
                     <th className="px-6 py-3">Status</th>
                     <th className="px-6 py-3">Joined</th>
                     <th className="px-6 py-3">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {profilesWithEmails.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{p.fullName}</div>
                          <div className="text-gray-500 text-xs">{p.email}</div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="capitalize px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                             {p.tradeRole}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          {p.onboardingCompleted ? (
                             <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                                Complete
                             </span>
                          ) : (
                             <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                                Step {p.onboardingStep}
                             </span>
                          )}
                       </td>
                       <td className="px-6 py-4 text-gray-500">
                          {getTimeAgo(new Date(p.createdAt))}
                       </td>
                       <td className="px-6 py-4">
                          <Link 
                            href={`/admin/users/${p.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                             View
                          </Link>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
