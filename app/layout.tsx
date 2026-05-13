import type { Metadata } from 'next'
import { Manrope, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const goodTimes = localFont({
  src: '../public/fonts/good_times/Good Times Rg.otf',
  variable: '--font-heading',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-sans',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'RENTX | The Global Rental Utility Token on Solana',
  description: 'RENTX is the ultimate utility token bridging digital assets with real-world luxury. Powering a global rental ecosystem on the Solana blockchain for fast, secure, and low-cost transactions.',
  keywords: ['RENTX', 'Rental Token', 'Solana Token', 'Utility Token', 'Crypto Rental', 'Luxury Rentals', 'Web3', 'Crypto Marketplace', 'Decentralized Rentals'],
  authors: [{ name: 'RENTX Team' }],
  creator: 'RENTX',
  publisher: 'RENTX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'RENTX | The Global Rental Utility Token',
    description: 'Join the global rental ecosystem powered by Solana. Fast, secure, and built for real-world utility.',
    url: 'https://rentx.io',
    siteName: 'RENTX',
    images: [
      {
        url: '/rentx-coin.png',
        width: 800,
        height: 800,
        alt: 'RENTX Coin',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RENTX | Global Rental Ecosystem',
    description: 'The ultimate utility token bridge between digital assets and real-world luxury. Built on Solana.',
    images: ['/rentx-coin.png'],
  },
}

import { DynamicProvider } from '@/components/rentx/DynamicProvider'
import { AuthProvider } from '@/lib/auth-context'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${manrope.variable} ${goodTimes.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased">
        <AuthProvider>
          <DynamicProvider>
            {children}
          </DynamicProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
