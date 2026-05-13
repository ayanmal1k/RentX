'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  getClientBookings,
  getProviderBookings,
  getProviderWithdrawals,
  Booking,
  Withdrawal
} from '@/lib/firestore-helpers';
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Filter,
  Search,
  LogOut,
  Calendar,
  Package,
  BookOpen,
  LayoutDashboard,
  Wallet,
  UserCircle,
  ShoppingBag,
  Menu
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import NotificationBell from '@/components/rentx/NotificationBell';

type Transaction = {
  id: string;
  type: 'booking_payment' | 'withdrawal' | 'earning';
  amount: number;
  status: string;
  date: Date;
  title: string;
  txHash?: string;
  relatedId?: string;
};

export default function HistoryPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') as 'all' | 'payment' | 'withdrawal' || 'all';
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'payment' | 'withdrawal'>(initialFilter);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    const queryFilter = searchParams.get('filter');
    if (queryFilter && (queryFilter === 'payment' || queryFilter === 'withdrawal' || queryFilter === 'all')) {
      setFilter(queryFilter as any);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/marketplace/auth');
  }, [authLoading, user]);

  useEffect(() => {
    if (user && userProfile) loadHistory();
  }, [user, userProfile]);

  const loadHistory = async () => {
    if (!user || !userProfile) return;
    setLoading(true);
    try {
      const allTransactions: Transaction[] = [];

      // Always try to fetch everything to ensure no data is missed if role is inconsistent
      const [clientBookings, providerBookings, withdrawals] = await Promise.all([
        getClientBookings(user.uid).catch(() => []),
        getProviderBookings(user.uid).catch(() => []),
        getProviderWithdrawals(user.uid).catch(() => [])
      ]);

      // Process Client Bookings (as a buyer)
      clientBookings.forEach(b => {
        allTransactions.push({
          id: b.id!,
          type: 'booking_payment',
          amount: b.packagePrice,
          status: b.status,
          date: b.createdAt && typeof b.createdAt === 'object' && 'seconds' in (b.createdAt as any) 
                ? new Date((b.createdAt as any).seconds * 1000) 
                : (b.createdAt instanceof Date ? b.createdAt : new Date()),
          title: `Payment for ${b.serviceTitle}`,
          txHash: b.paymentTxHash,
          relatedId: b.id
        });
      });

      // Process Provider Bookings (as an earner)
      providerBookings.forEach(b => {
        if (b.status === 'completed' || b.status === 'confirmed') {
          allTransactions.push({
            id: b.id!,
            type: 'earning',
            amount: b.packagePrice,
            status: b.status,
            date: b.updatedAt && typeof b.updatedAt === 'object' && 'seconds' in (b.updatedAt as any)
                  ? new Date((b.updatedAt as any).seconds * 1000)
                  : (b.updatedAt instanceof Date ? b.updatedAt : new Date()),
            title: `Earning from ${b.serviceTitle}`,
            relatedId: b.id
          });
        }
      });

      // Process Withdrawals
      withdrawals.forEach(w => {
        allTransactions.push({
          id: w.id!,
          type: 'withdrawal',
          amount: w.amount,
          status: w.status,
          date: w.createdAt && typeof w.createdAt === 'object' && 'seconds' in (w.createdAt as any)
                ? new Date((w.createdAt as any).seconds * 1000)
                : (w.createdAt instanceof Date ? w.createdAt : new Date()),
          title: 'Withdrawal to Wallet',
          txHash: w.transactionSignature,
          relatedId: w.id
        });
      });

      // Update provider status if any provider activity exists
      if (providerBookings.length > 0 || withdrawals.length > 0 || userProfile.role === 'provider') {
        setIsProvider(true);
      }

      setTransactions(allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime()));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const navItems = isProvider ? [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/provider' },
    { label: 'My Services', icon: Package, href: '/marketplace/dashboard/provider/services' },
    { label: 'Bookings', icon: BookOpen, href: '/marketplace/dashboard/provider/bookings' },
    { label: 'Wallet', icon: Wallet, href: '/marketplace/dashboard/provider/wallet' },
    { label: 'History', icon: History, href: '/marketplace/dashboard/history', active: true },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/provider/profile' },
  ] : [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/client' },
    { label: 'My Bookings', icon: ShoppingBag, href: '/marketplace/dashboard/client/bookings' },
    { label: 'History', icon: History, href: '/marketplace/dashboard/history', active: true },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/client/profile' },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'payment') return t.type === 'booking_payment' || t.type === 'earning';
    if (filter === 'withdrawal') return t.type === 'withdrawal';
    return true;
  });

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5">
          <Link href="/marketplace" className="flex items-center gap-3"><div className="w-8 h-8"><img src="/rentx-coin.png" alt="RENTX" className="w-full h-full object-contain" /></div><div className="font-bold text-lg tracking-widest text-gradient-brand">RENTX</div></Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Icon className="w-4 h-4" />{item.label}</Link>);
          })}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-2">
          {isProvider && (
            <button 
              onClick={() => router.push('/marketplace')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 text-xs w-full transition-all font-bold uppercase tracking-widest"
            >
              <ShoppingBag className="w-4 h-4" /> Switch to Buying
            </button>
          )}
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 text-xs w-full transition-all font-medium"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400"><Menu className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">Transaction History</h1>
            {isProvider && (
              <div className="hidden sm:flex items-center gap-2 ml-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Provider Mode</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="bg-transparent border-none text-xs text-gray-300 focus:outline-none">
                <option value="all">All Transactions</option>
                <option value="payment">Payments</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        <th className="px-6 py-4">Transaction</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5" />
                              <div className="space-y-2">
                                <div className="h-4 w-32 bg-white/5 rounded" />
                                <div className="h-3 w-20 bg-white/5 rounded" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-4 w-16 bg-white/5 rounded" />
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-5 w-16 bg-white/5 rounded" />
                          </td>
                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              <div className="h-3 w-20 bg-white/5 rounded" />
                              <div className="h-2 w-12 bg-white/5 rounded" />
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-3 w-16 bg-white/5 rounded" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/5">
                <History className="w-16 h-16 text-white/10 mb-6" />
                <h3 className="text-xl font-bold mb-2">No transactions yet</h3>
                <p className="text-gray-400 text-sm">Your on-chain activity will appear here once you make a booking or withdrawal.</p>
              </div>
            ) : (
              <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        <th className="px-6 py-4">Transaction</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredTransactions.map((t) => (
                        <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'withdrawal' ? 'bg-red-500/10 text-red-500' :
                                  t.type === 'earning' ? 'bg-green-500/10 text-green-500' :
                                    'bg-blue-500/10 text-blue-500'
                                }`}>
                                {t.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white">{t.title}</div>
                                <div className="text-[10px] text-gray-500 font-mono">ID: {t.id.slice(0, 12)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className={`text-sm font-bold ${t.type === 'withdrawal' ? 'text-white' : 'text-primary'}`}>
                              {t.type === 'withdrawal' ? '-' : '+'}{t.amount} RENTX
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${t.status === 'completed' || t.status === 'released' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                t.status === 'pending' || t.status === 'held' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                  'bg-red-500/10 text-red-500 border-red-500/20'
                              }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-xs text-gray-400 font-medium">
                              {formatDate(t.date, 'MMM dd, yyyy')}
                              <div className="text-[10px] text-gray-600 mt-0.5">{formatDate(t.date, 'HH:mm')}</div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {t.txHash ? (
                              <a
                                href={`https://solscan.io/tx/${t.txHash}`}
                                target="_blank"
                                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-primary transition-colors"
                              >
                                View TX <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-gray-700 italic">No Hash</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
