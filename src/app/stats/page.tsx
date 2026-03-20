import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const revalidate = 3600; // ISR: revalidate every 1 hour

// ── Types ────────────────────────────────────────────────────────────────────

interface PublicStats {
    totalFilesProcessed: number;
    totalBytesSaved: number;
    totalBytesSavedFormatted: string;
    totalImageFiles: number;
    totalVideoFiles: number;
    totalAudioFiles: number;
    averageReduction: number;
    lastUpdated: string;
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
    title: 'Optimage Impact: Live Compression Statistics',
    description:
        'See real-time compression statistics for Optimage. Discover how many files have been processed, how much data has been saved, and the environmental impact of optimizing images and videos at scale.',
    alternates: {
        canonical: `${SITE_URL}/stats`,
    },
    openGraph: {
        title: 'Optimage Impact: Live Compression Statistics',
        description:
            'Real-time stats: total files processed, data saved, images compressed, videos optimised. See the collective impact of Optimage users worldwide.',
        url: `${SITE_URL}/stats`,
        siteName: 'Optimage',
        images: [{ url: `${SITE_URL}/image-2.png`, width: 1200, height: 630, alt: 'Optimage Impact Statistics' }],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Optimage Impact: Live Compression Statistics',
        description: 'How many files has Optimage processed? How much data has been saved? Find out.',
        images: [`${SITE_URL}/image-2.png`],
        creator: '@dreamintrepid',
    },
};

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchStats(): Promise<PublicStats | null> {
    try {
        const res = await fetch(`${API_URL}/stats`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        return (await res.json()) as PublicStats;
    } catch {
        return null;
    }
}

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    accent?: boolean;
}

function StatCard({ label, value, sub, accent }: StatCardProps) {
    return (
        <div
            style={{
                background: accent
                    ? 'linear-gradient(135deg, rgba(108,92,231,0.18), rgba(162,155,254,0.08))'
                    : 'rgba(255,255,255,0.03)',
                border: accent ? '1px solid rgba(108,92,231,0.35)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column' as const,
                alignItems: 'center',
                textAlign: 'center' as const,
                gap: '8px',
            }}
        >
            <span
                style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: accent ? '#a29bfe' : '#ffffff',
                    letterSpacing: '-0.02em',
                }}
            >
                {value}
            </span>
            <span
                style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)',
                    marginTop: '4px',
                }}
            >
                {label}
            </span>
            {sub && (
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                    {sub}
                </span>
            )}
        </div>
    );
}

// ── Newsletter form (client interaction handled via HTML form + action) ────────

