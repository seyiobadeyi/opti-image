'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Minimize2, RefreshCw, Crop, Maximize2, RotateCcw, Type, Sparkles, ShieldOff } from 'lucide-react';
import { CompressTool } from '@/app/compress/page';
import { ConvertTool } from '@/app/convert/page';
import { CropTool } from '@/app/crop/page';
import { ResizeTool } from '@/app/resize/page';
import { RotateTool } from '@/app/rotate/page';
import { WatermarkTool } from '@/app/watermark/page';
import { MetadataTool } from '@/app/metadata/page';
import { EnhanceTool } from '@/app/enhance/page';
import { c } from '@/lib/colors';

type ToolDef = {
    key: string;
    label: string;
    desc: string;
    Icon: React.ComponentType<{ size?: number; color?: string }>;
    Comp: React.ComponentType<{ embedded?: boolean }>;
};

// The same tools available on the public homepage, embedded so signed-in users
// never have to leave the dashboard. Order mirrors the homepage tool grid.
const TOOLS: ToolDef[] = [
    { key: 'compress',  label: 'Compress',        desc: 'Shrink file size with no visible loss', Icon: Minimize2, Comp: CompressTool },
    { key: 'convert',   label: 'Convert format',  desc: 'WebP, AVIF, JPEG, PNG, TIFF, GIF',       Icon: RefreshCw, Comp: ConvertTool },
    { key: 'resize',    label: 'Resize',          desc: 'Exact pixels or scale by percentage',    Icon: Maximize2, Comp: ResizeTool },
    { key: 'crop',      label: 'Crop',            desc: 'Trim to an area or aspect ratio',        Icon: Crop,      Comp: CropTool },
    { key: 'rotate',    label: 'Rotate & flip',   desc: 'Mirror or rotate to any angle',          Icon: RotateCcw, Comp: RotateTool },
    { key: 'watermark', label: 'Watermark',       desc: 'Stamp text, logo or copyright',          Icon: Type,      Comp: WatermarkTool },
    { key: 'enhance',   label: 'Auto enhance',    desc: 'Correct colour, contrast, brightness',   Icon: Sparkles,  Comp: EnhanceTool },
    { key: 'metadata',  label: 'Remove metadata', desc: 'Strip EXIF, GPS and camera data',        Icon: ShieldOff, Comp: MetadataTool },
];

/**
 * ToolsPanel — the dashboard "Tools" hub. A single dropdown switches between
 * every homepage tool, each rendered in `embedded` mode (no Header/hero/Footer).
 * Responsive: the dropdown is full-width on mobile and caps at the tool width.
 */
export default function ToolsPanel({ initialTool }: { initialTool?: string }): React.JSX.Element {
    const [activeKey, setActiveKey] = useState<string>(
        TOOLS.some(t => t.key === initialTool) ? (initialTool as string) : 'compress',
    );
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const active = TOOLS.find(t => t.key === activeKey) ?? TOOLS[0]!;
    const Active = active.Comp;

    // Close the dropdown on outside click / Escape
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
    }, []);

    return (
        <div>
            {/* ── Tool selector dropdown ─────────────────────────────── */}
            <div ref={ref} style={{ position: 'relative', maxWidth: '760px', margin: '0 auto 18px', padding: '0 20px' }}>
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                        padding: '13px 16px', borderRadius: '12px',
                        border: `1.5px solid ${open ? c.accent : c.border}`,
                        background: c.white, cursor: 'pointer', textAlign: 'left',
                        transition: 'border-color 0.15s',
                    }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '9px', background: `${c.accent}12`, flexShrink: 0 }}>
                        <active.Icon size={18} color={c.accent} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: c.text }}>{active.label}</span>
                        <span style={{ display: 'block', fontSize: '0.78rem', color: c.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.desc}</span>
                    </span>
                    <ChevronDown size={18} color={c.textMuted} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>

                {open && (
                    <div
                        role="listbox"
                        style={{
                            position: 'absolute', top: 'calc(100% + 6px)', left: '20px', right: '20px', zIndex: 50,
                            background: c.white, border: `1px solid ${c.border}`, borderRadius: '12px',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '6px', maxHeight: '60vh', overflowY: 'auto',
                        }}
                    >
                        {TOOLS.map(t => {
                            const isActive = t.key === activeKey;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => { setActiveKey(t.key); setOpen(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '11px', width: '100%',
                                        padding: '10px 11px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                                        background: isActive ? `${c.accent}10` : 'transparent', textAlign: 'left',
                                    }}
                                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = c.bgMuted; }}
                                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '8px', background: isActive ? `${c.accent}18` : c.bgMuted, flexShrink: 0 }}>
                                        <t.Icon size={16} color={isActive ? c.accent : c.textSecondary} />
                                    </span>
                                    <span style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: c.text }}>{t.label}</span>
                                        <span style={{ display: 'block', fontSize: '0.76rem', color: c.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Active tool (embedded — no Header/hero/Footer) ──────── */}
            <Active embedded />
        </div>
    );
}
