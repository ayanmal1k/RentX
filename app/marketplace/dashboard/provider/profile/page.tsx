'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { updateUserProfile, UserProfile } from '@/lib/firestore-helpers';
import {
  UserCircle, Mail, MapPin, Globe, Twitter, Github, Wallet,
  LayoutDashboard, Package, BookOpen, Menu, LogOut, Save, Camera,
  ShieldCheck, AlertCircle, ExternalLink, Star, ShoppingBag
} from 'lucide-react';
import { format } from 'date-fns';
import CustomModal from '@/components/rentx/CustomModal';

export default function ProviderProfilePage() {
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
  const [walletAddress, setWalletAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/marketplace/auth');
  }, [authLoading, user]);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setBio(userProfile.bio || '');
      setWalletAddress(userProfile.walletAddress || '');
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
        walletAddress,
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

  const handleSwitchToBuying = () => {
    router.push('/marketplace');
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/provider' },
    { label: 'My Services', icon: Package, href: '/marketplace/dashboard/provider/services' },
    { label: 'Bookings', icon: BookOpen, href: '/marketplace/dashboard/provider/bookings' },
    { label: 'Wallet', icon: Wallet, href: '/marketplace/dashboard/provider/wallet' },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/provider/profile', active: true },
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
        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={handleSwitchToBuying}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 text-xs w-full transition-all font-bold uppercase tracking-widest"
          >
            <ShoppingBag className="w-4 h-4" /> Switch to Buying
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 text-xs w-full transition-all font-medium"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-bold">Profile Settings</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Provider Mode</span>
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save Changes</>}
          </button>
        </header>

        <main className="p-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Avatar & Verification */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-white/10 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-black ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
                    <UserCircle className="w-16 h-16 text-primary/40" />
                  </div>
                  <button className="absolute bottom-1 right-1 p-2 bg-primary text-black rounded-full hover:shadow-lg transition-all"><Camera className="w-4 h-4" /></button>
                </div>
                <h3 className="font-bold text-lg">{userProfile?.displayName || 'Service Provider'}</h3>
                <p className="text-gray-500 text-xs mt-1 lowercase">{user?.email}</p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-green-500 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Provider
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-white/10">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Stats</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Member since</span>
                    <span className="text-xs font-bold text-gray-300">
                      {userProfile?.createdAt ? format(userProfile.createdAt instanceof Date ? userProfile.createdAt : (userProfile.createdAt as any).toDate(), 'MMM yyyy') : 'May 2026'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Total Bookings</span>
                    <span className="text-xs font-bold text-gray-300">{userProfile?.totalBookings || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Rating</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      {userProfile?.averageRating ? `${userProfile.averageRating} (${userProfile.reviewCount})` : 'New'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Detailed Form */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-card rounded-3xl p-8 border border-white/10">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Display Name</label>
                    <div className="relative">
                      <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Enter your public name" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-primary/50 outline-none transition-all" />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Bio / Service Summary</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Tell clients about your expertise..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all resize-none" />
                  </div>

                  <div>
                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. UAE" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-primary/50 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Dubai" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-primary/50 outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">Payout Settings</h3>
                  <div className="bg-primary/10 px-2 py-1 rounded text-[9px] font-black text-primary uppercase tracking-tighter border border-primary/20">Critical</div>
                </div>
                
                <div className="mb-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-yellow-500/80 leading-relaxed">Ensure your Solana wallet address is correct. RENTX withdrawals are sent directly to this address and cannot be reversed if sent to a wrong destination.</p>
                </div>

                <div>
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Solana Wallet Address (for RENTX)</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Enter your Phantom/Solflare address" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-mono focus:border-primary/50 outline-none transition-all" />
                  </div>
                  {walletAddress && (
                    <a href={`https://solscan.io/account/${walletAddress}`} target="_blank" className="mt-2 text-[10px] text-primary flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" /> View on Solscan</a>
                  )}
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
