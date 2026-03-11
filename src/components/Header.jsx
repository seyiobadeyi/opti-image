'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { LogOut, User, Menu, X, LayoutDashboard, ChevronRight } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { createClient } from '@/utils/supabase/client';
import { logout } from '@/app/auth/actions';
import { apiClient } from '@/lib/api';

export default function Header() {
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        // Ping the server health endpoint immediately, then every 5 minutes
        // This keeps the Render backend awake while the user has the site open.
        const pingServer = () => {
            apiClient.checkHealth().catch(() => { });
        };
        pingServer(); // initial ping
        const keepAliveInterval = setInterval(pingServer, 5 * 60 * 1000);

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) setIsAuthModalOpen(false);
        });

        const handleOpenModal = () => setIsAuthModalOpen(true);
        window.addEventListener('open-auth-modal', handleOpenModal);

        return () => {
            clearInterval(keepAliveInterval);
            subscription.unsubscribe();
            window.removeEventListener('open-auth-modal', handleOpenModal);
        }
    }, [supabase, router]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    }, [isMobileMenuOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        await logout();
        setIsMobileMenuOpen(false);
        router.push('/');
        router.refresh();
    };

    return (
        <header className="site-header">
            <div className="site-header-inner">
                {/* Logo */}
                <Link href="/" className="logo" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/logo.png" alt="Optimage Logo" style={{ height: '2.4rem', width: 'auto', objectFit: 'contain', display: 'block' }} />
                    <span className="logo-text" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Optimage</span>
                        <span style={{ fontSize: '0.55em', color: 'var(--text-muted)', fontWeight: 'normal', WebkitTextFillColor: 'var(--text-muted)' }}>by Dream Intrepid Ltd</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header-desktop-nav">
                    <Link href="/" className="header-nav-link">Home</Link>
                    <Link href="/blog" className="header-nav-link">Blog</Link>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '8px', paddingLeft: '20px', borderLeft: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                                    <User size={16} />
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.email}
                                </span>
                            </div>
                            <Link href="/dashboard" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.9rem', borderRadius: '100px' }}>
                                <LayoutDashboard size={16} /> Dashboard
                            </Link>
                            <button onClick={handleLogout} className="text-btn" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Log Out</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
                            <button onClick={() => setIsAuthModalOpen(true)} className="text-btn" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Log In</button>
                            <button onClick={() => setIsAuthModalOpen(true)} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.95rem', borderRadius: '100px', fontWeight: 600 }}>Sign Up Free</button>
                        </div>
                    )}
                </nav>

                {/* Mobile Hamburger */}
                <button
                    className="header-mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay — conditionally rendered */}
            {isMobileMenuOpen && (
                <div className="header-mobile-overlay">
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '80px 24px 32px' }}>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                            <Link href="/" className="header-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                                Home <ChevronRight size={18} color="var(--text-muted)" />
                            </Link>
                            <Link href="/blog" className="header-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                                Engineering Blog <ChevronRight size={18} color="var(--text-muted)" />
                            </Link>
                            {user && (
                                <Link href="/dashboard" className="header-mobile-link" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--accent-primary)' }}>
                                    Dashboard <ChevronRight size={18} color="var(--accent-primary)" />
                                </Link>
                            )}
                        </nav>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {user ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                                            <User size={20} />
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Signed in as</div>
                                            <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '16px' }}>
                                        <LogOut size={18} /> Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="btn btn-secondary" style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '16px' }}>
                                        Log In
                                    </button>
                                    <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '16px', fontWeight: 600 }}>
                                        Sign Up Free
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </header>
    );
}
