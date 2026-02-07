'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bmn-light-bg p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm border border-bmn-border text-center">
        <h2 className="mb-4 text-xl font-semibold text-text-primary">Something went wrong</h2>
        <Link
          href="/login"
          className="inline-block rounded bg-bmn-blue px-4 py-2 font-display text-white hover:bg-bmn-light-blue"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}
