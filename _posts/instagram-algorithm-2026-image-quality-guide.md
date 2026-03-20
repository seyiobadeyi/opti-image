---
title: "Instagram's 2026 Algorithm Now Penalises Low-Quality Images: The Complete Guide"
description: "Instagram updated its ranking algorithm in late 2025 and early 2026 to deprioritise content with visible compression artefacts, low resolution, and recycled images. Here is what changed and exactly how to keep your content performing."
date: "2026-02-05"
author: "Optimage Team"
tags: ["Instagram", "social media", "image quality", "algorithm", "content strategy"]
category: "Social Media"
featured: false
---

Instagram's product team has been more transparent about algorithm changes in 2025 and 2026 than at any point in the platform's history, and one of the clearest signals they have communicated is that image quality directly affects content distribution. Low-resolution images, content with visible JPEG compression artefacts, and images that have been "recycled" (previously posted and shared multiple times across accounts) are all receiving reduced reach in the recommendation system, particularly in the Explore tab and Reels suggestions.

This is not a rumour or a theory from social media marketers. Instagram's engineering blog and public statements from the head of Instagram have directly addressed image quality as a ranking signal. The reasoning is straightforward: Instagram's recommendation algorithm prioritises content that users engage with positively, and research consistently shows that users engage less with visually degraded content even when they cannot consciously identify why.

This guide explains exactly what has changed, what Instagram's quality assessment looks for, and how to ensure your images and videos are optimised for maximum distribution in 2026.

