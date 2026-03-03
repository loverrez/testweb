import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="bg-black/60 backdrop-blur-md border border-red-900/50 rounded-2xl px-8 py-4 flex items-center justify-between box-red-glow">
        <Link href="/" className="text-2xl font-black text-red-600 hover:text-red-500 transition-all hover:scale-105 tracking-tighter">
          NEXT<span className="text-white">WEB</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-red-500 transition-colors relative group">
            หน้าแรก
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>
          <div className="h-4 w-px bg-zinc-800"></div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-5 py-2 text-sm font-semibold text-white hover:text-red-500 transition-all"
            >
              เข้าสู่ระบบ
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(230,0,0,0.5)] active:scale-95"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
