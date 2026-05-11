'use client';

import { useState } from 'react';
import { Coins, Zap } from 'lucide-react';

export function EcosystemSection() {
  const allocationData = [
    {
      label: 'Diversified Investments',
      value: 90,
      description: 'Precious metals, gold, and other structured strategies',
      color: '#000000',
      icon: Coins,
    },
    {
      label: 'Ecosystem Development',
      value: 10,
      description: 'Marketing, infrastructure, and operational expansion',
      color: '#333333',
      icon: Zap,
    },
  ];

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Section Container */}
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider mb-4"
            style={{
              fontFamily: "'Sweet Gothic Serif', serif",
              color: '#000000',
              letterSpacing: '0.05em',
            }}
          >
            Capital Allocation
          </h2>
          <p 
            className="text-base sm:text-lg text-black opacity-75 mt-4"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            How we strategically deploy collected capital for long-term growth
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Data Cards */}
          <div className="space-y-6">
            {allocationData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  <div
                    className="relative bg-gradient-to-br from-gray-900 to-black border border-black rounded-lg p-6 sm:p-8 overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
                    style={{
                      boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
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
                      <div className="flex items-center gap-4 mb-4">
                        <div 
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: `${item.color}20`,
                          }}
                        >
                          <IconComponent 
                            size={28} 
                            color={item.color}
                            className="transition-all duration-300"
                          />
                        </div>
                        <div>
                          <h3 
                            className="text-lg sm:text-xl font-bold"
                            style={{
                              fontFamily: "'Sweet Gothic Serif', serif",
                              background: `linear-gradient(135deg, ${item.color} 0%, #333333 50%, ${item.color} 100%)`,
                              backgroundSize: '200% 200%',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}
                          >
                            {item.label}
                          </h3>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">{item.value}%</p>
                        </div>
                      </div>

                      <p 
                        className="text-sm text-white opacity-90 leading-relaxed"
                        style={{
                          fontFamily: "'Georgia', 'Garamond', serif",
                        }}
                      >
                        {item.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-6 h-2 bg-black rounded-full overflow-hidden border border-black/20">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${item.value}%`,
                            background: `linear-gradient(90deg, ${item.color} 0%, #333333 50%, ${item.color} 100%)`,
                            boxShadow: `0 0 15px rgba(0, 0, 0, 0.6)`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right - Visual Representation */}
          <div className="relative">
            <div
              className="relative bg-gradient-to-br from-gray-900 to-black border border-black rounded-xl p-8 sm:p-12 overflow-hidden group"
              style={{
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.3)';
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
                  className="text-2xl sm:text-3xl font-bold mb-8 text-center"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                    background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #000000 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer 3s ease-in-out infinite',
                  }}
                >
                  Capital Flow
                </h3>

                {/* Stacked Bar Chart */}
                <div className="space-y-4">
                  {allocationData.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent 
                              size={20} 
                              color={item.color}
                            />
                            <span className="text-sm font-semibold text-white">{item.label}</span>
                          </div>
                          <span 
                            className="text-lg font-bold"
                            style={{
                              fontFamily: "'Sweet Gothic Serif', serif",
                              color: item.color,
                            }}
                          >
                            {item.value}%
                          </span>
                        </div>
                        <div className="h-8 bg-black rounded-lg overflow-hidden border border-black/20 flex items-center px-3">
                          <div
                            className="h-full rounded transition-all duration-500 flex items-center justify-center text-black text-xs font-bold"
                            style={{
                              width: `${item.value}%`,
                              background: `linear-gradient(90deg, ${item.color} 0%, #333333 50%, ${item.color} 100%)`,
                              boxShadow: `0 0 15px rgba(0, 0, 0, 0.6)`,
                              minWidth: item.value > 15 ? 'auto' : '0',
                            }}
                          >
                            {item.value > 5 && `${item.value}%`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Box */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <p 
                    className="text-xs sm:text-sm text-gray-400 leading-relaxed"
                    style={{
                      fontFamily: "'Georgia', 'Garamond', serif",
                    }}
                  >
                    After presale completion, collected capital is strategically allocated to maximize long-term ecosystem growth and value creation.
                  </p>
                </div>
              </div>
            </div>
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
