---
title: "How to Optimize Images for Every Social Media Platform in 2026: The Complete Cheat Sheet"
date: "2026-03-14T20:30:00Z"
excerpt: "Every major platform has different dimension requirements, compression behavior, and format preferences. Get it wrong and your images get re-compressed into blurry messes. Get it right and your content looks crisp everywhere."
---

## Why Your Social Media Images Look Terrible

You took a sharp, well-composed photo. You uploaded it. It came back blurry, with crushed shadows, and that telltale JPEG artifact ring around every high-contrast edge.

This is not a coincidence. Every major social media platform runs your image through its own compression pipeline the moment you upload it. Each platform has different target file size budgets, different dimension constraints, and different codec preferences. If you hand them a 4MB PNG with the wrong aspect ratio, they will resize and re-compress it aggressively. Every generation of re-compression multiplies artifact damage.

The solution is to pre-optimize your images to exactly what each platform expects before uploading. When you give the platform an already-optimized file at their preferred dimensions, the re-compression is either skipped entirely or done at such a high quality setting it is invisible.

## Instagram

Instagram applies JPEG compression to all images, even if you upload a PNG. The platform targets roughly 80KB-200KB per image depending on dimensions.

**Feed posts (square and portrait):**
- Dimensions: 1080 x 1080px (1:1) or 1080 x 1350px (4:5)
- Format to upload: JPEG at 80 quality
- Profile images: 320 x 320px (displayed at 110px, but stored at 320px)

**Landscape posts:**
- 1080 x 566px (1.91:1)
- Anything wider gets cropped or pillarboxed

**Stories and Reels:**
- 1080 x 1920px (9:16)
- Keep text and key elements in the center 1080 x 1420px safe zone (top and bottom get cut on some devices)

**Key insight:** Instagram's compression is most aggressive on images with fine text, subtle gradients, and noise. If you are posting screenshots or infographics, convert them to JPEG at quality 90+ rather than the standard 80.

## Twitter / X

X (formerly Twitter) uses a tiered compression system. Images uploaded through the app or API are converted to WebP on modern browsers, JPEG as fallback.

**In-feed images:**
- Single image: 1600 x 900px (16:9 displayed)
- Aspect ratio must be between 2:1 and 1:3 or the platform crops
- Maximum file size: 5MB for standard accounts

**Profile photo:** 400 x 400px
**Header image:** 1500 x 500px

**Key insight:** X's compression quality is noticeably worse than Instagram for images with solid flat colors and geometric shapes (like brand graphics). For these, always upload at exactly the target resolution with no upscaling. Upscaling before upload gives the platform's downscaling algorithm more information to work with.

## LinkedIn

LinkedIn applies lighter compression than most platforms, which means your images survive relatively intact. But the dimension requirements are strict and violations result in aggressive center-cropping.

**Post images:**
- Single image: 1200 x 627px (1.91:1) is optimal
- Square: 1200 x 1200px also works well
- LinkedIn's feed preview crops to 1.91:1 by default

**Company page cover:** 1128 x 191px
**Personal banner:** 1584 x 396px
**Article cover image:** 1200 x 644px

**Key insight:** LinkedIn is the one major platform where uploading a high-quality PNG actually has a benefit for graphics with text and flat colors. Their PNG compression is gentler. Use JPEG for photography.

## TikTok

TikTok's image posts (photo carousels) are a newer feature. The platform applies heavy WebP compression to all images.

**Photo carousel:**
- 1080 x 1920px (9:16) preferred
- Square 1080 x 1080px also supported
- Minimum: 360 x 360px

**Profile photo:** 200 x 200px (appears circular)

**Key insight:** TikTok's compression is among the most aggressive on this list. Always upload your images at the maximum supported resolution even if the content is conceptually small. The headroom lets the platform's algorithm make better compression decisions.

## YouTube

YouTube images appear in three primary contexts: thumbnails, channel art, and video frames.

**Custom thumbnails:**
- 1280 x 720px (minimum 640 x 360px)
- Under 2MB
- Format: JPG or PNG
- 16:9 aspect ratio strictly

**Channel banner:** 2560 x 1440px (safe zone for all devices: center 1546 x 423px)

**Key insight:** Thumbnails are the most click-critical asset on YouTube. Compress to JPEG quality 85+ specifically. Thumbnail images that are over-compressed at low JPEG quality settings look terrible at small sizes in search results.

## Facebook

Facebook applies the most aggressive re-compression of all the major platforms for images posted to personal feeds and Pages.

**Shared link thumbnails:** 1200 x 630px
**Feed photos:** 1080 x 1350px (4:5 portrait) or 1080 x 1080px (square)
**Stories:** 1080 x 1920px
**Cover photo:** 820 x 312px (desktop) / 640 x 360px (mobile)

**Key insight:** Facebook specifically strips all EXIF and color profile metadata from uploaded images. If your image relies on an embedded ICC color profile for accurate color rendering, it will look washed out on Facebook. Convert to sRGB before uploading.

## The Universal Pre-Upload Checklist

Regardless of platform, run through this before every upload:

1. **Convert to sRGB color space.** Wide gamut color profiles (P3, AdobeRGB) are ignored by every major platform.
2. **Strip EXIF metadata.** It adds file size and reveals GPS coordinates and device information.
3. **Export at the exact target dimensions.** Do not upload a 4000px image and let the platform downscale.
4. **Use JPEG at quality 80-85 for photography.** Use PNG for graphics with text. Use WebP if the platform supports direct WebP upload.
5. **Keep animated content as MP4**, not GIF. Even a short GIF is 10-50x larger than an equivalent MP4.

## Optimize Once, Deploy Everywhere

[Optimage](/) handles all of this automatically. Upload your original high-resolution image, set your target dimensions, and download a platform-ready file in seconds. Batch process up to 50 images at once for content calendar workflows.

Subscribe to our [weekly newsletter](/) for more workflows like this, delivered to your inbox every week.

## Summary

Every platform re-compresses your images. Your goal is to give them nothing to do. When your upload already matches their preferred dimensions and is pre-compressed to a reasonable quality level, the re-compression either skips or runs at maximum quality settings. The result is images that look crisp and professional instead of soft and artifact-ridden.
