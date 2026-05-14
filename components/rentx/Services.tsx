'use client'

import React from 'react'
import { BadgeCheck, Box, CalendarClock, Sparkles, ShieldAlert, Users2 } from 'lucide-react'

const rentalCategories = [
  {
    icon: Users2,
    title: 'Services and Time-Based Rentals',
    accentClass: 'text-primary',
    iconBgClass: 'bg-primary/10',
    dotClass: 'bg-primary',
    borderColor: 'rgba(152, 203, 255, 0.16)',
    gradientClass: 'from-primary/20 via-primary/10 to-transparent',
    items: [
      'Event setup and cleanup helpers',
      'Photographers and videographers',
      'DJs, MCs, and hosts',
      'Promoters and flyer distribution helpers',
      'Translators',
      'Moving assistance',
      'Tutors and coaches',
      'Costume characters',
      'Platonic "rent-a-guest" attendance',
    ],
  },
  {
    icon: Box,
    title: 'Equipment and Gear Rentals',
    accentClass: 'text-secondary',
    iconBgClass: 'bg-secondary/10',
    dotClass: 'bg-secondary',
    borderColor: 'rgba(255, 219, 157, 0.16)',
    gradientClass: 'from-secondary/20 via-secondary/10 to-transparent',
    items: [
      'Speakers and microphones',
      'Lighting equipment',
      'Tables and chairs',
      'Cameras and projectors',
      'Decorations and props',
      'Tents and generators',
      'Legal tools and equipment',
      'And much more',
    ],
  },
]

const safetyRules = [
  'No adult or sexual services',
  'No childcare or services involving minors',
  'No “rent a kid” or under-18 work/services',
  'This platform is for renting items and services, not people themselves',
]

export function Services() {
  return (
    <section className="py-20 relative overflow-hidden" id="services">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-140px] right-[-80px] w-[420px] h-[420px] rounded-full bg-secondary/10 blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-xs tracking-[0.18em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
              What Can Be Rented With RENTX
            </span>
          </div>

          <h2 className="text-[40px] md:text-[56px] leading-[1.08] font-bold text-white mb-5 tracking-[-0.03em]" style={{ fontFamily: 'var(--font-heading)' }}>
            Rent almost anything across all categories.
          </h2>
          <p className="text-on-surface-variant max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            RENTX is built for real rentals: services, time-based help, and equipment. The platform is designed to feel broad and flexible while staying strict about safety and legality.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch mb-6">
          <div className="glass-card rounded-[32px] p-8 md:p-10 relative overflow-hidden border border-primary/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(152,203,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,219,157,0.08),transparent_38%)]" />
            <div className="absolute -right-12 top-8 w-40 h-40 rounded-full bg-primary/10 blur-[70px] animate-pulse" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary border border-primary/15">
                  <CalendarClock className="w-4 h-4" />
                  Time-based rentals
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary border border-secondary/15">
                  <Box className="w-4 h-4" />
                  Equipment and gear
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 border border-white/10">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  Safety-first marketplace
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {rentalCategories.map((category) => {
                  const Icon = category.icon

                  return (
                    <div
                      key={category.title}
                      className="group rounded-[26px] p-5 md:p-6 border bg-white/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:bg-white/10 relative overflow-hidden"
                      style={{ borderColor: category.borderColor }}
                    >
                      <div className={`absolute inset-0 rounded-[26px] bg-gradient-to-br ${category.gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl ${category.iconBgClass} flex items-center justify-center mb-5 border border-white/10`}>
                          <Icon className={`w-6 h-6 ${category.accentClass}`} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {category.title}
                        </h3>
                        <ul className="space-y-3">
                          {category.items.slice(0, 4).map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-on-surface-variant leading-relaxed">
                              <span className={`mt-1 w-2 h-2 rounded-full ${category.dotClass} shrink-0`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-[26px] p-5 md:p-6 bg-surface-container-high/40 border border-white/10">
                <p className="text-sm uppercase tracking-[0.18em] text-secondary mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
                  Examples you can actually list
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Photographers', 'DJs', 'Tutors', 'Moving help', 'Speakers', 'Lighting', 'Projectors', 'Tables', 'Generators'].map((item) => (
                    <span key={item} className="rounded-full bg-white/5 px-3 py-2 text-sm text-white/80 border border-white/10">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="glass-card rounded-[32px] p-8 md:p-10 border border-secondary/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5" />
              <div className="relative z-10 space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/15">
                  <ShieldAlert className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Non-negotiable safety restrictions
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                    RENTX is for items and services only. Anything involving adult services, minors, or people being treated as rentals is not allowed.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {safetyRules.map((rule) => (
                    <div key={rule} className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                      <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-sm md:text-[15px] text-white/80 leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[32px] p-8 md:p-10 border border-primary/10 relative overflow-hidden min-h-[260px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
              <div className="absolute inset-0 bg-sparkle opacity-25" />
              <div className="relative z-10 text-center max-w-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.18em] text-white/70 mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Built for broad rentals
                </div>
                <h3 className="text-2xl md:text-4xl font-semibold text-white mb-4 tracking-[-0.03em]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Services, gear, and everything in between.
                </h3>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                  A flexible rental marketplace with a clean, modern flow and clear boundaries that keep the platform safe and usable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
