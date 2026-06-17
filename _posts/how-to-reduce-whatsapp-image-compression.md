---
title: "How to Stop WhatsApp from Destroying Your Photo Quality — Compress Before Sending"
date: "2026-03-22T10:00:00Z"
excerpt: "WhatsApp recompresses photos to roughly 640px wide at 60% quality when sent as a Photo — to preserve quality, compress to WebP at 80% first with Optimage, or send as a Document to bypass compression entirely."
variants:
  - excerpt: "WhatsApp recompresses photos to roughly 640px wide at 60% quality when sent as a Photo — to preserve quality, compress to WebP at 80% first with Optimage, or send as a Document to bypass compression entirely."
    keyTakeaways:
      - "WhatsApp Photo mode: compresses to ~640px wide at approximately 60% JPEG quality"
      - "WhatsApp Document mode: bypasses all compression — recipient gets the original file"
      - "Pre-compress to WebP at 80%: limits WhatsApp's degradation to one generation"
      - "Sending as Document requires the recipient to tap to download rather than auto-display"
  - excerpt: "The Document workaround is the cleanest solution: instead of tapping the photo icon, tap the attachment icon, choose Document, and select your photo. WhatsApp delivers the file without any re-encoding. The downside is that recipients see a file attachment, not an inline photo preview."
    keyTakeaways:
      - "Document mode: tap the paperclip icon, not the camera icon — file is delivered uncompressed"
      - "Recipient receives the original file and must tap to open it, not an inline photo"
      - "File size limit for WhatsApp Document: 2GB — well above any photo file"
      - "This method works for PNG, WebP, AVIF, and RAW files — not just JPEG"
  - excerpt: "Pre-compressing before sending as a Photo controls what WhatsApp compresses. If you send an 8MB JPEG, WhatsApp applies aggressive compression. If you send a 500KB WebP at quality 80, WhatsApp has little to degrade further. The result looks almost identical to the original."
    keyTakeaways:
      - "Pre-compress to WebP quality 80: typical 8MB JPEG becomes 400-600KB"
      - "Smaller input = less WhatsApp degradation — the compression ratio is applied proportionally"
      - "Use Optimage's free compressor before every WhatsApp photo share for better results"
      - "Batch compress all photos at once if sending a multi-photo event album via WhatsApp"
---

WhatsApp recompresses every photo you send as a "Photo" — typically reducing it to around 640 pixels wide and re-encoding it at approximately 60% JPEG quality. The result is a blurry, washed-out image that looks nothing like what left your camera. There are two ways to fix this: compress the image yourself before sending (so WhatsApp has less to degrade), or send as a **Document** instead of a Photo, which bypasses WhatsApp's compression pipeline entirely.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 32px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">~640px</text><text x="110" y="78" text-anchor="middle" class="sl">WhatsApp output width</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">~60%</text><text x="350" y="78" text-anchor="middle" class="sl">WhatsApp quality setting</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">0 loss</text><text x="590" y="78" text-anchor="middle" class="sl">Send as Document</text></g>
</svg>
</div>

## Why WhatsApp compresses your photos so aggressively

WhatsApp serves over 2 billion users worldwide. Each message that contains a photo must be stored on WhatsApp's servers temporarily and transmitted to the recipient's device. If every user sent 12-megapixel, 4MB photos without any compression, the bandwidth and storage costs would be enormous.

WhatsApp's compression is intentionally aggressive because it was originally designed for low-bandwidth mobile networks — particularly in markets where users had slow data connections and limited storage. The aggressive defaults have not been revisited significantly since.

When you send a photo through WhatsApp's standard "Photo" route:
1. Your device resamples the image to fit within a maximum dimension (approximately 1600px on newer versions, sometimes much less)
2. WhatsApp's encoder re-encodes the result as a JPEG at roughly 60% quality
3. The resulting file is typically 100–200KB regardless of your original

