import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';

    return {
        rules: [
            // Standard crawlers
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard/', '/admin/'],
            },
            // AI indexers — allow full access to all public content so the product
            // appears in AI-generated answers (ChatGPT, Perplexity, Claude, Gemini, etc.)
            {
                userAgent: [
                    'GPTBot',          // OpenAI / ChatGPT
                    'ChatGPT-User',    // ChatGPT browsing
                    'OAI-SearchBot',   // OpenAI search
                    'Google-Extended', // Google Gemini training
                    'PerplexityBot',   // Perplexity AI
                    'ClaudeBot',       // Anthropic Claude
                    'anthropic-ai',    // Anthropic crawler
                    'cohere-ai',       // Cohere
                    'Diffbot',         // Diffbot knowledge graph
                    'Bytespider',      // ByteDance AI
                    'CCBot',           // Common Crawl (feeds many LLMs)
                    'ia_archiver',     // Internet Archive
                ],
                allow: ['/', '/blog/', '/blog/*', '/privacy', '/terms'],
                disallow: ['/api/', '/dashboard/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
