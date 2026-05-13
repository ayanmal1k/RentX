'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  getAllUsers, getAllServicesAdmin, getAllBookings, getAllPayments,
  UserProfile, ServiceListing, Booking, Payment 
} from '@/lib/firestore-helpers';
import {
  ShieldAlert, Users, Package, BookOpen, CreditCard, Menu, LogOut,
  TrendingUp, Activity, Search, Filter, ChevronRight, AlertCircle,
  BarChart3, Settings, ShieldCheck, UserPlus, ArrowUpRight
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import NotificationBell from '@/components/rentx/NotificationBell';

export default function AdminDashboardPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push('/marketplace/auth');
      else if (userProfile?.role !== 'admin') router.push('/marketplace/dashboard/client');
    }
  }, [authLoading, user, userProfile]);

  useEffect(() => {
    if (userProfile?.role === 'admin') loadAdminData();
  }, [userProfile]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [u, s, b, p] = await Promise.all([
        getAllUsers(),
        getAllServicesAdmin(),
        getAllBookings(),
        getAllPayments()
      ]);
      setUsers(u);
      setServices(s);
      setBookings(b);
      setPayments(p);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const stats = {
    totalUsers: users.length,
    totalProviders: users.filter(u => u.role === 'provider').length,
    activeServices: services.filter(s => s.status === 'active').length,
    totalVolume: payments.reduce((acc, p) => acc + p.amount, 0),
    pendingWithdrawals: 0 // Mock for now
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: BarChart3, href: '/marketplace/admin', active: true },
    { label: 'User Management', icon: Users, href: '/marketplace/admin/users' },
    { label: 'Service Moderation', icon: Package, href: '/marketplace/admin/services' },
    { label: 'Platform Bookings', icon: BookOpen, href: '/marketplace/admin/bookings' },
    { label: 'Withdrawal Requests', icon: ArrowUpRight, href: '/marketplace/admin/withdrawals' },
    { label: 'Payment Logs', icon: CreditCard, href: '/marketplace/admin/payments' },
    { label: 'System Settings', icon: Settings, href: '/marketplace/admin/settings' },
  ];

  if (authLoading || loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Admin Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-black border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
          <Link href="/marketplace" className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <div className="font-black text-xl tracking-tighter text-white">RENTX ADMIN</div>
          </Link>
          <div className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Platform Oversight</div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}><Icon className="w-4 h-4" />{item.label}</Link>);
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="p-4 bg-white/5 rounded-2xl mb-4 text-center">
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Signed in as</div>
            <div className="text-xs font-bold truncate">{user?.email}</div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:text-red-400 text-sm w-full transition-all"><LogOut className="w-4 h-4" /> Exit Admin</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold flex items-center gap-2">System Dashboard <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/20 font-black">LIVE</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Platform Health</div>
               <div className="flex items-center gap-1.5 justify-end">
                 <div className="w-2 h-2 rounded-full bg-green-500" />
                 <span className="text-xs font-bold">Stable</span>
               </div>
             </div>
             <NotificationBell />
          </div>
        </header>

        <main className="p-6 space-y-8">
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-6 rounded-3xl border border-white/10 hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-gray-500">TOTAL USERS</span>
              </div>
              <div className="text-3xl font-black">{stats.totalUsers}</div>
              <p className="text-[10px] text-gray-500 mt-1">+{stats.totalProviders} Service Providers</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-gray-500">SERVICES</span>
              </div>
              <div className="text-3xl font-black">{stats.activeServices}</div>
              <p className="text-[10px] text-gray-500 mt-1">{services.length} Total Registered</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/10 hover:border-green-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-gray-500">TX VOLUME</span>
              </div>
              <div className="text-3xl font-black">{stats.totalVolume} <span className="text-xs">RENTX</span></div>
              <p className="text-[10px] text-gray-500 mt-1">Escrow + Released payments</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/10 hover:border-yellow-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-gray-500">SYSTEM OPS</span>
              </div>
              <div className="text-3xl font-black">99.9<span className="text-xs">%</span></div>
              <p className="text-[10px] text-gray-500 mt-1">Uptime Monitoring</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Recent Services for Moderation */}
            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Service Moderation</h3>
                <Link href="/marketplace/admin/services" className="text-[10px] font-bold text-gray-500 hover:text-white">Moderate All</Link>
              </div>
              <div className="divide-y divide-white/5">
                {services.slice(0, 5).map((s) => (
                  <div key={s.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                        {s.category.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold truncate max-w-[150px]">{s.title}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">By {s.providerName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${s.status === 'active' ? 'text-green-500 border-green-500/20' : 'text-yellow-500 border-yellow-500/20'}`}>{s.status}</span>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Activity / Payments */}
            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Platform Revenue</h3>
                <Link href="/marketplace/admin/payments" className="text-[10px] font-bold text-gray-500 hover:text-white">View Ledger</Link>
              </div>
              <div className="p-6">
                <div className="h-48 flex items-end gap-2 mb-6">
                  {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-lg relative group" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black px-1.5 py-0.5 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">1.2K</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-[10px] font-black text-gray-500 uppercase mb-1">Platform Fees</div>
                    <div className="text-xl font-black text-primary">{Math.floor(stats.totalVolume * 0.05)} <span className="text-[10px]">RENTX</span></div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-[10px] font-black text-gray-500 uppercase mb-1">Successful Jobs</div>
                    <div className="text-xl font-black text-white">{bookings.filter(b => b.status === 'completed').length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Directory Preview */}
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
               <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Recent User Registration</h3>
               <button className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 hover:bg-primary/20"><UserPlus className="w-3.5 h-3.5" /> Manual Add</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">User</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Location</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Joined</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.slice(0, 5).map((u) => (
                    <tr key={u.uid} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-bold">{u.displayName?.charAt(0) || 'U'}</div>
                          <div>
                            <div className="text-xs font-bold">{u.displayName}</div>
                            <div className="text-[10px] text-gray-600 font-medium">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${u.role === 'provider' ? 'text-purple-400 border-purple-400/20 bg-purple-400/5' : u.role === 'admin' ? 'text-red-400 border-red-400/20 bg-red-400/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">{u.city || 'N/A'}, {u.country || 'N/A'}</td>
                      <td className="px-6 py-4 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{formatDate(u.createdAt, 'MMM dd, yyyy')}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><Settings className="w-4 h-4 text-gray-500" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
