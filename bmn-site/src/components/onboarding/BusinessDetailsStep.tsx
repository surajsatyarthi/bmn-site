'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, Building2, Globe, Calendar, Users, DollarSign, Plus, X } from 'lucide-react';
import { COUNTRIES } from '@/lib/constants/countries';
import { useState } from 'react';
import MobileStickyNav from './MobileStickyNav';

const officeLocationSchema = z.object({
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State/Province is required'),
  city: z.string().min(2, 'City is required'),
});

const businessSchema = z.object({
  companyName: z.string().min(2, 'Company name is too short'),
  yearEstablished: z.string().min(4, 'Year is required'),
  employeeStrength: z.string().min(1, 'Employee strength is required'),
  
  // Headquarters Address
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  country: z.string().min(2, 'Country is required'),
  pinCode: z.string().min(3, 'Postal code is required'),
  
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  
  // Export Data
  lastYearExportUsd: z.string().min(1, 'Last year export is required'),
  currentExportCountries: z.array(z.string()).min(1, 'Select at least one country'),
  
  // Additional Office Locations (optional)
  officeLocations: z.array(officeLocationSchema).max(5).optional(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

interface BusinessDetailsStepProps {
  initialData?: Partial<BusinessFormData>;
  onNext: (data: BusinessFormData) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

const EMPLOYEE_STRENGTH_OPTIONS = [
  { value: '1-10', label: '1-10 employees (Solo/Small Team)' },
  { value: '11-50', label: '11-50 employees (Small Business)' },
  { value: '51-200', label: '51-200 employees (Medium Business)' },
  { value: '201-500', label: '201-500 employees (Large Business)' },
  { value: '501-1000', label: '501-1000 employees (Enterprise)' },
  { value: '1000+', label: '1000+ employees (Large Enterprise)' },
];

export default function BusinessDetailsStep({ 
  initialData, 
  onNext, 
  onBack, 
  loading 
}: BusinessDetailsStepProps) {
  const [selectedExportCountries, setSelectedExportCountries] = useState<string[]>(initialData?.currentExportCountries || []);
  
  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      ...initialData,
      currentExportCountries: initialData?.currentExportCountries || [],
      officeLocations: initialData?.officeLocations || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'officeLocations',
  });

  const handleCountryToggle = (countryCode: string) => {
    const updated = selectedExportCountries.includes(countryCode)
      ? selectedExportCountries.filter(c => c !== countryCode)
      : [...selectedExportCountries, countryCode];
    
    setSelectedExportCountries(updated);
    setValue('currentExportCountries', updated);
  };

  return (
    <div className="space-y-8 pb-32 sm:pb-0"> {/* Added pb-32 for mobile nav clearance */}
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display text-text-primary">Business Details</h2>
        <p className="mt-2 text-text-secondary">Tell us about your company to help us find the right matches.</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {/* Company Name */}
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

        {/* Year Established & Employee Strength - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Year Established *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                {...register('yearEstablished')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue appearance-none bg-white"
              >
                <option value="">Select year...</option>
                {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {errors.yearEstablished && <p className="text-xs text-red-500">{errors.yearEstablished.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Employee Strength *</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                {...register('employeeStrength')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue appearance-none bg-white"
              >
                <option value="">Select size...</option>
                {EMPLOYEE_STRENGTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            {errors.employeeStrength && <p className="text-xs text-red-500">{errors.employeeStrength.message}</p>}
          </div>
        </div>

        {/* Headquarters Address */}
        <div className="space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <h3 className="font-semibold text-sm text-text-primary">Headquarters Address *</h3>
          
          <div className="space-y-2">
            <input
              {...register('street')}
              className="w-full px-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
              placeholder="Street Address"
            />
            {errors.street && <p className="text-xs text-red-500">{errors.street.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <input
                {...register('city')}
                className="w-full px-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
                placeholder="City"
              />
              {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
            </div>

            <div className="space-y-2">
              <input
                {...register('state')}
                className="w-full px-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
                placeholder="State/Province"
              />
              {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <select
                {...register('country')}
                className="w-full px-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue appearance-none bg-white"
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
              {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <input
                {...register('pinCode')}
                className="w-full px-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
                placeholder="Postal Code"
              />
              {errors.pinCode && <p className="text-xs text-red-500">{errors.pinCode.message}</p>}
            </div>
          </div>
        </div>

        {/* Website (Optional) */}
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

        {/* Last Year Export */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-secondary">Last Year Export (USD Million) *</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              {...register('lastYearExportUsd')}
              type="number"
              step="0.1"
              min="0"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
              placeholder="e.g. 1.5 for $1.5 Million"
            />
          </div>
          {errors.lastYearExportUsd && <p className="text-xs text-red-500">{errors.lastYearExportUsd.message}</p>}
          <p className="text-xs text-gray-500">Enter 0 if just starting exports</p>
        </div>

        {/* Currently Exporting To */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-secondary">Currently Exporting To *</label>
          <div className="p-4 rounded-lg border border-bmn-border max-h-60 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {COUNTRIES.map((country) => (
                <label
                  key={country.code}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedExportCountries.includes(country.code)}
                    onChange={() => handleCountryToggle(country.code)}
                    className="h-4 w-4 rounded border-gray-300 text-bmn-blue focus:ring-bmn-blue shrink-0"
                  />
                  <span className="text-sm text-text-secondary font-medium">{country.name}</span>
                </label>
              ))}
            </div>
          </div>
          {errors.currentExportCountries && <p className="text-xs text-red-500">{errors.currentExportCountries.message}</p>}
          {selectedExportCountries.length > 0 && (
            <p className="text-xs text-bmn-blue">{selectedExportCountries.length} countries selected</p>
          )}
        </div>

        {/* Additional Office Locations */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-text-secondary">
              Additional Office Locations (Optional, Max 5)
            </label>
            {fields.length < 5 && (
              <button
                type="button"
                onClick={() => append({ country: '', state: '', city: '' })}
                className="flex items-center justify-center gap-1.5 text-xs text-bmn-blue bg-blue-50 py-3 px-4 rounded-lg hover:bg-blue-100 font-medium transition-colors w-full sm:w-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Office
              </button>
            )}
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-text-primary">Office {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  {...register(`officeLocations.${index}.country`)}
                  className="w-full px-3 py-2 rounded border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue appearance-none bg-white"
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>

                <input
                  {...register(`officeLocations.${index}.state`)}
                  className="w-full px-3 py-2 rounded border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
                  placeholder="State/Province"
                />

                <input
                  {...register(`officeLocations.${index}.city`)}
                  className="w-full px-3 py-2 rounded border border-bmn-border focus:border-bmn-blue focus:ring-1 focus:ring-bmn-blue"
                  placeholder="City"
                />
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">No additional offices added yet</p>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex justify-between pt-6">
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

        {/* Mobile Sticky Navigation */}
        <MobileStickyNav 
          onBack={onBack}
          onNext={handleSubmit(onNext)}
          loading={loading}
        />
      </form>
    </div>
  );
}
