import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { globalTradeCompanies } from '@/lib/db/schema';
import { and, eq, sql, SQL } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { buildDatabaseFilters, PAGE_SIZE } from '@/lib/database/filters';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-text-primary">Company Database</h1>
        <p className="mt-1 text-text-secondary">
          Search 4.4M+ global trade companies by name, country, product, or trade type
        </p>
      </div>

      {/* Filter Bar */}
      <form method="GET" action="/database" className="rounded-xl border border-bmn-border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-medium text-text-secondary">
              Company Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={typeof params.name === 'string' ? params.name : ''}
              placeholder="e.g. Siemens, BASF"
              className="w-full rounded-lg border border-bmn-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bmn-blue"
            />
          </div>
          <div>
            <label htmlFor="country" className="mb-1 block text-xs font-medium text-text-secondary">
              Country (ISO code)
            </label>
            <input
              id="country"
              name="country"
              type="text"
              maxLength={2}
              defaultValue={typeof params.country === 'string' ? params.country : ''}
              placeholder="e.g. US, DE, SG"
              className="w-full rounded-lg border border-bmn-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bmn-blue"
            />
          </div>
          <div>
            <label htmlFor="hs" className="mb-1 block text-xs font-medium text-text-secondary">
              HS Chapter
            </label>
            <input
              id="hs"
              name="hs"
              type="text"
              maxLength={2}
              defaultValue={typeof params.hs === 'string' ? params.hs : ''}
              placeholder="e.g. 33, 84, 39"
              className="w-full rounded-lg border border-bmn-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bmn-blue"
            />
          </div>
          <div>
            <label htmlFor="trade_type" className="mb-1 block text-xs font-medium text-text-secondary">
              Trade Type
            </label>
            <select
              id="trade_type"
              name="trade_type"
              defaultValue={typeof params.trade_type === 'string' ? params.trade_type : ''}
              className="w-full rounded-lg border border-bmn-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bmn-blue"
            >
              <option value="">All</option>
              <option value="importer">Importer</option>
              <option value="exporter">Exporter</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-bmn-blue px-5 py-2 text-sm font-medium text-white hover:bg-bmn-blue/90"
          >
            Search
          </button>
          <Link href="/database" className="text-sm text-text-secondary hover:text-text-primary">
            Clear
          </Link>
        </div>
      </form>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((company) => {
            const partners = company.partnerCountries?.slice(0, 3).join(' · ');
            const badge = tradeBadge[company.tradeType ?? ''] ?? 'bg-gray-100 text-gray-600';
            return (
              <div
                key={company.id}
                className="rounded-xl border border-bmn-border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{countryFlag(company.countryCode)}</span>
                      <h2 className="truncate text-base font-semibold text-text-primary">
                        {company.companyName}
                      </h2>
                      {company.countryCode && (
                        <span className="text-xs font-medium text-text-secondary">
                          {company.countryCode}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                      {company.tradeType && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${badge}`}>
                          {company.tradeType}
                        </span>
                      )}
                      {company.hsDescription && (
                        <span>
                          {company.hsDescription}
                          {company.hsChapter && ` (Ch.${company.hsChapter})`}
                        </span>
                      )}
                    </div>
                    {partners && (
                      <p className="text-xs text-text-secondary">
                        Trades with: {partners}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/database/${company.id}`}
                    className="shrink-0 rounded-lg border border-bmn-border px-3 py-1.5 text-sm font-medium text-text-primary hover:border-bmn-blue hover:text-bmn-blue"
                  >
                    View →
                  </Link>
                </div>
              </div>
            );
          })}
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
  );
}
