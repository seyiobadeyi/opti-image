---
title: "The TikTok Near-Ban and What It Taught Creators About File Sizes"
description: "When TikTok faced a US shutdown in January 2026, millions of creators scrambled to move content to Instagram Reels, YouTube Shorts, and RedNote. Here is what the migration revealed about video compression, thumbnail quality, and why file size strategy matters more than ever."
date: "2026-01-08"
author: "Optimage Team"
tags: ["video compression", "TikTok", "creator tools", "social media", "image optimization"]
category: "Industry News"
featured: true
---

On January 19, 2026, TikTok went dark for American users for roughly 14 hours before a partial reprieve allowed the app to come back online. Even during that brief blackout, the numbers were staggering: an estimated 170 million US users suddenly scrambled to find alternatives, and creators who had built entire businesses on the platform were forced to confront a reality they had been avoiding for months. Their content, their thumbnails, their entire visual identity, was trapped in formats and resolutions optimised for exactly one platform.

The platforms that benefited most from the migration rush were Instagram Reels, YouTube Shorts, and a Chinese-owned social app called RedNote (Xiaohongshu), which ironically saw a flood of American sign-ups in the days immediately before and after the ban took effect. What nobody talked about publicly, but every creator quickly discovered, was a deeply unglamorous problem: the files did not transfer cleanly.

This article breaks down what the TikTok migration moment revealed about video compression, image formats, thumbnail optimisation, and why understanding file sizes is no longer optional for anyone who creates content professionally.

