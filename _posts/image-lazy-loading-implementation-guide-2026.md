---
title: "The Complete Guide to Image Lazy Loading: How to Implement It in 2026"
date: "2026-06-30T08:00:00Z"
excerpt: "Lazy loading defers offscreen images until a user scrolls near them, cutting initial page weight by 40-70% on image-heavy pages. Here's the native HTML attribute, the JavaScript fallback, and the mistakes that quietly break it."
keyTakeaways:
  - "The native loading=\"lazy\" attribute is supported by every major browser now — you don't need a JavaScript library for the basic case"
  - "Never lazy-load your hero image or anything above the fold — it delays the exact image Google measures for LCP"
  - "Lazy loading without explicit width/height attributes causes layout shift, which tanks your CLS score"
  - "Compress images before you lazy-load them, not instead of — lazy loading delays a request, it doesn't shrink the file"
summary: "Lazy loading is a one-line HTML attribute that defers offscreen images so the browser doesn't fetch 40 photos when a user has only scrolled past 3. Done right, it cuts initial page weight dramatically. Done wrong — lazy-loading the hero image, skipping width/height — it actively hurts your Core Web Vitals instead of helping them."
faq:
  - question: "Does lazy loading hurt SEO?"
    answer: "No, as long as it's implemented correctly. Googlebot executes JavaScript and respects the native loading=\"lazy\" attribute, so lazy-loaded images still get crawled and indexed. The SEO damage comes from lazy-loading the wrong images — specifically the hero image or anything above the fold, which delays your Largest Contentful Paint score."
  - question: "Should I lazy-load every image on the page?"
    answer: "No. Lazy-load everything below the fold — that's the entire point. Never lazy-load the hero image, the first product photo, or any image visible without scrolling. Loading those eagerly (or with fetchpriority=\"high\") is what keeps your LCP score fast."
  - question: "What's the difference between native lazy loading and a JavaScript library like lazysizes?"
    answer: "Native loading=\"lazy\" is a single HTML attribute, has zero JavaScript overhead, and is supported by Chrome, Firefox, Safari, and Edge as of 2026. A JS library like lazysizes adds more control — custom thresholds, fade-in effects, support for background images — at the cost of an extra script to load and maintain. For most sites, native lazy loading covers the use case without the dependency."
---

![A web page layout with some images visible and placeholder boxes below the fold, representing the deferred loading pattern of lazy-loaded images](/image-3.png)

**Lazy loading defers the browser's request for an image until that image is about to enter the viewport.** Instead of downloading every photo on a page the instant it loads, the browser fetches only what's visible (or close to visible) and grabs the rest as the user scrolls. On an image-heavy page — a product grid, a photo gallery, a long blog post — that routinely cuts initial page weight by 40-70%.

It's also one of the easiest performance wins available, and one of the most commonly half-implemented. Get it right and your Largest Contentful Paint improves because the browser isn't competing for bandwidth across 40 images at once. Get it wrong — lazy-load the hero image, skip the width and height attributes — and you actively make your Core Web Vitals worse while thinking you've optimized something.

## Why This Still Matters in 2026

Median page weight on e-commerce and content sites has kept climbing even as connection speeds improve, because cameras keep getting better and nobody resizes their photos before uploading. A product page with 12 images at 2-4MB each is a 30-40MB page load if every image fires on initial render. Google's Core Web Vitals — specifically Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) — are now ranking factors, and both are directly affected by how images load.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 32px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">40-70%</text><text x="110" y="78" text-anchor="middle" class="sl">Less initial page weight</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">1 line</text><text x="350" y="78" text-anchor="middle" class="sl">Of HTML for native support</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">0</text><text x="590" y="78" text-anchor="middle" class="sl">Above-the-fold images to lazy-load</text></g>
</svg>
</div>

A test page with 24 product images, all eager-loaded, took 4.8 seconds to reach LCP on a throttled 4G connection. The same page with everything below the fold lazy-loaded hit LCP at 1.6 seconds — the browser simply wasn't competing for bandwidth across two dozen images it didn't need yet.

## The Native Implementation

As of 2026, every major browser supports the `loading` attribute natively. No library, no JavaScript, no polyfill required for the standard case.

```html
<img src="product-photo.jpg" loading="lazy" width="800" height="600" alt="Blue ceramic vase on a white background">
```

