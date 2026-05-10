'use client'

import React from 'react'

export function Mission() {
  return (
    <section className="py-20" id="mission">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-card rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12" style={{ borderColor: 'rgba(255, 219, 157, 0.1)' }}>
          <div className="flex-1 space-y-6">
            <h2 className="text-[40px] md:text-[56px] leading-[1.15] font-bold text-secondary tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
              Our Vision
            </h2>
            <p className="text-on-surface-variant leading-relaxed text-base">
              RENTX aims to build a global rental marketplace community where users can easily discover and pay for short-term services and rentable equipment using one recognizable digital token. We bridge the gap between fragmented local listings and the efficiency of decentralized finance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Fast Global Payments</h4>
                  <p className="text-sm text-on-surface-variant">Solana&apos;s speed ensures near-instant settlements worldwide.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Community Listings</h4>
                  <p className="text-sm text-on-surface-variant">Vetted providers and peer-to-peer trust networks.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              alt="Penguin holding RENTX coin"
              className="w-full max-w-[360px] hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_40px_rgba(255,184,0,0.15)]"
              src="/pengu holding coin.png"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
