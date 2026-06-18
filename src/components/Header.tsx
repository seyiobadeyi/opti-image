'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { LogOut, User as UserIcon, Menu, X, LayoutDashboard, ChevronRight, Camera } from 'lucide-react';
import type { User, GuestHistoryItem, AuthStep } from '@/types';
import { AnimatePresence } from 'framer-motion';
import AuthModal from '@/components/AuthModal';
import { createClient } from '@/utils/supabase/client';
import { logout } from '@/app/auth/actions';
import { apiClient } from '@/lib/api';
import { c as _c } from '@/lib/colors';

const clr = {
    accent:   _c.accent,
    accentDk: _c.accentDark,
    accentLt: _c.accentLight,
    g50:  _c.gray50,
    g200: _c.border,
    g400: _c.textMuted,
    g600: _c.gray600,
    g700: _c.textSecondary,
    g900: _c.text,
};

export default function Header(): React.JSX.Element {
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const [authModalInitialStep, setAuthModalInitialStep] = useState<AuthStep>('email');
    const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
    const [authModalLeftTitle, setAuthModalLeftTitle] = useState<string | undefined>(undefined);
    const [authModalLeftSubtitle, setAuthModalLeftSubtitle] = useState<string | undefined>(undefined);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
    const [headerHidden, setHeaderHidden] = useState<boolean>(false);
    const supabase = useMemo(() => createClient(), []);

    const handleSyncGuestHistory = async (): Promise<void> => {
        try {
            const guestHistory: GuestHistoryItem[] = JSON.parse(localStorage.getItem('guest_processing_history') || '[]');
            if (guestHistory.length > 0) {
                await apiClient.syncGuestHistory(guestHistory);
                localStorage.removeItem('guest_processing_history');
            }
        } catch (err: unknown) {
            console.error('Failed to sync guest history', err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    useEffect(() => {
        let lastY = 0;
        const onScroll = () => {
            const y = window.scrollY;
            setHeaderHidden(y > lastY && y > 90);
            lastY = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const pingServer = () => { apiClient.checkHealth().catch(() => {}); };
        pingServer();
        const keepAliveInterval = setInterval(pingServer, 5 * 60 * 1000);

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) setUser(session.user);
            setIsAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const newUser = session?.user ?? null;
            setUser(newUser);
            if (event === 'SIGNED_IN') {
                await handleSyncGuestHistory();
                setIsAuthModalOpen(false);
                router.refresh();
            }
            if (event === 'INITIAL_SESSION' && session) {
                await handleSyncGuestHistory();
                setIsAuthLoading(false);
            }
        });

        const handleOpenModal = () => setIsAuthModalOpen(true);
        window.addEventListener('open-auth-modal', handleOpenModal);
        return () => {
            clearInterval(keepAliveInterval);
            subscription.unsubscribe();
            window.removeEventListener('open-auth-modal', handleOpenModal);
        };
    }, [supabase, router]);

    useEffect(() => {
        if (typeof window === 'undefined' || isAuthLoading) return;
        const params = new URLSearchParams(window.location.search);
        const hasOnboarding = params.get('onboarding') === '1';
        const hasLogin = params.get('login') === 'true';
        const nextParam = params.get('next');
        // Show onboarding for Google OAuth new users (user IS set but has no display_name yet).
        // Show login prompt only when not signed in.
        if (hasOnboarding || (hasLogin && !user)) {
            setAuthModalInitialStep(hasOnboarding ? 'onboarding' : 'email');
            setRedirectUrl(nextParam ?? (window.location.pathname === '/' ? '/dashboard' : window.location.pathname));
            setIsAuthModalOpen(true);
            const url = new URL(window.location.href);
            url.searchParams.delete('onboarding');
            url.searchParams.delete('login');
            url.searchParams.delete('next');
            window.history.replaceState({}, '', url.toString());
        }
    }, [isAuthLoading, user]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    }, [isMobileMenuOpen]);

    const handleLogout = async (): Promise<void> => {
        await supabase.auth.signOut();
        await logout();
        setIsMobileMenuOpen(false);
        router.push('/');
        router.refresh();
    };

    const openGalleries = () => {
        if (user) { router.push('/galleries'); }
        else {
            setAuthModalLeftTitle('Client Galleries');
            setAuthModalLeftSubtitle('Share your work in private, PIN-protected galleries with download controls. Free to sign up.');
            setRedirectUrl('/galleries');
            setIsAuthModalOpen(true);
        }
    };

    const navLinkStyle: React.CSSProperties = {
        color: clr.g700,
        textDecoration: 'none',
        fontSize: '0.92rem',
        fontWeight: 500,
        padding: '6px 10px',
        borderRadius: '8px',
        transition: 'color 0.15s',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: '#fff',
            borderBottom: `1px solid ${clr.g200}`,
            transform: headerHidden ? 'translateY(-100%)' : 'translateY(0)',
            transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                height: '62px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
                >
                    <img src="/logo.png" alt="Optimage" style={{ height: '34px', width: 'auto', display: 'block' }} />
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: clr.g900, lineHeight: 1 }}>Optimage</span>
                </Link>

                {/* Desktop nav */}
                <nav style={{ alignItems: 'center', gap: '4px' }} className="header-desktop-nav">
                    <Link href="/" style={navLinkStyle}>Home</Link>
                    <Link href="/blog" style={navLinkStyle}>Blog</Link>
                    <button style={navLinkStyle} onClick={openGalleries}>
                        <Camera size={14} /> Galleries
                    </button>

                    <div style={{ marginLeft: '8px', paddingLeft: '12px', borderLeft: `1px solid ${clr.g200}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isAuthLoading ? (
                            <div style={{ width: '90px', height: '36px', background: clr.g50, borderRadius: '8px' }} />
                        ) : user ? (
                            <>
                                <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: clr.g50, border: `1px solid ${clr.g200}`, borderRadius: '8px', textDecoration: 'none', color: clr.g700, fontSize: '0.88rem', fontWeight: 600 }}>
                                    <LayoutDashboard size={14} /> Dashboard
                                </Link>
                                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: clr.g400, fontSize: '0.85rem', padding: '7px 10px' }}>
                                    <LogOut size={14} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                style={{ background: clr.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = clr.accentDk)}
                                onMouseLeave={e => (e.currentTarget.style.background = clr.accent)}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </nav>

                {/* Mobile toggle */}
                <button
                    className="header-mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: clr.g700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: '#fff', zIndex: 99,
                        overflowY: 'auto',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '80px 24px 32px' }}>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/blog', label: 'Blog' },
                            ].map(({ href, label }) => (
                                <Link
                                    key={href} href={href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '12px', background: clr.g50, textDecoration: 'none', color: clr.g900, fontSize: '1rem', fontWeight: 500, marginBottom: '4px' }}
                                >
                                    {label} <ChevronRight size={18} color={clr.g400} />
                                </Link>
                            ))}
                            <button
                                onClick={() => { setIsMobileMenuOpen(false); openGalleries(); }}
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '12px', background: clr.g50, border: 'none', color: clr.g900, fontSize: '1rem', fontWeight: 500, cursor: 'pointer', marginBottom: '4px', width: '100%', textAlign: 'left' }}
                            >
                                Galleries <ChevronRight size={18} color={clr.g400} />
                            </button>
                            {user && (
                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '12px', background: clr.accentLt, textDecoration: 'none', color: clr.accent, fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>
                                    Dashboard <ChevronRight size={18} color={clr.accent} />
                                </Link>
                            )}
                        </nav>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {isAuthLoading ? (
                                <div style={{ width: '100%', height: '50px', background: clr.g50, borderRadius: '12px' }} />
                            ) : user ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: clr.g50, borderRadius: '12px', border: `1px solid ${clr.g200}` }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: clr.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                                            <UserIcon size={20} />
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontSize: '0.78rem', color: clr.g400 }}>Signed in as</div>
                                            <div style={{ fontWeight: 500, fontSize: '0.9rem', color: clr.g900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} style={{ width: '100%', padding: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'none', border: `1.5px solid ${clr.g200}`, borderRadius: '12px', color: clr.g700, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
                                        <LogOut size={18} /> Log Out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                                    style={{ width: '100%', padding: '16px', background: clr.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isAuthModalOpen && (
                    <AuthModal
                        isOpen={isAuthModalOpen}
                        onClose={() => {
                            setIsAuthModalOpen(false);
                            setAuthModalInitialStep('email');
                            setRedirectUrl(undefined);
                            setAuthModalLeftTitle(undefined);
                            setAuthModalLeftSubtitle(undefined);
                        }}
                        initialStep={authModalInitialStep}
                        redirectAfterAuth={redirectUrl}
                        leftTitle={authModalLeftTitle}
                        leftSubtitle={authModalLeftSubtitle}
                    />
                )}
            </AnimatePresence>
        </header>
    );
}
