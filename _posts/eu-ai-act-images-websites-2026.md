---
title: "The EU AI Act Is Live: What Website Owners Must Know About AI Images"
description: "The EU AI Act began enforcement in February 2025, and by early 2026 its requirements around AI-generated images, metadata, and content labelling are directly affecting websites that serve European users. Here is a practical guide."
date: "2026-02-12"
author: "Optimage Team"
tags: ["EU AI Act", "AI images", "compliance", "GDPR", "web regulation"]
category: "Legal & Compliance"
featured: true
---

The European Union Artificial Intelligence Act, which entered into force in August 2024, is not just a framework for AI system developers. Its provisions around AI-generated content, synthetic media disclosure, and metadata requirements affect any website that uses AI-generated images and that is accessible to users in the European Union.

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
