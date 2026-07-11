---
title: "Instagram Just Added Photos to Comments. Here's the File Size That Actually Looks Good There."
date: "2026-07-11T16:00:00Z"
excerpt: "Instagram now lets you drop an actual photo into a comment instead of just text and emoji. The comment thumbnail is tiny, which means most of the file you're uploading is wasted — here's how to size it right before you post."
keyTakeaways:
  - "Instagram is rolling out the ability to add photos directly to comments on posts and Reels, not just text and emoji replies"
  - "Comment photos render as a small thumbnail in the thread, so a full-resolution phone photo is mostly wasted upload bandwidth"
  - "Instagram recompresses every comment photo on its own servers regardless of what you upload, the same way it does for posts and Stories"
  - "A pre-sized, pre-compressed image survives that recompression pass far better than an oversized original the platform has to crush down itself"
summary: "Instagram's new photo-comments feature displays images as a small thumbnail in the comment thread, which most people will upload at full phone-camera resolution without thinking about it. That's backwards — a properly sized, compressed image before upload looks sharper after Instagram's own compression than an oversized original does."
faq:
  - question: "Can you post photos in Instagram comments now?"
    answer: "Yes. Instagram has rolled out a feature that lets users add an actual photo directly into the comment section under posts and Reels, rather than replying with only text or emoji."
  - question: "Does Instagram compress photos posted in comments?"
    answer: "Yes. Instagram re-encodes every image uploaded to the platform, including comment photos, regardless of the original file's resolution or format. Uploading an oversized or poorly compressed source image doesn't preserve quality — it just makes the platform's own compression pass work harder and often produces a worse result."
  - question: "What's the best image size for an Instagram comment photo?"
    answer: "Since comment photos render as a small thumbnail that expands only when tapped, there's no benefit to uploading a full-resolution phone photo. A JPEG around 1080px on the long edge at roughly 80-85% quality gives Instagram's compression a clean, appropriately sized source to work from without wasting upload bandwidth on detail nobody will see at thumbnail size."
---

![A smartphone showing an Instagram comment thread with a small photo thumbnail embedded among text replies, representing the new photo-comments feature](/image-5.png)

**Instagram just gave users the ability to post an actual photo directly into a comment, not just text and emoji, and most people are about to upload the wrong size file for it.** The feature is straightforward: tap into a comment field under a post or Reel, add a photo instead of (or alongside) text, and it appears inline in the thread. What isn't obvious from the feature itself is that the photo renders as a small thumbnail by default — which makes the instinct to upload your phone's full 12-48MP original almost entirely pointless.

## What the Feature Actually Changes

Comment sections have been text-and-emoji-only on Instagram for essentially the platform's whole life, aside from GIFs pulled from a search library. Letting users drop in their own photo is a genuinely different kind of interaction — a reply that says "here's proof" or "here's what I mean" or "here's the version I made," embedded directly in the conversation instead of requiring a separate post or DM. It's a small feature with an obvious use case: replying to a recipe post with your own attempt, replying to a fashion post with how you styled something similar, replying to a friend's post with a screenshot of an inside joke.

The mechanics matter more than they look like they should. A comment photo shows as a compact thumbnail inline with the text, expanding to a larger view only when tapped. That's a fundamentally different display context than a main feed post, which gets a full-width image treatment by default.

## Why Uploading Your Full-Resolution Original Is a Mistake

A modern phone shoots photos in the 12-48 megapixel range, producing files anywhere from 3MB to over 15MB depending on the device and format. None of that resolution does anything useful in a comment thumbnail that might display at a few hundred pixels wide before someone taps to expand it. You're spending upload time and mobile data moving detail that gets thrown away by the display context before a single viewer sees it.

Worse, Instagram compresses every image uploaded to the platform regardless of its original size — comments included. An oversized source file doesn't survive that compression pass better than a properly sized one; if anything, feeding the compressor a file with wildly more detail than the target size needs tends to produce more visible artifacting in the final result than starting from an appropriately sized source.

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
    <text x="120" y="62" text-anchor="middle" class="stat-num">12-48MP</text>
    <text x="120" y="82" text-anchor="middle" class="stat-lbl">Typical phone camera resolution</text>
  </g>
  <g class="stat-bar">
    <rect x="250" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="350" y="62" text-anchor="middle" class="stat-num">1080px</text>
    <text x="350" y="82" text-anchor="middle" class="stat-lbl">Recommended long edge for a comment photo</text>
  </g>
  <g class="stat-bar">
    <rect x="480" y="20" width="200" height="70" rx="12" fill="#fdf3f1"/>
    <text x="580" y="62" text-anchor="middle" class="stat-num">100%</text>
    <text x="580" y="82" text-anchor="middle" class="stat-lbl">Of uploads Instagram recompresses regardless of size</text>
  </g>
</svg>
</div>

## The Right Way to Prep a Comment Photo

