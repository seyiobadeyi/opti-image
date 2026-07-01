---
title: "Silo Season 3 Drops July 3 — Why Screenshots From Underground Sci-Fi Always Look Like Mud"
date: "2026-07-01T13:00:00Z"
excerpt: "Silo Season 3 arrives on Apple TV+ in two days with its deliberately dim, desaturated palette. If you screenshot a scene from the silo's underground depths and it looks like a grey smear compared to what you watched, JPEG compression is doing something specific to dark-scene content — and it's fixable."
keyTakeaways:
  - "Silo Season 3 premieres July 3 on Apple TV+, with the same intentionally dark, claustrophobic visual palette the show has used since Season 1"
  - "JPEG's quantization tables allocate fewer bits to near-black tones — the range where most of Silo's underground scenes live — causing gradation loss and muddy banding in screenshots"
  - "This is a different problem from HDR content (like House of the Dragon) — Silo doesn't need HDR handling, it needs a format that preserves subtle dark gradations that JPEG rounds away"
  - "WebP at quality 88+ preserves dark tonal gradations significantly better than JPEG at equivalent file sizes"
  - "PNG is lossless and handles Silo screenshots perfectly, but expect 4–6× larger files than WebP for the same content"
faq:
  - question: "Why do my Silo screenshots look worse than the actual show?"
    answer: "JPEG's compression is tuned for typical photographic content, where most pixel values cluster in the mid-tone range. Silo is deliberately shot dark — a large proportion of pixels in any underground scene are in the 0–35 brightness range (near-black). JPEG quantization tables assign fewer bits to this range, treating small brightness differences as 'noise' to discard. Those small differences are exactly what creates the atmospheric shadow detail that makes the show look good. JPEG rounds them away and you get uniform dark grey instead of gradated darkness."
  - question: "Does Silo use HDR like House of the Dragon?"
    answer: "Silo uses some HDR color grading, particularly for the surface scenes, but the problem with Silo screenshots is not primarily an HDR problem — it's a dark-range quantization problem. The underground silo scenes don't have the extreme highlight/shadow contrast that makes HDR handling critical for shows like HoD. The issue is that the darkness is incredibly nuanced and JPEG is destructive of that nuance specifically. You'd see improvement from fixing the compression before you'd see improvement from HDR-aware processing."
---

![A dimly lit underground corridor scene, the kind of intentionally shadowed, desaturated shot that appears in dystopian sci-fi shows and looks completely different when saved as a standard JPEG](/image-6.png)

Silo Season 3 lands on Apple TV+ July 3. If you haven't watched Seasons 1 and 2, the relevant technical fact is that the show is shot almost entirely underground, in a deliberately cramped, dark, grey-green environment — and those visual choices aren't accidental. The silo aesthetic is claustrophobia made visual: low ceilings, poor lighting, everything slightly desaturated. It looks great on an OLED screen. It screenshots terribly.

The reason is specific and worth understanding, because it's different from the screenshot problems with brighter, more dynamic shows.

## What JPEG Actually Does to Dark Scenes

JPEG compresses images by dividing them into 8×8 pixel blocks and applying a discrete cosine transform to each block. The transform converts spatial brightness differences into frequency components, and then a quantization step rounds those components to reduce data. The quantization table — which controls how aggressively each frequency gets rounded — is calibrated for typical photographic content, where most of the "important" detail is in mid-tones.

For near-black content, the quantization table is brutal. Small differences in brightness between 8 and 16 (out of 255) — the kind of subtle shadow detail that makes a dark scene look atmospheric rather than flat — get rounded to the same value. What was a gradual fade from dark charcoal to near-black becomes a uniform block of indistinguishable dark grey. The banding is visible as distinct tonal jumps in areas that should be smooth gradients: the concrete walls of the silo, the shadowed faces of characters in dim light, the transition from lit corridor to unlit doorway.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 28px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="55" text-anchor="middle" class="sn">July 3</text><text x="110" y="75" text-anchor="middle" class="sl">Silo Season 3 premiere on Apple TV+</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="55" text-anchor="middle" class="sn">0–35</text><text x="350" y="75" text-anchor="middle" class="sl">Brightness range JPEG handles worst</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="55" text-anchor="middle" class="sn">Q88+</text><text x="590" y="75" text-anchor="middle" class="sl">WebP quality to preserve dark gradations</text></g>
</svg>
</div>

## Why This Is Different From the HDR Problem

The House of the Dragon screenshot problem — covered here recently — is about a mismatch between HDR source content and standard-range image formats. That show has extremely bright firelight and very deep blacks in the same frame, and JPEG (and WebP) flatten that range.

Silo is a different situation. The show isn't primarily trying to represent extreme highlight/shadow range — it's trying to represent nuanced darkness. The range isn't wide; it's narrow and deliberately dark. The problem isn't that JPEG can't represent HDR — it's that JPEG doesn't have enough precision in the shadow tones that Silo relies on for its visual language.

A concrete example: in a scene set in the lower silo levels, the primary lighting might be a single overhead strip light casting a narrow pool of warm white on a concrete floor, with everything else in near-black shadow. On screen that looks intentional and striking. Save it as JPEG Q80 and the near-black areas lose their subtle texture — the rough concrete, the slight moisture sheen, the gradation where the light fades out. Those details get averaged away. The same area in WebP Q88 retains noticeably more of that texture.

## Format Comparison for Dark-Scene Content

