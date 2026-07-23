---
title: "Why Your Photo Book Looks Blurry When Your Website Looks Fine: The DPI Mistake Explained"
date: "2026-07-23T10:00:00Z"
excerpt: "A 1920px image looks sharp on a screen and pixelated in a printed photo book, and it's not the printer's fault. Here's what DPI actually controls, why web-optimized images fail in print, and how to prepare one file that works for both."
keyTakeaways:
  - "Screens display images at roughly 72-96 pixels per inch; most photo book printers require 300 pixels per inch for a sharp result"
  - "A 1920x1080 image that fills a laptop screen only prints sharp up to about 6.4 inches wide at 300 DPI"
  - "Resizing a small web image up to print size doesn't add real detail — it just makes the existing blur bigger"
  - "The fix is keeping a full-resolution master file and exporting two versions: one compressed for web, one untouched for print"
summary: "Web and print need different resolutions from the same photo. Keep an uncompressed master, then export a small compressed copy for the web and a full-size copy for printing — never resize a web-sized image up for print."
faq:
  - question: "What DPI do I need for a photo book?"
    answer: "300 DPI (dots per inch) is the standard for sharp photo book and print quality. Most consumer print services will accept lower, but detail loss becomes visible, especially in faces and text, below about 200 DPI."
  - question: "Can I just resize a web photo to make it bigger for printing?"
    answer: "No — resizing up doesn't recover detail that was never captured or was discarded during web compression. A 1920px-wide web image scaled up to a 12-inch print page will look soft or pixelated because you're stretching the same pixel data across more physical space, not adding new information."
  - question: "Why does my photo look fine on my phone but blurry when printed?"
    answer: "Phone and computer screens display far fewer pixels per inch than a printer needs to produce a sharp result — typically 72-96 versus 300. An image can look perfectly sharp at screen resolution and still be far too low-resolution for a large printed page."
---

![A photo book open to a page with a printed photograph, representing the resolution gap between screen and print output](/image-9.png)

**A photo that looks perfectly sharp on your phone or laptop can come out visibly soft in a printed photo book, and the printer isn't the problem — resolution math is.** Screens and printers measure sharpness completely differently, and an image sized correctly for one is very often undersized for the other. If you've ever ordered a photo book and been disappointed by how a favorite shot turned out, this is almost always why.

## Screens and Printers Don't Measure "Sharp" the Same Way

