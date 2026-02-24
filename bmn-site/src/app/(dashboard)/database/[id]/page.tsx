import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { globalTradeCompanies, profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { maskContactField, getShipmentSummary, ShipmentSummary } from '@/lib/database/company-detail';
import { ContactRevealButton } from './ContactRevealButton';
import type { Metadata } from 'next';

type TabType = 'overview' | 'exports' | 'imports' | 'contact';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

function countryFlag(cc: string | null): string {
  if (!cc || cc.length !== 2) return '🌐';
  const a = cc.toUpperCase().charCodeAt(0) - 65 + 0x1f1e6;
  const b = cc.toUpperCase().charCodeAt(1) - 65 + 0x1f1e6;
  return String.fromCodePoint(a, b);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) return { title: 'Not Found' };
  
  const [company] = await db
    .select({ name: globalTradeCompanies.companyName })
    .from(globalTradeCompanies)
    .where(eq(globalTradeCompanies.id, id));
    
  if (!company) return { title: 'Not Found' };
  return { title: `${company.name} | BMN Company Detail` };
}

export default async function CompanyDetailPage({ params, searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Verify UUID format before querying
  const { id } = await params;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  // Get user profile plan
  const [profile] = await db
    .select({ plan: profiles.plan })
    .from(profiles)
    .where(eq(profiles.id, user.id));
    
  const isHunter = profile?.plan === 'hunter' || profile?.plan === 'partner';

  // Fetch company data
  const [company] = await db
    .select()
    .from(globalTradeCompanies)
    .where(eq(globalTradeCompanies.id, id));

  if (!company) {
    notFound();
  }

  // Parse current tab
  const { tab } = await searchParams;
  const activeTab: TabType = (['overview', 'exports', 'imports', 'contact'].includes(tab as string) 
    ? tab 
    : 'overview') as TabType;

  // Render variables
  const partners = company.partnerCountries || [];
  const displayPartners = isHunter ? partners : partners.slice(0, 3);
  
  // NOTE: ENTRY-15.0 will wire up the actual trade direction. Passing 'both' as a placeholder for the empty state.
  const summary: ShipmentSummary = await getShipmentSummary(id, 'export');
  const importSummary: ShipmentSummary = await getShipmentSummary(id, 'import');

  // Badge coloring
  const roleColors: Record<string, string> = {
    exporter: 'bg-green-100 text-green-700',
    importer: 'bg-blue-100 text-blue-700',
    both: 'bg-purple-100 text-purple-700',
  };
  const roleBadge = roleColors[company.tradeType || ''] || 'bg-gray-100 text-gray-700';

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="rounded-xl border border-bmn-border bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{countryFlag(company.countryCode)}</span>
              <h1 className="text-2xl font-bold font-display text-text-primary">
                {company.companyName}
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {company.tradeType && (
                <span className={`rounded-full px-3 py-1 font-medium capitalize ${roleBadge}`}>
                  {company.tradeType}
                </span>
              )}
              {company.countryName && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 font-medium">
                  {company.countryName}
                </span>
              )}
            </div>
            
            <p className="max-w-2xl text-text-secondary leading-relaxed">
              {company.hsDescription ? `Primary Trade: ${company.hsDescription}` : 'No primary product description available.'}
              {company.hsChapter && ` (HS Chapter ${company.hsChapter})`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-xl border border-bmn-border bg-white shadow-sm overflow-hidden min-h-[400px]">
        {/* URL Tabs Navigation */}
        <div className="border-b border-bmn-border px-2 sm:px-6">
          <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'exports', name: 'Exports' },
              { id: 'imports', name: 'Imports' },
              { id: 'contact', name: 'Contact Info' },
            ].map((t) => (
              <Link
                key={t.id}
                href={`/database/${id}?tab=${t.id}`}
                className={`shrink-0 border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? 'border-bmn-blue text-bmn-blue'
                    : 'border-transparent text-text-secondary hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {t.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 md:p-8">
          {/* TAB: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              
              {/* Submission section: Shipment Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Shipment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                     <p className="text-sm text-slate-500 font-medium">Export Shipments</p>
                     <p className="text-2xl font-bold text-slate-900 mt-1">{summary.exportCount}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                     <p className="text-sm text-slate-500 font-medium">Import Shipments</p>
                     <p className="text-2xl font-bold text-slate-900 mt-1">{importSummary.importCount}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2 rounded-xl border border-slate-200 p-4 bg-slate-50">
                     <p className="text-sm text-slate-500 font-medium">Last Shipment Date</p>
                     <p className="text-2xl font-bold text-slate-900 mt-1">
                       {summary.lastShipmentDate ? new Date(summary.lastShipmentDate).toLocaleDateString() : 'No recent activity'}
                     </p>
                  </div>
                </div>
              </div>

              {/* Submission section: Top Categories */}
              <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-text-primary">Top Categories (HS Codes)</h3>
                 {company.topProducts && company.topProducts.length > 0 ? (
                   <div className="flex flex-wrap gap-2">
                     {company.topProducts.map((product, idx) => (
                       <span key={idx} className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200">
                         {product}
                       </span>
                     ))}
                   </div>
                 ) : (
                   <p className="text-text-secondary">No product data available for this company.</p>
                 )}
              </div>

              {/* Submission section: Frequent Partner Countries */}
              <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-text-primary">Frequent Partner Countries</h3>
                 
                 {displayPartners.length > 0 ? (
                   <div className="flex flex-wrap gap-3">
                     {displayPartners.map(country => (
                       <div key={country} className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 bg-slate-50 shadow-sm">
                         <span className="text-lg">{countryFlag(country)}</span>
                         <span className="text-sm font-medium text-slate-700">{country}</span>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-text-secondary">No partner countries available for this company.</p>
                 )}

                 {!isHunter && partners.length > 3 && (
                   <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div>
                       <h4 className="text-base font-bold text-blue-900">Unlock All Partners</h4>
                       <p className="text-blue-700 text-sm mt-1">
                         Upgrade to Hunter or Partner plan to see all {partners.length} partner countries and full trade routes.
                       </p>
                     </div>
                     <Link 
                       href="/pricing"
                       className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                     >
                       Upgrade Now
                     </Link>
                   </div>
                 )}
              </div>
            </div>
          )}

          {/* TAB: Exports */}
          {activeTab === 'exports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary">Export Shipments</h3>
              {summary.exportCount === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-white">
                  <p className="text-slate-600">
                    No export shipments recorded for this company. Detailed shipment volume data will be available soon.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 p-8 text-center bg-white">
                  <p className="text-slate-600 mb-4">Export shipment records are available. Upgrade to view detailed bills of lading.</p>
                  <Link href="/pricing" className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">Upgrade to Hunter</Link>
                </div>
              )}
            </div>
          )}

          {/* TAB: Imports */}
          {activeTab === 'imports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary">Import Shipments</h3>
              {importSummary.importCount === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-white">
                  <p className="text-slate-600">
                    No import shipments recorded for this company. Detailed shipment volume data will be available soon.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 p-8 text-center bg-white">
                  <p className="text-slate-600 mb-4">Import shipment records are available. Upgrade to view detailed bills of lading.</p>
                  <Link href="/pricing" className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">Upgrade to Hunter</Link>
                </div>
              )}
            </div>
          )}

          {/* TAB: Contact Info */}
          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex flex-col gap-2">
                 <h3 className="text-lg font-semibold text-text-primary">Business Contact Details</h3>
                 <p className="text-sm text-text-secondary mb-4">
                   Direct contact information is protected. Click Reveal to access this data.
                 </p>
              </div>

              {(!company.contactEmail && !company.contactPhone) ? (
                // State C: No data
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-slate-600 font-medium">Contact details not yet available</p>
                  <p className="text-sm text-slate-500 mt-1">We are actively sourcing communication details for this entity.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  {/* Mock logic for ENTRY-12.0: By default we assume not revealed yet.
                      State B (Already Revealed) UI is implemented structurally but gated behind the 
                      always-false temporary `isRevealed` var for now until ENTRY-17.0 wires it up. */}
                  {(() => {
                    const isRevealed = false; // To be replaced in ENTRY-17.0
                    
                    return (
                      <div className="divide-y divide-slate-200">
                        {company.contactEmail && (
                          <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition">
                            <span className="text-slate-500 text-sm w-24 shrink-0 font-medium">Email</span>
                            <span className="text-slate-900 font-medium font-mono text-sm tracking-wide bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                              {isRevealed ? company.contactEmail : maskContactField(company.contactEmail, 'email')}
                            </span>
                          </div>
                        )}
                        {company.contactPhone && (
                          <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition">
                            <span className="text-slate-500 text-sm w-24 shrink-0 font-medium">Phone</span>
                            <span className="text-slate-900 font-medium font-mono text-sm tracking-wide bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                              {isRevealed ? company.contactPhone : maskContactField(company.contactPhone, 'phone')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* State A: Show Reveal Button ONLY if we have data to reveal and it hasn't been revealed yet */}
              {(company.contactEmail || company.contactPhone) && (
                 <div className="mt-8 pt-4">
                   <ContactRevealButton />
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
