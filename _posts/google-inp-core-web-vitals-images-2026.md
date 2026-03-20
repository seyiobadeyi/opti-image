---
title: "Google's INP Metric Is Now Live: What It Means for Image-Heavy Websites"
description: "Interaction to Next Paint replaced First Input Delay in March 2024, and by early 2026 it is actively influencing search rankings. If your site has a lot of images, here is exactly how INP is affected and what you need to fix."
date: "2026-01-29"
author: "Optimage Team"
tags: ["Core Web Vitals", "INP", "web performance", "Google ranking", "image optimization"]
category: "SEO & Performance"
featured: true
---

In March 2024, Google officially replaced First Input Delay (FID) with Interaction to Next Paint (INP) as a Core Web Vital metric. The change was announced well in advance, debated extensively in the performance engineering community, and implemented on schedule. By mid-2024, INP scores were actively factored into Google's Page Experience signal, which influences search ranking.

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

**Layout shifts caused by images without dimensions.** If an image loads and causes a layout shift, the browser must recalculate the positions of all affected elements, a potentially expensive operation that can extend the time to the next paint and worsen INP. Even if the layout shift itself happens during page load (contributing to CLS), the recalculation work can sometimes affect interactive performance.

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

If you are using CSS `background-image` instead of `<img>` elements, you need a different approach since background images do not have intrinsic dimensions. Use the `aspect-ratio` CSS property on the container:

```css
.hero-background {
  aspect-ratio: 16 / 9;
  background-image: url('hero.webp');
  background-size: cover;
}
```

## Fixing INP: Oversized Images Blocking the Main Thread {#fix-main-thread}

Beyond decoding optimisation, simply having smaller image files reduces the decode time because there is less data to process. A 100KB WebP image decodes faster than an equivalent 800KB JPEG, not because WebP is inherently faster to decode (it is often slightly slower), but because there is less data in the file.

For INP purposes, the most important images to optimise are:
- Images in interactive components (carousels, tabs, accordions, modals)
- Images that are loaded after user interaction
- Images in infinite scroll feeds

For static above-the-fold images, LCP optimisation (fast load time) is more important than INP optimisation. But for any image that appears as a result of a user interaction, file size directly affects INP.

**Target file sizes for interactive-context images:**
- Carousel slides: under 100KB per image in WebP
- Modal product images: under 150KB in WebP (display size 600-800px)
- Tab content images: under 80KB in WebP
- Infinite scroll feed images: under 50KB per thumbnail

These are conservative targets that ensure decode time is negligible even on mid-range mobile hardware.

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
- [ ] Images are served with Brotli or gzip compression for JPEG (PNG and WebP compress less at the transport layer but still benefit)
- [ ] HTTP/2 or HTTP/3 is enabled on the image origin to allow multiplexed requests

INP is a more complex and demanding metric than FID was, but the good news is that the fixes are well-understood. The image-related causes of poor INP are among the most tractable: they respond to clear technical interventions like adding `decoding="async"`, setting `width` and `height` attributes, and reducing file sizes. None of these changes require architectural overhauls. They can be implemented incrementally and the impact can be measured precisely in the Chrome DevTools Performance panel.

Start with your highest-traffic pages, focus on the interactive image components (carousels, modals, galleries), and work through the checklist above. The sites that have done this work since INP launched in 2024 have seen meaningful improvements in their Core Web Vitals scores, and there is no reason to wait any longer to start.

*Optimage compresses images for web delivery, converting to WebP and AVIF with batch processing and dimension control. [Try it free.](/)*
