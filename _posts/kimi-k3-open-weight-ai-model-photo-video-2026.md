---
title: "Kimi K3's Open Weights Are Free to Download. The Catch Is 1.4TB and a Context Window Your Photos Will Eat Fast"
date: "2026-07-28T09:00:00Z"
excerpt: "Moonshot AI released Kimi K3's open weights for free on July 27, 2026 — a 2.8-trillion-parameter model that reads text, images, and video natively with a 1-million-token context window, no per-image API fee required if you self-host."
keyTakeaways:
  - "Kimi K3 launched at 00:00 UTC on July 27, 2026 with fully open weights — free to download, fine-tune, and self-host"
  - "2.8 trillion parameters, native multimodal input across text, images, and video, and a 1-million-token context window"
  - "MXFP4 quantization brings the weights down to roughly 1.4TB, still too large for most local setups but far smaller than an unquantized release"
  - "Hosted API access runs about $3 per million input tokens and $15 per million output tokens, undercutting comparable US frontier models"
  - "Large images and video eat context fast, so compressing a batch before upload gets more media into the same 1M-token window and lowers metered API cost"
summary: "Kimi K3 is Moonshot AI's new open-weight, 2.8-trillion-parameter multimodal model, free to download or use via a cheap hosted API — but its 1-million-token context window fills up fast with uncompressed images and video, making pre-processing your media a practical cost-saving step."
faq:
  - question: "What is Kimi K3 and when was it released?"
    answer: "Kimi K3 is an open-weight, 2.8-trillion-parameter multimodal model from Moonshot AI, released for free download at 00:00 UTC on July 27, 2026. It handles text, images, and video natively and has a 1-million-token context window."
  - question: "How much does Kimi K3 cost to use?"
    answer: "The weights themselves are free to download and self-host, though at roughly 1.4TB after MXFP4 quantization, self-hosting requires serious hardware. Moonshot's own hosted API charges around $3 per million input tokens and $15 per million output tokens, which is noticeably cheaper than comparable US frontier models."
  - question: "Do I need to compress photos before uploading them to a multimodal AI model like Kimi K3?"
    answer: "You don't need to, but it helps on two fronts. Large, uncompressed images consume far more of a model's token context window than optimized ones, so compressing first lets you fit more images into a single request and lowers your bill on any token-metered hosted API."
---

![A stack of high-resolution photo and video files being compressed before upload to a multimodal AI model](/image-7.png)

**Moonshot AI dropped Kimi K3's open weights for free download at 00:00 UTC on July 27, 2026** — a 2.8-trillion-parameter model that reads text, images, and video natively, carries a 1-million-token context window, and costs nothing to download. That last part is the headline. Most frontier-scale multimodal models live behind a metered API; Kimi K3's weights are just sitting there, free to pull down, fine-tune, and run on your own hardware if you have enough of it.

## What Moonshot Actually Shipped

Kimi K3 is a 2.8-trillion-parameter model, which puts it in the same weight class as the largest models any lab has released as open weights. It's natively multimodal — not a text model with a vision adapter bolted on afterward, but one trained to take images and video as first-class input alongside text. The 1-million-token context window means you can, in theory, hand it a genuinely large batch: a long video, a big folder of photos, or a mix of both alongside a long text prompt, all in a single pass.

The size is the part that trips people up. At full precision, a 2.8-trillion-parameter model would run well past 5TB just in weights. Moonshot used MXFP4 quantization — a 4-bit floating point format — to bring that down to roughly 1.4TB. That's a real reduction, and it's the only reason downloading this thing is practical at all. It's still not something you're running on a gaming PC. A 1.4TB model needs multi-GPU server hardware with enough combined VRAM to hold it, which puts genuine self-hosting out of reach for most individual developers and small teams, even with the open weights sitting on disk.

That's where the hosted API comes in, and it's the option most people will actually use.

## The Price Angle Is the Real Story

Moonshot's hosted API prices Kimi K3 at about $3 per million input tokens and $15 per million output tokens. Compared to what comparable frontier-scale multimodal models from US labs typically charge, that's meaningfully cheaper — enough that it changes the math for anyone running high-volume image or video analysis workloads where token costs add up fast.

| | Kimi K3 (hosted) | Typical US frontier multimodal API |
|---|---|---|
| Input tokens | ~$3 / million | Often $5–15 / million |
| Output tokens | ~$15 / million | Often $15–75 / million |
| Weights | Free, open, self-hostable | Closed, no download option |
| Context window | 1 million tokens | Varies, often smaller |

This lands in a genuinely crowded month. GPT-5.6 Sol and Grok 4.5 both launched July 10, and both raised the bar on vision and reasoning respectively. Kimi K3 isn't trying to out-benchmark either of them on every axis — its pitch is different: open weights nobody else at this scale is offering for free, and a hosted price point that undercuts the closed alternatives if you don't want to run your own hardware. For a developer weighing GPT-5.6 against Kimi K3 for a vision-heavy pipeline, the decision often comes down to whether you need OpenAI's specific accuracy edge or whether "good enough and three times cheaper" wins. We covered [GPT-5.6's vision quality in detail separately](/blog/gpt-5-6-vision-ai-photo-quality-guide) if that's the comparison you're making.

## Why Your Context Window Fills Up Faster Than You Think

