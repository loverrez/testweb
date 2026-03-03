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
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative">
      {/* Glow effect in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/20 blur-[120px] rounded-full -z-10"></div>
      
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-1000">
        {/* Logo Section */}
        {siteLogo && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
            <img 
              src={siteLogo} 
              alt="Logo" 
              className="relative w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border-4 border-red-600/50 box-red-glow"
            />
          </div>
        )}

        {/* Site Name */}
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter red-glow uppercase">
          {siteName}
        </h1>

        {/* Action Button */}
        <div className="mt-10">
          <Link 
            href="/home" 
            className="px-10 py-5 bg-red-700 hover:bg-red-600 text-white font-black rounded-2xl transition-all hover:scale-110 hover:shadow-[0_0_50px_rgba(230,0,0,0.5)] active:scale-[0.98] uppercase tracking-[0.2em] text-lg border border-red-500/50"
          >
            เริ่มต้นใช้งานเลย!
          </Link>
        </div>
      </div>
    </div>
  );
}
