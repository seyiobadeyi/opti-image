---
title: "Google's INP Metric Is Now Live: What It Means for Image-Heavy Websites"
description: "Interaction to Next Paint replaced First Input Delay in March 2024, and by early 2026 it is actively influencing search rankings. If your site has a lot of images, here is exactly how INP is affected and what you need to fix."
date: "2026-01-29"
author: "Optimage Team"
tags: ["Core Web Vitals", "INP", "web performance", "Google ranking", "image optimization"]
category: "SEO & Performance"
featured: true
variants:
  - excerpt: "INP replaced FID in March 2024 and is now actively influencing search rankings. Image-heavy sites are disproportionately affected — here is exactly which image patterns cause poor INP and how to fix them."
    keyTakeaways:
      - "INP measures any interaction throughout the session, not just the first click like FID did"
      - "Google's Good threshold is under 200ms; Poor is over 500ms at the 75th percentile"
      - "decoding='async' offloads image decode from the main thread — the single most impactful INP fix"
      - "Carousel images, modals, and infinite scroll feeds are the most common image-related INP culprits"
  - excerpt: "Image decode on the main thread is the leading cause of poor INP on image-heavy sites. Adding decoding='async' to non-hero images eliminates this — and takes about 30 minutes to implement across a typical site."
    keyTakeaways:
      - "Large PNG and high-quality JPEG decoding blocks the main thread, directly worsening INP scores"
      - "Add decoding='async' to all images except the LCP hero to prevent main-thread blocking at click time"
      - "Set explicit width and height on all images to prevent layout shifts that extend presentation delay"
      - "Carousel slides should preload the next slide with img.decode() before the user clicks"
  - excerpt: "Sites that fixed their image-related INP problems since the 2024 launch have seen measurable improvements in Core Web Vitals scores and search performance — the fixes are well-understood and can be implemented incrementally."
    keyTakeaways:
      - "Target file sizes: carousel slides under 100KB, modals under 150KB, thumbnails under 50KB"
      - "Use fetchpriority='high' on the LCP image — do not apply loading='lazy' or decoding='async' to it"
      - "Chrome DevTools Performance panel shows 'Decode Image' entries with exact decode times"
      - "HTTP/2 or HTTP/3 must be enabled for multiplexed image requests to not block each other"
---

In March 2024, Google officially replaced First Input Delay (FID) with Interaction to Next Paint (INP) as a Core Web Vital metric. The change was announced well in advance, debated extensively in the performance engineering community, and implemented on schedule. By mid-2024, INP scores were actively factored into Google's Page Experience signal, which influences search ranking.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 32px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">200ms</text><text x="110" y="78" text-anchor="middle" class="sl">INP "Good" threshold</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">75th</text><text x="350" y="78" text-anchor="middle" class="sl">Percentile used for CWV score</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">5</text><text x="590" y="78" text-anchor="middle" class="sl">Common image INP causes</text></g>
</svg>
</div>

Now, in early 2026, INP has had almost two years to affect real websites in real search results. The patterns are clear: image-heavy websites are disproportionately likely to have poor INP scores, and the sites that have addressed their image-related INP problems have seen measurable improvements in both their Core Web Vitals dashboard and their search performance.

This article explains what INP actually measures, why images are such a common cause of poor INP scores, and what specific technical changes you should make to your image strategy to bring your INP into Google's "Good" range.

