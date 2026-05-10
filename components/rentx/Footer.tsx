'use client'

import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gradient-to-b from-surface to-surface-container-lowest">
      {/* Sleeping Mascot Quote */}
      <div className="py-16 border-b border-white/5 bg-surface-container-lowest/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <img
            alt="Sleeping penguin mascot"
            className="w-44 mb-8 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 drop-shadow-[0_0_30px_rgba(152,203,255,0.1)]"
            src="/sleeping pengu.png"
          />
          <p className="text-sm text-on-surface-variant text-center max-w-2xl italic leading-relaxed">
            Rest easy knowing the rental economy is secured by transparent, decentralized protocols. RENTX is more than a token; it&apos;s the future of utility.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-12 gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-[32px] leading-[40px] font-bold text-on-surface tracking-[-0.01em]" style={{ fontFamily: 'var(--font-heading)' }}>RENTX</div>
          <p className="text-sm text-on-surface-variant max-w-xs text-center md:text-left">
            The community-driven rental ecosystem built on Solana.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors text-sm">Privacy Policy</Link>
          <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors text-sm">Terms of Service</Link>
          <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors text-sm">Discord</Link>
          <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors text-sm">Telegram</Link>
          <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors text-sm">Documentation</Link>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="p-6 glass-card rounded-xl">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 opacity-50" style={{ fontFamily: 'var(--font-mono)' }}>
            LEGAL DISCLAIMER (Section 10)
          </p>
          <p className="text-[12px] leading-relaxed text-on-surface-variant opacity-40">
            RENTX is a utility token and does not represent an investment, equity, or share in any entity. The ecosystem is designed for rental interactions. Users are responsible for local compliance. Rental of adult services, illegal goods, or weapons is strictly prohibited by the protocol.
          </p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-secondary-fixed">© 2026 RENTX Ecosystem. Powered by Solana.</p>
        </div>
      </div>
    </footer>
  )
}
