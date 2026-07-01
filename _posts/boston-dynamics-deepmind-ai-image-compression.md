---
title: "Boston Dynamics Just Plugged Its Robots Into Google DeepMind — Here's What That Reveals About How AI Actually Processes Images"
date: "2026-07-01T19:00:00Z"
excerpt: "Boston Dynamics and Google DeepMind announced a partnership to wire Atlas robots to Gemini Robotics foundation models. It's a useful lens for a question most people don't think about: AI systems don't compress or process images the way consumer tools do — and the difference explains something important about why AI image understanding can fail on heavily compressed photos."
keyTakeaways:
  - "Boston Dynamics' Atlas robots use stereo depth cameras capturing hundreds of frames per second — that data is compressed as H.264 video for real-time transmission, not as JPEG still images"
  - "Neural networks trained on image data don't 'see' JPEG artifacts the way humans do — they can misinterpret compression artifacts as real visual features, which degrades model performance"
  - "Training datasets for AI vision models (ImageNet, LAION) are stored in high-quality or lossless formats specifically to prevent compression artifacts from becoming false 'features' the model learns"
  - "When you submit a photo to an AI tool like GPT-4o's vision API or Gemini Vision, a heavily JPEG-compressed image loses edge detail and texture that the model uses for identification — quality matters for AI too"
  - "The robot and the consumer tool both need the same thing from their images: preserved spatial gradients and edge information — which is exactly what quality-preserving compression protects"
faq:
  - question: "What image format do robots like Atlas actually use to process visual data?"
    answer: "Not JPEG. Industrial robot cameras output raw sensor data that gets processed in real-time by the onboard computer. For transmission and logging, the video stream is typically compressed using H.264 or H.265 video codecs — which are temporally aware (they use previous frames to compress the current one) rather than compressing each frame independently like JPEG. For depth data specifically, robots use specialized formats like ROS depth image messages or floating-point depth maps that preserve the continuous range information needed for spatial reasoning."
  - question: "Does image compression quality affect how well AI tools analyze a photo?"
    answer: "Yes, measurably. AI vision models — including the ones powering ChatGPT vision, Gemini Vision, and Claude's image understanding — process photos by extracting feature representations from them. JPEG artifacts (block edges, ringing, chroma smearing) look like real edges and texture variations to a neural network's early convolutional layers. A heavily compressed photo of a document will have lower OCR accuracy than a high-quality version of the same document. A compressed product photo submitted to an AI classifier will have lower confidence scores for fine details like brand logos or material texture."
---

![A humanoid robot in an industrial setting, its stereo cameras visible on the head unit, representing the kind of AI-driven machine vision system where image compression choices directly affect performance](/image-8.png)

Google DeepMind and Boston Dynamics announced a partnership this week to integrate DeepMind's Gemini Robotics foundation models with Boston Dynamics' next-generation Atlas humanoid robots. The premise: Atlas gets a brain upgrade, using DeepMind's AI to handle more complex, real-world tasks that require understanding context rather than just following pre-programmed movements.

The robotics story is interesting on its own. What's more useful for thinking about how images work — and why compression matters — is what it reveals about how AI systems actually see and process visual data, which is fundamentally different from how human image formats are built.

## What a Robot's Camera Actually Captures

Atlas has stereo cameras — two calibrated cameras at a fixed distance from each other, capturing simultaneous frames that can be used to compute depth. The robot uses those depth maps to understand the three-dimensional structure of its environment in real time: where is the floor, how far away is the obstacle, what is the shape of the object it's about to pick up.

The cameras capture at roughly 60 to 100 frames per second for navigation, with some additional sensors running faster for collision detection. At even 60fps at 1920×1080 resolution, that's 60 images per second per camera — 120 raw images per second from just the main stereo pair. This cannot be stored or transmitted as individual JPEG files. The data rate would be unmanageable and the inter-frame redundancy (most of the scene doesn't change frame-to-frame) would be thrown away.

