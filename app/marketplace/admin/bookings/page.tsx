'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getAllBookings, Booking } from '@/lib/firestore-helpers';
import {
  ShieldAlert, BookOpen, Clock, CheckCircle, XCircle, AlertCircle,
  Search, Filter, ChevronRight, BarChart3, Users, Package, ArrowUpRight,
  CreditCard, Settings, LogOut, Menu, ExternalLink, Calendar
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import NotificationBell from '@/components/rentx/NotificationBell';

export default function AdminBookingsPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Booking['status']>('all');

  useEffect(() => {
    if (!authLoading) {
      if (!user || userProfile?.role !== 'admin') router.push('/marketplace/dashboard/client');
    }
  }, [authLoading, user, userProfile]);

  useEffect(() => {
    if (userProfile?.role === 'admin') loadBookings();
  }, [userProfile]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const b = await getAllBookings();
      setBookings(b);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const NAV_ITEMS = [
    { label: 'Overview', icon: BarChart3, href: '/marketplace/admin' },
    { label: 'User Management', icon: Users, href: '/marketplace/admin/users' },
    { label: 'Service Moderation', icon: Package, href: '/marketplace/admin/services' },
    { label: 'Platform Bookings', icon: BookOpen, href: '/marketplace/admin/bookings', active: true },
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
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}><Icon className="w-4 h-4" />{item.label}</Link>);
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:text-red-400 text-sm w-full transition-all"><LogOut className="w-4 h-4" /> Exit Admin</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">Platform Bookings</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bookings..." 
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all w-64"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none [color-scheme:dark]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <NotificationBell />
          </div>
        </div>
      </header>

        <main className="p-6">
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Service / ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Client</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Provider</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-gray-500 italic">No bookings found</td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="text-sm font-bold text-white">{b.serviceTitle}</div>
                          <div className="text-[9px] font-mono text-gray-500 mt-0.5">#{b.id?.substring(0, 8)}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-xs font-bold text-gray-300">{b.clientName}</div>
                          <div className="text-[10px] text-gray-600">{b.clientEmail}</div>
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-gray-300">{b.providerName}</td>
                        <td className="px-6 py-5">
                          <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {formatDate(b.createdAt, 'MMM dd, yyyy')}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                            b.status === 'completed' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 
                            b.status === 'cancelled' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                            'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'
                          }`}>{b.status}</span>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-primary text-sm">{b.packagePrice} RENTX</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
