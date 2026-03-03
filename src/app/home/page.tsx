'use client';

import AnnouncementBar from '@/components/AnnouncementBar';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-[60vh] text-center w-full">
      {/* Top Announcement Bar */}
      <div className="w-full mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <AnnouncementBar />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4">
        {/* You can add more featured content here in the future */}
        <div className="relative inline-block group">
          <div className="absolute -inset-1 bg-red-600/20 blur-xl opacity-40 group-hover:opacity-100 transition duration-1000"></div>
          <h2 className="relative text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter">
            XENON <span className="text-red-600">HUB</span>
          </h2>
        </div>
        <p className="mt-6 text-zinc-500 font-bold uppercase text-xs md:text-sm tracking-widest max-w-xl mx-auto opacity-70">
          The most reliable and advanced scripting service in the market.
        </p>
      </div>
    </div>
  );
}
