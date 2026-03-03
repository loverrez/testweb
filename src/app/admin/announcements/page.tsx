'use client';

import { useState, useEffect } from 'react';
import { getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/app/actions';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [emoji, setEmoji] = useState('📢');
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
      await addAnnouncement(emoji, content);
      setContent('');
      setEmoji('📢');
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
        <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">หมวดหมู่: จัดการประกาศ</h2>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
          ตั้งค่า<span className="text-red-600">ข้อความประกาศ</span>
        </h1>
      </div>

      {message && (
        <div className={`mb-8 p-5 rounded-2xl text-[10px] font-black uppercase text-center border ${message.includes('สำเร็จ') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          {message}
        </div>
      )}

      {/* Add New Announcement */}
      <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
        <h3 className="text-lg font-black text-white uppercase mb-6">เพิ่มประกาศใหม่</h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-24">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-2 block">Emoji</label>
            <input 
              type="text" 
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-white text-center focus:outline-none focus:border-red-600/50"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-2 block">ข้อความประกาศ</label>
            <input 
              type="text" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="ใส่ข้อความที่ต้องการประกาศที่นี่..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 font-bold text-sm"
            />
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-red-700 hover:bg-red-600 text-white font-black px-10 py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-all disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'เพิ่มประกาศ'}
            </button>
          </div>
        </form>
      </div>

      {/* List Announcements */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white uppercase ml-2">รายการประกาศทั้งหมด</h3>
        <div className="grid grid-cols-1 gap-4">
          {announcements.map((item) => (
            <div key={item.id} className={`flex items-center justify-between p-6 bg-zinc-950/40 border ${item.is_active ? 'border-white/5' : 'border-white/5 opacity-40'} rounded-3xl transition-all`}>
              <div className="flex items-center gap-6">
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <p className="text-white font-bold">{item.content}</p>
                  <p className="text-[10px] text-zinc-500 uppercase mt-1">Status: {item.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleToggleActive(item.id, item.is_active, item.emoji, item.content)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${item.is_active ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-green-900/20 text-green-500 hover:bg-green-900/40'}`}
                >
                  {item.is_active ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'}
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-2 bg-red-900/20 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-900/40 transition-all"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <div className="text-center py-20 bg-zinc-950/20 border border-dashed border-white/5 rounded-[2.5rem]">
              <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">ไม่มีประกาศในขณะนี้</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
