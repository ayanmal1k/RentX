'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/rentx/NotificationBell';
import { useAuth } from '@/lib/auth-context';
import {
  ShieldAlert, Settings, BarChart3, Users, Package,
  BookOpen, CreditCard, ArrowUpRight, LogOut, Menu,
  Save, Globe, Lock, Bell, Database, Shield
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, userProfile, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const NAV_ITEMS = [
    { label: 'Overview', icon: BarChart3, href: '/marketplace/admin' },
    { label: 'User Management', icon: Users, href: '/marketplace/admin/users' },
    { label: 'Service Moderation', icon: Package, href: '/marketplace/admin/services' },
    { label: 'Platform Bookings', icon: BookOpen, href: '/marketplace/admin/bookings' },
    { label: 'Withdrawal Requests', icon: ArrowUpRight, href: '/marketplace/admin/withdrawals' },
    { label: 'Payment Logs', icon: CreditCard, href: '/marketplace/admin/payments' },
    { label: 'System Settings', icon: Settings, href: '/marketplace/admin/settings', active: true },
  ];

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
        <div className="p-4 border-t border-white/5 text-center">
           <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:text-red-400 text-sm w-full transition-all"><LogOut className="w-4 h-4" /> Exit Admin</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">System Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-primary text-black px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-primary/80 transition-all">
              <Save className="w-3.5 h-3.5" /> SAVE CHANGES
            </button>
            <NotificationBell />
          </div>
        </header>

        <main className="p-6 max-w-4xl">
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-6"><Globe className="w-4 h-4 text-primary" /> General Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Platform Fee (%)</label>
                  <input type="number" defaultValue="5" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Treasury Wallet (SOL)</label>
                  <input type="text" defaultValue="RENTx...Treasury" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-6"><Shield className="w-4 h-4 text-blue-500" /> Security & Access</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <div className="text-sm font-bold">Require Provider Verification</div>
                    <div className="text-[10px] text-gray-500">Only verified providers can post new listings.</div>
                  </div>
                  <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full" /></div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <div className="text-sm font-bold">Maintenance Mode</div>
                    <div className="text-[10px] text-gray-500">Disable marketplace features for system maintenance.</div>
                  </div>
                  <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-3 h-3 bg-gray-500 rounded-full" /></div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-6"><Bell className="w-4 h-4 text-yellow-500" /> Notification Triggers</h3>
              <div className="space-y-4 text-xs text-gray-400">
                <p>Configure which system events trigger real-time notifications for users.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg font-bold">New Booking</span>
                  <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg font-bold">Payment Released</span>
                  <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg font-bold">Withdrawal Success</span>
                  <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg font-bold text-gray-500 line-through">System Broadcast</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
