'use client';

import React, { useEffect, useRef } from 'react';
import type { AdBannerProps } from '@/types';

// Publisher account (the loader script lives in app/layout.tsx <head>).
const AD_CLIENT = 'ca-pub-2857437644082503';

// ── Master on/off switch ──────────────────────────────────────────────────────
// Ads are HIDDEN everywhere while this is false: AdBanner renders nothing (no
// empty slots, no "Advertisement" labels). Flip to true to display ads live.
const ADS_ENABLED = false;

/** Ad unit slots created in the AdSense dashboard. */
export const AD_SLOTS = {
    square: '8987088943',
    horizontal: '4183308658',
    vertical: '8659785886',
} as const;

declare global {
    interface Window {
        adsbygoogle?: Record<string, unknown>[];
    }
}

/**
 * A single AdSense display unit (with an "Advertisement" label + spacing).
 * Renders nothing while ADS_ENABLED is false, or until Google fills the slot.
 */
export default function AdBanner({ slot, format = 'auto', style, label = true }: AdBannerProps): React.JSX.Element | null {
    const pushed = useRef(false);

    useEffect(() => {
        // Push once per mount. AdSense throws if an <ins> is pushed twice, so the
        // ref guards React StrictMode's double-invoke in dev.
        if (!ADS_ENABLED || pushed.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch {
            // ad blocker / no width / not yet approved — fail silently
        }
    }, []);

    if (!ADS_ENABLED) return null;

    return (
        <div style={{ margin: '32px 0' }}>
            {label && (
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Advertisement
                </span>
            )}
            <ins
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client={AD_CLIENT}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}
