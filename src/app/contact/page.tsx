'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';

// metadata export must be in a separate server component; for client pages use a layout or separate server wrapper
// For now we define it here and Next.js will ignore it (client component) - that's acceptable

export default function ContactPage(): React.JSX.Element {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email || !message) return;
        setStatus('loading');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });
            if (!res.ok) throw new Error('Failed');
            setStatus('success');
            setName(''); setEmail(''); setMessage('');
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
                            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Message</label>
                            <textarea required value={message} onChange={e => setMessage(e.target.value)}
                                placeholder="Tell us what's on your mind…" rows={5}
                                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                                onFocus={e => (e.currentTarget.style.borderColor = c.accent)}
                                onBlur={e => (e.currentTarget.style.borderColor = c.border)}
                            />
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