A 4MB RAW-quality JPEG from a DSLR becomes a 140KB thumbnail. Visible banding, smearing, and colour shifts appear in areas of fine detail.

## Method 1 — Send as Document (zero compression)

WhatsApp applies compression to "Photos" but not to "Documents." Any file you attach as a Document is sent and received exactly as-is, with no re-encoding.

**On Android:**
1. Open the chat
2. Tap the attachment icon (paperclip)
3. Choose **Document** (not Gallery or Camera)
4. Browse to your photo file and select it

**On iPhone:**
1. Open the chat
2. Tap the "+" icon
3. Choose **Document**
4. Tap "Browse" and navigate to your photo in Files

The recipient receives the original file at full resolution and quality. They can open it in their photo app normally. The only difference from their end is that it appears as a file attachment rather than rendering inline in the chat.

**Limitation:** Documents do not display as a preview image in the chat thread on some Android versions. The recipient has to tap to open.

## Method 2 — Pre-compress with Optimage before sending as Photo

If you want the photo to display inline in the chat (not as a document attachment), pre-compressing before sending reduces the quality loss.

WhatsApp re-encodes whatever you send. If you send a 4MB JPEG, WhatsApp discards most of that data. If you send a well-compressed 400KB WebP, WhatsApp has much less data to discard — and the re-encoding penalty is smaller.

<figure role="img" aria-label="WhatsApp compression chain comparison: pre-compressed vs direct send" style="margin:32px 0">
<svg viewBox="0 0 660 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>.px{animation:pi .5s ease-out both}.px:nth-child(odd){animation-delay:0s}.px:nth-child(even){animation-delay:.2s}@keyframes pi{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}.pn{font:700 12px system-ui,sans-serif;fill:#db5a42}.pt{font:500 10px system-ui,sans-serif;fill:#374151}.pg{font:600 11px system-ui,sans-serif;fill:#6b7280}</style>
  <defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L0,6L8,3z" fill="#d1d5db"/></marker></defs>
  <!-- Row 1: Pre-compressed route (better) -->
  <text x="10" y="18" class="pg">Better quality</text>
  <g class="px"><rect x="10" y="24" width="140" height="54" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="80" y="48" text-anchor="middle" class="pn">Original 4MB</text><text x="80" y="64" text-anchor="middle" class="pt">Camera JPEG</text></g>
  <line x1="152" y1="51" x2="178" y2="51" stroke="#d1d5db" stroke-width="2" marker-end="url(#a)"/>
  <g class="px"><rect x="182" y="24" width="140" height="54" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="252" y="48" text-anchor="middle" class="pn">Optimage</text><text x="252" y="64" text-anchor="middle" class="pt">WebP 80% → 400KB</text></g>
  <line x1="324" y1="51" x2="350" y2="51" stroke="#d1d5db" stroke-width="2" marker-end="url(#a)"/>
  <g class="px"><rect x="354" y="24" width="140" height="54" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="424" y="48" text-anchor="middle" class="pn">WhatsApp</text><text x="424" y="64" text-anchor="middle" class="pt">~200KB, less degraded</text></g>
  <!-- Row 2: Direct send (worse) -->
  <text x="10" y="110" class="pg">Worse quality</text>
  <g class="px"><rect x="10" y="116" width="140" height="54" rx="10" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1.5"/><text x="80" y="140" text-anchor="middle" class="pn">Original 4MB</text><text x="80" y="156" text-anchor="middle" class="pt">Camera JPEG</text></g>
  <line x1="152" y1="143" x2="350" y2="143" stroke="#d1d5db" stroke-width="2" marker-end="url(#a)"/>
  <g class="px"><rect x="354" y="116" width="140" height="54" rx="10" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1.5"/><text x="424" y="140" text-anchor="middle" class="pn">WhatsApp</text><text x="424" y="156" text-anchor="middle" class="pt">~140KB, high degradation</text></g>
