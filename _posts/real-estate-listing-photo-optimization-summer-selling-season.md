---
title: "Real Estate Listing Photos With 8MB Files Are Hurting Your Listings — And MLS Makes It Worse"
date: "2026-07-03T19:00:00Z"
excerpt: "July is peak summer selling season in the US and Canada. Real estate listings with professional photos sell faster and at higher prices — but most listing photos are uploaded as large, unoptimized JPEG files that get double-compressed by MLS systems, producing worse quality than the original shoot and slower page loads than any competitor who took the time to optimize."
keyTakeaways:
  - "July is peak summer real estate selling season — more listings, more competition for buyer attention"
  - "MLS systems like Zillow and Realtor.com recompress uploaded photos automatically — uploading a compressed JPEG means your photo gets compressed twice"
  - "Twilight exterior photos have the same extreme contrast problems as fireworks: bright warm sky against dark house creates JPEG ringing artifacts"
  - "Interior window exposures are one of the most common sources of compression artifacts in real estate photos"
  - "Real estate photos should have GPS metadata stripped before upload — listing photos don't need the geotag, and it creates a privacy and data integrity issue"
summary: "Real estate photography is a competitive advantage that most agents are reducing by uploading files incorrectly. MLS double-compression, oversized source files, and unstripped metadata all make listing photos worse than they were when they left the photographer's hard drive. Here's the workflow that keeps professional listing photos looking professional through every step of the publishing process."
faq:
  - question: "Will MLS systems like Zillow accept WebP photos for listing uploads?"
    answer: "Most major MLS portals currently accept JPEG and PNG but not WebP directly. Zillow, Realtor.com, and most regional MLS systems are working from JPEG-era upload specifications. The correct approach is to compress your edited photos to WebP as your working format for web galleries and direct website use, but export a high-quality JPEG (quality 85+) specifically for MLS uploads. The key is that the JPEG you upload to MLS should be your first and only JPEG compression pass — start from a clean RAW or TIFF, edit, then export JPEG quality 85 directly to MLS. Never upload a JPEG that was previously compressed at lower quality."
  - question: "Does it matter if listing photos load slowly on Zillow or Realtor.com?"
    answer: "On the aggregator sites themselves, less so — Zillow manages its own page performance and optimizes images after upload regardless of what you send. Where it matters significantly is your own agent website or brokerage site, and on social media where you share listing photos. A listing gallery page on an agent website with forty 8MB JPEG photos has an enormous page weight — it will load slowly, score badly on Google PageSpeed, and rank lower in search. If your listing page has a 3-second load time and a competitor's identical listing has a 0.8-second load time, the competitor's page will appear higher in organic search and see better engagement from every buyer who finds it."
  - question: "Should real estate listing photos be stripped of EXIF data before upload?"
    answer: "Yes, with one exception. Strip all EXIF including GPS coordinates before uploading to any public platform. The GPS coordinates in a listing photo record where the photographer was standing when they took the shot — for exterior photos, this is close enough to the property address to pinpoint it, which is redundant with the listing address but adds a layer of location precision you don't want in a publicly accessible file. Also strip camera make/model, lens information, and timestamps. The one piece of EXIF worth preserving: copyright data, which documents the photographer's rights. Use Optimage's selective metadata stripping to remove location and camera data while retaining copyright fields."
---

![A well-lit real estate interior shot showing a bright living room with large windows, the exterior view slightly overexposed — the classic window exposure challenge in listing photography](/image-10.png)

July is the busiest month of the year for residential real estate transactions in the US and Canada. Listings go up faster, buyers are actively searching, and the difference between a listing that moves in two weeks and one that sits for two months often starts with the photography.

Most agents and photographers know this. What they don't know is that their carefully shot, professionally edited listing photos are being degraded before they reach buyers — not by anything they did wrong in the shoot or edit, but by the upload and compression chain that follows.

Here is specifically what is happening, and how to stop it.

## The MLS Double-Compression Problem

When you upload a JPEG photo to Zillow, Realtor.com, or your regional MLS portal, the platform compresses the file again before serving it. This is standard practice across all web platforms — they store photos in multiple sizes and optimized formats for different display contexts. The compression they apply is not applied to your raw sensor data or your Lightroom export. It is applied to your uploaded JPEG.

