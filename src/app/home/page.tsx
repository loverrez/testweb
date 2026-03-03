'use client';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
          ยินดีต้อนรับสู่ <span className="text-red-600">หน้าหลัก</span>
        </h2>
      </div>
    </div>
  );
}
