'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getAllUsers, updateUser, UserProfile, UserRole } from '@/lib/firestore-helpers';
import {
  ShieldAlert, Users, ShieldCheck, UserPlus, Search, 
  Filter, MoreVertical, LayoutDashboard, Package, 
  BookOpen, CreditCard, Settings, LogOut, Menu, UserCircle,
  Mail, MapPin, Globe, Wallet, ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import NotificationBell from '@/components/rentx/NotificationBell';
import CustomModal from '@/components/rentx/CustomModal';

export default function AdminUsersPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

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
    if (userProfile?.role === 'admin') loadUsers();
  }, [userProfile]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const u = await getAllUsers();
      setUsers(u);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleRoleUpdate = async (uid: string, role: UserRole) => {
    setModalConfig({
      isOpen: true,
      title: 'Update User Role',
      message: `Are you sure you want to change this user's role to ${role}?`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          await updateUser(uid, { role });
          await loadUsers();
          setModalConfig({
            isOpen: true,
            title: 'Success',
            message: 'User role updated successfully.',
            type: 'info'
          });
        } catch (err) {
          console.error(err);
          setModalConfig({
            isOpen: true,
            title: 'Error',
            message: 'Failed to update user role.',
            type: 'error'
          });
        }
      }
    });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/admin' },
    { label: 'User Management', icon: Users, href: '/marketplace/admin/users', active: true },
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
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <div className="font-black text-xl tracking-tighter text-white">RENTX ADMIN</div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (<a key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}><Icon className="w-4 h-4" />{item.label}</a>);
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
            <h1 className="text-lg font-bold">User Directory</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..." 
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all w-64"
              />
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none [color-scheme:dark]"
            >
              <option value="all">All Roles</option>
              <option value="client">Clients</option>
              <option value="provider">Providers</option>
              <option value="admin">Admins</option>
            </select>
            <NotificationBell />
          </div>
        </header>

        <main className="p-6">
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">User Information</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Contact / Location</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Wallet</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">No users found matching your criteria</td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xs font-bold text-gray-500">
                               {u.displayName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">{u.displayName || 'Unnamed User'}</div>
                              <div className="text-[10px] text-gray-500 flex items-center gap-1"><Mail className="w-2.5 h-2.5" /> {u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <select 
                            value={u.role}
                            onChange={(e) => handleRoleUpdate(u.uid, e.target.value as UserRole)}
                            className={`text-[9px] font-black uppercase px-2 py-1 rounded border bg-transparent cursor-pointer focus:outline-none ${u.role === 'provider' ? 'text-purple-400 border-purple-400/20' : u.role === 'admin' ? 'text-red-400 border-red-400/20' : 'text-blue-400 border-blue-400/20'}`}
                          >
                            <option value="client" className="bg-black text-blue-400">Client</option>
                            <option value="provider" className="bg-black text-purple-400">Provider</option>
                            <option value="admin" className="bg-black text-red-400">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter flex flex-col gap-1">
                             <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {u.city || 'N/A'}, {u.country || 'N/A'}</span>
                             <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-green-500" /> Joined {u.createdAt && (u.createdAt as any).toDate ? format((u.createdAt as any).toDate(), 'MMM yyyy') : 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                             <Wallet className="w-3.5 h-3.5 text-gray-600" />
                             <span className="text-[10px] font-mono text-gray-500 truncate max-w-[120px]">{u.solanaWallet || 'No Wallet Linked'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"><MoreVertical className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