JPEG is a lossy format. Compressing a JPEG produces a JPEG that has been compressed twice. The artifacts from the first compression are baked in; the second compression adds new artifacts on top of them. The result is visibly worse than a single compression pass at the same final quality.

The solution is not to stop using JPEG — MLS systems don't accept WebP, and JPEG will be around for the foreseeable future in real estate workflows. The solution is to ensure your uploaded JPEG is a clean, first-generation compression from your original edit.

The practical rule: **never upload to MLS a JPEG that was previously exported from another JPEG.** This happens constantly: photographers export from Lightroom to JPEG quality 85, send to the agent, the agent opens the JPEG in Preview or Photos and saves it again before uploading. That second save recompresses. Even if the quality setting is the same or higher, the second pass still degrades the content slightly and the accumulation across 25-40 listing photos is visible.

The correct chain: RAW → Lightroom/Capture One edit → Export JPEG quality 85 → Upload directly to MLS. No intermediate JPEG saves.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 26px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 12px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">403%</text><text x="110" y="78" text-anchor="middle" class="sl">More inquiries for listings with video</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">JPEG Q85</text><text x="350" y="78" text-anchor="middle" class="sl">Minimum quality for clean MLS upload</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">Strip GPS</text><text x="590" y="78" text-anchor="middle" class="sl">EXIF geotag strips before public upload</text></g>
</svg>
</div>

## Why Twilight Photos Compress So Badly

Twilight exterior photography — the listing photo taken at dusk when the house lights are on and the sky is still a rich blue or purple — is one of the most effective tools in real estate photography. The warm interior light against a cool evening sky creates a sense of home and warmth that daytime exteriors can't match. It's also one of the most compression-hostile images a real estate photographer will produce.

The reasons are the same as [fireworks and space scene photography](/blog/july-4-fireworks-photography-compression-guide): extreme contrast between very bright point sources (windows lit from the inside, porch lights) and very dark surroundings (the house walls, the dark areas of the sky). JPEG's block-encoding creates ringing artifacts around each lit window, visible as a blocky halo outlining the window frame. At quality 85, this is moderate; at quality 75 (a common export setting for "file size efficiency"), it's pronounced.

For twilight exteriors specifically: export at JPEG quality 90 for MLS uploads, not the standard quality 85 used for daylight interiors. The extra quality budget goes directly toward reducing the window halo artifacts that make twilight photos look like they were shot on a phone rather than a professional mirrorless camera.

## The Interior Window Exposure Problem

Daytime interior photography has a simpler version of the same problem. When a room has windows and natural light, the window in the frame is typically 3-5 stops brighter than the interior. Photographers handle this with HDR bracketing (multiple exposures merged), flash fill, or dedicated editing in Photoshop.

But the compressed output still has a challenge: the boundary between the window and the window frame is one of the sharpest, highest-contrast edges in the image. This boundary spans the full height of the window — it's a long, straight, high-contrast edge that JPEG's block encoding has to represent block by block. The result is a subtle stair-step pattern visible along the edges of window frames, particularly noticeable on light window frames against a bright exterior view.

WebP handles window frame edges significantly better than JPEG because its directional prediction coding can encode long straight edges as a continuous prediction rather than a series of independent blocks. For listings where you're posting photos on your own agent website or brokerage site (as opposed to MLS upload), WebP at quality 82 is the better format: cleaner window edges, smaller file, faster page load.

## Drone Photos Need More Compression, Not Less

Real estate drone photography — aerial exterior shots, neighborhood context views, pool/backyard overviews — is common for mid-to-upper price tier listings. The photos typically come from a drone camera with a 12-20MP sensor, producing JPEG files of 8-20MB per photo.

Most agents upload these directly. They don't need to: a drone aerial photo at 20MP contains far more resolution than any MLS display size or buyer screen requires. The right workflow:

1. Resize to 2400px wide (more than sufficient for any display context, preserves more detail than a 1200px image if the buyer wants to view it at full screen)
2. Export JPEG quality 85 for MLS upload
3. Export WebP quality 80 for your own website and social media use

A 20MB drone JPEG compressed correctly is a 1-2MB JPEG for MLS and a 400-800KB WebP for your site. Same visual quality at 10-25x smaller file size. Your listing gallery page loads proportionally faster.

