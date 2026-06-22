import { createClient } from '@/utils/supabase/client';
import type {
    ConvertResponse,
    MediaResponse,
    HealthResponse,
    SyncHistoryResponse,
    GuestHistoryItem,
    ConvertImageOptions,
    ProcessMediaOptions,
    FileWithCustomName,
    SubscriptionStatus,
    CheckoutResponse,
    PriceInfo,
    SubscriptionPlan,
    UsdPlan,
    ReferralStats,
    UpdateProfileData,
    Gallery,
    GalleryItem,
    GalleryPublicMeta,
    GallerySubmission,
    AppNotification,
} from '@/types';

const API_BASE: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Build authorization headers from the current Supabase session.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {};
    if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    return headers;
}

/** Error thrown when the API server can't be reached at all (vs. an HTTP error). */
export class NetworkError extends Error {
    constructor(message = 'NETWORK') {
        super(message);
        this.name = 'NetworkError';
    }
}

/**
 * fetch() that transparently retries transient failures, which typically happen
 * when the API server (NestJS on Railway) is cold-starting after idle:
 *   - network-level failures (fetch throws TypeError "Failed to fetch")
 *   - 502 / 503 / 504 gateway responses (proxy up, app not ready yet)
 * Real application responses (2xx and genuine 4xx/5xx) are returned as-is and
 * never retried. After exhausting retries on a network failure, throws
 * NetworkError so callers can show a connection-specific message.
 *
 * Only use for idempotent reads / safe-to-repeat requests.
 */
async function fetchWithRetry(
    input: string,
    init?: RequestInit,
    retries = 2,
    backoffMs = 700,
): Promise<Response> {
    for (let attempt = 0; ; attempt++) {
        try {
            const res = await fetch(input, init);
            if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < retries) {
                await new Promise(r => setTimeout(r, backoffMs * (attempt + 1)));
                continue;
            }
            return res;
        } catch {
            // fetch only throws for network-level errors (offline, DNS, CORS, cold start)
            if (attempt < retries) {
                await new Promise(r => setTimeout(r, backoffMs * (attempt + 1)));
                continue;
            }
            throw new NetworkError();
        }
    }
}

