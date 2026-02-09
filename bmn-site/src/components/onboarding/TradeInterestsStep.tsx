'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Search, Check, X } from 'lucide-react';
import countriesData from '@/lib/data/countries.json';
import { cn } from '@/lib/utils';
import MobileStickyNav from './MobileStickyNav';

interface Country {
  code: string;
  name: string;
}

interface TradeInterestsStepProps {
  initialCountries?: string[];
  onNext: (data: { targetCountries: string[] }) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export default function TradeInterestsStep({ 
  initialCountries = [], 
  onNext, 
  onBack, 
  loading 
}: TradeInterestsStepProps) {
  const [selectedCountryCodes, setSelectedCountryCodes] = useState<string[]>(initialCountries);
  const [query, setQuery] = useState('');
  const countries = countriesData as Country[];

  const filteredCountries = countries.filter((c: Country) => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.code.toLowerCase().includes(query.toLowerCase())
  );

  const toggleCountry = (code: string) => {
    if (selectedCountryCodes.includes(code)) {
      setSelectedCountryCodes(selectedCountryCodes.filter((c: string) => c !== code));
    } else if (selectedCountryCodes.length < 5) {
      setSelectedCountryCodes([...selectedCountryCodes, code]);
    }
  };

  const handleSubmit = () => {
    if (selectedCountryCodes.length > 0) {
      onNext({ targetCountries: selectedCountryCodes });
    }
  };

  return (
    <div className="space-y-8 pb-32 sm:pb-0">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display text-text-primary">Where do you want to trade?</h2>
        <p className="mt-2 text-text-secondary">Select up to 5 target countries or regions you are interested in.</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-text-secondary" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries..."
            className="w-full rounded-lg border border-bmn-border bg-white pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
          {filteredCountries.map((country) => {
            const isSelected = selectedCountryCodes.includes(country.code);
            return (
              <button
                key={country.code}
                onClick={() => toggleCountry(country.code)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg border text-sm transition-all text-left",
                  isSelected 
                    ? "border-bmn-blue bg-blue-50 text-bmn-blue font-semibold ring-1 ring-bmn-blue" 
                    : "border-bmn-border bg-white text-text-secondary hover:bg-gray-50"
                )}
              >
                <div className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                  isSelected ? "bg-bmn-blue border-bmn-blue text-white" : "border-bmn-border bg-gray-50"
                )}>
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
                <span className="truncate">{country.name}</span>
              </button>
            );
          })}
        </div>

        {selectedCountryCodes.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedCountryCodes.map((code: string) => {
              const country = countries.find(c => c.code === code);
              return (
                <div key={code} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-text-primary border border-bmn-border max-w-full">
                  <span className="truncate max-w-[120px]">{country?.name}</span>
                  <button onClick={() => toggleCountry(code)} className="text-text-secondary hover:text-red-600 transition-colors shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden sm:flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedCountryCodes.length === 0 || loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? 'Saving...' : 'Next Step'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>

      <MobileStickyNav 
        onBack={onBack}
        onNext={handleSubmit}
        loading={loading}
        isNextDisabled={selectedCountryCodes.length === 0}
      />
    </div>
  );
}
