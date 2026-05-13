'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getAllServicesAdmin, updateService, ServiceListing } from '@/lib/firestore-helpers';
import {
  ShieldAlert, Package, CheckCircle, XCircle, AlertCircle,
  Search, Filter, ChevronRight, BarChart3, Users, BookOpen,
  CreditCard, Settings, LogOut, Menu, ExternalLink, Eye
} from 'lucide-react';
import CustomModal from '@/components/rentx/CustomModal';

export default function AdminServicesPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

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

  useEffect(() => {
    if (!authLoading) {
      if (!user || userProfile?.role !== 'admin') router.push('/marketplace/dashboard/client');
    }
  }, [authLoading, user, userProfile]);

  useEffect(() => {
    if (userProfile?.role === 'admin') loadServices();
  }, [userProfile]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const s = await getAllServicesAdmin();
      setServices(s);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, status: ServiceListing['status']) => {
    setModalConfig({
      isOpen: true,
      title: 'Update Service Status',
      message: `Are you sure you want to mark this service as ${status}?`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          await updateService(id, { status });
          await loadServices();
          setModalConfig({
            isOpen: true,
            title: 'Success',
            message: `Service status updated to ${status}.`,
            type: 'info'
          });
        } catch (err) {
          console.error(err);
          setModalConfig({
            isOpen: true,
            title: 'Error',
            message: 'Failed to update service status.',
            type: 'error'
          });
        }
      }
    });
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const NAV_ITEMS = [
    { label: 'Overview', icon: BarChart3, href: '/marketplace/admin' },
    { label: 'User Management', icon: Users, href: '/marketplace/admin/users' },
    { label: 'Service Moderation', icon: Package, href: '/marketplace/admin/services', active: true },
    { label: 'Platform Bookings', icon: BookOpen, href: '/marketplace/admin/bookings' },
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
            <h1 className="text-lg font-bold">Service Moderation</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services or providers..."
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all w-64"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none [color-scheme:dark]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </header>

        <main className="p-6">
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Service Listing</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Provider</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Pricing</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-gray-500 italic">No services found matching your criteria</td>
                    </tr>
                  ) : (
                    filteredServices.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-6 py-5">
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{s.title}</div>
                            <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{s.city}, {s.country}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">{s.providerName.charAt(0)}</div>
                            <div className="text-xs font-bold text-gray-300">{s.providerName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded">{s.category}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-xs font-bold text-white">{s.packages?.[0]?.price} RENTX</div>
                          <div className="text-[9px] text-gray-600">Starting Price</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${s.status === 'active' ? 'text-green-500 border-green-500/20 bg-green-500/5' : s.status === 'suspended' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}`}>{s.status}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/marketplace/service/${s.id}`} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"><Eye className="w-4 h-4" /></Link>
                            {s.status === 'pending' || s.status === 'suspended' ? (
                              <button onClick={() => s.id && handleStatusUpdate(s.id, 'active')} className="p-2 hover:bg-green-500/20 rounded-lg text-gray-500 hover:text-green-500 transition-all" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                            ) : (
                              <button onClick={() => s.id && handleStatusUpdate(s.id, 'suspended')} className="p-2 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-500 transition-all" title="Suspend"><XCircle className="w-4 h-4" /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
            <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
            <p className="text-[11px] text-gray-400 font-medium">As an admin, your actions directly affect the marketplace visibility of services. Suspended services will not appear in the browse results or search.</p>
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
