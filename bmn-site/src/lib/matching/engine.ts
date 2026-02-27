import { sql, eq, and, ne } from 'drizzle-orm';
import { products, tradeInterests, matches } from '../db/schema';
import type { PgDatabase } from 'drizzle-orm/pg-core';

export function getHsSpecificity(candidateHs: string, userHs: string): number {
  if (candidateHs.startsWith(userHs.slice(0, 6))) return 100; // 6-digit
  if (candidateHs.startsWith(userHs.slice(0, 4))) return 75;  // 4-digit
  return 50;                                                  // 2-digit (chapter)
}

export function getRecencyScore(lastDate: Date): number {
  const daysAgo = (Date.now() - lastDate.getTime()) / 86400000;
  if (daysAgo <= 90)  return 100;
  if (daysAgo <= 180) return 80;
  if (daysAgo <= 365) return 60;
  if (daysAgo <= 730) return 40;
  return 20;
}

export function scoreMatch(
  candidate: { shipmentCount: number; tradeValue: number; hsCode: string; lastDate: Date },
  maxCount: number,
  maxValue: number,
  userHsCode: string
): number {
  const freqScore    = maxCount > 0 ? (candidate.shipmentCount / maxCount) * 100 : 0;
  const valueScore   = maxValue > 0 ? (candidate.tradeValue / maxValue) * 100 : 0;
  const hsScore      = getHsSpecificity(candidate.hsCode, userHsCode);
  const recencyScore = getRecencyScore(candidate.lastDate);
  return Math.round(freqScore * 0.4 + valueScore * 0.3 + hsScore * 0.2 + recencyScore * 0.1);
}

function timeAgo(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(days / 365);
  return `${years} years ago`;
}

