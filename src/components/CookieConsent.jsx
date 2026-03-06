'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const COOKIE_KEY = 'optimage_cookie_consent';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_KEY);
        if (!consent) {
            // Small delay for smoother UX
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        setVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem(COOKIE_KEY, 'declined');
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
