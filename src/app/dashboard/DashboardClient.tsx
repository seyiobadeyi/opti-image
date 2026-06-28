'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
    History, Image as ImageIcon, Settings, SlidersHorizontal,
    ArrowRight, Upload, Pencil, Check, X, Download, RefreshCw, AlertTriangle, BarChart3, Film, Package,
    Users, Copy, Share2, Gift, Crown, Calendar, ExternalLink, Images, Camera, Send, Eye,
    Lock, Globe, UserCircle, Clock as ClockIcon, CheckCircle, Unlock, GripVertical, Crosshair, ChevronDown, ChevronUp, Info, WifiOff, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { apiClient, NetworkError } from '@/lib/api';
import { cloudinaryDownloadUrl } from '@/lib/download';
import { createClient } from '@/utils/supabase/client';
import { loadPrefs, savePrefs } from '@/lib/preferences';
import type {
    DashboardClientProps, DashboardTab, DashboardFileNames, ImageSettings,
    VideoSettings, VideoResult, ProcessedImage, ProcessingSummary,
    FileWithCustomName, ProcessingHistoryItem, ReferralStats,
    Gallery, GalleryItem,
} from '@/types';
import { c } from '@/lib/colors';

// ─── Helper Functions ───────────────────────────────────────────
function formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ─── Skeleton ────────────────────────────────────────────────────
function SkeletonBox({ width, height, style }: { width?: string; height?: string; style?: React.CSSProperties }): React.JSX.Element {
    return (
        <div style={{
            width: width || '100%',
            height: height || '16px',
            background: `linear-gradient(90deg, ${c.bgMuted} 25%, #2a2a3e 50%, ${c.bgMuted} 75%)`,
            backgroundSize: '200% 100%',
            animation: 'skeletonPulse 1.5s ease-in-out infinite',
            borderRadius: '8px',
            ...style,
        }} />
    );
}

// ─── Tabs ────────────────────────────────────────────────────────
const LogoIcon = ({ size: _size }: { size?: number }): React.JSX.Element => <img src="/logo.png" alt="Optimage" style={{ height: '1.1em', width: 'auto', objectFit: 'contain', verticalAlign: 'middle' }} />;

const TABS: { key: DashboardTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { key: 'optimize', label: 'Images', icon: LogoIcon },
    { key: 'video', label: 'Video', icon: Film },
    { key: 'history', label: 'History', icon: History },
    { key: 'galleries', label: 'Galleries', icon: Images },
    { key: 'referrals', label: 'Referrals', icon: Users },
    { key: 'settings', label: 'Preferences', icon: Settings },
];

// ─── History Row ─────────────────────────────────────────────────
function HistoryRow({ item }: { item: import('@/types').ProcessingHistoryItem }): React.JSX.Element {
    const [copied, setCopied] = useState(false);
    const copyLink = () => {
        if (!item.hosted_url) return;
        navigator.clipboard.writeText(item.hosted_url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <tr style={{ borderBottom: `1px solid ${c.border}` }}>
            <td style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.hosted_url ? (
                        <img src={item.hosted_url} alt={item.file_name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, background: c.bgMuted }} />
                    ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: c.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ImageIcon size={18} color={c.textMuted} />
                        </div>
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, maxWidth: '200px' }}>{item.file_name}</span>
                </div>
            </td>
            <td style={{ padding: '16px 24px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(46,213,115,0.1)', color: '#2ed573', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>{item.action_type}</span>
            </td>
            <td style={{ padding: '16px 24px' }}>
                {item.action_type === 'compress' ? (
                    <span style={{ color: c.success, fontWeight: 600 }}>{formatBytes(item.original_size)} → {formatBytes(item.processed_size)}</span>
                ) : <span style={{ color: c.textMuted }}>-</span>}
            </td>
            <td style={{ padding: '16px 24px' }}>
                {item.hosted_url ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                            onClick={copyLink}
                            title="Copy hosted URL"
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', border: `1px solid ${c.border}`, background: copied ? 'rgba(46,213,115,0.1)' : c.bgMuted, color: copied ? c.success : c.textSecondary, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                        >
                            {copied ? <Check size={13} /> : <Copy size={13} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                        <a href={item.hosted_url} target="_blank" rel="noopener noreferrer" title="Open image" style={{ display: 'flex', alignItems: 'center', padding: '5px', borderRadius: '8px', border: `1px solid ${c.border}`, background: c.bgMuted, color: c.textMuted, transition: 'color 0.15s' }}>
                            <ExternalLink size={13} />
                        </a>
                    </div>
                ) : <span style={{ color: c.textMuted, fontSize: '0.85rem' }}>—</span>}
            </td>
            <td style={{ padding: '16px 24px', color: c.textSecondary }}>{formatDate(item.created_at)}</td>
        </tr>
    );
}

// ─── Username Form ───────────────────────────────────────────────
function UsernameForm({ profile }: { profile: import('@/types').UserProfile | null }): React.JSX.Element {
    const [username, setUsername] = useState(profile?.username ?? '');
    const [checkResult, setCheckResult] = useState<'available' | 'taken' | 'idle' | 'checking'>('idle');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const usernamePattern = /^[a-z0-9_]{3,30}$/;
    const currentUsername = profile?.username ?? '';

    // Debounced availability check
    useEffect(() => {
        if (!username || username === currentUsername) {
            setCheckResult('idle');
            return;
        }
        if (!usernamePattern.test(username)) {
            setCheckResult('idle');
            return;
        }
        setCheckResult('checking');
        const timer = setTimeout(() => {
            apiClient.checkUsernameAvailable(username)
                .then(available => setCheckResult(available ? 'available' : 'taken'))
                .catch(() => setCheckResult('idle'));
        }, 500);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!usernamePattern.test(username)) {
            setError('Username must be 3–30 characters: lowercase letters, numbers, underscores only.');
            return;
        }
        if (checkResult === 'taken') {
            setError('This username is already taken. Please choose another.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await apiClient.updateProfile({ username });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setError('Failed to save username. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const statusColor = checkResult === 'available' ? '#2ed573' : checkResult === 'taken' ? '#ef4444' : c.textMuted;
    const statusText = checkResult === 'available' ? 'Available' : checkResult === 'taken' ? 'Already taken' : checkResult === 'checking' ? 'Checking…' : '';

    return (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentUsername && (
                <p style={{ fontSize: '0.82rem', color: c.textMuted, margin: 0 }}>
                    Current username: <strong style={{ color: c.text }}>@{currentUsername}</strong>
                </p>
            )}
            <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: c.textMuted, marginBottom: '4px' }}>New username</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={username}
                        maxLength={30}
                        minLength={3}
                        pattern="^[a-z0-9_]{3,30}$"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                            setError(null);
                            setSaved(false);
                        }}
                        placeholder="e.g. jane_smith"
                        style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${checkResult === 'available' ? '#2ed57366' : checkResult === 'taken' ? '#ef444466' : c.border}`, background: c.bgMuted, color: c.text, fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' as const, outline: 'none' }}
                    />
                    {statusText && (
                        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.78rem', color: statusColor, whiteSpace: 'nowrap' }}>
                            {statusText}
                        </span>
                    )}
                </div>
                <p style={{ fontSize: '0.75rem', color: c.textMuted, marginTop: '4px', margin: '4px 0 0 0' }}>
                    3–30 characters. Lowercase letters, numbers, and underscores only.
                </p>
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0 }}>{error}</p>}
            <button
                type="submit"
                disabled={saving || checkResult === 'taken' || checkResult === 'checking' || username === currentUsername}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem', alignSelf: 'flex-start' }}
            >
                {saved ? 'Saved' : saving ? 'Saving…' : 'Save username'}
            </button>
        </form>
    );
}

// ─── Branding Form ───────────────────────────────────────────────
function BrandingForm({ profile }: { profile: import('@/types').UserProfile | null }): React.JSX.Element {
    const [studioName, setStudioName] = useState(profile?.branding_studio_name ?? '');
    const [color, setColor]           = useState(profile?.branding_color ?? c.accent);
    const [website, setWebsite]       = useState(profile?.branding_website ?? '');
    const [saving, setSaving]         = useState(false);
    const [saved, setSaved]           = useState(false);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setSaving(true);
        try {
            await apiClient.updateProfile({
                branding_studio_name: studioName.trim() || undefined,
                branding_color: color || undefined,
                branding_website: website.trim() || undefined,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            // silent
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: c.textMuted, marginBottom: '4px' }}>Studio / photographer name</label>
                <input type="text" value={studioName} maxLength={60}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudioName(e.target.value)}
                    placeholder="e.g. Davies Gbadebo Photography"
                    style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${c.border}`, background: c.bgMuted, color: c.text, fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' as const, outline: 'none' }}
                />
            </div>
            <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: c.textMuted, marginBottom: '4px' }}>Brand colour</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="color" value={color}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
                        style={{ width: '44px', height: '44px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none', padding: '2px' }}
                    />
                    <input type="text" value={color} maxLength={7}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
                        placeholder="#db5a42"
                        style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${c.border}`, background: c.bgMuted, color: c.text, fontSize: '0.9rem', width: '120px', outline: 'none' }}
                    />
                    <span style={{ color: c.textMuted, fontSize: '0.82rem' }}>Shown on gallery pages</span>
                </div>
            </div>
            <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: c.textMuted, marginBottom: '4px' }}>Your website (optional)</label>
                <input type="url" value={website} maxLength={200}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${c.border}`, background: c.bgMuted, color: c.text, fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' as const, outline: 'none' }}
                />
            </div>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', alignSelf: 'flex-start' }}>
                {saved ? 'Saved' : saving ? 'Saving…' : 'Save branding'}
            </button>
        </form>
    );
}

// ─── Galleries Tab ───────────────────────────────────────────────
const GALLERY_INPUT_STYLE: React.CSSProperties = {
    padding: '10px 14px', borderRadius: '10px',
    border: `1px solid ${c.border}`, background: c.bgMuted,
    color: c.text, fontSize: '0.9rem', width: '100%',
};

