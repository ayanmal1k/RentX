'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MarketplaceNavbar } from '@/components/rentx/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/rentx/MarketplaceFooter';
import { useAuth } from '@/lib/auth-context';
import { getService, ServiceListing, getServiceReviews, Review, createBooking, createPayment, createNotification, getProviderAvailabilityRange } from '@/lib/firestore-helpers';
import { Timestamp } from 'firebase/firestore';
import {
  Star, MapPin, Clock, Shield, ArrowLeft, Check, Calendar, MessageSquare,
  Sparkles, User, ChevronRight, Zap, Globe, Package, AlertCircle, Wallet
} from 'lucide-react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { SOLANA_TOKEN_MINT, SOLANA_TOKEN_DECIMALS, TREASURY_WALLET_ADDRESS } from '@/lib/solana-config';
import { toast } from 'sonner';

// Demo data fallback
const DEMO_MAP: Record<string, Partial<ServiceListing>> = {
  'demo-1': {
    id: 'demo-1', title: 'Professional DJ for Events & Weddings', providerName: 'DJ Blaze', category: 'DJ & Music',
    city: 'Dubai', country: 'UAE', isRemote: false, averageRating: 4.9, reviewCount: 47, totalBookings: 120, featured: true,
    description: 'Professional DJ with 10+ years of experience in weddings, corporate events, and private parties. Top-of-the-line sound systems, professional lighting, and an unmatched ability to read the room. I specialize in creating unforgettable musical experiences that keep your guests on the dance floor all night long.',
    packages: [
      { name: 'Basic', description: '3 hour set with standard equipment', price: 500, deliveryDays: 1, features: ['Sound System', 'Basic Lighting', 'MC Services'] },
      { name: 'Premium', description: '6 hour set with premium equipment', price: 1000, deliveryDays: 1, features: ['Premium Sound', 'LED Lighting', 'MC Services', 'Fog Machine', 'Song Requests'] },
      { name: 'Ultimate', description: 'Full day with complete production', price: 2000, deliveryDays: 1, features: ['Concert Sound', 'Full Lighting Rig', 'MC Services', 'Visual Effects', 'Backup DJ', 'Setup & Teardown'] },
    ],
    portfolio: [], coverImage: '', status: 'active',
  },
  'demo-2': {
    id: 'demo-2', title: 'Cinematic Wedding Photography', providerName: 'Studio Luxe', category: 'Photography',
    city: 'London', country: 'UK', isRemote: false, averageRating: 5.0, reviewCount: 23, totalBookings: 65, featured: true,
    description: 'Award-winning wedding photography with a cinematic, editorial style. Full day coverage with a team of 2 photographers. We capture every precious moment with artistic precision.',
    packages: [
      { name: 'Essential', description: 'Half day coverage', price: 800, deliveryDays: 14, features: ['1 Photographer', '200+ Photos', 'Online Gallery'] },
      { name: 'Full Day', description: '12 hour coverage', price: 1200, deliveryDays: 14, features: ['2 Photographers', '500+ Photos', 'Online Gallery', 'Engagement Shoot'] },
    ],
    portfolio: [], coverImage: '', status: 'active',
  },
};