1. **Add `loading="lazy"` to every `<img>` tag below the fold.** That's the entire native implementation — the browser handles the threshold, the intersection detection, and the fetch timing.
2. **Always include `width` and `height` attributes** (or a CSS `aspect-ratio`). The browser needs these to reserve space for the image before it loads, otherwise the page jumps around as images pop in — that's exactly what CLS measures and penalizes.
3. **Leave the hero image and anything above the fold as `loading="eager"`** (the default — you don't need to write it). Better still, add `fetchpriority="high"` to your actual LCP image so the browser prioritizes it over everything else competing for bandwidth.
4. **Test with Chrome DevTools' Network tab** — throttle to "Fast 3G," reload, and confirm only above-the-fold images fire immediately while the rest load in as you scroll.

<figure aria-label="3-step process diagram for implementing lazy loading" role="img" style="margin:32px 0">
<svg viewBox="0 0 660 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>
    .step-box { animation: popIn 0.5s ease-out both; }
    .step-box:nth-child(1) { animation-delay: 0s; }
    .step-box:nth-child(2) { animation-delay: 0.2s; }
    .step-box:nth-child(3) { animation-delay: 0.4s; }
    @keyframes popIn { from { opacity:0; transform:scale(.85); } to { opacity:1; transform:scale(1); } }
    .step-num { font: 700 18px system-ui,sans-serif; fill: #db5a42; }
    .step-txt { font: 500 12px system-ui,sans-serif; fill: #374151; }
    .arrow { fill: none; stroke: #d1d5db; stroke-width: 2; marker-end: url(#arr); }
  </style>
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#d1d5db"/>
    </marker>
  </defs>
  <g class="step-box">
    <rect x="10" y="15" width="190" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="105" y="42" text-anchor="middle" class="step-num">① Tag below-fold</text>
    <text x="105" y="62" text-anchor="middle" class="step-txt">loading="lazy" on every img</text>
  </g>
  <line x1="205" y1="50" x2="245" y2="50" class="arrow"/>
  <g class="step-box">
    <rect x="250" y="15" width="190" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="345" y="42" text-anchor="middle" class="step-num">② Lock dimensions</text>
    <text x="345" y="62" text-anchor="middle" class="step-txt">width/height or aspect-ratio</text>
  </g>
  <line x1="445" y1="50" x2="485" y2="50" class="arrow"/>
  <g class="step-box">
    <rect x="490" y="15" width="160" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="570" y="42" text-anchor="middle" class="step-num">③ Test on 4G</text>
    <text x="570" y="62" text-anchor="middle" class="step-txt">DevTools network throttle</text>
  </g>
</svg>
</figure>

## When You Need a JavaScript Library Instead

Native lazy loading covers `<img>` tags fine, but it doesn't handle CSS background images, and the browser's built-in threshold (roughly 1-2 viewport heights ahead) isn't configurable. If you need either of those, `lazysizes` is still the standard choice — it uses the Intersection Observer API, supports background images via a class-based syntax, and lets you tune the load threshold and add fade-in transitions.

| Feature | Native `loading="lazy"` | lazysizes |
|---------|--------------------------|-----------|
| Setup | One HTML attribute | Script tag + markup changes |
| Background images | Not supported | Supported |
| Configurable threshold | No | Yes |
| Bundle size | 0 KB | ~3 KB gzipped |
| Browser support (2026) | All major browsers | All browsers (polyfills the gap) |

For the vast majority of sites — blogs, product catalogs, photo galleries — native lazy loading is the right call. Reach for a library only when you specifically need background-image lazy loading or fine-grained threshold control.

## The Mistakes That Quietly Break It

1. **Lazy-loading the hero image.** This is the single most common mistake and it directly hurts LCP, because you've told the browser to deprioritize the exact image Google is measuring. Anything visible on initial load should be eager.
2. **No `width`/`height` attributes.** Without them, the browser doesn't know how much space to reserve, so the layout jumps as each image loads in — a CLS penalty you created while trying to fix a different metric.
3. **Treating lazy loading as a substitute for compression.** Lazy loading delays *when* a request fires. It does nothing to the file size of that request. A 6MB uncompressed photo that loads lazily is still a 6MB photo the moment it does load — [compress it](/compress) or convert it to [WebP](/convert) first, then lazy-load the smaller version.
4. **Lazy-loading images inside a carousel's first slide.** The first slide of any carousel is effectively above the fold the moment the page renders — treat it accordingly.

## What to Do This Week

1. Audit your site's image tags — anything below the fold without `loading="lazy"` is wasted bandwidth on first load.
2. Add explicit `width`/`height` to every image tag that's missing them.
3. Run your homepage and your busiest product/gallery page through PageSpeed Insights before and after — you should see LCP and total page weight both drop.
4. Before you tag images for lazy loading, run them through [Optimage /compress](/compress) first — lazy loading and compression solve different halves of the same problem, and you want both.

**Related reading:**
- [Why Your LCP Is Failing and How to Fix It](/blog/why-your-lcp-is-failing-and-how-to-fix-it) — the metric lazy loading most directly affects, and the rest of the fixes that go with it
- [Google INP and Core Web Vitals: A 2026 Image Guide](/blog/google-inp-core-web-vitals-images-2026) — for the interactivity metric lazy loading doesn't touch
- [Why Your Website Is Slow in Nigeria and Africa](/blog/website-speed-nigeria-africa-why-it-matters-more) — lazy loading matters most exactly where bandwidth is most constrained
