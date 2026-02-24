import { describe, it, expect } from 'vitest';
import { maskContactField, formatTradeValue, getShipmentSummary } from '@/lib/database/company-detail';

describe('Company Detail Pure Functions', () => {
  describe('maskContactField', () => {
    it('masks an email address, preserving domain', () => {
      expect(maskContactField('john.doe@example.com', 'email')).toBe('••••••@example.com');
      expect(maskContactField('ceo@company.co.in', 'email')).toBe('•••@company.co.in');
    });

    it('masks a phone number', () => {
       // +•• ••• ••• ••••
       expect(maskContactField('+91 987 654 3210', 'phone')).toBe('+•• ••• ••• ••••');
       expect(maskContactField('1234567890', 'phone')).toBe('••••••••••');
    });

    it('handles empty inputs', () => {
      expect(maskContactField('', 'email')).toBe('');
      expect(maskContactField('', 'phone')).toBe('');
    });
  });

  describe('formatTradeValue', () => {
    it('formats numbers to exact dollar string with commas', () => {
      expect(formatTradeValue(12400)).toBe('$12,400');
      expect(formatTradeValue(1000000)).toBe('$1,000,000');
      expect(formatTradeValue(0)).toBe('$0');
      expect(formatTradeValue(5)).toBe('$5');
    });

    it('handles null or undefined safely', () => {
      expect(formatTradeValue(null)).toBe('—');
      expect(formatTradeValue(undefined)).toBe('—');
      expect(formatTradeValue(NaN)).toBe('—');
    });
  });

  describe('getShipmentSummary', () => {
    it('returns empty summary state', async () => {
      const summary = await getShipmentSummary('some-uuid', 'export');
      expect(summary).toEqual({
        exportCount: 0,
        importCount: 0,
        lastShipmentDate: null,
        topHsCodes: []
      });
    });
  });
});