<div class="svg-stat-row" role="presentation" aria-label="Key statistics">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:32px auto;display:block">
  <style>
    .stat-num { font: 700 32px/1 system-ui,sans-serif; fill: #db5a42; }
    .stat-lbl { font: 500 13px/1 system-ui,sans-serif; fill: #374151; }
    .stat-bar { animation: fadeUp 0.6s ease-out both; }
    .stat-bar:nth-child(2) { animation-delay: 0.15s; }
    .stat-bar:nth-child(3) { animation-delay: 0.3s; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  </style>
  <g class="stat-bar">
    <rect x="20" y="20" width="220" height="70" rx="12" fill="#fdf3f1"/>
    <text x="130" y="62" text-anchor="middle" class="stat-num">72-96</text>
    <text x="130" y="82" text-anchor="middle" class="stat-lbl">Pixels per inch a typical screen displays</text>
  </g>
  <g class="stat-bar">
    <rect x="260" y="20" width="220" height="70" rx="12" fill="#fdf3f1"/>
    <text x="370" y="62" text-anchor="middle" class="stat-num">300</text>
    <text x="370" y="82" text-anchor="middle" class="stat-lbl">Pixels per inch most print labs require</text>
  </g>
  <g class="stat-bar">
    <rect x="500" y="20" width="180" height="70" rx="12" fill="#fdf3f1"/>
    <text x="590" y="62" text-anchor="middle" class="stat-num">6.4"</text>
    <text x="590" y="82" text-anchor="middle" class="stat-lbl">Max sharp print width for a 1920px image</text>
  </g>
</svg>
</div>

A screen only needs to fit roughly 72 to 96 pixels into every inch of display for an image to look sharp, because your eye is further from the screen and the display itself is emitting light rather than reflecting ink. Print is much less forgiving: standing over a page, viewed up close, most professional photo book printers want 300 pixels crammed into every inch to avoid visible softness or blockiness. That's a 3-to-4x difference in the pixel density the exact same image needs to satisfy two different outputs.

## What That Actually Means for a Real Photo

Do the math on a common case: a 1920x1080 image — a completely normal size for a screen-optimized photo — divided by 300 DPI gives you a maximum sharp print size of about 6.4 by 3.6 inches. That's a small print, not a full photo book page. Try to print that same file at 8x10 or larger and you're now asking the printer to stretch far fewer pixels across far more paper than it needs, which is exactly what produces the soft, slightly blocky look people usually blame on "cheap printing."

## Resizing Up Doesn't Fix It — It Just Enlarges the Blur

<figure aria-label="Comparison of resolution outcomes at different print sizes" role="img" style="margin:32px 0">
<svg viewBox="0 0 620 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:620px;display:block">
  <style>
    .bar-fill { animation: growWidth 1s cubic-bezier(.22,1,.36,1) both; transform-origin: left; }
    .bar-fill:nth-child(1) { animation-delay: 0s; }
    .bar-fill:nth-child(2) { animation-delay: 0.2s; }
    @keyframes growWidth { from { transform:scaleX(0); } to { transform:scaleX(1); } }
    .bar-label { font: 500 13px system-ui,sans-serif; fill: #374151; }
    .bar-val   { font: 700 13px system-ui,sans-serif; fill: #111827; }
  </style>
  <text x="10" y="38" class="bar-label">Web image (1920px) at 6x4"</text>
  <rect x="240" y="22" width="360" height="28" rx="4" fill="#e5e7eb"/>
  <rect x="240" y="22" width="360" height="28" rx="4" fill="#db5a42" class="bar-fill"/>
  <text x="590" y="41" class="bar-val" text-anchor="end">Sharp</text>
  <text x="10" y="98" class="bar-label">Same file stretched to 8x10"</text>
  <rect x="240" y="82" width="360" height="28" rx="4" fill="#e5e7eb"/>
  <rect x="240" y="82" width="360" height="28" rx="4" fill="#db5a42" class="bar-fill" style="opacity:.45"/>
  <text x="590" y="101" class="bar-val" text-anchor="end">Visibly soft</text>
  <text x="10" y="158" class="bar-label">Original camera file at 8x10"</text>
  <rect x="240" y="142" width="360" height="28" rx="4" fill="#e5e7eb"/>
  <rect x="240" y="142" width="360" height="28" rx="4" fill="#db5a42" class="bar-fill" style="opacity:.85"/>
  <text x="590" y="161" class="bar-val" text-anchor="end">Sharp</text>
</svg>
</figure>

There's a common instinct to "just make it bigger" in editing software when a photo book layout tool warns that an image is too low-resolution. That instruction adds pixels through interpolation — software guessing what should go between the pixels that already exist — but it doesn't recover detail the camera never captured or that got discarded when the image was compressed for web use. The result is a bigger file that's exactly as blurry as the small one, just spread across more paper.

## The Fix: Keep One Master, Export Two Versions

The actual solution isn't complicated, it's just a habit most people skip. Every photo you care about enough to print eventually should be kept in its original, full-resolution form somewhere — not just the compressed copy that ended up on your website or social feed.

1. **Keep an untouched master file** straight from your camera or phone, before any web compression touches it.
2. **Export a small, compressed copy for web use** — this is the version that should live on your site or gallery, since a full-resolution file only slows down page load with no visible screen benefit.
3. **Export a separate full-resolution copy for print**, sized to at least 300 DPI at your intended print dimensions, with no aggressive compression applied.
4. **Never print from the web-export copy** — if the only file you have left is the compressed web version, check its actual pixel dimensions against your print size before ordering anything.

[Optimage's resize tool](/resize) makes it simple to keep both versions from one shoot without manually recalculating DPI math for every photo — export web-sized copies for your site or gallery, and leave your originals untouched for anything headed to print.

## What to Take From This

A photo book looking soft almost never means the photo itself was bad — it means the file used for printing was sized for a screen, not a page. Keep your original resolution files separate from your web-compressed copies, check pixel dimensions against your print size before ordering, and the gap between "looks great online" and "looks great in my hands" disappears.

**Related reading:**
- [Resize Images Online Free: The Complete Guide](/blog/resize-images-online-free-guide) — the mechanics of resizing without losing quality
- [Compress Images Without Losing Quality](/blog/compress-images-without-losing-quality) — how web compression and resolution interact
- [World Cup 2026 Photo Archive Format Durability Guide](/blog/world-cup-2026-photo-archive-format-durability-guide) — a related look at keeping master files for long-term use
