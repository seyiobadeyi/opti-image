---
title: "The EU's AI Watermarking Deadline Already Passed. Does Compressing an Image Break Compliance?"
date: "2026-08-31T17:00:00Z"
excerpt: "Article 50 of the EU AI Act took effect August 2, 2026, requiring machine-readable disclosure on AI-generated images. Adobe Firefly, DALL-E, Sora, and Google Imagen already embed C2PA credentials — but almost nothing has tested what a normal resize or compression pass does to that metadata."
keyTakeaways:
  - "Article 50 of the EU AI Act became enforceable August 2, 2026, requiring generative AI image output to carry machine-readable disclosure"
  - "Adobe Firefly, OpenAI's DALL-E 3 and Sora, and Google Imagen already embed C2PA Content Credentials by default; Midjourney remains the most prominent holdout and carries direct regulatory exposure as a result"
  - "Instagram, X, and WhatsApp all strip C2PA metadata during their own upload recompression, which the European Commission's own guidance implicitly treats as an unsolved problem"
  - "OpenAI added a second authentication layer in May 2026 by licensing Google DeepMind's SynthID watermark, since an invisible pixel-level watermark can survive some transformations a metadata tag cannot"
  - "A basic resize or requantization pass through a standard image tool can strip C2PA's metadata-based credential even when the visible image is otherwise unchanged"
summary: "C2PA credentials live in image metadata, and metadata is exactly what most compression and resizing tools discard by default to save file size. That means the most common thing anyone does to an AI-generated image before publishing it — shrinking it for the web — can silently remove the very disclosure Article 50 now requires, and almost no one publishing AI images at scale has checked for this."
faq:
  - question: "What does Article 50 of the EU AI Act require?"
    answer: "It requires that outputs from generative AI systems be marked in a machine-readable format that's detectable as artificially generated, for any content reaching users in the EU. It became enforceable on August 2, 2026, and the European Commission's Code of Practice names C2PA Content Credentials as an example compliant mechanism."
  - question: "Does resizing or compressing an AI-generated image remove its C2PA credential?"
    answer: "It can. C2PA Content Credentials are typically stored as metadata embedded in the image file, and many resizing, compression, and re-encoding tools strip metadata by default as part of reducing file size, which removes the credential even though the visible image content is unaffected."
  - question: "Which major AI image generators don't support C2PA yet?"
    answer: "Midjourney is the most prominent mainstream generator that does not embed C2PA credentials by default as of August 2026, which puts it in direct tension with Article 50's requirements for any output reaching EU users, unless its approach changes."
---

![A close-up of image metadata being inspected in an editing application](/image-9.png)

**Article 50 of the EU AI Act has been enforceable for almost a month now, and the compliance conversation so far has mostly been about which AI tools embed a disclosure credential at generation time — not about what happens to that credential the moment anyone actually uses the image afterward.** That's the gap worth closing: C2PA Content Credentials, the mechanism the European Commission names as an example compliant approach, live in file metadata. Metadata is precisely what a huge share of ordinary image tools discard by default, because stripping it is one of the easiest ways to shrink a file.

## What Actually Changed on August 2

Adobe Firefly, OpenAI's DALL-E 3 and Sora, and Google Imagen already ship C2PA credentials embedded in their output, which is genuinely good news — the biggest names in mainstream AI image generation were already positioned to comply before the deadline arrived. Midjourney is the clear exception: it remains the most prominent generator without default C2PA support, which means any Midjourney output reaching an EU user right now sits in direct tension with the law as written, unless that changes soon.

OpenAI went a step further back in May, licensing Google DeepMind's SynthID watermark as a second layer alongside C2PA metadata and previewing a public verification tool that checks both marks at once. That two-layer approach exists for a specific reason: an invisible, pixel-level watermark like SynthID can survive some transformations that a metadata tag can't, which is a meaningful hedge against exactly the problem this post is about.

