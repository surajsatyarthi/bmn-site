import { requireAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Search } from 'lucide-react';


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

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
// ...
// ... in the map loop:
// {getTimeAgo(new Date(p.createdAt))}

  await searchParams; // Properly await params in Next.js 15+
  await requireAdmin();
  const supabase = await createClient();

  // Queries using Drizzle query builder for cleaner relation fetching
  // We need to fetch counts manually or subquery if not using aggregation extension
  // For simplicity and speed: fetch profiles with company, then get counts via separate aggregation or just basic array length if list is small. 
  // BETTER: Use raw SQL or subqueries for counts to be efficient.

  // Let's us basic `findMany` with relations for now. If perf issues, we optimize.
  // Actually, we can just select profiles and count separately or use `extras`.
  
  const allProfiles = await db.query.profiles.findMany({
    orderBy: [desc(profiles.createdAt)],
    with: {
      company: true,
      products: true,
      matches: true,
      campaigns: true,
    }
  });

  // Fetch emails
  const profilesWithData = await Promise.all(
    allProfiles.map(async (p) => {
      const { data: { user } } = await supabase.auth.admin.getUserById(p.id);
      return {
        ...p,
        email: user?.email || 'Unknown',
        productCount: p.products.length,
        matchCount: p.matches.length,
        campaignCount: p.campaigns.length,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <div className="flex items-center gap-2">
           {/* Placeholder for search/filter inputs */}
           <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" 
              />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">User / Company</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-center">Products</th>
                <th className="px-6 py-3 text-center">Matches</th>
                <th className="px-6 py-3 text-center">Campaigns</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profilesWithData.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{p.fullName}</div>
                    <div className="text-gray-500 text-xs">{p.email}</div>
                    {p.company && (
                      <div className="text-blue-600 text-xs mt-0.5">{p.company.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                      {p.tradeRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">{p.productCount}</td>
                  <td className="px-6 py-4 text-center font-medium">{p.matchCount}</td>
                  <td className="px-6 py-4 text-center font-medium">{p.campaignCount}</td>
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
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {getTimeAgo(new Date(p.createdAt))}
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/admin/users/${p.id}`}
                      className="text-white bg-gray-900 hover:bg-gray-800 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {profilesWithData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
