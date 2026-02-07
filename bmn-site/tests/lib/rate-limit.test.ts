import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('checkRateLimit', () => {
  const windowMs = 1000;
  const limit = 3;

  beforeEach(() => {
    // We can't easily clear the private map in the module without modifying the module or reloading it,
    // but we can use unique keys for each test or mocking date.
    vi.useFakeTimers();
  });

  it('should allow first request', () => {
    const key = 'test-1';
    const result = checkRateLimit(key, limit, windowMs);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(limit - 1);
  });

  it('should block requests over limit', () => {
    const key = 'test-2';
    checkRateLimit(key, limit, windowMs); // 1 used
    checkRateLimit(key, limit, windowMs); // 2 used
    checkRateLimit(key, limit, windowMs); // 3 used (limit reached)
    
    const result = checkRateLimit(key, limit, windowMs); // 4th request
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should reset after window expires', () => {
    const key = 'test-3';
    checkRateLimit(key, limit, windowMs); // 1 used
    
    vi.advanceTimersByTime(windowMs + 100);
    
    const result = checkRateLimit(key, limit, windowMs);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(limit - 1); // Counter reset to 1
  });
});
