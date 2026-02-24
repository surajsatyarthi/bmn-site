export const PAGE_SIZE = 25;

export type TradeTypeFilter = 'importer' | 'exporter' | 'both';

export interface DatabaseFilters {
  name?: string;
  countryCode?: string;
  hsChapter?: string;
  tradeType?: TradeTypeFilter;
  page: number;
  offset: number;
}

const VALID_TRADE_TYPES = new Set<string>(['importer', 'exporter', 'both']);

export function buildDatabaseFilters(
  params: Record<string, string | string[] | undefined>,
): DatabaseFilters {
  const str = (key: string): string | undefined => {
    const v = params[key];
    return typeof v === 'string' ? v.trim() : undefined;
  };

  const name = str('name') || undefined;

  const rawCountry = str('country')?.toUpperCase();
  const countryCode =
    rawCountry && /^[A-Z]{2}$/.test(rawCountry) ? rawCountry : undefined;

  const rawHs = str('hs');
  const hsChapter = rawHs && /^\d{2}$/.test(rawHs) ? rawHs : undefined;

  const rawTradeType = str('trade_type');
  const tradeType =
    rawTradeType && VALID_TRADE_TYPES.has(rawTradeType)
      ? (rawTradeType as TradeTypeFilter)
      : undefined;

  const rawPage = parseInt(str('page') ?? '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const offset = (page - 1) * PAGE_SIZE;

  return { name, countryCode, hsChapter, tradeType, page, offset };
}
