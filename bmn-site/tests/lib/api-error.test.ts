import { describe, it, expect, vi } from 'vitest';
import { ApiError, handleApiError } from '@/lib/api-error';
import { NextResponse } from 'next/server';

// Mock NextResponse.json
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

describe('ApiError', () => {
  it('should store status code and code', () => {
    const error = new ApiError(400, 'BAD_REQUEST', 'Invalid input', { field: 'email' });
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.message).toBe('Invalid input');
    expect(error.details).toEqual({ field: 'email' });
  });
});

describe('handleApiError', () => {
  it('should handle ApiError correctly', () => {
    const error = new ApiError(404, 'NOT_FOUND', 'Resource missing');
    handleApiError(error);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Resource missing', code: 'NOT_FOUND', details: undefined },
      { status: 404 }
    );
  });

  it('should handle unknown errors as 500', () => {
    const error = new Error('Something went wrong');
    handleApiError(error);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  });
});
