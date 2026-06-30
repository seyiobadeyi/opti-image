---
title: "How to Screenshot House of the Dragon Season 3 Without It Looking Washed Out"
date: "2026-06-30T19:00:00Z"
excerpt: "House of the Dragon Season 3 is shot in HDR, and a straight screenshot of a dragonfire scene often looks flat and grey the moment you post it. The fix isn't your screenshot — it's the format you convert it to before sharing."
keyTakeaways:
  - "Season 3 premiered June 21 on HBO Max, and it's mastered in HDR — high dynamic range, with a much wider brightness and color range than a standard screen"
  - "A direct screenshot of an HDR frame, converted carelessly, loses exactly the deep blacks and bright highlights that made the shot look good in the first place"
  - "AVIF is the only common web format that actually carries HDR metadata — WebP and JPEG both flatten it to standard range"
  - "For anything you're just posting to Discord or X rather than archiving, WebP at quality 85 with manual contrast left untouched still looks far better than the platform's own auto-compression"
faq:
  - question: "Why do my House of the Dragon screenshots look grey and flat compared to watching the show?"
    answer: "The show is mastered in HDR, which uses a much wider range of brightness and color than a standard screen or image format can display. A screenshot taken without HDR-aware handling, then saved as a standard JPEG or PNG, gets tone-mapped down to standard range in a default, often flat-looking way — the same frame that looked rich and high-contrast on your TV looks washed out as a still image."
  - question: "What's the best format to save HDR screenshots in?"
    answer: "AVIF is the only mainstream format that actually preserves HDR metadata, so a properly captured and converted AVIF still can retain something closer to the original brightness range. For everyday sharing where the recipient's app or platform doesn't render HDR images specially anyway, converting to WebP at quality 85 and accepting standard dynamic range is the more practical choice — it still looks better than letting Discord or X recompress an oversized PNG on their own terms."
---

![A dark fantasy scene with a dragon silhouetted against bright orange firelight, the kind of high-contrast HDR shot that loses detail when converted to standard formats](/image-11.png)

House of the Dragon Season 3 premiered June 21 on HBO Max, and the dragonfire sequences are exactly the kind of shot people want to screenshot and post — except a lot of those screenshots are coming out flat and grey compared to what people actually saw watching it. The show is mastered in HDR, and that's the part most screenshot guides skip. The fix isn't a better capture method. It's understanding what HDR actually is and picking a format that doesn't throw it away.

## What's Actually Going Wrong

HDR — high dynamic range — means the show was mastered with a much wider range of brightness and color than a standard screen displays. A dragonfire scene in HDR has genuinely deep blacks and genuinely bright highlights in the same frame, which is exactly why those shots look so striking on a capable TV. Standard image formats — JPEG, PNG, and for the most part WebP — don't carry that range. When you take a screenshot and save it normally, the capture gets tone-mapped down to standard dynamic range using a generic, default curve, and that curve usually isn't the one the show's colorist intended. The result: a shot that looked rich and dramatic on screen looks dull and flat as a still.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 32px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">June 21</text><text x="110" y="78" text-anchor="middle" class="sl">Season 3 premiere date</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">1 of 3</text><text x="350" y="78" text-anchor="middle" class="sl">Web formats that keep HDR data</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">Q85</text><text x="590" y="78" text-anchor="middle" class="sl">WebP quality for non-HDR sharing</text></g>
</svg>
</div>

## Why Format Choice Matters More Than Usual Here

| Format | Carries HDR data | Typical use case for this show |
|---|---|---|
| PNG | No | Lossless but flattens HDR by default — large files for no real benefit |
| JPEG | No | Always tone-mapped to standard range, smallest files |
| WebP | No (in practice) | Good general-purpose compression, still standard-range only |
| AVIF | Yes | The only realistic option if preserving the HDR look matters to you |

