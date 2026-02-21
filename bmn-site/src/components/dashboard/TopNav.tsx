'use client';

import Link from 'next/link';
import UserMenu from './UserMenu';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { type InferSelectModel } from 'drizzle-orm';
import { profiles } from '@/lib/db/schema';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import DashboardNav from './DashboardNav';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type Profile = InferSelectModel<typeof profiles>;

interface TopNavProps {
  user: SupabaseUser;
  profile: Profile | null | undefined;
}

export default function TopNav({ user, profile }: TopNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Generate breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);
  const title = segments[0] ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1) : 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-bmn-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="p-2 -ml-2 text-text-secondary hover:text-text-primary outline-none">
                <Menu className="h-5 w-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white z-50 border-r border-bmn-border shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
                <div className="h-16 border-b border-bmn-border flex items-center justify-between px-6">
                  <Link href="/" className="text-2xl font-display font-bold text-gradient-primary">
                    BMN
                  </Link>
                  <Dialog.Close asChild>
                    <button className="p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-gray-100">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <DashboardNav />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="hidden md:block text-2xl font-display font-bold text-gradient-primary">
          BMN
        </Link>
        
        {/* Breadcrumb Separator */}
        <span className="hidden md:inline-block text-gray-300 mx-2">/</span>
        
        {/* Dynamic Title */}
        <h1 className="text-sm font-semibold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu user={user} profile={profile} />
      </div>
    </header>
  );
}