Here's the part that gets glossed over in most of the launch coverage: a 1-million-token context window sounds enormous until you start feeding it real images and video. Multimodal models don't read an image as "one token" — a single high-resolution photo can consume anywhere from a few hundred to several thousand tokens depending on its resolution and how the model tiles it internally. Video is worse, since it's effectively a sequence of frames, each consuming its own token budget. Upload a folder of 40 full-resolution photos straight from a camera, or a few minutes of 4K video, and you can burn through a meaningful chunk of that million-token window before you've written a single word of your actual prompt.

This matters in two very concrete ways:

- **Context budget.** Every token an oversized image consumes is a token not available for the rest of your batch, your instructions, or the model's response. Fewer, larger files mean fewer images fit per request.
- **Metered cost.** On a hosted API billed per input token — Kimi K3's or anyone else's — a bloated image is a bloated line item. Compress the same photo down without losing meaningful detail and you're paying for a fraction of the tokens on every single request.

Neither of these is specific to Kimi K3. It's true of Grok 4.5's image handling and GPT-5.6's vision stack too — we've noted the file-size angle for Grok's multimodal pipeline [in an earlier breakdown](/blog/grok-imagine-seven-image-video-file-size-guide). But Kimi K3's combination of a genuinely large context window and a cheap-but-not-free hosted rate makes the trade-off sharper: the whole appeal is fitting more into one request at a lower cost, and an unoptimized batch of images undercuts both halves of that pitch at once.

## The Practical Fix: Compress Before You Upload

None of this requires exotic tooling. The fix is the same one that's applied to every AI image pipeline this year, whether the destination is an AI generator, an editing tool, or now a multimodal model reading your photos as input: shrink the file before it goes anywhere near the API. This is a similar story to what's happened with AI-generated images clogging up storage and bandwidth, which we've [written about separately](/blog/compress-ai-generated-images-midjourney-dalle-2026) — the direction of the fix is identical, just applied earlier in the pipeline instead of after generation.

A few things worth doing before you batch-upload photos or video into Kimi K3 or any hosted multimodal API:

1. **Compress before you upload, not after.** There's no benefit to feeding a model a 12MB camera-original JPEG when a well-compressed version at the same visible resolution carries a fraction of the token cost.
2. **Resize to what the task actually needs.** If you're asking a model to read text in a document photo, it needs real resolution. If you're asking it to classify a scene or count objects, it usually doesn't need the full native resolution your camera produced.
3. **Batch-process the whole folder at once** rather than compressing files one at a time before every upload — it's the difference between a five-minute prep step and a recurring tax on every request you send.
4. **Keep a lossless master separately** so you're never stuck re-shooting or re-exporting if a compressed copy turns out to need more detail for a specific request.

[Optimage's free compression tool](/compress) handles exactly this step — batch-compress a folder of photos down to a fraction of their original size before they ever touch an API, with no software to install and no per-image fee of its own. For anyone testing Kimi K3's hosted API, or stacking it against GPT-5.6 or Grok 4.5 for a vision-heavy workload, that's the five-minute step that determines whether your context window and your bill both go further.

## Frequently Asked Questions

### What is Kimi K3 and when was it released?

Kimi K3 is an open-weight, 2.8-trillion-parameter multimodal model from Moonshot AI, released for free download at 00:00 UTC on July 27, 2026. It handles text, images, and video natively and has a 1-million-token context window.

### How much does Kimi K3 cost to use?

The weights themselves are free to download and self-host, though at roughly 1.4TB after MXFP4 quantization, self-hosting requires serious hardware. Moonshot's own hosted API charges around $3 per million input tokens and $15 per million output tokens, which is noticeably cheaper than comparable US frontier models.

### Do I need to compress photos before uploading them to a multimodal AI model like Kimi K3?

You don't need to, but it helps on two fronts. Large, uncompressed images consume far more of a model's token context window than optimized ones, so compressing first lets you fit more images into a single request and lowers your bill on any token-metered hosted API.

![A batch of compressed photo thumbnails ready for upload, showing reduced file sizes before an AI model processes them](/image-1.png)

## Wrap-Up

- Kimi K3 is a free, open-weight, 2.8-trillion-parameter multimodal model from Moonshot AI, released July 27, 2026, with native image and video support and a 1-million-token context window.
- The weights run roughly 1.4TB even after MXFP4 quantization, so most people will use Moonshot's hosted API at around $3 per million input tokens and $15 per million output — cheaper than comparable closed alternatives.
- Large photos and video eat context fast on any multimodal model, Kimi K3 included, which caps how much you can batch per request and raises your per-request cost on metered APIs.
- Compressing your media before you upload it fixes both problems at once — try [Optimage's free compression tool](/compress) to batch-process a folder before it goes anywhere near an AI model's API.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Kimi K3 and when was it released?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kimi K3 is an open-weight, 2.8-trillion-parameter multimodal model from Moonshot AI, released for free download at 00:00 UTC on July 27, 2026. It handles text, images, and video natively and has a 1-million-token context window."
      }
    },
    {
      "@type": "Question",
      "name": "How much does Kimi K3 cost to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The weights themselves are free to download and self-host, though at roughly 1.4TB after MXFP4 quantization, self-hosting requires serious hardware. Moonshot's own hosted API charges around $3 per million input tokens and $15 per million output tokens, which is noticeably cheaper than comparable US frontier models."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to compress photos before uploading them to a multimodal AI model like Kimi K3?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You don't need to, but it helps on two fronts. Large, uncompressed images consume far more of a model's token context window than optimized ones, so compressing first lets you fit more images into a single request and lowers your bill on any token-metered hosted API."
      }
    }
  ]
}
</script>