## GPS Metadata in Real Estate Photos

Real estate photos taken with a phone or modern mirrorless camera contain GPS coordinates in the EXIF metadata. For exterior photos taken from across the street or at the curb, these GPS coordinates point directly at the property — accurate to within a few meters. When you upload these photos to Zillow or Realtor.com, the GPS data travels with the file.

The practical issues:

**Data integrity:** Zillow's systems use listing address for geolocation. An EXIF GPS coordinate that doesn't exactly match the property address (because the photographer stood on the street) creates data inconsistencies that occasionally affect how the property appears in map-based search.

**Privacy:** Photos exported from MLS systems and re-shared (common in real estate social marketing) carry the GPS coordinates with them. For vacant listings, this broadcasts the exact location to anyone who downloads the image.

Strip GPS and all location data before upload. Keep copyright metadata — photographers' IP rights attach to the image. Remove everything else. Run listing photo batches through [Optimage](/compress) with metadata stripping before the MLS upload step; it removes GPS, camera identifiers, and timestamps while leaving copyright fields intact.

<figure aria-label="Clean compression workflow for real estate listing photos" role="img" style="margin:32px 0">
<svg viewBox="0 0 700 110" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;display:block">
  <style>.px{animation:pi .5s ease-out both}.px:nth-child(1){animation-delay:0s}.px:nth-child(2){animation-delay:.18s}.px:nth-child(3){animation-delay:.36s}.px:nth-child(4){animation-delay:.54s}@keyframes pi{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}.pn{font:700 11px system-ui,sans-serif;fill:#db5a42}.pt{font:500 10px system-ui,sans-serif;fill:#374151}.arrow{fill:none;stroke:#d1d5db;stroke-width:2;marker-end:url(#arr)}</style>
  <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L0,6L8,3z" fill="#d1d5db"/></marker></defs>
  <g class="px"><rect x="10" y="15" width="145" height="75" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="82" y="44" text-anchor="middle" class="pn">① Edit in RAW</text><text x="82" y="62" text-anchor="middle" class="pt">Lightroom or Capture One,</text><text x="82" y="78" text-anchor="middle" class="pt">final export TIFF</text></g>
  <line x1="158" y1="52" x2="183" y2="52" class="arrow"/>
  <g class="px"><rect x="186" y="15" width="145" height="75" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="258" y="44" text-anchor="middle" class="pn">② Strip metadata</text><text x="258" y="62" text-anchor="middle" class="pt">Remove GPS and camera data,</text><text x="258" y="78" text-anchor="middle" class="pt">keep copyright</text></g>
  <line x1="334" y1="52" x2="359" y2="52" class="arrow"/>
  <g class="px"><rect x="362" y="15" width="145" height="75" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="434" y="44" text-anchor="middle" class="pn">③ Export JPEG Q85</text><text x="434" y="62" text-anchor="middle" class="pt">For MLS upload only,</text><text x="434" y="78" text-anchor="middle" class="pt">first-pass compression</text></g>
  <line x1="510" y1="52" x2="535" y2="52" class="arrow"/>
  <g class="px"><rect x="538" y="15" width="145" height="75" rx="10" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="610" y="44" text-anchor="middle" class="pn">④ WebP Q80 for web</text><text x="610" y="62" text-anchor="middle" class="pt">Agent website, social,</text><text x="610" y="78" text-anchor="middle" class="pt">email marketing</text></g>
</svg>
</figure>

The photography is the first impression. The file quality is what preserves it through the MLS chain, the aggregator websites, and the agent's own marketing. These aren't separate concerns — the workflow between them determines whether the professional quality of the photography survives to the buyer.

**Related reading:**
- [Real Estate Photo Optimization for US and Canada Markets](/blog/real-estate-photo-optimization-us-canada) — comprehensive format and sizing guide for North American MLS systems
- [What Is EXIF Metadata and Why Strip It](/blog/what-is-exif-metadata-and-why-strip-it) — full guide to metadata risks and removal
- [Cloud Storage Costs of Unoptimized Images](/blog/cloud-storage-costs-unoptimized-images) — the business case for compression in image-heavy workflows
