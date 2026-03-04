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
        {/* Empty Frame - Transparent background, can see through to website background */}
        <div className="relative w-full h-full bg-transparent border border-white/20 rounded-3xl">
          <div className="absolute top-1/2 -translate-y-1/2 right-[35%] max-w-[60ch]">
            <h1 className="text-4xl md:text-5xl font-black text-red-600 tracking-tight">
              {siteName}
            </h1>
            <p className="mt-4 text-lg md:text-xl font-medium text-white">
              {siteDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
