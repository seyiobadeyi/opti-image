---
title: "TIFF vs PNG vs JPEG for Research Images: What AI-Accelerated Science Gets Wrong"
date: "2026-07-06T16:00:00Z"
excerpt: "Anthropic's new Claude Science tool is pushing drug discovery and genomics labs to generate more imaging output than ever. Most of that output is being saved in the wrong format, and the mistake is invisible until someone tries to reproduce the result."
keyTakeaways:
  - "TIFF is still the correct default for microscopy and any image where exact pixel values carry measurement data — it's lossless and supports 16-bit depth JPEG and PNG cannot match"
  - "PNG is the right choice for diagrams, protein structure renders, and anything with flat color or sharp lines, but its 8-bit-per-channel default loses precision that 16-bit scientific cameras capture"
  - "JPEG has no place in a data pipeline, but it's exactly right for the sharing layer — slide decks, preprints on social media, lab websites"
  - "The mistake costing labs the most right now is applying JPEG compression once, early, and never being able to recover the original measurement data"
summary: "AI research tools are generating scientific images faster than labs can properly archive them. The rule that matters: keep raw and analysis-stage images lossless (TIFF, 16-bit where the instrument supports it), and only convert to JPEG at the very last step, once for presentation, never for storage."
faq:
  - question: "Why is JPEG a bad format for scientific images?"
    answer: "JPEG uses lossy compression, which discards pixel data permanently to shrink file size. For images where you're doing quantitative analysis — measuring fluorescence intensity, comparing pixel values between samples, or feeding the image into further computational analysis — that discarded data can silently change your results. Once an image has been saved as JPEG, you cannot recover the original values; the loss is permanent from that point forward."
  - question: "Is PNG good enough for microscopy images?"
    answer: "PNG is lossless, which is the important property, but most microscopy cameras and instruments capture at 12-bit or 16-bit depth, and standard PNG only supports 8 bits per channel by default. If your instrument's native output is 16-bit, save your working files as 16-bit TIFF to preserve full dynamic range, and only convert to PNG or JPEG for the presentation-layer image you're actually going to share."
---

![A row of microscopy images at different compression levels, showing how fine cellular detail degrades at each step from lossless to heavily compressed](/image-5.png)

**Anthropic's newly launched Claude Science, focused on drug discovery, protein structure analysis, genomics, and computational biology, is going to make research labs generate more images per week than most of them have ever produced before — and a lot of those labs are about to save the wrong ones in the wrong format.** This isn't a hypothetical problem. It's the same mistake photography had to learn the hard way a decade ago, just now happening inside genomics pipelines and microscopy cores instead of camera rolls.

## Why This Matters More Now Than It Did Last Year

AI-assisted research tools generate output fast — batches of protein structure renders, annotated microscopy overlays, genomic visualization plots — at a volume that used to take a postdoc a week to produce by hand. When image generation speeds up by an order of magnitude, so does the rate at which a lab can accidentally standardize on the wrong export format across an entire pipeline, because nobody stopped to make the decision deliberately. The mistake that used to affect one figure in one paper now affects every figure a lab's AI-assisted workflow touches.

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
    <text x="120" y="62" text-anchor="middle" class="stat-num">16-bit</text>
    <text x="120" y="82" text-anchor="middle" class="stat-lbl">Native depth of most microscopy cameras</text>
  </g>
  <g class="stat-bar">
    <rect x="250" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="350" y="62" text-anchor="middle" class="stat-num">8-bit</text>
    <text x="350" y="82" text-anchor="middle" class="stat-lbl">What standard PNG/JPEG can store</text>
  </g>
  <g class="stat-bar">
    <rect x="480" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="580" y="62" text-anchor="middle" class="stat-num">0</text>
    <text x="580" y="82" text-anchor="middle" class="stat-lbl">Ways to recover data after JPEG loss</text>
  </g>
</svg>
</div>

## TIFF: The Correct Default for Anything That's Still Data

TIFF is uncompressed or losslessly compressed, and it's the only one of the three formats that comfortably supports the 12-bit and 16-bit depth that scientific cameras and instruments actually output. If you're saving a fluorescence microscopy image where the exact intensity value of each pixel is part of your quantitative analysis, TIFF at native bit depth is not optional — it's the only format on this list that doesn't quietly throw away information you might need six months from now when a reviewer asks you to reanalyze the data.

The tradeoff is file size. A 16-bit TIFF from a modern scientific camera can run into the hundreds of megabytes per image, and a genomics lab generating hundreds of these a week needs real storage planning, not a shared drive that fills up by Thursday.