<div class="svg-stat-row" role="presentation" aria-label="EU AI Act Article 50 facts">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:32px auto;display:block">
  <style>
    .stat-num { font: 700 26px/1 system-ui,sans-serif; fill: #db5a42; }
    .stat-lbl { font: 500 13px/1 system-ui,sans-serif; fill: #374151; }
    .stat-bar { animation: fadeUp 0.6s ease-out both; }
    .stat-bar:nth-child(2) { animation-delay: 0.15s; }
    .stat-bar:nth-child(3) { animation-delay: 0.3s; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  </style>
  <g class="stat-bar">
    <rect x="30" y="20" width="190" height="70" rx="12" fill="#fdf3f1"/>
    <text x="125" y="62" text-anchor="middle" class="stat-num">Aug 2</text>
    <text x="125" y="82" text-anchor="middle" class="stat-lbl">2026 — Article 50 took effect</text>
  </g>
  <g class="stat-bar">
    <rect x="255" y="20" width="190" height="70" rx="12" fill="#fdf3f1"/>
    <text x="350" y="62" text-anchor="middle" class="stat-num">4</text>
    <text x="350" y="82" text-anchor="middle" class="stat-lbl">Major generators with default C2PA</text>
  </g>
  <g class="stat-bar">
    <rect x="480" y="20" width="190" height="70" rx="12" fill="#fdf3f1"/>
    <text x="575" y="62" text-anchor="middle" class="stat-num">3</text>
    <text x="575" y="82" text-anchor="middle" class="stat-lbl">Major platforms known to strip it on upload</text>
  </g>
</svg>
</div>

## The Metadata Problem the Guidance Already Half-Admits

The European Commission's own Code of Practice recommends a multi-layer approach — metadata plus invisible watermarking plus logging — rather than relying on any single mechanism alone. That combination isn't there for redundancy's sake; it's an acknowledgment that metadata-only credentials are fragile in practice. Instagram, X, and WhatsApp all strip C2PA data during their own recompression pipeline when a user uploads an image, which means the moment a compliant, C2PA-tagged AI image gets posted to any of the platforms where images actually circulate, the credential is already gone before another human being sees it.

That's a platform-level problem regulators have acknowledged but not solved. The part almost nobody is talking about sits one step earlier: the same fate applies to a completely ordinary, non-adversarial action — someone resizing an AI-generated image for their own website, or running it through a compression tool to make a page load faster. Most image-processing tools treat metadata as disposable weight to shed, precisely because dropping it is a quick, safe way to reduce file size without touching visible pixels. A credential embedded specifically to survive scrutiny can be gone after a completely routine, well-intentioned edit that had nothing to do with hiding anything.

## What This Means If You Publish AI-Generated Images

1. **Check whether your image pipeline preserves or strips metadata before you build a workflow around C2PA compliance.** Many popular compression and resizing tools default to stripping it; some offer a metadata-preserving mode that isn't the default and has to be turned on deliberately.
2. **Understand that "compliant at generation" doesn't mean "compliant at publication."** The credential your AI tool embedded is only as durable as every step the image passes through afterward — your own CMS, your own image optimization step, any third-party hosting.
3. **Don't assume a social platform repost carries the same disclosure the original file did.** If disclosure matters for your use case, the visible watermark or in-image labeling approach survives platform recompression in a way metadata alone does not.
4. **If you're building or choosing an image tool for a workflow that includes AI-generated content, ask specifically whether it has a metadata-preserving export option** — this is not yet a standard checkbox most tools advertise clearly.

## The Practical Takeaway

Article 50 put a real deadline on AI disclosure, and the major generators mostly did their part before it arrived. The open question now isn't whether the credential gets created — it's whether it survives the ordinary journey an image takes after that: a resize, a compression pass, a repost. That's a solvable problem, but only if it's treated as a real step in the pipeline instead of an assumption nobody checked.

**Related reading:**
- [The EU AI Act Is Live: What Website Owners Must Know About AI Images](/blog/eu-ai-act-images-websites-2026) — the original compliance guide from before the deadline arrived
- [Compress AI-Generated Images: Midjourney and DALL-E, 2026](/blog/compress-ai-generated-images-midjourney-dalle-2026) — practical compression guidance for AI images specifically
- [X's Grok Everywhere: An AI Fake Detection Photo Guide](/blog/x-grok-everywhere-ai-fake-detection-photo-guide) — the detection side of the same authenticity problem
