'use client'

import React from 'react'

export function Services() {
  return (
    <section className="py-20" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[40px] md:text-[56px] leading-[1.15] font-bold text-white mb-4 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
            What Can You Rent?
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-base">
            From expert skills to high-end hardware, RENTX covers every aspect of the gig economy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Services Card */}
          <div className="group glass-card-hover p-8 rounded-3xl">
            <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
            <h3 className="text-[32px] leading-[40px] font-semibold text-white mb-4 tracking-[-0.01em]" style={{ fontFamily: 'var(--font-heading)' }}>Services</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-on-surface-variant text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> Photography &amp; Video
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> Event DJs &amp; Live Music
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> Event Help &amp; Staffing
              </li>
            </ul>
          </div>

          {/* Equipment Card */}
          <div className="group glass-card-hover p-8 rounded-3xl lg:translate-y-8">
            <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </div>
            <h3 className="text-[32px] leading-[40px] font-semibold text-white mb-4 tracking-[-0.01em]" style={{ fontFamily: 'var(--font-heading)' }}>Equipment</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-on-surface-variant text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Lighting &amp; Stage Gear
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> High-End Cameras
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Tables &amp; Event Rentals
              </li>
            </ul>
          </div>

          {/* RENTX Coin Showcase Card */}
          <div className="hidden lg:flex items-center justify-center relative overflow-hidden rounded-3xl glass-card min-h-[360px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            {/* Sparkle effect overlay */}
            <div className="absolute inset-0 bg-sparkle opacity-30" />
            <img
              alt="RENTX Coin"
              className="w-3/4 relative z-10 animate-glow hover:scale-110 transition-transform duration-500"
              style={{ animationDuration: '3s' }}
              src="/rentx coin.png"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
