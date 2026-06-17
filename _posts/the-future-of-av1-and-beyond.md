---
title: "The Future of AV1 and Beyond: Why the Codec Wars Are Finally Ending"
date: "2026-02-19T20:30:00Z"
excerpt: "For two decades, the web has desperately sought a universal, royalty-free codec. With AV1 achieving near-ubiquity in 2026, we explore what comes next, and why H.265 is slowly fading into irrelevance."
variants:
  - excerpt: "AV1 won the codec wars not just because it was free, but because it was designed for streaming at 'starvation bitrates' — pushing acceptable quality at 800 kbps where HEVC falls apart into blocks. In 2026, hardware decode support is on every chip and the battle is over."
    keyTakeaways:
      - "AVIF (AV1 still images) averages 30% smaller than equivalent WebP files across real-world content"
      - "AV1 hardware decode is now standard on AMD RDNA, Nvidia Ada, Intel Meteor Lake, and Apple M3"
      - "VVC (H.266) is technically superior to AV1 but is patent-encumbered — browsers will not adopt it"
      - "Neural codecs outperform AV1 by 40% in PSNR — but are still too slow for mobile real-time decode"
  - excerpt: "The image format successor to WebP isn't a new standalone format — it is AVIF, the AV1 video codec applied to still images. It supports 10-bit color depth, lossless alpha, and sub-pixel chroma that prevent text bleeding over photos. WebP has no equivalent for any of these."
    keyTakeaways:
      - "AVIF supports 10 and 12-bit color depth — critical for HDR displays that WebP cannot fully utilize"
      - "AV2 is in active research with a target 30% efficiency gain over AV1; expect finalized bitstreams ~2028"
      - "Serve AVIF as primary source in <picture> tags with WebP fallback — this covers 97%+ of browsers"
      - "HEVC's three overlapping patent pools remain the single biggest reason browsers chose AV1 over it"
  - excerpt: "Neural image compression — AI autoencoders that compress a 'latent space' rather than DCT blocks — already outperforms AV1 by 40% in PSNR scores. When NPUs become universal hardware by 2027-2028, the line between 'compressed image' and 'AI-upscaled image' will blur completely."
    keyTakeaways:
      - "Neural codecs compress latent feature space, not pixel blocks — fundamentally different architecture"
      - "Google Research and Meta AI both have neural codec programs that beat AV1 in perceptual quality metrics"
      - "Use av1_nvenc or QuickSync for backend AV1 encoding — raw CPU libaom-av1 is prohibitively slow"
      - "CDN metadata stripping squeezes the last 5% from AVIF payloads — always configure it"
---

## The Long Road to Royalty-Free Video

For the longest time, distributing high-quality video or highly compressed images on the web was a legal minefield. If you used H.264, you owed licensing fees to MPEG LA. If you used H.265 (HEVC), you owed fees to three different patent pools with contradictory overlapping royalties. In an ecosystem built on open standards, the foundational layer of visual media was heavily gated.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 32px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">30%</text><text x="110" y="78" text-anchor="middle" class="sl">AVIF smaller than WebP</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">2028</text><text x="350" y="78" text-anchor="middle" class="sl">AV2 finalized bitstream target</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">40%</text><text x="590" y="78" text-anchor="middle" class="sl">Neural codec PSNR gain over AV1</text></g>
</svg>
</div>

Then came the Alliance for Open Media (AOMedia). Backed by everyone from Google and Netflix to Microsoft and Apple, the mandate was simple: construct a world-class, ultra-efficient codec that is entirely open and royalty-free. The result was **AV1**, and its derivative image format, **AVIF**.

Now, in 2026, the war is effectively over. AV1 has won. But understanding *why* it won, and what technologies are poised to follow it, provides a fascinating look into internet infrastructure.

## Why AV1 Surmounted the HEVC Monopoly

It is crucial to understand that AV1 didn't win solely because it was "free." It won because it was structurally better suited for the internet delivery model.

### 1. Superior Compression Efficiency at Low Bitrates

