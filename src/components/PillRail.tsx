'use client';

import React from 'react';

/**
 * PillRail — a responsive container for a row of pills / chips / filter buttons.
 *
 * Problem it solves: rows of pills using `flex-wrap: wrap` stack into several
 * cramped lines on mobile. Here, on narrow screens the row becomes a single
 * horizontal, touch-swipeable rail (smooth momentum scroll, hidden scrollbar);
 * on wider screens it falls back to the familiar centered wrap so desktop is
 * unchanged.
 *
 * Children should be the pills themselves. Pass layout padding via `style`
 * (do NOT pass display/flex/overflow — the component owns those).
 */
export default function PillRail({
    children,
    style,
    align = 'center',
    ariaLabel,
}: {
    children: React.ReactNode;
    style?: React.CSSProperties;
    /** How pills sit on wide screens once they fit without scrolling. */
    align?: 'center' | 'start';
    ariaLabel?: string;
}): React.JSX.Element {
    return (
        <div className={`pill-rail pill-rail--${align}`} role="group" aria-label={ariaLabel} style={style}>
            {children}
            <style>{`
                .pill-rail {
                    display: flex;
                    flex-wrap: nowrap;
                    gap: 8px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    -webkit-overflow-scrolling: touch;
                    scroll-snap-type: x proximity;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .pill-rail::-webkit-scrollbar { display: none; }
                .pill-rail > * {
                    flex: 0 0 auto;
                    scroll-snap-align: start;
                }
                /* Wide screens: revert to the calm centered/left wrap, no scroll. */
                @media (min-width: 700px) {
                    .pill-rail { flex-wrap: wrap; overflow-x: visible; }
                    .pill-rail--center { justify-content: center; }
                    .pill-rail--start { justify-content: flex-start; }
                }
            `}</style>
        </div>
    );
}
