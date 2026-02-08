import { requireAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema'; // Ensure imports are correct
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Building2, ShieldCheck, Mail, Package, TrendingUp, CheckCircle2, Globe, Megaphone } from 'lucide-react';


export const metadata = {
  title: 'Business Market Network',
  description: 'AI-Powered Business Network',
};

export default async function AdminUserDetailPage({
  params
}: {
// ...
// usage: new Date(profile.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })

  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  await requireAdmin();
  const supabase = await createClient();

  // Fetch full profile with ALL relations
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, id),
    with: {
      company: true,
      products: true,
      tradeInterests: true,
      certifications: true,
      matches: {
        orderBy: (matches, { desc }) => [desc(matches.matchScore)],
      },
      campaigns: {
        orderBy: (campaigns, { desc }) => [desc(campaigns.createdAt)],
      },
      matchReveals: true,
    }
  });

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-red-600">User Not Found</h1>
        <Link href="/admin/users" className="text-blue-600 mt-4 inline-block">Back to Users</Link>
      </div>
    );
  }

  const { data: { user } } = await supabase.auth.admin.getUserById(id);
  const email = user?.email || 'Unknown';

  const stats = {
    matches: profile.matches.length,
    reveals: profile.matchReveals.length,
    campaigns: profile.campaigns.length,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-3 w-3" /> {email}
            <span className="text-gray-300">|</span>
            <span className="capitalize">{profile.tradeRole}</span>
            <span className="text-gray-300">|</span>
            <span>Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
           {profile.isAdmin && <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">ADMIN</span>}
           <span className={`px-3 py-1 text-xs font-bold rounded-full ${profile.onboardingCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {profile.onboardingCompleted ? 'Onboarding Complete' : `Step ${profile.onboardingStep}`}
           </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Profile Overview */}
        <div className="space-y-6">
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                 <h2 className="font-semibold text-gray-900">Profile Overview</h2>
              </div>
              
              <div className="p-6 space-y-8">
                 {/* Company Details */}
                 <section>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                       <Building2 className="h-4 w-4 text-blue-600" />
                       Company Details
                    </h3>
                    {profile.company ? (
                       <div className="space-y-3 text-sm">
                          <div>
                             <span className="block text-gray-500 text-xs">Name</span>
                             <span className="font-medium">{profile.company.name}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <span className="block text-gray-500 text-xs">Type</span>
                                <span>{profile.company.entityType}</span>
                             </div>
                             <div>
                                <span className="block text-gray-500 text-xs">Location</span>
                                <span>{profile.company.city}, {profile.company.country}</span>
                             </div>
                          </div>
                          {profile.company.website && (
                            <div>
                               <span className="block text-gray-500 text-xs">Website</span>
                               <a href={profile.company.website} target="_blank" className="text-blue-600 hover:underline truncate block">
                                  {profile.company.website}
                               </a>
                            </div>
                          )}
                       </div>
                    ) : (
                       <p className="text-gray-400 italic text-sm">No company details.</p>
                    )}
                 </section>

                 <div className="border-t border-gray-100"></div>

                 {/* Activity Stats */}
                 <section>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                       <div className="p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-gray-900">{stats.matches}</div>
                          <div className="text-[10px] text-gray-500 uppercase">Matches</div>
                       </div>
                       <div className="p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-gray-900">{stats.reveals}</div>
                          <div className="text-[10px] text-gray-500 uppercase">Reveals</div>
                       </div>
                       <div className="p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-gray-900">{stats.campaigns}</div>
                          <div className="text-[10px] text-gray-500 uppercase">Campaigns</div>
                       </div>
                    </div>
                 </section>

                 <div className="border-t border-gray-100"></div>

                 {/* Certifications */}
                 <section>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                       <ShieldCheck className="h-4 w-4 text-green-600" />
                       Certifications
                    </h3>
                    {profile.certifications.length > 0 ? (
                       <ul className="space-y-2">
                          {profile.certifications.map((c) => (
                             <li key={c.id} className="text-sm flex justify-between items-center bg-green-50/50 p-2 rounded border border-green-100/50">
                                <span className="font-medium text-green-800">{c.type}</span>
                                {c.certificateNumber && <span className="text-xs text-green-600 font-mono">{c.certificateNumber}</span>}
                             </li>
                          ))}
                       </ul>
                    ) : (
                       <p className="text-gray-400 italic text-sm">No certifications.</p>
                    )}
                 </section>
              </div>
           </div>
        </div>

        {/* Middle Col: Trade Profile & Matches */}
        <div className="lg:col-span-2 space-y-6">
           
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                 <h2 className="font-semibold text-gray-900">Trade Profile</h2>
              </div>

              <div className="p-6 space-y-8">
                 {/* Products */}
                 <section>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                       <Package className="h-4 w-4 text-purple-600" />
                       Products & HS Codes
                    </h3>
                    {profile.products.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {profile.products.map((prod) => (
                             <div key={prod.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50/30">
                                <div className="flex justify-between items-start">
                                   <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{prod.hsCode}</span>
                                   <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${prod.tradeType === 'export' ? 'bg-orange-50 text-orange-700' : 'bg-cyan-50 text-cyan-700'}`}>
                                      {prod.tradeType}
                                   </span>
                                </div>
                                <div className="font-medium text-gray-900 mt-2 text-sm">{prod.name}</div>
                                {prod.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{prod.description}</p>}
                             </div>
                          ))}
                       </div>
                    ) : (
                       <p className="text-gray-400 italic text-sm">No products added.</p>
                    )}
                 </section>

                 <div className="border-t border-gray-100"></div>

                 {/* Trade Interests */}
                 <section>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                       <Globe className="h-4 w-4 text-teal-600" />
                       Trade Interests
                    </h3>
                    {profile.tradeInterests.length > 0 ? (
                       <div className="flex flex-wrap gap-2">
                          {profile.tradeInterests.map((interest) => (
                             <span key={interest.id} className={`px-2 py-1 rounded-full text-xs font-medium border ${interest.interestType === 'export_to' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-cyan-50 text-cyan-700 border-cyan-100'}`}>
                                {interest.interestType === 'export_to' ? 'Export to: ' : 'Import from: '}
                                <span className="font-bold">{interest.countryName}</span>
                             </span>
                          ))}
                       </div>
                    ) : (
                       <p className="text-gray-400 italic text-sm">No specific trade interests listed.</p>
                    )}
                 </section>

                 <div className="border-t border-gray-100"></div>

                 {/* Campaigns Summary */}
                 <section>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                       <Megaphone className="h-4 w-4 text-pink-600" />
                       Campaigns
                    </h3>
                    <div className="flex items-center gap-6">
                       <div className="text-center">
                          <span className="block text-2xl font-bold text-gray-900 leading-none">{profile.campaigns.length}</span>
                          <span className="text-[10px] text-gray-500 uppercase font-medium">Total</span>
                       </div>
                       <div className="h-8 w-px bg-gray-200"></div>
                       <div className="flex-1 grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-green-50 p-1.5 rounded text-green-700">
                             <span className="block font-bold mb-0.5">{profile.campaigns.filter(c => c.status === 'active').length}</span>
                             Active
                          </div>
                          <div className="bg-gray-50 p-1.5 rounded text-gray-700">
                             <span className="block font-bold mb-0.5">{profile.campaigns.filter(c => c.status === 'draft').length}</span>
                             Draft
                          </div>
                          <div className="bg-blue-50 p-1.5 rounded text-blue-700">
                             <span className="block font-bold mb-0.5">{profile.campaigns.filter(c => c.status === 'completed').length}</span>
                             Done
                          </div>
                          <div className="bg-yellow-50 p-1.5 rounded text-yellow-700">
                             <span className="block font-bold mb-0.5">{profile.campaigns.filter(c => c.status === 'paused').length}</span>
                             Paused
                          </div>
                       </div>
                    </div>
                 </section>
              </div>
           </div>

            {/* Matches (Internal View) */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    Matches (Admin View)
                 </h2>
                 <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">INTERNAL DATA</span>
              </div>
              
              {profile.matches.length > 0 ? (
                 <div className="space-y-4">
                    {profile.matches.map((match) => (
                       <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <h3 className="font-bold text-gray-900">{match.counterpartyName}</h3>
                                <p className="text-sm text-gray-500">{match.counterpartyCity}, {match.counterpartyCountry}</p>
                             </div>
                             <div className="text-right">
                                <div className="text-2xl font-black text-indigo-600">{match.matchScore}</div>
                                <div className="text-xs uppercase font-bold tracking-wider text-gray-400">{match.matchTier}</div>
                             </div>
                          </div>
                          
                          {/* Internal Warnings/Reasons */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                             <div>
                                <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Score Breakdown</span>
                                <pre className="text-[10px] bg-gray-100 p-2 rounded overflow-auto">
                                   {JSON.stringify(match.scoreBreakdown, null, 2)}
                                </pre>
                             </div>
                             <div>
                                <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Warnings</span>
                                {match.matchWarnings && match.matchWarnings.length > 0 ? (
                                   <ul className="list-disc list-inside text-xs text-red-600">
                                      {match.matchWarnings.map((w, i) => <li key={i}>{w}</li>)}
                                   </ul>
                                ) : (
                                   <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Clean</span>
                                )}
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <p className="text-gray-400 italic text-sm">No matches generate yet.</p>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}


