---
title: "Spotify's New Podcast Clips Feature Needs the Right Thumbnail. Here's the Exact Spec"
date: "2026-07-29T13:00:00Z"
excerpt: "Spotify's Podcast Clips lets listeners cut and share short moments from any episode, but the clip's thumbnail is pulled from your show art, not generated fresh — meaning a low-res or badly cropped cover image now shows up everywhere your clips get shared."
keyTakeaways:
  - "Podcast Clips pulls its thumbnail from your existing show and episode artwork, so a weak cover image now surfaces every time a listener shares a clip, not just on your show page"
  - "Spotify's cover art spec is a 3000x3000px square JPEG or PNG under 10MB, but most shows upload something closer to 1400x1400px and it shows once it's cropped for a clip card"
  - "Episode-specific art, when a show provides it, overrides the show-level cover on individual clips — a detail most podcasters aren't using yet"
  - "A clip's thumbnail gets far more one-off impressions across social feeds than the show page ever will, which changes how much it's worth optimizing"
faq:
  - question: "What image does Spotify use for the thumbnail on a shared Podcast Clip?"
    answer: "Spotify pulls the thumbnail from the show's cover art, or the specific episode's artwork if the show has uploaded one. It isn't generated fresh for each clip, which means any resolution or cropping problem in your existing cover art carries over into every clip shared from that show."
  - question: "What's the correct image size for Spotify podcast cover art?"
    answer: "Spotify's official spec is a square JPEG or PNG between 3000x3000 and 3000x3000 pixels, under 10MB, saved in the RGB color space. Many shows upload artwork closer to 1400x1400px, which meets the minimum but leaves little room before visible softness appears once the image is cropped into a smaller clip-card thumbnail."
  - question: "Should podcasters add episode-specific artwork instead of relying on the show cover?"
    answer: "Yes, for episodes likely to be clipped and shared widely. Episode-level artwork overrides the show-level cover on that specific episode's clips and page, which lets a standout episode get its own thumbnail instead of the same generic show cover appearing on every single clip."
---

![A podcast cover art thumbnail displayed inside a social media share card, illustrating how a show's existing artwork now doubles as clip promotion](/image-8.png)

**Spotify's new Podcast Clips feature lets listeners cut a short moment from any episode and share it — and the thumbnail on that shared clip comes straight from your existing show artwork, not something generated fresh for the moment.** That's a bigger deal than it sounds. A cover image that's only ever had to look decent as a small icon in a podcast app is now getting cropped into a much more visible clip-share card, appearing across whatever platform the listener posts it to.

## Your Cover Art Just Got a New, Bigger Job

Podcast cover art has historically had one job: look identifiable at thumbnail size inside a podcast app's library grid. Podcast Clips changes that math. Every time a listener clips and shares a moment from your show, that same artwork resurfaces as a much more prominent social share card — often the first thing a new potential listener ever sees, well before they'd have found your show page organically. An image that was "good enough" for a tiny app icon is now doing promotional work it was never designed for.

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
    <rect x="20" y="20" width="210" height="70" rx="12" fill="#fdf3f1"/>
    <text x="125" y="62" text-anchor="middle" class="stat-num">3000px</text>
    <text x="125" y="82" text-anchor="middle" class="stat-lbl">Spotify's recommended cover art dimension</text>
  </g>
  <g class="stat-bar">
    <rect x="250" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="350" y="62" text-anchor="middle" class="stat-num">10MB</text>
    <text x="350" y="82" text-anchor="middle" class="stat-lbl">Max file size for the cover upload</text>
  </g>
  <g class="stat-bar">
    <rect x="470" y="20" width="210" height="70" rx="12" fill="#fdf3f1"/>
    <text x="575" y="62" text-anchor="middle" class="stat-num">1400px</text>
    <text x="575" y="82" text-anchor="middle" class="stat-lbl">What most shows actually upload — the gap that shows up in crops</text>
  </g>
</svg>
</div>

## The Spec, and Where Most Shows Fall Short

Spotify's official guidance calls for a square JPEG or PNG between 3000x3000 pixels, under 10MB, in RGB color space. In practice, a large share of independent shows upload artwork closer to 1400x1400px — technically above Spotify's stated minimum, but with much less headroom before a crop starts showing softness. That gap didn't matter much when the image only ever displayed at icon size. It matters more now that a clip card can display that same artwork significantly larger inside someone else's social feed.

## Use Episode Art, Not Just Show Art

One detail most podcasters aren't using yet: episode-specific artwork overrides the show-level cover on that episode's own clips and page. If you know a particular episode — an interview with a notable guest, a strong standalone story — is likely to get clipped and shared, uploading dedicated art for that episode means its clips carry a thumbnail built for that specific moment instead of your generic show logo repeating across every single share.

## Getting Your Artwork Ready

1. **Re-export at the full 3000x3000px spec**, even if your current art technically passes the minimum. The extra resolution is what keeps a cropped clip thumbnail sharp instead of soft.
2. **Check the file size against the 10MB cap.** A full-resolution PNG export can easily exceed it — [compressing the file](/compress) down keeps the quality while getting comfortably under the limit.
3. **Add episode-level art for your strongest episodes**, using the same resolution spec, so a clip from that episode doesn't default back to your generic cover.

## Frequently Asked Questions

### What image does Spotify use for the thumbnail on a shared Podcast Clip?

Spotify pulls the thumbnail from the show's cover art, or the specific episode's artwork if the show has uploaded one. It isn't generated fresh for each clip, which means any resolution or cropping problem in your existing cover art carries over into every clip shared from that show.

### What's the correct image size for Spotify podcast cover art?

Spotify's official spec calls for a square JPEG or PNG at 3000x3000 pixels, under 10MB, saved in the RGB color space. Many shows upload artwork closer to 1400x1400px, which meets the minimum but leaves little room before visible softness appears once the image is cropped into a smaller clip-card thumbnail.

### Should podcasters add episode-specific artwork instead of relying on the show cover?

Yes, for episodes likely to be clipped and shared widely. Episode-level artwork overrides the show-level cover on that specific episode's clips and page, which lets a standout episode get its own thumbnail instead of the same generic show cover appearing on every single clip.

## The Takeaway

- Podcast Clips turns your existing cover art into a promotional asset it was never designed to be — re-export it at full resolution if you haven't already.
- Add episode-specific artwork for episodes you expect to get clipped and shared widely.
- [Compress your re-exported artwork](/compress) to stay under Spotify's 10MB cap without losing the resolution the new clip format actually needs.

**Related reading:**
- [Podcast audio transcription workflow](/blog/podcast-audio-transcription-workflow) — another piece of podcast production worth automating
- [Resize images online free](/blog/resize-images-online-free-guide) — for getting artwork to an exact pixel spec
- [Social media image size guide for all platforms](/blog/social-media-image-size-guide-all-platforms-2026) — specs for every other platform your clips will land on
