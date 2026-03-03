'use client';

import { useEffect, useState } from 'react';
import { getAnnouncements } from '@/app/actions';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data.filter(a => a.is_active));
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || announcements.length === 0) return null;

  return (
    <div className="w-full bg-red-600/10 backdrop-blur-md border-y border-red-600/20 py-3 relative overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* First set of announcements */}
        {announcements.map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-8 text-sm font-bold text-white uppercase tracking-wide">
            <span className="text-xl">{item.emoji}</span>
            <span>{item.content}</span>
            <div className="w-2 h-2 bg-red-600 rounded-full ml-8 opacity-40"></div>
          </div>
        ))}
        {/* Duplicate set for seamless looping */}
        {announcements.map((item) => (
          <div key={`dup-${item.id}`} className="flex items-center gap-4 px-8 text-sm font-bold text-white uppercase tracking-wide">
            <span className="text-xl">{item.emoji}</span>
            <span>{item.content}</span>
            <div className="w-2 h-2 bg-red-600 rounded-full ml-8 opacity-40"></div>
          </div>
        ))}
      </div>
      
      {/* CSS for marquee animation */}
      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
