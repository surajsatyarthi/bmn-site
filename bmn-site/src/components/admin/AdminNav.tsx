'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Upload, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      active: pathname === '/admin/users' || pathname.startsWith('/admin/users/')
    },
    {
      name: 'Upload Matches',
      href: '/admin/matches/upload',
      icon: Upload,
      active: pathname === '/admin/matches/upload'
    },
    {
      name: 'Campaigns',
      href: '/admin/campaigns',
      icon: BarChart3,
      active: pathname === '/admin/campaigns'
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
                ? "bg-gray-800 text-white" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
