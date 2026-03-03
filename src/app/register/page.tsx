'use client';

import Link from 'next/link';
import { useEffect } from 'react';

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function RegisterPage() {
  useEffect(() => {
    // Load Turnstile script if it's not already there
    const script = document.createElement('script');
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-12">
      <div className="w-full max-w-lg bg-zinc-950/80 backdrop-blur-xl border border-red-900/30 rounded-3xl p-10 box-red-glow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">สมัคร<span className="text-red-600">สมาชิก</span></h1>
          <p className="text-zinc-500 text-sm">สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งานเว็บไซต์ของเรา</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ชื่อผู้ใช้ (Username)</label>
              <input 
                type="text" 
                placeholder="User123"
                className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">อีเมล (Email)</label>
              <input 
                type="email" 
                placeholder="test@example.com"
                className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ยืนยันรหัสผ่าน (Verify Password)</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
            />
          </div>

          {/* Cloudflare Turnstile */}
          <div className="flex justify-center py-2">
            <div 
              className="cf-turnstile" 
              data-sitekey="1x00000000000000000000AA" // Test Sitekey from Cloudflare
              data-theme="dark"
            ></div>
          </div>

          <button 
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            สร้างบัญชีผู้ใช้
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            มีบัญชีอยู่แล้ว? {' '}
            <Link href="/login" className="text-red-500 font-bold hover:underline">
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
