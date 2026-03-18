'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// How long (ms) before warning the user they'll be signed out
const WARN_AFTER_MS  = 25 * 60 * 1000; // 25 minutes
const LOGOUT_AFTER_MS = 30 * 60 * 1000; // 30 minutes
const WARN_COUNTDOWN_S = (LOGOUT_AFTER_MS - WARN_AFTER_MS) / 1000; // 300 seconds

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const;

export default function InactivityWatcher(): React.JSX.Element | null {
    const supabase = useMemo(() => createClient(), []);
    const router   = useRouter();
    const pathname = usePathname();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showWarning, setShowWarning]         = useState(false);
    const [countdown, setCountdown]             = useState(WARN_COUNTDOWN_S);

    const warnTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
    const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownRef   = useRef<ReturnType<typeof setInterval> | null>(null);

    // Check auth on mount and listen for auth state changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });
        return () => subscription.unsubscribe();
    }, [supabase]);

    const clearAllTimers = () => {
        if (warnTimerRef.current)   clearTimeout(warnTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        if (countdownRef.current)   clearInterval(countdownRef.current);
        warnTimerRef.current   = null;
        logoutTimerRef.current = null;
        countdownRef.current   = null;
    };

    const startWarningCountdown = () => {
        setCountdown(WARN_COUNTDOWN_S);
        countdownRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSignOut = async () => {
        clearAllTimers();
        setShowWarning(false);
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleStaySignedIn = () => {
        setShowWarning(false);
        resetTimers();
    };

    const resetTimers = () => {
        clearAllTimers();
        setShowWarning(false);

        warnTimerRef.current = setTimeout(() => {
            setShowWarning(true);
            startWarningCountdown();

            logoutTimerRef.current = setTimeout(() => {
                handleSignOut();
            }, LOGOUT_AFTER_MS - WARN_AFTER_MS);
        }, WARN_AFTER_MS);
    };

    // Only run on authenticated pages — don't waste event listeners on public pages
    const isProtectedRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings');

    useEffect(() => {
        if (!isAuthenticated || !isProtectedRoute) {
            clearAllTimers();
            setShowWarning(false);
            return;
        }

        resetTimers();

        const onActivity = () => {
            if (!showWarning) resetTimers();
        };

        ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, onActivity, { passive: true }));

        return () => {
            ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, onActivity));
            clearAllTimers();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isProtectedRoute]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
    };

    if (!showWarning) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed', inset: 0, zIndex: 99998,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                }}
            />

            {/* Modal */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="inactivity-title"
                style={{
                    position: 'fixed', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 99999,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    padding: '40px 36px',
                    maxWidth: '420px',
                    width: 'calc(100vw - 48px)',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
                    textAlign: 'center',
                }}
            >
                {/* Countdown ring */}
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(162,155,254,0.1))',
                    border: '2px solid rgba(108,92,231,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '1.6rem', fontWeight: 800,
                    color: countdown <= 60 ? '#ef4444' : 'var(--accent-primary)',
                    transition: 'color 0.3s',
                }}>
                    {formatTime(countdown)}
                </div>

                <h2 id="inactivity-title" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.01em' }}>
                    Still there?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
                    You have been inactive for a while. For your security, you will be signed out automatically.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                    <button
                        onClick={handleStaySignedIn}
                        style={{
                            padding: '13px 24px', borderRadius: '12px',
                            background: 'var(--gradient-primary)',
                            border: 'none', color: '#fff',
                            fontWeight: 700, fontSize: '0.95rem',
                            cursor: 'pointer', width: '100%',
                        }}
                    >
                        Yes, keep me signed in
                    </button>
                    <button
                        onClick={handleSignOut}
                        style={{
                            padding: '13px 24px', borderRadius: '12px',
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                            fontWeight: 600, fontSize: '0.95rem',
                            cursor: 'pointer', width: '100%',
                        }}
                    >
                        Sign me out
                    </button>
                </div>
            </div>
        </>
    );
}
