---
title: "Chrome 133 and Full AVIF Support: What Web Developers Must Do Right Now"
description: "Chrome 133 shipped in January 2026 with full AVIF support including animation, and Safari 18 followed shortly after. Browser support for AVIF is now at a level where it should be your default image format for web delivery. Here is the complete implementation guide."
date: "2026-03-05"
author: "Optimage Team"
tags: ["AVIF", "Chrome 133", "Safari 18", "image formats", "web development", "performance"]
category: "Web Development"
featured: false
---

For the past several years, the story of AVIF on the web has been one of promise restrained by support gaps. The format, derived from the AV1 video codec and offering dramatically better compression efficiency than JPEG and even WebP, was never in question. The question was always: which browsers support it, and completely enough for production use?

Chrome 133, released in January 2026, answered that question definitively for the Chromium ecosystem. The release brought full AVIF support including animated AVIF, high bit-depth images, and consistent handling of AVIF's more exotic features like HDR and wide colour gamut content. Safari 18, which shipped with iOS 18.3 and macOS 15.3 in early 2026, extended full AVIF support to the Safari and WebKit ecosystem.

The result is that in March 2026, AVIF is supported by every modern browser that a typical web user is likely to be running. The support gaps that made WebP the safer default have effectively closed. It is time to update your image delivery strategy.

