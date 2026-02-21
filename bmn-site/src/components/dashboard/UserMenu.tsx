'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { type InferSelectModel } from 'drizzle-orm';
import { profiles } from '@/lib/db/schema';

type Profile = InferSelectModel<typeof profiles>;

interface UserMenuProps {
  user: SupabaseUser;
  profile: Profile | null | undefined;
}

export default function UserMenu({ user, profile }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  const fullName = profile?.fullName || user?.email || 'User';
  const role = profile?.isAdmin ? 'Admin' : 'Member';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 outline-none focus-visible:ring-2 focus-visible:ring-bmn-blue">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
          {initials}
        </div>
        <div className="hidden md:flex flex-col items-start leading-none gap-0.5">
          <span className="text-sm font-semibold text-text-primary text-left max-w-[100px] truncate">
            {fullName}
          </span>
          <span className="text-[10px] text-text-secondary font-medium">
            {role}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-text-secondary" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-3 border-b border-gray-100 md:hidden">
            <p className="text-sm font-semibold text-text-primary truncate">{fullName}</p>
            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
          </div>

          <div className="p-1">
            <DropdownMenu.Item asChild>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary outline-none focus:text-text-primary focus:bg-gray-50 rounded-lg cursor-pointer"
              >
                <User className="h-4 w-4 text-blue-500" />
                Profile
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary outline-none focus:text-text-primary focus:bg-gray-50 rounded-lg cursor-pointer"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                Settings
              </Link>
            </DropdownMenu.Item>
          </div>

          <div className="h-px bg-gray-100 my-1" />

          <div className="p-1">
            <DropdownMenu.Item asChild>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 outline-none focus:bg-red-50 rounded-lg cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
