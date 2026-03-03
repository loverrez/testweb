'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    turnstile: any;
  }
}

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
    if (message.includes('Failed to fetch')) return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (กรุณาตรวจสอบการตั้งค่า API หรืออินเทอร์เน็ต)';
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
      // 1. Register with metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            role: 'user', // Default role
          }
        }
      });

      if (signUpError) throw signUpError;
      
      // 2. Handle success/auto-login
      if (signUpData.session) {
        setMessage('สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage('สมัครสมาชิกสำเร็จ! ระบบกำลังนำคุณไปที่หน้าเข้าสู่ระบบ...');
        // Try to sign in immediately for auto-login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!signInError) {
          setTimeout(() => router.push('/'), 1500);
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
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-12">
      <div className="w-full max-w-lg bg-zinc-950/80 backdrop-blur-xl border border-red-900/30 rounded-3xl p-10 box-red-glow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">สมัคร<span className="text-red-600">สมาชิก</span></h1>
          <p className="text-zinc-500 text-sm">สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งานเว็บไซต์ของเรา</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold text-center ${message.includes('สำเร็จ') ? 'bg-green-900/20 text-green-500 border border-green-900/50' : 'bg-red-900/20 text-red-500 border border-red-900/50'}`}>
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ชื่อผู้ใช้ (Username)</label>
              <input 
                type="text" 
                placeholder="User123"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">อีเมล (Email)</label>
              <input 
                type="email" 
                placeholder="test@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ยืนยันรหัสผ่าน (Verify Password)</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="flex justify-center py-2">
            <div 
              className="cf-turnstile" 
              data-sitekey="1x00000000000000000000AA"
              data-theme="dark"
            ></div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? 'กำลังดำเนินการ...' : 'สร้างบัญชีผู้ใช้'}
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