## PNG: The Right Middle Ground for Renders and Diagrams

PNG is lossless like TIFF but almost always caps at 8 bits per channel in standard use, and it compresses noticeably smaller than uncompressed TIFF for images with flat color, sharp edges, and limited color palettes — which describes most protein structure renders, pathway diagrams, and annotated schematic figures generated by tools like AlphaFold visualizations or Claude Science's own output. For anything that isn't raw instrument data — a rendered 3D structure, a labeled diagram, a chart — PNG is usually the better call than TIFF, because you get losslessness without TIFF's storage cost, and it's universally supported in journals, slide software, and web publishing.

Where PNG goes wrong: teams that export raw 16-bit microscopy data straight to PNG for "convenience," not realizing they've silently truncated the bit depth down to 8 in the process. That's a one-way trip, same as JPEG, just less obviously lossy because PNG's own compression is lossless — the damage happened at the bit-depth conversion step, not the file compression step.

<figure aria-label="Bar chart comparing typical file sizes for a research image at each format" role="img" style="margin:32px 0">
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
  <text x="10" y="38" class="bar-label">TIFF (16-bit)</text>
  <rect x="140" y="22" width="420" height="28" rx="4" fill="#e5e7eb"/>
  <rect x="140" y="22" width="420" height="28" rx="4" fill="#db5a42" class="bar-fill"/>
  <text x="570" y="41" class="bar-val">180 MB</text>
  <text x="10" y="98" class="bar-label">PNG (8-bit)</text>
  <rect x="140" y="82" width="120" height="28" rx="4" fill="#e5e7eb"/>
  <rect x="140" y="82" width="120" height="28" rx="4" fill="#db5a42" class="bar-fill" style="opacity:.75"/>
  <text x="270" y="101" class="bar-val">22 MB</text>
  <text x="10" y="158" class="bar-label">JPEG (presentation)</text>
  <rect x="140" y="142" width="35" height="28" rx="4" fill="#e5e7eb"/>
  <rect x="140" y="142" width="35" height="28" rx="4" fill="#db5a42" class="bar-fill" style="opacity:.55"/>
  <text x="185" y="161" class="bar-val">3 MB</text>
</svg>
<figcaption style="text-align:center;font-size:0.78rem;color:#9ca3af;margin-top:8px">
  Same microscopy field of view, exported at each format's typical settings
</figcaption>
</figure>

## JPEG: Fine, But Only at the Very Last Step

JPEG's lossy compression makes it entirely wrong for storage or analysis, but it's genuinely the right tool for the last step in the pipeline — a figure going into a lab website post, a slide in a conference deck, a preprint summary shared on social media. Nobody analyzing pixel values needs those copies; they need something that loads fast and looks clean at screen resolution. The failure mode isn't using JPEG — it's using JPEG too early, on a file that still needed to function as data.

## The Rule That Actually Prevents This

1. **Keep every raw and analysis-stage image lossless, at native bit depth.** TIFF for anything coming straight off an instrument.
2. **Convert to PNG for rendered figures and diagrams once analysis is done** and you're building something for a paper, poster, or report.
3. **Only produce a JPEG copy at the point of external sharing** — the lab blog, the conference slide, the social media summary — and always keep the lossless original archived separately.
4. **Batch-convert deliberately rather than letting export defaults decide for you.** [Optimage's converter](/convert) handles TIFF, PNG, and JPEG conversions in bulk without touching your archived originals, which matters when a core facility is processing hundreds of images a week.

## The Takeaway

Faster AI-assisted research tools are a genuine acceleration for labs, but they also multiply whatever format mistake is already baked into a pipeline. Get the lossless-until-the-last-step rule right once, apply it consistently across however many images Claude Science or any other tool helps your lab generate this month, and the format choice stops being a risk to your data and becomes exactly what it should be: a presentation decision made at the very end, not an accident made at the beginning.

**Related reading:**
- [AVIF vs WebP vs JPEG: 2026 Benchmark](/blog/avif-vs-webp-vs-jpeg-2026-benchmark) — the underlying lossy vs. lossless tradeoffs applied to web images
- [PNG vs WebP for UI and Design Assets](/blog/png-vs-webp-for-ui-design-assets) — when lossless PNG is worth the file size cost
- [What Is EXIF Metadata and Why Strip It](/blog/what-is-exif-metadata-and-why-strip-it) — relevant when sharing research images publicly without exposing capture details

*Last updated: July 2026 · [Convert your research images in bulk free →](/convert)*
