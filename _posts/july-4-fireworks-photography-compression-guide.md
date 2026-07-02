---
title: "Two Days Until America's 250th Birthday. Here's Why Fireworks Photos Always Look Worse After You Share Them."
date: "2026-07-02T19:00:00Z"
excerpt: "July 4, 2026 is the United States' 250th anniversary — the biggest fireworks night in a generation, with major shows from New York to San Diego. Fireworks photography has a specific compression failure mode that makes JPEG an unusually bad format for the job. Here's what's actually going wrong and how to fix it before Friday night."
keyTakeaways:
  - "July 4, 2026 marks the US 250th anniversary — major cities are planning their largest fireworks shows in decades"
  - "Fireworks create extreme contrast between point-light-source bursts and dark sky — JPEG's block encoding handles this combination particularly badly"
  - "JPEG creates visible block artifacts around the radial burst patterns that are the visual signature of fireworks, particularly in the color channels"
  - "Phone cameras in auto mode use ISO 3200-6400 for fireworks, which compounds the compression problem"
  - "WebP at quality 80 and AVIF at quality 68 both handle fireworks significantly better than JPEG at equivalent file sizes — smaller files, fewer artifacts"
summary: "Friday is America's 250th birthday, and it will have the largest coordinated fireworks displays in a generation. The photos from those shows will mostly look terrible after being shared — not because people are bad photographers, but because fireworks have specific characteristics that JPEG handles very poorly. The fix is format and quality choice, not camera technique."
faq:
  - question: "Why do fireworks photos always look grainy and washed out after I share them?"
    answer: "Two separate problems stack on each other. First, your phone shoots fireworks at very high ISO (often 3200-6400) because the night sky is dark even when the bursts are bright — the camera meters the overall scene, not just the burst. High ISO introduces grain. Second, JPEG compression handles the high-contrast, radial pattern of a fireworks burst badly — it creates blocky artifacts around the burst arms and color fringing at the boundary between bright burst and dark sky. When you share on WhatsApp or Instagram, their automatic compression adds a third pass of lossy encoding and the artifacts compound. Use WebP or AVIF for your final export rather than JPEG."
  - question: "What's the best phone camera setting for fireworks?"
    answer: "If your phone has a Pro or Manual mode, lock the ISO at 200-400, set shutter speed to 2-4 seconds, and use a tripod or stable surface. The long shutter captures multiple burst trails across the exposure, which looks dramatically better than a single frozen burst shot with a fast shutter. If you don't have manual mode, look for a 'Fireworks' or 'Night' preset in the camera app. Avoid flash entirely — it doesn't reach the fireworks and only illuminates the people immediately in front of you while ruining your own night vision."
  - question: "Is RAW worth shooting for fireworks?"
    answer: "If your phone offers it, yes for one specific reason: RAW preserves the dynamic range between the darkest shadow and the brightest burst, which allows you to recover detail in the overexposed center of a burst that JPEG clips to white. Fireworks bursts are bright enough to clip the highlights in JPEG, which loses the shape of the burst's core. RAW doesn't — you can pull down the highlights in Lightroom or similar and recover that structure. The file size is obviously larger, but fireworks are one of the cases where RAW offers a visible advantage over JPEG for a specific kind of detail recovery."
---

![Fireworks bursting over a waterfront cityscape at night, the classic composition for Fourth of July photography — and the hardest combination of contrast conditions for any camera sensor](/image-4.png)

July 4, 2026 is the United States' 250th anniversary of independence — America 250 — and the fireworks shows being planned are larger than anything in recent memory. New York's Macy's show is expected to be the largest since at least 2000. San Diego's Big Bay Boom is launching from four barge positions simultaneously across the bay. Cities across the country that have had modest celebrations in recent years are going all-in for the 250th.

Millions of people will photograph those shows. Most of the resulting photos will look significantly worse than what was experienced in person — not because anyone took a bad photo, but because fireworks are one of the most technically hostile subjects for phone cameras and consumer image formats alike.

Here is what is actually happening, and what you can do about it before Friday night.

## Why Fireworks Break JPEG

JPEG was designed in 1992 to compress the types of images most commonly encountered in that era: photographs of faces, landscapes, and scenes with natural color gradients and organic textures. It does this by dividing images into 8×8 pixel blocks and encoding each block as a sum of cosine waves — a mathematical representation that captures broad color patterns efficiently but struggles with sharp, high-frequency transitions.

Fireworks are almost entirely made of things JPEG handles badly.

**Radial burst arms.** The exploding star pattern of a fireworks burst creates dozens of thin, bright lines radiating from a center point. Each line is a high-frequency edge — a sharp transition from bright to dark that crosses multiple 8×8 JPEG blocks at an angle. JPEG can't represent those angled edges cleanly at its compression block size; it approximates them, producing ringing artifacts (blocky halos) along each arm of the burst.

**Point-light-source intensity against black.** Fireworks are bright objects against very dark sky. The extreme contrast at the edge between burst and darkness is exactly the kind of discontinuity that triggers JPEG's worst behavior — the same Gibbs-phenomenon ringing we wrote about in the [Wimbledon white-kit post](/blog/wimbledon-2026-day3-white-kit-photo-tips). But fireworks have this problem multiplied across every burst arm simultaneously, at multiple scales (the thick central trunk and the fine outer tendrils), in multiple color channels.

