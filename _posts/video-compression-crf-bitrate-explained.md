---
title: "Video Compression Explained: CRF, Bitrate Modes, and Why Your Videos Are Too Large"
date: "2026-03-13T20:30:00Z"
excerpt: "Most developers reach for video compression tools without understanding what CRF, VBR, and codec selection actually control. This guide fixes that permanently."
variants:
  - excerpt: "CRF, bitrate modes, and codec choice are three independent variables that most developers conflate. Getting all three right is the difference between a 250MB file that looks terrible and an 8MB file that looks perfect."
    keyTakeaways:
      - "CRF controls perceptual quality, not file size — the same CRF value produces wildly different file sizes depending on content complexity"
      - "CRF 18 is visually near-lossless for H.264; CRF 23 is the default; CRF 28 is acceptable for web delivery"
      - "The preset (ultrafast to veryslow) controls encoding speed vs compression efficiency, not quality"
      - "The container (.mp4, .webm, .mkv) and the codec are separate decisions — mp4 does not mean H.264"
  - excerpt: "H.265 produces the same visual quality as H.264 at roughly 40% smaller file sizes. AV1 goes 50% smaller than H.264. But in 2026, H.264 remains the practical default for web delivery due to near-universal browser support at 99.9%."
    keyTakeaways:
      - "H.264 browser support: 99.9%; H.265: 85%; AV1: 92%; VP9: 95%"
      - "At CRF 23, a static talking-head clip might be 8MB while a 30-second action sequence at the same CRF might be 45MB"
      - "ABR (Average Bit Rate) is the standard for streaming platforms — it targets an average bitrate while allowing local variation"
      - "For website background videos, keep files under 5MB using CRF 28-32 capped at 1280x720"
  - excerpt: "Fixing your video compression workflow reduces page load times, server costs, and upload times simultaneously. The three independent variables — CRF, preset, and codec — each need to be set correctly; most developers are only thinking about one."
    keyTakeaways:
      - "Use CRF 22-24 for product demo videos at 1920x1080 to balance quality and file size"
      - "Use CRF 18 or lossless with H.265 or AV1 for archival source files that you will not re-encode"
      - "For social media uploads, the platform re-encodes anyway — upload your highest-quality H.264 or H.265 source"
      - "The veryslow preset produces smaller files at the same CRF than ultrafast, with no quality difference — only encoding time changes"
---

## Why Your Compressed Video Is Still Too Large

You ran a video through a compression tool, the file came out at 80MB instead of 250MB, and you thought you were done. Then you checked the quality and it looked like it was filmed through a potato. Or the opposite: you compressed it, quality looks perfect, and the file is still 150MB.

Both outcomes point to the same root problem. You are turning compression knobs without understanding what they control. This guide changes that.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 32px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">CRF 18</text><text x="110" y="78" text-anchor="middle" class="sl">Near-lossless quality</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">CRF 23</text><text x="350" y="78" text-anchor="middle" class="sl">H.264 default</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">~40%</text><text x="590" y="78" text-anchor="middle" class="sl">H.265 size savings</text></g>
</svg>
</div>

## The Two Fundamentally Different Ways to Control Video Size

Every video encoder offers two approaches to controlling output file size:

**1. Bitrate-based control** - You specify exactly how many bits per second the encoder is allowed to use. Simple. Predictable file sizes. Poor quality-per-bit efficiency.

**2. Quality-based control (CRF)** - You specify a target visual quality level, and the encoder uses however many bits it needs to achieve that quality for each frame. Efficient. Variable file sizes. Excellent quality-per-bit.

Most beginners use bitrate-based control because it feels intuitive. Engineers who care about quality use CRF.

## CRF: Constant Rate Factor Explained

CRF stands for Constant Rate Factor. It is a single number that represents your target visual quality, where:

- **0** = lossless (mathematically identical to the source, enormous file)
- **18** = visually near-lossless (indistinguishable from source to most viewers)
- **23** = H.264 default (good quality, reasonable file size)
- **28** = visible but acceptable compression for web delivery
- **35+** = heavy compression artifacts, blocky motion, clearly degraded

The crucial detail: **CRF does not guarantee a specific file size**. A 30-second clip of a static talking-head presentation at CRF 23 might be 8MB. A 30-second action sequence with high motion and complex textures at the same CRF 23 might be 45MB. The encoder works harder when it needs to, and coasts when the content is simple.

