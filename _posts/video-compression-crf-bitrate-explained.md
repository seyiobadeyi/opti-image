---
title: "Video Compression Explained: CRF, Bitrate Modes, and Why Your Videos Are Too Large"
date: "2026-03-13T20:30:00Z"
excerpt: "Most developers reach for video compression tools without understanding what CRF, VBR, and codec selection actually control. This guide fixes that permanently."
---

## Why Your Compressed Video Is Still Too Large

You ran a video through a compression tool, the file came out at 80MB instead of 250MB, and you thought you were done. Then you checked the quality and it looked like it was filmed through a potato. Or the opposite: you compressed it, quality looks perfect, and the file is still 150MB.

Both outcomes point to the same root problem. You are turning compression knobs without understanding what they control. This guide changes that.

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
