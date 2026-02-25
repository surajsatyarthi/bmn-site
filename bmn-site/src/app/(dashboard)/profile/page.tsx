import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Ship, Globe, RefreshCw, ExternalLink, Package, MapPin, Building2, Award, Briefcase } from 'lucide-react';
import { getMonthlyRevealCount } from '@/lib/credits';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Trade Profile | BMN',
  description: 'Manage and update your export business details, products, and target markets.',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
    with: {
      company: true,
      products: true,
      tradeInterests: true,
      certifications: true,
      tradeTerms: true,
    }
  });

  if (!profile) {
    redirect('/login');
  }

  if (!profile.onboardingCompleted) {
    redirect('/onboarding');
  }

  const roleIcons = {
    exporter: Ship,
    importer: Globe,
    both: RefreshCw,
  };

  const Icon = roleIcons[profile.tradeRole as keyof typeof roleIcons] || Globe;

  const revealCount = await getMonthlyRevealCount(user.id);
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);
  const resetDateStr = nextMonth.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const badgeColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    hunter: 'bg-blue-100 text-bmn-blue',
    partner: 'bg-purple-100 text-purple-700',
  };
  const badgeClass = badgeColors[profile.plan.toLowerCase()] || badgeColors.free;
  const planName = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bmn-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary">Your Trade Profile</h1>
          <p className="mt-1 text-text-secondary">Here&apos;s a summary of your onboarding information.</p>
        </div>
        <div>
          <Link 
            href="/profile/edit"
            className="flex items-center gap-2 px-4 py-2 bg-[#0047FF] hover:bg-blue-700 text-white rounded-lg border border-transparent font-medium shadow-sm transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Plan Card */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold font-display text-text-primary">Your Plan</h2>
            </div>
            
            <div className="mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-bold tracking-wider ${badgeClass}`}>
                {planName}
              </span>
            </div>
            
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Reveals this month:</span>
                <span className="font-semibold text-text-primary">
                  {profile.plan.toLowerCase() === 'partner' ? 'Unlimited reveals' : `${revealCount} / ${profile.plan.toLowerCase() === 'hunter' ? 500 : 5}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Resets:</span>
                <span className="font-semibold text-text-primary">{resetDateStr}</span>
              </div>
            </div>
          </div>
          
          {profile.plan.toLowerCase() === 'free' && (
            <Link 
              href="/#pricing"
              className="mt-auto block text-center w-full py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-bmn-blue font-semibold text-sm transition-colors border border-bmn-border"
            >
              Upgrade to Hunter &rarr;
            </Link>
          )}
        </div>

        {/* Trade Role Card */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="h-5 w-5 icon-gradient-primary" />
            </div>
            <h2 className="text-xl font-bold font-display text-text-primary">Trade Role</h2>
          </div>
          <p className="text-text-secondary capitalize">
            {profile.tradeRole === 'both' ? 'Exporter & Importer' : profile.tradeRole}
          </p>
        </div>

        {/* Business Details Card */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="h-5 w-5 icon-gradient-primary" />
            </div>
            <h2 className="text-xl font-bold font-display text-text-primary">Business Details</h2>
          </div>
          {profile.company ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Company Name</p>
                <p className="text-text-primary font-medium">{profile.company.name}</p>
              </div>
              {profile.company.businessType && (
                <div>
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Business Type</p>
                  <p className="text-text-primary capitalize">{profile.company.businessType}</p>
                </div>
              )}
              {profile.company.employeeCount && (
                <div>
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Company Size</p>
                  <p className="text-text-primary">{profile.company.employeeCount} Employees</p>
                </div>
              )}
              {profile.company.description && (
                <div className="col-span-full">
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Description</p>
                  <p className="text-text-primary text-sm mt-1">{profile.company.description}</p>
                </div>
              )}
              {profile.company.website && (
                <div>
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Website</p>
                  <a 
                    href={profile.company.website.startsWith('http') ? profile.company.website : `https://${profile.company.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-bmn-blue hover:underline flex items-center gap-1 text-sm"
                  >
                    {profile.company.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {profile.company.foundingYear && (
                <div>
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Founded</p>
                  <p className="text-text-primary">{profile.company.foundingYear}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-secondary">No company details.</p>
          )}
        </div>

        {/* Trade Terms Card */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Briefcase className="h-5 w-5 icon-gradient-primary" />
            </div>
            <h2 className="text-xl font-bold font-display text-text-primary">Trade Terms</h2>
          </div>
          {profile.tradeTerms ? (
            <div className="space-y-3">
              {(profile.tradeTerms.moqValue || profile.tradeTerms.moqUnit) && (
                <div>
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Minimum Order</p>
                  <p className="text-text-primary font-medium">
                    {profile.tradeTerms.moqValue} {profile.tradeTerms.moqUnit}
                  </p>
                </div>
              )}
              {profile.tradeTerms.leadTime && (
                <div>
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Target Lead Time</p>
                  <p className="text-text-primary">{profile.tradeTerms.leadTime}</p>
                </div>
              )}
              {profile.tradeTerms.productionCapacity && (
                <div>
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Production Capacity</p>
                  <p className="text-text-primary">{profile.tradeTerms.productionCapacity}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-secondary">No trade terms specified.</p>
          )}
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="h-5 w-5 icon-gradient-primary" />
            </div>
            <h2 className="text-xl font-bold font-display text-text-primary">Products</h2>
            <span className="ml-auto text-sm bg-blue-50 text-bmn-blue px-2 py-0.5 rounded-full font-medium">
              {profile.products?.length || 0} products
            </span>
          </div>
          <div className="space-y-4">
            {profile.products && profile.products.length > 0 ? (
              profile.products.map((product) => (
                <div key={product.id} className="border-l-2 border-bmn-blue/20 pl-4 py-1">
                  <p className="font-bold text-text-primary">Chapter {product.hsCode}</p>
                  <p className="text-sm text-text-secondary">{product.name}</p>
                </div>
              ))
            ) : (
              <p className="text-text-secondary">No products added.</p>
            )}
          </div>
        </div>

        {/* Target Markets Card */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MapPin className="h-5 w-5 icon-gradient-primary" />
            </div>
            <h2 className="text-xl font-bold font-display text-text-primary">Target Markets</h2>
            <span className="ml-auto text-sm bg-blue-50 text-bmn-blue px-2 py-0.5 rounded-full font-medium">
              {profile.tradeInterests?.length || 0} markets
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.tradeInterests && profile.tradeInterests.length > 0 ? (
              profile.tradeInterests.map((interest) => (
                <div key={interest.id} className="px-3 py-1.5 bg-gray-50 border border-bmn-border rounded-lg text-sm text-text-primary">
                  {interest.countryName}
                </div>
              ))
            ) : (
              <p className="text-text-secondary">No markets selected.</p>
            )}
          </div>
        </div>

        {/* Certifications Card */}
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Award className="h-5 w-5 icon-gradient-primary" />
            </div>
            <h2 className="text-xl font-bold font-display text-text-primary">Certifications</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {profile.certifications && profile.certifications.length > 0 ? (
              profile.certifications.map((cert) => (
                <div key={cert.id} className="flex items-center gap-2 p-3 bg-gray-50 border border-bmn-border rounded-lg text-sm font-medium text-text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-bmn-blue" />
                  {cert.type}
                </div>
              ))
            ) : (
              <p className="text-text-secondary">No certifications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