## H.264 vs H.265 vs AV1: Which Codec Should You Use?

The codec choice matters as much as your CRF setting. Here is the honest breakdown for 2026:

| Codec | CRF Range | Typical File Size | Browser Support | Encoding Speed |
|-------|-----------|-------------------|-----------------|----------------|
| H.264 (libx264) | 0 - 51 | Baseline | 99.9% | Fast |
| H.265 (libx265) | 0 - 51 | ~40% smaller than H.264 | 85% | Slow |
| AV1 (libaom) | 0 - 63 | ~50% smaller than H.264 | 92% | Very slow |
| VP9 | 0 - 63 | ~30% smaller than H.264 | 95% | Moderate |

For web video delivery in 2026, the practical recommendation is straightforward: **use H.264 for broad compatibility, target H.265 or AV1 for storage-first scenarios** where you control the playback environment.

## The Preset System: Speed vs Compression Efficiency

Every codec has a preset system that controls the tradeoff between encoding speed and compression efficiency. For H.264 using FFmpeg, these range from `ultrafast` to `veryslow`.

This is a common source of confusion. **The preset does not change quality**. It changes how much CPU work the encoder does trying to find the most efficient way to encode each frame at your target quality.

At `veryslow`, the encoder examines far more candidate motion vectors and partition sizes, finding more efficient representations of the same visual quality. The output is smaller at the same CRF. At `ultrafast`, it makes quick decisions, which produces larger output at the same visual quality.

For production content destined to be stored and delivered many times, `slow` or `medium` gives the best size efficiency. For real-time or user-uploaded content where latency matters, `ultrafast` or `fast` is the right choice.

```bash
# Production encode: smaller file, slower
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset slow output.mp4

# Real-time/server-side: fast encode, slightly larger
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset ultrafast output.mp4
```

## Bitrate Modes for Streaming: CBR vs VBR vs ABR

When you are encoding for streaming platforms rather than file delivery, you usually cannot use CRF because streaming protocols need predictable bandwidth budgets. This is where bitrate modes matter:

**CBR (Constant Bit Rate)** - exactly the same number of bits every second. Reliable buffering. Wastes bits on static scenes, starves bits during action scenes.

**VBR (Variable Bit Rate)** - allocates more bits to complex scenes, fewer to simple scenes. Better quality. Harder to buffer predictably.

**ABR (Average Bit Rate)** - a compromise. Targets a specific average bitrate while allowing local variation. Most streaming platforms use ABR with upper and lower caps.

For platforms like YouTube, Vimeo, or your own HLS/DASH delivery, the platform re-encodes your upload anyway. Upload the highest quality source you can generate.

