'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import type { ServerActionResult } from '@/types'

export async function sendOtp(formData: FormData): Promise<ServerActionResult> {
    const supabase = await createClient()
    const email = formData.get('email') as string | null
    if (!email) return { error: 'Email is required' }

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // Automatically creates an account if the user doesn't exist
            shouldCreateUser: true,
        }
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function verifyOtp(formData: FormData): Promise<ServerActionResult> {
    const supabase = await createClient()
    const email = formData.get('email') as string | null
    const token = formData.get('token') as string | null
    if (!email || !token) return { error: 'Email and token are required' }

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function logout(): Promise<ServerActionResult> {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