function GalleriesTab({ ownerUsername, initialGalleryId }: { ownerUsername: string | null; initialGalleryId?: string }): React.JSX.Element {
    const router = useRouter();
    // ── list state
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // ── create form state
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [createTitle, setCreateTitle] = useState<string>('');
    const [createPin, setCreatePin] = useState<string>('');
    const [createDesc, setCreateDesc] = useState<string>('');
    const [createAccessType, setCreateAccessType] = useState<'public' | 'pin' | 'account'>('public');
    const [createAllowDownload, setCreateAllowDownload] = useState<boolean>(true);
    const [createPaymentRequired, setCreatePaymentRequired] = useState<boolean>(false);
    const [createPaymentInstructions, setCreatePaymentInstructions] = useState<string>('');
    const [createExpiresAt, setCreateExpiresAt] = useState<string>('');
    const [creating, setCreating] = useState<boolean>(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // ── manage view state
    const [activeGallery, setActiveGallery] = useState<Gallery | null>(null);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [itemsLoading, setItemsLoading] = useState<boolean>(false);
    const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
    const [uploadError, setUploadError] = useState<string | null>(null);
    // Separate from uploadError: a failure to LOAD the gallery's photos (vs. a failed upload).
    const [loadError, setLoadError] = useState<{ message: string; canRetry: boolean } | null>(null);
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

    // ── gallery manage tab + edit form
    const [galleryTab, setGalleryTab]         = useState<'photos' | 'submissions' | 'settings' | 'activity'>('photos');
    const [submissions, setSubmissions]       = useState<import('@/types').GallerySubmission[]>([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);
    const [submissionBusyId, setSubmissionBusyId]     = useState<string | null>(null);
    const [showMoreMenu, setShowMoreMenu]     = useState<boolean>(false);
    const [editTitle, setEditTitle]           = useState<string>('');
    const [editDesc, setEditDesc]             = useState<string>('');
    const [editAccessType, setEditAccessType] = useState<'public' | 'pin' | 'account'>('public');
    const [editPin, setEditPin]               = useState<string>('');
    const [editAllowDownload, setEditAllowDownload]           = useState<boolean>(true);
    const [editPaymentRequired, setEditPaymentRequired]       = useState<boolean>(false);
    const [editPaymentInstructions, setEditPaymentInstructions] = useState<string>('');
    const [editExpiresAt, setEditExpiresAt]   = useState<string>('');
    const [editSaving, setEditSaving]         = useState<boolean>(false);
    const [editError, setEditError]           = useState<string | null>(null);
    const [editSaved, setEditSaved]           = useState<boolean>(false);

    // ── Photo reorder + focal point + detail modal state
    const [draggedId, setDraggedId]           = useState<string | null>(null);
    const [dragOverId, setDragOverId]         = useState<string | null>(null);
    const [photoModal, setPhotoModal]         = useState<GalleryItem | null>(null); // detail/focal modal
    const [focalPicking, setFocalPicking]     = useState<boolean>(false); // focal pick mode inside photo modal
    const [showTips, setShowTips]             = useState<boolean>(false);

    // ── Slug edit state (settings tab)
    const [editSlug, setEditSlug]             = useState<string>('');
    const [slugCheck, setSlugCheck]           = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

    useEffect(() => {
        if (!activeGallery) return;
        const clean = editSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        if (!clean || clean === activeGallery.slug) { setSlugCheck('idle'); return; }
        if (clean.length < 3) { setSlugCheck('taken'); return; }
        setSlugCheck('checking');
        const t = setTimeout(() => {
            void apiClient.checkSlugAvailable(clean, activeGallery.id).then(res => {
                setSlugCheck(res.available ? 'available' : 'taken');
            }).catch(() => setSlugCheck('idle'));
        }, 500);
        return () => clearTimeout(t);
    }, [editSlug, activeGallery]);

    // ── Send to client state
    const [sendingTo, setSendingTo]           = useState<string | null>(null); // gallery ID being sent
    const [sendEmail, setSendEmail]           = useState('');
    const [sendMessage, setSendMessage]       = useState('');
    const [sendLoading, setSendLoading]       = useState(false);
    const [sendSuccess, setSendSuccess]       = useState(false);
    const [sendError, setSendError]           = useState<string | null>(null);

    // ── Activity state
    const [activityGalleryId, setActivityGalleryId] = useState<string | null>(null);
    const [activity, setActivity]             = useState<import('@/types').GalleryActivity | null>(null);
    const [messages, setMessages]             = useState<Array<{ id: string; guest_name: string; message: string; created_at: string }>>([]);
    const [activityLoading, setActivityLoading] = useState(false);
    const [clientStatus, setClientStatus]     = useState<{ client_email: string | null; proofing_finalized_at: string | null } | null>(null);
    const [reopeningProofing, setReopeningProofing] = useState(false);
    const [removingClient, setRemovingClient] = useState(false);

    useEffect(() => {
        apiClient.listGalleries().then(data => {
            setGalleries(data);
            setLoading(false);
            // Auto-open gallery if ID was passed in URL (?gallery=...)
            if (initialGalleryId) {
                const target = data.find(g => g.id === initialGalleryId);
                if (target) void openGallery(target);
            }
        }).catch(() => setLoading(false));
        // openGallery is stable (defined in render scope); intentionally omitted from deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialGalleryId]);

    // ── load (or reload) the photos for a gallery; safe to call repeatedly (retry)
    const loadGalleryItems = async (gallery: Gallery): Promise<void> => {
        setItems([]);
        setLoadError(null);
        setItemsLoading(true);
        try {
            // Always pass the owner's Supabase token so the server can grant
            // owner-level access regardless of gallery access_type (e.g. PIN-protected)
            const { createClient: mkClient } = await import('@/utils/supabase/client');
            const { data: sessionData } = await mkClient().auth.getSession();
            const supabaseToken = sessionData.session?.access_token;
            const token = await apiClient.verifyGalleryAccess(gallery.slug, undefined, undefined, supabaseToken);
            const data = await apiClient.getGalleryItems(gallery.slug, token);
            setItems(data.items);
        } catch (err) {
            const isNetwork =
                err instanceof NetworkError ||
                (err instanceof Error && /failed to fetch|network|load failed/i.test(err.message));
            setLoadError(
                isNetwork
                    ? { message: 'We couldn’t reach the server to load your photos — it may be waking up after being idle. Give it a moment and try again.', canRetry: true }
                    : { message: 'Something went wrong loading your photos. Please try again.', canRetry: true },
            );
            setItems([]);
        } finally {
            setItemsLoading(false);
        }
    };

    // ── open manage view and load items
    const openGallery = async (gallery: Gallery): Promise<void> => {
        router.push(`/dashboard/galleries?gallery=${gallery.id}`, { scroll: false });
        setActiveGallery(gallery);
        setUploadError(null);
        setGalleryTab('photos');
        setShowMoreMenu(false);
        setEditTitle(gallery.title);
        setEditDesc(gallery.description || '');
        setEditAccessType((gallery.access_type === 'email_list' ? 'public' : gallery.access_type) as 'public' | 'pin' | 'account');
        setEditPin('');
        setEditAllowDownload(gallery.allow_download ?? true);
        setEditPaymentRequired(gallery.payment_required ?? false);
        setEditPaymentInstructions((gallery as Gallery & { payment_instructions?: string }).payment_instructions || '');
        setEditExpiresAt(gallery.expires_at ? (new Date(gallery.expires_at).toISOString().split('T')[0] ?? '') : '');
        setEditSlug(gallery.slug);
        setSlugCheck('idle');
        setEditSaved(false);
        setEditError(null);
        void loadSubmissions(gallery.id);
        await loadGalleryItems(gallery);
    };

    const closeGallery = (): void => {
        router.push('/dashboard/galleries', { scroll: false });
        setActiveGallery(null);
        setItems([]);
        setUploadError(null);
        setLoadError(null);
    };

    // ── create
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!createTitle.trim()) return;
        setCreating(true);
        setCreateError(null);
        try {
            const gallery = await apiClient.createGallery({
                title: createTitle.trim(),
                description: createDesc.trim() || undefined,
                pin: createAccessType === 'pin' ? (createPin.trim() || undefined) : undefined,
                access_type: createAccessType,
                allow_download: createAllowDownload,
                payment_required: createPaymentRequired,
                payment_instructions: createPaymentRequired ? createPaymentInstructions.trim() : undefined,
                expires_at: createExpiresAt ? new Date(createExpiresAt).toISOString() : undefined,
            });
            setGalleries(prev => [gallery, ...prev]);
            setShowCreate(false);
            setCreateTitle(''); setCreatePin(''); setCreateDesc('');
            setCreateAccessType('public'); setCreateAllowDownload(true);
            setCreatePaymentRequired(false); setCreatePaymentInstructions('');
            setCreateExpiresAt('');
        } catch (err: unknown) {
            setCreateError(err instanceof Error ? err.message : 'Failed to create gallery');
        } finally {
            setCreating(false);
        }
    };

    // ── delete gallery
    const handleDelete = async (id: string): Promise<void> => {
        if (!window.confirm('Delete this gallery and all its photos? This cannot be undone.')) return;
        await apiClient.deleteGallery(id).catch(() => null);
        setGalleries(prev => prev.filter(g => g.id !== id));
        if (activeGallery?.id === id) closeGallery();
    };

    // ── upload photos to active gallery
    const handleUpload = async (files: File[] | FileList | null): Promise<void> => {
        if (!activeGallery || !files || files.length === 0) return;
        setUploadError(null);

        const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (fileArr.length === 0) { setUploadError('Only image files are supported.'); return; }
        if (fileArr.length > 20) { setUploadError('Upload up to 20 images at a time.'); return; }

        for (const file of fileArr) {
            const tempId = `uploading-${Math.random().toString(36).slice(2)}`;
            setUploadingIds(prev => new Set(prev).add(tempId));
            try {
                const item = await apiClient.uploadGalleryImage(activeGallery.id, file);
                setItems(prev => [...prev, item]);
                setLoadError(null);
                // update item_count on gallery card
                setGalleries(prev => prev.map(g =>
                    g.id === activeGallery.id ? { ...g, item_count: (g.item_count ?? 0) + 1 } : g
                ));
            } catch (err: unknown) {
                setUploadError(`Failed to upload "${file.name}": ${err instanceof Error ? err.message : 'Unknown error'}`);
            } finally {
                setUploadingIds(prev => { const s = new Set(prev); s.delete(tempId); return s; });
            }
        }
    };

    // ── remove single photo
    const handleRemoveItem = async (itemId: string): Promise<void> => {
        if (!activeGallery) return;
        if (!window.confirm('Remove this photo from the gallery?')) return;
        try {
            await apiClient.deleteGalleryItem(activeGallery.id, itemId);
            setItems(prev => prev.filter(i => i.id !== itemId));
            setGalleries(prev => prev.map(g =>
                g.id === activeGallery.id ? { ...g, item_count: Math.max(0, (g.item_count ?? 1) - 1) } : g
            ));
        } catch {
            // silently ignore
        }
    };

    // ── set gallery cover photo
    const handleSetCover = async (item: GalleryItem): Promise<void> => {
        if (!activeGallery) return;
        try {
            await apiClient.updateGallery(activeGallery.id, { cover_image_url: item.display_url });
            const updated = { ...activeGallery, cover_image_url: item.display_url };
            setActiveGallery(updated);
            setGalleries(prev => prev.map(g => g.id === activeGallery.id ? updated : g));
        } catch {
            // silently fail — cover is cosmetic
        }
    };

    // ── drag-to-reorder
    const handleDragStart = (id: string): void => { setDraggedId(id); };
    const handleDragOver = (e: React.DragEvent, id: string): void => {
        e.preventDefault();
        if (id !== draggedId) setDragOverId(id);
    };
    const handleDrop = (targetId: string): void => {
        if (!draggedId || draggedId === targetId) { setDraggedId(null); setDragOverId(null); return; }
        setItems(prev => {
            const arr = [...prev];
            const fromIdx = arr.findIndex(i => i.id === draggedId);
            const toIdx   = arr.findIndex(i => i.id === targetId);
            if (fromIdx === -1 || toIdx === -1) return prev;
            const [moved] = arr.splice(fromIdx, 1);
            if (!moved) return prev;
            arr.splice(toIdx, 0, moved);
            const reordered = arr.map((item, idx) => ({ ...item, sort_order: idx }));
            // Persist new order (fire-and-forget)
            if (activeGallery) {
                void apiClient.reorderGalleryItems(
                    activeGallery.id,
                    reordered.map(({ id, sort_order }) => ({ id, sort_order }))
                );
            }
            return reordered;
        });
        setDraggedId(null);
        setDragOverId(null);
    };

    // ── set focal point for a photo (click position within the image element)
    const handleFocalClick = (e: React.MouseEvent<HTMLImageElement>): void => {
        if (!photoModal) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        const fp = `${x}% ${y}%`;
        const updated = { ...photoModal, focal_point: fp };
        setItems(prev => prev.map(i => i.id === photoModal.id ? updated : i));
        setPhotoModal(updated);
        void apiClient.updateGalleryItem(photoModal.gallery_id, photoModal.id, { focal_point: fp });
        if (activeGallery && activeGallery.cover_image_url === photoModal.display_url) {
            void apiClient.updateGallery(activeGallery.id, { cover_focal_point: fp });
            setActiveGallery(prev => prev ? { ...prev, cover_focal_point: fp } : prev);
        }
        setFocalPicking(false);
    };

    // ── gallery link helper (returns the canonical /:username/:slug URL).
    // Every account has a username (auto-assigned + backfilled); the legacy /g/
    // route has been removed, so username is the only address form. The root
    // fallback only covers the brief window before the profile has loaded.
    const galleryUrl = (slug: string): string => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return ownerUsername ? `${origin}/${ownerUsername}/${slug}` : origin;
    };

    // ── copy gallery link to clipboard
    const copyLink = (slug: string): void => {
        navigator.clipboard.writeText(galleryUrl(slug)).then(() => {
            setCopiedSlug(slug);
            setTimeout(() => setCopiedSlug(null), 2000);
        }).catch(() => null);
    };

    // ── send gallery to client via email
    const handleSendToClient = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!sendingTo || !sendEmail.trim()) return;
        setSendLoading(true);
        setSendError(null);
        try {
            await apiClient.sendGalleryToClient(sendingTo, sendEmail.trim(), sendMessage.trim() || undefined);
            setSendSuccess(true);
            setTimeout(() => {
                setSendingTo(null); setSendEmail(''); setSendMessage('');
                setSendSuccess(false);
            }, 3000);
        } catch (err: unknown) {
            setSendError(err instanceof Error ? err.message : 'Failed to send email');
        } finally {
            setSendLoading(false);
        }
    };

    // ── load activity + guestbook messages for a gallery
    const loadActivity = async (id: string): Promise<void> => {
        setActivityGalleryId(id);
        setActivityLoading(true);
        try {
            const [data, msgs, client] = await Promise.all([
                apiClient.getGalleryActivity(id),
                apiClient.getGalleryMessages(id).catch(() => [] as typeof messages),
                apiClient.getGalleryClientStatus(id).catch(() => null),
            ]);
            setActivity(data);
            setMessages(msgs);
            setClientStatus(client);
        } finally {
            setActivityLoading(false);
        }
    };

    const handleReopenProofing = async (id: string): Promise<void> => {
        setReopeningProofing(true);
        try {
            await apiClient.reopenProofing(id);
            setClientStatus(prev => prev ? { ...prev, proofing_finalized_at: null } : prev);
        } finally {
            setReopeningProofing(false);
        }
    };

    const handleRemoveClient = async (id: string): Promise<void> => {
        if (!window.confirm('Remove this client? They will lose access and their selection will be cleared.')) return;
        setRemovingClient(true);
        try {
            await apiClient.removeGalleryClient(id);
            setClientStatus(null);
        } finally {
            setRemovingClient(false);
        }
    };

    // ── load pending photo submissions for a gallery
    const loadSubmissions = async (id: string): Promise<void> => {
        setSubmissionsLoading(true);
        try {
            setSubmissions(await apiClient.getGallerySubmissions(id, 'pending'));
        } catch {
            setSubmissions([]);
        } finally {
            setSubmissionsLoading(false);
        }
    };

    const handleApproveSubmission = async (subId: string): Promise<void> => {
        if (!activeGallery) return;
        setSubmissionBusyId(subId);
        try {
            const item = await apiClient.approveGallerySubmission(activeGallery.id, subId);
            setItems(prev => [...prev, item]);
            setSubmissions(prev => prev.filter(s => s.id !== subId));
            setGalleries(prev => prev.map(g => g.id === activeGallery.id ? { ...g, item_count: (g.item_count ?? 0) + 1 } : g));
        } catch { /* surfaced via disabled state; non-critical */ } finally {
            setSubmissionBusyId(null);
        }
    };

    const handleRejectSubmission = async (subId: string): Promise<void> => {
        if (!activeGallery) return;
        setSubmissionBusyId(subId);
        try {
            await apiClient.rejectGallerySubmission(activeGallery.id, subId);
            setSubmissions(prev => prev.filter(s => s.id !== subId));
        } catch { /* non-critical */ } finally {
            setSubmissionBusyId(null);
        }
    };

    // ── unlock gallery after confirming offline payment received
    const handleUnlock = async (): Promise<void> => {
        if (!activeGallery) return;
        try {
            await apiClient.unlockGallery(activeGallery.id);
            const updated = { ...activeGallery, payment_unlocked: true };
            setActiveGallery(updated);
            setGalleries(prev => prev.map(g => g.id === activeGallery.id ? updated : g));
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Failed to confirm payment');
        }
    };

    // ── toggle draft / live status
    const handleToggleDraft = async (): Promise<void> => {
        if (!activeGallery) return;
        const goingDraft = activeGallery.status !== 'draft';
        try {
            await apiClient.setGalleryDraft(activeGallery.id, goingDraft);
            const updated = { ...activeGallery, status: (goingDraft ? 'draft' : 'active') as Gallery['status'] };
            setActiveGallery(updated);
            setGalleries(prev => prev.map(g => g.id === activeGallery.id ? updated : g));
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Failed to update gallery status');
        }
    };

    // ── save gallery settings edits
    const handleUpdateSettings = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!activeGallery || !editTitle.trim()) return;
        setEditSaving(true);
        setEditError(null);
        try {
            const slugChanged = editSlug.trim() !== activeGallery.slug;
            if (slugChanged && slugCheck === 'taken') {
                setEditError('That URL is already taken — choose a different one.');
                setEditSaving(false);
                return;
            }
            const updated = await apiClient.updateGallery(activeGallery.id, {
                title: editTitle.trim(),
                description: editDesc.trim() || undefined,
                slug: slugChanged ? editSlug.trim() : undefined,
                access_type: editAccessType,
                pin: editAccessType === 'pin' && editPin.trim() ? editPin.trim() : undefined,
                clearPin: editAccessType !== 'pin' && activeGallery.access_type === 'pin',
                allow_download: editAllowDownload,
                payment_required: editPaymentRequired,
                payment_instructions: editPaymentRequired ? editPaymentInstructions.trim() : undefined,
                expires_at: editExpiresAt ? new Date(editExpiresAt).toISOString() : null,
            });
            setActiveGallery(updated);
            setGalleries(prev => prev.map(g => g.id === updated.id ? updated : g));
            setEditSaved(true);
            setTimeout(() => setEditSaved(false), 3000);
        } catch (err: unknown) {
            setEditError(err instanceof Error ? err.message : 'Failed to save changes');
        } finally {
            setEditSaving(false);
        }
    };

    // ── Gallery photo upload — react-dropzone (must be declared before any early returns)
    const { getRootProps: getGalleryDropProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDragActive } = useDropzone({
        onDrop: (acceptedFiles: File[]) => { if (acceptedFiles.length > 0) void handleUpload(acceptedFiles); },
        accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/tiff': ['.tif', '.tiff'], 'image/heic': ['.heic'], 'image/heif': ['.heif'] },
        maxFiles: 20,
        maxSize: 100 * 1024 * 1024,
        disabled: uploadingIds.size > 0,
    });

    // ─── Loading skeleton
    if (loading) {
        return <div style={{ padding: '40px', color: c.textMuted, textAlign: 'center' }}>Loading galleries…</div>;
    }

    // ─── Manage view (active gallery open)
    if (activeGallery) {
        const isLive = activeGallery.status !== 'draft';
        const openPreview = () => {
            const base = galleryUrl(activeGallery.slug);
            if (activeGallery.status === 'draft') {
                apiClient.getOwnerPreviewToken(activeGallery.id)
                    .then(token => window.open(`${base}?ownerToken=${encodeURIComponent(token)}`, '_blank'))
                    .catch(() => window.open(base, '_blank'));
            } else {
                window.open(base, '_blank');
            }
        };

        const TAB_STYLE = (active: boolean): React.CSSProperties => ({
            padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.88rem', fontWeight: active ? 600 : 400,
            color: active ? c.accent : c.textMuted,
            borderBottom: `2px solid ${active ? c.accent : 'transparent'}`,
            transition: 'all 0.15s',
        });

        return (
            <div style={{ maxWidth: '900px' }} onClick={() => showMoreMenu && setShowMoreMenu(false)}>

                {/* ── Header ── */}
                <div style={{ marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                        <button onClick={closeGallery}
                            style={{ padding: '8px 14px', borderRadius: '10px', border: `1px solid ${c.border}`, background: c.white, color: c.textSecondary, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', marginTop: '2px' }}>
                            ← Back
                        </button>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {activeGallery.title}
                            </h3>
                            <p style={{ color: c.textMuted, fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                {itemsLoading ? '…' : `${items.length} photo${items.length !== 1 ? 's' : ''}`}
                                <span style={{ opacity: 0.4 }}>·</span>
                                {activeGallery.access_type === 'pin'
                                    ? <><Lock size={11} /> PIN protected</>
                                    : activeGallery.access_type === 'account'
                                        ? <><UserCircle size={11} /> Account required</>
                                        : <><Globe size={11} /> Public</>}
                                {activeGallery.payment_required && !activeGallery.payment_unlocked && (
                                    <><span style={{ opacity: 0.4 }}>·</span><span style={{ color: '#fb923c', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><ClockIcon size={11} /> Awaiting payment</span></>
                                )}
                                {activeGallery.payment_required && activeGallery.payment_unlocked && (
                                    <><span style={{ opacity: 0.4 }}>·</span><span style={{ color: '#22c55e', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><CheckCircle size={11} /> Payment confirmed</span></>
                                )}
                            </p>
                        </div>

                        {/* Right-side actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                            {/* Status toggle */}
                            <button onClick={() => void handleToggleDraft()}
                                style={{ padding: '7px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', border: `1px solid ${isLive ? 'rgba(34,197,94,0.35)' : 'rgba(234,179,8,0.4)'}`, background: isLive ? 'rgba(34,197,94,0.08)' : 'rgba(234,179,8,0.08)', color: isLive ? '#22c55e' : '#fbbf24' }}>
                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                                {isLive ? 'Live' : 'Offline'}
                            </button>

                            <button onClick={() => copyLink(activeGallery.slug)}
                                style={{ padding: '7px 14px', borderRadius: '10px', border: `1px solid ${c.border}`, background: c.white, color: c.text, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Copy size={13} /> {copiedSlug === activeGallery.slug ? 'Copied!' : 'Copy link'}
                            </button>

                            <button onClick={openPreview}
                                style={{ padding: '7px 14px', borderRadius: '10px', border: `1px solid ${c.border}`, background: c.white, color: c.text, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ExternalLink size={13} /> Preview
                            </button>

                            {/* ··· more menu */}
                            <div style={{ position: 'relative' }}>
                                <button onClick={(e) => { e.stopPropagation(); setShowMoreMenu(v => !v); }}
                                    style={{ padding: '7px 10px', borderRadius: '10px', border: `1px solid ${c.border}`, background: c.white, color: c.text, fontSize: '1rem', cursor: 'pointer', lineHeight: 1 }}>
                                    ···
                                </button>
                                {showMoreMenu && (
                                    <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: c.white, border: `1px solid ${c.border}`, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 50, minWidth: '200px', overflow: 'hidden' }}>
                                        {activeGallery.payment_required && !activeGallery.payment_unlocked && (
                                            <button onClick={() => { void handleUnlock(); setShowMoreMenu(false); }}
                                                style={{ width: '100%', padding: '11px 16px', background: 'none', border: 'none', borderBottom: `1px solid ${c.border}`, color: '#22c55e', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                                <Unlock size={14} /> Confirm payment received
                                            </button>
                                        )}
                                        <button onClick={() => { setSendingTo(activeGallery.id); setSendEmail(''); setSendMessage(''); setSendSuccess(false); setSendError(null); setShowMoreMenu(false); }}
                                            style={{ width: '100%', padding: '11px 16px', background: 'none', border: 'none', borderBottom: `1px solid ${c.border}`, color: c.text, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Send size={14} /> Send to client
                                        </button>
                                        <button onClick={() => { void handleDelete(activeGallery.id); setShowMoreMenu(false); }}
                                            style={{ width: '100%', padding: '11px 16px', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <X size={14} /> Delete gallery
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Tab bar ── */}
                    <div style={{ display: 'flex', borderBottom: `1px solid ${c.border}`, marginTop: '16px' }}>
                        <button style={TAB_STYLE(galleryTab === 'photos')} onClick={() => setGalleryTab('photos')}>
                            Photos
                        </button>
                        <button style={TAB_STYLE(galleryTab === 'submissions')} onClick={() => setGalleryTab('submissions')}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                Submissions
                                {submissions.length > 0 && (
                                    <span style={{ background: c.accent, color: '#fff', borderRadius: '999px', padding: '0px 7px', fontSize: '0.7rem', fontWeight: 700 }}>{submissions.length}</span>
                                )}
                            </span>
                        </button>
                        <button style={TAB_STYLE(galleryTab === 'settings')} onClick={() => setGalleryTab('settings')}>
                            Settings
                        </button>
                        <button style={TAB_STYLE(galleryTab === 'activity')} onClick={() => setGalleryTab('activity')}>
                            Activity
                        </button>
                    </div>
                </div>

                {/* ── Send to client panel ── */}
                {sendingTo === activeGallery.id && (
                    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '20px', margin: '16px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Send size={14} /> Send gallery to client</h4>
                            <button onClick={() => setSendingTo(null)} style={{ background: 'none', border: 'none', color: c.textMuted, cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        {sendSuccess ? (
                            <p style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}><Check size={15} /> Email sent successfully.</p>
                        ) : (
                            <form onSubmit={handleSendToClient} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <p style={{ color: c.textMuted, fontSize: '0.8rem', margin: '0 0 4px 0' }}>
                                    They&apos;ll be able to sign in with this email to view the gallery, like photos, and finalize their selection — see the Client section under Activity.
                                </p>
                                {sendError && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{sendError}</p>}
                                <input type="email" required value={sendEmail} placeholder="Client email address" onChange={(e) => setSendEmail(e.target.value)} style={GALLERY_INPUT_STYLE} />
                                <textarea value={sendMessage} rows={3} maxLength={500} placeholder="Optional personal message…" onChange={(e) => setSendMessage(e.target.value)} style={{ ...GALLERY_INPUT_STYLE, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
                                <button type="submit" disabled={sendLoading} className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '7px', alignSelf: 'flex-start' }}>
                                    <Send size={14} /> {sendLoading ? 'Sending…' : 'Send email'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* ══ PHOTOS TAB ══ */}
                {galleryTab === 'photos' && (
                    <div style={{ paddingTop: '20px' }}>
                        {/* Upload zone — compact when photos exist */}
                        <div {...getGalleryDropProps()} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            padding: items.length > 0 ? '16px 24px' : '40px 24px',
                            borderRadius: '14px',
                            border: `2px dashed ${isGalleryDragActive ? c.accent : c.border}`,
                            background: isGalleryDragActive ? c.accentLight : c.bgMuted,
                            cursor: uploadingIds.size > 0 ? 'wait' : 'pointer',
                            marginBottom: '20px', transition: 'all 0.2s',
                        }}>
                            <input {...getGalleryInputProps()} />
                            <Upload size={items.length > 0 ? 18 : 26} color={isGalleryDragActive ? c.accent : c.textMuted} />
                            <div>
                                <p style={{ color: c.textSecondary, fontSize: items.length > 0 ? '0.85rem' : '0.92rem', margin: 0, fontWeight: 500 }}>
                                    {uploadingIds.size > 0
                                        ? `Uploading ${uploadingIds.size} photo${uploadingIds.size !== 1 ? 's' : ''}…`
                                        : isGalleryDragActive ? 'Release to upload' : 'Drag & drop photos here or click to browse'}
                                </p>
                                <p style={{ color: c.textMuted, fontSize: '0.75rem', margin: '2px 0 0 0' }}>JPEG, PNG, WebP, HEIC · up to 20 at a time</p>
                            </div>
                        </div>

                        {uploadError && (
                            <div style={{ padding: '11px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {uploadError}
                                <button onClick={() => setUploadError(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={14} /></button>
                            </div>
                        )}

                        {itemsLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: c.textMuted }}>Loading photos…</div>
                        ) : loadError ? (
                            <div style={{ textAlign: 'center', padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                    <WifiOff size={22} />
                                </div>
                                <p style={{ color: c.text, fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>Couldn’t load your photos</p>
                                <p style={{ color: c.textMuted, fontSize: '0.85rem', margin: 0, maxWidth: '420px', lineHeight: 1.55 }}>{loadError.message}</p>
                                {loadError.canRetry && (
                                    <button
                                        onClick={() => { void loadGalleryItems(activeGallery); }}
                                        className="btn btn-primary"
                                        style={{ padding: '9px 20px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '2px' }}
                                    >
                                        <RefreshCw size={14} /> Try again
                                    </button>
                                )}
                            </div>
                        ) : items.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px', color: c.textMuted, fontSize: '0.88rem' }}>
                                No photos yet — drop some above to get started.
                            </div>
                        ) : (
                            <>
                                <p style={{ fontSize: '0.75rem', color: c.textMuted, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <GripVertical size={12} /> Drag to reorder · click a photo to edit details and set focal point
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                                    {items.map(item => {
                                        const isCover = activeGallery.cover_image_url === item.display_url;
                                        const fp = item.focal_point || '50% 50%';
                                        return (
                                            <div
                                                key={item.id}
                                                draggable
                                                onDragStart={() => handleDragStart(item.id)}
                                                onDragOver={(e) => handleDragOver(e, item.id)}
                                                onDrop={() => handleDrop(item.id)}
                                                onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                                                onClick={() => { setPhotoModal(item); setFocalPicking(false); }}
                                                className="gallery-grid-item"
                                                style={{
                                                    position: 'relative', borderRadius: '10px', overflow: 'hidden',
                                                    background: c.bgMuted, aspectRatio: '1',
                                                    border: dragOverId === item.id ? `2px solid ${c.accent}` : isCover ? `2px solid ${c.accent}` : `1px solid ${c.border}`,
                                                    opacity: draggedId === item.id ? 0.35 : 1,
                                                    cursor: 'pointer', transition: 'border-color 0.15s, opacity 0.15s',
                                                }}
                                            >
                                                <img src={item.display_url} alt={item.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: fp, display: 'block', pointerEvents: 'none' }} />
                                                {isCover && (
                                                    <div style={{ position: 'absolute', top: '6px', left: '6px', background: c.accent, color: c.white, fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: '5px', pointerEvents: 'none' }}>Cover</div>
                                                )}
                                                {item.focal_point && (
                                                    <div style={{ position: 'absolute', left: fp.split(' ')[0], top: fp.split(' ')[1], transform: 'translate(-50%,-50%)', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid white', background: c.accent, boxShadow: '0 0 0 1px rgba(0,0,0,0.4)', pointerEvents: 'none' }} />
                                                )}
                                                <div className="gallery-grid-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.18s', pointerEvents: 'none' }}>
                                                    <Eye size={20} color="white" />
                                                </div>
                                                <GripVertical size={13} color="white" style={{ position: 'absolute', bottom: '6px', right: '6px', opacity: 0.6, pointerEvents: 'none', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* ── Tips panel ── */}
                        <div style={{ marginTop: '24px', border: `1px solid ${c.border}`, borderRadius: '14px', overflow: 'hidden' }}>
                            <button onClick={() => setShowTips(v => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: c.white, border: 'none', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, color: c.textSecondary }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><Info size={13} color={c.accent} /> Photo tips & display guide</span>
                                {showTips ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                            {showTips && (
                                <div style={{ padding: '0 16px 16px 16px', background: c.white, borderTop: `1px solid ${c.border}` }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', paddingTop: '14px' }}>
                                        {[
                                            { title: 'Cover photo', body: 'Use landscape, at least 1600×900 px. It fills the full screen so size matters — anything smaller looks blurry on large displays.' },
                                            { title: 'Grid crop', body: 'Photos show as squares. Click a photo and use "Set focus" to pin the crop point so faces and subjects stay centred.' },
                                            { title: 'Mobile (2 columns)', body: 'Portrait shots fill nicely. Wide landscapes lose their edges — set a focus point to lock what matters.' },
                                            { title: 'Desktop (3–4 cols)', body: 'Images render at ~260 px squares. Fine detail matters less than composition and colour.' },
                                            { title: 'File format', body: 'JPEG for photos. WebP gives the smallest files at equal quality. PNG only if you need transparency.' },
                                            { title: 'Upload limits', body: 'Up to 50 MB per image, 20 images per batch. Upload in multiple batches for larger galleries.' },
                                        ].map(tip => (
                                            <div key={tip.title} style={{ background: c.bgMuted, borderRadius: '9px', padding: '10px 12px' }}>
                                                <p style={{ fontSize: '0.75rem', fontWeight: 700, margin: '0 0 4px 0', color: c.accent }}>{tip.title}</p>
                                                <p style={{ fontSize: '0.73rem', color: c.textSecondary, margin: 0, lineHeight: 1.5 }}>{tip.body}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Photo detail / focal-point modal ── */}
                        {photoModal && (
                            <div
                                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                                onClick={() => { setPhotoModal(null); setFocalPicking(false); }}
                            >
                                <div
                                    style={{ background: c.white, borderRadius: '20px', width: '100%', maxWidth: '820px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    {/* Modal header */}
                                    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photoModal.filename}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: c.textMuted }}>
                                                {photoModal.width && photoModal.height ? `${photoModal.width} × ${photoModal.height} px · ` : ''}{formatBytes(photoModal.original_size)}
                                                {photoModal.focal_point && <span style={{ color: c.accent }}> · focus {photoModal.focal_point}</span>}
                                            </p>
                                        </div>
                                        <button onClick={() => { setPhotoModal(null); setFocalPicking(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, flexShrink: 0 }}><X size={18} /></button>
                                    </div>

                                    {/* Image area */}
                                    <div style={{ flex: 1, overflow: 'auto', background: '#111', position: 'relative', minHeight: '200px' }}>
                                        {focalPicking ? (
                                            <div style={{ position: 'relative', lineHeight: 0 }}>
                                                <img
                                                    src={photoModal.display_url}
                                                    alt={photoModal.filename}
                                                    onClick={handleFocalClick}
                                                    style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair', maxHeight: '58vh', objectFit: 'contain' }}
                                                />
                                                <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Crosshair size={13} /> Click on the subject to set focal point
                                                    <button onClick={() => setFocalPicking(false)} style={{ marginLeft: '8px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.72rem', padding: '3px 8px', cursor: 'pointer' }}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ position: 'relative', lineHeight: 0 }}>
                                                <img
                                                    src={photoModal.display_url}
                                                    alt={photoModal.filename}
                                                    style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '58vh', objectFit: 'contain' }}
                                                />
                                                {/* Focal point dot on full image (positioned relative to contain-fit image) */}
                                                {photoModal.focal_point && (
                                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                            <div title={`Focal point: ${photoModal.focal_point}`} style={{ position: 'absolute', left: photoModal.focal_point.split(' ')[0], top: photoModal.focal_point.split(' ')[1], transform: 'translate(-50%,-50%)', width: '16px', height: '16px', borderRadius: '50%', border: '3px solid white', background: c.accent, boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.5)' }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions row */}
                                    <div style={{ padding: '14px 18px', borderTop: `1px solid ${c.border}`, display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {/* Set cover */}
                                        <button
                                            onClick={() => { void handleSetCover(photoModal); setPhotoModal(prev => prev ? { ...prev } : null); }}
                                            style={{ padding: '7px 13px', borderRadius: '9px', border: `1px solid ${activeGallery.cover_image_url === photoModal.display_url ? c.accent : c.border}`, background: activeGallery.cover_image_url === photoModal.display_url ? `${c.accent}15` : c.white, color: activeGallery.cover_image_url === photoModal.display_url ? c.accent : c.textSecondary, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}
                                        >
                                            <Camera size={13} /> {activeGallery.cover_image_url === photoModal.display_url ? 'Gallery cover ✓' : 'Set as cover'}
                                        </button>

                                        {/* Focal point */}
                                        <button
                                            onClick={() => setFocalPicking(v => !v)}
                                            style={{ padding: '7px 13px', borderRadius: '9px', border: `1px solid ${focalPicking ? c.accent : (photoModal.focal_point ? c.accent : c.border)}`, background: focalPicking ? `${c.accent}15` : (photoModal.focal_point ? `${c.accent}08` : c.white), color: focalPicking ? c.accent : (photoModal.focal_point ? c.accent : c.textSecondary), fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}
                                        >
                                            <Crosshair size={13} /> {focalPicking ? 'Cancel focus' : photoModal.focal_point ? 'Update focus' : 'Set focus point'}
                                        </button>
                                        {photoModal.focal_point && !focalPicking && (
                                            <button onClick={() => {
                                                const cleared = { ...photoModal, focal_point: null };
                                                setItems(prev => prev.map(i => i.id === photoModal.id ? cleared : i));
                                                setPhotoModal(cleared);
                                                void apiClient.updateGalleryItem(photoModal.gallery_id, photoModal.id, { focal_point: null });
                                            }} style={{ padding: '7px 10px', borderRadius: '9px', border: `1px solid ${c.border}`, background: c.white, color: c.textMuted, fontSize: '0.78rem', cursor: 'pointer' }}>
                                                Clear focus
                                            </button>
                                        )}

                                        <div style={{ flex: 1 }} />

                                        {/* Download — fl_attachment forces an immediate download instead of opening a tab */}
                                        <a href={cloudinaryDownloadUrl(photoModal.original_url, photoModal.filename)} download={photoModal.filename} rel="noopener" style={{ padding: '7px 13px', borderRadius: '9px', border: `1px solid ${c.border}`, background: c.white, color: c.textSecondary, fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Download size={13} /> Download original
                                        </a>

                                        {/* Remove */}
                                        <button
                                            onClick={() => { void handleRemoveItem(photoModal.id); setPhotoModal(null); }}
                                            style={{ padding: '7px 13px', borderRadius: '9px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <X size={13} /> Remove photo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ══ SUBMISSIONS TAB ══ */}
                {galleryTab === 'submissions' && (
                    <div style={{ paddingTop: '20px' }}>
                        <p style={{ fontSize: '0.85rem', color: c.textMuted, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                            Photos guests sent in for this gallery. Approve to add them to the gallery, or skip to discard. Only signed-in visitors can submit.
                        </p>
                        {submissionsLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: c.textMuted }}>Loading submissions…</div>
                        ) : submissions.length === 0 ? (
                            <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                                <Images size={34} style={{ color: c.textMuted, marginBottom: '10px' }} />
                                <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>No pending submissions</p>
                                <p style={{ color: c.textMuted, fontSize: '0.85rem', margin: 0 }}>When a visitor sends a photo, it shows up here for your review.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                                {submissions.map(sub => (
                                    <div key={sub.id} style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ aspectRatio: '1', background: '#111', overflow: 'hidden' }}>
                                            <img src={sub.display_url} alt={sub.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        </div>
                                        <div style={{ padding: '10px 12px' }}>
                                            <p style={{ margin: 0, fontSize: '0.78rem', color: c.textSecondary, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <UserCircle size={13} /> {sub.submitter_name}
                                            </p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: c.textMuted }}>{new Date(sub.created_at).toLocaleDateString()}</p>
                                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                                                <button
                                                    onClick={() => void handleApproveSubmission(sub.id)}
                                                    disabled={submissionBusyId === sub.id}
                                                    className="btn btn-primary"
                                                    style={{ flex: 1, padding: '7px 0', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', opacity: submissionBusyId === sub.id ? 0.6 : 1 }}>
                                                    <Check size={13} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => void handleRejectSubmission(sub.id)}
                                                    disabled={submissionBusyId === sub.id}
                                                    style={{ flex: 1, padding: '7px 0', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', opacity: submissionBusyId === sub.id ? 0.6 : 1 }}>
                                                    <X size={13} /> Skip
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ══ SETTINGS TAB ══ */}
                {galleryTab === 'settings' && (
                    <div style={{ paddingTop: '20px' }}>
                        <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '28px' }}>
                            <h4 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 700 }}>Gallery Settings</h4>
                            {editError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{editError}</p>}
                            {editSaved && <p style={{ color: '#22c55e', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} /> Changes saved.</p>}
                            <form onSubmit={handleUpdateSettings} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: '6px' }}>Gallery title</label>
                                    <input type="text" value={editTitle} required maxLength={120} onChange={(e) => setEditTitle(e.target.value)} style={GALLERY_INPUT_STYLE} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: '6px' }}>Description <span style={{ fontWeight: 400, color: c.textMuted }}>(optional)</span></label>
                                    <textarea value={editDesc} maxLength={500} rows={2} onChange={(e) => setEditDesc(e.target.value)} style={{ ...GALLERY_INPUT_STYLE, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: '4px' }}>Gallery URL</label>
                                    <p style={{ fontSize: '0.75rem', color: c.textMuted, margin: '0 0 8px 0' }}>
                                        Customize the end part of your gallery link. Only lowercase letters, numbers, and hyphens.
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', background: c.bgMuted, border: `1px solid ${slugCheck === 'taken' ? '#ef4444' : slugCheck === 'available' ? '#22c55e' : c.border}`, borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.15s' }}>
                                        <span style={{ padding: '10px 10px 10px 14px', fontSize: '0.82rem', color: c.textMuted, whiteSpace: 'nowrap', borderRight: `1px solid ${c.border}`, background: c.bgMuted }}>
                                            {ownerUsername ? `/${ownerUsername}/` : '/…/'}
                                        </span>
                                        <input
                                            type="text"
                                            value={editSlug}
                                            minLength={3}
                                            maxLength={80}
                                            placeholder="your-gallery-name"
                                            onChange={(e) => { setEditSlug(e.target.value); setSlugCheck('idle'); }}
                                            style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 12px', fontSize: '0.85rem', outline: 'none', color: c.text, minWidth: 0 }}
                                        />
                                        {slugCheck === 'checking' && <span style={{ padding: '0 12px', fontSize: '0.75rem', color: c.textMuted }}>Checking…</span>}
                                        {slugCheck === 'available' && <span style={{ padding: '0 12px', fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>Available</span>}
                                        {slugCheck === 'taken' && <span style={{ padding: '0 12px', fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Taken</span>}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: '6px' }}>Access</label>
                                    <select value={editAccessType} onChange={(e) => setEditAccessType(e.target.value as 'public' | 'pin' | 'account')} style={GALLERY_INPUT_STYLE}>
                                        <option value="public">Public — anyone with the link</option>
                                        <option value="pin">PIN protected</option>
                                        <option value="account">Requires Optimage account</option>
                                    </select>
                                </div>
                                {editAccessType === 'pin' && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: '6px' }}>New PIN <span style={{ fontWeight: 400, color: c.textMuted }}>(leave blank to keep existing)</span></label>
                                        <input type="text" value={editPin} maxLength={20} placeholder="Enter new PIN" onChange={(e) => setEditPin(e.target.value)} style={GALLERY_INPUT_STYLE} />
                                    </div>
                                )}
                                <div style={{ paddingTop: '4px', borderTop: `1px solid ${c.border}` }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: c.textSecondary, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={editAllowDownload} onChange={(e) => setEditAllowDownload(e.target.checked)} />
                                        Allow clients to download original-quality images
                                    </label>
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: c.textSecondary, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={editPaymentRequired} onChange={(e) => setEditPaymentRequired(e.target.checked)} />
                                        Require payment before client can access gallery
                                    </label>
                                </div>
                                {editPaymentRequired && (
                                    <textarea value={editPaymentInstructions} rows={4} maxLength={1000} placeholder="Payment instructions shown to your client…" onChange={(e) => setEditPaymentInstructions(e.target.value)} style={{ ...GALLERY_INPUT_STYLE, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
                                )}
                                <div style={{ paddingTop: '4px', borderTop: `1px solid ${c.border}` }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: '6px' }}>
                                        Expiry date <span style={{ fontWeight: 400, color: c.textMuted }}>(optional)</span>
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input type="date" value={editExpiresAt} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} onChange={(e) => setEditExpiresAt(e.target.value)} style={{ ...GALLERY_INPUT_STYLE, width: 'auto' }} />
                                        {editExpiresAt && (
                                            <button type="button" onClick={() => setEditExpiresAt('')} style={{ background: 'none', border: 'none', color: c.textMuted, fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Clear</button>
                                        )}
                                    </div>
                                </div>
                                <div style={{ paddingTop: '8px' }}>
                                    <button type="submit" disabled={editSaving} className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
                                        {editSaving ? 'Saving…' : 'Save changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ══ ACTIVITY TAB ══ */}
                {galleryTab === 'activity' && (
                    <div style={{ paddingTop: '20px' }}>
                        {activityLoading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: c.textMuted }}>Loading activity…</div>
                        ) : !activity || activityGalleryId !== activeGallery.id ? (
                            <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                                <BarChart3 size={36} style={{ color: c.textMuted, marginBottom: '12px' }} />
                                <p style={{ fontWeight: 600, marginBottom: '6px' }}>No data loaded</p>
                                <button className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '0.88rem' }} onClick={() => void loadActivity(activeGallery.id)}>
                                    Load activity
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                    <div style={{ padding: '20px 28px', background: c.white, border: `1px solid ${c.border}`, borderRadius: '14px', textAlign: 'center', minWidth: '120px' }}>
                                        <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: c.accent }}>{activity.totalViews}</p>
                                        <p style={{ color: c.textMuted, fontSize: '0.78rem', margin: '4px 0 0 0' }}>total views</p>
                                    </div>
                                </div>
                                {activity.recentViews.length > 0 ? (
                                    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '14px', overflow: 'hidden' }}>
                                        <p style={{ color: c.textMuted, fontSize: '0.75rem', margin: 0, padding: '12px 20px', borderBottom: `1px solid ${c.border}`, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent activity</p>
                                        {activity.recentViews.slice(0, 20).map((v, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 20px', borderBottom: i < Math.min(activity.recentViews.length, 20) - 1 ? `1px solid ${c.border}` : 'none', fontSize: '0.82rem' }}>
                                                <span style={{ color: c.textSecondary, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    {v.viewer_type === 'user' ? <><UserCircle size={13} /> Signed-in viewer</> : <><Globe size={13} /> Guest visitor</>}
                                                </span>
                                                <span style={{ color: c.textMuted }}>{new Date(v.created_at).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: c.textMuted, fontSize: '0.85rem' }}>No views yet. Share your gallery link to start getting visitors.</p>
                                )}

                                {/* ── Assigned client / proofing status ─────────────────────── */}
                                {clientStatus?.client_email && (
                                    <div style={{ marginTop: '24px' }}>
                                        <p style={{ color: c.textMuted, fontSize: '0.75rem', margin: '0 0 10px 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <UserCircle size={13} /> Client
                                        </p>
                                        <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: c.text }}>{clientStatus.client_email}</p>
                                                <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: c.textMuted, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    {clientStatus.proofing_finalized_at
                                                        ? <><CheckCircle size={13} style={{ color: '#22c55e' }} /> Finalized their selection on {new Date(clientStatus.proofing_finalized_at).toLocaleDateString()}</>
                                                        : 'Can sign in to view, like, and finalize their photo selection'}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {clientStatus.proofing_finalized_at && (
                                                    <button
                                                        onClick={() => void handleReopenProofing(activeGallery.id)}
                                                        disabled={reopeningProofing}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                                                    >
                                                        {reopeningProofing ? 'Reopening…' : 'Reopen for revisions'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => void handleRemoveClient(activeGallery.id)}
                                                    disabled={removingClient}
                                                    style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '10px', border: `1px solid ${c.border}`, background: c.white, color: '#ef4444', cursor: 'pointer' }}
                                                >
                                                    {removingClient ? 'Removing…' : 'Remove client'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Messages left by visitors ───────────────────────────── */}
                                <div style={{ marginTop: '24px' }}>
                                    <p style={{ color: c.textMuted, fontSize: '0.75rem', margin: '0 0 10px 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MessageSquare size={13} /> Messages {messages.length > 0 && <span style={{ background: c.accent, color: '#fff', borderRadius: '999px', padding: '1px 8px', fontSize: '0.7rem' }}>{messages.length}</span>}
                                    </p>
                                    {messages.length > 0 ? (
                                        <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '14px', overflow: 'hidden' }}>
                                            {messages.map((m, i) => (
                                                <div key={m.id} style={{ padding: '14px 20px', borderBottom: i < messages.length - 1 ? `1px solid ${c.border}` : 'none' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
                                                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: c.text }}>{m.guest_name}</span>
                                                        <span style={{ color: c.textMuted, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(m.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.88rem', color: c.textSecondary, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: c.textMuted, fontSize: '0.85rem', margin: 0 }}>No messages yet. Visitors can leave a note from the “Leave a message” button on your gallery.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // ─── Gallery list view
    return (
        <div style={{ maxWidth: '860px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Client Galleries</h3>
                    <p style={{ color: c.textMuted, fontSize: '0.9rem' }}>Share PIN-protected photo galleries with clients for download.</p>
                </div>
                <button onClick={() => setShowCreate(v => !v)} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                    {showCreate ? 'Cancel' : '+ New Gallery'}
                </button>
            </div>

            {showCreate && (
                <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '16px' }}>Create Gallery</h4>
                    {createError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{createError}</p>}
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input type="text" value={createTitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateTitle(e.target.value)}
                            placeholder="Gallery title (e.g. Smith Wedding 2026)" required maxLength={120}
                            style={GALLERY_INPUT_STYLE}
                        />
                        <input type="text" value={createDesc}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateDesc(e.target.value)}
                            placeholder="Short description (optional)" maxLength={500}
                            style={GALLERY_INPUT_STYLE}
                        />
                        <select value={createAccessType}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCreateAccessType(e.target.value as 'public' | 'pin' | 'account')}
                            style={GALLERY_INPUT_STYLE}
                        >
                            <option value="public">Public — anyone with the link</option>
                            <option value="pin">PIN protected</option>
                            <option value="account">Requires Optimage account (free)</option>
                        </select>
                        {createAccessType === 'pin' && (
                            <input type="text" value={createPin}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreatePin(e.target.value)}
                                placeholder="Enter PIN for this gallery" maxLength={20}
                                style={GALLERY_INPUT_STYLE}
                            />
                        )}
                        {createAccessType === 'account' && (
                            <p style={{ fontSize: '0.82rem', color: c.textMuted, margin: '0', padding: '8px 12px', background: c.bgMuted, borderRadius: '8px' }}>
                                Viewers will need to sign in or create a free Optimage account. No subscription required to view.
                            </p>
                        )}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: c.textSecondary, cursor: 'pointer' }}>
                            <input type="checkbox" checked={createAllowDownload}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateAllowDownload(e.target.checked)} />
                            Allow clients to download original-quality images
                        </label>

                        {/* Payment gate */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: c.textSecondary, cursor: 'pointer', paddingTop: '4px', borderTop: `1px solid ${c.border}` }}>
                            <input type="checkbox" checked={createPaymentRequired}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreatePaymentRequired(e.target.checked)} />
                            Require payment before client can access gallery
                        </label>
                        {createPaymentRequired && (
                            <textarea
                                value={createPaymentInstructions}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCreatePaymentInstructions(e.target.value)}
                                placeholder={`Payment instructions shown to your client. For example:\n\nBank transfer: Acme Bank, Account 0123456789\nAccount name: Jane Smith Photography\nAmount: ₦150,000\n\nSend receipt to jane@jsmithphoto.com`}
                                rows={5} maxLength={1000}
                                style={{ ...GALLERY_INPUT_STYLE, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                            />
                        )}
                        {/* Expiry date */}
                        <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: '12px' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', color: c.textMuted, marginBottom: '6px' }}>
                                Gallery expiry (optional) — leave blank for no expiry
                            </label>
                            <input
                                type="date"
                                value={createExpiresAt}
                                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateExpiresAt(e.target.value)}
                                style={GALLERY_INPUT_STYLE}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="submit" disabled={creating} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                                {creating ? 'Creating…' : 'Create Gallery'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {galleries.length === 0 ? (
                <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '56px', textAlign: 'center' }}>
                    <Images size={44} style={{ color: c.textMuted, marginBottom: '16px' }} />
                    <p style={{ fontWeight: 600, marginBottom: '6px' }}>No galleries yet</p>
                    <p style={{ color: c.textMuted, fontSize: '0.85rem' }}>Create your first gallery to share photos with clients.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {galleries.map(gallery => (
                        <div key={gallery.id} style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '16px 20px', cursor: 'default' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                {/* Left: info */}
                                <div
                                    style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                                    onClick={() => void openGallery(gallery)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                                        <h4 style={{ fontSize: '1rem', margin: 0 }}>{gallery.title}</h4>
                                        {gallery.access_type === 'pin' && (
                                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: c.bgMuted, borderRadius: '8px', color: c.textMuted, display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Lock size={10} style={{ verticalAlign: 'middle' }} /> PIN</span>
                                        )}
                                        {gallery.access_type === 'public' && (
                                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', color: '#22c55e', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Globe size={10} style={{ verticalAlign: 'middle' }} /> Public</span>
                                        )}
                                        {gallery.access_type === 'account' && (
                                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(124,58,237,0.12)', borderRadius: '8px', color: '#a78bfa', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><UserCircle size={10} style={{ verticalAlign: 'middle' }} /> Account</span>
                                        )}
                                        {gallery.status === 'draft' && (
                                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(234,179,8,0.12)', borderRadius: '8px', color: '#fbbf24', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}><AlertTriangle size={10} style={{ verticalAlign: 'middle' }} /> Offline</span>
                                        )}
                                        {gallery.payment_required && !gallery.payment_unlocked && (
                                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(249,115,22,0.12)', borderRadius: '8px', color: '#fb923c', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}><ClockIcon size={10} style={{ verticalAlign: 'middle' }} /> Awaiting payment</span>
                                        )}
                                        {typeof gallery.item_count === 'number' && (
                                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: c.bgMuted, borderRadius: '8px', color: c.textMuted }}>
                                                {gallery.item_count} photo{gallery.item_count !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                    {gallery.description && <p style={{ color: c.textMuted, fontSize: '0.82rem', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{gallery.description}</p>}
                                    <p style={{ color: c.textMuted, fontSize: '0.72rem', margin: 0 }}>
                                        Created {new Date(gallery.created_at).toLocaleDateString()}
                                        {' · '}
                                        <span
                                            style={{ color: c.accent, cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); void openGallery(gallery).then(() => { setGalleryTab('activity'); void loadActivity(gallery.id); }); }}
                                        >
                                            View activity
                                        </span>
                                    </p>
                                </div>

                                {/* Right: actions */}
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <button onClick={() => void openGallery(gallery)}
                                        className="btn btn-primary"
                                        style={{ padding: '7px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Upload size={12} /> Manage
                                    </button>
                                    <button onClick={() => copyLink(gallery.slug)}
                                        style={{ padding: '7px 12px', borderRadius: '8px', background: c.bgMuted, border: `1px solid ${c.border}`, color: c.text, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Copy size={11} /> {copiedSlug === gallery.slug ? 'Copied!' : 'Link'}
                                    </button>
                                    <a href={galleryUrl(gallery.slug)} target="_blank" rel="noreferrer"
                                        style={{ padding: '7px 12px', borderRadius: '8px', background: c.bgMuted, border: `1px solid ${c.border}`, color: c.text, fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <ExternalLink size={11} />
                                    </a>
                                    <button onClick={() => void handleDelete(gallery.id)}
                                        style={{ padding: '7px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer' }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────
const VALID_TABS: DashboardTab[] = ['optimize', 'video', 'history', 'galleries', 'referrals', 'settings'];

function tabFromPathname(pathname: string): DashboardTab {
    const segment = pathname.split('/')[2] as DashboardTab | undefined;
    return segment && VALID_TABS.includes(segment) ? segment : 'optimize';
}

export default function DashboardClient({ user, profile, history: initialHistory, initialTab = 'optimize', initialGalleryId }: DashboardClientProps): React.JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const [history, setHistory] = useState<ProcessingHistoryItem[]>(initialHistory || []);

    // Derive active tab from URL — always in sync with the address bar
    const activeTab: DashboardTab = tabFromPathname(pathname) ?? initialTab;

    const setActiveTab = (tab: DashboardTab): void => {
        router.push(`/dashboard/${tab}`, { scroll: false });
    };

    // ── Inline optimizer state ─────────────────────────
    const [files, setFiles] = useState<FileWithCustomName[]>([]);
    const [fileNames, setFileNames] = useState<DashboardFileNames>({});
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [imageSettings, setImageSettings] = useState<ImageSettings>(() => loadPrefs({
        format: '', quality: 80, width: '', height: '',
        rotate: 0, autoEnhance: false,
        stripMetadata: true, maintainAspectRatio: true,
        exposure: 1.0, saturation: 1.0, filter: '',
        flipHorizontal: false, flipVertical: false,
    }));
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [processed, setProcessed] = useState<number>(0);
    const [results, setResults] = useState<ProcessedImage[] | null>(null);
    const [summary, setSummary] = useState<ProcessingSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ── Prefs state (UI-only for now) ──────────────────
    const [prefsAutoWebP, setPrefsAutoWebP] = useState<boolean>(true);
    const [prefsStripMeta, setPrefsStripMeta] = useState<boolean>(true);

    // ── Video state ────────────────────────────────────
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoSettings, setVideoSettings] = useState<VideoSettings>({ format: 'mp4', quality: 28, action: 'compress' });
    const [videoProcessing, setVideoProcessing] = useState<boolean>(false);
    const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);

    // ── Referral state ────────────────────
    const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
    const [referralLoading, setReferralLoading] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        // Load referral stats
        apiClient.getReferralStats()
            .then(setReferralStats)
            .catch(() => setReferralStats(null))
            .finally(() => setReferralLoading(false));
    }, []);

    // ── Load preferences from localStorage on mount ───
    useEffect(() => {
        try {
            const storedAutoWebP = localStorage.getItem('pref_auto_webp');
            const storedStripMeta = localStorage.getItem('pref_strip_meta');
            const autoWebP = storedAutoWebP !== null ? storedAutoWebP === 'true' : false;
            const stripMeta = storedStripMeta !== null ? storedStripMeta !== 'false' : true;
            if (storedAutoWebP !== null) setPrefsAutoWebP(autoWebP);
            if (storedStripMeta !== null) setPrefsStripMeta(stripMeta);
            setImageSettings(prev => ({
                ...prev,
                ...(storedAutoWebP !== null && { format: autoWebP ? 'webp' : prev.format }),
                ...(storedStripMeta !== null && { stripMetadata: stripMeta }),
            }));
        } catch { /* localStorage not available */ }
    }, []);

    // Persist image settings whenever they change
    useEffect(() => {
        savePrefs(imageSettings);
    }, [imageSettings]);

    const handlePrefsAutoWebPChange = (val: boolean): void => {
        setPrefsAutoWebP(val);
        try { localStorage.setItem('pref_auto_webp', String(val)); } catch { /* ignore */ }
        setImageSettings(prev => ({ ...prev, format: val ? 'webp' : '' }));
    };

    const handlePrefsStripMetaChange = (val: boolean): void => {
        setPrefsStripMeta(val);
        try { localStorage.setItem('pref_strip_meta', String(val)); } catch { /* ignore */ }
        setImageSettings(prev => ({ ...prev, stripMetadata: val }));
    };

    const referralLink = referralStats?.referralCode
        ? `${typeof window !== 'undefined' ? window.location.origin : 'https://optimage.dreamintrepid.com'}/?ref=${referralStats.referralCode}`
        : null;

    const handleCopyReferralLink = (): void => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = referralLink;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShareTwitter = (): void => {
        if (!referralLink) return;
        const text = encodeURIComponent('Check out Optimage, the fastest way to optimize images, compress videos, and transcribe media!');
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`, '_blank');
    };

    const handleShareWhatsApp = (): void => {
        if (!referralLink) return;
        const text = encodeURIComponent(`Check out Optimage: optimize images, compress videos & transcribe media! ${referralLink}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleShareEmail = (): void => {
        if (!referralLink) return;
        const subject = encodeURIComponent('Try Optimage: Image & Media Optimization');
        const body = encodeURIComponent(`Hey! I've been using Optimage to optimize images and compress videos. Check it out:\n\n${referralLink}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
    };


    // ── Stats ──────────────────────────────────────────
    const totalProcessed = history?.length || 0;
    const totalSaved = history?.reduce((acc, curr) => {
        if (curr.action_type === 'compress') return acc + ((curr.original_size || 0) - (curr.processed_size || 0));
        return acc;
    }, 0) || 0;

    // ── File Handling ──────────────────────────────────
    const handleFilesAdded = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        const incomingFiles = Array.from(e.target.files || []) as FileWithCustomName[];
        setFiles(prev => [...prev, ...incomingFiles].slice(0, 50));
        setResults(null);
        setSummary(null);
        setError(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const incomingFiles = (Array.from(e.dataTransfer.files) as FileWithCustomName[]).filter(f => f.type.startsWith('image/'));
        setFiles(prev => [...prev, ...incomingFiles].slice(0, 50));
        setResults(null);
        setSummary(null);
        setError(null);
    }, []);

    // ── react-dropzone for the Images/Optimize tab
    const { getRootProps: getImagesDropProps, getInputProps: getImagesInputProps, isDragActive: isImagesDragActive } = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
            const incomingFiles = acceptedFiles as FileWithCustomName[];
            setFiles(prev => [...prev, ...incomingFiles].slice(0, 50));
            setResults(null);
            setSummary(null);
            setError(null);
        },
        accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/avif': ['.avif'], 'image/tiff': ['.tif', '.tiff'], 'image/gif': ['.gif'], 'image/bmp': ['.bmp'], 'image/heic': ['.heic'], 'image/heif': ['.heif'] },
        maxFiles: 50,
        maxSize: 100 * 1024 * 1024,
        disabled: isProcessing,
    });

    // ── react-dropzone for the Video tab
    const { getRootProps: getVideoDropProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
            const f = acceptedFiles[0];
            if (!f) return;
            const maxVideoSizeMb = parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50', 10);
            if (f.size > maxVideoSizeMb * 1024 * 1024) {
                setVideoError(`Video exceeds the ${maxVideoSizeMb}MB maximum limit for this environment.`);
                setVideoFile(null);
            } else {
                setVideoFile(f); setVideoResult(null); setVideoError(null);
            }
        },
        accept: { 'video/mp4': ['.mp4'], 'video/webm': ['.webm'], 'video/quicktime': ['.mov'], 'video/x-msvideo': ['.avi'] },
        maxFiles: 1,
        maxSize: parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50', 10) * 1024 * 1024,
        disabled: videoProcessing,
    });

    const handleRemoveFile = useCallback((index: number): void => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFileNames(prev => {
            const clone = { ...prev };
            delete clone[index];
            return clone;
        });
    }, []);

    const handleClearAll = useCallback((): void => {
        setFiles([]);
        setFileNames({});
        setResults(null);
        setSummary(null);
        setError(null);
        setProcessed(0);
    }, []);

    // ── Rename Handling ────────────────────────────────
    const startRename = (index: number): void => {
        const file = files[index];
        const currentName = fileNames[index] ?? (file ? file.name.replace(/\.[^/.]+$/, '') : '');
        setEditingIndex(index);
        setEditValue(currentName);
    };
    const saveRename = (index: number): void => {
        setFileNames(prev => ({ ...prev, [index]: editValue }));
        setEditingIndex(null);
    };
    const cancelRename = (): void => {
        setEditingIndex(null);
        setEditValue('');
    };

    const getDisplayName = (index: number): string => {
        const custom = fileNames[index];
        if (custom) return custom;
        const file = files[index];
        return file ? file.name.replace(/\.[^/.]+$/, '') : '';
    };

    // ── Thumbnails ─────────────────────────────────────
    const thumbnails = useMemo(() => {
        return files.map(file => URL.createObjectURL(file));
    }, [files]);

    // ── Processing ─────────────────────────────────────
    const handleOptimize = async (): Promise<void> => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setError(null);
        setResults(null);
        setSummary(null);
        setProcessed(0);

        try {
            const batchSize = 10;
            const allResults = [];
            let totalOriginalSize = 0;
            let totalProcessedSize = 0;

            for (let i = 0; i < files.length; i += batchSize) {
                const batch = files.slice(i, i + batchSize);
                const response = await apiClient.convertImages(batch, imageSettings);

                if (response.success) {
                    allResults.push(...response.results);
                    totalOriginalSize += response.summary.totalOriginalSize;
                    totalProcessedSize += response.summary.totalProcessedSize;

                    const newHistoryItems = response.results.map(r => ({
                        id: crypto.randomUUID(),
                        file_name: r.originalName,
                        action_type: 'compress',
                        original_size: r.originalSize,
                        processed_size: r.processedSize,
                        created_at: new Date().toISOString()
                    }));
                    setHistory(prev => [...newHistoryItems, ...prev]);
                }
                setProcessed(Math.min(i + batchSize, files.length));
            }

            const totalSavings = totalOriginalSize - totalProcessedSize;
            setResults(allResults);
            setSummary({
                filesProcessed: allResults.length,
                totalOriginalSize, totalProcessedSize,
                totalSavings,
                totalSavingsPercent: totalOriginalSize > 0 ? ((totalSavings / totalOriginalSize) * 100).toFixed(1) : '0.0',
            });
        } catch (err: unknown) {
            console.error('Processing error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async (processedName: string, index: number): Promise<void> => {
        const customName = fileNames[index];
        const ext = processedName.split('.').pop() ?? '';
        const downloadFileName = customName ? `${customName}.${ext}` : processedName;
        try {
            const response = await fetch(apiClient.getDownloadUrl(processedName));
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err: unknown) {
            console.error('Download failed:', err instanceof Error ? err.message : 'Unknown error');
            alert('Download failed. Please try again.');
        }
    };

    // ────────────────────────────────────────────────────
    return (
        <div className="dashboard-wrapper">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 800, letterSpacing: '-0.02em' }}>Your Workspace</h1>
                    <p style={{ color: c.textMuted, fontSize: '1.05rem' }}>Welcome back, <span style={{ color: c.text, fontWeight: 500 }}>{profile?.display_name || user.email}</span></p>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', background: c.white, borderRadius: '20px', border: `1px solid ${c.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: c.textSecondary, fontSize: '0.9rem', marginBottom: '8px' }}><ImageIcon size={16} /> Images Processed</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalProcessed}</div>
                </div>
                <div style={{ padding: '20px', background: c.gradient, borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, fontSize: '0.9rem', marginBottom: '8px' }}>
                        <img src="/logo.png" alt="Bandwidth" style={{ height: '1.2em', width: 'auto', objectFit: 'contain' }} /> Bandwidth Saved
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{formatBytes(totalSaved)}</div>
                    <img src="/logo.png" alt="" style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '80px', height: '80px', opacity: 0.15, objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '20px', background: c.white, borderRadius: '20px', border: `1px solid ${c.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: c.textSecondary, fontSize: '0.9rem', marginBottom: '8px' }}><BarChart3 size={16} /> Avg Compression</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalProcessed > 0 && totalSaved > 0 ? `${((totalSaved / (totalSaved + (history?.reduce((a, c) => a + (c.processed_size || 0), 0) || 1))) * 100).toFixed(0)}%` : 'N/A'}</div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="dashboard-tabs">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px 20px', fontSize: '0.95rem', fontWeight: 600,
                                border: 'none', borderBottom: isActive ? `2px solid ${c.accent}` : '2px solid transparent',
                                background: 'transparent', color: isActive ? c.text : c.textMuted,
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            <Icon size={18} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ═══════════ Tab: Optimize ═══════════ */}
            {activeTab === 'optimize' && (
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {/* Left: Dropzone + File List */}
                    <div style={{ flex: '1 1 55%', minWidth: '280px' }}>
                        {!results ? (
                            <>
                                {/* Drop Zone */}
                                <div
                                    {...getImagesDropProps()}
                                    style={{
                                        border: `2px dashed ${isImagesDragActive ? c.accent : c.border}`,
                                        borderRadius: '24px',
                                        padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
                                        background: isImagesDragActive ? c.accentLight : c.white,
                                        marginBottom: '24px',
                                        transition: 'border-color 0.2s, background 0.2s',
                                    }}
                                >
                                    <input {...getImagesInputProps()} />
                                    <Upload size={40} color={isImagesDragActive ? c.accent : c.textMuted} style={{ marginBottom: '16px' }} />
                                    <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
                                        {isImagesDragActive ? 'Release to add images' : 'Drop images here or click to browse'}
                                    </p>
                                    <p style={{ color: c.textMuted, fontSize: '0.9rem' }}>JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG, BMP • Up to 50 files</p>
                                </div>

                                {/* File Cards with Rename */}
                                {files.length > 0 && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                                <ImageIcon size={18} /> {files.length} file{files.length !== 1 ? 's' : ''} queued
                                            </h3>
                                            <button onClick={handleClearAll} className="text-btn" style={{ color: c.textMuted, fontSize: '0.85rem' }}>Clear all</button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {files.map((file, index) => (
                                                <div key={`${file.name}-${index}`} style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px',
                                                    padding: '12px 16px', background: c.white, borderRadius: '16px',
                                                    border: `1px solid ${c.border}`,
                                                }}>
                                                    <img
                                                        src={thumbnails[index]}
                                                        alt={file.name}
                                                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                                    />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        {editingIndex === index ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <input
                                                                    autoFocus
                                                                    value={editValue}
                                                                    onChange={(e) => setEditValue(e.target.value)}
                                                                    onKeyDown={(e) => { if (e.key === 'Enter') saveRename(index); if (e.key === 'Escape') cancelRename(); }}
                                                                    style={{
                                                                        flex: 1, padding: '6px 10px', borderRadius: '8px',
                                                                        border: `1px solid ${c.accent}`, background: c.bgMuted,
                                                                        color: c.text, outline: 'none', fontSize: '0.9rem',
                                                                    }}
                                                                />
                                                                <button onClick={() => saveRename(index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: c.success, padding: '4px' }}><Check size={18} /></button>
                                                                <button onClick={cancelRename} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: c.textMuted, padding: '4px' }}><X size={18} /></button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.name}>
                                                                    {getDisplayName(index)}
                                                                </span>
                                                                {fileNames[index] && <span style={{ fontSize: '0.75rem', color: c.accent, background: 'rgba(219,90,66,0.1)', padding: '2px 8px', borderRadius: '100px', flexShrink: 0 }}>renamed</span>}
                                                                <button onClick={() => startRename(index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: c.textMuted, padding: '2px', flexShrink: 0 }} title="Rename output file"><Pencil size={14} /></button>
                                                            </div>
                                                        )}
                                                        <div style={{ fontSize: '0.8rem', color: c.textMuted, marginTop: '2px' }}>
                                                            {formatBytes(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'IMAGE'}
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleRemoveFile(index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: c.textMuted, padding: '4px' }} title="Remove"><X size={18} /></button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                            <button
                                                className="btn btn-primary btn-large"
                                                onClick={handleOptimize}
                                                disabled={isProcessing || files.length === 0}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                            >
                                                {isProcessing ? (
                                                    <><RefreshCw size={18} className="spinner" /> Processing {processed}/{files.length}...</>
                                                ) : (
                                                    <><img src="/logo.png" alt="Optimize" style={{ height: '1.2em', width: 'auto', objectFit: 'contain' }} /> Optimize {files.length} Image{files.length !== 1 ? 's' : ''}</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', color: '#ef4444', marginTop: '16px' }}>
                                        <AlertTriangle size={20} /> {error}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* ── Results ── */
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ padding: '16px', background: c.white, borderRadius: '16px', border: `1px solid ${c.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary?.filesProcessed ?? 0}</div>
                                        <div style={{ fontSize: '0.8rem', color: c.textMuted }}>Processed</div>
                                    </div>
                                    <div style={{ padding: '16px', background: c.white, borderRadius: '16px', border: `1px solid ${c.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatBytes(summary?.totalOriginalSize ?? 0)}</div>
                                        <div style={{ fontSize: '0.8rem', color: c.textMuted }}>Original</div>
                                    </div>
                                    <div style={{ padding: '16px', background: c.white, borderRadius: '16px', border: `1px solid ${c.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatBytes(summary?.totalProcessedSize ?? 0)}</div>
                                        <div style={{ fontSize: '0.8rem', color: c.textMuted }}>New Size</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'rgba(46,213,115,0.1)', borderRadius: '16px', border: '1px solid rgba(46,213,115,0.2)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2ed573' }}>{summary?.totalSavingsPercent ?? '0'}%</div>
                                        <div style={{ fontSize: '0.8rem', color: c.textMuted }}>Saved</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {results.map((result, index) => (
                                        <div key={index} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '16px', background: c.white, borderRadius: '16px',
                                            border: `1px solid ${c.border}`, gap: '12px', flexWrap: 'wrap',
                                        }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {fileNames[index] || result.originalName}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: c.textMuted, marginTop: '4px' }}>
                                                    {formatBytes(result.originalSize)} → {formatBytes(result.processedSize)}
                                                    <span style={{ color: '#2ed573', marginLeft: '8px', fontWeight: 600 }}>↓ {result.savingsPercent}%</span>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleDownload(result.processedName, index)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem', borderRadius: '100px', flexShrink: 0 }}
                                            >
                                                <Download size={16} /> Download
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                    {results.length > 1 && (
                                        <button
                                            onClick={async () => {
                                                const processedNames = results.map(r => r.processedName);
                                                try {
                                                    await apiClient.downloadBulkImages(processedNames);
                                                } catch (err: unknown) {
                                                    console.error('Bulk download failed:', err);
                                                    alert('Failed to download ZIP. Please try individual downloads.');
                                                }
                                            }}
                                            className="btn btn-secondary"
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <Package size={20} /> Download All as ZIP
                                        </button>
                                    )}
                                    <button onClick={handleClearAll} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <RefreshCw size={18} /> Optimize More
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Settings Panel */}
                    <div style={{ flex: '1 1 35%', minWidth: '280px' }}>
                        <div style={{ background: c.white, borderRadius: '24px', border: `1px solid ${c.border}`, padding: '24px', position: 'sticky', top: '100px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1.2rem' }}><SlidersHorizontal size={20} /> Output Settings</h3>

                            {/* Format */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: c.textMuted, marginBottom: '8px', fontWeight: 500 }}>Output Format</label>
                                <select
                                    value={imageSettings.format}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setImageSettings(prev => ({ ...prev, format: e.target.value as ImageSettings['format'] }))}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${c.border}`, background: c.bgMuted, color: c.text, fontSize: '0.95rem', outline: 'none' }}
                                >
                                    <option value="">Same as input</option>
                                    <option value="webp">WebP (Best for web)</option>
                                    <option value="avif">AVIF (Maximum compression)</option>
                                    <option value="jpeg">JPEG (Universal compatibility)</option>
                                    <option value="png">PNG (Lossless transparency)</option>
                                    <option value="tiff">TIFF (Print quality)</option>
                                    <option value="gif">GIF (Animated/simple graphics)</option>
                                    <option value="heif">HEIF (Apple ecosystem)</option>
                                </select>
                            </div>

                            {/* Quality */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: c.textMuted, marginBottom: '8px', fontWeight: 500 }}>
                                    Quality <span style={{ color: c.text, fontWeight: 700 }}>{imageSettings.quality}%</span>
                                </label>
                                <input
                                    type="range" min="1" max="100"
                                    value={imageSettings.quality}
                                    onChange={(e) => setImageSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                                    style={{ width: '100%', accentColor: c.accent }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: c.textMuted }}>
                                    <span>Smallest file</span><span>Best quality</span>
                                </div>
                            </div>

                            {/* Resize */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: c.textMuted, marginBottom: '8px', fontWeight: 500 }}>Resize (optional)</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <input
                                        type="number" placeholder="Width"
                                        value={imageSettings.width}
                                        onChange={(e) => setImageSettings(prev => ({ ...prev, width: e.target.value }))}
                                        style={{ flex: '1 1 40%', minWidth: '80px', padding: '10px', borderRadius: '12px', border: `1px solid ${c.border}`, background: c.bgMuted, color: c.text, fontSize: '0.9rem', outline: 'none' }}
                                    />
                                    <span style={{ color: c.textMuted }}>×</span>
                                    <input
                                        type="number" placeholder="Height"
                                        value={imageSettings.height}
                                        onChange={(e) => setImageSettings(prev => ({ ...prev, height: e.target.value }))}
                                        style={{ flex: '1 1 40%', minWidth: '80px', padding: '10px', borderRadius: '12px', border: `1px solid ${c.border}`, background: c.bgMuted, color: c.text, fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Rotation */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: c.textMuted, marginBottom: '8px', fontWeight: 500 }}>Rotation</label>
                                <select
                                    value={imageSettings.rotate ?? 0}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setImageSettings(prev => ({ ...prev, rotate: parseInt(e.target.value) as ImageSettings['rotate'] }))}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${c.border}`, background: c.bgMuted, color: c.text, fontSize: '0.95rem', outline: 'none' }}
                                >
                                    <option value={0}>No rotation</option>
                                    <option value={90}>90° Clockwise</option>
                                    <option value={180}>180° Flip</option>
                                    <option value={270}>270° (90° Counter-CW)</option>
                                </select>
                            </div>

                            {/* Toggles */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: c.bgMuted, borderRadius: '12px', cursor: 'pointer' }}>
                                    <div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block' }}>Auto-Enhance</span>
                                        <span style={{ fontSize: '0.75rem', color: c.textMuted }}>Boost brightness, contrast &amp; sharpness</span>
                                    </div>
                                    <input type="checkbox" checked={imageSettings.autoEnhance ?? false} onChange={(e) => setImageSettings(prev => ({ ...prev, autoEnhance: e.target.checked }))} style={{ accentColor: c.accent, width: '20px', height: '20px', flexShrink: 0 }} />
                                </label>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: c.bgMuted, borderRadius: '12px', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Strip Metadata</span>
                                    <input type="checkbox" checked={imageSettings.stripMetadata} onChange={(e) => setImageSettings(prev => ({ ...prev, stripMetadata: e.target.checked }))} style={{ accentColor: c.accent, width: '20px', height: '20px' }} />
                                </label>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: c.bgMuted, borderRadius: '12px', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Maintain Aspect Ratio</span>
                                    <input type="checkbox" checked={imageSettings.maintainAspectRatio} onChange={(e) => setImageSettings(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))} style={{ accentColor: c.accent, width: '20px', height: '20px' }} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════ Tab: History ═══════════ */}
            {activeTab === 'history' && (
                <div style={{ background: c.white, borderRadius: '24px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
                    {history && history.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${c.border}`, background: c.bgMuted }}>
                                        <th style={{ padding: '16px 24px', color: c.textMuted, fontWeight: 500 }}>File</th>
                                        <th style={{ padding: '16px 24px', color: c.textMuted, fontWeight: 500 }}>Action</th>
                                        <th style={{ padding: '16px 24px', color: c.textMuted, fontWeight: 500 }}>Savings</th>
                                        <th style={{ padding: '16px 24px', color: c.textMuted, fontWeight: 500 }}>Link</th>
                                        <th style={{ padding: '16px 24px', color: c.textMuted, fontWeight: 500 }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <HistoryRow key={item.id} item={item} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '64px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: c.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={32} color={c.textMuted} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>No activity yet</h3>
                            <p style={{ color: c.textMuted, maxWidth: '300px' }}>Your optimization history will appear here as you process images.</p>
                            <button onClick={() => setActiveTab('optimize')} className="btn btn-secondary" style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                Start Optimizing <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════ Tab: Galleries ═══════════ */}
            {activeTab === 'galleries' && (
                <GalleriesTab ownerUsername={profile?.username ?? null} initialGalleryId={initialGalleryId} />
            )}

            {/* ═══════════ Tab: Referrals ═══════════ */}
            {activeTab === 'referrals' && (
                <div style={{ maxWidth: '700px' }}>
                    {/* Referral Hero Card */}
                    <div style={{
                        background: c.gradient, borderRadius: '24px',
                        padding: '32px', marginBottom: '24px', color: 'white', position: 'relative', overflow: 'hidden',
                    }}>
                        <img src="/logo.png" alt="" style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '120px', height: '120px', opacity: 0.1, objectFit: 'contain' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <Gift size={28} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Invite Friends, Get Rewarded</h2>
                        </div>
                        <p style={{ opacity: 0.9, lineHeight: 1.6, maxWidth: '500px', margin: 0 }}>
                            Share your unique referral link. When a friend subscribes, you both win: they get a discount and you earn free subscription time.
                        </p>
                    </div>

                    {/* Referral Link Card */}
                    <div style={{
                        background: c.white, borderRadius: '24px',
                        border: `1px solid ${c.border}`, padding: '28px', marginBottom: '24px',
                    }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '16px' }}>
                            <Share2 size={20} /> Your Referral Link
                        </h3>

                        {referralLoading ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: c.textMuted }}>Loading...</div>
                        ) : referralLink ? (
                            <>
                                {/* Link display + copy */}
                                <div style={{
                                    display: 'flex', gap: '8px', marginBottom: '20px',
                                }}>
                                    <div style={{
                                        flex: 1, padding: '12px 16px', borderRadius: '12px',
                                        background: c.bgMuted, border: `1px solid ${c.border}`,
                                        fontSize: '0.9rem', color: c.text,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        fontFamily: 'monospace',
                                    }}>
                                        {referralLink}
                                    </div>
                                    <button
                                        onClick={handleCopyReferralLink}
                                        className="btn btn-primary"
                                        style={{
                                            padding: '12px 20px', borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0,
                                        }}
                                    >
                                        {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
                                    </button>
                                </div>

                                {/* Share buttons */}
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={handleShareTwitter}
                                        style={{
                                            flex: '1 1 auto', padding: '12px 16px', borderRadius: '12px',
                                            border: `1px solid ${c.border}`, background: c.bgMuted,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: c.text,
                                            transition: 'border-color 0.2s',
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                        Share on X
                                    </button>
                                    <button
                                        onClick={handleShareWhatsApp}
                                        style={{
                                            flex: '1 1 auto', padding: '12px 16px', borderRadius: '12px',
                                            border: `1px solid ${c.border}`, background: c.bgMuted,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: c.text,
                                            transition: 'border-color 0.2s',
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={handleShareEmail}
                                        style={{
                                            flex: '1 1 auto', padding: '12px 16px', borderRadius: '12px',
                                            border: `1px solid ${c.border}`, background: c.bgMuted,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: c.text,
                                            transition: 'border-color 0.2s',
                                        }}
                                    >
                                        <ExternalLink size={16} /> Email
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: c.textMuted, fontSize: '0.9rem' }}>
                                Your referral code will be generated when your account is fully set up.
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px', marginBottom: '24px',
                    }}>
                        <div style={{
                            padding: '24px', background: c.white, borderRadius: '20px',
                            border: `1px solid ${c.border}`, textAlign: 'center',
                        }}>
                            <Users size={24} color={c.accent} style={{ marginBottom: '12px' }} />
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                                {referralStats?.totalReferred ?? 0}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: c.textMuted, marginTop: '4px' }}>
                                Friends Referred
                            </div>
                        </div>
                        <div style={{
                            padding: '24px', background: c.white, borderRadius: '20px',
                            border: `1px solid ${c.border}`, textAlign: 'center',
                        }}>
                            <Check size={24} color="#2ed573" style={{ marginBottom: '12px' }} />
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                                {referralStats?.totalConverted ?? 0}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: c.textMuted, marginTop: '4px' }}>
                                Subscribed
                            </div>
                        </div>
                        <div style={{
                            padding: '24px', background: c.white, borderRadius: '20px',
                            border: `1px solid ${c.border}`, textAlign: 'center',
                        }}>
                            <Gift size={24} color="#e8866f" style={{ marginBottom: '12px' }} />
                            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                                {referralStats?.rewardEarned ?? 'None yet'}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: c.textMuted, marginTop: '4px' }}>
                                Reward Earned
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div style={{
                        background: c.white, borderRadius: '24px',
                        border: `1px solid ${c.border}`, padding: '28px',
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>How It Works</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { step: '1', title: 'Share your link', desc: 'Send your unique referral link to friends or share on social media.' },
                                { step: '2', title: 'Friend subscribes', desc: 'When they sign up and subscribe through your link, they get a discount.' },
                                { step: '3', title: 'You get rewarded', desc: 'You earn free subscription time for every friend who subscribes.' },
                            ].map((item) => (
                                <div key={item.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: c.gradient, color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
                                    }}>
                                        {item.step}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: c.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════ Tab: Settings/Preferences ═══════════ */}
            {activeTab === 'settings' && (
                <div style={{ maxWidth: '600px' }}>
                    <div style={{ background: c.white, borderRadius: '24px', border: `1px solid ${c.border}`, padding: '32px', marginBottom: '24px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem', marginBottom: '8px' }}><Settings size={20} /> Default Preferences</h3>
                        <p style={{ color: c.textMuted, fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>These settings will be your default every time you open the optimizer.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: c.bgMuted, borderRadius: '16px' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Auto-Convert to WebP</div>
                                    <div style={{ fontSize: '0.8rem', color: c.textMuted, marginTop: '4px' }}>Automatically output all images as WebP for maximum compression.</div>
                                </div>
                                <button
                                    onClick={() => handlePrefsAutoWebPChange(!prefsAutoWebP)}
                                    style={{
                                        width: '48px', height: '28px', borderRadius: '20px', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                                        background: prefsAutoWebP ? c.accent : c.border, transition: 'background 0.2s',
                                    }}
                                >
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', transition: 'left 0.2s', left: prefsAutoWebP ? '23px' : '3px' }} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: c.bgMuted, borderRadius: '16px' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Strip EXIF Metadata</div>
                                    <div style={{ fontSize: '0.8rem', color: c.textMuted, marginTop: '4px' }}>Remove GPS, camera model, and other metadata from exported images.</div>
                                </div>
                                <button
                                    onClick={() => handlePrefsStripMetaChange(!prefsStripMeta)}
                                    style={{
                                        width: '48px', height: '28px', borderRadius: '20px', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                                        background: prefsStripMeta ? c.accent : c.border, transition: 'background 0.2s',
                                    }}
                                >
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', transition: 'left 0.2s', left: prefsStripMeta ? '23px' : '3px' }} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: c.white, borderRadius: '24px', border: `1px solid ${c.border}`, padding: '32px' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Account</h3>
                        <p style={{ color: c.textMuted, fontSize: '0.9rem', lineHeight: 1.6 }}>Signed in as <strong style={{ color: c.text }}>{user.email}</strong></p>


                        <p style={{ color: c.textMuted, fontSize: '0.85rem', marginTop: '16px', lineHeight: 1.6 }}>
                            Need to change your password or manage your account? Head to the <Link href="/" style={{ color: c.accent }}>homepage</Link> and click &quot;Forgot Password&quot; in the login modal.
                        </p>
                    </div>

                    {/* Username */}
                    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                        <h4 style={{ marginBottom: '4px' }}>Username</h4>
                        <p style={{ color: c.textMuted, fontSize: '0.85rem', marginBottom: '20px' }}>
                            Your unique username is shown when you share galleries. It can only contain lowercase letters, numbers, and underscores.
                        </p>
                        <UsernameForm profile={profile} />
                    </div>

                    {/* Photographer Branding */}
                    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                        <h4 style={{ marginBottom: '4px' }}>Gallery Branding</h4>
                        <p style={{ color: c.textMuted, fontSize: '0.85rem', marginBottom: '20px' }}>
                            Your studio name, colour, and website appear on your gallery pages instead of the Optimage defaults.
                        </p>
                        <BrandingForm profile={profile} />
                    </div>
                </div>
            )}

            {/* ═══════════ Tab: Video ═══════════ */}
            {activeTab === 'video' && (
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {/* Left: Video Dropzone & Results */}
                    <div style={{ flex: '1 1 55%', minWidth: '280px' }}>
                        {!videoResult ? (
                            <>
                                <div
                                    {...getVideoDropProps()}
                                    style={{
                                        border: `2px dashed ${isVideoDragActive ? c.accent : c.border}`,
                                        borderRadius: '24px', padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
                                        background: isVideoDragActive ? c.accentLight : c.white,
                                        marginBottom: '24px', transition: 'border-color 0.2s, background 0.2s',
                                    }}
                                >
                                    <input {...getVideoInputProps()} />
                                    <Film size={40} color={isVideoDragActive ? c.accent : c.textMuted} style={{ marginBottom: '16px' }} />
                                    <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
                                        {isVideoDragActive ? 'Release to add video' : 'Drop a video file here or click to browse'}
                                    </p>
                                    <p style={{ color: c.textMuted, fontSize: '0.9rem' }}>MP4, WebM, MOV, AVI • Max {process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50'}MB • Requires login</p>
                                </div>

                                {videoFile && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: c.white, borderRadius: '16px', border: `1px solid ${c.border}`, marginBottom: '16px' }}>
                                            <Film size={24} color={c.accent} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{videoFile.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: c.textMuted }}>{formatBytes(videoFile.size)} • {videoFile.type}</div>
                                            </div>
                                            <button onClick={() => setVideoFile(null)} style={{ background: 'transparent', border: 'none', color: c.textMuted, cursor: 'pointer' }}><X size={18} /></button>
                                        </div>

                                        <button
                                            className="btn btn-primary btn-large"
                                            disabled={videoProcessing}
                                            onClick={async () => {
                                                setVideoProcessing(true);
                                                setVideoError(null);
                                                try {
                                                    const supabase = createClient();
                                                    const { data: { session } } = await supabase.auth.getSession();
                                                    const headers: Record<string, string> = {};
                                                    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
                                                    const formData = new FormData();
                                                    formData.append('file', videoFile);
                                                    formData.append('action', videoSettings.action);
                                                    formData.append('format', videoSettings.format);
                                                    formData.append('quality', String(videoSettings.quality));
                                                    const response = await fetch(`${apiClient.getServerUrl()}/api/media/process`, { method: 'POST', body: formData, headers });
                                                    if (!response.ok) { const errBody = await response.json().catch(() => ({})) as { message?: string }; throw new Error(errBody.message || 'Video processing failed'); }
                                                    const data = await response.json() as { result: VideoResult };
                                                    setVideoResult(data.result);

                                                    setHistory(prev => [{
                                                        id: crypto.randomUUID(),
                                                        file_name: data.result.originalName,
                                                        action_type: videoSettings.action,
                                                        original_size: data.result.originalSize,
                                                        processed_size: data.result.processedSize,
                                                        created_at: new Date().toISOString()
                                                    }, ...prev]);
                                                } catch (err: unknown) { setVideoError(err instanceof Error ? err.message : 'An unknown error occurred'); } finally { setVideoProcessing(false); }
                                            }}
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            {videoProcessing ? <> <RefreshCw size={18} className="spinner" /> Compressing...</> : <><img src="/logo.png" alt="Compress" style={{ height: '1.2em', width: 'auto', objectFit: 'contain' }} /> Compress Video</>}
                                        </button>
                                    </div>
                                )}

                                {videoError && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', color: '#ef4444' }}>
                                        <AlertTriangle size={20} /> {videoError}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ padding: '16px', background: c.white, borderRadius: '16px', border: `1px solid ${c.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{formatBytes(videoResult.originalSize)}</div>
                                        <div style={{ fontSize: '0.8rem', color: c.textMuted }}>Original</div>
                                    </div>
                                    <div style={{ padding: '16px', background: c.white, borderRadius: '16px', border: `1px solid ${c.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{formatBytes(videoResult.processedSize)}</div>
                                        <div style={{ fontSize: '0.8rem', color: c.textMuted }}>Compressed</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'rgba(46,213,115,0.1)', borderRadius: '16px', border: '1px solid rgba(46,213,115,0.2)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2ed573' }}>{videoResult.savingsPercent}%</div>
                                        <div style={{ fontSize: '0.8rem', color: c.textMuted }}>Saved</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: c.white, borderRadius: '16px', border: `1px solid ${c.border}`, marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{videoResult.originalName}</div>
                                        <div style={{ fontSize: '0.8rem', color: c.textMuted }}>{formatBytes(videoResult.originalSize)} → {formatBytes(videoResult.processedSize)}</div>
                                    </div>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={async () => {
                                            try {
                                                const url = `${apiClient.getServerUrl()}/api/media/${videoResult.processedName}/download`;
                                                const response = await fetch(url);
                                                if (!response.ok) throw new Error('Download failed');
                                                const blob = await response.blob();
                                                const objUrl = URL.createObjectURL(blob);
                                                const link = document.createElement('a');
                                                link.href = objUrl;
                                                link.download = videoResult.processedName;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                URL.revokeObjectURL(objUrl);
                                            } catch (err: unknown) {
                                                console.error('Video download failed:', err instanceof Error ? err.message : 'Unknown error');
                                                alert('Download failed. Please try again.');
                                            }
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem', borderRadius: '100px' }}
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                </div>

                                <button onClick={() => { setVideoFile(null); setVideoResult(null); }} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <RefreshCw size={18} /> Compress Another
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Video Settings */}
                    <div style={{ flex: '1 1 35%', minWidth: '280px' }}>
                        <div style={{ background: c.white, borderRadius: '24px', border: `1px solid ${c.border}`, padding: '24px', position: 'sticky', top: '100px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1.2rem' }}><SlidersHorizontal size={20} /> Video Settings</h3>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: c.textMuted, marginBottom: '8px', fontWeight: 500 }}>Output Format</label>
                                <select value={videoSettings.format} onChange={(e) => setVideoSettings(prev => ({ ...prev, format: e.target.value }))} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${c.border}`, background: c.bgMuted, color: c.text, fontSize: '0.95rem', outline: 'none' }}>
                                    <option value="mp4">MP4 (Universal)</option>
                                    <option value="webm">WebM (Web optimized)</option>
                                    <option value="avi">AVI (Legacy)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: c.textMuted, marginBottom: '8px', fontWeight: 500 }}>
                                    Compression Level (CRF) <span style={{ color: c.text, fontWeight: 700 }}>{videoSettings.quality}</span>
                                </label>
                                <input type="range" min="18" max="40" value={videoSettings.quality} onChange={(e) => setVideoSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))} style={{ width: '100%', accentColor: c.accent }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: c.textMuted }}>
                                    <span>Best quality</span><span>Smallest file</span>
                                </div>
                            </div>

                            <div style={{ padding: '16px', background: 'rgba(219,90,66,0.08)', borderRadius: '12px', marginTop: '16px' }}>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, lineHeight: 1.5 }}>
                                    <strong>CRF 18–23:</strong> Near-lossless, large output<br />
                                    <strong>CRF 24–28:</strong> Good balance (recommended)<br />
                                    <strong>CRF 29–40:</strong> Heavy compression, smaller file
                                </p>
                            </div>
                        </div>

                        {/* AI Transcription Card */}
                        {(() => {
                            const transcriptionAvailable = process.env.NEXT_PUBLIC_OPENAI_AVAILABLE === 'true';
                            return (
                                <div style={{
                                    marginTop: '20px',
                                    background: c.white,
                                    borderRadius: '24px',
                                    border: `1px solid ${c.border}`,
                                    padding: '24px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    opacity: transcriptionAvailable ? 1 : 0.8,
                                }}>
                                    {/* Coming Soon overlay badge */}
                                    {!transcriptionAvailable && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '14px',
                                            right: '14px',
                                            background: 'linear-gradient(135deg, #db5a42, #e8866f)',
                                            color: 'white',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            padding: '4px 10px',
                                            borderRadius: '100px',
                                        }}>
                                            Coming Soon
                                        </div>
                                    )}

                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '1rem', paddingRight: transcriptionAvailable ? 0 : '90px' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8866f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="23" />
                                            <line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                        AI Audio Transcription
                                    </h3>
                                    <p style={{ fontSize: '0.82rem', color: c.textMuted, lineHeight: 1.6, marginBottom: '16px' }}>
                                        Automatically transcribe audio tracks from your media files using AI.
                                    </p>

                                    <div title={transcriptionAvailable ? undefined : 'AI transcription is being activated - check back soon.'}>
                                        <button
                                            disabled={!transcriptionAvailable}
                                            style={{
                                                width: '100%',
                                                padding: '11px',
                                                borderRadius: '12px',
                                                border: `1px solid ${c.border}`,
                                                background: c.bgMuted,
                                                color: transcriptionAvailable ? c.text : c.textMuted,
                                                fontSize: '0.88rem',
                                                fontWeight: 600,
                                                cursor: transcriptionAvailable ? 'pointer' : 'not-allowed',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontFamily: 'inherit',
                                            }}
                                        >
                                            {transcriptionAvailable ? 'Transcribe Audio' : 'AI transcription is being activated - check back soon.'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