export const apiClient = {
    /**
     * Upload and convert images with the given options.
     */
    async convertImages(
        files: FileWithCustomName[],
        options: ConvertImageOptions = {},
    ): Promise<ConvertResponse> {
        const headers = await getAuthHeaders();

        const formData = new FormData();

        // Collect custom names as a JSON array to properly map to files
        const customNames: string[] = [];

        files.forEach((file) => {
            formData.append('files', file);
            customNames.push(file.customName || '');
        });

        // Send custom names as JSON so the server can map each name to its file
        const hasCustomNames = customNames.some((n) => n !== '');
        if (hasCustomNames) {
            formData.append('customNames', JSON.stringify(customNames));
        }

        // Append options as form fields
        if (options.format) formData.append('format', options.format);
        if (options.quality) formData.append('quality', String(options.quality));
        if (options.width) formData.append('width', String(options.width));
        if (options.height) formData.append('height', String(options.height));
        if (options.stripMetadata !== undefined)
            formData.append('stripMetadata', String(options.stripMetadata));
        if (options.maintainAspectRatio !== undefined)
            formData.append('maintainAspectRatio', String(options.maintainAspectRatio));
        if (options.rotate !== undefined)
            formData.append('rotate', String(options.rotate));
        if (options.autoEnhance !== undefined)
            formData.append('autoEnhance', String(options.autoEnhance));
        if (options.exposure !== undefined && options.exposure !== 1.0)
            formData.append('exposure', String(options.exposure));
        if (options.saturation !== undefined && options.saturation !== 1.0)
            formData.append('saturation', String(options.saturation));
        if (options.filter)
            formData.append('filter', options.filter);
        if (options.notifyOnComplete)
            formData.append('notifyOnComplete', 'true');
        if (options.flipHorizontal)
            formData.append('flipHorizontal', 'true');
        if (options.flipVertical)
            formData.append('flipVertical', 'true');
        if (options.cropLeft !== undefined)
            formData.append('cropLeft', String(options.cropLeft));
        if (options.cropTop !== undefined)
            formData.append('cropTop', String(options.cropTop));
        if (options.cropWidth !== undefined)
            formData.append('cropWidth', String(options.cropWidth));
        if (options.cropHeight !== undefined)
            formData.append('cropHeight', String(options.cropHeight));
        if (options.watermarkText)
            formData.append('watermarkText', options.watermarkText);
        if (options.watermarkPosition)
            formData.append('watermarkPosition', options.watermarkPosition);
        if (options.watermarkOpacity !== undefined)
            formData.append('watermarkOpacity', String(options.watermarkOpacity));
        if (options.watermarkSize !== undefined)
            formData.append('watermarkSize', String(options.watermarkSize));
        if (options.watermarkColor)
            formData.append('watermarkColor', options.watermarkColor);

        const response = await fetch(`${API_BASE}/api/images/convert`, {
            method: 'POST',
            body: formData,
            headers,
        });

        if (!response.ok) {
            const error: { message?: string } = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(error.message || 'Upload failed');
        }

        return response.json() as Promise<ConvertResponse>;
    },

    /**
     * Upload and process media (audio/video extraction/transcription).
     */
    async processMedia(
        file: File,
        options: ProcessMediaOptions = {},
    ): Promise<MediaResponse> {
        const headers = await getAuthHeaders();

        const formData = new FormData();
        formData.append('file', file);

        if (options.action) formData.append('action', options.action);
        if (options.extractAudioOnly !== undefined) {
            formData.append('extractAudioOnly', String(options.extractAudioOnly));
        }

        const response = await fetch(`${API_BASE}/api/media/process`, {
            method: 'POST',
            body: formData,
            headers,
        });

        if (!response.ok) {
            const error: { message?: string } = await response.json().catch(() => ({ message: 'Media processing failed' }));
            throw new Error(error.message || 'Media processing failed');
        }

        return response.json() as Promise<MediaResponse>;
    },

    /**
     * Get the download URL for a processed image or extracted audio.
     */
    getDownloadUrl(fileName: string): string {
        return `${API_BASE}/api/images/${encodeURIComponent(fileName)}/download`;
    },

    /**
     * Get the server base URL.
     */
    getServerUrl(): string {
        return API_BASE;
    },

    /**
     * Download multiple processed images as a zip file.
     */
    async downloadBulkImages(fileNames: string[], displayNames?: string[]): Promise<void> {
        if (!fileNames || fileNames.length === 0) return;

        const authHeaders = await getAuthHeaders();

        const response = await fetch(`${API_BASE}/api/images/download-bulk`, {
            method: 'POST',
            body: JSON.stringify({ fileNames, displayNames }),
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
        });

        if (!response.ok) {
            throw new Error(`Bulk download failed: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `optimized-images-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    /**
     * Check server health.
     */
    async checkHealth(): Promise<HealthResponse | null> {
        try {
            const response = await fetch(`${API_BASE}/api/health`);
            if (!response.ok) return null;
            return response.json() as Promise<HealthResponse>;
        } catch {
            return null;
        }
    },

    /**
     * Sync guest processing history to the logged-in user's account.
     */
    async syncGuestHistory(items: GuestHistoryItem[]): Promise<SyncHistoryResponse> {
        if (!items || items.length === 0) return { success: false, syncedCount: 0 };

        const authHeaders = await getAuthHeaders();
        if (!authHeaders['Authorization']) return { success: false, syncedCount: 0 };

        const response = await fetch(`${API_BASE}/api/images/sync-history`, {
            method: 'POST',
            body: JSON.stringify({ items }),
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
        });

        if (!response.ok) {
            return { success: false, syncedCount: 0 };
        }

        return response.json() as Promise<SyncHistoryResponse>;
    },

    // ── Subscription & Payment ──

    /**
     * Check if the current user has an active subscription.
     */
    async getSubscriptionStatus(): Promise<SubscriptionStatus> {
        const headers = await getAuthHeaders();
        if (!headers['Authorization']) return { active: false, expiresAt: null };

        try {
            const response = await fetch(`${API_BASE}/api/payment/subscription/status`, { headers });
            if (!response.ok) return { active: false, expiresAt: null };
            return response.json() as Promise<SubscriptionStatus>;
        } catch {
            return { active: false, expiresAt: null };
        }
    },

    /**
     * Fetch all available subscription plans.
     */
    async getPlans(): Promise<SubscriptionPlan[]> {
        const response = await fetch(`${API_BASE}/api/payment/plans`);
        if (!response.ok) return [];
        const data: { plans: SubscriptionPlan[] } = await response.json();
        return data.plans ?? [];
    },

    /**
     * Create a Paystack checkout session for the selected subscription plan.
     */
    async createSubscriptionCheckout(promoCode?: string, referralCode?: string, planId?: string): Promise<CheckoutResponse> {
        const headers = await getAuthHeaders();

        const response = await fetch(`${API_BASE}/api/payment/checkout/subscription`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ promoCode, referralCode, planId }),
        });

        if (!response.ok) {
            const error: { message?: string } = await response.json().catch(() => ({ message: 'Checkout failed' }));
            throw new Error(error.message || 'Checkout failed');
        }

        return response.json() as Promise<CheckoutResponse>;
    },

    /**
     * Get the price for a plan with optional promo code applied.
     */
    async getPrice(promoCode?: string, planId?: string): Promise<PriceInfo> {
        const params = new URLSearchParams();
        if (promoCode) params.set('promoCode', promoCode);
        if (planId) params.set('planId', planId);
        const qs = params.toString() ? `?${params.toString()}` : '';
        const response = await fetch(`${API_BASE}/api/payment/price${qs}`);
        return response.json() as Promise<PriceInfo>;
    },

    /**
     * Get referral stats for the current user.
     */
    async getReferralStats(): Promise<ReferralStats | null> {
        const headers = await getAuthHeaders();
        if (!headers['Authorization']) return null;

        try {
            const response = await fetch(`${API_BASE}/api/payment/referrals`, { headers });
            if (!response.ok) return null;
            return response.json() as Promise<ReferralStats>;
        } catch {
            return null;
        }
    },

    /**
     * Fetch all available USD plans (Lemon Squeezy).
     */
    async getUsdPlans(): Promise<UsdPlan[]> {
        const response = await fetch(`${API_BASE}/api/payment/usd-plans`);
        if (!response.ok) return [];
        const data: { plans: UsdPlan[] } = await response.json();
        return data.plans ?? [];
    },

    /**
     * Update the current user's profile (display_name, use_case, username, etc.).
     */
    async updateProfile(data: UpdateProfileData): Promise<{ success: boolean }> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/payment/profile`, {
            method: 'PATCH',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) return { success: false };
        return response.json() as Promise<{ success: boolean }>;
    },

    /**
     * Check whether a username is available for the current user to claim.
     */
    async checkUsernameAvailable(username: string): Promise<boolean> {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/api/payment/username/check?u=${encodeURIComponent(username)}`, {
            headers,
        });
        if (!res.ok) return false;
        const data = await res.json() as { available: boolean };
        return data.available;
    },

    // ── Gallery ──

    async listGalleries(): Promise<Gallery[]> {
        const headers = await getAuthHeaders();
        if (!headers['Authorization']) return [];
        const response = await fetchWithRetry(`${API_BASE}/api/gallery`, { headers });
        if (!response.ok) return [];
        return response.json() as Promise<Gallery[]>;
    },

    async createGallery(data: {
        title: string;
        description?: string;
        pin?: string;
        access_type?: 'public' | 'pin' | 'email_list' | 'account';
        allow_download?: boolean;
        payment_required?: boolean;
        payment_instructions?: string;
        expires_at?: string;
    }): Promise<Gallery> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err: { message?: string } = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to create gallery');
        }
        return response.json() as Promise<Gallery>;
    },

    async checkSlugAvailable(slug: string, excludeGalleryId?: string): Promise<{ available: boolean; slug: string }> {
        const params = new URLSearchParams({ slug });
        if (excludeGalleryId) params.set('exclude', excludeGalleryId);
        const response = await fetch(`${API_BASE}/api/gallery/check-slug?${params}`);
        if (!response.ok) throw new Error('Failed to check slug');
        return response.json() as Promise<{ available: boolean; slug: string }>;
    },

    async updateGallery(id: string, data: Partial<{
        title: string;
        description: string;
        slug: string;
        pin: string;
        clearPin: boolean;
        access_type: 'public' | 'pin' | 'email_list' | 'account';
        allow_download: boolean;
        watermark: boolean;
        status: 'active' | 'archived' | 'draft';
        cover_image_url: string | null;
        cover_focal_point: string | null;
        expires_at: string | null;
        payment_required: boolean;
        payment_instructions: string;
    }>): Promise<Gallery> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${id}`, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err: { message?: string } = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to update gallery');
        }
        return response.json() as Promise<Gallery>;
    },

    async deleteGallery(id: string): Promise<void> {
        const headers = await getAuthHeaders();
        await fetch(`${API_BASE}/api/gallery/${id}`, { method: 'DELETE', headers });
    },

    async unlockGallery(id: string): Promise<void> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${id}/unlock`, { method: 'POST', headers });
        if (!response.ok) throw new Error('Failed to unlock gallery');
    },

    async setGalleryDraft(id: string, draft: boolean): Promise<void> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${id}/draft`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ draft }),
        });
        if (!response.ok) throw new Error('Failed to update gallery status');
    },

    async uploadGalleryImage(galleryId: string, file: File): Promise<GalleryItem> {
        const headers = await getAuthHeaders();
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE}/api/gallery/${galleryId}/items`, {
            method: 'POST',
            headers,
            body: formData,
        });
        if (!response.ok) {
            const err: { message?: string } = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Upload failed');
        }
        const data: { success: boolean; item: GalleryItem } = await response.json();
        return data.item;
    },

    async deleteGalleryItem(galleryId: string, itemId: string): Promise<void> {
        const headers = await getAuthHeaders();
        await fetch(`${API_BASE}/api/gallery/${galleryId}/items/${itemId}`, { method: 'DELETE', headers });
    },

    async reorderGalleryItems(galleryId: string, order: { id: string; sort_order: number }[]): Promise<void> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${galleryId}/items/order`, {
            method: 'PATCH',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ order }),
        });
        if (!response.ok) throw new Error('Failed to reorder items');
    },

    async updateGalleryItem(galleryId: string, itemId: string, data: { focal_point?: string | null }): Promise<GalleryItem> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${galleryId}/items/${itemId}`, {
            method: 'PATCH',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update item');
        return response.json() as Promise<GalleryItem>;
    },

    async getGalleryPublic(slug: string): Promise<GalleryPublicMeta> {
        // Send auth header if available so the server can detect if the viewer is the owner
        const authHeaders = await getAuthHeaders().catch(() => ({}));
        const response = await fetchWithRetry(`${API_BASE}/api/gallery/public/${slug}`, {
            headers: authHeaders,
        });
        if (!response.ok) throw new Error('Gallery not found');
        return response.json() as Promise<GalleryPublicMeta>;
    },

    async verifyGalleryAccess(slug: string, pin?: string, email?: string, supabaseToken?: string): Promise<string> {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (supabaseToken) headers['Authorization'] = `Bearer ${supabaseToken}`;
        const response = await fetchWithRetry(`${API_BASE}/api/gallery/public/${slug}/verify`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ pin, email }),
        });
        if (!response.ok) {
            const err: { message?: string } = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Access denied');
        }
        const data: { success: boolean; accessToken: string } = await response.json();
        return data.accessToken;
    },

    async getGalleryItems(slug: string, accessToken: string, page = 1, limit = 48): Promise<{ items: GalleryItem[]; total: number; hasMore: boolean }> {
        const res = await fetchWithRetry(`${API_BASE}/api/gallery/public/${slug}/items?page=${page}&limit=${limit}`, {
            headers: { 'x-gallery-token': accessToken },
        });
        if (!res.ok) throw new Error('Failed to fetch items');
        return res.json();
    },

    /**
     * Get activity log for a gallery (owner only).
     */
    async getGalleryActivity(id: string): Promise<import('@/types').GalleryActivity> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${id}/activity`, { headers });
        if (!response.ok) return { totalViews: 0, recentViews: [] };
        return response.json() as Promise<import('@/types').GalleryActivity>;
    },

    /**
     * Send gallery invite email to a client.
     */
    async sendGalleryToClient(id: string, email: string, message?: string): Promise<void> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${id}/send`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message }),
        });
        if (!response.ok) {
            const err: { message?: string } = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to send email');
        }
    },

    /**
     * Get an owner preview access token — allows the photographer to preview
     * their own gallery even when it is in draft mode.
     */
    async getOwnerPreviewToken(id: string): Promise<string> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${id}/preview-token`, { headers });
        if (!response.ok) throw new Error('Preview unavailable');
        const data: { accessToken: string } = await response.json();
        return data.accessToken;
    },

    /**
     * Get favourite item IDs for a viewer in a public gallery.
     */
    async getGalleryFavorites(slug: string, accessToken: string, viewerIdentifier: string): Promise<string[]> {
        const params = new URLSearchParams({ viewer: viewerIdentifier });
        const response = await fetch(`${API_BASE}/api/gallery/public/${slug}/favorites?${params.toString()}`, {
            headers: { 'x-gallery-token': accessToken },
        });
        if (!response.ok) return [];
        const data: { itemIds: string[] } = await response.json();
        return data.itemIds ?? [];
    },

    /**
     * Save viewer's favourite selections. Set notifyPhotographer=true to trigger email.
     */
    async setGalleryFavorites(slug: string, accessToken: string, itemIds: string[], viewerIdentifier: string, notifyPhotographer = false): Promise<void> {
        const response = await fetch(`${API_BASE}/api/gallery/public/${slug}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: accessToken, itemIds, viewerIdentifier, notifyPhotographer }),
        });
        if (!response.ok) throw new Error('Failed to save favourites');
    },

    /**
     * Submit a guestbook message for a gallery. Requires auth to prevent spam.
     */
    async submitGalleryMessage(slug: string, guestName: string, message: string): Promise<void> {
        const authHeaders = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/public/${slug}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({ guest_name: guestName, message }),
        });
        if (!response.ok) throw new Error('Failed to submit message');
    },

    /**
     * Owner: fetch all guestbook messages for a gallery.
     */
    async getGalleryMessages(galleryId: string): Promise<Array<{ id: string; guest_name: string; message: string; created_at: string }>> {
        const authHeaders = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${galleryId}/messages`, {
            headers: { ...authHeaders },
        });
        if (!response.ok) throw new Error('Failed to fetch messages');
        return response.json();
    },

    /**
     * Visitor (signed-in) submits a photo to a gallery's review queue.
     */
    async submitGalleryPhoto(slug: string, file: File): Promise<void> {
        const headers = await getAuthHeaders();
        if (!headers['Authorization']) throw new Error('Please sign in to submit a photo');
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE}/api/gallery/public/${slug}/submit`, {
            method: 'POST',
            headers,
            body: formData,
        });
        if (!response.ok) {
            const err: { message?: string } = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to submit photo');
        }
    },

    /**
     * Owner: list photo submissions for a gallery (default: pending).
     */
    async getGallerySubmissions(galleryId: string, status: 'pending' | 'approved' | 'rejected' = 'pending'): Promise<GallerySubmission[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${galleryId}/submissions?status=${status}`, { headers });
        if (!response.ok) return [];
        const data: { submissions: GallerySubmission[] } = await response.json();
        return data.submissions ?? [];
    },

    /** Owner: approve a submission (adds it to the gallery). */
    async approveGallerySubmission(galleryId: string, submissionId: string): Promise<GalleryItem> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${galleryId}/submissions/${submissionId}/approve`, { method: 'POST', headers });
        if (!response.ok) throw new Error('Failed to approve submission');
        const data: { item: GalleryItem } = await response.json();
        return data.item;
    },

    /** Owner: reject a submission. */
    async rejectGallerySubmission(galleryId: string, submissionId: string): Promise<void> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/gallery/${galleryId}/submissions/${submissionId}/reject`, { method: 'POST', headers });
        if (!response.ok) throw new Error('Failed to reject submission');
    },

    /**
     * Get the current user's notifications + unread count.
     */
    async getNotifications(): Promise<{ notifications: AppNotification[]; unreadCount: number }> {
        const headers = await getAuthHeaders();
        if (!headers['Authorization']) return { notifications: [], unreadCount: 0 };
        const response = await fetch(`${API_BASE}/api/notifications`, { headers });
        if (!response.ok) return { notifications: [], unreadCount: 0 };
        return response.json() as Promise<{ notifications: AppNotification[]; unreadCount: number }>;
    },

    /** Mark notifications read (specific ids, or all unread when omitted). */
    async markNotificationsRead(ids?: string[]): Promise<void> {
        const headers = await getAuthHeaders();
        if (!headers['Authorization']) return;
        await fetch(`${API_BASE}/api/notifications/read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({ ids }),
        }).catch(() => null);
    },

    /**
     * Create a Lemon Squeezy checkout URL for USD payment.
     */
    async createUsdCheckout(planId: string, promoCode?: string): Promise<{ checkoutUrl: string }> {
        const authHeaders = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/payment/checkout/usd`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
            credentials: 'include',
            body: JSON.stringify({ planId, promoCode }),
        });
        if (!response.ok) {
            const err: { message?: string } = await response.json().catch(() => ({}));
            throw new Error(err.message || 'USD checkout failed');
        }
        return response.json();
    },
};
