---
title: "Google March 2026 Core Update: Why Image Optimization Is Your Fastest Win"
description: "Google's March 2026 Core Update is rolling out now. Early data shows that image-optimised sites are recovering faster and seeing the biggest gains. Here is what the update targets and what you should fix today."
date: "2026-02-19"
author: "Optimage Team"
tags: ["Google core update", "SEO", "image optimization", "Core Web Vitals", "search ranking"]
category: "SEO & Performance"
featured: true
excerpt: "Early data from the March 2026 Core Update shows sites with strong Core Web Vitals scores are disproportionately winning — and image optimization is the fastest way to improve all three metrics simultaneously."
variants:
  - excerpt: "Sites with Good Core Web Vitals scores are disproportionately winning in the March 2026 Core Update — and image optimization is the single fastest way to improve all three metrics at once."
    keyTakeaways:
      - "The LCP element is an image on over 70% of pages, making image optimization central to ranking improvement"
      - "A seven-day action plan covers audit, CLS fix, LCP image delivery, site-wide compression, INP fixes, alt text, and verification"
      - "Target file sizes: hero images under 150KB WebP, article images under 80KB, thumbnails under 40KB"
      - "CrUX data updates monthly, so improvements take 28 days to appear in the Core Web Vitals report"
  - excerpt: "The LCP element is an image on over 70% of pages — and images are the primary driver of all three Core Web Vitals metrics. Fixing image delivery is the highest-leverage technical SEO action available right now."
    keyTakeaways:
      - "Sites with mobile LCP under 2.5 seconds are performing better in the March 2026 update than those above it"
      - "Adding width and height attributes to images fixes CLS in markup and CSS with no infrastructure changes needed"
      - "WebP and AVIF format images reduce download time by 25–40% at equivalent visual quality vs JPEG"
      - "The fetchpriority='high' attribute and preload link are required on LCP images for best ranking performance"
  - excerpt: "Panic-compressing images so aggressively that visual quality suffers can worsen content quality signals even while improving file size metrics — the goal is appropriate compression, not maximum compression."
    keyTakeaways:
      - "Original photography and custom illustrations outperform widely-licensed stock imagery in core update assessments"
      - "Alt text that accurately describes image content correlates with better core update performance"
      - "INP appears more heavily weighted in the March 2026 update than in previous core updates"
      - "Do not make major content or structural site changes while an update is still rolling out"
---

Google core updates are notoriously difficult to prepare for because they target quality signals holistically rather than specific on-page factors. The March 2026 Core Update, which began rolling out in the third week of February and is expected to complete over several weeks, follows this pattern. It is not a specific algorithm penalty for a specific behaviour; it is a broad reassessment of which pages best satisfy user intent for their target queries.

What makes this update particularly interesting, based on early data from SEO monitoring tools and from the sites that have seen the largest positive movements, is the correlation between Core Web Vitals scores and ranking gains. Sites that made improvements to their Core Web Vitals metrics in 2025 are disproportionately represented among the March 2026 winners. Sites that have poor INP, LCP, or CLS scores are disproportionately represented among the losers.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 32px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">70%+</text><text x="110" y="78" text-anchor="middle" class="sl">Pages: image is LCP</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">22%</text><text x="350" y="78" text-anchor="middle" class="sl">More organic traffic</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">2.5s</text><text x="590" y="78" text-anchor="middle" class="sl">Good LCP threshold</text></g>
</svg>
</div>

Of all the Core Web Vitals improvements you can make, image optimisation is simultaneously the highest impact and the most achievable in a short timeframe. This is not a coincidence: images are the primary driver of three out of three Core Web Vitals metrics for most websites. This article explains what the update appears to target, what the data shows, and what specific image optimisation actions you can take this week.

