'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getClientBookings, Booking } from '@/lib/firestore-helpers';
import { ShieldCheck, LayoutDashboard, ShoppingBag, Wallet, UserCircle, Menu, LogOut,
  Clock, CheckCircle, Search, Compass, Heart, Bell, ChevronRight,
  ArrowUpRight, Star, History
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ClientDashboardPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/marketplace/auth');
  }, [authLoading, user]);

  useEffect(() => {
    if (user) loadClientData();
  }, [user]);

  const loadClientData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const b = await getClientBookings(user.uid);
      setBookings(b);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const stats = {
    activeOrders: bookings.filter(b => b.status === 'active' || b.status === 'pending' || b.status === 'completed').length,
    completedOrders: bookings.filter(b => b.status === 'confirmed').length,
    totalSpent: bookings.filter(b => b.status === 'confirmed' || b.status === 'completed' || b.status === 'active' || b.status === 'pending').reduce((acc, b) => acc + b.packagePrice, 0)
  };

  const handleSwitchToProviding = () => {
    router.push('/marketplace/dashboard/provider');
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/client', active: true },
    { label: 'My Bookings', icon: ShoppingBag, href: '/marketplace/dashboard/client/bookings' },
    { label: 'Saved Services', icon: Heart, href: '/marketplace/dashboard/client/saved' },
    { label: 'History', icon: History, href: '/marketplace/dashboard/history' },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/client/profile' },
  ];

  if (authLoading || loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

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
            onClick={handleSwitchToProviding}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 text-xs w-full transition-all font-bold uppercase tracking-widest"
          >
            <Compass className="w-4 h-4" /> Switch to Providing
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 text-xs w-full transition-all font-medium"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-bold">Hello, {userProfile?.displayName || 'Client'}</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Buying Mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-2"><Compass className="w-3.5 h-3.5" /> Browse Services</Link>
            <button className="relative p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"><Bell className="w-5 h-5" /></button>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Client Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-white/10 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShoppingBag className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Orders</span>
              </div>
              <div className="text-3xl font-bold">{stats.activeOrders}</div>
              <p className="text-[10px] text-gray-500 mt-1">Pending & In-Progress services</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><CheckCircle className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Completed</span>
              </div>
              <div className="text-3xl font-bold">{stats.completedOrders}</div>
              <p className="text-[10px] text-gray-500 mt-1">Services successfully received</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Wallet className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Spent (RENTX)</span>
              </div>
              <div className="text-3xl font-bold">{stats.totalSpent}</div>
              <p className="text-[10px] text-gray-500 mt-1">Total tokens invested in services</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Current Orders</h3>
                <Link href="/marketplace/dashboard/client/bookings" className="text-[10px] font-bold text-primary hover:underline">View All</Link>
              </div>

              <div className="space-y-3">
                {bookings.filter(b => b.status === 'active' || b.status === 'pending' || b.status === 'completed').length === 0 ? (
                  <div className="glass-card p-12 rounded-3xl border border-white/5 text-center">
                    <ShoppingBag className="w-12 h-12 text-white/5 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm italic">You don't have any active orders right now.</p>
                    <Link href="/marketplace" className="inline-block mt-4 text-primary text-xs font-bold hover:underline">Start browsing marketplace</Link>
                  </div>
                ) : (
                  bookings.filter(b => b.status === 'active' || b.status === 'pending' || b.status === 'completed').slice(0, 3).map((b) => (
                    <div key={b.id} className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{b.serviceTitle}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                            <span className="text-primary font-bold">{b.packageName}</span>
                            <span>•</span>
                            <span>By {b.providerName}</span>
                            <span>•</span>
                            <span>{formatDate(b.bookingDate, 'MMM dd')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">{b.packagePrice} RENTX</div>
                          <div className={`text-[9px] font-bold uppercase ${b.status === 'active' ? 'text-blue-500' : b.status === 'completed' ? 'text-purple-500' : 'text-yellow-500'}`}>
                            {b.status === 'completed' ? 'Delivered' : b.status}
                          </div>
                        </div>
                        <Link href="/marketplace/dashboard/client/bookings" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"><ChevronRight className="w-4 h-4" /></Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Side Content: Suggested & Profile Quick Links */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-primary/5 to-transparent">
                <h3 className="font-bold text-sm mb-4">Escrow Security</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-[10px] text-gray-400 leading-relaxed">Your RENTX tokens are held safely in escrow. They are only released to the provider after you confirm the job is complete.</p>
                  </div>
                  <Link href="/marketplace/dashboard/client/bookings" className="block text-center py-2 rounded-xl bg-primary text-black text-[10px] font-bold">Manage Escrow Release</Link>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-white/10">
                <h3 className="font-bold text-sm mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link href="/marketplace/dashboard/client/profile" className="flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors group">
                    <span>Account Settings</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/marketplace/dashboard/client/saved" className="flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors group">
                    <span>Saved Services</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/marketplace/auth" className="flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors group">
                    <span>Switch to Provider</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
