import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, companies, tradeTerms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as z from 'zod';

const updateSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  companyName: z.string().min(2),
  businessType: z.enum(['manufacturer', 'trader', 'both', 'agent']),
  employeeCount: z.string().optional(),
  description: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string(),
  website: z.string().optional(),
  moqValue: z.number().optional(),
  moqUnit: z.string().optional(),
  leadTime: z.string().optional(),
  productionCapacity: z.string().optional(),
});

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    // 1. Update Profile (User level)
    await db.update(profiles)
      .set({
        fullName: data.fullName,
        phone: data.phone || null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id));

    // 2. Upsert Company info
    const existingCompany = await db.query.companies.findFirst({
      where: eq(companies.profileId, user.id),
    });

    if (existingCompany) {
      await db.update(companies)
        .set({
          name: data.companyName,
          businessType: data.businessType,
          employeeCount: data.employeeCount || null,
          description: data.description || null,
          street: data.street || null,
          city: data.city || '',
          state: data.state || '',
          postalCode: data.postalCode || null,
          country: data.country,
          website: data.website || null,
          updatedAt: new Date(),
        })
        .where(eq(companies.profileId, user.id));
    } else {
      await db.insert(companies).values({
        profileId: user.id,
        name: data.companyName,
        entityType: 'Private',
        businessType: data.businessType,
        employeeCount: data.employeeCount || null,
        description: data.description || null,
        street: data.street || null,
        city: data.city || '',
        state: data.state || '',
        postalCode: data.postalCode || null,
        country: data.country,
        website: data.website || null,
      });
    }

    // 3. Upsert Trade Terms (Matchmaking Info)
    const existingTerms = await db.query.tradeTerms.findFirst({
      where: eq(tradeTerms.profileId, user.id),
    });

    if (existingTerms) {
      await db.update(tradeTerms)
        .set({
          moqValue: data.moqValue,
          moqUnit: data.moqUnit || null,
          leadTime: data.leadTime || null,
          productionCapacity: data.productionCapacity || null,
          updatedAt: new Date(),
        })
        .where(eq(tradeTerms.profileId, user.id));
    } else {
      await db.insert(tradeTerms).values({
        profileId: user.id,
        moqValue: data.moqValue,
        moqUnit: data.moqUnit || null,
        leadTime: data.leadTime || null,
        productionCapacity: data.productionCapacity || null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Profile update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
