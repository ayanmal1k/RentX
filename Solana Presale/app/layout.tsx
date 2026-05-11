import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Yo Gotti World (GTTWRLD) - The White World of Blockchain',
  description: 'Yo Gotti World is building the White World of blockchain innovation with a 900 million token supply. Join our presale with tiered pricing starting from $0.00001.',
  keywords: ['Yo Gotti World', 'GTTWRLD', 'GTTWRLD token', 'cryptocurrency', 'blockchain', 'community-focused', 'presale', 'digital assets', 'DeFi'],
  authors: [{ name: 'Yo Gotti World Team' }],
  creator: 'Yo Gotti World Team',
  publisher: 'Yo Gotti World',
  
  metadataBase: new URL('https://GTTWRLD.com'),
  alternates: {
    canonical: 'https://GTTWRLD.com',
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://GTTWRLD.com',
    title: 'Yo Gotti World (GTTWRLD) - The White World of Blockchain',
    description: 'Join the White World - Yo Gotti World blockchain ecosystem with innovative features and community growth.',
    siteName: 'Yo Gotti World',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Yo Gotti World Logo',
        type: 'image/png',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Yo Gotti World (GTTWRLD) - The White World of Blockchain',
    description: 'The White World ecosystem with innovative blockchain solutions.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  
  manifest: '/site.webmanifest',
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GTTWRLD" />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
