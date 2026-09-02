---
title: "The EU Just Called ChatGPT a Search Engine. That Reclassification Changes How Your Images Get Found."
date: "2026-09-02T12:00:00Z"
excerpt: "On August 31, the European Commission designated ChatGPT a 'Very Large Online Search Engine' under the Digital Services Act, the first time an AI chatbot has been classified this way. The trigger was its live web-search function — which is exactly the feature that decides whether your images and product photos get surfaced in an AI answer at all."
keyTakeaways:
  - "The EU designated ChatGPT a Very Large Online Search Engine (VLOSE) under the DSA on August 31, 2026 — the first AI chatbot to get this classification"
  - "The designation triggered specifically because of ChatGPT's live web-search function, after it crossed 159.1 million monthly EU users against a 45 million threshold"
  - "Reddit and Roblox were designated Very Large Online Platforms in the same announcement"
  - "The classification gives regulators a capability-based template that can extend to Gemini, Claude, and Perplexity as their own search functions scale"
  - "For anyone optimizing content for AI visibility, this confirms that 'search engine' rules — crawlability, structured data, image alt text — now formally apply to AI chat products, not just classic search"
faq:
  - question: "Why did the EU classify ChatGPT as a search engine instead of an AI product?"
    answer: "The designation turned specifically on ChatGPT's live web-search function — its ability to retrieve and cite current information from the web — not on its underlying AI model or chatbot category. That capability-based approach is what let regulators apply the Digital Services Act's search engine rules directly, and it's designed to extend to any other AI assistant (Gemini, Claude, Perplexity) that adds or scales similar live-search capability."
  - question: "Does this affect how I should optimize product or blog images for AI visibility?"
    answer: "Yes, more directly than before. A formal 'search engine' classification means the retrieval mechanism behind ChatGPT's answers is now regulated the same way classic search engines are, which reinforces that the same fundamentals — crawlable pages, descriptive alt text, structured image data, fast-loading compressed images — determine whether your content gets pulled into an AI-generated answer at all. This isn't a new requirement so much as confirmation that the GEO fundamentals already worth doing were correctly targeted."
---

![A search results interface displayed on a laptop screen with multiple browser tabs open](/image-2.png)

**On August 31, the European Commission designated ChatGPT a "Very Large Online Search Engine" under the Digital Services Act — the first time any AI chatbot has been formally classified that way, and a reclassification that turned entirely on one specific feature: ChatGPT's live web-search function.** OpenAI reported ChatGPT had reached 159.1 million monthly active users in the EU, well past the 45 million threshold that triggers the bloc's highest tier of digital platform oversight. Reddit and Roblox were designated Very Large Online Platforms in the same announcement. The regulatory headline is about compliance deadlines and fines — the practical headline, for anyone whose business depends on being found through search, is that the mechanism deciding what shows up in a ChatGPT answer is now formally in the same regulatory bucket as Google.

## Why "Search Engine" and Not "AI Product"

The distinction matters more than it might look. Regulators didn't classify ChatGPT based on how smart its model is or how it's marketed — they classified it based on what its live web-search feature actually does: retrieve, rank, and surface information from the open web in response to a query, then cite it in an answer. That's functionally identical to what a search engine does, even though the presentation is conversational instead of a results page. It's a capability-based template deliberately built to extend beyond ChatGPT — regulators can apply the same reasoning to Gemini, Claude, or Perplexity the moment their own live-search features cross the same usage thresholds.

<div class="svg-stat-row" role="presentation" aria-label="EU ChatGPT designation facts">
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
    <text x="125" y="62" text-anchor="middle" class="stat-num">159.1M</text>
    <text x="125" y="82" text-anchor="middle" class="stat-lbl">Monthly EU users reported</text>
  </g>
  <g class="stat-bar">
    <rect x="255" y="20" width="190" height="70" rx="12" fill="#fdf3f1"/>
    <text x="350" y="62" text-anchor="middle" class="stat-num">45M</text>
    <text x="350" y="82" text-anchor="middle" class="stat-lbl">DSA threshold that triggered it</text>
  </g>
  <g class="stat-bar">
    <rect x="480" y="20" width="190" height="70" rx="12" fill="#fdf3f1"/>
    <text x="575" y="62" text-anchor="middle" class="stat-num">Dec 2026</text>
    <text x="575" y="82" text-anchor="middle" class="stat-lbl">Compliance deadline</text>
  </g>
</svg>
</div>

## What Changes for OpenAI, and What Doesn't for You

The obligations landing on OpenAI are the regulatory story: annual risk assessments, independent audits, algorithmic transparency requirements, and explanations to users about why specific content was surfaced or recommended — with fines up to 6% of global annual turnover for non-compliance, using X's €120 million DSA fine from December 2025 as the enforcement baseline. None of that is something a business publishing content needs to do anything about directly. What it confirms, though, is worth sitting with: the EU just formally stated, in a binding regulatory decision, that an AI chatbot's answer-retrieval mechanism functions as a search engine. That's not a marketing framing GEO consultants invented — it's now a regulator's legal position.

## Why This Confirms the GEO Fundamentals, Rather Than Changing Them

If ChatGPT's live search is functionally a search engine, then the things that determine whether classic search engines can find, understand, and trust your content are the same things that determine whether ChatGPT's search function can retrieve and cite it. That was already true in practice — AI answer engines have always depended on crawlable, well-structured content to generate accurate answers — but a regulatory designation removes any ambiguity about whether "optimize for AI search the way you'd optimize for Google" is a real strategy or a loosely-analogous one. It's the same discipline, applied to a system regulators now treat the same way.

For images specifically, that means the basics still carry the weight: descriptive alt text that actually describes what's in the image rather than stuffing keywords, structured data (schema markup) that tells a crawler what an image represents in context, and — less obviously but just as real — page load speed, because a slow-loading page with oversized images is a worse crawl target for any retrieval system, AI or classic search, than a fast one.

## What to Actually Check

1. **Confirm AI crawlers aren't blocked.** A misconfigured `robots.txt` that silently excludes GPTBot, OAI-SearchBot, or similar AI crawlers kills your visibility in exactly the retrieval system this designation just formalized, with no error message anywhere to alert you.
2. **Make sure images have real alt text**, not empty attributes or filename-based defaults — this is a fast, cheap fix with outsized impact on AI retrieval specifically.
3. **Keep image file sizes down.** Retrieval systems, like classic crawlers, favor pages that load fast and reliably over pages that time out or lag under oversized, uncompressed images.
4. **Revisit this quarterly, not once.** The same capability-based logic that pulled ChatGPT into VLOSE status will likely pull other AI assistants in as their search features scale — treat "is my content optimized for AI search retrieval" as an ongoing check, not a one-time project.

## Make Sure Your Images Aren't the Bottleneck

Whatever else changes in how AI search gets regulated, the fundamentals stay the same: [compress](/compress) your images so pages load fast for both crawlers and readers, and [convert](/convert) to WebP or AVIF so you're not leaving retrieval performance on the table over an outdated file format.

**Related reading:**
- [Google's Gemini Push Into Search: What It Means for Product Photos](/blog/google-gemini-3-5-search-image-seo-ai-overview-guide) — the same AI-search visibility question from Google's side
- [Meta's New Glimmer Model: What That Means for Editing Photos](/blog/meta-glimmer-open-ai-model-local-photo-editing-guide) — another recent AI development with a direct image-workflow angle
- [OpenAI DALL-E and GPT Image Retirement: Download Your Images Guide](/blog/openai-dalle-gpt-retirement-download-images-guide) — what happens when a cloud AI product you depend on changes under you
