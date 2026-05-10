'use client'

import React from 'react'
import { ArrowRight, Zap, ShieldCheck, Activity } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-12 overflow-hidden bg-background">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Primary Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tertiary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-2 gap-16 lg:gap-20 xl:gap-24 items-center w-full relative z-10">
        {/* Left: Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low/50 border border-primary/20 backdrop-blur-md mb-8 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Zap className="text-secondary-container w-4 h-4" />
            <span className="text-on-surface-variant text-[11px] tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              The Future of <span className="text-primary font-bold">Utility</span>
            </span>
          </div>

          <h1 className="text-[34px] sm:text-[42px] md:text-[50px] lg:text-[64px] xl:text-[76px] leading-[1.15] mb-6 text-white tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
            RENTX: <br className="hidden md:block" />
            Global Currency for the{' '}
            <span className="relative inline-block mt-2 md:mt-0">
              <span className="text-gradient-brand relative z-10">Rental Economy</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-primary/20 blur-sm rounded-full" />
            </span>
          </h1>

          <p className="text-on-surface-variant mb-10 max-w-[95%] sm:max-w-lg md:max-w-xl lg:max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            Simple, fast, and community-driven rentals powered by Solana. Unlock global listings with the efficiency of decentralized blockchain technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start mb-12">
            <button className="group relative w-full sm:w-auto bg-primary text-on-primary px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-bold text-base md:text-lg lg:text-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 overflow-hidden shadow-[0_0_20px_rgba(152,203,255,0.2)] hover:shadow-[0_0_30px_rgba(152,203,255,0.4)]">
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">Explore Marketplace <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
            </button>
            <button className="w-full sm:w-auto border border-outline-variant bg-surface/40 hover:bg-surface-variant hover:border-primary/50 text-on-surface px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-bold text-base md:text-lg lg:text-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 backdrop-blur-md">
              Buy RENTX
            </button>
          </div>

          {/* Mini Stats under buttons */}
          <div className="flex flex-wrap items-center gap-6 text-xs lg:text-sm text-on-surface-variant/70 border-t border-white/5 pt-6 w-full max-w-sm lg:max-w-md justify-center md:justify-start" style={{ fontFamily: 'var(--font-mono)' }}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-primary" />
              <span>Secure Smart Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-secondary-container" />
              <span>&lt;1s Finality</span>
            </div>
          </div>
        </div>

        {/* Right: Floating Graphic */}
        <div className="relative w-full flex justify-center items-center order-1 md:order-2 mb-12 md:mb-0">
          {/* Complex Glow Rings */}
          <div className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] lg:w-[580px] lg:h-[580px] xl:w-[700px] xl:h-[700px] border border-dashed border-tertiary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          
          <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-primary/20 to-tertiary/10 blur-[80px] rounded-full animate-pulse-slow" />
          
          <img
            alt="RENTX Logo with Penguin Mascot"
            className="relative z-10 w-[85%] sm:w-[70%] md:w-[90%] max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] animate-float"
            src="/RENTX Logo.png"
            style={{ filter: 'drop-shadow(0px 20px 40px rgba(0, 163, 255, 0.3))' }}
          />

          {/* Floating UI Elements */}
          <div className="absolute -left-2 sm:left-4 top-1/4 glass-card px-4 py-2 rounded-lg border border-primary/20 animate-float z-20 hidden sm:block" style={{ animationDelay: '1s' }}>
             <div className="flex items-center gap-2 text-xs font-bold text-on-surface" style={{ fontFamily: 'var(--font-mono)' }}>
               <div className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
               Live on Solana
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
