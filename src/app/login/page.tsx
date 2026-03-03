'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let email = identifier;

      // Special handling for Admin (admin/admin)
      if (identifier === 'admin' && password === 'admin') {
        // We will try to sign in with a fixed admin email if it exists
        // or redirect to a mock state if you just want to test.
        // For a real system, we'll use 'admin@admin.com' as the internal email for the 'admin' username.
        email = 'admin@admin.com'; 
      } else if (!identifier.includes('@')) {
        // Standard username lookup
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();
        
        if (profileError || !profile) {
          throw new Error('ไม่พบชื่อผู้ใช้นี้ในระบบ กรุณาตรวจสอบอีกครั้งหรือใช้อีเมลในการเข้าสู่ระบบ');
        }
        
        email = profile.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password,
      });

      if (error) throw error;
      
      setMessage('เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปที่หน้าหลัก...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error: any) {
      let errorMsg = error.message;
      if (errorMsg === 'Invalid login credentials') {
        errorMsg = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      }
      setMessage('เกิดข้อผิดพลาด: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border border-red-900/30 rounded-3xl p-10 box-red-glow">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2">เข้าสู่<span className="text-red-600">ระบบ</span></h1>
          <p className="text-zinc-500 text-sm">ยินดีต้อนรับกลับมา! กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold text-center ${message.includes('สำเร็จ') ? 'bg-green-900/20 text-green-500 border border-green-900/50' : 'bg-red-900/20 text-red-500 border border-red-900/50'}`}>
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ชื่อผู้ใช้ หรือ อีเมล</label>
            <input 
              type="text" 
              placeholder="admin / Username / Email"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">รหัสผ่าน</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            ยังไม่มีบัญชี? {' '}
            <Link href="/register" className="text-red-500 font-bold hover:underline">
              สมัครสมาชิกเลย
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
