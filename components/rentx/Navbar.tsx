'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 transition-all duration-500 ${scrolled ? 'bg-surface-dim/80 shadow-[0_0_15px_rgba(0,163,255,0.1)]' : 'bg-surface/60'}`}>
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-colors" />
            <img src="/rentx-coin.png" alt="RENTX Coin" className="relative w-full h-full object-contain drop-shadow-xl" />
          </div>
          <div className="font-bold text-[28px] md:text-[32px] leading-[40px] tracking-widest text-gradient-brand transition-all duration-300" style={{ fontFamily: 'var(--font-heading)' }}>
            RENTX
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#mission" className="text-on-surface-variant hover:text-primary transition-all duration-300 text-sm hover:scale-105">Mission</Link>
          <Link href="#roadmap" className="text-on-surface-variant hover:text-primary transition-all duration-300 text-sm hover:scale-105">Roadmap</Link>
          <Link href="#tokenomics" className="text-on-surface-variant hover:text-primary transition-all duration-300 text-sm hover:scale-105">Tokenomics</Link>
          <Link href="#services" className="text-on-surface-variant hover:text-primary transition-all duration-300 text-sm hover:scale-105">Services</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-secondary transition-colors duration-300 text-sm font-medium">Whitepaper</button>
          <button className="border border-primary/50 text-primary hover:bg-primary/10 px-5 py-2 rounded-full font-bold hover:scale-105 active:scale-95 transition-all duration-200">
            Marketplace
          </button>
          <button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-primary-container/20">
            Buy RENTX
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-on-surface">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
            <Link href="#mission" onClick={() => setIsOpen(false)} className="text-on-surface hover:text-primary transition-colors py-2">Mission</Link>
            <Link href="#roadmap" onClick={() => setIsOpen(false)} className="text-on-surface hover:text-primary transition-colors py-2">Roadmap</Link>
            <Link href="#tokenomics" onClick={() => setIsOpen(false)} className="text-on-surface hover:text-primary transition-colors py-2">Tokenomics</Link>
            <Link href="#services" onClick={() => setIsOpen(false)} className="text-on-surface hover:text-primary transition-colors py-2">Services</Link>
            <button className="border border-primary/50 text-primary hover:bg-primary/10 w-full py-3 rounded-xl font-bold mt-2">Marketplace</button>
            <button className="bg-primary-container text-on-primary-container w-full py-3 rounded-xl font-bold mt-2">Buy RENTX</button>
          </div>
        </div>
      )}
    </nav>
  )
}
