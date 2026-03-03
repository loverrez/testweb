'use client';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          ยินดีต้อนรับสู่หน้าเว็บทดสอบ Next.js! 🚀
        </h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-lg mb-4">
            หน้านี้คือหน้าเว็บที่สร้างขึ้นเพื่อทดสอบการรันและการเชื่อมต่อโดเมน
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>สร้างด้วย Next.js 15+</li>
            <li>ใช้ Tailwind CSS สำหรับตกแต่ง</li>
            <li>รองรับ Dark Mode</li>
          </ul>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button 
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={() => alert('สวัสดีครับ! ยินดีที่ได้รู้จัก')}
          >
            ลองกดปุ่มนี้ดู
          </button>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-sm text-zinc-500">
          loverr_ezx
        </p>
      </footer>
    </div>
  );
}
