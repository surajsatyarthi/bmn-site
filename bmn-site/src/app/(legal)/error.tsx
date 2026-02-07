'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  _reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center bg-bmn-light-bg">
      <h2 className="mb-4 text-xl font-semibold text-text-primary">Something went wrong</h2>
      <Link
        href="/"
        className="rounded bg-bmn-blue px-4 py-2 font-display text-white hover:bg-bmn-light-blue"
      >
        Return to Home
      </Link>
    </div>
  );
}
