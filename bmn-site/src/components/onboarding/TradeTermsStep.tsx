'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

const tradeTermsSchema = z.object({
  moqValue: z.number().min(1, 'Minimum order quantity must be greater than 0').optional().or(z.literal('')),
  moqUnit: z.string().min(1, 'Please select a unit').optional().or(z.literal('')),
  leadTime: z.string().min(1, 'Lead time is required'),
  productionCapacity: z.string().optional().or(z.literal('')),
});

type TradeTermsValues = z.infer<typeof tradeTermsSchema>;

interface TradeTermsStepProps {
  initialData: {
    moqValue?: number;
    moqUnit?: string;
    leadTime?: string;
    productionCapacity?: string;
    paymentTerms?: string[];
    incoterms?: string[];
  };
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  loading: boolean;
}

export default function TradeTermsStep({ initialData, onNext, onBack, loading }: TradeTermsStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TradeTermsValues>({
    resolver: zodResolver(tradeTermsSchema),
    defaultValues: {
      moqValue: initialData.moqValue || undefined,
      moqUnit: initialData.moqUnit || '',
      leadTime: initialData.leadTime || '',
      productionCapacity: initialData.productionCapacity || '',
    },
  });

  const onSubmit = (data: TradeTermsValues) => {
    onNext({
      moqValue: data.moqValue,
      moqUnit: data.moqUnit,
      leadTime: data.leadTime,
      productionCapacity: data.productionCapacity,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Trade Terms & Matchmaking Data</h2>
        <p className="mt-2 text-sm text-slate-500">
          This crucial information helps us match you accurately with potential partners.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          {/* Target Lead Time */}
          <div className="sm:col-span-1">
            <label htmlFor="leadTime" className="block text-sm font-medium leading-6 text-slate-900">
              Target Lead Time *
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="leadTime"
                placeholder="e.g. 15-30 days"
                {...register('leadTime')}
                className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ${
                  errors.leadTime ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-300 focus:ring-[#0047FF]'
                } sm:text-sm sm:leading-6`}
              />
              {errors.leadTime && (
                <p className="mt-2 text-sm text-red-600">{errors.leadTime.message}</p>
              )}
            </div>
          </div>

          {/* Production Capacity */}
          <div className="sm:col-span-1">
            <label htmlFor="productionCapacity" className="block text-sm font-medium leading-6 text-slate-900">
              Production / Supply Capacity
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="productionCapacity"
                placeholder="e.g. 10,000 units/month"
                {...register('productionCapacity')}
                className="block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2 mt-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Minimum Order Quantity (MOQ)</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              {/* MOQ Value */}
              <div className="sm:col-span-1">
                <label className="sr-only">MOQ Value</label>
                <div className="mt-2">
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    {...register('moqValue', { valueAsNumber: true })}
                    className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ${
                      errors.moqValue ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-300 focus:ring-[#0047FF]'
                    } sm:text-sm sm:leading-6`}
                  />
                  {errors.moqValue && (
                    <p className="mt-2 text-sm text-red-600">{errors.moqValue.message}</p>
                  )}
                </div>
              </div>

              {/* MOQ Unit */}
              <div className="sm:col-span-1">
                <label className="sr-only">MOQ Unit</label>
                <div className="mt-2">
                  <select
                    {...register('moqUnit')}
                    className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ${
                      errors.moqUnit ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-300 focus:ring-[#0047FF]'
                    } sm:text-sm sm:leading-6`}
                  >
                    <option value="">Select Unit</option>
                    <option value="units">Units/Pieces</option>
                    <option value="kg">Kilograms (KG)</option>
                    <option value="mt">Metric Tons (MT)</option>
                    <option value="containers">Full Containers (FCL)</option>
                    <option value="pallets">Pallets</option>
                  </select>
                  {errors.moqUnit && (
                    <p className="mt-2 text-sm text-red-600">{errors.moqUnit.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-8">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold leading-6 text-slate-900"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md bg-[#0047FF] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047FF] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save & Continue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
