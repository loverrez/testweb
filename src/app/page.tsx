export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <h1 className="relative text-7xl md:text-9xl font-black text-white tracking-tighter red-glow">
          ทดสอบ<span className="text-red-600">.</span>
        </h1>
      </div>
      
      <p className="mt-8 text-zinc-400 max-w-md text-lg font-medium leading-relaxed">
        ยินดีต้อนรับสู่โปรเจกต์ Next.js รูปแบบใหม่ 
        <br />
        <span className="text-red-500 font-bold">Black & Red 3D Edition</span>
      </p>

      <div className="mt-12 flex gap-4">
        <div className="w-12 h-12 rounded-full border border-red-900/50 bg-zinc-950 flex items-center justify-center box-red-glow animate-bounce">
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
