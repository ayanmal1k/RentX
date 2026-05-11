'use client';

import Image from 'next/image';

export function Footer() {
  return (
    <footer className="relative bg-white/80 backdrop-blur-md border-t border-black/20 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Left - Text */}
          <div className="text-center sm:text-left flex-1">
            <p 
              className="text-xs sm:text-sm text-black/60"
              style={{
                fontFamily: "'Georgia', 'Garamond', serif",
              }}
            >
              © 2026 Yo Gotti World (GTTWRLD). All rights reserved. | Building the White World of blockchain innovation
            </p>
          </div>

          {/* Right - Social Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/oxff.shot"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div
                className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.3)';
                }}
              >
                <span style={{fontSize: '20px', fontWeight: 'bold', color: '#000000'}}>f</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
