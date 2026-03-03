'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
    fetchSettings();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.user_metadata?.role !== 'admin') {
      router.push('/');
    } else {
      setIsAdmin(true);
    }
  };

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
          id: 1, // Fixed ID for single settings row
          site_name: siteName,
          site_logo: siteLogo,
          site_description: siteDescription,
          updated_at: new Date()
        });

      if (error) throw error;
      setMessage('บันทึกการตั้งค่าสำเร็จ! (ข้อมูล SEO จะอัปเดตในการเข้าชมครั้งถัดไป)');
    } catch (error: any) {
      setMessage('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">จัดการ<span className="text-red-600">เว็บไซต์</span></h1>
        <p className="text-zinc-500 mt-2">แก้ไขข้อมูลพื้นฐานของเว็บไซต์และ SEO</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${message.includes('สำเร็จ') ? 'bg-green-900/20 text-green-500 border-green-900/50' : 'bg-red-900/20 text-red-500 border-red-900/50'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Categories */}
        <div className="md:col-span-1 space-y-2">
          <div className="p-4 bg-red-900/10 border border-red-900/30 rounded-xl">
            <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-4">หมวดหมู่: จัดการเว็บไซต์</p>
            <button className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-900/20">
              หัวข้อ: ตั้งค่าเว็บไซต์
            </button>
          </div>
        </div>

        {/* Main Content Form */}
        <form onSubmit={handleSave} className="md:col-span-2 space-y-6 bg-zinc-950/50 border border-zinc-900 p-8 rounded-3xl box-red-glow">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ชื่อเว็บไซต์ (Site Name)</label>
            <input 
              type="text" 
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="NextWeb - Black & Red Edition"
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">โลโก้เว็บไซต์ (URL รูปภาพ)</label>
            <input 
              type="text" 
              value={siteLogo}
              onChange={(e) => setSiteLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">รายละเอียดเว็บไซต์ (Description / SEO)</label>
            <textarea 
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={4}
              placeholder="อธิบายเว็บไซต์ของคุณเพื่อแสดงผลเวลาแชร์ลิงค์ลง Facebook, Discord..."
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all resize-none"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