**Color fringing in saturation transitions.** Fireworks use chemical colorants — strontium for red, barium for green, copper for blue — that produce highly saturated colors. JPEG's chroma subsampling (which reduces color resolution to save space) introduces color fringing at the boundary between a saturated burst and the surrounding dark sky, particularly visible as a colored halo around each burst arm.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 28px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 12px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">250th</text><text x="110" y="78" text-anchor="middle" class="sl">US anniversary — biggest shows in a generation</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">8×8px</text><text x="350" y="78" text-anchor="middle" class="sl">JPEG block size that struggles with burst arms</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">AVIF Q68</text><text x="590" y="78" text-anchor="middle" class="sl">Best format for fireworks images</text></g>
</svg>
</div>

## The High-ISO Problem on Top of That

Before we even get to the compression issue, phone cameras shooting fireworks on auto have an exposure problem. The scene is predominantly very dark — the night sky occupies most of the frame — and the camera meters for the overall scene average. It sees a dark scene and raises the ISO dramatically, often to 3200 or higher. At ISO 3200, the sensor's own noise floor introduces grain across the image, including in the dark sky areas between bursts.

The result is a photo where the dark areas between bursts are not a clean black, but a field of visible grain. When this is then JPEG-compressed, the codec has to spend bits on that grain (because it looks like real high-frequency image content), which means it has fewer bits left for the actual bursts. The bursts get compressed more aggressively, introducing more block artifacts. Everything degrades in parallel.

## Why AVIF Is Actually the Right Format Here

AVIF was developed by the Alliance for Open Media and uses a fundamentally different compression technique than JPEG. Where JPEG uses 8×8 discrete cosine transform blocks, AVIF uses AV1's transform blocks — which can vary from 4×4 to 64×64 pixels and are chosen adaptively based on image content. For fireworks:

- Large uniform dark sky areas: encoded with large blocks efficiently
- Burst centers and arm structures: encoded with small blocks for precision
- The radial arm patterns: handled with directional prediction rather than cosine approximation

The result is that AVIF preserves the sharp geometry of fireworks bursts — the way the arms taper from bright center to fine trailing end — without the block artifacts or color fringing that JPEG introduces. At equivalent visual quality, AVIF files are typically 40-60% smaller than JPEG for fireworks images.

| Format | Typical size for a good fireworks shot | Burst arm sharpness | Color fringing |
|---|---|---|---|
| JPEG Q80 | 1.2-2.5MB | Visible ringing | Noticeable |
| JPEG Q95 | 3-5MB | Greatly reduced | Reduced |
| WebP Q80 | 650KB-1.3MB | Minor ringing | Minimal |
| AVIF Q68 | 300-600KB | Very clean | None visible |
| PNG | 8-20MB | Perfect | None |

For sharing on social media, WebP at quality 80 is the practical choice — good quality, faster to encode than AVIF, and well-supported. For archiving your best shots, AVIF or PNG gives you a clean source to work from later. JPEG is the worst option available and the one most people default to.

## What to Actually Do Differently on Friday

**Before you go out:**
Switch your phone's camera app to night mode or pro mode. If using pro mode, set ISO to 200 and shutter speed to 1-3 seconds. If you don't have pro mode, look for a Fireworks scene mode — modern phones from Apple, Samsung, and Google added these after multiple iOS and Android releases brought them to broad availability.

Find a stable surface or bring a small tripod. Long-exposure fireworks shots require stillness — even a railing, a car roof, or sitting the phone on the ground pointing up works better than handholding.

**After you've taken the shots:**
Don't share directly from your camera roll. The native camera app sends the original JPEG or HEIC file when you tap share, and WhatsApp will compress it aggressively, adding a second pass of lossy compression to an already-imperfect source.

Open the best 3-5 shots in [Optimage](/compress), export as WebP at quality 80 (or AVIF at quality 68 if you want the best possible quality), and share those files. The file will be smaller than your phone's original and significantly smaller than a WhatsApp-compressed version — but it will look noticeably better because you controlled the compression pass instead of letting the app do it at the worst possible quality.

**If you shoot long exposure:**
Long exposure fireworks shots — where multiple bursts stack into a single frame over a 2-4 second exposure — produce images with more complex content than single-burst shots, and they compress more efficiently. The burst trails are drawn-out streaks across the frame rather than single-point explosions, and the resulting image has a painterly quality that has less of the high-frequency edge problem. These shots are more forgiving on compression. WebP at quality 75 is fine for long exposures; they're still better than JPEG at equivalent quality.

America's 250th birthday fireworks will be spectacular by any historical measure. The photos are worth keeping — which means compressing them in a format that doesn't turn the burst arms into blocky approximations of themselves. Two extra steps between the shoot and the share is a reasonable investment for images this significant.

**Related reading:**
- [Compress Images Without Losing Quality](/blog/compress-images-without-losing-quality) — the foundational guide to quality-controlled compression
- [What Is EXIF Metadata and Why Strip It](/blog/what-is-exif-metadata-and-why-strip-it) — your fireworks photos know where you were standing
- [AVIF vs WebP vs JPEG 2026 Benchmark](/blog/avif-vs-webp-vs-jpeg-2026-benchmark) — format comparison with real data on high-contrast image content
