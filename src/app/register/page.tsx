'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const getThaiErrorMessage = (error: any) => {
    const message = error.message || '';
    if (message.includes('User already registered')) return 'อีเมลนี้ถูกใช้งานไปแล้ว';
    if (message.includes('Password is too short')) return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    if (message.includes('Failed to fetch')) return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
    if (message.includes('unique constraint "profiles_username_key"')) return 'ชื่อผู้ใช้นี้ถูกใช้งานไปแล้ว';
    return message;
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== verifyPassword) {
      setMessage('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      setLoading(false);
      return;
    }

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            role: 'user',
          }
        }
      });

      if (signUpError) throw signUpError;
      
      if (signUpData.session) {
        setMessage('สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...');
        setTimeout(() => router.push('/home'), 1500);
      } else {
        setMessage('สมัครสมาชิกสำเร็จ! ระบบกำลังนำคุณไปที่หน้าเข้าสู่ระบบ...');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!signInError) {
          setTimeout(() => router.push('/home'), 1500);
        } else {
          setTimeout(() => router.push('/login'), 2000);
        }
      }
    } catch (error: any) {
      setMessage('เกิดข้อผิดพลาด: ' + getThaiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 sm:px-6 py-12 md:py-20">
      <div className="w-full max-w-xl bg-zinc-950/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-600/10 blur-[80px] rounded-full -z-10"></div>
        
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-3xl mb-6 border border-white/10">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter uppercase">
            สร้าง<span className="text-red-600">บัญชี</span>
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm font-medium uppercase tracking-[0.3em]">
            Join the next generation
          </p>
        </div>

        {message && (
          <div className={`mb-10 p-5 rounded-2xl text-xs font-black uppercase text-center border ${message.includes('สำเร็จ') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Username</label>
              <input 
                type="text" 
                placeholder="USERID"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all placeholder:text-zinc-800 text-sm font-bold tracking-wide"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <input 
                type="email" 
                placeholder="NAME@DOMAIN.COM"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all placeholder:text-zinc-800 text-sm font-bold tracking-wide"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Confirm</label>
              <input 
                type="password" 
                placeholder="••••••••"
                required
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all placeholder:text-zinc-800 text-sm font-bold tracking-wide"
              />
            </div>
          </div>

          <div className="flex justify-center py-4">
            <div 
              className="cf-turnstile" 
              data-sitekey="1x00000000000000000000AA"
              data-theme="dark"
            ></div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-5 rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-[0.2em] text-xs disabled:opacity-50"
            >
              {loading ? 'Deploying Account...' : 'Initialize Membership'}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Already a member? {' '}
            <Link href="/login" className="text-red-500 hover:text-red-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