## Table of Contents
- [What Actually Happened During the TikTok Blackout](#what-actually-happened)
- [The File Format Problem Nobody Warned You About](#file-format-problem)
- [Platform-by-Platform Compression Behaviour](#platform-compression)
- [Thumbnail Quality and Why It Collapsed on Migration](#thumbnail-quality)
- [RedNote and the Revelation of True File Sizes](#rednote-revelation)
- [What Creators Should Do Right Now](#what-creators-should-do)
- [The Broader Lesson: Own Your Assets](#own-your-assets)

## What Actually Happened During the TikTok Blackout {#what-actually-happened}

The timeline matters for understanding the scale of disruption. The US law requiring ByteDance to divest TikTok or face a ban had been upheld by the Supreme Court in early January. On the evening of January 18, TikTok began showing users a message that the app would no longer be available due to a law banning it. By midnight, downloads from the App Store and Google Play were suspended in the United States.

For creators, this was not simply an inconvenience. It was an existential moment. Accounts with millions of followers had no way to contact their audiences. Video archives that existed only inside the TikTok ecosystem could not be downloaded in bulk through any official mechanism. Custom thumbnails, which TikTok allows creators to upload separately from the video frame, existed only on TikTok's servers.

By the morning of January 19, a combination of political pressure and Apple and Google's reluctance to enforce the ban created a window for TikTok to come back online in a limited capacity. But the message was clear: single-platform dependency is a business risk, not just a creative choice.

The creators who fared best during the chaos were those who had already been maintaining platform-agnostic content libraries. They had their raw video files, they had their thumbnail images saved separately, and they had been compressing those assets into multiple formats for different destinations. Those who had not were scrambling to screenshot their own content from a phone screen.

## The File Format Problem Nobody Warned You About {#file-format-problem}

When creators began mass-uploading to Instagram Reels and YouTube Shorts in the days following the near-ban, two problems emerged immediately.

The first was aspect ratio. TikTok encodes video at 1080x1920 (9:16 vertical) and its compression algorithm is tuned for that specific resolution and frame rate. When those files were uploaded to other platforms without re-encoding, the results were inconsistent. YouTube Shorts handled the format reasonably well because it uses the same 9:16 standard. Instagram Reels accepted the files but applied its own compression pass on top, which degraded quality noticeably for videos that had already been compressed by TikTok on upload.

The second problem was less visible but equally damaging: thumbnail images.

TikTok allows creators to upload a custom cover image. Most creators had been doing this casually, uploading a phone screenshot or a quickly cropped image without thinking about the file specifications. When those same creators tried to upload thumbnails to YouTube (which has specific requirements: 1280x720 pixels, under 2MB, JPG or PNG or GIF or WebP) or to Instagram (which generates its own cover from the video and only allows custom covers through Creator Studio with specific constraints), they discovered that their existing thumbnail library was a mess.

Files were the wrong size. Files were in HEIC format, which many platforms reject. Files were oversized to 8MB because they had been exported directly from an iPhone camera roll without any compression. Files were too small because they had been screenshotted from a phone at low resolution.

The migration moment forced a crash course in file format literacy.

## Platform-by-Platform Compression Behaviour {#platform-compression}

Understanding how each platform treats your uploaded content is essential if you are managing a multi-platform presence. Here is what each major platform does to your video and image files.

### TikTok

TikTok re-encodes all uploaded video to H.264 at approximately 1080x1920 at around 2.5 Mbps. It also applies noise reduction and sharpening passes that can introduce visible artefacts on text overlays and fine detail. Custom cover images are resized to 1080x1920 and converted to JPEG at around 85 percent quality, which is generally fine but can produce visible compression artefacts on images with gradients or text.

### Instagram Reels

Instagram applies an additional compression pass on top of whatever you upload, targeting approximately 3.5 Mbps for Reels. However, Instagram's algorithm is known to apply heavier compression during peak upload periods (weekends, evenings in US time zones) when server load is higher. This means the same file uploaded at different times can look noticeably different. Cover images for Reels should be uploaded at exactly 1080x1920 and under 8MB, but JPEG at around 80 percent quality is where Instagram's own re-compression stabilises, so uploading at maximum quality wastes bandwidth without improving the result.

### YouTube Shorts

YouTube Shorts applies its own VP9 or AV1 codec compression for storage and delivery. Unlike TikTok and Instagram, YouTube retains a higher-quality master copy and delivers different compression levels based on connection speed. This means that on a fast connection, YouTube Shorts can actually look better than the TikTok original, because YouTube is delivering from a higher-quality master. Custom thumbnails for YouTube should be 1280x720 at 72 DPI, and YouTube specifically recommends keeping them under 2MB. WebP format is fully supported and often produces the best quality-to-size ratio.

### RedNote (Xiaohongshu)

RedNote's handling of uploaded images and video was what surprised US creators the most during the migration. The app is primarily optimised for a Chinese mobile audience on varied connection speeds, and its compression is therefore aggressive. Images uploaded to RedNote at full 12MP iPhone resolution are re-encoded to approximately 1080x1440 at 85 percent JPEG quality, which is reasonable. But videos receive much heavier compression than US creators expected, targeting around 1.5 to 2 Mbps for standard uploads. Creators who uploaded without pre-compressing their own files found that RedNote's compression pass introduced noticeable quality loss. Those who uploaded pre-compressed 1080x1920 video at around 2 Mbps found the results much more consistent.

## Thumbnail Quality and Why It Collapsed on Migration {#thumbnail-quality}

Here is something most content creators never think about: your platform thumbnail is often the first image a potential viewer sees of your content in a search result, on a discovery page, or in a notification. On TikTok, thumbnails are served at relatively high quality because TikTok controls the entire delivery stack. When those same thumbnails move to a new platform, they are re-processed by that platform's image pipeline, and if the source file was already a compressed JPEG, the re-compression compounds the quality loss.

This is called generation loss, and it is the image equivalent of making a photocopy of a photocopy. Each pass through a lossy compression algorithm removes information that cannot be recovered.

Creators who had been saving their thumbnails as high-quality PNG or uncompressed JPEG files avoided this problem. Creators who had been saving thumbnails from social media (screenshotting from their own TikTok profile, for example) were working with files that had already been through one compression pass, and the results on the new platforms were visibly worse: blurry text, muddy backgrounds, pixelated faces.

The practical lesson here is simple: always save your source thumbnail files in the highest quality format available. Compress them down to platform requirements at upload time, but keep the original uncompressed or near-lossless copy for reuse. A PNG file saved from Photoshop at full resolution is much more resilient to platform re-compression than a JPEG you downloaded from Instagram.

## RedNote and the Revelation of True File Sizes {#rednote-revelation}

RedNote's sudden popularity among US creators revealed something the platform had been doing quietly for years that Western platforms generally do not: it shows creators the actual file size and resolution of every image and video they upload.

When American creators began uploading to RedNote in January 2026, many were shocked to see that their iPhone photos were 15MB to 25MB HEIC files that RedNote was converting to JPEG on the fly. They were shocked to see that their TikTok exports were already compressed to 8MB for a 30-second video. And they were shocked to see that the image quality difference between a 15MB original and a 1.5MB web-optimised version was essentially invisible on a mobile screen.

This is the most important lesson the TikTok migration moment delivered: the gap between what a file actually contains and what a viewer can perceive is enormous. Most creators have been uploading vastly oversized files for years, slowing down their own load times and processing pipelines, without any visible quality benefit to viewers.

Optimising images and video for web delivery is not a compromise. It is a discipline, and the best creators treat it as seriously as they treat colour grading or audio mixing.

## What Creators Should Do Right Now {#what-creators-should-do}

Whether or not TikTok faces further regulatory action in 2026, the migration moment established that every content creator needs a platform-agnostic asset strategy. Here is what that looks like in practice.

### Maintain a Master Library

Keep raw, uncompressed or near-lossless versions of every piece of content you create. For video, this means the camera original or the final export from your editing software before any platform upload. For images, this means PSD, TIFF, or maximum-quality JPEG (quality 95 or above) from your editing software. These are your masters. Never share them directly anywhere. Compress down from them for every distribution destination.

### Compress Intentionally for Each Platform

Do not rely on platforms to compress your content for you. When you upload a 50MB video to Instagram and let Instagram compress it, you have no control over the output. When you pre-compress a video to Instagram's optimal specifications before uploading, you control what viewers see.

For images, this means:
- YouTube thumbnails: 1280x720 WebP at 85 percent quality (typically 80-150KB)
- Instagram posts: 1080x1080 JPEG at 80 percent quality (typically 150-300KB)
- TikTok covers: 1080x1920 JPEG at 85 percent quality (typically 200-400KB)
- RedNote: 1080x1440 JPEG at 80 percent quality (typically 150-250KB)

For each platform, test your content on multiple devices and connections before publishing. What looks fine on your laptop over fibre may look terrible on a phone over LTE.

### Convert From HEIC Immediately

If you are shooting on an iPhone, your camera is saving files in HEIC format by default. HEIC is an excellent format for local storage because it achieves roughly half the file size of JPEG at equivalent quality. But HEIC is not universally supported across all platforms and editing tools. Convert HEIC files to JPEG or PNG as part of your ingest workflow, before you start editing, to avoid compatibility problems later.

Tools like Optimage can batch-convert entire folders of HEIC files to JPEG or WebP at specified quality settings, handling the conversion automatically so you can focus on the creative work rather than the file management.

### Back Up Before Every Platform Upload

The TikTok near-ban was a reminder that content you upload to a platform lives on servers you do not control. Before every major upload, ensure you have a local backup of the source file. Cloud storage (iCloud, Google Drive, Dropbox) is not the same as a backup; it is a sync service, and if you delete a file from one device, it deletes everywhere. Use a dedicated backup solution like Time Machine on Mac or Windows Backup, or a cloud backup service like Backblaze, to maintain true copies of your content library.

## The Broader Lesson: Own Your Assets {#own-your-assets}

The 14-hour TikTok blackout in January 2026 was a stress test for every creator's asset management strategy, and most failed it. The creators who emerged with the least disruption were those who had been treating their content like professionals: maintaining master files, compressing intentionally for distribution, and never allowing any single platform to be the sole custodian of their work.

The tools to do this well have never been more accessible. Image compression software can optimise an entire library of photos in minutes. Video compression tools can batch-encode content for multiple platforms simultaneously. The limiting factor is not technology; it is habits.

If the TikTok situation taught creators anything, it is that platform loyalty is a strategy for someone else's benefit. Your content, your files, your audience relationships, these belong to you. The infrastructure you use to reach your audience should be interchangeable, and that interchangeability starts with owning your assets in formats that are not locked to any single platform.

Start that process today. Export your masters. Compress your thumbnails. Convert your HEIC files. And the next time a platform goes dark for 14 hours, you will be the one who was prepared.

---

*Optimage helps creators and web teams compress images in bulk without quality loss. Batch-convert HEIC, JPEG, PNG, and WebP files in seconds. [Try it free.](/)*
