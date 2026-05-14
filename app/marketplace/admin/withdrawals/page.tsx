'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getWithdrawalRequests, 
  updateWithdrawalStatus,
  createNotification,
  Withdrawal
} from '@/lib/firestore-helpers';
import { 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Wallet, 
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Users,
  Package,
  BookOpen,
  CreditCard,
  Settings,
  BarChart3,
  Menu,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import NotificationBell from '@/components/rentx/NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';
import CustomModal from '@/components/rentx/CustomModal';

export default function AdminWithdrawalsPage() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
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

  const NAV_ITEMS = [
    { label: 'Overview', icon: BarChart3, href: '/marketplace/admin' },
    { label: 'User Management', icon: Users, href: '/marketplace/admin/users' },
    { label: 'Service Moderation', icon: Package, href: '/marketplace/admin/services' },
    { label: 'Platform Bookings', icon: BookOpen, href: '/marketplace/admin/bookings' },
    { label: 'Withdrawal Requests', icon: ArrowUpRight, href: '/marketplace/admin/withdrawals', active: true },
    { label: 'Payment Logs', icon: CreditCard, href: '/marketplace/admin/payments' },
    { label: 'System Settings', icon: Settings, href: '/marketplace/admin/settings' },
  ];

  useEffect(() => {
    if (userProfile) {
      if (userProfile.role !== 'admin') {
        router.push('/marketplace/dashboard/client');
        return;
      }
      fetchWithdrawals();
    }
  }, [userProfile]);

  const fetchWithdrawals = async () => {
    try {
      const data = await getWithdrawalRequests();
      setWithdrawals(data as Withdrawal[]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleProcessWithdrawal = async (withdrawal: Withdrawal) => {
    if (!withdrawal.id) return;
    
    setModalConfig({
      isOpen: true,
      title: 'Confirm Payout',
      message: `Confirm payout of ${withdrawal.amount} RENTX to ${withdrawal.solanaWallet}?\n\nThis should only be done AFTER you have executed the transaction from the treasury wallet.`,
      type: 'confirm',
      onConfirm: async () => {
        setProcessingId(withdrawal.id!);
        try {
          await updateWithdrawalStatus(withdrawal.id!, 'completed');
          
          // Notify Provider
          await createNotification({
            userId: withdrawal.providerId,
            type: 'withdrawal',
            title: 'Withdrawal Processed!',
            message: `Your withdrawal of ${withdrawal.amount} RENTX has been processed and sent to your wallet.`,
            link: '/marketplace/dashboard/provider/wallet',
          });

          setModalConfig({
            isOpen: true,
            title: 'Success',
            message: 'Withdrawal marked as COMPLETED.',
            type: 'info'
          });
          fetchWithdrawals();
        } catch (err) {
          console.error(err);
          setModalConfig({
            isOpen: true,
            title: 'Error',
            message: 'Error processing withdrawal.',
            type: 'error'
          });
        }
        setProcessingId(null);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

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
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:text-red-400 text-sm w-full transition-all">
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">Withdrawal Moderation</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black border border-yellow-500/20 flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" /> {pendingCount} PENDING REQUESTS
            </div>
            <NotificationBell />
          </div>
        </header>

        <main className="p-6 space-y-8">
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Provider</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Wallet Details</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic text-sm">
                          No withdrawal requests found in the system.
                        </td>
                      </tr>
                    ) : (
                      withdrawals.map((w) => (
                        <motion.tr 
                          key={w.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-white/[0.01] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold font-mono text-gray-400">
                              ID: {w.providerId.substring(0, 12)}...
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-3 h-3 text-primary" />
                              <span className="text-xs font-mono text-white">
                                {w.solanaWallet.substring(0, 6)}...{w.solanaWallet.substring(w.solanaWallet.length - 4)}
                              </span>
                              <a 
                                href={`https://solscan.io/account/${w.solanaWallet}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-1 hover:bg-white/10 rounded transition-colors text-primary"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-black text-primary">
                              {w.amount.toLocaleString()} <span className="text-[10px]">RENTX</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {w.status === 'completed' ? (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded border border-green-500/20 text-green-500 bg-green-500/5 flex items-center gap-1 w-fit">
                                <CheckCircle className="w-3 h-3" /> Completed
                              </span>
                            ) : (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded border border-yellow-500/20 text-yellow-500 bg-yellow-500/5 flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {w.status === 'pending' && (
                              <button
                                onClick={() => handleProcessWithdrawal(w)}
                                disabled={processingId === w.id}
                                className="bg-primary hover:bg-primary-dark text-black px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ml-auto disabled:opacity-50"
                              >
                                {processingId === w.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <ArrowUpRight className="w-3 h-3" />
                                )}
                                PROCESS PAYOUT
                              </button>
                            )}
                            {w.status === 'completed' && (
                              <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1">
                                <ShieldCheck className="w-3 h-3 text-green-500" /> Settled
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-4 text-primary">
                 <ShieldCheck className="w-5 h-5" /> Payout Verification Protocol
               </h3>
               <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                 As an administrator, you are responsible for the final execution of RENTX token transfers from the platform's multi-sig treasury to the provider's verified Solana wallet. 
                 <br /><br />
                 1. Verify the RENTX balance in the treasury.<br />
                 2. Execute the SPL token transfer via the Admin Terminal.<br />
                 3. Once confirmed on-chain, mark the request as "Completed" here to update the provider's ledger.
               </p>
             </div>
             <ShieldAlert className="absolute -bottom-8 -right-8 w-48 h-48 text-primary/5 rotate-12" />
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
