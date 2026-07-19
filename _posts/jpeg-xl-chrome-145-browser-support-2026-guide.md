---
title: "JPEG XL Is Back in Chrome 145 — But It's Off by Default. Here's What That Actually Means for Your Website's Images."
date: "2026-07-19T15:00:00Z"
excerpt: "Chrome 145 shipped JPEG XL decoding support in February 2026, four years after Google pulled it from the browser. It's gated behind a flag until default enablement lands later this year, which means it's a preview, not a switch you should flip on production yet."
keyTakeaways:
  - "Chrome 145, released February 11, 2026, restored JPEG XL decoding support after Google removed it from Chromium in 2022"
  - "It's currently gated behind the enable-jxl-image-format flag in chrome://flags, not on by default"
  - "Default enablement, no flag required, is expected in the second half of 2026, with Edge following the same timeline"
  - "Safari already supports JPEG XL by default; Firefox has it in Nightly builds only — so full cross-browser support still isn't here"
---

![A web browser's flags settings page with a JPEG XL option highlighted, representing the current opt-in state of the format's browser support](/image-12.png)

**Chrome 145 brought JPEG XL decoding back to the browser in February 2026, but it's still hidden behind a flag most users will never find, let alone enable.** If you build or manage a website and you're wondering whether it's time to start serving JPEG XL, the honest answer is: not yet, but the runway just got a lot shorter.

## Why This Is a Bigger Deal Than It Sounds

Google pulled JPEG XL support out of Chromium in 2022, effectively killing the format's chances of mainstream web adoption despite genuinely strong technical credentials — better compression than JPEG at equivalent quality, lossless recompression of existing JPEGs without quality loss, and support for both photographic and flat-graphic content in one format. Its return isn't a minor patch note. It's Google reversing a decision that shaped years of format strategy across the industry, and it's using a new Rust-based decoder built for memory safety rather than reviving the old C++ implementation — a sign this is meant to stick, not a quiet experiment.

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
    <rect x="20" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="120" y="62" text-anchor="middle" class="stat-num">2022</text>
    <text x="120" y="82" text-anchor="middle" class="stat-lbl">Year Google pulled JPEG XL from Chrome</text>
  </g>
  <g class="stat-bar">
    <rect x="250" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="350" y="62" text-anchor="middle" class="stat-num">145</text>
    <text x="350" y="82" text-anchor="middle" class="stat-lbl">Chrome version that brought it back</text>
  </g>
  <g class="stat-bar">
    <rect x="480" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="580" y="62" text-anchor="middle" class="stat-num">H2 2026</text>
    <text x="580" y="82" text-anchor="middle" class="stat-lbl">Expected default-on timeline</text>
  </g>
</svg>
</div>

## Where Each Browser Actually Stands Right Now

| Browser | JPEG XL support today |
|---------|------------------------|
| Safari | Enabled by default |
| Chrome 145 | Available, behind `chrome://flags` |
| Edge | Expected to follow Chrome's default-on timeline |
| Firefox | Nightly builds only, not stable |

That table is the whole story for anyone deciding whether to act on this today. Safari users can already see JPEG XL images natively. Everyone else needs a fallback, because serving JPEG XL as a primary format right now would break images for the overwhelming majority of Chrome, Edge, and Firefox users who haven't gone digging through browser flags.

## What to Actually Do This Year

1. **Don't switch your primary format to JPEG XL yet.** Without default browser support across Chrome and Edge, you'd be breaking images for most visitors — this is a preview window, not a green light.
2. **Keep using AVIF or WebP as your production format**, both of which already have solid default support across every major browser and cover the compression gains most sites actually need right now.
3. **Watch for Chrome's default-enablement announcement in the second half of 2026.** That's the real trigger point — once JPEG XL works without a flag in Chrome and Edge, the calculus for adding it as an option changes fast.
4. **If you're testing now, serve it with a proper fallback**, using the `<picture>` element to offer AVIF or WebP to browsers that don't yet decode JPEG XL, rather than assuming universal support that doesn't exist yet.

## Why This Still Matters for a Compression Tool

Format wars like this one determine what "good default" means for anyone converting or compressing images at scale. JPEG XL's pitch — better compression, no quality loss on JPEG recompression, one format for photos and graphics alike — is compelling enough that its return to Chrome is worth tracking even during the flag-only phase, because the moment it flips to default-on, millions of sites will have a genuine reason to reconsider their format strategy overnight.

Until then, [Optimage's convert tool](/convert) already handles AVIF and WebP conversion in the browser, free, and we'll add JPEG XL as a supported output the moment default browser support actually lands.

**Related reading:**
- [AVIF vs. WebP vs. JPEG 2026 Benchmark](/blog/avif-vs-webp-vs-jpeg-2026-benchmark) — how the current default formats compare on size and quality
- [Lightroom Export Alternative, Free 2026](/blog/lightroom-export-alternative-free-2026) — format and export settings for photographers
- [Cloudflare vs. BunnyCDN vs. KeyCDN Image Delivery 2026](/blog/cloudflare-vs-bunnycdn-vs-keycdn-image-delivery-2026) — how CDNs handle format negotiation for visitors on different browsers
