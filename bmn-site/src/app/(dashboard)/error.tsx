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
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-4 text-xl font-semibold text-text-primary">Something went wrong</h2>
      <div className="space-x-4">
        <Link
          href="/dashboard"
          className="rounded text-bmn-blue hover:text-bmn-light-blue hover:underline"
        >
          Return to Dashboard
        </Link>
        <button
          onClick={() => reset()}
          className="rounded bg-bmn-blue px-4 py-2 font-display text-white hover:bg-bmn-light-blue"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
