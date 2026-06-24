import type { Metadata } from 'next';
import Link from 'next/link';
import { Monitor, Smartphone, Globe, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';

export const metadata: Metadata = {
  title: 'Free Online Image Tools That Work in Any Browser',
  description:
    'Compress, resize and convert images directly in your browser — no software to install. Works on iPhone, Android, Windows and Mac.',
  alternates: { canonical: '/features/works-anywhere' },
};

const faqItems = [
  {
    question: 'Does Optimage work on iPhone?',
    answer:
      'Yes. Optimage runs fully in Mobile Safari on iPhone and iPad. No app download is required — open the site, pick your images and download the results.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No account is needed to use any tool on Optimage. All core features — compress, resize, convert — are available without signing up.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer:
      'Guest users\' images are processed entirely in the browser using client-side JavaScript. Nothing is sent to our servers. If you sign in to use cloud features, uploads are encrypted in transit and deleted after processing.',
  },
  {
    question: 'Does it work offline?',
    answer:
      'The tools load from our servers, so an initial internet connection is required. Once the page is loaded, compression and resizing happen locally in your browser and do not require an active connection.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function WorksAnywherePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* Hero */}
      <section style={{ background: '#ffffff', borderBottom: `1px solid ${c.border}` }}>
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            padding: '72px 24px 64px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 46px)',
              fontWeight: 700,
              color: c.text,
              lineHeight: 1.2,
              margin: '0 0 20px',
            }}
          >
            Compress, resize and convert images from any browser — no install
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: c.textSecondary,
              margin: '0 0 36px',
              lineHeight: 1.6,
            }}
          >
            All processing happens inside your browser. Your images never leave your device,
            keeping your files private by design.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/compress"
              style={{
                display: 'inline-block',
                background: c.accent,
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '16px',
                textDecoration: 'none',
              }}
            >
              Try it now
            </Link>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                background: '#ffffff',
                color: c.text,
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '16px',
                textDecoration: 'none',
                border: `1px solid ${c.border}`,
              }}
            >
              See all tools
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: c.bgSubtle, borderBottom: `1px solid ${c.border}` }}>
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '48px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            { label: '0 downloads needed', sub: 'Open a browser tab and start immediately' },
            {
              label: 'Works on iOS, Android, Windows, Mac',
              sub: 'Any modern browser on any operating system',
            },
            {
              label: 'Images never leave your device',
              sub: 'Client-side processing — no server uploads for guests',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#ffffff',
                border: `1px solid ${c.border}`,
                borderRadius: '12px',
                padding: '28px 24px',
              }}
            >
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: c.text,
                  margin: '0 0 8px',
                }}
              >
                {stat.label}
              </p>
              <p style={{ fontSize: '14px', color: c.textMuted, margin: 0 }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform support */}
      <section style={{ background: '#ffffff', borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: c.text,
              textAlign: 'center',
              margin: '0 0 40px',
            }}
          >
            Supported everywhere
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              { name: 'Desktop Chrome', detail: 'Windows & macOS' },
              { name: 'Mobile Safari', detail: 'iPhone & iPad' },
              { name: 'Firefox', detail: 'All platforms' },
              { name: 'Microsoft Edge', detail: 'Windows & macOS' },
            ].map((platform) => (
              <div
                key={platform.name}
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: '12px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  background: '#ffffff',
                }}
              >
                <Globe
                  size={32}
                  color={c.accent}
                  style={{ marginBottom: '12px' }}
                />
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: c.text,
                    margin: '0 0 4px',
                  }}
                >
                  {platform.name}
                </p>
                <p style={{ fontSize: '13px', color: c.textMuted, margin: '0 0 12px' }}>
                  {platform.detail}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    background: c.accentLight,
                    color: c.accent,
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}
                >
                  Fully supported
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section style={{ background: c.bgSubtle, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: c.text,
              textAlign: 'center',
              margin: '0 0 48px',
            }}
          >
            Your images stay on your device
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                icon: <Monitor size={24} color={c.accent} />,
                title: 'Client-side processing',
                body: 'Compression, resizing and conversion run entirely in your browser using WebAssembly and the Canvas API. No file is transmitted when you are using tools as a guest.',
              },
              {
                icon: <Smartphone size={24} color={c.accent} />,
                title: 'No server uploads for guests',
                body: 'Guest sessions have zero network transfer for your image data. The processed file is handed directly back to your browser for download.',
              },
              {
                icon: <Shield size={24} color={c.accent} />,
                title: 'EXIF data removed on export',
                body: 'Location tags, camera model and other metadata embedded in JPEG files are stripped during compression, so sensitive details never reach any server.',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${c.border}`,
                  borderRadius: '12px',
                  padding: '28px 24px',
                }}
              >
                <div style={{ marginBottom: '12px' }}>{item.icon}</div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: c.text,
                    margin: '0 0 8px',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: c.textSecondary, margin: 0, lineHeight: 1.6 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#ffffff', borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: c.text,
              textAlign: 'center',
              margin: '0 0 40px',
            }}
          >
            Common questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqItems.map((item) => (
              <details
                key={item.question}
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <summary
                  style={{
                    padding: '18px 20px',
                    fontWeight: 600,
                    fontSize: '15px',
                    color: c.text,
                    cursor: 'pointer',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#ffffff',
                  }}
                >
                  {item.question}
                  <ChevronDown size={18} color={c.textMuted} />
                </summary>
                <div
                  style={{
                    padding: '0 20px 18px',
                    fontSize: '14px',
                    color: c.textSecondary,
                    lineHeight: 1.7,
                    borderTop: `1px solid ${c.border}`,
                    paddingTop: '16px',
                    background: c.bgSubtle,
                  }}
                >
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: c.accentLight, borderBottom: `1px solid ${c.border}` }}>
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '64px 24px',
            textAlign: 'center',
          }}
        >
          <CheckCircle size={36} color={c.accent} style={{ marginBottom: '16px' }} />
          <h2
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: c.text,
              margin: '0 0 12px',
            }}
          >
            Ready to compress your first image?
          </h2>
          <p style={{ fontSize: '16px', color: c.textSecondary, margin: '0 0 28px' }}>
            No sign-up. No install. Works right now in this tab.
          </p>
          <Link
            href="/compress"
            style={{
              display: 'inline-block',
              background: c.accent,
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'none',
            }}
          >
            Compress images free
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
