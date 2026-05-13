'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import NotificationBell from './NotificationBell'
import { User, LogIn, Plus, LayoutDashboard, UserCircle, LogOut, Repeat, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function MarketplaceNavbar() {
  const { user, userProfile, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-[#050505]/80 shadow-[0_0_15px_rgba(0,163,255,0.1)]">
      <div className="flex justify-between items-center w-full px-6 py-3.5 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 md:w-11 md:h-11 flex-shrink-0 transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-colors" />
            <img src="/rentx-coin.png" alt="RENTX Coin" className="relative w-full h-full object-contain drop-shadow-xl" />
          </div>
          <div className="font-bold text-2xl md:text-3xl leading-[40px] tracking-widest text-gradient-brand transition-all duration-300" style={{ fontFamily: 'var(--font-heading)' }}>
            RENTX <span className="text-primary text-[10px] tracking-widest uppercase ml-2 hidden sm:inline-block border border-primary/30 bg-primary/10 px-2 py-0.5 rounded font-black">Marketplace</span>
          </div>
        </Link>

        {/* Navigation & Auth */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link href="/marketplace" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs font-bold uppercase tracking-widest hidden md:block">
            Browse Services
          </Link>
          
          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

          {user ? (
            <>
              <NotificationBell />
              <Link 
                href="/marketplace/dashboard/provider/services?new=true" 
                className="hidden lg:flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20"
              >
                <Plus className="w-3.5 h-3.5" /> List Service
              </Link>
              
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group overflow-hidden ${isMenuOpen ? 'bg-white/10 border-primary/50' : ''}`}
                >
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-xs uppercase group-hover:bg-primary/20 transition-all">
                    {userProfile?.displayName?.[0] || user?.email?.[0] || <User className="w-4 h-4 text-gray-400 group-hover:text-white" />}
                  </div>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 z-[100]">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                      <div className="font-bold text-sm truncate">{userProfile?.displayName || 'User'}</div>
                      <div className="text-[10px] text-gray-500 truncate">{user?.email}</div>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <Link 
                        href="/marketplace/dashboard/provider"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-primary hover:bg-primary/10 transition-all group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Provider Dashboard
                      </Link>
                      
                      <Link 
                        href="/marketplace/dashboard/client"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Buying Dashboard
                      </Link>

                      <Link 
                        href="/marketplace/dashboard/client/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserCircle className="w-4 h-4" />
                        My Profile
                      </Link>
                    </div>

                    <div className="p-2 border-t border-white/5">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/marketplace/auth" 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link 
                href="/marketplace/auth?tab=register"
                className="bg-primary text-black px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
