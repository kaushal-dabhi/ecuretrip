import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/contexts/AppContext'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'eCureTrip - Medical Tourism Platform | Connect with Top Doctors in India',
  description: 'eCureTrip is your trusted bridge to affordable, world-class medical care in India. Connect with verified doctors, hospitals, and comprehensive treatment packages.',
  keywords: 'medical tourism, healthcare india, doctors india, hospitals india, medical treatment, affordable healthcare',
  authors: [{ name: 'eCureTrip Team' }],
  icons: {
    icon: [
      {
        url: 'https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: 'https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: 'https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: 'https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png',
  },
  openGraph: {
    title: 'eCureTrip - Medical Tourism Platform',
    description: 'Connect with top doctors and hospitals in India for affordable, world-class medical care.',
    url: 'https://ecuretrip.com',
    siteName: 'eCureTrip',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'eCureTrip Medical Tourism Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eCureTrip - Medical Tourism Platform',
    description: 'Connect with top doctors and hospitals in India for affordable, world-class medical care.',
    images: ['/og-image.jpg'],
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png" />
        <link rel="shortcut icon" href="https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png" />
        <link rel="icon" href="https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2A4049" />
        <meta name="msapplication-TileColor" content="#2A4049" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-body text-night bg-moonlight antialiased">
        <AppProvider>
          <Providers>
            {children}
          </Providers>
        </AppProvider>
      </body>
    </html>
  )
}
