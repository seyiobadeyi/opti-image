---
title: "Google's New AI Image Models Generate 4K Files. Here's What to Do With Them."
date: "2026-07-02T16:00:00Z"
excerpt: "Google launched Imagen 4 Ultra and Gemini 3 native image models this week, with support for up to 4K resolution output. The images are impressive. They're also enormous — and most people are uploading them directly to websites and marketing materials without any compression step. That's a fixable mistake."
keyTakeaways:
  - "Google's Imagen 4 Ultra and Gemini 3 image models (including Nano Banana 2) launched this week, with support for 2K and 4K resolution output respectively"
  - "A single Imagen 4 Ultra output at 2K can reach 8-15MB; Gemini 3 4K outputs can exceed 25MB — website-hostile file sizes"
  - "AI-generated images compress differently from photographs: the diffusion noise structure behaves like high-frequency image content and needs slightly higher quality settings than photos"
  - "WebP at quality 75-80 for AI images gives excellent results; AVIF at quality 65-72 is smaller but slower to encode — both dramatically outperform JPEG for AI art"
  - "Strip metadata before publishing: Gemini and Imagen outputs often embed the full generation prompt, model version, and API parameters in file metadata"
summary: "Google's new Imagen 4 Ultra and Gemini 3 image generation models produce genuinely impressive 4K outputs. They also produce enormous files — sometimes 25MB or more for a single image. Here's the compression workflow that gets those files to web-appropriate sizes without losing what makes the output worth generating in the first place."
faq:
  - question: "Why do AI-generated images need different compression settings than photos?"
    answer: "Photographs have natural image statistics: smooth gradients in skies, repetitive texture in fabric, sharp edges at object boundaries. AI-generated images have all of those features, but they also have a fine-grained noise structure created by the diffusion process — a subtle, randomized high-frequency pattern distributed across the entire image. JPEG compresses smooth areas efficiently and struggles with high-frequency content. AI image noise is high-frequency by nature, so JPEG at standard quality settings (quality 75-80) introduces more visible artifacts in AI images than in equivalent photos. WebP handles this better because its deblocking filter smooths out block-boundary artifacts that the noise structure exacerbates."
  - question: "Does Google's Imagen embed my prompt in the file?"
    answer: "Yes. Imagen 4 and Gemini native image outputs embed generation metadata including the text prompt used, the model version, and in some cases API request parameters in the file's metadata fields. If you're publishing these images on a website or sharing them publicly, strip the metadata first — it reveals your prompts, which may contain proprietary information, or simply information you'd prefer not to distribute with every use of the image. Use Optimage's strip-metadata option, or run the file through ImageOptim before publishing."
  - question: "Is Imagen 4 Ultra or Gemini 3 better for web use?"
    answer: "They solve different problems. Imagen 4 Ultra is the highest quality option in the Imagen family, with better text rendering and more detailed compositions at 2K resolution, and costs $0.06 per image. Gemini 3 (Nano Banana 2) supports up to 4K and integrates conversational editing, useful if you need to iterate on a composition. For web use, 2K is almost always sufficient — a 2000px wide image served at 1200px display width has comfortable downscale headroom and compresses to a manageable size. 4K output makes sense for print or very large-format digital displays; for a website hero image or blog post header, you're generating more resolution than you can use."
---

