import { requireAdmin } from '@/lib/admin';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  const handleLogout = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div>
              <span className="block text-xl font-bold text-white tracking-tight leading-none">BMN Admin</span>
              <span className="block text-[10px] text-gray-400 font-medium mt-1">Connect. Grow. Succeed.</span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <AdminNav />
          
          <div className="p-4 border-t border-gray-800">
             <div className="flex items-center gap-3 mb-4 px-3">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                  {profile.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {profile.fullName}
                  </p>
                  <p className="text-xs text-gray-400">Admin</p>
                </div>
             </div>
             
             <Link 
               href="/dashboard" 
               className="block w-full text-center py-2 px-4 rounded-md bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 hover:text-white mb-2"
             >
               Back to Client Dashboard
             </Link>
             
             <form action={handleLogout}>
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-md">
                   <LogOut className="h-4 w-4" />
                   Sign Out
                </button>
             </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (TODO: Add functionality if needed, for now focusing on desktop) */}
        <div className="md:hidden bg-gray-900 p-4 flex items-center justify-between">
           <span className="text-white font-bold">BMN Admin</span>
           <div className="text-gray-400 text-xs">Desktop only view</div>
        </div>
        
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
