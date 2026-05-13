'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getProviderBookings, updateBookingStatus, Booking } from '@/lib/firestore-helpers';
import {
  BookOpen, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight,
  LayoutDashboard, Package, Wallet, UserCircle, Menu, LogOut,
  MessageSquare, Calendar, MoreVertical, Search, Filter, ShoppingBag
} from 'lucide-react';
import { format } from 'date-fns';
import { formatDate } from '@/lib/utils';
import NotificationBell from '@/components/rentx/NotificationBell';
import CustomModal from '@/components/rentx/CustomModal';

export default function ProviderBookingsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed' | 'confirmed' | 'cancelled'>('all');
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/marketplace/auth');
  }, [authLoading, user]);

  useEffect(() => {
    if (user) loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const b = await getProviderBookings(user.uid);
      setBookings(b);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, status: Booking['status']) => {
    const actionText = status === 'active' ? 'accept' : status === 'completed' ? 'complete' : status === 'cancelled' ? 'cancel' : status;
    
    setModalConfig({
      isOpen: true,
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Booking`,
      message: `Are you sure you want to ${actionText} this booking?`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          await updateBookingStatus(id, status);
          await loadBookings();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/provider' },
    { label: 'My Services', icon: Package, href: '/marketplace/dashboard/provider/services' },
    { label: 'Bookings', icon: BookOpen, href: '/marketplace/dashboard/provider/bookings', active: true },
    { label: 'Wallet', icon: Wallet, href: '/marketplace/dashboard/provider/wallet' },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/provider/profile' },
  ];

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

  const getStatusStyle = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'active': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
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
            onClick={() => router.push('/marketplace')}
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
              <h1 className="text-lg font-bold">Service Bookings</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Provider Mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Delivered</option>
              <option value="confirmed">Accepted</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </header>

        <main className="p-6">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/5">
              <BookOpen className="w-16 h-16 text-white/10 mb-6" />
              <h3 className="text-xl font-bold mb-2">No bookings found</h3>
              <p className="text-gray-400 text-sm text-center">You don't have any bookings matching the current filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div key={b.id} className="glass-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <UserCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{b.clientName}</h3>
                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusStyle(b.status)}`}>
                             {b.status === 'completed' ? 'Delivered' : b.status === 'confirmed' ? 'Accepted' : b.status}
                           </span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium mb-2">{b.serviceTitle} • <span className="text-primary">{b.packageName}</span></p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Scheduled: {formatDate(b.startDate || b.bookingDate, 'MMM dd, yyyy')}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Ordered: {formatDate(b.createdAt, 'MMM dd, HH:mm')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="text-primary font-bold text-lg">{b.packagePrice} RENTX</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Order #{b.id?.slice(-8)}</div>
                      </div>

                      <div className="flex gap-2">
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => b.id && handleStatusUpdate(b.id, 'active')} className="bg-primary text-black px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90">Accept</button>
                            <button onClick={() => b.id && handleStatusUpdate(b.id, 'cancelled')} className="bg-white/5 text-gray-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-500/10 hover:text-red-400 transition-all">Decline</button>
                          </>
                        )}
                        {b.status === 'active' && (
                          <button onClick={() => b.id && handleStatusUpdate(b.id, 'completed')} className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Mark as Done</button>
                        )}
                        <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"><MessageSquare className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-400">
                      <span className="font-bold text-gray-300 block mb-1">Client Notes:</span>
                      {b.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <CustomModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
}
