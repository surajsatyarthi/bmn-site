import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, products, tradeInterests, companies, certifications, tradeTerms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import countriesData from '@/lib/data/countries.json';

// Schema for different steps
const stepSchema = z.object({
  step: z.number().min(1).max(7),
  data: z.record(z.string(), z.unknown()),
});

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { step, data } = stepSchema.parse(body);

    const [currentProfile] = await db.select().from(profiles).where(eq(profiles.id, user.id));
    if (!currentProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updateData: any = { 
      onboardingStep: step,
      updatedAt: new Date(),
    };

    if (step === 7) {
      updateData.onboardingCompleted = true;
    }

    if (step === 1) {
      if (!data.tradeRole || !['exporter', 'importer', 'both'].includes(data.tradeRole as string)) {
        return NextResponse.json({ error: 'Invalid trade role' }, { status: 400 });
      }
      updateData.tradeRole = data.tradeRole as "exporter" | "importer" | "both";
    }

    const effectiveTradeRole = updateData.tradeRole || currentProfile.tradeRole;

    if (step === 2) {
      if (!Array.isArray(data.products)) {
        return NextResponse.json({ error: 'Invalid products data' }, { status: 400 });
      }

      await db.delete(products).where(eq(products.profileId, user.id));

      if (data.products.length > 0) {
        const productsToInsert = (data.products as { hsCode: string; name: string }[]).map((p) => ({
          profileId: user.id,
          hsCode: p.hsCode,
          name: p.name,
          tradeType: (effectiveTradeRole === 'importer' ? 'import' : 'export') as 'export' | 'import' | 'both',
        }));
        await db.insert(products).values(productsToInsert);
      }
    }

    if (step === 3) {
      if (!Array.isArray(data.targetCountries)) {
        return NextResponse.json({ error: 'Invalid countries data' }, { status: 400 });
      }

      await db.delete(tradeInterests).where(eq(tradeInterests.profileId, user.id));

      if (data.targetCountries.length > 0) {
        const interestsToInsert = data.targetCountries.map((code: string) => ({
          profileId: user.id,
          countryCode: code,
          countryName: (countriesData as { code: string; name: string }[]).find(c => c.code === code)?.name ?? code,
          interestType: (effectiveTradeRole === 'exporter' ? 'export_to' : 'import_from') as 'export_to' | 'import_from',
        }));
        await db.insert(tradeInterests).values(interestsToInsert);
      }
    }

    if (step === 4) {
      if (!data.companyName) {
        return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
      }
      
      updateData.companyName = data.companyName as string;
      updateData.website = (data.website as string) || undefined;
      updateData.yearEstablished = (data.yearEstablished as string) || undefined;

      const companyDefaults = {
        entityType: 'other',
        city: 'Not Provided',
        state: 'Not Provided',
        country: (data.country as string) || 'India', // Pass front-end data or fallback
        businessType: ['manufacturer', 'trader', 'both', 'agent'].includes(data.businessType as string) 
          ? (data.businessType as 'manufacturer' | 'trader' | 'both' | 'agent') 
          : 'both',
        employeeCount: (data.employeeCount as string) || null,
        description: (data.description as string) || null,
      };

      await db.insert(companies).values({
        profileId: user.id,
        name: data.companyName as string,
        website: (data.website as string) || null,
        foundingYear: (data.yearEstablished as string) ? parseInt(data.yearEstablished as string) : null,
        ...companyDefaults,
      }).onConflictDoUpdate({
        target: [companies.profileId],
        set: {
          name: data.companyName as string,
          website: (data.website as string) || null,
          foundingYear: (data.yearEstablished as string) ? parseInt(data.yearEstablished as string) : null,
          updatedAt: new Date(),
          ...companyDefaults,
        }
      });
    }

    if (step === 5) {
      if (!Array.isArray(data.certifications)) {
        return NextResponse.json({ error: 'Invalid certifications data' }, { status: 400 });
      }

      await db.delete(certifications).where(eq(certifications.profileId, user.id));

      if (data.certifications.length > 0) {
        const certsToInsert = data.certifications.map((name: string) => ({
          profileId: user.id,
          type: name,
        }));
        await db.insert(certifications).values(certsToInsert);
      }
    }

    // Handle New Step 6: Trade Terms
    if (step === 6) {
      await db.insert(tradeTerms).values({
        profileId: user.id,
        moqValue: typeof data.moqValue === 'number' ? data.moqValue : null,
        moqUnit: (data.moqUnit as string) || null,
        leadTime: (data.leadTime as string) || null,
        productionCapacity: (data.productionCapacity as string) || null,
        paymentTerms: Array.isArray(data.paymentTerms) ? data.paymentTerms : [],
        incoterms: Array.isArray(data.incoterms) ? data.incoterms : [],
      }).onConflictDoUpdate({
        target: [tradeTerms.profileId],
        set: {
          moqValue: typeof data.moqValue === 'number' ? data.moqValue : null,
          moqUnit: (data.moqUnit as string) || null,
          leadTime: (data.leadTime as string) || null,
          productionCapacity: (data.productionCapacity as string) || null,
          paymentTerms: Array.isArray(data.paymentTerms) ? data.paymentTerms : [],
          incoterms: Array.isArray(data.incoterms) ? data.incoterms : [],
          updatedAt: new Date(),
        }
      });
    }

    // Update Profile base fields
    await db.update(profiles)
      .set(updateData)
      .where(eq(profiles.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
