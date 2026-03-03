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
      if (!userId) throw new Error('User identification failed');

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

      setProfileMessage('โปรไฟล์อัปเดตเรียบร้อย');
    } catch (error: any) {
      setProfileMessage('Error: ' + error.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordMessage('รหัสผ่านยืนยันไม่ตรงกัน');
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
    } catch (error: any) {
      setPasswordMessage('Error: ' + error.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
            Account <span className="text-red-600">Settings</span>
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mt-3">
            Manage your digital identity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Profile Section */}
          <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Identity</h2>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Public Information</p>
              </div>
            </div>

            {profileMessage && (
              <div className={`mb-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${profileMessage.includes('สำเร็จ') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                {profileMessage}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleProfileSave}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Username</label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 transition-all font-bold text-sm tracking-wide"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 transition-all font-bold text-sm tracking-wide"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loadingProfile}
                  className="w-full bg-white text-black font-black py-5 rounded-2xl transition-all hover:bg-zinc-200 active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
                >
                  {loadingProfile ? 'Synchronizing...' : 'Update Identity'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/20 text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Security</h2>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Authentication Access</p>
              </div>
            </div>

            {passwordMessage && (
              <div className={`mb-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${passwordMessage.includes('สำเร็จ') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                {passwordMessage}
              </div>
            )}

            <form className="space-y-6" onSubmit={handlePasswordSave}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">New Password</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 transition-all font-bold text-sm tracking-wide"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Confirm New Password</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600/50 transition-all font-bold text-sm tracking-wide"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loadingPassword}
                  className="w-full bg-red-700 text-white font-black py-5 rounded-2xl transition-all hover:bg-red-600 hover:shadow-[0_0_40px_rgba(230,0,0,0.4)] active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
                >
                  {loadingPassword ? 'Encrypting...' : 'Update Security'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