## Table of Contents
- [The AVIF Support Timeline: Where We Are Now](#support-timeline)
- [AVIF vs WebP in 2026: Which Should You Use?](#avif-vs-webp)
- [The Compression Efficiency Advantage](#compression-advantage)
- [Encoding Speed: The Remaining Challenge](#encoding-speed)
- [Implementing AVIF With the Picture Element](#picture-element)
- [Server-Side Content Negotiation for AVIF](#content-negotiation)
- [AVIF for Different Content Types](#content-types)
- [CDN Support for AVIF in 2026](#cdn-support)
- [Building an AVIF Workflow](#avif-workflow)
- [What About Legacy Browser Support?](#legacy-support)

## The AVIF Support Timeline: Where We Are Now {#support-timeline}

A brief history of AVIF browser support helps contextualise where we are in 2026:

- **2020:** Chrome 85 added basic AVIF support, but with significant gaps in edge case handling and no animated AVIF support
- **2021-2022:** Firefox added AVIF support; Safari remained the major holdout, creating a practical need for JPEG/WebP fallbacks
- **2022:** Safari 16 added basic AVIF support, but with inconsistency in handling more complex AVIF features
- **2023-2024:** Improvements across browsers, but production deployment remained cautious due to encoding complexity and inconsistent rendering
- **2025:** Safari 17 improved AVIF handling; Chrome continued improving; WebP remained the safer default for most teams
- **Early 2026:** Chrome 133 delivers comprehensive AVIF support including animated AVIF; Safari 18 matches it; Firefox has had solid AVIF support for over two years

The current global browser share picture for AVIF (full support) is approximately:
- Chrome/Chromium: ~65% of global users, all modern versions support AVIF
- Safari: ~19% of global users, iOS 18+ and macOS 15+ support AVIF (iOS 18 adoption is high due to the iPhone 15 and 16 installed base)
- Firefox: ~4% of global users, full AVIF support
- Edge: ~4% of global users (Chromium-based), full AVIF support
- Samsung Internet: ~3% of global users, AVIF support in recent versions

In aggregate, roughly 88-92 percent of active web users are now on browsers with solid AVIF support. This is above the threshold at which most web teams adopt new technologies as their primary delivery format (WebP reached this threshold around 2022, and WebP adoption accelerated thereafter).

The remaining 8-12 percent of users on older browsers (mostly older iOS versions, some enterprise environments locked to older Chrome releases, and some global markets with older device installed bases) still need JPEG fallbacks. The `<picture>` element and server-side content negotiation handle this gracefully.

## AVIF vs WebP in 2026: Which Should You Use? {#avif-vs-webp}

The short answer is: AVIF for supported browsers, WebP for broad compatibility, JPEG as the final fallback. All three simultaneously, using `<picture>` or content negotiation.

But if you are choosing a single format to prioritise, here is the comparison:

**AVIF advantages over WebP:**
- 20-50 percent smaller file sizes at equivalent visual quality for most photographic content
- Better handling of fine texture and film grain (relevant for AI-generated images and detailed photography)
- Better support for HDR and wide colour gamut content
- Supports animation (animated AVIF vs animated WebP, with AVIF generally producing better results)
- C2PA provenance metadata support (relevant for EU AI Act compliance)

**WebP advantages over AVIF:**
- Significantly faster encoding: WebP encodes 10-50x faster than AVIF at comparable quality settings
- More mature tooling: virtually every image processing library and CDN supports WebP
- Slightly broader browser support (covers some older browser versions that AVIF does not)
- More predictable compression behaviour across different content types

**The practical recommendation for 2026:**
- Use AVIF as the primary format in `<picture>` elements for supported browsers
- Use WebP as the secondary format for browsers that do not support AVIF
- Use JPEG as the fallback for legacy browsers
- Continue to deliver WebP where AVIF encoding time or tooling support is a constraint

## The Compression Efficiency Advantage {#compression-advantage}

The compression efficiency advantage of AVIF is substantial enough to warrant serious consideration even with the encoding speed tradeoffs. Real-world numbers from a range of image types:

**Photographic content (landscapes, portraits, product photography):**
- JPEG quality 85: 350KB (baseline)
- WebP quality 80: 230KB (34% smaller than JPEG)
- AVIF quality 70: 150KB (57% smaller than JPEG)

**AI-generated images (Midjourney-style detailed illustrations):**
- JPEG quality 85: 420KB (baseline)
- WebP quality 80: 280KB (33% smaller than JPEG)
- AVIF quality 70: 160KB (62% smaller than JPEG)

**Flat design / illustration (logos, UI elements, simple graphics):**
- PNG: 200KB (baseline for lossless)
- WebP quality 80: 70KB (65% smaller than PNG)
- AVIF quality 70: 45KB (78% smaller than PNG)
- SVG: variable (best for true vector content)

**Hero images displayed at 1920px wide:**
- JPEG quality 85: 520KB
- WebP quality 80: 340KB (35% smaller)
- AVIF quality 70: 195KB (62% smaller)

For a website with 10-20 images per page, switching from JPEG to AVIF (where supported) could reduce the image payload by 50-60 percent. This translates directly into faster LCP, reduced data consumption for mobile users, and lower CDN costs.

## Encoding Speed: The Remaining Challenge {#encoding-speed}

AVIF's encoding speed is the most commonly cited barrier to adoption, and it is a real limitation. Here is the current state of AVIF encoding performance:

**Slow encoders (reference implementations):**
The libaom encoder (the reference AV1 implementation) at quality 70 with default settings takes approximately 2-8 seconds per megapixel. For a 2000x1500 image (3 megapixels), this means 6-24 seconds of encoding time per image. This is acceptable for batch processing overnight but impractical for on-the-fly CDN encoding.

**Fast encoders:**
The SVT-AV1 encoder (developed by Intel and Netflix) is significantly faster. At comparable quality settings, SVT-AV1 can encode AVIF at approximately 200-500ms per megapixel, making it practical for semi-real-time use cases. Cloudflare, Fastly, and other CDNs have adopted SVT-AV1 for their on-the-fly AVIF conversion.

**Hardware acceleration:**
Modern Apple Silicon (M2 and later) and some Intel and AMD processors include hardware acceleration for AV1 decoding. Hardware-accelerated AVIF encoding is available on some NVIDIA GPU architectures. If you are batch-encoding large image libraries, hardware-accelerated encoding can reduce AVIF encoding time to a level comparable with WebP.

**The practical recommendation:**
- For build-time image processing (compressing your asset library as part of a build pipeline): Use a fast AVIF encoder with a quality setting of 65-72. Batch processing 1000 images will take minutes on modern hardware.
- For on-the-fly CDN encoding: Use CDNs that support AVIF (Cloudflare Images, Fastly, imgix, and Shopify's CDN all support AVIF delivery in 2026).
- For manual compression of individual images: Tools like Squoosh (browser-based), Optimage, and ImageMagick with libaom support AVIF encoding with various speed/quality tradeoffs.

## Implementing AVIF With the Picture Element {#picture-element}

The `<picture>` element is the standard HTML way to deliver different image formats to different browsers while maintaining a fallback:

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Descriptive alt text" width="1200" height="630"
       fetchpriority="high" loading="eager">
</picture>
```

The browser evaluates `<source>` elements in order and uses the first one it supports. Chrome 133+ and Safari 18+ will use the AVIF source. Older browsers that support WebP but not AVIF will use the WebP source. Legacy browsers will fall back to the JPEG `<img>`.

For responsive images with multiple sizes, the full `<picture>` element with `srcset` and `sizes`:

```html
<picture>
  <source
    type="image/avif"
    srcset="
      hero-400.avif 400w,
      hero-800.avif 800w,
      hero-1200.avif 1200w,
      hero-1600.avif 1600w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  >
  <source
    type="image/webp"
    srcset="
      hero-400.webp 400w,
      hero-800.webp 800w,
      hero-1200.webp 1200w,
      hero-1600.webp 1600w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  >
  <img
    src="hero-1200.jpg"
    srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
    alt="Descriptive alt text"
    width="1200"
    height="630"
    loading="eager"
    fetchpriority="high"
  >
</picture>
```

This is more complex markup than a simple `<img>`, but the performance benefits justify the verbosity. Most modern frameworks (Next.js, Nuxt, SvelteKit, Astro) handle this automatically through their image components, generating the appropriate `<picture>` element with all format variants when you use their optimised image components.

## Server-Side Content Negotiation for AVIF {#content-negotiation}

An alternative to the `<picture>` element approach is server-side content negotiation: the server detects what formats the browser supports (via the `Accept` request header) and serves the best format automatically. The image URL stays the same; the server decides which format to deliver.

When Chrome 133 requests an image, it sends a request header like:
```
Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
```

The server can detect `image/avif` in the `Accept` header and respond with an AVIF file while keeping the URL unchanged. This simplifies templates and markup since you only reference images once, but requires server-side support.

CDNs that support content negotiation-based AVIF delivery include:
- **Cloudflare Images:** Automatically serves AVIF to supported browsers, WebP to others, JPEG as fallback
- **Fastly Image Optimizer:** Similar content negotiation support
- **imgix:** Full AVIF support with `auto=format` parameter that selects AVIF for supported browsers
- **Shopify CDN:** Supports `format=auto` (uses AVIF or WebP based on browser support)
- **Cloudinary:** Full AVIF support with `f_auto` parameter

For self-hosted environments, Nginx can be configured to serve pre-encoded AVIF files to browsers that support them:

```nginx
location /images/ {
    add_header Vary Accept;

    if ($http_accept ~* "image/avif") {
        rewrite ^/images/(.+)\.(jpg|png|jpeg)$ /images/avif/$1.avif break;
    }

    if ($http_accept ~* "image/webp") {
        rewrite ^/images/(.+)\.(jpg|png|jpeg)$ /images/webp/$1.webp break;
    }
}
```

This serves AVIF to Chrome 133+/Safari 18+, WebP to other modern browsers, and the original JPEG to legacy browsers.

## AVIF for Different Content Types {#content-types}

AVIF's performance advantage is not uniform across content types. Here is where it shines and where other formats may still be preferable:

**Where AVIF excels:**
- Photographic content with natural textures, skin, foliage, sky
- AI-generated images with high-frequency noise throughout
- Images with subtle gradients where JPEG blocking is visible
- Images where HDR or wide colour gamut content matters
- Any image that needs to be very small (mobile thumbnails, preview images)

**Where WebP may still be preferred:**
- Images that need to be encoded very quickly (on-the-fly without a fast AVIF encoder)
- Animated images where encoding time is critical (animated WebP may be faster to produce)
- Cases where AVIF tooling support is a blocker

**Where PNG should still be used:**
- Images with transparency where lossless quality is essential
- UI elements, screenshots, diagrams where text legibility at 100% quality matters
- Images that will be further edited (keep source as PNG, deliver as AVIF)

**Where SVG should be used instead:**
- Logos, icons, illustrations that are vector-based
- Any image that needs to scale to any size without quality loss
- Simple geometric shapes and patterns
- SVG delivers better results than any raster format for appropriate content

## CDN Support for AVIF in 2026 {#cdn-support}

AVIF CDN support has matured significantly in 2025-2026. Here is the current state of the major CDN platforms:

**Cloudflare:** Full AVIF support via Cloudflare Images. On-the-fly AVIF conversion using SVT-AV1 is available with a Workers transform. Automatic format selection based on Accept header is supported.

**Fastly:** Image Optimization supports AVIF delivery via the `format=avif` query parameter. Automatic format selection is available.

**Amazon CloudFront with Lambda@Edge:** AVIF delivery is possible with custom Lambda@Edge functions that perform format negotiation. Native AVIF support in CloudFront itself is limited; the Lambda approach is needed for clean content negotiation.

**imgix:** Full AVIF support via the `fm=avif` parameter and `auto=format` automatic selection.

**Cloudinary:** Full AVIF support via the `f_avif` parameter and `f_auto` automatic selection.

**Shopify CDN:** AVIF delivery available via `format=avif` or `format=auto` URL parameters.

For teams using any of these CDN providers, enabling AVIF delivery is often a configuration change or URL parameter update rather than a significant engineering project.

## Building an AVIF Workflow {#avif-workflow}

Here is a practical workflow for adding AVIF to your image pipeline:

**For static sites (build-time processing):**
1. Store source images as PNG or high-quality JPEG
2. Add AVIF and WebP generation to your build process (Sharp, Squoosh CLI, or Optimage can handle this)
3. Generate AVIF at quality 65-72, WebP at quality 75-80, and retain JPEG as fallback
4. Update image markup to use `<picture>` elements with all three formats
5. Deploy and verify AVIF delivery in Chrome DevTools (Network tab, check response content-type)

**For content-managed sites (CMS with CDN):**
1. Enable AVIF delivery on your CDN (configuration change, usually in the CDN dashboard)
2. Verify the CDN is sending the correct `Vary: Accept` header so caches know different format versions exist
3. Update image markup templates to use content negotiation (single URL) or `<picture>` elements
4. Test with Chrome 133 (should receive AVIF) and an older browser (should receive WebP or JPEG)

**For e-commerce (Shopify, WooCommerce, Magento):**
1. If using Shopify CDN: update image URL generation to include `format=auto` or `format=avif`
2. If using WooCommerce: install an image optimisation plugin that supports AVIF delivery
3. Verify product image delivery format in Chrome DevTools

## What About Legacy Browser Support? {#legacy-support}

The question of legacy browser support is less pressing in 2026 than it was in 2023, but it is not zero. Users on older iOS versions, enterprise environments, and certain global markets may still be on browsers without AVIF support.

The `<picture>` element approach handles this gracefully with no user-visible impact: legacy browsers simply receive the JPEG fallback. The overhead of maintaining three format versions of each image is the main cost, which is mitigated by the fact that many CDNs handle format generation automatically.

If your analytics show a significant percentage of users on browsers without AVIF support, maintain the JPEG fallback. If your analytics show that essentially all users are on modern browsers (common for B2B SaaS, developer tools, and technology-focused sites), you may be able to simplify to just AVIF and WebP with a less critical JPEG fallback.

Check your own analytics rather than relying on global averages: your specific audience's browser distribution is what matters for your decision.

Chrome 133 and Safari 18 establishing comprehensive AVIF support represents the completion of a multi-year transition in web image delivery. The format was always technically superior; the ecosystem needed to catch up. In March 2026, it has. Developers who update their image delivery pipelines to serve AVIF to supported browsers will see meaningful performance gains, better Core Web Vitals scores, and reduced CDN costs. The implementation is well-supported by modern tooling and CDN infrastructure. There has never been a better time to make AVIF part of your standard image delivery stack.

*Optimage converts images to AVIF, WebP, and JPEG with batch processing and quality controls. [Try it free.](/)*
