'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Whitepaper', href: '#whitepaper' },
    { name: 'Tokenomics', href: '#tokenomics' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Community', href: '#community' },
  ];

  return (
    <nav className="relative bg-white/80 backdrop-blur-md border-b border-black/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-black/20 bg-white shadow-sm">
              <Image
                src="/logo.png"
                alt="GTTWRLD Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full group-hover:brightness-90 transition-all duration-300"
              />
            </div>
            <span
              className="text-xl sm:text-2xl font-bold hidden sm:inline"
              style={{
                fontFamily: "'Sweet Gothic Serif', serif",
                color: '#000000',
                letterSpacing: '0.05em',
              }}
            >
              GTTWRLD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-black hover:text-black/70 transition-colors duration-300"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Buy GTTWRLD Button */}
          <div className="hidden md:block">
            <Link href="/presale">
              <button
                className="px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base font-bold rounded-lg transition-all duration-300"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  backgroundColor: '#FFD600',
                  color: '#000000',
                  letterSpacing: '0.05em',
                  boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  element.style.backgroundColor = '#FFF176';
                  element.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.8)';
                  element.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  element.style.backgroundColor = '#FFD600';
                  element.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)';
                  element.style.transform = 'scale(1)';
                }}
              >
                Buy GTTWRLD
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-black hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-black/80 backdrop-blur-md border-t border-black/20 px-4 py-4">
            <div className="space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-white hover:text-gray-600 transition-colors py-2"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Link href="/presale" onClick={() => setIsOpen(false)}>
                <button
                  className="w-full px-6 py-2 text-base font-bold rounded-lg transition-all duration-300"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                    backgroundColor: '#FFD600',
                    color: '#000000',
                    letterSpacing: '0.05em',
                  }}
                >
                  Buy GTTWRLD
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 200% 0;
          }
          50% {
            background-position: -200% 0;
          }
        }

        @font-face {
          font-family: 'Sweet Gothic Serif';
          src: url('/Font/sweet-gothic-serif-font/sweet-gothic-serif-bold.ttf') format('truetype');
          font-weight: bold;
        }

        @font-face {
          font-family: 'Sweet Gothic Serif';
          src: url('/Font/sweet-gothic-serif-font/sweet-gothic-serif-regular.ttf') format('truetype');
          font-weight: normal;
        }
      `}</style>
    </nav>
  );
}
