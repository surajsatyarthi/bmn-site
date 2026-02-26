import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { globalTradeCompanies } from '@/lib/db/schema';
import { and, eq, sql, SQL } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { buildDatabaseFilters, PAGE_SIZE } from '@/lib/database/filters';
import FilterPanel from '@/components/database/FilterPanel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Company Database | BMN',
  description: 'Search 4.4 million global trade companies. Find verified importers, exporters, and manufacturers worldwide.',
};

function countryFlag(cc: string | null): string {
  if (!cc || cc.length !== 2) return '🌐';
  const a = cc.toUpperCase().charCodeAt(0) - 65 + 0x1f1e6;
  const b = cc.toUpperCase().charCodeAt(1) - 65 + 0x1f1e6;
  return String.fromCodePoint(a, b);
}

const tradeBadge: Record<string, string> = {
  exporter: 'bg-green-100 text-green-700',
  importer: 'bg-blue-100 text-blue-700',
  both: 'bg-purple-100 text-purple-700',
};

function paginationUrl(
  base: Record<string, string | string[] | undefined>,
  page: number,
): string {
  const p = new URLSearchParams();
  if (base.name && typeof base.name === 'string') p.set('name', base.name);
  if (base.country && typeof base.country === 'string') p.set('country', base.country);
  if (base.hs && typeof base.hs === 'string') p.set('hs', base.hs);
  if (base.trade_type && typeof base.trade_type === 'string') p.set('trade_type', base.trade_type);
  p.set('page', String(page));
  return `/database?${p.toString()}`;
}

export default async function DatabasePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const params = await searchParams;
  const filters = buildDatabaseFilters(params);

  const conditions: SQL[] = [];
  if (filters.countryCode) {
    conditions.push(eq(globalTradeCompanies.countryCode, filters.countryCode));
  }
  if (filters.hsChapter) {
    conditions.push(eq(globalTradeCompanies.hsChapter, filters.hsChapter));
  }
  if (filters.tradeType) {
    conditions.push(eq(globalTradeCompanies.tradeType, filters.tradeType));
  }
  if (filters.name) {
    conditions.push(
      sql`to_tsvector('english', ${globalTradeCompanies.companyName}) @@ plainto_tsquery('english', ${filters.name})`,
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db
    .select()
    .from(globalTradeCompanies)
    .where(whereClause)
    .limit(PAGE_SIZE)
    .offset(filters.offset);

  const hasNext = results.length === PAGE_SIZE;
  const hasPrev = filters.page > 1;

  return (
    <div className="flex gap-6 items-start">
      {/* Left filter panel */}
      <FilterPanel params={params} />

      {/* Right results area */}
      <div className="flex-1 min-w-0 space-y-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Company Database</h1>
          <p className="mt-1 text-text-secondary">
            Search 4.4M+ global trade companies by name, country, product, or trade type
          </p>
        </div>

        {/* Results Table */}
        {results.length > 0 ? (
          <div className="rounded-xl border border-bmn-border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bmn-border bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-8"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">HS</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Trades With</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bmn-border">
                  {results.map((company) => {
                    const partners = company.partnerCountries?.slice(0, 3).join(' · ');
                    const badge = tradeBadge[company.tradeType ?? ''] ?? 'bg-gray-100 text-gray-600';
                    return (
                      <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-lg text-center">
                          {countryFlag(company.countryCode)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-text-primary truncate block max-w-[200px]">
                            {company.companyName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {company.countryCode ?? '—'}
                        </td>
                        <td className="px-4 py-3">
                          {company.tradeType && (
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${badge}`}>
                              {company.tradeType}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {company.hsChapter ? `Ch.${company.hsChapter}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-text-secondary text-xs max-w-[180px] truncate">
                          {partners ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/database/${company.id}`}
                            data-testid="company-card"
                            className="rounded-lg border border-bmn-border px-3 py-1.5 text-xs font-medium text-text-primary hover:border-bmn-blue hover:text-bmn-blue whitespace-nowrap"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-bmn-border bg-white p-8 text-center shadow-sm">
            <p className="text-text-secondary">
              No companies found for your search. Try broader filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {(hasPrev || hasNext) && (
          <div className="flex items-center justify-between">
            {hasPrev ? (
              <Link
                href={paginationUrl(params, filters.page - 1)}
                className="rounded-lg border border-bmn-border px-4 py-2 text-sm font-medium hover:border-bmn-blue hover:text-bmn-blue"
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-sm text-text-secondary">Page {filters.page}</span>
            {hasNext ? (
              <Link
                href={paginationUrl(params, filters.page + 1)}
                className="rounded-lg border border-bmn-border px-4 py-2 text-sm font-medium hover:border-bmn-blue hover:text-bmn-blue"
              >
                Next →
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
