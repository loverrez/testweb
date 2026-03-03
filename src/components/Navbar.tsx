'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Navbar({ 
  siteName: initialSiteName = "NEXTWEB",
  siteLogo: initialSiteLogo
}: { 
  siteName?: string;
  siteLogo?: string;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteSettings, setSiteSettings] = useState<{ siteName?: string; siteLogo?: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(session.user.user_metadata?.role === 'admin');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(session.user.user_metadata?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const siteName = siteSettings?.siteName || initialSiteName;
  const siteLogo = siteSettings?.siteLogo || initialSiteLogo;

  return (
    <nav className="fixed top-0 sm:top-6 left-0 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:w-[98%] lg:w-[95%] max-w-7xl flex flex-col items-end gap-3 px-4 sm:px-0">
      {/* Main Navbar Frame */}
      <div className="w-full bg-black/60 backdrop-blur-xl border-b sm:border border-white/10 sm:rounded-3xl px-6 py-4 flex items-center justify-between shadow-2xl">
        <Link href="/" className="flex items-center gap-3 text-xl md:text-2xl font-black text-white hover:text-red-500 transition-all hover:scale-105 tracking-tighter group">
          {siteLogo ? (
            <img 
              src={siteLogo} 
              alt="Logo" 
              className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full border border-white/20 group-hover:border-red-600/50 transition-colors" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          <span className="uppercase">{siteName}</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/home" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors relative group uppercase tracking-widest">
            หน้าหลัก
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>

          <div className="h-4 w-px bg-white/10"></div>

          {!user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                เข้าสู่ระบบ
              </Link>
              
              <Link 
                href="/register" 
                className="px-6 py-2.5 bg-red-700 text-white text-sm font-black rounded-full hover:bg-red-600 transition-all hover:shadow-[0_0_20px_rgba(230,0,0,0.3)] uppercase tracking-widest"
              >
                สมัครสมาชิก
              </Link>
            </div>
          ) : (
            <button 
              ref={avatarRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden hover:border-red-600 transition-all relative group"
            >
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Avatar"
                className="w-full h-full object-cover bg-zinc-900"
              />
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Desktop User Popup */}
      {isMenuOpen && user && (
        <div 
          ref={menuRef}
          className="hidden md:block w-64 bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-3 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="px-4 py-4 border-b border-white/5 mb-2">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Profile</p>
            <p className="text-sm font-black text-white truncate mt-1">
              {user.user_metadata?.username || user.email?.split('@')[0]}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
          </div>
          
          <div className="space-y-1">
            <Link 
              href="/account"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-2xl transition-all group"
            >
              จัดการบัญชี
            </Link>
            {isAdmin && (
              <Link 
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
              >
                ระบบหลังบ้าน
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-zinc-500 hover:text-red-500 transition-all text-left"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden w-full bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 space-y-6"
        >
          <div className="space-y-4">
            <Link 
              href="/home" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-black text-white uppercase"
            >
              หน้าหลัก
            </Link>
          </div>

          <div className="h-px bg-white/5"></div>

          {!user ? (
            <div className="flex flex-col gap-4">
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-4 text-zinc-400 font-bold uppercase"
              >
                เข้าสู่ระบบ
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-4 bg-red-700 text-white font-black rounded-2xl uppercase"
              >
                สมัครสมาชิก
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border border-white/10"
                />
                <div className="truncate">
                  <p className="text-sm font-black text-white truncate">
                    {user.user_metadata?.username || user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Link 
                  href="/account" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 px-6 bg-white/5 text-white font-bold rounded-2xl text-center"
                >
                  จัดการบัญชี
                </Link>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 px-6 bg-red-900/20 text-red-500 font-bold rounded-2xl text-center"
                  >
                    ระบบหลังบ้าน
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 px-6 text-zinc-500 font-bold text-center"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
