'use client'

import React from 'react'
import Link from 'next/link'

export function MarketplaceNavbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-surface-dim/80 shadow-[0_0_15px_rgba(0,163,255,0.1)]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-colors" />
            <img src="/rentx-coin.png" alt="RENTX Coin" className="relative w-full h-full object-contain drop-shadow-xl" />
          </div>
          <div className="font-bold text-[28px] md:text-[32px] leading-[40px] tracking-widest text-gradient-brand transition-all duration-300" style={{ fontFamily: 'var(--font-heading)' }}>
            RENTX <span className="text-primary text-sm tracking-normal uppercase ml-2 hidden sm:inline-block border border-primary/30 bg-primary/10 px-2 py-1 rounded-md">Marketplace</span>
          </div>
        </Link>

        {/* CTA */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/" className="text-on-surface-variant hover:text-secondary transition-colors duration-300 text-xs sm:text-sm font-medium hidden sm:block">
            RENTX Token
          </Link>
          <button className="bg-primary text-on-primary px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20">
            List a Service
          </button>
        </div>
      </div>
    </nav>
  )
}
