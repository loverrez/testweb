'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<string | null>('ภาพรวม');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata?.role !== 'admin') {
        router.push('/login');
      } else {
        setIsAdmin(true);
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const menuCategories = [
    {
      name: 'ภาพรวม',
      items: [
        { name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      ],
    },
    {
      name: 'จัดการเว็บไซต์',
      items: [
        { name: 'ตั้งค่าเว็บไซต์', href: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-6 bg-zinc-950 border-b border-white/5">
        <Link href="/" className="text-xl font-black text-red-600 tracking-tighter uppercase">
          ADMIN<span className="text-white">PANEL</span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isSidebarOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-10 hidden lg:block">
          <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter uppercase group">
            ADMIN<span className="text-white group-hover:text-red-500 transition-colors">PANEL</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-4 lg:mt-0 mt-10">
          {menuCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <button
                type="button"
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-black text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="text-[10px] uppercase">{category.name}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${openCategory === category.name ? 'rotate-180 text-red-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openCategory === category.name && (
                <div className="space-y-1 ml-2 border-l-2 border-red-900/20 pl-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        pathname === item.href 
                        ? 'bg-red-700 text-white shadow-xl shadow-red-900/20' 
                        : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                      </svg>
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-6 py-4 text-zinc-500 hover:text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/5 via-transparent to-transparent">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 md:mb-16">
          <div>
            <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Administrator Terminal</h2>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-2 tracking-tighter uppercase">
              Control <span className="text-red-600">Center</span>
            </h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link href="/" className="flex-1 md:flex-none px-8 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all text-center">
              Main Site
            </Link>
          </div>
        </header>

        <div className="bg-zinc-950/30 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 md:p-10 lg:p-12 shadow-2xl min-h-[70vh]">
          {children}
        </div>
      </main>
    </div>
  );
}
