'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar({ 
  siteName: initialSiteName = "NEXTWEB",
  siteLogo: initialSiteLogo
}: { 
  siteName?: string;
  siteLogo?: string;
}) {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteSettings, setSiteSettings] = useState<{ siteName?: string; siteLogo?: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      if (initialSiteLogo && initialSiteName) {
        return;
      }
      const { data } = await supabase
        .from('site_settings')
        .select('site_name, site_logo')
        .single();
      
      if (data) {
        setSiteSettings({
          siteName: data.site_name || initialSiteName,
          siteLogo: data.site_logo || initialSiteLogo,
        });
      }
    };
    fetchSettings();

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(session.user.user_metadata?.role === 'admin');
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(session.user.user_metadata?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    // 3. Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [initialSiteLogo, initialSiteName]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
  };

  const siteName = siteSettings?.siteName || initialSiteName;
  const siteLogo = siteSettings?.siteLogo || initialSiteLogo;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl flex flex-col items-end gap-3">
      {/* Main Navbar Frame */}
      <div className="w-full bg-black/60 backdrop-blur-md border border-red-900/50 rounded-2xl px-8 py-4 flex items-center justify-between box-red-glow">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black text-red-600 hover:text-red-500 transition-all hover:scale-105 tracking-tighter">
          {siteLogo ? (
            <img 
              src={siteLogo} 
              alt="Logo" 
              className="w-10 h-10 object-cover rounded-full border-2 border-red-900/50" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          <span>{siteName}</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/home" className="text-sm font-medium text-zinc-400 hover:text-red-500 transition-colors relative group">
            หน้าหลัก
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>

          <div className="h-4 w-px bg-zinc-800"></div>

          {!user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                title="เข้าสู่ระบบ"
                className="p-2 text-zinc-400 hover:text-red-500 transition-all hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              </Link>
              
              <Link 
                href="/register" 
                title="สมัครสมาชิก"
                className="p-2.5 bg-red-700/20 border border-red-700/50 text-red-500 rounded-xl hover:bg-red-700 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(230,0,0,0.3)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
              </Link>
            </div>
          ) : (
            <button 
              ref={avatarRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full border-2 border-red-600 overflow-hidden hover:scale-105 transition-all box-red-glow relative group"
            >
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Avatar"
                className="w-full h-full object-cover bg-zinc-900"
              />
              <div className="absolute inset-0 bg-red-600/10 group-hover:bg-transparent transition-colors"></div>
            </button>
          )}
        </div>
      </div>

      {/* Separate User Popup */}
      {isMenuOpen && user && (
        <div 
          ref={menuRef}
          className="w-64 bg-zinc-950/90 backdrop-blur-2xl border border-red-900/50 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] box-red-glow animate-in slide-in-from-top-2 fade-in duration-300"
        >
          <div className="px-4 py-3 border-b border-zinc-900 mb-2">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">User Profile</p>
            <p className="text-sm font-black text-white truncate mt-1">
              {user.user_metadata?.username || user.email.split('@')[0]}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
          </div>
          
          <div className="space-y-1">
            <div className="mb-2">
              <Link 
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-all group"
              >
                <div className="p-1.5 bg-zinc-900 rounded-lg group-hover:bg-red-900/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                จัดการผู้ใช้
              </Link>
            </div>
            {isAdmin && (
              <div className="mb-2">
                <Link 
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-all group"
                >
                  <div className="p-1.5 bg-zinc-900 rounded-lg group-hover:bg-red-900/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  เข้าสู่หน้าแอดมิน
                </Link>
              </div>
            )}

            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-all group text-left"
            >
              <div className="p-1.5 bg-zinc-900 rounded-lg group-hover:bg-red-900/30 transition-colors text-zinc-500 group-hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </div>
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
