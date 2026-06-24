'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle, Paperclip, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';

// metadata export must be in a separate server component; for client pages use a layout or separate server wrapper
// For now we define it here and Next.js will ignore it (client component) - that's acceptable

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, matches server limit

export default function ContactPage(): React.JSX.Element {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [website, setWebsite] = useState(''); // honeypot — real users never see/fill this
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addFiles = (newFiles: FileList | null): void => {
        if (!newFiles) return;
        const imgs = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
        const oversized = imgs.find(f => f.size > MAX_FILE_SIZE);
        if (oversized) { setFileError(`${oversized.name} is over 10MB`); return; }
        setFileError(null);
        setFiles(prev => [...prev, ...imgs].slice(0, MAX_FILES));
    };

    const removeFile = (idx: number): void => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email || !message) return;
        setStatus('loading');
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);
            formData.append('category', 'Other');
            formData.append('website', website);
            files.forEach(f => formData.append('files', f));

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/support/ticket`, {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Failed');
            setStatus('success');
            setName(''); setEmail(''); setMessage(''); setFiles([]);
        } catch {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        border: `1.5px solid ${c.border}`,
        borderRadius: '10px',
        padding: '11px 14px',
        fontSize: '0.95rem',
        background: '#fff',
        color: c.text,
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
        fontFamily: 'inherit',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: c.text }}>
            <Header />

            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 24px 80px' }}>

                <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 800, color: c.text, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Contact us
                </h1>
                <p style={{ color: c.textMuted, fontSize: '0.97rem', lineHeight: 1.65, marginBottom: '40px' }}>
                    Have a question, bug report or feature request? Drop us a message and we&apos;ll get back to you.
                </p>

                {status === 'success' ? (
                    <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><CheckCircle size={40} color="#16a34a" /></div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>Message sent!</h3>
                        <p style={{ color: '#15803d', fontSize: '0.9rem' }}>Thanks for reaching out. We&apos;ll be in touch within a business day.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Honeypot — visually hidden, off the tab order; bots fill every field they can see */}
                        <input
                            type="text"
                            name="website"
                            value={website}
                            onChange={e => setWebsite(e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
                        />

                        <div>
                            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Your name</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)}
                                placeholder="Jane Smith" style={inputStyle}
                                onFocus={e => (e.currentTarget.style.borderColor = c.accent)}
                                onBlur={e => (e.currentTarget.style.borderColor = c.border)}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Email address</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="jane@example.com" style={inputStyle}
                                onFocus={e => (e.currentTarget.style.borderColor = c.accent)}
                                onBlur={e => (e.currentTarget.style.borderColor = c.border)}
                            />
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: c.textSecondary }}>Message</label>
                                <button type="button" onClick={() => fileInputRef.current?.click()}
                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: c.textMuted, fontSize: '0.8rem', cursor: 'pointer', padding: '2px' }}>
                                    <Paperclip size={13} /> Attach images
                                </button>
                            </div>

                            <textarea required value={message} onChange={e => setMessage(e.target.value)}
                                placeholder="Tell us what's on your mind…" rows={5}
                                style={{ ...inputStyle, resize: 'none', minHeight: '120px' }}
                                onFocus={e => (e.currentTarget.style.borderColor = c.accent)}
                                onBlur={e => (e.currentTarget.style.borderColor = c.border)}
                            />

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
                            />

                            {fileError && <p style={{ color: c.error, fontSize: '0.8rem', marginTop: '6px' }}>{fileError}</p>}

                            {files.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                    {files.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', background: c.gray50, border: `1px solid ${c.border}`, borderRadius: '8px', fontSize: '0.8rem', color: c.textSecondary }}>
                                            <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                                            <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, display: 'flex' }}><X size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {status === 'error' && (
                            <p style={{ color: c.error, fontSize: '0.85rem' }}>Something went wrong. Please try again or email us directly at <a href="mailto:optimage@dreamintrepid.com" style={{ color: c.accent }}>optimage@dreamintrepid.com</a>.</p>
                        )}

                        <button type="submit" disabled={status === 'loading'}
                            style={{ padding: '14px', background: c.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
                            onMouseEnter={e => { if (status !== 'loading') (e.currentTarget as HTMLButtonElement).style.background = c.accentDark; }}
                            onMouseLeave={e => { if (status !== 'loading') (e.currentTarget as HTMLButtonElement).style.background = c.accent; }}
                        >
                            {status === 'loading' ? 'Sending…' : 'Send message'}
                        </button>

                        <p style={{ fontSize: '0.78rem', color: c.textMuted, textAlign: 'center' }}>
                            Or email directly:{' '}
                            <a href="mailto:optimage@dreamintrepid.com" style={{ color: c.accent, textDecoration: 'none' }}>optimage@dreamintrepid.com</a>
                        </p>
                    </form>
                )}
            </div>

            <Footer />
        </div>
    );
}
