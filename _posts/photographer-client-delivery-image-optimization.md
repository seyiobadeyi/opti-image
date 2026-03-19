---
title: "How Professional Photographers Deliver Client Work Faster Without Sacrificing Quality"
date: "2026-02-10T10:30:00Z"
excerpt: "Delivering a 500-photo wedding gallery as 80MB JPEGs is a bad client experience and a storage cost problem. This guide shows how professional photographers in the US and Canada are using smart compression workflows to deliver galleries clients can actually download, share, and print."
---

## Table of Contents

- [The Problem Nobody Talks About at Photography Workshops](#the-problem-nobody-talks-about-at-photography-workshops)
- [Web Gallery Delivery vs Print Delivery: Completely Different Quality Requirements](#web-gallery-delivery-vs-print-delivery-completely-different-quality-requirements)
- [What Print Quality Actually Means: PPI, File Size, and Print Dimensions](#what-print-quality-actually-means-ppi-file-size-and-print-dimensions)
- [Web Gallery Optimization: Under 1MB Per Photo, No Visible Quality Loss](#web-gallery-optimization-under-1mb-per-photo-no-visible-quality-loss)
- [Social Media Derivatives: Automating the Instagram Version Clients Always Ask For](#social-media-derivatives-automating-the-instagram-version-clients-always-ask-for)
- [How to Talk to Clients About Compression Without Losing Their Trust](#how-to-talk-to-clients-about-compression-without-losing-their-trust)
- [The Delivery Workflow: Lightroom Plus Optimage as a Two-Pass System](#the-delivery-workflow-lightroom-plus-optimage-as-a-two-pass-system)
- [Protecting Client Privacy: EXIF Data, GPS Coordinates, and What Your Files Reveal](#protecting-client-privacy-exif-data-gps-coordinates-and-what-your-files-reveal)
- [Commercial Photography: Brand Asset Delivery and Agency File Format Expectations](#commercial-photography-brand-asset-delivery-and-agency-file-format-expectations)
- [Storage Costs for Studios with Years of Client Work](#storage-costs-for-studios-with-years-of-client-work)
- [Before and After: 600-Photo Wedding Shoot, Full Processing Stats](#before-and-after-600-photo-wedding-shoot-full-processing-stats)
- [Building Your Delivery System](#building-your-delivery-system)

---

A wedding photographer in Nashville recently posted in a photography forum about a client who called, frustrated, saying they "couldn't download their photos." After a 20-minute back-and-forth, the problem became clear: the photographer had delivered a Dropbox folder containing 587 JPEGs at 22MB each. The total gallery weighed 12.9GB. The client was trying to download it on their home WiFi, which had a real download rate of about 15 Mbps. The math: over 1.9 hours of continuous download for a gallery of wedding photos.

That is a bad client experience. Not because of anything artistic. Not because of the editing, the color grading, or the composition. Because of file size management that the photographer had never thought about.

This is the conversation the photography industry rarely has at workshops and conferences. Everyone talks about posing, lighting, marketing, and pricing. Almost nobody talks about the fact that a 24-megapixel camera produces files that are dramatically larger than they need to be for web delivery and gallery viewing, and that delivering those raw-export files to clients is a bad experience that reflects poorly on your business.

The good news is that the solution is technically simple, takes minimal time to implement, and has zero perceptible impact on image quality for the contexts in which clients actually view and use their photos.

---

## The Problem Nobody Talks About at Photography Workshops {#the-problem-nobody-talks-about-at-photography-workshops}

Let's put some numbers on the actual scale of the problem.

A typical wedding photographer shoots 2,000-4,000 frames and delivers 400-700 final edited photos. At 24 megapixels (the resolution of a Canon EOS R6 or Nikon Z6 III), a Lightroom JPEG export at quality 95 produces files averaging 8-15MB each. At quality 100, those files run 18-25MB each. According to [Cloudinary's State of Visual Media report](https://cloudinary.com/state-of-visual-media-report), images and photography files account for the majority of data transferred in digital media workflows, yet the average file delivered to end users is still 3-5x larger than it needs to be.

The arithmetic is brutal:
- 500 photos at 12MB average: 6GB delivery package
- 500 photos at 20MB average: 10GB delivery package
- 600 photos at 15MB average: 9GB delivery package

Clients cannot handle these files easily. They cannot:
- Download them in a reasonable time on typical home internet
- Attach them to emails (corporate email limits are typically 25-35MB total)
- Back them up efficiently to their personal cloud storage (Google Photos free tier is 15GB, which a wedding gallery can exhaust entirely)
- Share individual photos on social media without their phone automatically compressing them anyway
- View them quickly in gallery apps that were not designed for 20MB files

The irony is that you spent thousands of dollars on camera gear specifically to capture maximum resolution and quality, then you deliver files that are so large they create a poor client experience. The resolution is not the problem. The problem is that "maximum quality Lightroom export" does not mean "best delivery file."

Portrait photographers face the same issue at a slightly smaller scale. A typical portrait session with 60 delivered images at 15MB each is 900MB. A commercial shoot with 200 delivered images at 18MB each is 3.6GB. For real estate photographers delivering 40-60 images per property, and shooting multiple properties per week, the file management problem compounds quickly.

For real estate photography specifically, where turnaround time is often 24-48 hours and realtors need images immediately for MLS listings, delivery speed and file practicality are competitive differentiators. The photographer who delivers a clean, download-ready gallery in 6 hours wins repeat business over the photographer who delivers a 4GB gallery that takes 40 minutes to download. Our [real estate photo optimization guide](/blog/real-estate-photo-optimization-us-canada) goes into the real estate workflow specifically.

---

## Web Gallery Delivery vs Print Delivery: Completely Different Quality Requirements {#web-gallery-delivery-vs-print-delivery-completely-different-quality-requirements}

The fundamental mistake in photographer delivery workflows is treating all deliverables as if they have the same quality requirements. They do not. Web viewing and print have radically different file size and resolution needs.

**Web gallery viewing** happens on screens with a pixel density of 72-400 PPI, at viewing distances of 12-24 inches. A retina MacBook Pro screen displays at approximately 227 PPI. An iPhone 15 Pro displays at 460 PPI. The [MDN Web Docs on responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) document how browsers handle image downsampling across different screen densities, which directly explains why uploading 6000px files when a 2048px file would suffice is wasted bandwidth for both you and your client. For web display, the limiting factor is not resolution, it is pixel dimensions relative to screen size. A browser window displaying a photo at 1200px wide is using 1200 pixels to render the image regardless of whether the source file is 3000px or 6000px wide. The extra pixels are downsampled by the browser in real time, contributing nothing to the visual experience while adding everything to the file size.

**Print delivery** requires actual, usable resolution for the intended print dimensions. A 4x6 print at 300 PPI requires 1200x1800 pixels. An 8x10 at 300 PPI requires 2400x3000 pixels. A 16x24 (common poster print) at 300 PPI requires 4800x7200 pixels. A 24MP camera produces approximately 6000x4000 pixels, which supports prints up to approximately 20x13 inches at 300 PPI.

The correct workflow recognizes these two categories and creates separate deliverables for each:

**Web gallery files:** 2048px on the longest side, JPEG at quality 82-85, target 300-700KB per file. These are for the online gallery, social media, and digital sharing. They look perfect on any screen, load quickly in gallery applications like Pixieset, Shootproof, or Pic-Time, and are practical to download.

**Print-ready files:** Full resolution (camera native), JPEG at quality 92-95, average 8-15MB per file. These are delivered as a separate "print files" folder, clearly labeled, with instructions for clients about when to use them. Most clients will use the web gallery files for 95% of their viewing needs and only access the print files when they place a print order.

By delivering two separate sets, you solve the download problem without compromising on print quality. Clients can download the web gallery in minutes and keep the print files in cloud storage for later access.

Some photographers resist this approach because they worry clients will think they are receiving "low quality" web files. This concern is addressed directly in the client communication section below.

---

## What Print Quality Actually Means: PPI, File Size, and Print Dimensions {#what-print-quality-actually-means-ppi-file-size-and-print-dimensions}

Most photographers understand that higher resolution is needed for larger prints, but the specific numbers are worth spelling out clearly because they inform how to counsel clients and how to structure print-ready file exports.

PPI (pixels per inch) is the measure of printed image resolution. The standard benchmarks:

- **300 PPI:** The photographic print standard. Used by professional print labs (MPIX, Bay Photo, Nations Photo Lab) for all standard print sizes. At 300 PPI, prints are sharp when viewed at normal close distances.
- **240 PPI:** Acceptable for prints that will be viewed from 18+ inches. Some photographers use this for canvas prints and large format.
- **150 PPI:** The minimum for large-format prints viewed from arm's length or further (posters, banners, trade show graphics).

The required pixel dimensions at each standard print size at 300 PPI:

| Print Size | Required Pixels | Notes |
|---|---|---|
| 4x6 | 1200x1800 | Standard lab minimum |
| 5x7 | 1500x2100 | Common portrait size |
| 8x10 | 2400x3000 | Requires crop from 3:2 ratio |
| 11x14 | 3300x4200 | Standard portrait framed print |
| 16x24 | 4800x7200 | Borderline for 24MP camera |
| 20x30 | 6000x9000 | Exceeds 24MP camera native |

A 24MP camera at native resolution (approximately 6000x4000 pixels) comfortably supports prints up to approximately 20x13 inches at 300 PPI, or up to 20x30 at 200 PPI (acceptable for wall art viewed from a distance). For most client print needs (4x6 through 11x14), your full-resolution camera files are dramatically more than adequate.

This table also reveals something important: your web gallery files at 2048px on the longest side are perfectly adequate for any print up to 5x7 at 300 PPI, and comfortable for 8x10 at 240 PPI. Many clients who think they need "full resolution" for printing only ever order 4x6 prints. Understanding their actual print intentions lets you have a more honest conversation about what they truly need.

---

## Web Gallery Optimization: Under 1MB Per Photo, No Visible Quality Loss {#web-gallery-optimization-under-1mb-per-photo-no-visible-quality-loss}

The goal for web gallery delivery files is: beautiful at 2048px, under 1MB each, loads instantly in Pixieset or Shootproof, downloads in a reasonable time as a batch.

The technical target:
- **Longest dimension:** 2048px (or 2500px if you want to support retina displays with a margin)
- **JPEG quality:** 82-85 in Optimage (corresponds to roughly quality 90-92 in Lightroom's scale)
- **Color profile:** sRGB (essential for consistent display across devices)
- **Target file size:** 300-700KB for most photos; complex scenes may hit 800KB

At these settings, a 600-photo wedding gallery weighs approximately 250-350MB total. The entire gallery downloads in 4-7 minutes on typical home broadband (25-50 Mbps real download speed), or in under 2 minutes on faster connections. This is a dramatically different client experience from the 1.9-hour download at the start of this post.

Gallery delivery platforms like Pixieset, Shootproof, Pic-Time, and SmugMug all display your images at their platform-defined maximum display size. Pixieset, for example, displays images at a maximum of approximately 2500px. Uploading files at 2048-2500px matches the platform's display size perfectly: no upscaling, no unnecessary downscaling, no wasted resolution. Uploading 6000px files to Pixieset costs you upload time and storage without improving what clients see.

The Lightroom export setting that most closely corresponds to the Optimage quality 85 output is Lightroom quality 75-80. However, Lightroom's quality slider and Optimage's quality setting use different underlying algorithms, and Optimage's compression engine typically produces smaller files at equivalent visual quality compared to Lightroom's built-in JPEG encoder. This is why a two-pass workflow (Lightroom for editing and initial export, Optimage for final compression pass) consistently produces better results than Lightroom alone.

---

## Social Media Derivatives: Automating the Instagram Version Clients Always Ask For {#social-media-derivatives-automating-the-instagram-version-clients-always-ask-for}

Every photographer who has delivered a gallery has received some version of this message: "Hi! Love the photos! Can you send me a few in a smaller size for Instagram? The ones you sent are too big to upload."

Clients are right that Instagram, Facebook, and TikTok have specific size constraints and their own compression pipelines. Sending a full-resolution JPEG to a client for Instagram posting is sending them a file their phone will immediately compress before posting anyway, usually quite aggressively. The client gets the same Instagram quality whether they upload a 15MB file or a 1MB file.

The professional solution is to include a "social media" folder in your delivery package. Social media derivatives:
- **Instagram:** 1080x1080px (square) or 1080x1350px (portrait), JPEG at quality 82, target 200-400KB
- **Facebook:** 2048px longest side, JPEG at quality 80, target 400-600KB
- **Stories/Reels:** 1080x1920px, JPEG at quality 80

You do not need to create social media versions of every photo in the gallery. Create them for the 10-20 highlight images that you know the client will actually share: the first look, the ceremony kiss, the wedding party portrait, the reception first dance. For portrait sessions, social media versions of 5-10 favorite shots.

Optimage makes batch resizing and compression straightforward: set your output dimensions and quality, drag in your highlight images, and the social media folder is created in seconds. The time investment is minimal. The client experience upgrade is significant.

Including social media optimized files in your delivery package positions you as a thoughtful professional who understands how clients actually use their photos. It also reduces post-delivery support requests ("how do I make these smaller?") which saves you time and frustration.

For the specific dimensions and format requirements for each platform in 2026, our [social media image size guide](/blog/social-media-image-size-guide-all-platforms-2026) is the reference to use.

---

## How to Talk to Clients About Compression Without Losing Their Trust {#how-to-talk-to-clients-about-compression-without-losing-their-trust}

The anxiety clients feel about "compressed" photos comes from a legitimate concern they cannot fully articulate: they do not want their wedding photos to look cheap or degraded. The word "compression" triggers associations with blurry, blocky images from early smartphone cameras.

Here is a framework for communicating about your delivery system that addresses this concern without getting into technical details:

**In your client guide/welcome packet:**
"Your gallery will include two types of files: web-ready photos sized for screens and digital sharing, and full-resolution print files for ordering prints. The web-ready files are sized for beautiful display on phones, computers, and screens, and are ready to share directly. The print files contain the maximum resolution for printing large. Both versions are full quality, just sized for their purpose."

This framing answers the actual underlying question ("will my photos look good?") without requiring the client to understand JPEG compression, PPI, or file size optimization.

**When a client asks directly about file size:**
"The web-ready files in your gallery are optimized for sharing and screen viewing. They look beautiful on any screen and are designed to be easy to download and share. For anything you want to print large, I've also included the full-resolution files, which have the maximum detail for print. Most clients use the web files 95% of the time and only access the print files when they're ordering a canvas or a large print."

**The comparison that always works:**
Streaming services like Netflix and Spotify deliver compressed audio and video that sounds and looks excellent, because they have optimized compression for the delivery medium. Your gallery photos are the same concept: optimized for the delivery medium (screens and digital sharing) while maintaining the quality that medium requires. Print files are delivered separately at maximum quality.

The key is to lead with the experience ("beautiful on any screen," "easy to share," "downloads quickly") rather than the technical method. Clients care about outcomes, not algorithms.

---

## The Delivery Workflow: Lightroom Plus Optimage as a Two-Pass System {#the-delivery-workflow-lightroom-plus-optimage-as-a-two-pass-system}

The workflow that consistently produces the best results for professional photographers is a two-pass system: Lightroom handles the editing and initial export, then Optimage handles the final compression optimization pass.

**Lightroom Export Settings for the First Pass:**

For web gallery files:
- Format: JPEG
- Quality: 90 (this is your intermediate quality, higher than final; Optimage will take it further)
- Color Space: sRGB
- Resize to Fit: Long Edge, 2048 pixels (or 2500 if targeting retina)
- Resolution: 72 PPI (irrelevant for screen, but set it anyway for metadata cleanliness)
- Sharpen For: Screen, Amount: Standard

For print-ready files:
- Format: JPEG
- Quality: 95
- Color Space: sRGB
- Resize: Do Not Resize (full native resolution)
- Sharpen For: Matte or Glossy depending on expected print surface, Amount: Standard

Export to a folder structure:
```
[Client Name] - [Date]/
  web-gallery-lightroom-export/
  print-files/
```

**Optimage Second Pass (Web Gallery Only):**

Open [Optimage](https://optimage.dreamintrepid.com) and drag the "web-gallery-lightroom-export" folder in. Configure:
- Quality: 82-85 (experiment per shoot to find the setting where quality is imperceptible; most photographers settle on 83)
- Output: New folder named "web-gallery-final"
- Metadata: Strip EXIF (discussed in detail below)

Run the compression. Optimage takes approximately 30-60 seconds per 100 images on an Apple Silicon Mac.

**Upload web-gallery-final to your delivery platform (Pixieset, Shootproof, etc.)**

Gallery delivery platforms have published their own guidance on upload quality. [Pixieset's help documentation](https://help.pixieset.com/hc/en-us/articles/115004018966-Optimizing-Your-Photos-for-Upload) recommends uploading at 2048px or higher on the longest edge. Uploading at exactly 2048px means zero downsampling occurs between your upload and the gallery display, which preserves maximum sharpness.

**Archive print-files to your long-term storage.**

This two-pass system is optimal because Lightroom's JPEG export is excellent at applying your edit and outputting at the right dimensions, but Lightroom's compression efficiency is not as optimized as a dedicated tool like Optimage. The combination delivers the quality of Lightroom editing with the compression efficiency of a specialized tool.

The entire additional time cost of the Optimage pass is typically 3-8 minutes per gallery, running in the background while you do other tasks. The output is files that are 35-55% smaller than Lightroom-only exports at equivalent visual quality.

---

## Protecting Client Privacy: EXIF Data, GPS Coordinates, and What Your Files Reveal {#protecting-client-privacy-exif-data-gps-coordinates-and-what-your-files-reveal)

This is a section most photography business guides skip entirely, and they should not. Your camera embeds significant metadata in every photo file, and in a professional photography context, that metadata can create privacy and liability issues.

EXIF (Exchangeable Image File Format) data is automatically written into JPEG files by your camera. It includes:

- **Camera make and model** (Canon EOS R5, Nikon Z8, Sony A7IV)
- **Serial number** of your camera body (a unique identifier)
- **Lens make and serial number**
- **Date and time** of capture (to the second)
- **GPS coordinates** if your camera has GPS enabled or your phone was used for any shots (exact latitude and longitude of where the photo was taken)
- **Shutter speed, aperture, ISO, flash settings**
- **Lightroom version and edit settings** in some export configurations

For personal photos this is largely harmless. For professional delivery, it creates several concerns:

**For wedding photographers:** Your files contain the exact GPS coordinates of the venue, the client's home (if you shot getting-ready photos), and sometimes the couple's home address. If you are sharing galleries through public gallery platforms with any kind of public sharing, this metadata is visible to anyone who downloads the file and looks at it.

**For portrait photographers shooting at client homes:** You are embedding the client's home address (via GPS) in every exterior shot. When clients share these photos online, they are potentially broadcasting their home location.

**For commercial photographers:** Agency and brand clients often have NDAs and strict confidentiality requirements. EXIF data revealing the shoot date and location can inadvertently expose confidential project information.

The fix is simple: strip EXIF data before delivery. Optimage can strip EXIF metadata as part of its compression pass, adding zero time to your workflow. You can choose to retain non-identifying metadata (copyright information, your name as photographer) while stripping location and serial number data.

Our full guide on [what EXIF metadata is and why you should strip it](/blog/what-is-exif-metadata-and-why-strip-it) covers the technical details of what different metadata fields contain. For a more accessible introduction to what smartphone and camera photos reveal about their subjects, [what your phone photos reveal about you](/blog/what-your-phone-photos-reveal-about-you) makes the privacy case clearly.

The professional standard for client delivery in 2026 is to strip GPS data and camera serial numbers from all delivered files. Retain your copyright information (IPTC author and copyright fields) because that protects your intellectual property rights in the delivered files.

---

## Commercial Photography: Brand Asset Delivery and Agency File Format Expectations {#commercial-photography-brand-asset-delivery-and-agency-file-format-expectations}

Commercial photographers (product, advertising, editorial, corporate) work in a different delivery context than wedding and portrait photographers. Your clients are marketing teams, art directors, and brand managers who are using your files in production workflows with specific technical requirements.

**Agency and brand format expectations for 2026:**

Most US and Canadian advertising and marketing agencies accept deliverables in:
- **JPEG:** For most photography deliverables; quality 90-95 for final delivery files
- **TIFF:** For files that will undergo additional post-production or compositing
- **PNG with transparency:** For product shots that need to be composited against different backgrounds
- **RAW (DNG or proprietary):** Sometimes required by agencies doing extensive retouching

The file size and format expectations depend on end use:
- **Social media campaigns:** Agencies typically want print-ready resolution (24MP+) to maintain flexibility, even for social media use; they will downsize internally
- **Print advertising:** Full resolution, TIFF or high-quality JPEG, no compression artifacts
- **Website use:** Often specified by the agency's web team; may request web-optimized deliverables alongside print files
- **Billboard and OOH:** Full resolution, often TIFFs; the agency's retoucher will scale up as needed

The commercial photography workflow differs from wedding/portrait in an important way: you typically deliver to a professional production environment rather than directly to an end consumer. The receiving party has the technical expertise to handle large files. However, practical delivery logistics still matter: large TIFF files delivered via Dropbox or WeTransfer need to be organized clearly, and the delivery should include a tech spec sheet so the production team knows what they received.

For commercial work, the compression optimization pass that is essential for consumer delivery is less relevant. Your clients expect and can handle large, high-quality source files. The optimization workflow in this guide applies primarily to the consumer photography market (weddings, portraits, events, senior photos, newborns).

---

## Storage Costs for Studios with Years of Client Work {#storage-costs-for-studios-with-years-of-client-work}

Every year of professional photography creates significant data storage obligations. A busy wedding photographer shooting 40 weddings per year, delivering 500 images per wedding at 10MB each, adds 200GB of delivered files per year to their archive. After 5 years: 1TB of delivered files, plus the original RAW files (typically 25-50MB each, for 40 weddings x 600-800 selects), which adds another 1.5-2.5TB annually.

A 5-year-old photography studio may easily have 10-15TB of combined archive data. At current cloud storage rates:
- [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html): approximately $6/TB/month = $60-90/month for 10-15TB
- Amazon S3: approximately $23/TB/month = $230-345/month for 10-15TB
- Google Drive (Workspace): approximately $10-20/TB/month, tiered by plan
- Dropbox Business: approximately $15/TB/month

These costs are significant, and a meaningful portion of the archive may consist of delivered client files that were never optimized. A studio that has been delivering 15MB JPEGs for 5 years has files that could be 60-70% smaller with no impact on client usability. For the financial case on cloud storage costs from unoptimized files, our analysis in [cloud storage costs from unoptimized images](/blog/cloud-storage-costs-unoptimized-images) runs the numbers in detail.

The archive optimization strategy: do not touch your original RAW files (those are your true originals and should be preserved at full fidelity forever). But your exported client delivery JPEGs can be compressed for archive without consequence. If you have already delivered the optimized files to clients, the archived copies of delivered files can be further compressed for long-term storage at quality 80-82 with no meaningful quality loss for any purpose a 5-year-old file will be used for.

---

## Before and After: 600-Photo Wedding Shoot, Full Processing Stats {#before-and-after-600-photo-wedding-shoot-full-processing-stats}

Here are realistic numbers for a 600-photo wedding gallery, from camera to final delivery, using the two-pass system described above.

**The shoot:** A fictional photographer named Marcus shoots 2,200 frames at a July wedding in Niagara-on-the-Lake. He culls to 600 keepers in Lightroom, edits all 600, and prepares for delivery.

**Lightroom export (first pass):**
- 600 JPEGs at quality 90, 2048px long edge
- Export time: approximately 22 minutes
- Average file size: 1.8MB
- Total folder size: 1.08GB

**Optimage compression pass (second pass):**
- Quality: 83, EXIF stripped (copyright retained)
- Processing time: approximately 4 minutes (Apple M3 Pro)
- Average file size: 680KB
- Total folder size: 408MB
- Reduction from Lightroom export: 62% smaller
- Reduction from original camera native: approximately 97% smaller

**Delivery package:**
- Web gallery folder: 408MB (the 600 compressed files)
- Print files folder: 600 JPEG at quality 95, native resolution, approximately 9GB total
- Social media highlights: 15 images at 1080x1350px, quality 82, 8MB total
- Total delivery package: approximately 9.4GB (print files dominate; web gallery is incidental to overall size)

**Client download experience:**
- Web gallery (Pixieset): downloads in 90 seconds at 50 Mbps
- Print files (provided via download link): client downloads as needed; rarely downloaded in bulk

**Visual quality comparison:**

Marcus spot-checks 20 random images, comparing the 680KB optimized versions to the 1.8MB Lightroom exports on his calibrated 27-inch iMac display at 100% zoom and on his iPhone 15 Pro. He cannot identify a consistent difference. He has a colleague (a photographer who was not in the room during processing) try to identify which is the optimized version in a blind comparison of 10 image pairs. The colleague correctly identifies 6 of 10, essentially at chance, indicating no systematic perceptible quality difference.

**Client feedback:**
Marcus includes a short note in his delivery email: "Your gallery is split into web-ready photos (for sharing and screen viewing) and full-resolution print files (for ordering prints). The web-ready photos are sized for beautiful display on any screen and are designed to be easy to download and share. The print files have the maximum quality for printed products."

He receives no questions about quality. He does receive a message saying: "These downloaded so fast! Other photographers' galleries take forever."

---

## Building Your Delivery System {#building-your-delivery-system}

The photographers who have the best client relationships are not always the ones with the best lighting or the most creative editing. They are the ones who make the experience of receiving, using, and sharing photos as frictionless as possible.

A systematic delivery workflow, built on the two-pass compression approach in this guide, accomplishes several things simultaneously: it creates a better client experience, reduces your cloud storage costs over time, protects client privacy through EXIF stripping, and differentiates you from photographers who drop a 12GB Dropbox link on clients with no explanation.

The implementation is not complex. The Lightroom export settings take 10 minutes to configure once. The Optimage workflow adds 4-8 minutes per gallery. The client communication template takes 30 minutes to write once and then goes in every delivery email for the rest of your career.

---

**Ready to upgrade your delivery workflow?** [Try Optimage free](https://optimage.dreamintrepid.com) and process your next gallery's web delivery files with one drag-and-drop. Apple Silicon performance means a 600-photo gallery is done in under 5 minutes.

---

**Related reading:**
- [What Is EXIF Metadata and Why Strip It](/blog/what-is-exif-metadata-and-why-strip-it): the complete guide to what your photo files reveal and how to control that information before delivery.
- [What Your Phone Photos Reveal About You](/blog/what-your-phone-photos-reveal-about-you): a more accessible look at the privacy implications of metadata, useful context for understanding why stripping matters for client files.
- [Cloud Storage Costs from Unoptimized Images](/blog/cloud-storage-costs-unoptimized-images): the financial case for optimizing your archival files and reducing your long-term storage bill.
- [Real Estate Photo Optimization for US and Canada](/blog/real-estate-photo-optimization-us-canada): if you do real estate photography, this covers the MLS upload requirements and turnaround time optimization specific to that market.
- [Social Media Image Size Guide: All Platforms 2026](/blog/social-media-image-size-guide-all-platforms-2026): exact dimensions for every platform your clients will share their photos on.
