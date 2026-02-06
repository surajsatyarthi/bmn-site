import { Header } from '@/components/layout/Header';
import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="py-8 border-t border-bmn-border text-center text-sm text-text-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-4">© 2026 Business Market Network. All rights reserved.</p>
          <Link href="/" className="text-bmn-blue hover:underline">
            ← Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
