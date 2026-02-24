/**
 * ENTRY-10.0 — G6 Tests: import-santander.ts helper functions
 *
 * Tests pure mapping/parsing logic only.
 * No database connections — helpers are unit-tested in isolation.
 */

import { describe, it, expect } from 'vitest';
import {
  splitList,
  normalizeTrade,
  chunkArray,
  normalizeKey,
  mapCsvRow,
} from '@/scripts/import-santander';

// ---------------------------------------------------------------------------
// splitList
// ---------------------------------------------------------------------------
describe('splitList', () => {
  it('splits semicolon-delimited values', () => {
    expect(splitList('Plastics;Steel;Textiles')).toEqual(['Plastics', 'Steel', 'Textiles']);
  });

  it('splits pipe-delimited values', () => {
    expect(splitList('UAE|Germany|Japan')).toEqual(['UAE', 'Germany', 'Japan']);
  });

  it('trims whitespace from each item', () => {
    expect(splitList('  Plastics ; Steel ; Textiles  ')).toEqual(['Plastics', 'Steel', 'Textiles']);
  });

  it('returns empty array for empty string', () => {
    expect(splitList('')).toEqual([]);
  });

  it('returns empty array for null', () => {
    expect(splitList(null)).toEqual([]);
  });

  it('returns empty array for undefined', () => {
    expect(splitList(undefined)).toEqual([]);
  });

  it('returns single item for string with no delimiter', () => {
    expect(splitList('Chemicals')).toEqual(['Chemicals']);
  });
});

// ---------------------------------------------------------------------------
// normalizeTrade
// ---------------------------------------------------------------------------
describe('normalizeTrade', () => {
  it('maps "importer" → importer', () => {
    expect(normalizeTrade('importer')).toBe('importer');
  });

  it('maps "Importer" (mixed case) → importer', () => {
    expect(normalizeTrade('Importer')).toBe('importer');
  });

  it('maps "import" → importer', () => {
    expect(normalizeTrade('import')).toBe('importer');
  });

  it('maps "exporter" → exporter', () => {
    expect(normalizeTrade('exporter')).toBe('exporter');
  });

  it('maps "EXPORT" → exporter', () => {
    expect(normalizeTrade('EXPORT')).toBe('exporter');
  });

  it('maps "both" → both', () => {
    expect(normalizeTrade('both')).toBe('both');
  });

  it('maps "BOTH" → both', () => {
    expect(normalizeTrade('BOTH')).toBe('both');
  });

  it('returns null for unrecognized value', () => {
    expect(normalizeTrade('distributor')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(normalizeTrade('')).toBeNull();
  });

  it('returns null for null', () => {
    expect(normalizeTrade(null)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// chunkArray
// ---------------------------------------------------------------------------
describe('chunkArray', () => {
  it('splits 1100 items into [500, 500, 100]', () => {
    const arr = Array.from({ length: 1100 }, (_, i) => i);
    const chunks = chunkArray(arr, 500);
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toHaveLength(500);
    expect(chunks[1]).toHaveLength(500);
    expect(chunks[2]).toHaveLength(100);
  });

  it('returns one chunk when array is smaller than chunk size', () => {
    const arr = [1, 2, 3];
    const chunks = chunkArray(arr, 500);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toEqual([1, 2, 3]);
  });

  it('returns empty array for empty input', () => {
    expect(chunkArray([], 500)).toEqual([]);
  });

  it('handles exactly BATCH_SIZE items as one chunk', () => {
    const arr = Array.from({ length: 500 }, (_, i) => i);
    const chunks = chunkArray(arr, 500);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toHaveLength(500);
  });
});

// ---------------------------------------------------------------------------
// normalizeKey
// ---------------------------------------------------------------------------
describe('normalizeKey', () => {
  it('lowercases and trims', () => {
    expect(normalizeKey('  Company Name  ')).toBe('company_name');
  });

  it('replaces spaces with underscores', () => {
    expect(normalizeKey('HS Chapter')).toBe('hs_chapter');
  });

  it('handles already-normalized keys', () => {
    expect(normalizeKey('country_code')).toBe('country_code');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeKey('Top  Products')).toBe('top_products');
  });
});

// ---------------------------------------------------------------------------
// mapCsvRow
// ---------------------------------------------------------------------------
describe('mapCsvRow', () => {
  const validRecord = {
    'Company Name': 'Acme Exports Ltd',
    'Country Code': 'DE',
    'Country': 'Germany',
    'HS Chapter': '39',
    'HS Description': 'Plastics',
    'Trade Type': 'exporter',
    'Top Products': 'PVC Pipes;Plastic Sheets',
    'Partner Countries': 'India;UAE',
    'Contact Email': 'info@acme.de',
    'Contact Phone': '+49-30-1234567',
  };

  it('maps a complete valid record correctly', () => {
    const result = mapCsvRow(validRecord);
    expect(result).not.toBeNull();
    expect(result!.companyName).toBe('Acme Exports Ltd');
    expect(result!.countryCode).toBe('DE');
    expect(result!.countryName).toBe('Germany');
    expect(result!.hsChapter).toBe('39');
    expect(result!.hsDescription).toBe('Plastics');
    expect(result!.tradeType).toBe('exporter');
    expect(result!.topProducts).toEqual(['PVC Pipes', 'Plastic Sheets']);
    expect(result!.partnerCountries).toEqual(['India', 'UAE']);
    expect(result!.contactEmail).toBe('info@acme.de');
    expect(result!.contactPhone).toBe('+49-30-1234567');
    expect(result!.dataSource).toBe('santander');
  });

  it('returns null when company_name is missing', () => {
    const record = { ...validRecord, 'Company Name': '' };
    expect(mapCsvRow(record)).toBeNull();
  });

  it('returns null when company_name key is absent', () => {
    const record: Record<string, string> = { 'Country Code': 'US' };
    expect(mapCsvRow(record)).toBeNull();
  });

  it('normalizes country_code to uppercase', () => {
    const record = { ...validRecord, 'Country Code': 'de' };
    const result = mapCsvRow(record);
    expect(result!.countryCode).toBe('DE');
  });

  it('handles flexible header casing — "company_name" key', () => {
    const record: Record<string, string> = {
      company_name: 'Test Co',
      country_code: 'IN',
    };
    const result = mapCsvRow(record);
    expect(result).not.toBeNull();
    expect(result!.companyName).toBe('Test Co');
  });

  it('sets topProducts to empty array when column is missing or blank', () => {
    const record = { 'Company Name': 'Minimal Co', 'Top Products': '' };
    const result = mapCsvRow(record);
    expect(result!.topProducts).toEqual([]);
  });

  it('sets tradeType to null for unrecognized value', () => {
    const record = { ...validRecord, 'Trade Type': 'distributor' };
    const result = mapCsvRow(record);
    expect(result!.tradeType).toBeNull();
  });

  it('sets optional fields to null when absent', () => {
    const record = { 'Company Name': 'Bare Minimum Co' };
    const result = mapCsvRow(record);
    expect(result).not.toBeNull();
    expect(result!.countryCode).toBeNull();
    expect(result!.contactEmail).toBeNull();
    expect(result!.contactPhone).toBeNull();
    expect(result!.tradeType).toBeNull();
  });
});
