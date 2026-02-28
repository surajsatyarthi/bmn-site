import { describe, it, expect } from 'vitest';
import { buildDatabaseFilters, PAGE_SIZE } from '@/lib/database/filters';

describe('buildDatabaseFilters', () => {
  it('empty params → no filters, page=1, offset=0', () => {
    const result = buildDatabaseFilters({});
    expect(result.name).toBeUndefined();
    expect(result.countryCode).toBeUndefined();
    expect(result.hsChapter).toBeUndefined();
    expect(result.tradeType).toBeUndefined();
    expect(result.page).toBe(1);
    expect(result.offset).toBe(0);
  });

  it('single country filter → countryCode set', () => {
    const result = buildDatabaseFilters({ country: 'DE' });
    expect(result.countryCode).toBe('DE');
  });

  it('lowercased country → uppercased to valid code', () => {
    const result = buildDatabaseFilters({ country: 'de' });
    expect(result.countryCode).toBe('DE');
  });

  it('invalid country (too long) → countryCode undefined', () => {
    const result = buildDatabaseFilters({ country: 'DEU' });
    expect(result.countryCode).toBeUndefined();
  });

  it('HS chapter filter → hsChapter set', () => {
    const result = buildDatabaseFilters({ hs: '33' });
    expect(result.hsChapter).toBe('33');
  });

  it('invalid HS chapter (non-numeric) → hsChapter undefined', () => {
    const result = buildDatabaseFilters({ hs: 'AB' });
    expect(result.hsChapter).toBeUndefined();
  });

  it('trade_type filter → tradeType set', () => {
    expect(buildDatabaseFilters({ trade_type: 'importer' }).tradeType).toBe('importer');
    expect(buildDatabaseFilters({ trade_type: 'exporter' }).tradeType).toBe('exporter');
    expect(buildDatabaseFilters({ trade_type: 'both' }).tradeType).toBe('both');
  });

  it('invalid trade_type → tradeType undefined', () => {
    const result = buildDatabaseFilters({ trade_type: 'supplier' });
    expect(result.tradeType).toBeUndefined();
  });

  it('name search → name set', () => {
    const result = buildDatabaseFilters({ name: 'BASF' });
    expect(result.name).toBe('BASF');
  });

  it('name with whitespace → trimmed', () => {
    const result = buildDatabaseFilters({ name: '  Siemens  ' });
    expect(result.name).toBe('Siemens');
  });

  it('empty name string → name undefined', () => {
    const result = buildDatabaseFilters({ name: '   ' });
    expect(result.name).toBeUndefined();
  });

  it('combined filters → all fields set', () => {
    const result = buildDatabaseFilters({
      name: 'BMW',
      country: 'DE',
      hs: '87',
      trade_type: 'exporter',
    });
    expect(result.name).toBe('BMW');
    expect(result.countryCode).toBe('DE');
    expect(result.hsChapter).toBe('87');
    expect(result.tradeType).toBe('exporter');
  });

  it('page=3 → offset = 50', () => {
    const result = buildDatabaseFilters({ page: '3' });
    expect(result.page).toBe(3);
    expect(result.offset).toBe(2 * PAGE_SIZE);
  });

  it('page=0 → clamped to page=1, offset=0', () => {
    const result = buildDatabaseFilters({ page: '0' });
    expect(result.page).toBe(1);
    expect(result.offset).toBe(0);
  });

  it('page=NaN → defaults to page=1', () => {
    const result = buildDatabaseFilters({ page: 'abc' });
    expect(result.page).toBe(1);
    expect(result.offset).toBe(0);
  });

  it('array value for param → ignored (uses undefined)', () => {
    const result = buildDatabaseFilters({ country: ['DE', 'US'] });
    expect(result.countryCode).toBeUndefined();
  });
});