## Table of Contents
- [What Instagram Changed and When](#what-changed)
- [How Instagram Assesses Image Quality](#quality-assessment)
- [The Recycled Content Problem](#recycled-content)
- [JPEG Artefacts and Why They Matter More Now](#jpeg-artefacts)
- [Optimal Image Specifications for 2026](#optimal-specs)
- [The Reels Thumbnail Problem](#reels-thumbnails)
- [Business Account Implications](#business-implications)
- [A Quality Workflow for Consistent Results](#quality-workflow)

## What Instagram Changed and When {#what-changed}

The algorithm changes that are visible in 2026 have roots in updates that began rolling out in the second half of 2025. Instagram's parent company Meta has been investing heavily in visual quality assessment as part of its broader AI content recommendation infrastructure, and the image quality signals that were previously used for spam and authenticity detection have been extended to influence organic reach for all content.

The specific changes that content creators and brands have observed, and that align with Instagram's public statements, include:

**Reduced distribution for low-resolution content.** Images under 1080x1080 pixels for square posts, or under 1080x1350 pixels for portrait posts, receive reduced distribution in the Explore tab and in algorithmic feed placement. This was not always the case; previously, Instagram's algorithm was primarily engagement-focused and a blurry image that got strong early engagement could still be widely distributed.

**Quality scoring of uploaded images.** Instagram now scores uploaded images for visual quality before deciding initial distribution. The scoring appears to evaluate sharpness, exposure, compression artefact presence, and aspect ratio correctness. Images that score poorly on these dimensions receive less initial distribution, which means they get less early engagement, which compounds the reach disadvantage.

**Watermark and logo detection.** Instagram has long reduced distribution for content with TikTok watermarks (the original motivation was reducing recycled TikTok content appearing on Reels). In 2026, this detection has been extended to recognise watermarks from other platforms and heavy logo overlays that cover significant portions of the image.

**Originality signals.** Images that have a high visual similarity to previously-posted content, whether your own or other accounts, receive reduced novelty scores. This affects both recycled content and heavily template-based content where the same layout appears across many posts.

## How Instagram Assesses Image Quality {#quality-assessment}

Instagram uses computer vision models that process uploaded images before distribution decisions are made. While the exact models are not public, the dimensions they evaluate are consistent with what is publicly known about visual quality assessment:

**Sharpness and blur detection.** The model identifies whether the primary subject of the image is in focus, whether there is motion blur, and whether the image appears to have been enlarged from a smaller source (digital zoom creates distinctive artefact patterns). Images that appear blurry, soft, or upscaled receive lower quality scores.

**Compression artefact detection.** JPEG compression artefacts, specifically the characteristic 8x8 pixel blocking pattern, are detectable by computer vision at levels below what a casual viewer would notice. Instagram's model appears sensitive to these artefacts in ways that correlate with the blocking patterns affecting subject clarity.

**Exposure and colour quality.** Severely underexposed, overexposed, or desaturated images receive lower quality scores. This does not penalise intentional aesthetic choices (dark moody photography, desaturated vintage looks) because the model evaluates quality within the context of the image's apparent style, but it does catch genuinely bad exposures.

**Aspect ratio correctness.** Images that are an incorrect aspect ratio for the post type (for example, a landscape image posted as a square, resulting in white bars top and bottom) are assessed as lower quality because the wasted pixels indicate the content was not prepared for Instagram specifically.

**Resolution relative to display size.** An image that is displayed at full width in the feed but has insufficient resolution to support that display size is downgraded.

The key insight is that Instagram is not just measuring whether an image is technically high-resolution: it is measuring whether the image is a good-quality piece of content that was prepared appropriately for Instagram's format. A 4K image that has been repeatedly re-exported through JPEG compression and shows visible blocking in the face of the subject will score worse than a sharp, well-compressed 1080x1350 image.

## The Recycled Content Problem {#recycled-content}

Content recycling has always been a challenge for Instagram's recommendation system, and the 2025-2026 updates have made the platform significantly more aggressive at identifying and deprioritising it.

What counts as recycled content, from Instagram's perspective:

**Re-posted content from the same account.** If you post the same image twice (common practice for "best of" reshares), the second post is identified as a duplicate and receives substantially less distribution than the first. This was always true but the detection threshold has tightened: minor crops or colour adjustments no longer reliably disguise duplicate posts.

**Cross-platform reposts with watermarks.** As mentioned, TikTok watermarks are actively penalised. This extends to any visible platform watermark or badge that identifies the content as originating elsewhere.

**Widely shared stock images.** If you use a stock image from a provider that licenses the same image to many users, and that image appears frequently across Instagram, it receives a low originality score. This is particularly relevant for businesses using generic stock photography in their posts.

**Template-heavy content with low variation.** Brand accounts that use the same Canva template for every post, with only the text changed, have reported reduced reach in 2026 compared with equivalent content that shows more visual variation.

The practical advice here is to ensure your images are genuinely original and optimised for Instagram, not repurposed from other platforms or other formats. If you are a content creator with a multi-platform strategy, create platform-specific versions of your images rather than uploading the same file everywhere.

## JPEG Artefacts and Why They Matter More Now {#jpeg-artefacts}

JPEG artefacts are worth discussing specifically because they are the most common image quality problem on Instagram, and they arise from a specific workflow mistake that is easy to avoid once you understand it.

The workflow mistake is this: many creators and brands design their Instagram posts in tools like Canva, Adobe Express, or Figma, export them as JPEG, and then upload the JPEG to Instagram. Instagram then re-encodes the uploaded JPEG using its own compression pipeline. This means the final image has been through two rounds of JPEG compression: the export from the design tool, and Instagram's re-encoding on upload. Each round of JPEG compression removes information from the image, and the second round builds on the artefacts introduced by the first.

The result is images that look fine when opened on a computer from the exported file but look visibly degraded in the Instagram feed, particularly in areas with text overlays, in faces, and in colour transitions.

The solution is to upload at maximum quality and let Instagram's compression be the only compression pass. Here is the optimised export workflow:

1. Design in your tool of choice
2. Export as PNG (lossless, no JPEG artefacts in the source)
3. Upload the PNG to Instagram

Instagram's re-encoding of a PNG source will produce a better result than its re-encoding of a pre-compressed JPEG because the PNG gives Instagram clean data to work with. Instagram converts it to JPEG internally, but as a single compression pass rather than two.

Alternatively, export as JPEG at maximum quality (95-100) and upload that. The JPEG artefacts at this quality level are minimal, and Instagram's re-encoding of a near-lossless JPEG produces good results.

What you should never do is export as JPEG at quality 70-80 for "web use" and then upload that. The web-optimised JPEG has already been compromised, and Instagram's compression of it will produce noticeable artefacts.

## Optimal Image Specifications for 2026 {#optimal-specs}

Here are the current optimal specifications for each Instagram post type, as of early 2026:

**Square posts:**
- Resolution: 1080x1080 pixels
- Aspect ratio: 1:1
- Format for upload: PNG or JPEG at quality 95+
- Instagram's internal format: JPEG at approximately 80-85% quality after conversion
- Target file size at upload: Under 30MB (Instagram's upload limit), practically under 5MB

**Portrait posts (recommended for feed):**
- Resolution: 1080x1350 pixels
- Aspect ratio: 4:5
- Format for upload: PNG or JPEG at quality 95+
- This format takes more screen space in the feed and consistently outperforms square posts for reach

**Landscape posts:**
- Resolution: 1080x566 pixels
- Aspect ratio: 1.91:1
- Format for upload: PNG or JPEG at quality 95+
- Least recommended format as it takes less screen space

**Reels cover images:**
- Resolution: 1080x1920 pixels
- Aspect ratio: 9:16
- Format for upload: JPEG at quality 95+ (PNG is supported but JPEG processes faster)
- Custom cover images uploaded separately should be at this resolution

**Stories:**
- Resolution: 1080x1920 pixels
- Aspect ratio: 9:16
- Format for upload: JPEG at quality 95+

**Carousel posts:**
- Resolution: 1080x1080 (square) or 1080x1350 (portrait) per slide
- All slides must be the same aspect ratio
- Format for upload: PNG or JPEG at quality 95+ per slide
- Instagram allows up to 20 slides per carousel in 2026

## The Reels Thumbnail Problem {#reels-thumbnails}

Reels cover thumbnails deserve specific attention because they are often the weakest link in a creator's Instagram quality strategy, and because they are what appears in the grid view of a profile, in Explore, and in Reels discovery, making them critical to click-through rates.

The problem is that many creators either use an automatically selected video frame as their cover (which is convenient but often not the most compelling frame) or upload a custom cover image that was not prepared at the correct resolution.

If you are using a custom cover image for Reels:

1. Create the image at exactly 1080x1920 pixels
2. Export as JPEG at quality 95 or PNG
3. Upload separately from the video (in Creator Studio or through the cover selection step in the Reels upload flow)
4. Check the result in the profile grid view on a phone before the post goes live

The grid view on a profile displays Reels thumbnails at approximately 293x293 pixels (on a 375px wide phone screen), which means only the centre square of your 1080x1920 cover is visible in the grid. Design your cover image with the key visual content in the centre square, and check it at small size before publishing.

## Business Account Implications {#business-implications}

For business accounts, the image quality algorithm changes have specific implications that organic creator accounts do not face.

**Ad creative quality.** Meta's ad system already uses image quality signals to determine ad auction prices and delivery. Low-quality ad creatives receive lower engagement rate predictions, which means they cost more per result in the auction. In 2026, the same quality signals affect organic posts from business accounts, creating consistency between how paid and organic content is assessed.

**Product catalogue images.** For e-commerce businesses using Instagram Shopping and product tags, product catalogue images are assessed separately from feed post quality. If your product catalogue contains low-resolution or poorly compressed images, those products may receive reduced visibility in Shopping discovery features. Review your product catalogue images against the same quality standards as your feed content.

**UGC resharing.** Many brands reshare user-generated content (customer photos with their products) as part of their Instagram strategy. These images are often taken on phones, in varying lighting, with varying compression. Reshared UGC is subject to the same quality assessment as owned content, so before resharing a customer photo, consider basic quality improvements: brighten if underexposed, remove excessive noise, ensure the image is appropriately cropped for Instagram's format.

## A Quality Workflow for Consistent Results {#quality-workflow}

Here is a complete workflow for ensuring consistent image quality across all Instagram content.

**For designed content (branded posts, promotional graphics):**
1. Design at 1080x1350px (portrait) for feed posts
2. Export as PNG at 1080x1350px
3. Review the exported PNG at 100% zoom for any artefacts or blurriness before uploading
4. Upload the PNG directly (not a JPEG derived from the PNG)

**For photography:**
1. Start from the highest-quality version of the photo (RAW or JPEG at camera-native quality)
2. Edit in Lightroom, Photoshop, or equivalent
3. Export as JPEG at quality 90-95 at the target resolution (1080px on the short side for Instagram)
4. Upload the high-quality JPEG directly

**For Reels:**
1. Edit video at 1080x1920, export at maximum quality
2. Create a custom cover image at 1080x1920 as a separate file (PNG or JPEG quality 95+)
3. Upload video first, then add custom cover during the upload flow
4. Check the cover in profile grid view before publishing

**For Stories:**
1. Create at 1080x1920
2. Export as JPEG quality 90+
3. Upload within 24 hours of creation for freshness scoring

**For all uploads:**
- Do not add Instagram-specific compression before uploading (let Instagram compress from your high-quality source)
- Remove watermarks from other platforms
- Check aspect ratio correctness before uploading
- Use original photos and graphics, not recycled content from previous posts

Instagram's emphasis on image quality in 2026 is not a punishment for creators: it is an alignment of platform incentives with what users actually want to see. High-quality, original, well-formatted content has always performed better on Instagram when all else is equal. The algorithm changes simply make the quality advantage more consistent and more measurable.

The creators who are thriving in 2026 on Instagram are those who treat every post as a deliberate quality decision, not an afterthought, and who have workflows that make high-quality output the default rather than the exception.

*Optimage helps you batch-compress and convert images to web-optimal formats, so your social media content is always at the right size and quality. [Get started free.](/)*
