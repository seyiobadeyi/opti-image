/**
 * Optimage design tokens — single source of truth for all colors.
 *
 * Usage in components:
 *   import { c } from '@/lib/colors';
 *   style={{ color: c.text, background: c.bg }}
 *
 * The same values are exposed as CSS custom properties (--c-accent, etc.)
 * in globals.css :root so class-based stylesheets can use them too.
 * If you change a value here, update globals.css to match.
 */

export const c = {
    // ── Brand ────────────────────────────────────────────────────────────────
    accent:       '#db5a42',
    accentDark:   '#c44d32',
    accentLight:  '#fdf3f1',
    accentGlow:   'rgba(219, 90, 66, 0.15)',
    gradient:     'linear-gradient(135deg, #db5a42 0%, #c44d32 100%)',

    // ── Gray scale ───────────────────────────────────────────────────────────
    white:    '#ffffff',
    gray50:   '#f9fafb',
    gray100:  '#f3f4f6',
    gray200:  '#e5e7eb',
    gray300:  '#d1d5db',
    gray400:  '#9ca3af',
    gray500:  '#6b7280',
    gray600:  '#4b5563',
    gray700:  '#374151',
    gray800:  '#1f2937',
    gray900:  '#111827',

    // ── Semantic aliases (preferred for component code) ───────────────────────
    bg:            '#ffffff',
    bgSubtle:      '#f9fafb',
    bgMuted:       '#f3f4f6',
    border:        '#e5e7eb',
    borderFocus:   '#d1d5db',
    text:          '#111827',
    textSecondary: '#374151',
    textMuted:     '#9ca3af',

    // ── Status ───────────────────────────────────────────────────────────────
    success:  '#16a34a',
    error:    '#dc2626',
    warning:  '#d97706',
} as const;

export type ColorToken = keyof typeof c;
