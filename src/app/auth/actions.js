'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
    const supabase = await createClient()

    const data = Object.fromEntries(formData.entries())

    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function signup(formData) {
    const supabase = await createClient()

    const data = Object.fromEntries(formData.entries())

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true, message: 'Check your email for the confirmation link.' }
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

export async function resetPassword(formData) {
    const supabase = await createClient()

    const data = Object.fromEntries(formData.entries())

    const { error } = await supabase.auth.resetPasswordForEmail(data.email)

    if (error) {
        return { error: error.message }
    }

    return { success: true, message: 'Password reset link sent to your email.' }
}