| Format | Dark-range precision | File size (typical dark scene) | Recommended use |
|---|---|---|---|
| JPEG Q80 | Poor — banding common | ~180–350 KB | Not recommended for Silo-type content |
| JPEG Q95 | Acceptable | ~700 KB–1.2 MB | Only if WebP isn't an option |
| WebP Q88 | Good | ~250–450 KB | Best general-use choice for dark scenes |
| WebP Q95 | Excellent | ~500 KB–900 KB | For archiving shots you care about |
| PNG | Lossless | ~3–6 MB | Best quality, largest files |

The comparison between WebP Q88 and JPEG Q95 is the important one: they produce similar file sizes, but WebP Q88 uses a prediction-based encoding that's far better at preserving subtle tonal differences in flat, near-uniform areas. That directly benefits Silo's underground palette.

## The Gamma Problem Nobody Mentions

There's a second issue specific to dark streaming content: gamma mismatch. Your streaming app renders the show with a specific display gamma (usually PQ or HLG for HDR-capable screens, BT.1886 for standard). When you take a screenshot, your OS captures the display output at that gamma, and the resulting image file has that gamma baked in. When you open the screenshot file on a different device — or when it gets tone-mapped by a social platform — the gamma can shift, making already-dark content appear even darker or more washed out.

The workaround for most users: don't screenshot on an OLED TV and expect it to look right on a phone. Screenshot from the Apple TV+ app on your phone or Mac directly, which captures the video frame at device display gamma (sRGB) rather than TV HDR gamma. The result is a file that renders consistently across most viewing contexts without needing gamma adjustment.

## The Workflow for Silo Season 3 Screenshots

<figure aria-label="Recommended screenshot workflow for Silo" role="img" style="margin:32px 0">
<svg viewBox="0 0 660 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>
    .step-box2 { animation: popIn2 0.5s ease-out both; }
    .step-box2:nth-child(1) { animation-delay: 0s; }
    .step-box2:nth-child(2) { animation-delay: 0.2s; }
    .step-box2:nth-child(3) { animation-delay: 0.4s; }
    @keyframes popIn2 { from { opacity:0; transform:scale(.85); } to { opacity:1; transform:scale(1); } }
    .step-num2 { font: 700 13px system-ui,sans-serif; fill: #db5a42; }
    .step-txt2 { font: 500 12px system-ui,sans-serif; fill: #374151; }
    .arrow2 { fill: none; stroke: #d1d5db; stroke-width: 2; marker-end: url(#arr2); }
  </style>
  <defs>
    <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#d1d5db"/>
    </marker>
  </defs>
  <g class="step-box2">
    <rect x="10" y="15" width="190" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="105" y="39" text-anchor="middle" class="step-num2">① Screenshot on phone or Mac</text>
    <text x="105" y="56" text-anchor="middle" class="step-txt2">not a TV — avoids gamma mismatch</text>
    <text x="105" y="73" text-anchor="middle" class="step-txt2">and gets you sRGB color space</text>
  </g>
  <line x1="205" y1="50" x2="245" y2="50" class="arrow2"/>
  <g class="step-box2">
    <rect x="250" y="15" width="190" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="345" y="39" text-anchor="middle" class="step-num2">② Convert to WebP Q88+</text>
    <text x="345" y="56" text-anchor="middle" class="step-txt2">preserves shadow detail better</text>
    <text x="345" y="73" text-anchor="middle" class="step-txt2">than JPEG at same file size</text>
  </g>
  <line x1="445" y1="50" x2="485" y2="50" class="arrow2"/>
  <g class="step-box2">
    <rect x="490" y="15" width="160" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="570" y="39" text-anchor="middle" class="step-num2">③ Don't brighten it</text>
    <text x="570" y="56" text-anchor="middle" class="step-txt2">that's the show's actual aesthetic —</text>
    <text x="570" y="73" text-anchor="middle" class="step-txt2">honor it</text>
  </g>
</svg>
</figure>

Step three is the one I want to emphasize. The tendency when a dark screenshot looks muddy after saving is to open it in editing and crank the brightness or pull up the shadows. Some of that is legitimate (removing the JPEG banding that made the dark areas look muddy in the first place), but most of it overcorrects. Silo is supposed to be dark. The underground levels of that silo are not supposed to be well-lit. A screenshot of a mining level with boosted shadows that reveals "hidden detail" isn't a better version of the frame — it's a different version that contradicts the show's visual intent.

Convert with the right codec first. Only correct what the codec actually broke, not what the cinematographer chose to keep dark.

## What Season 3 Changes

Without spoiling direction: the shift between silo levels, the surface glimpses, and the lighting contrasts between the show's different environments are part of what makes the visual storytelling work. The contrast between underground darkness and surface brightness is loaded with meaning. A screenshot that fails in the dark range loses exactly the atmospheric half of that contrast.

Season 3 of Silo has been described by the showrunner as moving toward more surface sequences. Those will screenshot more predictably — daylight scenes, normal exposure, normal contrast. The underground sequences are the challenge. When you see a frame worth capturing, use WebP and save the compression quality.

**Related reading:**
- [How to Screenshot House of the Dragon Season 3 Without It Looking Washed Out](/blog/house-of-the-dragon-season-3-screenshots-share) — the HDR version of this problem, relevant for brighter high-contrast shows
- [Mastering Lossless Compression](/blog/mastering-lossless-compression) — when PNG is the right call and how to keep lossless files manageable
- [Best Free Image Compressor Online](/blog/best-free-image-compressor-online) — quick comparison of tools that handle WebP conversion well
