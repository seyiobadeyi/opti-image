---
title: "The EU AI Act Is Live: What Website Owners Must Know About AI Images"
description: "The EU AI Act began enforcement in February 2025, and by early 2026 its requirements around AI-generated images, metadata, and content labelling are directly affecting websites that serve European users. Here is a practical guide."
date: "2026-02-12"
author: "Optimage Team"
tags: ["EU AI Act", "AI images", "compliance", "GDPR", "web regulation"]
category: "Legal & Compliance"
featured: true
excerpt: "The EU AI Act's Article 50 requires visible disclosure and C2PA metadata preservation for AI-generated images on websites accessible to EU users. Here is a practical compliance guide for website owners."
variants:
  - excerpt: "If your website uses AI-generated images and is accessible in Europe, the EU AI Act requires visible disclosure labels and C2PA metadata preservation — regardless of where your business is based."
    keyTakeaways:
      - "Article 50 of the EU AI Act requires deployers to label AI-generated images as such in a clear, perceivable way"
      - "Disclosure only in a privacy policy does not satisfy the requirement — visible labelling per image or per page is needed"
      - "Many compression tools strip C2PA metadata by default, which may put websites out of compliance"
      - "The Act applies to any site that actively markets to or serves EU residents, not just EU-based businesses"
  - excerpt: "C2PA metadata embedded by Midjourney, Adobe Firefly, and DALL-E must be preserved through your image compression workflow — stripping it may violate EU AI Act requirements."
    keyTakeaways:
      - "Adobe Firefly, Midjourney, and DALL-E all embed C2PA provenance metadata in AI-generated images as of 2025"
      - "Common image processing tools strip metadata by default; configure them to preserve XMP and C2PA blocks"
      - "SMEs are not exempt from Article 50 transparency obligations even under lighter general compliance rules"
      - "Heightened disclosure requirements apply to AI images that realistically depict real people or real events"
  - excerpt: "EU AI Act compliance for website owners is achievable without abandoning AI-generated imagery — it primarily requires visible labels, metadata preservation, and a documented six-step workflow."
    keyTakeaways:
      - "A six-step compliance checklist covers audit, visible disclosure, workflow update, policy addition, real-person review, and documentation"
      - "C2PA metadata can now be embedded in JPEG, PNG, WebP, AVIF, and HEIC files as of 2025–2026 specification updates"
      - "Page-level or section-level AI disclosure notices are accepted where per-image labelling is not feasible"
      - "The EU AI Act works alongside GDPR and does not replace existing data protection obligations"
---

The European Union Artificial Intelligence Act, which entered into force in August 2024, is not just a framework for AI system developers. Its provisions around AI-generated content, synthetic media disclosure, and metadata requirements affect any website that uses AI-generated images and that is accessible to users in the European Union.

