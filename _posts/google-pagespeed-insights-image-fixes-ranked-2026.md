---
title: "Google PageSpeed Insights Is Flagging Your Images. Here Are the 5 Fixes, Ranked by How Much They Actually Move Your Score."
date: "2026-07-10T21:00:00Z"
excerpt: "Most sites that fail PageSpeed Insights fail it on images, not code. Here are the five fixes that matter, ranked by real impact on your score — starting with the one people skip because it takes ten minutes and ending with the one people obsess over that barely moves the needle."
keyTakeaways:
  - "Images are the single most common cause of a failing PageSpeed score — more often than JavaScript, fonts, or third-party scripts combined"
  - "Correct sizing (not shrinking a huge image with CSS) is the single highest-impact fix and the one most sites skip"
  - "Modern format conversion (WebP or AVIF) is the second-biggest win and takes minutes with the right tool"
  - "Lazy loading below-the-fold images matters, but doing it on your hero image actively hurts your Largest Contentful Paint score"
faq:
  - question: "Why do images hurt my PageSpeed Insights score the most?"
    answer: "Images are almost always the largest assets on a typical webpage by file size, and PageSpeed's Core Web Vitals metrics — especially Largest Contentful Paint — are directly measuring how long it takes the biggest visible element to render. On most sites, that biggest element is a hero image or a product photo, which means image weight has an outsized effect on the score compared to code-level issues."
  - question: "What's the single fastest fix for a bad PageSpeed image score?"
    answer: "Resize images to the dimensions they're actually displayed at. A shockingly common mistake is uploading a 4000px-wide photo and letting CSS shrink it to display at 800px — the browser still downloads the full 4000px file. Exporting at the actual display size, doubled for retina screens, is a ten-minute fix that often produces the single biggest score jump of any change on this list."
  - question: "Does converting images to WebP or AVIF really make a measurable difference?"
    answer: "Yes — typically a 25-35% file size reduction from WebP over an equivalent-quality JPEG, and often another 20% beyond that with AVIF, with no visible quality loss at normal viewing distance. For an image-heavy page, that alone can be the difference between a red and a green PageSpeed score on mobile."
---

![A Google PageSpeed Insights report on a laptop screen showing a red mobile score with image-related warnings highlighted, next to a folder of oversized photo files](/image-1.png)

**Run almost any small business site, blog, or portfolio through Google PageSpeed Insights and the failing grade traces back to one thing: images.** Not JavaScript bloat, not third-party scripts, not fonts — images, nearly every time. The fixes aren't complicated, but most guides list ten things to do with equal weight, which is the wrong way to spend your time. Here are the five that actually matter, ranked by how much they move the number.

## 1. Correct Sizing — the Fix With the Biggest Score Impact

The single most common mistake on the web: uploading a photo straight off a phone or camera — often 3000-6000px wide — and letting CSS display it at 600-800px. The browser has no idea you're going to shrink it visually. It downloads the entire multi-megabyte original before CSS ever touches it. That's pure wasted bandwidth and pure wasted load time, on every single page load, for every single visitor.

The fix: export images at the dimensions they're actually displayed at on your site, doubled for retina/high-DPI screens (so an 800px display slot gets a 1600px export, not a 6000px one). This single change routinely produces the largest PageSpeed score jump of anything on this list, because it directly attacks the metric PageSpeed cares most about — how many bytes have to arrive before the page looks done.

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
    <text x="120" y="62" text-anchor="middle" class="stat-num">#1</text>
    <text x="120" y="82" text-anchor="middle" class="stat-lbl">Cause of failing PageSpeed scores: image weight</text>
  </g>
  <g class="stat-bar">
    <rect x="250" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="350" y="62" text-anchor="middle" class="stat-num">25-35%</text>
    <text x="350" y="82" text-anchor="middle" class="stat-lbl">Typical size cut from switching JPEG to WebP</text>
  </g>
  <g class="stat-bar">
    <rect x="480" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="580" y="62" text-anchor="middle" class="stat-num">5</text>
    <text x="580" y="82" text-anchor="middle" class="stat-lbl">Fixes that actually matter, ranked below</text>
  </g>
