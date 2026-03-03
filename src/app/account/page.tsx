'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);
      setEmail(user.email || '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profile?.username) {
        setUsername(profile.username);
      }
    };

    init();
  }, [router]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMessage('');

    try {
      if (!userId) {
        throw new Error('ไม่พบผู้ใช้งาน');
      }

      const { error: authError } = await supabase.auth.updateUser({
        email,
        data: { username },
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email,
          username,
          updated_at: new Date(),
        });

      if (profileError) throw profileError;

      setProfileMessage('บันทึกโปรไฟล์สำเร็จ');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
      setProfileMessage('เกิดข้อผิดพลาด: ' + message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordMessage('รหัสผ่านไม่ตรงกัน');
      setLoadingPassword(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('เปลี่ยนรหัสผ่านสำเร็จ');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
      setPasswordMessage('เกิดข้อผิดพลาด: ' + message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white">จัดการ<span className="text-red-600">ผู้ใช้</span></h1>
          <p className="text-zinc-500 text-sm mt-2">อัปเดตข้อมูลโปรไฟล์และรหัสผ่านของคุณ</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-zinc-950/80 border border-red-900/30 rounded-3xl p-8 box-red-glow">
            <div className="mb-6">
              <h2 className="text-xl font-black text-white">โปรไฟล์ผู้ใช้</h2>
              <p className="text-zinc-500 text-sm mt-1">แก้ไขข้อมูลพื้นฐานของบัญชี</p>
            </div>

            {profileMessage && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-bold text-center ${profileMessage.includes('สำเร็จ') ? 'bg-green-900/20 text-green-500 border border-green-900/50' : 'bg-red-900/20 text-red-500 border border-red-900/50'}`}>
                {profileMessage}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleProfileSave}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ชื่อผู้ใช้</label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="User123"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">อีเมล</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-800"
                />
              </div>

              <button 
                type="submit"
                disabled={loadingProfile}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {loadingProfile ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์'}
              </button>
            </form>
          </div>

          <div className="bg-zinc-950/80 border border-red-900/30 rounded-3xl p-8 box-red-glow">
            <div className="mb-6">
              <h2 className="text-xl font-black text-white">เปลี่ยนรหัสผ่าน</h2>
              <p className="text-zinc-500 text-sm mt-1">ตั้งค่ารหัสผ่านใหม่เพื่อความปลอดภัย</p>
            </div>

            {passwordMessage && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-bold text-center ${passwordMessage.includes('สำเร็จ') ? 'bg-green-900/20 text-green-500 border border-green-900/50' : 'bg-red-900/20 text-red-500 border border-red-900/50'}`}>
                {passwordMessage}
              </div>
            )}

            <form className="space-y-5" onSubmit={handlePasswordSave}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">รหัสผ่านใหม่</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">ยืนยันรหัสผ่านใหม่</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-800"
                />
              </div>

              <button 
                type="submit"
                disabled={loadingPassword}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {loadingPassword ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
