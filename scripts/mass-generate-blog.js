const fs = require('fs');
const path = require('path');
const https = require('https');

// =========================================================================
// Mass Blog Generator for OptiImage SEO Hub
// =========================================================================
// This script utilizes the OpenAI API to programmatically generate highly structured,
// 3000-word Markdown articles for your /blog/[slug] route.
// 
// Usage: 
// 1. Set your OpenAI API key in your terminal/environment:
//    export OPENAI_API_KEY="sk-proj-xxxxxxxx"
// 2. Run: node scripts/mass-generate-blog.js
// 
// The script will loop through the TOPICS array and write SEO-perfect .md files 
// into the ../_posts directory.
// =========================================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("❌ ERROR: OPENAI_API_KEY environment variable is missing.");
    console.error("Please run: export OPENAI_API_KEY='your_api_key_here' before executing.");
    process.exit(1);
}

const POSTS_DIR = path.join(__dirname, '..', '_posts');

// Example array to generate 45 additional articles.
// To run the massive generation, modify or add 45 unique subjects here.
const TOPICS = [
    { title: "The Hidden Mathematics of AVIF vs WebP vs JPEG XL", slug: "hidden-math-avif-webp-jpegxl" },
    { title: "How High-Traffic Next.js Sites Handle Massive Media Pipelines", slug: "nextjs-massive-media-pipelines" },
    { title: "Building a Serverless Image Optimization Architecture", slug: "serverless-image-optimization-architecture" },
    { title: "A Deep Dive into NestJS CPU Worker Threads for Media Manipulation", slug: "nestjs-cpu-workers-media" },
    { title: "Understanding React Server Components and their Impact on LCP", slug: "react-server-components-lcp" }
    // ... add 40 more topics here to reach the 45 article goal ...
];

async function generateArticle(topic) {
    const prompt = `
Write an incredibly detailed, highly technical, 3000-word engineering blog post titled "${topic.title}".
Format the entire response in Markdown.
It must include:
- A YAML frontmatter block at the very top containing exactly: title: "${topic.title}", date: "${new Date().toISOString().split('T')[0]}", and excerpt: "A 2-sentence summary of the article."
- At least 5 major H2 headings.
- H3 and H4 subheadings.
- Code blocks (JavaScript, TypeScript, or Python) demonstrating concepts.
- A YouTube iframe embed placeholder (use any standard generic placeholder or relevant youtube link).
- Extremely technical engineering insights about web performance, codecs, architecture, or related optimization tech without sounding like a generic AI.
Do NOT output anything before or after the markdown text (no introductory conversational text). Just the raw markdown file content start to finish.
`;

    const data = JSON.stringify({
        model: "gpt-4o", // using robust 4o model for high token counts
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4000 // Instructing the model to utilize a massive window
    });

    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const json = JSON.parse(responseBody);
                        resolve(json.choices[0].message.content);
                    } catch (e) {
                        reject(new Error("Failed to parse OpenAI JSON response."));
                    }
                } else {
                    reject(new Error(`OpenAI API Error: ${res.statusCode} ${responseBody}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function main() {
    console.log("🚀 Initializing Mass Blog Generation Engine...");

    if (!fs.existsSync(POSTS_DIR)) {
        fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    for (const topic of TOPICS) {
        const filePath = path.join(POSTS_DIR, `${topic.slug}.md`);

        if (fs.existsSync(filePath)) {
            console.log(`⏩ Skipping ${topic.slug} - file already exists.`);
            continue;
        }

        console.log(`\n========================================`);
        console.log(`✍️  Generating 3000-word article for: ${topic.title}`);
        console.log(`========================================`);

        try {
            const markdownContent = await generateArticle(topic);
            fs.writeFileSync(filePath, markdownContent, 'utf8');
            console.log(`✅ Successfully wrote ${filePath}`);

            // Wait 2 seconds to avoid aggressive API rate limits
            console.log("Waiting 2s before next request...");
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.error(`❌ Failed to generate article ${topic.slug}:`, error.message);
        }
    }

    console.log("\n🎉 Mass generation complete! You can view your articles at /blog.");
}

main();
