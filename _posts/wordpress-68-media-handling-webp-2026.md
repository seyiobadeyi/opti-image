---
title: "WordPress 6.8 and the New Media Handling: What Every Site Owner Needs to Know"
description: "WordPress 6.8, expected in April 2026, brings significant changes to media handling, WebP generation, AVIF support, and image upload workflows. Here is what is changing and how to prepare your site now."
date: "2026-03-13"
author: "Optimage Team"
tags: ["WordPress", "WebP", "AVIF", "media library", "CMS", "image optimization"]
category: "CMS & WordPress"
featured: false
---

WordPress powers over 40 percent of the websites on the internet, which means changes to how it handles images are not niche technical news: they affect an enormous slice of the web's performance. WordPress 6.8, currently in beta testing ahead of its expected April 2026 release, includes the most significant changes to media handling in the platform's history.

The core team has been working toward better image format support for several years. WordPress 5.8 added WebP upload support. WordPress 6.1 added generation of WebP versions for uploaded JPEGs on sites with GD or Imagick support. WordPress 6.4 and 6.5 brought performance improvements to the media handling pipeline. But 6.8 goes further: it addresses AVIF support, reworks the thumbnail generation system, and adds new performance defaults that site owners will want to understand before upgrading.

This article covers what is changing in WordPress 6.8's media handling, what you should do before and after upgrading, and how to ensure your images are optimised for the modern web regardless of your WordPress version.

