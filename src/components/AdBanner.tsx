'use client';

import React, { useEffect, useRef } from 'react';
import type { AdBannerProps } from '@/types';

// Publisher account (the loader script lives in app/layout.tsx <head>).
const AD_CLIENT = 'ca-pub-2857437644082503';

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
 * A single AdSense display unit. Auto ads is OFF, so ads only appear where this
 * component is placed. Renders nothing visible until Google fills the slot
 * (and stays blank on localhost / for blocked or not-yet-approved accounts).
 */
export default function AdBanner({ slot, format = 'auto', style }: AdBannerProps): React.JSX.Element {
    const pushed = useRef(false);

    useEffect(() => {
        // Push once per mount. AdSense throws if an <ins> is pushed twice, so the
        // ref guards React StrictMode's double-invoke in dev.
        if (pushed.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch {
            // ad blocker / no width / not yet approved — fail silently
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block', ...style }}
            data-ad-client={AD_CLIENT}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
        />
    );
}
