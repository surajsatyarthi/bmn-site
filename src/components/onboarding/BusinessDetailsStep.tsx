'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, Building2, Globe, Calendar } from 'lucide-react';

const businessSchema = z.object({
  companyName: z.string().min(2, 'Company name is too short'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  yearEstablished: z.string().regex(/^\d{4}$/, 'Must be a 4-digit year').optional().or(z.literal('')),
});

type BusinessFormData = z.infer<typeof businessSchema>;

interface BusinessDetailsStepProps {
  initialData?: Partial<BusinessFormData>;
  onNext: (data: BusinessFormData) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export default function BusinessDetailsStep({ 
  initialData, 
  onNext, 
  onBack, 
  loading 
}: BusinessDetailsStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: initialData,
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display text-text-primary">Business Details</h2>
        <p className="mt-2 text-text-secondary">Tell us a bit more about your company.</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-secondary">Company Name *</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              {...register('companyName')}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
              placeholder="e.g. Global Trade Ltd"
            />
          </div>
          {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-secondary">Website URL (Optional)</label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              {...register('website')}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
              placeholder="https://example.com"
            />
          </div>
          {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-secondary">Year Established (Optional)</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              {...register('yearEstablished')}
              maxLength={4}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
              placeholder="e.g. 2010"
            />
          </div>
          {errors.yearEstablished && <p className="text-xs text-red-500">{errors.yearEstablished.message}</p>}
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? 'Saving...' : 'Next Step'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