## Table of Contents
- [What Is Changing in WordPress 6.8 Media Handling](#whats-changing)
- [AVIF Support in WordPress 6.8](#avif-support)
- [The WebP Generation Changes](#webp-changes)
- [New Thumbnail Subsizes and Responsive Image Improvements](#thumbnails)
- [The Performance Mode Default Change](#performance-mode)
- [Plugin Compatibility Considerations](#plugin-compatibility)
- [How to Prepare Before Upgrading to 6.8](#before-upgrading)
- [Post-Upgrade Image Optimisation Steps](#post-upgrade)
- [Should You Use WordPress Built-In Optimisation or External Tools?](#builtin-vs-external)

## What Is Changing in WordPress 6.8 Media Handling {#whats-changing}

The key changes to media handling in WordPress 6.8, based on beta release notes and accepted tickets in the WordPress Trac issue tracker:

**AVIF upload and generation support.** WordPress 6.8 adds native support for AVIF images in the media library on PHP installations with adequate GD or Imagick library versions. AVIF files can be uploaded directly, and AVIF versions of uploaded JPEGs and PNGs can be generated automatically (where server support exists).

**Improved WebP generation performance.** The existing WebP generation feature (introduced in 6.1) had performance issues: on sites with many image subsizes, generating WebP versions of every uploaded image at every subsize created significant server load. WordPress 6.8 introduces a smarter approach that generates WebP versions progressively and with better caching of the generation results.

**Revised image subsize system.** WordPress has historically generated many fixed-size thumbnail crops for every uploaded image (thumbnail, medium, medium_large, large, full, plus any custom sizes registered by themes and plugins). In 6.8, the default subsize set is reviewed, some rarely-used default sizes are removed, and the system for generating responsive image `srcset` data is improved.

**Lazy loading improvements.** WordPress has added `loading="lazy"` to images programmatically since version 5.5. In 6.8, the logic for determining which images should be eager vs lazy is improved, with better detection of likely-above-the-fold content.

**Image quality settings for new formats.** WordPress 6.8 adds separate quality settings for WebP and AVIF generation (previously, the JPEG quality setting was used for all formats). The default WebP quality is 82 and the default AVIF quality is 65, both of which are reasonable starting points.

**Large Image Threshold changes.** WordPress has a setting that downscales uploaded images above a certain pixel dimension (the "big image size threshold"). In 6.8, the default threshold is adjusted and the logic for when to apply it is made more consistent.

## AVIF Support in WordPress 6.8 {#avif-support}

AVIF support in WordPress 6.8 is conditional on server capabilities, which is an important caveat.

**Server requirements for AVIF support:**
- PHP 8.1 or later
- GD library compiled with AVIF support (requires libavif and libaom at compile time), OR
- Imagick with AVIF support (requires ImageMagick 7.0.25 or later compiled with AVIF)

The reality is that AVIF support in the PHP ecosystem is still uneven. Managed WordPress hosts like WP Engine, Kinsta, and Flywheel have been adding AVIF support to their server stacks through 2025, but shared hosting providers vary widely. Before expecting AVIF generation to work after the 6.8 upgrade, check with your host whether their PHP/GD/Imagick configuration supports AVIF.

You can check your server's AVIF support programmatically:
```php
// Check if GD supports AVIF
$gd_info = gd_info();
var_dump($gd_info['AVIF Support']); // should be true

// Check if Imagick supports AVIF
$imagick = new Imagick();
var_dump(in_array('AVIF', $imagick->queryFormats())); // should be true
```

Or in the WordPress admin, under Media Settings after upgrading to 6.8, a new "Supported image formats" display will show whether AVIF generation is available on your installation.

When AVIF is supported, WordPress 6.8 will:
1. Accept AVIF file uploads in the media library
2. Optionally generate AVIF versions of uploaded JPEGs and PNGs (configurable via a setting or filter)
3. Include AVIF sources in `<picture>` elements generated by `wp_get_attachment_image()` when using the Interactivity API image component

The AVIF generation feature is opt-in by default (not enabled automatically), accessible through a new setting in Media > Media Handling Settings.

## The WebP Generation Changes {#webp-changes}

WebP generation, which was introduced in WordPress 6.1, has had adoption problems in 6.1 through 6.7 due to a specific issue: it generates WebP versions of every uploaded image at every registered subsize, which on large media libraries can be extremely slow and storage-intensive.

A site with 5000 uploaded images and 10 registered image subsizes (which is common with a heavy theme and several plugins) would need to generate 50,000 WebP files. The regeneration process to apply WebP generation to existing media can take hours on shared hosting.

WordPress 6.8 addresses this with several changes:

**Progressive generation.** WebP files are generated on-demand when first requested, not immediately on upload. This spreads the generation work across time and only generates the WebP sizes that are actually used by the site.

**Smarter subsize selection.** The system now analyses which image subsizes are actually referenced in `srcset` attributes on the site and prioritises WebP generation for those sizes, rather than generating all subsizes regardless of whether they are used.

**Configurable storage policy.** A new `wp_image_webp_storage_policy` filter allows developers to configure whether WebP versions are stored alongside JPEGs on disk (the current approach) or generated on-the-fly and cached (a new option for environments where storage is a concern).

**Quality settings.** The WebP quality default changes from inheriting the JPEG quality (which defaulted to 82) to a separate explicit setting, also defaulting to 82. This can be customised via the `wp_editor_set_quality` filter or the new Media settings UI.

For sites that have already set up WebP generation through a plugin (the most common approach before WordPress's built-in support matured), the 6.8 update may create some duplication. After upgrading, review whether you need both the plugin-based WebP generation and WordPress's built-in approach. Running both can generate duplicate files and potentially serve conflicting results.

## New Thumbnail Subsizes and Responsive Image Improvements {#thumbnails}

WordPress's default image subsizes have been largely unchanged for years:
- `thumbnail`: 150x150 (hard crop)
- `medium`: 300x300 (max dimensions)
- `medium_large`: 768px wide
- `large`: 1024x1024 (max dimensions)
- `1536x1536`: added in WordPress 5.3
- `2048x2048`: added in WordPress 5.3

WordPress 6.8 makes changes to these defaults:

The `1536x1536` and `2048x2048` sizes are reviewed, with 2048x2048 becoming optional (not generated by default on new installations, since few themes use this size and it adds storage and processing overhead).

A new `medium_large_portrait` subsize at 576x768 is added for portrait images, addressing the responsive image gap for portrait-orientation content displayed on mobile in portrait orientation.

The `srcset` generation logic is improved to better select which registered sizes to include, filtering out sizes that would be served in contexts where a smaller or larger size would be more appropriate.

For developers who have relied on specific subsize names in their code, review your theme and custom code after the 6.8 upgrade to ensure you are not referencing subsizes that have changed or been removed.

## The Performance Mode Default Change {#performance-mode}

One of the most impactful changes in WordPress 6.8 for existing sites is a change to the default behaviour of the `WP_Image_Editor` class.

Prior to 6.8, the `image_editor_output_format` filter (used to redirect JPEG generation to WebP) was not applied consistently across all image generation contexts. In particular, it was not applied when generating image subsizes during the upload process on some server configurations.

WordPress 6.8 standardises the application of this filter across all image generation contexts, meaning that if you have previously set up WebP generation via this filter (a common approach recommended by performance-focused developers), the WebP generation will now be more consistently applied. This is good news but also means that sites that set up the filter specifically to avoid full WebP generation (perhaps to avoid storage issues) need to review their configuration.

Additionally, WordPress 6.8 introduces a "Performance Mode" option in the Media settings that, when enabled, applies a set of recommended performance defaults:
- WebP generation enabled
- Progressive generation (on-demand rather than on-upload)
- Responsive image `fetchpriority="high"` on the first image in post content
- `loading="lazy"` on all images in post content after the first

These defaults align WordPress's behaviour with modern web performance best practices and with what plugins like Jetpack, WP Rocket, and Perfmatters have been implementing for years. For new WordPress installations, enabling Performance Mode after installing 6.8 is recommended.

## Plugin Compatibility Considerations {#plugin-compatibility}

Any time WordPress makes significant changes to media handling, plugin compatibility becomes a concern. The plugins most likely to be affected by WordPress 6.8's changes:

**Image optimisation plugins (Smush, ShortPixel, Imagify, Optimole, EWWW Image Optimizer):** These plugins intercept image uploads and apply their own compression and format conversion. With WordPress 6.8 adding its own AVIF and WebP generation, there is potential for conflict: both WordPress and the plugin may attempt to generate format-converted images, potentially overwriting each other's output or generating duplicate files. Most major plugins have committed to WordPress 6.8 compatibility updates. Check your plugin's changelog after upgrading.

**Page builder plugins (Elementor, Divi, Beaver Builder, WPBakery):** These plugins often have their own image rendering and `srcset` generation logic. The changes to WordPress's default subsizes and `srcset` generation may produce unexpected results in builder-rendered pages. Test page builder pages thoroughly after upgrading.

**WooCommerce:** WooCommerce has its own product image regeneration system and thumbnail generation. The 6.8 changes to default subsizes should not break WooCommerce product images, but run WooCommerce's thumbnail regeneration after upgrading to ensure consistency.

**Lazy loading plugins:** Since WordPress 6.8 improves its built-in lazy loading logic, you may find that third-party lazy loading plugins become redundant or conflict with the improved core behaviour. Review your lazy loading plugin after upgrading.

## How to Prepare Before Upgrading to 6.8 {#before-upgrading}

Before upgrading your production site to WordPress 6.8, take these steps:

**1. Back up your media library.** A full backup of your `wp-content/uploads` directory before any WordPress upgrade that changes media handling is essential. If WebP or AVIF file generation goes wrong, you need to be able to restore the original files.

**2. Check plugin compatibility.** Review the changelogs of your image optimisation and page builder plugins for WordPress 6.8 compatibility announcements. If your plugins have not announced compatibility, test on a staging site first.

**3. Audit your registered image subsizes.** Run a query on your staging site to see all registered image subsizes:
```php
print_r(wp_get_registered_image_subsizes());
```
Note which sizes you depend on, so you can identify if any are removed or changed by 6.8.

**4. Test on staging first.** WordPress.com users and managed hosting providers (Kinsta, WP Engine, etc.) are typically updated automatically with adequate testing before production release. Self-hosted sites should test 6.8 on a staging environment that mirrors production for at least two weeks before upgrading production.

**5. Check server AVIF capability.** Run the PHP checks mentioned in the AVIF support section to understand whether your server will support the new AVIF features.

## Post-Upgrade Image Optimisation Steps {#post-upgrade}

After upgrading to WordPress 6.8, take these optimisation steps:

**1. Enable Performance Mode (if appropriate for your setup).** In Media > Media Handling Settings, review the Performance Mode options. Enable WebP generation and progressive generation if your server supports them and you do not have a plugin already handling this.

**2. Regenerate thumbnails.** Use the "Regenerate Thumbnails" plugin (or WP-CLI) to regenerate thumbnails for your existing media library with the new settings applied. This ensures consistency between old and new uploads.

**3. Verify WebP delivery.** After enabling WebP generation, test in Chrome DevTools (Network tab) that images are being served as WebP (Content-Type: image/webp) rather than JPEG. If you are using a CDN in front of WordPress, ensure the CDN is not caching old JPEG responses and blocking the new WebP delivery.

**4. Evaluate your image optimisation plugins.** After upgrading, assess whether your existing image optimisation plugins are still necessary or whether WordPress's built-in capabilities now cover your needs. Running redundant optimisation systems adds server overhead.

**5. Run a Lighthouse audit.** After the upgrade and configuration, run Lighthouse on your key pages to verify that performance metrics have improved (or at minimum have not regressed).

## Should You Use WordPress Built-In Optimisation or External Tools? {#builtin-vs-external}

With WordPress 6.8 bringing more built-in image optimisation capabilities, a natural question is whether you still need external image optimisation tools and plugins.

**The case for WordPress's built-in approach:**
- No additional plugin to maintain or pay for
- Tightly integrated with the WordPress media library and upload workflow
- Improves with each WordPress update without requiring plugin updates
- No external service dependency

**The case for external tools and plugins:**
- More aggressive compression and quality optimisation than WordPress's GD/Imagick-based generation
- Features like next-gen format delivery to appropriate browsers (using Accept header negotiation) that WordPress's static `<picture>` approach does not match
- Off-server processing that does not consume your hosting resources
- More sophisticated quality optimisation (perceptual quality models vs fixed quality percentages)
- Batch processing and library management for existing uploads

**The honest answer:** For small sites with modest performance requirements, WordPress 6.8's built-in capabilities are significantly improved and may be sufficient. For high-traffic sites, e-commerce stores, or sites where image performance is a competitive advantage, external tools provide meaningful additional benefits.

A reasonable hybrid approach for most sites:
1. Let WordPress handle WebP generation for standard post and page images
2. Use external compression tools (like Optimage) for images you need to be very carefully optimised (hero images, product photos, above-the-fold content)
3. Use a CDN with AVIF support for delivery-layer format negotiation, which handles the browser compatibility layer transparently

WordPress 6.8 is a significant step forward for image handling in the most widely-used CMS in the world. The improvements to WebP generation, the introduction of AVIF support, and the new performance defaults reflect the WordPress project's commitment to making the web faster. Site owners who prepare for the upgrade carefully, test thoroughly on staging, and take advantage of the new capabilities after upgrading will see meaningful performance improvements, better Core Web Vitals scores, and a simpler image management workflow.

*Optimage helps WordPress site owners compress and convert images before upload, ensuring your media library starts with the best possible source files. [Try it free.](/)*
