---
title: "King of the Hill Season 15 Premieres Tomorrow on Hulu. Animated Screenshots Compress Completely Differently Than Live Action."
date: "2026-07-19T14:00:00Z"
excerpt: "King of the Hill's revival returns for Season 15 on Hulu on July 20. If you're planning to screenshot and share scenes the way you would a live-action show, know that flat-color animation compresses in a way that punishes the wrong settings hard."
keyTakeaways:
  - "King of the Hill Season 15 premieres on Hulu on July 20, continuing the revival of the animated series"
  - "Flat-color animation like King of the Hill's is far more prone to visible banding and blocky artifacts under standard JPEG compression than live-action footage"
  - "The fix isn't a higher quality setting on JPEG — it's picking a format built for flat color fields in the first place"
  - "PNG or WebP in lossless mode preserve flat color edges that JPEG consistently smudges, at a manageable file size for a single screenshot"
---

![A television screen showing a flat-color animated scene, with a visible blocky compression artifact along a color boundary](/image-5.png)

**King of the Hill's Season 15 premieres on Hulu tomorrow, July 20, and if you're planning to screenshot scenes to share the way you would any other show, the compression math is different here than it is for live action.** Flat-color animation is one of the hardest image types to compress well with the tools most people default to, and it's not obvious why until you understand what JPEG is actually built to handle.

## Why Animated Screenshots Look Worse Than You'd Expect

JPEG compression works by smoothing gradual transitions between similar colors — it's genuinely good at this, which is why it's the default format almost everywhere and why live-action screenshots usually hold up fine even at moderate compression. Animation like King of the Hill's works against that assumption completely. Its color fields are flat and its edges are hard — a character's shirt is one solid color right up to a crisp boundary with the background, with no gradual transition for JPEG's compression algorithm to exploit. Forced to compress a hard edge the same way it compresses a soft one, JPEG introduces visible blocky artifacts and color banding right along the boundary — exactly where the human eye is most likely to notice it, because that's where the actual shape information lives.

<div class="svg-stat-row" role="presentation" aria-label="Key statistics">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:32px auto;display:block">
  <style>
    .stat-num { font: 700 32px/1 system-ui,sans-serif; fill: #db5a42; }
    .stat-lbl { font: 500 13px/1 system-ui,sans-serif; fill: #374151; }
    .stat-bar { animation: fadeUp 0.6s ease-out both; }
    .stat-bar:nth-child(2) { animation-delay: 0.15s; }
    .stat-bar:nth-child(3) { animation-delay: 0.3s; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  </style>
  <g class="stat-bar">
    <rect x="20" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="120" y="62" text-anchor="middle" class="stat-num">S15</text>
    <text x="120" y="82" text-anchor="middle" class="stat-lbl">King of the Hill returns July 20 on Hulu</text>
  </g>
  <g class="stat-bar">
    <rect x="250" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="350" y="62" text-anchor="middle" class="stat-num">0</text>
    <text x="350" y="82" text-anchor="middle" class="stat-lbl">Gradual color transitions JPEG can exploit on a flat edge</text>
  </g>
  <g class="stat-bar">
    <rect x="480" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="580" y="62" text-anchor="middle" class="stat-num">2</text>
    <text x="580" y="82" text-anchor="middle" class="stat-lbl">Better format options for flat-color screenshots</text>
  </g>
</svg>
</div>

## The Bar Chart That Explains the Problem

<figure aria-label="Bar chart comparing visible artifact severity across formats for flat-color animation" role="img" style="margin:32px 0">
<svg viewBox="0 0 620 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:620px;display:block">
  <style>
    .bar-fill { animation: growWidth 1s cubic-bezier(.22,1,.36,1) both; transform-origin: left; }
    .bar-fill:nth-child(1) { animation-delay: 0s; }
    .bar-fill:nth-child(2) { animation-delay: 0.2s; }
    .bar-fill:nth-child(3) { animation-delay: 0.4s; }
    @keyframes growWidth { from { transform:scaleX(0); } to { transform:scaleX(1); } }
    .bar-label { font: 500 13px system-ui,sans-serif; fill: #374151; }
    .bar-val   { font: 700 13px system-ui,sans-serif; fill: #111827; }
  </style>
  <text x="10" y="38" class="bar-label">JPEG (standard)</text>
  <rect x="160" y="22" width="380" height="28" rx="4" fill="#e5e7eb"/>
  <rect x="160" y="22" width="380" height="28" rx="4" fill="#db5a42" class="bar-fill"/>
  <text x="550" y="41" class="bar-val">High banding</text>
  <text x="10" y="98" class="bar-label">WebP (lossless)</text>
  <rect x="160" y="82" width="70" height="28" rx="4" fill="#e5e7eb"/>
  <rect x="160" y="82" width="70" height="28" rx="4" fill="#db5a42" class="bar-fill" style="opacity:.75"/>
  <text x="240" y="101" class="bar-val">Minimal</text>
  <text x="10" y="158" class="bar-label">PNG</text>
  <rect x="160" y="142" width="40" height="28" rx="4" fill="#e5e7eb"/>
  <rect x="160" y="142" width="40" height="28" rx="4" fill="#db5a42" class="bar-fill" style="opacity:.55"/>
  <text x="210" y="161" class="bar-val">None</text>
</svg>
<figcaption style="text-align:center;font-size:0.78rem;color:#9ca3af;margin-top:8px">
  Visible banding on a hard-edged flat-color screenshot, by format
</figcaption>
</figure>

## What to Actually Do About It

1. **Skip the default JPEG screenshot format if your device offers a choice.** Most phones and screen-capture tools default to JPEG, which is the wrong call for flat-color animated content specifically.
2. **Use PNG for anything you're keeping as a reference or posting somewhere quality matters.** PNG is lossless, so it preserves hard edges perfectly — the tradeoff is a larger file, which is manageable for a single screenshot.
3. **Use WebP in lossless mode if file size matters more than PNG's simplicity.** It handles flat color fields cleanly while typically landing smaller than an equivalent PNG.
4. **If you're stuck with a JPEG someone else sent you, don't recompress it again.** Each additional JPEG pass compounds banding on the same edges — convert it to PNG or WebP once and stop touching it after that.

## Screenshots From a Revival Season Get Reposted a Lot

A returning show's first season back tends to generate an unusual volume of screenshot sharing — fans comparing the new season to the original, reaction images, meme templates pulled directly from new episodes. That's exactly the kind of content that gets re-saved, recompressed, and reposted dozens of times across group chats and fan accounts, which means starting from a format that doesn't degrade under repeated handling matters more than it would for a one-off share.

[Optimage's convert tool](/convert) switches a screenshot to PNG or WebP in the browser, free, and [compress](/compress) gets the file size down without reintroducing the banding a JPEG pass would.

**Related reading:**
- [Spooky in Love Netflix Screenshot Sharing Guide](/blog/spooky-in-love-netflix-screenshot-sharing-guide) — screenshot handling for a different new streaming release
- [Descendants: Wicked Wonderland Screenshot Guide](/blog/descendants-wicked-wonderland-screenshot-guide) — another animated-adjacent screenshot case
- [HEIC to JPG Free Converter](/blog/heic-to-jpg-free-converter) — format conversion basics for screenshots and photos
