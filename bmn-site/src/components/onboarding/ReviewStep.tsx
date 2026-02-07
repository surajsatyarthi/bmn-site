'use client';

import { ArrowRight, ArrowLeft, CheckCircle2, User, Package, Globe, Building2 } from 'lucide-react';

interface ReviewStepProps {
  data: {
    tradeRole?: string;
    products?: { hsCode: string; name: string }[];
    targetCountries?: string[];
    companyName?: string;
  };
  onNext: () => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export default function ReviewStep({ data, onNext, onBack, loading }: ReviewStepProps) {
  // Summary logic would go here, displaying what was selected in previous steps
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold font-display text-text-primary">Almost Done!</h2>
        <p className="mt-2 text-text-secondary">Please review your information before completing the setup.</p>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {/* Placeholder for actual summaries, for now we just show a "Ready" state */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-bmn-border space-y-6">
          <div className="flex items-start gap-4">
            <User className="h-5 w-5 text-bmn-blue mt-1" />
            <div>
              <div className="font-bold text-text-primary uppercase text-xs tracking-wider">Account Role</div>
              <div className="text-sm text-text-secondary capitalize">{data?.tradeRole || 'Not selected'}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <Package className="h-5 w-5 text-bmn-blue mt-1" />
            <div>
              <div className="font-bold text-text-primary uppercase text-xs tracking-wider">Products Selected</div>
              <div className="text-sm text-text-secondary">
                {data?.products?.length || 0} product categories added
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Globe className="h-5 w-5 text-bmn-blue mt-1" />
            <div>
              <div className="font-bold text-text-primary uppercase text-xs tracking-wider">Market Access</div>
              <div className="text-sm text-text-secondary">
                {data?.targetCountries?.length || 0} target markets selected
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Building2 className="h-5 w-5 text-bmn-blue mt-1" />
            <div>
              <div className="font-bold text-text-primary uppercase text-xs tracking-wider">Business Identity</div>
              <div className="text-sm text-text-secondary">
                {data?.companyName || 'Not provided'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
        <button
          onClick={onNext}
          disabled={loading}
          className="btn-primary flex items-center gap-2 px-8"
        >
          {loading ? 'Completing...' : 'Finish Setup'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
