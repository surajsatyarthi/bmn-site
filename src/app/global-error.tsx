'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  _reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-bmn-light-bg p-4 text-center">
          <h1 className="font-display text-2xl font-bold text-text-primary">BMN</h1>
          <h2 className="mt-4 text-xl font-semibold text-text-primary">Something went wrong</h2>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-sm text-red-500">{error.message}</p>
          )}
          <button
            onClick={() => (window.location.href = '/')}
            className="mt-6 rounded bg-bmn-blue px-4 py-2 font-display text-white hover:bg-bmn-light-blue"
          >
            Go Home
          </button>
        </div>
      </body>
    </html>
  );
}
