'use client';

import { useEffect } from 'react';

import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Onboarding Error:', error);
  }, [error]);

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
        <p className="text-sm text-muted-foreground">
          We experienced an issue loading the onboarding wizard.
        </p>
      </div>
      <button 
        onClick={() => reset()} 
        className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
