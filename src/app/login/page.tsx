'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border border-red-900/30 rounded-3xl p-10 box-red-glow">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2">เข้าสู่<span className="text-red-600">ระบบ</span></h1>
          <p className="text-zinc-500 text-sm">ยินดีต้อนรับกลับมา! กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ชื่อผู้ใช้ / อีเมล</label>
            <input 
              type="text" 
              placeholder="Username or Email"
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">รหัสผ่าน</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            เข้าสู่ระบบ
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