Instead, robot vision systems use video codecs — typically H.264 or H.265. Video codecs are fundamentally different from still image codecs: they encode temporal differences between frames (if a pixel hasn't changed, why encode it again?), which achieves far higher compression ratios for moving camera feeds than any per-frame codec can. For depth data specifically, robots use floating-point formats that preserve the continuous range of distance values rather than mapping to the 0–255 integer range of consumer image formats.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 26px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="55" text-anchor="middle" class="sn">60–100</text><text x="110" y="75" text-anchor="middle" class="sl">Frames per second Atlas cameras capture</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="55" text-anchor="middle" class="sn">H.264</text><text x="350" y="75" text-anchor="middle" class="sl">Video codec used for robot vision transmission</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="55" text-anchor="middle" class="sn">~40%</text><text x="590" y="75" text-anchor="middle" class="sl">Accuracy drop for AI on heavily compressed photos</text></g>
</svg>
</div>

## Why Neural Networks Don't See Compression the Way Humans Do

Here's the part that matters for how you submit images to AI tools. When a human looks at a JPEG that's compressed too hard, they see blurriness, block edges, colored fringing. These are recognizable as compression artifacts — things that "look wrong" — and a human viewer knows to discount them.

Neural networks don't have this abstraction. A convolutional neural network's early layers respond to edges, gradients, and texture patterns. A JPEG block boundary — the hard edge between two 8×8 compression blocks — looks like a real edge to the network's feature detectors. Ringing artifacts around text or logos look like real texture variations. The network's early layers extract features from these artifacts just as readily as from real image content, which propagates errors through the model.

This is well-documented in the adversarial examples literature: extremely subtle pixel-level changes can dramatically change a neural network's output while looking completely unchanged to a human. Compression artifacts are a less extreme version of the same phenomenon — they introduce systematic pixel-level corruption that the model wasn't trained to ignore.

## What This Means When You Use AI Image Tools

When you submit a photo to GPT-4o vision, Gemini Vision, or any AI image tool, the model is processing your image through a pipeline that extracts feature representations. The quality of those features depends on the quality of the input image.

Practical examples where compression quality matters:

**Document OCR:** A scan of a document compressed at JPEG Q60 will have lower text recognition accuracy than the same scan at Q92, particularly for small fonts, handwriting, or documents with complex backgrounds. The block artifacts around letter edges confuse character boundary detection.

**Product identification:** An AI tool identifying a product from a photo will have lower confidence for brand logos, fine texture (fabric material, surface finish), and small text on packaging when the source image is heavily compressed.

**Medical imaging:** This is where the stakes are highest. Radiological images are stored in DICOM format at lossless quality for this exact reason — JPEG compression of an X-ray or MRI scan can make real pathological features ambiguous or create artifact patterns that resemble findings.

**Face recognition:** Recognition accuracy for face verification systems degrades measurably below JPEG Q80 for typical portrait photos. Compression smears the fine detail around eye features that face recognition models rely on for matching.

## Training Data Is Stored Losslessly for a Reason

The AI models that are now powering Gemini Robotics in Atlas robots were trained on massive image datasets. ImageNet — one of the foundational training sets for image classification — is distributed as individual JPEG files, but at high quality settings (typically Q95+). LAION-5B, a more recent large-scale dataset, stores images at their source quality rather than re-compressing them.

This is deliberate. If a neural network trains on millions of JPEG-compressed images, it learns to recognize compression artifacts as normal. It builds a feature extractor calibrated to operate on slightly degraded input. That works fine if all your inference images are at the same compression level, but it degrades performance when you need the model to identify fine-grained features.

The robots being trained at Boston Dynamics and DeepMind are processing sensor data that never passes through consumer compression codecs. Their training data is sensor captures or high-fidelity simulations. The result is models that are very good at interpreting clean, high-quality visual input — and potentially more sensitive to degradation from consumer-grade compression than a model trained on JPEG data would be.

<figure aria-label="How image compression quality affects AI vision pipeline performance" role="img" style="margin:32px 0">
<svg viewBox="0 0 660 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>
    .step-box4 { animation: popIn4 0.5s ease-out both; }
    .step-box4:nth-child(1) { animation-delay: 0s; }
    .step-box4:nth-child(2) { animation-delay: 0.2s; }
    .step-box4:nth-child(3) { animation-delay: 0.4s; }
    @keyframes popIn4 { from { opacity:0; transform:scale(.85); } to { opacity:1; transform:scale(1); } }
    .step-num4 { font: 700 13px system-ui,sans-serif; fill: #db5a42; }
    .step-txt4 { font: 500 11px system-ui,sans-serif; fill: #374151; }
    .arrow4 { fill: none; stroke: #d1d5db; stroke-width: 2; marker-end: url(#arr4); }
  </style>
  <defs>
    <marker id="arr4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#d1d5db"/>
    </marker>
  </defs>
  <g class="step-box4">
    <rect x="10" y="20" width="180" height="90" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="100" y="48" text-anchor="middle" class="step-num4">Low quality image</text>
    <text x="100" y="67" text-anchor="middle" class="step-txt4">JPEG Q60 or messenger-</text>
    <text x="100" y="82" text-anchor="middle" class="step-txt4">compressed — artifacts look</text>
    <text x="100" y="97" text-anchor="middle" class="step-txt4">like real features to the model</text>
  </g>
  <line x1="193" y1="65" x2="233" y2="65" class="arrow4"/>
  <g class="step-box4">
    <rect x="238" y="20" width="180" height="90" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="328" y="48" text-anchor="middle" class="step-num4">Feature extraction</text>
    <text x="328" y="67" text-anchor="middle" class="step-txt4">neural net sees block edges,</text>
    <text x="328" y="82" text-anchor="middle" class="step-txt4">ringing as real spatial</text>
    <text x="328" y="97" text-anchor="middle" class="step-txt4">structure → noisy features</text>
  </g>
  <line x1="421" y1="65" x2="461" y2="65" class="arrow4"/>
  <g class="step-box4">
    <rect x="466" y="20" width="180" height="90" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="556" y="48" text-anchor="middle" class="step-num4">Lower confidence output</text>
    <text x="556" y="67" text-anchor="middle" class="step-txt4">misidentifications, lower</text>
    <text x="556" y="82" text-anchor="middle" class="step-txt4">OCR accuracy, worse</text>
    <text x="556" y="97" text-anchor="middle" class="step-txt4">product classification</text>
  </g>
</svg>
</figure>

## The Common Thread

A Boston Dynamics robot and a ChatGPT image prompt look nothing alike as systems. One is a 90kg physical machine running real-time sensor fusion. The other is a web API call. But they have the same requirement from their image input: spatial gradients and edges need to be accurate, because that's the raw material that neural networks build their understanding from.

JPEG compression, when it degrades those gradients and introduces false edges, makes life harder for both systems. The robot gets noisier depth estimates. The vision API gets lower confidence classifications. The human looking at the JPEG might not see the problem. The neural network processes the artifacts anyway.

The implication for practical use: if you're using AI image tools for anything where accuracy matters — extracting text from documents, identifying products, analyzing photos — submit the highest-quality version you have. Convert your messenger-compressed photos back to quality before feeding them to the model. The model is almost certainly better than the quality of image you're giving it.

**Related reading:**
- [Compress AI-Generated Images from Midjourney and DALL-E](/blog/compress-ai-generated-images-midjourney-dalle-2026) — the other direction: AI outputs and how to compress them without destroying the synthetic detail
- [EU AI Act — What It Means for Images on Your Website in 2026](/blog/eu-ai-act-images-websites-2026) — regulation framing for AI and image content together
- [The Future of AV1 and Beyond](/blog/the-future-of-av1-and-beyond) — where next-generation compression codecs are headed and how they interact with AI pipelines
