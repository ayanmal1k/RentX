'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-24 lg:pt-10">
      {/* Atmospheric shapes */}
      <div className="absolute top-16 -left-16 w-56 h-56 rounded-full bg-black/[0.05] blur-3xl" />
      <div className="absolute bottom-10 -right-20 w-72 h-72 rounded-full bg-black/[0.06] blur-3xl" />

      <div className="relative w-full max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-black/20 bg-white/80 mb-6">
            <span
              className="text-xs sm:text-sm uppercase tracking-[0.18em] text-black/75"
              style={{ fontFamily: "'Sweet Gothic Serif', serif" }}
            >
              The White World Of Blockchain
            </span>
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.08em] text-black mb-2"
            style={{ fontFamily: "'Sweet Gothic Serif', serif" }}
          >
            YO GOTTI WORLD
          </h2>

          <h1
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-[0.07em] text-black leading-[0.9]"
            style={{ fontFamily: "'Sweet Gothic Serif', serif" }}
          >
            GTTWRLD
          </h1>

          {/* Circular Logo moved between title and description */}
          <div className="mt-5 flex justify-center">
            <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden border-2 border-black/20 bg-white shadow-[0_14px_28px_rgba(0,0,0,0.18)] animate-float">
              <Image
                src="/logo.png"
                alt="Yo Gotti World Logo"
                width={250}
                height={250}
                className="object-cover"
                style={{ width: '250px', height: '250px', maxWidth: '250px', maxHeight: '250px' }}
              />
            </div>
          </div>

          <p
            className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-black/75"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
              letterSpacing: '0.2px',
            }}
          >
            A culture-first Solana ecosystem built for long-term community value. Join the movement and access presale phases before public expansion.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <a href="/presale">
              <Button
                className="px-10 sm:px-12 py-4 text-base sm:text-lg font-bold"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  borderRadius: '0.75rem',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#222222';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 14px 28px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Buy GTTWRLD
              </Button>
            </a>

            <a href="#roadmap">
              <Button
                className="px-10 sm:px-12 py-4 text-base sm:text-lg font-bold"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  backgroundColor: 'transparent',
                  color: '#000000',
                  border: '2px solid #000000',
                  borderRadius: '0.75rem',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 14px 28px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Explore Roadmap
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <div className="px-4 py-2 rounded-lg border border-black/15 bg-white/80 text-black/80 text-xs sm:text-sm" style={{ fontFamily: "'Sweet Gothic Serif', serif" }}>
              5 Presale Phases
            </div>
            <div className="px-4 py-2 rounded-lg border border-black/15 bg-white/80 text-black/80 text-xs sm:text-sm" style={{ fontFamily: "'Sweet Gothic Serif', serif" }}>
              900M Total Supply
            </div>
            <div className="px-4 py-2 rounded-lg border border-black/15 bg-white/80 text-black/80 text-xs sm:text-sm" style={{ fontFamily: "'Sweet Gothic Serif', serif" }}>
              Solana Token
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulseRing {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.04);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-pulseRing {
          animation: pulseRing 4s ease-in-out infinite;
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
    </section>
  );
}
