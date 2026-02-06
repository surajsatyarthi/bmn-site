import Link from 'next/link';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bmn-light-bg">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-bmn-border flex items-center justify-between px-6 sticky top-0 z-30">
        <Link href="/" className="text-2xl font-display font-bold text-gradient-primary">
          BMN
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-text-secondary">Account</span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-bmn-border hidden md:flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <DashboardNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
