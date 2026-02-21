'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, BarChart3, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Matches',   href: '/matches',   icon: Search },
  { name: 'Campaigns', href: '/campaigns', icon: BarChart3 },
  { name: 'Database',  href: '/database',  icon: Database },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-white border-t border-bmn-border h-16 md:hidden">
      {links.map(({ name, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={name}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-2 text-[11px] font-medium transition-colors',
              isActive ? 'text-bmn-blue' : 'text-text-secondary'
            )}
          >
            <Icon className={cn('h-5 w-5', isActive ? 'text-bmn-blue' : 'text-indigo-400')} />
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