<figure role="img" aria-label="Bitrate mode comparison for streaming" style="margin:32px 0">
<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:640px;display:block;margin:0 auto">
  <style>.bc{animation:bg .7s ease-out both}.bc:nth-child(1){animation-delay:0s}.bc:nth-child(2){animation-delay:.2s}.bc:nth-child(3){animation-delay:.4s}@keyframes bg{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}.bl{font:600 13px system-ui,sans-serif;fill:#374151;text-anchor:middle}.bv{font:700 15px system-ui,sans-serif;fill:#db5a42;text-anchor:middle}</style>
  <line x1="60" y1="20" x2="60" y2="165" stroke="#e5e7eb" stroke-width="1"/>
  <line x1="60" y1="165" x2="620" y2="165" stroke="#e5e7eb" stroke-width="1"/>
  <rect class="bc" x="100" y="80" width="100" height="85" rx="6" fill="#db5a42" opacity=".85"/>
  <text x="150" y="73" class="bv">Fixed</text>
  <text x="150" y="180" class="bl">CBR</text>
  <rect class="bc" x="280" y="45" width="100" height="120" rx="6" fill="#db5a42" opacity=".85"/>
  <text x="330" y="38" class="bv">Best quality</text>
  <text x="330" y="180" class="bl">VBR</text>
  <rect class="bc" x="460" y="65" width="100" height="100" rx="6" fill="#9ca3af" opacity=".85"/>
  <text x="510" y="58" class="bv" style="fill:#6b7280">Balanced</text>
  <text x="510" y="180" class="bl">ABR</text>
</svg>
</figure>

## The Container Is Not the Codec

One of the most persistent misconceptions in video compression: the file extension does not tell you what codec is inside.

- `.mp4` can contain H.264, H.265, AV1, or even MPEG-4 Part 2
- `.webm` can contain VP9 or AV1
- `.mkv` can contain almost anything

The container is just a wrapper. The codec is what actually compresses the video data. When someone says "convert to MP4," they almost always mean "encode with H.264 inside an MP4 container," but those are separate decisions.

## Practical Recommendations by Use Case

**For website background videos (silent, looping):**
- Codec: H.264 + WebM/VP9 fallback
- CRF: 28-32
- Resolution: cap at 1280x720
- Keep files under 5MB at all costs

**For product demo videos:**
- Codec: H.264
- CRF: 22-24
- Resolution: 1920x1080 maximum
- Mute if audio is not essential

**For archival/source files:**
- CRF: 18 or lossless
- Codec: H.265 or AV1 for storage efficiency
- Never re-encode these

**For social media upload (Instagram, TikTok, X):**
- The platform re-encodes no matter what. Upload the highest quality H.264 or H.265 source you have.
- Resolution matching the platform's native spec saves re-encoding artifacts.

## Compress Your Videos Right Now

You do not need to configure FFmpeg manually. [Optimage](/) handles video compression with sensible defaults optimized for web delivery. Upload your video, choose your quality target, and download a compressed file that actually loads fast.

Want more guides like this? [Join our newsletter](/) for weekly insights on media optimization and web performance. No spam, unsubscribe any time.

## Summary

CRF controls quality, not file size. Presets control encoding speed vs compression efficiency, not quality. The codec determines the maximum compression ceiling. Use H.264 for broad compatibility, and only reach for H.265 or AV1 when you can afford slower encoding and need maximum storage efficiency. Most developers are either over-compressing (bad quality) or under-compressing (oversized files) because they never understood these three independent variables.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question","name": "What CRF value should I use for H.264 video?","acceptedAnswer": {"@type": "Answer","text": "CRF 23 is the H.264 default and produces good quality for most content. Use CRF 18-20 for near-lossless archival or source files where quality is paramount. Use CRF 22-24 for web video like product demos and tutorials where you want good quality at moderate file sizes. Use CRF 28-32 for silent background videos where smaller file size is more important than perfect quality. Remember: CRF controls perceptual quality, not file size — a complex action scene at CRF 23 will be much larger than a static talking-head clip at the same CRF."}},
    {"@type": "Question","name": "What is the difference between H.264, H.265, and AV1?","acceptedAnswer": {"@type": "Answer","text": "H.264 has near-universal browser support (99.9%) and encodes quickly, making it the practical default for web delivery. H.265 produces the same visual quality at roughly 40% smaller file sizes but has lower browser support (85%) and encodes more slowly. AV1 is approximately 50% more efficient than H.264 at equivalent quality and has 92% browser support, but encodes very slowly on software encoders. For web video in 2026, use H.264 for broad compatibility, H.265 for storage-first scenarios where you control playback, and AV1 for archive files or platforms that deliver AV1 natively (like YouTube)."}},
    {"@type": "Question","name": "Does the FFmpeg preset affect video quality?","acceptedAnswer": {"@type": "Answer","text": "No. The preset (ultrafast through veryslow) controls how much CPU work the encoder does to find the most efficient encoding at your target CRF — it does not change quality. A veryslow preset produces a smaller file at the same CRF value than ultrafast, because the encoder searches more thoroughly for efficient motion vectors and partition sizes. Use slow or medium for production encodes where you want the best size efficiency. Use ultrafast or fast for real-time encoding or server-side processing where latency matters."}},
    {"@type": "Question","name": "What is the difference between CBR, VBR, and ABR video encoding?","acceptedAnswer": {"@type": "Answer","text": "CBR (Constant Bit Rate) uses exactly the same number of bits every second — reliable for buffering but inefficient, wasting bits on static scenes and starving complex scenes. VBR (Variable Bit Rate) allocates more bits to complex scenes and fewer to simple ones, producing better quality but less predictable bandwidth. ABR (Average Bit Rate) targets a specific average bitrate while allowing local variation — the approach used by most streaming platforms. For file delivery and uploads, CRF-based encoding (quality-based, not bitrate-based) is generally superior. Use bitrate modes when streaming protocols require predictable bandwidth."}}
  ]
}
</script>