</svg>
</div>

## 2. Modern Format Conversion — WebP or AVIF Over JPEG/PNG

Converting existing JPEGs to WebP typically cuts file size 25-35% at equivalent visual quality, and AVIF pushes another 15-20% past that on top. Browser support has been effectively universal for both formats for a couple of years now, so there's no real compatibility argument left against switching. This is the second-highest-impact fix because it's a straight multiplier on every image on the page, not a one-time structural change.

The practical note: don't hand-convert one image at a time. A tool that batch-converts a whole folder to WebP or AVIF in one pass turns a tedious afternoon task into a five-minute one.

## 3. Compression Quality Settings — the Diminishing-Returns Fix

Dropping JPEG quality from 100 to 82-85 typically cuts file size 40-60% with a difference in visual quality that's nearly impossible to spot at normal viewing distance on a normal screen. This matters, but it matters less than sizing and format, because it only affects the images you haven't already fixed with steps 1 and 2 — it's a smaller lever applied on top of the bigger ones.

## 4. Lazy Loading — Helps Below the Fold, Actively Hurts Above It

Lazy loading defers offscreen images until a user scrolls near them, which genuinely helps initial page load on long, image-heavy pages. The mistake that actually lowers your score: applying `loading="lazy"` to your hero image or any above-the-fold content. That delays the exact element PageSpeed is measuring for Largest Contentful Paint, actively working against the metric you're trying to improve. Lazy-load everything below the fold; never lazy-load what's visible on first paint.

## 5. Next-Gen Delivery (CDN, Responsive `srcset`) — Real, but Smallest on This List

Serving images from a CDN with edge caching and using `srcset` to deliver different sizes to different devices both help — a phone shouldn't download the same file size as a 4K monitor. This is genuinely worth doing, but it's ranked last here because it's typically a 5-10% improvement layered on top of everything above, not a fix that moves a failing score into passing territory on its own the way sizing and format conversion do.

## The Fix People Waste Time On Instead

The inverse of this list is just as instructive: the things sites spend disproportionate effort on that barely move a PageSpeed score. Minifying HTML comments, chasing a perfect Lighthouse 100 on desktop when 90%+ of the actual traffic is mobile, or switching hosting providers because "the server must be slow" — all real rabbit holes, none of them the actual problem on an image-heavy site. A site with a 4-second Largest Contentful Paint caused by a 3MB unoptimized hero image will not improve meaningfully from a faster server, because the server was never the bottleneck. The image was.

This is worth saying plainly because it's the single most common misdiagnosis in PageSpeed troubleshooting: a bad score reads as a hosting or code problem to a lot of site owners, because that's what "performance" sounds like it should mean. On the large majority of sites that fail the mobile score specifically, the honest answer is duller and cheaper to fix — somebody uploaded photos without resizing or converting them first, and every other optimization is polish on top of that unaddressed root cause.

## The Order That Actually Works

Fix them in this order, not the reverse: resize correctly first, convert to a modern format second, dial in compression third, audit your lazy-loading attributes fourth, and treat CDN/responsive delivery as the polish pass once the big structural issues are gone. Doing step 5 before step 1 is why some sites spend money on a CDN and still fail PageSpeed — the CDN is serving an unnecessarily huge file faster, not a correctly sized one.

[Optimage](/) handles steps 1 through 3 — resize, format conversion, and compression — in a single batch pass across an entire folder of images, free, no account needed.

**Related reading:**
- [Why Your LCP Is Failing (and How to Fix It)](/blog/why-your-lcp-is-failing-and-how-to-fix-it) — the Core Web Vitals metric this whole guide is optimizing for
- [WebP vs. AVIF: The Complete Guide for US Websites](/blog/webp-avif-complete-guide-us-websites-2026) — choosing between the two modern formats in depth
- [Image Lazy Loading: Implementation Guide 2026](/blog/image-lazy-loading-implementation-guide-2026) — doing lazy loading correctly, including the above-the-fold trap
