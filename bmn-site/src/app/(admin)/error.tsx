'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-900 p-8 text-center text-white">
      <h2 className="mb-4 text-xl font-semibold">Something went wrong</h2>
      <div className="space-x-4">
        <Link
          href="/admin"
          className="rounded text-gradient-primary hover:underline hover:decoration-bmn-blue"
        >
          Return to Admin Dashboard
        </Link>
        <button
          onClick={() => reset()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
