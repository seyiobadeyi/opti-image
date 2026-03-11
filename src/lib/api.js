import { createClient } from '@/utils/supabase/client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = {
    /**
     * Upload and convert images
     * @param {File[]} files - Array of image files
     * @param {object} options - Conversion options
     * @returns {Promise<{success: boolean, results: Array, summary: object}>}
     */
    async convertImages(files, options = {}) {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        const headers = {};
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
            // If the file object has a customName property (set by the UI), send it
            if (file.customName) {
                formData.append('customName', file.customName);
            }
        });

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
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        const headers = {};
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }

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
        // Images and audio are both served from the same uploads directory via the image controller downloads for now,
        // or we can just point it to the generic download endpoint
        return `${API_BASE}/api/images/${fileName}/download`;
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

        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        const headers = {
            'Content-Type': 'application/json'
        };
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const response = await fetch(`${API_BASE}/api/images/download-bulk`, {
            method: 'POST',
            body: JSON.stringify({ fileNames }),
            headers,
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
     * @returns {Promise<object>}
     */
    async checkHealth() {
        const response = await fetch(`${API_BASE}/api/health`);
        return response.json();
    },

    /**
     * Sync guest history to the logged in user
     * @param {Array} items - Array of history objects
     * @returns {Promise<{success: boolean, syncedCount: number}>}
     */
    async syncGuestHistory(items) {
        if (!items || items.length === 0) return { success: false, syncedCount: 0 };
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) return { success: false, syncedCount: 0 };

        const response = await fetch(`${API_BASE}/api/images/sync-history`, {
            method: 'POST',
            body: JSON.stringify({ items }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
        });

        if (!response.ok) {
            return { success: false, syncedCount: 0 };
        }

        return response.json();
    }
};
