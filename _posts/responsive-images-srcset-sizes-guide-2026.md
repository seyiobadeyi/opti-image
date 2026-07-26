---
title: "One Image, Five Screen Sizes: How to Actually Use srcset and sizes in 2026"
date: "2026-07-26T18:00:00Z"
excerpt: "Serving the same full-size image to a phone and a 4K monitor wastes bandwidth on one and undersells quality on the other. The srcset and sizes attributes fix this, and most sites still aren't using them correctly."
keyTakeaways:
  - "srcset lets the browser choose the right image file from a set of options based on the actual screen it's rendering on, rather than downloading one size-fits-all file"
  - "sizes tells the browser how much space the image will actually occupy in the layout, which it needs to make a smart choice from the srcset options"
  - "Skipping sizes while still using srcset is a common mistake that causes browsers to fall back to conservative guesses, undermining the whole point of the setup"
  - "A properly configured srcset can cut mobile image payload significantly compared to serving one large file to every device"
faq:
  - question: "What's the difference between srcset and sizes?"
    answer: "srcset provides the browser a list of image file options at different resolutions or widths. sizes tells the browser how large the image will actually be displayed at different viewport widths, which the browser needs in order to pick the most appropriate file from the srcset list. Using srcset without sizes forces the browser to guess, often conservatively, which undercuts the bandwidth savings the setup is meant to provide."
  - question: "Do I need srcset if I'm already using a responsive CSS layout?"
    answer: "Yes — responsive CSS controls how an image is displayed and scaled, but it doesn't change which file gets downloaded. Without srcset, a phone on a small screen still downloads the same full-resolution file a desktop monitor would, wasting bandwidth and slowing load time even though the image is scaled down visually."
---

![A grid of the same image rendered at multiple different sizes side by side, representing how a single source image needs to serve dramatically different screen widths](/image-7.png)

**A website that serves one full-resolution image to every visitor is either wasting bandwidth on phones or shortchanging quality on large monitors — and the fix, `srcset` and `sizes`, has been part of the HTML standard for years while still being one of the most commonly misconfigured features on the modern web.** Done right, it lets the browser pick the right file for the actual screen rendering it. Done wrong — usually by skipping `sizes` entirely — it barely helps at all.

## What Actually Happens Without It

A `<img>` tag with a single `src` attribute gives the browser exactly one option: download that file, no matter what device is asking for it. A product photo sized for a large desktop hero banner gets downloaded at full resolution by a phone displaying it at a third of the width, burning mobile data and slowing the page load for exactly the visitors most likely to be on a slower connection. This is one of the most common issues Google PageSpeed Insights flags, and it's almost always fixable without touching the visual design at all.

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
    <text x="130" y="62" text-anchor="middle" class="stat-num">1 file</text>
    <text x="130" y="82" text-anchor="middle" class="stat-lbl">What every device gets without srcset</text>
  </g>
  <g class="stat-bar">
    <rect x="260" y="20" width="220" height="70" rx="12" fill="#fdf3f1"/>
    <text x="370" y="62" text-anchor="middle" class="stat-num">2 attrs</text>
    <text x="370" y="82" text-anchor="middle" class="stat-lbl">srcset and sizes, both required to work correctly</text>
  </g>
  <g class="stat-bar">
    <rect x="500" y="20" width="180" height="70" rx="12" fill="#fdf3f1"/>
    <text x="590" y="62" text-anchor="middle" class="stat-num">0 CSS</text>
    <text x="590" y="82" text-anchor="middle" class="stat-lbl">Changes needed to the visual layout</text>
  </g>
</svg>
</div>

## How srcset and sizes Actually Work Together

`srcset` gives the browser a menu of image files at different widths:

```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"
  alt="Description of the image">
```

That alone tells the browser what's available, but not how big the image will actually appear on the page — which is exactly the information it needs to pick correctly. That's what `sizes` provides:

```html
sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
```

This tells the browser: below 600px viewport width, the image fills the full viewport; between 600 and 1200px, it takes up half; above that, it's a fixed 800px. With both attributes present, the browser can calculate the actual rendered size and download the smallest file from the `srcset` list that still looks sharp at that size.

## The Mistake That Undoes All of It

