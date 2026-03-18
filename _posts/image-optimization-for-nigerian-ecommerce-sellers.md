---
title: "The Nigerian E-Commerce Seller's Guide to Image Optimization: More Sales, Faster Pages"
date: "2026-03-11T09:00:00Z"
excerpt: "Whether you sell on Jumia, Konga, Jiji, or your own website, your product photos are silently costing you sales. Here is how Nigerian online sellers can fix that in under 30 minutes."
---

## The Photo Problem Most Nigerian Sellers Do Not See

![Nigerian e-commerce product photography and optimization](/image-10.png)

You spent money on a photographer. You got clean shots of your products. You uploaded everything and your listings look fine on your phone. So why are customers abandoning their carts before they even reach checkout?

The answer is almost always the same: your product images are too heavy, and Nigerian mobile networks are not forgiving of heavy images.

A typical product photo taken on a modern smartphone is between 3 and 8 MB. An average product listing page loads 8 to 12 photos. That is between 24 MB and 96 MB of image data per page, downloaded over an MTN or Airtel connection before a customer can even decide if they want to buy.

At average Nigerian mobile speeds, 60 MB of images takes between 20 and 40 seconds to fully load. By then, your potential customer has already left.

## What the Research Actually Shows

Google's 2024 Commerce Insights report found that for every additional second of load time on mobile, conversion rates drop by an average of 12% for e-commerce sites. On Jiji and similar classified platforms in West Africa, listings with faster-loading images receive significantly more inquiries than slower ones, all other factors equal.

The practical translation: if your product page takes 8 seconds to load on a typical Nigerian mobile connection versus a competitor's 2-second page, you are giving away conversions.

## Platform-Specific Recommendations

### Selling on Jumia

Jumia automatically resizes and serves product images through their CDN, but they still accept your original uploads. If you upload 6 MB JPEG files, Jumia compresses them on their end, but the quality of that automatic compression is aggressive and sometimes introduces artifacts, particularly around text on labels and product packaging.

The better approach: upload pre-compressed WebP files at exactly 1200x1200 pixels (Jumia's recommended product image size). At WebP quality 82, a typical product photo goes from 4.2 MB to 380 KB while remaining visually identical at listing-view scale.

When you control the compression, you control the output quality. When Jumia's auto-compressor handles it, you get whatever their algorithm decides.

### Selling on Konga

Konga accepts JPEG and PNG. Their image size limit is 1024x1024 for most product categories, with a maximum file size of 2 MB per image. If your photos exceed 2 MB, they are rejected or heavily compressed automatically.

Pre-compress to exactly 1024x1024 JPEG at quality 80 before uploading. This gives you predictable quality output and ensures Konga displays exactly what you want customers to see, not an auto-compressed version.

### Selling on Jiji

Jiji is image-limit heavy — they allow up to 10 images per listing. Their audience is primarily mobile on budget-to-mid-range Android devices. This is the most data-sensitive audience in Nigerian e-commerce.

For Jiji listings, compress images to WebP at quality 75. At this setting, product photos look sharp in the Jiji grid view and on listing pages, but the file size drops dramatically (a typical 3 MB phone photo becomes 150-200 KB).

For sellers with many listings, batch processing all images before upload takes under 5 minutes using Optimage's bulk tool.

### Running Your Own Online Store (Paystack Storefront, WooCommerce, Shopify)

If you operate your own store, image optimization is entirely in your hands. The same auto-compression safeguards from Jumia or Konga do not exist.

Standard recommendations for Nigerian store owners:
- Use WebP as your primary format (supported by all modern browsers, including Chrome, Firefox, and Safari on iPhones from 2020 onward)
- Compress product images to quality 78-82 for photos, quality 90 for product shots with text on packaging
- Keep product images at 800x800 to 1200x1200 pixels maximum (anything larger is wasted download for mobile users)
- Use lazy loading so only images in the visible viewport download immediately (Next.js and WooCommerce both support this natively)

## The Categories Where This Matters Most

**Fashion and Clothing**
Fabric textures require higher quality to show detail, but background is largely irrelevant. Crop tightly to the product, shoot on a plain background, and compress to WebP quality 82. A typical fashion photo goes from 4 MB to under 350 KB with no visible difference in product detail.

**Electronics**
Buyers need to see ports, buttons, screens clearly. Use quality 85 for WebP and make sure your source photos are sharp (blurry photos do not improve with lower compression). Accessories listings can go to quality 78 safely.

**Food and Restaurants**
Food photography relies on color accuracy and texture. Use WebP quality 85 minimum. At lower settings, food colors shift and dishes look unappetising. The extra file size is worth the conversion rate for food businesses.

**Real Estate**
Property photos are typically large-format horizontal images. Compress to WebP quality 80. A typical listing with 15 room photos goes from 45 MB to under 3.5 MB total, dramatically improving page speed for property seekers browsing on Airtel and MTN.

## A Simple 10-Step Workflow for Nigerian Sellers

1. Take or receive product photos at full quality from your photographer
2. Open Optimage (optimage.dreamintrepid.com, free to use)
3. Upload all photos for a single product as a batch
4. Select WebP output format
5. Set quality to 80 (adjust up to 85 for food or detailed items)
6. Process and download
7. Review the compressed versions on your phone (not just your computer) before uploading to your store
8. Upload the optimized files to Jumia, Konga, Jiji, or your own store
9. Check page load time on the product listing using Chrome's mobile emulation
10. Repeat for each product category

The entire process for 30 product photos takes 8-12 minutes using bulk upload.

## The Competitive Edge This Creates

Most Nigerian online sellers never think about image optimization. They upload phone photos directly, accept whatever the platform does with them, and wonder why their listings get less traction than competitors whose stores somehow load faster.

The sellers who optimize their images consistently report:
- More inquiries per listing on classified platforms (faster loading increases impressions)
- Better ranking in Jumia and Konga search results (both platforms factor page performance in search ranking)
- Lower bounce rates on standalone stores (customers stay and browse longer when pages load fast)
- Higher trust signals from customers (a fast, professional-looking store reads as legitimate and trustworthy)

The tools to do this are free. The process takes minutes. The impact on conversion is measurable.

Start with your top 5 products. Compress their images, upload the optimized versions, and compare traffic and inquiry rates over the next two weeks. The data will tell you everything you need to know.

---

**Related reading:**
- [Why Website Speed Matters Twice as Much in Nigeria](/blog/website-speed-nigeria-africa-why-it-matters-more) — the network and device context behind these numbers
- [AVIF vs WebP vs JPEG: The 2026 Benchmark](/blog/avif-vs-webp-vs-jpeg-2026-benchmark) — which format to use for which product category
- [Social Media Image Sizes for Every Platform in 2026](/blog/social-media-image-size-guide-all-platforms-2026) — once your products are optimized, make sure they are sized correctly for Instagram, Facebook, and WhatsApp
