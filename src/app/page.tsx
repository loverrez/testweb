import { supabase } from '@/lib/supabase';

export default async function LandingPage() {
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  const siteName = data?.site_name || "NEXTWEB";
  const siteLogo = data?.site_logo;
  const siteDescription = data?.site_description || "เว็บไซต์สมัยใหม่ที่มาพร้อมด้วยเทคโนโลยีล่าสุด พร้อมสร้างประสบการณ์ที่ยอดเยี่ยมให้กับผู้ใช้งาน";

  return (
    <div className="min-h-[90vh] flex items-start justify-center px-2 pt-6">
      <div className="relative w-full h-[85vh] max-w-[98vw]">
        {/* Empty Frame - Transparent background, can see through to website background */}
        <div className="relative w-full h-full bg-transparent border border-white/20 rounded-3xl p-8">
          {/* Site Name and Description */}
          <div className="flex flex-col items-start pl-4">
            <div className="flex items-center gap-3 mb-4">
              {siteLogo ? (
                <img 
                  src={siteLogo} 
                  alt="Logo" 
                  className="w-12 h-12 object-cover rounded-full border border-white/20" 
                />
              ) : null}
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                {siteName}
              </h1>
            </div>
            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl leading-relaxed">
              {siteDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
