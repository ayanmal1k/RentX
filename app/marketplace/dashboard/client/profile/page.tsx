'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { updateUserProfile, UserProfile } from '@/lib/firestore-helpers';
import {
  UserCircle, Mail, MapPin, Globe, LayoutDashboard, ShoppingBag, 
  Heart, Menu, LogOut, Save, Camera, ShieldCheck, CreditCard, Bell, History
} from 'lucide-react';
import CustomModal from '@/components/rentx/CustomModal';

export default function ClientProfilePage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'confirm' | 'error';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/marketplace/auth');
  }, [authLoading, user]);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setBio(userProfile.bio || '');
      setCountry(userProfile.country || '');
      setCity(userProfile.city || '');
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        bio,
        country,
        city
      });
      setModalConfig({
        isOpen: true,
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.',
        type: 'info'
      });
    } catch (err) {
      console.error(err);
      setModalConfig({
        isOpen: true,
        title: 'Update Failed',
        message: 'Failed to update your profile. Please try again.',
        type: 'error'
      });
    }
    setSaving(false);
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/client' },
    { label: 'My Bookings', icon: ShoppingBag, href: '/marketplace/dashboard/client/bookings' },
    { label: 'Saved Services', icon: Heart, href: '/marketplace/dashboard/client/saved' },
    { label: 'History', icon: History, href: '/marketplace/dashboard/history' },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/client/profile', active: true },
  ];

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5">
          <Link href="/marketplace" className="flex items-center gap-3"><div className="w-8 h-8"><img src="/rentx-coin.png" alt="RENTX" className="w-full h-full object-contain" /></div><div className="font-bold text-lg tracking-widest text-gradient-brand">RENTX</div></Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Icon className="w-4 h-4" />{item.label}</Link>);
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 text-sm w-full transition-all"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400"><Menu className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">Profile Settings</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save Changes</>}
          </button>
        </header>

        <main className="p-6 max-w-4xl mx-auto w-full">
          <div className="space-y-8">
            {/* Header / Avatar */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 glass-card rounded-3xl border border-white/10">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                  <UserCircle className="w-16 h-16 text-white/20" />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-all">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">{userProfile?.displayName || 'Service Seeker'}</h2>
                <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified User
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-blue-500" /> Active RENTX Wallet
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
                <h3 className="font-bold text-lg mb-2">Public Profile</h3>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Display Name</label>
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all resize-none" placeholder="A short description about yourself..." />
                </div>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
                <h3 className="font-bold text-lg mb-2">Location & Details</h3>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-primary/50 outline-none" placeholder="e.g. United Kingdom" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-primary/50 outline-none" placeholder="e.g. London" />
                  </div>
                </div>
                <div className="pt-4">
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className="w-4 h-4 text-primary" />
                      <h4 className="text-[11px] font-black uppercase text-primary">Notifications</h4>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">You will receive email updates for all booking status changes and payment escrow events.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <CustomModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
}
