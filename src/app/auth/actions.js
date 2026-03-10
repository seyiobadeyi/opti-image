'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function sendOtp(formData) {
    const supabase = await createClient()
    const data = Object.fromEntries(formData.entries())

    const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
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

export async function verifyOtp(formData) {
    const supabase = await createClient()
    const data = Object.fromEntries(formData.entries())

    const { error } = await supabase.auth.verifyOtp({
        email: data.email,
        token: data.token,
        type: 'email'
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function logout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
