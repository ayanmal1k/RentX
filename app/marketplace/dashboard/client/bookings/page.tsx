'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getClientBookings, releasePayment, Booking, getBookingReview, Review } from '@/lib/firestore-helpers';
import {
  ShoppingBag, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight,
  LayoutDashboard, Heart, UserCircle, Menu, LogOut, MessageSquare,
  Calendar, ShieldCheck, Star, ExternalLink, History, Compass
} from 'lucide-react';
import { format } from 'date-fns';
import { formatDate } from '@/lib/utils';
import ReviewModal from '@/components/rentx/ReviewModal';
import NotificationBell from '@/components/rentx/NotificationBell';
import CustomModal from '@/components/rentx/CustomModal';

export default function ClientBookingsPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed' | 'confirmed' | 'cancelled'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Record<string, Review>>({});

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<any>(null);

  // Modal State
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
      const b = await getClientBookings(user.uid);
      setBookings(b);
      
      // Fetch reviews for reviewed bookings
      const reviewedBookings = b.filter(booking => booking.isReviewed);
      const reviewsMap: Record<string, Review> = {};
      for (const booking of reviewedBookings) {
        if (booking.id) {
          const r = await getBookingReview(booking.id);
          if (r) reviewsMap[booking.id] = r;
        }
      }
      setReviews(reviewsMap);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleConfirmCompletion = async (booking: Booking) => {
    if (!booking.id) return;
    
    setModalConfig({
      isOpen: true,
      title: 'Confirm Completion',
      message: 'Are you sure the service is complete? This will release the RENTX tokens from escrow to the provider. This action is irreversible.',
      type: 'confirm',
      onConfirm: async () => {
        setProcessingId(booking.id!);
        try {
          await releasePayment(booking.id!);
          await loadBookings();

          // Open review modal after successful release
          setReviewBooking({
            id: booking.id,
            serviceId: booking.serviceId,
            serviceTitle: booking.serviceTitle,
            providerId: booking.providerId,
            providerName: booking.providerName,
            clientId: user!.uid,
            clientName: userProfile?.displayName || user!.email || 'Client'
          });
          setIsReviewModalOpen(true);

        } catch (err) {
          console.error(err);
          setModalConfig({
            isOpen: true,
            title: 'Error',
            message: 'Failed to release payment. Please try again.',
            type: 'error'
          });
        }
        setProcessingId(null);
      }
    });
  };

  const openReviewModal = (booking: Booking) => {
    setReviewBooking({
      id: booking.id,
      serviceId: booking.serviceId,
      serviceTitle: booking.serviceTitle,
      providerId: booking.providerId,
      providerName: booking.providerName,
      clientId: user!.uid,
      clientName: userProfile?.displayName || user!.email || 'Client'
    });
    setIsReviewModalOpen(true);
  };

  const handleSwitchToProviding = () => {
    router.push('/marketplace/dashboard/provider');
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/client' },
    { label: 'My Bookings', icon: ShoppingBag, href: '/marketplace/dashboard/client/bookings', active: true },
    { label: 'History', icon: History, href: '/marketplace/dashboard/history' },
    { label: 'Saved Services', icon: Heart, href: '/marketplace/dashboard/client/saved' },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/client/profile' },
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
            onClick={handleSwitchToProviding}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 text-xs w-full transition-all font-bold uppercase tracking-widest"
          >
            <Compass className="w-4 h-4" /> Switch to Providing
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 text-sm w-full transition-all font-medium"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-bold">My Bookings</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Buying Mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none [color-scheme:dark]">
              <option value="all">All Orders</option>
              <option value="pending">Pending Confirmation</option>
              <option value="active">In Progress</option>
              <option value="completed">Delivered (Pending Completion)</option>
              <option value="confirmed">Confirmed & Released</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </header>

        <main className="p-6">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/5">
              <ShoppingBag className="w-16 h-16 text-white/10 mb-6" />
              <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
              <p className="text-gray-400 text-sm mb-8">You haven't booked any services yet. Check out the marketplace!</p>
              <Link href="/marketplace" className="bg-primary text-black px-6 py-3 rounded-xl font-bold text-sm">Explore Marketplace</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div key={b.id} className="glass-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 border border-white/5">
                        <ShoppingBag className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{b.serviceTitle}</h3>
                          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusStyle(b.status)}`}>
                            {b.status === 'completed' ? 'Delivered' : b.status === 'confirmed' ? 'Completed' : b.status}
                          </span>
                        </div>
                        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">{b.packageName} Package • By {b.providerName}</p>
                        <div className="flex flex-wrap gap-4 text-[10px] text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Scheduled for: {formatDate(b.startDate || b.bookingDate, 'MMMM dd, yyyy')}</span>
                          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Funds held in escrow</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 min-w-[200px]">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{b.packagePrice} <span className="text-xs text-gray-500">RENTX</span></div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">Transaction ID: {b.id?.slice(-8)}</div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        {b.status === 'completed' && (
                          <button
                            onClick={() => handleConfirmCompletion(b)}
                            disabled={processingId === b.id}
                            className="flex-1 md:flex-none bg-primary text-black px-4 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                          >
                            {processingId === b.id ? <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><CheckCircle className="w-3.5 h-3.5" /> Mark as Completed</>}
                          </button>
                        )}
                        {b.status === 'confirmed' && !b.isReviewed && (
                          <button
                            onClick={() => openReviewModal(b)}
                            className="flex-1 md:flex-none bg-white/5 text-primary border border-primary/20 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                          >
                            <Star className="w-3.5 h-3.5" /> Leave Review
                          </button>
                        )}
                        {b.isReviewed && reviews[b.id!] && (
                          <div className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/5 border border-green-500/10">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < reviews[b.id!].rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Review Locked</span>
                          </div>
                        )}
                        <button className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-white border border-white/5 transition-all"><MessageSquare className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>

                  {b.status === 'completed' && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-300 leading-relaxed font-medium">The provider has delivered the service. Please review the delivery and click "Mark as Completed" to release the funds from escrow. This action is irreversible.</p>
                      </div>
                    </div>
                  )}

                  {b.isReviewed && reviews[b.id!] && (
                    <div className="mt-6 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                            {userProfile?.displayName?.charAt(0) || 'U'}
                          </div>
                          <span className="text-xs font-bold text-white/90">Your Review</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">Locked • Non-editable</span>
                      </div>
                      <p className="text-xs text-gray-400 italic leading-relaxed">"{reviews[b.id!].comment}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {reviewBooking && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          booking={reviewBooking}
          onSuccess={loadBookings}
        />
      )}

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
