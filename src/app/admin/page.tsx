'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // 1. Fetch total users
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // 2. Fetch admin count
    const { count: adminCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    setStats({
      users: userCount || 0,
      admins: adminCount || 0,
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stat Cards */}
        <div className="p-8 bg-zinc-950/80 border border-zinc-900 rounded-3xl box-red-glow transition-all hover:scale-[1.02]">
          <h3 className="text-zinc-500 text-sm font-black uppercase tracking-widest mb-4">จำนวนผู้ใช้งานทั้งหมด</h3>
          <p className="text-6xl font-black text-white">{stats.users} <span className="text-red-600">คน</span></p>
        </div>

        <div className="p-8 bg-zinc-950/80 border border-zinc-900 rounded-3xl box-red-glow transition-all hover:scale-[1.02]">
          <h3 className="text-zinc-500 text-sm font-black uppercase tracking-widest mb-4">จำนวนแอดมิน</h3>
          <p className="text-6xl font-black text-white">{stats.admins} <span className="text-red-600">คน</span></p>
        </div>
      </div>

      <div className="p-8 bg-zinc-950/80 border border-zinc-900 rounded-3xl">
        <h3 className="text-xl font-black text-white mb-6 underline decoration-red-600 decoration-4">สถิติการใช้งานระบบ</h3>
        <p className="text-zinc-500 font-medium">
          ยินดีต้อนรับสู่ระบบหลังบ้าน นี่คือภาพรวมเบื้องต้นของเว็บไซต์คุณ คุณสามารถจัดการข้อมูลต่างๆ ได้จากเมนูทางด้านซ้าย
        </p>
      </div>
    </div>
  );
}
