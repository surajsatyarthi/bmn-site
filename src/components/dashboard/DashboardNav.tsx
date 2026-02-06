'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Search, BarChart3 } from 'lucide-react';
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
      name: 'Profile',
      href: '/profile',
      icon: User,
      active: pathname === '/profile'
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
    }
  ];

  return (
    <nav className="space-y-1 px-3 mt-6">
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
            <Icon className="h-5 w-5" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
