import type { Metadata } from 'next';
import Link from 'next/link';
import { Image, ChevronDown, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';

export const metadata: Metadata = {
  title: 'Convert Images Between Any Format Free — WebP, AVIF, JPEG, PNG | Optimage',
  description:
    'Convert JPEG, PNG, WebP, AVIF, GIF and TIFF free online — no software needed. Cut file sizes by 35% or more versus JPEG.',
  alternates: { canonical: '/features/formats' },
};

const formats = [
  {
    name: 'JPEG',
    useCase: 'Photographs and images with complex gradients where lossy compression is acceptable.',
    sizeNote: 'Baseline — all others compared to this',
  },
  {
    name: 'PNG',
    useCase: 'Logos, screenshots and graphics that require lossless quality or transparency.',
    sizeNote: '10–30% larger than JPEG for photos',
  },
  {
    name: 'WebP',
    useCase: 'Web images that need a smaller file size with optional transparency support.',
    sizeNote: '25–35% smaller than JPEG',
  },
  {
    name: 'AVIF',
    useCase: 'High-efficiency web images; best compression available for modern browsers.',
    sizeNote: '40–50% smaller than JPEG',
  },
  {
    name: 'GIF',
    useCase: 'Short looping animations with a limited 256-colour palette.',
    sizeNote: 'Larger than WebP for animations',
  },
  {
    name: 'TIFF',
    useCase: 'Print production, archiving and workflows that require maximum quality.',
    sizeNote: 'Much larger — uncompressed or lossless',
  },
];

const comparisonRows = [
  {
    format: 'JPEG',
    size: 'Baseline',
    transparency: 'No',
    animation: 'No',
    support: 'All browsers',
    bestFor: 'Photos',
  },
  {
    format: 'PNG',
    size: '10–30% larger',
    transparency: 'Yes',
    animation: 'No',
    support: 'All browsers',
    bestFor: 'Logos, UI',
  },
  {
    format: 'WebP',
    size: '25–35% smaller',
    transparency: 'Yes',
    animation: 'Yes',
    support: 'All modern browsers',
    bestFor: 'Web images',
  },
  {
    format: 'AVIF',
    size: '40–50% smaller',
    transparency: 'Yes',
    animation: 'Yes',
    support: 'Chrome, Firefox, Safari 16+',
    bestFor: 'Web images (2024+)',
  },
  {
    format: 'GIF',
    size: 'Larger than WebP',
    transparency: 'Partial',
    animation: 'Yes',
    support: 'All browsers',
    bestFor: 'Simple animations',
  },
  {
    format: 'TIFF',
    size: 'Very large',
    transparency: 'Yes',
    animation: 'No',
    support: 'Print / desktop apps',
    bestFor: 'Print, archiving',
  },
];

const faqItems = [
  {
    question: 'What is the best image format for websites?',
    answer:
      'WebP is the safest choice for broad compatibility — it is supported by all modern browsers and is 25–35% smaller than JPEG. For cutting-edge projects targeting Chrome, Firefox and Safari 16+, AVIF offers even better compression at 40–50% smaller than JPEG.',
  },
  {
    question: 'What is the difference between WebP and AVIF?',
    answer:
      'Both are modern web formats that offer better compression than JPEG. AVIF is newer and achieves smaller files (40–50% vs 25–35% for WebP), but has slightly less browser support. WebP works in every modern browser released since 2020. AVIF requires Safari 16 or later on Apple devices.',
  },
  {
    question: 'Can I convert multiple images at once?',
    answer:
      'Yes. Drop a folder or select multiple files on the Convert page and Optimage will convert all of them in one batch. You can download results individually or as a single ZIP file.',
  },
  {
    question: 'Is format conversion free on Optimage?',
    answer:
      'Yes, format conversion is completely free. There are no file-count limits or watermarks on the free plan.',
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

export default function FormatsPage() {
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
            Convert images between JPEG, PNG, WebP, AVIF and GIF — free
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: c.textSecondary,
              margin: '0 0 36px',
              lineHeight: 1.6,
            }}
          >
            Modern formats like WebP and AVIF cut file sizes 35%+ compared to JPEG with the same
            visual quality. Switch formats in seconds — no software needed.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/convert"
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
              Convert images free
            </Link>
            <Link
              href="#compare"
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
              Compare formats
            </Link>
          </div>
        </div>
      </section>

      {/* Format cards */}
      <section style={{ background: c.bgSubtle, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '64px 24px' }}>
          <h2
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: c.text,
              textAlign: 'center',
              margin: '0 0 40px',
            }}
          >
            Supported formats
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {formats.map((fmt) => (
              <div
                key={fmt.name}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${c.border}`,
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <Image size={22} color={c.accent} />
                  <span
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: c.text,
                    }}
                  >
                    {fmt.name}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: c.textSecondary,
                    margin: '0 0 10px',
                    lineHeight: 1.6,
                  }}
                >
                  {fmt.useCase}
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: c.textMuted,
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  {fmt.sizeNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section
        id="compare"
        style={{ background: '#ffffff', borderBottom: `1px solid ${c.border}` }}
      >
        <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '64px 24px' }}>
          <h2
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: c.text,
              textAlign: 'center',
              margin: '0 0 40px',
            }}
          >
            Format comparison
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr style={{ background: c.bgMuted }}>
                  {['Format', 'Typical size', 'Transparency', 'Animation', 'Browser support', 'Best for'].map(
                    (col) => (
                      <th
                        key={col}
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: c.text,
                          borderBottom: `1px solid ${c.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.format}
                    style={{ background: i % 2 === 0 ? '#ffffff' : c.bgSubtle }}
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        fontWeight: 600,
                        color: c.text,
                        borderBottom: `1px solid ${c.border}`,
                      }}
                    >
                      {row.format}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: c.textSecondary,
                        borderBottom: `1px solid ${c.border}`,
                      }}
                    >
                      {row.size}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: c.textSecondary,
                        borderBottom: `1px solid ${c.border}`,
                      }}
                    >
                      {row.transparency}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: c.textSecondary,
                        borderBottom: `1px solid ${c.border}`,
                      }}
                    >
                      {row.animation}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: c.textSecondary,
                        borderBottom: `1px solid ${c.border}`,
                      }}
                    >
                      {row.support}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: c.textSecondary,
                        borderBottom: `1px solid ${c.border}`,
                      }}
                    >
                      {row.bestFor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* When to use */}
      <section style={{ background: c.bgSubtle, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
          <h2
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: c.text,
              textAlign: 'center',
              margin: '0 0 40px',
            }}
          >
            Which format should you use?
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                scenario: 'Web pages',
                recommendation: 'Use WebP or AVIF',
                detail:
                  'Both are supported by all modern browsers. WebP is the safe default. AVIF shaves off another 10–15% if your audience is on recent browsers.',
              },
              {
                scenario: 'Photos to share',
                recommendation: 'Use JPEG',
                detail:
                  'JPEG is universally understood by every device, messaging app and email client. Keep quality between 75–85 to balance file size and sharpness.',
              },
              {
                scenario: 'Logos and icons',
                recommendation: 'Use PNG',
                detail:
                  'PNG supports full transparency with no quality loss, making it the right choice for graphics that sit on coloured or patterned backgrounds.',
              },
            ].map((card) => (
              <div
                key={card.scenario}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${c.border}`,
                  borderRadius: '12px',
                  padding: '28px 24px',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: c.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    margin: '0 0 8px',
                  }}
                >
                  {card.scenario}
                </p>
                <p
                  style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: c.accent,
                    margin: '0 0 12px',
                  }}
                >
                  {card.recommendation}
                </p>
                <p style={{ fontSize: '14px', color: c.textSecondary, margin: 0, lineHeight: 1.6 }}>
                  {card.detail}
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
              fontSize: '26px',
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
                    padding: '16px 20px 18px',
                    fontSize: '14px',
                    color: c.textSecondary,
                    lineHeight: 1.7,
                    borderTop: `1px solid ${c.border}`,
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
          <h2
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: c.text,
              margin: '0 0 12px',
            }}
          >
            Convert your images to any format now
          </h2>
          <p style={{ fontSize: '16px', color: c.textSecondary, margin: '0 0 28px' }}>
            Free, instant, no account required.
          </p>
          <Link
            href="/convert"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: c.accent,
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'none',
            }}
          >
            Convert images free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
