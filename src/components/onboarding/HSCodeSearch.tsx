'use client';

import { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
import hsCodesData from '@/lib/data/hs-codes.json';
import { cn } from '@/lib/utils';

interface HSCode {
  code: string;
  description: string;
}

interface HSCodeSearchProps {
  onSelect: (code: HSCode) => void;
  selectedCodes?: string[];
  maxSelected?: number;
}

export default function HSCodeSearch({ onSelect, selectedCodes = [], maxSelected = 5 }: HSCodeSearchProps) {
  const [query, setQuery] = useState('');
  const hsCodes = hsCodesData as HSCode[];

  const filteredCodes = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return hsCodes.filter(
      (item) =>
        item.code.includes(query) ||
        item.description.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }, [query, hsCodes]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-text-secondary" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by product name or HS Code (e.g. 'Coffee' or '09')"
          className="w-full rounded-lg border border-bmn-border bg-white pl-10 pr-4 py-2.5 text-sm text-text-primary focus:border-bmn-blue focus:outline-none focus:ring-1 focus:ring-bmn-blue transition-all"
        />
      </div>

      {query && filteredCodes.length > 0 && (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-bmn-border bg-white shadow-sm">
          {filteredCodes.map((item) => {
            const isSelected = selectedCodes.includes(item.code);
            const isDisabled = !isSelected && selectedCodes.length >= maxSelected;

            return (
              <button
                key={item.code}
                onClick={() => {
                  if (!isDisabled) {
                    onSelect(item);
                    setQuery('');
                  }
                } }
                disabled={isDisabled}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 border-b border-bmn-border last:border-0",
                  isSelected && "bg-blue-50/50",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                  isSelected ? "bg-bmn-blue border-bmn-blue text-white" : "border-bmn-border bg-gray-50"
                )}>
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-text-primary">Chapter {item.code}</div>
                  <div className="text-text-secondary line-clamp-2">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {query && filteredCodes.length === 0 && (
        <div className="rounded-lg border border-bmn-border bg-gray-50 p-6 text-center text-sm text-text-secondary">
          No matches found for &quot;{query}&quot;. <br />
          Try searching with broader terms.
        </div>
      )}
    </div>
  );
}
