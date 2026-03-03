'use client';

import { useEffect, useState } from 'react';
import { getAnnouncements } from '@/app/actions';
import * as LucideIcons from 'lucide-react';

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

  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Bell;
    return <Icon className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="w-full bg-zinc-950/50 backdrop-blur-xl border border-white/10 rounded-2xl py-4 relative overflow-hidden shadow-[0_0_30px_rgba(230,0,0,0.1)] group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <div className="flex whitespace-nowrap animate-marquee">
          {/* First set */}
          {announcements.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-10">
              <div className="p-2 bg-red-600/10 rounded-lg border border-red-600/20">
                {renderIcon(item.emoji)}
              </div>
              <span className="text-sm font-black text-white uppercase tracking-wider">
                {item.content}
              </span>
              <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full ml-10"></div>
            </div>
          ))}
          {/* Duplicate set for loop */}
          {announcements.map((item) => (
            <div key={`dup-${item.id}`} className="flex items-center gap-4 px-10">
              <div className="p-2 bg-red-600/10 rounded-lg border border-red-600/20">
                {renderIcon(item.emoji)}
              </div>
              <span className="text-sm font-black text-white uppercase tracking-wider">
                {item.content}
              </span>
              <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full ml-10"></div>
            </div>
          ))}
        </div>
        
        <style jsx>{`
          .animate-marquee {
            animation: marquee 40s linear infinite;
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
    </div>
  );
}
