import { describe, it, expect, vi } from 'vitest';


// We can't easily test the env module directly since it executes on import and process.env is global.
// Instead, we will test the schema validation logic if we exported schemas, or mocks.
// Deliverable says "tests/lib/env.test.ts" -> Test env validation.
// Since we didn't export schemas in D9 (only clientEnv/serverEnv), we might need to modify env.ts or test by mocking process.env and re-importing.
// Re-importing modules in Jest/Vitest requires vi.resetModules().

describe('env validation', () => {
  it('should validate correct client env', async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    
    const { clientEnv } = await import('@/lib/env');
    expect(clientEnv.NEXT_PUBLIC_SUPABASE_URL).toBe('https://example.supabase.co');
  });

  it('should throw on missing required var', async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    await expect(import('@/lib/env')).rejects.toThrow();
  });
});
