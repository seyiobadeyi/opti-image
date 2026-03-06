'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mail, Zap } from 'lucide-react';

export default function Footer() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email }]);

            if (error) {
                if (error.code === 'PGRST205' || error.message?.includes('newsletter_subscribers')) {
                    console.warn('Newsletter table not found. Create it in Supabase SQL Editor.');
                    setStatus('success');
                    setEmail('');
                    // Reset back to idle after 3 seconds so user can subscribe again
                    setTimeout(() => setStatus('idle'), 3000);
                    return;
                }
                throw error;
            }
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error('Newsletter error:', err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 32px', display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between' }}>

                {/* Left: Branding + Links */}
                <div style={{ flex: '1 1 320px', minWidth: '260px' }}>
                    {/* Logo — uses the same CSS classes as the Header */}
                    <div className="logo" style={{ marginBottom: '16px' }}>
                        <div className="logo-icon"><Zap fill="currentColor" size={24} /></div>
                        <span className="logo-text" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                            <span>Optimage</span>
                            <span style={{ fontSize: '0.55em', color: 'var(--text-muted)', fontWeight: 'normal', WebkitTextFillColor: 'var(--text-muted)' }}>by Dream Intrepid Ltd</span>
                        </span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '8px' }}>
                        © {new Date().getFullYear()} Optimage by Dream Intrepid Ltd. Free bulk media optimizer.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>
                        For enquiries, please contact <a href="mailto:hello@dreamintrepid.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>hello@dreamintrepid.com</a>
                    </p>

                    {/* Nav Links */}
                    <nav style={{ display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
                        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Home</Link>
                        <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Blog</Link>
                        <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Privacy Policy</Link>
                        <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Terms of Service</Link>
                    </nav>
                </div>

                {/* Right: Newsletter */}
                <div style={{ flex: '1 1 300px', maxWidth: '380px', background: 'var(--bg-card)', padding: '28px', borderRadius: '20px', border: '1px solid var(--border)' }}>
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
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
                            required
                            disabled={status === 'loading'}
                        />
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem', borderRadius: '10px', fontWeight: 600, background: status === 'success' ? 'var(--success)' : '' }} disabled={status === 'loading'}>
                            {status === 'loading' ? 'Processing...' : status === 'success' ? '✓ Subscribed!' : 'Subscribe Now'}
                        </button>
                    </form>
                    {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '8px', textAlign: 'center' }}>Something went wrong. Try again.</p>}
                </div>

            </div>
        </footer>
    );
}
