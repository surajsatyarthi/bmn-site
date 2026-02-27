'use client';

import Link from 'next/link';

interface FilterPanelProps {
  params: Record<string, string | string[] | undefined>;
}

export default function FilterPanel({ params }: FilterPanelProps) {
  const name = typeof params.name === 'string' ? params.name : '';
  const country = typeof params.country === 'string' ? params.country : '';
  const hs = typeof params.hs === 'string' ? params.hs : '';
  const tradeType = typeof params.trade_type === 'string' ? params.trade_type : '';

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-[calc(4rem+2rem)] rounded-xl border border-bmn-border bg-white p-5 shadow-sm space-y-5">
        <h2 className="text-sm font-semibold text-text-primary">Filters</h2>

        <form method="GET" action="/database" className="space-y-4">
          {/* Company Name */}
          <div>
            <label htmlFor="fp-name" className="mb-1 block text-xs font-medium text-text-secondary">
              Company Name
            </label>
            <input
              id="fp-name"
              name="name"
              type="text"
              data-testid="search-name"
              defaultValue={name}
              placeholder="e.g. Siemens, BASF"
              className="w-full rounded-lg border border-bmn-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bmn-blue"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="fp-country" className="mb-1 block text-xs font-medium text-text-secondary">
              Country (ISO code)
            </label>
            <input
              id="fp-country"
              name="country"
              type="text"
              maxLength={2}
              defaultValue={country}
              placeholder="e.g. US, DE, SG"
              className="w-full rounded-lg border border-bmn-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bmn-blue"
            />
          </div>

          {/* HS Chapter */}
          <div>
            <label htmlFor="fp-hs" className="mb-1 block text-xs font-medium text-text-secondary">
              HS Chapter
            </label>
            <input
              id="fp-hs"
              name="hs"
              type="text"
              maxLength={2}
              defaultValue={hs}
              placeholder="e.g. 33, 84, 39"
              className="w-full rounded-lg border border-bmn-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bmn-blue"
            />
          </div>

          {/* Trade Type */}
          <div>
            <label htmlFor="fp-trade-type" className="mb-1 block text-xs font-medium text-text-secondary">
              Trade Type
            </label>
            <select
              id="fp-trade-type"
              name="trade_type"
              defaultValue={tradeType}
              className="w-full rounded-lg border border-bmn-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bmn-blue"
            >
              <option value="">All</option>
              <option value="importer">Importer</option>
              <option value="exporter">Exporter</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              className="w-full rounded-lg bg-bmn-blue px-4 py-2 text-sm font-medium text-white hover:bg-bmn-blue/90"
            >
              Search
            </button>
            <Link
              href="/database"
              className="w-full rounded-lg border border-bmn-border px-4 py-2 text-center text-sm text-text-secondary hover:text-text-primary"
            >
              Clear
            </Link>
          </div>
        </form>
      </div>
    </aside>
  );
}