function formatUsd(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export async function generateMatchesForUser(userId: string, db: any): Promise<any[]> {
  const userProducts = await db.select().from(products).where(eq(products.profileId, userId));
  const userInterests = await db.select().from(tradeInterests).where(eq(tradeInterests.profileId, userId));

  if (userProducts.length === 0 || userInterests.length === 0) {
    return [];
  }

  const allCandidates: any[] = [];

  for (const product of userProducts) {
    for (const interest of userInterests) {
      if (
        (product.tradeType === 'export' && interest.interestType === 'export_to') ||
        (product.tradeType === 'import' && interest.interestType === 'import_from')
      ) {
        
        let queryResult;
        
        if (product.tradeType === 'export') {
          queryResult = await db.execute(sql`
            SELECT
              consignee_name          AS company_name,
              consignee_country       AS company_country,
              consignee_city          AS company_city,
              hs_code,
              COUNT(*)                AS shipment_count,
              COALESCE(SUM(fob_value_usd::numeric), 0) AS total_value_usd,
              MAX(shipment_date)      AS last_shipment_date
            FROM trade_shipments
            WHERE trade_direction = 'export'
              AND LEFT(hs_code, 2) = LEFT(${product.hsCode}, 2)
              AND (
                consignee_country ILIKE ${interest.countryName}
                OR consignee_country = ${interest.countryCode}
              )
              AND consignee_name IS NOT NULL
            GROUP BY consignee_name, consignee_country, consignee_city, hs_code
            ORDER BY shipment_count DESC, total_value_usd DESC
            LIMIT 50
          `);
        } else {
          queryResult = await db.execute(sql`
            SELECT
              shipper_name            AS company_name,
              shipper_country         AS company_country,
              shipper_city            AS company_city,
              hs_code,
              COUNT(*)                AS shipment_count,
              COALESCE(SUM(cif_value_usd::numeric), 0) AS total_value_usd,
              MAX(shipment_date)      AS last_shipment_date
            FROM trade_shipments
            WHERE trade_direction = 'export'
              AND LEFT(hs_code, 2) = LEFT(${product.hsCode}, 2)
              AND (
                shipper_country ILIKE ${interest.countryName}
                OR shipper_country = ${interest.countryCode}
              )
              AND shipper_name IS NOT NULL
            GROUP BY shipper_name, shipper_country, shipper_city, hs_code
            ORDER BY shipment_count DESC, total_value_usd DESC
            LIMIT 50
          `);
        }

        const candidates = queryResult.rows || queryResult;

        if (candidates.length > 0) {
          const maxCount = Math.max(...candidates.map((c: any) => Number(c.shipment_count)));
          const maxValue = Math.max(...candidates.map((c: any) => Number(c.total_value_usd)));

          for (const c of candidates) {
            const lastDate = new Date(c.last_shipment_date);
            const shipmentCount = Number(c.shipment_count);
            const tradeValue = Number(c.total_value_usd);
            
            const rawScore = scoreMatch(
              { shipmentCount, tradeValue, hsCode: c.hs_code, lastDate },
              maxCount,
              maxValue,
              product.hsCode
            );

            if (rawScore >= 40) {
              allCandidates.push({
                companyName: c.company_name,
                companyCountry: c.company_country,
                companyCity: c.company_city,
                hsCode: c.hs_code,
                shipmentCount,
                tradeValue,
                lastDate,
                rawScore,
                userProduct: product
              });
            }
          }
        }
      }
    }
  }

  // Deduplicate by company name + country
  const uniqueCandidatesMap = new Map<string, any>();
  for (const c of allCandidates) {
    const key = `${c.companyName.toLowerCase()}|${c.companyCountry.toLowerCase()}`;
    if (!uniqueCandidatesMap.has(key) || uniqueCandidatesMap.get(key).rawScore < c.rawScore) {
      uniqueCandidatesMap.set(key, c);
    }
  }

  // Sort and limit to 50
  const topCandidates = Array.from(uniqueCandidatesMap.values())
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, 50);

  const newMatchesToInsert: any[] = [];

  for (const c of topCandidates) {
    // Enrichment step
    let enrichedEmail = null;
    let enrichedPhone = null;

    try {
      const enrichmentRes = await db.execute(sql`
        SELECT india_party_email, india_party_phone
        FROM trade_shipments
        WHERE similarity(india_party_name, ${c.companyName}) >= 0.7
          AND india_party_email IS NOT NULL
        ORDER BY similarity(india_party_name, ${c.companyName}) DESC
        LIMIT 1
      `);
      
      const enrichmentRows = enrichmentRes.rows || enrichmentRes;
      if (enrichmentRows.length > 0) {
        enrichedEmail = enrichmentRows[0].india_party_email;
        enrichedPhone = enrichmentRows[0].india_party_phone;
      }
    } catch (err) {
      // Ignore enrichment errors
    }

    let matchTier = 'good';
    if (c.rawScore >= 80) matchTier = 'best';
    else if (c.rawScore >= 60) matchTier = 'great';

    const hsScore = getHsSpecificity(c.hsCode, c.userProduct.hsCode);

    const reasons: string[] = [];
    reasons.push(`Traded ${c.userProduct.name} ${c.shipmentCount} times — last active ${timeAgo(c.lastDate)}`);
    if (c.tradeValue > 0) reasons.push(`Trade volume: $${formatUsd(c.tradeValue)} total`);
    if (hsScore === 100) reasons.push(`Exact product match: HS ${c.hsCode}`);
    reasons.push(`Located in ${c.companyCity ? c.companyCity + ', ' : ''}${c.companyCountry}`);

    newMatchesToInsert.push({
      profileId: userId,
      counterpartyName: c.companyName,
      counterpartyCountry: c.companyCountry,
      counterpartyCity: c.companyCity || null,
      matchedProducts: [{ hsCode: c.hsCode, name: c.userProduct.name }],
      matchScore: c.rawScore,
      matchTier,
      scoreBreakdown: {
        total: c.rawScore,
      },
      matchReasons: reasons,
      status: 'new',
      revealed: false,
      counterpartyContact: enrichedEmail ? {
        name: c.companyName,
        title: '',
        email: enrichedEmail,
        phone: enrichedPhone || '',
        website: null
      } : null
    });
  }

  if (newMatchesToInsert.length > 0) {
    await db.delete(matches).where(
      and(
        eq(matches.profileId, userId),
        eq(matches.revealed, false),
        ne(matches.status, 'interested')
      )
    );

    await db.insert(matches).values(newMatchesToInsert);
  }

  return newMatchesToInsert;
}
