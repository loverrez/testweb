'use client';

import AnnouncementBar from '@/components/AnnouncementBar';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-[60vh] text-center w-full">
      {/* Top Announcement Bar */}
      <div className="w-full animate-in fade-in slide-in-from-top-4 duration-700">
        <AnnouncementBar />
      </div>
    </div>
  );
}