Adding `srcset` without `sizes` is the single most common way this setup fails to deliver its benefit. Without `sizes`, the browser has no reliable information about how large the image will render, so it falls back to a default assumption — commonly treating the image as if it will fill the full viewport width, which is often wrong and pushes the browser toward downloading a larger file than actually necessary. The whole point of `srcset` is undermined by omitting the one piece of context that makes it useful.

<figure aria-label="3-step process diagram" role="img" style="margin:32px 0">
<svg viewBox="0 0 660 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>
    .step-box { animation: popIn 0.5s ease-out both; }
    .step-box:nth-child(1) { animation-delay: 0s; }
    .step-box:nth-child(2) { animation-delay: 0.2s; }
    .step-box:nth-child(3) { animation-delay: 0.4s; }
    @keyframes popIn { from { opacity:0; transform:scale(.85); } to { opacity:1; transform:scale(1); } }
    .step-num { font: 700 20px system-ui,sans-serif; fill: #db5a42; }
    .step-txt { font: 500 12px system-ui,sans-serif; fill: #374151; }
    .arrow { fill: none; stroke: #d1d5db; stroke-width: 2; marker-end: url(#arr); }
  </style>
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#d1d5db"/>
    </marker>
  </defs>
  <g class="step-box">
    <rect x="10" y="15" width="170" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="95" y="48" text-anchor="middle" class="step-num">① Generate</text>
    <text x="95" y="68" text-anchor="middle" class="step-txt">2-4 widths of each source image</text>
  </g>
  <line x1="185" y1="50" x2="235" y2="50" class="arrow"/>
  <g class="step-box">
    <rect x="240" y="15" width="170" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="325" y="48" text-anchor="middle" class="step-num">② Declare</text>
    <text x="325" y="68" text-anchor="middle" class="step-txt">srcset with widths, sizes with layout</text>
  </g>
  <line x1="415" y1="50" x2="465" y2="50" class="arrow"/>
  <g class="step-box">
    <rect x="470" y="15" width="170" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="555" y="48" text-anchor="middle" class="step-num">③ Verify</text>
    <text x="555" y="68" text-anchor="middle" class="step-txt">Check downloaded file size in DevTools</text>
  </g>
</svg>
</figure>

## Building This Without Overcomplicating It

1. **Generate two to four widths per source image** — you don't need ten variants; three well-chosen sizes (roughly mobile, tablet, and desktop scale) cover the vast majority of real-world benefit.
2. **Write `sizes` to match your actual CSS layout**, not a generic guess — if your image is genuinely full-width on mobile and half-width above a breakpoint, say exactly that.
3. **Verify in browser DevTools** by checking the Network tab on different simulated device widths — you should see a visibly smaller file downloaded on a narrow viewport than a wide one.
4. **Pair this with modern formats**, since `srcset` and format choice (WebP, AVIF) are two independent, stacking wins rather than alternatives to each other.

[Optimage's resize tool](/resize) can batch-generate multiple width variants from a single source image, which is most of the manual work involved in setting up a proper `srcset` correctly.

## What to Take From This

`srcset` and `sizes` together solve a problem that responsive CSS alone can't touch — which actual file gets downloaded, not just how it's displayed once it arrives. It's a one-time setup cost per image template, and the payoff is every visitor after that getting a file sized appropriately for their actual screen, without anyone having to think about it again.

**Related reading:**
- [Why Your LCP is Failing and How to Fix It Once and For All](/blog/why-your-lcp-is-failing-and-how-to-fix-it) — how oversized images directly hurt this Core Web Vital
- [The Complete Guide to Image Lazy Loading](/blog/image-lazy-loading-implementation-guide-2026) — the complementary technique for images below the fold
- [Google PageSpeed Insights Is Flagging Your Images](/blog/google-pagespeed-insights-image-fixes-ranked-2026) — where responsive image sizing ranks among the highest-impact fixes

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What's the difference between srcset and sizes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "srcset provides the browser a list of image file options at different resolutions or widths. sizes tells the browser how large the image will actually be displayed at different viewport widths, which it needs in order to pick the most appropriate file from the srcset list."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need srcset if I'm already using a responsive CSS layout?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — responsive CSS controls how an image is displayed and scaled, but it doesn't change which file gets downloaded. Without srcset, a phone still downloads the same full-resolution file a desktop monitor would."
      }
    }
  ]
}
</script>
