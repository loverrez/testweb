'use client';

import { useState, useEffect } from 'react';
import { getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/app/actions';
import * as LucideIcons from 'lucide-react';

const ICON_LIST = [
  'Bell', 'Megaphone', 'Info', 'AlertCircle', 'Star', 'Zap', 'ShieldCheck', 'Trophy', 'Crown', 'Flame'
];

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedIcon, setSelectedIcon] = useState('Bell');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getAnnouncements();
    setAnnouncements(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await addAnnouncement(selectedIcon, content);
      setContent('');
      setMessage('เพิ่มประกาศสำเร็จ');
      fetchData();
    } catch (error: any) {
      setMessage('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean, currentEmoji: string, currentContent: string) => {
    try {
      await updateAnnouncement(id, currentEmoji, currentContent, !currentActive);
      fetchData();
    } catch (error: any) {
      setMessage('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบประกาศนี้?')) return;
    try {
      await deleteAnnouncement(id);
      setMessage('ลบประกาศสำเร็จ');
      fetchData();
    } catch (error: any) {
      setMessage('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Terminal: Announcements</h2>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
          System <span className="text-red-600">Broadcasts</span>
        </h1>
      </div>

      {message && (
        <div className={`mb-8 p-5 rounded-2xl text-[10px] font-black uppercase text-center border ${message.includes('สำเร็จ') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          {message}
        </div>
      )}

      {/* Add New Announcement */}
      <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[60px] rounded-full -z-10"></div>
        
        <h3 className="text-xl font-black text-white uppercase mb-8 flex items-center gap-3">
          <div className="w-8 h-1 bg-red-600 rounded-full"></div>
          Initialize Broadcast
        </h3>

        <form onSubmit={handleAdd} className="space-y-8">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-4 block tracking-widest">Select Visual Identifier (Icon)</label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {ICON_LIST.map((iconName) => {
                const Icon = (LucideIcons as any)[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-center ${
                      selectedIcon === iconName 
                      ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(230,0,0,0.3)] scale-110' 
                      : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 block tracking-widest">Broadcast Message Content</label>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="ENTER SYSTEM MESSAGE..."
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-red-600/50 focus:bg-white/10 font-bold text-sm tracking-wide transition-all"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-white text-black font-black px-12 py-5 rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-xl"
              >
                {loading ? 'Deploying...' : 'Deploy'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* List Announcements */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white uppercase ml-2 flex items-center gap-3">
          <div className="w-8 h-1 bg-zinc-800 rounded-full"></div>
          Active Streams
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {announcements.map((item) => {
            const Icon = (LucideIcons as any)[item.emoji] || LucideIcons.Bell;
            return (
              <div key={item.id} className={`group flex flex-col md:flex-row items-center justify-between p-6 md:p-8 bg-zinc-950/40 border ${item.is_active ? 'border-white/5' : 'border-white/5 opacity-40'} rounded-[2rem] transition-all hover:bg-zinc-950/60`}>
                <div className="flex items-center gap-8 w-full">
                  <div className={`p-4 rounded-2xl border ${item.is_active ? 'bg-red-600/10 border-red-600/20 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-lg uppercase tracking-tight">{item.content}</p>
                    <div className="flex gap-4 mt-2">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Type: Broadcast</p>
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Status: {item.is_active ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto">
                  <button 
                    onClick={() => handleToggleActive(item.id, item.is_active, item.emoji, item.content)}
                    className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${item.is_active ? 'bg-zinc-900 text-zinc-500 hover:text-white' : 'bg-green-600 text-white shadow-lg shadow-green-900/20'}`}
                  >
                    {item.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 md:flex-none px-8 py-3 bg-red-900/10 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                  >
                    Terminate
                  </button>
                </div>
              </div>
            );
          })}
          {announcements.length === 0 && (
            <div className="text-center py-24 bg-zinc-950/20 border border-dashed border-white/5 rounded-[3rem]">
              <p className="text-zinc-600 font-black uppercase text-xs tracking-[0.4em]">Zero Active Broadcasts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
