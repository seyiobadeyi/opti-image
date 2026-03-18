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
    async downloadBulkImages(fileNames: string[]): Promise<void> {
        if (!fileNames || fileNames.length === 0) return;

        const authHeaders = await getAuthHeaders();

        const response = await fetch(`${API_BASE}/api/images/download-bulk`, {
            method: 'POST',
            body: JSON.stringify({ fileNames }),
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
     * Create a Lemon Squeezy checkout URL for USD payment.
     */
    async createUsdCheckout(planId: string): Promise<{ checkoutUrl: string }> {
        const response = await fetch(`${API_BASE}/api/payment/checkout/usd`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ planId }),
        });
        if (!response.ok) {
            const err: { message?: string } = await response.json().catch(() => ({}));
            throw new Error(err.message || 'USD checkout failed');
        }
        return response.json();
    },
};