## Table of Contents
- [What Early Data Shows About the March 2026 Update](#early-data)
- [How Core Web Vitals Connect to Core Update Performance](#cwv-connection)
- [LCP: The Image Problem at the Centre of Rankings](#lcp-problem)
- [CLS: Layout Shifts That Cost You Rankings](#cls-problem)
- [INP: The New Metric That Is Now Fully Weighted](#inp-weight)
- [The Content Quality Signal and Visual Presentation](#content-quality)
- [A Seven-Day Image Optimisation Action Plan](#action-plan)
- [What Not to Do During a Core Update Rollout](#what-not-to-do)

## What Early Data Shows About the March 2026 Update {#early-data}

By mid-February 2026, the footprints of the upcoming update were visible in the "pre-roll" volatility that typically precedes major Google algorithm updates by two to four weeks. The tools that track ranking volatility across thousands of keywords (Semrush Sensor, Mozcast, SISTRIX) all showed elevated turbulence, particularly in content-heavy categories: health, finance, news, e-commerce, and educational content.

The sites that appear to be winning in the initial data share several characteristics:

**Strong Core Web Vitals scores.** Sites with "Good" assessments across all three Core Web Vitals (LCP, INP, and CLS) in the Chrome User Experience Report are over-represented among the early movers gaining traffic.

**Fast mobile performance.** Given that more than 60 percent of Google searches now occur on mobile devices, and Google's mobile-first indexing, mobile page speed is particularly relevant. Sites with mobile LCP under 2.5 seconds are performing better than those above that threshold.

**High-quality visual content.** Sites where images are relevant, original, and well-formatted (correct aspect ratios, descriptive alt text, responsive sizes) are showing better performance than sites where images are generic, incorrectly formatted, or missing.

**Original, helpful content.** The March 2026 update continues Google's sustained campaign against content that appears to be written primarily for search engines rather than human readers. Sites with thin, repetitive, or AI-generated-without-editing content are the consistent losers.

## How Core Web Vitals Connect to Core Update Performance {#cwv-connection}

Since Google made Core Web Vitals a ranking factor in 2021, the question of how much weight they carry has been continuously debated. The evidence from the March 2026 update suggests the weight is now significant enough to meaningfully differentiate competitive pages.

The mechanism appears to be this: Core Web Vitals data from the Chrome User Experience Report (CrUX) reflects real user experiences with your site. Poor CrUX data is a signal that users are having a frustrating experience, which correlates with lower engagement, higher bounce rates, and reduced dwell time. These engagement signals are themselves ranking factors. Core Web Vitals are therefore both direct ranking signals and proxies for the engagement signals that have always been ranking factors.

For image-heavy sites (e-commerce, photography, media, educational content), images drive the most significant Core Web Vitals problems:
- The LCP element is an image on over 70 percent of pages
- CLS problems are most commonly caused by images without declared dimensions
- INP problems are frequently caused by image decode operations during user interactions

Fixing image-related Core Web Vitals issues is therefore the highest-leverage technical SEO action available to most websites right now.

## LCP: The Image Problem at the Centre of Rankings {#lcp-problem}

Largest Contentful Paint (LCP) measures how long it takes for the largest visible content element to be rendered in the viewport. On most pages, this is an image: a hero image, a product photograph, a feature illustration, or a blog post header image.

Google's LCP thresholds are:
- Good: under 2.5 seconds
- Needs Improvement: 2.5-4.0 seconds
- Poor: over 4.0 seconds

For ranking purposes, "Good" means the 75th percentile of real user experiences is under 2.5 seconds. This is a demanding threshold for mobile users on slower connections.

The main causes of poor LCP for image-dominant pages:

**Image file size too large.** The single biggest factor. An uncompressed 2MB JPEG hero image on a slow mobile connection might take 3-4 seconds just to download, making a Good LCP score impossible regardless of how fast the server is.

**Image format.** PNG and JPEG are less efficient than WebP and AVIF for a given visual quality level. Serving the same image in WebP at equivalent quality can reduce download time by 25-40 percent.

**No preloading hint.** If the LCP image is not discovered by the browser until the CSS is parsed (for example, a CSS background image or an image inside a JavaScript-rendered component), the download starts later than it could. Adding `<link rel="preload" as="image">` for the LCP element allows the browser to start downloading it as soon as the HTML is parsed.

**Not using a CDN.** Images served from the origin server have higher latency than images served from a CDN edge location close to the user. For global audiences, this can easily add 200-500ms to image load time.

**Missing `fetchpriority="high"` on the LCP image.** The `fetchpriority` attribute tells the browser to prioritise this image download over other concurrent requests. Without it, the browser may deprioritise the LCP image in favour of render-blocking scripts.

The correct markup for an LCP hero image:

```html
<link rel="preload" as="image" href="hero.webp" fetchpriority="high">

<img src="hero.webp"
     alt="Descriptive alt text for the hero image"
     width="1200"
     height="630"
     fetchpriority="high"
     decoding="sync">
```

Note `decoding="sync"` on the LCP image (the opposite of other images): you want the browser to decode this image synchronously and paint it as fast as possible, not defer it.

## CLS: Layout Shifts That Cost You Rankings {#cls-problem}

Cumulative Layout Shift (CLS) measures the total amount of unexpected movement of page elements as the page loads. Images without declared dimensions are the most common cause of CLS on most websites.

When an `<img>` element has no `width` and `height` attributes, the browser does not know how much space to reserve for it in the layout. It reserves zero space. When the image loads, it suddenly appears with its full dimensions, pushing all the content below it downward. Users experience this as a jarring shift, often causing them to click the wrong thing or lose their reading position.

Google's CLS thresholds are:
- Good: under 0.1
- Needs Improvement: 0.1-0.25
- Poor: over 0.25

A single large image loading without declared dimensions can contribute 0.2 or more to CLS on its own, pushing the page into the Poor category for a metric that many sites have otherwise managed carefully.

The fix is straightforward: add `width` and `height` attributes to every `<img>` element that match the image's intrinsic dimensions.

```html
<!-- Before: causes layout shift -->
<img src="product.webp" alt="Product name">

<!-- After: reserves space, no layout shift -->
<img src="product.webp" alt="Product name" width="800" height="600">
```

With `height: auto` in your CSS, the image will still scale responsively while the correct aspect ratio is maintained.

For background images in CSS, the fix is different: use `aspect-ratio` on the container:

```css
.hero {
  aspect-ratio: 16 / 9;
  background-image: url('hero.webp');
  background-size: cover;
}
```

CLS is one of the rare Core Web Vitals improvements where the fix is purely in the markup and CSS with no infrastructure changes needed. Run a Lighthouse audit on your most-visited pages and fix every image that lacks `width` and `height` attributes. This can be done in a few hours for most websites.

## INP: The New Metric That Is Now Fully Weighted {#inp-weight}

Interaction to Next Paint (INP) replaced FID in March 2024, and by early 2026 it has been a full ranking factor for two years. Sites that have not yet addressed their INP scores are now experiencing the cumulative disadvantage of two years of poor INP data in CrUX.

For the March 2026 Core Update, INP appears to be more heavily weighted than in previous updates. The correlation between poor INP scores and ranking losses is stronger in the early data than what was seen in previous core updates.

The image-related INP fixes were covered in detail in our earlier article on Google's INP metric, but the key action items are:

- Add `decoding="async"` to all images that are not the LCP element
- Ensure images in interactive components (carousels, accordions, modals) are decoded before they are needed
- Reduce file sizes for images that are loaded as a result of user interaction
- Use `img.decode()` to preload decode for next-slide carousel images

On mobile devices, which is where INP problems are most severe, large JPEG images can take 50-200ms to decode on mid-range hardware. A single click that triggers the decode of a 1.5MB JPEG will consistently produce a poor INP measurement on the majority of Android devices. WebP and AVIF decode faster than JPEG at equivalent visual quality on modern hardware, providing a double benefit: smaller files (faster network transfer) and faster decode.

## The Content Quality Signal and Visual Presentation {#content-quality}

Beyond the Core Web Vitals signals, the March 2026 Core Update appears to continue Google's trajectory of using visual presentation as a proxy for content quality. This is the signal that is hardest to measure technically but clearest in the site-level patterns.

Pages that invest in original, relevant, high-quality images are evaluated more favourably than pages that use generic stock imagery or no imagery. This reflects the reality that visual content is part of user experience, and Google's ranking system is attempting to rank pages that provide the best overall user experience.

Specific visual presentation factors that correlate with better core update performance:

**Original images vs stock images.** Pages with original photography or custom illustrations perform better than pages using widely-licensed stock imagery. This is partly because original images are a signal of editorial investment, and partly because image search and visual recognition systems can identify widely-used stock images.

**Image relevance to content.** Images that are visually relevant to the article or page content (not just decorative or keyword-stuffing with alt text) perform better. Google's vision models can assess whether an image depicts the subject matter of the surrounding text.

**Alt text quality.** Descriptive, accurate alt text that describes what the image actually shows (for accessibility and for search understanding) correlates with better performance. Alt text that is keyword-stuffed without accurately describing the image is treated as a negative signal.

**Correct image sizing and cropping.** Images that are correctly cropped and sized for their context (a face close-up for a portrait, a full product shot for a product page) signal editorial care that correlates with overall content quality.

## A Seven-Day Image Optimisation Action Plan {#action-plan}

<figure role="img" aria-label="Seven-day image optimization action plan overview" style="margin:32px 0">
<svg viewBox="0 0 660 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>.px{animation:pi .5s ease-out both}.px:nth-child(1){animation-delay:0s}.px:nth-child(2){animation-delay:.2s}.px:nth-child(3){animation-delay:.4s}@keyframes pi{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}.pn{font:700 13px system-ui,sans-serif;fill:#db5a42}.pt{font:500 11px system-ui,sans-serif;fill:#374151}</style>
  <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L0,6L8,3z" fill="#d1d5db"/></marker></defs>
  <g class="px"><rect x="10" y="15" width="175" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="97" y="46" text-anchor="middle" class="pn">① Audit &amp; Fix CLS</text><text x="97" y="66" text-anchor="middle" class="pt">Days 1–2</text></g>
  <line x1="188" y1="50" x2="238" y2="50" stroke="#d1d5db" stroke-width="2" marker-end="url(#ar)"/>
  <g class="px"><rect x="243" y="15" width="175" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="330" y="46" text-anchor="middle" class="pn">② Fix LCP &amp; Compress</text><text x="330" y="66" text-anchor="middle" class="pt">Days 3–4</text></g>
  <line x1="421" y1="50" x2="471" y2="50" stroke="#d1d5db" stroke-width="2" marker-end="url(#ar)"/>
  <g class="px"><rect x="476" y="15" width="175" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="563" y="46" text-anchor="middle" class="pn">③ INP, Alt Text &amp; Monitor</text><text x="563" y="66" text-anchor="middle" class="pt">Days 5–7</text></g>
</svg>
</figure>

If you want to make meaningful improvements during the March 2026 Core Update rollout, here is a prioritised action plan that can be completed in one week.

**Day 1: Audit and measure**
- Run Lighthouse on your five highest-traffic pages
- Note LCP element, LCP time, CLS score, and INP score
- Run PageSpeed Insights on the same pages and save the CrUX data
- Identify images causing CLS (missing width/height attributes)
- Identify the LCP image on each page

**Day 2: Fix CLS**
- Add `width` and `height` attributes to all images missing them on high-traffic pages
- Add `aspect-ratio` CSS to any containers using CSS background images
- Verify CLS improvements in Chrome DevTools Performance tab

**Day 3: Fix LCP image delivery**
- Identify if LCP images are being served in JPEG/PNG rather than WebP/AVIF
- Convert top LCP images to WebP using a batch conversion tool
- Implement `<picture>` elements with WebP and JPEG fallback for LCP images
- Add `fetchpriority="high"` and preload links for LCP images

**Day 4: Compress and resize images site-wide**
- Run a bulk compression and resize pass on all images in your image library
- Target: hero images under 150KB WebP, article images under 80KB WebP, thumbnails under 40KB WebP
- Ensure images are served at display size (not 2x larger than needed)

**Day 5: Fix INP-related image issues**
- Add `decoding="async"` to all non-LCP images
- Review any carousels, modals, or dynamic image loading for INP problems
- Implement CDN caching for all images if not already in place

**Day 6: Improve alt text and image relevance**
- Review alt text on all images on high-traffic pages
- Replace generic or keyword-stuffed alt text with accurate descriptions
- Consider replacing highly generic stock images with original or more specific imagery

**Day 7: Verify and monitor**
- Re-run Lighthouse on all five high-traffic pages
- Compare before and after scores
- Set up monitoring (Google Search Console Core Web Vitals report, third-party monitoring) to track CrUX improvements over the coming weeks

Note that CrUX data updates monthly, so you will not see the impact of your changes in the Core Web Vitals report for 28 days. But the underlying improvements will be experienced by real users from day one, and the data that feeds the next month's CrUX report will reflect your improvements.

## What Not to Do During a Core Update Rollout {#what-not-to-do}

A few common mistakes to avoid during the March 2026 update rollout:

**Do not make major content changes while the update is rolling out.** Core updates are not algorithmic changes that respond immediately to changes you make; they are periodic reassessments. Making major changes while an update is rolling out can make it difficult to understand what caused your ranking changes.

**Do not add or remove pages aggressively.** Major structural changes to your site (deleting sections, redirecting URLs at scale, adding large amounts of new content) during an update rollout confuse the picture and make recovery or understanding harder.

**Do not panic-compress your images so aggressively that quality suffers.** Heavy-handed compression that visibly degrades your images may technically improve a file size metric while worsening the content quality signals discussed above. The goal is appropriate compression, not maximum compression.

**Do not ignore mobile.** Run your audits on mobile emulation in Chrome DevTools, not just desktop. Core Web Vitals data in CrUX is collected from real users, and the majority of those users are on mobile devices. A site that looks fast on desktop but performs poorly on mid-range Android will have poor CrUX data even if your desktop Lighthouse score is excellent.

The March 2026 Core Update, like all core updates, will take weeks to fully roll out and additional weeks for winners and losers to stabilise. The sites that make genuine, user-experience-focused improvements, including the image optimisation work outlined above, will be best positioned not just for this update but for every core update going forward. Google's trajectory is clear: user experience, measured through real signals from real users, is the quality standard, and images are at the centre of that experience on almost every type of website.

*Optimage helps you compress and convert images for Core Web Vitals performance gains, with batch processing and WebP/AVIF output. [Try it free.](/)*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does image optimization help with Google's March 2026 Core Update?",
      "acceptedAnswer": { "@type": "Answer", "text": "Image optimization directly improves all three Core Web Vitals metrics: LCP (the largest image loads faster), CLS (images with declared dimensions prevent layout shifts), and INP (smaller images decode faster during interactions). Early data from the March 2026 update shows a strong correlation between Good Core Web Vitals scores and ranking gains." }
    },
    {
      "@type": "Question",
      "name": "What are the target file sizes for images after Core Web Vitals optimization?",
      "acceptedAnswer": { "@type": "Answer", "text": "Target hero images under 150KB in WebP, article images under 80KB WebP, and thumbnails under 40KB WebP. These sizes ensure images load within the 2.5-second LCP Good threshold for most users on mobile connections, without sacrificing visual quality at normal display sizes." }
    },
    {
      "@type": "Question",
      "name": "How long does it take for image optimization improvements to appear in Google Search Console?",
      "acceptedAnswer": { "@type": "Answer", "text": "CrUX data updates monthly, so improvements you make today will take approximately 28 days to appear in the Core Web Vitals report in Google Search Console. However, real users experience the improvements from day one, and the underlying data collection begins immediately after you deploy your changes." }
    },
    {
      "@type": "Question",
      "name": "Should I use WebP or AVIF for images to improve Core Web Vitals?",
      "acceptedAnswer": { "@type": "Answer", "text": "Both WebP and AVIF outperform JPEG by 25–40% at equivalent visual quality. WebP has broader support and is the safer default. AVIF produces smaller files for photographic content and handles saturated colors better, making it worth implementing via a picture element with WebP as fallback for browsers that do not yet support AVIF." }
    }
  ]
}
</script>