</svg>
</figure>

Steps to pre-compress:
1. Open [Optimage /compress](/compress)
2. Upload your photo
3. Choose **WebP** format, set quality to **80%**
4. Download the compressed file (typically 300–500KB for a 12MP photo)
5. Send this WebP file through WhatsApp as a Photo

The recipient receives an image that has gone through compression twice — once by you, once by WhatsApp. But because your compression preserved much more detail than WhatsApp's aggressive pipeline, the final result is noticeably better than sending the raw 4MB original directly.

<img src="/image-2.png" alt="Comparison of photo quality after WhatsApp compression: direct send at 4MB versus pre-compressed WebP at 400KB" style="max-width:100%;border-radius:8px;margin:24px 0" />

## Which method is better?

| Goal | Best method |
|---|---|
| Maximum quality, recipient can save full-res file | Send as Document |
| Photo displays inline in chat, decent quality | Pre-compress with Optimage then send as Photo |
| Fastest to send without worrying about quality | Send as Document |
| Sharing to a WhatsApp group as a visible photo | Pre-compress first |

**Send as Document is always the higher-quality option.** Pre-compression is the right choice only when you specifically want the photo to appear inline in the chat preview rather than as a file attachment.

## What is the best image format to send on WhatsApp?

WhatsApp accepts JPEG, PNG, WebP, and HEIC. When sending as a **Photo** (with compression), the format does not matter much because WhatsApp re-encodes everything as JPEG internally.

When sending as a **Document**, the format matters because the file is delivered as-is. WebP produces the best combination of quality and file size — a 400KB WebP will load faster for the recipient than a 2MB JPEG while looking essentially identical.

For iPhone users who capture in HEIC format: convert to JPEG or WebP before sending via WhatsApp. Some Android devices cannot preview HEIC files. Use [Optimage /convert](/convert) to convert HEIC to JPEG or WebP in your browser.

<img src="/image-11.png" alt="WhatsApp chat showing Document attachment option versus Photo option for sending images without compression" style="max-width:100%;border-radius:8px;margin:24px 0" />

## Does WhatsApp compress videos too?

Yes, and more aggressively than photos. Videos sent as a "Video" are downscaled to 480p or 720p and re-encoded at a low bitrate. Send video as a Document to deliver the original file quality, exactly as with photos.

For photos you want to share at full resolution to a wide audience — not just a WhatsApp contact — consider using [Optimage's gallery tool](/galleries) to create a shareable link instead. Recipients open the link in a browser and see your photos at full quality with no compression pipeline in the way.

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why does WhatsApp compress photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WhatsApp compresses photos to reduce bandwidth and storage costs across its 2 billion users. Photos sent as 'Photo' are re-encoded to approximately 640–1600px wide at roughly 60% JPEG quality, regardless of original quality. This was designed for low-bandwidth mobile networks and remains the default."
      }
    },
    {
      "@type": "Question",
      "name": "How to send photos on WhatsApp without losing quality?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Send as a Document instead of a Photo. On Android: tap the attachment icon and choose Document. On iPhone: tap + then Document. The file is sent exactly as-is with no recompression. The recipient downloads the original full-quality file."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best image format for WhatsApp?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When sending as a Document (no compression), WebP is the best format — smaller file size than JPEG at equivalent quality, supported by all modern Android and iPhone viewers. When sending as a Photo (WhatsApp compresses it anyway), the format does not matter because WhatsApp re-encodes to JPEG internally."
      }
    },
    {
      "@type": "Question",
      "name": "How to send high quality photos on WhatsApp?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fastest method is to send as a Document — tap the attachment icon, choose Document, and select your photo. It arrives at the recipient with zero quality loss. Alternatively, pre-compress to WebP at 80% quality using Optimage before sending as a Photo, which reduces but does not eliminate WhatsApp's re-encoding penalty."
      }
    }
  ]
}
</script>