<div role="presentation" style="margin:32px 0">
<svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;margin:0 auto;display:block">
  <style>.sn{font:700 32px/1 system-ui,sans-serif;fill:#db5a42}.sl{font:500 13px/1 system-ui,sans-serif;fill:#374151}.sb{animation:fu .6s ease-out both}.sb:nth-child(2){animation-delay:.15s}.sb:nth-child(3){animation-delay:.3s}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>
  <g class="sb"><rect x="30" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="110" y="58" text-anchor="middle" class="sn">Aug 2024</text><text x="110" y="78" text-anchor="middle" class="sl">EU AI Act in force</text></g>
  <g class="sb"><rect x="270" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="350" y="58" text-anchor="middle" class="sn">Art. 50</text><text x="350" y="78" text-anchor="middle" class="sl">Disclosure obligation</text></g>
  <g class="sb"><rect x="510" y="20" width="160" height="70" rx="12" fill="#fdf3f1"/><text x="590" y="58" text-anchor="middle" class="sn">C2PA</text><text x="590" y="78" text-anchor="middle" class="sl">Metadata standard</text></g>
</svg>
</div>

By early 2026, the enforcement mechanisms for the portions of the Act that cover AI-generated content are operational. The European AI Office, established within the European Commission, has published guidance for content providers, and several national data protection authorities have begun incorporating AI Act compliance into their audit frameworks alongside GDPR.

If you operate a website that is accessible in Europe, uses AI-generated images (from Midjourney, DALL-E, Adobe Firefly, Stable Diffusion, or any other generative AI system), and has users in EU member states, you need to understand what the Act requires of you, practically, today.

## Table of Contents
- [What the EU AI Act Actually Says About Images](#what-it-says)
- [Who Is Covered: The Geographic and Business Scope](#scope)
- [The Disclosure Requirement for AI-Generated Images](#disclosure)
- [Metadata and Technical Requirements](#metadata)
- [Deepfakes and Realistic Synthetic Media](#deepfakes)
- [What Platform and Tool Providers Must Do](#platforms)
- [Practical Compliance Steps for Website Owners](#compliance-steps)
- [The Interaction With GDPR](#gdpr-interaction)
- [Common Misconceptions](#misconceptions)

## What the EU AI Act Actually Says About Images {#what-it-says}

The EU AI Act takes a risk-based approach to AI regulation, categorising AI applications by their potential for harm. AI-generated images fall primarily under Article 50, which addresses "transparency obligations for certain AI systems."

Article 50 requires that:

**Providers of AI systems that generate synthetic content** (including images, audio, and video) must ensure that the outputs of those systems are marked in a machine-readable format that allows for their identification as artificially generated or manipulated.

**Deployers of AI systems** that generate synthetic media must label the content as AI-generated in a manner that is clear and visible to end users.

The key distinction is between "providers" (companies that build and make available AI generation tools, like Midjourney or Adobe) and "deployers" (companies and individuals who use those tools to generate content and publish it). Website owners who use AI-generated images are deployers under the Act.

For deployers, the practical obligations are:
1. Label AI-generated images as such in a way that is perceivable by users
2. Not remove or obscure technical markers (metadata) that AI tool providers embed in generated images
3. For synthetic media that depicts real people or real events in a realistic manner, provide prominent disclosure

## Who Is Covered: The Geographic and Business Scope {#scope}

The EU AI Act follows the same geographic scope principle as the GDPR: it applies whenever a European user is the intended audience, regardless of where the website operator is located. A website based in the United States that actively markets to and serves EU residents is within scope.

The key question is whether your website is "directed to" EU users. Indicators include:
- Pricing in euros or other EU currencies
- Shipping to EU addresses (for e-commerce)
- EU-specific language versions or content
- Active advertising to EU users through platforms like Meta Ads or Google Ads

For most websites with a global audience that include EU users, the safest assumption is that the Act applies to your AI-generated content.

There are also size-based thresholds: SMEs (small and medium enterprises, defined as companies with fewer than 250 employees and under EUR 50 million in annual turnover) face somewhat lighter compliance requirements in some areas of the Act. However, the transparency obligations under Article 50 for AI-generated content do not have SME exemptions. The disclosure and labelling requirements apply regardless of business size.

## The Disclosure Requirement for AI-Generated Images {#disclosure}

The disclosure requirement is the most practically impactful part of the Act for website owners using AI images. The Act requires that AI-generated images be disclosed as such to end users, but it does not mandate a specific format for the disclosure. The requirement is that the disclosure be "clear and perceivable."

In practice, compliant approaches include:

**Image-level disclosure.** A visible label on or adjacent to each AI-generated image. This could be a small badge (for example, "AI Generated" or the universal AI disclosure icon) overlaid on the image, or a caption directly beneath the image.

**Page-level disclosure.** A statement on the page (typically at the top, in the article header, or in an image caption section) noting that images on the page were generated using AI. This is more practical for pages where multiple images are AI-generated, such as an AI art gallery or a blog post that uses AI images throughout.

**Section-level disclosure.** If your website has specific sections that consistently use AI-generated imagery (for example, an "AI Illustrations" category), a persistent disclosure in the section header or sidebar can satisfy the requirement for that section.

What does not appear to satisfy the requirement:
- Disclosure only in a privacy policy or terms of service (not "perceivable" during normal content consumption)
- Technical metadata alone (the Act requires perceivable disclosure for end users, not just machine-readable marking)
- Disclosure that is present but visually hidden or very small

The recommended implementation for most websites is a combination: image-level labels for individual images where practical, and page-level statements for pages where labelling each image individually is not feasible.

## Metadata and Technical Requirements {#metadata}

Beyond the visible disclosure requirement, the Act places obligations on providers (the tool makers) to embed machine-readable metadata in AI-generated content. This metadata uses standards like the Content Authenticity Initiative (CAI) and C2PA (Coalition for Content Provenance and Authenticity) specifications.

Midjourney, Adobe, and several other major AI image tools already embed C2PA metadata in their outputs. This metadata records:
- That the image was generated by an AI system
- Which AI system was used (the tool name and version)
- The timestamp of generation
- In some implementations, a hash of the content for verification

As a website owner (deployer), the EU AI Act's requirements in this area are primarily prohibitive rather than prescriptive: you must not remove or obscure this metadata. Many common image processing operations, including JPEG compression, PNG re-export, and batch processing tools, strip metadata by default. If your image workflow strips C2PA metadata from AI-generated images, you may be non-compliant.

**Practical guidance:** If you are using AI-generated images that contain C2PA metadata (check using a tool like Adobe's Content Authenticity verification website or Truepic's verification tool), your image compression and processing workflow must preserve that metadata. When using compression tools, look for the option to preserve all metadata, rather than the default "strip metadata" mode that many tools use to reduce file size.

This creates a tension with web performance best practices, which typically recommend stripping image metadata to reduce file sizes. For AI-generated images subject to EU AI Act requirements, you need to balance these concerns. One approach: strip EXIF and GPS metadata (which is primarily a privacy concern and not relevant to AI provenance), while specifically preserving XMP metadata blocks that contain C2PA content credentials.

## Deepfakes and Realistic Synthetic Media {#deepfakes}

Article 50(4) creates heightened requirements for synthetic media that depicts real people or real events in a realistic manner. This includes:
- AI-generated images that realistically depict a real named person
- AI-generated images that depict real events in a realistic style
- AI-manipulated images (deepfakes) where a real person's appearance has been altered

For these categories, the disclosure requirement is elevated from "clear and perceivable" to "prominent." The Act specifically calls out satire, parody, and artistic expression as contexts where the requirements may be applied with greater flexibility, but the standard for exemption is that the satirical or artistic nature must be "obvious from context."

For website owners:
- AI images that depict real public figures (politicians, celebrities, executives) require prominent AI disclosure regardless of whether the image is realistic or stylised
- AI-manipulated photographs of real people (for example, a product advertisement where a real person has been digitally altered) require prominent disclosure even if the manipulation is subtle
- Entirely fictional AI-generated people do not trigger this heightened requirement (unless the generated person could be reasonably mistaken for a specific real individual)

If your website uses AI imagery involving real people in any context (editorial illustration, advertising, product imagery), review those uses against this provision specifically.

## What Platform and Tool Providers Must Do {#platforms}

The obligations on providers (the AI tool companies themselves) affect what you receive when you use their tools. Understanding these obligations helps you understand what you can rely on and what you must supplement.

Major AI image tool providers are required under the Act to:
- Embed machine-readable provenance markers in generated content (C2PA metadata)
- Provide documentation to deployers (their users) about the AI systems' capabilities and limitations
- Register high-risk AI systems with the EU AI database

Adobe Firefly, for example, already embeds Content Credentials (C2PA metadata) in all generated images, reflecting Adobe's early adoption of the CAI standard. Midjourney added C2PA metadata embedding in 2025. DALL-E through the OpenAI API includes C2PA support as of late 2025.

However, you cannot rely entirely on provider-level compliance. The deployer obligations (visible disclosure, metadata preservation) are separate from and in addition to what providers do.

## Practical Compliance Steps for Website Owners {#compliance-steps}

<figure role="img" aria-label="Six-step EU AI Act compliance workflow for website owners" style="margin:32px 0">
<svg viewBox="0 0 660 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;display:block">
  <style>.px{animation:pi .5s ease-out both}.px:nth-child(1){animation-delay:0s}.px:nth-child(2){animation-delay:.2s}.px:nth-child(3){animation-delay:.4s}@keyframes pi{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}.pn{font:700 13px system-ui,sans-serif;fill:#db5a42}.pt{font:500 11px system-ui,sans-serif;fill:#374151}</style>
  <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L0,6L8,3z" fill="#d1d5db"/></marker></defs>
  <g class="px"><rect x="10" y="15" width="175" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="97" y="46" text-anchor="middle" class="pn">① Audit</text><text x="97" y="66" text-anchor="middle" class="pt">Identify all AI images</text></g>
  <line x1="188" y1="50" x2="238" y2="50" stroke="#d1d5db" stroke-width="2" marker-end="url(#ar)"/>
  <g class="px"><rect x="243" y="15" width="175" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="330" y="46" text-anchor="middle" class="pn">② Label</text><text x="330" y="66" text-anchor="middle" class="pt">Add visible AI disclosure</text></g>
  <line x1="421" y1="50" x2="471" y2="50" stroke="#d1d5db" stroke-width="2" marker-end="url(#ar)"/>
  <g class="px"><rect x="476" y="15" width="175" height="70" rx="12" fill="#fdf3f1" stroke="#f9c5b8" stroke-width="1.5"/><text x="563" y="46" text-anchor="middle" class="pn">③ Preserve</text><text x="563" y="66" text-anchor="middle" class="pt">Keep C2PA metadata</text></g>
</svg>
</figure>

Here is a practical action list for website owners using AI-generated images:

**Step 1: Audit your AI image usage.**
Identify every page, section, or feature on your website that uses AI-generated images. Include AI images in blog posts, product pages, landing pages, social media images that link back to your site, and email newsletters accessible via web links.

**Step 2: Implement visible disclosure.**
Choose your disclosure approach: image-level labels, page-level statements, or section-level notices. Implement consistently across all AI-generated image usage. The label language should be direct: "This image was generated using AI" or similar.

**Step 3: Update your image processing workflow.**
If your image compression or processing tools strip metadata by default, configure them to preserve XMP and C2PA metadata blocks. Test the output of your workflow using an online C2PA verification tool to confirm that metadata is preserved through the compression process.

**Step 4: Add a privacy policy section.**
Add a section to your privacy policy or terms of service describing your use of AI-generated content and your compliance measures. While this alone does not satisfy the disclosure requirement, it is part of a comprehensive compliance posture.

**Step 5: Establish a review process for real-person imagery.**
If your website ever uses AI imagery involving real people, establish an internal review step to confirm that prominent disclosure is applied before publication.

**Step 6: Document your compliance measures.**
Maintain a record of when you audited your AI image usage, what disclosure mechanisms you implemented, and which AI tools you use. In the event of a regulatory inquiry, documentation of a good-faith compliance effort matters.

## The Interaction With GDPR {#gdpr-interaction}

The EU AI Act works alongside and does not replace GDPR. Several areas of overlap are relevant for website owners:

**Biometric data in AI images.** If AI-generated images depict realistic faces (even of fictional people), and you are collecting or processing any data about users who view those images, consider whether the images interact with any GDPR-regulated data processing. For example, if you use any face detection or emotion analysis on user reactions to content, those systems processing AI-generated facial imagery may have GDPR implications.

**Training data and consent.** If your website generates AI images "on demand" in response to user inputs (for example, an AI avatar generator or a product visualisation tool), the processing of user inputs to generate those images involves personal data and requires a GDPR legal basis.

**Data retention for generated images.** If you store generated images associated with user accounts, standard GDPR data retention and deletion requirements apply.

## Common Misconceptions {#misconceptions}

**"If I use AI images for illustration only, not to deceive, I am exempt."**
The EU AI Act does not have an intent requirement for basic disclosure obligations. All AI-generated images require disclosure, regardless of whether you intend them to be understood as illustrations or realistic images.

**"The tool provider handles compliance, not me."**
Providers handle their own obligations (embedding metadata, registering systems). Deployers handle their own obligations (visible disclosure, metadata preservation). Both are required; they are not substitutes for each other.

**"AVIF and WebP files cannot preserve C2PA metadata."**
This was true in earlier implementations but has been addressed in 2025-2026 updates to the C2PA specification and in major image tools. C2PA metadata can be embedded in JPEG, PNG, WebP, AVIF, and HEIC files. Your compression tool must support C2PA metadata preservation, which is a feature, not a universal default.

**"My site is too small to matter."**
Regulatory bodies prioritise high-profile cases initially, but the obligations apply regardless of site size. The EU AI Act does not have a "no enforcement for small sites" provision for the transparency obligations.

The EU AI Act represents a significant shift in the regulatory environment for anyone publishing AI-generated content, and the image-specific requirements are among the most operationally impactful. The good news is that compliance is achievable without abandoning AI-generated imagery: it primarily requires disclosure, metadata preservation, and documented process. The infrastructure for this (C2PA metadata standards, disclosure UI patterns) is mature and supported by the major tool providers. The main work is in your own workflow and website implementation.

*Optimage supports metadata-preserving compression for AI-generated images, including C2PA provenance data. [Learn more.](/)*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does the EU AI Act apply to my website if I am based outside the EU?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. The EU AI Act follows the same geographic scope as GDPR: it applies whenever a European user is the intended audience, regardless of where the website operator is located. If your website actively markets to or serves EU residents, the AI content provisions apply to you." }
    },
    {
      "@type": "Question",
      "name": "What counts as sufficient disclosure for AI-generated images under Article 50?",
      "acceptedAnswer": { "@type": "Answer", "text": "Disclosure must be clear and perceivable to end users. Acceptable approaches include image-level labels, page-level statements at the top of the page, or section-level notices for areas that consistently use AI imagery. Disclosure only in a privacy policy or terms of service does not satisfy the requirement." }
    },
    {
      "@type": "Question",
      "name": "Will compressing AI-generated images strip the C2PA metadata required by the EU AI Act?",
      "acceptedAnswer": { "@type": "Answer", "text": "Many image compression tools strip all metadata by default, including C2PA provenance data. You need to configure your compression workflow to specifically preserve XMP and C2PA metadata blocks. Test the output using an online C2PA verification tool to confirm metadata is retained after compression." }
    },
    {
      "@type": "Question",
      "name": "Are small businesses or SMEs exempt from EU AI Act image disclosure requirements?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. The transparency obligations under Article 50 for AI-generated content do not include SME exemptions. The disclosure and labelling requirements apply regardless of business size. SMEs have lighter requirements in some other areas of the Act, but not for AI content disclosure." }
    }
  ]
}
</script>
