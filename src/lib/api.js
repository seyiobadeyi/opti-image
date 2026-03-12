import { createClient } from '@/utils/supabase/client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Get auth headers for API requests
 * @returns {Promise<Record<string, string>>}
 */
async function getAuthHeaders() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    /** @type {Record<string, string>} */
    const headers = {};
    if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    return headers;
}

export const apiClient = {
    /**
     * Upload and convert images
     * @param {File[]} files - Array of image files
     * @param {object} options - Conversion options
     * @returns {Promise<{success: boolean, results: Array, summary: object}>}
     */
    async convertImages(files, options = {}) {
        const headers = await getAuthHeaders();

        const formData = new FormData();

        // Collect custom names as a JSON array to properly map to files
        const customNames = [];

        files.forEach((file) => {
            formData.append('files', file);
            customNames.push(/** @type {any} */ (file).customName || '');
        });

        // Send custom names as JSON so the server can map each name to its file
        const hasCustomNames = customNames.some(n => n !== '');
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
            const error = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(error.message || 'Upload failed');
        }

        return response.json();
    },

    /**
     * Upload and process media (audio/video extraction/transcription)
     * @param {File} file - Audio or Video file
     * @param {object} options - Processing options (action, extractAudioOnly)
     * @returns {Promise<{success: boolean, text?: string, downloadName?: string}>}
     */
    async processMedia(file, options = {}) {
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
            const error = await response.json().catch(() => ({ message: 'Media processing failed' }));
            throw new Error(error.message || 'Media processing failed');
        }

        return response.json();
    },

    /**
     * Get the download URL for a processed image or extracted audio
     * @param {string} fileName - Processed file name
     * @returns {string}
     */
    getDownloadUrl(fileName) {
        return `${API_BASE}/api/images/${encodeURIComponent(fileName)}/download`;
    },

    /**
     * Get the server base URL
     * @returns {string}
     */
    getServerUrl() {
        return API_BASE;
    },

    /**
     * Download multiple processed images as a zip file
     * @param {string[]} fileNames - Array of processed file names
     * @returns {Promise<void>}
     */
    async downloadBulkImages(fileNames) {
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
     * Check server health
     * @returns {Promise<{status: string} | null>}
     */
    async checkHealth() {
        try {
            const response = await fetch(`${API_BASE}/api/health`);
            if (!response.ok) return null;
            return response.json();
        } catch {
            return null;
        }
    },

    /**
     * Sync guest history to the logged in user
     * @param {Array} items - Array of history objects
     * @returns {Promise<{success: boolean, syncedCount: number}>}
     */
    async syncGuestHistory(items) {
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

        return response.json();
    }
};
