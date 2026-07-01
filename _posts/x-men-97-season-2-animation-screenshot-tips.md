---
title: "X-Men '97 Season 2 Starts Tonight — Why Retro Animation Screenshots Are Their Own Compression Nightmare"
date: "2026-07-01T21:00:00Z"
excerpt: "X-Men '97 Season 2 premieres today on Disney+, deliberately mimicking the 1990s X-Men: The Animated Series aesthetic — cel animation hard outlines, flat color fills, intentional grain. JPEG compression treats all of that as a problem to fix, producing colored fringing, smoothed-out grain, and blurred outlines. Here's what's actually happening and which format handles it."
keyTakeaways:
  - "X-Men '97 Season 2 premieres July 1 on Disney+ with the same deliberately retro 2D animation style as Season 1, based on the original 1990s X-Men animated series aesthetic"
  - "JPEG compression's 8×8 block structure creates colored fringing (ringing artifacts) along the bold outlines that define cel animation — the colored edge around Cyclops' visor, Wolverine's claws, the X-logo"
  - "Flat color fills in cel animation compress very efficiently in WebP (large uniform areas = easy to encode), but the transition from flat fill to hard outline causes the same edge artifact problem as JPEG"
  - "The intentional grain and noise in the show is a creative choice — don't let a compression algorithm decide it's noise to remove"
  - "PNG is the right format if you're archiving a specific frame; WebP Q90+ for sharing without destroying the crisp outline aesthetic"
faq:
  - question: "Why do my X-Men '97 screenshots look like they have colored outlines around the characters?"
    answer: "That's JPEG ringing — the same artifact that appears in tennis photography when white kit meets green grass. JPEG encodes in 8×8 pixel blocks and overshoots when it tries to represent a sharp color boundary (like the bold black outline around an animated character against a flat background). The overshoot shows up as a faint colored halo along the edge. In cel animation with bold, deliberate outlines, this is more visible than in photographic content because the outlines are the visual grammar of the art style — any smearing or haloing around them is obvious."
  - question: "Should I save X-Men '97 screenshots as PNG instead of JPEG?"
    answer: "For archiving a specific frame you care about, yes — PNG is lossless and will preserve the hard outlines, flat fills, and intentional grain exactly as they appeared on screen. The trade-off is file size: a PNG of a single 1080p animated frame will be 2–5 MB. For casual sharing in a Discord or group chat, WebP at quality 90 gives you a much smaller file with noticeably less ringing than JPEG, at the cost of minor quality loss that's difficult to see on the flat-fill areas. JPEG below Q90 is the format to avoid for this specific type of content."
---

