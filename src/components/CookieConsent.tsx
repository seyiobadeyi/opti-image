'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCookie, setCookie } from '@/utils/cookies';

const COOKIE_KEY: string = 'optimage_cookie_consent';

export default function CookieConsent(): React.JSX.Element | null {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const consent = getCookie(COOKIE_KEY) ?? localStorage.getItem(COOKIE_KEY);
        if (!consent) {
            // Small delay for smoother UX
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = (): void => {
        setCookie(COOKIE_KEY, 'accepted', { maxAge: 60 * 60 * 24 * 365 }); // 1 year
        localStorage.setItem(COOKIE_KEY, 'accepted'); // backward compatibility
        setVisible(false);
    };

    const handleDecline = (): void => {
        setCookie(COOKIE_KEY, 'declined', { maxAge: 60 * 60 * 24 * 365 }); // 1 year
        localStorage.setItem(COOKIE_KEY, 'declined'); // backward compatibility
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-banner">
            <p>
                We use cookies to improve your experience and show relevant ads.
                See our <Link href="/privacy">Privacy Policy</Link> for details.
            </p>
            <div className="cookie-actions">
                <button className="btn btn-secondary" onClick={handleDecline} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    Decline
                </button>
                <button className="btn btn-primary" onClick={handleAccept} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    Accept
                </button>
            </div>
        </div>
    );
}
