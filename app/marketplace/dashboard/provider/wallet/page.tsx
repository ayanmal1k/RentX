'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getProviderPayments, getProviderWithdrawals, createWithdrawal, getProviderBookings, Payment, Withdrawal, Booking } from '@/lib/firestore-helpers';
import {
  Wallet, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowUpRight,
  LayoutDashboard, Package, BookOpen, UserCircle, Menu, LogOut,
  CreditCard, DollarSign, History, ChevronRight, ShoppingBag
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { isSolanaWallet } from '@dynamic-labs/solana';
import { toast } from 'sonner';
import CustomModal from '@/components/rentx/CustomModal';

export default function ProviderWalletPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [viewAllPayments, setViewAllPayments] = useState(false);
  const [viewAllWithdrawals, setViewAllWithdrawals] = useState(false);
  
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
  
  const { primaryWallet, handleLogOut, setShowAuthFlow } = useDynamicContext();

  // Stats
  const [stats, setStats] = useState({
    totalEarnings: 0,
    availableBalance: 0,
    pendingEscrow: 0,
    totalWithdrawn: 0
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/marketplace/auth');
  }, [authLoading, user]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let p: Payment[] = [];
      let w: Withdrawal[] = [];
      let b: Booking[] = [];
      
      try {
        p = await getProviderPayments(user.uid);
      } catch (e) { console.error("Error loading payments:", e); }

      try {
        w = await getProviderWithdrawals(user.uid);
      } catch (e) { console.error("Error loading withdrawals:", e); }

      try {
        b = await getProviderBookings(user.uid);
      } catch (e) { console.error("Error loading bookings:", e); }

      setPayments(p);
      setWithdrawals(w);
      setBookings(b);

      // Calculate stats
      let total = 0, available = 0, pending = 0, withdrawn = 0;

      p.forEach(pay => {
        const booking = b.find(bk => bk.id === pay.bookingId);
        // A payment is considered released if its status is 'released' OR 
        // if the associated booking is 'confirmed' (meaning buyer already authorized release)
        const isReleased = pay.status === 'released' || (booking && booking.status === 'confirmed');

        if (isReleased) {
          available += pay.amount;
          total += pay.amount;
        } else if (pay.status === 'held' || pay.status === 'pending') {
          pending += pay.amount;
        }
      });

      w.forEach(withd => {
        if (withd.status === 'completed' || withd.status === 'processing' || withd.status === 'pending') {
          withdrawn += withd.amount;
        }
      });

      // availableBalance is what was released minus what was already requested/withdrawn
      const actualAvailable = available - withdrawn;

      setStats({
        totalEarnings: total,
        availableBalance: actualAvailable < 0 ? 0 : actualAvailable,
        pendingEscrow: pending,
        totalWithdrawn: w.filter(x => x.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0)
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleWithdrawalRequest = async () => {
    if (!user || stats.availableBalance <= 0) return;
    
    if (!primaryWallet || !isSolanaWallet(primaryWallet)) {
      toast.error('Please connect your Solana wallet to withdraw');
      setShowAuthFlow(true);
      return;
    }

    const walletAddress = primaryWallet.address;
    const amountToWithdraw = stats.availableBalance;
    
    setModalConfig({
      isOpen: true,
      title: 'Confirm Immediate Withdrawal',
      message: `Withdraw ${amountToWithdraw} RENTX tokens? This will be transferred immediately from our treasury to your wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`,
      type: 'confirm',
      onConfirm: async () => {
        setWithdrawing(true);
        try {
          // 1. Call API for Solana transfer (treasury → provider wallet)
          const response = await fetch('/api/marketplace/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: amountToWithdraw,
              walletAddress: walletAddress
            })
          });
          
          const text = await response.text();
          let result;
          try {
            result = JSON.parse(text);
          } catch {
            console.error('Non-JSON response from withdraw API:', text.slice(0, 200));
            toast.error('Server error. Please try again later.');
            setWithdrawing(false);
            return;
          }
          
          if (response.ok && result.success) {
            // 2. Create withdrawal record in Firestore (client-side)
            await createWithdrawal({
              providerId: user.uid,
              amount: amountToWithdraw,
              solanaWallet: walletAddress,
              status: 'completed',
              transactionSignature: result.txHash,
            });

            toast.success('Withdrawal successful! Funds sent to your wallet.');
            await loadData();
          } else {
            toast.error(result.error || 'Withdrawal failed. Please try again later.');
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to process withdrawal request');
        }
        setWithdrawing(false);
      }
    });
  };

  const handleSwitchToBuying = () => {
    router.push('/marketplace');
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/provider' },
    { label: 'My Services', icon: Package, href: '/marketplace/dashboard/provider/services' },
    { label: 'Bookings', icon: BookOpen, href: '/marketplace/dashboard/provider/bookings' },
    { label: 'Wallet', icon: Wallet, href: '/marketplace/dashboard/provider/wallet', active: true },
    { label: 'History', icon: History, href: '/marketplace/dashboard/history' },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/provider/profile' },
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
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 text-sm w-full transition-all font-medium"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-bold">Earnings & Wallet</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Provider Mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {primaryWallet ? (
              <div className="flex items-center gap-2 bg-white/5 pl-3 pr-1 py-1 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {primaryWallet.address.slice(0, 4)}...{primaryWallet.address.slice(-4)}
                </span>
                <button 
                  onClick={() => handleLogOut()}
                  className="p-1.5 hover:bg-white/10 rounded-full text-gray-500 hover:text-red-400 transition-colors"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthFlow(true)}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/20 transition-all text-[10px] font-bold uppercase tracking-widest"
              >
                <Wallet className="w-3 h-3" /> Connect Wallet
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Solana Mainnet-beta</span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Wallet className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Available</span>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.availableBalance} <span className="text-xs text-gray-500 font-medium">RENTX</span></div>
              <button
                onClick={handleWithdrawalRequest}
                disabled={withdrawing || stats.availableBalance <= 0}
                className="mt-4 w-full bg-primary text-black py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {withdrawing ? 'Processing...' : <><ArrowUpRight className="w-3.5 h-3.5" /> Withdraw to Wallet</>}
              </button>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Clock className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">In Escrow</span>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.pendingEscrow} <span className="text-xs text-gray-500 font-medium">RENTX</span></div>
              <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Released once client marks as done</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><TrendingUp className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Total Earned</span>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalEarnings} <span className="text-xs text-gray-500 font-medium">RENTX</span></div>
              <div className="h-1.5 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><History className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Withdrawn</span>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalWithdrawn} <span className="text-xs text-gray-500 font-medium">RENTX</span></div>
              <p className="text-[10px] text-gray-500 mt-2">Transferred to your Solana address</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Payments */}
            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Recent Payments</h3>
                <Link 
                  href="/marketplace/dashboard/history?filter=payment"
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {payments.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 text-sm">No payment history found</div>
                ) : (
                  (viewAllPayments ? payments : payments.slice(0, 5)).map((p) => (
                    <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.status === 'released' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {p.status === 'released' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold">Booking #{p.bookingId.slice(-6)}</div>
                          <div className="text-[10px] text-gray-500">{formatDate(p.createdAt, 'MMM dd, yyyy')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">+{p.amount} RENTX</div>
                      {(() => {
                        const booking = bookings.find(bk => bk.id === p.bookingId);
                        const isReleased = p.status === 'released' || (booking && booking.status === 'confirmed');
                        return (
                          <div className={`text-[10px] font-bold uppercase ${isReleased ? 'text-green-500' : 'text-yellow-500'}`}>
                            {isReleased ? 'released' : p.status}
                          </div>
                        );
                      })()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Withdrawal History */}
            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-error" /> Withdrawal History</h3>
                <Link 
                  href="/marketplace/dashboard/history?filter=withdrawal"
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {withdrawals.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 text-sm">No withdrawal history found</div>
                ) : (
                  (viewAllWithdrawals ? withdrawals : withdrawals.slice(0, 5)).map((w) => (
                    <div key={w.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${w.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold truncate max-w-[150px]">{w.solanaWallet.slice(0, 8)}...{w.solanaWallet.slice(-8)}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500">{formatDate(w.createdAt, 'MMM dd, yyyy')}</span>
                            {w.transactionSignature && (
                              <a 
                                href={`https://solscan.io/tx/${w.transactionSignature}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                              >
                                <ArrowUpRight className="w-2.5 h-2.5" /> Solscan
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">-{w.amount} RENTX</div>
                        <div className={`text-[10px] font-bold uppercase ${w.status === 'completed' ? 'text-blue-500' : 'text-yellow-500'}`}>{w.status}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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
