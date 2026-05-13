'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getProviderServices, getProviderBookings, getProviderPayments, Booking, ServiceListing, Payment } from '@/lib/firestore-helpers';
import {
  LayoutDashboard, Package, BookOpen, Wallet, UserCircle, Menu, LogOut,
  TrendingUp, Clock, CheckCircle, ArrowUpRight, Plus, ChevronRight,
  MessageSquare, Bell, Calendar, DollarSign, History, ShoppingBag
} from 'lucide-react';
import { format } from 'date-fns';
import { formatDate } from '@/lib/utils';
import NotificationBell from '@/components/rentx/NotificationBell';

export default function ProviderDashboardPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/marketplace/auth');
  }, [authLoading, user]);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [s, b, p] = await Promise.all([
        getProviderServices(user.uid),
        getProviderBookings(user.uid),
        getProviderPayments(user.uid)
      ]);
      setServices(s);
      setBookings(b);
      setPayments(p);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const stats = {
    activeListings: services.filter(s => s.status === 'active').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    activeJobs: bookings.filter(b => b.status === 'active' || b.status === 'completed').length,
    totalEarnings: payments.reduce((acc, curr) => acc + (curr.status === 'released' ? curr.amount : 0), 0)
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/provider', active: true },
    { label: 'My Services', icon: Package, href: '/marketplace/dashboard/provider/services' },
    { label: 'Bookings', icon: BookOpen, href: '/marketplace/dashboard/provider/bookings' },
    { label: 'Wallet', icon: Wallet, href: '/marketplace/dashboard/provider/wallet' },
    { label: 'History', icon: History, href: '/marketplace/dashboard/history' },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/provider/profile' },
  ];

  const handleSwitchToBuying = () => {
    router.push('/marketplace');
  };

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
              <h1 className="text-lg font-bold">Welcome back, {userProfile?.displayName || 'Provider'}</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Provider Mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs uppercase">{userProfile?.displayName?.charAt(0) || 'P'}</div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-5 border border-white/10 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 bg-white/5 rounded-lg" />
                    <div className="w-4 h-4 bg-white/5 rounded" />
                  </div>
                  <div className="h-8 w-24 bg-white/5 rounded mb-2" />
                  <div className="h-3 w-32 bg-white/5 rounded" />
                </div>
              ))
            ) : (
              <>
                <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform"><Wallet className="w-5 h-5" /></div>
                    <TrendingUp className="w-4 h-4 text-green-500/50" />
                  </div>
                  <div className="text-2xl font-bold">{stats.totalEarnings} <span className="text-xs text-gray-500">RENTX</span></div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Released Earnings</div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:scale-110 transition-transform"><BookOpen className="w-5 h-5" /></div>
                    {stats.pendingBookings > 0 && <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />}
                  </div>
                  <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Pending Orders</div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-500 group-hover:scale-110 transition-transform"><CheckCircle className="w-5 h-5" /></div>
                  </div>
                  <div className="text-2xl font-bold">{stats.activeJobs}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Ongoing Jobs</div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 group-hover:scale-110 transition-transform"><Package className="w-5 h-5" /></div>
                  </div>
                  <div className="text-2xl font-bold">{stats.activeListings}/5</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Active Listings</div>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content: Bookings */}
            <div className="xl:col-span-2 space-y-6">
              <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Active & Delivered Bookings</h3>
                  <Link href="/marketplace/dashboard/provider/bookings" className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></Link>
                </div>
                <div className="divide-y divide-white/5">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/5 rounded-xl" />
                          <div className="space-y-2">
                            <div className="h-4 w-40 bg-white/5 rounded" />
                            <div className="h-3 w-24 bg-white/5 rounded" />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="space-y-1">
                            <div className="h-4 w-16 bg-white/5 rounded" />
                            <div className="h-2 w-10 bg-white/5 rounded" />
                          </div>
                          <div className="w-8 h-8 bg-white/5 rounded-lg" />
                        </div>
                      </div>
                    ))
                  ) : bookings.filter(b => b.status === 'pending' || b.status === 'active' || b.status === 'completed').length === 0 ? (
                    <div className="p-10 text-center text-gray-500 text-sm italic">No active or delivered bookings</div>
                  ) : (
                    bookings.filter(b => b.status === 'pending' || b.status === 'active' || b.status === 'completed').slice(0, 5).map((b) => (
                      <div key={b.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            b.status === 'active' ? 'bg-blue-500/10 text-blue-500' : 
                            b.status === 'completed' ? 'bg-purple-500/10 text-purple-500' : 
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {b.status === 'active' ? <Clock className="w-5 h-5" /> : 
                             b.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : 
                             <Bell className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold">{b.clientName} ordered <span className="text-primary">{b.packageName}</span></div>
                            <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                              <span>{b.serviceTitle}</span>
                              <span>•</span>
                              <span>{formatDate(b.startDate || b.bookingDate, 'MMM dd')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">{b.packagePrice} RENTX</div>
                            <div className={`text-[9px] font-bold uppercase ${
                              b.status === 'active' ? 'text-blue-500' : 
                              b.status === 'completed' ? 'text-purple-500' : 
                              'text-yellow-500'
                            }`}>{b.status === 'completed' ? 'delivered' : b.status}</div>
                          </div>
                          <Link href="/marketplace/dashboard/provider/bookings" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"><ChevronRight className="w-4 h-4" /></Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/marketplace/dashboard/provider/services?new=true" className="glass-card p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-sm">New Listing</h4>
                    <p className="text-[10px] text-gray-500">Add a new service to marketplace</p>
                  </div>
                </Link>
                <Link href="/marketplace/dashboard/provider/wallet" className="glass-card p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform"><ArrowUpRight className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-sm">Withdraw Earnings</h4>
                    <p className="text-[10px] text-gray-500">Transfer RENTX to your wallet</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Sidebar Content: Activity & Listings */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Recent Earnings</h3>
                  <Link href="/marketplace/dashboard/provider/wallet" className="text-[10px] text-gray-500 hover:text-primary">Wallet</Link>
                </div>
                <div className="p-4 space-y-4">
                  {payments.filter(p => p.status === 'released').slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-gray-400">Order #{p.bookingId.slice(-4)}</span>
                      </div>
                      <span className="font-bold">+{p.amount} RENTX</span>
                    </div>
                  ))}
                  {payments.filter(p => p.status === 'released').length === 0 && (
                    <div className="text-center py-4 text-[10px] text-gray-600">No earnings history yet</div>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h3 className="font-bold text-sm flex items-center gap-2"><Package className="w-4 h-4 text-purple-500" /> My Listings</h3>
                </div>
                <div className="p-4 space-y-3">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="p-3 bg-white/[0.03] rounded-xl border border-white/5 animate-pulse">
                        <div className="h-4 w-3/4 bg-white/5 rounded mb-2" />
                        <div className="flex justify-between">
                          <div className="h-2 w-12 bg-white/5 rounded" />
                          <div className="h-2 w-16 bg-white/5 rounded" />
                        </div>
                      </div>
                    ))
                  ) : services.length === 0 ? (
                    <div className="text-center py-4 text-[10px] text-gray-600">No listings created</div>
                  ) : (
                    services.slice(0, 3).map((s) => (
                      <div key={s.id} className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
                        <div className="font-bold text-[11px] truncate">{s.title}</div>
                        <div className="flex items-center justify-between mt-1 text-[9px] text-gray-500">
                          <span>{s.category}</span>
                          <span className="text-primary font-bold">{s.packages?.[0]?.price} RENTX</span>
                        </div>
                      </div>
                    ))
                  )}
                  <Link href="/marketplace/dashboard/provider/services" className="block text-center text-[10px] font-bold text-primary hover:underline mt-2">Manage All Listings</Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
