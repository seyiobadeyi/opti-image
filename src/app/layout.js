import './globals.css';
import NewsletterPopup from '@/components/NewsletterPopup';

import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'https://optimage.dreamintrepid.com'),
  title: 'Optimage by Dream Intrepid Ltd — Bulk Image Optimizer & Converter',
  description:
    'Compress, convert, and optimize your images in bulk. Support for JPEG, PNG, WebP, AVIF, and more. Fast, free, and no quality loss.',
  keywords: [
    'image optimizer', 'image compressor', 'bulk image converter',
    'webp converter', 'avif converter', 'png compressor', 'jpeg optimizer'
  ],
  authors: [{ name: 'Dream Intrepid Ltd' }],
  creator: 'Dream Intrepid Ltd',
  publisher: 'Dream Intrepid Ltd',
  alternates: {
    canonical: '/',
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
  openGraph: {
    title: 'Optimage by Dream Intrepid Ltd — Bulk Image Optimizer & Converter',
    description: 'Compress, convert, and optimize your images in bulk with near-zero quality loss.',
    url: '/',
    siteName: 'Optimage',
    images: [
      {
        url: '/image-2.png',
        width: 1200,
        height: 630,
        alt: 'Optimage - Bulk Image Optimizer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Optimage — Bulk Image Optimizer',
    description: 'Compress and optimize your images in bulk with zero quality loss.',
    images: ['/image-2.png'],
    creator: '@dreamintrepid',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense — Replace with your publisher ID */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body>
        {children}
        <NewsletterPopup />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