![A designer's screen showing an AI-generated image at high resolution alongside a file properties window showing a very large file size, the typical situation after generating from a modern AI image model](/image-9.png)

Google launched its new Imagen 4 family and updated Gemini native image models this week, and the output quality is genuinely significant. Imagen 4 Ultra at 2K produces compositions with better text rendering accuracy, more coherent fine detail, and more convincing lighting than its predecessors. The Gemini 3.1 Flash Image model (sometimes referred to by its internal name Nano Banana 2) takes 4K output to a broader audience through the API.

The images are impressive. They're also, by default, enormous.

A single Imagen 4 Ultra output at 2K resolution is typically 8-15MB in PNG format. A Gemini 3 native 4K output can reach 25MB or more. These are files designed for quality, not for web delivery — and the default assumption in Google's documentation is that you'll decide what to do with them afterward. Most people don't decide. They download and upload directly, and wonder why their landing page LCP is measured in seconds instead of milliseconds.

## What's Different About Compressing AI-Generated Images

If you've read the general guide to [compressing AI art from Midjourney and DALL-E](/blog/compress-ai-generated-images-midjourney-dalle-2026), the Gemini and Imagen workflow shares the same principles with a few model-specific differences.

The core challenge with all diffusion model output is the noise structure. Diffusion models generate images by starting from random noise and iteratively denoising toward the target image. Even in the final output, a faint residual pattern from that process remains — a fine-grained, high-frequency structure distributed across the image that doesn't correspond to real-world texture. It looks like mild grain or slight texture even in areas that should be perfectly smooth.

That noise structure matters for compression because:

**JPEG treats it as image content.** JPEG's discrete cosine transform encodes high-frequency variation, and diffusion noise is high-frequency by nature. JPEG spends compression budget on it the same way it would on real texture, which means you need a higher quality setting to avoid JPEG introducing block artifacts that compete visually with the diffusion noise. Standard photo quality settings (JPEG Q75) are too aggressive for AI images; Q80-85 is the practical minimum to avoid visible degradation.

**WebP handles it more gracefully than JPEG.** WebP's in-loop deblocking filter smooths out the block-boundary artifacts that JPEG introduces around the diffusion noise without blurring the underlying sharp detail. For equivalent file sizes, WebP produces visibly better results on AI-generated content.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 26px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 12px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">$0.06-0.13</text><text x="110" y="78" text-anchor="middle" class="sl">Per image cost, Imagen 4 Ultra/Gemini 3</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">25MB+</text><text x="350" y="78" text-anchor="middle" class="sl">Typical 4K AI image file size</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">~300KB</text><text x="590" y="78" text-anchor="middle" class="sl">Target after WebP Q78 compression</text></g>
</svg>
</div>

## Compression Settings Specifically for Gemini and Imagen Output

Here's what actually works for these models' output, based on their specific noise characteristics:

**For Gemini 3 (Nano Banana 2) 4K output:**
Gemini 3's native images have a relatively fine diffusion noise structure — less pronounced than older diffusion models but present. The 4K resolution means you're almost certainly downscaling before publishing, which also helps (downscaling averages out the noise). 

Start by downscaling to your actual display resolution: 1200-1600px for a website hero image, 800-1000px for a blog header. Then compress:
- WebP quality 78 → typically 250-450KB for a 1200px hero image
- AVIF quality 68 → typically 150-280KB for the same image
- JPEG quality 82 → typically 400-700KB, with more visible artifacts

**For Imagen 4 Ultra 2K output:**
Imagen 4's output tends to have smoother transitions and less diffusion noise than Gemini native — the Imagen family has been trained specifically for image quality rather than multimodal reasoning. This means you can compress slightly more aggressively.
- WebP quality 75 → typically 200-380KB for a 1200px hero image
- AVIF quality 65 → typically 120-220KB
- JPEG quality 80 → acceptable but noticeably worse at edges

**For Imagen 4 Fast (the low-cost option at $0.02/image):**
Imagen 4 Fast has a more pronounced noise structure than Ultra — it's the model you use when you need speed and cost, not maximum quality. For web use, compress conservatively: WebP quality 80-82, or JPEG quality 85+. Going more aggressive on this model introduces visible artifacts that weren't present in the Imagen 4 Ultra equivalent.

## The Metadata You're Probably Distributing Unknowingly

Google's Imagen and Gemini image generation APIs embed metadata in the output files. At a minimum, this typically includes:

- The text prompt used to generate the image
- The model and version (e.g., `imagen-4.0-ultra-generate-001`)
- The API request timestamp
- In some cases, safety evaluation results from the model's content filtering

If you're publishing these images on your website, in email newsletters, or anywhere publicly accessible, that metadata travels with the file unless you explicitly strip it. Your competitors can see your prompts. Your clients can see your workflow. Your privacy in terms of creative process is exposed by default.

Run any Imagen or Gemini output through Optimage's metadata-stripping step before publishing. It removes EXIF data, XMP fields, and any embedded text blocks while leaving the image pixel data intact. For a 15MB PNG that becomes a 300KB WebP, the metadata is irrelevant to the quality of the published result, but it's not irrelevant to your business.

## The Practical Workflow for Marketing and Web Use

<figure aria-label="Four-step compression workflow for Gemini and Imagen outputs" role="img" style="margin:32px 0">
<svg viewBox="0 0 700 110" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;display:block">
  <style>.px{animation:pi .5s ease-out both}.px:nth-child(1){animation-delay:0s}.px:nth-child(2){animation-delay:.18s}.px:nth-child(3){animation-delay:.36s}.px:nth-child(4){animation-delay:.54s}@keyframes pi{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}.pn{font:700 11px system-ui,sans-serif;fill:#db5a42}.pt{font:500 10px system-ui,sans-serif;fill:#374151}.arrow{fill:none;stroke:#d1d5db;stroke-width:2;marker-end:url(#arr)}</style>
  <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L0,6L8,3z" fill="#d1d5db"/></marker></defs>
  <g class="px"><rect x="10" y="15" width="140" height="75" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="80" y="44" text-anchor="middle" class="pn">① Download PNG</text><text x="80" y="62" text-anchor="middle" class="pt">Keep original lossless</text><text x="80" y="78" text-anchor="middle" class="pt">source archived</text></g>
  <line x1="153" y1="52" x2="180" y2="52" class="arrow"/>
  <g class="px"><rect x="183" y="15" width="140" height="75" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="253" y="44" text-anchor="middle" class="pn">② Resize to display</text><text x="253" y="62" text-anchor="middle" class="pt">1200-1600px for hero,</text><text x="253" y="78" text-anchor="middle" class="pt">800px for blog</text></g>
  <line x1="326" y1="52" x2="353" y2="52" class="arrow"/>
  <g class="px"><rect x="356" y="15" width="140" height="75" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="426" y="44" text-anchor="middle" class="pn">③ Compress WebP Q78</text><text x="426" y="62" text-anchor="middle" class="pt">Strip metadata,</text><text x="426" y="78" text-anchor="middle" class="pt">target &lt;400KB</text></g>
  <line x1="499" y1="52" x2="526" y2="52" class="arrow"/>
  <g class="px"><rect x="529" y="15" width="150" height="75" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="604" y="44" text-anchor="middle" class="pn">④ Publish WebP</text><text x="604" y="62" text-anchor="middle" class="pt">AVIF fallback optional</text><text x="604" y="78" text-anchor="middle" class="pt">for better LCP</text></g>
</svg>
</figure>

One thing worth noting about the 4K resolution support in Gemini 3: for most web applications, generating at 4K is actually counterproductive. The higher resolution means longer generation time, higher API cost, and a larger source file to compress down — but the published result at 1200px looks the same whether you compressed from 4K or 2K, because you're throwing away the same amount of resolution either way.

Generate at the resolution closest to your target display size, or at 2K if you want comfortable headroom. The 4K option is useful for print, large-format displays, and cases where you're genuinely going to use the full resolution. For a website, the LCP hero image at 1600px display width needs at most a 1600-2400px source.

At $0.06-0.13 per image, Imagen 4 Ultra and Gemini 3 outputs are worth treating as production assets rather than disposable sketches. Compressing them properly for web delivery is the last step that makes them actually useful in production — not an optional cleanup.

**Related reading:**
- [AI-Generated Images Are Beautiful and Enormous: Here Is How to Compress Them](/blog/compress-ai-generated-images-midjourney-dalle-2026) — the general guide covering Midjourney and DALL-E workflows
- [AVIF vs WebP vs JPEG 2026 Benchmark](/blog/avif-vs-webp-vs-jpeg-2026-benchmark) — format comparison with real performance numbers
- [What Is EXIF Metadata and Why Strip It](/blog/what-is-exif-metadata-and-why-strip-it) — why stripping metadata matters beyond just file size
