'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const [siteName, setSiteName] = useState('SWITCH HUB');
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
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-red-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-900/10 blur-[150px] rounded-full -z-10" />

      <div className="flex flex-col items-center gap-8 md:gap-10 max-w-4xl">
        {siteLogo && (
          <div className="relative">
            <div className="absolute -inset-6 bg-red-600/30 blur-3xl rounded-full opacity-80" />
            <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full bg-black border border-red-700/60 flex items-center justify-center shadow-[0_0_80px_rgba(230,0,0,0.6)]">
              <img
                src={siteLogo}
                alt="Logo"
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight uppercase">
            {siteName}
          </h1>
          <div className="h-1 w-24 md:w-40 bg-red-600 mx-auto rounded-full" />
        </div>

        <div className="mt-4">
          <Link
            href="/home"
            className="inline-flex items-center justify-center px-10 py-4 md:px-14 md:py-5 bg-red-700 hover:bg-red-600 text-white font-black rounded-full text-sm md:text-lg tracking-widest transition-all shadow-[0_0_40px_rgba(230,0,0,0.5)] active:scale-95"
          >
            เริ่มต้นใช้งานเลย!
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 text-[10px] uppercase tracking-[0.5em] font-bold text-white whitespace-nowrap">
        Crafted with Excellence • 2026
      </div>
    </div>
  );
}
