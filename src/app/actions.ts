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

    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('subscribers')
            .insert([{ email: cleanEmail }]);

        if (error) {
            // Postgres unique constraint error code
            if (error.code === '23505') {
                return { success: true, alreadySubscribed: true, message: 'This email is already subscribed!' };
            }
            console.error('Newsletter subscription error:', error);
            return { error: 'An error occurred while subscribing. Please try again later.' };
        }

        return { success: true, message: 'Successfully subscribed to the newsletter!' };
    } catch (err: unknown) {
        console.error('Unexpected error during subscription:', err);
        return { error: 'An unexpected error occurred.' };
    }
}
