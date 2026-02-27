import { expect, test, describe } from 'vitest';
import { getHsSpecificity, getRecencyScore, scoreMatch } from '../../../src/lib/matching/engine';

describe('Matching Engine Pure Functions', () => {
  test('getHsSpecificity', () => {
    expect(getHsSpecificity('870840', '8708')).toBe(75); // 4-digit match
    expect(getHsSpecificity('870840', '870840')).toBe(100); // 6-digit match
    expect(getHsSpecificity('870840', '84')).toBe(50); // chapter only
  });

  const daysAgo = (days: number) => new Date(Date.now() - days * 86400000);

  test('getRecencyScore', () => {
    expect(getRecencyScore(daysAgo(30))).toBe(100);
    expect(getRecencyScore(daysAgo(150))).toBe(80);
    expect(getRecencyScore(daysAgo(300))).toBe(60);
    expect(getRecencyScore(daysAgo(600))).toBe(40);
    expect(getRecencyScore(daysAgo(800))).toBe(20);
  });

  test('scoreMatch computes correctly', () => {
    const candidate = {
      shipmentCount: 10,
      tradeValue: 1000,
      hsCode: '8708',
      lastDate: daysAgo(30),
    };
    
    expect(scoreMatch(candidate, 10, 1000, '8708')).toBe(100);
  });

  test('scoreMatch excludes candidate correctly', () => {
    const candidate = {
      shipmentCount: 1,
      tradeValue: 100,
      hsCode: '3926', // different chapter entirely -> specificity drops
      lastDate: daysAgo(1000), // very old -> recency 20
    };
    
    const score = scoreMatch(candidate, 1000, 1000000, '8708');
    expect(score).toBeLessThan(40);
  });
});
