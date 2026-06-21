/**
 * Force-download helpers for Cloudinary-hosted gallery assets.
 *
 * The HTML `download` attribute is IGNORED for cross-origin URLs, so a plain
 * `<a download href="https://res.cloudinary.com/…">` just opens the image in a
 * new tab — the user then has to right-click → Save. Cloudinary's `fl_attachment`
 * delivery flag makes the CDN respond with `Content-Disposition: attachment`,
 * which triggers an immediate, same-tab download with the right filename.
 */

/** Rewrite a Cloudinary delivery URL to force an attachment download. */
export function cloudinaryDownloadUrl(url: string, filename?: string): string {
    // Only Cloudinary delivery URLs have an "/upload/" segment we can transform.
    if (!url.includes('/upload/')) return url;
    if (filename) {
        // fl_attachment:<name> sets the downloaded file's name (Cloudinary adds the
        // correct extension for the delivered format). Strip the extension + unsafe chars.
        const base = filename.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_') || 'photo';
        return url.replace('/upload/', `/upload/fl_attachment:${base}/`);
    }
    return url.replace('/upload/', '/upload/fl_attachment/');
}

/** Programmatically trigger an immediate download of a (Cloudinary) asset. */
export function triggerDownload(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = cloudinaryDownloadUrl(url, filename);
    a.download = filename; // harmless hint; cross-origin ignores it, fl_attachment does the work
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
