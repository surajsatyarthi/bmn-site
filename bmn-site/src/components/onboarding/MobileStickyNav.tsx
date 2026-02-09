import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface MobileStickyNavProps {
  onBack: () => void;
  onNext: () => void;
  loading?: boolean;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export default function MobileStickyNav({
  onBack,
  onNext,
  loading = false,
  isNextDisabled = false,
  nextLabel = 'Next Step'
}: MobileStickyNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-bmn-border p-4 sm:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-3">
        <button
          onClick={onNext}
          disabled={isNextDisabled || loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {loading ? 'Saving...' : nextLabel}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
        
        <button
          onClick={onBack}
          disabled={loading}
          className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-gray-50 rounded-lg border border-transparent active:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