const DEMO_REVIEWS: Review[] = [
  { id: 'r1', serviceId: 'demo-1', bookingId: 'b1', clientId: 'c1', clientName: 'Alex M.', providerId: 'p1', rating: 5, comment: 'Absolutely incredible! DJ Blaze kept the dance floor packed all night. Best decision we made for our wedding.', createdAt: Timestamp.now() },
  { id: 'r2', serviceId: 'demo-1', bookingId: 'b2', clientId: 'c2', clientName: 'Sarah K.', providerId: 'p1', rating: 5, comment: 'Professional, punctual, and the music selection was perfect. Highly recommend!', createdAt: Timestamp.now() },
  { id: 'r3', serviceId: 'demo-1', bookingId: 'b3', clientId: 'c3', clientName: 'James T.', providerId: 'p1', rating: 4, comment: 'Great experience overall. Equipment was top-notch and setup was seamless.', createdAt: Timestamp.now() },
];

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const serviceId = params.id as string;

  const [service, setService] = useState<Partial<ServiceListing> | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const real = await getService(serviceId);
        if (real) { setService(real); const r = await getServiceReviews(serviceId); setReviews(r); }
        else if (DEMO_MAP[serviceId]) { setService(DEMO_MAP[serviceId]); setReviews(DEMO_REVIEWS); }
      } catch { if (DEMO_MAP[serviceId]) { setService(DEMO_MAP[serviceId]); setReviews(DEMO_REVIEWS); } }
      setLoading(false);
    }
    load();
  }, [serviceId]);

  useEffect(() => {
    if (userProfile) {
      setBuyerEmail(userProfile.email || user?.email || '');
      setBuyerPhone(userProfile.phone || '');
    } else if (user) {
      setBuyerEmail(user.email || '');
    }
  }, [user, userProfile]);

  const { primaryWallet, handleLogOut, setShowAuthFlow } = useDynamicContext();

  const handleBooking = async () => {
    if (!user || !userProfile || !service) return;
    if (!bookingDate) {
      toast.error('Please select a booking date');
      return;
    }

    if (!primaryWallet) {
      toast.error('Please connect your wallet to proceed');
      return;
    }

    setBookingLoading(true);
    try {
      const pkg = service.packages?.[selectedPackage];
      const amount = pkg?.price || 0;

      // 1. Process Solana Transaction
      toast.loading('Processing payment...', { id: 'booking-tx' });

      const hash = await primaryWallet.sendBalance({
        amount: amount.toString(),
        toAddress: TREASURY_WALLET_ADDRESS,
        token: {
          address: SOLANA_TOKEN_MINT,
          decimals: SOLANA_TOKEN_DECIMALS
        }
      });

      if (!hash) throw new Error('Transaction failed or was cancelled');

      toast.success('Payment successful!', { id: 'booking-tx' });

      // 2. Create Records in Firestore
      const bookingId = await createBooking({
        serviceId: service.id,
        serviceTitle: service.title,
        providerId: service.providerId || 'demo-provider',
        providerName: service.providerName,
        providerContact: service.providerContact || undefined,
        clientContact: { email: buyerEmail || userProfile.email || user.email || '', phone: buyerPhone || userProfile?.phone },
        clientId: user.uid,
        clientName: userProfile.displayName || user.email || 'Client',
        clientEmail: userProfile.email || user.email || '',
        packageName: pkg?.name || '',
        packagePrice: amount,
        bookingDate: Timestamp.fromDate(new Date(bookingDate)),
        startDate: Timestamp.fromDate(new Date(bookingDate)),
        notes: bookingNotes,
        status: 'pending',
      });

      await createPayment({
        bookingId,
        serviceId: service.id,
        clientId: user.uid,
        providerId: service.providerId || 'demo-provider',
        amount: amount,
        platformFee: amount * 0.05,
        providerAmount: amount * 0.95,
        transactionSignature: hash,
        status: 'held', // Set to held as funds are in treasury
      });

      await createNotification({
        userId: service.providerId || 'demo-provider',
        type: 'booking',
        title: 'New Booking!',
        message: `${userProfile.displayName} booked your "${service.title}" - ${pkg?.name} package`,
        link: `/marketplace/dashboard/provider/bookings`,
      });

      setBookingSuccess(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Transaction failed', { id: 'booking-tx' });
    }
    setBookingLoading(false);
  };

  if (loading) return (
    <main className="min-h-screen bg-sparkle flex flex-col">
      <MarketplaceNavbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    </main>
  );

  if (!service) return (
    <main className="min-h-screen bg-sparkle flex flex-col">
      <MarketplaceNavbar />
      <div className="flex-grow flex items-center justify-center flex-col gap-4">
        <AlertCircle className="w-12 h-12 text-on-surface-variant/30" />
        <h2 className="text-white font-bold text-xl">Service Not Found</h2>
        <Link href="/marketplace" className="text-primary text-sm hover:underline">Back to Marketplace</Link>
      </div>
    </main>
  );

  const pkg = service.packages?.[selectedPackage];

  return (
    <main className="min-h-screen bg-sparkle overflow-clip flex flex-col">
      <MarketplaceNavbar />

      <section className="pt-20 pb-16 px-4 sm:px-6 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <button onClick={() => router.back()} className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface-variant font-medium">{service.category}</span>
                  <div className="flex items-center gap-1 text-xs"><MapPin className="w-3 h-3 text-on-surface-variant" /><span className="text-on-surface-variant">{service.city}, {service.country}</span></div>
                  {service.isRemote && <span className="text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20"><Globe className="w-3 h-3 inline mr-1" />Remote</span>}
                  {service.featured && <span className="text-[11px] text-secondary bg-secondary/10 px-2 py-0.5 rounded-md"><Sparkles className="w-3 h-3 inline mr-1" />Featured</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{service.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{service.providerName?.charAt(0)}</div>
                    <span className="text-white text-sm font-medium">{service.providerName}</span>
                  </div>
                  <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="text-white font-semibold text-sm">{service.averageRating}</span><span className="text-on-surface-variant text-xs">({service.reviewCount} reviews)</span></div>
                  <span className="text-on-surface-variant text-xs">{service.totalBookings} bookings</span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">{service.description}</p>
              </div>

              {/* Packages */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}><Package className="w-5 h-5 text-primary" /> Packages</h2>
                <div className="grid gap-4">
                  {service.packages?.map((p, i) => (
                    <button key={i} onClick={() => setSelectedPackage(i)}
                      className={`text-left p-4 rounded-xl border transition-all duration-300 ${selectedPackage === i ? 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/10' : 'bg-surface-container-low border-white/5 hover:border-white/15'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-bold">{p.name}</h3>
                        <span className="text-xl font-bold text-white">{p.price} <span className="text-primary text-sm">RENTX</span></span>
                      </div>
                      <p className="text-on-surface-variant text-xs mb-3">{p.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {p.features.map((f, j) => (
                          <span key={j} className="flex items-center gap-1 text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">
                            <Check className="w-3 h-3 text-primary" />{f}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-xs text-on-surface-variant"><Clock className="w-3 h-3" /> {p.deliveryDays} day{p.deliveryDays > 1 ? 's' : ''} delivery</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}><MessageSquare className="w-5 h-5 text-primary" /> Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 bg-surface-container-low rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary text-xs font-bold">{r.clientName.charAt(0)}</div>
                          <span className="text-white text-sm font-medium">{r.clientName}</span>
                        </div>
                        <div className="flex items-center gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}</div>
                      </div>
                      <p className="text-on-surface-variant text-sm">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking Sidebar */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                {bookingSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-400" /></div>
                    <h3 className="text-white font-bold text-xl mb-2">Booking Confirmed!</h3>
                    <p className="text-on-surface-variant text-sm mb-4">Your booking has been submitted. The provider will confirm shortly.</p>
                    <p className="text-on-surface-variant text-xs mb-6">Provider contact details are now available in your dashboard.</p>
                    <Link href="/marketplace/dashboard/client/bookings" className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all inline-flex items-center gap-2">
                      View My Bookings <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Book This Service</h3>
                    <p className="text-on-surface-variant text-xs mb-4">Select a package and date to proceed</p>
                    <div className="bg-surface-container-low rounded-xl p-4 mb-4 border border-white/5">
                      <span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Selected Package</span>
                      <div className="text-white font-bold">{pkg?.name}</div>
                      <div className="text-2xl font-bold text-white mt-1">{pkg?.price} <span className="text-primary text-sm">RENTX</span></div>
                      <div className="text-on-surface-variant text-xs mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {pkg?.deliveryDays} day delivery</div>
                    </div>
                    <div className="mb-4">
                      <label className="text-on-surface-variant text-xs font-medium mb-1.5 block">Booking Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-surface-container-low border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all [color-scheme:dark]" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-on-surface-variant text-xs font-medium mb-1.5 block">Notes (optional)</label>
                      <textarea value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} rows={3} placeholder="Any special requirements..."
                        className="w-full bg-surface-container-low border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none" />
                    </div>
                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-on-surface-variant text-xs font-medium mb-1.5 block">Your Contact Email</label>
                        <input value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} placeholder="you@email.com"
                          className="w-full bg-surface-container-low border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all" />
                      </div>
                      <div>
                        <label className="text-on-surface-variant text-xs font-medium mb-1.5 block">Your Contact Number</label>
                        <input value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="+971 50 123 4567"
                          className="w-full bg-surface-container-low border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all" />
                      </div>
                    </div>
                    {user ? (
                      <div className="space-y-4">
                        {!primaryWallet ? (
                          <button 
                            onClick={() => setShowAuthFlow(true)}
                            className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
                          >
                            <Wallet className="w-4 h-4" /> Connect Wallet to Book
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-white/5">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Connected</span>
                                <span className="text-xs font-mono text-white/70">
                                  {primaryWallet.address.slice(0, 4)}...{primaryWallet.address.slice(-4)}
                                </span>
                              </div>
                              <button 
                                onClick={() => handleLogOut()}
                                className="text-[10px] font-black text-error hover:text-red-400 transition-colors uppercase tracking-widest"
                              >
                                Disconnect
                              </button>
                            </div>
                            <button onClick={handleBooking} disabled={!bookingDate || bookingLoading}
                              className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                              {bookingLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Zap className="w-4 h-4" /> Pay {pkg?.price} RENTX & Book</>}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link href="/marketplace/auth" className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all">
                        Sign In to Book
                      </Link>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-on-surface-variant/60 text-[11px] justify-center"><Shield className="w-3.5 h-3.5" /> Escrow protected — funds released after both confirm</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketplaceFooter />
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-container/[0.03] blur-[120px] rounded-full" />
      </div>
    </main>
  );
}
