/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API requests to the NestJS backend during development
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
      // Proxy hosted image links through the main domain
      // GET optimage.dreamintrepid.com/i/:filename → Railway /i/:filename
      {
        source: '/i/:path*',
        destination: `${apiBase}/i/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.googletagmanager.com https://res.cloudinary.com",
              "media-src 'self' data: blob:",
              "connect-src 'self' http://localhost:4000 ws://localhost:3000 https://optimageservice.dreamintrepid.com https://optimageservice.vercel.app https://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://accounts.google.com",
              "frame-src 'self' https://googleads.g.doubleclick.net https://accounts.google.com"
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