function NewsletterSignup({ totalFiles }: { totalFiles: number }) {
    const joinCount = totalFiles > 0 ? totalFiles.toLocaleString() : 'thousands of';
    return (
        <section
            style={{
                maxWidth: '560px',
                margin: '0 auto',
                padding: '48px 28px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                textAlign: 'center',
            }}
        >
            <p style={{ fontSize: '0.85rem', color: '#6c5ce7', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Join the community
            </p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                Join {joinCount} others saving bandwidth
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '28px' }}>
                Get tips on image optimisation, web performance, and new Optimage features, delivered straight to your inbox.
            </p>
            <form
                action={`${API_URL}/newsletter/subscribe`}
                method="POST"
                style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const, justifyContent: 'center' }}
            >
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    style={{
                        flex: '1 1 200px',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        outline: 'none',
                        minWidth: '0',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        background: '#6c5ce7',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap' as const,
                    }}
                >
                    Subscribe
                </button>
            </form>
        </section>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function StatsPage(): Promise<React.JSX.Element> {
    const stats = await fetchStats();

    const pageUrl = `${SITE_URL}/stats`;

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': pageUrl,
        url: pageUrl,
        name: 'Optimage Impact: Live Compression Statistics',
        description:
            'Real-time aggregated statistics showing the total number of files processed, data saved, and environmental impact of the Optimage image and media optimisation platform.',
        inLanguage: 'en-US',
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            name: 'Optimage',
            url: SITE_URL,
        },
        publisher: {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'Dream Intrepid Ltd',
        },
        dateModified: stats?.lastUpdated ?? new Date().toISOString(),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />

            <Header />

            <main
                style={{
                    minHeight: '100vh',
                    background: '#0a0a18',
                    color: '#ffffff',
                    paddingTop: '100px',
                    paddingBottom: '80px',
                }}
            >
                {/* ── Hero ── */}
                <section style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 48px', textAlign: 'center' }}>
                    <p
                        style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#6c5ce7',
                            marginBottom: '16px',
                        }}
                    >
                        Live statistics
                    </p>
                    <h1
                        style={{
                            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.15,
                            marginBottom: '20px',
                        }}
                    >
                        Optimage Impact:{' '}
                        <span style={{ color: '#a29bfe' }}>By the Numbers</span>
                    </h1>
                    <p
                        style={{
                            fontSize: '1.15rem',
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.75,
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                    >
                        Every file optimised through Optimage contributes to a faster, lighter web. Here is the
                        collective impact of our community, updated every hour.
                    </p>
                </section>

                {/* ── Stat grid ── */}
                {stats ? (
                    <section
                        style={{
                            maxWidth: '1100px',
                            margin: '0 auto',
                            padding: '0 24px 64px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '20px',
                        }}
                        aria-label="Compression statistics"
                    >
                        <StatCard
                            label="Total Files Processed"
                            value={stats.totalFilesProcessed.toLocaleString()}
                            sub="images, videos &amp; audio"
                            accent
                        />
                        <StatCard
                            label="Data Saved"
                            value={stats.totalBytesSavedFormatted}
                            sub="total bandwidth recovered"
                            accent
                        />
                        <StatCard
                            label="Images Processed"
                            value={stats.totalImageFiles.toLocaleString()}
                            sub="JPEG, PNG, WebP, AVIF &amp; more"
                        />
                        <StatCard
                            label="Videos Compressed"
                            value={stats.totalVideoFiles.toLocaleString()}
                            sub="MP4, MOV, WebM &amp; more"
                        />
                        <StatCard
                            label="Audio Transcribed"
                            value={stats.totalAudioFiles.toLocaleString()}
                            sub="via AI speech-to-text"
                        />
                        {stats.averageReduction > 0 && (
                            <StatCard
                                label="Average Size Reduction"
                                value={`${stats.averageReduction}%`}
                                sub="across all processed files"
                                accent
                            />
                        )}
                    </section>
                ) : (
                    /* Fallback when API is unreachable */
                    <section
                        style={{
                            maxWidth: '600px',
                            margin: '0 auto 64px',
                            padding: '48px 28px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '20px',
                            textAlign: 'center',
                        }}
                    >
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>
                            Statistics are temporarily unavailable. Please check back shortly.
                        </p>
                    </section>
                )}

                {/* ── How it works ── */}
                <section
                    style={{
                        maxWidth: '860px',
                        margin: '0 auto 64px',
                        padding: '0 24px',
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '20px',
                            padding: '48px 40px',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '1.8rem',
                                fontWeight: 800,
                                marginBottom: '24px',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            How Optimage works
                        </h2>
                        <ol
                            style={{
                                paddingLeft: '0',
                                listStyle: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                            }}
                        >
                            {[
                                {
                                    step: '01',
                                    title: 'Upload your files',
                                    body: 'Drag and drop up to 50 images or a video/audio file into the Optimage tool. No sign-up needed to start.',
                                },
                                {
                                    step: '02',
                                    title: 'Choose your settings',
                                    body: 'Pick an output format (WebP, AVIF, JPEG, PNG …), quality level, dimensions, and whether to strip EXIF metadata.',
                                },
                                {
                                    step: '03',
                                    title: 'Download optimised files',
                                    body: 'Optimage compresses your files server-side using industry-leading codecs and delivers the results in seconds. Originals are deleted within 30 minutes.',
                                },
                            ].map(({ step, title, body }) => (
                                <li
                                    key={step}
                                    style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
                                >
                                    <span
                                        style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            color: '#6c5ce7',
                                            border: '1px solid rgba(108,92,231,0.4)',
                                            borderRadius: '8px',
                                            padding: '4px 10px',
                                            flexShrink: 0,
                                            marginTop: '2px',
                                        }}
                                    >
                                        {step}
                                    </span>
                                    <div>
                                        <p style={{ fontWeight: 700, marginBottom: '4px' }}>{title}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.93rem', lineHeight: 1.65 }}>
                                            {body}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* ── Environmental / performance impact narrative ── */}
                <section
                    style={{
                        maxWidth: '860px',
                        margin: '0 auto 64px',
                        padding: '0 24px',
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, rgba(108,92,231,0.12), rgba(162,155,254,0.05))',
                            border: '1px solid rgba(108,92,231,0.25)',
                            borderRadius: '20px',
                            padding: '48px 40px',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '1.8rem',
                                fontWeight: 800,
                                marginBottom: '20px',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            What this means for the web
                        </h2>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '1.02rem',
                                lineHeight: 1.8,
                                marginBottom: '16px',
                            }}
                        >
                            Images and videos account for more than 70% of the average web page's total transfer
                            size. Every megabyte shaved off a page load translates directly into faster Time-to-Interactive
                            scores, lower bounce rates, and better Core Web Vitals, all of which Google uses as ranking
                            signals. For users on mobile data plans or slower connections, the savings are felt immediately
                            in the form of pages that simply load.
                        </p>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '1.02rem',
                                lineHeight: 1.8,
                                marginBottom: '16px',
                            }}
                        >
                            There is also an environmental dimension. Data centres consume enormous amounts of electricity
                            to transfer, cache, and re-serve the same oversized assets millions of times a day. Smaller
                            files mean fewer CPU cycles, less energy, and a measurably smaller carbon footprint. The
                            gigabytes saved through Optimage represent real reductions in electricity consumption across
                            the global CDN infrastructure serving those assets.
                        </p>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '1.02rem',
                                lineHeight: 1.8,
                            }}
                        >
                            Modern formats like WebP and AVIF deliver the same visual fidelity as JPEG or PNG at
                            30–80% smaller file sizes. By converting even a fraction of the web&apos;s image inventory to
                            these formats, we collectively move the needle on web performance, accessibility, and
                            sustainability.
                        </p>
                    </div>
                </section>

                {/* ── Newsletter / CTA ── */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 32px' }}>
                    <NewsletterSignup totalFiles={stats?.totalFilesProcessed ?? 0} />
                </section>

                {/* ── Back to homepage CTA ── */}
                <section style={{ textAlign: 'center', padding: '32px 24px 0' }}>
                    <a
                        href={SITE_URL}
                        style={{
                            display: 'inline-block',
                            padding: '14px 32px',
                            borderRadius: '14px',
                            background: '#6c5ce7',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '1rem',
                            textDecoration: 'none',
                            transition: 'opacity 0.15s',
                        }}
                    >
                        Start optimising for free
                    </a>
                    <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>
                        Stats last updated:{' '}
                        {stats
                            ? new Date(stats.lastUpdated).toLocaleString('en-US', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                              })
                            : 'unavailable'}
                    </p>
                </section>
            </main>

            <Footer />
        </>
    );
}
