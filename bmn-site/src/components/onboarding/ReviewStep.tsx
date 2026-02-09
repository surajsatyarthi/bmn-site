'use client';

import { ArrowRight, ArrowLeft, CheckCircle2, User, Package, Globe, Building2, Edit2, Info } from 'lucide-react';
import MobileStickyNav from './MobileStickyNav';

interface ReviewStepProps {
  data: {
    tradeRole?: string | null;
    products?: { hsCode: string; name: string }[] | null;
    targetCountries?: string[] | null;
    companyName?: string | null;
  };
  onNext: () => Promise<void>;
  onBack: () => void;
  onEdit?: (step: number) => void;
  loading?: boolean;
}

export default function ReviewStep({ data, onNext, onBack, onEdit, loading }: ReviewStepProps) {
  // Summary logic would go here, displaying what was selected in previous steps
  
  return (
    <div className="space-y-8 pb-32 sm:pb-0">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold font-display text-text-primary">Almost Done!</h2>
        <p className="mt-2 text-text-secondary">Please review your information before completing the setup.</p>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-900">
          You can update all of this information anytime from your <strong>Profile Settings</strong> after setup.
        </p>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {/* Placeholder for actual summaries, for now we just show a "Ready" state */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-bmn-border space-y-6">
          <div className="flex items-start gap-4 justify-between">
            <div className="flex items-start gap-4 flex-1">
              <User className="h-5 w-5 text-bmn-blue mt-1" />
              <div>
                <div className="font-bold text-text-primary uppercase text-xs tracking-wider">Account Role</div>
                <div className="text-sm text-text-secondary capitalize">{data?.tradeRole || 'Not selected'}</div>
              </div>
            </div>
            {onEdit && (
              <button
                onClick={() => onEdit(1)}
                className="flex items-center gap-1 text-xs text-bmn-blue hover:text-blue-700 font-medium"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>
          
          <div className="flex items-start gap-4 justify-between">
            <div className="flex items-start gap-4 flex-1">
              <Package className="h-5 w-5 text-bmn-blue mt-1" />
              <div>
                <div className="font-bold text-text-primary uppercase text-xs tracking-wider">Products Selected</div>
                <div className="text-sm text-text-secondary">
                  {data?.products?.length || 0} product categories added
                </div>
              </div>
            </div>
            {onEdit && (
              <button
                onClick={() => onEdit(2)}
                className="flex items-center gap-1 text-xs text-bmn-blue hover:text-blue-700 font-medium"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>

          <div className="flex items-start gap-4 justify-between">
            <div className="flex items-start gap-4 flex-1">
              <Globe className="h-5 w-5 text-bmn-blue mt-1" />
              <div>
                <div className="font-bold text-text-primary uppercase text-xs tracking-wider">Market Access</div>
                <div className="text-sm text-text-secondary">
                  {data?.targetCountries?.length || 0} target markets selected
                </div>
              </div>
            </div>
            {onEdit && (
              <button
                onClick={() => onEdit(3)}
                className="flex items-center gap-1 text-xs text-bmn-blue hover:text-blue-700 font-medium"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Building2 className="h-5 w-5 text-bmn-blue mt-1 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-text-primary uppercase text-xs tracking-wider mb-1">Business Identity</div>
                <div className="text-sm text-text-secondary break-words leading-relaxed bg-white/50 p-2 rounded border border-gray-100">
                  {data?.companyName || 'Not provided'}
                </div>
              </div>
            </div>
            {onEdit && (
              <button
                onClick={() => onEdit(4)}
                className="flex items-center justify-center w-full sm:w-auto gap-2 text-xs text-bmn-blue bg-blue-50 py-2 px-4 rounded-lg hover:bg-blue-100 font-medium transition-colors mt-2 sm:mt-0"
              >
                <Edit2 className="h-3 w-3" />
                Edit Details
              </button>
            )}
          </div>
        </div>
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
          onClick={onNext}
          disabled={loading}
          className="btn-primary flex items-center gap-2 px-8"
        >
          {loading ? 'Completing...' : 'Finish Setup'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>

      <MobileStickyNav 
        onBack={onBack}
        onNext={onNext}
        loading={loading}
        nextLabel="Finish Setup"
      />
    </div>
  );
}
