import { supabase } from '@/lib/supabase';

export default async function LandingPage() {
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  const siteName = data?.site_name || "DEITY HUB";
  const siteLogo = data?.site_logo;
  const siteDescription = data?.site_description || "ค่ายสคริปต์ Roblox ที่มีฟังก์ชั่นโปรหลากหลายที่ตอบโจทย์ กับร้านรับฟาร์มต่างๆ มากมายมีครบหมด จบในที่เดียว อัพเดทโปรฟรีไม่ต้องซื้อใหม่เพิ่ม ซัพพอร์ตลูกค้าทุกวัน และรองรับ โปรแกรมรันฟรี";

  return (
    <div className="min-h-[90vh] flex items-start justify-start px-4 md:px-8 lg:px-16 pt-24">
      <div className="relative w-full max-w-4xl">
        <div className="flex flex-col items-start text-left">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-2">
            {siteName}
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-red-500 mb-4">
            PREMIUM SCRIPT SUPPORT 24/7
          </h2>
          <p className="text-base md:text-lg text-zinc-300 max-w-2xl leading-relaxed">
            {siteDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
