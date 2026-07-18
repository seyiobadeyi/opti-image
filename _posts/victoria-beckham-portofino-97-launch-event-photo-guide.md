---
title: "Victoria Beckham Just Launched a Fragrance With Her Son at Her Side. Here's the Product Photo Workflow Behind an Event Like That."
date: "2026-07-18T09:00:00Z"
excerpt: "Victoria Beckham launched her Portofino '97 fragrance in New York this week with Romeo Beckham beside her. The event photos that actually move product are shot and processed differently from red-carpet arrival shots — here's the workflow."
keyTakeaways:
  - "A fragrance launch generates three distinct photo categories — press arrivals, product-on-table shots, and lifestyle/candid — and each needs different processing"
  - "Glass and liquid product shots need higher resolution and near-lossless compression to preserve reflections and gradients that heavy compression destroys first"
  - "Press/arrival shots prioritize speed of turnaround over maximum fidelity, since they're often filed within the hour"
  - "The single biggest mistake in event photo galleries is applying one compression setting to all three categories instead of treating product shots as their own tier"
summary: "Celebrity fragrance launches like Victoria Beckham's Portofino '97 produce three very different photo jobs in one event — press arrivals, product bottle shots, and lifestyle images — and treating them all the same in post-processing is why so many launch galleries look inconsistent. Product and glass shots need a higher quality floor than people-shots do."
---

![A perfume bottle photographed on a reflective surface with soft studio lighting highlighting the glass and liquid, set up for a product launch gallery](/image-9.png)

**Victoria Beckham launched her new fragrance, Portofino '97, in New York this week with her son Romeo at her side, and the event produced exactly the kind of split-purpose photo set that trips up a lot of brand and PR teams: press arrivals, product shots, and lifestyle images, all needing to go out fast and all needing to look genuinely different from each other.** If you've ever managed the photo pipeline for a launch event — fragrance, fashion, or otherwise — you already know the instinct to run one compression setting across the whole gallery. That instinct is the reason so many launch photo sets look inconsistent within an hour of going live.

## Three Photo Jobs, One Event

A fragrance launch like this actually produces three distinct categories of image, and they don't behave the same way under compression.

**Press and arrival shots** — Beckham and her son on the step-and-repeat, candid moments as guests arrive — are judged on speed and recognizability, not pixel-level fidelity. These need to be edited, compressed, and out the door within the hour for entertainment outlets to use, and moderate compression barely shows at the sizes they're typically displayed.

**Product shots** — the bottle itself, styled on a reflective surface with studio lighting designed to show off the glass and the amber liquid inside — are the opposite case. Glass, liquid, and gradient lighting are exactly the kind of image content that JPEG compression degrades fastest, because smooth gradients need more bits to render cleanly than compression algorithms want to spend on them by default. Crush a product shot down to the same quality setting you'd use for a press photo and you get visible banding across what should be a smooth reflection.

**Lifestyle/candid images** — the in-between category, more editorial, less commercial — usually sit closer to press photos in how much compression they tolerate.

## Why Product Shots Need Their Own Tier

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
    <text x="120" y="62" text-anchor="middle" class="stat-num">Q90+</text>
    <text x="120" y="82" text-anchor="middle" class="stat-lbl">Recommended quality floor for glass/liquid product shots</text>
  </g>
  <g class="stat-bar">
    <rect x="270" y="20" width="180" height="70" rx="12" fill="#fdf3f1"/>
    <text x="360" y="62" text-anchor="middle" class="stat-num">Q75-80</text>
    <text x="360" y="82" text-anchor="middle" class="stat-lbl">Fine for press/arrival shots at typical display size</text>
  </g>
  <g class="stat-bar">
    <rect x="490" y="20" width="190" height="70" rx="12" fill="#fdf3f1"/>
    <text x="585" y="62" text-anchor="middle" class="stat-num">3 Tiers</text>
    <text x="585" y="82" text-anchor="middle" class="stat-lbl">Categories every launch event photo set actually needs</text>
  </g>
</svg>
</div>

The reason a bottle shot needs a higher quality floor isn't vanity — it's physics. A gradient across smooth glass or liquid changes color value very gradually from pixel to pixel, which means the compression algorithm has to represent a lot of subtly different values across a small area. JPEG's block-based quantization handles sharp, high-contrast content (a face, fabric texture, a logo) far more gracefully than it handles smooth gradients, which is exactly what a well-lit perfume bottle is made of. Push a product shot down to quality 70 to match your press photos and you'll see banding — visible stepped rings of color where there should be a smooth transition — right through the part of the image that's supposed to sell the product.

## The Practical Workflow for a Launch Gallery

1. **Sort before you compress, not after.** Tag images by category (press, product, lifestyle) at import, before any batch processing touches them.
2. **Run product shots through a separate, higher-quality pass** — quality 90 or above, or consider WebP/AVIF at a high setting, which handle gradients more gracefully than JPEG at equivalent file size.
3. **Batch press and lifestyle shots together** at a standard web-delivery quality — 75-82 is plenty for anything displayed at article width.
4. **Strip EXIF from anything going to press** — location and device metadata on a celebrity event photo is a genuine security consideration, independent of the compression question.

## What Happens When You Skip the Split

The failure mode is familiar to anyone who's managed a launch gallery under a same-day deadline: everything gets run through one compression preset because there's no time to sort first, and the bottle shot — the one image in the set actually meant to sell something — ends up looking cheaper than the candid photos next to it. That's backwards. The product image is the one piece of the gallery doing commercial work; it deserves the highest quality budget, not the same budget as a quick arrival snap that only needs to be recognizable.

## What to Do With Your Next Event Gallery

Split your import by category before you touch compression settings, and give product/glass shots their own higher-quality pass. [Optimage's compress tool](/compress) lets you set an exact quality target per batch instead of relying on one global default, and [batch convert](/convert) can move product shots to WebP or AVIF for a cleaner gradient at a smaller file size than JPEG would manage at the same quality.

**Related reading:**
- [ESPY Awards 2026 Red Carpet Photo Workflow](/blog/espy-awards-2026-red-carpet-photo-workflow) — the press/arrival side of event photography in more depth
- [Photographer Client Delivery Image Optimization](/blog/photographer-client-delivery-image-optimization) — the same tiered-quality principle applied to client wedding/event delivery
- [PNG vs WebP for UI Design Assets](/blog/png-vs-webp-for-ui-design-assets) — more on why gradient-heavy images behave differently under compression
