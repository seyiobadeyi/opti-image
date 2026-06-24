import type { Metadata } from 'next';
import Link from 'next/link';
import { SlidersHorizontal, FileText, RefreshCw, Layers, Archive, ArrowRight, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';

export const metadata: Metadata = {
  title: 'Professional Image Workflow Tools — Rename, Compress, Deliver | Optimage',
  description:
    'Adjust quality per image, rename files before download, and re-compress the same batch with new settings — no re-upload needed.',
};

const workflowFeatures = [
  {
    icon: <SlidersHorizontal size={22} color={c.accent} />,
    title: 'Per-image quality settings',
    detail:
      'Set a different compression level for each image in a batch. Portraits, product shots and hero images can each have the quality they deserve.',
  },
  {
    icon: <FileText size={22} color={c.accent} />,
    title: 'Rename files before download',
    detail:
      'Apply sequential numbering, prefix, suffix or a custom naming pattern to every file before the ZIP is created.',
  },
  {
    icon: <RefreshCw size={22} color={c.accent} />,
    title: 'Re-compress same batch with new settings',
    detail:
      'Not happy with the output? Adjust quality and run again — your uploaded originals are held in memory so there is no need to re-select files.',
  },
  {
    icon: <Layers size={22} color={c.accent} />,
    title: 'Mix formats in one batch',
    detail:
      'Convert some images to WebP, keep others as JPEG and export a PNG — all in a single session without splitting your files across multiple tools.',
  },
  {
    icon: <Archive size={22} color={c.accent} />,
    title: 'Download as ZIP',
    detail:
      'Every file in the batch is bundled into a single ZIP archive. One click downloads everything, already named and ready to deliver.',
  },
];

const useCases = [
  {
    from: 'Photoshop Export',
    to: 'Optimage',
    detail:
      'Skip the Save-for-Web dialog. Drop your full-res files into Optimage, set quality per image and download a client-ready ZIP in under a minute.',
  },
  {
    from: 'Lightroom batch export',
    to: 'Optimage',
    detail:
      'Lightroom locks export settings for the whole batch. Optimage lets you fine-tune each image and rename files with client-specific naming conventions.',
  },
  {
    from: 'Manual one-by-one TinyPNG',
    to: 'Optimage batch',
    detail:
      'Stop compressing images one at a time. Optimage handles hundreds of files in a single drag-and-drop, with format conversion and ZIP download built in.',
  },
];

const faqItems = [
  {
    question: 'Can I set different quality for each image?',
    answer:
      'Yes. After uploading a batch, click any image thumbnail to open its individual settings panel. You can set quality, format and output dimensions per image independently of the rest of the batch.',
  },
  {
    question: 'Can I rename images before downloading?',
    answer:
      'Yes. The rename panel lets you set a prefix, suffix or sequential numbering pattern. The preview updates in real time so you can confirm the filenames before downloading.',
  },
  {
    question: 'Do I need to re-upload if I want different settings?',
    answer:
      'No. Optimage holds your original files in memory for the duration of the session. Change quality, format or rename options and click re-compress — the originals are re-processed instantly without re-uploading.',
  },
  {
    question: 'What file naming options are there?',
    answer:
      'You can keep the original filename, add a prefix (e.g. "client-"), add a suffix (e.g. "-web"), apply sequential numbering (image-001, image-002…) or combine all three. Custom patterns with date tokens are available on the Pro plan.',
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

export default function WorkflowsPage() {
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
            A complete image workflow — compress, rename, deliver, repeat
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: c.textSecondary,
              margin: '0 0 36px',
              lineHeight: 1.6,
            }}
          >
            Adjust quality per image, rename files to your client&apos;s convention and re-compress
            the same batch with new settings — without re-uploading a single file.
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
              Start your workflow
            </Link>
            <Link
              href="/features/client-galleries"
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
              Client deliveries
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow features */}
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
            Everything you need in one session
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {workflowFeatures.map((feature) => (
              <div
                key={feature.title}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${c.border}`,
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: '44px',
                    height: '44px',
                    background: c.accentLight,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: c.text,
                      margin: '0 0 6px',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: c.textSecondary,
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ background: '#ffffff', borderBottom: `1px solid ${c.border}` }}>
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
            Workflows Optimage replaces
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {useCases.map((card) => (
              <div
                key={card.from}
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: '12px',
                  padding: '28px 24px',
                  background: '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: c.textMuted,
                      textDecoration: 'line-through',
                    }}
                  >
                    {card.from}
                  </span>
                  <ArrowRight size={14} color={c.accent} />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: c.accent,
                    }}
                  >
                    {card.to}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: c.textSecondary,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {card.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: c.bgSubtle, borderBottom: `1px solid ${c.border}` }}>
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
                    background: '#ffffff',
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
            Build your image workflow today
          </h2>
          <p style={{ fontSize: '16px', color: c.textSecondary, margin: '0 0 28px' }}>
            Compress, rename and deliver — all in one session, no account needed.
          </p>
          <Link
            href="/compress"
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
            Start your workflow
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
