'use client'

import React from 'react'
import { Coins, BadgePercent, Gift, ShieldCheck } from 'lucide-react'

const utilities = [
  {
    icon: Coins,
    title: "Rental Payments",
    description: "Use RENTX as the universal payment token for all bookings, services, and equipment rentals across the marketplace.",
    accent: "primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "rgba(152, 203, 255, 0.15)",
    glowColor: "bg-primary/5"
  },
  {
    icon: BadgePercent,
    title: "Provider Discounts",
    description: "Providers who accept RENTX enjoy reduced listing fees and get priority placement in marketplace search results.",
    accent: "secondary",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    borderColor: "rgba(255, 219, 157, 0.15)",
    glowColor: "bg-secondary/5"
  },
  {
    icon: Gift,
    title: "Community Rewards",
    description: "Earn RENTX through referrals, social contests, ambassador programs, and featured listing promotions.",
    accent: "tertiary",
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
    borderColor: "rgba(210, 190, 255, 0.15)",
    glowColor: "bg-tertiary/5"
  },
  {
    icon: ShieldCheck,
    title: "Future Automation",
    description: "Smart contract escrow, on-chain reputation scores, and automated dispute resolution — all powered by RENTX.",
    accent: "primary",
    iconBg: "bg-primary-container/20",
    iconColor: "text-primary",
    borderColor: "rgba(152, 203, 255, 0.1)",
    glowColor: "bg-primary-container/5"
  }
]

export function TokenUtility() {
  return (
    <section className="py-20" id="utility">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6" style={{ borderColor: 'rgba(255, 219, 157, 0.2)' }}>
            <span className="text-secondary text-xs tracking-[0.05em] uppercase" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              Utility
            </span>
          </div>
          <h2 className="text-[40px] md:text-[56px] leading-[1.15] font-bold text-white mb-4 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
            What Powers{' '}
            <span className="text-gradient-brand">RENTX</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-base">
            More than just a currency — RENTX is the backbone of a global rental ecosystem with real-world utility built in from day one.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {utilities.map((util, i) => {
            const Icon = util.icon
            return (
              <div
                key={i}
                className="glass-card rounded-[28px] p-8 md:p-10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500"
                style={{ borderColor: util.borderColor }}
              >
                {/* Background glow on hover */}
                <div className={`absolute -top-20 -right-20 w-[250px] h-[250px] ${util.glowColor} blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="relative z-10">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl ${util.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={32} className={util.iconColor} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[24px] md:text-[28px] leading-[36px] font-bold text-white mb-3 tracking-[-0.01em]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {util.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed">
                        {util.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Central RENTX Coin visual */}
        <div className="flex justify-center mt-16 relative">
          <div className="absolute w-[200px] h-[200px] bg-secondary/10 blur-[60px] rounded-full" />
          <img
            src="/rentx coin.png"
            alt="RENTX utility coin"
            className="w-28 relative z-10 animate-glow opacity-60 hover:opacity-100 transition-opacity duration-500"
            style={{ animationDuration: '5s' }}
          />
        </div>
      </div>
    </section>
  )
}
