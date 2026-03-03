'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const getThaiErrorMessage = (error: any) => {
    const message = error.message || '';
    if (message.includes('Invalid login credentials')) return 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    if (message.includes('Email not confirmed')) return 'กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ';
    if (message.includes('Failed to fetch')) return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
    if (message.includes('User not found')) return 'ไม่พบชื่อผู้ใช้นี้ในระบบ';
    return message;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let email = identifier;
      if (identifier.toLowerCase() === 'admin') {
        email = 'admin@admin.com';
      } else if (!identifier.includes('@')) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();
        
        if (profileError || !profile) throw new Error('User not found');
        email = profile.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password,
      });

      if (error) throw error;
      
      setMessage('เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปที่หน้าหลัก...');
      setTimeout(() => router.push('/home'), 1500);
    } catch (error: any) {
      setMessage('เกิดข้อผิดพลาด: ' + getThaiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 sm:px-6">
      <div className="w-full max-w-md bg-zinc-950/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full -z-10"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/10 rounded-3xl mb-6 border border-red-600/20">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tighter uppercase">
            เข้าสู่<span className="text-red-600">ระบบ</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
            Welcome back to the elite
          </p>
        </div>

        {message && (
          <div className={`mb-8 p-5 rounded-2xl text-xs font-black uppercase tracking-widest text-center border ${message.includes('สำเร็จ') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Username / Email</label>
            <input 
              type="text" 
              placeholder="ENTER IDENTIFIER"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all placeholder:text-zinc-800 text-sm font-bold tracking-wide"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all placeholder:text-zinc-800 text-sm font-bold tracking-wide"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-5 rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-[0.2em] text-xs disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Authenticate'}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Don't have an account? {' '}
            <Link href="/register" className="text-red-500 hover:text-red-400 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
