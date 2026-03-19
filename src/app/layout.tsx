import './globals.css';
import NewsletterPopup from '@/components/NewsletterPopup';
import InactivityWatcher from '@/components/InactivityWatcher';
import ErrorBoundary from '@/components/ErrorBoundary';
import SupportWidget from '@/components/SupportWidget';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Optimage — Bulk Image & Media Optimizer | WebP, AVIF, Video Compression',
    template: '%s | Optimage',
  },
  description:
    'Compress, convert, and optimize images and videos in bulk. JPEG, PNG, WebP, AVIF, GIF support. Strip EXIF, transcribe audio, process 50 files at once. Fast, free, no quality loss.',
  keywords: [
    'image optimizer', 'image compressor', 'bulk image converter', 'webp converter',
    'avif converter', 'png compressor', 'jpeg optimizer', 'image compression tool',
    'convert image to webp', 'compress png online', 'compress jpeg online',
    'avif image converter', 'bulk image resize', 'video compressor online',
    'compress video online free', 'remove exif metadata', 'strip photo metadata',
    'ai audio transcription', 'image optimization tool', 'web performance images',
    'optimage', 'dream intrepid', 'image compression nigeria', 'free image optimizer',
  ],
  authors: [{ name: 'Dream Intrepid Ltd', url: SITE_URL }],
  creator: 'Dream Intrepid Ltd',
  publisher: 'Dream Intrepid Ltd',
  category: 'technology',
  classification: 'Media Optimization Tool',
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
    title: 'Optimage — Bulk Image & Media Optimizer',
    description: 'Compress, convert, and optimize images and videos in bulk. WebP, AVIF, video compression, AI transcription. Free to start.',
    url: SITE_URL,
    siteName: 'Optimage',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Optimage — Bulk Image and Media Optimizer by Dream Intrepid Ltd',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Optimage — Compress, Convert & Optimize Images in Bulk',
    description: 'WebP, AVIF, video compression, AI transcription — all in one tool. Free to start.',
    images: [`${SITE_URL}/og-image.jpg`],
    creator: '@dreamintrepid',
    site: '@dreamintrepid',
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
  verification: {
    google: '3p7H_jwoTvccf1ncRc92VN3OhZFHhIHlJ19ja_7thf8',
    other: {
      'msvalidate.01': 'F2AB3F53958AC1983FAB806849EBB13A',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense — Replace with your publisher ID */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body suppressHydrationWarning>
        {/* ── Structured Data: Organization + WebSite + SoftwareApplication ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${SITE_URL}/#organization`,
                  name: 'Dream Intrepid Ltd',
                  url: SITE_URL,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${SITE_URL}/logo.png`,
                    width: 512,
                    height: 512,
                  },
                  contactPoint: {
                    '@type': 'ContactPoint',
                    email: 'optimage@dreamintrepid.com',
                    contactType: 'customer support',
                    availableLanguage: 'English',
                  },
                  sameAs: [],
                },
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: 'Optimage',
                  description: 'Bulk image and media optimization suite — compress, convert, and optimize images and videos.',
                  publisher: { '@id': `${SITE_URL}/#organization` },
                  inLanguage: 'en-US',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': `${SITE_URL}/#app`,
                  name: 'Optimage',
                  alternateName: ['Optimage Image Optimizer', 'Optimage Media Suite'],
                  url: SITE_URL,
                  applicationCategory: 'MultimediaApplication',
                  applicationSubCategory: 'Image Optimization Tool',
                  operatingSystem: 'Web Browser',
                  browserRequirements: 'Requires JavaScript',
                  inLanguage: 'en-US',
                  description: 'Compress, convert, and optimize images and videos in bulk. Supports JPEG, PNG, WebP, AVIF, video compression, and AI audio transcription.',
                  featureList: [
                    'Bulk image compression',
                    'WebP and AVIF conversion',
                    'Video compression',
                    'AI audio transcription',
                    'EXIF metadata stripping',
                    'Batch processing up to 50 files',
                    'Processing history',
                  ],
                  offers: [
                    {
                      '@type': 'Offer',
                      name: 'Free Tier',
                      price: '0',
                      priceCurrency: 'NGN',
                      description: 'Basic image compression — free, no account required',
                    },
                    {
                      '@type': 'Offer',
                      name: 'Monthly Plan',
                      price: '800',
                      priceCurrency: 'NGN',
                      description: '1 month full access to all features',
                    },
                    {
                      '@type': 'Offer',
                      name: 'Annual Plan',
                      price: '6000',
                      priceCurrency: 'NGN',
                      description: '1 year full access to all features',
                    },
                  ],
                  publisher: { '@id': `${SITE_URL}/#organization` },
                  screenshot: `${SITE_URL}/og-image.jpg`,
                },
              ],
            }),
          }}
        />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <NewsletterPopup />
        <InactivityWatcher />
        <SupportWidget />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''} />
      </body>
    </html>
  );
}
