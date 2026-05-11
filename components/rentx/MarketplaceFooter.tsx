'use client'

import React from 'react'
import Link from 'next/link'

export function MarketplaceFooter() {
  return (
    <footer className="border-t border-white/5 bg-gradient-to-b from-surface to-surface-container-lowest">
      {/* Main Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-12 gap-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/marketplace" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-transform duration-500 group-hover:rotate-[15deg]">
              <img src="/rentx-coin.png" alt="RENTX Coin" className="relative w-full h-full object-contain drop-shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="font-bold text-[28px] md:text-[32px] leading-[40px] tracking-widest text-on-surface transition-colors duration-300 group-hover:text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              RENTX <span className="text-primary text-sm tracking-normal uppercase ml-2 border border-primary/30 bg-primary/10 px-2 py-1 rounded-md hidden md:inline-block">Marketplace</span>
            </div>
          </Link>
          <p className="text-sm text-on-surface-variant max-w-xs text-center md:text-left">
            The premier decentralized marketplace for global rentals.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-on-surface font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Explore</h4>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Services</Link>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Equipment</Link>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Talent</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-on-surface font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Providers</h4>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">List a Service</Link>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Provider Guidelines</Link>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Payments & Fees</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-on-surface font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Support</h4>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Help Center</Link>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Dispute Resolution</Link>
            <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm">About RENTX Token</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-8 border-t border-white/5 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-on-surface-variant/60">© 2026 RENTX Marketplace. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors">Listing Policy</Link>
        </div>
      </div>
    </footer>
  )
}
