---
title: "Google March 2026 Core Update: Why Image Optimization Is Your Fastest Win"
description: "Google's March 2026 Core Update is rolling out now. Early data shows that image-optimised sites are recovering faster and seeing the biggest gains. Here is what the update targets and what you should fix today."
date: "2026-02-19"
author: "Optimage Team"
tags: ["Google core update", "SEO", "image optimization", "Core Web Vitals", "search ranking"]
category: "SEO & Performance"
featured: true
---

Google core updates are notoriously difficult to prepare for because they target quality signals holistically rather than specific on-page factors. The March 2026 Core Update, which began rolling out in the third week of February and is expected to complete over several weeks, follows this pattern. It is not a specific algorithm penalty for a specific behaviour; it is a broad reassessment of which pages best satisfy user intent for their target queries.

What makes this update particularly interesting, based on early data from SEO monitoring tools and from the sites that have seen the largest positive movements, is the correlation between Core Web Vitals scores and ranking gains. Sites that made improvements to their Core Web Vitals metrics in 2025 are disproportionately represented among the March 2026 winners. Sites that have poor INP, LCP, or CLS scores are disproportionately represented among the losers.

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
