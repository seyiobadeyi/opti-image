import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Mic, ArrowRight, CheckCircle, Clock, FileText,
    Globe, Languages, Zap, Headphones, Shield,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'AI Video & Audio Transcription | Optimage',
    description: 'Transcribe and translate video and audio files with AI. Extract audio tracks, get accurate transcriptions in minutes — powered by OpenAI Whisper. Coming soon.',
    keywords: 'AI transcription, video transcription, audio to text, AI translation, OpenAI Whisper, extract audio from video, speech to text online',
    alternates: { canonical: 'https://optimage.dreamintrepid.com/video' },
    openGraph: {
        title: 'AI Video & Audio Transcription | Optimage',
        description: 'Transcribe and translate video and audio files with AI. Extract audio tracks, get accurate transcriptions in minutes.',
        type: 'website',
        url: 'https://optimage.dreamintrepid.com/video',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Video & Audio Transcription | Optimage',
        description: 'Transcribe and translate video and audio files with AI — powered by OpenAI Whisper.',
    },
};

export default function VideoPage(): React.JSX.Element {
    return (
        <>
            <Header />
            <main style={{ background: 'var(--bg-primary)', overflowX: 'hidden' }}>

                {/* ── Hero ── */}
                <section style={{
                    minHeight: '84vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: 'clamp(80px, 12vw, 140px) 24px clamp(60px, 8vw, 100px)',
                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                        width: '600px', height: '350px',
                        background: 'radial-gradient(ellipse, rgba(236,72,153,0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 16px', borderRadius: '100px',
                        background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)',
                        color: '#f9a8d4', fontSize: '0.8rem', fontWeight: 600,
                        marginBottom: '32px', letterSpacing: '0.05em',
                    }}>
                        <Clock size={13} />
                        COMING SOON
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900,
                        lineHeight: 1.06, letterSpacing: '-0.03em',
                        marginBottom: '28px', maxWidth: '900px', color: 'var(--text-primary)',
                    }}>
                        Words from your video.{' '}
                        <span style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Instantly.
                        </span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: 'var(--text-secondary)',
                        maxWidth: '640px', lineHeight: 1.7, marginBottom: '48px',
                    }}>
                        Upload a video or audio file. Get back a text transcript, translation, or extracted audio track — powered by OpenAI Whisper, the most accurate speech model available. Our engineering team is currently optimising the high-performance pipeline. Join the waitlist for early access.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href="/#dropzone-area" style={{
                            padding: '16px 36px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                            color: '#fff', fontWeight: 700, fontSize: '1rem',
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 8px 32px rgba(236,72,153,0.3)',
                            opacity: 0.9,
                        }}>
                            Join the Waitlist <ArrowRight size={17} />
                        </Link>
                        <Link href="/compress" style={{
                            padding: '16px 36px', borderRadius: '12px',
                            border: '1px solid var(--border)', background: 'var(--bg-card)',
                            color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem',
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                        }}>
                            Use image tools now
                        </Link>
                    </div>

                    <div style={{
                        marginTop: '52px', display: 'flex', gap: '32px',
                        flexWrap: 'wrap', justifyContent: 'center',
                        color: 'var(--text-muted)', fontSize: '0.82rem',
                    }}>
                        {['Powered by OpenAI Whisper', 'Transcription in 99+ languages', 'Translation included'].map(item => (
                            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckCircle size={13} style={{ color: '#22c55e' }} /> {item}
                            </span>
                        ))}
                    </div>
                </section>

                {/* ── What it does ── */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) 24px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f9a8d4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center' }}>What it does</p>
                    <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '52px' }}>
                        Three things. All in one upload.
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {[
                            {
                                icon: <FileText size={24} />, color: '#ec4899',
                                title: 'Transcription',
                                desc: 'Upload a video or audio file. Receive back a clean text transcript of everything that was said — with speaker-aware formatting and punctuation. Useful for content repurposing, subtitles, meeting notes, and accessibility.',
                            },
                            {
                                icon: <Languages size={24} />, color: '#a78bfa',
                                title: 'Translation to English',
                                desc: 'Got a video in Yoruba, French, Spanish, Arabic, or 96 other languages? Optimage can transcribe and translate simultaneously — you get English text output from any spoken language input.',
                            },
                            {
                                icon: <Headphones size={24} />, color: '#38bdf8',
                                title: 'Audio extraction',
                                desc: 'Sometimes you just need the audio from a video. Upload an MP4, MKV, or MOV and receive back an MP3. Useful for podcasters, journalists, and anyone pulling audio from recorded calls or sessions.',
                            },
                        ].map(feat => (
                            <div key={feat.title} style={{
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: '20px', padding: '32px',
                            }}>
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '14px',
                                    background: `${feat.color}18`, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: feat.color, marginBottom: '20px',
                                }}>
                                    {feat.icon}
                                </div>
                                <h3 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '1.1rem' }}>{feat.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.92rem' }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Use cases ── */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(20px, 4vw, 60px) 24px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f9a8d4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center' }}>Use cases</p>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '40px' }}>
                        Who it&rsquo;s built for
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                        {[
                            { who: 'Content creators', use: 'Generate captions, repurpose podcasts into blog posts, extract sound from video clips.' },
                            { who: 'Journalists', use: 'Transcribe recorded interviews in minutes instead of hours. Get accurate quotes without re-listening.' },
                            { who: 'Researchers', use: 'Transcribe qualitative interviews, focus groups, and lectures. Export clean text for analysis.' },
                            { who: 'Educators', use: 'Create accessible transcripts for video lessons and course materials.' },
                            { who: 'Business teams', use: 'Convert Zoom recordings into meeting notes without paying per-minute transcription fees.' },
                            { who: 'Developers', use: 'Prototype voice features using a reliable transcription backend without building your own Whisper integration.' },
                        ].map(({ who, use }) => (
                            <div key={who} style={{
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: '14px', padding: '22px',
                            }}>
                                <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: '0.95rem', color: '#f9a8d4' }}>{who}</p>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.88rem' }}>{use}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Why Whisper ── */}
                <section style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) 24px' }}>
                    <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: '24px', padding: 'clamp(32px, 5vw, 56px)',
                    }}>
                        <Mic size={36} style={{ color: '#ec4899', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '20px' }}>
                            Why OpenAI Whisper?
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
                            Whisper is a large-scale speech recognition model trained on 680,000 hours of multilingual audio. It significantly outperforms legacy ASR tools on accented speech, overlapping speakers, and noisy environments. It&rsquo;s the same model powering transcription features in major enterprise tools — accessed here at a fraction of the cost.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                'Word error rate competitive with the best human transcribers',
                                'Automatic language detection — no need to specify ahead of time',
                                'Handles strong accents better than conventional ASR models',
                                'Effective on low-quality audio and noisy recordings',
                            ].map(point => (
                                <div key={point} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <CheckCircle size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 24px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1a0a14 0%, #2d1a24 100%)',
                        borderRadius: '28px', padding: 'clamp(40px, 7vw, 80px) 32px',
                        textAlign: 'center', border: '1px solid rgba(236,72,153,0.3)',
                    }}>
                        <Mic size={40} style={{ color: '#f9a8d4', marginBottom: '20px' }} />
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff',
                            marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.02em',
                        }}>
                            Get notified when it launches.
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                            We&rsquo;re rolling out to subscribers first. Create a free account and you&rsquo;ll be first to know when AI video processing goes live.
                        </p>
                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/?open-auth" style={{
                                padding: '16px 36px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                                color: '#fff', fontWeight: 700, fontSize: '1rem',
                                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                boxShadow: '0 8px 32px rgba(236,72,153,0.3)',
                            }}>
                                Create Free Account <ArrowRight size={17} />
                            </Link>
                            <Link href="/compress" style={{
                                padding: '16px 36px', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
                                color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '1rem',
                                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                            }}>
                                Use image tools now
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
