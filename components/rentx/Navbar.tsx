'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, X, Download, ArrowRight, Wallet } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [showDownloadModal, setShowDownloadModal] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDownload = () => {
    setShowDownloadModal(true)
    setTimeout(() => setShowDownloadModal(false), 3000)
    const link = document.createElement('a')
    link.href = '/RENTX WHITEPAPER.pdf'
    link.download = 'RENTX_Whitepaper.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
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
          <div className="hidden md:flex items-center gap-1 glass-card border border-white/5 bg-surface/30 px-2 py-1.5 rounded-full shadow-inner">
            <Link href="/#mission" className="text-on-surface-variant hover:text-white hover:bg-white/5 px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium">Mission</Link>
            <Link href="/#roadmap" className="text-on-surface-variant hover:text-white hover:bg-white/5 px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium">Roadmap</Link>
            <Link href="/#tokenomics" className="text-on-surface-variant hover:text-white hover:bg-white/5 px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium">Tokenomics</Link>
            <Link href="/#services" className="text-on-surface-variant hover:text-white hover:bg-white/5 px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium">Services</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={handleDownload} className="group flex items-center gap-2 text-on-surface-variant hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium">
              <Download size={14} className="opacity-50 group-hover:opacity-100 group-hover:text-secondary transition-all" /> Whitepaper
            </button>
            <Link href="/marketplace" className="group relative px-5 py-2.5 rounded-full font-bold transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-full group-hover:bg-primary/20 transition-colors" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[linear-gradient(90deg,transparent,rgba(0,163,255,0.4),transparent)] -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 text-primary group-hover:text-white transition-colors flex items-center gap-2 text-sm">
                 Marketplace <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/buyrentx" className="group relative bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(0,163,255,0.4)] hover:shadow-[0_0_25px_rgba(0,163,255,0.6)] overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">Buy RENTX <Wallet size={14} className="group-hover:rotate-12 transition-transform" /></span>
            </Link>
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
              <Link href="/#mission" onClick={() => setIsOpen(false)} className="text-on-surface hover:text-primary transition-colors py-2">Mission</Link>
              <Link href="/#roadmap" onClick={() => setIsOpen(false)} className="text-on-surface hover:text-primary transition-colors py-2">Roadmap</Link>
              <Link href="/#tokenomics" onClick={() => setIsOpen(false)} className="text-on-surface hover:text-primary transition-colors py-2">Tokenomics</Link>
              <Link href="/#services" onClick={() => setIsOpen(false)} className="text-on-surface hover:text-primary transition-colors py-2">Services</Link>
              <button onClick={() => { setIsOpen(false); handleDownload(); }} className="text-on-surface hover:text-primary transition-colors py-2 text-left">Whitepaper</button>
              <Link href="/marketplace" className="border border-primary/50 text-primary hover:bg-primary/10 w-full py-3 rounded-xl font-bold mt-2 text-center block">Marketplace</Link>
              <Link href="/buyrentx" onClick={() => setIsOpen(false)} className="bg-primary-container text-on-primary-container w-full py-3 rounded-xl font-bold mt-2 text-center block">Buy RENTX</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass-card border border-primary/30 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,163,255,0.2)] max-w-sm w-full text-center animate-in zoom-in-95 fade-in duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Downloading</h3>
            <p className="text-on-surface-variant text-sm">The RENTX Whitepaper is being downloaded to your device...</p>
          </div>
        </div>
      )}
    </>
  )
}
