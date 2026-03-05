import './globals.css';
import NewsletterPopup from '@/components/NewsletterPopup';

export const metadata = {
  title: 'OptiImage by Dream Intrepid Ltd — Bulk Image Optimizer & Converter',
  description:
    'Compress, convert, and optimize your images in bulk. Support for JPEG, PNG, WebP, AVIF, and more. Fast, free, and no quality loss.',
  keywords: 'image optimizer, image compressor, bulk image converter, webp converter, avif converter, png compressor, jpeg optimizer',
  openGraph: {
    title: 'OptiImage by Dream Intrepid Ltd — Bulk Image Optimizer & Converter',
    description: 'Compress, convert, and optimize your images in bulk with near-zero quality loss.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense — Replace with your publisher ID */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossOrigin="anonymous"></script> */}

        {/* Google Analytics 4 — Replace G-XXXXXXXXXX with your Measurement ID */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');`
        }} />
      </head>
      <body>
        {children}
        <NewsletterPopup />
      </body>
    </html>
  );
}
