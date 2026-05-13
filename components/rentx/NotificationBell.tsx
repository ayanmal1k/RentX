'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Check, ExternalLink, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { subscribeToNotifications, markNotificationRead, Notification } from '@/lib/firestore-helpers';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToNotifications(user.uid, (notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking': return '📅';
      case 'payment': return '💰';
      case 'review': return '⭐';
      default: return '🔔';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-gray-400 hover:text-white"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-black" />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="font-bold text-sm">Notifications</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <Bell className="w-8 h-8 text-white/5 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors relative group ${!n.read ? 'bg-primary/[0.03]' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h4 className={`text-sm font-bold truncate ${!n.read ? 'text-white' : 'text-gray-400'}`}>
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-gray-500 whitespace-nowrap">
                            {n.createdAt && formatDistanceToNow(n.createdAt instanceof Date ? n.createdAt : (n.createdAt as any).toDate(), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-2">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-3">
                          {n.link && (
                            <Link 
                              href={n.link}
                              onClick={() => setIsOpen(false)}
                              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                            >
                              View Details <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          )}
                          {!n.read && (
                            <button 
                              onClick={() => n.id && handleMarkRead(n.id)}
                              className="text-[10px] font-bold text-gray-500 hover:text-green-500 flex items-center gap-1"
                            >
                              Mark Read <Check className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) )
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-white/5 text-center">
                <button className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-wider">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
