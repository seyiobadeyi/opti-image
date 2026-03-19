'use server';

import { createClient } from '@/utils/supabase/server';
import type { NewsletterResult } from '@/types';

export async function subscribeNewsletter(email: string): Promise<NewsletterResult> {
    if (!email || typeof email !== 'string') {
        return { error: 'Invalid email format' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Basic sanitization/validation to prevent injection and bad data
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
        return { error: 'Please enter a valid email address.' };
    }

    const API_BASE: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    // Prefer the server API (bypasses Supabase RLS using service role on the server).
    try {
        const response = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail }),
        });

        const data: unknown = await response.json().catch(() => null);

        if (!response.ok) {
            const message = (typeof data === 'object' && data && 'message' in data && typeof (data as { message?: unknown }).message === 'string')
                ? (data as { message: string }).message
                : 'An error occurred while subscribing. Please try again later.';
            return { error: message };
        }

        if (typeof data === 'object' && data) {
            const alreadySubscribed = 'alreadySubscribed' in data ? Boolean((data as { alreadySubscribed?: unknown }).alreadySubscribed) : false;
            const message = 'message' in data && typeof (data as { message?: unknown }).message === 'string'
                ? (data as { message: string }).message
                : 'Successfully subscribed to the newsletter!';
            return { success: true, alreadySubscribed, message };
        }

        return { success: true, message: 'Successfully subscribed to the newsletter!' };
    } catch (err: unknown) {
        console.error('Newsletter API error:', err);
    }

    // Fallback: attempt direct Supabase insert (may fail if RLS blocks anonymous inserts).
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email: cleanEmail }]);

        if (error) {
            if (error.code === '23505') {
                return { success: true, alreadySubscribed: true, message: 'Already subscribed' };
            }
            console.error('Newsletter subscription fallback error:', error);
            return { error: 'An error occurred while subscribing. Please try again later.' };
        }

        return { success: true, message: 'Successfully subscribed to the newsletter!' };
    } catch (err: unknown) {
        console.error('Unexpected error during subscription fallback:', err);
        return { error: 'An unexpected error occurred.' };
    }
}