![A screenshot from a retro 2D animated show featuring bold cel animation outlines, flat color fills, and a deliberately stylized visual that doesn't behave like photographic content when compressed](/image-9.png)

X-Men '97 Season 2 starts today on Disney+. If you watched Season 1, you know what to expect visually: deliberately faithful to the 1992 X-Men: The Animated Series aesthetic, which means cel-style animation with thick black outlines, flat color fills, halftone-style shading in specific areas, and an intentional roughness that feels like Saturday morning television. That's not a compromise — it's the entire artistic premise.

It also creates a screenshot problem that's different from every other show covered here recently, and the reason is worth understanding if you want to save and share these frames without the codec destroying what makes the art style work.

## The Cel Animation Screenshot Problem

Photographic content — live-action footage, rendered CGI — is built from continuous gradients. A face has smooth transitions from highlight to shadow. A landscape has textured detail spread across the whole frame. JPEG was designed for this kind of content, and it handles it well because its compression assumptions match the structure of the image.

Cel animation is structurally different. It's built from:
- **Flat color fills** — large areas of exactly the same color, with no gradient or texture
- **Hard outlines** — sharp, deliberate color transitions at character and object boundaries
- **Intentional grain or texture** — applied as a creative choice to give the animation a handcrafted feel

JPEG handles the flat fills fine. An area of uniform blue sky takes almost no data to encode, regardless of compression level. The problems are the hard outlines and the intentional grain.

## What JPEG Does to Hard Animation Outlines

JPEG's DCT compression encodes images in 8×8 pixel blocks. When a block contains a smooth gradient, the compression is efficient and the result looks natural. When a block contains a sharp color transition — a black outline separating a character from their background — the codec has to decide how to represent that transition with limited data.

The result is "ringing" — small waves of light and dark on both sides of the edge. On a photographic edge (the border of a face against a background), these rings are subtle and often invisible because the surrounding texture conceals them. On a cel animation outline, they're visible as a faint colored halo around the character — the same teal-green fringe you'd see around a Wimbledon player's white kit against grass. Against X-Men '97's flat-color backgrounds, there's nothing to hide it.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 26px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="55" text-anchor="middle" class="sn">1992</text><text x="110" y="75" text-anchor="middle" class="sl">Original X-Men animated series this references</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="55" text-anchor="middle" class="sn">8×8px</text><text x="350" y="75" text-anchor="middle" class="sl">JPEG blocks that create outline ringing</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="55" text-anchor="middle" class="sn">2–5 MB</text><text x="590" y="75" text-anchor="middle" class="sl">PNG size for a single 1080p animation frame</text></g>
</svg>
</div>

## Why the Intentional Grain Is the Second Problem

X-Men '97 uses deliberate noise and grain as part of its visual language. It's not a technical artifact from the production pipeline — it's a stylistic choice to evoke handcrafted animation and analog broadcast television. The grain is in the finished frame intentionally.

JPEG compression doesn't know this. It sees noise and applies its quantization, which treats high-frequency variation (which is what grain looks like mathematically) as less important than low-frequency structure. At Q80, JPEG removes a significant portion of the grain, smoothing it into uniform flat areas. The result looks "cleaner" in a way that actually makes the screenshot look less like the source material — you've removed the intentional texture.

WebP handles this better because its compression algorithm uses adaptive filtering that can vary by region. In a flat-color area with no meaningful variation, it compresses aggressively. In a grainy area, it applies less filtering, preserving more of the high-frequency detail. The result, at Q90+, retains more of the intended grain texture than JPEG does at equivalent quality.

## Format Comparison for Animation Screenshots

| Format | Hard outline handling | Grain preservation | File size (1080p frame) |
|---|---|---|---|
| JPEG Q80 | Visible ringing | Grain partially smoothed | 150–300 KB |
| JPEG Q95 | Ringing much reduced | Good grain retention | 500 KB–1 MB |
| WebP Q88 | Minimal ringing | Good grain retention | 200–450 KB |
| WebP Q95 | Excellent | Excellent | 400–800 KB |
| PNG | None (lossless) | Perfect | 2–5 MB |

WebP Q88 sits in a sweet spot: file size similar to JPEG Q80, but with significantly better outline quality and grain preservation. It's the right format for sharing animation screenshots where visual accuracy matters.

If you're archiving a specific frame — a reaction-worthy Wolverine moment, a Storm lightning sequence you want at full quality — PNG is correct despite the file size. Storage is cheap; you can't get the quality back from a JPEG.

## The '97 Aesthetic and Why It's Worth Preserving Correctly

The creative decision to build X-Men '97 as a stylistic continuation of a show from 1992 was specific. The writing team and animation studio (Polygon Pictures, working with original showrunner notes) made choices about line weight, color saturation, shading style, and noise that are load-bearing for the show's identity. A screenshot that removes the grain and softens the outlines is a screenshot of a different show.

This matters for the same reason that taking a photograph of a painting and sharing a degraded JPEG of it changes what people experience. The art style is information, not just context. Compressing the screenshot in a way that strips the intentional roughness from the image strips something that's actually part of the content.

<figure aria-label="Three-step workflow for X-Men '97 screenshots" role="img" style="margin:32px 0">
<svg viewBox="0 0 660 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>
    .step-box5 { animation: popIn5 0.5s ease-out both; }
    .step-box5:nth-child(1) { animation-delay: 0s; }
    .step-box5:nth-child(2) { animation-delay: 0.2s; }
    .step-box5:nth-child(3) { animation-delay: 0.4s; }
    @keyframes popIn5 { from { opacity:0; transform:scale(.85); } to { opacity:1; transform:scale(1); } }
    .step-num5 { font: 700 13px system-ui,sans-serif; fill: #db5a42; }
    .step-txt5 { font: 500 12px system-ui,sans-serif; fill: #374151; }
    .arrow5 { fill: none; stroke: #d1d5db; stroke-width: 2; marker-end: url(#arr5); }
  </style>
  <defs>
    <marker id="arr5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#d1d5db"/>
    </marker>
  </defs>
  <g class="step-box5">
    <rect x="10" y="15" width="190" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="105" y="39" text-anchor="middle" class="step-num5">① Screenshot at full res</text>
    <text x="105" y="57" text-anchor="middle" class="step-txt5">on device — not a TV photo —</text>
    <text x="105" y="73" text-anchor="middle" class="step-txt5">for clean sRGB source</text>
  </g>
  <line x1="205" y1="50" x2="245" y2="50" class="arrow5"/>
  <g class="step-box5">
    <rect x="250" y="15" width="190" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="345" y="39" text-anchor="middle" class="step-num5">② WebP Q90 for sharing</text>
    <text x="345" y="57" text-anchor="middle" class="step-txt5">PNG for archiving — avoid</text>
    <text x="345" y="73" text-anchor="middle" class="step-txt5">JPEG for animation content</text>
  </g>
  <line x1="445" y1="50" x2="485" y2="50" class="arrow5"/>
  <g class="step-box5">
    <rect x="490" y="15" width="160" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="570" y="39" text-anchor="middle" class="step-num5">③ Leave the grain alone</text>
    <text x="570" y="57" text-anchor="middle" class="step-txt5">it's the art, not noise —</text>
    <text x="570" y="73" text-anchor="middle" class="step-txt5">don't smooth it out in editing</text>
  </g>
</svg>
</figure>

## Posting to Discord vs. Reddit vs. X

If you're sharing X-Men '97 screenshots to discussion communities, each platform handles your upload differently:

**Discord:** Re-compresses images aggressively above 8MB, but at normal screenshot sizes (under 2MB), it usually passes WebP through without re-encoding. Upload WebP directly if the Discord client supports it; otherwise JPEG Q90 for the better-than-default quality.

**Reddit:** r/XMen and r/Marvel are active screenshot communities. Reddit's image upload re-compresses everything to JPEG internally. Upload the best quality you can (PNG or WebP Q95) and let Reddit's encoder work from a better source — the re-compressed result will be better than if you'd pre-compressed it.

**X (Twitter/X):** X re-compresses all uploaded images to JPEG. Upload the highest quality version you have and accept that X will degrade it. There's nothing you can do about the platform's encoder, but starting from a high-quality source gives you the best outcome after their compression pass.

The animation outlines, the flat fills, the intentional grain — all of that is the reason X-Men '97 looks the way it looks and why it resonates with people who grew up with the 1992 series. The screenshot is a capture of that. It's worth preserving correctly.

**Related reading:**
- [How to Screenshot House of the Dragon Season 3 Without It Looking Washed Out](/blog/house-of-the-dragon-season-3-screenshots-share) — the live-action HDR version of the screenshot problem
- [PNG vs. WebP for UI Design Assets](/blog/png-vs-webp-for-ui-design-assets) — the format comparison for content with hard edges and flat fills, which applies directly to animation screenshots
- [Compress Images Without Losing Quality](/blog/compress-images-without-losing-quality) — the principles behind quality-preserving compression that apply across all content types
