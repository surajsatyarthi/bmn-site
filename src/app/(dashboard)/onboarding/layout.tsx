import Link from 'next/link';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Minimal Header for Onboarding */}
      <header className="glass-header sticky top-0 z-50 h-16 w-full">
        <div className="container mx-auto flex h-full items-center justify-between px-4">
          <Link href="/">
            <span className="text-2xl font-display font-bold text-gradient-primary">BMN</span>
          </Link>
          <div className="text-sm font-medium text-text-secondary">
            Account Setup
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-3xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
