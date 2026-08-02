import { describe, expect, it } from 'vitest';
import { calculateDiscount, normalizeText, countWords } from '../js/pureUtils.js';

describe('pure utility helpers', () => {
  it('calculates a discounted total for valid inputs', () => {
    expect(calculateDiscount(100, 2, 0.1)).toBe(180);
  });

  it('returns zero for invalid numeric input', () => {
    expect(calculateDiscount('bad', 2, 0.1)).toBe(0);
  });

  it('normalizes text by trimming and lowercasing it', () => {
    expect(normalizeText('  Hello WORLD  ')).toBe('hello world');
  });

  it('counts words safely for empty input', () => {
    expect(countWords('   ')).toBe(0);
  });
});