This is the genuinely unusual part of dealing with HDR content: AVIF is the one mainstream web format that actually has the capability to carry HDR metadata through to a still image. That doesn't mean every app that opens an AVIF will render it as HDR — most won't, since HDR display support is still inconsistent across phones, browsers, and social platforms. But if you're archiving a screenshot for your own use, or sharing somewhere that does support it, AVIF is the format that gives the original frame a fighting chance.

## The Practical Workflow

For most people, the honest answer is that you're sharing to Discord, X, or a group chat — none of which render HDR specially even if you hand them an AVIF. In that case:

1. **Take the screenshot at full resolution.** Don't compromise on capture quality trying to "save" HDR data your destination won't render anyway.
2. **Convert to WebP at quality 85**, the same baseline that works for any detailed 4K still. [Optimage /convert](/convert) handles this in one step.
3. **Resist the urge to manually crank contrast or saturation to compensate for the flatter tone-mapped look.** Oversaturating to fake back the HDR punch usually looks worse and more obviously edited than just accepting the standard-range version.
4. **If you specifically want to preserve the HDR character** — for your own archive, or sharing somewhere that actually supports it — convert to AVIF instead, and check the result on an HDR-capable display before assuming it worked.

<figure aria-label="3-step process diagram for handling HDR screenshots" role="img" style="margin:32px 0">
<svg viewBox="0 0 660 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>
    .step-box { animation: popIn 0.5s ease-out both; }
    .step-box:nth-child(1) { animation-delay: 0s; }
    .step-box:nth-child(2) { animation-delay: 0.2s; }
    .step-box:nth-child(3) { animation-delay: 0.4s; }
    @keyframes popIn { from { opacity:0; transform:scale(.85); } to { opacity:1; transform:scale(1); } }
    .step-num { font: 700 18px system-ui,sans-serif; fill: #db5a42; }
    .step-txt { font: 500 12px system-ui,sans-serif; fill: #374151; }
    .arrow { fill: none; stroke: #d1d5db; stroke-width: 2; marker-end: url(#arr); }
  </style>
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#d1d5db"/>
    </marker>
  </defs>
  <g class="step-box">
    <rect x="10" y="15" width="190" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="105" y="42" text-anchor="middle" class="step-num">① Capture full-res</text>
    <text x="105" y="62" text-anchor="middle" class="step-txt">don't compromise the source</text>
  </g>
  <line x1="205" y1="50" x2="245" y2="50" class="arrow"/>
  <g class="step-box">
    <rect x="250" y="15" width="190" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="345" y="42" text-anchor="middle" class="step-num">② Pick the format</text>
    <text x="345" y="62" text-anchor="middle" class="step-txt">WebP for sharing, AVIF for HDR</text>
  </g>
  <line x1="445" y1="50" x2="485" y2="50" class="arrow"/>
  <g class="step-box">
    <rect x="490" y="15" width="160" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="570" y="42" text-anchor="middle" class="step-num">③ Skip the edits</text>
    <text x="570" y="62" text-anchor="middle" class="step-txt">don't fake the contrast back</text>
  </g>
</svg>
</figure>

## The Takeaway

The flat, grey screenshot problem isn't a sign you did anything wrong — it's the predictable result of taking HDR content and forcing it into a standard-range format, which is what almost every screenshot tool and sharing platform does by default. For casual sharing, WebP at quality 85 is still the right call, you're just accepting that the still won't carry the full punch of the broadcast. If preserving that actually matters to you, AVIF is the one format built to carry it through — just confirm wherever you're sending it can actually display it before you assume the extra effort paid off.

**Related reading:**
- [Best Way to Save and Share 4K Screenshots from Avatar: The Last Airbender](/blog/avatar-last-airbender-screenshots-compress-share) — the general 4K screenshot file-size problem, without the HDR wrinkle
- [The Complete Guide to WebP and AVIF for US Websites](/blog/webp-avif-complete-guide-us-websites-2026) — the deeper format comparison this post builds on
- [The Future of AV1 and Beyond](/blog/the-future-of-av1-and-beyond) — for where HDR-aware compression is headed next
