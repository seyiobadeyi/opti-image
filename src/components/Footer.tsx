'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import type { FormStatus } from '@/types';

export default function Footer(): React.JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [isAlreadySubscribed, setIsAlreadySubscribed] = useState<boolean>(false);

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            // Send the request to our backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Subscription failed');
            }

            const data: { alreadySubscribed?: boolean } = await response.json();

            if (data.alreadySubscribed) {
                setIsAlreadySubscribed(true);
                setStatus('success');
                setEmail('');
                setTimeout(() => {
                    setStatus('idle');
                    setIsAlreadySubscribed(false);
                }, 4000);
            } else {
                setStatus('success');
                setIsAlreadySubscribed(false);
                setEmail('');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (err: unknown) {
            console.error('Newsletter error:', err instanceof Error ? err.message : 'An unknown error occurred');
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '48px 24px 20px',
                justifyContent: 'space-between'
            }} className="footer-inner-container">

                {/* Left: Branding + Links */}
                <div style={{ flex: '1 1 320px', minWidth: '260px' }}>
                    {/* Logo — uses the same CSS classes as the Header */}
                    <div className="logo" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/logo.png" alt="Optimage Logo" style={{ height: '2.4rem', width: 'auto', objectFit: 'contain', display: 'block' }} />
                        <span className="logo-text" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.3rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Optimage</span>
                            <span style={{ fontSize: '0.55em', color: 'var(--text-muted)', fontWeight: 'normal', WebkitTextFillColor: 'var(--text-muted)' }}>by Dream Intrepid Ltd</span>
                        </span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '8px' }}>
                        © {new Date().getFullYear()} Optimage — a product by{' '}
                        <a href="https://dreamintrepid.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)', textDecoration: 'none', fontWeight: 500 }}>Dream Intrepid Ltd</a>.
                        Free bulk media optimizer.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '16px' }}>
                        For enquiries, contact <a href="mailto:optimage@dreamintrepid.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>optimage@dreamintrepid.com</a>
                    </p>

                    {/* Dream Intrepid family attribution */}
                    <a
                        href="https://dreamintrepid.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', textDecoration: 'none', marginBottom: '20px', transition: 'border-color 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Part of</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dream Intrepid</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>→</span>
                    </a>

                    {/* Nav Links */}
                    <nav style={{ display: 'flex', gap: '24px', marginTop: '4px', flexWrap: 'wrap' }}>
                        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Home</Link>
                        <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Blog</Link>
                        <Link href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Pricing</Link>
                        <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Privacy Policy</Link>
                        <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Terms of Service</Link>
                    </nav>
                </div>

                {/* Newsletter — pulled to top on mobile via CSS order */}
                <div className="footer-newsletter" style={{ flex: '1 1 300px', maxWidth: '380px', background: 'var(--bg-card)', padding: '28px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 600 }}>
                        <Mail size={18} /> Join our Newsletter
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                        Get the latest updates on performance optimization, lossless mathematics, and new AVIF codec features.
                    </p>
                    <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="email"
                            placeholder="hello@example.com"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
                            required
                            disabled={status === 'loading'}
                        />
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem', borderRadius: '10px', fontWeight: 600, background: status === 'success' ? 'var(--success)' : '' }} disabled={status === 'loading'}>
                            {status === 'loading' ? 'Processing...' : status === 'success' ? (isAlreadySubscribed ? '✨ Already on the list!' : '✓ Subscribed!') : 'Subscribe Now'}
                        </button>
                    </form>
                    {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '8px', textAlign: 'center' }}>Something went wrong. Try again.</p>}
                </div>

            </div>
        </footer>
    );
}
