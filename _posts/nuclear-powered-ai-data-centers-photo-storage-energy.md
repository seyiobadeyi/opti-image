---
title: "AI Data Centers Are Going Nuclear. That's Directly Connected to the Cost of Storing Your Photos."
date: "2026-07-21T15:00:00Z"
excerpt: "Valar Atomics, Nvidia, and Aalo Atomics all hit nuclear reactor milestones this month to power AI data centers, with committed nuclear capacity for data centers now past 9.8 gigawatts. Every uncompressed photo sitting in cloud storage is a small part of the demand driving that build-out."
keyTakeaways:
  - "Aalo Atomics reached criticality on a test reactor at Idaho National Laboratory on July 4, 2026, the first self-sustaining nuclear reaction under the DOE's Reactor Pilot Program"
  - "Valar Atomics and Nvidia are exploring a 30-megawatt Utah data center powered directly by a small modular reactor"
  - "Total committed nuclear capacity for AI data centers now exceeds 9.8 gigawatts across major hyperscalers"
  - "Storage is one of the steadiest, least glamorous drivers of that demand — full-resolution photo and video backups sit on powered, cooled servers indefinitely, unlike a one-time AI training run"
faq:
  - question: "Why are AI companies building nuclear reactors for data centers?"
    answer: "AI workloads, particularly training and inference at scale, require enormous and continuous electricity supply that existing grids in many regions can't reliably provide without new generation capacity. Small modular nuclear reactors offer a dedicated, always-on power source that doesn't compete with the surrounding grid, which is why committed nuclear capacity for data centers has passed 9.8 gigawatts across major hyperscalers."
  - question: "Does storing photos in the cloud actually use meaningful energy?"
    answer: "Yes, cumulatively. A single photo backup is trivial, but full-resolution photo and video storage sitting on powered, cooled servers around the clock for years is a genuinely different energy profile than a one-time compute job, and it scales directly with how many uncompressed files a person or business keeps stored rather than compressed."
---

![Server racks in a data center with cooling infrastructure, representing the physical infrastructure behind cloud photo and video storage](/image-11.png)

**Aalo Atomics hit criticality on a test reactor at Idaho National Laboratory on July 4, Valar Atomics and Nvidia are exploring a nuclear-powered data center in Utah, and total committed nuclear capacity for AI data centers has now passed 9.8 gigawatts across the major hyperscalers.** This is being covered almost entirely as an AI-compute story — which it is — but a meaningful and less-discussed slice of that demand isn't training runs at all. It's storage. Specifically, the enormous and growing volume of full-resolution photos and videos sitting untouched in cloud accounts, backed up in duplicate, and never compressed.

## What Actually Happened This Month

Three separate nuclear startups — Aalo Atomics, Valar Atomics, and Antares Nuclear — hit criticality milestones ahead of a Department of Energy deadline this July, each under different pilot and demonstration programs. Valar's Ward250 reactor went critical on June 18 and is now generating initial power for a proposed Utah facility that would pair it with Nvidia's water-efficient cooling systems. This isn't speculative anymore; these are functioning reactors tied to specific, named data center proposals, not white papers about a hypothetical future grid.

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
    <rect x="20" y="20" width="220" height="70" rx="12" fill="#fdf3f1"/>
    <text x="130" y="62" text-anchor="middle" class="stat-num">9.8 GW+</text>
    <text x="130" y="82" text-anchor="middle" class="stat-lbl">Committed nuclear capacity for data centers</text>
  </g>
  <g class="stat-bar">
    <rect x="260" y="20" width="220" height="70" rx="12" fill="#fdf3f1"/>
    <text x="370" y="62" text-anchor="middle" class="stat-num">3</text>
    <text x="370" y="82" text-anchor="middle" class="stat-lbl">Startups hitting criticality this July</text>
  </g>
  <g class="stat-bar">
    <rect x="500" y="20" width="180" height="70" rx="12" fill="#fdf3f1"/>
    <text x="590" y="62" text-anchor="middle" class="stat-num">30MW</text>
    <text x="590" y="82" text-anchor="middle" class="stat-lbl">Proposed Utah reactor-powered facility</text>
  </g>
</svg>
</div>

## Why Storage Is the Boring Part of This Story That Actually Matters to You

AI training runs are a spike — enormous energy demand for a finite period, then done. Storage doesn't work that way. A photo uploaded to cloud backup in 2020 that's still sitting there, full resolution, un-deleted, un-compressed, is drawing power and cooling continuously, year after year, on servers that never get to power down for that file. Multiply that by however many billions of duplicate, oversized, rarely-viewed photos sit in personal and business cloud accounts worldwide, and storage becomes a genuinely large, steady, and largely invisible piece of data center electricity demand — not a dramatic AI training headline, just a constant background draw that never really goes away.

## The Uncomfortable Overlap With the AI Boom

Some of the same hyperscalers building nuclear-powered data centers for AI compute are also the ones storing consumer photo libraries at massive scale. The infrastructure is genuinely shared in many cases — the same facilities and power contracts covering both AI workloads and the ever-growing pile of full-resolution camera backups nobody ever goes back and compresses. That's not a reason to feel guilty about backing up your photos. It is a reason to notice that keeping a 12MB phone photo at full resolution forever, when a properly compressed version would look identical on every screen you'll ever view it on, has a real and compounding infrastructure cost behind it — one that's now literally being met with new nuclear reactors.

## What Actually Helps, at Any Scale

You're not going to change hyperscaler energy policy by compressing your camera roll. But at the scale of a business managing thousands of product photos, client galleries, or archival images, the difference between storing everything at full camera-original size versus a properly compressed version is a real, multiplying difference in storage footprint — and by extension, in the electricity and cooling load behind it.

[Optimage's compressor](/compress) cuts a photo's file size dramatically with no visible quality loss, free, in the browser — the simplest lever available for reducing your own contribution to that footprint.

## The Bottom Line

Nuclear-powered data centers are being built because AI compute demand is real and growing fast. Storage — unglamorous, unphotographed, easy to ignore — is quietly part of the same demand curve. Compressing what you keep isn't going to solve the grid problem, but it's one of the only parts of this story an individual or a small business actually has direct control over.

**Related reading:**
- [Why Your LCP Is Failing and How to Fix It](/blog/why-your-lcp-is-failing-and-how-to-fix-it) — the performance case for compression, separate from the energy case
- [Serverless Image Optimization: Edge Functions 2026](/blog/serverless-image-optimization-edge-functions-2026) — how modern infrastructure handles image processing at scale
- [The Future of AV1 and Beyond](/blog/the-future-of-av1-and-beyond) — smaller files as a continuing industry direction, for storage as much as bandwidth

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why are AI companies building nuclear reactors for data centers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI workloads require enormous, continuous electricity that many existing grids can't reliably supply. Small modular nuclear reactors provide dedicated, always-on power that doesn't compete with the surrounding grid, driving committed nuclear capacity for data centers past 9.8 gigawatts."
      }
    },
    {
      "@type": "Question",
      "name": "Does storing photos in the cloud actually use meaningful energy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cumulatively, yes. Full-resolution photo and video storage sitting on powered, cooled servers around the clock for years is a steady energy draw that scales directly with how many uncompressed files are kept stored rather than compressed."
      }
    }
  ]
}
</script>
