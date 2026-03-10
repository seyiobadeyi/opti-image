'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const QA_DATA = [
    {
        question: "What does Optimage do?",
        answer: "Optimage uses smart, mathematically lossless compression techniques to reduce the file size of your AVIF, WebP, JPEG and PNG files. By optimizing the data within the image container, fewer bytes are required to store the data. The effect is nearly invisible to the human eye, but it makes a massive difference in file size, saving bandwidth and storage."
    },
    {
        question: "Why should I compress my images for my website?",
        answer: "Optimizing your images brings several crucial benefits to your website. It reduces file sizes by up to 80% without sacrificing quality, leading to faster page loads. This optimization is essential for keeping user attention and passing strict Core Web Vitals checks. Efficiently compressed images contribute significantly to your website's search engine ranking (SEO) and minimize bandwidth costs."
    },
    {
        question: "What file formats does Optimage support?",
        answer: "Currently, Optimage supports modern formats like AVIF and WebP, alongside traditional formats such as JPG, PNG, TIFF, GIF, SVG, and BMP. We continuously expand our support to empower creators with the best tools available."
    },
    {
        question: "Does Optimage support WebP and AVIF?",
        answer: "Yes, fully. Our compression engine achieves optimal results when working with WebP and AVIF files. These next-generation formats excel at achieving reduced file sizes while maintaining optimal image quality, outperforming legacy formats to ensure swift page load times."
    },
    {
        question: "Is the privacy of my images ensured?",
        answer: "Absolutely. We operate a strict Zero Retention Policy. Your data is yours. The moment your files are converted and downloaded, our edge servers meticulously purge them from temporary storage. We do not use your images for model training or silent hoarding."
    },
    {
        question: "How does Optimage optimize images without losing quality?",
        answer: "Our pipeline employs smart analysis routing to determine the best optimization thresholds tailored to each individual image's unique content. Rather than applying a one-size-fits-all strict compression, we analyze the gradients, textures, and text to ensure the compression is completely imperceptible."
    },
    {
        question: "Can I compress my images for free?",
        answer: "Yes! You can use the drag-and-drop optimizer directly on this page for free. You have the flexibility to batch upload up to 50 images at once, locally executing transformations rapidly via our Edge infrastructure."
    }
];

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section style={{ maxWidth: '800px', margin: '80px auto', padding: '0 24px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {QA_DATA.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div key={index} style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease'
                        }}>
                            <button
                                onClick={() => toggleAccordion(index)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '24px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <span>{item.question}</span>
                                <div style={{
                                    background: isOpen ? 'var(--primary)' : 'var(--bg-tertiary)',
                                    color: isOpen ? '#fff' : 'var(--text-secondary)',
                                    borderRadius: '50%',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </button>

                            <div style={{
                                maxHeight: isOpen ? '500px' : '0',
                                opacity: isOpen ? 1 : 0,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease-in-out',
                                padding: isOpen ? '0 24px 24px 24px' : '0 24px',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.6,
                                fontSize: '1.05rem'
                            }}>
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
