'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { revalidateSiteSettings } from '@/app/actions';

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    
    if (data) {
      setSiteName(data.site_name || '');
      setSiteLogo(data.site_logo || '');
      setSiteDescription(data.site_description || '');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          id: 1, 
          site_name: siteName,
          site_logo: siteLogo,
          site_description: siteDescription,
          updated_at: new Date()
        });

      if (error) throw error;

      // Trigger server-side revalidation
      await revalidateSiteSettings();
      // Refresh client-side route cache
      router.refresh();

      setMessage('บันทึกการตั้งค่าสำเร็จ! ข้อมูลอัปเดตเรียบร้อยแล้ว');
    } catch (error: any) {
      setMessage('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em] mb-2">หมวดหมู่: จัดการเว็บไซต์</h2>
        <h1 className="text-3xl font-black text-white">หัวข้อ: <span className="text-red-600">ตั้งค่าเว็บไซต์</span></h1>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${message.includes('สำเร็จ') ? 'bg-green-900/20 text-green-500 border-green-900/50' : 'bg-red-900/20 text-red-500 border-red-900/50'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl bg-zinc-950 border border-zinc-900 p-10 rounded-3xl box-red-glow">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ชื่อเว็บไซต์ (Site Name)</label>
          <input 
            type="text" 
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="NextWeb - Black & Red Edition"
            className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">โลโก้เว็บไซต์ (URL รูปภาพ)</label>
          <input 
            type="text" 
            value={siteLogo}
            onChange={(e) => setSiteLogo(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">รายละเอียดเว็บไซต์ (Description / SEO)</label>
          <textarea 
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            rows={5}
            placeholder="อธิบายเว็บไซต์ของคุณเพื่อแสดงผลเวลาแชร์ลิงค์ลง Facebook, Discord..."
            className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all resize-none placeholder:text-zinc-800"
          />
        </div>

        <div className="pt-6">
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-5 rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าทั้งหมด'}
          </button>
        </div>
      </form>
    </div>
  );
}