AV1 was designed with streaming logic first. While HEVC performs admirably at 4K Blu-Ray bitrates (20-40 Mbps), AV1's intra-frame prediction logic excels at "starvation bitrates." When Netflix has to push a 720p stream to a rural mobile connection at 800 kbps, AV1 maintains temporal stability (less blockiness) far better than HEVC.

### 2. The Great Hardware Unification

The major critique of AV1 in its early years (2018-2022) was its computational complexity. Decoding 4K AV1 software effectively melted laptop batteries.

However, the hardware industry synchronized remarkably well. By 2024, AMD's RDNA architectures, Nvidia's Ada Lovelace, Intel's Arc/Meteor Lake, and critically, Apple's M3 and A17 Pro chips all included dedicated hardware AV1 decoders. In 2026, trying to find a newly manufactured smartphone without AV1 decode capabilities is virtually impossible.

### 3. Apple's Tipping Point

The format wars truly ended the day Apple capitulated. Historically heavily invested in HEVC, Apple's inclusion of AV1 hardware decoding in their silicon and full support in macOS and iOS signaled to the entire web development community that AVIF and AV1 were safe to deploy universally without fear of rendering blank squares on iPhones.

## The Image Evolution: AVIF Replacing WebP

<figure role="img" aria-label="Codec evolution timeline: VP8 to WebP to AV1/AVIF" style="margin:32px 0">
<svg viewBox="0 0 660 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block;margin:0 auto">
  <style>.px{animation:pi .5s ease-out both}.px:nth-child(1){animation-delay:0s}.px:nth-child(2){animation-delay:.2s}.px:nth-child(3){animation-delay:.4s}@keyframes pi{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}.pn{font:700 13px system-ui,sans-serif;fill:#db5a42}.pt{font:500 11px system-ui,sans-serif;fill:#374151}</style>
  <defs><marker id="arc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L0,6L8,3z" fill="#d1d5db"/></marker></defs>
  <g class="px"><rect x="10" y="15" width="175" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="97" y="46" text-anchor="middle" class="pn">VP8 → WebP</text><text x="97" y="66" text-anchor="middle" class="pt">8-bit · OK compression</text></g>
  <line x1="188" y1="50" x2="238" y2="50" stroke="#d1d5db" stroke-width="2" marker-end="url(#arc)"/>
  <g class="px"><rect x="243" y="15" width="175" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="330" y="46" text-anchor="middle" class="pn">AV1 → AVIF</text><text x="330" y="66" text-anchor="middle" class="pt">10-bit · 30% better than WebP</text></g>
  <line x1="421" y1="50" x2="471" y2="50" stroke="#d1d5db" stroke-width="2" marker-end="url(#arc)"/>
  <g class="px"><rect x="476" y="15" width="175" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="563" y="46" text-anchor="middle" class="pn">AV2 / Neural</text><text x="563" y="66" text-anchor="middle" class="pt">30-40% better than AV1 · 2028+</text></g>
</svg>
</figure>

AVIF is simply an AV1-encoded intra-frame wrapped in an ISOBMFF container. It is the photographic byproduct of the video wars, and its dominance in 2026 over WebP is profound.

WebP (based on the VP8 video codec) was a massive leap forward from JPEG, but it suffered from limited color depth and poor high-frequency detail retention. AVIF natively supports:
- 10-bit and 12-bit color depth (crucial for HDR displays)
- Lossless alpha channels that rival PNG sizes
- Sub-sampling capabilities that prevent color bleeding in text overlays over photographs.

Our telemetry at Optimage consistently shows AVIF files averaging 30% smaller than equivalent WebP files, a staggering reduction when extrapolated across an entire CDN.

## But What Lies Beyond AV1? Enter AV2 and VVC

Technology despises a vacuum. Even as AV1 completes its deployment phase, the successors are already heavily in development.

### VVC (Versatile Video Coding / H.266)
Developed by the Joint Video Experts Team (JVET), VVC is the formal successor to HEVC. It promises another 30-50% bitrate reduction over HEVC. It is incredibly efficient, particularly for 8K and 360-degree VR content.

However, VVC suffers from the exact same genetic defect as its predecessor: suffocating patent licensing structures. Despite its technical brilliance, web browsers (notably Chrome and Firefox) remain staunchly opposed to subsidizing patent pools for standard web infrastructure. VVC will likely dominate the broadcast television and physical media realms, but struggle on the open web.

### AV2: The AOMedia Sequel
AOMedia isn't resting. AV2 is actively in the research phase. The goal is straightforward: achieve a 30% compression efficiency gain over AV1, while ensuring hardware implementers can reuse significant portions of the AV1 silicon architecture.

Early proposals for AV2 include:
- Enhanced machine learning-based loop filters.
- Better non-local spatial prediction methods.
- More granular block partitioning.

Expect to see finalized bitstreams for AV2 around 2028.

## The Role of Neural and AI Codecs

Here is where standard block-based codecs meet their existential threat. Organizations like Meta AI and Google Research are increasingly pivoting away from traditional mathematics-based video encoding.

Instead of defining specific mathematical transforms (like DCT), **Neural Image Compression** uses autoencoders. An AI model analyzes an image, compresses the latent space features into a tiny payload, and a corresponding AI model on the user's device "hallucinates" the details back upon decoding.

While currently too computationally intensive for widespread real-time decoding on mobile battery, Neural Codecs routinely achieve PSNR scores that outperform AV1 by 40%. As Neural Processing Units (NPUs) become standard hardware in every device by 2027, the line between "video compression" and "AI generative upscaling" will blur completely.

## Practical Architecture for Today

While neural codecs and AV2 dominate engineering papers, your architecture today needs stability.

1. **Serve AVIF as your primary image source.** Use the `<picture>` tag gracefully falling back to WebP.
2. **Utilize hardware encoding.** If your backend relies on FFmpeg, ensure you are utilizing `av1_nvenc` or QuickSync rather than raw CPU encoding with `libaom-av1` unless quality per byte is absolutely paramount over speed.
3. **Optimize your delivery.** Ensure your CDN strips unnecessary metadata natively to squeeze the last 5% out of an AVIF payload.

The codec war is over, and the Open Web finally won. Now, it is time to optimize the peace.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Should I use AVIF or WebP for images in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use AVIF as your primary format with WebP as fallback in a <picture> element. AVIF averages 30% smaller than equivalent WebP files and supports 10-bit color depth and better alpha channel compression. Browser support for AVIF reached over 93% globally in 2026 after Apple added full AVIF support. The <picture> element with AVIF source and WebP fallback covers over 97% of browsers with the best available format for each."
      }
    },
    {
      "@type": "Question",
      "name": "Why did AV1 win over H.265 (HEVC)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AV1 won for two reasons: it is royalty-free (HEVC requires payments to three overlapping patent pools), and it was designed for streaming at low bitrates where it outperforms HEVC. The decisive moment was Apple adding AV1 hardware decode to their M3 and A17 Pro chips in 2023, which removed the last major platform holdout. By 2024, all major GPU vendors (AMD, Nvidia, Intel) had hardware AV1 decoders."
      }
    },
    {
      "@type": "Question",
      "name": "When will AV2 be ready?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AV2 is in active research and early proposal stages as of 2026. The Alliance for Open Media is targeting a 30% compression efficiency gain over AV1. Finalized bitstreams are expected around 2028, followed by a similar 3-5 year hardware deployment cycle before widespread browser and device support. VVC (H.266) is technically available now but is patent-encumbered and will not be adopted by web browsers."
      }
    },
    {
      "@type": "Question",
      "name": "What are neural image codecs and when will they replace AV1?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Neural image codecs use AI autoencoders to compress a 'latent space' representation of an image rather than DCT blocks. The decoder then reconstructs image details from this compressed representation. Current neural codecs outperform AV1 by 40% in PSNR scores but require significant compute for real-time decode — too much for current mobile hardware. As NPUs become universal hardware in devices around 2027-2028, neural codecs will become practical for consumer delivery."
      }
    }
  ]
}
</script>
