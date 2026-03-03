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
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-6 relative overflow-hidden font-prompt">
      {/* Premium Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/5 via-transparent to-transparent -z-10"></div>
      
      <div className="flex flex-col items-center gap-12 md:gap-16 animate-in fade-in duration-1000 max-w-4xl">
        
        {/* Language Selection Section (Deity Style) */}
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-white text-lg md:text-xl font-black uppercase tracking-[0.3em]">Select Language</h2>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">เลือกภาษาของเว็บ</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/home" 
              className="group relative w-64 px-8 py-4 bg-zinc-950/50 border border-white/5 rounded-2xl hover:border-red-600/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-white font-black uppercase tracking-widest text-sm">English</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter group-hover:text-red-500/70 transition-colors">United States</span>
              </div>
            </Link>

            <Link 
              href="/home" 
              className="group relative w-64 px-8 py-4 bg-zinc-950/50 border border-white/5 rounded-2xl hover:border-red-600/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-white font-black uppercase tracking-widest text-sm">ภาษาไทย</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter group-hover:text-red-500/70 transition-colors">ประเทศไทย</span>
              </div>
            </Link>
          </div>

          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">
            You can change the language at any time • คุณสามารถเปลี่ยนภาษาได้ทุกเมื่อ
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Brand Section */}
        <div className="flex flex-col items-center gap-8">
          {siteLogo && (
            <div className="relative">
              <div className="absolute -inset-4 bg-red-600/20 blur-2xl rounded-full opacity-50"></div>
              <img 
                src={siteLogo} 
                alt="Logo" 
                className="relative w-24 h-24 md:w-32 md:h-32 object-cover rounded-3xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
              {siteName}
            </h1>
            <div className="h-1 w-12 bg-red-600 mx-auto rounded-full"></div>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Powered by Elite Technology</span>
      </div>
    </div>
  );
}
