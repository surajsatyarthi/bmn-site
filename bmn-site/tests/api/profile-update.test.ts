import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

// --- Mocks ---
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

const mockGetUser = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({ auth: { getUser: mockGetUser } })
  ),
}));

const mockUpdate = vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) }));
const mockInsert = vi.fn(() => ({ values: vi.fn() }));
const mockFindFirst = vi.fn();
vi.mock('@/lib/db', () => ({
  db: {
    update: mockUpdate,
    insert: mockInsert,
    query: {
      companies: { findFirst: mockFindFirst },
      tradeTerms: { findFirst: mockFindFirst },
    },
  },
}));

// Import AFTER mocks
import { PATCH } from '@/app/api/profile/update/route';

const validBody = {
  fullName: 'Test User',
  companyName: 'Test Co',
  businessType: 'manufacturer' as const,
  country: 'IN',
};

function makeRequest(body: unknown) {
  return { json: () => Promise.resolve(body) } as Request;
}

describe('PATCH /api/profile/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: db upserts resolve
    mockUpdate.mockReturnValue({ set: vi.fn(() => ({ where: vi.fn() })) });
    mockInsert.mockReturnValue({ values: vi.fn() });
    mockFindFirst.mockResolvedValue(null);
  });

  it('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    await PATCH(makeRequest(validBody));
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  });

  it('returns 422 when body fails Zod validation', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    await PATCH(makeRequest({ fullName: 'X' })); // too short, missing required fields
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Validation failed' }),
      { status: 422 }
    );
  });

  it('calls db.insert for company when no existing company found', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockFindFirst.mockResolvedValue(null); // no existing company
    await PATCH(makeRequest(validBody));
    expect(mockInsert).toHaveBeenCalled();
  });

  it('calls db.update for company when existing company found', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockFindFirst.mockResolvedValueOnce({ id: 'company-1' }); // existing company
    mockFindFirst.mockResolvedValue(null); // no existing tradeTerms
    await PATCH(makeRequest(validBody));
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('returns 200 success on valid authenticated request', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockFindFirst.mockResolvedValue(null);
    await PATCH(makeRequest(validBody));
    expect(NextResponse.json).toHaveBeenCalledWith({ success: true });
  });
});
