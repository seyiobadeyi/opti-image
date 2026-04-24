import type { ImageSettings } from '@/types';

const PREFS_KEY = 'optimage_image_settings';

/**
 * Load user's saved image settings from localStorage, merged with the
 * provided defaults so any new fields are always populated.
 */
export function loadPrefs(defaults: ImageSettings): ImageSettings {
    if (typeof window === 'undefined') return defaults;
    try {
        const raw = localStorage.getItem(PREFS_KEY);
        if (!raw) return defaults;
        const parsed = JSON.parse(raw) as Partial<ImageSettings>;
        return { ...defaults, ...parsed };
    } catch {
        return defaults;
    }
}

/**
 * Persist the current image settings to localStorage.
 * Called on every settings change so preferences survive page refresh.
 */
export function savePrefs(settings: ImageSettings): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(settings));
    } catch {
        // Storage quota exceeded — silently ignore
    }
}
