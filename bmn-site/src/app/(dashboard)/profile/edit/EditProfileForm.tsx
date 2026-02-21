'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { COUNTRIES } from '@/lib/constants/countries';

const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  companyName: z.string().min(2, 'Company name is required'),
  businessType: z.enum(['manufacturer', 'trader', 'both', 'agent']),
  employeeCount: z.string().optional(),
  description: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  // Matchmaking terms
  moqValue: z.number().optional(),
  moqUnit: z.string().optional(),
  leadTime: z.string().optional(),
  productionCapacity: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfileForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'business' | 'trade'>('basic');
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      businessType: 'both',
      country: '',
      phone: '',
      employeeCount: '',
      description: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      website: '',
      moqValue: undefined,
      moqUnit: '',
      leadTime: '',
      productionCapacity: '',
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Fetch basic profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();

        // Fetch company info
        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        // Fetch trade terms
        const { data: terms } = await supabase
          .from('trade_terms')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        form.reset({
          fullName: profile?.full_name || '',
          phone: profile?.phone || '',
          companyName: company?.name || '',
          businessType: company?.business_type || 'both',
          employeeCount: company?.employee_count || '',
          description: company?.description || '',
          street: company?.street || '',
          city: company?.city || '',
          state: company?.state || '',
          postalCode: company?.postal_code || '',
          country: company?.country || 'India',
          website: company?.website || '',
          moqValue: terms?.moq_value || undefined,
          moqUnit: terms?.moq_unit || '',
          leadTime: terms?.lead_time || '',
          productionCapacity: terms?.production_capacity || '',
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      router.push('/profile');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <DashboardNav />
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0047FF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardNav />
      
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button 
              onClick={() => router.push('/profile')}
              className="mb-4 flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Profile</h1>
            <p className="mt-2 text-sm text-slate-500">
              Update your basic information, business details, and matching preferences.
            </p>
          </div>
          
                  <button
            onClick={form.handleSubmit(onSubmit)}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md bg-[#0047FF] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {['basic', 'business', 'trade'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'basic' | 'business' | 'trade')}
                  className={`w-1/3 border-b-2 py-4 px-1 text-center text-sm font-medium ${
                    activeTab === tab
                      ? 'border-[#0047FF] text-[#0047FF]'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 lg:p-8">
            <form id="profile-edit-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Basic Info Tab */}
              <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Full Name</label>
                    <input
                      {...form.register('fullName')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                    {form.formState.errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Phone Number</label>
                    <input
                      {...form.register('phone')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              {/* Business Details Tab */}
              <div className={activeTab === 'business' ? 'block' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-900">Company Name</label>
                    <input
                      {...form.register('companyName')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Business Type</label>
                    <select
                      {...form.register('businessType')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    >
                      <option value="manufacturer">Manufacturer</option>
                      <option value="trader">Trader/Distributor</option>
                      <option value="both">Both</option>
                      <option value="agent">Broker/Agent</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Employee Count</label>
                    <select
                      {...form.register('employeeCount')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 Employees</option>
                      <option value="11-50">11-50 Employees</option>
                      <option value="51-200">51-200 Employees</option>
                      <option value="201-500">201-500 Employees</option>
                      <option value="500+">500+ Employees</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-900">Company Description</label>
                    <textarea
                      {...form.register('description')}
                      rows={4}
                      className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 border-b pb-2">Location</h3>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-900">Street Address</label>
                    <input
                      {...form.register('street')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">City</label>
                    <input
                      {...form.register('city')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">State/Province</label>
                    <input
                      {...form.register('state')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Country *</label>
                    <select
                      {...form.register('country')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    >
                      <option value="">Select country...</option>
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.country && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.country.message}</p>
                    )}
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Postal Code</label>
                    <input
                      {...form.register('postalCode')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              {/* Trade Terms Tab */}
              <div className={activeTab === 'trade' ? 'block' : 'hidden'}>
                <div className="rounded-md bg-blue-50 p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Matchmaking Data:</strong> This information is critical. It determines how closely we match you with serious buyers.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Target Delivery / Lead Time</label>
                    <input
                      {...form.register('leadTime')}
                      placeholder="e.g. 15-30 days"
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Production / Fulfillment Capacity</label>
                    <input
                      {...form.register('productionCapacity')}
                      placeholder="e.g. 10,000 units/month"
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 border-b pb-2 mt-4">Minimum Order Quantity (MOQ)</h3>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Minimum Value (Number)</label>
                    <input
                      type="number"
                      {...form.register('moqValue', { valueAsNumber: true })}
                      placeholder="e.g. 500"
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    />
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-900">Unit Type</label>
                    <select
                      {...form.register('moqUnit')}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#0047FF] sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Unit</option>
                      <option value="units">Units/Pieces</option>
                      <option value="kg">Kilograms (KG)</option>
                      <option value="mt">Metric Tons (MT)</option>
                      <option value="containers">Full Containers (FCL)</option>
                      <option value="pallets">Pallets</option>
                    </select>
                  </div>
                  
                </div>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
