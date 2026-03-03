'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const [siteName, setSiteName] = useState('NEXTWEB');
  const [siteLogo, setSiteLogo] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('site_name, site_logo')
        .single();
      
      if (data) {
        if (data.site_name) setSiteName(data.site_name);
        if (data.site_logo) setSiteLogo(data.site_logo);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-red-600/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-900/10 blur-[150px] rounded-full -z-10"></div>
      
      <div className="flex flex-col items-center gap-6 md:gap-10 animate-in fade-in zoom-in duration-1000 max-w-5xl">
        {/* Logo Section with Premium Glow */}
        {siteLogo && (
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-red-900 to-red-600 rounded-full blur-md opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-500 animate-spin-slow"></div>
            <img 
              src={siteLogo} 
              alt="Logo" 
              className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 object-cover rounded-full border-2 border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        {/* Site Name with Enhanced Typography */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            {siteName}
          </h1>
          <div className="h-1.5 w-24 md:w-40 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Action Button - Responsive & Premium */}
        <div className="mt-8 md:mt-14 w-full sm:w-auto">
          <Link 
            href="/home" 
            className="group relative inline-flex items-center justify-center px-8 py-4 md:px-14 md:py-6 font-black text-white transition-all duration-300 bg-red-700 rounded-full sm:w-auto hover:bg-red-600 hover:shadow-[0_0_60px_rgba(230,0,0,0.4)] active:scale-[0.98] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3 uppercase text-sm md:text-lg">
              เริ่มต้นใช้งานเลย!
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500"></div>
          </Link>
        </div>
      </div>

      {/* Footer Info (Optional for Landing) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 text-[10px] uppercase tracking-[0.5em] font-bold text-white whitespace-nowrap hidden sm:block">
        Crafted with Excellence • 2026
      </div>
    </div>
  );
}
