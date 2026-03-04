import { supabase } from '@/lib/supabase';

export default async function LandingPage() {
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  const siteName = data?.site_name || 'NextWeb';
  const siteDesc = data?.site_description || 'Modern web with Next.js';

  return (
    <div className="min-h-[90vh] flex items-start justify-start px-2 pt-6">
      <div className="relative w-full h-[85vh] max-w-[98vw]">
        <div className="relative w-full h-full bg-transparent border border-white/20 rounded-3xl">
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl px-8 py-10 text-center">
              <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Select Language</h2>
              <h1 className="mt-2 text-3xl md:text-4xl font-black text-white tracking-tight">{siteName}</h1>
              <p className="mt-1 text-sm text-zinc-400">{siteDesc}</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <a href="/home?lang=en" className="inline-flex items-center justify-center rounded-2xl px-6 py-4 font-bold bg-white text-black hover:bg-zinc-200 transition-colors">English</a>
                <a href="/home?lang=th" className="inline-flex items-center justify-center rounded-2xl px-6 py-4 font-bold bg-red-600 text-white hover:bg-red-500 transition-colors">ไทย</a>
              </div>
              <p className="mt-6 text-xs font-bold text-zinc-500 uppercase">You can change the language at any time</p>
              <p className="mt-1 text-xs font-bold text-zinc-500 uppercase">คุณสามารถเปลี่ยนภาษาได้ทุกเมื่อ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
