'use client'

import React from 'react'
import Link from 'next/link'
import { Home, ShoppingBag, ArrowRight } from 'lucide-react'

export function BuyNavbar() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl transition-all duration-700 border-b border-white/5 ${
      scrolled ? 'bg-[#050505]/80 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : 'bg-transparent py-7'
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        {/* Logo and Text on Left */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-colors" />
            <img src="/rentx-coin.png" alt="RENTX Coin" className="relative w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <div className="flex flex-col">
            <div className="font-black text-3xl md:text-4xl tracking-tighter text-gradient-brand leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
              RENTX
            </div>
            <div className="text-[10px] text-primary font-black tracking-[0.3em] uppercase mt-1.5 opacity-70">
              Presale Portal
            </div>
          </div>
        </Link>

        {/* Home and Marketplace Buttons on Right */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link 
            href="/" 
            className="flex items-center gap-2.5 px-6 py-3 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all duration-500 text-[11px] font-black uppercase tracking-[0.2em]"
          >
            <Home size={16} className="text-primary/60" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          
          <Link 
            href="/marketplace" 
            className="group relative flex items-center gap-2.5 px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden hover:scale-105 active:scale-95 shadow-2xl shadow-primary/10"
          >
            {/* Glossy background */}
            <div className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-full group-hover:bg-primary group-hover:border-primary transition-all duration-700" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[linear-gradient(90deg,transparent,white,transparent)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <span className="relative z-10 text-white group-hover:text-black transition-colors flex items-center gap-2.5">
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Marketplace</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