## Table of Contents
- [What INP Actually Measures](#what-inp-measures)
- [How INP Differs From FID](#inp-vs-fid)
- [Why Images Are an INP Problem](#images-and-inp)
- [The Main Image-Related INP Causes](#main-causes)
- [Fixing INP: Image Decoding](#fix-decoding)
- [Fixing INP: Layout Shifts From Images](#fix-layout)
- [Fixing INP: Oversized Images Blocking the Main Thread](#fix-main-thread)
- [Measuring Your Image-Related INP Impact](#measuring)
- [A Practical Image Audit Checklist](#checklist)

## What INP Actually Measures {#what-inp-measures}

INP measures the time between a user interaction (click, tap, or keyboard press) and the moment the next visual update (paint) appears on screen. Google's thresholds are:

- **Good:** Under 200 milliseconds
- **Needs Improvement:** 200-500 milliseconds
- **Poor:** Over 500 milliseconds

The score that matters for Core Web Vitals is the 75th percentile INP across all page interactions, as collected in the Chrome User Experience Report (CrUX). This means you need 75 percent of your users' interactions to complete within your target range, not just the average.

Critically, INP is measured across the entire page session, not just the initial load. If a user clicks a button two minutes after the page loaded and the main thread is blocked at that moment, that slow interaction counts. This is very different from load-time metrics, and it means you cannot fix INP purely by optimising initial page load.

## How INP Differs From FID {#inp-vs-fid}

FID measured only the first interaction on a page and only the input delay portion (the time before the browser started processing the event, not the time to complete the visual update). This made FID easy to game by ensuring that initial script execution completed quickly, after which the main thread was free for the first click.

INP is harder to improve because it measures any interaction throughout the session and includes the full pipeline: input delay, processing time, and presentation delay (the time to actually paint the response to screen). An interaction that causes a large DOM update, triggers multiple style calculations, or has to wait for a long main-thread task will score poorly even if the initial input delay is small.

For images, the FID era was relatively forgiving. An image-heavy page might have been slow to load, which affected LCP and CLS metrics, but once the initial load was done, FID would often be fine. INP changes this: if an image-related operation (resizing, repainting, layout recalculation triggered by an image) occurs during a user interaction, it counts against your INP score.

## Why Images Are an INP Problem {#images-and-inp}

Images affect INP through several specific mechanisms, some obvious and some subtle.

**Large images block the main thread during decode.** When a browser receives an image file, it must decode the compressed image data into raw pixel values before it can paint those pixels to screen. For large, complex image files (particularly PNGs and high-quality JPEGs), this decoding process can take tens of milliseconds and runs on the main thread by default. If a user interaction triggers an image to become visible (scrolling into view, clicking a tab that reveals an image, opening a modal with a product photo), the image decode happens on the main thread and blocks the response to the interaction.

**Layout shifts caused by images without dimensions.** If an image loads and causes a layout shift, the browser must recalculate the positions of all affected elements, a potentially expensive operation that can extend the time to the next paint and worsen INP.

**Unoptimised images in JavaScript-driven UI.** Single-page applications and dynamic product galleries often load images via JavaScript, sometimes after user interaction. If those images are large uncompressed files, the fetch and decode time gets added directly to the interaction's total time, worsening INP.

**CSS background images and repaint.** CSS background images on elements that are shown or hidden via JavaScript (dropdowns, accordions, tab panels) can trigger significant repaint operations that extend presentation delay.

## The Main Image-Related INP Causes {#main-causes}

Based on two years of INP data in the wild, here are the most common image-related causes of poor INP scores on image-heavy sites:

**1. Synchronous image decode during user interaction**
When a user clicks something that reveals a large image, the browser decodes it synchronously on the main thread. This is the single most common image-related INP problem on e-commerce and media sites.

**2. Carousels and galleries with unloaded images**
Product carousels that load images for all slides on page load but leave them undecoded can cause poor INP when a user clicks to the next slide. The full decode happens at click time, blocking the next paint.

**3. Modal dialogs with full-resolution images**
Opening a modal that displays a full-resolution product image or gallery image can trigger an expensive decode operation exactly when the user expects an immediate response (the modal appearing).

**4. Infinite scroll with large images**
Infinite scroll implementations that append large image batches to the DOM when a user reaches the bottom of the page can trigger main thread work that extends the input delay of the next click after the images are appended.

**5. Uncompressed hero images**
Hero images that are too large create long LCP times, and if the LCP element is interactive (a hero CTA button, for example), the long render time can extend into interaction response time.

## Fixing INP: Image Decoding {#fix-decoding}

The most impactful fix for image-related INP problems is offloading image decoding from the main thread using the `decoding="async"` attribute.

```html
<img src="product-photo.webp" alt="Product name" decoding="async" width="800" height="600">
```

The `decoding="async"` attribute tells the browser that it does not need to decode this image synchronously, and can perform the decode off the main thread when resources are available. For images that are not immediately visible (below the fold, in hidden tabs, in carousels beyond the first slide), this eliminates the decode blocking problem entirely.

Note: `decoding="async"` is different from `loading="lazy"`. Lazy loading defers the network request for an image. Async decoding defers the CPU processing of an image after it has been fetched. For INP, the relevant concern is the decode time, not the network fetch time.

For images that need to be ready immediately (hero images, above-the-fold content), you should not use `decoding="async"` because you want them decoded and painted as quickly as possible. For all other images, async decoding is the right default.

You can also use the `decode()` API in JavaScript to decode images programmatically at a time of your choosing:

```javascript
const img = new Image();
img.src = 'product-photo.webp';
img.decode().then(() => {
  document.body.appendChild(img);
});
```

This approach is useful for preloading and decoding images in advance of when they will be needed (for example, decoding the next carousel slide in the background while the user is viewing the current one).

## Fixing INP: Layout Shifts From Images {#fix-layout}

Every image on your page should have explicit `width` and `height` attributes that match the image's intrinsic dimensions. This allows the browser to reserve the correct space in the layout before the image loads, preventing a shift when the image arrives.

```html
<!-- Good: browser reserves space before image loads -->
<img src="hero.webp" alt="Hero image" width="1200" height="630">

<!-- Bad: browser has no idea how much space to reserve -->
<img src="hero.webp" alt="Hero image">
```

In responsive designs where images scale with viewport width, you also need CSS to make images responsive while maintaining their aspect ratio:

```css
img {
  max-width: 100%;
  height: auto;
}
```

When both the `width`/`height` attributes and `height: auto` are set, the browser can calculate the correct aspect ratio from the attributes and reserve the right space even before the image loads, completely eliminating image-caused layout shifts.

## Fixing INP: Oversized Images Blocking the Main Thread {#fix-main-thread}

Beyond decoding optimisation, simply having smaller image files reduces the decode time because there is less data to process. A 100KB WebP image decodes faster than an equivalent 800KB JPEG, not because WebP is inherently faster to decode (it is often slightly slower), but because there is less data in the file.

For INP purposes, the most important images to optimise are:
- Images in interactive components (carousels, tabs, accordions, modals)
- Images that are loaded after user interaction
- Images in infinite scroll feeds

<figure role="img" aria-label="INP image file size targets by context" style="margin:32px 0">
<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:640px;display:block;margin:0 auto">
  <style>.bc{animation:bg .7s ease-out both}.bc:nth-child(1){animation-delay:0s}.bc:nth-child(2){animation-delay:.15s}.bc:nth-child(3){animation-delay:.3s}.bc:nth-child(4){animation-delay:.45s}@keyframes bg{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}.bl{font:600 12px system-ui,sans-serif;fill:#374151;text-anchor:middle}.bv{font:700 13px system-ui,sans-serif;fill:#db5a42;text-anchor:middle}</style>
  <line x1="50" y1="20" x2="50" y2="160" stroke="#e5e7eb" stroke-width="1"/>
  <line x1="50" y1="160" x2="620" y2="160" stroke="#e5e7eb" stroke-width="1"/>
  <rect class="bc" x="70" y="60" width="100" height="100" rx="6" fill="#db5a42" opacity=".85"/>
  <text x="120" y="52" class="bv">200KB</text>
  <text x="120" y="178" class="bl">Hero / LCP</text>
  <rect class="bc" x="230" y="110" width="100" height="50" rx="6" fill="#db5a42" opacity=".85"/>
  <text x="280" y="102" class="bv">100KB</text>
  <text x="280" y="178" class="bl">Carousel</text>
  <rect class="bc" x="390" y="85" width="100" height="75" rx="6" fill="#db5a42" opacity=".85"/>
  <text x="440" y="77" class="bv">150KB</text>
  <text x="440" y="178" class="bl">Modal</text>
  <rect class="bc" x="500" y="135" width="100" height="25" rx="6" fill="#db5a42" opacity=".65"/>
  <text x="550" y="127" class="bv">50KB</text>
  <text x="550" y="178" class="bl">Thumbnails</text>
</svg>
</figure>

## Measuring Your Image-Related INP Impact {#measuring}

You need two types of data to understand your image-related INP problems: field data (real user measurements) and lab data (reproducible test conditions).

**Field data** comes from the Chrome User Experience Report and is accessible through:
- Google Search Console (Core Web Vitals report)
- PageSpeed Insights (which shows CrUX data for URLs with enough traffic)
- The `web-vitals` JavaScript library, which you can install on your site to collect INP measurements from real users

**Lab data** comes from Chrome DevTools and Lighthouse, which let you simulate interactions and measure their response times. The Performance panel in Chrome DevTools is the most useful tool for diagnosing INP: record a session while interacting with your page, then find the long interactions in the timeline and trace them back to specific operations.

To isolate image-related INP problems:
1. Open Chrome DevTools and go to the Performance panel
2. Enable "Screenshots" and "Memory" in the capture settings
3. Click "Record" and perform the interactions that you suspect are slow
4. Stop recording and look for long tasks (red highlighted sections) in the main thread timeline
5. Expand the task details and look for "Decode Image" entries, which will show you the exact image URL and decode time

Any Decode Image task taking more than 20-30ms is a candidate for optimisation. Tasks taking 100ms or more are definite problems.

## A Practical Image Audit Checklist {#checklist}

Use this checklist to systematically identify and fix image-related INP problems on your site.

**Markup audit:**
- [ ] All `<img>` elements have explicit `width` and `height` attributes
- [ ] All images except the LCP image have `loading="lazy"`
- [ ] All images except the LCP image have `decoding="async"`
- [ ] The LCP image has `fetchpriority="high"` (and does NOT have `loading="lazy"`)
- [ ] All images have `alt` attributes (accessibility and SEO)
- [ ] All images are served in WebP or AVIF format (with JPEG fallback via `<picture>` if needed)

**File size audit:**
- [ ] Hero/LCP images: under 200KB in WebP at display resolution
- [ ] Carousel images: under 100KB each in WebP
- [ ] Modal images: under 150KB in WebP
- [ ] Thumbnail images: under 50KB in WebP
- [ ] All images are served at or near their display resolution (no 2000px images displayed at 400px)

**Dynamic image loading audit:**
- [ ] Images loaded via JavaScript are decoded before they are needed (using `img.decode()`)
- [ ] Carousel implementations preload and decode the next slide while the current one is visible
- [ ] Infinite scroll implementations load images in appropriately-sized batches rather than appending 50 images simultaneously
- [ ] Modal images are preloaded when the user hovers over the trigger (not only when they click)

**Infrastructure audit:**
- [ ] Images are served from a CDN with edge caching (not the origin server)
- [ ] Images are served with appropriate `Cache-Control` headers (at least 1 year for versioned assets)
- [ ] HTTP/2 or HTTP/3 is enabled on the image origin to allow multiplexed requests

INP is a more complex and demanding metric than FID was, but the good news is that the fixes are well-understood. The image-related causes of poor INP are among the most tractable: they respond to clear technical interventions like adding `decoding="async"`, setting `width` and `height` attributes, and reducing file sizes. None of these changes require architectural overhauls. They can be implemented incrementally and the impact can be measured precisely in the Chrome DevTools Performance panel.

Start with your highest-traffic pages, focus on the interactive image components (carousels, modals, galleries), and work through the checklist above. The sites that have done this work since INP launched in 2024 have seen meaningful improvements in their Core Web Vitals scores, and there is no reason to wait any longer to start.

*Optimage compresses images for web delivery, converting to WebP and AVIF with batch processing and dimension control. [Try it free.](/)*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is INP and how does it affect Google rankings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "INP (Interaction to Next Paint) measures the time from a user interaction to the next visual update on screen. Google's Good threshold is under 200ms at the 75th percentile. Since March 2024, INP is an official Core Web Vital and directly influences Google's Page Experience ranking signal — poor INP can negatively impact search positions."
      }
    },
    {
      "@type": "Question",
      "name": "How do images cause poor INP scores?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Images cause poor INP primarily through synchronous main-thread decoding. When a user interaction reveals a large image (opening a modal, clicking a carousel, scrolling to a product), the browser decodes that image on the main thread, blocking the visual response. Images without explicit dimensions also cause layout shifts that extend presentation delay, worsening INP."
      }
    },
    {
      "@type": "Question",
      "name": "What is decoding='async' and does it help INP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The decoding='async' attribute on an img element tells the browser to decode the image off the main thread when resources are available, rather than blocking synchronously. For images that are revealed by user interaction — carousel slides, modal images, lazy-loaded content — this is the single most impactful fix for image-related INP problems. It should be applied to all images except the above-the-fold LCP image."
      }
    },
    {
      "@type": "Question",
      "name": "What file size targets should I use for images to improve INP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For INP optimization, target: hero/LCP images under 200KB in WebP, carousel slide images under 100KB each, modal product images under 150KB, and infinite scroll thumbnails under 50KB. Smaller files decode faster, reducing the main-thread blocking time that contributes to poor INP scores on image-heavy pages."
      }
    }
  ]
}
</script>
