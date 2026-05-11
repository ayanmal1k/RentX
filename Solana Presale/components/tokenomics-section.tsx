'use client';

import Image from 'next/image';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

export function TokenomicsSection() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const distributionData = [
    { name: 'Presale Reserve', value: 30, color: '#000000' },
    { name: 'Liquidity', value: 25, color: '#1f2937' },
    { name: 'Community Rewards', value: 20, color: '#374151' },
    { name: 'Ecosystem Development', value: 15, color: '#4b5563' },
    { name: 'Marketing & Partnerships', value: 10, color: '#6b7280' },
  ];

  const tokenInfo = [
    { label: 'Token Symbol', value: 'GTTWRLD' },
    { label: 'Total Supply', value: '900,000,000 Tokens' },
    { label: 'Presale Reserve', value: '30% (270,000,000 Tokens)' },
  ];

  const renderCustomLabel = (entry) => {
    if (isMobile) return null;
    return `${entry.name}: ${entry.value}%`;
  };

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Section Container */}
      <div className="max-w-7xl mx-auto">
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
            Tokenomics
          </h2>
          <p 
            className="text-base sm:text-lg text-black opacity-75 mt-4"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            Token Distribution & Allocation Model
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Token Information */}
          <div className="flex flex-col justify-center">
            {/* Token Info Cards */}
            <div className="space-y-6">
              {tokenInfo.map((info, index) => (
                <div 
                  key={index}
                  className="relative group"
                >
                  <div
                    className="relative border border-black/20 rounded-lg p-6 sm:p-8 overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,245,245,1) 100%)',
                      boxShadow: '0 0 20px rgba(0, 0, 0, 0.08)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.16), inset 0 0 20px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.08)';
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
                      <p 
                        className="text-sm sm:text-base text-gray-600 uppercase tracking-widest mb-2"
                        style={{
                          fontFamily: "'Sweet Gothic Serif', serif",
                        }}
                      >
                        {info.label}
                      </p>
                      <h3 
                        className="text-2xl sm:text-3xl md:text-4xl font-bold"
                        style={{
                          fontFamily: "'Sweet Gothic Serif', serif",
                          color: '#000000',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {info.value}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Distribution Breakdown */}
            <div 
              className="relative group mt-8"
            >
              <div
                className="relative border border-black/20 rounded-lg p-6 sm:p-8 overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,245,245,1) 100%)',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.16), inset 0 0 20px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.08)';
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
                    className="text-xl sm:text-2xl font-bold mb-6"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                      color: '#000000',
                    }}
                  >
                    Distribution
                  </h3>
                  <div className="space-y-4">
                    {distributionData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span 
                            className="text-base text-black opacity-90"
                            style={{
                              fontFamily: "'Georgia', 'Garamond', serif",
                            }}
                          >
                            {item.name}
                          </span>
                        </div>
                        <span 
                          className="text-lg font-bold"
                          style={{
                            fontFamily: "'Sweet Gothic Serif', serif",
                            color: '#000000',
                          }}
                        >
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Pie Chart */}
          <div 
            className="relative group"
          >
            <div
              className="relative border border-black/20 rounded-lg p-8 sm:p-12 overflow-hidden transition-all duration-300 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,245,245,1) 100%)',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.08)',
                minHeight: '500px',
              }}
            >
              {/* Shine overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
                }}
              ></div>

              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={!isMobile}
                      label={renderCustomLabel}
                      outerRadius={120}
                      innerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px',
                        color: '#000000',
                      }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Icon in center of donut chart */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-40px' }}>
                  <Image
                    src="/logo.png"
                    alt="Tokenomics Icon"
                    width={40}
                    height={40}
                    priority
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
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
