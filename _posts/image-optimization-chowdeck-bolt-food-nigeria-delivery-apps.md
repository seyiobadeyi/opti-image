---
title: "How Chowdeck and Bolt Food Vendors Should Actually Handle Menu Photos in 2026"
date: "2026-07-20T10:00:00Z"
excerpt: "Nigerian food delivery apps rank menu items by photo quality and load speed as much as by price. Here's the exact photo workflow Chowdeck and Bolt Food vendors need to stop losing orders to slow-loading images."
keyTakeaways:
  - "Menu photos over 1MB routinely fail to load fully on 3G/4G connections before a customer scrolls past — that's a lost order, not just a slow page"
  - "WebP at quality 80 cuts typical smartphone food photos by 70-85% with no visible difference at the small tile sizes delivery apps actually display"
  - "Square 1:1 crops at 1080x1080 match how both Chowdeck and Bolt Food render menu tiles — anything else gets auto-cropped unpredictably by the app"
  - "Consistent lighting and a clean background across your whole menu builds trust faster than any individual 'hero' photo"
faq:
  - question: "What image format should Nigerian food vendors use for Chowdeck and Bolt Food menus?"
    answer: "WebP at quality 78-82 is the best balance for menu photos on both platforms. It cuts a typical 4-6MB smartphone photo down to 300-600KB with no visible quality loss at the tile sizes the apps display, which matters directly on 3G/4G connections where a slow-loading photo can cost you the order before a customer even sees your price."
  - question: "What size should menu photos be for delivery apps?"
    answer: "Export at 1080x1080 pixels, square crop. Both Chowdeck and Bolt Food display menu items in a roughly square tile format, and photos that aren't already cropped to that ratio get auto-cropped by the app in ways you don't control — often cutting off the actual food."
---

![A smartphone showing a food delivery app menu grid with photo tiles of different dishes](/image-8.png)

**A menu photo over 1MB on a 3G connection in Lagos traffic often doesn't finish loading before the customer has already scrolled past it — and on Chowdeck or Bolt Food, that's a lost order, not a minor inconvenience.** Vendors obsess over the food itself and treat the photo as an afterthought, but on a platform where every restaurant's menu sits one scroll away from a dozen competitors, the photo is doing more selling than the price is.

## Why Photo Quality Is a Ranking Factor, Not Just a Nice-to-Have

Both apps surface higher-engagement listings more prominently, and engagement on a food delivery app is driven almost entirely by whether a photo makes someone stop scrolling. A blurry, dark, or slow-loading image doesn't just look bad — it actively suppresses how often your menu gets surfaced compared to a competitor with a clean, fast-loading photo of a similar dish. Vendors who treat photography as a one-time task instead of ongoing menu maintenance are quietly losing visibility every week their oldest photos sit unrefreshed.

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
    <text x="120" y="62" text-anchor="middle" class="stat-num">70-85%</text>
    <text x="120" y="82" text-anchor="middle" class="stat-lbl">Size cut from WebP at quality 80</text>
  </g>
  <g class="stat-bar">
    <rect x="250" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="350" y="62" text-anchor="middle" class="stat-num">1080²</text>
    <text x="350" y="82" text-anchor="middle" class="stat-lbl">Square crop both apps expect</text>
  </g>
  <g class="stat-bar">
    <rect x="480" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="580" y="62" text-anchor="middle" class="stat-num">1MB+</text>
    <text x="580" y="82" text-anchor="middle" class="stat-lbl">Threshold where 3G loads visibly stall</text>
  </g>
</svg>
</div>

## The Menu Photo Workflow That Actually Works

1. **Shoot in natural light near a window, or invest in one cheap ring light** — inconsistent kitchen lighting across your menu is the single most common thing that makes a menu look unprofessional, more than the plating itself.
2. **Crop to a square 1:1 ratio before uploading**, at 1080x1080 pixels. Both apps render menu tiles roughly square; uploading a landscape or portrait photo and letting the app auto-crop it means you don't control what gets cut off.
3. **Convert to WebP at quality 78-82.** This is the range where file size drops dramatically with no visible loss at the tile size these apps actually display — you're not printing a billboard, you're filling a 200x200 pixel thumbnail.
4. **Batch-process your whole menu in one pass**, not one photo at a time as you add items. Consistency across the full menu matters more than any single photo being exceptional.
5. **Re-shoot photos older than six months.** Phone cameras, lighting setups, and even your own plating style improve over time — an old, dim photo sitting next to newer ones drags down how the whole menu reads.

## What This Looks Like Side by Side

| | Unoptimized phone photo | Optimized WebP menu photo |
|---|---|---|
| Typical file size | 4-6 MB | 300-600 KB |
| Load time on 3G | 4-8 seconds, often stalls | Under 1 second |
| Crop | Whatever the app auto-crops | Controlled, square, no cut-off food |
| Visual consistency across menu | Varies photo to photo | Uniform lighting and framing |

## The Part Most Vendors Skip

Nigerian food vendors selling on Chowdeck and Bolt Food are almost always doing their own photography on a phone between prep and service — there's no time for a proper studio workflow. That's fine; the photo doesn't need to be studio-quality. It needs to be well-lit, correctly cropped, and small enough to load before a hungry customer scrolls past. [Optimage's compress and resize tools](/compress) handle a whole menu's worth of photos in one batch, converting to WebP and cropping to the right dimensions without needing separate software or a design background.

**Related reading:**
- [Free Image Tools for Nigerian Freelancers and Designers](/blog/free-image-tools-for-nigerian-freelancers-designers) — broader toolkit for Nigerian small businesses
- [Image Optimization for Nigerian E-Commerce Sellers](/blog/image-optimization-for-nigerian-ecommerce-sellers) — the Jumia/Konga-focused version of this same problem
- [Compress Images for WhatsApp Business Nigeria](/blog/compress-images-for-whatsapp-business-nigeria) — for vendors also taking orders directly over WhatsApp

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What image format should Nigerian food vendors use for Chowdeck and Bolt Food menus?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WebP at quality 78-82 is the best balance for menu photos on both platforms. It cuts a typical 4-6MB smartphone photo down to 300-600KB with no visible quality loss at the tile sizes the apps display, which matters directly on 3G/4G connections where a slow-loading photo can cost you the order before a customer even sees your price."
      }
    },
    {
      "@type": "Question",
      "name": "What size should menu photos be for delivery apps?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Export at 1080x1080 pixels, square crop. Both Chowdeck and Bolt Food display menu items in a roughly square tile format, and photos that aren't already cropped to that ratio get auto-cropped by the app in ways you don't control — often cutting off the actual food."
      }
    }
  ]
}
</script>
