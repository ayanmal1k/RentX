'use client';

import { useState } from 'react';

export function HowToBuySection() {
  const [copied, setCopied] = useState(false);
  const contractAddress = '9S6jxN7vNFP8mKqFKFbQzk2kJ7L5M9qP8R2hVwXyZ';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const steps = [
    {
      number: '01',
      title: 'Install a Solana Wallet',
      description: 'Install Phantom, Solflare, or another Solana-compatible wallet and securely save your recovery phrase.',
      icon: '👛',
    },
    {
      number: '02',
      title: 'Fund with SOL or USDC',
      description: 'Deposit SOL for network fees and keep enough SOL or USDC ready for your GTT presale purchase.',
      icon: '💸',
    },
    {
      number: '03',
      title: 'Open Presale Page',
      description: 'Go to the official presale page and verify the URL before connecting your wallet.',
      icon: '🔗',
    },
    {
      number: '04',
      title: 'Connect Solana Wallet',
      description: 'Click Connect Wallet and approve the connection request from your Solana wallet app.',
      icon: '✅',
    },
    {
      number: '05',
      title: 'Buy GTT Tokens',
      description: 'Enter your amount, review the current presale phase price, and confirm the transaction to buy GTT.',
      icon: '🚀',
    },
  ];

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Section Container */}
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider mb-4"
            style={{
              fontFamily: "'Sweet Gothic Serif', serif",
              color: '#000000',
              letterSpacing: '0.05em',
            }}
          >
            How to Buy GTT
          </h2>
          <p 
            className="text-base sm:text-lg text-black opacity-75 mt-4 max-w-2xl mx-auto"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            GTT is a Solana token. Follow these steps to buy during the active presale phase.
          </p>
        </div>

        {/* Desktop Horizontal Steps */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Horizontal connector line */}
            <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-black via-gray-600 to-black" 
              style={{
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
              }}
            ></div>

            {/* Steps Grid Horizontal */}
            <div className="grid grid-cols-5 gap-4 lg:gap-6">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="relative flex flex-col items-center"
                >
                  {/* Top Circle with Step Number */}
                  <div className="relative flex items-center justify-center mb-8 transition-all duration-300 hover:scale-110" style={{ width: '80px', height: '80px', zIndex: 10 }}>
                    {/* Outer glow circle */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #000000 100%)',
                        boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)',
                      }}
                    ></div>

                    {/* Inner black circle */}
                    <div 
                      className="absolute inset-2 rounded-full flex items-center justify-center bg-black"
                    >
                      <div 
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: "'Sweet Gothic Serif', serif",
                          color: '#ffffff',
                          backgroundClip: 'text',
                          animation: 'shimmer 3s ease-in-out infinite',
                        }}
                      >
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div
                    className="relative group border border-black rounded-lg p-4 lg:p-6 overflow-hidden transition-all duration-300 group-hover:shadow-2xl h-full w-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,1) 100%)',
                      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Shine overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
                      }}
                    ></div>

                    <div className="relative z-10">
                      <h3 
                        className="text-sm lg:text-base font-bold mb-2 text-black line-clamp-2"
                        style={{
                          fontFamily: "'Sweet Gothic Serif', serif",
                        }}
                      >
                        {step.title}
                      </h3>
                      <p 
                        className="text-xs lg:text-sm leading-relaxed text-black opacity-90"
                        style={{
                          fontFamily: "'Georgia', 'Garamond', serif",
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Steps */}
        <div className="md:hidden">
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-black via-gray-600 to-black"
              style={{
                transform: 'translateX(-50%)',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
              }}
            ></div>

            {/* Steps Grid */}
            <div className="space-y-8 sm:space-y-12">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`relative flex flex-col sm:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full sm:w-5/12">
                    <div
                      className="relative group border border-black rounded-lg p-6 sm:p-8 overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,1) 100%)',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Shine overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
                        }}
                      ></div>

                      <div className="relative z-10">
                        <h3 
                          className="text-lg sm:text-xl font-bold mb-2 text-black"
                          style={{
                            fontFamily: "'Sweet Gothic Serif', serif",
                          }}
                        >
                          {step.title}
                        </h3>
                        <p 
                          className="text-sm sm:text-base leading-relaxed text-black opacity-90"
                          style={{
                            fontFamily: "'Georgia', 'Garamond', serif",
                          }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Step Number */}
                  <div className="sm:hidden">
                    <div 
                      className="relative flex items-center justify-center"
                      style={{
                        width: '80px',
                        height: '80px',
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #000000 100%)',
                          boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
                        }}
                      ></div>

                      <div 
                        className="absolute inset-2 rounded-full flex items-center justify-center bg-black"
                      >
                        <div 
                          className="text-3xl font-bold"
                          style={{
                            fontFamily: "'Sweet Gothic Serif', serif",
                            color: '#ffffff',
                            backgroundClip: 'text',
                            animation: 'shimmer 3s ease-in-out infinite',
                          }}
                        >
                          {step.number}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="hidden sm:block sm:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contract Address Section */}
        <div className="mt-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-black/5 to-black/10 border border-black/20 rounded-xl p-6 sm:p-8 text-center">
            <p
              className="text-xs sm:text-sm uppercase tracking-widest mb-3 text-black/70"
              style={{
                fontFamily: "'Sweet Gothic Serif', serif",
              }}
            >
              GTT Contract Address
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <code
                className="bg-black/80 text-white px-4 py-3 rounded-lg text-xs sm:text-sm font-mono break-all flex-1 min-w-max"
                style={{
                  fontFamily: "'Georgia', 'Garamond', serif",
                }}
              >
                {contractAddress}
              </code>
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 rounded-lg font-bold transition-all duration-300 flex-shrink-0 whitespace-nowrap"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  backgroundColor: copied ? '#4CAF50' : '#000000',
                  color: '#FFFFFF',
                  letterSpacing: '0.05em',
                  boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.backgroundColor = '#333333';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
                  }
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block">
            <button
              className="px-10 sm:px-14 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "'Sweet Gothic Serif', serif",
                backgroundColor: '#000000',
                color: '#ffffff',
                letterSpacing: '0.05em',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                const element = e.currentTarget as HTMLElement;
                element.style.backgroundColor = '#333333';
                element.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                const element = e.currentTarget as HTMLElement;
                element.style.backgroundColor = '#000000';
                element.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
              }}
              onClick={() => {
                // Scroll to presale section or navigate
                window.location.href = '#presale';
              }}
            >
              Start Buying GTT
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
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
    </section>
  );
}
