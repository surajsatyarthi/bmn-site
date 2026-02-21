'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, BarChart3, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardNav() {
  const pathname = usePathname();

  const links = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard'
    },
    {
      name: 'Matches',
      href: '/matches',
      icon: Search,
      active: pathname === '/matches' || pathname.startsWith('/matches/')
    },
    {
      name: 'Campaigns',
      href: '/campaigns',
      icon: BarChart3,
      active: pathname === '/campaigns' || pathname.startsWith('/campaigns/')
    },
    {
      name: 'Database',
      href: '/database',
      icon: Database,
      active: pathname === '/database' || pathname.startsWith('/database/')
    }
  ];

  return (
    <div className="flex flex-col h-full py-6">
      <nav className="space-y-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.active;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-blue-50 text-bmn-blue" 
                  : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-bmn-blue" : "text-indigo-500")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="mt-auto px-6 space-y-4">
        <div className="flex flex-row items-center gap-2 flex-wrap">
          <Link href="/terms" className="text-[10px] text-text-secondary hover:text-text-primary transition-colors">
            Terms
          </Link>
          <span className="text-[10px] text-text-secondary opacity-30">•</span>
          <Link href="/privacy" className="text-[10px] text-text-secondary hover:text-text-primary transition-colors">
            Privacy
          </Link>
          <span className="text-[10px] text-text-secondary opacity-30">•</span>
          <Link href="/contact" className="text-[10px] text-text-secondary hover:text-text-primary transition-colors">
            Contact
          </Link>
        </div>
        <p className="text-[10px] text-text-secondary opacity-70">
          © 2026 BMN. All rights reserved.
        </p>
      </div>
    </div>
  );
}