<figure aria-label="3-step process diagram" role="img" style="margin:32px 0">
<svg viewBox="0 0 660 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>
    .step-box { animation: popIn 0.5s ease-out both; }
    .step-box:nth-child(1) { animation-delay: 0s; }
    .step-box:nth-child(2) { animation-delay: 0.2s; }
    .step-box:nth-child(3) { animation-delay: 0.4s; }
    @keyframes popIn { from { opacity:0; transform:scale(.85); } to { opacity:1; transform:scale(1); } }
    .step-num { font: 700 20px system-ui,sans-serif; fill: #db5a42; }
    .step-txt { font: 500 12px system-ui,sans-serif; fill: #374151; }
    .arrow { fill: none; stroke: #d1d5db; stroke-width: 2; marker-end: url(#arr); }
  </style>
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#d1d5db"/>
    </marker>
  </defs>
  <g class="step-box">
    <rect x="10" y="15" width="170" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="95" y="48" text-anchor="middle" class="step-num">① Crop</text>
    <text x="95" y="68" text-anchor="middle" class="step-txt">Center the subject tightly</text>
  </g>
  <line x1="185" y1="50" x2="235" y2="50" class="arrow"/>
  <g class="step-box">
    <rect x="240" y="15" width="170" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="325" y="48" text-anchor="middle" class="step-num">② Resize</text>
    <text x="325" y="68" text-anchor="middle" class="step-txt">1080px long edge</text>
  </g>
  <line x1="415" y1="50" x2="465" y2="50" class="arrow"/>
  <g class="step-box">
    <rect x="470" y="15" width="170" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/>
    <text x="555" y="48" text-anchor="middle" class="step-num">③ Compress</text>
    <text x="555" y="68" text-anchor="middle" class="step-txt">JPEG, 80-85% quality</text>
  </g>
</svg>
</figure>

1. **Crop tight before you upload.** A comment thumbnail is small and often square or near-square. If your photo's subject is a small part of a wider frame, crop to the part that matters — nobody's zooming into a comment thumbnail to find the interesting bit.
2. **Resize to around 1080px on the long edge.** That's comfortably more resolution than a comment thumbnail needs even after a tap-to-expand, without dragging along the multi-megabyte weight of an unedited phone photo.
3. **Export as JPEG at 80-85% quality.** PNG is the wrong format for a photo — it's lossless, which means huge files for no visible benefit once Instagram's own JPEG-based compression runs on top of it anyway.
4. **Check it at actual comment size before posting.** What looks fine full-screen on your phone can look muddy shrunk to thumbnail size if the crop was too loose or the original had motion blur.

## Why This Matters More Than It Sounds Like It Should

A single oversized comment photo isn't a big deal. But this feature is going to get used constantly, by a lot of people, on a platform where photo comments will very quickly become a normal way people communicate — proof-of-attempt replies, reaction photos, side-by-side comparisons. Multiply one wasted upload by the volume a feature like this will see across a billion-plus active accounts, and it adds up to a genuinely large amount of unnecessary data moving across mobile networks for a payload the platform was always going to shrink down anyway.

There's also a simpler, more personal reason to care: a comment photo you actually want someone to notice — a genuinely funny reaction shot, a side-by-side of "this is what I made" — competes for attention in a fast-scrolling thread. A crisp, well-cropped thumbnail reads better at a glance than a soft, poorly cropped one, even in a format this small.

## The Broader Pattern

This is the same lesson that applies to every corner of Instagram's upload pipeline — Stories, Reels covers, carousel posts, and now comments: the platform is going to compress your image no matter what you send it, so the only thing you control is how much information it has to throw away to hit its target file size. Send it something already close to the right size and quality, and the result holds up. Send it something ten times larger than it needs, and you're not preserving quality — you're just making Instagram's compressor do more destructive work before it settles on the same final size either way.

Before your next comment photo — or your next post, Story, or Reel cover — resize and compress it properly first. [Optimage](/) does it free, in your browser, no account needed.

**Related reading:**
- [Instagram Algorithm 2026: Image Quality and Reach](/blog/instagram-algorithm-2026-image-quality-guide) — how compression affects distribution
- [X Carousel Posts: The Image Size Guide](/blog/x-carousel-posts-image-size-guide) — the same sizing problem on a different platform
- [Social Media Image Size Guide: All Platforms 2026](/blog/social-media-image-size-guide-all-platforms-2026) — full spec sheet across every major app

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can you post photos in Instagram comments now?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Instagram has rolled out a feature that lets users add an actual photo directly into the comment section under posts and Reels, rather than replying with only text or emoji."
      }
    },
    {
      "@type": "Question",
      "name": "What's the best image size for an Instagram comment photo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Since comment photos render as a small thumbnail that expands only when tapped, a JPEG around 1080px on the long edge at roughly 80-85% quality gives Instagram's compression a clean, appropriately sized source to work from without wasting upload bandwidth."
      }
    }
  ]
}
</script>
